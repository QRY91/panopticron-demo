// @deno-types="https://deno.land/std@0.208.0/http/server.d.ts"
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Environment variables are automatically injected by Supabase during deployment.
// For local development (e.g., using `supabase start`), these should be in ./supabase/.env
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Use service role for direct DB access if RLS isn't user-centric for this table
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')! // Use service role for direct DB access if RLS isn't user-centric for this table

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Consider restricting this to your frontend's URL in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the user's auth context if RLS on project_priority_history depends on the user.
    // If this function is meant to bypass RLS or operate with broader permissions,
    // use the service_role key and remove the user auth check or adapt it.
    // The original code used SUPABASE_ANON_KEY and passed user's Authorization header.
    // This is fine if RLS is set up for users to access their own project history.
    // If the table is more of an internal log, service_role key is often simpler.
    // For this example, I'll stick to the pattern of using the user's context,
    // assuming RLS might be in play. If not, SUPABASE_SERVICE_ROLE_KEY can be used
    // without passing the Authorization header from the original request.

    const authHeader = req.headers.get('Authorization')!
    // It's good practice to ensure SUPABASE_URL and a key (anon or service_role) are present
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) { // Using ANON_KEY as per original snippet for client creation
        console.error('Missing Supabase URL or Anon Key environment variables.');
        return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
    
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { // As per original, using ANON key for client
      global: { headers: { Authorization: authHeader } },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    })

    // 1. Authenticate the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Authentication error:', userError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 2. Get project_id and time_range from query parameters
    const url = new URL(req.url)
    const projectId = url.searchParams.get('project_id')
    const timeRange = url.searchParams.get('time_range') || 'all'; // Default to 'all' if not provided

    if (!projectId) {
      return new Response(JSON.stringify({ error: 'project_id is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 3. Construct the query to fetch project priority history
    let query = supabaseClient
      .from('project_priority_history')
      .select('timestamp, final_priority_sort_key, calculated_priority_score, manual_override_value_at_event, reason_for_change')
      .eq('project_id', projectId)
      .order('timestamp', { ascending: true })

    if (timeRange !== 'all') {
      const now = new Date();
      let startDate: Date | null = null;
      
      if (timeRange.endsWith('d')) {
        const days = parseInt(timeRange.slice(0, -1), 10);
        if (!isNaN(days) && days > 0) {
          startDate = new Date();
          startDate.setDate(now.getDate() - days);
        }
      } else if (timeRange.endsWith('m')) { // Example: '1m' for 1 month
        const months = parseInt(timeRange.slice(0, -1), 10);
        if (!isNaN(months) && months > 0) {
            startDate = new Date();
            startDate.setMonth(now.getMonth() - months);
        }
      }
      // Add more sophisticated date parsing if necessary (e.g., '1y', specific date ranges)
      
      if (startDate) {
        query = query.gte('timestamp', startDate.toISOString());
      } else if (timeRange !== 'all') { // If timeRange was specified but not parsed, it's an invalid range
        return new Response(JSON.stringify({ error: `Invalid time_range: ${timeRange}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
      }
    }
    
    // Apply a sensible limit to prevent abuse or performance issues
    query = query.limit(1000); // Adjust as necessary

    // 4. Execute the query
    const { data, error: queryError } = await query

    if (queryError) {
      console.error('Supabase query error:', queryError)
      return new Response(JSON.stringify({ error: queryError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // 5. Return the data
    return new Response(JSON.stringify(data || []), { // Ensure data is at least an empty array
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (e) {
    console.error('Function execution error:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: `Internal Server Error: ${errorMessage}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})