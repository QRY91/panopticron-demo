// src/hooks/useVercelLens.ts
import { useState, useEffect, useContext } from "react";
import { useCustom, type RefineError } from "@refinedev/core";
import type { ISupabaseProject } from "@interfaces/supabase";
import type { IVercelDeploymentDetail } from "@interfaces/vercel";
import { LensProps, LensStatus } from "@components/lens/lens.types";
import CloudIcon from "@mui/icons-material/Cloud";

// Import the showcase context
import { ShowcaseModeContext } from "@contexts/showcase-mode";

interface VercelDeploymentApiResponse {
  deployment: IVercelDeploymentDetail | null;
}

interface UseVercelLensReturn {
  lensProps: LensProps;
  isLoading: boolean;
  error: RefineError | null;
  deploymentDetail: IVercelDeploymentDetail | null | undefined;
}

export const useVercelLens = (
  project?: ISupabaseProject
): UseVercelLensReturn => {
  const vercelProjectId = project?.vercel_project_id;
  const projectName = project?.name || "Unknown Project"; // Fallback for logging
  const vercelOrgSlug = project?.vercel_org_slug;
  const initialStatusFromDB = project?.latest_prod_deployment_status;
  const initialHrefFromDB = project?.latest_prod_deployment_url;

  // Check if we're in showcase mode
  const isShowcaseMode = useContext(ShowcaseModeContext);

  const {
    data: vercelCustomHookResponse,
    isLoading: isLoadingHook,
    error: hookError,
  } = useCustom<VercelDeploymentApiResponse, RefineError>({
    url: `/api/vercel-deployment/${vercelProjectId}`,
    method: "get",
    dataProviderName: "fetch",
    queryOptions: {
      enabled: !!vercelProjectId && !isShowcaseMode, // Disable fetching in showcase mode
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      onSuccess: (response) => {
        if (!isShowcaseMode) {
          console.log(
            `useVercelLens useCustom SUCCESS for ${projectName} (Vercel ID: ${vercelProjectId}):`,
            response.data.deployment
          );
        }
      },
      onError: (error: RefineError) => {
        if (!isShowcaseMode) {
          console.error(
            `useVercelLens useCustom ERROR for ${projectName} (Vercel ID: ${vercelProjectId}):`,
            error
          );
        }
      },
    },
  });

  const deploymentDetail = vercelCustomHookResponse?.data?.deployment;

  const [lensProps, setLensProps] = useState<LensProps>({
    id: `${project?.id || "vercel"}-vercel`,
    status: "neutral",
    icon: CloudIcon,
    label: "Vercel: Initializing...",
    href: vercelProjectId
      ? `https://vercel.com/${
          vercelOrgSlug || projectName?.split(".")[0] || "_"
        }/${projectName}/deployments`
      : undefined,
  });

  useEffect(() => {
    if (!isShowcaseMode) {
      console.log("useVercelLens - project prop:", project);
      console.log("useVercelLens - initialStatusFromDB:", initialStatusFromDB);
      console.log(
        "useVercelLens - deploymentDetail from useCustom:",
        deploymentDetail
      );
      console.log("useVercelLens - isLoadingHook:", isLoadingHook);
      console.log("useVercelLens - hookError:", hookError);
    }

    let currentStatus: LensStatus = "neutral";
    let currentLabel = "Vercel: Fetching...";
    let currentHref = vercelProjectId
      ? `https://vercel.com/${
          vercelOrgSlug || projectName?.split(".")[0] || "_"
        }/${projectName}/deployments`
      : undefined;

    if (isShowcaseMode) {
      // Return mock data based on the project for showcase
      if (initialStatusFromDB) {
        switch (initialStatusFromDB.toUpperCase()) {
          case "READY":
            currentStatus = "good";
            currentLabel = "Vercel: Ready (Mock)";
            break;
          case "ERROR":
          case "FAILED":
          case "CANCELED":
            currentStatus = "error";
            currentLabel = `Vercel: ${initialStatusFromDB} (Mock)`;
            break;
          case "BUILDING":
          case "QUEUED":
          case "INITIALIZING":
            currentStatus = "warning";
            currentLabel = `Vercel: ${initialStatusFromDB} (Mock)`;
            break;
          default:
            currentStatus = "neutral";
            currentLabel = `Vercel: ${initialStatusFromDB} (Mock)`;
            break;
        }
        if (initialHrefFromDB)
          currentHref = `https://${initialHrefFromDB.replace(/^https?:\/\//,"")}`;
      } else {
        currentStatus = "neutral";
        currentLabel = "Vercel: Mock Data";
      }
    } else if (!vercelProjectId) {
      currentStatus = "neutral";
      currentLabel = "Vercel: N/A";
      currentHref = undefined;
    } else if (isLoadingHook) {
      currentStatus = "neutral";
      currentLabel = "Vercel: Loading...";
    } else if (hookError) {
      currentStatus = "error";
      const statusCode = (hookError as any)?.statusCode;
      currentLabel = `Vercel: Error ${
        statusCode ? `(${statusCode})` : "(API Fetch)"
      }`;
    } else if (deploymentDetail) {
      switch (deploymentDetail.readyState) {
        case "READY":
          currentStatus = "good";
          currentLabel = "Vercel: Ready";
          break;
        case "BUILDING":
        case "QUEUED":
        case "INITIALIZING":
          currentStatus = "warning";
          currentLabel = `Vercel: ${deploymentDetail.readyState}`;
          break;
        default:
          currentStatus = "error";
          currentLabel = `Vercel: ${deploymentDetail.readyState}`;
          break;
      }
      if (deploymentDetail.url) currentHref = `https://${deploymentDetail.url}`;
    } else if (initialStatusFromDB) {
      currentLabel = "Vercel: From DB (No Live Prod)";
      switch (initialStatusFromDB.toUpperCase()) {
        case "READY":
          currentStatus = "good";
          break;
        case "ERROR":
        case "FAILED":
        case "CANCELED":
          currentStatus = "error";
          break;
        default:
          currentStatus = "neutral";
          break;
      }
      if (initialHrefFromDB)
        currentHref = `https://${initialHrefFromDB.replace(/^https?:\/\//,"")}`;
    } else {
      currentStatus = "neutral";
      currentLabel = "Vercel: No Data";
    }

    const newVercelLensData = {
      id: `${project?.id || "vercel"}-vercel`,
      status: currentStatus,
      icon: CloudIcon,
      label: currentLabel,
      href: currentHref,
    };
    
    if (!isShowcaseMode) {
      console.log(`useVercelLens for ${projectName} - Determined Vercel Data:`, JSON.stringify(newVercelLensData));
    }
    
    setLensProps(newVercelLensData);
    
    if (!isShowcaseMode) {
      console.log(
        `useVercelLens for ${projectName} - AFTER setLensProps was called.`
      );
    }
  }, [
    project?.id, // For lens ID
    projectName,
    vercelProjectId,
    vercelOrgSlug,
    initialStatusFromDB,
    initialHrefFromDB,
    deploymentDetail,
    isLoadingHook,
    hookError,
    isShowcaseMode, // Add showcase mode to dependencies
  ]);

  if (!isShowcaseMode) {
    console.log(`useVercelLens for ${projectName} - HOOK RETURN:`, JSON.stringify(lensProps));
  }
  
  return { 
    lensProps, 
    isLoading: isShowcaseMode ? false : isLoadingHook, // Never loading in showcase mode
    error: isShowcaseMode ? null : hookError, // No errors in showcase mode
    deploymentDetail: isShowcaseMode ? null : deploymentDetail // No live data in showcase mode
  };
};
