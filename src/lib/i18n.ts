/* ─────────────────────────────────────────────────────
   i18n – French / English translations for both
   terminal and GUI modes.
   ───────────────────────────────────────────────────── */

export type Lang = "fr" | "en";

const translations = {
  /* ── GUI ────────────────────────────────────────── */
  heroGreeting: { fr: "Salut, je suis", en: "Hi, I'm" },
  heroSubtitle: { fr: "Développeur Full-Stack", en: "Full-Stack Developer" },
  contactBtn: { fr: "Me contacter", en: "Contact Me" },
  aboutTitle: { fr: "À propos", en: "About" },
  skillsTitle: { fr: "Compétences", en: "Skills" },
  projectsTitle: { fr: "Projets", en: "Projects" },
  experienceTitle: { fr: "Expérience", en: "Experience" },
  contactTitle: { fr: "Contact", en: "Contact" },
  contactSubtitle: {
    fr: "Un projet en tête ? N'hésitez pas à me contacter.",
    en: "Have a project in mind? Don't hesitate to reach out.",
  },
  footerBuilt: {
    fr: "Built with Next.js & Tailwind CSS",
    en: "Built with Next.js & Tailwind CSS",
  },
  terminalMode: { fr: "Mode Terminal", en: "Terminal Mode" },
  inDev: { fr: "En cours de développement", en: "Work in progress" },
  sourceCode: { fr: "Code source", en: "Source code" },
  liveDemo: { fr: "Démo live", en: "Live Demo" },

  /* ── Nav sections ──────────────────────────────── */
  navAbout: { fr: "À propos", en: "About" },
  navSkills: { fr: "Compétences", en: "Skills" },
  navProjects: { fr: "Projets", en: "Projects" },
  navExperience: { fr: "Expérience", en: "Experience" },
  navContact: { fr: "Contact", en: "Contact" },

  /* ── Skill categories ──────────────────────────── */
  catLanguage: { fr: "Langages", en: "Languages" },
  catFrontend: { fr: "Frontend", en: "Frontend" },
  catBackend: { fr: "Backend", en: "Backend" },
  catDatabase: { fr: "Bases de données", en: "Databases" },
  catTools: { fr: "Outils", en: "Tools" },
  catDevops: { fr: "DevOps", en: "DevOps" },

  /* ── Terminal ──────────────────────────────────── */
  welcomeMsg: {
    fr: "Bienvenue dans mon terminal portfolio interactif.",
    en: "Welcome to my interactive portfolio terminal.",
  },
  welcomeHelp: {
    fr: "Tapez {cmd} pour voir les commandes disponibles.",
    en: "Type {cmd} to see available commands.",
  },
  welcomeTip: {
    fr: "Astuce : Flèches pour l'historique · Tab pour l'auto-complétion · Ctrl+L pour effacer",
    en: "Tip: Use arrows for history · Tab for autocomplete · Ctrl+L to clear",
  },
  langSwitched: {
    fr: "Langue changée en français.",
    en: "Language switched to English.",
  },
  langUsage: {
    fr: "Usage : lang fr | lang en",
    en: "Usage: lang fr | lang en",
  },
  statsLoading: {
    fr: "Chargement des statistiques GitHub...",
    en: "Loading GitHub statistics...",
  },
  statsError: {
    fr: "Erreur lors du chargement des stats GitHub.",
    en: "Error loading GitHub stats.",
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}

/* Category labels by language */
export function getCategoryLabel(cat: string, lang: Lang): string {
  const map: Record<string, TranslationKey> = {
    language: "catLanguage",
    frontend: "catFrontend",
    backend: "catBackend",
    database: "catDatabase",
    tools: "catTools",
    devops: "catDevops",
  };
  return map[cat] ? t(map[cat], lang) : cat;
}

/* Nav section label by language */
export function getNavLabel(section: string, lang: Lang): string {
  const map: Record<string, TranslationKey> = {
    about: "navAbout",
    skills: "navSkills",
    projects: "navProjects",
    experience: "navExperience",
    contact: "navContact",
  };
  return map[section] ? t(map[section], lang) : section;
}
