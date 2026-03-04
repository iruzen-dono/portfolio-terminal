/* ─────────────────────────────────────────────────────
   page.tsx — Server component that fetches GitHub data
   at build time (ISR every hour) and passes merged
   portfolio data to the client app.
   ───────────────────────────────────────────────────── */

import { fetchGitHubData } from "@/lib/github";
import { mergeGitHubData } from "@/lib/mergeGitHubData";
import ClientApp from "@/components/ClientApp";

export const revalidate = 3600; // ISR: rebuild every 1 hour

export default async function Home() {
  const ghData = await fetchGitHubData();
  const portfolioData = mergeGitHubData(ghData);

  return (
    <ClientApp
      portfolioData={portfolioData}
      fetchedAt={ghData.fetchedAt}
    />
  );
}
