import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-terminal-lake.vercel.app"),
  title: "Jules Zhou | Full-Stack & AI Agent Tooling",
  description:
    "Développeur full-stack et ingénieur en outils d'agents IA. Plateformes web en React, Next.js, NestJS et Python, plus des outils open-source publiés sur PyPI — hermes-project-oracle, hermes-memory-vault.",
  keywords: [
    "portfolio", "développeur", "full-stack", "react", "nextjs",
    "typescript", "python", "nestjs", "kotlin", "java",
    "ai agents", "llm tooling", "mcp", "pypi", "open source",
    "togo", "lome", "jules zhou", "developer", "terminal",
  ],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Jules Zhou | Full-Stack & AI Agent Tooling",
    description:
      "Développeur full-stack et ingénieur en outils d'agents IA. React, Next.js, NestJS, Python, et des outils open-source sur PyPI.",
    type: "website",
    locale: "fr_FR",
    siteName: "Jules Zhou",
    url: "https://portfolio-terminal-lake.vercel.app",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Jules Zhou — Développeur Full-Stack & Ingénieur Outils IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jules Zhou | Full-Stack & AI Agent Tooling",
    description:
      "Développeur full-stack et ingénieur en outils d'agents IA. Portfolio interactif style terminal.",
    creator: "@iruzen_dono",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://portfolio-terminal-lake.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className={jetbrains.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, interactive-widget=resizes-content" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
