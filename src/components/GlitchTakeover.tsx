"use client";

/* ─────────────────────────────────────────────────────
   GlitchTakeover — Full-screen glitch effect triggered
   by the Konami code. Shows distortion, noise,
   corrupted text, then a secret message.
   ───────────────────────────────────────────────────── */

import { useState, useEffect, useRef } from "react";
import { launchConfetti } from "@/lib/confetti";

interface GlitchTakeoverProps {
  active: boolean;
  onComplete: () => void;
}

/* Random corrupted characters */
const GLITCH_CHARS = "█▓▒░╔╗╚╝║═╬╦╩╣╠┃┳┻┫┣@#$%&!?><{}[]01";
function randChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}
function corruptLine(len: number) {
  return Array.from({ length: len }, () => randChar()).join("");
}

/* Phases: glitch → blackout → typing → reveal → fade out */
type Phase = "glitch" | "blackout" | "typing" | "reveal" | "done";

const TYPING_LINES = [
  { text: "root@portfolio:~# ACCESS GRANTED", delay: 0 },
  { text: "Decrypting hidden files...", delay: 600 },
  { text: "███████████████████████ 100%", delay: 1400 },
  { text: "", delay: 1800 },
];

const SECRET_MSG = "You found the secret.\nYou're hired. 🎉";

export default function GlitchTakeover({ active, onComplete }: GlitchTakeoverProps) {
  const [phase, setPhase] = useState<Phase>("done");
  const [corruptedLines, setCorruptedLines] = useState<string[]>([]);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Kick off the sequence when activated */
  useEffect(() => {
    if (!active) return;
    setPhase("glitch");
    setTypedLines([]);
    setShowSecret(false);

    /* Phase 1: Glitch — 2.5s of visual chaos */
    intervalRef.current = setInterval(() => {
      const lines = Array.from({ length: 20 }, () =>
        corruptLine(Math.floor(Math.random() * 60) + 20)
      );
      setCorruptedLines(lines);
    }, 50);

    const t1 = setTimeout(() => {
      /* Phase 2: Blackout */
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCorruptedLines([]);
      setPhase("blackout");
    }, 2500);

    const t2 = setTimeout(() => {
      /* Phase 3: Typing */
      setPhase("typing");
    }, 3200);

    /* Type each line at its delay offset */
    const typeTimers: ReturnType<typeof setTimeout>[] = [];
    const baseDelay = 3200;
    TYPING_LINES.forEach((line, i) => {
      typeTimers.push(
        setTimeout(() => {
          setTypedLines((prev) => [...prev, line.text]);
        }, baseDelay + line.delay)
      );
    });

    const t3 = setTimeout(() => {
      /* Phase 4: Reveal */
      setPhase("reveal");
      setShowSecret(true);
      launchConfetti(150);
    }, baseDelay + 2800);

    const t4 = setTimeout(() => {
      /* Phase 5: Done — fade out */
      setPhase("done");
      onComplete();
    }, baseDelay + 6500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      [t1, t2, t3, t4, ...typeTimers].forEach(clearTimeout);
    };
  }, [active, onComplete]);

  if (phase === "done" && !active) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${
        phase === "done" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "#000" }}
    >
      {/* Phase 1: Glitch noise */}
      {phase === "glitch" && (
        <div className="absolute inset-0 overflow-hidden glitch-takeover-noise">
          {/* Distorted color channels */}
          <div className="absolute inset-0 glitch-takeover-rgb" />
          {/* Corrupted text flying around */}
          <div className="absolute inset-0 p-4 font-mono text-xs leading-tight overflow-hidden">
            {corruptedLines.map((line, i) => (
              <p
                key={i}
                className="whitespace-pre glitch-takeover-text"
                style={{
                  color: `hsl(${Math.random() * 360}, 100%, 60%)`,
                  transform: `translateX(${Math.random() * 40 - 20}px)`,
                  opacity: 0.6 + Math.random() * 0.4,
                }}
              >
                {line}
              </p>
            ))}
          </div>
          {/* Scan lines */}
          <div className="absolute inset-0 glitch-takeover-scanlines" />
          {/* Flash */}
          <div className="absolute inset-0 glitch-takeover-flash" />
        </div>
      )}

      {/* Phase 2: Blackout — just black */}
      {phase === "blackout" && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="w-2 h-4 bg-green-500 animate-pulse" />
        </div>
      )}

      {/* Phase 3: Typing */}
      {(phase === "typing" || phase === "reveal") && (
        <div className="absolute inset-0 bg-black p-6 sm:p-12 flex flex-col justify-center">
          <div className="font-mono text-sm sm:text-base space-y-1 max-w-xl mx-auto">
            {typedLines.map((line, i) => (
              <p
                key={i}
                className={`${
                  i === 0 ? "text-green-400" : "text-green-500/80"
                } glitch-takeover-type-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {line || "\u00A0"}
              </p>
            ))}

            {/* Blinking cursor */}
            {phase === "typing" && (
              <span className="inline-block w-2.5 h-4 bg-green-400 animate-pulse" />
            )}

            {/* Secret reveal */}
            {showSecret && (
              <div className="mt-8 glitch-takeover-reveal">
                <pre className="text-2xl sm:text-4xl font-bold text-center leading-relaxed whitespace-pre-wrap glitch-takeover-secret-text">
                  {SECRET_MSG}
                </pre>
                <p className="text-center text-green-500/50 text-xs mt-6 animate-pulse">
                  ↑↑↓↓←→←→BA
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
