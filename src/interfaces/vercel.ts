// src/interfaces/vercel.ts

// --- Common/Shared Vercel Structures (Keep as is if used elsewhere) ---
export interface IVercelCreator {
  uid: string;
  email?: string;
  username?: string;
  githubLogin?: string;
  gitlabLogin?: string;
}

export interface IVercelProjectGitLink {
  // Assuming this structure is correct for payload.links
  type: "github" | "gitlab" | "bitbucket" | string;
  org?: string;
  repo?: string;
  repoId?: number | string;
  // ... other fields based on actual link structure in payload
}

// --- Vercel Webhook Specific Payloads (REVISED) ---

/**
 * Represents the 'deployment' object within a Vercel webhook payload for deployment events.
 * Aligned with the logged payload and common Vercel documentation.
 */
export interface VercelWebhookDeploymentData {
  id: string; // Deployment unique identifier (uid) e.g., "dpl_EvV2bKqyjJpaUyJ47KzdcRvTXaVA"
  name: string; // Project name, e.g., "panopticron"
  url: string; // Deployment URL, e.g., "panopticron-h0g5dmhhf-borndigital.vercel.app"
  state?:
    | "QUEUED"
    | "BUILDING"
    | "ERROR"
    | "INITIALIZING"
    | "READY"
    | "CANCELED"; // Older field
  readyState?:
    | "QUEUED"
    | "BUILDING"
    | "ERROR"
    | "INITIALIZING"
    | "READY"
    | "CANCELED"; // Current state (optional as not in log)
  target?: "production" | "staging" | string | null; // Environment target, e.g., "production"
  alias?: string[]; // Optional
  aliasAssigned?: number | boolean; // Optional
  createdAt?: number; // Optional (not in your log, but common)
  createdIn?: string; // Optional
  buildingAt?: number; // Optional
  ready?: number; // Optional (timestamp when deployment became ready)
  meta: Record<string, string>; // e.g., githubCommitSha, etc.
  inspectorUrl?: string; // As seen in your log: "https://vercel.com/borndigital/panopticron/EvV2bKqyjJpaUyJ47KzdcRvTXaVA"
  // Note: `projectId` is NOT part of this nested deployment object in the webhook payload.
  // It's available at `payload.project.id`.
  customEnvironmentId?: string | null; // As seen in your log
}

/**
 * Represents the `project` object within a Vercel webhook payload.
 */
export interface VercelWebhookProjectData {
  id: string; // e.g., "prj_RiNB5IrZIyEt8r5QB2YmHw5tdTmO"
  name?: string; // Optional, as it's also in deployment.name. Not in your last log for payload.project
  // framework, nodeVersion, etc., are NOT reliably here.
}

/**
 * Represents the `user` object within a Vercel webhook payload.
 */
export interface VercelWebhookUserData {
  id: string; // e.g., "AdpRITDoj9NOtURbrM8tvaLY"
  // email?: string;
  // username?: string;
}

/**
 * Represents the `team` object within a Vercel webhook payload.
 */
export interface VercelWebhookTeamData {
  id: string; // e.g., "team_ob6Vnd6raumOv0cRZuKDVe0W"
  // slug?: string;
  // name?: string;
}

/**
 * Represents the `payload` part of a Vercel Webhook for deployment events.
 * This should closely match the `payload` object in your logged JSON.
 */
export interface VercelWebhookEventPayload {
  user: VercelWebhookUserData;
  team: VercelWebhookTeamData | null; // Team can be null for personal accounts
  deployment: VercelWebhookDeploymentData;
  project: VercelWebhookProjectData; // This is where the Vercel Project ID is found

  links?: {
    // Structure based on your log
    deployment?: string;
    project?: string;
  };
  // These fields were in your log directly under payload:
  name?: string; // Project name, e.g., "panopticron" (redundant with deployment.name)
  plan?: string; // e.g., "pro"
  regions?: string[]; // e.g., ["iad1"]
  target?: "production" | "staging" | string | null;
  type?: string; // e.g., "LAMBDAS" (deployment build type)
  url?: string; // Deployment URL (redundant with deployment.url)

  // ownerId?: string; // This was not in your log. If needed, determine source (user.id or team.id)
  // deploymentId, projectId (direct children of payload) were not in your log.
}

/**
 * Represents the overall structure of a Vercel Webhook.
 * This should closely match the top-level of your logged JSON.
 */
export interface VercelWebhookPayload {
  id: string; // Unique ID for this webhook event delivery, e.g., "NvcGYtYVULdzyPgE7EnUp"
  type: string; // e.g., "deployment.succeeded"
  createdAt: number; // Timestamp of when the webhook event was created by Vercel (epoch ms)
  payload: VercelWebhookEventPayload;

  // These fields were NOT in your logged payload's top level for this event type.
  // They might appear for other webhook types or configurations. Make them optional.
  teamId?: string | null;
  userId?: string;
  webhookId?: string;
  projectId?: string; // Vercel Project ID (distinct from payload.project.id if webhook is globally scoped)
}

// --- Your other existing interfaces (IVercelAPIProject, IVercelDeploymentsApiResponse, etc.) ---
// Keep them as they are if they are used for direct Vercel API calls, not for webhook parsing.
// ... (rest of your interfaces: IVercelAPIProject, IVercelProjectsApiResponse, etc.)
export interface IVercelProjectGitLink {
  type: "github" | "gitlab" | "bitbucket" | string;
  org?: string;
  repo?: string;
  repoId?: number | string;
  projectId?: string;
  gitCommit?: string;
  createdAt?: number;
  deployedAt?: number;
  sourceless?: boolean;
}

export interface IVercelAPIProject {
  id: string;
  name: string;
  accountId: string;
  framework: string | null;
  nodeVersion: string;
  createdAt?: number;
  updatedAt?: number;
  targets?: {
    production?: {
      alias?: string[];
    };
  };
  link?: IVercelProjectGitLink;
}

export interface IVercelProjectsApiResponse {
  projects: IVercelAPIProject[];
  pagination: {
    count: number;
    next: number | null;
    prev: number | null;
  };
}

export interface IVercelAPIDeployment {
  uid: string;
  url: string;
  name: string;
  readyState:
    | "QUEUED"
    | "BUILDING"
    | "ERROR"
    | "INITIALIZING"
    | "READY"
    | "CANCELED";
  createdAt: number;
  meta?: Record<string, string>;
  target?: "production" | string | null;
  projectId?: string;
}

export interface IVercelDeploymentsApiResponse {
  deployments: IVercelAPIDeployment[];
  pagination?: {
    count: number;
    next: number | null;
    prev: number | null;
  };
}

export interface IVercelAlias {
  uid: string;
  alias: string;
  created: string;
  createdAt?: number;
  deploymentId: string | null;
  domain: string;
  projectId: string | null;
  creator?: IVercelCreator;
}

export interface IVercelProjectDetailed extends IVercelAPIProject {
  alias?: IVercelAlias[];
  latestDeployments?: IVercelAPIDeployment[];
}

export interface ILatestDeployment {
  alias?: string[];
  aliasAssigned?: number | boolean;
  aliasError?: any | null;
  automaticAliases?: string[];
  builds?: Array<{ use: string; src?: string; dest?: string }>;
  createdAt: number;
  createdIn?: string;
  creator: IVercelCreator;
  deploymentHostname?: string;
  forced?: boolean;
  id: string;
  meta?: Record<string, string>;
  name: string;
  plan?: string;
  private?: boolean;
  readyState:
    | "QUEUED"
    | "BUILDING"
    | "ERROR"
    | "INITIALIZING"
    | "READY"
    | "CANCELED";
  target?: string | null;
  type?: string;
  url: string;
  projectId?: string;
}

export interface IVercelProjectWithDeployments {
  id: string;
  name: string;
  framework: string | null;
  nodeVersion: "18.x" | "16.x" | "14.x" | "12.x" | "10.x" | "20.x" | string;
  createdAt: number;
  updatedAt: number;
  alias?: IVercelAlias[];
  targets?: {
    production?: IVercelAPIDeployment;
    [key: string]: IVercelAPIDeployment | undefined;
  };
  latestDeployments?: ILatestDeployment[];
}

export interface IVercelDeploymentDetail extends ILatestDeployment {}

export interface IVercelProjectsResponse {
  projects: IVercelProjectWithDeployments[];
  pagination: {
    count: number;
    next: number | null;
    prev: number | null;
  };
}

// Type for deployment-related events using the revised VercelWebhookPayload
export type VercelDeploymentRelatedEvent = VercelWebhookPayload & {
  type:
    | "deployment.created"
    | "deployment.building"
    | "deployment.ready"
    | "deployment.succeeded" // Alias for ready
    | "deployment.error"
    | "deployment.canceled"
    | "deployment.checks.completed"
    | "deployment.checks.failed"
    | "deployment.checks.registered"
    | "deployment.checks.running";
};
