"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Stack,
  Pagination,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid, // Added Select, MenuItem, FormControl, InputLabel, Grid
  Tooltip,
  alpha,
} from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList"; // Icon for filter section
import ClearIcon from "@mui/icons-material/Clear"; // Icon to clear filters
import { AdvancedDashboardTable } from "@/components/dashboard/advanced-table/AdvancedDashboardTable";
import Ticker, { TickerItem } from "@/components/ticker/Ticker";
import { ISupabaseProject } from "@/interfaces/supabase";
import { useList, HttpError, LogicalFilter } from "@refinedev/core";

// Ticker data
const deploymentTickerItems: TickerItem[] = [
  {
    id: "dep-1",
    message: 'Project "Omega" successfully deployed to production.',
    type: "success",
    timestamp: "11:32 AM",
    link: "/projects/omega",
  },
  {
    id: "dep-2",
    message: 'Vercel build for "Alpha-Feature-Branch" completed.',
    type: "info",
    timestamp: "11:28 AM",
  },
  {
    id: "dep-3",
    message: 'Deployment of "Legacy System X" rolled back due to errors.',
    type: "error",
    timestamp: "11:15 AM",
    link: "/projects/legacy-x/deployments",
  },
  {
    id: "dep-4",
    message: 'Project "Gamma" staging deployment ready for review.',
    type: "info",
    timestamp: "11:05 AM",
  },
];
const ciAlertTickerItems: TickerItem[] = [
  {
    id: "ci-1",
    message: 'GitHub CI: "Main" branch for Project "Delta" is FAILING!',
    type: "error",
    timestamp: "11:30 AM",
    link: "/projects/delta/ci",
  },
  {
    id: "ci-2",
    message: 'GitHub CI: "Release-v2" for Project "Epsilon" PASSED.',
    type: "success",
    timestamp: "11:25 AM",
  },
  {
    id: "ci-3",
    message: 'GitHub CI: Project "Sigma" build is PENDING.',
    type: "warning",
    timestamp: "11:20 AM",
  },
];
const generalAlertsTickerItems: TickerItem[] = [
  {
    id: "alert-1",
    message: 'High error rate detected on "Auth Service". Investigating.',
    type: "error",
    timestamp: "10:55 AM",
  },
  {
    id: "alert-2",
    message: "Analytics: Significant traffic increase on landing page.",
    type: "info",
    timestamp: "10:40 AM",
  },
  {
    id: "alert-3",
    message: 'User "test@example.com" awaiting admin approval.',
    type: "warning",
    timestamp: "10:30 AM",
  },
];
// --- End Ticker Data ---

type ProjectWithSortKey = ISupabaseProject & {
  priority_sort_key?: number | null;
};
const ITEMS_PER_PAGE = 20;

// Define options for filters (can be dynamic if needed)
const VERCEL_STATUS_OPTIONS = [
  "READY",
  "BUILDING",
  "ERROR",
  "QUEUED",
  "CANCELLED",
];
const GITHUB_CI_STATUS_OPTIONS = [
  "success",
  "failure",
  "in_progress",
  "pending",
  "cancelled",
  "skipped",
  "unknown_branch",
];
// For frameworks, you might want to fetch distinct values from your DB or have a predefined list
const FRAMEWORK_OPTIONS = [
  "nextjs",
  "vite",
  "remix",
  "gatsby",
  "docusaurus",
  "html",
  "nuxtjs",
  "sveltekit",
];

export default function DashboardPage() {
  const [allRowsExpanded, setAllRowsExpanded] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedVercelStatus, setSelectedVercelStatus] = useState("");
  const [selectedCiStatus, setSelectedCiStatus] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("");

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Effect to reset page when filters change (excluding debouncedSearchTerm as it's handled above)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVercelStatus, selectedCiStatus, selectedFramework]);

  // Prepare filters for useList
  const filters = useMemo(() => {
    const activeFilters: LogicalFilter[] = [];
    if (debouncedSearchTerm) {
      activeFilters.push({
        field: "name",
        operator: "contains",
        value: debouncedSearchTerm,
      });
    }
    if (selectedVercelStatus) {
      activeFilters.push({
        field: "latest_prod_deployment_status",
        operator: "eq",
        value: selectedVercelStatus,
      });
    }
    if (selectedCiStatus) {
      activeFilters.push({
        field: "github_ci_status",
        operator: "eq",
        value: selectedCiStatus,
      });
    }
    if (selectedFramework) {
      activeFilters.push({
        field: "vercel_framework",
        operator: "eq",
        value: selectedFramework,
      });
    }
    return activeFilters;
  }, [
    debouncedSearchTerm,
    selectedVercelStatus,
    selectedCiStatus,
    selectedFramework,
  ]);

  const {
    data: projectsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useList<ProjectWithSortKey, HttpError>({
    resource: "projects",
    pagination: {
      current: currentPage,
      pageSize: ITEMS_PER_PAGE,
      mode: "server",
    },
    sorters: [
      { field: "priority_sort_key", order: "asc" },
      { field: "name", order: "asc" },
    ],
    filters: filters,
  });

  const projects = projectsResponse?.data || [];
  const totalProjects = projectsResponse?.total || 0;
  const pageCount = Math.ceil(totalProjects / ITEMS_PER_PAGE);

  const handleToggleAllRows = () => setAllRowsExpanded((prev) => !prev);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) =>
    setCurrentPage(value);

  const clearFilters = () => {
    setSearchTerm(""); // This will also clear debouncedSearchTerm via useEffect
    setSelectedVercelStatus("");
    setSelectedCiStatus("");
    setSelectedFramework("");
    // setCurrentPage(1); // Already handled by useEffects for search and filters
  };
  // trigger deploy again
  const hasActiveFilters = Boolean(
    debouncedSearchTerm ||
      selectedVercelStatus ||
      selectedCiStatus ||
      selectedFramework
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Ticker Section */}
      <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1 }}>
        <Paper
          elevation={1}
          sx={{
            p: 0.5,
            overflow: "hidden",
            backgroundColor: "action.selected",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="overline"
              sx={{ px: 1, opacity: 0.7, whiteSpace: "nowrap" }}
            >
              Deployments:
            </Typography>
            <Ticker initialItems={deploymentTickerItems} speed={90} />
          </Box>
        </Paper>
        <Paper
          elevation={1}
          sx={{ p: 0.5, overflow: "hidden", backgroundColor: "action.hover" }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="overline"
              sx={{ px: 1, opacity: 0.7, whiteSpace: "nowrap" }}
            >
              CI/CD Alerts:
            </Typography>
            <Ticker initialItems={ciAlertTickerItems} speed={110} />
          </Box>
        </Paper>
        <Paper elevation={1} sx={{ p: 0.5, overflow: "hidden" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="overline"
              sx={{ px: 1, opacity: 0.7, whiteSpace: "nowrap" }}
            >
              General Updates:
            </Typography>
            <Ticker initialItems={generalAlertsTickerItems} speed={75} />
          </Box>
        </Paper>
      </Box>

      {/* Filter and Actions Bar */}
      <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Input */}
          <Grid item xs={12} sm={6} md={4} lg={3.5}>
            <TextField
              fullWidth
              label="Search by Name"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {/* Filter Selects */}
          <Grid item xs={6} sm={3} md={2} lg={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Vercel Status</InputLabel>
              <Select
                value={selectedVercelStatus}
                label="Vercel Status"
                onChange={(e) => setSelectedVercelStatus(e.target.value)}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {VERCEL_STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={2} lg={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>GitHub CI</InputLabel>
              <Select
                value={selectedCiStatus}
                label="GitHub CI"
                onChange={(e) => setSelectedCiStatus(e.target.value)}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {GITHUB_CI_STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={2} lg={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Framework</InputLabel>
              <Select
                value={selectedFramework}
                label="Framework"
                onChange={(e) => setSelectedFramework(e.target.value)}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {FRAMEWORK_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Action Buttons Area - using Stack for better control */}
          <Grid item xs={12} sm={3} md={2} lg={4}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              alignItems="center"
            >
              {hasActiveFilters && (
                <Button
                  variant="text"
                  size="small"
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                  sx={{ minWidth: "auto" }}
                >
                  {" "}
                  {/* Allow button to shrink */}
                  Clear
                </Button>
              )}
              {projects.length > 0 && !isLoading && (
                <Tooltip
                  title={
                    allRowsExpanded
                      ? "Collapse All Details"
                      : "Expand All Details"
                  }
                >
                  <IconButton onClick={handleToggleAllRows} size="small">
                    {allRowsExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Refresh project list">
                <IconButton
                  onClick={() => refetch()}
                  size="small"
                  disabled={isLoading}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      {/* Table Section */}
      {isLoading &&
      projects.length === 0 &&
      currentPage === 1 &&
      !debouncedSearchTerm ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            flexDirection: "column",
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading projects...</Typography>
        </Box>
      ) : isError ? (
        <Alert severity="error">
          Error loading projects:{" "}
          {error?.message || "An unknown error occurred."}
        </Alert>
      ) : (
        <>
          {/* Inline loading indicator for subsequent loads/filters if not covered by main loader */}
          {isLoading && (projects.length > 0 || debouncedSearchTerm) && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {projects.length > 0 ? (
            <AdvancedDashboardTable
              projects={projects}
              allRowsExpanded={allRowsExpanded}
            />
          ) : (
            !isLoading && ( // Only show "no projects" if not loading
              <Typography
                sx={{
                  textAlign: "center",
                  mt: 4,
                  p: 3,
                  color: "text.secondary",
                }}
              >
                {debouncedSearchTerm
                  ? `No projects found matching "${debouncedSearchTerm}".`
                  : "No projects to display."}
              </Typography>
            )
          )}

          {totalProjects > ITEMS_PER_PAGE && (
            <Stack spacing={2} sx={{ mt: 3, mb: 2, alignItems: "center" }}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
