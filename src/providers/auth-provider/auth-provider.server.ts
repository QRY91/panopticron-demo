// src/providers/auth-provider/auth-provider.server.ts
import type { AuthProvider } from "@refinedev/core";
import { createSupabaseServerClient } from "@utils/supabase/server"; // Use server utility

// Only implements the 'check' method needed for server components/routes
export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    try {
      const supabase = createSupabaseServerClient(); // Create client using cookies
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        return { authenticated: true };
      }
    } catch (error) {
       console.error("Server-side auth check failed:", error);
       // Don't expose detailed errors usually, just indicate failure
    }

    // If no user or error occurred
    return {
      authenticated: false,
      logout: true, // Signal to redirect
      redirectTo: "/login",
    };
  },
  // Other methods (login, logout, etc.) are not implemented here
  // because they typically require client-side interaction or context.
};