// src/hooks/useVercelLens.ts
import type { ISupabaseProject } from "@interfaces/supabase";
import type { LensProps } from "@components/lens/lens.types";
import CloudIcon from "@mui/icons-material/Cloud";

interface UseVercelLensReturn {
  lensProps: LensProps;
  isLoading: boolean;
  error: null;
  deploymentDetail: null;
}

export const useVercelLens = (
  project?: ISupabaseProject
): UseVercelLensReturn => {
  if (!project?.vercel_project_id) {
    return {
      lensProps: {
        id: `${project?.id || "vercel"}-vercel`,
        status: "neutral",
        icon: CloudIcon,
        label: "Vercel: Not Connected",
        href: undefined,
      },
      isLoading: false,
      error: null,
      deploymentDetail: null,
    };
  }

  // Map deployment status to lens status
  const deploymentStatus = project.latest_prod_deployment_status;
  let status: "good" | "warning" | "error" | "neutral" = "neutral";
  let label = "Vercel: Unknown";
  let value: string | undefined;

  switch (deploymentStatus) {
    case "READY":
      status = "good";
      label = "Vercel: Ready";
      value = "Live";
      break;
    case "ERROR":
      status = "error";
      label = "Vercel: Failed";
      value = "Error";
      break;
    case "BUILDING":
      status = "warning";
      label = "Vercel: Building";
      value = "Build";
      break;
    case "QUEUED":
      status = "warning";
      label = "Vercel: Queued";
      value = "Queue";
      break;
    case "CANCELED":
      status = "warning";
      label = "Vercel: Canceled";
      value = "Stop";
      break;
    default:
      status = "neutral";
      label = "Vercel: Unknown";
      value = "N/A";
  }

  const href = project.vercel_org_slug
    ? `https://vercel.com/${project.vercel_org_slug}/${project.vercel_project_id}`
    : undefined;

  return {
    lensProps: {
      id: `${project.id}-vercel`,
      status,
      icon: CloudIcon,
      label,
      value,
      href,
    },
    isLoading: false,
    error: null,
    deploymentDetail: null,
  };
};
