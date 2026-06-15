"use client";

/* ─────────────────────────────────────────────────────
   GUI Mode – Brutalist monochrome portfolio layout.
   Accessible via the "gui" command in the terminal.
   ───────────────────────────────────────────────────── */

import { useState, useEffect, useRef, useCallback } from "react";
import { usePortfolio } from "@/lib/PortfolioContext";
import { t, getCategoryLabel, getNavLabel, type Lang } from "@/lib/i18n";

/* ── Typewriter hook ────────────────────────────────── */
function useTypewriter(text: string, speed = 90) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(iv);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);

  return { displayed, done };
}

/* ── Scroll reveal hook ─────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Category labels ────────────────────────────────── */
const CATEGORY_LABELS: Record<string, string> = {
  language: "{}",
  frontend: "</>",
  backend: "#->",
  database: "[_]",
  tools: "&&",
  devops: "||",
};

interface GUIModeProps {
  onTerminalSwitch: () => void;
  lang: Lang;
  theme: string;
  onThemeChange: (t: string) => void;
}

const VALID_THEMES = ["dark", "light", "terminal"];

export default function GUIMode({ onTerminalSwitch, lang, theme, onThemeChange }: GUIModeProps) {
  const { data: portfolioData } = usePortfolio();
  const { name, title, location, bio, skills, projects, experience, contact } =
    portfolioData;

  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [filterTech, setFilterTech] = useState<string | null>(null);

  /* ── All unique techs for project filtering ─────────── */
  const allTechs = [...new Set(projects.flatMap((p) => p.tech))].sort();

  /* ── Filtered projects ──────────────────────────────── */
  const filteredProjects = filterTech
    ? projects.filter((p) => p.tech.includes(filterTech))
    : projects;

  /* ── Track scroll ──────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["about", "skills", "projects", "experience", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* ── Group skills ──────────────────────────────────── */
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      const cat = skill.category || "other";
      (acc[cat] = acc[cat] || []).push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>
  );

  const navSections = ["about", "skills", "projects", "experience", "contact"];

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNav(false);
  }, []);

  /* ── Typewriter for hero name ─────────────────────── */
  const { displayed: typedName, done: typeDone } = useTypewriter(name, 90);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-y-auto scroll-smooth">
      {/* ── Navbar ────────────────────────────────────── */}
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[var(--text)] tracking-tight text-sm font-bold hover:text-[var(--text-secondary)] transition-colors"
          >
            {name.split(" ")[0]}
            <span className="text-[var(--text-dim)]">.</span>
          </button>

          {/* desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navSections.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className={`text-xs uppercase tracking-widest px-3 py-1.5 transition-all ${
                  activeSection === s
                    ? "text-[var(--text)] font-bold"
                    : "text-[var(--text-dim)] hover:text-[var(--text)]"
                }`}
              >
                {getNavLabel(s, lang)}
              </button>
            ))}
            {/* theme toggle */}
            <div className="ml-4 flex items-center gap-0.5 border-l border-[var(--border)] pl-4">
              {VALID_THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => onThemeChange(t)}
                  className={`text-[10px] uppercase tracking-widest px-1.5 py-1 transition-all ${
                    theme === t
                      ? "text-[var(--text)] font-bold"
                      : "text-[var(--text-dim)] hover:text-[var(--text)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={onTerminalSwitch}
              className="ml-4 text-xs px-3 py-1.5 border border-[var(--text-dim)] text-[var(--text-dim)] hover:border-[var(--text)] hover:text-[var(--text)] transition-colors font-mono"
            >
              &gt;_
            </button>
          </div>

          {/* mobile hamburger */}
          <button
            className="md:hidden text-[var(--text)] text-lg leading-none p-1"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            {mobileNav ? "x" : "="}
          </button>
        </div>

        {/* mobile menu */}
        {mobileNav && (
          <div className="md:hidden border-t border-[var(--border)] px-6 py-4 space-y-2">
            {navSections.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className="block w-full text-left text-sm px-2 py-2 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
              >
                {getNavLabel(s, lang)}
              </button>
            ))}
            {/* mobile theme toggle */}
            <div className="flex gap-1 px-2 py-2 border-t border-[var(--border)] mt-2 pt-3">
              {VALID_THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => onThemeChange(t)}
                  className={`text-[10px] uppercase tracking-widest px-2 py-1 transition-all ${
                    theme === t
                      ? "text-[var(--text)] font-bold"
                      : "text-[var(--text-dim)] hover:text-[var(--text)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={onTerminalSwitch}
              className="block w-full text-left text-xs px-2 py-2 text-[var(--text-dim)] font-mono"
            >
              &gt;_ Terminal Mode
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-36">
        <div className="max-w-4xl">
          <p className="text-[var(--text-dim)] text-xs font-mono mb-6 tracking-[0.3em] uppercase">
            {t("heroGreeting", lang)}
          </p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6">
            {typedName}
            {!typeDone && <span className="typewriter-cursor">&nbsp;</span>}
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-[var(--text-secondary)] mb-3 font-light">
            {lang === "fr" ? title : "Full-Stack Developer"}
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a
              href={`mailto:${contact.email}`}
              className="text-sm px-6 py-2.5 bg-[var(--text)] text-[var(--bg)] font-bold hover:opacity-80 transition-opacity"
            >
              {t("contactBtn", lang)}
            </a>
            {contact.github && (
              <a
                href={contact.github.startsWith("http") ? contact.github : `https://${contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-6 py-2.5 border border-[var(--border)] text-[var(--text)] font-bold hover:border-[var(--text)] transition-colors"
              >
                GitHub
              </a>
            )}
            <button
              onClick={onTerminalSwitch}
              className="text-sm px-6 py-2.5 border border-[var(--border)] text-[var(--text-dim)] font-mono hover:border-[var(--text)] hover:text-[var(--text)] transition-colors"
            >
              &gt;_ Terminal
            </button>
          </div>
          <p className="mt-12 text-[var(--text-dim)] text-xs font-mono">
            {location}
          </p>
        </div>
      </section>

      {/* ── About ────────────────────────────────────── */}
      <Section id="about" className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="gui-section-title">{t("aboutTitle", lang)}</p>
          <div className="max-w-3xl">
            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-base sm:text-lg">
              {bio.map((line, i) => (
                <p key={i}>{line || "\u00A0"}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Skills ───────────────────────────────────── */}
      <Section id="skills" className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="gui-section-title">{t("skillsTitle", lang)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {Object.entries(groupedSkills).map(([cat, catSkills]) => (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[var(--text-dim)] text-xs font-mono">
                    {CATEGORY_LABELS[cat] || "~"}
                  </span>
                  <span className="text-[var(--text-dim)] text-xs uppercase tracking-widest">
                    {getCategoryLabel(cat, lang)}
                  </span>
                </div>
                <div className="space-y-3">
                  {catSkills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text)]">
                          {skill.name}
                        </span>
                        <span className="text-[var(--text-dim)] font-mono text-xs">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-px bg-[var(--border)] w-full">
                        <div
                          className="h-full bg-[var(--text)] transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Projects ─────────────────────────────────── */}
      <Section id="projects" className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="gui-section-title">{t("projectsTitle", lang)}</p>

          {/* tech filter pills */}
          <div className="flex flex-wrap gap-1.5 mb-8 mt-4">
            <button
              onClick={() => setFilterTech(null)}
              className={`text-xs px-2.5 py-1 border font-mono transition-colors ${
                filterTech === null
                  ? "border-[var(--text)] text-[var(--text)]"
                  : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--text)] hover:text-[var(--text)]"
              }`}
            >
              all
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setFilterTech(filterTech === tech ? null : tech)}
                className={`text-xs px-2.5 py-1 border font-mono transition-colors ${
                  filterTech === tech
                    ? "border-[var(--text)] text-[var(--text)]"
                    : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--text)] hover:text-[var(--text)]"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border)]">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="bg-[var(--bg)] p-6 sm:p-8 hover:bg-[var(--surface)] transition-colors duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)]">
                      {p.name}
                    </h3>
                    <span className="text-[var(--text-dim)] text-xs font-mono">
                      {p.year}
                    </span>
                  </div>
                </div>
                {p.image && (
                  <div className="mb-3 border border-[var(--border)] overflow-hidden rounded bg-[var(--surface)]">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-auto object-cover block"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 border border-[var(--border)] text-[var(--text-dim)] font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-xs">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text)] hover:underline underline-offset-4 font-bold"
                    >
                      {t("sourceCode", lang)}
                    </a>
                  )}
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-dim)] hover:text-[var(--text)] hover:underline underline-offset-4 transition-colors"
                    >
                      {t("liveDemo", lang)}
                    </a>
                  )}
                  {!p.github && !p.live && (
                    <span className="text-[var(--text-dim)] italic">
                      {t("inDev", lang)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Experience ───────────────────────────────── */}
      <Section id="experience" className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="gui-section-title">{t("experienceTitle", lang)}</p>
          <div className="max-w-3xl space-y-0">
            {experience.map((exp, i) => (
              <div key={i} className="flex group">
                <div className="flex flex-col items-center mr-6">
                  <div className="timeline-dot group-hover:timeline-dot-active transition-colors mt-1.5" />
                  {i < experience.length - 1 && (
                    <div className="w-px flex-1 bg-[var(--border)] mt-2" />
                  )}
                </div>
                <div className="pb-10">
                  <p className="text-xs text-[var(--text-dim)] font-mono mb-1">
                    {exp.period}
                  </p>
                  <p className="font-bold text-lg text-[var(--text)]">
                    {exp.role}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    {exp.company}
                  </p>
                  <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Contact ──────────────────────────────────── */}
      <Section id="contact" className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="gui-section-title">{t("contactTitle", lang)}</p>
            <p className="text-[var(--text-secondary)]">
              {t("contactSubtitle", lang)}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto">
            {/* Email */}
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 px-5 py-3 border border-[var(--border)] hover:border-[var(--text)] transition-colors group"
            >
              <span className="text-[var(--text)] text-sm font-bold group-hover:opacity-80">
                Email
              </span>
              <span className="text-[var(--text-dim)] text-sm">
                {contact.email}
              </span>
            </a>

            {/* GitHub */}
            {contact.github && (
              <a
                href={contact.github.startsWith("http") ? contact.github : `https://${contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 border border-[var(--border)] hover:border-[var(--text)] transition-colors group"
              >
                <span className="text-[var(--text)] text-sm font-bold group-hover:opacity-80">
                  GitHub
                </span>
                <span className="text-[var(--text-dim)] text-sm">
                  @{contact.github.replace("github.com/", "")}
                </span>
              </a>
            )}

            {/* LinkedIn */}
            {contact.linkedin && (
              <a
                href={`https://${contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 border border-[var(--border)] hover:border-[var(--text)] transition-colors group"
              >
                <span className="text-[var(--text)] text-sm font-bold group-hover:opacity-80">
                  LinkedIn
                </span>
                <span className="text-[var(--text-dim)] text-sm">
                  {contact.linkedin.replace("linkedin.com/in/", "@")}
                </span>
              </a>
            )}
          </div>
        </div>
      </Section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-[var(--text-dim)]">
          <p>
            {t("footerBuilt", lang)}
          </p>
          <button
            onClick={onTerminalSwitch}
            className="font-mono hover:text-[var(--text)] transition-colors"
          >
            &gt;_ Terminal
          </button>
        </div>
      </footer>
    </div>
  );
}
