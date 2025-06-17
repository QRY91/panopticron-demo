// src/components/project/status-card/index.tsx
import React, { useState } from "react";
import {
  Typography,
  Link as MuiLink,
  Box,
  IconButton,
  Collapse,
  styled,
  IconButtonProps,
  useTheme,
  alpha,
  Paper as MuiPaper,
  Stack,
  Tooltip,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShowChartIcon from "@mui/icons-material/ShowChart";

import { LensCluster } from "@components/lens";
import type { ISupabaseProject } from "@interfaces/supabase";
import PanopticonSpinner from "@components/loaders/PanopticonSpinner";

import { useVercelLens } from "@hooks/useVercelLens";
import { useGitHubLens } from "@hooks/useGitHubLens";

import { convertEpochToDateString } from "@utils/formatters";
import { ProjectCardDetails } from "./ProjectCardDetails";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

import { Sparkline } from "./Sparkline";

// --- Refine's EditButton ---
import { EditButton } from "@refinedev/mui";

// --- Styled Components & Style Objects ---
const StyledProjectCardPaper = styled(MuiPaper)(
  ({ theme }: { theme: Theme }) => ({
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  })
);

const topBarStyle = (theme: Theme) => ({
  width: "100%",
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.7)
      : theme.palette.grey[100],
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  padding: theme.spacing(1.25, 2),
  display: "flex",
  flexDirection: { xs: "column", md: "row" } as const,
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", md: "flex-start" } as const,
});

const projectInfoBoxStyle = {
  flexGrow: 1,
  paddingRight: { md: 2 },
  minWidth: 0,
};

const lensClusterContainerStyle = {
  marginTop: { xs: 2, md: 0 },
  flexShrink: 0,
  width: "164px",
  height: "164px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const actionsAndExpandControlBoxStyle = {
  display: "flex",
  justifyContent: "space-between", // Align items to ends
  alignItems: "center",
  padding: (theme: Theme) => theme.spacing(0.5, 1, 0.5, 2),
  borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  minHeight: "48px", // Ensure consistent height for the actions bar
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }: { theme: Theme; expand: boolean }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface ProjectStatusCardProps {
  project: ISupabaseProject;
}

export const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({
  project,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const {
    lensProps: vercelLensPropsFromHook,
    isLoading: isLoadingVercelDeployment,
    error: vercelDeploymentError,
    deploymentDetail: vercelLiveDeploymentDetail,
  } = useVercelLens(project);

  const gitHubLensPropsFromHook = useGitHubLens(project);

  if (!project || typeof project.id === "undefined") {
    console.error(
      "ProjectStatusCard received null/undefined project or project without an id:",
      project
    );
    return (
      <MuiPaper
        key="error-card-invalid-project"
        sx={{ p: 2, border: "2px solid red", m: 1 }}
      >
        <Typography color="error" variant="h6">
          {" "}
          Error: Invalid Project Data{" "}
        </Typography>
        <Typography>
          This card could not be rendered due to missing project information.
        </Typography>
      </MuiPaper>
    );
  }

  const {
    id: projectId,
    name: projectName,
    updated_at,
    manual_priority_override,
    calculated_priority_score,
    vercel_project_id,
    latest_prod_deployment_url,
  } = project;
  const isManuallyOverridden =
    manual_priority_override !== null && manual_priority_override !== undefined;
  const handleExpandClick = () => setExpanded(!expanded);

  const actualLiveProdUrl =
    vercelLiveDeploymentDetail?.url || latest_prod_deployment_url;
  const projectDomain = actualLiveProdUrl
    ? new URL(`https://${actualLiveProdUrl.replace(/^https?:\/\//, "")}`)
        .hostname
    : undefined;

  const lastUpdatedString = convertEpochToDateString(updated_at);

  const lensesForCluster = [
    vercelLensPropsFromHook,
    gitHubLensPropsFromHook,
    {
      id: `${project.id}-analytics`,
      status: "neutral",
      icon: ShowChartIcon,
      label: "Analytics (N/A)",
    },
  ];

  return (
    <StyledProjectCardPaper elevation={3}>
      {/* Top Bar: Project Info & Lens Cluster */}
      <Box sx={topBarStyle(theme)}>
        <Box
          sx={{
            ...projectInfoBoxStyle,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {" "}
          {/* Ensure this box can grow and align items */}
          <div>
            {" "}
            {/* Top part of the info box */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
            >
              {isManuallyOverridden && (
                <Tooltip
                  title={`Priority Manually Overridden (Score: ${manual_priority_override}, Calculated: ${
                    calculated_priority_score ?? "N/A"
                  })`}
                >
                  <VolunteerActivismIcon
                    sx={{
                      fontSize: "1rem",
                      color: theme.palette.text.secondary,
                    }}
                  />
                </Tooltip>
              )}
              <Typography
                variant="h6"
                component="h2"
                title={projectName}
                sx={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontStyle: "italic",
                  color: "text.secondary",
                  display: "block",
                  mb: 0.5,
                }}
              >
                {projectName}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{ mb: 0.5 }}
            >
              Updated: {lastUpdatedString}
            </Typography>
            {projectDomain ? (
              <MuiLink
                href={`https://${projectDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                title={projectDomain}
                sx={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.875rem",
                  textDecorationLine: "underline",
                  color: "primary.main",
                  wordBreak: "break-all",
                  display: "block",
                  mb: 0.5,
                }}
              >
                &quot;{projectDomain}&quot;
              </MuiLink>
            ) : (
              !isLoadingVercelDeployment &&
              vercel_project_id && (
                <Typography
                  variant="caption"
                  sx={{ color: "text.disabled", display: "block", mb: 0.5 }}
                >
                  {" "}
                  No production domain{" "}
                </Typography>
              )
            )}
          </div>
          {/* Mini Lifeline Sparkline - Placed at the bottom of the info section */}
          <Box sx={{ width: "100%", mt: "auto", py: 0.5 }}>
            {" "}
            {/* mt: 'auto' pushes it to bottom if parent is flex column */}
            <Sparkline projectId={projectId} height={20} timeRange="7d" />{" "}
            {/* Adjust height and timeRange */}
          </Box>
        </Box>
        <Box sx={lensClusterContainerStyle}>
          {isLoadingVercelDeployment && vercel_project_id ? (
            <PanopticonSpinner size={76} />
          ) : (
            <LensCluster lensesInput={lensesForCluster} />
          )}
        </Box>
      </Box>

      {/* Actions Bar: Edit Button & Details Expander */}
      <Box sx={actionsAndExpandControlBoxStyle}>
        <EditButton
          resource="projects" // Ensure this matches your Refine resource name
          recordItemId={project.id}
          size="small"
          variant="text" // Use "text" for a less prominent button in the actions bar
          sx={{ mr: 1 }} // Add some margin to the right
          // hideText // Optionally hide text if you want icon only, but text is good for clarity
        />
        <Stack
          direction="row"
          alignItems="center"
          onClick={handleExpandClick}
          sx={{ cursor: "pointer" }}
        >
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mr: 0.5 }}
          >
            Details
          </Typography>
          <ExpandMore
            expand={expanded}
            // onClick={handleExpandClick} // Moved onClick to Stack for larger clickable area
            aria-expanded={expanded}
            aria-label="show more"
            size="small"
          >
            <ExpandMoreIcon sx={{ color: "text.secondary" }} />
          </ExpandMore>
        </Stack>
      </Box>

      {/* Collapsible Details Section */}
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        sx={{ flexGrow: 1, overflowY: "auto" }}
      >
        <ProjectCardDetails
          project={project}
          deploymentDetail={vercelLiveDeploymentDetail}
          deploymentError={vercelDeploymentError}
          actualLiveProdUrl={actualLiveProdUrl}
        />
      </Collapse>
    </StyledProjectCardPaper>
  );
};
