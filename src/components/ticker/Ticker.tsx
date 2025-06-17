// src/components/ticker/Ticker.tsx
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react"; // Added useEffect, useMemo
import {
  Box,
  Typography,
  Link as MuiLink,
  useTheme,
  alpha,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings"; // For 'Started'
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // For 'Unknown'
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined"; // For 'No Action Needed'

import { supabaseBrowserClient as supabase } from "@utils/supabase/client"; // Your client instance
import { isDemoMode } from "@/demo-config";
import { mockData } from "@/mock-data/demo-data";

export interface TickerItem {
  id: string;
  message: string;
  type: "info" | "warning" | "error" | "success" | "system"; // Added 'system' type for worker status
  timestamp?: string;
  link?: string;
  icon?: React.ReactElement; // Allow custom icon
}

interface TickerProps {
  // items prop can now be optional or used for other non-system messages
  initialItems?: TickerItem[];
  speed?: number; // Controls scroll speed, lower is faster for this calculation
  refreshInterval?: number; // Interval in ms to refresh worker statuses
}

// Helper to format relative time
function formatRelativeTime(isoString?: string | null): string {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  const now = new Date();
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 2) return "Now";
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

// Function to get the icon based on status
function getStatusIconElement(status?: string): React.ReactElement {
  const iconProps = {
    fontSize: "inherit" as "inherit",
    sx: { mr: 0.5, verticalAlign: "middle" },
  };
  switch (status?.toLowerCase()) {
    case "success":
      return <CheckCircleOutlineIcon {...iconProps} />;
    case "partial success":
      return <WarningAmberOutlinedIcon {...iconProps} />;
    case "failure":
      return <ErrorOutlineIcon {...iconProps} />;
    case "started":
      return <SettingsIcon {...iconProps} />; // Using SettingsIcon for 'Started'
    case "no action needed":
      return <ThumbUpOutlinedIcon {...iconProps} />;
    default: // Unknown or other statuses
      return <HelpOutlineIcon {...iconProps} />;
  }
}

const Ticker: React.FC<TickerProps> = ({
  initialItems = [],
  speed = 80,
  refreshInterval = 60000,
}) => {
  const theme = useTheme();
  const tickerWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [systemWorkerItems, setSystemWorkerItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    const fetchWorkerStatusesForTicker = async () => {
      const workerNames = ["sync-vercel-projects", "sync-github-data"];
      const newTickerItems: TickerItem[] = [];

      for (const name of workerNames) {
        let data, error;

        if (isDemoMode()) {
          // Use mock data in demo mode
          const mockWorkerRuns = mockData.workerRuns
            .filter((w) => w.worker_name === name && w.status !== "Started")
            .sort(
              (a, b) =>
                new Date(b.ended_at || b.created_at).getTime() -
                new Date(a.ended_at || a.created_at).getTime()
            );

          data = mockWorkerRuns.length > 0 ? mockWorkerRuns[0] : null;
          error = null;
        } else {
          // Use real Supabase data in production mode
          const result = await supabase
            .from("worker_runs")
            .select("worker_name, status, ended_at, summary_message")
            .eq("worker_name", name)
            .not("status", "eq", "Started") // Get last completed/failed run
            .order("ended_at", { ascending: false })
            .limit(1)
            .single();

          data = result.data;
          error = result.error;
        }

        const friendlyName = name
          .replace("sync-", "")
          .replace("-projects", "")
          .replace("-data", "")
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        const iconElement = getStatusIconElement(data?.status);

        if (error && error.code !== "PGRST116") {
          // PGRST116 = 0 rows
          console.error(`Ticker: Error fetching status for ${name}:`, error);
          newTickerItems.push({
            id: `worker-${name}-fetch-error`,
            message: `${friendlyName} Sync: Status Error`,
            type: "error", // Mark as error type for styling
            timestamp: formatRelativeTime(new Date().toISOString()),
            icon: getStatusIconElement("failure"),
          });
        } else if (data) {
          newTickerItems.push({
            id: `worker-${name}-${
              data.ended_at ? new Date(data.ended_at).getTime() : Date.now()
            }`,
            message: `${friendlyName} Sync: ${data.status}`,
            type:
              data.status === "Success" || data.status === "No Action Needed"
                ? "success"
                : data.status === "Failure"
                ? "error"
                : data.status === "Partial Success"
                ? "warning"
                : "system",
            timestamp: formatRelativeTime(data.ended_at),
            icon: iconElement,
            link: "/status", // Link to the detailed status page
          });
        } else {
          // No completed run found yet
          newTickerItems.push({
            id: `worker-${name}-nodata`,
            message: `${friendlyName} Sync: Awaiting first run.`,
            type: "info",
            timestamp: "Pending",
            icon: getStatusIconElement("unknown"),
          });
        }
      }
      setSystemWorkerItems(newTickerItems);
    };

    fetchWorkerStatusesForTicker(); // Initial fetch
    const intervalId = setInterval(
      fetchWorkerStatusesForTicker,
      refreshInterval
    );

    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  const allItems = useMemo(
    () => [...systemWorkerItems, ...initialItems],
    [systemWorkerItems, initialItems]
  );

  // Duplicate items for a smoother visual loop
  const displayItems =
    allItems.length > 0 && allItems.length < 10
      ? [...allItems, ...allItems, ...allItems]
      : allItems;

  const typeStyles = {
    info: {
      color: theme.palette.info.main,
      defaultIcon: (
        <InfoIcon
          fontSize="inherit"
          sx={{ mr: 0.5, verticalAlign: "middle" }}
        />
      ),
    },
    warning: {
      color: theme.palette.warning.main,
      defaultIcon: (
        <WarningAmberOutlinedIcon
          fontSize="inherit"
          sx={{ mr: 0.5, verticalAlign: "middle" }}
        />
      ),
    },
    error: {
      color: theme.palette.error.main,
      defaultIcon: (
        <ErrorOutlineIcon
          fontSize="inherit"
          sx={{ mr: 0.5, verticalAlign: "middle" }}
        />
      ),
    },
    success: {
      color: theme.palette.success.main,
      defaultIcon: (
        <CheckCircleOutlineIcon
          fontSize="inherit"
          sx={{ mr: 0.5, verticalAlign: "middle" }}
        />
      ),
    },
    system: {
      color: theme.palette.text.secondary,
      defaultIcon: (
        <HelpOutlineIcon
          fontSize="inherit"
          sx={{ mr: 0.5, verticalAlign: "middle" }}
        />
      ),
    }, // Default for system
  };

  if (allItems.length === 0) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          textAlign: "center",
          py: 1.5,
          opacity: 0.7,
          overflow: "hidden",
        }}
      >
        <Typography variant="caption">No current updates.</Typography>
      </Box>
    );
  }

  const animationDuration = (allItems.length * 200) / speed;

  return (
    <Box
      ref={tickerWrapperRef}
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        whiteSpace: "nowrap",
        cursor: "default",
        py: 0.5,
        mx: 2,
        position: "relative",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Box
        ref={contentRef}
        className="ticker-content"
        sx={{
          display: "inline-block",
          animation: `scroll-duplicated ${animationDuration}s linear infinite`,
          animationPlayState: isHovering ? "paused" : "running",
          "@keyframes scroll-duplicated": {
            "0%": { transform: "translateX(0%)" },
            "100%": {
              transform: `translateX(-${
                100 / (displayItems.length / allItems.length || 1)
              }%)`,
            }, // Avoid division by zero
          },
        }}
      >
        {displayItems.map((item, index) => {
          const itemStyle = typeStyles[item.type] || typeStyles.system;
          const iconToDisplay = item.icon || itemStyle.defaultIcon;

          return (
            <Box
              component="span"
              key={`${item.id}-${index}`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                mx: 2.5,
                py: 0.5,
                color: itemStyle.color,
                transition: "opacity 0.2s, transform 0.2s",
                opacity: isHovering ? 0.8 : 1,
                transform: "scale(1)",
                "&:hover": {
                  opacity: 1,
                  transform: "scale(1.03)",
                  fontWeight: "600",
                },
              }}
            >
              {React.cloneElement(iconToDisplay, {
                sx: {
                  verticalAlign: "middle",
                  mr: 0.5,
                  color: itemStyle.color,
                },
              })}
              <Typography
                variant="body2"
                component="span"
                sx={{ lineHeight: 1 }}
              >
                {item.link ? (
                  <MuiLink
                    href={item.link}
                    target={item.link.startsWith("/") ? "_self" : "_blank"} // Open internal links in same tab
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="hover"
                    sx={{ "&:hover": { color: itemStyle.color } }}
                  >
                    {item.message}
                  </MuiLink>
                ) : (
                  item.message
                )}
                {item.timestamp && (
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{ ml: 0.5, opacity: 0.7, fontStyle: "italic" }}
                  >
                    ({item.timestamp})
                  </Typography>
                )}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Ticker;
