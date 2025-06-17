// src/app/philosophy/page.tsx
"use client";

import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Link as MuiLink,
  AppBar,
  Toolbar,
  Button,
  useTheme,
  alpha,
  Grid, // For layout
  Card, // For quotes or distinct sections
  CardContent,
} from "@mui/material";
import PanopticonIcon from "@components/icons/PanopticonIcon"; // Adjust path
import Link from "next/link";
import AutoStoriesIcon from "@mui/icons-material/AutoStories"; // Icon for philosophy
import GarageIcon from "@mui/icons-material/GarageOutlined"; // Icon for "garage door"
import SpeedIcon from "@mui/icons-material/Speed"; // Icon for efficiency
import { PublicPageLayout } from "@components/layout/PublicPageLayout";

export default function PhilosophyPage() {
  const theme = useTheme();

  const robinSloanQuote = `I wish starting physical businesses was easier; I wish the path wasn’t so steep, especially in places like the Bay Area; because I think it’s one of the absolute best things a person can do. Among many other things, a physical business enlivens public space, by making the simple, eloquent statement: I am here, working.

  There’s a scientific glassblowing studio north of us; I walk past it on the sidewalk often. By simply existing, and having a nice sign that faces the street, they are doing a small public service every day. We are here, working.
  
  In the same light industrial complex as the Murray Street Media Lab, there’s a woodworking shop, and the man who runs it always keeps his door propped open. Simple as that. What a delight, every damn day, to ride my bike past that door and peek inside and see all his tools, the boards stacked up for whatever commission he’s undertaking. I am here, working.
  
  Part of the problem of social media is that there is no equivalent to the scientific glassblowers’ sign, or the woodworker’s open door, or Dafna and Jesse’s sandwich boards. On the internet, if you stop speaking: you disappear. And, by corollary: on the internet, you only notice the people who are speaking nonstop.
  
  If you could put on magic internet goggles that enabled you to see through this gnarly selection bias and view the composition of reality fairly, correctly—well, just come walk around Emeryville and West Berkeley. It would look like that! All the tumult of Twitter would shrink into a single weird cafe—just a speck, in an enormous city made up entirely of people quietly working.
`;

  return (
    <PublicPageLayout>
      {/* Main Content Area */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, flexGrow: 1 }}>
        <Box textAlign="center" mb={6}>
          <AutoStoriesIcon
            sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
          />
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Our Philosophy
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            The &quot;Why&quot; Behind Panopticron: Transparency, Efficiency, and
            Working with the Garage Door Open.
          </Typography>
        </Box>

        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "primary.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <GarageIcon sx={{ mr: 1.5, fontSize: "2rem" }} /> Working with the
            Garage Door Open
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontStyle: "italic", color: "text.secondary" }}
          >
            We draw inspiration from the idea of visible work and open
            development. As Robin Sloan eloquently put it:
          </Typography>
          <Card variant="outlined" sx={{ my: 2, p: 2, borderColor: "divider" }}>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  whiteSpace: "pre-line",
                  fontStyle: "italic",
                  lineHeight: 1.7,
                }}
              >
                {robinSloanQuote}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                textAlign="right"
                sx={{ mt: 1 }}
              >
                - Robin Sloan,{" "}
                <MuiLink
                  href="https://www.robinsloan.com/newsletters/"
                  target="_blank"
                  rel="noopener"
                >
                  from his newsletter
                </MuiLink>
              </Typography>
            </CardContent>
          </Card>
          <Typography variant="body1" paragraph>
            Panopticron embodies this by striving for transparency. Our{" "}
            <MuiLink component={Link} href="/patch-notes">
              public patch notes
            </MuiLink>{" "}
            are one small step. We believe that sharing our progress, our
            learnings, and even our challenges openly benefits everyone and
            helps us build a better tool.
          </Typography>
        </Paper>

        <Divider sx={{ my: 4 }} />

        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "primary.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SpeedIcon sx={{ mr: 1.5, fontSize: "2rem" }} /> The Drive for
            Efficiency: Our Core Research
          </Typography>
          <Typography variant="body1" paragraph>
            At its heart, Panopticron is an answer to a critical question for any
            development team:
          </Typography>
          <Typography
            variant="h5"
            component="blockquote"
            sx={{
              fontStyle: "italic",
              py: 2,
              px: 3,
              my: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            “What is the most efficient way to reduce the time between the first
            detection of an incident and the first steps to resolution of that
            incident?”
          </Typography>
          <Typography variant="body1" paragraph>
            Every feature in Panopticron, from the unified dashboard to the
            detailed status views and the visual cues in our LensCluster™, is
            designed to:
          </Typography>
          <Box component="ul" sx={{ pl: 2.5, mb: 1, listStyle: "disc" }}>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              Minimize Time-to-Detection: Surface critical issues immediately.
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              Provide Actionable Context: Offer the right information at the
              right time.
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              Streamline Workflow: Reduce the need to jump between multiple
              tools.
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              Foster Shared Understanding: Ensure everyone on the team sees the
              same picture of project health.
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Our{" "}
            <MuiLink component={Link} href="/experiments">
              Experiments page
            </MuiLink>{" "}
            is where we actively explore and test UI/UX patterns that contribute
            to these goals.
          </Typography>
        </Paper>

        {/* Add more sections as desired: "Our Story", "Tech Deep Dives", etc. */}

        <Box textAlign="center" mt={6}>
          <Button
            component={Link}
            href="/"
            variant="outlined"
            color="primary"
            size="large"
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </PublicPageLayout>
  );
}
