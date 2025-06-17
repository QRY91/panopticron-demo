import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import type { ISupabaseProject, IProjectStatusSnapshot } from '@interfaces/supabase';

export async function getProjectByVercelId(
  supabaseAdminClientFromRoute: SupabaseClient, // Client from route.ts
  vercelProjectId: string
): Promise<{ project: ISupabaseProject | null; error: PostgrestError | null }> {
    console.log(`DB_SERVICE_GET_PROJECT: (ID: ${vercelProjectId}) Function called. Using PASSED-IN client.`);

    if (!vercelProjectId || typeof vercelProjectId !== 'string' || vercelProjectId.trim() === "") {
        console.error(`DB_SERVICE_GET_PROJECT: (ID: ${vercelProjectId}) Invalid or empty vercelProjectId.`);
        return { project: null, error: { message: 'Invalid vercelProjectId', details: '', hint: '', code: 'VALIDATION_ERROR' } as any };
    }

    // The full select query needed for ISupabaseProject fields used in the handler
    const selectQuery = `id, name, vercel_project_id, latest_prod_deployment_status, latest_prod_deployment_url, vercel_framework, vercel_node_version, created_at, updated_at, vercel_org_slug, vercel_created_at, github_repo_url, github_default_branch, github_ci_status, github_ci_url, last_synced_at, calculated_priority_score, manual_priority_override, priority_sort_key`;
    
    try {
        console.log(`DB_SERVICE_GET_PROJECT: (ID: ${vercelProjectId}) Attempting FULL query with select: ${selectQuery.substring(0,70)}...`);
        
        const { data, error, status } = await supabaseAdminClientFromRoute
            .from('projects')
            .select(selectQuery)
            .eq('vercel_project_id', vercelProjectId)
            .maybeSingle(); // Returns null if not found, no error for that case

        console.log(`DB_SERVICE_GET_PROJECT: (ID: ${vercelProjectId}) FULL query POST-QUERY. Status: ${status}, Error: ${JSON.stringify(error)}, Data received: ${!!data}`);

        if (error) { // This would be for actual DB errors, not "not found" with maybeSingle
            console.error(`DB_SERVICE_GET_PROJECT: (ID: ${vercelProjectId}) Supabase FULL query FAILED. Error:`, JSON.stringify(error));
            return { project: null, error };
        }
        
        if (data === null) { // Project not found
            console.log(`DB_SERVICE_GET_PROJECT: (ID: ${vercelProjectId}) Project not found by vercel_project_id (maybeSingle).`);
            // To be consistent with how handler checks for fetchDbError.code === 'PGRST116' or message includes "Project not found"
            // we can simulate a PGRST116-like error or just ensure the handler checks for project: null
            return { project: null, error: { message: 'Project not found', code: 'PGRST116', details: '', hint:''} as any };
        }
        
        console.log(`DB_SERVICE_GET_PROJECT: (ID: ${vercelProjectId}) FULL query SUCCEEDED.`);
        return { project: data as ISupabaseProject, error: null };

    } catch (err: any) {
        console.error(`DB_SERVICE_GET_PROJECT: (ID: ${vercelProjectId}) CRITICAL_ERROR in try-catch: Name: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`);
        return { project: null, error: { message: err.message || 'Unknown critical error', details: err.stack, hint: '', code: 'UNEXPECTED_DB_CATCH' } as any };
    }
}

// Ensure these are also using the passed-in supabaseAdmin
export async function updateProjectFromWebhook(
  supabaseAdmin: SupabaseClient,
  panopticronProjectId: string,
  updateData: Partial<ISupabaseProject>
): Promise<{ data: ISupabaseProject | null; error: PostgrestError | null }> {
  console.log(`DB_SERVICE: Updating project ${panopticronProjectId}`);
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update(updateData)
    .eq('id', panopticronProjectId)
    .select() 
    .single();
  if (error) console.error(`DB_SERVICE: Error updating project ${panopticronProjectId}:`, error);
  else console.log(`DB_SERVICE: Project ${panopticronProjectId} updated.`);
  return { data: data as ISupabaseProject | null, error };
}

export async function createVercelSnapshot(
  supabaseAdmin: SupabaseClient,
  snapshotData: Omit<IProjectStatusSnapshot, "id" | "created_at"> & { created_at?: string } 
): Promise<{ data: IProjectStatusSnapshot | null; error: PostgrestError | null }> {
  console.log(`DB_SERVICE: Inserting snapshot for project_id ${snapshotData.project_id}`);
  const { data, error } = await supabaseAdmin
    .from('project_status_snapshots')
    .insert(snapshotData)
    .select()
    .single(); 
  if (error) console.error(`DB_SERVICE: Error inserting snapshot for project_id ${snapshotData.project_id}:`, error);
  else console.log(`DB_SERVICE: Snapshot inserted for project_id ${snapshotData.project_id}.`);
  return { data: data as IProjectStatusSnapshot | null, error };
}