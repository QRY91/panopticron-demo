"use client"; // Very important!

import React from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/mui";

import routerProvider from "@refinedev/nextjs-router";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider as supabaseDataProvider } from "@providers/data-provider";
import fetchDataProvider from "@providers/fetch-data-provider";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunchOutlined";
import BuildIcon from "@mui/icons-material/Build";
import ScienceIcon from "@mui/icons-material/Science";
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";

interface RefineCoreSetupProps {
  children: React.ReactNode;
}

export const RefineCoreSetup: React.FC<RefineCoreSetupProps> = ({
  children,
}) => {
  return (
    <Refine
      routerProvider={routerProvider}
      authProvider={authProviderClient}
      dataProvider={{
        default: supabaseDataProvider,
        fetch: fetchDataProvider,
      }}
      notificationProvider={useNotificationProvider}
      resources={[
        {
          name: "dashboard", 
          list: "/dashboard",
          meta: {
            label: "Dashboard",
            icon: <DashboardCustomizeOutlinedIcon />,
          },
        },
        {
          name: "projects",
          list: "/projects",
          edit: "/projects/edit/:id",
          // create: "/projects/create",
          // show: "/projects/show/:id",
          meta: {
            label: "Projects",
            icon: <RocketLaunchIcon />,
            // canDelete: true,
          },
        },
        {
          name: "showcase",
          list: "/showcase",
          meta: {
            label: "Component Showcase",
            icon: <BuildIcon />,
          },
        },
        {
          name: "experiments",
          list: "/experiments",
          meta: {
            label: "UX Experiments",
            icon: <ScienceIcon />,
          },
        },
        {
          name: "status",
          list: "/status",
          meta: {
            label: "Status",
            icon: <MonitorHeartIcon/>,
          },
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        useNewQueryKeys: true,
        projectId: "PANOPTICON_DEVTOOLS_ID", 
      }}
    >
      {children}
      <RefineKbar />
    </Refine>
  );
};