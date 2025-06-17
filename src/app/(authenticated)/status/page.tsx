//src/app/(authenticated)/status/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  Box,
  Divider,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  TablePagination,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { CiTestRunsTable } from "@components/status/CiTestRunsTable";
import { CiTestRun } from "@/types/ci";
import { mockWorkerRuns, mockCiTestRuns } from "@/mock/status-data";

interface WorkerRun {
  id: string;
  worker_name: string;
  started_at: string;
  ended_at?: string;
  status: string;
  summary_message?: string;
  error_details?: any;
  created_at: string;
}

function formatDateTime(isoString?: string) {
  if (!isoString) return "N/A";
  try {
    return new Date(isoString).toLocaleString("nl-BE"); // Or your preferred locale
  } catch (e) {
    return isoString;
  }
}

function StatusChip({ status }: { status: string }) {
  let color: "success" | "warning" | "error" | "info" | "default" = "default";
  if (status === "Success") color = "success";
  else if (status === "Partial Success") color = "warning";
  else if (status === "Failure") color = "error";
  else if (status === "Started") color = "info";
  return <Chip label={status} color={color} size="small" />;
}

const MIN_TABLE_AREA_HEIGHT = 400;

export default function AppStatusPage() {
  // State for Worker Runs
  const [workerRuns, setWorkerRuns] = useState<WorkerRun[]>([]);
  const [workerRunsLoading, setWorkerRunsLoading] = useState(true);
  const [isFetchingMoreWorkerRuns, setIsFetchingMoreWorkerRuns] =
    useState(false);
  const [workerRunsError, setWorkerRunsError] = useState<string | null>(null);
  const [workerPage, setWorkerPage] = useState(0);
  const [workerRowsPerPage, setWorkerRowsPerPage] = useState(10);
  const [workerTotalRows, setWorkerTotalRows] = useState(0);

  // State for CI Test Runs
  const [ciTestRuns, setCiTestRuns] = useState<CiTestRun[]>([]);
  const [ciTestRunsLoading, setCiTestRunsLoading] = useState(true);
  const [ciTestRunsError, setCiTestRunsError] = useState<string | null>(null);

  // Load mock worker runs
  useEffect(() => {
    setWorkerRunsLoading(true);
    try {
      // Convert mock data to match WorkerRun interface
      const mockRuns: WorkerRun[] = mockWorkerRuns.map((run, index) => ({
        id: `mock-${index}`,
        worker_name: run.worker_name,
        started_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        ended_at: run.ended_at,
        status: run.status,
        summary_message: run.summary_message,
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      }));
      setWorkerRuns(mockRuns);
      setWorkerTotalRows(mockRuns.length);
    } catch (error) {
      setWorkerRunsError("Error loading mock worker runs");
    }
    setWorkerRunsLoading(false);
  }, []);

  // Load mock CI test runs
  useEffect(() => {
    setCiTestRunsLoading(true);
    try {
      setCiTestRuns(mockCiTestRuns);
    } catch (error) {
      setCiTestRunsError("Error loading mock CI test runs");
    }
    setCiTestRunsLoading(false);
  }, []);

  const handleChangeWorkerPage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setWorkerPage(newPage);
  };

  const handleChangeWorkerRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setWorkerRowsPerPage(parseInt(event.target.value, 10));
    setWorkerPage(0);
  };

  const renderWorkerTableBody = () => {
    if (isFetchingMoreWorkerRuns && workerRuns.length > 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
            <CircularProgress size={24} />
            <Typography variant="caption" sx={{ ml: 1 }}>
              Loading more...
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (
      workerRuns.length === 0 &&
      !workerRunsLoading &&
      !isFetchingMoreWorkerRuns
    ) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
            <Typography>No worker runs found for this page.</Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (workerRunsLoading && workerRuns.length === 0) {
      return Array.from(new Array(workerRowsPerPage)).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
        </TableRow>
      ));
    }

    return workerRuns
      .slice(
        workerPage * workerRowsPerPage,
        (workerPage + 1) * workerRowsPerPage
      )
      .map((run) => (
        <TableRow key={run.id}>
          <TableCell>
            <StatusChip status={run.status} />
          </TableCell>
          <TableCell>{run.worker_name}</TableCell>
          <TableCell>{formatDateTime(run.started_at)}</TableCell>
          <TableCell>{formatDateTime(run.ended_at)}</TableCell>
          <TableCell>{run.summary_message || "N/A"}</TableCell>
          <TableCell>
            {run.error_details ? (
              <Tooltip title={JSON.stringify(run.error_details, null, 2)}>
                <Typography variant="body2" color="error">
                  View Error
                </Typography>
              </Tooltip>
            ) : (
              "N/A"
            )}
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        System Status
      </Typography>

      {/* Worker Runs Section */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Worker Runs
          </Typography>
        </Box>
        <Divider />
        {workerRunsError && (
          <Alert severity="error" sx={{ m: 2 }}>
            {workerRunsError}
          </Alert>
        )}
        <TableContainer sx={{ minHeight: MIN_TABLE_AREA_HEIGHT }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Worker</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Ended</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>Error Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderWorkerTableBody()}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={workerTotalRows}
          page={workerPage}
          onPageChange={handleChangeWorkerPage}
          rowsPerPage={workerRowsPerPage}
          onRowsPerPageChange={handleChangeWorkerRowsPerPage}
        />
      </Paper>

      {/* CI Test Runs Section */}
      <Paper>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            CI Test Runs
          </Typography>
        </Box>
        <Divider />
        {ciTestRunsError && (
          <Alert severity="error" sx={{ m: 2 }}>
            {ciTestRunsError}
          </Alert>
        )}
        <CiTestRunsTable runs={ciTestRuns} isLoading={ciTestRunsLoading} />
      </Paper>
    </Container>
  );
}
