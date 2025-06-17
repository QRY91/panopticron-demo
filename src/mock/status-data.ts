import { CiTestRun } from "@/types/ci";
import { ProjectPriorityHistoryEntry } from "@/types/panopticron";

// Mock worker runs
export const mockWorkerRuns = [
  {
    worker_name: "github_sync",
    status: "Success",
    ended_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    summary_message: "Successfully synced 15 repositories",
  },
  {
    worker_name: "vercel_sync",
    status: "Success",
    ended_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    summary_message: "Updated 8 deployment statuses",
  },
  {
    worker_name: "github_sync",
    status: "Partial Success",
    ended_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    summary_message: "Synced 12 repositories, 2 failed",
  },
  {
    worker_name: "vercel_sync",
    status: "Failure",
    ended_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    summary_message: "Failed to connect to Vercel API",
  },
];

// Mock CI test runs
export const mockCiTestRuns: CiTestRun[] = [
  {
    id: 1,
    run_id: 123456,
    workflow_name: "Build and Test",
    branch: "main",
    commit_sha: "a1b2c3d4e5f6g7h8i9j0",
    status: "success",
    conclusion: "success",
    started_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    completed_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 minutes ago
    duration_ms: 120000, // 2 minutes
    total_tests: 156,
    passed_tests: 156,
    failed_tests: 0,
    html_url: "https://github.com/example/repo/actions/runs/123456",
    report_artifact_url:
      "https://github.com/example/repo/actions/runs/123456/artifacts/789",
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 2,
    run_id: 123455,
    workflow_name: "Build and Test",
    branch: "feature/new-ui",
    commit_sha: "b2c3d4e5f6g7h8i9j0k1",
    status: "failure",
    conclusion: "failure",
    started_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    completed_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
    duration_ms: 300000, // 5 minutes
    total_tests: 156,
    passed_tests: 152,
    failed_tests: 4,
    html_url: "https://github.com/example/repo/actions/runs/123455",
    report_artifact_url:
      "https://github.com/example/repo/actions/runs/123455/artifacts/788",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 3,
    run_id: 123454,
    workflow_name: "Build and Test",
    branch: "main",
    commit_sha: "c3d4e5f6g7h8i9j0k1l2",
    status: "cancelled",
    conclusion: "cancelled",
    started_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    completed_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(), // 55 minutes ago
    duration_ms: 300000, // 5 minutes
    total_tests: 156,
    passed_tests: 0,
    failed_tests: 0,
    html_url: "https://github.com/example/repo/actions/runs/123454",
    report_artifact_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

// Generate mock project priority history data
export const generateMockPriorityHistory = (
  projectId: string,
  timeRange: string = "30d"
): ProjectPriorityHistoryEntry[] => {
  const now = new Date();
  const days = timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : 30;
  const entries: ProjectPriorityHistoryEntry[] = [];

  // Generate data points for the last X days
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate a priority score that fluctuates over time
    const baseScore = 500;
    const fluctuation = Math.sin(i / 3) * 200; // Creates a wave pattern
    const randomVariation = (Math.random() - 0.5) * 50; // Adds some randomness
    const finalScore = Math.round(baseScore + fluctuation + randomVariation);

    entries.push({
      project_id: projectId,
      timestamp: date.toISOString(),
      final_priority_sort_key: finalScore,
      reason_for_change:
        i % 3 === 0
          ? "Updated due to new commits"
          : i % 5 === 0
          ? "Priority adjusted based on client feedback"
          : "Regular priority update",
    });
  }

  return entries;
};
