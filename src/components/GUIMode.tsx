"use client";

/* ─────────────────────────────────────────────────────
   GUI Mode – polished portfolio layout accessible
   via the "gui" command in the terminal.
   ───────────────────────────────────────────────────── */

import { useState, useEffect, useRef, useCallback } from "react";
import { usePortfolio } from "@/lib/PortfolioContext";
import { t, getCategoryLabel, getNavLabel, type Lang } from "@/lib/i18n";

/* ── Typewriter hook ────────────────────────────────── */
function useTypewriter(text: string, speed = 80) {
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
      { threshold: 0.15 }
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
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Category labels ────────────────────────────────── */
// Category labels now come from i18n.ts via getCategoryLabel()

const CATEGORY_ICONS: Record<string, string> = {
  language: "{ }",
  frontend: "</>",
  backend: "⚙",
  database: "⛁",
  tools: "⚒",
  devops: "☁",
};

interface GUIModeProps {
  onTerminalSwitch: () => void;
  lang: Lang;
}

export default function GUIMode({ onTerminalSwitch, lang }: GUIModeProps) {
  const { data: portfolioData } = usePortfolio();
  const { name, title, location, bio, skills, projects, experience, contact } =
    portfolioData;

  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  /* ── Track scroll for navbar shadow & active section ─ */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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

  /* ── Group skills by category ─────────────────────── */
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
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
          scrolled
            ? "border-[var(--border)] shadow-lg shadow-black/20"
            : "border-transparent"
        }`}
        style={{ backgroundColor: scrolled ? "rgba(26,26,46,0.92)" : "transparent" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[var(--prompt)] font-bold text-lg hover:opacity-80 transition-opacity"
          >
            {name.split(" ")[0]}
            <span className="text-[var(--accent)]">.</span>
          </button>

          {/* desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navSections.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className={`text-sm capitalize px-3 py-1.5 rounded-md transition-all ${
                  activeSection === s
                    ? "text-[var(--prompt)] bg-[var(--prompt)]/10"
                    : "text-[var(--text)] opacity-60 hover:opacity-100 hover:text-[var(--prompt)]"
                }`}
              >
                {getNavLabel(s, lang)}
              </button>
            ))}
            <button
              onClick={onTerminalSwitch}
              className="ml-4 text-xs px-4 py-2 rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all font-mono"
            >
              &gt;_ Terminal
            </button>
          </div>

          {/* mobile hamburger */}
          <button
            className="md:hidden text-[var(--text)] text-2xl leading-none p-2"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            {mobileNav ? "✕" : "☰"}
          </button>
        </div>

        {/* mobile menu */}
        {mobileNav && (
          <div className="md:hidden border-t border-[var(--border)] px-6 py-4 space-y-1 animate-fade-in" style={{ backgroundColor: "rgba(26,26,46,0.97)" }}>
            {navSections.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className="block w-full text-left text-sm capitalize px-3 py-2.5 rounded-md hover:text-[var(--prompt)] hover:bg-[var(--prompt)]/10 transition-all"
              >
                {getNavLabel(s, lang)}
              </button>
            ))}
            <button
              onClick={onTerminalSwitch}
              className="block w-full text-left text-xs px-3 py-2.5 text-[var(--accent)] font-mono"
            >
              &gt;_ Terminal Mode
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-32 relative">
        {/* Decorative gradient orbs */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "var(--prompt)" }} />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "var(--accent)" }} />

        <div className="relative">
          <p className="text-[var(--prompt)] text-sm font-mono mb-4 tracking-widest uppercase animate-fade-in">
            {t("heroGreeting", lang)}
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 gui-gradient-text" style={{ animationDelay: "0.1s" }}>
            {typedName}
            {!typeDone && <span className="typewriter-cursor">&nbsp;</span>}
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-[var(--accent)] mb-3 animate-fade-in font-light" style={{ animationDelay: "0.2s" }}>
            {lang === "fr" ? title : "Full-Stack Developer"}
          </p>
          <p className="text-[var(--text)] opacity-50 mb-8 flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            {location}
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <a
              href={`mailto:${contact.email}`}
              className="group px-7 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg relative overflow-hidden"
              style={{ backgroundColor: "var(--prompt)", color: "var(--bg)" }}
            >
              <span className="relative z-10">{t("contactBtn", lang)}</span>
            </a>
            {contact.github && (
              <a
                href={contact.github.startsWith("http") ? contact.github : `https://${contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 rounded-xl border border-[var(--border)] hover:border-[var(--prompt)] hover:text-[var(--prompt)] transition-all hover:scale-105"
              >
                GitHub
              </a>
            )}
            <button
              onClick={onTerminalSwitch}
              className="px-7 py-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all hover:scale-105 font-mono text-sm"
            >
              &gt;_ Terminal
            </button>
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────── */}
      <Section id="about" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-start gap-6 max-w-3xl">
          <div className="hidden sm:block w-1 shrink-0 rounded-full self-stretch" style={{ background: "linear-gradient(to bottom, var(--prompt), var(--accent))" }} />
          <div>
            <h2 className="text-3xl font-bold text-[var(--prompt)] mb-6">
              {t("aboutTitle", lang)}
            </h2>
            <div className="text-[var(--text)] opacity-80 space-y-3 leading-relaxed text-lg">
              {bio.map((line, i) => (
                <p key={i}>{line || "\u00A0"}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Skills ───────────────────────────────────── */}
      <Section id="skills" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-[var(--prompt)] mb-10">
          {t("skillsTitle", lang)}
        </h2>
        <div className="space-y-10">
          {Object.entries(groupedSkills).map(([cat, catSkills]) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[var(--accent)] text-lg font-mono">
                  {CATEGORY_ICONS[cat] || "●"}
                </span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text)] opacity-50">
                  {getCategoryLabel(cat, lang)}
                </h3>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {catSkills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5 group">
                    <div className="flex justify-between text-sm">
                      <span className="group-hover:text-[var(--prompt)] transition-colors">
                        {skill.name}
                      </span>
                      <span className="text-[var(--prompt)] font-bold font-mono text-xs">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full skill-bar"
                        style={{
                          width: `${skill.level}%`,
                          background:
                            "linear-gradient(90deg, var(--prompt), var(--accent))",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Projects ─────────────────────────────────── */}
      <Section id="projects" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-[var(--prompt)] mb-10">
          {t("projectsTitle", lang)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div
              key={p.id}
              className={`gui-card border border-[var(--border)] rounded-2xl p-7 hover:border-[var(--accent)]/50 transition-all duration-300 group relative overflow-hidden ${
                i === 0 ? "md:col-span-2" : ""
              }`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124,58,237,0.06), transparent 40%)" }} />

              <div className="relative">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold shrink-0" style={{ backgroundColor: "var(--prompt)", color: "var(--bg)", opacity: 0.9 }}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-[var(--prompt)] transition-colors">
                        {p.name}
                      </h3>
                      <span className="text-xs text-[var(--text)] opacity-40">
                        {p.year}
                      </span>
                    </div>
                  </div>
                </div>
                <p className={`text-sm text-[var(--text)] opacity-70 mb-5 leading-relaxed ${i === 0 ? "max-w-2xl" : ""}`}>
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-md font-mono"
                      style={{ backgroundColor: "var(--accent)", color: "white", opacity: 0.7 }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[var(--prompt)] hover:underline underline-offset-4"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      {t("sourceCode", lang)}
                    </a>
                  )}
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[var(--success)] hover:underline underline-offset-4"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      {t("liveDemo", lang)}
                    </a>
                  )}
                  {!p.github && !p.live && (
                    <span className="text-xs text-[var(--text)] opacity-30 italic">
                      {t("inDev", lang)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Experience ───────────────────────────────── */}
      <Section id="experience" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-[var(--prompt)] mb-10">
          {t("experienceTitle", lang)}
        </h2>
        <div className="space-y-0 max-w-3xl relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--prompt)] via-[var(--border)] to-transparent" />

          {experience.map((exp, i) => (
            <div key={i} className="flex group">
              <div className="flex flex-col items-center mr-8 relative z-10">
                <div className="w-4 h-4 rounded-full border-2 border-[var(--prompt)] bg-[var(--bg)] mt-1 shrink-0 group-hover:bg-[var(--prompt)] transition-colors duration-300" />
              </div>
              <div className="pb-10">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono mb-2" style={{ backgroundColor: "var(--prompt)", color: "var(--bg)", opacity: 0.8 }}>
                  {exp.period}
                </div>
                <p className="font-bold text-lg text-[var(--text)] group-hover:text-[var(--prompt)] transition-colors">
                  {exp.role}
                </p>
                <p className="text-[var(--accent)] text-sm mb-2">
                  {exp.company}
                </p>
                <p className="text-sm text-[var(--text)] opacity-60 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Contact ──────────────────────────────────── */}
      <Section id="contact" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-[var(--prompt)] mb-4">
            {t("contactTitle", lang)}
          </h2>
          <p className="text-[var(--text)] opacity-50">
            {t("contactSubtitle", lang)}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {/* Email card */}
          <a
            href={`mailto:${contact.email}`}
            className="gui-card flex items-center gap-4 p-5 rounded-xl border border-[var(--border)] hover:border-[var(--prompt)] transition-all group"
          >
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--prompt)", color: "var(--bg)", opacity: 0.85 }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[var(--text)] opacity-40 uppercase tracking-wider">Email</p>
              <p className="text-sm text-[var(--prompt)] truncate group-hover:underline underline-offset-2">
                {contact.email}
              </p>
            </div>
          </a>

          {/* GitHub card */}
          {contact.github && (
            <a
              href={contact.github.startsWith("http") ? contact.github : `https://${contact.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gui-card flex items-center gap-4 p-5 rounded-xl border border-[var(--border)] hover:border-[var(--prompt)] transition-all group"
            >
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--prompt)", color: "var(--bg)", opacity: 0.85 }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--text)] opacity-40 uppercase tracking-wider">GitHub</p>
                <p className="text-sm text-[var(--prompt)] truncate group-hover:underline underline-offset-2">
                  {contact.github.replace("github.com/", "@")}
                </p>
              </div>
            </a>
          )}

          {/* LinkedIn card */}
          {contact.linkedin && (
            <a
              href={`https://${contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gui-card flex items-center gap-4 p-5 rounded-xl border border-[var(--border)] hover:border-[var(--prompt)] transition-all group"
            >
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--prompt)", color: "var(--bg)", opacity: 0.85 }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--text)] opacity-40 uppercase tracking-wider">LinkedIn</p>
                <p className="text-sm text-[var(--prompt)] truncate group-hover:underline underline-offset-2">
                  {contact.linkedin}
                </p>
              </div>
            </a>
          )}

          {/* Twitter card */}
          {contact.twitter && (
            <a
              href={`https://twitter.com/${contact.twitter.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gui-card flex items-center gap-4 p-5 rounded-xl border border-[var(--border)] hover:border-[var(--prompt)] transition-all group"
            >
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--prompt)", color: "var(--bg)", opacity: 0.85 }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--text)] opacity-40 uppercase tracking-wider">Twitter</p>
                <p className="text-sm text-[var(--prompt)] truncate group-hover:underline underline-offset-2">
                  {contact.twitter}
                </p>
              </div>
            </a>
          )}
        </div>
      </Section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] py-10 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text)] opacity-30 text-sm">
            © {new Date().getFullYear()} {name} — Built with Next.js & Tailwind CSS
          </p>
          <button
            onClick={onTerminalSwitch}
            className="group flex items-center gap-2 text-[var(--prompt)] opacity-50 hover:opacity-100 transition-all text-sm font-mono"
          >
            <span className="group-hover:translate-x-[-2px] transition-transform">&gt;_</span>
            {t("terminalMode", lang)}
          </button>
        </div>
      </footer>
    </div>
  );
}
