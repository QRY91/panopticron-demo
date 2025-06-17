import { updateSession } from "@/utils/supabase/middleware"; // Your Supabase session handler
import type { NextRequest } from "next/server";
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If it's a cron job path OR a webhook path, bypass user session logic.
  // The API route itself will handle its specific authentication (cron secret or webhook signature).
  if (pathname.startsWith('/api/cron/') || pathname.startsWith('/api/webhooks/')) {
    // console.log(`Middleware: Path ${pathname} detected, bypassing user session update. Route will handle auth.`);
    return NextResponse.next(); 
  }

  // For all other requests, proceed with user session update
  // This is where your normal user authentication happens.
  const result = await updateSession(request);
  return result;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (svg, png, jpg, etc.)
     * This ensures your /api/cron and /api/webhooks routes are processed by the middleware.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};