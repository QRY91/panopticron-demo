// src/app/landing-page/page.tsx
"use client";

import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Link as MuiLink,
  useTheme,
  alpha,
} from "@mui/material";
import Link from "next/link";

// Icons for features
import DashboardIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import CloudIcon from "@mui/icons-material/Cloud";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const keyFeatures = [
  {
    icon: <DashboardIcon fontSize="large" color="primary" />,
    title: "Unified Project Dashboard",
    description: "All your projects, their status, and health metrics in one centralized view",
  },
  {
    icon: <VisibilityIcon fontSize="large" color="primary" />,
    title: "Real-time Monitoring",
    description: "Live updates from GitHub, Vercel, and other integrations with smart alerting",
  },
  {
    icon: <BoltIcon fontSize="large" color="primary" />,
    title: "Intelligent Prioritization",
    description: "Automatic priority scoring with manual override capabilities for critical projects",
  },
  {
    icon: <IntegrationInstructionsIcon fontSize="large" color="primary" />,
    title: "Production Integrations",
    description: "Connect with GitHub CI/CD, Vercel deployments, and monitoring services",
  },
];

const techStack = [
  { name: "React", type: "Frontend" },
  { name: "Next.js 14", type: "Framework" },
  { name: "TypeScript", type: "Language" },
  { name: "Material-UI", type: "Design" },
  { name: "Refine", type: "Admin Framework" },
  { name: "Supabase", type: "Backend" },
];

const integrations = [
  { name: "GitHub", icon: <GitHubIcon />, status: "Active" },
  { name: "Vercel", icon: <CloudIcon />, status: "Active" },
  { name: "Monitoring", icon: <MonitorHeartIcon />, status: "Active" },
];

export default function LandingPage() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Navigation Bar */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
              Panopticron
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button component={Link} href="/philosophy" color="inherit">
                Philosophy
              </Button>
              <Button component={Link} href="/patch-notes" color="inherit">
                Updates
              </Button>
              <Button
                component={Link}
                href="/dashboard"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
              >
                View Dashboard
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
          >
            Project Monitoring
            <br />
            Made Simple
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            Panopticron provides a unified dashboard for digital product studios to monitor
            multiple client projects, track deployments, and maintain project health across
            GitHub, Vercel, and other critical services.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="large"
              sx={{ py: 1.5, px: 4, textTransform: "none", fontSize: "1.1rem" }}
            >
              Live Demo Dashboard
            </Button>
            <Button
              component={Link}
              href="/projects"
              variant="outlined"
              size="large"
              sx={{ py: 1.5, px: 4, textTransform: "none", fontSize: "1.1rem" }}
            >
              View Projects
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Problem Statement */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                The Challenge
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Digital studios juggle multiple client projects across different platforms.
                Project status becomes scattered across GitHub, Vercel, monitoring tools,
                and communication channels.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                This leads to missed deployments, overlooked issues, and time lost
                hunting for project status when clients ask for updates.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
                }}
              >
                <Typography variant="h6" color="error.main" gutterBottom>
                  Without Centralized Monitoring:
                </Typography>
                <Typography variant="body2" component="div" color="text.secondary">
                  • Context switching between multiple tools<br />
                  • Missed deployment failures<br />
                  • Delayed incident response<br />
                  • Manual status collection for reports<br />
                  • Reactive instead of proactive management
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: "background.default" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
            Key Features
          </Typography>
          <Grid container spacing={4}>
            {keyFeatures.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <Card elevation={2} sx={{ height: "100%", transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
                  <CardContent sx={{ p: 3, textAlign: "center" }}>
                    <Box sx={{ mb: 2, color: "primary.main" }}>{feature.icon}</Box>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Tech Stack Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Built with Modern Technologies
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Panopticron leverages a production-ready tech stack for scalability,
                maintainability, and developer experience.
              </Typography>
              <Grid container spacing={2}>
                {techStack.map((tech) => (
                  <Grid item key={tech.name}>
                    <Chip
                      label={`${tech.name} (${tech.type})`}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Active Integrations
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Real-time data connections with your existing development tools.
              </Typography>
              <Grid container spacing={2}>
                {integrations.map((integration) => (
                  <Grid item xs={12} key={integration.name}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
                    >
                      {integration.icon}
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {integration.name}
                      </Typography>
                      <Chip
                        label={integration.status}
                        color="success"
                        size="small"
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: { xs: 6, md: 10 }, textAlign: "center", backgroundColor: "background.default" }}>
        <Container maxWidth="sm">
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            See It In Action
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Explore the live dashboard with real project data and integrations.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="large"
              sx={{ py: 1.5, px: 5, textTransform: "none", fontSize: "1.1rem" }}
            >
              Dashboard Demo
            </Button>
            <Button
              component={Link}
              href="/status"
              variant="outlined"
              size="large"
              sx={{ py: 1.5, px: 5, textTransform: "none", fontSize: "1.1rem" }}
            >
              System Status
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          backgroundColor: "background.paper",
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: "center"
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            Panopticron - Project Monitoring Dashboard for Digital Studios
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 3 }}>
            <MuiLink component={Link} href="/philosophy" color="text.secondary">
              Philosophy
            </MuiLink>
            <MuiLink component={Link} href="/patch-notes" color="text.secondary">
              Updates
            </MuiLink>
            <MuiLink component={Link} href="/status" color="text.secondary">
              Status
            </MuiLink>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
