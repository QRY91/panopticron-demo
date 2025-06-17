// src/utils/tests/urlUtils.test.ts
import { describe, it, expect } from 'vitest';
import { parseGitHubRepoUrl } from '@utils/urlUtils'; // Adjust path if parseGitHubRepoUrl is elsewhere

describe('parseGitHubRepoUrl', () => {
  it('should parse a standard GitHub HTTPS URL', () => {
    const url = 'https://github.com/ownerName/repo-name';
    expect(parseGitHubRepoUrl(url)).toEqual({ owner: 'ownerName', repo: 'repo-name' });
  });

  it('should parse a GitHub URL with .git suffix', () => {
    const url = 'https://github.com/ownerName/repo-name.git';
    expect(parseGitHubRepoUrl(url)).toEqual({ owner: 'ownerName', repo: 'repo-name' });
  });

  it('should return null for invalid URLs', () => {
    expect(parseGitHubRepoUrl('https://gitlab.com/owner/repo')).toBeNull();
    expect(parseGitHubRepoUrl('invalid-url')).toBeNull();
    expect(parseGitHubRepoUrl('https://github.com/owneronly')).toBeNull();
  });

  it('should return null for empty or null input', () => {
    expect(parseGitHubRepoUrl('')).toBeNull();
    expect(parseGitHubRepoUrl(null as any)).toBeNull(); // Test with null
  });

  it('should handle URLs with extra path segments gracefully', () => {
    const url = 'https://github.com/ownerName/repo-name/issues/1';
    expect(parseGitHubRepoUrl(url)).toEqual({ owner: 'ownerName', repo: 'repo-name' });
  });
});