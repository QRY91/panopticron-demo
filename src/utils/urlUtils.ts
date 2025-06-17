// src/utils/urlUtils.ts
// Helper to parse owner/repo from URL
export function parseGitHubRepoUrl(
  url: string
): { owner: string; repo: string } | null {
  try {
    if (!url) {
      return null;
    }
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match && match[1] && match[2]) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    }
    return null;
  } catch (e) {
    console.error(`CRON (GitHub Sync): Error parsing GitHub URL ${url}:`, e);
  }
  return null;
}
