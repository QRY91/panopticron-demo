"use client";

import React, { useState, useEffect } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Chip,
  useTheme,
  Tooltip,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import { EditButton as RefineEditButton } from "@refinedev/mui";
import { ISupabaseProject } from "@/interfaces/supabase";
import { StatusCell, getPriorityDisplayProps } from "./statusUtils";
import { ProjectLifelineChart } from "@/components/project/status-card/ProjectLifelineChart";
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { Link as MuiLink } from '@mui/material';

interface CompactProjectRowProps {
  project: ISupabaseProject & { priority_sort_key?: number | null };
  isGloballyExpanded?: boolean | null;
}

export const CompactProjectRow: React.FC<CompactProjectRowProps> = ({
  project,
  isGloballyExpanded,
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (isGloballyExpanded !== null && isGloballyExpanded !== undefined) {
      setOpen(isGloballyExpanded);
    }
  }, [isGloballyExpanded]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("nl-BE", {
        /* ... */
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Get priority display properties
  const priorityProps = getPriorityDisplayProps(
    project.priority_sort_key,
    theme
  );
  const PriorityIcon = priorityProps.icon;
  const isManuallyOverridden = project.manual_priority_override !== null && project.manual_priority_override !== undefined;

    // Style for individual detail items in the collapse section to allow wrapping
  const detailItemStyle = {
    display: 'flex',       // Use flex to keep label and value together if needed, or just for block
    flexDirection: 'column', // Stack label and value
    overflowWrap: 'break-word', // Allows long words/strings to break and wrap
    wordBreak: 'break-all',     // More aggressive breaking if needed (for URLs without spaces)
    minWidth: 0, // Important for flex children to wrap correctly
  };
  const detailValueStyle = {
    // overflowWrap: 'break-word', // Already on parent, but can be here too
    // wordBreak: 'break-all',     // Already on parent
  };

  return (
    <>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: priorityProps.backgroundColor,
          // Transition for smooth color change if priority updates live (optional)
          transition: theme.transitions.create('background-color', {
            duration: theme.transitions.duration.short,
          }),
          "&:hover": {
            backgroundColor:
              alpha(priorityProps.backgroundColor, 0.7) ||
              alpha(theme.palette.action.hover, 0.2),
          },
        }}
      >
        {/* Priority Indicator Cell - Corrected for side-by-side icons */}
        <TableCell
          sx={{
            width: "auto", // Allow width to adjust for two icons
            padding: "6px 4px 6px 8px", // Adjust padding as needed
            textAlign: "center",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25 }}> {/* Flex container */}
            {isManuallyOverridden && (
              <Tooltip title={`Priority Manually Overridden (Set to: ${project.manual_priority_override}, Calculated: ${project.calculated_priority_score ?? 'N/A'})`}>
                <VolunteerActivismIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary, verticalAlign: 'middle' }} />
              </Tooltip>
            )}
            {PriorityIcon && (
              <Tooltip
                title={`Priority: ${priorityProps.label} (Score: ${project.priority_sort_key ?? "N/A"})`}
                placement="right"
              >
                <PriorityIcon
                  sx={{
                    color: priorityProps.color,
                    fontSize: "1.1rem",
                    verticalAlign: "middle",
                  }}
                />
              </Tooltip>
            )}
          </Box>
        </TableCell>
        {/* Expand/Collapse Cell */}
        <TableCell sx={{ width: "40px", padding: "6px" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/* Project Name Cell */}
        <TableCell
          component="th"
          scope="row"
          sx={{ padding: "6px 10px", fontWeight: "medium" }}
        >
          {project.name}
        </TableCell>
        {/* Vercel Status Cell */}
        <TableCell align="left" sx={{ padding: "6px 10px" }}>
          <StatusCell
            status={project.latest_prod_deployment_status}
            type="vercel"
            href={
              project.vercel_project_id && project.vercel_org_slug
                ? `https://vercel.com/${project.vercel_org_slug}/${project.name}`
                : project.vercel_project_id
                ? `https://vercel.com/dashboard/projects/${project.vercel_project_id}`
                : undefined
            }
          />
        </TableCell>

        {/* GitHub CI Status Cell */}
        <TableCell align="left" sx={{ padding: "6px 10px" }}>
          <StatusCell
            status={project.github_repo_url ? project.github_ci_status : "N/A"}
            type="github"
            href={project.github_ci_url || undefined}
          />
        </TableCell>
        {/* Framework Cell */}
        <TableCell align="left" sx={{ padding: "6px 10px" }}>
          <Chip
            label={project.vercel_framework || "N/A"}
            size="small"
            variant="outlined"
          />
        </TableCell>
        {/* Actions Cell */}
        <TableCell align="center" sx={{ padding: "0px 6px" }}>
          <Tooltip title="Edit Project Priority">
            {/* Refine's EditButton handles navigation to the edit page */}
            <RefineEditButton
              resource="projects"
              recordItemId={project.id}
              size="small"
              hideText 
              svgIconProps={{ fontSize: "small" }}
            />
          </Tooltip>
          {/* You can add more IconButtons here for other actions later */}
        </TableCell>
      </TableRow>
      {/* Collapse Row */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <Paper variant="outlined" sx={{ p: 2, m:1, mt:0 }}> {/* Added m:1, mt:0 for consistent spacing from row above */}
              <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                Project Details
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}> {/* Increased gap slightly */}
                
                <Box sx={detailItemStyle}>
                  <Typography variant="caption" display="block" color="textSecondary">Priority Score:</Typography>
                  <Typography variant="body2" sx={{color: priorityProps.color, fontWeight: 'bold', ...detailValueStyle}}>
                    {project.priority_sort_key ?? 'N/A'} ({priorityProps.label})
                    {isManuallyOverridden && ` (Manually set from ${project.calculated_priority_score ?? 'N/A'})`}
                  </Typography>
                </Box>
                
                <Box sx={detailItemStyle}>
                  <Typography variant="caption" display="block" color="textSecondary">Last Synced:</Typography>
                  <Typography variant="body2" sx={detailValueStyle}>{formatDate(project.last_synced_at)}</Typography>
                </Box>

                <Box sx={detailItemStyle}>
                  <Typography variant="caption" display="block" color="textSecondary">Default Branch:</Typography>
                  <Typography variant="body2" sx={detailValueStyle}>{project.github_default_branch || "N/A"}</Typography>
                </Box>

                <Box sx={detailItemStyle}>
                  <Typography variant="caption" display="block" color="textSecondary">Vercel Project ID:</Typography>
                  <Typography variant="body2" sx={detailValueStyle}>{project.vercel_project_id || "N/A"}</Typography>
                </Box>

                <Box sx={detailItemStyle}>
                  <Typography variant="caption" display="block" color="textSecondary">GitHub Repo URL:</Typography>
                  <Typography component="div" variant="body2" sx={detailValueStyle}> {/* Changed to div for better block behavior if needed */}
                    {project.github_repo_url ? 
                        <MuiLink href={project.github_repo_url} target="_blank" rel="noopener noreferrer">{project.github_repo_url}</MuiLink> 
                        : "N/A"
                    }
                  </Typography>
                </Box>

                <Box sx={detailItemStyle}>
                  <Typography variant="caption" display="block" color="textSecondary">Vercel Org Slug:</Typography>
                  <Typography variant="body2" sx={detailValueStyle}>{project.vercel_org_slug || "N/A"}</Typography>
                </Box>

                <Box sx={detailItemStyle}>
                  <Typography variant="caption" display="block" color="textSecondary">Created At (DB):</Typography>
                  <Typography variant="body2" sx={detailValueStyle}>{formatDate(project.created_at)}</Typography>
                </Box>

                <Box sx={detailItemStyle}>
                  <Typography variant="caption" display="block" color="textSecondary">Vercel Created At:</Typography>
                  <Typography variant="body2" sx={detailValueStyle}>{formatDate(project.vercel_created_at)}</Typography>
                </Box>

              </Box>
            </Paper>
            {open && project.id && <Box sx={{m:1, mt:0}}><ProjectLifelineChart projectId={project.id} /></Box>}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
