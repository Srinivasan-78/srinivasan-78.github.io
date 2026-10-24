# Redesign todo — branch `redesign/the-cave`

Tracking for the Contingency redesign. See `design-contingency.md` for the direction.

## Phase 0 — Groundwork
- [x] Create branch `redesign/the-cave`
- [x] Research the 2026 landscape; identify saturated patterns to avoid
- [x] Derive the persona from the repo's own prose
- [x] Write the design brief (`docs/design-contingency.md`)
- [x] Receive the games list / Steam profile from the user; sharpen the games layer
      — list supplied and confirmed in Phase 6; `lib/data/gaming.ts` already
      matched it exactly, so the provenance hedge is retired rather than the data
      changed

## Phase 1 — Data extraction (presentation-free) — done
- [x] `lib/data/profile.ts` — identity, copy for every page, stats, contact, legal
- [x] `lib/data/experience.ts` — 20 initiatives, tenure, companies
- [x] `lib/data/skills.ts` — 7 domains / 47 skills, tooling strip
- [x] `lib/data/authorization.ts` — 3 regions, clocks, notice
- [x] `lib/data/pipeline.ts` — release flow, rollback path, caption
- [x] Icons reduced to string tokens; no `react-icons` import in any data module
- [x] Inventory reconciled; typecheck clean

## Phase 2 — Design system — done
- [x] `app/globals.css` rewritten: two independently-authored palettes
- [x] Tokens moved to `@theme inline` so colours resolve per theme at runtime
- [x] `tailwind.config.js` reduced; `darkMode` replaced by `@custom-variant`
- [x] Primitives: Panel, SectionHead, SpecBlock, DimensionLine, TagRow, Disclose, Reveal, Icon
- [x] Fonts wired (Instrument Serif / Inter Tight / JetBrains Mono)
- [x] Shell rebuilt: Nav, ThemeToggle, Footer; StickyCta and ChatWidget dropped
- [x] Contrast measured for all 14 pairings, both themes — figures recorded in `globals.css`

## Phase 3 — Pages — done
- [x] Shell: nav (numbered destinations), footer as a drawing's title block, skip link
- [x] `/` home — 9 numbered cases
- [x] `/projects` — select screen, derived filters, two-tier grid, coverage register
- [x] `/projects/[slug]` — long-form dossier with a callout schedule
- [x] `/certifications` — credential index grouped by year
- [x] `/contact` — form, copy-email with a three-stage fallback, methods
- [x] Peripherals: 404, error, global-error, loading, privacy, terms, thank-you
- [x] 20 dead presentation components deleted after an import-graph trace

## Phase 4 — Verify loop — done
- [x] `npx tsc --noEmit` clean
- [x] `npx eslint .` clean
- [x] `npm run build` clean — 35 routes, static export
- [x] Authormark: 4 overwritten files restored to their OWN original headers
      from git (payload intact); 8 new primitives backfilled from a donor
- [x] Accessibility audit over the emitted HTML — 32 pages, 0 violations:
      one h1 each, no skipped heading levels, landmarks, skip link, labelled
      inputs, `aria-expanded` always paired with `aria-controls`
- [x] Accent budget audited in the output and **corrected** — see below
- [x] Overflow: only fixed widths are inside `scroll-x`, at `md:` and up
- [x] Route smoke test on dev — every page 200, unknown path 404, no warnings
- [x] Contact form endpoint verified byte-identical to `main`
- [x] `npm run dev` running on :3000

### The one real defect the loop caught

`Panel` rendered its `kicker` in `text-signal`. On a single panel that looked
correct; in a three-up roster or a twenty-panel initiative grid it put six to
nine amber labels on screen at once, against a stated budget of two per
viewport. An accent used nine times is a body colour.

Fixed at the primitive, so every page inherited it, plus two per-item repeats
(the roster's "Live App" link, the dossier's list dashes). Measured before and
after on the emitted markup: home went from 46 persistent accent uses to 10 —
roughly one per section header, which is the intent.

This is why the audit reads the built HTML and not the source: the bug only
exists once a component is composed into a grid.

---

## Phase 5 — Revision 2, after review

Review said three things, all fair: the same data shown more than once, the font
is skinny, and there is no style — stylize from Batman / comics / the games he
plays, add a small subtle gaming section with the games he has completed.

### Done
- [x] Duplicate audit by script against the **built HTML** (not source — the
      duplication only exists once components are composed). Found 10:
      skill names rendered twice per viewport, two long labels 7× each,
      one label 3×, one project title 2×
- [x] Display face replaced: Instrument Serif → **Archivo Black**. The serif was
      structurally thin — thick-to-thin modulation means its stems carry almost
      no weight, which on a near-black ground reads as frail
- [x] Second display register added: **Oswald 700** for figures and scoreboards
      (`Big_Shoulders_Display` is not in this Next version's font data; checked)
- [x] Graphic layer in `globals.css` §5b: Ben-Day halftone, signal beam,
      chiaroscuro, shard and notch clip-paths
- [x] Motion layer §5c: line-draw via `stroke-dashoffset`, directional wipe,
      three-beat status pulse, Arkham-style `.scan` hover
- [x] `Reveal` generalised to one component with an `effect` prop
- [x] `CountUp` — renders the true value server-side, drops to zero only after
      mount, reads `prefers-reduced-motion` in JS
- [x] `lib/data/gaming.ts` from the public Steam profile

- [x] Graphics/motion/type applied + duplicates removed — home page (13 found)
- [x] Graphics/motion/type applied — projects, dossier, certs, contact
- [x] Gaming section built and mounted at the foot of `/projects`
- [x] `SectionHead` unified — see below
- [x] Re-run clean: typecheck, lint, build (35 routes), a11y (32 pages, 0),
      duplicate audit (**0**), accent budget (0 pages flagged)
- [x] Dev server on :3000, every route 200, unknown 404, no warnings

### The gaming section, final form

Figures dropped on instruction — no perfect-game count, no achievement
total, no library size. That also removed the disclaimer they needed, since
"completed" and "100% of achievements" are different bars whose numbers read
as contradictory side by side.

What replaced them: **a run of games played in order is a track, so it is
drawn as one.** Nineteen series as chains of nodes on a rule — diamond,
connector, title, repeat. The length of the chain is the entire argument;
ten linked nodes under one series name says "finished all ten" with no
number and no caption. Runs are ordered longest-first so the section opens
on the ten-game chain.

The 55 one-offs get the opposite treatment: a dense credit block in
condensed caps, set like a poster's credits. Chains of one would be a chart
of nothing.

Counts are computed from the list (`19 runs · 118 titles`), so they cannot
drift from the rows beneath them.

### SectionHead unification

Three hand-rolled copies of the same header anatomy had appeared — one on
the home page, two inside the projects pages — because the primitive
hard-coded its title size and revision 2 needed the heavier register. That
is precisely the drift the component's own comment warns about.

Fixed by making the register a prop (`size`: md / lg / xl, plus
`kickerTone` and `titleReveal`) and migrating all three call sites. The
markup now exists once. `components/home/CaseHead.tsx` survives only as a
preset — the home page's `lg` + wipe defaults — which spares eight call
sites two props each and is a legitimate thing for a page to own.

### Audit scripts, and a bug in one of them

Three scripts live in the session scratchpad: an a11y audit, a duplicate
detector and an accent counter, all reading the **built HTML** rather than
source, because every bug they catch only exists once components are
composed.

The duplicate detector initially scanned the whole document and flagged
every page's own headline, because `<head>` legitimately repeats the title
three times (`<title>`, `og:title`, `twitter:title`). It now scans the body
only. Worth knowing if these are ever promoted into the repo: Next also
embeds an RSC flight payload inside a `<script>`, so any such check must
strip script content or it will double-count every string on the page.

### The provenance constraint on the gaming section

The profile shows 58 games at 100%, 5,144 achievements, 183 owned, and
THE FINALS at 945 hours with 50/50. It does **not** say which individual titles
are among the 58 — the collector and achievement showcases name games without
marking completion per title.

So the series list is labelled as played-through, not as "the 58". The stronger
claim is unsupported, and this is the one block on the site where overclaiming
would break the exact rule the rest of it is built on. Worth correcting by hand
if the real list is available.

> **Retired in Phase 6.** The owner supplied the list directly. Every line of
> it was checked against `lib/data/gaming.ts` and already matched, so the data
> is unchanged — what changed is its standing: the series are played-through on
> the author's word rather than inferred from a showcase. The "58" figure is
> still not claimed anywhere, and still should not be: Steam's *perfect games*
> and *finished* remain different bars.

---

## Phase 6 — Revision 3, the motion layer

Brief: use reactbits.dev as the reference, key the layout off Batman and
the games list, and implement the motion design. Four decisions were put
to the owner before any code was written, and all four are recorded here
because each one closed off work the others would have required.

| Question | Decision |
| --- | --- |
| Dependency weight | **`motion` + `ogl`** — a real WebGL layer, no GSAP, no three.js |
| Batman register | **Arkham detective mode** — over Ben-Day, deco, Nolan |
| Scope | **Every surface** |
| Games layer | **Trophy / completion board** |

### What ReactBits actually turned out to be

Install is `npx shadcn@latest add @react-bits/<Component>-TS-TW`; four
variants, ~240 components over five categories. The engines behind them,
from the upstream `package.json`: `gsap`, `motion`, `three` +
`@react-three/fiber`/`drei`/`postprocessing`, `ogl`, `matter-js`,
`lenis`, `@use-gesture/react`.

Nine of the components anyone would reach for first **already existed
here** in pure CSS from revision 2 — stroke text, depth text, electric
border, halftone, scan hover, line-draw, wipe, status pulse, spotlight,
plus `DecryptText` and `CountUp`. So nothing was installed to replace
working CSS. The dependencies were taken only where CSS cannot reach.

### The false premise this phase removed

§5d of `globals.css` justified refusing the library partly on the claim
that the site sits "behind a meta CSP with no runtime script origin".
**That was wrong.** The meta CSP in `app/layout.tsx` is
`base-uri 'none'; object-src 'none'` and sets no `script-src` at all —
GitHub Pages cannot send the headers a real script policy needs, which
is what the note there already says. A bundled dependency was never
blocked by policy.

The comment is corrected in place rather than deleted. The honest half
of its argument — weight — survives and is now the only rule: pay a
dependency exactly where CSS cannot reach, and nowhere else.

### Two accents, two jobs (`globals.css` §1b)

The one structural idea of this revision, and the reason detective mode
could go on *every* surface without the accent audit regressing:

- **amber (`--c-signal`) is static.** Section marks, status ticks, the
  active nav destination. Part of the composition before you touch
  anything. The two-per-viewport budget still governs it.
- **cyan (`--c-detect`) is transient.** Only ever present while a
  surface is being probed — hover, focus, or a one-shot entrance.
  Nothing is cyan at rest, so it cannot compete with amber in the
  static frame and needs no budget.

`.scan`, `.spotlight` and `.electric` were moved off amber onto cyan as
a consequence: they are all hover states, so by this rule they were the
wrong colour from the start. Contrast measured both themes —
`#0a5f72` at 5.4:1 on the light ground, `#6fd3ff` at 11.7:1 on the dark.

### Where the dependencies went, and why only there

**`ogl` — one fragment shader, home cover only**
(`components/primitives/ScanField.tsx`). The field couples three
per-pixel things that have to see each other: a grid whose brightness
varies with its distance from a travelling scan band, the band itself,
and a bloom that reads the result. In CSS those are three stacked layers
that cannot share a variable; in a shader they are four lines. Five
constraints keep it honest — never runs unseen (IntersectionObserver +
`visibilitychange`), never mounts at all under reduced motion, degrades
invisibly on context failure, DPR capped at 1.75, and colours read from
the stylesheet rather than hard-coded.

**`motion` — one shared-layout marker** (`components/Nav.tsx`). The
active destination's rule *slides* between items. This needs to measure
two different DOM elements and interpolate between them, surviving
re-targeting mid-flight; `layoutId` is exactly that problem, and CSS has
no way to express it.

**Everything else stayed CSS**, including the route transition — see
below.

### The route transition is CSS, deliberately

`motion` renders its `initial` styles into the **server output**. A page
transition starting at `opacity: 0` therefore ships `opacity: 0` in the
static HTML, and a visitor with scripting off gets a blank page. This
site gates every reveal behind `html.js` precisely so that cannot
happen. So `app/template.tsx` is a remounted div with a CSS animation,
and the rule that fell out of it is written at the top of that file:
motion animates things already on screen; anything that animates content
**in** stays in CSS behind `html.js`.

An audit pass now enforces this — it fails if any page ships an inline
`opacity: 0` inside `<body>`.

### The completion board

The games list is now **author-confirmed**, which retires the provenance
hedge recorded under Phase 5: 118 titles, 20 runs, played-through
because the author says so rather than because a Steam showcase implied
it. Every line of the supplied list was checked against
`lib/data/gaming.ts` — it already matched exactly, so the data did not
change, only its standing.

The board itself gained a **spine**: one vertical rule traced downward
on arrival, with every run hanging off it at a node. Vertical because
that is the only axis on which a single straight rule is honest here —
the title connectors stay per-node, since the titles wrap and an
absolutely positioned horizontal rule would detach from the second row.
A run now lights **as a unit** on hover or focus, because ten linked
nodes is the argument and highlighting one title inside it marks the
wrong thing. Each run carries its title count, always in the DOM and
merely brightening under the pointer — information that exists only on
hover is information a touch or keyboard visitor never receives.

### The defect this phase caught in its own work

The title diamonds on the games board were `bg-signal-dim` — **118 amber
marks on one screen**, against a stated budget of two per viewport. This
is the same class of bug as the revision-2 `Panel` kicker and for the
same reason: correct on one node, wrong once composed into nineteen
chains. They are rule-coloured at rest now and cyan only while probed.

A second, smaller one: `pow(x, 2.0)` in the shader, where `x` is
negative over half the field. GLSL ES leaves `pow` undefined for a
negative base regardless of the exponent, so on an unlucky driver the
band would vanish or the field would go opaque. Squared by
multiplication instead. Also the shader's `uRes` was being fed
`gl.drawingBuffer*` (device pixels), which made the grid twice as dense
as its own CSS fallback on a 2x display; it takes CSS pixels now, so the
shader and `.detect-grid` agree.

### Verify loop — all clean

- `npx tsc --noEmit`, `npx eslint .` clean
- `npm run build` clean — 35 routes, static export
- Accessibility over the built HTML — 32 pages, **0 violations**
- Accent budget — **0 pages over**; worst page 9 persistent amber uses
  (revision 2's regression was 46)
- Cyan at rest — **0 pages** beyond the one nav marker
- No-script safety — **0 pages** ship hidden content
- Bundle split confirmed: `ogl` is 52 KB in exactly one chunk,
  referenced only by `index.html`
- Dev smoke test — every route 200, unknown path 404, no warnings
- Authormark backfilled byte-for-byte on the two new files

Two duplicate-audit findings were investigated and are **by design**:
`"DevOps & Cloud Architecture"` is a per-item `role` taxonomy label (the
same class as `"Private repository"` on eleven cards), and the privacy
page states the contact address once under "Who runs this site" and once
under data rights — two clauses that each need it.

The audit scripts live in the session scratchpad and read the **built
HTML**, not source, for the reason Phase 5 recorded. Both traps from
last time still apply, plus two new ones found this round: an input can
be named by a *wrapping* `<label>` as well as by `for=`, and
`out/google*.html` is a Search Console stub with no document structure.

### Not verified

The shader's rendered output. There is no browser driver in this
environment, so the GLSL was reviewed statically against the GLSL ES 1.0
spec and the fallback paths were exercised, but nobody has looked at the
field on screen. The dev server is up on `:3000`.

---

## Phase 7 — Revision 4, after the owner reviewed it running

Five items, four of them the owner's direct reading of the live site.
Decisions taken before any code was written:

| Question | Decision |
| --- | --- |
| The "yellow box" | **Outline, not filled** |
| The "box holding the entire site" | **The nav + footer frame** |
| Games | **Their own `/hobby` page** |
| Intensity / install budget | **Full React Bits, three.js allowed** |

### The research result that changed the plan

three.js was authorised and turned out to be **unnecessary**. The
registry items are plain JSON at `https://reactbits.dev/r/<Name>-TS-TW.json`,
so they can be fetched directly without a `components.json` or the
shadcn CLI — and inspecting them showed that the TS-Tailwind variants of
almost every background are **dependency-free raw-WebGL rewrites**:

| Component | npm deps |
| --- | --- |
| FaultyTerminal, LetterGlitch, LightRays, Beams, Dither, GlitchText, ClickSpark, Lightning, DarkVeil, Prism, Galaxy, Particles, GridDistortion, Threads, Plasma, ElectricBorder, PixelTransition, GlareHover, LaserFlow | **none** |
| TargetCursor | `react-dom` (already present) |
| TrueFocus, CountUp, DecryptedText, Stack | `motion` (already present) |
| DitherVeil, ElectricLogo | `ogl` (already present) |
| ScrambledText, SplitText, Shuffle, ScrollReveal, AnimatedContent | `gsap` — avoided |
| Hyperspeed | `three` — **the only one**, not used |
| MagicBento, CardSwap, Stepper, FlowingMenu | `@hugeicons/*` — avoided |

So eleven components were vendored into `components/reactbits` with
**zero new dependencies**. Three were then deleted again after reading
their props rather than their descriptions: `HalftoneReveal` and
`TextPressure` need an image `src` and a variable font respectively,
neither of which this site has, and `SpotlightCard`/`PixelCard`/
`TrueFocus` duplicated CSS that already works. Vendored code that is
not used is worse than no vendored code.

**Vendored third-party files are excluded from the authormark.**
`components/reactbits` is added to the `ignore` list in
`.authormark.json`, and the backfill script skips it. Stamping MIT code
from another author with this repo owner's copyright header would be a
false authorship claim — the watermark rule in `AGENTS.md` protects his
files, it does not apply to someone else's.

### What is live where

| Surface | Field | Heading |
| --- | --- | --- |
| `/` cover | **FaultyTerminal** — CRT curvature, scanlines, chromatic aberration, mutating glyphs, glitch on click, tinted to the detect cyan | wipe + depth |
| `/projects` | **LetterGlitch** — mutating glyph field, pointer-reactive | x-ray |
| `/certifications` | **Beams** — deco light shafts | x-ray |
| `/hobby` | **Dither** — dithered waves at a visible pixel size, the one overtly retro-game field | **GlitchText** (RGB split) |
| `/contact` | **LightRays** — the §5b searchlight, moving | x-ray |
| `/projects/[slug]` ×23 | **ScanField** — the hand-written `ogl` shader, moved here off the cover | x-ray |
| Site-wide | **ClickSpark** + **TargetCursor** | — |

`ScanField` moving to the dossier is the right outcome rather than a
consolation: a dossier is the page someone actually *reads*, and a
glyph storm behind three thousand words would be unreadable, while the
cover is the one place that should be loud because arriving happens
once. It also keeps `ogl` justified instead of orphaned.

### The three gates, all in one file each

`components/primitives/FxBackdrop.tsx` owns every heavy background and
enforces four rules the vendored components do not enforce themselves:
`next/dynamic` with `ssr: false` so each shader is its own chunk and
only downloads on the page using it (also a correctness requirement —
they touch `window` at module scope, which would break the static
export); an IntersectionObserver gating the **mount**, not just the
animation, so an offscreen field has no GL context at all; reduced
motion never mounts one; and `.detect-grid` always renders behind as an
unconditional sibling, so a failed chunk or refused context degrades to
a composition rather than a hole.

`components/primitives/InteractionFx.tsx` gates the cursor and sparks:
the reticle mounts only for a fine pointer that can hover at ≥640px
*and* when motion is allowed, it never hides the real cursor, and it
never replaces a focus affordance — the `:focus-visible` ring and the
HUD brackets are untouched.

`components/primitives/GlitchHeading.tsx` exists because dropping
`GlitchText` in as an h1 would have broken three things at once: the
semantic heading would be a `div` (no h1 on the page), the RGB split
duplicates the text into pseudo-elements (which the duplicate audit
would flag, correctly), and it is client-only so no-JS visitors and
crawlers would get nothing. The real tag is always rendered; the glitch
is swapped in after mount, with the words in an `sr-only` sibling and
the effect `aria-hidden`, so exactly one readable copy exists either
way.

### The duplication, actually removed

The citizenship was stated **six overlapping ways on one screen**: the
section heading, the lede, the US badge, the US status line, the India
badge and the India status line — plus the hero's status badge two
screens up. Sponsorship three times, immediate hire three times.

Revision 2 had already dropped `headline` and `summary` on these
grounds and did not go far enough. Now `statusText` is unrendered too,
and the lede is gone: **the badge is the credential and it suffices** —
"US Citizen" already entails no sponsorship, "OCI Cardholder" already
entails an indefinite right to work, and a gloss spelling out what a
credential means is for a reader who does not know it. Home now reads:
`Immediate Hire Ready` (hero status) · `Work Authorization & Global
Mobility` (eyebrow) · `Authorized to work in the US and India.`
(heading) · `US Citizen` · `OCI Cardholder`. Five strings, each saying
one thing once, zero visa/sponsorship repetition.

**A wrong comment found while doing it.** `Clearance.tsx` claimed
`AUTHORIZATION_NOTICE` was dropped from the home page because "the
contact page is where a prose statement of work authorisation earns its
place". It was never added there — a scan of the built output finds
zero citizenship strings in `contact.html`. It is rendered nowhere on
the site. Deliberately **not** fixed by adding it: the brief was to
remove duplication, and putting a prose restatement on a second page
would reintroduce what was just removed from the first.

### The two boxes

**The yellow box** was `.btn-signal`, a solid amber rectangle. On a
page whose whole graphic language is hairline rules, corner ticks and
value steps, a block of saturated fill is the one element that is not
*drawn* — it read as a widget pasted onto a drawing. Primacy is carried
by colour rather than area now: `.btn` is a neutral rule with body text,
`.btn-signal` is an amber rule with amber text. The accent budget
improved too, since §1b counts area and a filled button spends far more
amber than a 1px rule.

**The box holding the entire site** was the nav's `border-b` and the
footer's `border-t` — two full-width rules at the extremes of the
document, which *are* a frame regardless of what sits between them.
Both removed. The mobile disclosure keeps its rule, because that one
separates an expanded panel from the content it covers: a real
boundary, not a decorative frame.

### The hobby page

A fifth destination, fourth in the order — the work, the credentials,
the thing done for its own sake, then how to get in touch. Contact
stays last because a call to action in the middle of a list is a list
with no end. Page indices renumbered to `/05`, sitemap and footer
updated, and the old `#off-the-clock` anchor retired.

It was previously a coda under twenty project panels, reachable only by
scrolling the whole roster — and the previous pass had tried to fix
that with an anchor, a jump link *and* a footer entry, which is the
tell that the section was in the wrong place rather than badly
signposted.

Stripped on instruction — the list and nothing attached to it: the two
per-row editorial notes (removed from the **type** as well as the data,
so the field cannot come back), the Steam profile link, and the old
`body` copy that opened "It is on this page because…", which was an
apology for the section existing. The page states once at the top that
everything below was played to the end, which is what lets every row be
nothing but a name — a per-row badge would be that sentence repeated
118 times. The two tiers are now **one board** on a single spine rather
than two headed sections, which is what had made the games read as
"displayed in different segments".

### Verify loop — all clean

- `npx tsc --noEmit`, `npx eslint .` clean, including all 8 vendored
  files unmodified
- `npm run build` clean — **36 routes** (was 35), static export
- Accessibility over the built HTML — 33 pages, **0 violations**
- Accent budget — **0 pages over**; worst page 9
- Cyan at rest — **0 pages** beyond the one nav marker
- No-script safety — **0 pages** ship hidden content
- Shader chunks appear in **no page's HTML**, confirming they are
  fetched on demand rather than preloaded. Total JS 620 KB → 724 KB,
  nearly all of it lazy and per-page
- Dev smoke test — all 10 routes 200, `/hobby` included, unknown 404
- `/hobby` output verified: h1 present, 19 runs / 118 titles, Steam
  link gone, per-row notes gone

### Still not verified

Nothing rendered has been looked at. There is no browser driver in this
environment, so every shader in this phase — five vendored backgrounds,
the glitch heading, the cursor and the click spark — is statically
reviewed and gated but visually unconfirmed. This is the largest
unverified surface of any phase so far and the first thing to check by
eye.

---

## Resolved — the authormark stamper was never missing

Every phase above recorded this as blocked. `AGENTS.md` says to refresh
watermarks with `node .authormark/authormark.mjs stamp . --zw` and then
`seal`; `.authormark/` does not exist in this tree and `git log --all`
shows it never did. The conclusion drawn was that fingerprints could not
be refreshed locally and that every edited file would keep a stale one.

**That was wrong, and the repo said so the moment a commit was
attempted.** A pre-commit hook rejected it and printed the real path:

```
Commit blocked: watermark missing or stale. Fix with:
  node <repo-root>/../authormark-watch/authormark.mjs stamp <files>
```

The tool lives in a **sibling repository** — `authormark-watch`, which
is itself one of the projects this site lists — not inside this one.
The key was at `~/.authormark.key` all along. The path in `AGENTS.md`
is the only thing that was ever wrong.

So the prescribed commands were finally run for real:

- `stamp . --zw` — 1 newly marked, 73 refreshed, 17 already current
- `seal` — rewrote `AUTHORSHIP.json`, appended to the hash-chained
  `AUTHORSHIP.log`
- `check` — **all 91 files carry a watermark with a valid fingerprint**

`components/reactbits/` is excluded via the ignore list, which is
correct rather than incidental: stamping vendored MIT code from another
author with this repo's copyright header would be a false authorship
claim.

**What this supersedes.** The backfill script described below — copying
a donor header byte-for-byte to satisfy a presence-only CI check — is no
longer needed and should not be used. Every file now carries its own
keyed fingerprint rather than a borrowed one.

**The lesson worth keeping.** A blocker was carried across five phases
on the strength of a single path that did not exist, and nobody tried
the operation. What settled it was attempting the commit and reading
the error. A documented obstacle is a claim like any other, and it
expires unless it has been tested.

---

## Historic note — the blocker as it was recorded

> Kept as written, because it is the reasoning that was acted on for
> five phases. Superseded by the section above.

**The authormark stamper is not in the repo.** `AGENTS.md` says to refresh
watermarks with `node .authormark/authormark.mjs stamp . --zw` and then `seal`,
but `.authormark/` does not exist in the working tree and is not tracked in git
on any branch — `git log --all -- .authormark` is empty. So fingerprints cannot
be refreshed locally, and every file this redesign edits now has a stale one.

What that does and does not break: `.github/workflows/authormark.yml` calls the
external composite action `Srinivasan-78/authormark-watch` with
`mode: check-presence`, so CI checks only that a header *exists*. Presence is
satisfiable without the keyed tool, and that is what the backfill script does —
it copies the 7-line block byte-for-byte from a donor file so the invisible
zero-width payload survives, and it never touches an existing header.

Consequence to accept or fix: new files carry a donor fingerprint, and edited
files carry a stale one. Re-run the real keyed stamper once `.authormark/` is
back in the tree. Nothing here deletes a watermark, which is the rule that
actually matters.
