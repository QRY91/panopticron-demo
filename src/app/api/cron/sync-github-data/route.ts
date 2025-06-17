import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ISupabaseProject, IProjectStatusSnapshot } from '@interfaces/supabase';
import { WorkerLogger } from '@utils/workerLogger';
import { GitHubApiService } from '@services/githubApiService';
import { parseGitHubRepoUrl } from '@utils/urlUtils';
import { authenticateCronRequest } from '@utils/cronAuth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

function getSupabaseAdmin(): SupabaseClient | null {
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
        return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    }
    console.error("CRON_UTIL (GitHub Sync): Supabase URL or Service Key is missing.");
    return null;
}

// --- Core Worker Business Logic (performGitHubSync) remains the same ---
interface SyncGitHubResult {
  projectsProcessed: number;
  updatedInDbCount: number;
  snapshotCount: number;
  errorCount: number;
  summaryMessage: string;
}

async function performGitHubSync(
  supabaseAdmin: SupabaseClient,
  githubService: GitHubApiService
): Promise<SyncGitHubResult> {
  console.log("CORE_LOGIC (GitHub Sync): Starting GitHub data sync execution...");
  const { data: projectsToSync, error: fetchProjectsError } = await supabaseAdmin
      .from('projects')
      .select('id, name, github_repo_url, github_default_branch')
      .not('github_repo_url', 'is', null)
      .neq('github_repo_url', '');

  if (fetchProjectsError) {
      console.error("CORE_LOGIC (GitHub Sync): Error fetching projects from Supabase:", fetchProjectsError);
      throw fetchProjectsError;
  }

  if (!projectsToSync || projectsToSync.length === 0) {
      const msg = "No projects found with GitHub URLs to sync.";
      console.log(`CORE_LOGIC (GitHub Sync): ${msg}`);
      return { projectsProcessed: 0, updatedInDbCount: 0, snapshotCount: 0, errorCount: 0, summaryMessage: msg };
  }

  let updatedInDbCount = 0;
  let snapshotCount = 0;
  let errorCount = 0;
  const nowISO = new Date().toISOString();

  for (const project of projectsToSync) {
      if (!project.github_repo_url) continue;

      const repoInfo = parseGitHubRepoUrl(project.github_repo_url);
      if (!repoInfo) {
          console.warn(`CORE_LOGIC (GitHub Sync): Could not parse owner/repo from URL: ${project.github_repo_url} for project ${project.name}`);
          errorCount++;
          continue;
      }
      const { owner, repo } = repoInfo;

      try {
          let defaultBranch = project.github_default_branch;
          if (!defaultBranch) {
              const repoDetails = await githubService.getRepoDetails(owner, repo);
              if (repoDetails?.default_branch) {
                  defaultBranch = repoDetails.default_branch;
                  // Update project with default branch
                  const { error: branchUpdateError } = await supabaseAdmin
                    .from('projects')
                    .update({ github_default_branch: defaultBranch, updated_at: nowISO }) // also update updated_at
                    .eq('id', project.id);
                  if (branchUpdateError) console.error(`CORE_LOGIC (GitHub Sync): Error updating default branch for ${project.name}:`, branchUpdateError);
              } else {
                  console.warn(`CORE_LOGIC (GitHub Sync): Could not determine default branch for ${owner}/${repo}. Skipping CI check.`);
                  await supabaseAdmin.from('projects').update({ github_ci_status: 'unknown_branch', updated_at: nowISO, last_synced_at: nowISO }).eq('id', project.id);
                  errorCount++;
                  continue;
              }
          }

          const latestRun = await githubService.getLatestDefaultBranchRun(owner, repo, defaultBranch);
          
          let ciStatus: ISupabaseProject['github_ci_status'] = 'unknown_status';
          let ciUrl: string | undefined | null = project.github_repo_url ? `${project.github_repo_url}/actions` : null;

          if (latestRun) {
              ciStatus = latestRun.conclusion || latestRun.status; // conclusion is better if available (e.g., success, failure, cancelled)
              ciUrl = latestRun.html_url;
          } else {
              ciStatus = 'neutral_no_runs'; // Or 'unknown' if no runs implies an issue or unconfigured CI
              // console.log(`CORE_LOGIC (GitHub Sync): No CI runs found for ${owner}/${repo} on branch ${defaultBranch}. Setting status to ${ciStatus}.`);
          }

          const updatePayload: Partial<ISupabaseProject> = {
              github_default_branch: defaultBranch, // ensure it's updated if fetched
              github_ci_status: ciStatus,
              github_ci_url: ciUrl,
              updated_at: nowISO,
              last_synced_at: nowISO, 
          };

          const { error: updateError } = await supabaseAdmin.from('projects').update(updatePayload).eq('id', project.id);
          if (updateError) throw updateError;
          updatedInDbCount++;

          // Create snapshot
          if (latestRun) { // Only create snapshot if there was a run to snapshot
            const snapshotData: Omit<IProjectStatusSnapshot, 'id' | 'created_at'> = {
                project_id: project.id,
                source: `github-ci-${defaultBranch}`,
                status: ciStatus || 'unknown_status',
                details: { workflowName: latestRun.name, runNumber: latestRun.run_number, event: latestRun.event, actor: latestRun.actor?.login },
                commit_sha: latestRun.head_sha,
                run_id: latestRun.id.toString(),
                external_url: ciUrl,
            };
            const { error: snapshotError } = await supabaseAdmin.from('project_status_snapshots').insert(snapshotData);
            if (snapshotError) console.error(`CORE_LOGIC (GitHub Sync): Error inserting GitHub snapshot for ${project.name}:`, snapshotError);
            else snapshotCount++;
          }

      } catch (projectSyncError: any) {
          console.error(`CORE_LOGIC (GitHub Sync): Failed to sync GitHub data for project ${project.name} (ID: ${project.id}):`, projectSyncError.message);
          errorCount++;
      }
  }
  const summaryMessage = `Finished. Projects processed: ${projectsToSync.length}, Updated in DB: ${updatedInDbCount}, Snapshots created: ${snapshotCount}, Errors: ${errorCount}.`;
  console.log(`CORE_LOGIC (GitHub Sync): ${summaryMessage}`);
  return { projectsProcessed: projectsToSync.length, updatedInDbCount, snapshotCount, errorCount, summaryMessage };
}
// --- End Core Worker Business Logic ---


export async function GET(request: NextRequest) {
  // 1. Authorization using the utility
  const authResult = authenticateCronRequest(request, "GitHub Sync");
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.message || "Unauthorized" }, { status: 401 });
  }

  // 2. Initialize Dependencies
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server config error: Supabase admin client failed.' }, { status: 500 });
  }
  if (!GITHUB_API_TOKEN) {
      console.error("ROUTE_HANDLER (GitHub Sync): GITHUB_API_TOKEN is not set in env.");
      return NextResponse.json({ error: 'Server config error: GitHub token missing.' }, { status: 500 });
  }

  const workerName = 'sync-github-data';
  const logger = new WorkerLogger(supabaseAdmin, workerName);
  await logger.startRun();

  try {
      const githubService = new GitHubApiService(GITHUB_API_TOKEN);
      const result = await performGitHubSync(supabaseAdmin, githubService);
      
      let finalStatus: 'Success' | 'Partial Success' | 'No Action Needed' | 'Failure' = 'Success';
      if (result.errorCount > 0 && (result.updatedInDbCount > 0 || result.snapshotCount > 0) ) finalStatus = 'Partial Success';
      else if (result.errorCount > 0 && result.updatedInDbCount === 0 && result.snapshotCount === 0) finalStatus = 'Failure';
      else if (result.projectsProcessed === 0 && result.errorCount === 0) finalStatus = 'No Action Needed';
      else if (result.projectsProcessed > 0 && result.updatedInDbCount === 0 && result.snapshotCount === 0 && result.errorCount === 0) finalStatus = 'No Action Needed'; // All projects processed but no changes or new snapshots

      await logger.finishRun(finalStatus, result.summaryMessage);
      return NextResponse.json({ message: result.summaryMessage, ...result });

  } catch (error: any) {
      const criticalErrorMessage = `ROUTE_HANDLER (${workerName}): Critical error during main process.`;
      console.error(criticalErrorMessage, error.message, error.stack);
      await logger.finishRun('Failure', criticalErrorMessage, { message: error.message, stack: error.stack });
      return NextResponse.json({ error: criticalErrorMessage, details: error.message }, { status: 500 });
  }
}