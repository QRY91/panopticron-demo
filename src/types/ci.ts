// Add this to your existing types file or a new one
export interface CiTestRun {
    id: number;
    run_id: number;
    workflow_name: string;
    branch: string;
    commit_sha: string;
    status: string; // 'success', 'failure', 'cancelled', etc.
    conclusion: string | null;
    started_at: string; // ISO string
    completed_at: string | null; // ISO string
    duration_ms: number | null;
    total_tests: number | null;
    passed_tests: number | null;
    failed_tests: number | null;
    html_url: string;
    report_artifact_url: string | null;
    created_at: string; // ISO string for when Panopticron recorded it
  }