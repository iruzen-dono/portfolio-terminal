"use client";

/* ─────────────────────────────────────────────────────
   useKonami – Detects the Konami Code sequence:
   ↑ ↑ ↓ ↓ ← → ← → B A
   ───────────────────────────────────────────────────── */

import { useEffect, useRef } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function useKonami(callback: () => void) {
  const indexRef = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const expected = KONAMI[indexRef.current];
      if (e.key === expected || e.key.toLowerCase() === expected) {
        indexRef.current++;
        if (indexRef.current === KONAMI.length) {
          indexRef.current = 0;
          callback();
        }
      } else {
        indexRef.current = 0;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [callback]);
}
