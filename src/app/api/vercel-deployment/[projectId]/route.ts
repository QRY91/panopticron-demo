// src/app/api/vercel-deployment/[projectId]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Keep your Vercel interface (or import if defined elsewhere)
interface IVercelDeploymentDetail {
  uid: string;
  url: string;
  name: string;
  readyState:
    | "QUEUED"
    | "BUILDING"
    | "ERROR"
    | "INITIALIZING"
    | "READY"
    | "CANCELED";
  createdAt: number;
  meta?: Record<string, string>;
  // Add other relevant fields from the Vercel API response
}

interface VercelApiError {
  error: {
    code: string;
    message: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;

  // Check if projectId exists (basic validation)
  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json(
      { message: "Project ID is required and must be a string." },
      { status: 400 }
    );
  }

  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
  const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
  if (!VERCEL_API_TOKEN) {
    console.error("VERCEL_API_TOKEN is not configured on the server.");
    return NextResponse.json(
      { message: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    let vercelApiUrl = `https://api.vercel.com/v6/deployments?projectId=${projectId}&target=production&limit=1`;
    if (VERCEL_TEAM_ID) {
      vercelApiUrl += `&teamId=${VERCEL_TEAM_ID}`;
    }

    const response = await fetch(vercelApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorData: VercelApiError | { message?: string } = {
        message: `Vercel API Error: ${response.statusText}`,
      };
      try {
        errorData = await response.json();
      } catch (e) {
        console.error(
          "Vercel API non-JSON error response status:",
          response.statusText
        );
      }
      const errorMessage =
        (errorData as VercelApiError)?.error?.message ||
        (errorData as { message?: string })?.message ||
        response.statusText;
      console.error(
        `Vercel API Error for projectId ${projectId}: ${errorMessage}`,
        errorData
      );
      return NextResponse.json(
        { message: `Error fetching from Vercel API: ${errorMessage}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const latestDeployment: IVercelDeploymentDetail | null =
      data.deployments && data.deployments.length > 0
        ? data.deployments[0]
        : null;

    if (latestDeployment) {
      return NextResponse.json(
        { data: { deployment: latestDeployment } },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ data: { deployment: null } }, { status: 200 });
    }
  } catch (error: any) {
    console.error(
      `Error in vercel-deployment handler for projectId ${projectId}:`,
      error
    );
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
