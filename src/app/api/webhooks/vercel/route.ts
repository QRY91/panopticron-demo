// src/app/api/webhooks/vercel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient, SupabaseClient, PostgrestError } from "@supabase/supabase-js";
import crypto from "crypto";
import nodeFetch from 'node-fetch';

// --- Simplified Interfaces (Self-Contained for this file) ---
interface ISupabaseProjectFlat {
  id: string;
  created_at?: string; // Make optional if not always selected/needed for update
  updated_at?: string; // Make optional
  name: string;
  vercel_project_id: string;
  vercel_framework?: string | null;
  vercel_node_version?: string | null;
  latest_prod_deployment_status?: string | null;
  latest_prod_deployment_url?: string | null;
  // Add ONLY other fields that are ACTUALLY USED by the logic below
}

interface IProjectStatusSnapshotFlat {
  // id?: string; // Assuming DB generates it
  project_id: string;
  source: string;
  status: string;
  details: {
    vercelDeploymentId: string;
    target?: string | null; // Match VercelWebhookDeploymentDataFlat's target
    url: string;
    meta: Record<string, string>;
    commitSha?: string | null;
    eventSpecificType: string;
  };
  deployment_id: string;
  created_at: string; // Ensure this is always provided
}

interface VercelWebhookDeploymentDataFlat {
    id: string;
    name: string; // Project name
    url: string;
    state?: "QUEUED" | "BUILDING" | "ERROR" | "INITIALIZING" | "READY" | "CANCELED";
    readyState?: "QUEUED" | "BUILDING" | "ERROR" | "INITIALIZING" | "READY" | "CANCELED";
    target?: "production" | "staging" | string | null; // Target on deployment object
    meta: Record<string, string>;
    createdAt?: number; // Timestamp from deployment object
}
interface VercelWebhookEventPayloadFlat {
  deployment: VercelWebhookDeploymentDataFlat;
  project: { id: string; name?: string; /* no framework/nodeVersion here */ };
  target?: "production" | "staging" | string | null; // Target from payload level
  user?: { id: string; }; // Add if used
  team?: { id: string; }; // Add if used
}
interface VercelWebhookPayloadFlat {
  type: string;
  payload: VercelWebhookEventPayloadFlat;
  createdAt: number; // Timestamp from top-level webhook event
}
// --- End Interfaces ---

// Global error handlers
process.on('unhandledRejection', (reason: any, promise) => {
  const errorReason = reason instanceof Error ? { message: reason.message, stack: reason.stack, name: reason.name } : reason;
  console.error('FLAT_ROUTE: GLOBAL_UNHANDLED_REJECTION: Reason:', JSON.stringify(errorReason));
});
process.on('uncaughtException', (error: Error) => {
  console.error('FLAT_ROUTE: GLOBAL_UNCAUGHT_EXCEPTION: Error Name:', error.name, 'Message:', error.message, 'Stack:', error.stack);
});

const ADMIN_SUPABASE_URL = process.env.SUPABASE_URL;
const ADMIN_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const VERCEL_WEBHOOK_SECRET = process.env.VERCEL_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  console.log("FLAT_ROUTE: POST request received.");

  if (!VERCEL_WEBHOOK_SECRET || !ADMIN_SUPABASE_URL || !ADMIN_SUPABASE_SERVICE_KEY) {
    console.error("FLAT_ROUTE: Critical ENV VARS missing.");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let bodyText: string = "";
  let webhookPayload: VercelWebhookPayloadFlat;
  try {
    bodyText = await request.text();
    const signature = request.headers.get("x-vercel-signature");
    if (!signature) { 
        console.warn("FLAT_ROUTE: Missing signature");
        return NextResponse.json({error:"Missing signature"},{status:400});
    }
    const expectedSignature = crypto.createHmac("sha1", VERCEL_WEBHOOK_SECRET).update(bodyText).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) { 
        console.warn("FLAT_ROUTE: Invalid signature");
        return NextResponse.json({error:"Invalid signature"},{status:401});
    }
    webhookPayload = JSON.parse(bodyText) as VercelWebhookPayloadFlat;
    console.log("FLAT_ROUTE: Signature valid & payload parsed. Event Type:", webhookPayload.type, "Project ID:", webhookPayload.payload.project?.id);
  } catch (e: any) {
    console.error("FLAT_ROUTE: Error in pre-processing (sig/parse):", e.message);
    return NextResponse.json({ error: "Error processing request" }, { status: 400 });
  }

  console.log("FLAT_ROUTE: Initializing Supabase client (using node-fetch).");
  const supabaseAdmin: SupabaseClient = createSupabaseClient(ADMIN_SUPABASE_URL, ADMIN_SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
      global: { fetch: nodeFetch as any }
  });
  console.log("FLAT_ROUTE: Supabase client initialized.");

  const eventType = webhookPayload.type;
  const deploymentData = webhookPayload.payload.deployment;
  const vercelProjectIdFromWebhook = webhookPayload.payload.project?.id;
  console.log(`FLAT_ROUTE_DATA: EventType: ${eventType}, VercelProjectID: ${vercelProjectIdFromWebhook}`);

  if (!vercelProjectIdFromWebhook) {
    console.error("FLAT_ROUTE_ERROR: Vercel Project ID missing. Exiting.");
    return NextResponse.json({ message: "Webhook processed - project ID missing." }, { status: 200 });
  }

  let projectFromDb: ISupabaseProjectFlat | null = null;
  let fetchError: PostgrestError | null = null;
  
  try {
      // Using the full select query that was part of the successful "Flattened Test"
      const selectQueryActual = 'id, name, vercel_project_id, latest_prod_deployment_status, latest_prod_deployment_url, vercel_framework, vercel_node_version, created_at, updated_at, vercel_org_slug, vercel_created_at, github_repo_url, github_default_branch, github_ci_status, github_ci_url, last_synced_at, calculated_priority_score, manual_priority_override, priority_sort_key';
      console.log(`FLAT_ROUTE_DB: (ID: ${vercelProjectIdFromWebhook}) Attempting ACTUAL_QUERY with select ('${selectQueryActual.substring(0,70)}...')...`);
      
      const { data: actualData, error: actualDbError, status: actualStatus } = await supabaseAdmin
          .from('projects')
          .select(selectQueryActual)
          .eq('vercel_project_id', vercelProjectIdFromWebhook)
          .maybeSingle();
          
      console.log(`FLAT_ROUTE_DB: (ID: ${vercelProjectIdFromWebhook}) ACTUAL_QUERY POST-QUERY. Status: ${actualStatus}, Error: ${JSON.stringify(actualDbError)}, Data: ${!!actualData}`);
      
      if (actualDbError) {
          fetchError = actualDbError;
      } else if (actualData === null) {
          console.log(`FLAT_ROUTE_DB: (ID: ${vercelProjectIdFromWebhook}) Project not found by ACTUAL_QUERY.`);
          // fetchError remains null, projectFromDb remains null
      } else {
          projectFromDb = actualData as ISupabaseProjectFlat; // Cast to our flat interface
          console.log(`FLAT_ROUTE_DB: (ID: ${vercelProjectIdFromWebhook}) ACTUAL_QUERY SUCCEEDED.`);
      }
  } catch (err: any) {
      console.error(`FLAT_ROUTE_DB: (ID: ${vercelProjectIdFromWebhook}) CRITICAL_ERROR in DB fetch try-catch: ${err.message}, Stack: ${err.stack}`);
      fetchError = { message: err.message || 'Unknown critical error', details: err.stack, hint: '', code: 'UNEXPECTED_DB_CATCH_FLAT' } as any;
  }

  if (fetchError) {
    console.error(`FLAT_ROUTE_ERROR: DB fetch failed. Error: ${fetchError.message}.`);
    return NextResponse.json({ message: "Webhook processed - DB fetch error.", errorDetails: JSON.stringify(fetchError) }, { status: 200 });
  }
  if (!projectFromDb) {
    console.warn(`FLAT_ROUTE_INFO: Project ${vercelProjectIdFromWebhook} not found in DB.`);
    return NextResponse.json({ message: "Webhook processed - project not found in DB." }, { status: 200 });
  }
  console.log(`FLAT_ROUTE_PROCESSING: Project: ${projectFromDb.name} (ID: ${projectFromDb.id})`);

  const nowISO = new Date().toISOString();

  console.log(`FLAT_ROUTE_PROCESSING: State: ${deploymentData.state} ReadyState: ${deploymentData.readyState}`);
//{"id":"dpl_CHJkFxd2sDuLDw","customEnvironmentId":null,"meta":{"githubCommitAuthorName":"QRY91","githubCommitMessage":"one more","githubCommitOrg":"borndigitalbe","githubCommitRef":"main","githubCommitRepo":"panopticron","githubCommitSha":"oaueoau","githubDeployment":"1","githubOrg":"borndigitalbe","githubRepo":"panopticron","githubRepoOwnerType":"Organization","githubCommitRepoId":"9821x9","githubRepoId":"98x039","githubRepoVisibility":"private","githubCommitAuthorLogin":"QRY91","branchAlias":"panopticron-git-main-borndigital.vercel.app"},"name":"panopticron","url":"panopticron-mwxr-borndigital.vercel.app","inspectorUrl":"https://vercel.com/borndigital/panopticron/CHJkFDjTzBMVxDuLDw"} 
  let determinedDeploymentStatus: string = deploymentData.readyState || deploymentData.state || "UNKNOWN";
  // Determine target: prefer deployment.target, fallback to payload.target
  const deploymentTarget = deploymentData.target || webhookPayload.payload.target;
  const deploymentUrl = deploymentData.url;
  
  let snapshotCreatedAt: string;
  if (deploymentData.createdAt && typeof deploymentData.createdAt === 'number') {
    snapshotCreatedAt = new Date(deploymentData.createdAt).toISOString();
  } else if (webhookPayload.createdAt && typeof webhookPayload.createdAt === 'number') {
    snapshotCreatedAt = new Date(webhookPayload.createdAt).toISOString();
  } else {
    snapshotCreatedAt = nowISO;
  }

  const updateDataForProjectTable: Partial<ISupabaseProjectFlat> = { updated_at: nowISO };
  
  let isConsideredProductionEvent = false;
  if (deploymentTarget === "production") {
    isConsideredProductionEvent = true;
  } else if (!deploymentTarget) {
    const gitBranch = deploymentData.meta?.githubCommitRef || (deploymentData.meta as any)?.gitBranch;
    const PRODUCTION_BRANCH_NAME = process.env.PRODUCTION_BRANCH_NAME || "main";
    if (gitBranch === PRODUCTION_BRANCH_NAME && 
        ["deployment.ready", "deployment.succeeded", "deployment.error", "deployment.canceled", "deployment.created"].includes(eventType)) {
      isConsideredProductionEvent = true;
    }
  }

  if (isConsideredProductionEvent) {
    if (["deployment.ready", "deployment.succeeded"].includes(eventType)) {
      if (projectFromDb.latest_prod_deployment_status !== determinedDeploymentStatus || deploymentUrl !== projectFromDb.latest_prod_deployment_url) {
        updateDataForProjectTable.latest_prod_deployment_status = determinedDeploymentStatus;
        updateDataForProjectTable.latest_prod_deployment_url = deploymentUrl;
      }
    } else if (["deployment.error", "deployment.canceled", "deployment.created"].includes(eventType)) {
      if (projectFromDb.latest_prod_deployment_status !== determinedDeploymentStatus) {
        updateDataForProjectTable.latest_prod_deployment_status = determinedDeploymentStatus;
      }
    }
  }
  console.log(`FLAT_ROUTE_LOGIC: Event ${eventType}, Target: '${deploymentTarget}', Status: ${determinedDeploymentStatus}. ProdEvent: ${isConsideredProductionEvent}. Updates: ${JSON.stringify(updateDataForProjectTable)}`);

  if (Object.keys(updateDataForProjectTable).length > 1) {
      console.log(`FLAT_ROUTE_UPDATE: Updating project ${projectFromDb.id}`);
      const { data: updateD, error: updateE } = await supabaseAdmin
          .from('projects').update(updateDataForProjectTable).eq('id', projectFromDb.id).select().single();
      if (updateE) {
        console.error(`FLAT_ROUTE_UPDATE: Error: ${JSON.stringify(updateE)}`);
      } else {
        console.log(`FLAT_ROUTE_UPDATE: Success. Data (updated project): ${JSON.stringify(updateD).substring(0,200)}...`);
      }
  } else {
    console.log("FLAT_ROUTE_UPDATE: No changes to project table other than updated_at.");
  }

  const snapshotDetailsFlat: IProjectStatusSnapshotFlat["details"] = {
    vercelDeploymentId: deploymentData.id,
    target: deploymentTarget,
    url: deploymentUrl,
    meta: deploymentData.meta,
    commitSha: deploymentData.meta?.githubCommitSha || (deploymentData.meta as any)?.gitCommitSha,
    eventSpecificType: eventType,
  };
  const snapshotToInsert: Omit<IProjectStatusSnapshotFlat, "id"> = {
    project_id: projectFromDb.id,
    source: `vercel-webhook:${eventType}`, status: determinedDeploymentStatus,
    details: snapshotDetailsFlat,
    deployment_id: deploymentData.id, created_at: snapshotCreatedAt,
  };
  console.log(`FLAT_ROUTE_SNAPSHOT: Inserting snapshot for project ${projectFromDb.id}`);
  const { data: snapD, error: snapE } = await supabaseAdmin
      .from('project_status_snapshots').insert(snapshotToInsert).select().single();
  if (snapE) {
    console.error(`FLAT_ROUTE_SNAPSHOT: Error: ${JSON.stringify(snapE)}`);
  } else {
    console.log(`FLAT_ROUTE_SNAPSHOT: Success. Data (snapshot): ${JSON.stringify(snapD).substring(0,200)}...`);
  }

  console.log("FLAT_ROUTE_COMPLETE: Finished processing.");
  return NextResponse.json({ message: "Webhook received and processed (FLAT_ROUTE)." }, { status: 200 });
}

export async function GET(request: NextRequest) {
  console.log("FLAT_ROUTE: GET request received.");
  return NextResponse.json({ message: "Vercel webhook (FLAT_ROUTE) endpoint is alive." });
}