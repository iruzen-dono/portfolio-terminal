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
    "Portfolio interactif style terminal — Développeur Full-Stack",
  keywords: ["portfolio", "developer", "terminal", "full-stack", "interactive"],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Jules Zhou | Portfolio Terminal",
    description:
      "Portfolio interactif style terminal — Développeur Full-Stack",
    type: "website",
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
