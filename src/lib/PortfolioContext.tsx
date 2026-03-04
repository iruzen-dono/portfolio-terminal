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

/* ── Types ───────────────────────────────────────────── */
export type { PortfolioData };

interface PortfolioContextValue {
  data: PortfolioData;
  fetchedAt?: string;
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
  fetchedAt,
}: {
  children: ReactNode;
  data?: PortfolioData;
  fetchedAt?: string;
}) {
  return (
    <PortfolioCtx.Provider value={{ data: data || defaultData, fetchedAt }}>
      {children}
    </PortfolioCtx.Provider>
  );
}
