// src/app/layout.tsx
import React, { Suspense } from "react";
import { Metadata } from "next";

import { RefineKbarProvider } from "@refinedev/kbar";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineSnackbarProvider } from "@refinedev/mui";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import { inter, jetbrains_mono } from './fonts';
import { ColorModeContextProvider } from "@contexts/color-mode";
import { RefineCoreSetup } from "@components/refine-core-setup";

export const metadata: Metadata = {
  title: "Panopticron",
  description: "Project Monitoring Dashboard",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains_mono.variable}`}>
      <body>
        <Suspense>
          <RefineKbarProvider>
            <ColorModeContextProvider>
              <CssBaseline />
              <GlobalStyles
                styles={{ html: { WebkitFontSmoothing: "auto" } }}
              />
              <RefineSnackbarProvider
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <DevtoolsProvider>
                  {/* Use the client component wrapper for the core Refine setup */}
                  <RefineCoreSetup>{children}</RefineCoreSetup>
                </DevtoolsProvider>
              </RefineSnackbarProvider>
            </ColorModeContextProvider>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
