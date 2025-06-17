// src/components/project/status-card/ProjectCardDetails.tsx
"use client"; // If it uses client-side hooks or MUI components directly

import React from "react";
import {
  Typography,
  Link as MuiLink,
  Box,
  Grid,
  CardContent,
  Button,
  useTheme, // For potential theme-dependent styles if any are specific here
  alpha
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";

import type { ISupabaseProject } from "@interfaces/supabase";
import type { IVercelDeploymentDetail } from "@interfaces/vercel"; // If passed directly
import { convertEpochToDateString } from "@utils/formatters"; // Adjust path

// Props for the details component
interface ProjectCardDetailsProps {
  project: ISupabaseProject; // Pass the full project object
  deploymentDetail: IVercelDeploymentDetail | null | undefined; // Pass the fetched deployment detail
  deploymentError: RefineError | null; // Pass any error from fetching deployment
  actualLiveProdUrl?: string | null; // Pass the determined live URL
  // Add any other specific derived data if needed, or let it derive from project/deploymentDetail
  sx?: BoxProps['sx']; // Allow passing sx for the CardContent
}

// Style object for the collapsed content area (copied from ProjectStatusCard)
// Or import if you move ProjectStatusCard styles to a separate file
const collapsedContentStyle = (theme: Theme) => ({ // Assuming Theme is imported
    backgroundColor: theme.palette.mode === "dark"
        ? alpha(theme.palette.background.paper, 0.85)
        : theme.palette.grey[50],
    color: theme.palette.text.primary,
    paddingTop: theme.spacing(1),
});

const quickLinksTitleStyle = (theme: Theme) => ({
    color: theme.palette.text.secondary,
    mb: 0.5
});

const quickLinksContainerStyle = {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap'
};


export const ProjectCardDetails: React.FC<ProjectCardDetailsProps> = ({
  project,
  deploymentDetail,
  deploymentError,
  actualLiveProdUrl,
  sx
}) => {
  const theme = useTheme(); // For styles defined within this component

  // Destructure directly from project prop for clarity within this component
  const {
    id: supabaseProjectId,
    name: projectName,
    created_at,
    vercel_framework,
    vercel_node_version,
    vercel_project_id,
    vercel_org_slug,
    github_repo_url,
    // ... any other fields from ISupabaseProject needed ONLY for display here
  } = project;

  const createdAtString = convertEpochToDateString(created_at);

  return (
    <CardContent sx={{...collapsedContentStyle(theme), ...sx}}> {/* Apply passed sx */}
      <Grid container spacing={1.5}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Supabase ID:</Typography>
          <Typography variant="body2" sx={{ wordBreak: "break-all", color: "text.primary" }}>{supabaseProjectId}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Vercel ID:</Typography>
          <Typography variant="body2" sx={{ wordBreak: "break-all", color: "text.primary" }}>{vercel_project_id || "N/A"}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Framework:</Typography>
          <Typography variant="body2" sx={{ color: "text.primary" }}>{vercel_framework || "N/A"}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Node Version:</Typography>
          <Typography variant="body2" sx={{ color: "text.primary" }}>{vercel_node_version || "N/A"}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Created At (Supabase):</Typography>
          <Typography variant="body2" sx={{ color: "text.primary" }}>{createdAtString}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>GitHub Repo:</Typography>
          {github_repo_url ? (
            <MuiLink href={github_repo_url} target="_blank" rel="noopener noreferrer">
              {github_repo_url.substring(github_repo_url.indexOf('github.com/') + 'github.com/'.length)}
            </MuiLink>
          ) : (
            <Typography variant="body2" sx={{color: "text.primary"}}>N/A</Typography>
          )}
        </Grid>

        {/* Display Deployment details fetched from API */}
        {deploymentDetail && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Latest Production Deployment:</Typography>
            <Typography variant="body2" sx={{ color: "text.primary" }}>State: {deploymentDetail.readyState}</Typography>
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              URL:
              <MuiLink href={`https://${deploymentDetail.url}`} target="_blank" rel="noopener noreferrer" sx={{ color: "primary.main", wordBreak: "break-all" }}>
                {deploymentDetail.url}
              </MuiLink>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary" }}>
              Created: {convertEpochToDateString(deploymentDetail.createdAt)}
            </Typography>
            {deploymentDetail.meta && Object.keys(deploymentDetail.meta).length > 0 && (
                <Box mt={1}>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>Deployment Meta:</Typography>
                  <pre style={{ fontSize: "0.7rem", backgroundColor: theme.palette.action.hover, padding: "4px", borderRadius: "4px", whiteSpace: "pre-wrap", wordBreak: "break-all", color: theme.palette.text.secondary }}>
                    {JSON.stringify(deploymentDetail.meta, null, 2)}
                  </pre>
                </Box>
            )}
          </Grid>
        )}
        {/* Display specific error from deployment fetch */}
        {deploymentError && (
          <Grid item xs={12}>
            <Typography color="error" variant="body2">
              Error fetching deployment: {(deploymentError as any)?.statusCode ? `(${(deploymentError as any).statusCode}) ` : ""}
              {(deploymentError as { message?: string })?.message || "Unknown fetch error"}
            </Typography>
          </Grid>
        )}

        {/* Quick Links Section */}
        {(actualLiveProdUrl || vercel_project_id || github_repo_url) && (
            <Grid item xs={12} sx={{pt: '16px !important'}}>
                <Typography variant="subtitle2" sx={quickLinksTitleStyle(theme)}>Quick Links:</Typography>
                <Box sx={quickLinksContainerStyle}>
                    {actualLiveProdUrl && (
                        <Button size="small" variant="outlined" startIcon={<LaunchIcon />} href={`https://${actualLiveProdUrl.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer">
                            Live Site
                        </Button>
                    )}
                    {vercel_project_id && (
                         <Button size="small" variant="outlined" startIcon={<CloudIcon />} href={`https://vercel.com/${vercel_org_slug || '_'}/${projectName}/deployments`} target="_blank" rel="noopener noreferrer">
                            Vercel Project
                        </Button>
                    )}
                    {github_repo_url && (
                        <Button size="small" variant="outlined" startIcon={<GitHubIcon />} href={github_repo_url} target="_blank" rel="noopener noreferrer">
                            GitHub Repo
                        </Button>
                    )}
                </Box>
            </Grid>
        )}
      </Grid>
    </CardContent>
  );
};

// Import Theme and BoxProps if using style objects that need them
import { Theme } from "@mui/material/styles";
import { BoxProps } from "@mui/material";
import { RefineError } from "@refinedev/core";
