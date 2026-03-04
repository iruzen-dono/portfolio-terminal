"use client";

/* ─────────────────────────────────────────────────────
   BootSequence – BIOS-style boot animation.
   Detects REAL hardware via browser APIs, then
   displays a POST sequence with actual system info.
   ───────────────────────────────────────────────────── */

import { useState, useEffect, useCallback, useRef } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

interface BootLine {
  text: string;
  color?: string;
  delay: number;
}

/* ── Real hardware detection ───────────────────────── */
function detectHardware(): BootLine[] {
  const ok = (label: string, value: string) =>
    ({ text: `  ${label} ${".".repeat(Math.max(2, 22 - label.length))} ${value.padEnd(28)}[ OK ]`, color: "var(--success)", delay: 140 });
  const lines: BootLine[] = [];

  // CPU
  const cores = navigator.hardwareConcurrency;
  lines.push(ok("CPU", cores ? `${cores}-core processor` : "Unknown processor"));

  // RAM (Chrome / Edge only)
  const mem = (navigator as unknown as Record<string, unknown>).deviceMemory as number | undefined;
  lines.push(ok("RAM", mem ? `${mem} GB` : "N/A (restricted by browser)"));

  // GPU via WebGL
  let gpu = "Unknown GPU";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && gl instanceof WebGLRenderingContext) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
        // Trim overly long GPU names
        if (gpu.length > 40) gpu = gpu.slice(0, 37) + "...";
      }
    }
  } catch { /* fallback */ }
  lines.push(ok("GPU", gpu));

  // Screen
  const scr = `${screen.width}×${screen.height} @${window.devicePixelRatio || 1}x (${screen.colorDepth}-bit)`;
  lines.push(ok("DISPLAY", scr));

  // Storage
  // Will be resolved later – for now placeholder
  lines.push(ok("STORAGE", "querying..."));

  // Network
  const conn = (navigator as unknown as Record<string, unknown>).connection as
    | { effectiveType?: string; downlink?: number }
    | undefined;
  if (conn?.effectiveType) {
    lines.push(ok("NETWORK", `${conn.effectiveType.toUpperCase()} — ${conn.downlink ?? "?"}Mbps`));
  } else {
    lines.push(ok("NETWORK", "Online"));
  }

  // OS & Browser
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  if (ua.includes("Win")) {
    os = ua.includes("Windows NT 10") ? "Windows 10/11" : "Windows";
  } else if (ua.includes("Mac OS X")) {
    const ver = ua.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, ".");
    os = ver ? `macOS ${ver}` : "macOS";
  } else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (/iPhone|iPad/.test(ua)) os = "iOS";

  let browser = "Unknown Browser";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";

  lines.push(ok("PLATFORM", `${os} / ${browser}`));

  // Language & Timezone
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const lang = navigator.language || "en";
  lines.push(ok("LOCALE", `${lang} — ${tz}`));

  return lines;
}

/* ── Build full boot sequence ──────────────────────── */
function buildBootLines(hwLines: BootLine[]): BootLine[] {
  return [
    { text: "Portfolio BIOS v2.0.0 — Initializing...", color: "var(--prompt)", delay: 0 },
    { text: "", delay: 200 },
    { text: "Running POST (Power-On Self Test)...", delay: 300 },
    { text: "  Scanning real hardware via browser APIs...", color: "var(--text)", delay: 200 },
    { text: "", delay: 100 },
    ...hwLines,
    { text: "", delay: 200 },
    { text: "Loading kernel: next-kernel-14.2.0...", delay: 300 },
    { text: "  [████████████████████████████████████████] 100%", color: "var(--accent)", delay: 600 },
    { text: "", delay: 100 },
    { text: "Mounting virtual filesystem...", delay: 200 },
    { text: "  /home/jules .......................... mounted", delay: 100 },
    { text: "  /home/jules/projects ................. mounted", delay: 80 },
    { text: "  /home/jules/skills ................... mounted", delay: 80 },
    { text: "", delay: 150 },
    { text: "Starting portfolio-shell v2.0...", delay: 300 },
    { text: "", delay: 100 },
    { text: "System ready. Welcome, jules.", color: "var(--success)", delay: 400 },
    { text: "", delay: 300 },
  ];
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [lines, setLines] = useState<BootLine[]>([]);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [skipped, setSkipped] = useState(false);
  const storageIdx = useRef(-1);

  /* Detect hardware on mount (client-only) */
  useEffect(() => {
    const hw = detectHardware();
    // Remember which line is the STORAGE placeholder so we can patch it
    const storageLineIndex = hw.findIndex((l) => l.text.includes("STORAGE"));
    const built = buildBootLines(hw);
    // The storage line is offset by the header lines (5 lines before hw)
    storageIdx.current = storageLineIndex >= 0 ? storageLineIndex + 5 : -1;
    setLines(built);

    // Async: resolve storage estimate and patch
    if (navigator.storage?.estimate) {
      navigator.storage.estimate().then((est) => {
        const total = est.quota ? `${(est.quota / 1e9).toFixed(0)} GB total` : "Unknown";
        const used = est.usage ? `${(est.usage / 1e6).toFixed(0)} MB used` : "";
        const storageStr = used ? `${total}, ${used}` : total;
        setLines((prev) => {
          if (storageIdx.current < 0 || storageIdx.current >= prev.length) return prev;
          const updated = [...prev];
          const old = updated[storageIdx.current];
          updated[storageIdx.current] = {
            ...old,
            text: old.text.replace("querying...", storageStr),
          };
          return updated;
        });
      });
    }
  }, []);

  const skip = useCallback(() => {
    setSkipped(true);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (skipped || lines.length === 0) return;

    if (visibleLines >= lines.length) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }

    const nextLine = lines[visibleLines];
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, nextLine.delay);

    return () => clearTimeout(timer);
  }, [visibleLines, skipped, onComplete, lines]);

  /* Skip on any key or click */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [skip]);

  if (skipped) return null;

  return (
    <div
      className="h-screen bg-[var(--bg)] text-[var(--text)] p-4 sm:p-8 overflow-hidden cursor-pointer font-mono"
      onClick={skip}
    >
      <div className="max-w-3xl boot-flicker">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="text-xs sm:text-sm leading-relaxed animate-fade-in"
            style={{ color: line.color || "var(--text)", opacity: line.text ? 0.9 : 1 }}
          >
            {line.text || "\u00A0"}
          </div>
        ))}
        {lines.length > 0 && visibleLines < lines.length && (
          <span className="inline-block w-2.5 h-4 bg-[var(--prompt)] boot-line" />
        )}
      </div>
      <div className="fixed bottom-6 right-6 text-xs text-[var(--text)] opacity-30">
        Press ESC / Enter / Click to skip
      </div>
    </div>
  );
}
