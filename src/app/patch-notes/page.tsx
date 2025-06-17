// src/app/patch-notes/page.tsx
"use client";

import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Chip,
  Link as MuiLink,
  Button,
  useTheme, // alpha might not be needed if not used directly
} from "@mui/material";
import Link from "next/link";
import { patchNotesData } from "@mock-data/patchNotes"; // Removed type PatchNote if not used here
import { PublicPageLayout } from "@components/layout/PublicPageLayout";


export default function PatchNotesPage() {
  const theme = useTheme(); // Still useful for theme.spacing or other theme values

  return (
    <PublicPageLayout>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, flexGrow: 1 }}>
        <Typography
          variant="h2" // Will use JetBrains Mono from theme
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", color: "primary.main" }}
        >
          Patch Notes
        </Typography>
        <Typography
          variant="h6" // Will use JetBrains Mono from theme
          color="text.secondary"
          textAlign="center"
          paragraph
          sx={{
            mb: 6,
          }}
        >
          Keeping the garage door open! Here’s what’s new and improved in
          Panopticron.
        </Typography>

        {patchNotesData.map((note, index) => (
          <Paper
            key={note.version}
            elevation={2}
            sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}
          >
            <Box /* ... sx ... */>
              <Typography
                variant="h4" // JetBrains Mono from theme
                component="h2"
                sx={{ mb: { xs: 1, sm: 0 } }}
              >
                {note.title}
              </Typography>
              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  display="block"
                >
                  {note.version}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {note.date}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ fontStyle: "italic" }}
            >
              {note.summary}
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, my: 1, listStyle: "disc" }}>
              {note.details.map((detail, detailIndex) => (
                <Typography
                  component="li"
                  variant="body1"
                  key={detailIndex}
                  sx={{ mb: 0.5 }}
                >
                  {detail}
                </Typography>
              ))}
            </Box>
            {note.tags && note.tags.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {note.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
            {index < patchNotesData.length - 1 && (
              <Divider sx={{ mt: 3, mb: -(parseInt(theme.spacing(3).replace('px','')) + 1) + 'px' }} />
            )}{" "}
            {/* Divider between notes, adjust negative margin for spacing */}
          </Paper>
        ))}

        <Divider sx={{ my: 4 }} />
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            📣 *Indicates a change or improvement made thanks to valuable
            community feedback. Thank you!*
          </Typography>
        </Box>
        <Box textAlign="center" mt={4} mb={2}>
          <Button
            component={Link}
            href="/"
            variant="outlined"
            color="primary"
            size="large"
          >
            {/* Button text will use font from theme's button typography (JetBrains Mono in example) */}
            Back to Home
          </Button>
        </Box>
      </Container>
    </PublicPageLayout>
  );
}
