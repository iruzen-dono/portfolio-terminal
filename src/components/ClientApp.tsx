"use client";

/* ─────────────────────────────────────────────────────
   ClientApp — all client-side logic (boot, terminal,
   GUI, theme, konami, transitions).
   Receives merged portfolio data from the server component
   and optional initial state from URL params.
   ───────────────────────────────────────────────────── */

import { useState, useEffect, useCallback } from "react";
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

function HomeInner({
  portfolioData,
  initialTheme: fallbackTheme,
  initialMode: fallbackMode,
}: {
  portfolioData: PortfolioData;
  initialTheme?: string;
  initialMode?: "terminal" | "gui";
}) {
  const [theme, setTheme] = useState(fallbackTheme || "dark");
  const [mode, setMode] = useState<"boot" | "terminal" | "gui">(
    // Skip boot when initialMode is set from URL
    fallbackMode ? fallbackMode : "boot"
  );
  const [transitioning, setTransitioning] = useState(false);
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [glitchActive, setGlitchActive] = useState(false);

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

  /* Terminal & boot need fixed viewport; GUI needs free scroll */
  const isGUI = mode === "gui";

  return (
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
  );
}

export default function ClientApp({
  portfolioData,
  initialTheme,
  initialMode,
}: ClientAppProps) {
  return (
    <PortfolioProvider data={portfolioData}>
      <HomeInner
        portfolioData={portfolioData}
        initialTheme={initialTheme}
        initialMode={initialMode}
      />
    </PortfolioProvider>
  );
}
