// src/mock-data/patchNotes.ts

// Define PatchNote type (can also be in a global types file like src/interfaces/app.ts)
export interface PatchNote {
  version: string;
  date: string;
  title: string;
  summary: string;
  details: string[];
  tags?: string[];
}

export const patchNotesData: PatchNote[] = [
    {
    "version": "v0.1.8",
    "date": "May 21, 2025",
    "title": "Enhanced Cron Security, Build Stability & Status Page UX",
    "summary": "This update fortifies cron job security with standardized secret validation, resolves critical Next.js build failures related to Deno functions, and significantly improves the user experience on the Status Page with pagination and refined loading states for worker run logs.",
    "details": [
      "Standardized Cron Job Authorization: Implemented a shared utility function (`authenticateCronRequest`) for consistent and secure cron job authentication across all backend workers (Vercel Sync, GitHub Sync). Cron routes now primarily check the `Authorization: Bearer <CRON_SECRET>` header, with fallback to query parameters for development/manual triggers. Middleware was updated to correctly bypass user session checks for authorized cron requests.",
      "Next.js Build Stability: Resolved Next.js build failures by excluding Supabase Deno function directories (`supabase/functions`) from TypeScript compilation (`tsconfig.json`) and ESLint checks (`.eslintrc.json`). This prevents the Next.js build process from attempting to parse Deno-specific URL imports.",
      "Status Page - Worker Runs Pagination: The 'Backend Worker Status' table on the `/status` page now features pagination, displaying 10 worker runs per page by default. This improves performance and readability for logs with many entries.",
      "Status Page - Improved Loading UX: Enhanced the loading experience for the Worker Runs table. On initial load, skeleton loaders maintain table structure. When changing pages, a less intrusive 'Loading more...' indicator is shown, preventing layout shifts and table collapse.",
      "Status Page - Summary Tooltips: Added tooltips to the 'Summary' column in the Worker Runs table, allowing users to view the full summary message on hover if it's truncated in the cell. Error details also feature a tooltip for better readability of long JSON content.",
      "Database Trigger Enhancement (project_priority_history): Modified the `update_project_priority_key_fields` trigger to use `clock_timestamp()` instead of `NOW()` when inserting into `project_priority_history`. This provides higher timestamp resolution, preventing duplicate key errors during rapid, successive operations within tests or tight transaction windows.",
      "pgTAP Test Suite Fixes: Resolved several issues in the pgTAP test suite, including foreign key violations (by making `project_priority_history_project_id_fkey` deferrable), `ON CONFLICT` target errors (by adding a `UNIQUE` constraint to `project_priority_history`), and `NOT NULL` constraint violations in test data setup. All pgTAP tests for priority logic are now passing."
    ],
    "tags": [
      "Security",
      "Build Process",
      "User Experience",
      "Status Page",
      "Backend",
      "Database",
      "Testing"
    ]
  },
  {
    version: "v0.1.7",
    date: "May 21, 2025",
    title: "Dashboard Polish, Dynamic Filters & Enhanced Card Insights",
    summary:
      "This update refines the dashboard experience with dynamic framework filtering and visual enhancements to project cards, including a mini health trend sparkline. Key bug fixes for timestamp displays and priority override indicators improve data clarity and user interaction.",
    details: [
      "Mini Project Health Sparkline: Project Status Cards ('/projects' page) now feature a compact 'sparkline' chart in their header, providing a quick visual indication of the project's recent priority trend (based on 'final_priority_sort_key' history over the last 7 days).",
      "Timestamp Display Correction: Resolved an issue causing incorrect 'Updated at' timestamps (e.g., '1/1/1970') on Project Status Cards; dates are now formatted correctly from ISO strings or Unix timestamps.",
      "Manual Priority Override Indicator Refined: The visual indicator (VolunteerActivismIcon) for manually overridden project priorities has been refined for placement on both the main dashboard's 'CompactProjectRow' (now side-by-side with the main priority icon) and the 'ProjectStatusCard' (next to the project name) for at-a-glance clarity.",
      "Dashboard Filter Bar Styling: Improved the visual consistency of the filter and actions bar on the main dashboard, including converting the 'Expand/Collapse All' button to an icon button with a tooltip for a cleaner layout.",
      "Project List Page Server-Side Sorting: The '/projects' list page now utilizes server-side sorting based on 'priority_sort_key', aligning its default project order with the main dashboard.",
      "TypeScript Interface Updates: The 'ISupabaseProject' interface was updated to include 'calculated_priority_score', 'manual_priority_override', and 'priority_sort_key' fields to match the database schema.",
      "Font Configuration Simplification: Consolidated font loading to exclusively use 'next/font/google' for Inter, and JetBrains Mono, removing local font configurations and resolving related build errors. Theme files updated to use CSS variables for these fonts.",
    ],
    tags: [
      "User Experience",
      "Dashboard",
      "Bug Fix",
      "Enhancement",
      "Data Visualization",
    ],
  },
  {
    version: "v0.1.6",
    date: "May 19, 2025",
    title:
      "Advanced Dashboard Implementation & Enhanced Project Prioritization",
    summary:
      "Introduces a new high-density, row-based advanced dashboard for project overviews, featuring dynamic 'lens-like' status cells and collapsible details. Implements a comprehensive project prioritization system with automated scoring, manual overrides, and historical tracking. Numerous UI/UX enhancements improve data visibility and interaction.",
    details: [
      "Advanced Dashboard Layout ('/dashboard'): Implemented a new table-based dashboard. Each project row includes collapsible details, compact visual status indicators for Vercel and GitHub, and framework information. This replaces the previous card-based dashboard view.",
      "Project Prioritization System: Added 'priority_sort_key', 'calculated_priority_score', and 'manual_priority_override' fields to the 'projects' table. SQL triggers and functions now automatically calculate a priority score based on project status (e.g., Vercel errors, CI failures, data staleness) and allow manual overrides to influence the final sort key.",
      "Admin Priority Override UI: Created a new project edit page ('/projects/edit/:id') allowing administrators to set or clear a 'manual_priority_override', providing fine-grained control over project sorting on the dashboard.",
      "Priority History Tracking: Implemented a new 'project_priority_history' table and updated database triggers to log changes to project priority scores, reasons for change, and whether a manual override was active, laying the groundwork for future trend analysis.",
      "Project Health Lifeline Chart: Added a time-series line chart within the expanded details of each project row on the dashboard, visualizing its 'final_priority_sort_key' over time. Data is fetched via a new Supabase Edge Function ('get-project-priority-history').",
      "Dashboard Visual Enhancements: Rows in the advanced dashboard table are now styled with background colors based on their priority score, providing immediate visual cues. A dedicated column displays a priority icon with a tooltip showing the score and label.",
      "Interactive Dashboard Cells: Vercel and GitHub status cells in the dashboard table are now clickable, linking to the respective external service pages (Vercel project dashboard, GitHub CI run URL).",
      "Dashboard UX Improvements: Implemented server-side pagination for the advanced dashboard table. Added server-side search by project name. Included a 'Refresh' button to refetch table data and an 'Expand/Collapse All Details' toggle for table rows. An 'Edit' button is now present on each project row for quick access to the priority override page.",
      "Refine Data Provider & Auth Adjustments: Modified 'fetchDataProvider' to correctly include authentication tokens (JWT and apikey) for calls to Supabase Edge Functions. Ensured RLS policies on 'projects' and 'project_priority_history' tables allow necessary operations for authenticated users and triggers.",
      "SQL Test Suite Drafted: Initial pgTAP test scripts were drafted for verifying the backend priority calculation and override logic (currently paused).",
      "Dependency Updates: Added 'recharts' for charting. Updated related testing library dependencies and configurations.",
    ],
    tags: [
      "New Feature",
      "Dashboard",
      "User Experience",
      "Prioritization",
      "Backend",
      "Database",
      "API",
    ],
  },
  {
    version: "v0.1.5",
    date: "May 17, 2025",
    title: "Architectural Evolution & Enhanced Monitoring Insights",
    summary:
      "This major update refactors our backend data synchronization workers for improved maintainability and introduces robust internal health monitoring for Panopticron itself. The projects page now features intelligent prioritization and restored pagination for a better user experience.",
    details: [
      "Backend Worker Refactor (Vercel & GitHub Sync): Both sync-vercel-projects and sync-github-data workers have been significantly refactored to use a new service-oriented architecture. This includes a generic ApiService, and specific VercelApiService and GitHubApiService to encapsulate interactions, improving modularity and future integration capabilities.",
      "Panopticron Internal Health Monitoring Implemented: A new Supabase table 'worker_runs' now logs the execution status of backend sync workers. An authenticated page '/status' displays these logs. The main application Ticker now includes high-level status indicators for these workers.",
      "Projects Page ('/projects') Enhancements: Projects are now intelligently sorted by default, bringing critical Vercel or GitHub statuses to the top. Server-side pagination and search by name have been re-implemented for efficient loading and filtering.",
      "Vercel Snapshots Fixed: Resolved an issue preventing Vercel deployment snapshots from being created; these are now correctly generated.",
      "Interface Updates (GitHub): Updated TypeScript interfaces for GitHub Actions data (IGitHubActionsRun) to accurately reflect API responses, resolving previous build errors.",
      "Deployment to BornDigital Environment: Successfully deployed these changes to a BornDigital Vercel environment, including configuration of all necessary environment variables.",
      "Minor Fixes & Refinements: Addressed various small bugs and type issues identified during refactoring and testing.",
    ],
    tags: [
      "Refactor",
      "New Feature",
      "Backend",
      "Monitoring",
      "User Experience",
      "Infrastructure",
    ],
  },
  {
    version: "v0.1.4",
    date: "May 16, 2025",
    title:
      "Fortifying the Foundation: Password Resets & BornDigital Integration Prep",
    summary:
      "This update introduces a full password reset capability and lays crucial groundwork for integrating Panopticron with BornDigital's live Vercel and GitHub environments. We're gearing up to monitor real-world projects!",
    details: [
      "Full Password Reset Flow Implemented: Users can now securely request a password reset via email and set a new password through a dedicated flow, ensuring account recovery is smooth and secure.",
      "Enhanced Post-Reset Session Handling: Implemented an explicit sign-out after a successful password reset to ensure a clean login experience and prevent stale session issues.",
      "BornDigital Integration - Phase 1 Complete: Successfully configured access and obtained necessary API tokens for BornDigital's Vercel and GitHub organizations.",
      "New Dedicated Supabase Instance for BornDigital: Panopticron's backend data store has been migrated to a new, dedicated Supabase project for BornDigital, ensuring data isolation and proper ownership.",
      "Schema Migration Successful: The database schema (tables, RLS policies) has been successfully applied to the new BornDigital Supabase instance.",
      "Vercel Worker Enhancement (Team ID & GitHub URL): The syncVercelProjects worker now correctly uses the VERCEL_TEAM_ID for accurate project scoping within BornDigital's Vercel. It also now attempts to automatically derive and store the github_repo_url from Vercel project link data, streamlining future GitHub data synchronization.",
      "Environment Configuration Refined: Updated environment variable handling (.env.local) to support the new BornDigital service credentials.",
      "Documentation & Handover Prep: Began significant updates to the project README.md to reflect the new setup and prepare for handover to the BornDigital team.",
    ],
    tags: [
      "New Feature",
      "Security",
      "Infrastructure",
      "BornDigital Integration",
      "Backend",
    ],
  },
  {
    version: "v0.1.3a", // Or v0.1.2a if it's a quick hotfix
    date: "May 14, 2025", // Adjust to today's date or release date
    title: "Smoother Logins & Enhanced User Experience 📣", // Added emoji!
    summary:
      "Thanks to valuable early feedback, we've ironed out some kinks in the login and account approval flow, ensuring a much smoother experience for everyone joining Panopticron!",
    details: [
      "📣 Fixed an issue where newly logged-in *approved* users would sometimes briefly see the 'Account Pending Approval' screen. You should now land directly on your projects dashboard much more reliably!",
      "📣 Resolved a loop where *unapproved* users clicking 'Login as Different User' from the 'Pending Approval' screen would get stuck. This flow now correctly logs out the current session and presents the login form.",
      "The 'Pending Approval' screen now has clearer options and guidance.",
      "Improved the internal state management for user authentication and approval status for better consistency.",
    ],
    tags: ["Hotfix", "User Experience", "Authentication", "Community Feedback"],
  },
  {
    version: "v0.1.3", // Increment version
    date: "May 14, 2025",
    title: "Enhanced Card Insights & Final Polish",
    summary:
      "Making our Project Status Cards even more useful with direct links and ensuring our Lenses are actionable. Plus, squashing those last few pesky build warnings for a super smooth experience!",
    details: [
      "Project Status Cards now feature a 'Quick Links' section in their expanded view, providing direct navigation to the Live Site, Vercel Project dashboard, and GitHub Repository.",
      "Status Lenses (like Vercel and GitHub CI) are now clickable, taking you directly to the relevant deployment or actions page if a URL is available.",
      "Resolved outstanding ESLint `exhaustive-deps` warnings for more robust React effects.",
      "Addressed final build errors related to conditional hook calls, ensuring a clean and reliable build process on Vercel.",
      "General code cleanup and minor type refinements across components.",
    ],
    tags: ["MVP Polish", "User Experience", "Bug Fix", "Developer Experience"],
  },
  {
    version: "v0.1.2", // Increment version
    date: "May 14, 2025",
    title: "Polishing the Panopticron: UI Consistency & Landing Enhancements",
    summary:
      "We've been busy refining the public face of Panopticron, ensuring a consistent and delightful experience from the moment you land on our page, plus some internal tidying up!",
    details: [
      "Public pages (Landing, Patch Notes, Philosophy) now share a consistent navigation bar and footer for a unified look and feel.",
      "The Ticker Tape on the Landing Page is now beautifully full-width, offering a panoramic view of updates.",
      "Navigation on public pages is smoother, including a handy 'Back to Home' button on content pages like Patch Notes.",
      "Addressed an edge case on the 'Pending Approval' screen: users now have clear options to 'Logout' or 'Go to Login' if needed.",
      "Behind the scenes, we've refactored core UI components (like the Project Status Card) into smaller, more manageable pieces – keeping our own codebase as clear as the insights Panopticron provides!",
      "Squashed a few more linting and minor build warnings for an even more stable foundation.",
    ],
    tags: ["UI Polish", "Refactoring", "User Experience"],
  },
  {
    version: "v0.1.1",
    date: "May 14, 2025",
    title: "Smoother Sailing: Auth Flow & UI Enhancements",
    summary:
      "Polishing the entryways to Panopticron! We've refined the sign-up experience and tidied up some visuals based on early feedback and continued development.",
    details: [
      "📣 Signing up is now clearer: you'll get immediate feedback on success and guidance for next steps (like checking your email for confirmation).",
      "📣 Email links for account confirmation and password resets now correctly point to Panopticron, no matter where you are.",
      "The Ticker Tape for updates is now full-width on the landing page for better visibility.",
      "Fixed a few pesky font loading and build issues for a more stable experience.",
      "Our Experiments page is now even more demonstrative with refined alert highlighting.",
    ],
    tags: ["UI Polish", "Bug Fix", "User Experience"],
  },
  {
    version: "v0.1.0 - The Genesis",
    date: "May 14, 2025",
    title: "Panopticron v0.1: The All-Seeing Eye Awakens!",
    summary:
      "Welcome to the first iteration of Panopticron! We've laid the foundation for a unified monitoring dashboard, focusing on core UI, essential data display, and a peek into our experimental UX research.",
    details: [
      "Launched our public Landing Page – your new front door to project clarity.",
      "Introduced the '/projects' dashboard (initially with mock/Supabase data) featuring the innovative Project Status Card.",
      "Unveiled the LensCluster™: a unique, high-density visual system for at-a-glance project health (Vercel & GitHub status previews).",
      "Rolled out the '/experiments' page: explore our research into visual salience, time-to-acknowledge simulations, and information density.",
      "Implemented a dynamic Ticker Tape for timely updates in the main application header.",
      "Established secure user sign-up, login, and password management, with a manual admin approval flow for new users.",
      "Set up a robust backend architecture blueprint for syncing data from Vercel (and soon GitHub!) into Supabase.",
      "Consistent Panopticron branding applied across authentication pages.",
      "Customizable theming now available throughout the app.",
    ],
    tags: ["New Feature", "Core System", "UI/UX", "Initial Release"],
  },
];
