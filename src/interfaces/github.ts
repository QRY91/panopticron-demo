// src/interfaces/github.ts

export interface IGitHubActor {
  login: string;
  id: number;
  avatar_url?: string;
  // ... other actor fields
}

export interface IGitHubRepositoryMini { // For embedding in run
    id: number;
    name: string;
    full_name: string;
    private: boolean;
}

export interface IGitHubHeadCommit {
    id: string; // This is the commit SHA
    tree_id: string;
    message: string;
    timestamp: string;
    author: { name?: string; email?: string; };
    committer: { name?: string; email?: string; };
}


export interface IGitHubActionsRun {
  id: number;
  name: string; // Name of the workflow
  node_id: string;
  head_branch: string;
  head_sha: string; // <<< ADD THIS (SHA of the commit)
  path: string; // Path to the workflow file
  run_number: number; // <<< ADD THIS
  event: string; // <<< ADD THIS (e.g., "push", "pull_request", "workflow_dispatch")
  status: 'queued' | 'in_progress' | 'completed' | 'requested' | 'waiting' | string; // Current status
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null | string; // Final conclusion
  workflow_id: number;
  check_suite_id?: number;
  check_suite_node_id?: string;
  url: string; // API URL for this run
  html_url: string; // HTML URL to view this run on GitHub
  pull_requests?: any[]; // Define more strictly if needed
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  actor?: IGitHubActor;
  run_attempt?: number;
  referenced_workflows?: any[]; // Define more strictly if needed
  run_started_at?: string; // ISO 8601 timestamp
  // You might also have head_commit and repository objects nested here from the API
  head_commit?: IGitHubHeadCommit;
  repository?: IGitHubRepositoryMini;
  // Add other fields as needed based on the actual API response
}

export interface IGitHubActionsRunsResponse {
  total_count: number;
  workflow_runs: IGitHubActionsRun[];
}

export interface IGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  default_branch: string;
  // ... other fields you might care about
}