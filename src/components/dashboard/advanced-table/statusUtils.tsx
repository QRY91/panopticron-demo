import React from 'react';
import { Chip, SvgIconProps, alpha, Link as MuiLink } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// import WarningIcon from '@mui/icons-material/Warning'; // Not used by current statuses, can be added if needed
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // Critical
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';     // High
import WarningAmberIcon from '@mui/icons-material/WarningAmber';   // Medium
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';     // Low
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Good

export interface PriorityDisplayProps {
  label: string;
  color: string; // Hex or theme color path e.g., 'error.main', 'warning.light'
  backgroundColor: string; // For row background, can be more subtle (e.g., alpha)
  icon?: React.ElementType<SvgIconProps>;
}

export const getPriorityDisplayProps = (
  priorityScore: number | null | undefined,
  theme: any // Pass MUI theme object for theme-aware colors
): PriorityDisplayProps => {
  const score = priorityScore ?? 10000; // Default to good if no score

  // Define thresholds (adjust these to your scoring system)
  const thresholds = {
    critical: 2000,
    high: 5000,
    medium: 8000,
    low: 9999, // Up to just before default "good"
  };

  // Define colors (use theme colors for consistency)
  // Background colors should be subtle (low alpha)
  if (score < thresholds.critical) {
    return {
      label: "Critical",
      icon: ReportProblemIcon,
      color: theme.palette.error.main,
      backgroundColor: alpha(theme.palette.error.main, 0.1),
    };
  }
  if (score < thresholds.high) {
    return {
      label: "High",
      icon: ErrorOutlineIcon,
      color: theme.palette.error.light, // Or a custom orange
      backgroundColor: alpha(theme.palette.error.light, 0.08),
    };
  }
  if (score < thresholds.medium) {
    return {
      label: "Medium",
      icon: WarningAmberIcon,
      color: theme.palette.warning.main,
      backgroundColor: alpha(theme.palette.warning.main, 0.08),
    };
  }
  if (score <= thresholds.low) { // Use <= for the last "bad" tier
    return {
      label: "Low",
      icon: InfoOutlinedIcon,
      color: theme.palette.info.main,
      backgroundColor: alpha(theme.palette.info.main, 0.07),
    };
  }
  return { // Good / Stable
    label: "Stable",
    icon: CheckCircleOutlineIcon,
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.main, 0.05), // Very subtle or theme.palette.background.paper
  };
};

interface StatusDisplay {
  icon: React.ElementType<SvgIconProps>;
  label: string;
  color: 'success' | 'error' | 'warning' | 'info' | 'default';
  variant?: 'filled' | 'outlined';
}

export const getVercelStatusDisplay = (status: string | null | undefined): StatusDisplay => {
  const s = status?.toUpperCase();
  switch (s) {
    case 'READY':
      return { icon: CheckCircleIcon, label: 'Ready', color: 'success' };
    case 'BUILDING':
      return { icon: HourglassEmptyIcon, label: 'Building', color: 'info' };
    case 'ERROR':
      return { icon: ErrorIcon, label: 'Error', color: 'error' };
    case 'QUEUED':
      return { icon: HourglassEmptyIcon, label: 'Queued', color: 'info' };
    case 'CANCELLED':
      return { icon: DoNotDisturbOnIcon, label: 'Cancelled', color: 'default' };
    default:
      return { icon: HelpOutlineIcon, label: status || 'Unknown', color: 'default' };
  }
};

export const getGitHubCIStatusDisplay = (status: string | null | undefined): StatusDisplay => {
  const s = status?.toLowerCase();
  switch (s) {
    case 'success':
      return { icon: CheckCircleIcon, label: 'Success', color: 'success' };
    case 'failure':
    case 'error':
      return { icon: ErrorIcon, label: 'Failure', color: 'error' };
    case 'in_progress':
    case 'pending':
      return { icon: HourglassEmptyIcon, label: 'In Progress', color: 'info' };
    case 'cancelled':
      return { icon: DoNotDisturbOnIcon, label: 'Cancelled', color: 'default' };
    case 'skipped':
      return { icon: DoNotDisturbOnIcon, label: 'Skipped', color: 'default', variant: 'outlined' };
    case 'neutral':
    case 'unknown':
      return { icon: HelpOutlineIcon, label: status || 'Unknown', color: 'default', variant: 'outlined'};
    default:
      return { icon: HelpOutlineIcon, label: status || 'Unknown', color: 'default' };
  }
};

export const StatusCell: React.FC<{ 
  status: string | null | undefined, 
  type: 'vercel' | 'github',
  href?: string | null;
}> = ({ status, type, href }) => {
  const displayProps = type === 'vercel' ? getVercelStatusDisplay(status) : getGitHubCIStatusDisplay(status);
  const IconComponent = displayProps.icon;

  const chipComponent = (
    <Chip
      icon={<IconComponent fontSize="small" />}
      label={displayProps.label}
      color={displayProps.color}
      variant={displayProps.variant || "filled"}
      size="small"
      sx={{
        "& .MuiChip-icon": { ml: "4px" },
        "& .MuiChip-label": { pl: "6px", pr: "8px" },
        minWidth: "100px",
        justifyContent: "flex-start",
        cursor: href ? "pointer" : "default",
        "&:hover": href
          ? {
              opacity: 0.85,
            }
          : {},
      }}
    />
  );

  if (href) {
    return (
      <MuiLink 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        underline="none"
        aria-label={`View ${type} status details for ${displayProps.label}`} // Accessibility
      >
        {chipComponent}
      </MuiLink>
    );
  }

  return chipComponent;
};