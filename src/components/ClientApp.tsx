"use client";

/* ─────────────────────────────────────────────────────
   ClientApp — all client-side logic (boot, terminal,
   GUI, theme, konami, transitions).
   Receives merged portfolio data from the server component
   and optional initial state from URL params.
   ───────────────────────────────────────────────────── */

import { useState, useEffect, useCallback, useRef } from "react";
import Terminal from "@/components/Terminal";
import MatrixRain from "@/components/MatrixRain";
import GUIMode from "@/components/GUIMode";
import BootSequence from "@/components/BootSequence";
import GlitchTakeover from "@/components/GlitchTakeover";
import { PortfolioProvider } from "@/lib/PortfolioContext";
import { useKonami } from "@/lib/useKonami";
import type { PortfolioData } from "@/lib/data";

interface ClientAppProps {
  portfolioData: PortfolioData;
  initialTheme?: string;
  initialMode?: "terminal" | "gui";
}

export default function ClientApp({
  portfolioData,
  initialTheme,
  initialMode,
}: ClientAppProps) {
  const [theme, setTheme] = useState(initialTheme || "dark");
  const [mode, setMode] = useState<"boot" | "terminal" | "gui">(
    initialMode ? initialMode : "boot"
  );
  const [transitioning, setTransitioning] = useState(false);
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [glitchActive, setGlitchActive] = useState(false);
  const [initialCmd, setInitialCmd] = useState<string | undefined>(undefined);

  /* Read ?cmd= from URL and skip boot if present */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cmd = params.get("cmd");
    if (cmd) {
      setInitialCmd(cmd);
      setMode("terminal"); // skip boot
    }
  }, []);

  /* Ref to execute commands from context (clickable commands) */
  const executeRef = useRef<((cmd: string) => void) | null>(null);

  const executeCommand = useCallback((cmd: string) => {
    executeRef.current?.(cmd);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* Konami code → Glitch Takeover */
  useKonami(
    useCallback(() => {
      if (!glitchActive) setGlitchActive(true);
    }, [glitchActive])
  );

  const handleGlitchComplete = useCallback(() => {
    setGlitchActive(false);
    setTheme("terminal");
  }, []);

  /* Animated mode switch */
  const switchMode = useCallback((target: "terminal" | "gui") => {
    setTransitioning(true);
    setTimeout(() => {
      setMode(target);
      setTimeout(() => setTransitioning(false), 50);
    }, 400);
  }, []);

  /* Register the terminal's execute function */
  const handleTerminalReady = useCallback((execute: (cmd: string) => void) => {
    executeRef.current = execute;
  }, []);

  /* Terminal & boot need fixed viewport; GUI needs free scroll */
  const isGUI = mode === "gui";

  return (
    <PortfolioProvider data={portfolioData} executeCommand={executeCommand}>
      <main className={`relative ${isGUI ? "min-h-screen" : "h-dvh overflow-hidden"}`}>
        {/* Matrix rain only on terminal theme in terminal mode */}
        {theme === "terminal" && mode === "terminal" && <MatrixRain />}

        {/* Konami Easter Egg — Glitch Takeover */}
        <GlitchTakeover active={glitchActive} onComplete={handleGlitchComplete} />

        {/* Transition overlay */}
        <div
          className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-400 ${
            transitioning ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "var(--bg)" }}
        >
          {transitioning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[var(--prompt)] mode-switch-dot"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`relative z-10 ${isGUI ? "" : "h-full"}`}>
          {mode === "boot" ? (
            <BootSequence onComplete={() => setMode("terminal")} />
          ) : mode === "terminal" ? (
            <Terminal
              onThemeChange={setTheme}
              onGUISwitch={() => switchMode("gui")}
              lang={lang}
              onLangChange={setLang}
              onReady={handleTerminalReady}
              initialCmd={initialCmd}
            />
          ) : (
            <GUIMode
              onTerminalSwitch={() => switchMode("terminal")}
              lang={lang}
              theme={theme}
              onThemeChange={setTheme}
            />
          )}
        </div>
      </main>
    </PortfolioProvider>
  );
}
