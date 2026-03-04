/* ─────────────────────────────────────────────────────
   GitHub API — fetches profile + repos at build / ISR time.
   Runs server-side only (no client bundle).
   ───────────────────────────────────────────────────── */

const GITHUB_USERNAME = "iruzen-dono";
const API = "https://api.github.com";

/* ── Types ───────────────────────────────────────────── */
export interface GitHubProfile {
  name: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubData {
  profile: GitHubProfile | null;
  repos: GitHubRepo[];
  fetchedAt: string;
}

/* ── Fetcher ─────────────────────────────────────────── */
const headers: HeadersInit = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "portfolio-terminal",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

export async function fetchGitHubData(): Promise<GitHubData> {
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`${API}/users/${GITHUB_USERNAME}`, {
        headers,
        next: { revalidate: 3600 }, // ISR: 1 hour
      }),
      fetch(`${API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    const profile: GitHubProfile | null = profileRes.ok
      ? await profileRes.json()
      : null;

    const allRepos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

    // Filter out forks, sort by most recently pushed
    const repos = allRepos
      .filter((r) => !r.fork)
      .sort(
        (a, b) =>
          new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
      );

    return {
      profile,
      repos,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[github] Failed to fetch GitHub data:", err);
    return { profile: null, repos: [], fetchedAt: new Date().toISOString() };
  }
}
