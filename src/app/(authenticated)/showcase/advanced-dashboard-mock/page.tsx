import React from 'react';
import { AdvancedDashboardTable } from '@/components/dashboard/advanced-table/AdvancedDashboardTable'; // Adjusted path
import { Box, Typography, Link as MuiLink, Breadcrumbs } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ISupabaseProject } from '@/interfaces/supabase';

// --- TEMPORARY: Using mock data for initial setup ---
import { mockProjects as showcaseMockProjects } from "@/app/(authenticated)/showcase/showcase.mockdata";
// --- END TEMPORARY MOCK DATA ---

// Example function to prepare mock data 
const getProcessedMockProjects = (): (ISupabaseProject & { priority_sort_key?: number | null })[] => {
  return Object.values(showcaseMockProjects).map((p, index) => ({
    ...p,
    priority_sort_key: p.id.includes('ideal') ? 1 : p.id.includes('error') ? 2 : p.id.includes('pending') ? 3 : index + 4,
  }));
};

export default function AdvancedDashboardMockPage() {
  const projectsToDisplay = getProcessedMockProjects();

  return (
    <Box sx={{ p: 2 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{mb: 2}}>
          <MuiLink underline="hover" color="inherit" href="/showcase">
            Showcase
          </MuiLink>
        <Typography color="text.primary">Advanced Dashboard Mock</Typography>
      </Breadcrumbs>
      <AdvancedDashboardTable projects={projectsToDisplay} />
    </Box>
  );
}