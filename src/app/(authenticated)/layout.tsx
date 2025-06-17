// src/app/(authenticated)/layout.tsx
"use client";

import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/mui";
import React from "react";
import { useLogout } from "@refinedev/core";
import { Header } from "@components/header";
import PanopticonIcon from "@components/icons/PanopticonIcon";
import { Box, Typography, Alert, AlertTitle, Button } from "@mui/material";
import Link from "next/link";
import PanopticonSpinner from "@components/loaders/PanopticonSpinner";
import { useApprovalStatus } from "@hooks/useApprovalStatus";
import { useRouter } from "next/navigation";
import { DEMO_CONFIG, isAuthDisabled } from "@/demo-config";

export default function AuthenticatedLayout({
  children,
}: React.PropsWithChildren) {
  const {
    isApproved,
    isLoading: isLoadingApproval,
    error: approvalCheckError,
  } = useApprovalStatus();
  const { mutate: logoutMutate } = useLogout();
  const router = useRouter();

  // Demo mode: bypass all approval checks and render the app directly
  if (DEMO_CONFIG.DEMO_MODE || isAuthDisabled()) {
    return (
      <ThemedLayoutV2
        Header={() => <Header sticky />}
        Title={({ collapsed }) => (
          <ThemedTitleV2
            collapsed={collapsed}
            text="Panopticron"
            icon={
              <PanopticonIcon
                style={{
                  width: 32,
                  height: 32,
                  marginRight: collapsed ? 0 : "8px",
                }}
              />
            }
          />
        )}
      >
        {children}
      </ThemedLayoutV2>
    );
  }

  // 1. Overall Loading State
  if (isLoadingApproval) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <PanopticonSpinner />
        <Typography sx={{ ml: 2 }}>Verifying access...</Typography>
      </Box>
    );
  }

  // 2. Not Approved (includes pending or actual denial)
  // isApproved will be false if not authenticated by core OR explicitly not in approved_users
  if (isApproved === false) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        p={3}
        textAlign="center"
      >
        <Alert
          severity={approvalCheckError ? "error" : "info"}
          sx={{ mb: 2, maxWidth: "500px" }}
        >
          <AlertTitle>
            {approvalCheckError
              ? "Access Error"
              : "Access Denied / Pending Approval"}
          </AlertTitle>
          {approvalCheckError ||
            "Your account requires approval or is not permitted to access this area. If you've recently signed up, please wait for admin approval. Otherwise, contact support."}
        </Alert>
        <Typography variant="caption" sx={{ mb: 2 }}>
          If this is unexpected, you can try a different account.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={() => logoutMutate()}>
            Logout
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              logoutMutate(undefined, {
                // Call logout
                onSuccess: () => {
                  router.push("/login"); // Programmatically navigate after logout success
                },
                onError: () => {
                  // Even if logout fails for some reason, still try to go to login
                  router.push("/login");
                },
              });
            }}
          >
            Login as Different User
          </Button>
        </Box>
      </Box>
    );
  }

  // 3. Approved: Render the app
  // This condition implies isApproved === true
  return (
    <ThemedLayoutV2
      Header={() => <Header sticky />}
      Title={({ collapsed }) => (
        <ThemedTitleV2
          collapsed={collapsed}
          text="Panopticron"
          icon={
            <PanopticonIcon
              style={{
                width: 32,
                height: 32,
                marginRight: collapsed ? 0 : "8px",
              }}
            />
          }
        />
      )}
    >
      {children}
    </ThemedLayoutV2>
  );
}
