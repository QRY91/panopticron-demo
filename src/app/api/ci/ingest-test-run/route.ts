import { NextResponse, type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Define the expected payload structure using Zod for validation
const CiTestRunPayloadSchema = z.object({
  run_id: z.number().positive('run_id must be a positive number.'),
  workflow_name: z.string().min(1, 'workflow_name is required.'),
  branch: z.string().min(1, 'branch is required.'),
  commit_sha: z.string().min(1, 'commit_sha is required.'),
  status: z.string().min(1, 'status is required.'), // e.g., success, failure
  html_url: z.string().url('html_url must be a valid URL.'),
  run_started_at: z.string().datetime('run_started_at must be a valid ISO 8601 datetime string.'), // ISO 8601
});

type CiTestRunPayload = z.infer<typeof CiTestRunPayloadSchema>;

export async function POST(request: NextRequest) {
  // 1. Authenticate the request
  const authToken = request.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.CI_INGEST_TOKEN}`;

  if (!process.env.CI_INGEST_TOKEN) {
    console.error('CI_INGEST_TOKEN is not set in the environment.');
    return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
  }

  if (!authToken || authToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  // 2. Parse and validate the JSON payload
  let payload: CiTestRunPayload;
  try {
    const json = await request.json();
    payload = CiTestRunPayloadSchema.parse(json);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload.', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to parse JSON payload.' }, { status: 400 });
  }

  // 3. Prepare data for Supabase
  const supabase = createRouteHandlerClient({ cookies }, {
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY, // Ensure service role for inserts/upserts
  });

  const completed_at = new Date().toISOString();
  let duration_ms: number | null = null;

  try {
    const startedAtDate = new Date(payload.run_started_at);
    const completedAtDate = new Date(completed_at);
    if (!isNaN(startedAtDate.getTime()) && !isNaN(completedAtDate.getTime())) {
      duration_ms = completedAtDate.getTime() - startedAtDate.getTime();
    }
  } catch (e) {
    console.warn(`Could not parse dates or calculate duration for run_id ${payload.run_id}:`, e);
  }
  
  const dataToUpsert = {
    run_id: payload.run_id,
    workflow_name: payload.workflow_name,
    branch: payload.branch,
    commit_sha: payload.commit_sha,
    status: payload.status,
    conclusion: payload.status, // For V1, conclusion can mirror status from GHA job.status
    started_at: payload.run_started_at,
    completed_at: completed_at,
    duration_ms: duration_ms,
    html_url: payload.html_url,
    // total_tests, passed_tests, failed_tests, report_artifact_url will be null by default (DB schema default or explicit null)
  };

  // 4. Upsert data into ci_test_runs table
  // Upsert based on the unique `run_id` constraint
  const { data, error } = await supabase
    .from('ci_test_runs')
    .upsert(dataToUpsert, {
      onConflict: 'run_id',
      // if you want to ignore if exists instead of update:
      // ignoreDuplicates: true, 
    })
    .select()
    .single(); // Assuming upsert returns the affected row

  if (error) {
    console.error('Supabase error inserting CI test run:', error);
    return NextResponse.json({ error: 'Failed to store CI test run data.', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'CI test run data ingested successfully.', data }, { status: 201 });
}

// Handle other methods if necessary, or let them default to 405 Method Not Allowed
export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
// ...similarly for PUT, DELETE, PATCH if you want explicit 405s.