"use client";

/* ─────────────────────────────────────────────────────
   Intro — 600 ms, une ligne, aucun clavier requis.

   Remplace l'ancien BIOS boot (20 lignes de POST, détection
   matérielle, 3-4 s) : trop long pour un visiteur qui vient
   lire un profil, et le skip clavier ne veut rien dire sur
   mobile.

   Règles :
   - le terminal est rendu dessous immédiatement (aucun
     délai avant le contenu, l'overlay ne fait que passer) ;
   - coupé si prefers-reduced-motion ;
   - joué une fois par session seulement ;
   - clic, touche ou scroll = sortie immédiate.
   ───────────────────────────────────────────────────── */

import { useCallback, useEffect, useRef, useState } from "react";

const PROMPT = "jules@portfolio:~$ ";
const CHAR_MS = 16;
const HOLD_MS = 260;
const FADE_MS = 200;

export default function Intro({ onDone }: { onDone: () => void }) {
  const [typed, setTyped] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setGone(true);
    onDone();
  }, [onDone]);

  const dismiss = useCallback(() => {
    if (finished.current) return;
    setLeaving(true);
    window.setTimeout(finish, FADE_MS);
  }, [finish]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro") === "1";
      sessionStorage.setItem("intro", "1");
    } catch {
      /* stockage bloqué : on joue l'intro, elle est courte */
    }

    if (seen || reduced) {
      finish();
      return;
    }

    const timers: number[] = [];
    for (let i = 1; i <= PROMPT.length; i++) {
      timers.push(window.setTimeout(() => setTyped(i), CHAR_MS * i));
    }
    const typedAt = CHAR_MS * PROMPT.length;
    timers.push(window.setTimeout(() => setLeaving(true), typedAt + HOLD_MS));
    timers.push(window.setTimeout(finish, typedAt + HOLD_MS + FADE_MS));

    window.addEventListener("keydown", dismiss);
    window.addEventListener("wheel", dismiss, { passive: true });

    return () => {
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
    };
  }, [dismiss, finish]);

  if (gone) return null;

  return (
    <div
      data-intro
      aria-hidden="true"
      onClick={dismiss}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--bg)] font-mono"
      style={{ opacity: leaving ? 0 : 1, transition: `opacity ${FADE_MS}ms linear` }}
    >
      <div className="text-sm sm:text-base tracking-tight">
        <span className="text-[var(--prompt)]">{PROMPT.slice(0, typed)}</span>
        <span className="boot-line ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.16em] bg-[var(--prompt)]" />
      </div>
    </div>
  );
}
