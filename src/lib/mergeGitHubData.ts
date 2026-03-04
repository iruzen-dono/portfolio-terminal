/* ─────────────────────────────────────────────────────
   mergeGitHubData — merges live GitHub API data into
   the static portfolioData. Runs server-side at build
   or ISR time so the portfolio always shows fresh repos.
   ───────────────────────────────────────────────────── */

import { portfolioData, type PortfolioData } from "./data";
import type { GitHubData } from "./github";

/** Map GitHub language → tech stack labels */
function techFromLanguage(lang: string | null): string[] {
  if (!lang) return [];
  const map: Record<string, string[]> = {
    TypeScript: ["TypeScript"],
    JavaScript: ["JavaScript"],
    Java: ["Java"],
    PHP: ["PHP"],
    Python: ["Python"],
    Rust: ["Rust"],
    Go: ["Go"],
    CSS: ["CSS"],
    HTML: ["HTML"],
  };
  return map[lang] || [lang];
}

export function mergeGitHubData(gh: GitHubData): PortfolioData {
  // Start from static data
  const base = structuredClone(portfolioData);

  // Update profile fields if GitHub returns them
  if (gh.profile) {
    if (gh.profile.name) base.name = gh.profile.name;
    if (gh.profile.location) base.location = gh.profile.location;
    if (gh.profile.email) base.email = gh.profile.email;
    base.github = gh.profile.html_url;
    base.contact.github = gh.profile.html_url;
    if (gh.profile.email) base.contact.email = gh.profile.email;
  }

  // Build a set of repo names already manually defined in data.ts
  const existingIds = new Set(base.projects.map((p) => p.id));
  const existingGithubUrls = new Set(
    base.projects.map((p) => p.github.toLowerCase()).filter(Boolean)
  );

  // Update existing projects with live GitHub data (stars, description, homepage)
  for (const proj of base.projects) {
    const ghRepo = gh.repos.find(
      (r) =>
        r.html_url.toLowerCase() === proj.github.toLowerCase() ||
        r.name.toLowerCase() === proj.id.toLowerCase()
    );
    if (ghRepo) {
      // Always keep manual description if it's richer, but update github url
      if (!proj.github) proj.github = ghRepo.html_url;
      if (!proj.live && ghRepo.homepage) proj.live = ghRepo.homepage;
      // Inject topics as extra tech if missing
      for (const topic of ghRepo.topics || []) {
        const label = topic.charAt(0).toUpperCase() + topic.slice(1);
        if (!proj.tech.some((t) => t.toLowerCase() === topic.toLowerCase())) {
          // Don't bloat — only add if ≤ 10 techs
          if (proj.tech.length < 10) proj.tech.push(label);
        }
      }
    }
  }

  // Add NEW repos from GitHub that are not in static data
  for (const repo of gh.repos) {
    const urlLower = repo.html_url.toLowerCase();
    const idLower = repo.name.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    if (existingIds.has(idLower) || existingGithubUrls.has(urlLower)) continue;

    // Skip very small / empty repos (no language, no description)
    if (!repo.language && !repo.description) continue;

    const year = new Date(repo.created_at).getFullYear();
    const tech = [
      ...techFromLanguage(repo.language),
      ...(repo.topics || [])
        .slice(0, 4)
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
    ];
    // Deduplicate tech
    const uniqueTech = [...new Set(tech)];

    base.projects.push({
      id: idLower,
      name: repo.name,
      description: repo.description || `Repository GitHub : ${repo.name}`,
      tech: uniqueTech.length > 0 ? uniqueTech : ["Code"],
      github: repo.html_url,
      live: repo.homepage || "",
      year,
    });
  }

  // Sort projects: most recent first
  base.projects.sort((a, b) => b.year - a.year);

  return base;
}
