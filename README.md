# srinivasan-portfolio (Next.js)

Real portfolio for Srinivasan Vijayaraghavan, rebuilt from the existing
static site at `srinivasan-78.github.io` (custom domain
`www.srinidevops.com`, see `public/CNAME`) onto the motion-scaffold
(Lenis + GSAP ScrollTrigger, split-text reveals, inertia cursor,
scroll-progress rail) built earlier in this thread.

## Status: rebuilt, never run

No code sandbox was available while doing this rebuild either. Nothing
here was verified with `npm install` / `next dev` / `next build`.

## What changed from the static site

- Content, copy, résumé, certifications, project list, and role
  breakdowns are pulled directly from the uploaded `index.html`,
  `work.html`, `projects.html`, `experience.html`, `certifications.html`,
  `contact.html`, and `resume.pdf` — this is the user's own content, not
  a third party's, reproduced as-is rather than paraphrased.
- Color tokens, fonts, and the light/dark Instagram-inspired palette
  (`@handle` nav, avatar initial circle, sage/slate/plum/brass accents)
  come from the uploaded `styles.css` custom properties.
- The old vanilla-JS theme toggle / reveal-on-scroll / mobile nav
  (`app.js` + inline theme script) is replaced by the motion scaffold's
  React components: `ThemeToggle.tsx` (theme, same localStorage key
  and pre-paint inline script pattern as the original), `SplitReveal.tsx`
  (GSAP-driven headline reveals in place of the old `.reveal` class),
  `Cursor.tsx` / `ProgressRail.tsx` (new — not in the original site).
- Routing moves from flat `.html` files to Next.js App Router pages:
  `/`, `/work`, `/projects`, `/experience`, `/certifications`, `/contact`.
- The interactive lightbox on the old `work.html` and the filterable
  cert list on `certifications.html` were simplified to static
  cards/list — that JS behavior was not ported. Worth re-adding if the
  filtering and modal views matter.
- `public/` holds the real static assets copied over as-is: favicons,
  `og.png`, `resume.pdf`, `robots.txt`, `sitemap.xml`, `CNAME`.

## Deploying to srinivasan-78.github.io / srinidevops.com

Same as before — `next.config.mjs` has `output: "export"`, no
`basePath` needed (served at a domain root either way, via
`public/CNAME`). Push to `main`, set Pages source to **GitHub Actions**,
and `.github/workflows/deploy.yml` builds and publishes `out/`.

## Likely first-boot issues

- **Dependency drift** — same caveat as before; nothing pinned here has
  been installed or run.
- **Contact form** — points at the same Formspree endpoint
  (`xrpzzlaz`) as the original `contact.html`. Confirm that endpoint is
  still owned/active before relying on it.
- **Fonts** — `--font-display: 'Iowan Old Style', ...` is a
  macOS-only serif with web fallbacks already chained in the token;
  no `next/font` wiring was added, same gap as the original static site.
- **Certifications & Work pages** are simplified from the original's
  interactive filter/lightbox — see above.
- **SplitReveal on multi-line headings** — the word-stagger reveal
  assumes fairly short headline text; long paragraph text was left as
  plain `<p>` rather than run through `SplitReveal`.

## Structure

```
public/                 favicons, og.png, resume.pdf, robots.txt, sitemap.xml, CNAME
app/
  layout.tsx             nav, footer, theme script, JSON-LD, motion chrome
  page.tsx                 home — profile, stats, availability, explore
  work/page.tsx             selected work (6 items)
  projects/page.tsx         projects grouped by category
  experience/page.tsx       Thomson Reuters + GraniteRiverLabs + education
  certifications/page.tsx   22 credentials
  contact/page.tsx          form + contact cards
  globals.css               real design tokens (light/dark)
components/
  SmoothScrollProvider.tsx, Cursor.tsx, ProgressRail.tsx, SplitReveal.tsx
  Nav.tsx, Footer.tsx, ThemeToggle.tsx
```
