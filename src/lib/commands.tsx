/* ─────────────────────────────────────────────────────
   Command engine – every terminal command lives here.
   Returns React nodes so output can be richly styled.
   ───────────────────────────────────────────────────── */

import React from "react";
import { portfolioData as defaultPortfolioData, type PortfolioData } from "./data";
import { getNode, resolvePath, buildFileSystem, type FSNode } from "./fileSystem";
import { launchConfetti } from "./confetti";
import { type Lang, t } from "./i18n";
import { getAnalytics, getTopCommands } from "./analytics";

/* ── Types ───────────────────────────────────────────── */
export interface CommandResult {
  output: React.ReactNode;
  newPath?: string;
  newTheme?: string;
  clear?: boolean;
  showGUI?: boolean;
  soundToggle?: boolean; // toggle sound on/off
  newLang?: Lang;
}

/* ── ASCII banner ────────────────────────────────────── */
const ASCII_NAME = `
     ██╗██╗   ██╗██╗     ███████╗███████╗
     ██║██║   ██║██║     ██╔════╝██╔════╝
     ██║██║   ██║██║     █████╗  ███████╗
██   ██║██║   ██║██║     ██╔══╝  ╚════██║
╚█████╔╝╚██████╔╝███████╗███████╗███████║
 ╚════╝  ╚═════╝ ╚══════╝╚══════╝╚══════╝
 ╔═══╗╦ ╦╔═══╗╦ ╦
 ╔═══╝╠═╣║   ║║ ║
 ╚═══╝╩ ╩╚═══╝╚═╝  Développeur Full-Stack`;

/* ── Welcome message (shown on load) ─────────────────── */
export function getWelcomeMessage(): React.ReactNode {
  return (
    <div className="animate-fade-in">
      <pre className="text-[var(--prompt)] text-[10px] sm:text-xs leading-tight whitespace-pre">
        {ASCII_NAME}
      </pre>
      <br />
      <p className="text-[var(--text)] opacity-70">
        Welcome to my interactive portfolio terminal.
      </p>
      <p className="text-[var(--text)] opacity-70">
        Type{" "}
        <span className="text-[var(--success)] font-bold">help</span> to
        see available commands.
      </p>
      <p className="text-[var(--text)] opacity-50 text-sm mt-1">
        Tip: Use arrows for history · Tab for autocomplete · Ctrl+L to clear
      </p>
      <br />
    </div>
  );
}

/* ── Autocomplete list ───────────────────────────────── */
export const AVAILABLE_COMMANDS = [
  "help",
  "about",
  "skills",
  "projects",
  "open",
  "experience",
  "contact",
  "theme",
  "gui",
  "neofetch",
  "clear",
  "ls",
  "cd",
  "cat",
  "pwd",
  "whoami",
  "history",
  "welcome",
  "sudo",
  "date",
  "echo",
  "tree",
  "hack",
  "cowsay",
  "fortune",
  "sl",
  "rm",
  "vim",
  "exit",
  "wget",
  "man",
  "matrix",
  "sound",
  "grep",
  "banner",
  "lang",
  "stats",
  "analytics",

];

/* ── Main dispatcher ─────────────────────────────────── */
export function executeCommand(
  input: string,
  currentPath: string,
  history: string[],
  portfolioData?: PortfolioData,
  lang: Lang = "fr"
): CommandResult {
  const data = portfolioData || defaultPortfolioData;
  const fs = buildFileSystem(data);
  const trimmed = input.trim();
  const [cmd, ...args] = trimmed.split(/\s+/);
  const command = cmd?.toLowerCase();

  switch (command) {
    case "help":
      return helpCmd();
    case "about":
      return aboutCmd(data);
    case "skills":
      return skillsCmd(data);
    case "projects":
      return projectsCmd(data);
    case "open":
      return openCmd(args[0], data);
    case "contact":
      return contactCmd(data);
    case "experience":
    case "exp":
      return experienceCmd(data);

    case "theme":
      return themeCmd(args[0]);
    case "clear":
      return { output: null, clear: true };
    case "gui":
      return {
        output: (
          <p className="text-[var(--success)]">Switching to GUI mode...</p>
        ),
        showGUI: true,
      };
    case "ls":
      return lsCmd(currentPath, args[0], fs);
    case "cd":
      return cdCmd(currentPath, args[0], fs);
    case "cat":
      return catCmd(currentPath, args[0], fs);
    case "pwd":
      return {
        output: <p className="text-[var(--text)]">{currentPath}</p>,
      };
    case "whoami":
      return {
        output: (
          <p className="text-[var(--prompt)]">jules@portfolio</p>
        ),
      };
    case "history":
      return historyCmd(history);
    case "welcome":
      return { output: getWelcomeMessage() };
    case "sudo":
      return sudoCmd(args.join(" "));
    case "neofetch":
      return neofetchCmd();
    case "date":
      return {
        output: (
          <p className="text-[var(--text)]">{new Date().toString()}</p>
        ),
      };
    case "echo":
      return {
        output: (
          <p className="text-[var(--text)]">{args.join(" ")}</p>
        ),
      };
    case "tree":
      return treeCmd(currentPath, args[0], fs);
    case "hack":
      return hackCmd();
    case "cowsay":
      return cowsayCmd(args.join(" ") || "Moo! Hire this developer!");
    case "fortune":
      return fortuneCmd();
    case "sl":
      return slCmd();
    case "rm":
      return rmCmd(args);
    case "vim":
    case "nano":
    case "emacs":
      return editorCmd(command);
    case "exit":
      return exitCmd();
    case "wget":
      return wgetCmd(args[0]);
    case "man":
      return manCmd(args[0]);
    case "matrix":
      return {
        output: (
          <p className="text-[var(--success)]">Entering the Matrix...</p>
        ),
        newTheme: "matrix",
      };
    case "sound":
      return soundCmd(args[0]);
    case "grep":
      return grepCmd(currentPath, args, fs);
    case "banner":
      return bannerCmd(args.join(" "));
    case "lang":
      return langCmd(args[0] as Lang | undefined, lang);
    case "stats":
      return statsCmd(data);
    case "analytics":
      return analyticsCmd(lang);
    case "":
    case undefined:
      return { output: null };
    default:
      return {
        output: (
          <p className="text-[var(--error)]">
            command not found: {cmd}. Type{" "}
            <span className="text-[var(--success)]">help</span> for
            available commands.
          </p>
        ),
      };
  }
}

/* ── Individual commands ─────────────────────────────── */

function helpCmd(): CommandResult {
  const cmds: [string, string][] = [
    ["about", "Learn about me"],
    ["skills", "View my technical skills"],
    ["projects", "Browse my projects"],
    ["open <id>", "View project details"],
    ["experience", "Work history"],
    ["contact", "Get my contact info"],
    ["theme <name>", "Switch theme (8 themes!)"],
    ["gui", "Switch to classic GUI mode"],
    ["neofetch", "System info (portfolio style)"],
    ["ls [dir]", "List directory contents"],
    ["cd <dir>", "Change directory"],
    ["cat <file>", "Read file contents"],
    ["tree [dir]", "Show directory tree"],
    ["grep <pat>", "Search files for pattern"],
    ["pwd", "Print working directory"],
    ["whoami", "Current user info"],
    ["history", "Command history"],
    ["banner <txt>", "ASCII art text banner"],
    ["clear", "Clear terminal"],
    ["sound on|off", "Toggle sound effects"],
    ["lang fr|en", "Switch language / Changer la langue"],
    ["stats", "GitHub profile statistics"],
    ["analytics", "Your session analytics"],
    ["man <cmd>", "Manual page for a command"],
    ["hack", "Try it... 👀"],
    ["cowsay <msg>", "🐄"],
    ["fortune", "Random dev wisdom"],
    ["sudo hire-me", "You know what to do"],

  ];

  return {
    output: (
      <div className="animate-fade-in space-y-1">
        <p className="text-[var(--accent)] font-bold text-lg mb-2">
          Available Commands
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
          {cmds.map(([c, d]) => (
            <div key={c} className="flex">
              <span className="text-[var(--success)] w-36 shrink-0 font-mono text-sm">
                {c}
              </span>
              <span className="text-[var(--text)] opacity-70 text-sm">
                {d}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  };
}

function aboutCmd(portfolioData: PortfolioData): CommandResult {
  const { name, title, location, bio } = portfolioData;
  return {
    output: (
      <div className="animate-fade-in space-y-2">
        <pre className="text-[var(--prompt)] text-[10px] sm:text-xs leading-tight whitespace-pre">
          {ASCII_NAME}
        </pre>
        <div className="mt-3 space-y-1">
          <p className="text-[var(--accent)] font-bold text-lg">{name}</p>
          <p className="text-[var(--success)]">{title}</p>
          <p className="text-[var(--text)] opacity-60">
            {location}
          </p>
          <br />
          {bio.map((line, i) => (
            <p key={i} className="text-[var(--text)] opacity-80">
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>
    ),
  };
}

function skillsCmd(portfolioData: PortfolioData): CommandResult {
  const { skills } = portfolioData;
  return {
    output: (
      <div className="animate-fade-in space-y-2">
        <p className="text-[var(--accent)] font-bold text-lg mb-3">
          Technical Skills
        </p>
        <div className="space-y-2 max-w-xl">
          {skills.map((skill, i) => (
            <div
              key={skill.name}
              className="flex items-center gap-3 animate-slide-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="text-[var(--text)] w-36 shrink-0 text-sm">
                {skill.name}
              </span>
              <div className="flex-1 h-3 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full skill-bar"
                  style={{
                    width: `${skill.level}%`,
                    background:
                      "linear-gradient(90deg, var(--prompt), var(--accent))",
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              </div>
              <span className="text-[var(--prompt)] text-sm w-10 text-right font-bold">
                {skill.level}%
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  };
}

function projectsCmd(portfolioData: PortfolioData): CommandResult {
  const { projects } = portfolioData;
  return {
    output: (
      <div className="animate-fade-in space-y-4">
        <p className="text-[var(--accent)] font-bold text-lg">
          Projects
        </p>
        <div className="space-y-4 max-w-2xl">
          {projects.map((p, i) => (
            <div
              key={p.id}
              className="border border-[var(--border)] rounded-lg p-4 animate-slide-in hover:border-[var(--accent)] transition-colors"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[var(--prompt)] font-bold">
                    {p.name}
                  </p>
                  <p className="text-[var(--text)] opacity-70 text-sm mt-1">
                    {p.description}
                  </p>
                </div>
                <span className="text-[var(--text)] opacity-40 text-xs shrink-0">
                  {p.year}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded border border-[var(--accent)] text-[var(--accent)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-[var(--text)] opacity-50 text-xs mt-2">
                Type{" "}
                <span className="text-[var(--success)]">open {p.id}</span>{" "}
                for details
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  };
}

function openCmd(projectId?: string, portfolioData?: PortfolioData): CommandResult {
  if (!projectId) {
    return {
      output: (
        <p className="text-[var(--warning)]">
          Usage: open &lt;project-id&gt; — Type{" "}
          <span className="text-[var(--success)]">projects</span> to see
          IDs.
        </p>
      ),
    };
  }

  const data = portfolioData || defaultPortfolioData;
  const project = data.projects.find((p) => p.id === projectId);
  if (!project) {
    return {
      output: (
        <p className="text-[var(--error)]">
          Project &ldquo;{projectId}&rdquo; not found. Type{" "}
          <span className="text-[var(--success)]">projects</span> to see
          available projects.
        </p>
      ),
    };
  }

  return {
    output: (
      <div className="animate-fade-in border border-[var(--border)] rounded-lg p-5 max-w-2xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📦</span>
          <div>
            <p className="text-[var(--prompt)] font-bold text-lg">
              {project.name}
            </p>
            <p className="text-[var(--text)] opacity-40 text-sm">
              {project.year}
            </p>
          </div>
        </div>
        <p className="text-[var(--text)] opacity-80 mb-4">
          {project.description}
        </p>
        <div className="space-y-2">
          <p className="text-[var(--accent)] font-bold text-sm">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded border border-[var(--accent)] text-[var(--accent)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-1">
          <p className="text-sm">
            <span className="text-[var(--text)] opacity-50">GitHub: </span>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--prompt)] hover:underline"
            >
              {project.github}
            </a>
          </p>
          <p className="text-sm">
            <span className="text-[var(--text)] opacity-50">Live: </span>
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--success)] hover:underline"
            >
              {project.live}
            </a>
          </p>
        </div>
      </div>
    ),
  };
}

function contactCmd(portfolioData: PortfolioData): CommandResult {
  const { contact } = portfolioData;
  const rows: [string, string, string][] = [
    ["📧  Email", contact.email, `mailto:${contact.email}`],
    ["🐙  GitHub", contact.github, contact.github.startsWith("http") ? contact.github : `https://${contact.github}`],
    ...(contact.linkedin
      ? [["💼  LinkedIn", contact.linkedin, `https://${contact.linkedin}`] as [string, string, string]]
      : []),
    ...(contact.twitter
      ? [["🐦  Twitter", contact.twitter, `https://twitter.com/${contact.twitter.replace("@", "")}`] as [string, string, string]]
      : []),
  ];

  return {
    output: (
      <div className="animate-fade-in space-y-3">
        <p className="text-[var(--accent)] font-bold text-lg">Contact</p>
        <div className="space-y-2 border border-[var(--border)] rounded-lg p-4 max-w-md">
          {rows.map(([label, value, href]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-[var(--text)] opacity-50 w-28 shrink-0 text-sm">
                {label}
              </span>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--prompt)] hover:underline text-sm"
              >
                {value}
              </a>
            </div>
          ))}
        </div>
        <p className="text-[var(--text)] opacity-50 text-sm">
          Feel free to reach out — always open to interesting opportunities!
        </p>
      </div>
    ),
  };
}

function experienceCmd(portfolioData: PortfolioData): CommandResult {
  const { experience } = portfolioData;
  return {
    output: (
      <div className="animate-fade-in space-y-4">
        <p className="text-[var(--accent)] font-bold text-lg">
          Work Experience
        </p>
        <div className="space-y-0">
          {experience.map((exp, i) => (
            <div key={i} className="flex animate-slide-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex flex-col items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-[var(--prompt)] mt-1.5 shrink-0" />
                {i < experience.length - 1 && (
                  <div className="w-0.5 flex-1 bg-[var(--border)] mt-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-[var(--prompt)] font-bold">
                  {exp.role}
                </p>
                <p className="text-[var(--accent)]">{exp.company}</p>
                <p className="text-[var(--text)] opacity-40 text-sm">
                  {exp.period}
                </p>
                <p className="text-[var(--text)] opacity-70 text-sm mt-1">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };
}

function themeCmd(theme?: string): CommandResult {
  const valid = ["dark", "light", "matrix", "dracula", "nord", "retro", "cyberpunk", "solarized"];
  if (!theme || !valid.includes(theme)) {
    return {
      output: (
        <div className="animate-fade-in space-y-2">
          <p className="text-[var(--warning)]">
            Usage: theme &lt;name&gt;
          </p>
          <div className="flex flex-wrap gap-2">
            {valid.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded border border-[var(--border)] text-[var(--accent)]">
                {t}
              </span>
            ))}
          </div>
        </div>
      ),
    };
  }
  return {
    output: (
      <p className="text-[var(--success)]">Theme switched to {theme} ✨</p>
    ),
    newTheme: theme,
  };
}

/* ── File-system commands ────────────────────────────── */

function lsCmd(currentPath: string, target: string | undefined, fs: FSNode): CommandResult {
  const path = target ? resolvePath(currentPath, target) : currentPath;
  const node = getNode(path, fs);
  if (!node) {
    return {
      output: (
        <p className="text-[var(--error)]">
          ls: cannot access &lsquo;{target}&rsquo;: No such file or directory
        </p>
      ),
    };
  }
  if (node.type === "file") {
    return { output: <p className="text-[var(--text)]">{node.name}</p> };
  }
  const entries = Object.values(node.children || {});
  return {
    output: (
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {entries.map((e) => (
          <span
            key={e.name}
            className={
              e.type === "directory"
                ? "text-[var(--prompt)] font-bold"
                : "text-[var(--text)]"
            }
          >
            {e.name}
            {e.type === "directory" ? "/" : ""}
          </span>
        ))}
      </div>
    ),
  };
}

function cdCmd(currentPath: string, target: string | undefined, fs: FSNode): CommandResult {
  if (!target || target === "~") return { output: null, newPath: "~" };

  const newPath = resolvePath(currentPath, target);
  const node = getNode(newPath, fs);

  if (!node) {
    return {
      output: (
        <p className="text-[var(--error)]">
          cd: no such directory: {target}
        </p>
      ),
    };
  }
  if (node.type !== "directory") {
    return {
      output: (
        <p className="text-[var(--error)]">
          cd: not a directory: {target}
        </p>
      ),
    };
  }
  return { output: null, newPath };
}

function catCmd(currentPath: string, target: string | undefined, fs: FSNode): CommandResult {
  if (!target) {
    return {
      output: (
        <p className="text-[var(--warning)]">
          Usage: cat &lt;filename&gt;
        </p>
      ),
    };
  }
  const path = resolvePath(currentPath, target);
  const node = getNode(path, fs);
  if (!node) {
    return {
      output: (
        <p className="text-[var(--error)]">
          cat: {target}: No such file or directory
        </p>
      ),
    };
  }
  if (node.type === "directory") {
    return {
      output: (
        <p className="text-[var(--error)]">cat: {target}: Is a directory</p>
      ),
    };
  }
  return {
    output: (
      <pre className="text-[var(--text)] opacity-90 whitespace-pre-wrap text-sm">
        {node.content}
      </pre>
    ),
  };
}

function historyCmd(history: string[]): CommandResult {
  if (history.length === 0) {
    return {
      output: (
        <p className="text-[var(--text)] opacity-50">No history yet.</p>
      ),
    };
  }
  return {
    output: (
      <div className="space-y-0.5">
        {history.map((cmd, i) => (
          <p key={i} className="text-[var(--text)] opacity-70 text-sm">
            <span className="text-[var(--text)] opacity-40 inline-block w-6 text-right mr-3">
              {i + 1}
            </span>
            {cmd}
          </p>
        ))}
      </div>
    ),
  };
}

function sudoCmd(args: string): CommandResult {
  if (args === "hire-me") {
    if (typeof window !== "undefined") launchConfetti(80);
    return {
      output: (
        <div className="animate-fade-in space-y-3">
          <pre className="text-[var(--success)] text-xs sm:text-sm leading-tight whitespace-pre">{`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🎉  ACCESS GRANTED                            ║
║                                                  ║
║   You've unlocked the secret command!            ║
║                                                  ║
║   I'm actively looking for new opportunities!    ║
║   Let's connect:                                 ║
║                                                  ║
║   📧  juleszhou01@gmail.com                      ║
║   🐙  github.com/iruzen-dono                    ║
║                                                  ║
║   Available for:                                 ║
║     ✅  Full-time positions                      ║
║     ✅  Freelance projects                       ║
║     ✅  Open source collaboration                ║
║                                                  ║
╚══════════════════════════════════════════════════╝`}</pre>
        </div>
      ),
    };
  }

  return {
    output: (
      <div className="text-[var(--error)]">
        <p>[sudo] password for jules: ****</p>
        <p>
          Sorry, jules is not in the sudoers file. This incident will be
          reported.
        </p>
      </div>
    ),
  };
}

function neofetchCmd(): CommandResult {
  const ascii = `
      .--.
     |o_o |
     |:_/ |
    //   \\ \\
   (|     | )
  /'\\_   _/\`\\
  \\___)=(___/`;

  return {
    output: (
      <div className="animate-fade-in flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
        <pre className="text-[var(--prompt)] text-xs leading-tight whitespace-pre">
          {ascii}
        </pre>
        <div className="space-y-0.5 text-sm">
          <p className="text-[var(--prompt)] font-bold">
            jules@portfolio
          </p>
          <p className="text-[var(--border)]">
            ─────────────────────
          </p>
          <p>
            <span className="text-[var(--prompt)]">OS:</span>{" "}
            Portfolio Terminal v1.0
          </p>
          <p>
            <span className="text-[var(--prompt)]">Host:</span>{" "}
            Vercel Edge Network
          </p>
          <p>
            <span className="text-[var(--prompt)]">Kernel:</span>{" "}
            Next.js 14
          </p>
          <p>
            <span className="text-[var(--prompt)]">Shell:</span>{" "}
            portfolio-sh 1.0
          </p>
          <p>
            <span className="text-[var(--prompt)]">Theme:</span>{" "}
            Custom Terminal Dark
          </p>
          <p>
            <span className="text-[var(--prompt)]">Terminal:</span>{" "}
            Web-Based PTY
          </p>
          <p>
            <span className="text-[var(--prompt)]">CPU:</span>{" "}
            TypeScript Engine v5
          </p>
          <p>
            <span className="text-[var(--prompt)]">Memory:</span>{" "}
            React 18 VDOM
          </p>
          <div className="flex gap-1 mt-2">
            {[
              "#ff6b6b",
              "#ffd93d",
              "#6bcb77",
              "#4d96ff",
              "#9b59b6",
              "#00d4ff",
              "#ff8c00",
              "#e0e0e0",
            ].map((c) => (
              <div
                key={c}
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
  };
}

/* ── NEW FUN COMMANDS ──────────────────────────────── */

function treeCmd(currentPath: string, target: string | undefined, fs: FSNode): CommandResult {
  const path = target ? resolvePath(currentPath, target) : currentPath;
  const node = getNode(path, fs);
  if (!node) {
    return {
      output: <p className="text-[var(--error)]">tree: &apos;{target}&apos;: No such directory</p>,
    };
  }
  if (node.type === "file") {
    return { output: <p className="text-[var(--text)]">{node.name}</p> };
  }

  const lines: string[] = [];
  function walk(n: NonNullable<typeof node>, prefix: string, isLast: boolean, isRoot: boolean) {
    if (!isRoot) {
      lines.push(`${prefix}${isLast ? "└── " : "├── "}${n.name}${n.type === "directory" ? "/" : ""}`);
    } else {
      lines.push(`${n.name}/`);
    }
    if (n.type === "directory" && n.children) {
      const entries = Object.values(n.children);
      entries.forEach((child, i) => {
        const last = i === entries.length - 1;
        const newPrefix = isRoot ? "" : `${prefix}${isLast ? "    " : "│   "}`;
        walk(child, newPrefix, last, false);
      });
    }
  }
  walk(node, "", true, true);

  return {
    output: (
      <pre className="text-[var(--text)] opacity-90 whitespace-pre text-sm animate-fade-in">
        {lines.join("\n")}
      </pre>
    ),
  };
}

function hackCmd(): CommandResult {
  const hackLines = [
    "$ ssh root@mainframe.corp ...",
    "[*] Bypassing firewall ███████░░░ 78%",
    "[*] Injecting payload into kernel...",
    "[*] Decrypting RSA-4096 ████████████ 100%",
    "[*] Accessing /etc/shadow...",
    "[!] ROOT ACCESS GRANTED",
    "[*] Downloading classified files...",
    "    secret_project_v2.pdf   [OK]",
    "    employee_salaries.xlsx  [OK]",
    "    launch_codes.txt        [OK]",
    "",
    "Just kidding 😄 — but you clearly have good hacker instincts!",
    "Maybe type 'contact' to reach out for real?",
  ];

  return {
    output: (
      <div className="animate-fade-in space-y-0.5">
        {hackLines.map((line, i) => (
          <p
            key={i}
            className={`text-sm font-mono animate-slide-in ${
              line.startsWith("[!]")
                ? "text-[var(--error)] font-bold glitch-text"
                : line.startsWith("[*]")
                ? "text-[var(--success)]"
                : line.startsWith("Just")
                ? "text-[var(--warning)] mt-2"
                : "text-[var(--text)] opacity-70"
            }`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {line || "\u00A0"}
          </p>
        ))}
      </div>
    ),
  };
}

function cowsayCmd(message: string): CommandResult {
  const max = 40;
  const lines: string[] = [];
  const words = message.split(" ");
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > max) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) lines.push(current);

  const width = Math.max(...lines.map((l) => l.length));
  const border = "─".repeat(width + 2);
  const padded = lines.map((l) => `│ ${l.padEnd(width)} │`);

  const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

  const bubble = [`┌${border}┐`, ...padded, `└${border}┘`].join("\n");

  return {
    output: (
      <pre className="text-[var(--text)] text-sm whitespace-pre animate-fade-in">
        {bubble}
        {cow}
      </pre>
    ),
  };
}

const FORTUNES = [
  "A good programmer looks both ways before crossing a one-way street.",
  "There are only 10 types of people: those who understand binary and those who don't.",
  "// This code works. I don't know why.",
  "It works on my machine ¯\\_(ツ)_/¯",
  "Debugging is like being a detective in a crime movie where you're also the murderer.",
  "The best code is no code at all.",
  "Talk is cheap. Show me the code. — Linus Torvalds",
  "First, solve the problem. Then, write the code. — John Johnson",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "!false — It's funny because it's true.",
  "Programming is 10% writing code and 90% understanding why it doesn't work.",
  "There's no place like 127.0.0.1",
  "To understand recursion, you must first understand recursion.",
  "99 bugs in the code. Fix one → 127 bugs in the code.",
  "The only way to learn a new language is by writing programs in it. — Dennis Ritchie",
];

function fortuneCmd(): CommandResult {
  const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  return {
    output: (
      <div className="animate-fade-in">
        <p className="text-[var(--accent)] text-sm italic border-l-2 border-[var(--accent)] pl-3 py-1">
          {fortune}
        </p>
      </div>
    ),
  };
}

function slCmd(): CommandResult {
  const train = `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  |  .----|  |  ||  |  |      \\_/   |      |       |
  | /     \\  |  || _|__|__/  ,---.  |------|       |
  |/       |_|  ||/     |__/     \\  |      |       |
   \\_/      \\__/  \\__/      \\     \\ |      \\-------/
                             \\_____\\|___\\-/
                              \\     /
`;

  return {
    output: (
      <div className="overflow-hidden">
        <pre className="text-[var(--text)] text-xs whitespace-pre train-animation">
          {train}
        </pre>
        <p className="text-[var(--warning)] text-sm mt-2 animate-fade-in" style={{ animationDelay: "4s" }}>
          🚂 You meant &apos;ls&apos;, didn&apos;t you?
        </p>
      </div>
    ),
  };
}

function rmCmd(args: string[]): CommandResult {
  const joined = args.join(" ");
  if (joined.includes("-rf") && joined.includes("/")) {
    return {
      output: (
        <div className="animate-fade-in space-y-2">
          <p className="text-[var(--error)] font-bold">
            🚨 SYSTEM ALERT 🚨
          </p>
          <p className="text-[var(--error)]">
            rm: cannot remove &apos;/&apos;: Permission denied
          </p>
          <p className="text-[var(--text)] opacity-60 text-sm mt-2">
            Nice try! This portfolio is indestructible 💪
          </p>
          <p className="text-[var(--text)] opacity-40 text-sm">
            (No files were harmed in the making of this Easter egg)
          </p>
        </div>
      ),
    };
  }
  return {
    output: (
      <p className="text-[var(--error)]">
        rm: operation not permitted in portfolio mode
      </p>
    ),
  };
}

function editorCmd(editor: string): CommandResult {
  const messages: Record<string, string[]> = {
    vim: [
      "Opening vim...",
      "",
      "~",
      "~",
      "~  How do I exit vim??",
      "~",
      "~  (hint: try :q! ... or just close the tab 😅)",
      "~",
    ],
    nano: [
      "nano: This is a web terminal, not a real one!",
      "But I appreciate the effort. Try 'cat' instead.",
    ],
    emacs: [
      "emacs: let me just load 2GB of Lisp extensions...",
      "...",
      "Just kidding. Try 'about' to learn about me!",
    ],
  };

  return {
    output: (
      <pre className="text-[var(--text)] text-sm whitespace-pre animate-fade-in">
        {(messages[editor] || messages.vim).join("\n")}
      </pre>
    ),
  };
}

function exitCmd(): CommandResult {
  return {
    output: (
      <div className="animate-fade-in space-y-2">
        <p className="text-[var(--warning)]">
          logout: There is no escape from this portfolio! 😈
        </p>
        <p className="text-[var(--text)] opacity-60 text-sm">
          But seriously, thanks for visiting. Type &apos;contact&apos; if
          you want to connect!
        </p>
      </div>
    ),
  };
}

function wgetCmd(target?: string): CommandResult {
  if (!target) {
    return {
      output: (
        <p className="text-[var(--warning)]">
          Usage: wget resume
        </p>
      ),
    };
  }

  if (target === "resume" || target === "cv") {
    return {
      output: (
        <div className="animate-fade-in space-y-1">
          <p className="text-[var(--text)] text-sm">
            --{new Date().toISOString()}-- https://iruzen-dono.dev/resume.pdf
          </p>
          <p className="text-[var(--text)] text-sm">
            Resolving iruzen-dono.dev... 76.76.21.21
          </p>
          <p className="text-[var(--text)] text-sm">
            HTTP request sent, awaiting response... 200 OK
          </p>
          <p className="text-[var(--text)] text-sm">
            Length: 245,760 (240K) [application/pdf]
          </p>
          <p className="text-[var(--success)] text-sm mt-1">
            ████████████████████████████████████████ 100% 2.4MB/s
          </p>
          <p className="text-[var(--text)] opacity-60 text-sm mt-2">
            📄 &apos;resume.pdf&apos; saved (this is a simulation — add your
            real resume link in data.ts!)
          </p>
        </div>
      ),
    };
  }

  return {
    output: (
      <p className="text-[var(--error)]">
        wget: unable to resolve host: {target}
      </p>
    ),
  };
}

function manCmd(command?: string): CommandResult {
  const manPages: Record<string, { desc: string; usage: string; details: string }> = {
    about:     { desc: "Display portfolio owner information", usage: "about", details: "Shows name, title, location, and biography." },
    skills:    { desc: "Display technical skills with proficiency bars", usage: "skills", details: "Lists all technical skills with animated progress bars showing proficiency level." },
    projects:  { desc: "List all portfolio projects", usage: "projects", details: "Shows all projects with descriptions and tech stacks. Use 'open <id>' for details." },
    theme:     { desc: "Change the terminal color theme", usage: "theme <dark|light|matrix|dracula|nord|retro|cyberpunk|solarized>", details: "Switches the entire UI color scheme. Changes persist during the session." },
    hack:      { desc: "Simulate a hacking sequence", usage: "hack", details: "Displays a fun fake hacking animation. No actual systems are harmed." },
    cowsay:    { desc: "Generate an ASCII cow with a message", usage: "cowsay <message>", details: "A tribute to the classic Unix cowsay utility." },
    fortune:   { desc: "Display a random programming quote", usage: "fortune", details: "Shows a random developer-related joke or wisdom." },
    tree:      { desc: "Display directory structure as a tree", usage: "tree [directory]", details: "Recursively lists directory contents in a tree format." },
    grep:      { desc: "Search file contents for a pattern", usage: "grep <pattern> [file]", details: "Searches the virtual filesystem for matching text." },
    banner:    { desc: "Display large ASCII text banner", usage: "banner <text>", details: "Converts text to large ASCII block letters." },
    sound:     { desc: "Toggle sound effects", usage: "sound on|off", details: "Enables or disables keyboard and command sound effects." },
  };

  if (!command) {
    return {
      output: (
        <p className="text-[var(--warning)]">
          Usage: man &lt;command&gt; — e.g. man theme
        </p>
      ),
    };
  }

  const page = manPages[command];
  if (!page) {
    return {
      output: (
        <p className="text-[var(--error)]">
          No manual entry for {command}
        </p>
      ),
    };
  }

  return {
    output: (
      <div className="animate-fade-in border border-[var(--border)] rounded-lg p-4 max-w-xl space-y-3">
        <p className="text-[var(--prompt)] font-bold text-lg uppercase">
          {command}(1) — Portfolio Manual
        </p>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-[var(--accent)] font-bold">NAME</span>
            <p className="text-[var(--text)] opacity-80 ml-4">{command} — {page.desc}</p>
          </div>
          <div>
            <span className="text-[var(--accent)] font-bold">SYNOPSIS</span>
            <p className="text-[var(--success)] ml-4 font-mono">{page.usage}</p>
          </div>
          <div>
            <span className="text-[var(--accent)] font-bold">DESCRIPTION</span>
            <p className="text-[var(--text)] opacity-80 ml-4">{page.details}</p>
          </div>
        </div>
      </div>
    ),
  };
}

function soundCmd(toggle?: string): CommandResult {
  if (toggle !== "on" && toggle !== "off") {
    return {
      output: (
        <p className="text-[var(--warning)]">
          Usage: sound on | sound off
        </p>
      ),
    };
  }
  return {
    output: (
      <p className="text-[var(--success)]">
        Sound effects {toggle === "on" ? "enabled 🔊" : "disabled 🔇"}
      </p>
    ),
    soundToggle: toggle === "on",
  };
}

function grepCmd(currentPath: string, args: string[], fs: FSNode): CommandResult {
  if (args.length === 0) {
    return {
      output: (
        <p className="text-[var(--warning)]">
          Usage: grep &lt;pattern&gt; [file]
        </p>
      ),
    };
  }

  const pattern = args[0].toLowerCase();
  const targetFile = args[1];
  const results: { file: string; line: string }[] = [];

  function searchNode(node: FSNode, path: string) {
    if (node.type === "file" && node.content) {
      if (targetFile && !path.endsWith(targetFile)) return;
      const lines = node.content.split("\n");
      for (const line of lines) {
        if (line.toLowerCase().includes(pattern)) {
          results.push({ file: path, line: line.trim() });
        }
      }
    }
    if (node.type === "directory" && node.children) {
      for (const child of Object.values(node.children)) {
        searchNode(child, `${path}/${child.name}`);
      }
    }
  }

  const startNode = getNode(currentPath, fs) || fs;
  searchNode(startNode, currentPath);

  if (results.length === 0) {
    return {
      output: (
        <p className="text-[var(--text)] opacity-50">
          No matches found for &apos;{pattern}&apos;
        </p>
      ),
    };
  }

  return {
    output: (
      <div className="space-y-0.5 animate-fade-in">
        {results.slice(0, 20).map((r, i) => (
          <p key={i} className="text-sm">
            <span className="text-[var(--accent)]">{r.file}:</span>{" "}
            <span className="text-[var(--text)] opacity-80">
              {r.line.replace(
                new RegExp(`(${pattern})`, "gi"),
                "【$1】"
              ).split(/【|】/).map((part, j) =>
                j % 2 === 1 ? (
                  <span key={j} className="text-[var(--error)] font-bold">{part}</span>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </span>
          </p>
        ))}
        {results.length > 20 && (
          <p className="text-[var(--text)] opacity-40 text-sm mt-1">
            ...and {results.length - 20} more matches
          </p>
        )}
      </div>
    ),
  };
}

function bannerCmd(text: string): CommandResult {
  if (!text) {
    return {
      output: <p className="text-[var(--warning)]">Usage: banner &lt;text&gt;</p>,
    };
  }

  const alphabet: Record<string, string[]> = {
    A: ["  █  ", " █ █ ", "█████", "█   █", "█   █"],
    B: ["████ ", "█   █", "████ ", "█   █", "████ "],
    C: [" ████", "█    ", "█    ", "█    ", " ████"],
    D: ["████ ", "█   █", "█   █", "█   █", "████ "],
    E: ["█████", "█    ", "████ ", "█    ", "█████"],
    F: ["█████", "█    ", "████ ", "█    ", "█    "],
    G: [" ████", "█    ", "█  ██", "█   █", " ████"],
    H: ["█   █", "█   █", "█████", "█   █", "█   █"],
    I: ["█████", "  █  ", "  █  ", "  █  ", "█████"],
    J: ["█████", "   █ ", "   █ ", "█  █ ", " ██  "],
    K: ["█  █ ", "█ █  ", "██   ", "█ █  ", "█  █ "],
    L: ["█    ", "█    ", "█    ", "█    ", "█████"],
    M: ["█   █", "██ ██", "█ █ █", "█   █", "█   █"],
    N: ["█   █", "██  █", "█ █ █", "█  ██", "█   █"],
    O: [" ███ ", "█   █", "█   █", "█   █", " ███ "],
    P: ["████ ", "█   █", "████ ", "█    ", "█    "],
    Q: [" ███ ", "█   █", "█ █ █", "█  █ ", " ██ █"],
    R: ["████ ", "█   █", "████ ", "█ █  ", "█  █ "],
    S: [" ████", "█    ", " ███ ", "    █", "████ "],
    T: ["█████", "  █  ", "  █  ", "  █  ", "  █  "],
    U: ["█   █", "█   █", "█   █", "█   █", " ███ "],
    V: ["█   █", "█   █", "█   █", " █ █ ", "  █  "],
    W: ["█   █", "█   █", "█ █ █", "██ ██", "█   █"],
    X: ["█   █", " █ █ ", "  █  ", " █ █ ", "█   █"],
    Y: ["█   █", " █ █ ", "  █  ", "  █  ", "  █  "],
    Z: ["█████", "   █ ", "  █  ", " █   ", "█████"],
    " ": ["     ", "     ", "     ", "     ", "     "],
    "!": ["  █  ", "  █  ", "  █  ", "     ", "  █  "],
    "?": [" ███ ", "█   █", "  ██ ", "     ", "  █  "],
  };

  const chars = text.toUpperCase().split("");
  const rows: string[] = ["", "", "", "", ""];
  for (const ch of chars) {
    const glyph = alphabet[ch] || alphabet["?"];
    for (let r = 0; r < 5; r++) {
      rows[r] += glyph[r] + " ";
    }
  }

  return {
    output: (
      <pre className="text-[var(--prompt)] text-xs sm:text-sm whitespace-pre animate-fade-in leading-tight">
        {rows.join("\n")}
      </pre>
    ),
  };
}

/* ── lang ─────────────────────────────────────────────── */
function langCmd(target: Lang | undefined, currentLang: Lang): CommandResult {
  if (!target || !["fr", "en"].includes(target)) {
    return {
      output: (
        <div className="animate-fade-in space-y-1">
          <p className="text-[var(--text)] opacity-70">{t("langUsage", currentLang)}</p>
          <p className="text-[var(--text)] opacity-50 text-sm">
            Current: <span className="text-[var(--success)]">{currentLang}</span>
          </p>
        </div>
      ),
    };
  }
  return {
    output: (
      <p className="text-[var(--success)] animate-fade-in">{t("langSwitched", target)}</p>
    ),
    newLang: target,
  };
}

/* ── stats (GitHub profile) ──────────────────────────── */
function statsCmd(data: PortfolioData): CommandResult {
  const gh = data.contact.github;
  const username = gh ? gh.replace("https://github.com/", "") : "";

  /* Gather data already available from portfolioData */
  const projects = data.projects || [];
  const skills = data.skills || [];

  /* Group skills by category */
  const skillsByCategory: Record<string, string[]> = {};
  skills.forEach((s) => {
    const cat = s.category || "other";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s.name);
  });

  /* Build a language-like breakdown from skills tagged as "language" */
  const langs = skillsByCategory["language"] || [];

  return {
    output: (
      <div className="animate-fade-in space-y-2">
        <p className="text-[var(--accent)] font-bold text-lg">
          📊 GitHub Stats — {username || data.name}
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <span className="text-[var(--text)] opacity-60">Username</span>
          <span className="text-[var(--prompt)]">{username || "N/A"}</span>
          <span className="text-[var(--text)] opacity-60">Public repos</span>
          <span className="text-[var(--success)]">{projects.length}</span>
          <span className="text-[var(--text)] opacity-60">Skills</span>
          <span className="text-[var(--text)]">{skills.length}</span>
          <span className="text-[var(--text)] opacity-60">Languages</span>
          <span className="text-[var(--text)]">{langs.join(", ") || "—"}</span>
        </div>
        {gh && (
          <p className="text-sm mt-2">
            <span className="text-[var(--text)] opacity-50">→ </span>
            <a
              href={gh}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline hover:opacity-80"
            >
              {gh}
            </a>
          </p>
        )}
        {projects.length > 0 && (
          <div className="mt-2">
            <p className="text-[var(--success)] font-bold text-sm mb-1">Repositories</p>
            {projects.map((p, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-[var(--prompt)]">•</span>
                <span className="text-[var(--text)]">{p.name}</span>
                <span className="text-[var(--text)] opacity-40">
                  {p.tech.slice(0, 3).join(", ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
  };
}

/* ── analytics (local session analytics) ─────────────── */
function analyticsCmd(lang: Lang): CommandResult {
  const data = getAnalytics();
  const top = getTopCommands(8);
  const maxCount = top.length > 0 ? top[0][1] : 1;

  const since = data.firstVisit
    ? new Date(data.firstVisit).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")
    : "—";

  return {
    output: (
      <div className="animate-fade-in space-y-2">
        <p className="text-[var(--accent)] font-bold text-lg">
          📈 {lang === "fr" ? "Analytique de session" : "Session Analytics"}
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <span className="text-[var(--text)] opacity-60">Sessions</span>
          <span className="text-[var(--success)]">{data.sessions}</span>
          <span className="text-[var(--text)] opacity-60">
            {lang === "fr" ? "Commandes exécutées" : "Commands executed"}
          </span>
          <span className="text-[var(--success)]">{data.totalCommands}</span>
          <span className="text-[var(--text)] opacity-60">
            {lang === "fr" ? "Depuis" : "Since"}
          </span>
          <span className="text-[var(--text)]">{since}</span>
        </div>
        {top.length > 0 && (
          <div className="mt-2">
            <p className="text-[var(--success)] font-bold text-sm mb-1">
              {lang === "fr" ? "Top commandes" : "Top commands"}
            </p>
            {top.map(([cmd, count]) => {
              const bar = "█".repeat(Math.max(1, Math.round((count / maxCount) * 12)));
              return (
                <div key={cmd} className="flex gap-2 text-sm font-mono">
                  <span className="text-[var(--prompt)] w-20 shrink-0">{cmd}</span>
                  <span className="text-[var(--accent)]">{bar}</span>
                  <span className="text-[var(--text)] opacity-50">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    ),
  };
}
