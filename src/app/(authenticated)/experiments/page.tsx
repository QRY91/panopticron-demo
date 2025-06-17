"use client";
// src/app/(authenticated)/experiments/page.tsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { List } from "@refinedev/mui";

// Import your components
import { Lens } from "@components/lens/Lens";
import { LensCluster } from "@components/lens";
import { LensProps, LensStatus } from "@components/lens/lens.types";

// Icons for mock lenses
import CloudIcon from "@mui/icons-material/Cloud";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import GitHubIcon from "@mui/icons-material/GitHub";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BugReportIcon from "@mui/icons-material/BugReport";
import SyncIcon from "@mui/icons-material/Sync";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';


const backgroundFlashKeyframes = {
  "@keyframes backgroundFlash": {
    "0%, 100%": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
    "50%": { backgroundColor: "rgba(255, 0, 0, 0.4)" },
  },
};

// Experiment specific styles
const criticalAlertStyle = {
  border: "3px solid red",
  padding: "10px",
  borderRadius: "8px",
  animation: "pulse 1s infinite alternate",
  "@keyframes pulse": {
    "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(255, 0, 0, 0.7)" },
    "70%": {
      transform: "scale(1.02)",
      boxShadow: "0 0 10px 10px rgba(255, 0, 0, 0)",
    },
    "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(255, 0, 0, 0)" },
  },
};

const warningAlertStyle = {
  border: "3px solid orange",
  padding: "10px",
  borderRadius: "8px",
};

export default function ExperimentsPage() {
  const theme = useTheme(); // Get the theme object
  // --- State for Visual Salience Experiment ---
  type AlertStyle =
    | "none"
    | "border"
    | "pulsingBorder"
    | "bgFlash"
    | "enhancedIcon";
  const [criticalAlertPresentation, setCriticalAlertPresentation] =
    useState<AlertStyle>("none");
  const [distractionLevel, setDistractionLevel] = useState<number>(2); // Number of normal lenses

  // --- State for Time to Acknowledge Experiment ---
  type MockAlertSeverity = "critical" | "major" | "minor";
  const [ttaMockSeverity, setTtaMockSeverity] =
    useState<MockAlertSeverity>("critical");
  const [ttaShowAlert, setTtaShowAlert] = useState(false);
  const [ttaStartTime, setTtaStartTime] = useState<number | null>(null);
  const [ttaTestButtonDisabled, setTtaTestButtonDisabled] = useState(false);
  const ttaTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  interface ReactionTimeEntry {
    time: number;
    severity: MockAlertSeverity;
  }
  const [ttaReactionTimes, setTtaReactionTimes] = useState<ReactionTimeEntry[]>(
    []
  ); // Array of objects
  const MAX_TTA_SCORES = 5;

  const startTtaTest = () => {
    if (ttaTimeoutRef.current) clearTimeout(ttaTimeoutRef.current);
    setTtaShowAlert(false);
    setTtaStartTime(null); // Clear start time for the new test
    setTtaTestButtonDisabled(true);
    console.log(
      `TTA Test: Started (Severity: ${ttaMockSeverity}), waiting for alert to trigger...`
    );

    ttaTimeoutRef.current = setTimeout(() => {
      console.log("TTA Test: Alert Appeared");
      setTtaShowAlert(true);
      setTtaStartTime(performance.now());
      // Keep button disabled until acknowledged to prevent re-triggering mid-test
    }, Math.random() * 1500 + 500); // Random delay 0.5s-2s
  };

  const acknowledgeTta = () => {
    if (ttaStartTime) {
      const endTime = performance.now();
      const newReactionTime = Math.round(endTime - ttaStartTime);
      setTtaReactionTimes((prevEntries) => {
        const newEntry: ReactionTimeEntry = {
          time: newReactionTime,
          severity: ttaMockSeverity,
        };
        const updatedEntries = [newEntry, ...prevEntries];
        return updatedEntries.slice(0, MAX_TTA_SCORES);
      });
      console.log(
        `TTA Test: Acknowledged (Severity: ${ttaMockSeverity}, Time: ${newReactionTime}ms)`
      );
    }
    setTtaShowAlert(false);
    setTtaStartTime(null);
    setTtaTestButtonDisabled(false);
    if (ttaTimeoutRef.current) clearTimeout(ttaTimeoutRef.current);
  };

  const resetTtaScores = () => {
    setTtaReactionTimes([]);
  };

  const getOverallAverageReactionTime = () => {
    if (ttaReactionTimes.length === 0) return 0;
    const sum = ttaReactionTimes.reduce((acc, entry) => acc + entry.time, 0);
    return Math.round(sum / ttaReactionTimes.length);
  };

  // --- State for Information Density Experiment ---
  const [densityClusterLenses, setDensityClusterLenses] = useState<LensProps[]>([
    // Initial set for the interactive cluster
    { id: "interactive-1", status: "good", icon: CloudIcon, label: "Prod Deployment" },
    { id: "interactive-2", status: "good", icon: GitHubIcon, label: "Main CI" },
    { id: "interactive-3", status: "neutral", icon: ShowChartIcon, label: "Analytics" },
  ]);
  const [targetLensIdToFind, setTargetLensIdToFind] = useState<string | null>(null);
  const [isTargetLensHighlighted, setIsTargetLensHighlighted] = useState(false);

  const allPossibleMockLenses: LensProps[] = [
    { id: "interactive-1", status: "good", icon: CloudIcon, label: "Prod Deployment" },
    { id: "interactive-2", status: "good", icon: GitHubIcon, label: "Main CI" },
    { id: "interactive-3", status: "neutral", icon: ShowChartIcon, label: "Analytics" },
    { id: "interactive-4", status: "warning", icon: SpeedIcon, label: "Page Load" },
    { id: "interactive-5", status: "error", icon: ReportProblemIcon, label: "Error Rate" },
    { id: "interactive-6", status: "good", icon: SecurityIcon, label: "Security Scan" },
    { id: "interactive-7", status: "neutral", icon: StorageIcon, label: "DB Storage" },
    { id: "interactive-8", status: "warning", icon: MemoryIcon, label: "App Memory" },
  ];

  const addLensToDensityCluster = () => {
    setDensityClusterLenses(prevLenses => {
      if (prevLenses.length < allPossibleMockLenses.length) {
        // Add the next lens from allPossibleMockLenses that isn't already in prevLenses
        const nextLens = allPossibleMockLenses.find(pLens => !prevLenses.some(l => l.id === pLens.id));
        return nextLens ? [...prevLenses, nextLens] : prevLenses;
      }
      return prevLenses;
    });
  };

  const removeLensFromDensityCluster = () => {
    setDensityClusterLenses(prevLenses => {
      if (prevLenses.length > 1) { // Keep at least one lens
        return prevLenses.slice(0, -1);
      }
      return prevLenses;
    });
  };

  const startFindTargetLens = () => {
    setIsTargetLensHighlighted(false);
    if (densityClusterLenses.length > 0) {
      // Pick a random lens from the current interactive cluster to be the target
      const randomIndex = Math.floor(Math.random() * densityClusterLenses.length);
      const newTargetId = densityClusterLenses[randomIndex].id;
      setTargetLensIdToFind(newTargetId);
      // Give a moment before highlighting
      setTimeout(() => setIsTargetLensHighlighted(true), 1500);
    } else {
      setTargetLensIdToFind(null);
    }
  };

  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (ttaTimeoutRef.current) clearTimeout(ttaTimeoutRef.current);
    };
  }, []);

  // Helper to get alert visual properties based on severity
  const getAlertVisuals = (severity: MockAlertSeverity) => {
    switch (severity) {
      case "critical":
        return {
          text: "NEW CRITICAL ALERT!",
          icon: ReportProblemIcon,
          color: theme.palette.error.main,
          borderColor: theme.palette.error.main,
          animation: "pulse 1s infinite alternate",
        };
      case "major":
        return {
          text: "Major Warning Issued!",
          icon: WarningIcon,
          color: theme.palette.warning.main,
          borderColor: theme.palette.warning.main,
          animation: "none",
        };
      case "minor":
        return {
          text: "Minor Alert.",
          icon: CheckCircleIcon,
          color: theme.palette.info.main,
          borderColor: theme.palette.info.main,
          animation: "none",
        };
      default: 
        return {
          text: "ALERT!",
          icon: ReportProblemIcon,
          color: theme.palette.text.secondary,
          borderColor: theme.palette.grey[500],
          animation: "none",
        };
    }
  };
  const currentAlertVisuals = getAlertVisuals(ttaMockSeverity);
  return (
    <List
      title={
        <Typography variant="h5">UX Experiments for Panopticron</Typography>
      }
      breadcrumb={false}
    >
      {/* --- Section 1: Visual Salience --- */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Experiment 1: Visual Salience of Critical Alerts
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          How does the presentation of a critical alert impact its immediate
          visibility and perceived urgency? Compare different styles for a
          critical &rsquo;Vercel Deployment Failed&rsquo; status amidst varying levels of
          distraction.
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="alert-style-label">
                Critical Alert Style
              </InputLabel>
              <Select
                labelId="alert-style-label"
                value={criticalAlertPresentation}
                label="Critical Alert Style"
                onChange={(e: SelectChangeEvent<AlertStyle>) =>
                  setCriticalAlertPresentation(e.target.value as AlertStyle)
                }
              >
                <MenuItem value="none">Standard Red</MenuItem>
                <MenuItem value="border">Red with Border</MenuItem>
                <MenuItem value="pulsingBorder">
                  Red with Pulsing Border
                </MenuItem>
                <MenuItem value="bgFlash">Background Flash</MenuItem>
                <MenuItem value="enhancedIcon">Enhanced Icon & Pulse</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="distraction-level-label">
                Surrounding Lenses
              </InputLabel>
              <Select
                labelId="distraction-level-label"
                value={distractionLevel}
                label="Surrounding Lenses"
                onChange={(e: SelectChangeEvent<number>) =>
                  setDistractionLevel(Number(e.target.value))
                }
              >
                <MenuItem value={0}>None - Just Critical Lens</MenuItem>
                <MenuItem value={4}>Few - 4 Surrounding Lenses</MenuItem>
                <MenuItem value={8}>Some - 8 Surrounding Lenses</MenuItem>
                <MenuItem value={12}>Many - 12 Surrounding Lenses</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Single shared container for all lenses */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: (() => {
              // Calculate optimal grid columns based on number of lenses
              const totalLenses = distractionLevel + 1;
              if (totalLenses <= 1) return "1fr";
              if (totalLenses <= 4) return "repeat(2, 1fr)";
              if (totalLenses <= 9) return "repeat(3, 1fr)";
              if (totalLenses <= 16) return "repeat(4, 1fr)";
              return "repeat(5, 1fr)";
            })(),
            gap: 2,
            p: 3,
            mt: 2,
            minHeight: "200px",
            maxWidth: "500px",
            margin: "16px auto 0 auto",
            border: "2px solid",
            borderColor: "divider",
            borderRadius: "12px",
            backgroundColor: "background.paper",
            position: "relative",
            justifyItems: "center",
            alignItems: "center",
            ...(criticalAlertPresentation === "bgFlash" && {
              ...backgroundFlashKeyframes,
              animation: "backgroundFlash 1.5s infinite ease-in-out",
            }),
          }}
        >
          {(() => {
            const totalLenses = distractionLevel + 1;
            
            // Determine grid dimensions
            let cols, rows;
            if (totalLenses <= 1) { cols = 1; rows = 1; }
            else if (totalLenses <= 4) { cols = 2; rows = 2; }
            else if (totalLenses <= 9) { cols = 3; rows = 3; }
            else if (totalLenses <= 16) { cols = 4; rows = 4; }
            else { cols = 5; rows = Math.ceil(totalLenses / 5); }
            
            const totalSlots = cols * rows;
            const centerSlot = Math.floor(totalSlots / 2);
            
            // Create grid items
            const gridItems = [];
            let surroundingIndex = 0;
            
            for (let i = 0; i < totalSlots; i++) {
              if (i === centerSlot) {
                // Critical lens in center
                gridItems.push(
                  <Box
                    key="critical-container"
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...(criticalAlertPresentation === "border" && {
                        ...warningAlertStyle,
                        borderColor: "red",
                        borderRadius: "12px",
                        p: 1,
                      }),
                      ...(criticalAlertPresentation === "pulsingBorder" && {
                        ...criticalAlertStyle,
                        borderRadius: "12px",
                        p: 1,
                      }),
                      ...(criticalAlertPresentation === "enhancedIcon" && {
                        ...criticalAlertStyle,
                        borderWidth: "4px",
                        borderRadius: "12px",
                        p: 1,
                      }),
                    }}
                  >
                    <Lens
                      id="exp1-critical"
                      status="error"
                      icon={
                        criticalAlertPresentation === "enhancedIcon"
                          ? FlashOnIcon
                          : ReportProblemIcon
                      }
                      label="Vercel: DEPLOYMENT FAILED"
                      size="medium"
                      sx={{
                        ...(criticalAlertPresentation === "enhancedIcon" && {
                          "& .MuiSvgIcon-root": {
                            fontSize: "48px !important",
                            color: "white !important",
                          },
                          backgroundColor: "red !important",
                          transform: "scale(1.1)",
                        }),
                        ...(criticalAlertPresentation !== "none" && criticalAlertPresentation !== "bgFlash" && {
                          transform: "scale(1.05)",
                        }),
                      }}
                    />
                  </Box>
                );
              } else if (surroundingIndex < distractionLevel) {
                // Surrounding lens
                gridItems.push(
                  <Lens
                    key={`surrounding-${surroundingIndex}`}
                    id={`exp1-surrounding-${surroundingIndex}`}
                    status={surroundingIndex % 3 === 0 ? "good" : surroundingIndex % 3 === 1 ? "warning" : "neutral"}
                    icon={surroundingIndex % 3 === 0 ? CheckCircleIcon : surroundingIndex % 3 === 1 ? WarningIcon : CloudIcon}
                    label={`System ${surroundingIndex % 3 === 0 ? "OK" : surroundingIndex % 3 === 1 ? "Warning" : "Info"} ${surroundingIndex + 1}`}
                    size="medium"
                  />
                );
                surroundingIndex++;
              } else {
                // Empty slot - add invisible placeholder to maintain grid structure
                gridItems.push(<Box key={`empty-${i}`} />);
              }
            }
            
            return gridItems;
          })()}

          {/* Show instruction text when no surrounding lenses */}
          {distractionLevel === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                fontStyle: "italic",
              }}
            >
              Critical lens in isolation
            </Typography>
          )}
        </Box>

        <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: "center" }}>
          Observe how the critical red lens stands out (or blends in) when surrounded by other lenses. 
          Try different alert styles to see how visual salience affects your ability to quickly spot the critical alert.
        </Typography>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* --- Section 2: Time to Acknowledge Simulation --- */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Experiment 2: &quot;Time to Acknowledge&quot; Simulation
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This simulates an alert appearing and measures the time until an
          &quot;Acknowledge&quot; button is pressed. Select an alert severity, click
          &quot;Start Test&quot;. An alert will appear randomly within 0.5-2 seconds.
          Click &quot;Acknowledge Alert&quot; as fast as you can.
        </Typography>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="tta-severity-label">
                Mock Alert Severity
              </InputLabel>
              <Select
                labelId="tta-severity-label"
                value={ttaMockSeverity}
                label="Mock Alert Severity"
                onChange={(e: SelectChangeEvent<MockAlertSeverity>) =>
                  setTtaMockSeverity(e.target.value as MockAlertSeverity)
                }
                disabled={ttaTestButtonDisabled && ttaShowAlert}
              >
                <MenuItem value="critical">Critical Error</MenuItem>
                <MenuItem value="major">Major Warning</MenuItem>
                <MenuItem value="minor">Minor Alert</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ textAlign: { sm: "right", xs: "center" } }}
          >
            <Button
              variant="contained"
              onClick={startTtaTest}
              disabled={ttaTestButtonDisabled && ttaShowAlert}
            >
              Start Test
            </Button>
          </Grid>
        </Grid>

        {/* Display area for the alert and results */}
        <Box sx={{ my: 3, minHeight: '120px', p: 2, border: '1px solid', borderColor: ttaShowAlert ? currentAlertVisuals.borderColor : 'grey.300', borderRadius: 1, textAlign: 'center' }}>
            {ttaShowAlert ? (
            <Box sx={{animation: currentAlertVisuals.animation}}>
                <Typography variant="h5" sx={{color: currentAlertVisuals.color}} gutterBottom>
                    <currentAlertVisuals.icon sx={{verticalAlign: 'bottom', mr: 1}}/> {currentAlertVisuals.text}
                </Typography>
                <Button variant="outlined" sx={{color: currentAlertVisuals.color, borderColor: currentAlertVisuals.color, '&:hover': {borderColor: currentAlertVisuals.color, backgroundColor: alpha(currentAlertVisuals.color, 0.08)} }} onClick={acknowledgeTta}>
                Acknowledge Alert
                </Button>
            </Box>
            ) : ttaReactionTimes.length > 0 && !ttaTestButtonDisabled ? ( // Show when test is complete
                <Box>
                <Typography variant="h6" color="success.main">
                    Test Complete!
                </Typography>
                <Typography variant="body1">
                    Last reaction time (<Typography component="span" sx={{textTransform: 'capitalize'}}>{ttaReactionTimes[0].severity}</Typography>): {/* MODIFIED: Display severity of last test */}
                    <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}> {ttaReactionTimes[0].time} ms</Typography>
                </Typography>
                </Box>
            ) : ttaTestButtonDisabled ? (
            <Typography variant="h6">Get Ready... Waiting for alert!</Typography>
            ) : (
            <Typography variant="h6" color="text.secondary">Select severity and click &quot;Start Test&quot;.</Typography>
            )}
        </Box>

        {/* Display list of scores with severity */}
        {ttaReactionTimes.length > 0 && !ttaShowAlert && (
            <Box sx={{ mt: 2, textAlign: 'left', p:1, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>Recent Reaction Times:</Typography>
              <Box component="ul" sx={{ pl: 2, listStylePosition: 'inside', m: 0 }}>
                {ttaReactionTimes.map((entry, index) => (
                  <Typography component="li" key={index}>
                    {entry.time} ms (<Typography component="span" sx={{textTransform: 'capitalize', fontSize: '0.9em'}}>{entry.severity}</Typography>)
                  </Typography>
                ))}
              </Box>
              {ttaReactionTimes.length > 1 && (
                <Typography variant="subtitle1" sx={{mt:1}}>
                  Overall Average: <Typography component="span" sx={{ fontWeight: 'bold' }}>{getOverallAverageReactionTime()} ms</Typography>
                </Typography>
              )}
              <Button size="small" onClick={resetTtaScores} sx={{mt: 1}}>Reset Scores</Button>
            </Box>
        )}
      </Paper>

      {/* --- Section 3: Information Density Teaser --- */}
      <Divider sx={{ my: 4 }} />
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Experiment 3: Information Density & Scanability</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Adjust the number of lenses in &quot;Cluster Interactive&quot; to observe how density affects the ease of finding information.
          Then, try the &quot;Find the Target Lens&quot; simulation.
        </Typography>

        <Grid container spacing={3} alignItems="flex-start">
          {/* Cluster with Fixed Low Density */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom align="center">Cluster Fixed (Low Density)</Typography>
            <Typography variant="caption" display="block" align="center" sx={{mb:1, minHeight: '3em'}}>
                {targetLensIdToFind && allPossibleMockLenses.slice(0,3).find(l => l.id === targetLensIdToFind) ? `Target: "${allPossibleMockLenses.find(l => l.id === targetLensIdToFind)?.label}"` : (targetLensIdToFind ? "Target not in this cluster" : " ")}
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <LensCluster lensesInput={allPossibleMockLenses.slice(0,3).map(lens => ({
                    ...lens,
                    sx: (isTargetLensHighlighted && lens.id === targetLensIdToFind)
                        ? {
                            border: `3px dashed magenta`,
                            padding: '2px', 
                            borderRadius: '10px', 
                            boxSizing: 'border-box',
                            boxShadow: `0 0 10px magenta`,
                          }
                          : (isTargetLensHighlighted ? { opacity: 0.5, transition: 'opacity 0.3s ease-in-out' } : {})
                }))} />
            </Box>
          </Grid>

          {/* Interactive Cluster */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom align="center">Cluster Interactive (Adjustable Density)</Typography>
            <Typography variant="caption" display="block" align="center" sx={{mb:1, minHeight: '3em'}}>
                 {targetLensIdToFind && densityClusterLenses.find(l => l.id === targetLensIdToFind) ? `Target: "${densityClusterLenses.find(l => l.id === targetLensIdToFind)?.label}"` : (targetLensIdToFind ? "Target not in this cluster" : " ")}
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <LensCluster lensesInput={densityClusterLenses.map(lens => ({
                    ...lens,
                    sx: (isTargetLensHighlighted && lens.id === targetLensIdToFind)
                        ? {
                            border: `3px dashed magenta`, 
                            padding: '2px',
                            borderRadius: '10px',
                            boxSizing: 'border-box',
                            boxShadow: `0 0 10px magenta`,
                          }
                         : (isTargetLensHighlighted ? { opacity: 0.5, transition: 'opacity 0.3s ease-in-out' } : {})
                }))} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
              <Button size="small" variant="outlined" onClick={removeLensFromDensityCluster} disabled={densityClusterLenses.length <= 1}>Remove Lens</Button>
              <Button size="small" variant="outlined" onClick={addLensToDensityCluster} disabled={densityClusterLenses.length >= allPossibleMockLenses.length}>Add Lens</Button>
            </Box>
          </Grid>

          {/* Simulation Control */}
          <Grid item xs={12} md={4} sx={{textAlign: 'center'}}>
            <Typography variant="subtitle1" gutterBottom>Target Simulation</Typography>
            <Button variant="contained" onClick={startFindTargetLens} sx={{mb:1}}>
                {targetLensIdToFind && !isTargetLensHighlighted ? "Finding..." : "Find a Random Target Lens"}
            </Button>
            {targetLensIdToFind && (
                <Typography variant="body2">
                    Attempt to quickly locate the lens labeled: <br/>
                    <Typography component="strong" sx={{color: 'primary.main'}}>&quot;{densityClusterLenses.find(l=>l.id === targetLensIdToFind)?.label || allPossibleMockLenses.find(l=>l.id === targetLensIdToFind)?.label}&quot;</Typography><br/>
                    {isTargetLensHighlighted ? '(Target is now highlighted)' : '(It will be highlighted shortly...)'}
                </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </List>
  );
}
