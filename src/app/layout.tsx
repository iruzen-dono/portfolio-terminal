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
  title: "Jules Zhou | Portfolio Terminal",
  description:
    "Développeur Full-Stack specialise React, TypeScript, Kotlin et Java. Decouvrez mes projets, competences et experience via ce portfolio interactif style terminal.",
  keywords: [
    "portfolio", "développeur", "full-stack", "react", "nextjs",
    "typescript", "kotlin", "java", "spring-boot", "kmp",
    "togo", "lome", "jules zhou", "developer", "terminal",
  ],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Jules Zhou | Portfolio Terminal",
    description:
      "Développeur Full-Stack — Portfolio interactif style terminal. React, TypeScript, Kotlin, Java.",
    type: "website",
    locale: "fr_FR",
    siteName: "Jules Zhou",
    url: "https://portfolio-terminal-lake.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jules Zhou | Portfolio Terminal",
    description:
      "Développeur Full-Stack — Portfolio interactif style terminal.",
    creator: "@iruzen_dono",
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
