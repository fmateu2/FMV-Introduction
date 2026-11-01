# Francesc Mateu Vallespín — Portfolio

Personal portfolio of an Artificial Intelligence & Data Science student at La Salle Barcelona, currently on a Computer Science exchange at Manhattan University in New York.

Open to internships in software engineering, AI and data across industries. Finance and fintech are medium-term interests.

## Selected projects

1. [Citadel System](https://github.com/fmateu2/citadel-system) — C, POSIX processes, threads and TCP communication.
2. [WearWise](https://github.com/fmateu2/wearwise) — AI-assisted garment extraction, MongoDB and explicit recommendation rules.
3. [Nude Eye](https://github.com/fmateu2/nude-eye) — Java domain modelling and interchangeable persistence.
4. [Environmental Data Analytics](https://github.com/fmateu2/environmental-data-analytics) — Oracle SQL, relational modelling and database triggers.
5. [Verity](https://github.com/fmateu2/verity) — an educational machine learning experiment and browser interface.

These are collaborative academic projects. Their pages and documentation preserve team credits, explain the available demos and distinguish verified behaviour from remaining limitations.

## Run locally

The website is prebuilt static HTML, CSS and JavaScript. No Node.js installation, database or API key is needed to serve it.

```bash
python -m http.server 8000 --directory dist
```

Open http://localhost:8000.

## Structure

| Path | Purpose |
| --- | --- |
| `dist/` | Deployable website, CV, diagrams and downloadable project packages |
| `scripts/` | Page generators, package builders and publication checks |
| `projects/` | Selected project snapshots used by generators and downloads |
| `docs/download-files.json` | Allowlist of files included in project downloads |
| `vercel.json` | Static hosting configuration, serving `dist/` |

## Deploy on Vercel

Import this repository in the intended Vercel account. The included configuration uses the **Other** framework preset, no install/build command and **dist** as the output directory. No runtime secrets are required for the portfolio.

After assigning the final public hostname, regenerate pages with `PORTFOLIO_ORIGIN` set to that HTTPS origin so canonical and social-sharing links use the public address. Metadata retains the previous preview address until that hostname is known. Add the final URL to the CV before the final public release.

## Rebuild and check

Python 3 and the authoring dependencies Pillow, PyMuPDF and ReportLab are required for full regeneration. The CV generator additionally expects DejaVu fonts; its Linux font paths may need adapting on other systems. Node.js is needed only for the optional WearWise parity check.

```bash
python scripts/build-pages.py
python scripts/build-cv.py
python scripts/package-citadel.py
python scripts/package-wearwise.py
python scripts/package-nude-eye.py
python scripts/package-environment.py
python scripts/package-verity.py
python scripts/check-site.py
python scripts/check-publication.py
```

The original project applications have separate requirements. Some need local services or separately authorized dependencies. Their READMEs document those boundaries; the portfolio runs independently.

## Credentials and provenance

Keep credentials, environment files, provider account state and private keys out of Git. Blank `.env.example` files are illustrative templates.

Project reports and source retain their authorship credits and existing reuse terms. No new licence is assigned to third-party course libraries or jointly authored academic work.
