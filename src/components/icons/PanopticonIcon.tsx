// src/components/icons/PanopticonIcon.tsx
import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const PanopticonIconSVGContent = () => {
  const vbSize = 100;
  const vbCenter = vbSize / 2;
  const centralHexRadius = 15;
  const pentagonInnerRadius = centralHexRadius + 2;
  const pentagonOuterRadius = 45;
  const pentagonWidthFactor = 0.8;
  const turretRadius = 5;
  const turretOffset = pentagonOuterRadius - turretRadius / 2;

  const getPolygonPoints = (centerX: number, centerY: number, radius: number, sides: number, startAngleDeg: number = 0): string => {
    let points = "";
    for (let i = 0; i < sides; i++) {
      const angleDeg = startAngleDeg + (i * 360 / sides);
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY + radius * Math.sin(angleRad);
      points += `${x.toFixed(2)},${y.toFixed(2)} `;
    }
    return points.trim();
  };

  const centralHexPoints = getPolygonPoints(vbCenter, vbCenter, centralHexRadius, 6, 30);
  const petalPointsData = [
    { angle: -25, radius: pentagonInnerRadius * pentagonWidthFactor * 1.5 },
    { angle: 25, radius: pentagonInnerRadius * pentagonWidthFactor * 1.5 },
    { angle: 25, radius: pentagonOuterRadius * 0.8 },
    { angle: 0, radius: pentagonOuterRadius },
    { angle: -25, radius: pentagonOuterRadius * 0.8 },
  ];

  const getPetalPoints = (rotationDeg: number): string => {
    return petalPointsData.map(p => {
      const angleRad = ((p.angle + rotationDeg) * Math.PI) / 180;
      const x = vbCenter + p.radius * Math.cos(angleRad);
      const y = vbCenter + p.radius * Math.sin(angleRad);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");
  };

  return (
    <>
      <style>
        {`
          .panopticron-shape-static { /* Renamed for clarity if used outside component */
            stroke: #DCDCCC; /* Zenburn text color for outline */
            stroke-width: 2;
            stroke-linejoin: round;
            stroke-linecap: round;
          }
          .panopticron-petal-static {
            fill: rgba(135, 206, 235, 0.1); /* Zenburn primary subtle fill */
          }
          .panopticron-center-static {
            fill: rgba(240, 230, 140, 0.15); /* Zenburn secondary subtle fill */
          }
          .panopticron-turret-static {
            fill: #DCDCCC; /* Zenburn text color for solid turrets */
          }
        `}
      </style>
      <g className="panopticron-shape-static">
        <polygon points={centralHexPoints} className="panopticron-center-static" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <polygon
            key={`petal-static-${angle}`}
            points={getPetalPoints(angle - 90)}
            className="panopticron-petal-static"
          />
        ))}
        {[0, 60, 120, 180, 240, 300].map((angleDeg) => {
          const angleRad = ((angleDeg - 90) * Math.PI) / 180;
          const cx = vbCenter + turretOffset * Math.cos(angleRad);
          const cy = vbCenter + turretOffset * Math.sin(angleRad);
          return (
            <circle
              key={`turret-static-${angleDeg}`}
              cx={cx.toFixed(2)}
              cy={cy.toFixed(2)}
              r={(turretRadius / 1.5).toFixed(2)}
              className="panopticron-turret-static"
              stroke="none"
            />
          );
        })}
      </g>
    </>
  );
};

// The actual MUI SvgIcon component (if you need it for React use)
const PanopticonIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 100 100">
      <PanopticonIconSVGContent />
    </SvgIcon>
  );
};
export default PanopticonIcon;
// Exporting the content separately can be useful for direct SVG embedding
export { PanopticonIconSVGContent };