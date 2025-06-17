// src/app/(authenticated)/admin/workers/page.tsx
"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  CircularProgress,
  LinearProgress,
  Alert,
  AlertTitle,
  Divider,
  List,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

interface WorkerAction {
  name: string; // Display name, e.g., "Sync Vercel Projects"
  endpoint: string; // API endpoint, e.g., "/api/cron/sync-vercel-projects"
  description: string; // Brief description
}

type WorkerRunStatus =
  | "Success"
  | "Partial Success"
  | "Failure"
  | "Started"
  | "Triggering"
  | "No Action Needed"
  | "Unknown";

// Define the workers that can be triggered
const workersToTrigger: WorkerAction[] = [
  {
    name: "Sync Vercel Projects",
    endpoint: "/api/cron/sync-vercel-projects",
    description: "Fetches latest project and deployment data from Vercel.",
  },
  {
    name: "Sync GitHub Data",
    endpoint: "/api/cron/sync-github-data",
    description:
      "Fetches latest CI status and default branch info from GitHub for linked projects.",
  },
  // Add more workers here in the future
];

interface WorkerResult {
    status: WorkerRunStatus;
    message: string;
    details?: string; // For raw error messages or stringified JSON summaries
    // Optional: Add specific count fields if you want to display them more granularly
    upsertedCount?: number;
    snapshotCount?: number;
    errorCount?: number;
    projectsProcessed?: number;
}

export default function AdminWorkerTriggerPage() {
  const [cronSecret, setCronSecret] = useState<string>("");
  const [loadingWorker, setLoadingWorker] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, WorkerResult>>({});

  const handleTriggerWorker = async (worker: WorkerAction) => {
    if (!cronSecret.trim()) {
      setResults((prev) => ({
        ...prev,
        [worker.name]: {
          status: "Failure",
          message: "CRON Secret is required!",
        },
      }));
      return;
    }

    setLoadingWorker(worker.name);
    // Set initial status to 'Triggering'
    setResults((prev) => ({
      ...prev,
      [worker.name]: {
        status: "Triggering",
        message: "Worker trigger initiated...",
      },
    }));

    try {
      const response = await fetch(
        `${worker.endpoint}?cron_secret=${encodeURIComponent(cronSecret)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );

      const responseData = await response.json();
      let resultStatus: WorkerRunStatus = "Failure"; // Default to failure

      if (!response.ok) {
        const errorMessage =
          responseData.error ||
          responseData.details ||
          responseData.message ||
          `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

 // Determine status based on worker response structure
      // This logic assumes your worker API routes return these counts in their JSON response
      const errors = responseData.errorCount ?? -1; // Use a sentinel if undefined
      const successes = (responseData.upsertedCount ?? 0) + (responseData.updatedInDbCount ?? 0) + (responseData.snapshotCount ?? 0);
      const processed = responseData.projectsProcessed ?? (responseData.upsertedCount ?? 0) + (responseData.updatedInDbCount ?? 0);


      if (errors === 0 && successes > 0) {
          resultStatus = 'Success';
      } else if (errors === 0 && processed === 0 && responseData.message && responseData.message.toLowerCase().includes('no projects')) {
          resultStatus = 'No Action Needed';
      } else if (errors > 0 && successes > 0) {
          resultStatus = 'Partial Success';
      } else if (errors > 0 && successes === 0) {
          resultStatus = 'Failure';
      } else if (errors === -1 && response.ok) { // No errorCount but response was ok
          resultStatus = 'Success'; // Assume success if no error counts and response is OK
      }
      
      setResults((prev) => ({
        ...prev,
        [worker.name]: { 
            status: resultStatus, 
            message: responseData.message || 'Worker completed.',
            details: JSON.stringify(responseData, null, 2), // Show full structured response as details
            upsertedCount: responseData.upsertedCount || responseData.updatedInDbCount,
            snapshotCount: responseData.snapshotCount,
            errorCount: responseData.errorCount,
            projectsProcessed: responseData.projectsProcessed,
        },
      }));

    } catch (error: any) {
      console.error(`Error triggering worker ${worker.name}:`, error);
      setResults((prev) => ({
        ...prev,
        [worker.name]: { 
            status: 'Failure', 
            message: 'Worker trigger failed or an error occurred during execution.',
            details: error.message || 'An unknown error occurred.'
        },
      }));
    } finally {
      setLoadingWorker(null);
    }
  };

  const getAlertSeverity = (status: WorkerRunStatus): "success" | "error" | "warning" | "info" => {
    switch (status) {
      case "Success":
      case "No Action Needed":
        return "success";
      case "Partial Success":
        return "warning";
      case "Failure":
        return "error";
      case "Triggering":
      case "Started": // If you ever use 'Started' from WorkerLogger
      default:
        return "info";
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin - Manual Worker Triggers
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
        {/* ... CRON Secret Input ... */}
        <Typography variant="h6" gutterBottom>
          CRON Secret
        </Typography>
        <TextField
          fullWidth
          type="password"
          label="Enter CRON Secret"
          variant="outlined"
          value={cronSecret}
          onChange={(e) => setCronSecret(e.target.value)}
          helperText="This secret is required to authorize manual triggering of cron jobs."
          InputProps={{
            startAdornment: <VpnKeyIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{mb: 1}}
        />
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom sx={{mt: 4}}>
        Available Workers
      </Typography>
      <List sx={{padding: 0}}>
        {workersToTrigger.map((worker, index) => (
          <React.Fragment key={worker.name}>
 <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  gap: 2
                }}
              >
                <Box sx={{ flexGrow: 1, minWidth: 0 }}> 
                  <Typography variant="h6">{worker.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                    {worker.description}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleTriggerWorker(worker)}
                  disabled={loadingWorker === worker.name || !cronSecret.trim()}
                  startIcon={loadingWorker === worker.name && loadingWorker === worker.name ? <CircularProgress size={20} color="inherit" /> : <PlayCircleOutlineIcon />}
                  sx={{
                    minWidth: '120px', 
                    flexShrink: 0
                  }}
                >
                  {loadingWorker === worker.name ? 'Triggering...' : 'Trigger'}
                </Button>
              </Box>
              {/* Indeterminate Progress Bar during triggering */}
              {loadingWorker === worker.name && results[worker.name]?.status === 'Triggering' && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress />
                </Box>
              )}
              {results[worker.name] && ( 
                <Alert
                  severity={getAlertSeverity(results[worker.name].status)}
                  sx={{ mt: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                >
                  <AlertTitle>
                    {results[worker.name].status.charAt(0).toUpperCase() + results[worker.name].status.slice(1)}
                  </AlertTitle>
                  {results[worker.name].message}
                  {/* Display structured counts if available */}
                  {(results[worker.name].projectsProcessed !== undefined || results[worker.name].upsertedCount !== undefined) && (
                    <Typography variant="caption" component="div" sx={{mt:1, opacity: 0.8}}>
                        {results[worker.name].projectsProcessed !== undefined && `Processed: ${results[worker.name].projectsProcessed} | `}
                        {(results[worker.name].upsertedCount !== undefined) && `Updated/Upserted: ${results[worker.name].upsertedCount} | `}
                        {results[worker.name].snapshotCount !== undefined && `Snapshots: ${results[worker.name].snapshotCount} | `}
                        {results[worker.name].errorCount !== undefined && `Errors: ${results[worker.name].errorCount}`}
                    </Typography>
                  )}
                  {/* Display raw details for failures or if no specific counts */}
                  {((results[worker.name].status === 'Failure' || results[worker.name].status === 'Partial Success') || 
                   (results[worker.name].projectsProcessed === undefined && results[worker.name].upsertedCount === undefined)) 
                   && results[worker.name].details && (
                    <Typography variant="caption" component="div" sx={{mt:1, opacity: 0.8, maxHeight: '150px', overflowY: 'auto', background: (theme) => theme.palette.action.hover, p:1, borderRadius:1}}>
                        <pre style={{margin:0}}>Details: {results[worker.name].details}</pre>
                    </Typography>
                  )}
                </Alert>
              )}
            </Paper>
            {index < workersToTrigger.length - 1 && <Divider sx={{mb: 2, border: 'none'}} />}
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}