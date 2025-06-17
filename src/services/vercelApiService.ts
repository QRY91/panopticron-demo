// src/services/vercelApiService.ts
import { ApiService, ApiServiceError } from './apiService';
import type {
    IVercelAPIProject,
    IVercelProjectsApiResponse,
    IVercelAPIDeployment,
    IVercelDeploymentsApiResponse
} from '@interfaces/vercel';

const VERCEL_API_BASE_URL = process.env.VERCEL_API_BASE_URL || 'https://api.vercel.com';

export class VercelApiService {
    private api: ApiService;
    private teamId?: string;

    constructor(apiToken: string, teamId?: string) {
        if (!apiToken) {
            throw new Error('VercelApiService: apiToken is required.');
        }
        this.api = new ApiService(VERCEL_API_BASE_URL, { authToken: apiToken });
        this.teamId = teamId;
        console.log(`VercelApiService initialized. Base URL: ${VERCEL_API_BASE_URL}, Team ID: ${this.teamId || 'N/A (personal scope)'}`);
    }

    async getAllProjects(): Promise<IVercelAPIProject[]> {
        const allProjects: IVercelAPIProject[] = [];
        let nextTimestamp: number | null = null;
        const limit = 100; // Vercel API max limit for projects is 100
        let pageCount = 0;

        console.log(`VercelApiService: Fetching all Vercel projects...`);
        try {
            do {
                pageCount++;
                const params = new URLSearchParams({ limit: limit.toString() });
                if (nextTimestamp) {
                    params.append("until", nextTimestamp.toString()); // Vercel uses 'until' for project pagination based on 'createdAt'
                }
                if (this.teamId) {
                    params.append("teamId", this.teamId);
                }

                // Vercel API for projects is /v9/projects
                const pageData = await this.api.get<IVercelProjectsApiResponse>('/v9/projects', params);

                if (pageData.projects && pageData.projects.length > 0) {
                    allProjects.push(...pageData.projects);
                    // Vercel's pagination.next is the timestamp of the last item in the current page,
                    // so for the next request, we want items created *before* this timestamp.
                    nextTimestamp = pageData.pagination?.next || null;
                } else {
                    nextTimestamp = null; // No more projects or empty page
                }
                console.log(`VercelApiService: Fetched page ${pageCount}, ${pageData.projects?.length || 0} projects. Next timestamp: ${nextTimestamp}`);

            } while (nextTimestamp && pageCount < 20); // Safety break for pagination, adjust as needed

            console.log(`VercelApiService: Total Vercel projects fetched: ${allProjects.length} over ${pageCount} pages.`);
            return allProjects;
        } catch (error) {
            if (error instanceof ApiServiceError) {
                console.error(`VercelApiService: Error fetching Vercel projects (status ${error.status}):`, error.message, error.data);
            } else {
                console.error(`VercelApiService: Unknown error fetching Vercel projects:`, error);
            }
            throw error; // Re-throw to be caught by the worker
        }
    }

    async getLatestProdDeployment(projectId: string): Promise<IVercelAPIDeployment | null> {
        console.log(`VercelApiService: Fetching latest prod deployment for projectId: ${projectId}`);
        try {
            const params = new URLSearchParams({
                projectId: projectId,
                target: 'production',
                limit: '1', // Fetch only the latest one
                state: 'READY,ERROR,BUILDING,QUEUED,CANCELED' // Relevant states
            });
            if (this.teamId) {
                params.append("teamId", this.teamId);
            }

            // Vercel API for deployments is /v6/deployments
            const deploymentData = await this.api.get<IVercelDeploymentsApiResponse>(`/v6/deployments`, params);

            if (deploymentData.deployments && deploymentData.deployments.length > 0) {
                console.log(`VercelApiService: Found deployment ${deploymentData.deployments[0].uid} (${deploymentData.deployments[0].readyState}) for projectId: ${projectId}`);
                return deploymentData.deployments[0];
            } else {
                console.log(`VercelApiService: No prod deployments found for projectId: ${projectId}`);
                return null;
            }
        } catch (error) {
            // Log specific warning for this non-critical fetch, but don't let it kill the whole sync for one project
            if (error instanceof ApiServiceError) {
                console.warn(`VercelApiService: Could not fetch prod deployment for ${projectId} (status ${error.status}):`, error.message, error.data);
            } else {
                console.warn(`VercelApiService: Unknown error fetching prod deployment for ${projectId}:`, error);
            }
            return null; // Return null if fetching deployment fails for a specific project
        }
    }
}