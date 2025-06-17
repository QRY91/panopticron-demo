"use client";

import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"; // Only Line, LineChart, ResponsiveContainer, YAxis
import type { ProjectPriorityHistoryEntry } from "@/types/panopticron";
import { isDemoMode } from "@/demo-config";

interface SparklineProps {
  projectId: string;
  height?: number;
  timeRange?: string; // e.g., '7d', '30d'
}

export const Sparkline: React.FC<SparklineProps> = ({
  projectId,
  height = 30, // Default small height
  timeRange = "30d", // Default to 30 days for a trend
}) => {
  const theme = useTheme();

  // State for both demo and production modes
  const [chartData, setChartData] = useState<
    ProjectPriorityHistoryEntry[] | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);

  // Determine API URL based on demo mode
  const apiUrl = isDemoMode()
    ? `/api/project-priority-history`
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-project-priority-history`;

  // Fetch data using useEffect for both modes
  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${apiUrl}?project_id=${projectId}&time_range=${timeRange}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setChartData(data);
      } catch (err) {
        setChartData(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId, timeRange, apiUrl]);

  if (isLoading || !chartData || chartData.length < 2) {
    // Need at least 2 points for a line
    return (
      <Box
        sx={{
          height,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.5,
        }}
      >
        {/* Placeholder or tiny spinner */}
      </Box>
    );
  }

  // Determine overall trend for line color (simplified)
  let trendColor = theme.palette.text.secondary; // Neutral
  if (chartData.length >= 2) {
    const firstScore = chartData[0].final_priority_sort_key ?? 10000;
    const lastScore =
      chartData[chartData.length - 1].final_priority_sort_key ?? 10000;
    if (lastScore < firstScore) trendColor = theme.palette.error.main;
    // Getting worse (lower score = higher priority/worse)
    else if (lastScore > firstScore) trendColor = theme.palette.success.main; // Getting better
  }

  return (
    <Box sx={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
        >
          {/* Minimal YAxis to establish domain, but hide it */}
          <YAxis
            dataKey="final_priority_sort_key"
            hide={true}
            domain={["dataMin - 100", "dataMax + 100"]}
          />
          <Line
            type="monotone"
            dataKey="final_priority_sort_key"
            stroke={trendColor}
            strokeWidth={1.5}
            dot={false} // No dots for sparkline
            isAnimationActive={false} // Optional: disable animation for perf
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
