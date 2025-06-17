import { NextRequest, NextResponse } from "next/server";
import { getPriorityHistoryByProject } from "@/mock-data/demo-data";
import { subDays } from "date-fns";

export async function GET(request: NextRequest) {
  // Check if we're in demo mode
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (!isDemoMode) {
    return NextResponse.json(
      { error: "This endpoint is only available in demo mode" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const timeRange = searchParams.get('time_range') || '30d';

    if (!projectId) {
      return NextResponse.json(
        { error: "project_id parameter is required" },
        { status: 400 }
      );
    }

    // Get all priority history for the project
    let historyData = getPriorityHistoryByProject(projectId);

    // Filter by time range
    const now = new Date();
    let cutoffDate: Date;

    switch (timeRange) {
      case '7d':
        cutoffDate = subDays(now, 7);
        break;
      case '30d':
        cutoffDate = subDays(now, 30);
        break;
      case '90d':
        cutoffDate = subDays(now, 90);
        break;
      default:
        cutoffDate = subDays(now, 30); // Default to 30 days
    }

    // Filter data to only include entries within the time range
    historyData = historyData.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= cutoffDate;
    });

    // Sort by timestamp (newest first)
    historyData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Return data in the format expected by the frontend
    return NextResponse.json(historyData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error('Error fetching project priority history:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
