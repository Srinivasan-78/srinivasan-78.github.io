/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​‌​​​‌​​​​‌‌​‌‌​​​‌​​‌‌​‌‌​​​‌​​‌‌‌‌​‌​​‌‌​​​‌‌‌​‌‌‌​‌‌​​​​‌​‌‌​‌​​‌​‌‌​‌​​‌​‌​​​​​‌​‌‌​‌‌‌‌​‌​​​‌​​​‌​​‌​​‌​​‌‌​‌​​​‌​​​​‌​​‌‌‌​‌‌​​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​​​‌‌​‌​‌‌‌‌‌​‌​‌‌‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.TCblOLwaiiAoDI4Bvorc__
 */
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PROJECTS, CONTRIBUTIONS, type Project } from "@/lib/projects";
import { PROJECTS_COPY, PROFILE } from "@/lib/data/profile";
import Panel, { type PanelState } from "@/components/primitives/Panel";
import SectionHead from "@/components/primitives/SectionHead";
import TagRow from "@/components/primitives/TagRow";
import Reveal from "@/components/primitives/Reveal";
import CountUp from "@/components/primitives/CountUp";
import FxBackdrop from "@/components/primitives/FxBackdrop";
import { Halftone } from "@/components/primitives/Texture";

/* The roster.

   The games register, read as systems legibility rather than as arcade
   decoration: a select screen is a list you scan, filter and compare,
   where the costs and capabilities are visible without prose. That is
   exactly the right shape for twenty builds, and it is what the
   previous design's twenty identical cards were not.

   `index="02" total="05"` is not decoration either — it is this page's
   position in the header's numbered destinations. The nav counts 01
   through 04, so a page that opens with its own number reads as part of
   one indexed document rather than as a separate site. */

/* The data's `status` is prose written for a reader — "Work in
   progress" — and PanelState is a closed union written for the design.
   Mapping between them here rather than loosening the union keeps the
   status dot honest: an unmapped status falls back to `reference`
   rather than silently colouring itself live. */
const STATE_BY_STATUS: Record<string, PanelState> = {
  Live: "live",
  Active: "active",
  "Work in progress": "wip",
  "In progress": "wip",
  Archived: "archived",
  Reference: "reference",
};

function stateFor(project: Project): PanelState {
  return STATE_BY_STATUS[project.status] ?? "reference";
}

/* The contingency line, found rather than written.

   Seven of the twenty projects carry a highlight that begins "Honest
   about" — the author's own statement of where the thing stops working.
   That is the failure-mode line the design asks every panel for, and it
   already exists in his words, so it is lifted verbatim.

   A project with no such bullet gets no contingency line. Inventing one
   would be the exact dishonesty the section is named after. */
function contingencyFor(project: Project): string | undefined {
  const honest = project.highlights.find((h) => /^Honest about/i.test(h));
  if (!honest) return undefined;
  /* The prefix is the label, which the panel already prints, so the
     sentence is trimmed down to the admission itself. */
  return honest.replace(/^Honest about (the )?(limit|trade|edges|scope|its own cost)?:?\s*/i, "").replace(/^[a-z]/, (c) => c.toUpperCase());
}

/* Filter values are derived from the data, never typed out. A
   hard-coded category list is a list that goes stale the first time a
   project is added — and goes stale silently, by showing a filter that
   matches nothing. */
function sortedUnique(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export default function ProjectIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  /* THE ENTRANCE RUNS ONCE, ON ARRIVAL — never on a filter.
   *
   * Every panel below carries a `wipe`, which starts clipped and
   * waits on an IntersectionObserver before playing for 620ms. That
   * is right the first time the roster is seen and wrong every time
   * after: changing a filter unmounts the panels that no longer match
   * and mounts the ones that do, so each click re-ran the whole
   * entrance and the results appeared to arrive about a second late.
   * The owner reported it as a huge delay, and it was — just not in
   * the filtering, which is a `useMemo` over twenty-three items and
   * takes no measurable time at all.
   *
   * Once this flips, panels render with no entrance and appear on the
   * same frame as the click. It never flips back: having seen the
   * roster animate in once, a visitor is owed instant results from
   * then on. This is also the design brief's own rule — a thing still
   * moving after you have read it is demanding attention. */
  const [interacted, setInteracted] = useState(false);

  const categories = useMemo(
    () => sortedUnique(PROJECTS.map((p) => p.category)),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return PROJECTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;

      /* Searching the stack and tags as well as the title is the whole
         point: a visitor who wants to know whether he has shipped
         Terraform types "Terraform", not a project name he has never
         heard. */
      return [p.title, p.teaser, p.category, p.client, ...p.tags, ...p.stack]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, category]);

  /* Two tiers, which is where the asymmetry comes from and why it is
     justified rather than decorative. A build you can open and use is
     worth more to a visitor than one behind a private repository, so
     the deployed ones get a wider cell and lead the page. Everything
     else follows in a denser grid. */
  const deployed = filtered.filter((p) => p.demo);
  const rest = filtered.filter((p) => !p.demo);

  const liveCount = PROJECTS.filter((p) => p.demo).length;
  const honestCount = PROJECTS.filter((p) => contingencyFor(p)).length;

  /* The <main> landmark moved up to app/projects/page.tsx.

     The route needs a second section after the roster — the gaming
     coda — and with the landmark declared down here anything appended
     alongside this component would have rendered *outside* main, which
     puts real content beyond the skip link's target. A page that owns
     more than one section has to own its own landmark. */
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* The header is `SectionHead` at the page register.

            It was written out inline here while the primitive's title
            size was hard-coded, which left three hand-rolled copies of
            the same anatomy across the site — the exact drift that
            component's own comment warns about. The register is a prop
            now, so this is the shared header again and the wrapper only
            supplies what is genuinely local: the texture layer.

            Halftone is a sibling rather than a class on the wrapper,
            because `.halftone` carries its own opacity and opacity
            applies to a whole subtree — on the wrapper it would fade the
            headline with it. `overflow-hidden` is what lets the screen
            be cut on the diagonal by `shard`. */}
        <div className="relative mb-10 overflow-hidden sm:mb-14">
          <Halftone className="shard" />
          {/* A field of mutating glyphs. This is the roster of
              deployment work, and streaming characters read as the
              subject here rather than as decoration. */}
          <FxBackdrop
            kind="letters"
            opacity={0.26}
            props={{
              glitchAmount: 0.5,
              speed: 42,
              fontSize: 14,
              spacing: 1.1,
              density: 0.7,
              baseOpacity: 0.14,
              smooth: true,
              interactive: true,
              cursorRadius: 120,
              edgeFade: 0.6,
              centerFade: 0.35,
              intro: true,
              dpr: 1.5,
              /* NO backgroundColor, and that is the fix rather than an
                 omission.

                 This used to pass the string "transparent", which did
                 the exact opposite of what it says. LetterGlitch guards
                 with `if (s.backgroundColor)`, and "transparent" is a
                 truthy string, so it took the painting branch: the
                 value goes through a probe-canvas colour parser, which
                 fills a pixel with "transparent" — painting nothing —
                 and reads back [0,0,0,0], giving rgb black. The shader
                 is then handed `uniform4f(uBackground, 0, 0, 0, 1)` —
                 opaque black. That was the weird box on this page.

                 Leaving the prop off takes the else branch, which sets
                 alpha 0 and is genuinely transparent. Dither is the
                 opposite case and does special-case the literal
                 string, which is why the hobby page still passes it. */
            }}
            lightProps={{ glitchColors: ["#866900", "#bfbfbb", "#8f8f8c"] }}
            darkProps={{ glitchColors: ["#f5c518", "#8a6d1a", "#3d3d3b"] }}
          />

          <div className="relative">
            <SectionHead
              index="02"
              total="05"
              kicker={PROJECTS_COPY.eyebrow}
              title={PROJECTS_COPY.heading}
              titleAs="h1"
              lede={PROJECTS_COPY.body}
              size="xl"
              titleReveal
              titleEffect="xray"
              className="mb-0"
              aside={
                /* The coverage register.

                   Three counts rather than two, and the third is the one
                   that matters: how many of these builds state their own
                   limits in writing. It is a real figure read off the
                   data — the projects carrying an "Honest about…" bullet
                   — and it is the only metric here a visitor will not
                   find on anybody else's portfolio, because stating what
                   your own work does not do is rare enough to count.

                   Framing completeness as a number is deliberate. This
                   is a person who finishes things, and whose own
                   repositories are audited nightly by a bot he wrote to
                   check every file still carries its watermark. A
                   coverage count is the native unit of that temperament.

                   Set in the poster register rather than mono:
                   condensed, tall and tabular is how a scoreboard sets
                   figures beside a wide heavy headline, and this is the
                   one place on the page where three numbers are meant to
                   be read as a group. */
                <dl className="flex gap-6 sm:gap-8">
                  <div>
                    <dd className="t-poster text-[2.25rem] text-body">
                      <CountUp value={PROJECTS.length} />
                    </dd>
                    <dt className="t-anno-sm mt-1 text-mute">
                      {PROJECTS_COPY.statTotalSuffix}
                    </dt>
                  </div>
                  <div>
                    <dd className="t-poster text-[2.25rem] text-body">
                      <CountUp value={liveCount} />
                    </dd>
                    <dt className="t-anno-sm mt-1 text-mute">
                      {PROJECTS_COPY.statDemosSuffix}
                    </dt>
                  </div>
                  <div>
                    <dd className="t-poster text-[2.25rem] text-signal">
                      <CountUp value={honestCount} />
                    </dd>
                    <dt className="t-anno-sm mt-1 text-mute">
                      State their own limits
                    </dt>
                  </div>
                </dl>
              }
            />
          </div>
        </div>

        {/* Controls. The search field and the category chips are one
            group, so they share a ruled strip rather than floating as
            two unrelated widgets. */}
        <div className="border-y border-rule py-4">
          {/* STACKED, not side by side, and this is a bug fix rather
              than a preference.

              The two controls used to sit in a `lg:flex-row` with the
              search as `flex-1 min-w-0` and the chip group as
              `flex-wrap` with every chip `shrink-0`. That makes the
              chip group INFLEXIBLE: its min-content width is a whole
              chip row and nothing in it can shrink, so flex satisfied
              it first and crushed the `min-w-0` label to ZERO width.
              A zero-width box does not hide its contents — it lets
              them overflow — so the "Search" caption rendered on top
              of the wrapped chip rows and the input collapsed to a
              bordered sliver sitting over the "All" chip. That sliver
              is the box reported on this page.

              `min-w-0` was the proximate cause and removing it alone
              would have fixed the overlap, but only by pushing the
              overflow sideways instead: the row would then exceed its
              container. Stacking removes the competition entirely.
              The chips also get the full width, so nineteen
              categories wrap into fewer rows than before.

              Worth distinguishing from the earlier fix at this same
              spot, recorded below: that one was a horizontal
              scrollbar painted under a `scroll-x` row. Same
              description from a reviewer, completely different
              cause. */}
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 lg:max-w-md">
              <span className="t-anno-sm shrink-0 text-mute">Search</span>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setInteracted(true);
                  setQuery(e.target.value);
                }}
                placeholder={PROJECTS_COPY.searchPlaceholder}
                className="field min-w-0"
              />
            </label>

            {/* Wraps rather than scrolls.

                It was `scroll-x`, and with twelve categories the row
                overflowed and WebKit painted a horizontal scrollbar
                under it — a 10px thumb with a 3px ground-coloured
                border, parked at the left, directly beneath the "All"
                chip. In review that read as "a weird square after the
                All button", which is exactly what it looked like.

                Wrapping removes the scrollbar entirely, shows every
                category without a gesture nobody knows to make, and
                matches the certifications page, which already wrapped.
                A filter the visitor cannot see is a filter that does
                not exist. */}
            <div
              role="group"
              aria-label={PROJECTS_COPY.filterPrefix}
              className="flex flex-wrap items-center gap-2"
            >
              <button
                type="button"
                onClick={() => {
                  setInteracted(true);
                  setCategory("all");
                }}
                aria-pressed={category === "all"}
                className="chip shrink-0"
              >
                {PROJECTS_COPY.allFilterLabel}
              </button>

              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setInteracted(true);
                    setCategory(c);
                  }}
                  aria-pressed={category === c}
                  className="chip shrink-0"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Count, announced. A filter that changes a grid silently
            leaves a screen-reader user with no idea anything happened.

            The link beside it used to be a same-page anchor down to the
            gaming coda at the foot of this page, on the reasoning that
            a coda "does not deserve a page". That was wrong twice
            over: a section reachable only by scrolling past twenty
            project panels is a section nobody reads, and the games are
            not a footnote to the professional work — they are a
            separate subject. They are /hobby now, and this is a route
            link to it. */}
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
          <p aria-live="polite" className="t-anno-sm text-mute">
            {filtered.length} of {PROJECTS.length} {PROJECTS_COPY.showMoreNoun}
          </p>

          {/* Now a route, not an anchor. It was a same-page jump to a
              coda at the foot of this page; the coda is /hobby. */}
          <Link
            href="/hobby"
            className="t-anno-sm text-mute transition-colors duration-150 hover:text-detect"
          >
            Hobby →
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="panel ticks mt-8 p-8 text-center">
            <h2 className="t-display text-2xl">
              {PROJECTS_COPY.emptyHeadingPrefix} &ldquo;{query}&rdquo;
            </h2>
            <p className="mt-3 text-mute">{PROJECTS_COPY.emptyBody}</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="btn mt-6"
            >
              {PROJECTS_COPY.emptyReset}
            </button>
          </div>
        ) : (
          <>
            {deployed.length > 0 && (
              <section className="mt-12">
                {/* Not in the accent. The header above already spends
                    both of this viewport's two permitted amber marks —
                    the kicker and the coverage figure — so the two tier
                    labels are separated by weight instead, and the
                    deployed tier carries its notch to say the rest. */}
                <h2 className="t-anno mb-5 text-body">
                  Deployed &amp; openable
                </h2>

                {/* A wipe per cell, staggered — a comic panel is read
                    one edge at a time, and a grid that arrives all at
                    once has no reading order. The stagger is capped at
                    four steps: past about 120ms in total it stops
                    reading as sequence and starts reading as lag. */}
                <div className="grid gap-5 md:grid-cols-2">
                  {deployed.map((p, i) => (
                    <Reveal
                      key={p.slug}
                      effect={interacted ? "none" : "wipe"}
                      delay={interacted ? 0 : Math.min(i, 3) * 40}
                      className="h-full"
                    >
                      <ProjectCell project={p} wide />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section className="mt-10">
                <h2 className="t-anno mb-5 text-mute">Everything else</h2>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p, i) => (
                    <Reveal
                      key={p.slug}
                      effect={interacted ? "none" : "wipe"}
                      delay={interacted ? 0 : Math.min(i % 3, 3) * 40}
                      className="h-full"
                    >
                      <ProjectCell project={p} />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Contributions. Real data the previous design buried at the
            bottom of a long page — patches sent upstream to codebases he
            does not own are a different and harder claim than shipping
            his own repo, so they get their own ruled block. */}
        <section className="mt-20 border-t border-rule pt-12">
          {/* Same header anatomy as the page's, one register down: the
              headline is a section headline, so it takes the xl display
              face too, at the size a second-level heading can carry. */}
          <header className="mb-10 sm:mb-12">
            <div className="mb-5 flex items-center gap-4">
              <span className="t-anno-sm shrink-0 text-mute">—</span>
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
              <span className="t-anno shrink-0 text-mute">
                {PROJECTS_COPY.contributions.eyebrow}
              </span>
            </div>

            <Reveal
              as="h2"
              effect="wipe"
              className="t-display-xl max-w-[24ch] text-[1.75rem] sm:text-[2.25rem]"
            >
              {PROJECTS_COPY.contributions.heading}
            </Reveal>

            <p className="t-prose mt-5 text-[0.9375rem] leading-relaxed text-mute">
              {PROJECTS_COPY.contributions.body}
            </p>
          </header>

          <div className="grid gap-5 md:grid-cols-2">
            {CONTRIBUTIONS.map((c, i) => (
              <Reveal
                key={`${c.repo}-${c.pr.number}`}
                effect="wipe"
                delay={Math.min(i, 3) * 40}
                className="h-full"
              >
              <Panel
                kicker={c.repo}
                title={c.pr.title}
                state={c.pr.state === "merged" ? "live" : "wip"}
                /* Interactive in the same way the roster cells are — it
                   carries a link out — so it gets the same scan edge. */
                className="scan hud h-full"
              >
                <p className="text-[0.9375rem] leading-relaxed text-mute">
                  {c.description}
                </p>

                <p className="mt-3 text-[0.9375rem] leading-relaxed text-body">
                  {c.pr.summary}
                </p>

                <TagRow items={c.stack} className="mt-4" wrap />

                <div className="mt-5">
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                    >
                      {PROJECTS_COPY.contributions.viewPr} #{c.pr.number}
                    </a>
                  ) : (
                    /* No link rather than a dead one. The upstream
                       repository is private, and the data file's rule is
                       that a URL which 404s for a visitor is worse than
                       no URL at all. */
                    <p className="t-anno-sm text-mute">
                      {PROJECTS_COPY.contributions.privateRepo}
                    </p>
                  )}
                </div>
              </Panel>
              </Reveal>
            ))}
          </div>
        </section>

        <p className="t-anno-sm mt-16 text-mute">
          {PROJECTS_COPY.footerNote} {PROJECTS_COPY.footerExplorePrefix}{" "}
          <a
            href={PROFILE.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            {PROJECTS_COPY.footerExploreLink}
          </a>
        </p>
    </div>
  );
}

/* One roster entry. The whole cell is not a link: the title is, and the
   demo is separately. A card-sized click target that swallows both
   gives a visitor who wants the live build no way to ask for it. */
function ProjectCell({
  project,
  wide = false,
}: {
  project: Project;
  wide?: boolean;
}) {
  const contingency = contingencyFor(project);

  return (
    <Panel
      kicker={project.client}
      state={stateFor(project)}
      contingency={contingency}
      ticks={wide}
      /* `scan` is the Arkham convention of a surface resolving under
         scrutiny, and it is allowed here because the cell is already
         interactive — it is a hover affordance on a link, never the
         only signal that a thing can be used.

         `notch` cuts one corner off the deployed tier, so those panels
         read as plates rather than boxes. It is the structural
         difference the two tiers were missing: before this they were
         distinguished only by being wider, which is invisible once a
         visitor has scrolled past the first row. */
      className={`scan hud flex h-full flex-col ${wide ? "notch" : ""}`}
    >
      <h3 className="t-display text-xl sm:text-[1.4rem]">
        <Link
          href={`/projects/${project.slug}`}
          className="transition-colors duration-150 hover:text-detect"
        >
          {project.title}
        </Link>
      </h3>

      <p
        className={`mt-2.5 leading-relaxed text-mute ${
          wide ? "text-base" : "text-[0.9375rem]"
        }`}
      >
        {project.teaser}
      </p>

      <TagRow items={project.tags} className="mt-4" wrap />

      {/* Pushed to the bottom so a two-tier grid keeps its action row
          aligned across cells of different text lengths, and rendered
          only when it has something in it — with the duplicate dossier
          link gone, a cell whose repository is public and whose build
          is not deployed has an empty row, and an empty row is just a
          gap that makes the grid look mis-measured.

          The dossier link used to appear twice in every cell — once on
          the title and again as a "Read Overview" row beneath it, which
          put twenty-three duplicate links to twenty-three destinations
          on one page. A fact appears once per page, and a destination is
          a fact: the title is the link to the dossier, and this row is
          now only for the things the title is not. */}
      {(project.demo || project.links.length === 0) && (
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              /* Not in the accent, for the same reason the panel kicker
                 is not: five deployed builds are visible at once, so
                 five amber labels would spend the viewport's whole
                 budget on a repeated link. The arrow already marks it
                 as outbound. */
              className="t-anno-sm text-body transition-colors duration-150 hover:text-detect"
              /* The visible label is the same four words on every
                 deployed card, which is correct typographically and
                 wrong for anyone listing the page's links out of
                 context: four identical "Live App" entries pointing at
                 four different sites. Lighthouse flags exactly this.
                 The accessible name carries the project, the visible
                 text does not change, and the row stays a row. */
              aria-label={`${PROJECTS_COPY.cardDemoCta}: ${project.title}`}
            >
              {PROJECTS_COPY.cardDemoCta} ↗
            </a>
          )}

          {project.links.length === 0 && !project.demo && (
            /* Said out loud rather than shown as an empty button row.
               Several of these live in repositories that are not
               public, and the data treats that as a fact to state. */
            <span className="t-anno-sm text-mute">Private repository</span>
          )}
        </div>
      )}
    </Panel>
  );
}
