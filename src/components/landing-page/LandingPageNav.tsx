// src/components/landing-page/LandingPageNav.tsx
"use client";

import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  useTheme,
  alpha,
} from "@mui/material";
import PanopticonIcon from "@components/icons/PanopticonIcon";
import Link from "next/link";
import { ColorModeContext } from "@contexts/color-mode"; // Assuming this path
import { availableThemes, ThemeKey } from "@themes"; // Assuming this path

interface LandingPageNavProps {
  onScrollToSection: (sectionId: string) => void;
}

export const LandingPageNav: React.FC<LandingPageNavProps> = ({
  onScrollToSection,
}) => {
  const theme = useTheme();
  const { mode, setMode } = useContext(ColorModeContext);

  const handleThemeChange = (event: SelectChangeEvent<ThemeKey>) => {
    setMode(event.target.value as ThemeKey);
  };

  return (
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
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Left: Logo & Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PanopticonIcon
              sx={{ mr: 1, fontSize: 32, color: "primary.main" }}
            />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/"
              sx={{
                mr: 2,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "text.primary",
                textDecoration: "none",
              }}
            >
              PANOPTICRON
            </Typography>
          </Box>

          {/* Center: Nav Links (Desktop) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => onScrollToSection("features")}
              sx={{ color: "text.secondary" }}
            >
              Features
            </Button>
            <Button
              color="inherit"
              onClick={() => onScrollToSection("testimonials")}
              sx={{ color: "text.secondary" }}
            >
              Testimonials
            </Button>
            <Button
              component={Link}
              href="/patch-notes"
              color="inherit"
              sx={{ color: "text.secondary" }}
            >
              Patch Notes
            </Button>
            <Button
              component={Link}
              href="/philosophy"
              color="inherit"
              sx={{ color: "text.secondary" }}
            >
              Our Philosophy
            </Button>
          </Box>

          {/* Right: Theme Switcher & Auth Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl sx={{ minWidth: 130 }} size="small" variant="outlined">
              <InputLabel
                id="landing-theme-select-label"
                sx={{ color: alpha(theme.palette.text.primary, 0.7) }}
              >
                Theme
              </InputLabel>
              <Select
                labelId="landing-theme-select-label"
                value={mode}
                label="Theme"
                onChange={handleThemeChange}
                sx={{
                  color: theme.palette.text.primary,
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha(theme.palette.divider, 0.5),
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.secondary,
                  },
                  ".MuiSvgIcon-root": { fill: theme.palette.text.secondary },
                  borderRadius: "8px",
                  height: "40px",
                }}
              >
                {Object.keys(availableThemes).map((themeKey) => (
                  <MenuItem key={themeKey} value={themeKey}>
                    {themeKey
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              component={Link}
              href="/login"
              color="inherit"
              variant="outlined"
              size="small"
              sx={{
                color: "text.secondary",
                borderColor: alpha(theme.palette.divider, 0.7),
                height: "40px",
                borderRadius: "8px",
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              color="primary"
              size="small"
              sx={{ height: "40px", borderRadius: "8px" }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
