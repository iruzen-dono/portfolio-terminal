/* ─────────────────────────────────────────────────────
   Analytics – lightweight anonymous command tracker.
   Stores command usage counts in localStorage.
   No external services, no PII, fully offline.
   ───────────────────────────────────────────────────── */

const STORAGE_KEY = "portfolio_cmd_analytics";

interface AnalyticsData {
  commands: Record<string, number>;
  totalCommands: number;
  sessions: number;
  firstVisit: string;
  lastVisit: string;
}

function getStore(): AnalyticsData {
  if (typeof window === "undefined") {
    return { commands: {}, totalCommands: 0, sessions: 0, firstVisit: "", lastVisit: "" };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return {
    commands: {},
    totalCommands: 0,
    sessions: 0,
    firstVisit: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
  };
}

function saveStore(data: AnalyticsData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* noop */ }
}

/** Track a command execution */
export function trackCommand(cmd: string) {
  if (!cmd) return;
  const normalized = cmd.toLowerCase().split(/\s+/)[0];
  const store = getStore();
  store.commands[normalized] = (store.commands[normalized] || 0) + 1;
  store.totalCommands++;
  store.lastVisit = new Date().toISOString();
  saveStore(store);
}

/** Register a new session */
export function trackSession() {
  const store = getStore();
  store.sessions++;
  store.lastVisit = new Date().toISOString();
  if (!store.firstVisit) store.firstVisit = new Date().toISOString();
  saveStore(store);
}

/** Get analytics data for the `analytics` command */
export function getAnalytics(): AnalyticsData {
  return getStore();
}

/** Get top N most used commands */
export function getTopCommands(n = 10): [string, number][] {
  const store = getStore();
  return Object.entries(store.commands)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}
