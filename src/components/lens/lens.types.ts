import React from "react";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/material"; // Correct import for SxProps

export type LensStatus = "good" | "warning" | "error" | "neutral" | string;

// Define LENS_SIZES first so LensSizeKey can be derived from it
export const LENS_SIZES = {
  small: { container: "32px", borderRadius: "4px", iconFontSize: "16px", valueFontSize: "10px", subLabelFontSize: "8px" },
  compact: { container: "56px", borderRadius: "6px", iconFontSize: "20px", valueFontSize: "14px", subLabelFontSize: "9px"},
  medium: { container: "76px", borderRadius: "8px", iconFontSize: "28px", valueFontSize: "18px", subLabelFontSize: "10px" },
  large: { container: "96px", borderRadius: "10px", iconFontSize: "36px", valueFontSize: "22px", subLabelFontSize: "12px" },
  xl: { container: "120px", borderRadius: "12px", iconFontSize: "42px", valueFontSize: "28px", subLabelFontSize: "14px" },
  // Add "micro" here if you intend to use it:
  // micro: { container: "24px", borderRadius: "3px", iconFontSize: "12px", valueFontSize: "8px", subLabelFontSize: "7px" },
};

export type LensSizeKey = keyof typeof LENS_SIZES;

export interface LensProps {
  id: string;
  status: LensStatus;
  icon?: React.ElementType;
  label?: string;
  href?: string;
  sx?: SxProps<Theme>;

  value?: string | number;
  valueUnit?: string;
  subLabel?: string;
  trend?: 'up' | 'down' | 'stable';
  trendColor?: string;
  isLoading?: boolean;
  priority?: number; // Lower numbers = higher priority
  size?: LensSizeKey;
}

export const getLensStatusColors = (theme: Theme): Record<LensStatus, string> => {
  const isDarkMode = theme.palette.mode === 'dark';

  // Define base colors for different themes or modes
  // You can get very specific per theme if desired.
  // Example: Using theme's semantic colors as a base.
  if (theme.palette.mode === 'dark') { // General dark mode defaults, can be overridden per specific dark theme
    switch (theme.palette.primary.main) { // Example: Check primary color to guess the theme (crude but illustrative)
      case '#bd93f9': // Dracula-like purple primary
        return {
          good: '#50fa7b',    // Dracula Green
          warning: '#f1fa8c', // Dracula Yellow
          error: '#ff5555',   // Dracula Red
          neutral: theme.palette.grey[700],
          // Ensure all LensStatus variants (including string) have a fallback if needed, or handle it in component
          ...({} as Record<string, string>) // Fallback for arbitrary string statuses
        };
      case '#fabd2f': // Gruvbox-like yellow primary
        return {
          good: '#b8bb26',    // Gruvbox Green
          warning: '#fabd2f', // Gruvbox Yellow
          error: '#fb4934',   // Gruvbox Red
          neutral: theme.palette.grey[700],
          ...({} as Record<string, string>)
        };
      case '#88c0d0': // Nord-like blue primary
        return {
          good: '#a3be8c',    // Nord Green
          warning: '#ebcb8b', // Nord Yellow
          error: '#bf616a',   // Nord Red
          neutral: theme.palette.grey[700],
          ...({} as Record<string, string>)
        };
      default: // Zenburn (our original default dark) or other dark themes
        return {
          good: theme.palette.success.main, // Use theme's semantic success color
          warning: theme.palette.warning.main,
          error: theme.palette.error.main,
          neutral: theme.palette.grey[600], // Slightly adjusted neutral for Zenburn context
          ...({} as Record<string, string>)
        };
    }
  } else { // General light mode defaults
     switch (theme.palette.primary.main) {
        case '#1e66f5': // Catppuccin Latte Blue
            return {
                good: '#40a02b', // Catppuccin Green
                warning: '#fe640b',// Catppuccin Peach (use as warning)
                error: '#d20f39',  // Catppuccin Red
                neutral: theme.palette.grey[400],
                ...({} as Record<string, string>)
            };
        case '#268bd2': // Solarized Light Blue
            return {
                good: '#859900', // Solarized Green
                warning: '#b58900',// Solarized Yellow
                error: '#dc322f',  // Solarized Red
                neutral: theme.palette.grey[400],
                ...({} as Record<string, string>)
            };
        default: // Generic light theme
            return {
                good: theme.palette.success.light, // Use lighter shades for light themes
                warning: theme.palette.warning.light,
                error: theme.palette.error.light,
                neutral: theme.palette.grey[400],
                ...({} as Record<string, string>)
            };
     }
  }
};

// LensClusterProps - if you have this defined elsewhere, ensure it's consistent.
// If not, you might need a basic definition for it if LensCluster component expects specific props.
export interface LensClusterProps {
  lensesInput: LensProps[];
  defaultSize?: LensSizeKey;
  // ... other LensCluster specific props
}