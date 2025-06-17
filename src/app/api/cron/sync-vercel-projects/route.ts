// src/app/api/cron/sync-vercel-projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type {
  IVercelAPIProject,
  IVercelAPIDeployment,
} from "@interfaces/vercel";
import type {
  ISupabaseProject,
  IProjectStatusSnapshot,
} from "@interfaces/supabase";
import { WorkerLogger } from "@utils/workerLogger";
import { VercelApiService } from "@services/vercelApiService";
import { authenticateCronRequest } from '@utils/cronAuth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const CRON_SECRET_ENV = process.env.CRON_SECRET;

function getSupabaseAdmin(): SupabaseClient | null {
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  }
  console.error(
    "CRON_UTIL (Vercel Sync): Supabase URL or Service Key is missing."
  );
  return null;
}

async function fetchAllVercelProjects(
  service: VercelApiService
): Promise<IVercelAPIProject[]> {
  return service.getAllProjects();
}

async function getLatestProdDeployment(
  service: VercelApiService,
  vercelProjectId: string
): Promise<IVercelAPIDeployment | null> {
  return service.getLatestProdDeployment(vercelProjectId);
}

// --- Core Worker Business Logic ---
interface SyncVercelResult {
  upsertedCount: number;
  snapshotCount: number;
  errorCount: number;
  summaryMessage: string;
}

async function performVercelSync(
  supabaseAdmin: SupabaseClient,
  vercelService: VercelApiService
): Promise<SyncVercelResult> {
  console.log(
    "CORE_LOGIC (Vercel Sync): Starting Vercel projects sync execution..."
  );
  // Use the passed vercelService instance
  const vercelApiProjects = await fetchAllVercelProjects(vercelService);
  let upsertedCount = 0;
  let snapshotCount = 0;
  let errorCount = 0;
  const nowISO = new Date().toISOString();

  for (const vercelProject of vercelApiProjects) {
    try {
      const latestProdDeployment = await getLatestProdDeployment(
        vercelService,
        vercelProject.id
      );

      let githubRepoUrl: string | null = null;
      if (
        vercelProject.link?.type === "github" &&
        vercelProject.link.org &&
        vercelProject.link.repo
      ) {
        githubRepoUrl = `https://github.com/${vercelProject.link.org}/${vercelProject.link.repo}`;
      } else if (vercelProject.link) {
        //console.warn(`CORE_LOGIC (Vercel Sync): Project ${vercelProject.name} has Vercel link type '${vercelProject.link.type}', not 'github'. Link:`, vercelProject.link);
      }

      const commonUpdateData: Partial<ISupabaseProject> = {
        name: vercelProject.name,
        vercel_org_slug: vercelProject.accountId,
        vercel_framework: vercelProject.framework,
        vercel_node_version: vercelProject.nodeVersion,
        vercel_created_at: vercelProject.createdAt
          ? new Date(vercelProject.createdAt).toISOString()
          : null,
        latest_prod_deployment_status: latestProdDeployment?.readyState || null,
        latest_prod_deployment_url: latestProdDeployment?.url || null,
        // github_repo_url will be set based on logic below
        updated_at: nowISO,
        last_synced_at: nowISO,
      };

      const { data: existingProject, error: fetchError } = await supabaseAdmin
        .from("projects")
        .select("id, github_repo_url")
        .eq("vercel_project_id", vercelProject.id)
        .single();

      let supabaseProjectId: string;
      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      const updatePayload: Partial<ISupabaseProject> = { ...commonUpdateData };
      if (existingProject) {
        // Update
        if (githubRepoUrl === null && existingProject.github_repo_url) {
          delete updatePayload.github_repo_url;
        } else {
          // This covers if githubRepoUrl is new, different, or still null and existing was null
          updatePayload.github_repo_url = githubRepoUrl;
        }

        const { data, error } = await supabaseAdmin
          .from("projects")
          .update(updatePayload)
          .eq("vercel_project_id", vercelProject.id)
          .select("id")
          .single();
        if (error) throw error;
        if (!data) throw new Error("Update failed to return ID");
        supabaseProjectId = data.id;
      } else {
        // Insert
        updatePayload.vercel_project_id = vercelProject.id; // Must be included for insert
        updatePayload.github_repo_url = githubRepoUrl; // Set it for insert
        // Ensure all required fields for insert are present or have defaults in DB
        // For a new project, other fields like github_default_branch etc. will be null initially.
        const { data, error } = await supabaseAdmin
          .from("projects")
          .insert(
            updatePayload as ISupabaseProject /* Cast if sure all required fields are there or defaulted */
          )
          .select("id")
          .single();
        if (error) throw error;
        if (!data) throw new Error("Insert failed to return ID");
        supabaseProjectId = data.id;
      }
      upsertedCount++;

      if (latestProdDeployment) {
        const snapshotData: Omit<IProjectStatusSnapshot, "id"> = {
          // Assuming 'id' is auto-generated
          project_id: supabaseProjectId,
          source: "vercel-prod-deployment",
          status: latestProdDeployment.readyState,
          details: {
            url: latestProdDeployment.url,
            vercelDeploymentUid: latestProdDeployment.uid,
            createdAtEpoch: latestProdDeployment.createdAt,
            meta: latestProdDeployment.meta,
          },
          deployment_id: latestProdDeployment.uid,
          created_at: latestProdDeployment.createdAt
            ? new Date(latestProdDeployment.createdAt).toISOString()
            : nowISO, // Use deployment time
        };
        const { error: snapshotError } = await supabaseAdmin
          .from("project_status_snapshots")
          .insert(snapshotData);
        if (snapshotError)
          console.error(
            `CORE_LOGIC (Vercel Sync): Error inserting Vercel snapshot for ${vercelProject.name}:`,
            snapshotError
          );
        else snapshotCount++;
      }
    } catch (projectSyncError: any) {
      console.error(
        `CORE_LOGIC (Vercel Sync): Failed to sync project ${vercelProject.name} (Vercel ID: ${vercelProject.id}):`,
        projectSyncError.message,
        projectSyncError.stack
      );
      errorCount++;
    }
  }
  const summaryMessage = `Finished. Upserted/Updated: ${upsertedCount}, Snapshots created: ${snapshotCount}, Errors: ${errorCount}.`;
  console.log(`CORE_LOGIC (Vercel Sync): ${summaryMessage}`);
  return { upsertedCount, snapshotCount, errorCount, summaryMessage };
}
// --- End Core Worker Business Logic ---

export async function GET(request: NextRequest) {
  // 1. Authorization using the utility
  const authResult = authenticateCronRequest(request, "Vercel Sync");
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.message || "Unauthorized" }, { status: 401 });
  }

  // 2. Initialize Dependencies
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server config error: Supabase admin client failed." },
      { status: 500 }
    );
  }
  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
  const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
  if (!VERCEL_API_TOKEN) {
    console.error(
      "ROUTE_HANDLER (Vercel Sync): VERCEL_API_TOKEN is not set in env."
    );
    return NextResponse.json(
      { error: "Server config error: VERCEL_API_TOKEN missing." },
      { status: 500 }
    );
  }

  const workerName = "sync-vercel-projects";
  const logger = new WorkerLogger(supabaseAdmin, workerName); 
  await logger.startRun();

  try {
    const vercelService = new VercelApiService(
      VERCEL_API_TOKEN,
      VERCEL_TEAM_ID 
    );
    const result = await performVercelSync(supabaseAdmin, vercelService);
    await logger.finishRun(
      result.errorCount > 0 ? "Partial Success" : "Success",
      result.summaryMessage
    );
    return NextResponse.json({ message: result.summaryMessage, ...result });
  } catch (error: any) {
    const criticalErrorMessage = `ROUTE_HANDLER (${workerName}): Critical error during main process.`;
    console.error(criticalErrorMessage, error.message, error.stack);
    await logger.finishRun("Failure", criticalErrorMessage, {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: criticalErrorMessage, details: error.message },
      { status: 500 }
    );
  }
}