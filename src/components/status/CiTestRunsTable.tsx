import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link as MuiLink,
  Chip,
  Typography,
  Tooltip,
  Box,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // For unknown or other statuses
import { CiTestRun } from '@/types/ci'; // Adjust path if you created a different types file
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

interface CiTestRunsTableProps {
  runs: CiTestRun[];
  isLoading?: boolean;
}

const getStatusChip = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'success':
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Success"
          color="success"
          size="small"
          variant="outlined"
        />
      );
    case 'failure':
      return (
        <Chip
          icon={<ErrorIcon />}
          label="Failure"
          color="error"
          size="small"
          variant="outlined"
        />
      );
    case 'cancelled':
      return (
        <Chip
          icon={<CancelIcon />}
          label="Cancelled"
          color="warning"
          size="small"
          variant="outlined"
        />
      );
    default:
      return (
        <Chip
          icon={<HelpOutlineIcon />}
          label={status || 'Unknown'}
          color="default"
          size="small"
          variant="outlined"
        />
      );
  }
};

const formatDuration = (ms: number | null): string => {
  if (ms === null || ms < 0) return 'N/A';
  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = seconds / 60;
  return `${minutes.toFixed(1)}m`;
};

export const CiTestRunsTable: React.FC<CiTestRunsTableProps> = ({ runs, isLoading }) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!runs || runs.length === 0) {
    return <Typography sx={{ p: 2 }}>No CI test run data available.</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="ci test runs table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Branch</TableCell>
            <TableCell>Commit</TableCell>
            <TableCell>Workflow</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {runs.map((run) => (
            <TableRow key={run.id}>
              <TableCell>{getStatusChip(run.status)}</TableCell>
              <TableCell>
                <Chip label={run.branch} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Tooltip title={run.commit_sha}>
                  <Typography variant="body2" component="span">
                    {run.commit_sha.substring(0, 7)}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>{run.workflow_name}</TableCell>
              <TableCell align="right">{formatDuration(run.duration_ms)}</TableCell>
              <TableCell>
                {run.completed_at ? (
                  <Tooltip title={new Date(run.completed_at).toLocaleString()}>
                    <Typography variant="body2">
                      {formatDistanceToNowStrict(parseISO(run.completed_at), { addSuffix: true })}
                    </Typography>
                  </Tooltip>
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>
                <MuiLink href={run.html_url} target="_blank" rel="noopener noreferrer">
                  View Run
                </MuiLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};