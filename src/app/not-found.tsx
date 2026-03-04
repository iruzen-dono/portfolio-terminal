"use client";

/* ─────────────────────────────────────────────────────
   404 Page – Terminal-style "command not found"
   ───────────────────────────────────────────────────── */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen bg-[var(--bg)] flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center px-4 py-2.5 bg-[var(--terminal-bg)] border-b border-[var(--border)]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="flex-1 text-center text-[var(--text)] opacity-40 text-sm">
              error@portfolio: 404
            </span>
          </div>

          {/* Body */}
          <div className="bg-[var(--terminal-bg)] p-6 space-y-4">
            <pre className="text-[var(--error)] text-xs sm:text-sm leading-tight whitespace-pre">{`
  ██╗  ██╗ ██████╗ ██╗  ██╗
  ██║  ██║██╔═══██╗██║  ██║
  ███████║██║   ██║███████║
  ╚════██║██║   ██║╚════██║
       ██║╚██████╔╝     ██║
       ╚═╝ ╚═════╝      ╚═╝`}</pre>

            <div className="space-y-2 text-sm">
              <p className="text-[var(--text)]">
                <span className="text-[var(--prompt)]">jules@portfolio:~$</span>{" "}
                cd /this-page
              </p>
              <p className="text-[var(--error)]">
                bash: cd: /this-page: No such file or directory
              </p>
              <p className="text-[var(--text)] opacity-60 mt-4">
                The page you&apos;re looking for doesn&apos;t exist in this
                filesystem.
              </p>
            </div>

            <Link
              href="/"
              className="inline-block mt-4 px-4 py-2 rounded border border-[var(--accent)] text-[var(--accent)] text-sm hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              cd ~ (Go Home)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
