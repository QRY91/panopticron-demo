// src/app/page.tsx
"use client";

import React, {useRef, useEffect, useState} from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Paper,
  Avatar,
  Link as MuiLink,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import Link from "next/link";

import { LandingPageNav } from "./LandingPageNav";
import Ticker, { TickerItem } from "@components/ticker/Ticker";


// Icons for features
import DashboardIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { PublicPageLayout } from "@components/layout/PublicPageLayout";

// --- Mock Data ---
const features = [
  {
    icon: <DashboardIcon fontSize="large" color="primary" />,
    title: "Unified Command Center",
    description:
      "See all your project statuses—Vercel, GitHub, and more—in one clean interface. No more tab-switching madness.",
  },
  {
    icon: <VisibilityIcon fontSize="large" color="primary" />,
    title: "The LensCluster™ Insight",
    description:
      "Instantly grasp project health with our unique, high-density visual system. Critical issues demand your attention, clearly.",
  },
  {
    icon: <BoltIcon fontSize="large" color="primary" />,
    title: "Accelerate Incident Response",
    description:
      "Designed to slash the time from detection to action. Get the right info, faster, to start resolving issues immediately.",
  },
  {
    icon: <IntegrationInstructionsIcon fontSize="large" color="primary" />,
    title: "Seamless Integrations",
    description:
      "Connects with the tools you already use. (Currently Vercel & GitHub, with Analytics, CMS, and Task Management on the way!)",
  },
];

const testimonials = [
  {
    quote:
      "Panopticron has revolutionized how our team monitors projects. We're catching issues quicker and collaborating more effectively than ever before.",
    name: "Alex Chen",
    title: "Lead Developer, BornDigital",
    avatar: "/avatars/alex.jpg", // Placeholder path - replace with actual or remove
  },
  {
    quote:
      "The LensCluster is a game-changer. I can see the health of all critical components at a glance. It's saved us so much time!",
    name: "Samira Khan",
    title: "Senior DevOps Engineer, BornDigital",
    avatar: "/avatars/samira.jpg", // Placeholder path
  },
  {
    quote:
      "As a designer, I appreciate how Panopticron presents complex data so clearly. It makes understanding project status intuitive for the whole team.",
    name: "Jamie Lee",
    title: "UX/UI Lead, BornDigital",
    avatar: "/avatars/jamie.jpg", // Placeholder path
  },
];

const landingPageTickerItems: TickerItem[] = [ // Specific items for landing page
  { id: 'lp-1', message: 'Panopticron: Centralize your project monitoring today!', type: 'info' },
  { id: 'lp-2', message: 'Sign up for free to get started (Internal BornDigital Tool).', type: 'success', link: '/register' },
  { id: 'lp-3', message: 'Reduce incident response times with actionable insights.', type: 'warning' },
];
// --- End Mock Data ---

export default function LandingPageDisplay() {
  const theme = useTheme();
  const navRef = useRef<HTMLElement>(null); // Ref for the Nav (via PublicPageLayout's AppBar)
  const tickerRef = useRef<HTMLElement>(null); // Ref for the Ticker's container Box
  const [stickyOffset, setStickyOffset] = useState(120); // Default offset

  useEffect(() => {
    // Calculate offset after mount when elements have dimensions
    // Note: LandingPageNav is rendered by PublicPageLayout, so we'd ideally get its ref from there
    // For simplicity now, we'll assume a fixed nav height if direct ref passing is complex
    const navHeight = 64; // Approximate or actual AppBar height
    const currentTickerRef = tickerRef.current;
    if (currentTickerRef) {
      setStickyOffset(navHeight + currentTickerRef.offsetHeight + 16); // 16 for extra padding
    }
  }, []); // Runs once after mount, and if ticker height could change, add deps

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - stickyOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
  };

  return (
<PublicPageLayout showInternalNavLinks={true} onScrollToSection={scrollToSection}>

      {/* Ticker Tape - Placed below the Nav */}
      <Box
        ref={tickerRef} // Assign ref to the ticker's container
        sx={{
          width: '100%',
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'sticky',
          top: 64, // Nav height
          zIndex: theme.zIndex.appBar - 1,
        }}
      >
            <Ticker initialItems={landingPageTickerItems} speed={30} />
      </Box>

      {/* Main Content Area */}
        {/* 2. Hero Section */}
        <Box
          id="hero"
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: "center",
            background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`, // Subtle gradient
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              See Everything.
              <br/>
              Act Instantly.
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              paragraph
              sx={{ mb: 4 }}
            >
              Panopticron cuts through the chaos, giving your team a unified view of all project vitals.
              Detect incidents faster, collaborate smarter, and reclaim your focus.
            </Typography>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{py: 1.5, px: 4, textTransform: 'none', fontSize: '1.1rem'}}
            >
              Get Started Free
            </Button>
            <Typography variant="caption" display="block" sx={{mt:2, color: 'text.disabled'}}>
                (Internal BornDigital Tool)
            </Typography>
          </Container>
        </Box>

        {/* 3. Features Section */}
        <Box id="features" sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'background.default' }}>
          <Container maxWidth="lg">
            <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{fontWeight: 600, mb:6}}>
              Why Panopticron?
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature) => (
                <Grid item xs={12} sm={6} md={3} key={feature.title}>
                  <Paper elevation={0} sx={{ p: 3, textAlign: "center", height: '100%', backgroundColor: alpha(theme.palette.background.paper, 0.7), border: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ mb: 2, color: 'primary.main' }}>{feature.icon}</Box>
                    <Typography variant="h6" component="h3" gutterBottom sx={{fontWeight: 500}}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* 4. "How It Helps" / Value Proposition Section - Simple Version */}
         <Box id="value-prop" sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'background.paper' }}>
          <Container maxWidth="md">
            <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{fontWeight: 600, mb:2}}>
              From Alert Overload to Actionable Insight
            </Typography>
             <Typography variant="h6" color="text.secondary" textAlign="center" paragraph sx={{mb: 4}}>
                Panopticron is engineered to directly impact your team&rsquo;s efficiency by addressing the core research question: reducing time-to-resolution.
            </Typography>
            {/* add a simplified dashboard image */}
            {/* For now, a list of benefits: */}
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={5}>
                    <Paper variant="outlined" sx={{p:2}}>
                    <Typography variant="h6" color="primary" gutterBottom>✓ Stop Juggling Tabs</Typography>
                    <Typography color="text.secondary">Consolidated views mean less context switching.</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} md={5}>
                    <Paper variant="outlined" sx={{p:2}}>
                    <Typography variant="h6" color="primary" gutterBottom>✓ Reduce Alert Fatigue</Typography>
                    <Typography color="text.secondary">Clear, prioritized statuses highlight what truly needs attention.</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} md={5}>
                    <Paper variant="outlined" sx={{p:2}}>
                    <Typography variant="h6" color="primary" gutterBottom>✓ Slash Incident Response Time</Typography>
                    <Typography color="text.secondary">Faster detection and immediate context for quicker fixes.</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} md={5}>
                    <Paper variant="outlined" sx={{p:2}}>
                    <Typography variant="h6" color="primary" gutterBottom>✓ Enhance Team Collaboration</Typography>
                    <Typography color="text.secondary">A shared understanding of project health for everyone.</Typography>
                    </Paper>
                </Grid>
            </Grid>
          </Container>
        </Box>


        {/* 5. Testimonials Section */}
        <Box id="testimonials" sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'background.default' }}>
          <Container maxWidth="md">
            <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{fontWeight: 600, mb:6}}>
              Loved by Developers at BornDigital
            </Typography>
            <Grid container spacing={4}>
              {testimonials.map((testimonial) => (
                <Grid item xs={12} md={4} key={testimonial.name}>
                  <Paper elevation={2} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <FormatQuoteIcon sx={{ fontSize: 40, color: 'primary.main', mb:1, transform: 'rotate(180deg)' }}/>
                    <Typography variant="body1" sx={{ fontStyle: "italic", flexGrow: 1, mb: 2, color: 'text.secondary' }}>
                      {testimonial.quote}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 'auto' }}>
                      {/* <Avatar src={testimonial.avatar} alt={testimonial.name} sx={{ mr: 2 }} /> */}
                      <Box>
                        <Typography variant="subtitle1" sx={{fontWeight: 'medium'}}>{testimonial.name}</Typography>
                        <Typography variant="body2" color="text.disabled">
                          {testimonial.title}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* 6. Secondary Call to Action */}
        <Box sx={{ py: { xs: 6, md: 10 }, textAlign: "center", backgroundColor: 'background.paper' }}>
          <Container maxWidth="sm">
            <Typography variant="h4" component="h2" gutterBottom sx={{fontWeight: 600}}>
              Ready to Transform Your Project Oversight?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{mb:4}}>
              Join the BornDigital teams leveraging Panopticron for unparalleled clarity and efficiency.
            </Typography>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{py: 1.5, px: 5, textTransform: 'none', fontSize: '1.1rem'}}
            >
              Sign Up Now
            </Button>
          </Container>
        </Box>
    </PublicPageLayout>
  );
}