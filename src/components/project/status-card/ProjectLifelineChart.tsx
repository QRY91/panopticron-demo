"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  useTheme,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ProjectPriorityHistoryEntry } from "@/types/panopticron";
import { isDemoMode } from "@/demo-config";
import { generateMockPriorityHistory } from "@/mock/status-data";

interface ProjectLifelineChartProps {
  projectId: string;
}

const formatDateTick = (timestamp: string) => {
  try {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return timestamp;
  }
};

export const ProjectLifelineChart: React.FC<ProjectLifelineChartProps> = ({
  projectId,
}) => {
  const [timeRange, setTimeRange] = useState("30d");
  const theme = useTheme();

  // State for both demo and production modes
  const [historyEntries, setHistoryEntries] = useState<
    ProjectPriorityHistoryEntry[] | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);

  // Fetch data using useEffect for both modes
  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        if (isDemoMode()) {
          // Use mock data directly in demo mode
          const mockData = generateMockPriorityHistory(projectId, timeRange);
          setHistoryEntries(mockData);
        } else {
          // Use real API in production
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-project-priority-history?project_id=${projectId}&time_range=${timeRange}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setHistoryEntries(data);
        }
      } catch (err) {
        setIsError(true);
        setError(err);
        setHistoryEntries(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId, timeRange]);

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value as string);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          minHeight: 300,
        }}
      >
        <CircularProgress size={24} sx={{ mr: 1 }} />
        <Typography variant="body2">Loading lifeline data...</Typography>
      </Box>
    );
  }

  if (isError) {
    const errorMessage =
      (error as any)?.message ||
      (error as any)?.response?.data?.error ||
      "Unknown error";
    return (
      <Alert severity="error" sx={{ m: 1 }}>
        Error loading lifeline: {errorMessage}
      </Alert>
    );
  }

  if (!historyEntries || historyEntries.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 2, my: 1, textAlign: "center" }}>
        <Typography sx={{ color: "text.secondary" }}>
          No priority history data available for this project or period.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 2, my: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" component="h4">
          Project Priority Lifeline
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="time-range-select-label">Time Range</InputLabel>
          <Select
            labelId="time-range-select-label"
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={historyEntries}
          margin={{ top: 5, right: 30, left: 0, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDateTick}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
          />
          <YAxis
            dataKey="final_priority_sort_key"
            label={{
              value: "Priority Score (Lower is Better)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              dy: 70,
            }}
            domain={["dataMin - 100", "dataMax + 100"]}
            allowDataOverflow={true}
          />
          <Tooltip
            labelFormatter={formatDateTick}
            formatter={(value: number, name: string, props: any) => {
              const entry = props.payload;
              let tooltipItems = [`Score: ${value}`];
              if (entry.reason_for_change) {
                tooltipItems.push(`Reason: ${entry.reason_for_change}`);
              }
              return tooltipItems;
            }}
          />
          <Line
            type="monotone"
            dataKey="final_priority_sort_key"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};
