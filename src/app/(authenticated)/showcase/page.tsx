"use client";

import React, { createContext, useContext } from "react";
import { Box, Typography, Grid, Paper, Divider, Link as MuiLink } from "@mui/material";
import { List } from "@refinedev/mui";

import { Lens } from "@components/lens/Lens";
import { LensCluster } from "@components/lens";
import { LensSizeKey } from "@components/lens/lens.types";
import { ProjectStatusCard } from "@components/project/status-card";

// Import mock data
import {
  richLensGood,
  richLensWarning,
  richLensError,
  richLensLoading,
  richLensCompact,
  mockProjects,
  fractalClusterLensesFull,
  fractalClusterLensesPartial,
  fractalClusterLensesMinimal,
} from "./showcase.mockdata";

// Icons - these are used directly in this file for basic Lens examples
// More complex Lens examples (richLens*, fractalCluster*) define their icons in mockdata.ts
import CloudIcon from "@mui/icons-material/Cloud";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";

// Import the showcase context
import { ShowcaseModeContext } from "@contexts/showcase-mode";

export default function ComponentShowcasePage() {
  return (
    <ShowcaseModeContext.Provider value={true}>
      <List
        title={<Typography variant="h5">Component Showcase</Typography>}
        breadcrumb={true}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Showcase Hub
          </Typography>
          <Typography paragraph>
            This area is for showcasing various UI components, experiments, and
            new features that are under development.
          </Typography>
          <ul>
            <li>
              <MuiLink href="/showcase/advanced-dashboard-mock">
                Advanced Dashboard Mock
              </MuiLink>
            </li>
            {/* Add links to other specific showcases or component tests here */}
          </ul>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Individual Lens Component (Basic)
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Lens
                id="lens-good"
                status="good"
                icon={CheckCircleIcon}
                label="Status: Good"
                size="medium"
              />
              <Typography variant="caption" display="block" textAlign="center">
                Good
              </Typography>
            </Grid>
            <Grid item>
              <Lens
                id="lens-warning"
                status="warning"
                icon={WarningIcon}
                label="Status: Warning"
                size="medium"
              />
              <Typography variant="caption" display="block" textAlign="center">
                Warning
              </Typography>
            </Grid>
            <Grid item>
              <Lens
                id="lens-error"
                status="error"
                icon={ErrorIcon}
                label="Status: Error"
                size="medium"
              />
              <Typography variant="caption" display="block" textAlign="center">
                Error
              </Typography>
            </Grid>
            <Grid item>
              <Lens
                id="lens-neutral"
                status="neutral"
                icon={CloudIcon}
                label="Status: Neutral"
                size="medium"
              />
              <Typography variant="caption" display="block" textAlign="center">
                Neutral
              </Typography>
            </Grid>
            <Grid item>
              <Lens
                id="lens-small-good"
                status="good"
                icon={CheckCircleIcon}
                size="small"
              />
              <Typography variant="caption" display="block" textAlign="center">
                Small
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Individual Rich Lens Variants (Data-Driven)
          </Typography>
          <Grid container spacing={2} alignItems="flex-start">
            {(["small", "compact", "medium", "large", "xl"] as LensSizeKey[]).map(
              (sizeKey) => (
                <Grid item key={`rich-good-${sizeKey}`}>
                  <Lens
                    {...richLensGood}
                    id={`rich-good-${sizeKey}`}
                    size={sizeKey}
                    label={`${richLensGood.label} (${sizeKey})`}
                  />
                </Grid>
              )
            )}
            <Grid item>
              <Lens {...richLensWarning} size="medium" />
            </Grid>
            <Grid item>
              <Lens {...richLensError} size="medium" />
            </Grid>
            <Grid item>
              <Lens {...richLensLoading} size="medium" />
            </Grid>
            <Grid item>
              <Lens {...richLensCompact} size="compact" label="Compact Value" />
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            LensCluster (Compact & Medium Examples)
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Compact Cluster (Dashboard Style)
              </Typography>
              <LensCluster
                lensesInput={[
                  { ...richLensGood, id: "cc1", label: "Prod", size: "compact" },
                  {
                    ...richLensWarning,
                    id: "cc2",
                    value: "CI",
                    subLabel: undefined,
                    icon: richLensWarning.icon,
                    size: "compact",
                    label: "CI Status"
                  },
                  {
                    ...richLensError,
                    id: "cc3",
                    value: "Err",
                    subLabel: undefined,
                    icon: richLensError.icon,
                    size: "compact",
                    label: "Errors"
                  },
                  { ...richLensLoading, id: "cc4", label: "Sync...", size: "compact" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Medium Detail Cluster
              </Typography>
              <LensCluster
                lensesInput={[
                  richLensGood,
                  richLensWarning,
                  richLensError,
                  richLensLoading,
                ]}
              />
            </Grid>
          </Grid>
        </Paper>

        <Divider
          sx={{ my: 3, borderColor: "primary.main", borderWidth: "1px" }}
        />
        <Typography
          variant="h5"
          component="h2"
          sx={{ my: 2, textAlign: "center", fontWeight: "bold" }}
        >
          Fractal LensCluster Showcase
        </Typography>
        <Divider
          sx={{ mb: 3, borderColor: "primary.main", borderWidth: "1px" }}
        />

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Fractal LensCluster (Priority Driven)
          </Typography>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm="auto">
              <Typography variant="subtitle1" gutterBottom textAlign="center">
                Full Set (7 Lenses)
              </Typography>
              <LensCluster lensesInput={fractalClusterLensesFull} />
            </Grid>
            <Grid item xs={12} sm="auto">
              <Typography variant="subtitle1" gutterBottom textAlign="center">
                Partial Set (3 Lenses)
              </Typography>
              <LensCluster lensesInput={fractalClusterLensesPartial} />
            </Grid>
            <Grid item xs={12} sm="auto">
              <Typography variant="subtitle1" gutterBottom textAlign="center">
                Minimal Set (1 Lens)
              </Typography>
              <LensCluster lensesInput={fractalClusterLensesMinimal} />
            </Grid>
            <Grid item xs={12} sm="auto">
              <Typography variant="subtitle1" gutterBottom textAlign="center">
                Empty Set
              </Typography>
              <LensCluster lensesInput={[]} />
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Paper sx={{ p: 2, mb:3 }}>
          <Typography variant="h6" gutterBottom>
            ProjectStatusCard Component Scenarios
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Note: The Vercel lens within these cards might attempt live API calls
            if not fully mocked. Ensure mock data provides necessary fields.
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {Object.entries(mockProjects).map(([key, project]) => {
              if (!project || !project.id) {
                console.error(
                  `ERROR: Project data or ID is missing for mock key: "${key}"`, project
                );
                return (
                  <Grid item xs={12} md={6} lg={4} key={key}>
                    <Paper sx={{ p: 2, border: "2px dashed red" }}>
                      <Typography color="error">
                        Error: Mock project data or ID missing for: {key}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              }
              return (
                <Grid item xs={12} md={6} lg={4} key={project.id}>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ mb: 0.5, display: "block", textAlign: "center" }}
                  >
                    Scenario:{" "}
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Typography>
                  <ProjectStatusCard project={project} />
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </List>
    </ShowcaseModeContext.Provider>
  );
}