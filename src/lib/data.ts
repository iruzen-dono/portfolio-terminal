/* ─────────────────────────────────────────────────────
   Portfolio data — Updated 2026-07-09
   ───────────────────────────────────────────────────── */

export const portfolioData = {
  name: "Jules Zhou",
  title: "Développeur Full-Stack",
  location: "Lomé, Togo",
  email: "juleszhou01@gmail.com",
  github: "https://github.com/iruzen-dono",
  bio: [
    "Développeur full-stack autodidacte basé à Lomé.",
    "Du PHP/MySQL au TypeScript/Next.js, je conçois des plateformes",
    "complètes avec une attention particulière à l'architecture,",
    "la sécurité et l'expérience utilisateur.",
    "",
    "Toujours en train d'apprendre, toujours en train de construire.",
    "J'opère et gère un agent IA personnel (Hermes) déployé sur Telegram,",
    "Discord, CLI et desktop — de l'installation à la configuration",
    "des outils, skills et tâches planifiées.",
    "J'ai publié quatre outils open-source pour la communauté Hermes :",
    "un générateur de plugins, un scanneur de codebase,",
    "un protocole de packs de contexte portable, et un oracle de projet.",
    "Mon plus gros projet open-source est XEARN, une plateforme",
    "fintech panafricaine de micro-revenus digitaux (NestJS + Next.js + Expo).",
  ],

  skills: [
    { name: "TypeScript", level: 88, category: "language" },
    { name: "Python", level: 85, category: "language" },
    { name: "React / Next.js", level: 85, category: "frontend" },
    { name: "PHP", level: 82, category: "language" },
    { name: "Java", level: 80, category: "language" },
    { name: "Kotlin", level: 78, category: "language" },
    { name: "Laravel", level: 75, category: "backend" },
    { name: "NestJS", level: 82, category: "backend" },
    { name: "Node.js", level: 82, category: "backend" },
    { name: "Spring Boot", level: 78, category: "backend" },
    { name: "Ktor", level: 70, category: "backend" },
    { name: "Tailwind CSS", level: 85, category: "frontend" },
    { name: "React Native / Expo", level: 76, category: "frontend" },
    { name: "HTML / CSS", level: 80, category: "frontend" },
    { name: "Three.js / R3F", level: 72, category: "frontend" },
    { name: "MySQL", level: 80, category: "database" },
    { name: "PostgreSQL", level: 78, category: "database" },
    { name: "Prisma", level: 78, category: "backend" },
    { name: "Drizzle ORM", level: 72, category: "backend" },
    { name: "SQLite / Exposed", level: 75, category: "database" },
    { name: "Neon", level: 70, category: "devops" },
    { name: "Git / GitHub", level: 80, category: "tools" },
    { name: "Docker", level: 72, category: "devops" },
    { name: "AI Agents", level: 87, category: "tools" },
  ],

  projects: [
    {
      id: "workless",
      name: "Workless",
      description:
        "Moteur de workflow open-source auto-hébergé avec builder visuel React Flow, moteur DAG, webhooks et scheduling. Alternative à Zapier/Make.com/n8n. Stack Laravel + Next.js + PostgreSQL.",
      tech: ["Laravel 11", "Next.js 15", "TypeScript", "React Flow", "PostgreSQL", "Redis", "Python", "Docker"],
      github: "https://github.com/iruzen-dono/workless",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/workless",
      year: 2026,
    },
    {
      id: "memory-vault",
      name: "Memory Vault",
      description:
        "Plugin Hermes Agent qui package les sessions AI en packs `.hermes-memory` portables. Format v1.1.0, 6 tools, hooks on_session, webhook delivery, cron backup. Architecture Cloudflare + Anthropic + OpenAI.",
      tech: ["Python", "Hermes Plugin", "Cloudflare Workers AI", "SQLite", "JSON Schema", "Cron"],
      github: "https://github.com/iruzen-dono/memory-vault",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/memory-vault",
      year: 2026,
    },
    {
      id: "keycepass",
      name: "KeycePass",
      description:
        "Application de gestion de présence multi-plateforme (Android/Desktop) avec QR codes, géolocalisation, anti-fraude HMAC, Ktor backend, architecture KMP et interface Compose.",
      tech: ["Kotlin", "KMP", "Compose Multiplatform", "Ktor", "SQLite", "Exposed", "Gradle"],
      github: "https://github.com/iruzen-dono/KeycePass",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/KeycePass",
      year: 2025,
    },
    {
      id: "xearn",
      name: "XEARN",
      description:
        "Plateforme panafricaine de micro-revenus digitaux — tâches rémunérées, parrainage 3 niveaux, paiement Mobile Money (FedaPay), gamification (16 badges, streaks), dashboard admin complet (stats, utilisateurs, logs), app mobile Expo/Reanimated premium.",
      tech: ["Next.js 15", "React 19", "TypeScript", "NestJS", "Prisma", "PostgreSQL", "Expo", "Reanimated", "TailwindCSS", "Docker"],
      github: "https://github.com/iruzen-dono/XEARN",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/XEARN",
      year: 2026,
    },
    {
      id: "java-springboot",
      name: "Java-SpringBoot",
      description:
        "API RESTful Spring Boot avec Spring Security, JWT, JPA/Hibernate, validation et documentation OpenAPI. Architecture en couches suivant les bonnes pratiques du framework.",
      tech: ["Java 17", "Spring Boot 3", "Spring Security", "JPA/Hibernate", "JWT", "PostgreSQL", "Maven", "OpenAPI"],
      github: "https://github.com/iruzen-dono/Java-sprinboot",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/Java-sprinboot",
      year: 2025,
    },
    {
      id: "hermes-bot",
      name: "Hermes Agent",
      description:
        "Déploiement et gestion d'un agent IA personnel (Hermes Agent) opérationnel sur Telegram, Discord, CLI, TUI et desktop. Configuration d'outils, skills, mémoire persistante, tâches CRON, plugins MCP, pipeline CI/CD. Administration quotidienne d'un système agentique complet avec monitoring et curation automatique.",
      tech: ["Python", "Hermes Agent", "Telegram API", "Discord API", "SQLite", "Docker", "CLI/TUI", "Webhooks", "Cron"],
      github: "https://github.com/iruzen-dono/iruzen-dono",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/iruzen-dono",
      year: 2025,
    },
    {
      id: "portfolio-terminal",
      name: "Portfolio Terminal",
      description:
        "Portfolio interactif style terminal Unix avec boot sequence, 30+ commandes, système de fichiers virtuel, mode GUI brutaliste et thèmes dark/light/terminal.",
      tech: ["Next.js 14", "React 18", "TypeScript", "TailwindCSS", "Web Audio API", "Canvas API", "Framer Motion"],
      github: "https://github.com/iruzen-dono/portfolio-terminal",
      live: "https://portfolio-terminal-lake.vercel.app",
      image: "/projects/portfolio-terminal.png",
      year: 2026,
    },
    {
      id: "hermes-plugin-gen",
      name: "Hermes Plugin Generator",
      description:
        "Scaffolder de plugins Hermes : décris ton plugin en langage naturel, il génère plugin.yaml, __init__.py, schemas.py, tools.py et une skill embarquée. Qualité production avec check_fn, emoji, kind standalone.",
      tech: ["Python", "Hermes Agent", "Plugin System", "Code Generation", "YAML", "NLP"],
      github: "https://github.com/iruzen-dono/hermes-plugin-gen",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/hermes-plugin-gen",
      year: 2026,
    },
    {
      id: "hermes-project-oracle",
      name: "Hermes Project Oracle",
      description:
        "Scanner de codebase pour Hermes Agent : analyse 28 langages, détecte frameworks, conventions, points d'entrée et schémas. Génère AGENTS.md, CLAUDE.md et notes Obsidian. Zéro dépendances.",
      tech: ["Python", "Hermes Agent", "Tree-sitter", "Pathlib", "JSON Schema"],
      github: "https://github.com/iruzen-dono/hermes-project-oracle",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/hermes-project-oracle",
      year: 2026,
    },
    {
      id: "novashop-pro",
      name: "NovaShop Pro",
      description:
        "Plateforme e-commerce PHP/MySQL avec architecture MVC. Gestion utilisateurs, catalogue produits avec variantes, panier, commandes, panel admin et sécurité multi-couche.",
      tech: ["PHP 7.4", "MySQL", "MVC", "Composer", "HTML/CSS", "JavaScript"],
      github: "https://github.com/iruzen-dono/Nova",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/Nova",
      year: 2026,
    },
    {
      id: "restaurant-app",
      name: "RestaurantApp",
      description:
        "Application de bureau Java pour la gestion de restaurant : stocks, commandes, statistiques, export CSV et historique d'audit. Architecture MVC avec pattern DAO.",
      tech: ["Java SE", "Java Swing", "MySQL", "JDBC", "DAO Pattern"],
      github: "https://github.com/iruzen-dono/RestaurantApp",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/RestaurantApp",
      year: 2026,
    },
    {
      id: "landlord-kit",
      name: "LandLordKit",
      description:
        "SaaS de gestion locative : suivi des biens, locataires, loyers et charges. Dashboard analytics avec graphiques, auth sécurisée, notifications email via Resend. Stack Next.js + Drizzle + Neon.",
      tech: ["Next.js 16", "React 19", "Drizzle ORM", "Neon", "NextAuth", "Stripe", "Resend", "TailwindCSS"],
      github: "https://github.com/iruzen-dono/landlord-kit",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/landlord-kit",
      year: 2026,
    },
    {
      id: "quotask",
      name: "Quotask",
      description:
        "SaaS de devis freelance avec création PDF, signature électronique, paiements Stripe/Lemon Squeezy et relances email automatisées. Architecture Next.js 16 App Router avec Base UI et Drizzle.",
      tech: ["Next.js 16", "React 19", "Drizzle ORM", "Neon", "NextAuth", "Stripe", "Lemon Squeezy", "React PDF", "Resend"],
      github: "https://github.com/iruzen-dono/quotask",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/quotask",
      year: 2026,
    },
    {
      id: "trade-quote",
      name: "TradeQuote",
      description:
        "Outil de cotation et d'analyse trading : backtesting de stratégies, signaux smart-money, données Hyperliquid et Binance en temps réel. Interface Next.js avec base de données Neon.",
      tech: ["Next.js 16", "React 19", "Drizzle ORM", "Neon", "TailwindCSS", "Hyperliquid API", "Binance API"],
      github: "https://github.com/iruzen-dono/trade-quote",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/trade-quote",
      year: 2026,
    },
    {
      id: "roue-fortune",
      name: "Roue de la Fortune",
      description:
        "Application web multi-joueur pour soirées musicales interactives : scan QR code, roue de la fortune Spotify, mode Quiz (deviner titre/extrait), mode Jukebox. Stack Next.js + Socket.IO + Spotify API.",
      tech: ["Next.js", "React", "Socket.IO", "Spotify API", "TypeScript", "TailwindCSS"],
      github: "https://github.com/iruzen-dono/roue-fortune",
      live: "",
      image: "https://opengraph.githubassets.com/1/iruzen-dono/roue-fortune",
      year: 2026,
    },
  ],

  experience: [
    {
      role: "Développeur Full-Stack & SaaS Builder",
      company: "Freelance / Open Source",
      period: "Janvier 2026 — Présent",
      description:
        "Conception et développement de SaaS multi-stack : Workless (moteur workflow open-source Laravel + Next.js), LandLordKit (gestion locative avec Drizzle + Neon + Stripe), Quotask (plateforme de devis avec signature PDF et Lemon Squeezy), TradeQuote (outil de cotation trading). Opération d'un agent IA Hermes personnel déployé sur Telegram, Discord, CLI, TUI et desktop avec configuration outils, skills, plugins, mémoire persistante et tâches CRON. Publication de trois outils open-source pour la communauté Hermes : Project Oracle (scanneur codebase 28 langages), Plugin Generator (scaffolder NLP), Memory Vault (format pack portable v1.1.0).",
    },
    {
      role: "Étudiant B2 IT",
      company: "Ascencia Keyce Togo (AK Togo)",
      period: "2024 — Présent",
      description:
        "Formation Bac+2 en Informatique (IT-B2 A). Analyse fonctionnelle, génie logiciel, POO Java, bases de données. Projets académiques : CDPS (cahier des charges d'une plateforme de suivi d'insertion professionnelle) et KeycePass (application KMP de contrôle de présence par QR code, géolocalisation et anti-fraude HMAC).",
    },
    {
      role: "Développeur Java — Projet Académique",
      company: "Université — Travaux Pratiques",
      period: "Février 2026",
      description:
        "Application de bureau Java SE (Swing) pour la gestion de restaurant : stocks, commandes, statistiques, export CSV et historique d'audit. Architecture MVC avec pattern DAO et base de données MySQL.",
    },
  ],

  contact: {
    email: "juleszhou01@gmail.com",
    github: "github.com/iruzen-dono",
    linkedin: "",
    twitter: "@iruzendono",
  },

  githubProfile: {
    followers: 8,
    following: 4,
    publicRepos: 19,
    totalStars: 5,
    avatarUrl: "https://avatars.githubusercontent.com/u/187991500?v=4",
    updatedAt: "2026-07-16",
  },
};

export type PortfolioData = typeof portfolioData;
