/* ─────────────────────────────────────────────────────
   Portfolio data — Auto-generated from GitHub @iruzen-dono
   ───────────────────────────────────────────────────── */

export const portfolioData = {
  name: "Jules Zhou",
  title: "Développeur Full-Stack",
  location: "Lomé, Togo",
  email: "juleszhou01@gmail.com",
  github: "https://github.com/iruzen-dono",
  linkedin: "",
  website: "",

  bio: [
    "Développeur full-stack autodidacte et ambitieux basé à Lomé.",
    "Du PHP/MySQL au TypeScript/Next.js, je conçois des plateformes",
    "complètes avec une attention particulière à l'architecture,",
    "la sécurité et l'expérience utilisateur.",
    "",
    "Toujours en train d'apprendre, toujours en train de construire.",
  ],

  skills: [
    { name: "TypeScript", level: 85, category: "language" },
    { name: "PHP", level: 85, category: "language" },
    { name: "React / Next.js", level: 82, category: "frontend" },
    { name: "Tailwind CSS", level: 80, category: "frontend" },
    { name: "NestJS", level: 80, category: "backend" },
    { name: "Node.js", level: 80, category: "backend" },
    { name: "HTML / CSS", level: 78, category: "frontend" },
    { name: "MySQL", level: 78, category: "database" },
    { name: "Git / GitHub", level: 78, category: "tools" },
    { name: "Java", level: 75, category: "language" },
    { name: "Prisma", level: 75, category: "backend" },
    { name: "PostgreSQL", level: 75, category: "database" },
    { name: "Three.js / R3F", level: 70, category: "frontend" },
    { name: "Docker", level: 68, category: "devops" },
  ],

  projects: [
    {
      id: "xearn",
      name: "XEARN",
      description:
        "Plateforme panafricaine de micro-revenus digitaux. Tâches rémunérées, parrainage 3 niveaux, paiement Mobile Money (FedaPay), dashboard admin complet.",
      tech: ["Next.js 15", "React 19", "TypeScript", "NestJS", "Prisma", "PostgreSQL", "TailwindCSS", "NextAuth", "Docker"],
      github: "https://github.com/iruzen-dono/XEARN",
      live: "",
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
      year: 2026,
    },
    {
      id: "portfolio-terminal",
      name: "Portfolio Terminal",
      description:
        "Portfolio interactif style terminal Unix avec boot sequence, 35+ commandes, thèmes personnalisables, onboarding dynamique et détection hardware réelle.",
      tech: ["Next.js 14", "React 18", "TypeScript", "TailwindCSS", "Web Audio API", "Canvas API"],
      github: "",
      live: "",
      year: 2026,
    },
  ],

  experience: [
    {
      role: "Développeur Full-Stack Indépendant",
      company: "Projets personnels",
      period: "2026 — Présent",
      description:
        "Conception et développement de XEARN (plateforme de micro-revenus) et de portfolios interactifs. Architectures monorepo, sécurité avancée, intégrations paiement.",
    },
    {
      role: "Développeur Web PHP",
      company: "NovaShop Pro",
      period: "Janvier — Février 2026",
      description:
        "Développement complet d'une plateforme e-commerce PHP/MySQL avec panel admin, gestion de variantes produits, système de commandes et sécurité multi-couche.",
    },
    {
      role: "Étudiant — Travaux Pratiques",
      company: "Université",
      period: "Février 2026",
      description:
        "Projet universitaire RestaurantApp : application bureau Java SE avec Java Swing, MySQL, architecture MVC/DAO, gestion de stocks et commandes.",
    },
  ],

  contact: {
    email: "juleszhou01@gmail.com",
    github: "github.com/iruzen-dono",
    linkedin: "",
    twitter: "",
  },
};

export type PortfolioData = typeof portfolioData;
