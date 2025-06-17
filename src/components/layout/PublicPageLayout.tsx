// src/components/layout/PublicPageLayout.tsx
"use client";

import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Link as MuiLink,
  useTheme,
  alpha,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from "@mui/material";
import PanopticonIcon from "@components/icons/PanopticonIcon";
import Link from "next/link";
import { ColorModeContext } from "@contexts/color-mode"; // Adjust path if needed
import { availableThemes, ThemeKey } from "@themes";     // Adjust path if needed

interface PublicPageLayoutProps {
  children: React.ReactNode;
  showInternalNavLinks?: boolean; // To show/hide "Features", "Testimonials"
  onScrollToSection?: (sectionId: string) => void; // For landing page scroll links
}

export const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({
  children,
  showInternalNavLinks = false, // Default to false for pages like patch-notes/philosophy
  onScrollToSection,
}) => {
  const theme = useTheme();
  const { mode, setMode } = useContext(ColorModeContext);

  const handleThemeChange = (event: SelectChangeEvent<ThemeKey>) => {
    setMode(event.target.value as ThemeKey);
  };

  const handleScroll = (sectionId: string) => {
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      // Fallback or navigate if it's a different page structure
      // For simplicity, we assume onScrollToSection is passed if showInternalNavLinks is true
      console.warn("onScrollToSection not provided for internal nav links.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 1. Consistent Navigation Bar */}
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: alpha(theme.palette.background.default, 0.7),
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.drawer + 1, // Ensure it's above other content if ticker is sticky
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Left: Logo & Title */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PanopticonIcon sx={{ mr: 1, fontSize: 32, color: "primary.main" }} />
              <Typography
                variant="h6"
                noWrap
                component={Link}
                href="/"
                sx={{
                  mr: 2, fontFamily: "monospace", fontWeight: 700, letterSpacing: ".1rem",
                  color: "text.primary", textDecoration: "none",
                }}
              >
                PANOPTICRON
              </Typography>
            </Box>

            {/* Center: Nav Links (Desktop) */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, flexGrow: 1, justifyContent: 'center' }}>
              {showInternalNavLinks && onScrollToSection && ( // Only for landing page typically
                <>
                  <Button color="inherit" onClick={() => handleScroll("features")} sx={{color: 'text.secondary'}}>Features</Button>
                  <Button color="inherit" onClick={() => handleScroll("testimonials")} sx={{color: 'text.secondary'}}>Testimonials</Button>
                </>
              )}
              <Button component={Link} href="/patch-notes" color="inherit" sx={{color: 'text.secondary'}}>Patch Notes</Button>
              <Button component={Link} href="/philosophy" color="inherit" sx={{color: 'text.secondary'}}>Our Philosophy</Button>
            </Box>

            {/* Right: Theme Switcher & Auth Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControl sx={{ minWidth: 130, display: {xs: 'none', sm: 'block'} }} size="small" variant="outlined"> {/* Hide on very small screens */}
                <InputLabel id="public-theme-select-label" sx={{color: alpha(theme.palette.text.primary, 0.7)}}>Theme</InputLabel>
                <Select
                  labelId="public-theme-select-label"
                  value={mode}
                  label="Theme"
                  onChange={handleThemeChange}
                  sx={{ color: theme.palette.text.primary, '.MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.5) }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.text.secondary }, '.MuiSvgIcon-root': { fill: theme.palette.text.secondary }, borderRadius: '8px', height: '40px' }}
                >
                  {Object.keys(availableThemes).map((themeKey) => (
                    <MenuItem key={themeKey} value={themeKey}>
                      {themeKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button component={Link} href="/login" color="inherit" variant="outlined" size="small" sx={{ color: 'text.secondary', borderColor: alpha(theme.palette.divider, 0.7), height: '40px', borderRadius: '8px', display: {xs: 'none', sm: 'inline-flex'} }}>Login</Button>
              <Button component={Link} href="/register" variant="contained" color="primary" size="small" sx={{ height: '40px', borderRadius: '8px' }}>Sign Up</Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Rendered Here */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Consistent Footer */}
      <Box component="footer" sx={{ py: 4, backgroundColor: alpha(theme.palette.background.default, 0.5), borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container maxWidth="lg">
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid item xs={12} sm="auto">
                    <Typography variant="body2" color="text.secondary" textAlign={{xs: 'center', sm: 'left'}}>
                    © {new Date().getFullYear()} Panopticron by BornDigital.
                    </Typography>
                </Grid>
                <Grid item xs={12} sm="auto">
                    <Box sx={{display: 'flex', justifyContent: {xs: 'center', sm: 'flex-end'}, gap: 2}}>
                        <MuiLink component={Link} href="/patch-notes" color="text.secondary" underline="hover">Patch Notes</MuiLink>
                        <MuiLink component={Link} href="/philosophy" color="text.secondary" underline="hover">Our Philosophy</MuiLink>
                        {/* Add other common footer links like Privacy, Terms if they become actual pages */}
                    </Box>
                </Grid>
            </Grid>
        </Container>
      </Box>
    </Box>
  );
};