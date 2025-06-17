import { NextRequest } from 'next/server';

const CRON_SECRET_ENV = process.env.CRON_SECRET;

interface CronAuthResult {
  authorized: boolean;
  message?: string;
}

/**
 * Authenticates a cron job request.
 * In development:
 * - If CRON_SECRET_ENV is not set, access is granted.
 * - If CRON_SECRET_ENV is set, it checks Bearer token (from Vercel) or 'cron_secret' query param (for manual trigger).
 * In production:
 * - Strictly checks for `Authorization: Bearer <CRON_SECRET_ENV>`.
 * @param request The NextRequest object.
 * @param cronJobName A descriptive name for the cron job for logging purposes (e.g., "Vercel Sync", "GitHub Sync").
 * @returns CronAuthResult object with authorization status and optional message.
 */
export function authenticateCronRequest(request: NextRequest, cronJobName: string): CronAuthResult {
  const authHeader = request.headers.get("authorization");
  const cronSecretFromQuery = request.nextUrl.searchParams.get("cron_secret");

  if (process.env.NODE_ENV === "development") {
    if (!CRON_SECRET_ENV) {
      console.log(`CRON_AUTH (${cronJobName}): DEV mode, no CRON_SECRET_ENV set, access granted.`);
      return { authorized: true };
    }
    if (authHeader === `Bearer ${CRON_SECRET_ENV}`) {
      console.log(`CRON_AUTH (${cronJobName}): DEV mode, CRON_SECRET_ENV matched Bearer token.`);
      return { authorized: true };
    }
    if (cronSecretFromQuery === CRON_SECRET_ENV) {
      console.log(`CRON_AUTH (${cronJobName}): DEV mode, CRON_SECRET_ENV matched query parameter.`);
      return { authorized: true };
    }
    const message = `CRON_AUTH (${cronJobName}): DEV mode, CRON_SECRET_ENV is set but no valid secret provided in header or query.`;
    console.warn(message);
    return { authorized: false, message };
  } else {
    // Production mode
    if (authHeader === `Bearer ${CRON_SECRET_ENV}`) {
      // console.log(`CRON_AUTH (${cronJobName}): Production mode, Bearer token matched.`); // Optional: too verbose for prod
      return { authorized: true };
    }
    const message = `CRON_AUTH (${cronJobName}): Production mode, Unauthorized trigger attempt. Invalid or missing Bearer token.`;
    console.warn(message);
    return { authorized: false, message };
  }
}