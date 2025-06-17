"use client"
// src/contexts/color-mode.tsx
import React, { PropsWithChildren, createContext, useEffect, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { availableThemes, ThemeKey, zenburnTheme } from "../../themes"; // Import from new theme file

type ColorModeContextType = {
  mode: ThemeKey;
  setMode: (mode: ThemeKey) => void;
  theme: typeof zenburnTheme; // Use one theme type as base, MUI Theme type
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType // Initial empty context, will be overridden by provider
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>(() => {
    // Get initial theme from localStorage or default to 'zenburn'
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("colorMode") as ThemeKey;
      if (storedTheme && availableThemes[storedTheme]) {
        return storedTheme;
      }
    }
    return "zenburn"; // Default theme key
  });

  useEffect(() => {
    // Persist theme choice to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("colorMode", currentThemeKey);
    }
  }, [currentThemeKey]);

  const setTheme = (themeKey: ThemeKey) => {
    if (availableThemes[themeKey]) {
      setCurrentThemeKey(themeKey);
    } else {
      console.warn(`Theme "${themeKey}" not found. Defaulting to zenburn.`);
      setCurrentThemeKey("zenburn");
    }
  };

  const activeTheme = availableThemes[currentThemeKey] || zenburnTheme; // Fallback

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setTheme,
        mode: currentThemeKey,
        theme: activeTheme, // Provide the currently active MUI theme object
      }}
    >
      <MuiThemeProvider theme={activeTheme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};