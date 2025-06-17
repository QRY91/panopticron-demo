// src/interfaces/supabase.ts
export interface ISupabaseProject {
  id: string; // UUID
  created_at: string; // timestampz
  updated_at: string; // timestampz
  name: string;
  vercel_project_id: string; // The ID of the project on Vercel
  vercel_org_slug?: string | null; // The Vercel organization/user slug

  vercel_framework?: string | null;
  vercel_node_version?: string | null;
  vercel_created_at?: string | null; // Vercel's project creation timestamp

  github_repo_url?: string | null; // Full URL to the GitHub repository

  // --- GitHub CI Specific Fields ---
  github_default_branch?: string | null;
  github_ci_status?: 'success' | 'failure' | 'pending' | 'in_progress' | 'queued' | 'cancelled' | 'skipped' | 'neutral' | 'unknown' | string | null;
  github_ci_url?: string | null;
  // --- End GitHub CI Specific Fields ---

  latest_prod_deployment_status?: string | null; // From Vercel
  latest_prod_deployment_url?: string | null; // From Vercel

  last_synced_at?: string | null; // Timestamp of the last successful data sync by any backend worker

  calculated_priority_score?: number | null;
  manual_priority_override?: number | null;
  priority_sort_key?: number | null;
}

export interface IProjectStatusSnapshot {
id: string; // UUID
project_id: string; // UUID FK to ISupabaseProject.id
created_at: string; // timestampz
source: string; // 'vercel-prod-deployment', 'github-ci', etc.
status: string; // 'READY', 'ERROR', 'success', 'failure'
details?: any; // jsonb - e.g., { url: "...", commitSha: "...", workflowName: "..." }
deployment_id?: string | null; // e.g., Vercel deployment UID
commit_sha?: string | null;    // Git commit SHA associated with the status
run_id?: string | null;        // e.g., GitHub Actions run ID
external_url?: string | null;  // Link to the specific run/deployment/log
}