// src/services/webhookProcessing/vercelWebhookHandler.ts
import { SupabaseClient, PostgrestError } from "@supabase/supabase-js";
import type { ISupabaseProject, IProjectStatusSnapshot } from "@interfaces/supabase";
import type { VercelWebhookPayload, VercelWebhookDeploymentData } from "@interfaces/vercel";
// We will call these from projectWebhookService.ts after the inlined fetch
import { updateProjectFromWebhook, createVercelSnapshot } from "../database/projectWebhookService";

export async function handleVercelDeploymentEvent(
  supabaseAdmin: SupabaseClient, // This is the client from route.ts, configured with node-fetch
  webhookPayload: VercelWebhookPayload
): Promise<void> {
  console.log("WEBHOOK_HANDLER: handleVercelDeploymentEvent called.");

  const eventType = webhookPayload.type;
  const vercelProjectIdFromWebhook = webhookPayload.payload.project?.id;
  console.log(`WEBHOOK_HANDLER_DATA: EventType: ${eventType}, VercelProjectID: ${vercelProjectIdFromWebhook}`);

  if (!vercelProjectIdFromWebhook) {
    console.error("WEBHOOK_HANDLER_ERROR: Vercel Project ID missing. Exiting.");
    return;
  }

  // --- INLINED getProjectByVercelId LOGIC ---
  let projectFromDb: ISupabaseProject | null = null;
  let fetchError: PostgrestError | null = null; // To store any error from the DB fetch

  console.log(`WEBHOOK_HANDLER (INLINED_DB_LOGIC): (ID: ${vercelProjectIdFromWebhook}) Attempting DB fetch using passed-in client.`);
  
  // The full select query needed
  const selectQuery = `id, name, vercel_project_id, latest_prod_deployment_status, latest_prod_deployment_url, vercel_framework, vercel_node_version, created_at, updated_at, vercel_org_slug, vercel_created_at, github_repo_url, github_default_branch, github_ci_status, github_ci_url, last_synced_at, calculated_priority_score, manual_priority_override, priority_sort_key`;

  try {
      console.log(`WEBHOOK_HANDLER (INLINED_DB_LOGIC): (ID: ${vercelProjectIdFromWebhook}) Attempting FULL query with select: ${selectQuery.substring(0,70)}...`);
      
      const { data, error: dbQueryError } = await supabaseAdmin // Use the passed-in client
          .from('projects')
          .select(selectQuery)
          .eq('vercel_project_id', vercelProjectIdFromWebhook)
          .maybeSingle();

      console.log(`WEBHOOK_HANDLER (INLINED_DB_LOGIC): (ID: ${vercelProjectIdFromWebhook}) FULL query POST-QUERY. Error: ${JSON.stringify(dbQueryError)}, Data received: ${!!data}`);

      if (dbQueryError) {
          fetchError = dbQueryError;
      } else if (data === null) {
          console.log(`WEBHOOK_HANDLER (INLINED_DB_LOGIC): (ID: ${vercelProjectIdFromWebhook}) Project not found (maybeSingle).`);
          // No actual error, but project not found. fetchError remains null. projectFromDb remains null.
      } else {
          projectFromDb = data as ISupabaseProject;
          console.log(`WEBHOOK_HANDLER (INLINED_DB_LOGIC): (ID: ${vercelProjectIdFromWebhook}) FULL query SUCCEEDED.`);
      }
  } catch (err: any) {
      console.error(`WEBHOOK_HANDLER (INLINED_DB_LOGIC): (ID: ${vercelProjectIdFromWebhook}) CRITICAL_ERROR in try-catch: Name: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`);
      fetchError = { message: err.message || 'Unknown critical error', details: err.stack, hint: '', code: 'UNEXPECTED_INLINE_CATCH' } as any;
  }
  // --- END OF INLINED getProjectByVercelId LOGIC ---

  if (fetchError) {
    console.error(`WEBHOOK_HANDLER_ERROR: DB fetch failed (inlined logic). Error: ${fetchError.message}. Halting.`);
    return;
  }
  if (!projectFromDb) {
    console.warn(`WEBHOOK_HANDLER_INFO: Project ${vercelProjectIdFromWebhook} not found (inlined logic). No action.`);
    return;
  }

  // ... (Rest of your handleVercelDeploymentEvent logic: processing, updates, snapshots)
  // This part should now use the projectFromDb obtained above.
  // For example:
  console.log(`WEBHOOK_HANDLER_PROCESSING: Processing event for Panopticron project: ${projectFromDb.name} (ID: ${projectFromDb.id})`);
  const deploymentData = webhookPayload.payload.deployment;
  // ... (construct updateDataForProjectTable, snapshotToInsert) ...
  // ... then call updateProjectFromWebhook(supabaseAdmin, projectFromDb.id, updateDataForProjectTable);
  // ... and createVercelSnapshot(supabaseAdmin, snapshotToInsert);
  // Ensure these subsequent calls in projectWebhookService.ts also work.
  // For now, let's just confirm the inlined fetch works.
  // You can add back the update/snapshot calls if this fetch part succeeds.

  // For this test, let's just log success if we got the project
   console.log(`WEBHOOK_HANDLER_TEST_SUCCESS: Successfully fetched project ${projectFromDb.name} with inlined logic. Further processing would happen here.`);
}