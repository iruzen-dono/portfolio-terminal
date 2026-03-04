"use client";

import { useState, useEffect, useCallback } from "react";
import Terminal from "@/components/Terminal";
import MatrixRain from "@/components/MatrixRain";
import GUIMode from "@/components/GUIMode";
import BootSequence from "@/components/BootSequence";
import { PortfolioProvider } from "@/lib/PortfolioContext";
import { useKonami } from "@/lib/useKonami";
import { launchConfetti } from "@/lib/confetti";

function HomeInner() {
  const [theme, setTheme] = useState("dark");
  const [mode, setMode] = useState<"boot" | "terminal" | "gui">("boot");
  const [transitioning, setTransitioning] = useState(false);
  const [lang, setLang] = useState<"fr" | "en">("fr");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* Konami code → confetti + cyberpunk theme */
  useKonami(
    useCallback(() => {
      launchConfetti(100);
      setTheme("cyberpunk");
    }, [])
  );

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
    <main className={`relative ${isGUI ? "min-h-screen" : "h-screen overflow-hidden"}`}>
      {theme === "matrix" && <MatrixRain />}

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
          <GUIMode onTerminalSwitch={() => switchMode("terminal")} lang={lang} />
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <PortfolioProvider>
      <HomeInner />
    </PortfolioProvider>
  );
}
