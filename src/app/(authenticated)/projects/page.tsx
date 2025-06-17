// src/app/(authenticated)/projects/page.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Removed useMemo
import { useList, type RefineError } from "@refinedev/core";
import {
  Box, Grid, Typography, TextField, InputAdornment,
  Pagination, Stack, Alert, Container
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { ISupabaseProject } from "@interfaces/supabase";
import { ProjectStatusCard } from "@components/project/status-card";
import PanopticonSpinner from '@components/loaders/PanopticonSpinner';

// Define the expected shape of project data from useList, including the optional sort key
type ProjectWithSortKey = ISupabaseProject & {
  priority_sort_key?: number | null;
};

export default function ProjectListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12); 
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); 
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const {
    data: projectsResponseObject,
    isLoading,
    isError,
    error,
  } = useList<ProjectWithSortKey, RefineError>({ // Use ProjectWithSortKey
    resource: "projects",
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      mode: "server",
    },
    filters: debouncedSearchTerm
      ? [{ field: "name", operator: "contains", value: debouncedSearchTerm }]
      : [],
    sorters: [ // ADD SERVER-SIDE SORTING
      { field: "priority_sort_key", order: "asc" },
      { field: "name", order: "asc" } // Secondary sort
    ],
    queryOptions: {
      // keepPreviousData: true, 
    },
  });

  // Data is now pre-sorted by the server based on priority_sort_key
  const projectsToDisplay: ProjectWithSortKey[] = projectsResponseObject?.data || [];
  const totalProjects: number = projectsResponseObject?.total || 0;
  const pageCount = Math.ceil(totalProjects / pageSize);


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Initial loading state (before first data fetch)
  if (isLoading && projectsToDisplay.length === 0 && currentPage === 1) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
        <PanopticonSpinner size={80} />
        <Typography sx={{mt: 2, color: 'text.secondary'}}>Loading Projects...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
        <Container> 
            <Typography variant="h5" sx={{mb: 2}}>Projects</Typography>
            <Alert severity="error" sx={{p: 2}}>Error loading projects: {error?.message || "Unknown error"}</Alert>
        </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Monitored Projects
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Search Projects by Name"
        placeholder="Enter project name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Loading spinner for subsequent page loads or filtering */}
      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><PanopticonSpinner size={32} /></Box>}

      {projectsToDisplay.length > 0 ? (
        <Grid container spacing={3}>
          {projectsToDisplay.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={project.id}>
              <ProjectStatusCard project={project} />
            </Grid>
          ))}
        </Grid>
      ) : (
        !isLoading && <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            No projects found{debouncedSearchTerm && ' matching your search criteria'}.
        </Typography>
      )}

      {totalProjects > pageSize && (
        <Stack spacing={2} sx={{ mt: 4, mb:2, alignItems: 'center' }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Stack>
      )}
    </Container>
  );
}