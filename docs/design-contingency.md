# Contingency — design brief

The redesign direction for srinidevops.com. Read this before touching a component.

---

## 1. Where the direction came from

### The persona, read off the repo rather than invented

The strongest evidence about the person is already in this codebase, in the prose
nobody asked him to write. A sample of comment and copy voice, verbatim:

- "A 200 from a service that is broken underneath, or so slow it is useless, does not count as healthy."
- "A failed build never becomes an outage, because nothing is torn down before the swap."
- "Redaction deletes the glyphs, because a white box leaves the words copy-pasteable underneath."
- "Honest about its edges: Azure and Oracle modules are stubs, and state locking is local."
- "A link that 404s for a visitor is worse than no link."
- "A change that saves 30% and gets the answer wrong is recorded as a loss."
- "The placeholder UUIDs deliberately fail the deploy, rather than quietly shipping a server nobody can op."

Six traits fall out of that, and they are the design constraints:

| Trait | Evidence | Design consequence |
|---|---|---|
| **Contingency-first** | Every project lists its failure mode and recovery path before its features | Every panel states what happens when it breaks. The failure line is typeset, not hidden. |
| **Honest about limits** | A recurring literal `Honest about…` bullet in 7 of 20 projects | A dedicated, visually equal treatment for limitations. Not a disclaimer in grey 11px. |
| **Provenance-obsessed** | `@authormark` watermarks, HMAC fingerprints, a supervisor bot auditing every repo | Citation and attribution are visible design elements, not metadata. |
| **Privacy / local-first** | Eight of nine PDF tools run offline; "consent before counting"; zero telemetry in Cairn | Nothing on the page demands attention or phones home. No popups. |
| **Frugal** | tokenmiser exists; "the expensive model only plans" | Visual economy. No decoration without a subject. |
| **Introvert** | No face anywhere on the current site; the work is the subject | No portrait. Generous negative space. Progressive disclosure — the visitor opens things; nothing opens itself. |

### Batman — the correct reading

The usable thing about Batman is **not** the iconography. It is that his defining
attribute is preparation: contingency plans, a case file on everyone, the work done
alone in the dark, and the refusal to take credit in person. That is the same person
who writes `A failed build never becomes an outage`.

Formal lessons taken, from Anton Furst's Gotham (Academy Award, *Batman* 1989) and
the broader visual tradition:

- **Figure–ground reversal is the engine.** Reverse the tones and negative space
  asserts itself as shape. Implemented literally: the two themes are a true
  inversion of each other, not a dark skin over a light layout.
- **Restraint over inventory.** A small silhouette in a large empty field reads as
  more dramatic than a crowded figure. Applied: one accent colour, used as emission,
  almost never.
- **Collision as technique.** Furst heightened Gotham by abutting Art Deco against
  industrial. Applied: an editorial high-contrast serif against engineering monospace
  annotation — two registers that should not sit together, deliberately touching.
- **Chiaroscuro.** A predictable sequence of light and shade to give flat things
  depth. Applied with hairline rules and value steps, not with glow or blur.

Explicitly rejected: bat logos, capes, "Dark Knight" copy, gothic typefaces,
anything that would make a hiring manager wince.

### Games — the correct reading

Not arcade kitsch. The borrowed thing is **systems legibility**: a well-designed
game tells you the rules, the numbers and the costs without prose. Specifically the
Metal Gear Codec tradition, which is the canonical diegetic-UI case study — the
interface exists inside the fiction, so it adds to immersion rather than taxing it.

Applied as: the skills section is a **spec block / loadout**, not a bar chart —
mono labels and real values, like an RPG character sheet. Status is a diegetic rail,
not a toast. Project selection is a **select screen** with a long-form dossier.

### What the research said to avoid

Searched the current landscape before committing. Saturated in 2026 and therefore
off-limits:

- Terminal/command-line themes with blinking cursors — "now saturated"
- Dark glassmorphism — "looks sophisticated used sparingly and cheap when overused"
- OS/desktop-metaphor portfolios — a recognised 2026 micro-trend (ZUI_OS, PouyaOS et al.)
- 3D/WebGL hero scenes and AI personalisation — both "underdelivered" at the 2026 mid-year review

Taken from the research instead: the blueprint/schematic layer (dimension lines,
callout leaders, monospace annotation), negative space as an active element,
"imperfection is information", and the warning that phosphor amber on a light ground
stops reading as emission and becomes merely a colour choice — which is exactly why
the light theme does not reuse the dark theme's accent role.

---

## 2. The system

**Name:** Contingency. **One-line thesis:** a dossier that states its own failure modes.

### Colour

Two complete, independently-authored palettes. The dark one is primary — it is the
one the author would use.

```
DARK  (primary)                    LIGHT (drafting paper)
ink      #0A0B0D  ground           #E9E5DC  ground
panel    #121418  raised           #F4F1EA  raised
rule     #22262E  hairline         #CFC8B8  hairline
body     #C2C7D0  text             #2A2A28  text
mute     #7C838F  secondary        #6A6A63  secondary
signal   #E8A33D  accent/emission  #8A5A00  accent/ink-stamp
probe    #5FD3C4  live status      #0F6F63  live status
alarm    #D9534F  failure mode     #A3302C  failure mode
```

Rules:
- `signal` appears **at most twice per viewport**. It is a bat-signal, not a highlighter.
- In dark it glows (it is emission). In light it is a stamped ink colour at a much
  lower lightness — the same role, a different physics. Never the same hex.
- `alarm` is reserved for the contingency/failure-mode line. Using it anywhere else
  destroys the one place it means something.

### Type

Three registers that collide on purpose:

| Role | Face | Use |
|---|---|---|
| Display | **Instrument Serif** | Headlines only. High-contrast, editorial, sharp. Carries the case-file gravity and is not a developer-portfolio cliché. |
| Body | **Inter Tight** | Prose. The data is long-form and has to be readable. |
| Annotation | **JetBrains Mono** | Labels, case numbers, metrics, dimension lines, the failure line. Uppercase, tracked out, small. Never body copy. |

The mono is *annotation only*. The moment mono carries a paragraph, it becomes the
terminal cliché the research warned about.

### Panels — drawn, not floated

No `border-radius` above 2px. No `box-shadow`. No blur. A panel is defined by a
hairline rule and **corner ticks** — four short marks at the corners, the way a
drawing is cropped. Depth comes from value steps and rule weight.

### Required anatomy

Every substantive panel carries, in this order:

1. `CASE 04 / 09` — a mono index, top-left
2 .The subject, in display serif
3. The body, in Inter Tight
4. A `CONTINGENCY —` line in mono, `alarm`-coloured, stating the failure mode

Item 4 is not optional. If a panel has no honest failure mode, it is decoration and
should be deleted. The data already supplies these lines; they are not invented.

### Motion

- Nothing moves without input. No autoplay, no parallax, no scroll-jacking.
- One transition: 160ms, `cubic-bezier(.2,.6,.2,1)`. One, everywhere.
- `prefers-reduced-motion: reduce` removes all of it, including the count-ups.
- Progressive disclosure is a click. Nothing expands on hover or on scroll.

### Accessibility floor — non-negotiable

- Body text ≥ 4.5:1 against its own ground, in **both** themes. The previous
  redesign shipped a light theme that failed this; that is the bug this one cannot repeat.
- Every interactive element has a visible focus ring in `signal`, 2px, offset 2px.
- The skip link, the landmark structure and the heading order survive the redesign.
- No information carried by colour alone — the failure line is labelled `CONTINGENCY`,
  not merely red.

---

## 3. Scope

**Keep, untouched:** every data point. `lib/projects.ts`, `lib/certs.ts`,
`lib/knowledge.ts`, `lib/nav.ts`, all metadata and JSON-LD in `app/layout.tsx`,
`public/*`, the authormark headers, the CI workflows.

**Extract then rebuild:** data currently welded into presentation components
(`AppleEnterpriseExperience`, `AppleSkillsExperience`, `AppleWorkAuthorization`,
the home page's `STATS` and `RELEASE_FLOW`) moves to `lib/data/*.ts` as pure data
with no JSX and no icon imports.

**Rebuild from scratch:** every component and every page's layout and styling.

**Drop:** `StickyCta` and the `ChatWidget` launcher in its current nagging form —
both violate "nothing demands attention". `CookieNotice` stays, because consent
before counting is a stated value, but it is restyled as a quiet panel.

---

## 4. Build contract

This is the canonical reference. Do not invent tokens, do not reach for raw hex,
and do not add a dependency.

### Colour utilities (Tailwind, theme-aware at runtime)

`ground` `panel` `panel-2` `rule` `rule-strong` `body` `mute` `faint` `signal`
`signal-dim` `signal-wash` `probe` `alarm`

Use as `bg-panel`, `text-mute`, `border-rule`, `divide-rule`. They resolve per
theme automatically — **never write a `dark:` variant for a colour**. A `dark:`
colour utility in this codebase is a bug: it means the token system was bypassed.

Budgets, enforced by review:
- `signal` — at most **two** uses per viewport.
- `alarm` — the contingency line only. Nowhere else.
- `probe` — live/active status only.
- `faint` — decorative marks and tertiary labels. **Never** carries body text.

### Type classes (from `globals.css`)

| Class | Use |
|---|---|
| `t-display` | Headlines. The serif. Never below ~1rem. |
| `t-anno` | Labels, kickers. Uppercase mono, tracked. |
| `t-anno-sm` | Smaller labels, case indices, captions. |
| `t-metric` | Numbers. Tabular mono, not tracked. |
| `t-prose` | Caps prose at 68ch and spaces paragraphs. |

Mono never carries a paragraph. That is the line between this design and the
terminal pastiche the research flagged as saturated.

### Structural classes

`panel` · `panel-flat` · `ticks` · `contingency` · `dim` / `dim-tick` ·
`grid-paper` · `rule-fade` · `btn` · `btn-signal` · `chip` · `link` · `field` ·
`reveal` · `disclose-body` · `scroll-x` · `skip-link` · `no-print`

### Primitives — use these, do not re-implement

| Component | Purpose |
|---|---|
| `components/primitives/Panel` | The unit. `index` `total` `kicker` `title` `titleAs` `contingency` `state` `flat` `ticks` |
| `components/primitives/SectionHead` | Every section opens with one. `index` `total` `kicker` `title` `lede` `aside` |
| `components/primitives/SpecBlock` | Label/value stat rows. `rows: {label,value,note?,emphasis?}[]` `caption` |
| `components/primitives/DimensionLine` | A measured figure. `value` `label` |
| `components/primitives/TagRow` | Stack/tag lists as annotation. `items` `label` `wrap` |
| `components/primitives/Disclose` | Click-to-open. `summary` `openLabel` `closeLabel` `defaultOpen` |
| `components/primitives/Reveal` | The one motion. `as` `delay` |
| `components/primitives/Icon` | `name` (string token from `lib/data`) `className` |

### Layout

- Page container: `mx-auto max-w-6xl px-5 sm:px-8`.
- Section rhythm: `py-16 sm:py-24`, separated by `border-t border-rule`.
- Grids are asymmetric on purpose — a 7/5 or 8/4 split beats 6/6. Negative space
  is an active element, not leftover.
- No `rounded-lg` or above, no `shadow-*`, no `backdrop-blur`. A panel is a rule
  and corner ticks.
- Wide content scrolls in its own `scroll-x` box. The body never scrolls sideways.

### Hard rules

1. **Never** touch an `@authormark` header. New files: copy the 7-line block from
   a sibling verbatim.
2. Every data point comes from `lib/data/*` or `lib/projects.ts` / `lib/certs.ts`.
   Invent no copy, no metric, no label. Do not rewrite the author's prose — the
   voice is the subject of the design.
3. Every substantive panel carries a `contingency` line sourced from the data —
   the projects carry explicit "Honest about…" bullets and failure-mode prose; use
   those. If there is genuinely no honest failure mode, omit the panel.
4. `"use client"` only where there is state or an effect. Pages stay server
   components; push interactivity into a leaf.
5. Accessibility: one `h1` per page, heading order unbroken, `aria-pressed` on
   filter chips, `aria-expanded`/`aria-controls` on disclosures, `aria-current` on
   the active link, labels tied to inputs, decorative glyphs `aria-hidden`.
6. Body text must clear 4.5:1 in **both** themes. The tokens are measured for
   this; staying on them is how you inherit it.

---

## 5. Revision 2 — the graphic layer

Review of revision 1: *"there is no style here"*, *"the font is skinny"*, and the
same data shown more than once. All three were fair. What changed:

### Type — the display face was wrong

Instrument Serif is out. It is a high-contrast editorial serif: structurally
thin, because thick-to-thin modulation means its stems carry almost no weight.
On a near-black ground that reads as frail — the opposite of a dossier about
keeping production systems standing.

| Class | Face | Use |
|---|---|---|
| `t-display-xl` | **Archivo Black** | Page and section headlines. Uppercase, −0.045em, 0.94 leading. |
| `t-display` | **Archivo Black** | Panel titles and smaller headings. |
| `t-poster` | **Oswald 700** | Figures and scoreboard moments. Condensed, tall, tabular. |
| `t-anno` / `t-anno-sm` | JetBrains Mono | Labels. Unchanged. |
| body | Inter Tight | Prose. Unchanged. |

Archivo Black is also the correct historical reference: the Gotham of *Batman '89*
is Art Deco, and Deco display lettering is geometric, heavy and wide. Wide-heavy
against narrow-heavy (Archivo + Oswald) is how poster and comic-cover lettering
has always set a headline next to a number.

### Graphics — artifacts of the medium, never pictures of it

The governing rule: **a bat logo is costume; the halftone screen a comic is
physically printed through is not.** Every device here is a real artifact.

| Class / component | What it is |
|---|---|
| `Halftone` | Ben-Day dots — two offset dot grids at half-phase, giving a real screen's diagonal lattice. |
| `HalftoneBold` | The same screen heavier and in the accent. One surface per page, maximum. |
| `SignalBeam` | A cone of light from the lower left, where a searchlight would be. A gradient, not a shape — an outline would make it a logo. |
| `Chiaroscuro` | Corners in shade so the middle sits forward. The one formal device the Batman tradition is actually built on. |
| `.shard` / `.shard-up` | Hard diagonal cuts via `clip-path`. Deco geometry, and the angle of the cowl. |
| `.notch` | A single cut corner, so a panel reads as a plate. One corner — four would be a badge. |

All texture layers are **siblings**, absolutely positioned, `aria-hidden`, and
`pointer-events-none`. They carry their own `opacity`, and opacity applies to a
whole subtree — put the class on a container and every label inside it fades too.

### Motion — three rules it does not break

1. **Nothing loops forever.** A thing still moving after you have read it is
   demanding attention. The status tick pulses three times and stops.
2. Every effect is on a decorative element or is a one-shot entry.
3. `prefers-reduced-motion: reduce` removes **all** of it, not most.

Driven through one component — `Reveal` with an `effect` prop:

| `effect` | What happens |
|---|---|
| `"rise"` | Opacity + 10px travel. Body copy. |
| `"wipe"` | A hard edge travels across. Panels and headlines — a comic panel is read one edge at a time, and a fade has no direction while this does. |
| `"draw"` | `stroke-dashoffset` on a child SVG, so the real geometry inks itself. Schematic rules and the pipeline. Pass `drawLength`. |
| `"none"` | Sets `data-shown` only. |

Plus `.scan` — the Arkham convention of a surface resolving under scrutiny,
reduced to one bright edge and a faint diagonal sheen on hover. Only ever on
something already interactive, and behind `@media (hover: hover)`.

`CountUp` animates a figure once on first view. It renders the **real value**
server-side and only drops to zero after mount, so no-JS and a failed observer
both show the true number — a stat that can render as "0" is a lie waiting for a
bad network. It reads `prefers-reduced-motion` in JS, because a CSS override
cannot stop a number from changing.

### No data twice

Revision 1 showed every skill name in a left-hand spec block *and* again in the
right-hand list, and repeated two long labels once per panel. The rule now: **a
fact appears once per page.** A label that would repeat per row belongs in a
column header, not in every row. Audited by script against the built HTML, not
the source — the duplication only exists once components are composed.

### The gaming section

Small, subtle, one section, data in `lib/data/gaming.ts`. It earns its place by
naming the trait the two halves of the page share — finish the thing, keep a
record — rather than by asking to be found charming. Read the provenance comment
in that file before touching it: the headline figures are verified, the per-title
completion claim is deliberately **not** made, because the profile does not
support it. Overclaiming there would break the one rule the whole site is about.
