// src/services/githubApiService.ts
import { ApiService, ApiServiceError } from './apiService';
import type { IGitHubRepo, IGitHubActionsRun, IGitHubActionsRunsResponse } from '@interfaces/github';

const GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || 'https://api.github.com';

export class GitHubApiService {
    private api: ApiService;

    constructor(apiToken: string) {
        if (!apiToken) {
            throw new Error('GitHubApiService: apiToken is required.');
        }
        // GitHub API prefers a specific version header
        const defaultHeaders = {
            'X-GitHub-Api-Version': '2022-11-28',
            'Accept': 'application/vnd.github.v3+json' // Standard accept header
        };
        this.api = new ApiService(GITHUB_API_BASE_URL, { authToken: apiToken, defaultHeaders });
        console.log(`GitHubApiService initialized. Base URL: ${GITHUB_API_BASE_URL}`);
    }

    async getRepoDetails(owner: string, repo: string): Promise<IGitHubRepo | null> {
        console.log(`GitHubApiService: Fetching repo details for ${owner}/${repo}`);
        try {
            const repoDetails = await this.api.get<IGitHubRepo>(`/repos/${owner}/${repo}`);
            return repoDetails;
        } catch (error) {
            if (error instanceof ApiServiceError && error.status === 404) {
                console.warn(`GitHubApiService: Repo ${owner}/${repo} not found (404).`);
            } else if (error instanceof ApiServiceError) {
                console.warn(`GitHubApiService: Could not fetch repo details for ${owner}/${repo} (status ${error.status}):`, error.message, error.data);
            } else {
                console.warn(`GitHubApiService: Unknown error fetching repo details for ${owner}/${repo}:`, error);
            }
            return null; // Return null on error to allow main sync to continue
        }
    }

    async getLatestDefaultBranchRun(owner: string, repo: string, defaultBranch: string): Promise<IGitHubActionsRun | null> {
        console.log(`GitHubApiService: Fetching latest run for ${owner}/${repo} on branch ${defaultBranch}`);
        try {
            const params = new URLSearchParams({
                branch: defaultBranch,
                per_page: '1', // We only need the latest one
                // You could add status filters here if needed, e.g. status: 'completed,in_progress'
            });
            const responseData = await this.api.get<IGitHubActionsRunsResponse>(`/repos/${owner}/${repo}/actions/runs`, params);
            
            if (responseData.workflow_runs && responseData.workflow_runs.length > 0) {
                console.log(`GitHubApiService: Found run ${responseData.workflow_runs[0].id} for ${owner}/${repo} on branch ${defaultBranch}`);
                return responseData.workflow_runs[0];
            } else {
                console.log(`GitHubApiService: No CI runs found for ${owner}/${repo} on branch ${defaultBranch}.`);
                return null;
            }
        } catch (error) {
             if (error instanceof ApiServiceError) {
                console.warn(`GitHubApiService: Could not fetch action runs for ${owner}/${repo} on branch ${defaultBranch} (status ${error.status}):`, error.message, error.data);
            } else {
                console.warn(`GitHubApiService: Unknown error fetching action runs for ${owner}/${repo} on branch ${defaultBranch}:`, error);
            }
            return null; // Return null on error
        }
    }
}