//src/app/(authenticated)/status/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react"; // Added useCallback
import { supabaseBrowserClient as supabase } from "@utils/supabase/client";
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
    useState(false); // For subsequent fetches
  const [workerRunsError, setWorkerRunsError] = useState<string | null>(null);
  const [workerPage, setWorkerPage] = useState(0); // Current page (0-indexed)
  const [workerRowsPerPage, setWorkerRowsPerPage] = useState(10); // Rows per page
  const [workerTotalRows, setWorkerTotalRows] = useState(0); // Total number of worker runs

  // State for CI Test Runs
  const [ciTestRuns, setCiTestRuns] = useState<CiTestRun[]>([]);
  const [ciTestRunsLoading, setCiTestRunsLoading] = useState(true);
  const [ciTestRunsError, setCiTestRunsError] = useState<string | null>(null);

  const fetchWorkerRuns = useCallback(
    async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setWorkerRunsLoading(true);
      } else {
        setIsFetchingMoreWorkerRuns(true); // Set true for page changes
      }
      setWorkerRunsError(null);

      const from = workerPage * workerRowsPerPage;
      const to = from + workerRowsPerPage - 1;

      const {
        data,
        error: fetchError,
        count,
      } = await supabase
        .from("worker_runs")
        .select("*", { count: "exact" })
        .order("started_at", { ascending: false })
        .range(from, to);

      if (fetchError) {
        console.error("Error fetching worker runs:", fetchError);
        setWorkerRunsError(fetchError.message);
        setWorkerRuns([]);
        setWorkerTotalRows(0);
      } else {
        setWorkerRuns(data || []);
        setWorkerTotalRows(count || 0);
      }
      if (isInitialLoad) {
        setWorkerRunsLoading(false);
      }
      setIsFetchingMoreWorkerRuns(false);
    },
    [workerPage, workerRowsPerPage]
  );

  useEffect(() => {
    fetchWorkerRuns(true); // Pass true for initial load
  }, [fetchWorkerRuns]); // fetchWorkerRuns is stable

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
  // useEffect for CI Test Runs (remains the same)
  useEffect(() => {
    const fetchCiTestRuns = async () => {
      setCiTestRunsLoading(true);
      setCiTestRunsError(null);
      const { data, error: fetchError } = await supabase
        .from("ci_test_runs")
        .select("*")
        .order("completed_at", { ascending: false, nullsFirst: false })
        .limit(15); // Assuming CI runs are not paginated for now, or apply similar logic

      if (fetchError) {
        console.error("Error fetching CI test runs:", fetchError);
        setCiTestRunsError(fetchError.message);
      } else {
        setCiTestRuns(data || []);
      }
      setCiTestRunsLoading(false);
    };
    fetchCiTestRuns();
  }, []);

  const renderWorkerTableBody = () => {
    if (isFetchingMoreWorkerRuns && workerRuns.length > 0) {
      // Show existing data slightly dimmed or with an overlay spinner
      // For simplicity, we'll just show a loading row, but you could overlay a spinner.
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

    // Render skeleton rows if it's the initial load and data is empty
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

    return workerRuns.map((run) => (
      <TableRow key={run.id}>
        <TableCell>{run.worker_name}</TableCell>
        <TableCell>
          <StatusChip status={run.status} />
        </TableCell>
        <TableCell>{formatDateTime(run.started_at)}</TableCell>
        <TableCell>{formatDateTime(run.ended_at)}</TableCell>
        <TableCell
          sx={{
            maxWidth: 250,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {run.summary_message ? (
            <Tooltip title={run.summary_message} arrow placement="top-start">
              <span>{run.summary_message}</span>
            </Tooltip>
          ) : (
            "N/A"
          )}
        </TableCell>
        <TableCell>
          {run.error_details && (
            <Tooltip
              title={
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {JSON.stringify(run.error_details, null, 2)}
                </pre>
              }
              arrow
              placement="top-start"
            >
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  maxHeight: "80px",
                  overflowY: "auto",
                  fontSize: "0.75em",
                  margin: 0,
                  padding: "2px 4px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                {JSON.stringify(run.error_details, null, 2)}
              </pre>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Backend Worker Status
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Recent data synchronization worker executions.
        </Typography>

        {workerRunsLoading &&
          workerRuns.length === 0 &&
          !workerRunsError && ( // Only show main spinner on initial full load
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: MIN_TABLE_AREA_HEIGHT / 2,
              }}
            >
              <CircularProgress />
            </Box>
          )}
        {workerRunsError && (
          <Alert severity="error" sx={{ my: 2 }}>
            Failed to load worker runs: {workerRunsError}
          </Alert>
        )}

        {/* Container for table and pagination with minHeight */}
        {(!workerRunsLoading || workerRuns.length > 0) && !workerRunsError && (
          <Box
            sx={{
              minHeight: `${MIN_TABLE_AREA_HEIGHT}px`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TableContainer component={Paper} sx={{ mt: 1, flexGrow: 1 }}>
              {" "}
              {/* flexGrow to take available space */}
              <Table
                sx={{ minWidth: 650 }}
                aria-label="worker runs table"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Worker Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Started At</TableCell>
                    <TableCell>Ended At</TableCell>
                    <TableCell>Summary</TableCell>
                    <TableCell>Error Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderWorkerTableBody()}</TableBody>
              </Table>
            </TableContainer>
            {workerTotalRows > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={workerTotalRows}
                rowsPerPage={workerRowsPerPage}
                page={workerPage}
                onPageChange={handleChangeWorkerPage}
                onRowsPerPageChange={handleChangeWorkerRowsPerPage}
                sx={{ flexShrink: 0 }} // Prevent pagination from shrinking too much
              />
            )}
          </Box>
        )}
        {!workerRunsLoading && !workerRunsError && workerTotalRows === 0 && (
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            No worker runs found.
          </Typography>
        )}
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* CI/CD Build Health Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom component="h2">
          Panopticron CI/CD Build Health
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Status of recent internal CI/CD test and build runs for Panopticron
          itself.
        </Typography>
        <CiTestRunsTable runs={ciTestRuns} isLoading={ciTestRunsLoading} />
        {ciTestRunsError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load CI test runs: {ciTestRunsError}
          </Alert>
        )}
        {!ciTestRunsLoading && !ciTestRunsError && ciTestRuns.length === 0 && (
          <Typography sx={{ mt: 2 }}>No CI test runs found.</Typography>
        )}
      </Paper>
    </Container>
  );
}
