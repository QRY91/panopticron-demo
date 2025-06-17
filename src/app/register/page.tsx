// src/app/register/page.tsx
"use client";

import React, { useState } from "react";
import { AuthPage as RefineAuthPage } from "@refinedev/mui";
import { ThemedTitleV2 } from "@refinedev/mui";
import PanopticonIcon from "@components/icons/PanopticonIcon";
import { Box, Typography, Alert, Paper, Button } from "@mui/material";
import { useRegister, type RegisterFormTypes } from "@refinedev/core";
import Link from "next/link";

export default function RegisterPage() {
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const { mutate: registerMutation, isLoading } = useRegister<{
    email: string;
    password?: string;
  }>();

  const handleRegister = (values: RegisterFormTypes) => {
    if (!values.email) {
      console.error("Registration attempt without an email.");
      return;
    }

    setSubmittedEmail(values.email);

    registerMutation(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          setRegistrationSubmitted(true);
        },
        onError: (error) => {
          console.error("Registration failed:", error);
        },
      }
    );
  };

  if (registrationSubmitted) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <ThemedTitleV2
            collapsed={false}
            text="Panopticron"
            icon={<PanopticonIcon style={{ width: 32, height: 32, marginRight: '8px' }} />}
          />
          <Alert severity="success" sx={{ mt: 2, mb: 2, textAlign: 'left' }}>
            <Typography gutterBottom>Registration Submitted!</Typography>
            <Typography variant="body2">
              Please check your email ({submittedEmail || 'your email address'}) for a confirmation link to activate your account.
            </Typography>
          </Alert>
          <Button component={Link} href="/login" variant="outlined">
            Back to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <RefineAuthPage
      type="register"
      title={
        <ThemedTitleV2
          collapsed={false}
          text="Panopticron"
          icon={<PanopticonIcon style={{ width: 32, height: 32, marginRight: '8px' }} />}
        />
      }
      formProps={{
        onSubmit: handleRegister,
      }}
    />
  );
}