// src/app/reset-password/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { ThemedTitleV2 } from "@refinedev/mui";
import PanopticonIcon from "@components/icons/PanopticonIcon";
import { supabaseBrowserClient as supabase } from "@utils/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSessionValidForReset, setIsSessionValidForReset] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // This effect checks if there's an active session established by Supabase
    // after the user clicks the password recovery link.
    const verifySessionForPasswordReset = async () => {
      setCheckingSession(true);
      // Supabase client automatically handles the token from the URL fragment
      // when the page loads if it's a password recovery link.
      // We just need to check if a session now exists.
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setError(`Error fetching session: ${sessionError.message}`);
        setIsSessionValidForReset(false);
      } else if (session) {
        setIsSessionValidForReset(true);
      } else {
        setError(
          "No valid session found for password reset. The link may be invalid or expired. Please request a new reset link."
        );
        setIsSessionValidForReset(false);
      }
      setCheckingSession(false);
    };

    verifySessionForPasswordReset();

    // Display error from redirect if Supabase put one in the URL query params
    // (e.g. if token was invalid on initial hit to {{ .ConfirmationURL }})
    const errorDescription = searchParams.get("error_description");
    if (errorDescription && !error) {
      // Only set if no other error is already present
      setError(decodeURIComponent(errorDescription));
      setIsSessionValidForReset(false); // If Supabase threw an error, session isn't valid for reset
    }
  }, [searchParams, error]); // Added 'error' to dependency array to avoid race condition

  const handlePasswordUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password should be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(`Failed to update password: ${updateError.message}`);
    } else {
      setMessage(
        "Your password has been successfully updated! Redirecting to login..."
      );
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    setLoading(false);
  };

  const title = (
    <ThemedTitleV2
      collapsed={false}
      text="Panopticron"
      icon={
        <PanopticonIcon style={{ width: 32, height: 32, marginRight: "8px" }} />
      }
    />
  );

  if (checkingSession) {
    return (
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        {title}
        <CircularProgress sx={{ mt: 4 }} />
        <Typography sx={{ mt: 2 }}>Verifying reset link...</Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {title}
        <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
          Reset Your Password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
            {!isSessionValidForReset && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push("/forgot-password")}
                sx={{ mt: 1 }}
              >
                Request New Link
              </Button>
            )}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
            {message}
          </Alert>
        )}

        {isSessionValidForReset &&
          !message && ( // Only show form if session is valid and no success message yet
            <Box
              component="form"
              onSubmit={handlePasswordUpdate}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !password || !confirmPassword}
              >
                {loading ? <CircularProgress size={24} /> : "Set New Password"}
              </Button>
            </Box>
          )}
      </Box>
    </Container>
  );
}
