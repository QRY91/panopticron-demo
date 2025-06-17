import { NextRequest } from "next/server";
import { DEMO_CONFIG } from "@demo-config";

interface CronAuthResult {
  authorized: boolean;
  message?: string;
}

/**
 * Authenticates a cron job request.
 * In demo mode:
 * - Always grants access
 * In production:
 * - Strictly checks for `Authorization: Bearer <CRON_SECRET_ENV>`.
 * @param request The NextRequest object.
 * @param cronJobName A descriptive name for the cron job for logging purposes (e.g., "Vercel Sync", "GitHub Sync").
 * @returns CronAuthResult object with authorization status and optional message.
 */
export function authenticateCronRequest(
  request: NextRequest,
  cronJobName: string
): CronAuthResult {
  // Always allow access in demo mode
  if (DEMO_CONFIG.DEMO_MODE) {
    return { authorized: true };
  }

  const authHeader = request.headers.get("authorization");
  const CRON_SECRET_ENV = process.env.CRON_SECRET;

  // Production mode
  if (authHeader === `Bearer ${CRON_SECRET_ENV}`) {
    return { authorized: true };
  }
  const message = `CRON_AUTH (${cronJobName}): Production mode, Unauthorized trigger attempt. Invalid or missing Bearer token.`;
  console.warn(message);
  return { authorized: false, message };
}
