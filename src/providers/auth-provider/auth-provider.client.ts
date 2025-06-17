// src/providers/auth-provider/auth-provider.client.ts
"use client";

import type { AuthProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "@utils/supabase/client"; // Use client utility
import { mockAuthProvider } from "@providers/mock-auth-provider";
import { DEMO_CONFIG, isAuthDisabled } from "@/demo-config";

const supabaseAuthProvider: AuthProvider = {
  login: async ({ email, password, providerName }) => {
    try {
      if (providerName) {
        const { data, error } =
          await supabaseBrowserClient.auth.signInWithOAuth({
            provider: providerName as any,
            options: {
              redirectTo: `${window.location.origin}/`, // Redirect after OAuth success
            },
          });
        if (error) return { success: false, error };
        if (data?.url) return { success: true }; // Redirect handled by Supabase
      }

      // Email/Password Login
      const { data, error } =
        await supabaseBrowserClient.auth.signInWithPassword({
          email,
          password,
        });
      if (error) return { success: false, error };
      if (data?.user) {
        // For email/password
        return {
          success: true,
          redirectTo: "/dashboard",
        };
      }
    } catch (error: any) {
      return { success: false, error };
    }
    return {
      success: false,
      error: { name: "LoginError", message: "Invalid credentials or flow" },
    };
  },

  register: async ({ email, password }) => {
    try {
      const { data, error } = await supabaseBrowserClient.auth.signUp({
        email,
        password,
        // Optional: You can add options here if needed, like redirecting
        // to a specific page after they click the confirmation link.
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        return {
          success: false,
          error, // Refine will use error.message for the notification
        };
      }

      // data.user will exist if sign up initiated successfully, even if email confirmation is pending
      // data.session will be null if email confirmation is required
      if (data.user) {
        return {
          success: true,
          // We don't redirect here because the user needs to confirm their email.
          // Refine's useRegister onSuccess will show a success notification by default.
          // We can customize the message via notificationProvider if needed,
          // but the default is often "Successfully registered! Please check your email for confirmation."
          // or similar if i18n is configured.
          successNotification: {
            // Explicitly define success notification content
            message: "Registration successful!",
            description: "Please check your email to confirm your account.",
            type: "success",
          },
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        name: "RegisterError",
        message: "Registration failed. Please try again.",
      },
    };
  },

  forgotPassword: async ({ email }) => {
    try {
      const { data, error } =
        await supabaseBrowserClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
      if (error)
        return {
          success: false,
          error: { name: "ForgotPassError", message: error.message },
        };
      if (data) return { success: true }; // Indicate success (e.g., show message "Check your email")
    } catch (error: any) {
      return {
        success: false,
        error: { name: "ForgotPassError", message: error.message },
      };
    }
    return {
      success: false,
      error: { name: "ForgotPassError", message: "Request failed" },
    };
  },

  updatePassword: async ({ password }) => {
    try {
      const { data, error } = await supabaseBrowserClient.auth.updateUser({
        password,
      });
      if (error) return { success: false, error };
      if (data) return { success: true, redirectTo: "/dashboard" }; // Redirect after successful update
    } catch (error: any) {
      return { success: false, error };
    }
    return {
      success: false,
      error: { name: "UpdatePassError", message: "Update failed" },
    };
  },

  logout: async () => {
    const { error } = await supabaseBrowserClient.auth.signOut();
    if (error) return { success: false, error };
    return { success: true, redirectTo: "/" }; // Redirect after logout
  },

  onError: async (error) => {
    // error here is typically RefineError
    console.error(
      "Auth Provider onError (Still Simplified for Debugging):",
      error
    );
    // If the incoming error already has a good structure, use it
    if (error && (error instanceof Error || (error.message && error.name))) {
      return { error }; // Pass the original error object if it's valid
    }
    // Otherwise, create a minimal error object
    return {
      error: {
        message:
          (error as any)?.message || "An error occurred during data fetching.",
        name: (error as any)?.name || "DataProviderError", // Add a name property
      },
    };
  },

  // === Client-side Check ===
  check: async () => {
    // Prefer getSession for client-side check as it's often faster if session is cached
    const {
      data: { session },
    } = await supabaseBrowserClient.auth.getSession();
    if (session) return { authenticated: true };

    // Fallback or if getSession fails somehow
    const {
      data: { user },
      error,
    } = await supabaseBrowserClient.auth.getUser();
    if (error)
      return {
        authenticated: false,
        error,
        logout: true,
        redirectTo: "/login",
      };
    if (user) return { authenticated: true };

    return { authenticated: false, logout: true, redirectTo: "/login" };
  },

  getPermissions: async () => {
    const {
      data: { user },
    } = await supabaseBrowserClient.auth.getUser();
    return user?.role || null; // Or return roles array based on your app logic
  },

  getIdentity: async () => {
    const {
      data: { user },
    } = await supabaseBrowserClient.auth.getUser();
    if (user) {
      return { ...user, name: user.email }; // Return standard identity fields
    }
    return null;
  },
};

// Use mock auth provider in demo mode, otherwise use Supabase
export const authProviderClient: AuthProvider =
  isAuthDisabled() || DEMO_CONFIG.DEMO_MODE
    ? mockAuthProvider
    : supabaseAuthProvider;
