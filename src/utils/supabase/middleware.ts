// src/utils/supabase/middleware.ts
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
// Import the new public constant names
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "./constants";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Ensure the correct public environment variables are used for the client
  // that interacts with user sessions via cookies.
  if (!PUBLIC_SUPABASE_URL) {
    console.error("Supabase Middleware: NEXT_PUBLIC_SUPABASE_URL is not set.");
    // Potentially return an error response or handle differently
    // For now, we'll let createServerClient handle it if it throws, or log and proceed
  }
  if (!PUBLIC_SUPABASE_ANON_KEY) {
    console.error(
      "Supabase Middleware: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set."
    );
  }

  const supabase = createServerClient(
    PUBLIC_SUPABASE_URL, // Use public URL
    PUBLIC_SUPABASE_ANON_KEY, // Use public ANON key
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Ensure the request's cookies are updated for the current request context
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Re-create the response object to apply the new cookie to the outgoing response
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // This call is crucial for refreshing the session cookie if it's expired.
  await supabase.auth.getUser();

  return response;
}
