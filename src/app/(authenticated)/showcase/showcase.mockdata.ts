import { LensProps } from "@components/lens/lens.types";
import type { ISupabaseProject } from "@interfaces/supabase";

// Icons (ensure all needed are imported by the components that use them, or pass them as props if necessary)
// For mock data, we often define the icon component directly.
import CloudIcon from "@mui/icons-material/Cloud";
import GitHubIcon from "@mui/icons-material/GitHub";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BugReportIcon from "@mui/icons-material/BugReport";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
// import FlashOnIcon from "@mui/icons-material/FlashOn"; // Not used in current mock data
// import StorageIcon from "@mui/icons-material/Storage"; // Not used
// import SecurityIcon from "@mui/icons-material/Security"; // Not used
import SpeedIcon from "@mui/icons-material/Speed";
// import MemoryIcon from "@mui/icons-material/Memory"; // Not used
import ReportProblemIcon from "@mui/icons-material/ReportProblem";


// --- Mock Data for Rich Lenses ---
export const richLensGood: LensProps = {
  id: "rich-good",
  status: "good",
  icon: CheckCircleIcon,
  label: "Performance OK",
  value: "98",
  valueUnit: "%",
  subLabel: "Uptime",
  trend: "up",
  trendColor: "green",
};
export const richLensWarning: LensProps = {
  id: "rich-warn",
  status: "warning",
  icon: WarningIcon,
  label: "CPU Usage High",
  value: 85,
  valueUnit: "%",
  subLabel: "Avg CPU",
  trend: "up",
  trendColor: "orange",
  isLoading: false,
};
export const richLensError: LensProps = {
  id: "rich-error",
  status: "error",
  icon: ErrorIcon,
  label: "Sync Errors",
  value: 12,
  subLabel: "Last Hour",
  trend: "down",
  trendColor: "red",
};
export const richLensLoading: LensProps = {
  id: "rich-loading",
  status: "neutral",
  icon: CloudIcon,
  label: "Fetching Data...",
  isLoading: true,
};
export const richLensCompact: LensProps = {
  id: "rich-compact",
  status: "good",
  icon: GitHubIcon,
  value: "OK",
};
// --- End Mock Data for Rich Lenses ---

export const mockLensData: Record<string, LensProps[]> = {
  allGood: [
    {
      id: "lc1-vercel",
      status: "good",
      icon: CloudIcon,
      label: "Vercel: Ready",
    },
    {
      id: "lc1-github",
      status: "good",
      icon: GitHubIcon,
      label: "GitHub: CI Pass",
    },
    {
      id: "lc1-analytics",
      status: "good",
      icon: ShowChartIcon,
      label: "Analytics: OK",
    },
    {
      id: "lc1-uptime",
      status: "good",
      icon: CheckCircleIcon,
      label: "Uptime: 100%",
    },
  ],
  someWarning: [
    {
      id: "lc2-vercel",
      status: "good",
      icon: CloudIcon,
      label: "Vercel: Ready",
    },
    {
      id: "lc2-github",
      status: "warning",
      icon: GitHubIcon,
      label: "GitHub: CI Building",
    },
    {
      id: "lc2-analytics",
      status: "neutral",
      icon: ShowChartIcon,
      label: "Analytics: N/A",
    },
  ],
  criticalError: [
    {
      id: "lc3-vercel",
      status: "error",
      icon: CloudIcon,
      label: "Vercel: Deployment Failed",
    },
    {
      id: "lc3-github",
      status: "good",
      icon: GitHubIcon,
      label: "GitHub: CI Pass",
    },
    {
      id: "lc3-analytics",
      status: "warning",
      icon: ShowChartIcon,
      label: "Analytics: Slow",
    },
    {
      id: "lc3-errors",
      status: "error",
      icon: BugReportIcon,
      label: "Errors: High",
    },
    { id: "lc3-sync", status: "error", icon: SyncIcon, label: "Sync: Stalled" },
  ],
  mixedWithNeutral: [
    {
      id: "lc4-vercel",
      status: "good",
      icon: CloudIcon,
      label: "Vercel: Ready",
    },
    {
      id: "lc4-github",
      status: "neutral",
      icon: GitHubIcon,
      label: "GitHub: Not Linked",
    },
  ],
  empty: [],
};

const mockSupabaseProjectBase: Omit<ISupabaseProject, 'id' | 'name'> & { id?: string; name?: string } = {
  // id and name will be overridden, but provide defaults for base
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  vercel_project_id: "prj_base_vercel_mock", // Ensure mock IDs are distinct
  vercel_org_slug: "base-org",
  vercel_framework: "nextjs",
  vercel_node_version: "18.x",
  vercel_created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
  github_repo_url: null,
  github_default_branch: null,
  github_ci_status: null,
  github_ci_url: null,
  latest_prod_deployment_status: "UNKNOWN", // Default status
  latest_prod_deployment_url: null,
  last_synced_at: new Date().toISOString(),
};


export const mockProjects: Record<string, ISupabaseProject> = {
  ideal: {
    ...mockSupabaseProjectBase,
    id: "ideal-project-mock",
    name: "Project Ideal State",
    vercel_project_id: "prj_ideal_state_mock",
    vercel_org_slug: "borndigital-team",
    github_ci_status: "success",
    github_default_branch: "main",
    github_repo_url: "https://github.com/borndigital-example/ideal-project",
    latest_prod_deployment_url: "ideal-site.vercel.app",
    latest_prod_deployment_status: "READY",
    last_synced_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  vercelError: {
    ...mockSupabaseProjectBase,
    id: "vercel-error-project-mock",
    name: "Project Vercel Error",
    vercel_project_id: "prj_vercel_error_mock",
    vercel_org_slug: "borndigital-team",
    github_ci_status: "success",
    github_default_branch: "main",
    github_repo_url: "https://github.com/borndigital-example/vercel-error",
    latest_prod_deployment_status: "ERROR",
    latest_prod_deployment_url: null,
    last_synced_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  githubCIFailing: {
    ...mockSupabaseProjectBase,
    id: "github-fail-project-mock",
    name: "Project GitHub CI Failing",
    vercel_project_id: "prj_github_fail_mock",
    vercel_org_slug: "borndigital-team",
    latest_prod_deployment_status: "READY",
    latest_prod_deployment_url: "gh-fail-site.vercel.app",
    github_ci_status: "failure",
    github_default_branch: "develop",
    github_ci_url: "https://github.com/borndigital-example/github-fail/actions/runs/2",
    github_repo_url: "https://github.com/borndigital-example/github-fail",
  },
  githubCIPending: {
    ...mockSupabaseProjectBase,
    id: "github-pending-project-mock",
    name: "Project GitHub CI Pending",
    vercel_project_id: "prj_github_pending_mock",
    vercel_org_slug: "borndigital-team",
    latest_prod_deployment_status: "READY", // Assuming Vercel is fine while CI is pending
    latest_prod_deployment_url: "gh-pending-site.vercel.app",
    github_ci_status: "pending",
    github_default_branch: "main",
    github_repo_url: "https://github.com/borndigital-example/github-pending",
  },
  noGitHubRepo: {
    ...mockSupabaseProjectBase,
    id: "no-github-project-mock",
    name: "Project No GitHub Repo",
    vercel_project_id: "prj_no_github_mock",
    vercel_org_slug: "personal-account",
    github_repo_url: null,
    github_default_branch: null,
    github_ci_status: null,
    github_ci_url: null,
    latest_prod_deployment_status: "READY",
    latest_prod_deployment_url: "no-github-site.vercel.app",
  },
  vercelNotLinked: {
    ...mockSupabaseProjectBase,
    id: "vercel-not-linked-project-mock",
    name: "Project Vercel Not Linked",
    vercel_project_id: "", // Test case for empty string
    vercel_org_slug: null,
    latest_prod_deployment_status: null,
    latest_prod_deployment_url: null,
    github_ci_status: "success", // GitHub side might still be okay
    github_default_branch: "main",
    github_repo_url: "https://github.com/borndigital-example/only-github",
  },
  unknownCiStatus: {
    ...mockSupabaseProjectBase,
    id: "unknown-ci-project-mock",
    name: "Project Unknown CI",
    vercel_project_id: "prj_unknown_ci_mock",
    vercel_org_slug: "borndigital-team",
    latest_prod_deployment_status: "READY",
    latest_prod_deployment_url: "unknown-ci-site.vercel.app",
    github_repo_url: "https://github.com/borndigital-example/unknown-ci",
    github_default_branch: "main",
    github_ci_status: "custom_unknown_state", // Test non-standard status
    github_ci_url: "https://github.com/borndigital-example/unknown-ci/actions",
  },
};

export const fractalClusterLensesFull: LensProps[] = [
  {
    id: "fc-1",
    status: "error",
    icon: ReportProblemIcon,
    label: "Vercel Down!",
    priority: 1,
    value: "FAIL",
  },
  {
    id: "fc-2",
    status: "warning",
    icon: GitHubIcon,
    label: "CI Pending",
    priority: 2,
    value: "Build...",
  },
  {
    id: "fc-3",
    status: "good",
    icon: CloudIcon,
    label: "Prod URL OK",
    priority: 3,
    value: "99.9%",
    subLabel: "Uptime",
  },
  {
    id: "fc-4",
    status: "neutral",
    icon: ShowChartIcon,
    label: "Analytics",
    priority: 4,
    value: "N/A",
  },
  {
    id: "fc-5",
    status: "good",
    icon: CheckCircleIcon,
    label: "Security Scan",
    priority: 5,
    value: "Pass",
  },
  {
    id: "fc-6",
    status: "warning",
    icon: SpeedIcon,
    label: "Page Load",
    priority: 6,
    value: "1.2s",
    trend: "up",
  },
  {
    id: "fc-7",
    status: "error",
    icon: BugReportIcon,
    label: "New Errors",
    priority: 2, // Higher prio error
    value: "5",
    subLabel: "Past Hr",
  },
];

export const fractalClusterLensesPartial: LensProps[] = [
  {
    id: "fcp-1",
    status: "good",
    icon: CloudIcon,
    label: "Vercel OK",
    priority: 1,
    value: "Ready",
  },
  {
    id: "fcp-2",
    status: "warning",
    icon: GitHubIcon,
    label: "GitHub CI Slow",
    priority: 3,
    value: "Delayed",
  },
  {
    id: "fcp-3",
    status: "neutral",
    icon: SpeedIcon,
    label: "Performance",
    priority: 2,
    isLoading: true,
  },
];

export const fractalClusterLensesMinimal: LensProps[] = [
  {
    id: "fcm-1",
    status: "error",
    icon: ReportProblemIcon,
    label: "CRITICAL SYSTEM OFFLINE",
    priority: 1,
    value: "ALERT",
    subLabel: "Investigate NOW!",
  },
];