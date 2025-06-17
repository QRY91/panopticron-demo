// Demo configuration for presentation mode
// This file centralizes all demo-related settings for easy management

export const DEMO_CONFIG = {
  // Core demo settings
  DEMO_MODE: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  DISABLE_AUTH: process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true' || process.env.NODE_ENV === 'development',
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development',
  OFFLINE_MODE: process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true',

  // Demo user info (for display purposes)
  DEMO_USER: {
    name: 'Demo User',
    email: 'demo@borndigital.studio',
    company: 'Born Digital Studio',
    role: 'Product Manager'
  },

  // Demo timing settings
  DEMO_DELAYS: {
    LOADING_SIMULATION: 500,  // ms to simulate loading states
    NOTIFICATION_DURATION: 3000,  // ms for demo notifications
    AUTO_REFRESH_INTERVAL: 10000  // ms for simulated real-time updates
  },

  // Demo data settings
  DATA_CONFIG: {
    PROJECT_COUNT: 8,
    DEPLOYMENT_HISTORY_DAYS: 30,
    GITHUB_COMMITS_COUNT: 50,
    ALERT_HISTORY_DAYS: 7,
    CLIENT_COUNT: 5
  },

  // Visual demo enhancements
  UI_ENHANCEMENTS: {
    SHOW_DEMO_BADGE: true,
    HIGHLIGHT_KEY_FEATURES: true,
    ENABLE_TOUR_HINTS: false,  // Set to true if you want guided tour
    SMOOTH_ANIMATIONS: true
  },

  // API mocking settings
  API_CONFIG: {
    MOCK_API_RESPONSES: true,
    SIMULATE_NETWORK_DELAYS: true,
    RANDOM_ERROR_SIMULATION: false,  // Set to true to demo error handling
    ERROR_RATE: 0.05  // 5% chance of simulated errors when enabled
  },

  // Feature flags for demo
  FEATURES: {
    GITHUB_INTEGRATION: true,
    VERCEL_INTEGRATION: true,
    SLACK_NOTIFICATIONS: true,
    REAL_TIME_UPDATES: true,
    ADVANCED_ANALYTICS: true,
    CLIENT_PORTAL: false  // Keep simple for demo
  }
};

// Helper functions for demo mode
export const isDemoMode = () => DEMO_CONFIG.DEMO_MODE;
export const isAuthDisabled = () => DEMO_CONFIG.DISABLE_AUTH;
export const shouldUseMockData = () => DEMO_CONFIG.USE_MOCK_DATA;
export const isOfflineMode = () => DEMO_CONFIG.OFFLINE_MODE;

// Demo environment checker
export const getDemoEnvironmentInfo = () => ({
  mode: DEMO_CONFIG.DEMO_MODE ? 'Demo' : 'Production',
  auth: DEMO_CONFIG.DISABLE_AUTH ? 'Disabled' : 'Enabled',
  data: DEMO_CONFIG.USE_MOCK_DATA ? 'Mock Data' : 'Live Data',
  network: DEMO_CONFIG.OFFLINE_MODE ? 'Offline' : 'Online'
});

// Presentation-specific settings
export const PRESENTATION_CONFIG = {
  // Routes to showcase in order of demo flow
  DEMO_FLOW_ROUTES: [
    '/dashboard',
    '/projects',
    '/projects/demo-project-1',
    '/status',
    '/admin'
  ],

  // Key features to highlight during demo
  KEY_FEATURES: [
    'Real-time project monitoring',
    'GitHub integration',
    'Deployment tracking',
    'Client communication hub',
    'Automated alerts',
    'Performance analytics'
  ],

  // Sample talking points for each route
  ROUTE_TALKING_POINTS: {
    '/dashboard': [
      'Overview of all active projects',
      'Color-coded priority system',
      'Real-time status indicators',
      'Quick action buttons'
    ],
    '/projects': [
      'Detailed project list view',
      'Advanced filtering options',
      'Bulk operations capability',
      'Project health metrics'
    ],
    '/status': [
      'System health monitoring',
      'Integration status overview',
      'Performance metrics',
      'Alert management'
    ]
  }
};

export default DEMO_CONFIG;
