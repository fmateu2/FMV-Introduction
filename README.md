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

The homepage is native React in `src/App.jsx`, using the original stylesheet in `src/style.css`. `src/usePortfolioEffects.js` manages scroll reveals, reduced motion, the mobile menu and email copying with effect cleanup.

The five original case studies remain HTML/JavaScript in `public/projects/`, with their original styles, diagrams, browser demos, CV and downloads in `public/`. Vite copies them into the production build without changing them. They have not yet been migrated to React components.

Recovery source: Site **Francesc Mateu Vallespín — AI, Data & Software**, saved version **17**, commit `082515b1e7bca9685392e5aa028de637085f78db`. The Site retains 17 saved versions. This local recovery does not change the hosted Site or publish to Vercel.

The previous React project is backed up in `.recovery/react-before-recovery/`. The retrieved original source and Git history are in `.recovery/original-site/`. Both are excluded from Git. `scripts/restore-original.mjs` records the one-time conversion and requires that local recovery source.

Run `node scripts/check-recovery.mjs` after building to check local links and compare recovered static assets with the source checkout when available.

No API credentials are required to run the portfolio. The project demos retain their original documented scope and limitations. Recovery preserves the version 17 publication files; it does not constitute a new audit of the downloadable projects or their external services.
