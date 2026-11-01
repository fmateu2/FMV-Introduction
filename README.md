# FMV Introduction

React + Vite portfolio for Francesc Mateu Vallespín, restored from the original ChatGPT Site rather than recreated from its appearance.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

## Build

```powershell
npm.cmd run build
npm.cmd run preview
```

## Recovered design

The homepage is native React in `src/App.jsx`, using the recovered foundation in `src/style.css` and the current visual refinements in `src/refinements.css`. `src/HeroArtwork.jsx` contains the animated orbital composition. The skills interlude uses sequential animated strokes instead of a scrolling ticker. CV links have been removed. `src/usePortfolioEffects.js` manages scroll reveals, reduced motion, the mobile menu and email copying with effect cleanup.

The five case studies remain HTML/JavaScript in `public/projects/`, with their diagrams, browser demos and downloads in `public/`. Their navigation labels and typography follow the homepage refinements through `public/refinements.css`, which mirrors `src/refinements.css`. Vite copies these files into the production build. They have not yet been migrated to React components.

Recovery source: Site **Francesc Mateu Vallespín — AI, Data & Software**, saved version **17**, commit `082515b1e7bca9685392e5aa028de637085f78db`. The Site retains 17 saved versions. This local recovery does not change the hosted Site or publish to Vercel.

The previous React project is backed up in `.recovery/react-before-recovery/`. The retrieved original source and Git history are in `.recovery/original-site/`. Both are excluded from Git. `scripts/restore-original.mjs` records the one-time conversion and requires that local recovery source; running it again overwrites subsequent design changes.

Run `node scripts/check-recovery.mjs` after building to check local links and compare recovered project assets with the source checkout when available.

No API credentials are required to run the portfolio. The project demos retain their original documented scope and limitations. Recovery preserves the version 17 publication files; it does not constitute a new audit of the downloadable projects or their external services.
