"use client";

/* ─────────────────────────────────────────────────────
   CommandLink – renders a clickable terminal command
   that auto-executes when clicked/tapped.
   Used inside command output to make suggestions,
   help entries, and project links interactive.
   ───────────────────────────────────────────────────── */

import { useCallback } from "react";
import { usePortfolio } from "@/lib/PortfolioContext";

interface CommandLinkProps {
  /** Command to execute (e.g. "/about", "open xearn") */
  command: string;
  /** Optional display text; defaults to command */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Optional variant for styling */
  variant?: "success" | "prompt" | "accent" | "dim";
}

export function CommandLink({
  command,
  children,
  className = "",
  variant = "success",
}: CommandLinkProps) {
  const { executeCommand } = usePortfolio();

  const colorMap: Record<string, string> = {
    success: "text-[var(--success)]",
    prompt: "text-[var(--prompt)]",
    accent: "text-[var(--accent)]",
    dim: "text-[var(--text-dim)]",
  };

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (executeCommand) {
        executeCommand(command);
      }
    },
    [command, executeCommand]
  );

  return (
    <span
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e as unknown as React.MouseEvent);
      }}
      tabIndex={0}
      role="button"
      aria-label={`Run command: ${command}`}
      className={`${colorMap[variant]} font-bold cursor-pointer 
        hover:brightness-125 transition-all duration-150 
        underline decoration-dotted underline-offset-2
        decoration-current/30 hover:decoration-current/80
        active:scale-95 ${className}`}
    >
      {children ?? command}
    </span>
  );
}
