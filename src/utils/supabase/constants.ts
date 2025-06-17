// For client-side (browser)
const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!publicSupabaseUrl) {
  throw new Error(
    "Missing environment variable for client: NEXT_PUBLIC_SUPABASE_URL"
  );
}
if (!publicSupabaseAnonKey) {
  throw new Error(
    "Missing environment variable for client: NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const PUBLIC_SUPABASE_URL: string = publicSupabaseUrl;
export const PUBLIC_SUPABASE_ANON_KEY: string = publicSupabaseAnonKey;

// For server-side (ensure these are set in your .env.local and Vercel server environment)
// SUPABASE_URL can be the same as NEXT_PUBLIC_SUPABASE_URL
// It's the KEY that's critically different for server-side admin tasks.
export const SERVER_SUPABASE_URL: string | undefined =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SERVER_SUPABASE_SERVICE_ROLE_KEY: string | undefined =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

// Optional: Add checks for server-side vars if you want to throw early,
// but often these are checked where the server client is created.
