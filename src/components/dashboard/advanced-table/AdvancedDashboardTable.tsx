'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import { ISupabaseProject } from '@/interfaces/supabase';
import { CompactProjectRow } from './CompactProjectRow';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

interface AdvancedDashboardTableProps {
  projects: (ISupabaseProject & { priority_sort_key?: number | null })[];
  allRowsExpanded?: boolean | null;
}

export const AdvancedDashboardTable: React.FC<AdvancedDashboardTableProps> = ({ projects, allRowsExpanded }) => {
  const sortedProjects = [...projects].sort((a, b) => {
    const keyA = typeof a.priority_sort_key === 'number' ? a.priority_sort_key : Infinity;
    const keyB = typeof b.priority_sort_key === 'number' ? b.priority_sort_key : Infinity;
    return keyA - keyB;
  });

  if (projects.length === 0) {
    return (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">No projects found.</Typography>
            <Typography color="text.secondary">Once you add projects, they will appear here.</Typography>
        </Paper>
    );
  }

  return (
    <Box sx={{ padding: 0 }}>
      <TableContainer component={Paper} elevation={2}>
        <Table aria-label="collapsible project table" size="small">
          <TableHead sx={{ backgroundColor: 'action.hover' }}>
            <TableRow>
              {/* Header for Priority Indicator */}
              <TableCell sx={{ width: '30px', padding: '6px 0px 6px 8px', textAlign: 'center', fontWeight: 'bold' }}>
                <Tooltip title="Project Priority">
                   <PriorityHighIcon sx={{fontSize: '1rem', verticalAlign: 'middle'}}/>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ width: '40px', padding: '6px' }} /> {/* For expand icon */}
              <TableCell sx={{ padding: '6px 10px', fontWeight: 'bold' }}>Project Name</TableCell>
              <TableCell align="left" sx={{ padding: '6px 10px', fontWeight: 'bold', minWidth: '120px' }}>Vercel</TableCell>
              <TableCell align="left" sx={{ padding: '6px 10px', fontWeight: 'bold', minWidth: '120px' }}>GitHub CI</TableCell>
              <TableCell align="left" sx={{ padding: '6px 10px', fontWeight: 'bold', minWidth: '100px' }}>Framework</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProjects.map((project) => (
              <CompactProjectRow
                key={project.id}
                project={project}
                isGloballyExpanded={allRowsExpanded}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};