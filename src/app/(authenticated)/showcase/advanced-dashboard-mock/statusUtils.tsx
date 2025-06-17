import React from 'react';
import { Chip, SvgIconProps } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WarningIcon from '@mui/icons-material/Warning';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'; // For 'CANCELLED' or 'SKIPPED'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // For 'UNKNOWN' or other states

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
  const s = status?.toLowerCase(); // GitHub Actions statuses are usually lowercase
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
    case 'neutral': // Added from your type
    case 'unknown': // Added from your type
      return { icon: HelpOutlineIcon, label: status || 'Unknown', color: 'default', variant: 'outlined'};
    default:
      return { icon: HelpOutlineIcon, label: status || 'Unknown', color: 'default' };
  }
};

export const StatusCell: React.FC<{ status: string | null | undefined, type: 'vercel' | 'github' }> = ({ status, type }) => {
  const displayProps = type === 'vercel' ? getVercelStatusDisplay(status) : getGitHubCIStatusDisplay(status);
  const IconComponent = displayProps.icon;

  return (
    <Chip
      icon={<IconComponent fontSize="small" />}
      label={displayProps.label}
      color={displayProps.color}
      variant={displayProps.variant || "filled"}
      size="small"
      sx={{
        '& .MuiChip-icon': { ml: '4px' },
        '& .MuiChip-label': { pl: '6px', pr: '8px' },
        minWidth: '100px',
        justifyContent: 'flex-start',
      }}
    />
  );
};