import type { Metadata } from "next";
import s from "./profil.module.css";

export const metadata: Metadata = {
  title: "Profil — Jules Zhou, étudiant IA & Big Data, développeur full-stack",
  description:
    "Profil de Jules Zhou, étudiant en licence Intelligence Artificielle & Big Data à Lomé, développeur full-stack : projets livrés, contributions open source et CV téléchargeable. Recherche de stage.",
  alternates: { canonical: "https://portfolio-terminal-lake.vercel.app/profil" },
  robots: { index: true, follow: true },
};

const EMAIL = "juleszhou01@gmail.com";
const PHONE = "+228 70 41 88 80";
const GITHUB = "https://github.com/iruzen-dono";

const figures = [
  { value: "21", label: "pull requests mergées en open source" },
  { value: "19", label: "dépôts externes contribués" },
  { value: "5", label: "produits web en production" },
  { value: "2", label: "paquets publiés sur PyPI" },
];

const projects = [
  {
    title: "XEARN",
    href: GITHUB + "/XEARN",
    period: "2026 — en cours",
    body:
      "Plateforme panafricaine de micro-revenus numériques, en monorepo : plus de 40 endpoints API, suite de tests automatisés, gamification, panneau d'administration.",
    tags: "NestJS 11 · Next.js 15 · Expo · PostgreSQL",
  },
  {
    title: "Project Oracle",
    href: GITHUB + "/project-oracle",
    period: "2026 — en cours",
    body:
      "Outil en ligne de commande qui audite la documentation de contexte d'un projet destinée aux agents IA : détecte les règles que le code contredit, génère AGENTS.md / CLAUDE.md et fait échouer l'intégration continue en cas de dérive.",
    tags: "Python sans dépendance · 28 langages · PyPI",
  },
  {
    title: "memory-vault",
    href: GITHUB + "/memory-vault",
    period: "2026 — en cours",
    body:
      "Format et outil qui empaquettent une session d'agent IA en un fichier de contexte portable, réutilisable d'un modèle et d'une machine à l'autre.",
    tags: "Python · PyPI · 6 outils exposés",
  },
  {
    title: "Workless",
    href: GITHUB + "/workless",
    period: "2026 — en cours",
    body:
      "Moteur d'automatisation auto-hébergé : éditeur visuel, exécution de graphes de tâches, webhooks et ordonnancement — une alternative installable à Zapier ou Make.",
    tags: "Laravel 11 · Next.js 15 · PostgreSQL · Redis",
  },
];

const skills = [
  ["Langages", "TypeScript, Python, JavaScript, SQL, Java, PHP, HTML/CSS"],
  ["Web", "React 19, Next.js 16, TailwindCSS, Node.js, NestJS, Express, Laravel, Spring Boot"],
  ["Données", "PostgreSQL, MySQL, SQLite, Drizzle ORM, Prisma, Redis"],
  ["IA & agents", "Intégration de modèles de langage, appels d'outils, RAG, serveurs MCP, fiabilité des agents"],
  ["Outils", "Git, GitHub Actions, CI/CD, Docker, Linux, Vercel, Cloudflare, tests automatisés"],
];

const education = [
  {
    title: "Licence Intelligence Artificielle & Big Data",
    org: "Ascencia Keyce Togo, Lomé",
    period: "2026 — en cours",
    body: "Troisième année. Machine learning, traitement de données massives, Python, bases de données.",
  },
  {
    title: "Deux années d'études supérieures en Informatique & Génie Logiciel",
    org: "Collège de Paris Supérieur, Lomé",
    period: "2023 — 2025",
    body: "Algorithmique, programmation orientée objet (Java), bases de données relationnelles, génie logiciel.",
  },
  {
    title: "Baccalauréat série C",
    org: "Mathématiques et sciences physiques",
    period: "2023",
    body: "",
  },
];

export default function Profil() {
  return (
    <main className={s.page}>
      <div className={s.sheet}>
        <nav className={s.topbar}>
          <span>Profil · CV</span>
          <span>
            <a href="/">portfolio interactif →</a>
          </span>
        </nav>

        <header>
          <h1 className={s.name}>Jules Zhou</h1>
          <p className={s.role}>
            Étudiant en licence Intelligence Artificielle &amp; Big Data · développeur full-stack
          </p>
          <div className={s.contact}>
            <span>Lomé, Togo</span>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">
              github.com/iruzen-dono
            </a>
          </div>

          <p className={s.seeking}>
            <strong>Recherche de stage</strong> — période et durée à convenir avec l&apos;établissement.
            Disponible sur place à Lomé ou à distance.
          </p>

          <div className={s.actions}>
            <a className={`${s.btn} ${s.btnSolid}`} href="/resume.pdf" download>
              Télécharger le CV (PDF, 1 page)
            </a>
            <a className={s.btn} href="/resume-en.pdf" download>
              CV en anglais
            </a>
            <a className={s.btn} href={GITHUB} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>

          <p className={s.summary}>
            Je conçois et mets en production des applications web complètes — base de données, API,
            interface, paiement — et je publie des outils open source en Python. Côté open source,
            21 pull requests ont été mergées dans 19 dépôts externes, dont Medusa, neo.mjs, NVIDIA et
            Meta Prophet : à chaque fois une correction ciblée, un test de non-régression et la
            justification du correctif dans le fil de revue.
          </p>

          <div className={s.figures}>
            {figures.map((f) => (
              <div key={f.label} className={s.figure}>
                <div className={s.figureValue}>{f.value}</div>
                <div className={s.figureLabel}>{f.label}</div>
              </div>
            ))}
          </div>
        </header>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>Projets</h2>
          {projects.map((p) => (
            <article key={p.title} className={s.item}>
              <div className={s.itemMeta}>{p.period}</div>
              <div>
                <h3 className={s.itemTitle}>
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    {p.title}
                  </a>
                </h3>
                <p className={s.itemBody}>{p.body}</p>
                <p className={s.tags}>{p.tags}</p>
              </div>
            </article>
          ))}
          <article className={s.item}>
            <div className={s.itemMeta}>2024 — en cours</div>
            <div>
              <h3 className={s.itemTitle}>Quotask · LandlordKit · TradeQuote</h3>
              <p className={s.itemBody}>
                Trois SaaS développés et exploités de bout en bout : devis freelances avec signature
                électronique et paiement en ligne, gestion locative avec portail locataire et loyers
                récurrents, devis pour artisans avec acceptation en ligne. Le code de ces trois
                produits est privé ; une démonstration peut être faite sur demande.
              </p>
              <p className={s.tags}>Next.js 16 · Drizzle · PostgreSQL · Stripe</p>
            </div>
          </article>
        </section>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>Compétences</h2>
          <dl className={s.skills}>
            {skills.map(([label, detail]) => (
              <div key={label} style={{ display: "contents" }}>
                <dt>{label}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>Formation</h2>
          {education.map((e) => (
            <article key={e.title} className={s.item}>
              <div className={s.itemMeta}>{e.period}</div>
              <div>
                <h3 className={s.itemTitle}>{e.title}</h3>
                <p className={s.itemBody}>
                  {e.org}
                  {e.body ? " — " + e.body : ""}
                </p>
              </div>
            </article>
          ))}
        </section>

        <footer className={s.foot}>
          <span>
            Contact : <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · {PHONE}
          </span>
          <span>
            <a href="/resume.pdf" download>
              CV (FR)
            </a>{" "}
            ·{" "}
            <a href="/resume-en.pdf" download>
              CV (EN)
            </a>{" "}
            ·{" "}
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </span>
        </footer>
      </div>
    </main>
  );
}
