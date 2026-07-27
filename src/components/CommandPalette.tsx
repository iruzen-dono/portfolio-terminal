"use client";

/* ─────────────────────────────────────────────────────
   CommandPalette — Ctrl+K overlay search for all
   terminal commands. Shows fuzzy-matched commands
   with descriptions. Click or Enter executes.
   ───────────────────────────────────────────────────── */

import { useState, useEffect, useRef, useCallback } from "react";
import { AVAILABLE_COMMANDS } from "@/lib/commands";

/* ── Description map matching helpCmd output ──────────── */
const CMD_DESCS: Record<string, string> = {
  "help": "Show all available commands",
  "about": "Learn about me",
  "skills": "View my technical skills",
  "projects": "Browse my projects",
  "open": "Open a project detail",
  "experience": "Work & education timeline",
  "contact": "Get in touch",
  "theme": "Change the theme",
  "gui": "Switch to GUI mode",
  "neofetch": "Display system info",
  "clear": "Clear the terminal",
  "ls": "List virtual files",
  "cd": "Change directory",
  "cat": "Read a file",
  "pwd": "Print working directory",
  "tree": "Show directory tree",
  "whoami": "Personal info + visitor stats",
  "github": "GitHub repository overview",
  "gh": "Alias for /github",
  "resume": "Request my resume",
  "cv": "Alias for /resume",
  "weather": "Live weather forecast",
  "meteo": "Alias for /weather",
  "sound": "Toggle terminal sounds",
  "music": "Play some music",
  "hack": "Hack the mainframe",
  "matrix": "Enter the Matrix",
  "sudo": "Admin privileges (easter egg)",
  "cowsay": "Moo!",
  "fortune": "Random dev wisdom",
  "stats": "Terminal usage analytics",
  "demo": "Auto-guided presentation tour",
  "present": "Alias for /demo",
  "quote": "Random inspirational quote",
  "banner": "Display the ASCII banner again",
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelect: (cmd: string) => void;
}

export default function CommandPalette({ open, onClose, onSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  /* filter commands */
  const filtered = query.trim() === ""
    ? AVAILABLE_COMMANDS
    : AVAILABLE_COMMANDS.filter((cmd) =>
        cmd.includes(query.toLowerCase())
      );

  /* reset on open */
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  /* scroll selected into view */
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const execute = useCallback((cmd: string) => {
    onSelect(cmd);
    setQuery("");
  }, [onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          execute(filtered[selectedIndex]);
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        return;
      }
    },
    [filtered, selectedIndex, onClose, execute]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* palette */}
      <div className="relative w-full max-w-lg mx-4 border border-[var(--border)] rounded-xl bg-[var(--terminal-bg)] shadow-2xl overflow-hidden">
        {/* search input */}
        <div className="flex items-center border-b border-[var(--border)]">
          <span className="px-4 text-[var(--prompt)] text-lg">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands…"
            className="flex-1 bg-transparent py-3 pr-4 outline-none text-[var(--text)] font-mono text-sm placeholder:text-[var(--text-dim)] placeholder:opacity-40"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="pr-4 text-[10px] text-[var(--text-dim)] font-mono opacity-50">
            ESC
          </span>
        </div>

        {/* results */}
        <div ref={listRef} className="max-h-64 overflow-y-auto" role="listbox">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-[var(--text-dim)] text-sm font-mono">
              No matching commands.
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd}
                role="option"
                aria-selected={i === selectedIndex}
                onClick={() => execute(cmd)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-75 ${
                  i === selectedIndex
                    ? "bg-[var(--prompt)]/10 text-[var(--prompt)]"
                    : "text-[var(--text)] hover:bg-[var(--surface)]"
                }`}
              >
                <span className="font-mono text-sm font-bold shrink-0 w-24 truncate">
                  {cmd.startsWith("/") ? cmd : `/${cmd}`}
                </span>
                <span className="text-xs opacity-60 truncate">
                  {CMD_DESCS[cmd] || ""}
                </span>
              </button>
            ))
          )}
        </div>

        {/* footer hint */}
        <div className="border-t border-[var(--border)] px-4 py-2 flex gap-4 text-[10px] text-[var(--text-dim)] font-mono opacity-50">
          <span>↵ execute</span>
          <span>↑↓ navigate</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
