"use client";

/* ─────────────────────────────────────────────────────
   PortfolioContext – provides portfolio data and
   command-execution callback app-wide.
   ───────────────────────────────────────────────────── */

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { portfolioData as defaultData, type PortfolioData } from "./data";

interface PortfolioContextValue {
  data: PortfolioData;
  /** Callback to execute a command programmatically (clickable commands) */
  executeCommand?: (cmd: string) => void;
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
  executeCommand,
}: {
  children: ReactNode;
  data?: PortfolioData;
  executeCommand?: (cmd: string) => void;
}) {
  return (
    <PortfolioCtx.Provider value={{ data: data || defaultData, executeCommand }}>
      {children}
    </PortfolioCtx.Provider>
  );
}
