// src/components/lens/LensCluster.tsx
import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { Lens } from "./Lens";
import { LensProps, LensSizeKey, LENS_SIZES } from "./lens.types";

interface LensClusterProps {
  lensesInput?: LensProps[];
  // baseSize prop is for future dynamic scaling, not fully used for fixed layout yet.
  // For now, the layout assumes fixed sizes for medium and small lenses within the 164px frame.
}

// Fixed dimensions based on "L Lens Cluster" from Figma (164px total)
const L_FRAME_TOTAL_SIZE = 164; // px
const L_FRAME_PADDING = 4; // px
const L_FRAME_GAP = 4; // px

// Medium lens dimension (M Status in Figma is 76px)
const MEDIUM_LENS_SIZE_KEY: LensSizeKey = "medium";
const MEDIUM_LENS_DIM = parseFloat(LENS_SIZES[MEDIUM_LENS_SIZE_KEY].container.replace('px',''));

// Small lens dimension (S Status in Figma is 32px)
const SMALL_LENS_SIZE_KEY: LensSizeKey = "small";
const SMALL_LENS_DIM = parseFloat(LENS_SIZES[SMALL_LENS_SIZE_KEY].container.replace('px',''));

// The M-Frame (sub-cluster) holding 4 small lenses
// Width/Height: 2*small_dim + 1*gap_between_small_lenses + 2*padding_of_M-frame
const SUB_CLUSTER_PADDING = 4; // px (padding of the M-Frame itself)
const SUB_CLUSTER_GAP = 4; // px (gap between S-Lenses)
const SUB_CLUSTER_FRAME_SIZE = (SMALL_LENS_DIM * 2) + SUB_CLUSTER_GAP + (SUB_CLUSTER_PADDING * 2);


export const LensCluster: React.FC<LensClusterProps> = ({
  lensesInput = [],
}) => {
  const theme = useTheme();

  const sortedLenses = [...lensesInput].sort((a, b) => {
    const priorityA = a.priority ?? Infinity;
    const priorityB = b.priority ?? Infinity;
    if (priorityA !== priorityB) return priorityA - priorityB;
    const statusOrder = { error: 0, warning: 1, good: 2, neutral: 3 } as const;
    const statusAVal = statusOrder[a.status as keyof typeof statusOrder] ?? 4;
    const statusBVal = statusOrder[b.status as keyof typeof statusOrder] ?? 4;
    return statusAVal - statusBVal;
  });

  const mainLenses = sortedLenses.slice(0, 3);
  const subLenses = sortedLenses.slice(3, 7);

  const placeholderLensProps = (idSuffix: string): LensProps => ({
    id: `placeholder-${idSuffix}`,
    status: 'neutral',
    label: 'N/A', // Keep label for tooltip on placeholder
    icon: undefined, // No icon for placeholder, or a generic one
  });

  while (mainLenses.length < 3) {
    mainLenses.push(placeholderLensProps(`main-${mainLenses.length}`));
  }
  while (subLenses.length < 4) {
    subLenses.push(placeholderLensProps(`sub-${subLenses.length}`));  
  }

  const frameBackgroundColor = theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200];

  return (
    <Box // L-Frame (Outer Container)
      sx={{
        width: `${L_FRAME_TOTAL_SIZE}px`,
        height: `${L_FRAME_TOTAL_SIZE}px`,
        backgroundColor: frameBackgroundColor,
        borderRadius: '12px',
        padding: `${L_FRAME_PADDING}px`,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: `repeat(2, ${MEDIUM_LENS_DIM}px)`,
        gridTemplateRows: `repeat(2, ${MEDIUM_LENS_DIM}px)`,
        gap: `${L_FRAME_GAP}px`,
        alignContent: 'flex-start',
        justifyContent: 'flex-start', // Prevent items from stretching to fill grid cell
      }}
    >
      <Lens {...mainLenses[0]} size={MEDIUM_LENS_SIZE_KEY} />
      <Lens {...mainLenses[1]} size={MEDIUM_LENS_SIZE_KEY} />
      <Lens {...mainLenses[2]} size={MEDIUM_LENS_SIZE_KEY} />

      <Box // M-Frame for sub-lenses (Sub-Cluster)
        sx={{
          width: `${SUB_CLUSTER_FRAME_SIZE}px`,
          height: `${SUB_CLUSTER_FRAME_SIZE}px`,
          backgroundColor: frameBackgroundColor, // Same background for nested frame
          borderRadius: '8px',
          padding: `${SUB_CLUSTER_PADDING}px`,
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplateColumns: `repeat(2, ${SMALL_LENS_DIM}px)`,
          gridTemplateRows: `repeat(2, ${SMALL_LENS_DIM}px)`,
          gap: `${SUB_CLUSTER_GAP}px`,
          alignContent: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        {subLenses.map((lens) => (
          <Lens key={lens.id} {...lens} size={SMALL_LENS_SIZE_KEY} />
        ))}
      </Box>
    </Box>
  );
};