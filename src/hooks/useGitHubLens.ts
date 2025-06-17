// src/hooks/useGitHubLens.ts
import type { ISupabaseProject } from "@interfaces/supabase";
import { LensProps } from "@components/lens/lens.types";
import GitHubIcon from "@mui/icons-material/GitHub";

export const useGitHubLens = (project?: ISupabaseProject): LensProps => {
  if (!project?.github_repo_url) {
    return {
      id: `${project?.id || "github"}-github`,
      status: "neutral",
      icon: GitHubIcon,
      label: "GitHub: Not Connected",
      href: undefined,
    };
  }

  // Map CI status to lens status
  const ciStatus = project.github_ci_status;
  const defaultBranch = project.github_default_branch || "main";
  let status: "good" | "warning" | "error" | "neutral" = "neutral";
  let label = "GitHub CI: Unknown";
  let value: string | undefined;

  switch (ciStatus) {
    case "success":
      status = "good";
      label = `GitHub CI (${defaultBranch}): Pass`;
      value = "✓";
      break;
    case "failure":
      status = "error";
      label = `GitHub CI (${defaultBranch}): Failed`;
      value = "✗";
      break;
    case "pending":
      status = "warning";
      label = `GitHub CI (${defaultBranch}): Running`;
      value = "●";
      break;
    case "error":
      status = "error";
      label = `GitHub CI (${defaultBranch}): Error`;
      value = "!";
      break;
    default:
      status = "neutral";
      label = `GitHub CI (${defaultBranch}): N/A`;
      value = "?";
  }

  const href = project.github_ci_url || `${project.github_repo_url}/actions`;

  return {
    id: `${project.id}-github`,
    status,
    icon: GitHubIcon,
    label,
    value,
    href,
  };
};
