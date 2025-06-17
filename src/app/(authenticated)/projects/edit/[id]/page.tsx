"use client";

import React from "react";
import { Edit } from "@refinedev/mui";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useParams } from "next/navigation";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { HttpError, BaseKey } from "@refinedev/core";

// --- Interface Definitions ---

// Define ISupabaseProject based on the context document and common fields.
interface ISupabaseProject {
  id: BaseKey;
  name: string;
  created_at: string;
  updated_at: string;
  vercel_project_id: string | null;
  vercel_framework?: string | null;
  calculated_priority_score?: number | null;
  manual_priority_override?: number | null;
  priority_sort_key?: number | null;
  latest_prod_deployment_status?: string | null;
  github_ci_status?: string | null;
  last_synced_at?: string | null;
}

// Type for the entire form
interface ProjectFormData extends ISupabaseProject {
  manual_priority_override?: number | null;
  calculated_priority_score?: number | null;
}

export default function ProjectEditPage() {
  const params = useParams();
  const id = params?.id as BaseKey | undefined;

  const {
    control,
    formState: { errors, isSubmitting },
    refineCore: { queryResult, formLoading, mutationResult },
    saveButtonProps,
  } = useForm<ProjectFormData, HttpError>({
    refineCoreProps: {
      resource: "projects",
      id: id,
      action: "edit",
      redirect: "list",
    },
  });

  const projectData = queryResult?.data?.data;
  const nameDisplay = projectData?.name;
  const vercelIdDisplay = projectData?.vercel_project_id;
  const calculatedScoreDisplay = projectData?.calculated_priority_score;

  if (formLoading && !projectData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (queryResult?.isError && !projectData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading project data: {(queryResult.error as HttpError)?.message || "Unknown error"}
        </Alert>
      </Box>
    );
  }
  
  if (!id) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Project ID is missing.</Alert>
      </Box>
    );
  }

  return (
    <Edit
      title={<Typography variant="h5">Edit Project Priority: {nameDisplay || id}</Typography>}
      breadcrumb={
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <MuiLink underline="hover" color="inherit" href="/dashboard">Dashboard</MuiLink>
          <Typography color="text.primary">Edit Priority</Typography>
        </Breadcrumbs>
      }
      isLoading={formLoading || isSubmitting}
      saveButtonProps={saveButtonProps}
    >
      <Box component="div" sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Project Name"
              value={nameDisplay || ""}
              key={`name-${String(id)}-${nameDisplay}`}
              fullWidth
              disabled
              margin="normal"
              InputLabelProps={{ shrink: true }}
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Vercel Project ID"
              value={vercelIdDisplay || "N/A"}
              key={`vercelId-${String(id)}-${vercelIdDisplay}`}
              fullWidth
              disabled
              margin="normal"
              InputLabelProps={{ shrink: true }}
              variant="filled"
            />
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
              <Typography variant="h6" gutterBottom>Priority Configuration</Typography>
              <Stack spacing={2} component="form" noValidate>
                <Controller
                  name="manual_priority_override"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      value={field.value === null || field.value === undefined ? "" : String(field.value)}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? null : Number(val));
                      }}
                      label="Manual Priority Override"
                      type="number"
                      fullWidth
                      helperText={fieldState.error?.message || "Set a score (lower = higher priority). Leave blank for automated."}
                      margin="normal"
                      error={!!fieldState.error}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
                <TextField
                  label="Calculated Priority Score (Automated)"
                  value={calculatedScoreDisplay === null || calculatedScoreDisplay === undefined ? "N/A" : calculatedScoreDisplay}
                  key={`calcScore-${String(id)}-${calculatedScoreDisplay}`}
                  type="number"
                  fullWidth
                  disabled
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  variant="filled"
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  The final &apos;Priority Sort Key&apos; will be the &apos;Manual Priority
                  Override&apos; if set, otherwise the &apos;Calculated Priority Score&apos;.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
        
        {mutationResult?.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error saving project: {(mutationResult.error as HttpError)?.message || "Unknown error"}
          </Alert>
        )}
      </Box>
    </Edit>
  );
}