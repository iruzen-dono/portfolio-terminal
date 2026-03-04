"use client";

/* ─────────────────────────────────────────────────────
   Terminal – the hero component of the portfolio.
   Features: command execution, history (↑↓), Tab
   autocomplete, Ctrl+L clear, scroll-to-bottom.
   Mobile: quick-command bar, history nav buttons,
   viewport-aware keyboard handling.
   ───────────────────────────────────────────────────── */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import {
  executeCommand,
  getWelcomeMessage,
  AVAILABLE_COMMANDS,
} from "@/lib/commands";
import { useSound } from "@/lib/useSound";
import { usePortfolio } from "@/lib/PortfolioContext";
import { trackCommand, trackSession } from "@/lib/analytics";
import type { Lang } from "@/lib/i18n";

/* ── Quick commands shown on mobile ──────────────────── */
const QUICK_COMMANDS = [
  "help", "about", "skills", "projects", "contact",
  "experience", "theme", "neofetch", "clear", "hack",
  "gui", "cowsay", "fortune", "history",
];

/* ── Types ───────────────────────────────────────────── */
interface HistoryEntry {
  id: number;
  command: string;
  path: string;
  output: React.ReactNode;
}

interface TerminalProps {
  onThemeChange: (theme: string) => void;
  onGUISwitch: () => void;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

/* ── Component ───────────────────────────────────────── */
export default function Terminal({
  onThemeChange,
  onGUISwitch,
  lang,
  onLangChange,
}: TerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState("~");
  const [counter, setCounter] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { enabled: soundOn, setEnabled: setSoundOn, playKey, playExec, playError } = useSound();
  const { data: portfolioData } = usePortfolio();
  const [isMobile, setIsMobile] = useState(false);
  const [viewportH, setViewportH] = useState("100vh");

  /* detect mobile & handle visual viewport changes (keyboard open/close) */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    /* Use visualViewport API to resize when virtual keyboard opens */
    const vv = window.visualViewport;
    const onViewportResize = () => {
      if (vv) {
        setViewportH(`${vv.height}px`);
        // scroll to bottom when keyboard opens
        setTimeout(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
        }, 50);
      }
    };
    if (vv) {
      vv.addEventListener("resize", onViewportResize);
      vv.addEventListener("scroll", onViewportResize);
      onViewportResize();
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (vv) {
        vv.removeEventListener("resize", onViewportResize);
        vv.removeEventListener("scroll", onViewportResize);
      }
    };
  }, []);

  /* auto-scroll on new output */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, showWelcome]);

  /* focus on mount + track session */
  useEffect(() => {
    inputRef.current?.focus();
    trackSession();
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Mobile: navigate history ────────────────────── */
  const historyUp = useCallback(() => {
    if (commandHistory.length === 0) return;
    const idx =
      historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
    setHistoryIndex(idx);
    setInput(commandHistory[idx]);
    inputRef.current?.focus();
  }, [commandHistory, historyIndex]);

  const historyDown = useCallback(() => {
    if (historyIndex === -1) return;
    const idx = historyIndex + 1;
    if (idx >= commandHistory.length) {
      setHistoryIndex(-1);
      setInput("");
    } else {
      setHistoryIndex(idx);
      setInput(commandHistory[idx]);
    }
    inputRef.current?.focus();
  }, [commandHistory, historyIndex]);

  /* ── Mobile: run quick command ───────────────────── */
  const runQuickCommand = useCallback(
    (cmd: string) => {
      setInput(cmd);
      trackCommand(cmd);
      // Execute directly
      const result = executeCommand(cmd, currentPath, commandHistory, portfolioData, lang);
      if (result.soundToggle !== undefined) setSoundOn(result.soundToggle);
      if (result.newLang) onLangChange(result.newLang as Lang);
      playExec();
      if (result.clear) {
        setHistory([]);
        setShowWelcome(false);
        setInput("");
        return;
      }
      if (result.newTheme) onThemeChange(result.newTheme);
      if (result.showGUI) { onGUISwitch(); return; }

      if (result.newPath) setCurrentPath(result.newPath);
      const entry: HistoryEntry = {
        id: counter,
        command: cmd,
        path: currentPath,
        output: result.output,
      };
      setHistory((h) => [...h, entry]);
      setCounter((c) => c + 1);
      setCommandHistory((h) => [...h, cmd]);
      setHistoryIndex(-1);
      setInput("");
      inputRef.current?.focus();
    },
    [currentPath, commandHistory, counter, onThemeChange, onGUISwitch, playExec, setSoundOn, portfolioData, lang, onLangChange]
  );
  /* ── Execute command ─────────────────────────────── */
  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (trimmed) trackCommand(trimmed);
    const result = executeCommand(trimmed, currentPath, commandHistory, portfolioData, lang);

    /* sound toggle */
    if (result.soundToggle !== undefined) setSoundOn(result.soundToggle);

    /* lang switch */
    if (result.newLang) onLangChange(result.newLang as Lang);

    playExec();

    /* clear */
    if (result.clear) {
      setHistory([]);
      setShowWelcome(false);
      setInput("");
      return;
    }

    /* theme switch */
    if (result.newTheme) onThemeChange(result.newTheme);

    /* GUI switch */
    if (result.showGUI) {
      onGUISwitch();
      return;
    }

    /* cd */
    if (result.newPath) setCurrentPath(result.newPath);

    /* append to visible history */
    const entry: HistoryEntry = {
      id: counter,
      command: trimmed,
      path: currentPath,
      output: result.output,
    };
    setHistory((h) => [...h, entry]);
    setCounter((c) => c + 1);

    if (trimmed) setCommandHistory((h) => [...h, trimmed]);
    setHistoryIndex(-1);
    setInput("");
  }, [input, currentPath, commandHistory, counter, onThemeChange, onGUISwitch, playExec, setSoundOn, portfolioData, lang, onLangChange]);

  /* ── Keyboard handler ────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit();
        return;
      }

      /* ↑ previous command */
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const idx =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(idx);
        setInput(commandHistory[idx]);
        return;
      }

      /* ↓ next command */
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        const idx = historyIndex + 1;
        if (idx >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(idx);
          setInput(commandHistory[idx]);
        }
        return;
      }

      /* Tab autocomplete */
      if (e.key === "Tab") {
        e.preventDefault();
        if (!input) return;
        const matches = AVAILABLE_COMMANDS.filter((c) =>
          c.startsWith(input.toLowerCase())
        );
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1) {
          const entry: HistoryEntry = {
            id: counter,
            command: "",
            path: currentPath,
            output: (
              <div className="flex flex-wrap gap-3">
                {matches.map((m) => (
                  <span key={m} className="text-[var(--success)]">
                    {m}
                  </span>
                ))}
              </div>
            ),
          };
          setHistory((h) => [...h, entry]);
          setCounter((c) => c + 1);
        }
        return;
      }

      /* Ctrl+L → clear */
      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setHistory([]);
        setShowWelcome(false);
      }
    },
    [handleSubmit, commandHistory, historyIndex, input, counter, currentPath]
  );

  /* ── Prompt element ──────────────────────────────── */
  const Prompt = ({ path }: { path: string }) => (
    <span className="text-[var(--prompt)] shrink-0 text-sm">
      <span className="hidden sm:inline">jules</span>
      <span className="hidden sm:inline text-[var(--text)] opacity-50">@</span>
      <span className="hidden sm:inline">portfolio</span>
      <span className="hidden sm:inline text-[var(--text)] opacity-50">:</span>
      <span className="text-[var(--accent)]">{path}</span>
      <span className="text-[var(--text)] opacity-50">$</span>
    </span>
  );

  /* ── Render ──────────────────────────────────────── */
  return (
    <div
      className="flex flex-col scanline relative overflow-hidden"
      style={{ height: viewportH }}
      onClick={focusInput}
    >
      {/* ─ Title bar ─ */}
      <div className="flex items-center px-4 py-2 sm:py-2.5 bg-[var(--terminal-bg)] border-b border-[var(--border)] shrink-0 select-none">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57] shadow-[0_0_6px_#ff5f57]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#febc2e] shadow-[0_0_6px_#febc2e]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840] shadow-[0_0_6px_#28c840]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[var(--text)] opacity-40 text-xs sm:text-sm truncate">
            jules@portfolio: {currentPath}
          </span>
        </div>
        <span className="text-xs text-[var(--text)] opacity-30 mr-3 hidden sm:inline">
          {soundOn ? "🔊" : "🔇"}
        </span>
      </div>

      {/* ─ Terminal body ─ */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[var(--terminal-bg)] min-h-0"
      >
        {/* Welcome */}
        {showWelcome && getWelcomeMessage()}

        {/* Output history */}
        {history.map((entry) => (
          <div key={entry.id} className="mb-3">
            {entry.command !== "" && (
              <div className="flex items-center gap-2">
                <Prompt path={entry.path} />
                <span className="text-[var(--text)] text-sm">
                  {entry.command}
                </span>
              </div>
            )}
            {entry.output && <div className="mt-1">{entry.output}</div>}
          </div>
        ))}

        {/* Active input line */}
        <div className="flex items-center gap-2">
          <Prompt path={currentPath} />
          {/* Mobile: history arrows */}
          {isMobile && (
            <div className="flex gap-1 shrink-0">
              <button
                onPointerDown={(e) => { e.preventDefault(); historyUp(); }}
                className="text-[var(--text)] opacity-40 active:opacity-100 px-1.5 py-0.5 text-xs border border-[var(--border)] rounded"
                aria-label="Previous command"
              >
                ▲
              </button>
              <button
                onPointerDown={(e) => { e.preventDefault(); historyDown(); }}
                className="text-[var(--text)] opacity-40 active:opacity-100 px-1.5 py-0.5 text-xs border border-[var(--border)] rounded"
                aria-label="Next command"
              >
                ▼
              </button>
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              playKey();
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-[var(--text)] caret-[var(--prompt)] font-mono text-sm min-w-0"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            enterKeyHint="send"
            autoFocus
          />
          {/* Mobile: send button */}
          {isMobile && (
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="text-[var(--prompt)] px-2 py-0.5 text-sm border border-[var(--border)] rounded active:bg-[var(--prompt)] active:text-[var(--terminal-bg)] transition-colors shrink-0"
              aria-label="Run command"
            >
              ⏎
            </button>
          )}
        </div>
      </div>

      {/* ─ Mobile quick-command bar ─ */}
      {isMobile && (
        <div className="shrink-0 bg-[var(--terminal-bg)] border-t border-[var(--border)] safe-area-bottom">
          <div className="flex gap-2 px-3 py-2 overflow-x-auto scrollbar-hide">
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                onPointerDown={(e) => {
                  e.preventDefault();
                  runQuickCommand(cmd);
                }}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text)] opacity-70 active:opacity-100 active:border-[var(--accent)] active:text-[var(--accent)] transition-all whitespace-nowrap"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
