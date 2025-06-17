import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "@utils/supabase/constants";

import LandingPageDisplay from "@components/landing-page";
import { DEMO_CONFIG, isAuthDisabled } from "@/demo-config";
//trigger deploy
// Helper to create Supabase client for Server Components (using public/anon key for user auth)
function getSupabaseServerClientForUserAuth() {
  // Renamed for clarity
  const cookieStore = cookies();

  // Check if the public URL and anon key are available
  if (!PUBLIC_SUPABASE_URL) {
    console.error(
      "Root Page: NEXT_PUBLIC_SUPABASE_URL missing for server client (user auth)."
    );
    // Potentially throw an error or handle gracefully
    throw new Error(
      "Server configuration error: Missing Supabase URL for user authentication."
    );
  }
  if (!PUBLIC_SUPABASE_ANON_KEY) {
    console.error(
      "Root Page: NEXT_PUBLIC_SUPABASE_ANON_KEY missing for server client (user auth)."
    );
    throw new Error(
      "Server configuration error: Missing Supabase Anon Key for user authentication."
    );
  }

  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // You might need set/remove if your auth flow in Server Components updates cookies,
      // though often middleware handles this.
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
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
  });
}

export default async function RootPage() {
  // Demo mode: bypass authentication and go to landing page for presentation intro
  if (DEMO_CONFIG.DEMO_MODE || isAuthDisabled()) {
    redirect("/landing-page");
  }

  const supabase = getSupabaseServerClientForUserAuth(); // Use the renamed function
  let isAuthenticated = false;

  // No need to check if supabase is null here if getSupabaseServerClientForUserAuth throws on missing env vars
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    isAuthenticated = true;
  }

  if (isAuthenticated) {
    redirect("/dashboard");
  } else {
    return <LandingPageDisplay />;
  }
}
