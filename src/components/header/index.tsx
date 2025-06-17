// src/components/header/index.tsx
import React, { useContext, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Stack,
  Typography,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Box,
  Button,
  alpha
} from "@mui/material";
import { useGetIdentity, useIsAuthenticated } from "@refinedev/core";
import { HamburgerMenu } from "@refinedev/mui";
import { ColorModeContext } from "../../contexts/color-mode";
import { availableThemes, ThemeKey } from "../../themes";
import Ticker, { TickerItem } from "@components/ticker/Ticker";
import Link from 'next/link';

interface IUser {
  id: number | string;
  name?: string;
  avatar?: string;
}

// Mock Application-Specific Ticker Data (these are now 'initialItems' for the Ticker)
const appAuthenticatedTickerItems: TickerItem[] = [
  { id: 'app-auth-1', message: 'Project Gamma deployment successful!', type: 'success', timestamp: '11:05 AM' },
  { id: 'app-auth-2', message: 'Alert: High error rate on Project Delta.', type: 'error', timestamp: '11:02 AM', link: '/projects/delta/errors' },
  { id: 'app-auth-3', message: 'CI for "feature-xyz" on Project Epsilon is running.', type: 'warning', timestamp: '10:50 AM' },
];

const appUnauthenticatedTickerItems: TickerItem[] = [
  { id: 'app-unauth-1', message: 'Welcome to Panopticron! Log in to monitor your projects.', type: 'info' },
  { id: 'app-unauth-2', message: 'Discover our "Working with the Garage Door Open" philosophy.', type: 'info', link: '/philosophy' },
];

interface CustomHeaderProps {
    sticky?: boolean;
}

export const Header: React.FC<CustomHeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode, theme } = useContext(ColorModeContext);
  const { data: user } = useGetIdentity<IUser>();
  const { data: authStatus, isLoading: isAuthLoading } = useIsAuthenticated();

  const handleThemeChange = (event: SelectChangeEvent<ThemeKey>) => {
    setMode(event.target.value as ThemeKey);
  };

  // Determine which *application-specific* ticker items to display as initialItems
  // The Ticker component itself will fetch and prepend/append system worker statuses.
  const initialTickerItemsForApp = useMemo(() => {
    if (isAuthLoading) return []; // Wait for auth status
    return authStatus?.authenticated ? appAuthenticatedTickerItems : appUnauthenticatedTickerItems;
  }, [isAuthLoading, authStatus?.authenticated]);


  return (
    <AppBar position={sticky ? "sticky" : "relative"} color="default" elevation={1} sx={{backgroundImage: 'none'}}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Left Section: Hamburger (mobile) & Theme Switcher (desktop) */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}>
            <HamburgerMenu />
          </Box>
          <FormControl sx={{ minWidth: 150, display: { xs: 'none', md: 'flex' } }} size="small" variant="outlined">
            <InputLabel id="theme-select-label-header" sx={{color: alpha(theme.palette.text.primary, 0.7)}}>Theme</InputLabel>
            <Select
              labelId="theme-select-label-header"
              id="theme-select-header"
              value={mode}
              label="Theme"
              onChange={handleThemeChange}
              sx={{
                color: theme.palette.text.primary,
                '.MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.divider, 0.5) },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.text.secondary },
                '.MuiSvgIcon-root': { fill: theme.palette.text.secondary },
                borderRadius: '8px',
                height: '40px'
              }}
            >
              {Object.keys(availableThemes).map((themeKey) => (
                <MenuItem key={themeKey} value={themeKey}>
                  {themeKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Center Section: Ticker Component */}
        <Box sx={{ flexGrow: 1, minWidth: 0, mx: {xs: 1, md: 2} }}>
            {!isAuthLoading && (
              <Ticker
                initialItems={initialTickerItemsForApp} // Pass app-specific items
                speed={70} // Adjust speed as desired
                refreshInterval={45000} // Refresh system statuses every 45 seconds
              />
            )}
        </Box>

        {/* Right Section: User Avatar / Info or Login Button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isAuthLoading && authStatus?.authenticated && user && (
              <Stack direction="row" gap="16px" alignItems="center">
                {user.name && (
                  <Typography
                    sx={{ display: { xs: "none", sm: "inline-block" }, color: theme.palette.text.primary }}
                    variant="subtitle2"
                  >
                    {user.name}
                  </Typography>
                )}
                <Avatar src={user.avatar} alt={user.name} />
              </Stack>
            )}
            {!isAuthLoading && !authStatus?.authenticated && (
                <Button
                    component={Link}
                    href="/login"
                    variant="outlined"
                    size="small"
                    sx={{
                        color: theme.palette.text.secondary,
                        borderColor: alpha(theme.palette.divider, 0.7),
                        '&:hover': {
                            borderColor: theme.palette.text.primary,
                            backgroundColor: alpha(theme.palette.text.primary, 0.08)
                        },
                        height: '40px',
                        borderRadius: '8px'
                    }}
                >
                    Login
                </Button>
             )}
             {isAuthLoading && <Box sx={{width: 80, textAlign: 'right'}}>...</Box>}
        </Box>
      </Toolbar>
    </AppBar>
  );
};