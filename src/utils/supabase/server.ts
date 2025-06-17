import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
// Import server-specific constants
import {
  SERVER_SUPABASE_URL,
  SERVER_SUPABASE_SERVICE_ROLE_KEY,
} from "./constants";

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();

  // Critical check for server-side variables
  if (!SERVER_SUPABASE_URL) {
    throw new Error(
      "Missing Supabase URL for server client creation (check SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL env var)."
    );
  }
  if (!SERVER_SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing Supabase Service Role Key for server client creation (check SUPABASE_SERVICE_ROLE_KEY env var)."
    );
  }

  return createServerClient(
    SERVER_SUPABASE_URL,
    SERVER_SUPABASE_SERVICE_ROLE_KEY,
    {
      // Use SERVICE_ROLE_KEY
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  );
};
