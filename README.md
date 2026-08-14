# Afterimage — motion-design study (Next.js)

## Status: scaffolded, never run

No live-browser tool and no working code sandbox were available while
building this. Nothing here was verified with `npm install` / `next dev` /
`next build`. Treat it as a strong first draft, not a tested app.

## Deploying to srinivasan-78.github.io

This repo is a *user* Pages site, so it serves at the domain root — no
`basePath` needed (already reflected in `next.config.mjs`).

1. Push this project to the `main` branch of
   `Srinivasan-78/srinivasan-78.github.io`.
2. In the repo: **Settings → Pages → Build and deployment → Source →
   GitHub Actions**. (Not "Deploy from a branch" — the workflow below
   handles the build itself.)
3. `.github/workflows/deploy.yml` runs `next build` on every push to
   `main`, drops a `.nojekyll` file into the output (so Pages doesn't
   ignore the `_next/` folder), and publishes `out/` via
   `actions/deploy-pages`.
4. First push triggers the workflow automatically; check the **Actions**
   tab for build status and the deployed URL.

If this ever becomes a project-page repo instead
(`username.github.io/repo-name`), set both `basePath` and `assetPrefix`
in `next.config.mjs` to `/repo-name`.

## Reference

`https://string-tune.fiddle.digital/` — StringTune, an attribute-driven
JS animation library by Fiddle.Digital.

## What was actually done

- **No DOM/CSS/network inspection happened.** No browser tool was
  connected, so nothing about StringTune's actual class names, animation
  durations/easings, breakpoints, or JS wiring is known. What was used
  instead: a plain-text fetch of the live page, which returned rendered
  copy in reading order and enough heading structure to infer section
  order — nav → hero → a 5-item feature grid → an image gallery → a
  3-tier audience section → a closing CTA → footer.
- Section order and *category* of each block (modular architecture,
  attribute config, one-line init, wide effect range, performance;
  designer / beginner / advanced audience tiers) rhymes with the
  reference. Every headline, label, and sentence was written fresh —
  none of StringTune's actual copy was reused or lightly reworded.
- Renamed the product "Loomline" with its own visual identity (dark
  canvas, italic serif display + monospace labels, split-text reveals,
  inertia cursor, scroll-progress rail, CSS-columns masonry) — a generic
  motion-design vocabulary, not StringTune's specific styling, which was
  never observed.
- Effects are built with generic, well-known libraries — Lenis
  (`SmoothScrollProvider.tsx`) and GSAP + ScrollTrigger (`SplitReveal.tsx`,
  `Masonry.tsx`) — rather than guessing at any site's proprietary tooling.
- `prefers-reduced-motion` is respected globally (`globals.css`) and
  per-component (cursor and split-reveal both no-op / show static state).

## Likely first-boot issues

- **Dependency drift.** Versions in `package.json` are pinned to what was
  current knowledge at write time; `npm install` may pull patch/minor
  bumps that shift GSAP or Lenis APIs slightly.
- **`SplitReveal.tsx` dynamic tag.** The `as={Tag}` pattern with a
  generic ref needs a `@ts-expect-error` to satisfy strict mode — worth
  replacing with a typed union of tag-specific components if this grows.
- **Fonts.** `--font-display` / `--font-mono` reference "Fraunces" and
  "IBM Plex Mono" by name only; no `next/font` wiring exists yet. Add
  `next/font/google` (or self-hosted files) before shipping, or the page
  will fall back to system serif/mono.
- **ScrollTrigger + Lenis teardown.** `SmoothScrollProvider` kills the
  Lenis instance on unmount but doesn't remove the `gsap.ticker.add`
  callback — fine for a single-page app, but will leak in a multi-route
  app with client-side navigation away from and back to this layout.

## Next step to raise fidelity

Connect a browser tool and this can be pointed at an actual reference
site to match real spacing, timing, and easing values — or run in a
sandbox to verify it boots at all.

## Structure

```
package.json
tsconfig.json
next.config.mjs
app/
  layout.tsx        global chrome: progress rail, cursor, scroll provider
  page.tsx           section order
  globals.css         design tokens + reduced-motion fallbacks
components/
  SmoothScrollProvider.tsx
  Cursor.tsx
  ProgressRail.tsx
  SplitReveal.tsx
  Nav.tsx, Hero.tsx, Principles.tsx, Masonry.tsx, Audience.tsx, CTA.tsx, Footer.tsx
```
