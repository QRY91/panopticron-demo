// Comprehensive mock data for Panopticron demo presentation
// This file contains all the fake data needed for offline demo functionality

import { addDays, subDays, format } from "date-fns";

// Type definitions for our mock data
export interface MockProject {
  id: string;
  name: string;
  client_id: string;
  status: "active" | "maintenance" | "critical" | "completed" | "paused";
  priority: "low" | "medium" | "high" | "critical";
  health_score: number; // 0-100
  last_updated: string;
  created_at: string;
  description: string;
  tech_stack: string[];
  repository_url: string;
  deployment_url: string;
  team_members: string[];
  progress_percentage: number;
  budget_used: number;
  budget_total: number;
  next_milestone: string;
  priority_sort_key: number;
  manual_priority_override: boolean;
  calculated_priority_score: number;
}

export interface MockClient {
  id: string;
  name: string;
  company_type: "startup" | "enterprise" | "agency" | "nonprofit";
  contact_person: string;
  email: string;
  phone: string;
  active_projects: number;
  total_projects: number;
  relationship_health: "excellent" | "good" | "needs_attention" | "at_risk";
  last_contact: string;
  total_value: number;
  industry: string;
}

export interface MockDeployment {
  id: string;
  project_id: string;
  environment: "production" | "staging" | "development";
  status: "success" | "failed" | "building" | "pending";
  commit_hash: string;
  commit_message: string;
  deployed_at: string;
  deploy_duration: number; // seconds
  url: string;
  logs?: string[];
}

export interface MockGitHubData {
  project_id: string;
  repository: string;
  commits_this_week: number;
  open_prs: number;
  open_issues: number;
  last_commit: {
    hash: string;
    message: string;
    author: string;
    timestamp: string;
  };
  contributors: string[];
  health_metrics: {
    code_coverage: number;
    test_pass_rate: number;
    security_alerts: number;
  };
}

export interface MockAlert {
  id: string;
  project_id: string;
  type: "error" | "warning" | "info" | "critical";
  title: string;
  message: string;
  created_at: string;
  resolved_at?: string;
  severity: number; // 1-5
  source: "deployment" | "monitoring" | "github" | "client" | "manual";
}

export interface MockPerformanceMetric {
  project_id: string;
  timestamp: string;
  response_time: number; // milliseconds
  uptime_percentage: number;
  error_rate: number;
  requests_per_minute: number;
  cpu_usage: number;
  memory_usage: number;
}

export interface MockWorkerRun {
  id: string;
  worker_name: string;
  started_at: string;
  ended_at?: string;
  status:
    | "Success"
    | "Partial Success"
    | "Failure"
    | "No Action Needed"
    | "Started";
  summary_message?: string;
  error_details?: any;
  created_at: string;
}

export interface MockProjectPriorityHistory {
  id: string;
  project_id: string;
  timestamp: string;
  final_priority_sort_key: number;
  calculated_priority_score: number;
  manual_override_value_at_event: number | null;
  reason_for_change: string;
}

// Generate realistic timestamps
const now = new Date();
const getRandomPastDate = (daysBack: number) =>
  format(
    subDays(now, Math.floor(Math.random() * daysBack)),
    "yyyy-MM-dd'T'HH:mm:ss'Z'"
  );

// Mock Clients Data
export const mockClients: MockClient[] = [
  {
    id: "client-1",
    name: "TechFlow Solutions",
    company_type: "startup",
    contact_person: "Sarah Chen",
    email: "sarah@techflow.com",
    phone: "+31 20 555 0123",
    active_projects: 2,
    total_projects: 3,
    relationship_health: "excellent",
    last_contact: getRandomPastDate(3),
    total_value: 145000,
    industry: "FinTech",
  },
  {
    id: "client-2",
    name: "Global Retail Corp",
    company_type: "enterprise",
    contact_person: "Marcus Weber",
    email: "m.weber@globalretail.com",
    phone: "+31 20 555 0456",
    active_projects: 3,
    total_projects: 8,
    relationship_health: "good",
    last_contact: getRandomPastDate(7),
    total_value: 580000,
    industry: "E-commerce",
  },
  {
    id: "client-3",
    name: "GreenEnergy Initiative",
    company_type: "nonprofit",
    contact_person: "Emma Rodriguez",
    email: "emma@greenenergy.org",
    phone: "+31 20 555 0789",
    active_projects: 1,
    total_projects: 2,
    relationship_health: "excellent",
    last_contact: getRandomPastDate(2),
    total_value: 75000,
    industry: "Environmental",
  },
  {
    id: "client-4",
    name: "Creative Minds Agency",
    company_type: "agency",
    contact_person: "David Thompson",
    email: "david@creativeminds.nl",
    phone: "+31 20 555 0321",
    active_projects: 2,
    total_projects: 5,
    relationship_health: "needs_attention",
    last_contact: getRandomPastDate(14),
    total_value: 220000,
    industry: "Marketing",
  },
  {
    id: "client-5",
    name: "MedTech Innovations",
    company_type: "startup",
    contact_person: "Dr. Lisa Park",
    email: "lisa@medtech.com",
    phone: "+31 20 555 0654",
    active_projects: 1,
    total_projects: 1,
    relationship_health: "good",
    last_contact: getRandomPastDate(5),
    total_value: 95000,
    industry: "Healthcare",
  },
];

// Mock Projects Data
export const mockProjects: MockProject[] = [
  {
    id: "project-1",
    name: "TechFlow Dashboard V2",
    client_id: "client-1",
    status: "active",
    priority: "high",
    health_score: 92,
    last_updated: getRandomPastDate(1),
    created_at: getRandomPastDate(45),
    description:
      "Complete redesign of the customer analytics dashboard with real-time data visualization",
    tech_stack: ["React", "Next.js", "TypeScript", "D3.js", "PostgreSQL"],
    repository_url: "https://github.com/borndigital/techflow-dashboard",
    deployment_url: "https://dashboard.techflow.com",
    team_members: ["Alice Johnson", "Bob Chen", "Carol Davis"],
    progress_percentage: 78,
    budget_used: 62000,
    budget_total: 85000,
    next_milestone: "User Testing Phase",
    priority_sort_key: 8800,
    manual_priority_override: false,
    calculated_priority_score: 8800,
  },
  {
    id: "project-2",
    name: "Global Retail Mobile App",
    client_id: "client-2",
    status: "critical",
    priority: "critical",
    health_score: 45,
    last_updated: getRandomPastDate(0),
    created_at: getRandomPastDate(120),
    description:
      "Native mobile app for iOS and Android with AR product visualization",
    tech_stack: ["React Native", "Node.js", "MongoDB", "ARKit", "ARCore"],
    repository_url: "https://github.com/borndigital/retail-mobile",
    deployment_url: "https://beta.globalretail-app.com",
    team_members: ["David Wilson", "Eva Martinez", "Frank Zhang", "Grace Kim"],
    progress_percentage: 45,
    budget_used: 180000,
    budget_total: 250000,
    next_milestone: "AR Feature Implementation",
    priority_sort_key: 150,
    manual_priority_override: true,
    calculated_priority_score: 200,
  },
  {
    id: "project-3",
    name: "Green Energy Portal",
    client_id: "client-3",
    status: "active",
    priority: "medium",
    health_score: 88,
    last_updated: getRandomPastDate(2),
    created_at: getRandomPastDate(30),
    description:
      "Public-facing portal for renewable energy project tracking and community engagement",
    tech_stack: ["Vue.js", "Express.js", "MySQL", "Chart.js"],
    repository_url: "https://github.com/borndigital/green-portal",
    deployment_url: "https://portal.greenenergy.org",
    team_members: ["Helen Brown", "Ian Foster"],
    progress_percentage: 85,
    budget_used: 45000,
    budget_total: 55000,
    next_milestone: "Community Features Launch",
    priority_sort_key: 4200,
    manual_priority_override: false,
    calculated_priority_score: 4200,
  },
  {
    id: "project-4",
    name: "Creative Minds CMS",
    client_id: "client-4",
    status: "maintenance",
    priority: "low",
    health_score: 85,
    last_updated: getRandomPastDate(7),
    created_at: getRandomPastDate(180),
    description:
      "Custom content management system for creative campaign management",
    tech_stack: ["WordPress", "PHP", "MySQL", "JavaScript"],
    repository_url: "https://github.com/borndigital/cms-creative",
    deployment_url: "https://cms.creativeminds.nl",
    team_members: ["Jack Williams", "Kate Anderson"],
    progress_percentage: 100,
    budget_used: 85000,
    budget_total: 90000,
    next_milestone: "Security Updates",
    priority_sort_key: 50,
    manual_priority_override: true,
    calculated_priority_score: 12000,
  },
  {
    id: "project-5",
    name: "MedTech Patient Portal",
    client_id: "client-5",
    status: "active",
    priority: "high",
    health_score: 90,
    last_updated: getRandomPastDate(1),
    created_at: getRandomPastDate(25),
    description: "HIPAA-compliant patient portal with telemedicine integration",
    tech_stack: ["React", "Node.js", "PostgreSQL", "Socket.io", "WebRTC"],
    repository_url: "https://github.com/borndigital/medtech-portal",
    deployment_url: "https://portal.medtech.com",
    team_members: ["Liam Taylor", "Maya Patel", "Noah Rodriguez"],
    progress_percentage: 68,
    budget_used: 55000,
    budget_total: 80000,
    next_milestone: "Security Audit",
    priority_sort_key: 6500,
    manual_priority_override: false,
    calculated_priority_score: 6500,
  },
  {
    id: "project-6",
    name: "Retail Analytics Engine",
    client_id: "client-2",
    status: "active",
    priority: "medium",
    health_score: 82,
    last_updated: getRandomPastDate(3),
    created_at: getRandomPastDate(60),
    description:
      "Real-time analytics engine for sales and customer behavior analysis",
    tech_stack: ["Python", "Apache Kafka", "Redis", "TensorFlow", "FastAPI"],
    repository_url: "https://github.com/borndigital/retail-analytics",
    deployment_url: "https://analytics.globalretail.com",
    team_members: ["Olivia Chen", "Paul Kumar", "Quinn O'Brien"],
    progress_percentage: 72,
    budget_used: 120000,
    budget_total: 180000,
    next_milestone: "ML Model Deployment",
    priority_sort_key: 1800,
    manual_priority_override: false,
    calculated_priority_score: 1800,
  },
  {
    id: "project-7",
    name: "TechFlow API Gateway",
    client_id: "client-1",
    status: "completed",
    priority: "low",
    health_score: 95,
    last_updated: getRandomPastDate(14),
    created_at: getRandomPastDate(90),
    description:
      "Microservices API gateway with rate limiting and authentication",
    tech_stack: ["Go", "Docker", "Kubernetes", "Redis", "JWT"],
    repository_url: "https://github.com/borndigital/techflow-gateway",
    deployment_url: "https://api.techflow.com",
    team_members: ["Rachel Green", "Sam Wilson"],
    progress_percentage: 100,
    budget_used: 58000,
    budget_total: 60000,
    next_milestone: "Project Complete",
    priority_sort_key: 15000,
    manual_priority_override: false,
    calculated_priority_score: 15000,
  },
  {
    id: "project-8",
    name: "Creative Campaign Tracker",
    client_id: "client-4",
    status: "paused",
    priority: "low",
    health_score: 60,
    last_updated: getRandomPastDate(21),
    created_at: getRandomPastDate(40),
    description: "Campaign performance tracking with social media integration",
    tech_stack: ["Angular", "Express.js", "MongoDB", "Social APIs"],
    repository_url: "https://github.com/borndigital/campaign-tracker",
    deployment_url: "https://tracker.creativeminds.nl",
    team_members: ["Tom Martinez", "Uma Singh"],
    progress_percentage: 35,
    budget_used: 25000,
    budget_total: 70000,
    next_milestone: "Client Approval Pending",
    priority_sort_key: 10500,
    manual_priority_override: false,
    calculated_priority_score: 10500,
  },
];

// Mock Deployments Data
export const mockDeployments: MockDeployment[] = [
  {
    id: "deploy-1",
    project_id: "project-1",
    environment: "production",
    status: "success",
    commit_hash: "a1b2c3d4",
    commit_message: "Fix: Resolve dashboard loading issue",
    deployed_at: getRandomPastDate(1),
    deploy_duration: 145,
    url: "https://dashboard.techflow.com",
    logs: ["Building...", "Tests passed", "Deployment successful"],
  },
  {
    id: "deploy-2",
    project_id: "project-2",
    environment: "production",
    status: "failed",
    commit_hash: "e5f6g7h8",
    commit_message: "Feature: Add AR product viewer",
    deployed_at: getRandomPastDate(0),
    deploy_duration: 89,
    url: "https://beta.globalretail-app.com",
    logs: [
      "Building...",
      "Tests failed",
      "Deployment aborted",
      "Error: Memory limit exceeded",
    ],
  },
  {
    id: "deploy-3",
    project_id: "project-3",
    environment: "staging",
    status: "success",
    commit_hash: "i9j0k1l2",
    commit_message: "Update: Community engagement features",
    deployed_at: getRandomPastDate(2),
    deploy_duration: 67,
    url: "https://staging.greenenergy.org",
    logs: ["Building...", "Tests passed", "Staging deployment successful"],
  },
  {
    id: "deploy-4",
    project_id: "project-5",
    environment: "production",
    status: "building",
    commit_hash: "m3n4o5p6",
    commit_message: "Security: HIPAA compliance updates",
    deployed_at: getRandomPastDate(0),
    deploy_duration: 0,
    url: "https://portal.medtech.com",
    logs: [
      "Starting build...",
      "Installing dependencies...",
      "Running tests...",
    ],
  },
];

// Mock GitHub Data
export const mockGitHubData: MockGitHubData[] = [
  {
    project_id: "project-1",
    repository: "borndigital/techflow-dashboard",
    commits_this_week: 12,
    open_prs: 2,
    open_issues: 5,
    last_commit: {
      hash: "a1b2c3d4",
      message: "Fix: Resolve dashboard loading issue",
      author: "Alice Johnson",
      timestamp: getRandomPastDate(1),
    },
    contributors: ["Alice Johnson", "Bob Chen", "Carol Davis"],
    health_metrics: {
      code_coverage: 87,
      test_pass_rate: 94,
      security_alerts: 1,
    },
  },
  {
    project_id: "project-2",
    repository: "borndigital/retail-mobile",
    commits_this_week: 8,
    open_prs: 4,
    open_issues: 12,
    last_commit: {
      hash: "e5f6g7h8",
      message: "Feature: Add AR product viewer",
      author: "David Wilson",
      timestamp: getRandomPastDate(0),
    },
    contributors: ["David Wilson", "Eva Martinez", "Frank Zhang", "Grace Kim"],
    health_metrics: {
      code_coverage: 73,
      test_pass_rate: 89,
      security_alerts: 3,
    },
  },
  {
    project_id: "project-5",
    repository: "borndigital/medtech-portal",
    commits_this_week: 15,
    open_prs: 1,
    open_issues: 8,
    last_commit: {
      hash: "m3n4o5p6",
      message: "Security: HIPAA compliance updates",
      author: "Maya Patel",
      timestamp: getRandomPastDate(0),
    },
    contributors: ["Liam Taylor", "Maya Patel", "Noah Rodriguez"],
    health_metrics: {
      code_coverage: 91,
      test_pass_rate: 97,
      security_alerts: 0,
    },
  },
];

// Mock Alerts Data
export const mockAlerts: MockAlert[] = [
  {
    id: "alert-1",
    project_id: "project-2",
    type: "critical",
    title: "Deployment Failed",
    message:
      "Production deployment failed due to memory limit exceeded. AR features causing memory leak.",
    created_at: getRandomPastDate(0),
    severity: 5,
    source: "deployment",
  },
  {
    id: "alert-2",
    project_id: "project-1",
    type: "warning",
    title: "High Response Time",
    message:
      "Dashboard API response time increased to 2.3s, exceeding SLA threshold of 2.0s.",
    created_at: getRandomPastDate(2),
    resolved_at: getRandomPastDate(1),
    severity: 3,
    source: "monitoring",
  },
  {
    id: "alert-3",
    project_id: "project-5",
    type: "info",
    title: "Security Scan Complete",
    message:
      "Automated security scan completed successfully. No vulnerabilities found.",
    created_at: getRandomPastDate(1),
    resolved_at: getRandomPastDate(1),
    severity: 1,
    source: "github",
  },
  {
    id: "alert-4",
    project_id: "project-4",
    type: "warning",
    title: "Client Communication Overdue",
    message: "No client communication for 14 days. Status update recommended.",
    created_at: getRandomPastDate(0),
    severity: 2,
    source: "manual",
  },
];

// Mock Worker Runs Data (for /status page)
export const mockWorkerRuns: MockWorkerRun[] = [
  {
    id: "worker-run-1",
    worker_name: "sync-github-data",
    started_at: getRandomPastDate(0.02), // 30 minutes ago
    ended_at: getRandomPastDate(0.01), // 15 minutes ago
    status: "Success",
    summary_message:
      "Finished. Projects processed: 8, Updated in DB: 6, Snapshots created: 12, Errors: 0.",
    created_at: getRandomPastDate(0.02),
  },
  {
    id: "worker-run-2",
    worker_name: "sync-vercel-projects",
    started_at: getRandomPastDate(0.04), // 1 hour ago
    ended_at: getRandomPastDate(0.03), // 45 minutes ago
    status: "Partial Success",
    summary_message:
      "Finished. Upserted/Updated: 7, Snapshots created: 5, Errors: 1.",
    error_details: {
      message: "Rate limit exceeded for vercel-project-retail-mobile",
      project: "project-2",
    },
    created_at: getRandomPastDate(0.04),
  },
  {
    id: "worker-run-3",
    worker_name: "sync-github-data",
    started_at: getRandomPastDate(0.25), // 6 hours ago
    ended_at: getRandomPastDate(0.24), // 5.5 hours ago
    status: "Success",
    summary_message:
      "Finished. Projects processed: 8, Updated in DB: 8, Snapshots created: 15, Errors: 0.",
    created_at: getRandomPastDate(0.25),
  },
  {
    id: "worker-run-4",
    worker_name: "sync-vercel-projects",
    started_at: getRandomPastDate(0.5), // 12 hours ago
    ended_at: getRandomPastDate(0.49), // 11.5 hours ago
    status: "Failure",
    summary_message: "Critical error during main process.",
    error_details: {
      message: "VERCEL_API_TOKEN authentication failed",
      stack: "TypeError: Invalid token format...",
      httpStatus: 401,
    },
    created_at: getRandomPastDate(0.5),
  },
  {
    id: "worker-run-5",
    worker_name: "sync-github-data",
    started_at: getRandomPastDate(1), // 24 hours ago
    ended_at: getRandomPastDate(0.99),
    status: "Success",
    summary_message:
      "Finished. Projects processed: 8, Updated in DB: 4, Snapshots created: 8, Errors: 0.",
    created_at: getRandomPastDate(1),
  },
  {
    id: "worker-run-6",
    worker_name: "sync-vercel-projects",
    started_at: getRandomPastDate(1.5), // 36 hours ago
    ended_at: getRandomPastDate(1.49),
    status: "No Action Needed",
    summary_message:
      "Finished. Upserted/Updated: 0, Snapshots created: 0, Errors: 0.",
    created_at: getRandomPastDate(1.5),
  },
];

// Mock Project Priority History (for lifeline charts) - Based on production patterns
export const mockProjectPriorityHistory: MockProjectPriorityHistory[] = [
  // Project-1 (TechFlow Dashboard) - Stable, healthy project like production panopticron
  {
    id: "priority-history-1-1",
    project_id: "project-1",
    timestamp: format(subDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 10000,
    calculated_priority_score: 10000,
    manual_override_value_at_event: null,
    reason_for_change: "Initial baseline priority",
  },
  {
    id: "priority-history-1-2",
    project_id: "project-1",
    timestamp: format(subDays(now, 25), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 9000,
    calculated_priority_score: 9000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: READY -> BUILDING",
  },
  {
    id: "priority-history-1-3",
    project_id: "project-1",
    timestamp: format(subDays(now, 25), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 10000,
    calculated_priority_score: 10000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: BUILDING -> READY",
  },
  {
    id: "priority-history-1-4",
    project_id: "project-1",
    timestamp: format(subDays(now, 20), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 9500,
    calculated_priority_score: 9500,
    manual_override_value_at_event: null,
    reason_for_change: "GitHub CI status changed: success -> failure",
  },
  {
    id: "priority-history-1-5",
    project_id: "project-1",
    timestamp: format(subDays(now, 18), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 10000,
    calculated_priority_score: 10000,
    manual_override_value_at_event: null,
    reason_for_change: "GitHub CI status changed: failure -> success",
  },
  {
    id: "priority-history-1-6",
    project_id: "project-1",
    timestamp: format(subDays(now, 5), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 9000,
    calculated_priority_score: 9000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: READY -> BUILDING",
  },
  {
    id: "priority-history-1-7",
    project_id: "project-1",
    timestamp: format(subDays(now, 5), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 10000,
    calculated_priority_score: 10000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: BUILDING -> READY",
  },

  // Project-2 (Global Retail Mobile App) - Critical project with deployment issues
  {
    id: "priority-history-2-1",
    project_id: "project-2",
    timestamp: format(subDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 8000,
    calculated_priority_score: 8000,
    manual_override_value_at_event: null,
    reason_for_change: "Initial baseline priority",
  },
  {
    id: "priority-history-2-2",
    project_id: "project-2",
    timestamp: format(subDays(now, 25), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 1500,
    calculated_priority_score: 1500,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: READY -> ERROR",
  },
  {
    id: "priority-history-2-3",
    project_id: "project-2",
    timestamp: format(subDays(now, 24), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 8000,
    calculated_priority_score: 8000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: ERROR -> READY",
  },
  {
    id: "priority-history-2-4",
    project_id: "project-2",
    timestamp: format(subDays(now, 20), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 1500,
    calculated_priority_score: 1500,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: READY -> ERROR",
  },
  {
    id: "priority-history-2-5",
    project_id: "project-2",
    timestamp: format(subDays(now, 18), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 150,
    calculated_priority_score: 1500,
    manual_override_value_at_event: 150,
    reason_for_change:
      "Manual priority override applied due to critical client escalation",
  },
  {
    id: "priority-history-2-6",
    project_id: "project-2",
    timestamp: format(subDays(now, 15), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 1200,
    calculated_priority_score: 1200,
    manual_override_value_at_event: null,
    reason_for_change: "GitHub CI status changed: success -> failure",
  },
  {
    id: "priority-history-2-7",
    project_id: "project-2",
    timestamp: format(subDays(now, 10), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 500,
    calculated_priority_score: 500,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: READY -> ERROR",
  },
  {
    id: "priority-history-2-8",
    project_id: "project-2",
    timestamp: format(subDays(now, 8), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 150,
    calculated_priority_score: 8000,
    manual_override_value_at_event: 150,
    reason_for_change:
      "Manual priority override reapplied - deployment still failing",
  },
  {
    id: "priority-history-2-9",
    project_id: "project-2",
    timestamp: format(subDays(now, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 150,
    calculated_priority_score: 200,
    manual_override_value_at_event: 150,
    reason_for_change: "Vercel status changed: ERROR -> BUILDING",
  },
  {
    id: "priority-history-2-10",
    project_id: "project-2",
    timestamp: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 150,
    calculated_priority_score: 200,
    manual_override_value_at_event: 150,
    reason_for_change: "Vercel status changed: BUILDING -> ERROR",
  },

  // Project-3 (Green Energy Portal) - Medium priority, occasional issues
  {
    id: "priority-history-3-1",
    project_id: "project-3",
    timestamp: format(subDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 7000,
    calculated_priority_score: 7000,
    manual_override_value_at_event: null,
    reason_for_change: "Initial baseline priority",
  },
  {
    id: "priority-history-3-2",
    project_id: "project-3",
    timestamp: format(subDays(now, 15), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 6000,
    calculated_priority_score: 6000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: READY -> BUILDING",
  },
  {
    id: "priority-history-3-3",
    project_id: "project-3",
    timestamp: format(subDays(now, 15), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 7000,
    calculated_priority_score: 7000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: BUILDING -> READY",
  },
  {
    id: "priority-history-3-4",
    project_id: "project-3",
    timestamp: format(subDays(now, 8), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 4200,
    calculated_priority_score: 4200,
    manual_override_value_at_event: null,
    reason_for_change: "GitHub CI status changed: success -> failure",
  },
  {
    id: "priority-history-3-5",
    project_id: "project-3",
    timestamp: format(subDays(now, 6), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 7000,
    calculated_priority_score: 7000,
    manual_override_value_at_event: null,
    reason_for_change: "GitHub CI status changed: failure -> success",
  },

  // Project-4 (Creative Minds CMS) - Healthy project with manual override example
  {
    id: "priority-history-4-1",
    project_id: "project-4",
    timestamp: format(subDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 12000,
    calculated_priority_score: 12000,
    manual_override_value_at_event: null,
    reason_for_change: "Initial baseline priority",
  },
  {
    id: "priority-history-4-2",
    project_id: "project-4",
    timestamp: format(subDays(now, 25), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 11000,
    calculated_priority_score: 11000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: READY -> BUILDING",
  },
  {
    id: "priority-history-4-3",
    project_id: "project-4",
    timestamp: format(subDays(now, 25), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 12000,
    calculated_priority_score: 12000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: BUILDING -> READY",
  },
  {
    id: "priority-history-4-4",
    project_id: "project-4",
    timestamp: format(subDays(now, 5), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 50,
    calculated_priority_score: 12000,
    manual_override_value_at_event: 50,
    reason_for_change:
      "Manual priority override - urgent client security audit requested",
  },
  {
    id: "priority-history-4-5",
    project_id: "project-4",
    timestamp: format(subDays(now, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 50,
    calculated_priority_score: 12000,
    manual_override_value_at_event: 50,
    reason_for_change: "Priority maintained - security audit in progress",
  },

  // Project-5 (MedTech Patient Portal) - Medium priority with security focus
  {
    id: "priority-history-5-1",
    project_id: "project-5",
    timestamp: format(subDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 7000,
    calculated_priority_score: 7000,
    manual_override_value_at_event: null,
    reason_for_change: "Initial baseline priority",
  },
  {
    id: "priority-history-5-2",
    project_id: "project-5",
    timestamp: format(subDays(now, 20), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 6000,
    calculated_priority_score: 6000,
    manual_override_value_at_event: null,
    reason_for_change: "Security scan completed - no critical issues",
  },
  {
    id: "priority-history-5-3",
    project_id: "project-5",
    timestamp: format(subDays(now, 12), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 6500,
    calculated_priority_score: 6500,
    manual_override_value_at_event: null,
    reason_for_change: "Performance optimization completed",
  },
  {
    id: "priority-history-5-4",
    project_id: "project-5",
    timestamp: format(subDays(now, 8), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 5500,
    calculated_priority_score: 5500,
    manual_override_value_at_event: null,
    reason_for_change: "GitHub CI status changed: success -> failure",
  },
  {
    id: "priority-history-5-5",
    project_id: "project-5",
    timestamp: format(subDays(now, 6), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 6500,
    calculated_priority_score: 6500,
    manual_override_value_at_event: null,
    reason_for_change: "GitHub CI status changed: failure -> success",
  },

  // Project-6 (Retail Analytics Engine) - High priority active development
  {
    id: "priority-history-6-1",
    project_id: "project-6",
    timestamp: format(subDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 3000,
    calculated_priority_score: 3000,
    manual_override_value_at_event: null,
    reason_for_change: "Initial baseline priority",
  },
  {
    id: "priority-history-6-2",
    project_id: "project-6",
    timestamp: format(subDays(now, 20), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 2000,
    calculated_priority_score: 2000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: READY -> ERROR",
  },
  {
    id: "priority-history-6-3",
    project_id: "project-6",
    timestamp: format(subDays(now, 18), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 3000,
    calculated_priority_score: 3000,
    manual_override_value_at_event: null,
    reason_for_change: "Vercel status changed: ERROR -> READY",
  },
  {
    id: "priority-history-6-4",
    project_id: "project-6",
    timestamp: format(subDays(now, 10), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 1800,
    calculated_priority_score: 1800,
    manual_override_value_at_event: null,
    reason_for_change: "GitHub CI status changed: success -> failure",
  },
  {
    id: "priority-history-6-5",
    project_id: "project-6",
    timestamp: format(subDays(now, 8), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    final_priority_sort_key: 3000,
    calculated_priority_score: 3000,
    manual_override_value_at_event: null,
    reason_for_change: "GitHub CI status changed: failure -> success",
  },
];

// Mock Performance Metrics (sample data for charts)
export const mockPerformanceMetrics: MockPerformanceMetric[] = [
  // Generate sample metrics for the last 7 days for project-1
  ...Array.from({ length: 7 }, (_, i) => ({
    project_id: "project-1",
    timestamp: format(subDays(now, i), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    response_time: 800 + Math.random() * 400,
    uptime_percentage: 99.2 + Math.random() * 0.8,
    error_rate: Math.random() * 0.5,
    requests_per_minute: 150 + Math.random() * 100,
    cpu_usage: 45 + Math.random() * 30,
    memory_usage: 60 + Math.random() * 25,
  })),
  // Generate sample metrics for project-2
  ...Array.from({ length: 7 }, (_, i) => ({
    project_id: "project-2",
    timestamp: format(subDays(now, i), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    response_time: 1200 + Math.random() * 600,
    uptime_percentage: 98.5 + Math.random() * 1.5,
    error_rate: Math.random() * 1.2,
    requests_per_minute: 200 + Math.random() * 150,
    cpu_usage: 65 + Math.random() * 25,
    memory_usage: 75 + Math.random() * 20,
  })),
];

// Export all mock data
export const mockData = {
  clients: mockClients,
  projects: mockProjects,
  deployments: mockDeployments,
  github: mockGitHubData,
  alerts: mockAlerts,
  performance: mockPerformanceMetrics,
  workerRuns: mockWorkerRuns,
  priorityHistory: mockProjectPriorityHistory,
};

// Helper functions for accessing mock data
export const getProjectById = (id: string) =>
  mockProjects.find((p) => p.id === id);
export const getClientById = (id: string) =>
  mockClients.find((c) => c.id === id);
export const getProjectsByClient = (clientId: string) =>
  mockProjects.filter((p) => p.client_id === clientId);
export const getDeploymentsByProject = (projectId: string) =>
  mockDeployments.filter((d) => d.project_id === projectId);
export const getAlertsByProject = (projectId: string) =>
  mockAlerts.filter((a) => a.project_id === projectId);
export const getActiveAlerts = () => mockAlerts.filter((a) => !a.resolved_at);
export const getWorkerRunsByName = (workerName: string) =>
  mockWorkerRuns.filter((w) => w.worker_name === workerName);
export const getRecentWorkerRuns = (limit: number = 10) =>
  mockWorkerRuns.slice(0, limit);
export const getPriorityHistoryByProject = (projectId: string) =>
  mockProjectPriorityHistory.filter((p) => p.project_id === projectId);

// Demo statistics for dashboard
export const getDemoStats = () => ({
  totalProjects: mockProjects.length,
  activeProjects: mockProjects.filter((p) => p.status === "active").length,
  criticalProjects: mockProjects.filter((p) => p.status === "critical").length,
  totalClients: mockClients.length,
  healthyClients: mockClients.filter(
    (c) =>
      c.relationship_health === "excellent" || c.relationship_health === "good"
  ).length,
  openAlerts: getActiveAlerts().length,
  criticalAlerts: getActiveAlerts().filter((a) => a.type === "critical").length,
  totalRevenue: mockClients.reduce((sum, c) => sum + c.total_value, 0),
  averageProjectHealth: Math.round(
    mockProjects.reduce((sum, p) => sum + p.health_score, 0) /
      mockProjects.length
  ),
  successfulWorkerRuns: mockWorkerRuns.filter((w) => w.status === "Success")
    .length,
  failedWorkerRuns: mockWorkerRuns.filter((w) => w.status === "Failure").length,
  lastSyncTime:
    mockWorkerRuns.length > 0
      ? mockWorkerRuns[0].ended_at || mockWorkerRuns[0].started_at
      : null,
});

export default mockData;
