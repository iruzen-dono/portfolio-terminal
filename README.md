# 💻 Portfolio Terminal

Un portfolio interactif sous forme de terminal, construit avec **Next.js 14**, **React 18**, **TypeScript** et **Tailwind CSS**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fonctionnalités

### 🖥️ Mode Terminal
- **30+ commandes** : `help`, `about`, `skills`, `projects`, `experience`, `contact`, `neofetch`, `cowsay`, `hack`…
- **Système de fichiers virtuel** : `ls`, `cd`, `cat`, `tree`, `grep`, `pwd`
- **8 thèmes** : changez avec `theme <name>`
- **Auto-complétion** (Tab) et **historique** (flèches ↑↓)
- **Effets sonores** activables avec `sound on`
- **Easter eggs** : Konami code, `sudo hire-me`, `matrix`, `sl`…

### 🎨 Mode GUI
- Interface portfolio classique avec navigation fluide
- **Scroll reveal** animé sur chaque section
- **Typewriter effect** sur le nom dans le hero
- Compétences groupées par catégorie avec icônes
- Timeline d'expérience avec ligne gradient
- Contact avec icônes SVG (GitHub, Email, LinkedIn, X)

### 🌍 Bilingue (fr/en)
- Commande `lang fr` / `lang en` pour basculer
- Traduction complète du terminal et du GUI

### 📊 Analytics & Stats
- `stats` — Statistiques GitHub (repos, langages, compétences)
- `analytics` — Analytique de session locale (top commandes, nombre de sessions)
- Stockage anonyme en localStorage, aucun service externe

### 📱 Mobile-first
- Barre de commandes rapides pour mobile
- Boutons historique ▲▼ et envoi ⏎
- Gestion du viewport avec `visualViewport` API

### 🔄 Transition animée
- Overlay avec animation de points lors du switch Terminal ↔ GUI

## 🚀 Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/iruzen-dono/portfolio-terminal.git
cd portfolio-terminal

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## 📁 Structure du projet

```
src/
├── app/
│   ├── globals.css       # Thèmes, animations, styles mobile
│   ├── layout.tsx        # Layout racine
│   └── page.tsx          # Orchestration boot → terminal → GUI
├── components/
│   ├── BootSequence.tsx  # Animation de démarrage
│   ├── GUIMode.tsx       # Interface portfolio classique
│   ├── MatrixRain.tsx    # Effet Matrix (thème)
│   └── Terminal.tsx      # Terminal interactif principal
└── lib/
    ├── analytics.ts      # Tracking anonyme localStorage
    ├── commands.tsx       # Moteur de commandes (30+)
    ├── confetti.ts       # Effet confetti
    ├── data.ts           # Données du portfolio
    ├── fileSystem.ts     # Système de fichiers virtuel
    ├── i18n.ts           # Traductions fr/en
    ├── useKonami.ts      # Hook Konami code
    └── useSound.ts       # Hook effets sonores
```

## 🎮 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `help` | Liste toutes les commandes |
| `about` | À propos de moi |
| `skills` | Compétences techniques |
| `projects` | Parcourir mes projets |
| `open <id>` | Détails d'un projet |
| `experience` | Parcours professionnel |
| `contact` | Informations de contact |
| `theme <name>` | Changer de thème (8 au choix) |
| `gui` | Basculer en mode GUI |
| `lang fr\|en` | Changer la langue |
| `stats` | Statistiques GitHub |
| `analytics` | Analytique de session |
| `neofetch` | Infos système style |
| `hack` | Essayez… 👀 |
| `sudo hire-me` | Vous savez quoi faire |

## 🛠️ Technologies

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript 5.4
- **Style** : Tailwind CSS 3.4
- **Déploiement** : Vercel

## 📄 License

MIT — libre d'utilisation et de modification.

---

Créé avec ❤️ par [Jules Zhou](https://github.com/iruzen-dono)
