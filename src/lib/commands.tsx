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
import { CommandLink } from "@/components/CommandLink";

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
╚═══╝╠═╣║   ║║ ║
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
  "github",
  "gh",
  "resume",
  "cv",
  "weather",
  "meteo",
  "calc",
  "calculator",
  "google",
  "youtube",
  "wiki",
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
  // Strip leading / for slash-command syntax
  const [cmd, ...args] = trimmed.replace(/^\//, "").split(/\s+/);
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
          return whoamiCmd(data);
    case "history":
      return historyCmd(history);
    case "welcome":
      return { output: getWelcomeMessage() };
    case "sudo":
      return sudoCmd(args.join(" "));
    case "neofetch":
      return neofetchCmd();
    case "date":
          return dateCmd(lang);
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
        case "github":
        case "gh":
          return githubCmd(data);
        case "resume":
        case "cv":
          return resumeCmd();
        case "weather":
            case "meteo":
              return weatherCmd(lang);
            case "calc":
            case "calculator":
              return calcCmd(args.join(" "));
            case "google":
              return searchCmd("https://www.google.com/search?q=", args.join("+"));
            case "youtube":
            case "yt":
              return searchCmd("https://www.youtube.com/results?search_query=", args.join("+"));
            case "wiki":
            case "wikipedia":
              return searchCmd("https://en.wikipedia.org/wiki/", args.join("_"));
        case "":
    case undefined:
      return { output: null };
    default:
      const fuzzy = fuzzySuggest(cmd || "", 3);
      return {
        output: (
          <p className="text-[var(--error)] text-sm">
            command not found: /{cmd}. Type{" "}
            <CommandLink command="/help" variant="success">/help</CommandLink> for
            available commands.
            {fuzzy.length > 0 && fuzzy[0] !== `/${cmd}` && (
              <span className="block text-[var(--text-dim)] text-xs mt-1">
                Did you mean{" "}
                <CommandLink command={fuzzy[0]} variant="prompt">
                  {fuzzy[0]}
                </CommandLink>
                ?
              </span>
            )}
          </p>
        ),
      };
  }
}

/* ── Individual commands ─────────────────────────────── */

function helpCmd(): CommandResult {
  const cmds: [string, string][] = [
    ["/about", "Learn about me"],
    ["/skills", "View my technical skills"],
    ["/projects", "Browse my projects"],
    ["/open <id>", "View project details"],
    ["/experience", "Work history"],
    ["/contact", "Get my contact info"],
    ["/theme <name>", "Switch theme (dark / light / terminal)"],
    ["/gui", "Switch to GUI mode"],
    ["/stats", "GitHub profile + portfolio stats"],
    ["/github", "List repos with stars and language"],
    ["/resume", "Download my resume / CV"],
    ["/weather", "Current weather in Lome"],
    ["/neofetch", "System info (portfolio style)"],
    ["/ls [dir]", "List directory contents"],
    ["/cd <dir>", "Change directory"],
    ["/cat <file>", "Read file contents"],
    ["/tree [dir]", "Show directory tree"],
    ["/grep <pat>", "Search files for pattern"],
    ["/pwd", "Print working directory"],
    ["/whoami", "Current user info"],
    ["/history", "Command history"],
    ["/banner <txt>", "ASCII art text banner"],
    ["/clear", "Clear terminal"],
    ["/sound on|off", "Toggle sound effects"],
    ["/lang fr|en", "Switch language / Changer la langue"],
    ["/analytics", "Your session analytics"],
    ["/man <cmd>", "Manual page for a command"],
    ["/date", "Show current date and time"],
    ["/echo <msg>", "Print a message"],
    ["/calc <expr>", "Evaluate a math expression"],
    ["/google <q>", "Search Google"],
    ["/youtube <q>", "Search YouTube"],
    ["/wiki <q>", "Search Wikipedia"],
    ["/hack", "Try it..."],
    ["/cowsay <msg>", "Moo!"],
    ["/fortune", "Random dev wisdom"],
    ["/sudo hire-me", "You know what to do"],
  ];

  return {
    output: (
      <div className="animate-fade-in space-y-1">
        <p className="text-[var(--accent)] font-bold text-lg mb-2">
          Available Commands
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
          {cmds.map(([c, d]) => {
            const cmdName = c.split(" ")[0]; // extract "/about" from "/about" or "/open <id>"
            return (
              <div key={c} className="flex items-baseline gap-2">
                <CommandLink command={cmdName} variant="success" className="w-36 shrink-0 font-mono text-sm">
                  {c}
                </CommandLink>
                <span className="text-[var(--text)] opacity-70 text-sm">
                  {d}
                </span>
              </div>
            );
          })}
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
                <CommandLink command={`open ${p.id}`} variant="success">
                  open {p.id}
                </CommandLink>{" "}
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
          <CommandLink command="/projects" variant="success">/projects</CommandLink> to see
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
            <CommandLink command="/projects" variant="success">/projects</CommandLink> to see
            available projects.
          </p>
        ),
    };
  }

  /* ── Project type badge ── */
  const typeBadge = (() => {
    if (project.id === "xearn") return { label: "Mobile + Web", color: "text-[var(--accent)]" };
    if (project.tech.some(t => t.includes("React Native") || t.includes("Expo"))) return { label: "Mobile", color: "text-[var(--success)]" };
    if (project.tech.some(t => t.includes("Next") || t.includes("React"))) return { label: "Web App", color: "text-[var(--prompt)]" };
    if (project.tech.some(t => t.includes("Java") || t.includes("Kotlin") || t.includes("KMP"))) return { label: "Desktop", color: "text-[var(--text-dim)]" };
    return null;
  })();

  return {
    output: (
      <div className="animate-fade-in max-w-2xl">
        {/* Main card with subtle glow */}
        <div className="relative group">
          {/* Glow border effect */}
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-[var(--prompt)]/10 via-transparent to-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
          
          <div className="relative border border-[var(--border)] rounded-xl bg-[var(--surface)] overflow-hidden hover:border-[var(--prompt)]/30 transition-colors duration-300">
            
            {/* Image header */}
            {project.image && (
              <div className="border-b border-[var(--border)] overflow-hidden bg-[var(--terminal-bg)] max-h-56">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-44 sm:h-52 object-cover block opacity-90 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}

            {/* Content */}
            <div className="p-5 sm:p-6">
              {/* Header: name + year + badge */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[var(--prompt)] font-bold text-xl glow-text-subtle">
                    {project.name}
                  </span>
                  {typeBadge && (
                    <span className={`text-[10px] uppercase tracking-widest ${typeBadge.color} border border-current/30 px-2 py-0.5 rounded-full font-semibold`}>
                      {typeBadge.label}
                    </span>
                  )}
                </div>
                <span className="text-[var(--text-dim)] text-xs font-mono shrink-0 mt-1">
                  {project.year}
                </span>
              </div>

              {/* Description */}
              <p className="text-[var(--text)] opacity-85 text-sm leading-relaxed mb-5">
                {project.description}
              </p>

              {/* Tech Stack — beautiful badges */}
              <div className="mb-5">
                <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-widest mb-2 font-semibold">
                  Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => {
                    /* Colour-code tech badges */
                    const isRuntime = ["Next.js", "React", "Laravel", "Spring Boot", "NestJS", "Ktor"].includes(t);
                    const isLang = ["TypeScript", "JavaScript", "Python", "PHP", "Java", "Kotlin", "CSS", "HTML"].includes(t);
                    const isDB = ["PostgreSQL", "MySQL", "SQLite", "Neon"].includes(t);
                    const isTool = ["Docker", "Git", "Redis", "TailwindCSS"].includes(t);
                    const color = isRuntime ? "var(--prompt)" : isLang ? "var(--accent)" : isDB ? "var(--success)" : isTool ? "var(--text-dim)" : "var(--text-secondary)";
                    
                    return (
                      <span
                        key={t}
                        className="text-[11px] px-2.5 py-1 rounded-md font-mono border"
                        style={{
                          borderColor: color,
                          color: color,
                          background: `${color}08`,
                        }}
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--border)]">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-[var(--border)] text-[var(--text)] hover:text-[var(--prompt)] hover:border-[var(--prompt)] transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/>
                    </svg>
                    Source
                  </a>
                )}
                {project.live && project.live !== project.github && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--terminal-bg)] transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Live Demo
                  </a>
                )}
                <CommandLink command="/projects" variant="dim" className="text-xs ml-auto self-center">
                  ← All projects
                </CommandLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  };
}

function contactCmd(portfolioData: PortfolioData): CommandResult {
  const { contact } = portfolioData;
  const rows: [string, string, string][] = [
    ["Email", contact.email, `mailto:${contact.email}`],
    ["GitHub", contact.github, contact.github.startsWith("http") ? contact.github : `https://${contact.github}`],
    ...(contact.linkedin
      ? [["LinkedIn", contact.linkedin, `https://${contact.linkedin}`] as [string, string, string]]
      : []),
    ...(contact.twitter
      ? [["X", contact.twitter, `https://twitter.com/${contact.twitter.replace("@", "")}`] as [string, string, string]]
      : []),
  ];

  return {
    output: (
      <div className="animate-fade-in space-y-3">
        <p className="text-[var(--prompt)] font-bold text-lg">Contact</p>
        <div className="space-y-1 max-w-md">
          {rows.map(([label, value, href]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-[var(--text-dim)] w-20 shrink-0 text-sm uppercase tracking-wider">
                {label}
              </span>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text)] hover:text-[var(--prompt)] transition-colors text-sm"
              >
                {value}
              </a>
            </div>
          ))}
        </div>
        <p className="text-[var(--text-dim)] text-sm">
          toujours ouvert aux opportunites interessantes.
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
  const valid = ["dark", "light", "terminal"];
  if (!theme || !valid.includes(theme)) {
    return {
      output: (
        <div className="animate-fade-in space-y-2">
          <p className="text-[var(--text-dim)] uppercase tracking-wider text-sm">
            Usage: theme &lt;name&gt;
          </p>
          <div className="flex flex-wrap gap-2">
            {valid.map((t) => (
              <span key={t} className="text-xs px-2 py-1 border border-[var(--border)] text-[var(--text)]">
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
      <p className="text-[var(--text)]">Theme switched to {theme}</p>
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
          <pre className="text-[var(--prompt)] text-xs sm:text-sm leading-tight whitespace-pre">{`
╔════════════════════════════════════════════╗
║                                            ║
║   ACCESS GRANTED                           ║
║                                            ║
║   I am actively looking for                ║
║   new opportunities!                       ║
║                                            ║
║   juleszhou01@gmail.com                    ║
║   github.com/iruzen-dono                   ║
║                                            ║
║   Available for:                           ║
║     Full-time positions                    ║
║     Freelance projects                     ║
║     Open source collaboration              ║
║                                            ║
╚════════════════════════════════════════════╝`}</pre>
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
              "#ffffff",
              "#cccccc",
              "#999999",
              "#666666",
              "#333333",
              "#222222",
              "#111111",
              "#000000",
            ].map((c) => (
              <div
                key={c}
                className="w-4 h-4 border border-[var(--border)]"
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
    "Just kidding — but you clearly have good hacker instincts!",
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
        <p className="text-[var(--text-dim)] text-sm mt-2 animate-fade-in" style={{ animationDelay: "4s" }}>
          You meant 'ls', didn't you?
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
            SYSTEM ALERT
          </p>
          <p className="text-[var(--error)]">
            rm: cannot remove '/': Permission denied
          </p>
          <p className="text-[var(--text-dim)] text-sm mt-2">
            Nice try! This portfolio is indestructible.
          </p>
          <p className="text-[var(--text-dim)] text-sm">
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
      "~  (hint: try :q! ... or just close the tab)",
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
        <p className="text-[var(--text-secondary)]">
          logout: There is no escape from this portfolio!
        </p>
        <p className="text-[var(--text-dim)] text-sm">
          Thanks for visiting. Type 'contact' if you want to connect.
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
          <p className="text-[var(--text-dim)] text-sm mt-2">
            'resume.pdf' saved (this is a simulation — add your
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
        <p className="text-[var(--text-dim)] text-sm uppercase tracking-wider">
          Usage: sound on | sound off
        </p>
      ),
    };
  }
  return {
    output: (
      <p className="text-[var(--text)]">
        Sound effects {toggle === "on" ? "enabled" : "disabled"}
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

/* ── stats (GitHub profile + portfolio stats) ─────────── */
function statsCmd(data: PortfolioData): CommandResult {
  const gh = data.contact.github;
  const username = gh ? gh.replace("https://github.com/", "") : "";
  const profile = data.githubProfile;
  const projects = data.projects || [];
  const hasGitHub = profile && profile.followers > 0;
  const byStars = [...projects].filter((p) => p.github).slice(0, 5);

  return {
    output: (
      <div className="animate-fade-in space-y-3">
        <p className="text-[var(--prompt)] font-bold text-lg">
          Stats — {username || data.name}
        </p>
        {hasGitHub ? (
          <div className="grid grid-cols-3 gap-4 text-sm border border-[var(--border)] p-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text)]">{profile!.followers}</p>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-dim)]">Followers</p>
            </div>
            <div className="text-center border-x border-[var(--border)]">
              <p className="text-2xl font-bold text-[var(--text)]">{profile!.following}</p>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-dim)]">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text)]">{profile!.totalStars}</p>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-dim)]">Stars</p>
            </div>
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <span className="text-[var(--text-dim)]">Public repos</span>
          <span className="text-[var(--text)]">{profile?.publicRepos || projects.length}</span>
          <span className="text-[var(--text-dim)]">Skills</span>
          <span className="text-[var(--text)]">{data.skills.length}</span>
        </div>
        {byStars.length > 0 && (
          <div>
            <p className="text-[var(--text)] font-bold text-xs uppercase tracking-widest mb-1.5 mt-1">Top repos</p>
            {byStars.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-xs py-0.5">
                <span className="text-[var(--text-dim)] w-4 text-right">{i + 1}</span>
                <span className="text-[var(--text)] truncate font-mono">{p.name}</span>
                <span className="text-[var(--text-dim)] text-[10px] ml-auto shrink-0">{p.tech.slice(0, 2).join(", ")}</span>
              </div>
            ))}
          </div>
        )}
        {gh && (
          <p className="text-xs">
            <a href={gh} target="_blank" rel="noopener noreferrer"
               className="text-[var(--text-dim)] hover:text-[var(--text)] underline underline-offset-2">{gh}</a>
          </p>
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
        <p className="text-[var(--prompt)] font-bold text-lg">
          {lang === "fr" ? "Analytique de session" : "Session Analytics"}
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <span className="text-[var(--text-dim)]">Sessions</span>
          <span className="text-[var(--text)]">{data.sessions}</span>
          <span className="text-[var(--text-dim)]">
            {lang === "fr" ? "Commandes executees" : "Commands executed"}
          </span>
          <span className="text-[var(--text)]">{data.totalCommands}</span>
          <span className="text-[var(--text-dim)]">
            {lang === "fr" ? "Depuis" : "Since"}
          </span>
          <span className="text-[var(--text-secondary)]">{since}</span>
        </div>
        {top.length > 0 && (
          <div className="mt-2">
            <p className="text-[var(--text)] font-bold text-sm mb-1">
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

/* ── whoami — full profile ────────────────────────────── */
function whoamiCmd(data: PortfolioData): CommandResult {
  return {
    output: (
      <div className="animate-fade-in space-y-0.5 text-sm">
        <p className="text-[var(--prompt)] font-bold">{data.name}</p>
        <p className="text-[var(--text)]">{data.title}</p>
        <p className="text-[var(--text-dim)]">{data.location}</p>
        <p className="text-[var(--text-dim)] font-mono text-xs mt-1">{data.contact.email}</p>
        <p className="text-[var(--text-dim)] font-mono text-xs">{data.contact.github}</p>
      </div>
    ),
  };
}

/* ── github / gh — repository listing ─────────────────── */
function githubCmd(data: PortfolioData): CommandResult {
  const gh = data.contact.github;
  const username = gh ? gh.replace("https://github.com/", "") : "";
  const projects = data.projects || [];
  return {
    output: (
      <div className="animate-fade-in space-y-2">
        <p className="text-[var(--prompt)] font-bold text-lg">Repositories — {username}</p>
        {projects.length === 0 ? (
          <p className="text-[var(--text-dim)] text-sm">No repos found.</p>
        ) : (
          <div className="space-y-0">
            {projects.map((p, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 border-b border-[var(--border)] last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text)] font-bold text-sm truncate">{p.name}</span>
                  </div>
                  {p.description && (
                    <p className="text-[var(--text-dim)] text-xs truncate mt-0.5">{p.description}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0 ml-2">
                  {p.tech.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 border border-[var(--border)] text-[var(--text-dim)] font-mono">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {gh && (
          <p className="text-xs mt-2">
            <a href={gh} target="_blank" rel="noopener noreferrer"
               className="text-[var(--text-dim)] hover:text-[var(--text)] underline underline-offset-2">{gh}</a>
          </p>
        )}
      </div>
    ),
  };
}

/* ── resume / cv ──────────────────────────────────────── */
function resumeCmd(): CommandResult {
  return {
    output: (
      <div className="animate-fade-in space-y-2">
        <p className="text-[var(--text)] text-sm">My resume is available at:</p>
        <a href="mailto:juleszhou01@gmail.com?subject=Demande%20de%20CV"
           className="block text-sm text-[var(--text-dim)] hover:text-[var(--text)] underline underline-offset-2">
          Send me an email to request it
        </a>
        <p className="text-[var(--text-dim)] text-xs mt-1">Or type 'contact' for other ways to reach me.</p>
      </div>
    ),
  };
}

/* ── weather / meteo — live from wttr.in ──────────────── */
function weatherCmd(lang: Lang): CommandResult {
  return {
    output: (
      <div className="animate-fade-in space-y-2">
        <p className="text-[var(--text)] text-sm">
          {lang === "fr" ? "Meteo en direct depuis wttr.in :" : "Live weather from wttr.in:"}
        </p>
        <pre className="text-[var(--text-secondary)] text-xs font-mono leading-tight">
          <span className="text-[var(--text-dim)]">{lang === "fr" ? "Chargement..." : "Loading..."}</span>
        </pre>
        <p className="text-[var(--text-dim)] text-[10px]">wttr.in/Lome?format=%l:+%c+%t(%f)+%w+%h</p>
      </div>
    ),
  };
}

/* ── date ──────────────────────────────────────────────── */
function dateCmd(lang: Lang): CommandResult {
  const now = new Date();
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const dateStr = now.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    output: (
      <div className="animate-fade-in space-y-0.5 text-sm">
        <p className="text-[var(--text)]">{dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</p>
        <p className="text-[var(--text-secondary)] font-mono">{timeStr}</p>
        <p className="text-[var(--text-dim)] text-xs">{tz}</p>
      </div>
    ),
  };
}

/* ── Fuzzy match (Levenshtein) ──────────────────────────── */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function fuzzySuggest(input: string, maxResults = 5): string[] {
  // Strip leading slash for matching
  const raw = input.startsWith("/") ? input.slice(1) : input;
  const lower = raw.toLowerCase();
  if (!lower) return [];
  const scored = AVAILABLE_COMMANDS.map((cmd) => ({
    cmd,
    prefix: cmd.startsWith(lower),
    dist: levenshtein(cmd, lower),
  }));
  scored.sort((a, b) => {
    if (a.prefix !== b.prefix) return a.prefix ? -1 : 1;
    if (a.dist !== b.dist) return a.dist - b.dist;
    return a.cmd.localeCompare(b.cmd);
  });
  return scored.slice(0, maxResults).map((s) => `/${s.cmd}`);
}

/* ── calc / calculator ─────────────────────────────────── */
function calcCmd(expr: string): CommandResult {
  if (!expr) {
    return {
      output: <p className="text-[var(--text-dim)] text-sm">Usage: calc &lt;expression&gt;</p>,
    };
  }
  const safe = expr.replace(/[^0-9+\-*/.()%^, ]/g, "");
  if (!safe || safe.length < 1) {
    return {
      output: <p className="text-[var(--error)] text-sm">Invalid expression.</p>,
    };
  }
  try {
    const fn = new Function(`"use strict"; return (${safe});`);
    const result = fn();
    return {
      output: (
        <div className="text-sm">
          <span className="text-[var(--text-dim)]">{expr} = </span>
          <span className="text-[var(--prompt)] font-bold">{result}</span>
        </div>
      ),
    };
  } catch {
    return { output: <p className="text-[var(--error)] text-sm">Error evaluating expression.</p> };
  }
}

/* ── google / youtube / wiki ─────────────────────────────── */
function searchCmd(baseUrl: string, query: string): CommandResult {
  if (!query) {
    return { output: <p className="text-[var(--text-dim)] text-sm">Usage: google &lt;query&gt;</p> };
  }
  const url = baseUrl + encodeURIComponent(query.replace(/\+/g, " "));
  return {
    output: (
      <div className="text-sm">
        <p className="text-[var(--text-dim)] mb-1">
          Opening search for <span className="text-[var(--text)]">{query.replace(/\+/g, " ")}</span>
        </p>
        <a href={url} target="_blank" rel="noopener noreferrer"
           className="text-[var(--text-dim)] hover:text-[var(--text)] underline underline-offset-2 text-xs">{url}</a>
      </div>
    ),
  };
}
