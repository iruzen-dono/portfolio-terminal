"use client";

/* ─────────────────────────────────────────────────────
   PortfolioContext – provides portfolio data app-wide.
   Data can be injected from server component (merged
   with GitHub API) or falls back to static data.ts.
   ───────────────────────────────────────────────────── */

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { portfolioData as defaultData, type PortfolioData } from "./data";

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
export function PortfolioProvider({
  children,
  data,
}: {
  children: ReactNode;
  data?: PortfolioData;
}) {
  return (
    <PortfolioCtx.Provider value={{ data: data || defaultData }}>
      {children}
    </PortfolioCtx.Provider>
  );
}
