/* ─────────────────────────────────────────────────────
   page.tsx — Server component that fetches GitHub data
   at build time (ISR every hour), reads URL params,
   and passes merged portfolio data + initial state to
   the client app.
   ───────────────────────────────────────────────────── */

import { fetchGitHubData } from "@/lib/github";
import { mergeGitHubData } from "@/lib/mergeGitHubData";
import ClientApp from "@/components/ClientApp";

export const revalidate = 3600; // ISR: rebuild every 1 hour

interface HomeProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const ghData = await fetchGitHubData();
  const portfolioData = mergeGitHubData(ghData);

  // Parse URL params — default: dark theme, terminal mode
  const resolvedParams = await searchParams;
  const initialTheme = (typeof resolvedParams?.theme === "string" && ["dark", "light", "terminal"].includes(resolvedParams.theme))
    ? resolvedParams.theme : "dark";
  const initialMode = resolvedParams?.mode === "gui" ? "gui" : "terminal";

  return (
    <ClientApp
      portfolioData={portfolioData}
      initialTheme={initialTheme}
      initialMode={initialMode as "terminal" | "gui"}
    />
  );
}
