// src/hooks/useGitHubLens.ts
import { useState, useEffect, useContext } from "react";
import type { ISupabaseProject } from "@interfaces/supabase";
import { LensProps, LensStatus } from "@components/lens/lens.types";
import GitHubIcon from "@mui/icons-material/GitHub";

// Import the showcase context
import { ShowcaseModeContext } from "@contexts/showcase-mode";

export const useGitHubLens = (project?: ISupabaseProject): LensProps => {
  // Values that will be in the dependency array
  const projectId = project?.id;
  const repoUrl = project?.github_repo_url;
  const defaultBranch = project?.github_default_branch;
  const ciStatus = project?.github_ci_status;
  const ciUrl = project?.github_ci_url;

  // Check if we're in showcase mode
  const isShowcaseMode = useContext(ShowcaseModeContext);

  const [lensProps, setLensProps] = useState<LensProps>({
    id: `${projectId || "github"}-github`, // Use initial projectId or fallback
    status: "neutral",
    icon: GitHubIcon,
    label: `GitHub CI${
      defaultBranch ? ` (${defaultBranch})` : ""
    }: Initializing...`,
    href: repoUrl ? `${repoUrl}/actions` : undefined,
  });

  useEffect(() => {
    if (!isShowcaseMode) {
      console.log("useGitHubLens - project prop:", project);
      console.log("useGitHubLens - ciStatus from prop:", project?.github_ci_status);
    }

    // If project object itself isn't available, or no repoUrl, set to N/A
    if (!project || !repoUrl) {
      setLensProps({
        id: `${projectId || "github"}-github`,
        status: "neutral",
        icon: GitHubIcon,
        label: isShowcaseMode ? "GitHub CI: Mock N/A" : "GitHub CI: N/A",
        href: undefined,
      });
      return;
    }

    // At this point, project, projectId and repoUrl are defined
    let currentStatus: LensStatus = "neutral";
    let currentLabel = `GitHub CI${
      defaultBranch ? ` (${defaultBranch})` : ""
    }: Unknown`;
    let currentHref = ciUrl; // Use specific run URL if available

    if (!currentHref) {
      // Fallback to general actions page if specific run URL isn't available
      currentHref = `${repoUrl}/actions`;
    }

    if (ciStatus) {
      const statusLower = ciStatus.toLowerCase();
      const branchInfo = defaultBranch ? ` (${defaultBranch})` : "";
      const mockSuffix = isShowcaseMode ? " (Mock)" : "";

      if (statusLower === "success" || statusLower === "completed") {
        currentStatus = "good";
        currentLabel = `GitHub CI${branchInfo}: Passing${mockSuffix}`;
      } else if (
        statusLower === "failure" ||
        statusLower === "failed" ||
        statusLower === "error"
      ) {
        currentStatus = "error";
        currentLabel = `GitHub CI${branchInfo}: Failing${mockSuffix}`;
      } else if (
        [
          "pending",
          "queued",
          "in_progress",
          "building",
          "requested",
          "waiting",
        ].includes(statusLower)
      ) {
        currentStatus = "warning";
        currentLabel = `GitHub CI${branchInfo}: Running${mockSuffix}`;
      } else if (["cancelled", "skipped", "neutral"].includes(statusLower)) {
        currentStatus = "neutral";
        currentLabel = `GitHub CI${branchInfo}: ${ciStatus}${mockSuffix}`;
      } else if (statusLower === "unknown") {
        currentStatus = "neutral";
        currentLabel = `GitHub CI${branchInfo}: Unknown${mockSuffix}`;
      } else {
        currentStatus = "neutral";
        currentLabel = `GitHub CI${branchInfo}: ${ciStatus || "Status N/A"}${mockSuffix}`;
      }
    } else {
      currentStatus = "neutral";
      currentLabel = `GitHub CI${
        defaultBranch ? ` (${defaultBranch})` : ""
      }: Status N/A${isShowcaseMode ? " (Mock)" : ""}`;
    }

    const newGitHubLensData = {
      id: `${projectId}-github`, // projectId is guaranteed here
      status: currentStatus,
      icon: GitHubIcon,
      label: currentLabel,
      href: currentHref,
    };
    
    if (!isShowcaseMode) {
      console.log(`useGitHubLens for ${project?.name} - Determined GitHub Data:`, JSON.stringify(newGitHubLensData));
    }
    
    setLensProps(newGitHubLensData);
  }, [
    // Dependencies are now stable primitive values or undefined
    project,
    projectId,
    repoUrl,
    defaultBranch,
    ciStatus,
    ciUrl,
    isShowcaseMode, // Add showcase mode to dependencies
  ]);
  
  if (!isShowcaseMode) {
    console.log(`useGitHubLens for ${project?.name} - HOOK RETURN:`, JSON.stringify(lensProps));
  }
  
  return lensProps;
};
