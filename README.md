# srinidevops.com

Portfolio for Srinivasan Vijayaraghavan — DevOps / SRE.

Next.js 14 (App Router), statically exported (`output: "export"`) and
served from GitHub Pages at the custom domain in `public/CNAME`.

## Local

```
npm install     # first run: commit the package-lock.json it produces
npm run dev
npm run build   # static export -> out/
npm run typecheck
```

## Deploy

`.github/workflows/deploy.yml` builds on every push to `main` and
publishes `out/` via `actions/deploy-pages`. Pages must be set to
**Settings → Pages → Source → GitHub Actions** (not "deploy from a
branch"), or the workflow's artifact is built and then ignored.

Two things the build depends on and neither is obvious:

- `public/CNAME` is what keeps the custom domain attached. An Actions
  deploy replaces the whole site, so a missing CNAME silently drops the
  domain back to `srinivasan-78.github.io`.
- `touch out/.nojekyll` in the workflow. Pages skips any directory
  starting with `_`, which would mean the entire `_next/` bundle.

Direct dependencies are pinned to exact versions. Once
`package-lock.json` is committed the workflow uses `npm ci`; until then
it falls back to `npm install` and logs a warning.

## Structure

```
public/                 CNAME, favicons, og.png, resume.pdf, stock imagery
app/
  layout.tsx            nav, footer, JSON-LD, theme script, motion chrome
  page.tsx              home — hero, stats, availability, selected work
  experience/page.tsx   roles, dates, education
  projects/page.tsx     project index (grouped, hover schematics)
  projects/[slug]/      one static page per project
  certifications/       22 credentials, WebGL card deck
  contact/page.tsx      Formspree form + direct channels
  globals.css           design tokens, light/dark
  robots.ts, sitemap.ts generated at build time from lib/projects.ts
components/             chrome + page sections
lib/
  projects.ts           single source of truth for projects & the sitemap
  certs.ts              credential list
  diagrams.tsx          line-art schematics keyed by project title
```

## Conventions

- Counts shown in copy are derived (`PROJECTS.length`, `CERTS.length`),
  never typed by hand — they used to drift.
- Anything animated must render its true value in the server HTML first.
  Scrapers, link unfurls, and resume parsers read that markup, so a
  counter seeded at 0 publishes "0 certifications".
- Schematics in `lib/diagrams.tsx` use `currentColor` and real stroke
  geometry so they inherit the theme and can be dash-animated on hover.
