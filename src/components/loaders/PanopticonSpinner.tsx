// src/components/Loaders/PanopticonSpinner.tsx
import React from 'react';
import { Box, keyframes, useTheme } from '@mui/material'; // Added useTheme

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

interface PanopticonSpinnerProps {
  size?: number | string;
}

const PanopticonSpinner: React.FC<PanopticonSpinnerProps> = ({ size = 48 }) => {
  const theme = useTheme(); // Get theme for dynamic colors

  // Define colors based on theme - these can be adjusted per theme in your themes/index.ts if desired
  const strokeColor = theme.palette.primary.main; // Use theme's primary color for outline
  const turretFillColor = theme.palette.primary.dark; // Use a darker shade or same as primary

  // Recalculated turret positions for better symmetry (radius from center approx 42.5)
  // Radius of turret circles
  const turretCircleRadius = 3.33;

  // Center of the viewBox
  const vbCenter = 50;
  // Distance from center to turret centers
  const turretOffset = 42.5;

  const turrets = [
    { angle: 0 - 90 },    // Top
    { angle: 60 - 90 },   // Top-right
    { angle: 120 - 90 },  // Bottom-right
    { angle: 180 - 90 },  // Bottom
    { angle: 240 - 90 },  // Bottom-left
    { angle: 300 - 90 },  // Top-left
  ];

  return (
    <Box
      sx={{
        display: 'inline-block',
        width: size,
        height: size,
        animation: `${rotate} 1.5s linear infinite`, // Slightly faster spin
        '& > svg': {
          display: 'block',
          width: '100%',
          height: '100%',
        },
      }}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <style>
          {`
            .panopticron-spinner-petal, .panopticron-spinner-center {
              stroke: ${strokeColor};
              stroke-width: 3.5; /* Slightly adjusted */
              stroke-linejoin: round;
              stroke-linecap: round;
              fill: none;
            }
            .panopticron-spinner-turret {
              fill: ${turretFillColor};
              stroke: none;
            }
          `}
        </style>
        <g> {/* Group for petals and center, no class needed if styled directly */}
          {/* Central Hexagon - outline only */}
          <polygon className="panopticron-spinner-center" points="50.00,35.00 62.99,42.50 62.99,57.50 50.00,65.00 37.01,57.50 37.01,42.50" />
          {/* Petals - outline only */}
          {/* Using the same petal definition as before, assuming this geometry is okay */}
          <polygon className="panopticron-spinner-petal" points="56.73,36.50 60.59,38.46 73.44,46.32 75.00,55.00 66.63,64.61 58.41,61.54" transform="rotate(-90 50 50)" />
          <polygon className="panopticron-spinner-petal" points="56.73,36.50 60.59,38.46 73.44,46.32 75.00,55.00 66.63,64.61 58.41,61.54" transform="rotate(-30 50 50)" />
          <polygon className="panopticron-spinner-petal" points="56.73,36.50 60.59,38.46 73.44,46.32 75.00,55.00 66.63,64.61 58.41,61.54" transform="rotate(30 50 50)" />
          <polygon className="panopticron-spinner-petal" points="56.73,36.50 60.59,38.46 73.44,46.32 75.00,55.00 66.63,64.61 58.41,61.54" transform="rotate(90 50 50)" />
          <polygon className="panopticron-spinner-petal" points="56.73,36.50 60.59,38.46 73.44,46.32 75.00,55.00 66.63,64.61 58.41,61.54" transform="rotate(150 50 50)" />
          <polygon className="panopticron-spinner-petal" points="56.73,36.50 60.59,38.46 73.44,46.32 75.00,55.00 66.63,64.61 58.41,61.54" transform="rotate(210 50 50)" />
        </g>
        {/* Turrets - solid fill, recalculated positions */}
        {turrets.map((turret, index) => {
            const angleRad = (turret.angle * Math.PI) / 180;
            const cx = vbCenter + turretOffset * Math.cos(angleRad);
            const cy = vbCenter + turretOffset * Math.sin(angleRad);
            return (
                <circle
                    key={`turret-${index}`}
                    className="panopticron-spinner-turret"
                    cx={cx.toFixed(2)}
                    cy={cy.toFixed(2)}
                    r={turretCircleRadius.toFixed(2)}
                />
            );
        })}
      </svg>
    </Box>
  );
};

export default PanopticonSpinner;