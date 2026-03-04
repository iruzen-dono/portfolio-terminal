"use client";

/* ─────────────────────────────────────────────────────
   PortfolioContext – provides portfolio data app-wide
   from the static data.ts file.
   ───────────────────────────────────────────────────── */

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { portfolioData as defaultData, type PortfolioData } from "./data";

/* ── Types ───────────────────────────────────────────── */
export type { PortfolioData };

interface PortfolioContextValue {
  data: PortfolioData;
}

const PortfolioCtx = createContext<PortfolioContextValue>({
  data: defaultData,
});

export function usePortfolio() {
  return useContext(PortfolioCtx);
}

/* ── Provider ────────────────────────────────────────── */
export function PortfolioProvider({ children }: { children: ReactNode }) {
  return (
    <PortfolioCtx.Provider value={{ data: defaultData }}>
      {children}
    </PortfolioCtx.Provider>
  );
}
