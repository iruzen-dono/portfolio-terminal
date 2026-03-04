/* ─────────────────────────────────────────────────────
   Virtual file-system for `ls`, `cd`, `cat`, `pwd`
   ───────────────────────────────────────────────────── */

import type { PortfolioData } from "./data";

export interface FSNode {
  type: "file" | "directory";
  name: string;
  content?: string;
  children?: Record<string, FSNode>;
}

/** Generate the whole virtual filesystem from dynamic portfolio data. */
export function buildFileSystem(data: PortfolioData): FSNode {
  const starLevel = (level: number) => {
    const full = Math.round(level / 20);
    return "★".repeat(full) + "☆".repeat(5 - full);
  };

  return {
    type: "directory",
    name: "~",
    children: {
      "about.md": {
        type: "file",
        name: "about.md",
        content: [
          "# About Me",
          "",
          ...data.bio,
          "",
          `📍 ${data.location}`,
          `📧 ${data.contact.email}`,
        ].join("\n"),
      },
      "resume.txt": {
        type: "file",
        name: "resume.txt",
        content: [
          `${data.name.toUpperCase()} — ${data.title}`,
          "=".repeat(data.name.length + data.title.length + 4),
          "",
          "Experience:",
          ...data.experience.map(
            (e) => `  → ${e.role} @ ${e.company}    (${e.period})`
          ),
          "",
          "Skills: " + data.skills.map((s) => s.name).join(", "),
        ].join("\n"),
      },
      projects: {
        type: "directory",
        name: "projects",
        children: Object.fromEntries(
          data.projects.map((p) => {
            const slug = p.name.toLowerCase().replace(/\s+/g, "-");
            return [
              `${slug}.md`,
              {
                type: "file" as const,
                name: `${slug}.md`,
                content: [
                  `# ${p.name}`,
                  "",
                  p.description,
                  "",
                  `Tech: ${p.tech.join(", ")}`,
                  `GitHub: ${p.github}`,
                ].join("\n"),
              },
            ];
          })
        ),
      },
      skills: {
        type: "directory",
        name: "skills",
        children: (() => {
          // Group skills loosely — put them all in one file when there's no category info
          const allSkills = data.skills
            .map((s) => `  ${starLevel(s.level)}  ${s.name}`)
            .join("\n");
          return {
            "all.txt": {
              type: "file" as const,
              name: "all.txt",
              content: `Skills:\n${allSkills}`,
            },
          };
        })(),
      },
      ".secret": {
        type: "file",
        name: ".secret",
        content: [
          "🎉 You found the secret file!",
          "",
          "Here's a fun fact: This entire portfolio was built as a terminal.",
          "If you're reading this, you clearly know your way around a CLI.",
          "",
          "Try: sudo hire-me",
        ].join("\n"),
      },
    },
  };
}

/* ── Path helpers ──────────────────────────────────── */

export function resolvePath(currentPath: string, target: string): string {
  if (target === "~" || target === "/") return "~";

  if (target === "..") {
    const parts = currentPath.split("/").filter(Boolean);
    if (parts.length <= 1) return "~";
    return parts.slice(0, -1).join("/");
  }

  if (target.startsWith("~/")) return target;
  if (target.startsWith("/")) return "~" + target;

  const base = currentPath === "~" ? "~" : currentPath;
  return `${base}/${target}`;
}

export function getNode(path: string, root: FSNode): FSNode | null {
  if (path === "~") return root;

  const parts = path
    .replace("~/", "")
    .split("/")
    .filter(Boolean);
  let current: FSNode = root;

  for (const part of parts) {
    if (current.type !== "directory" || !current.children?.[part]) {
      return null;
    }
    current = current.children[part];
  }

  return current;
}
