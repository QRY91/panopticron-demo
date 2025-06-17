// src/components/lens/Lens.tsx
import React from "react";
import { Box, BoxProps, Typography, useTheme, Link as MuiLink, CircularProgress, Tooltip } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove'; // For stable trend

import { LensProps, getLensStatusColors, LENS_SIZES, LensSizeKey } from "./lens.types";

interface InternalLensProps extends LensProps, Omit<BoxProps, 'id' | 'sx'> {
  size: LensSizeKey; // Use the new LensSizeKey
}

export const Lens: React.FC<InternalLensProps> = ({
  id, status, icon: IconComponent, label, size, sx, href,
  value, valueUnit, subLabel, trend, trendColor, isLoading,
  ...rest
}) => {
  const theme = useTheme();
  const LENS_STATUS_COLORS = getLensStatusColors(theme);

  const backgroundColor = LENS_STATUS_COLORS[status] || LENS_STATUS_COLORS.neutral;
  const dimensions = LENS_SIZES[size] || LENS_SIZES.medium;
  const iconColor = theme.palette.getContrastText(backgroundColor);

  // Determine if this is a complex lens with multiple content elements
  const hasMultipleElements = !!(value || subLabel || trend);
  
  // Adjust padding based on size and complexity
  const getPaddingForSize = (size: LensSizeKey, isComplex: boolean) => {
    if (isComplex) {
      switch (size) {
        case 'small': return 0.25;
        case 'compact': return 0.5;
        case 'medium': return 0.75;
        case 'large': return 1;
        case 'xl': return 1.25;
        default: return 0.75;
      }
    } else {
      return 0.5;
    }
  };

  let TrendIcon = null;
  if (trend === 'up') TrendIcon = ArrowUpwardIcon;
  else if (trend === 'down') TrendIcon = ArrowDownwardIcon;
  else if (trend === 'stable') TrendIcon = RemoveIcon;

  const lensContent = (
    <Tooltip title={label || `${status} status`} placement="top" arrow>
      <Box
        id={id}
        aria-label={label || `${status} status`}
        sx={{
          width: dimensions.container,
          height: dimensions.container,
          backgroundColor,
          borderRadius: dimensions.borderRadius,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          overflow: "hidden",
          p: getPaddingForSize(size, hasMultipleElements),
          boxSizing: 'border-box',
          position: 'relative',
          cursor: href ? 'pointer' : 'default',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': href ? {
              transform: 'scale(1.05)',
              boxShadow: theme.shadows[4],
          } : {},
          ...sx,
        }}
        {...rest}
      >
        {isLoading ? (
          <CircularProgress size={parseFloat(dimensions.iconFontSize) * 0.7} color="inherit" />
        ) : (
          <>
            {IconComponent && (size !== 'small' && size !== 'compact') && (
              <IconComponent sx={{ 
                fontSize: hasMultipleElements ? `calc(${dimensions.iconFontSize} * 0.8)` : dimensions.iconFontSize, 
                mb: (value || subLabel) ? 0.25 : 0 
              }} />
            )}
            {value !== undefined && (
              <Box sx={{display: 'flex', alignItems: 'baseline', lineHeight: 1.1}}>
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ fontWeight: 'bold', fontSize: dimensions.valueFontSize, color: 'inherit' }}
                >
                  {value}
                </Typography>
                {valueUnit && <Typography variant="caption" component="span" sx={{ fontSize: `calc(${dimensions.valueFontSize} * 0.6)`, ml: 0.25, opacity: 0.8, color: 'inherit' }}>{valueUnit}</Typography>}
              </Box>
            )}
            {subLabel && (size !== 'small' && size !== 'compact') && (
              <Typography
                variant="caption"
                component="div"
                sx={{ 
                  fontSize: dimensions.subLabelFontSize, 
                  opacity: 0.9, 
                  lineHeight: 1.1, 
                  mt: value !== undefined ? 0.2 : 0.4, 
                  textAlign: 'center',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {subLabel}
              </Typography>
            )}
            {IconComponent && (size === 'small' || size === 'compact') && !value && !subLabel && (
                 <IconComponent sx={{ fontSize: dimensions.iconFontSize }} />
            )}
            {TrendIcon && (size !== 'small' && size !== 'compact') && (
              <TrendIcon sx={{
                fontSize: `calc(${dimensions.iconFontSize} * 0.35)`,
                position: 'absolute',
                bottom: theme.spacing(0.4),
                right: theme.spacing(0.4),
                color: trendColor || iconColor,
                opacity: 0.8
              }} />
            )}
          </>
        )}
      </Box>
    </Tooltip>
  );

  if (href) {
    return (
      <MuiLink href={href} target="_blank" rel="noopener noreferrer" underline="none">
        {lensContent}
      </MuiLink>
    );
  }
  return lensContent;
};