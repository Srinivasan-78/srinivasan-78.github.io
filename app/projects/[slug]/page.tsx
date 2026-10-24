/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌‌​‌​​‌‌​‌‌​‌​‌​​​‌​​​‌‌‌​‌​​​​‌‌​‌​‌​‌​​​​​‌​‌​​‌​‌‌​‌‌​​‌‌‌​​‌‌​‌‌‌​‌‌​‌​​​​‌‌​‌​‌‌​‌‌​‌​​​​​‌‌‌​​​​‌‌​‌​​​​‌‌‌​​‌​​‌​​‌​‌‌​‌‌​‌​‌​​‌‌​‌​​​​‌‌‌‌​​​​‌​​‌​‌​​‌​‌​​​​​‌‌​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.zmDt5AKg7hkh8hrKjhxJPm
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { PROJECTS, projectBySlug } from "@/lib/projects";
import { PROJECT_DETAIL_COPY } from "@/lib/data/profile";
import TagRow from "@/components/primitives/TagRow";
import Reveal from "@/components/primitives/Reveal";
import ScanField from "@/components/primitives/ScanField";
import { Chiaroscuro, SignalBeam } from "@/components/primitives/Texture";

/* The dossier.

   This is the page the whole design is built to serve. The writing here
   is genuinely good — six to eleven architecture notes per project, each
   one explaining a decision and the failure it was guarding against —
   and the previous design's chief sin was burying it under card chrome.
   So there is almost no chrome: a rule, a number, and the prose at a
   measure you can actually read.

   The architecture list is set as a measured drawing's callout
   schedule: numbered down the left, the label in the annotation
   register, the body in prose. That is a real convention for annotating
   a mechanism, which is exactly what each of these entries is.

   Nothing here is a client component. */

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return pageMetadata({
    title: p.title,
    description: p.teaser,
    path: `/projects/${p.slug}`,
  });
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  /* The demo is promoted to the front of the action row when it is not
     already one of the links. Several projects list the same URL twice
     — once as `demo` and once as a labelled link — and showing it twice
     would read as two different destinations. */
  const actions =
    p.demo && !p.links.some((l) => l.url === p.demo)
      ? [{ url: p.demo, label: PROJECT_DETAIL_COPY.demoActionLabel }, ...p.links]
      : p.links;

  /* The author's own admission, lifted out of the highlights list.
     Burying "Honest about the limit: an origin check stops casual abuse"
     as bullet six is the opposite of what writing it was for. */
  const honest = p.highlights.find((h) => /^Honest about/i.test(h));
  const highlights = p.highlights.filter((h) => h !== honest);

  const position = PROJECTS.findIndex((x) => x.slug === p.slug);
  const prev = position > 0 ? PROJECTS[position - 1] : undefined;
  const next =
    position < PROJECTS.length - 1 ? PROJECTS[position + 1] : undefined;

  return (
    <main id="content" tabIndex={-1}>
      <article className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-10">
        <Link
          href="/projects"
          className="t-anno-sm text-mute transition-colors duration-150 hover:text-detect"
        >
          ← {PROJECT_DETAIL_COPY.back}
        </Link>

        {/* Cover.
            The standfirst stays in Inter Tight. It was set in the
            display face when that face was a high-contrast serif, where
            a sentence at 1.5rem reads as an editorial opening; the
            display face is now a heavy uppercase grotesque, and a
            two-line teaser in Archivo Black is a brick. So the display
            register is spent on the title alone and the standfirst goes
            up a size in the body face instead, which is the pairing a
            poster uses: one shout, then prose.

            Chiaroscuro and the beam sit behind it as sibling layers —
            corners in shade so the middle of the sheet comes forward,
            and a cone of light from the lower left where a searchlight
            would be. Both are gradients. An outline would make the
            second one a logo, and the brief forbids that. */}
        <header className="relative mt-10 overflow-hidden border-b border-rule pb-10">
          <SignalBeam />
          <Chiaroscuro />
          {/* The hand-written ogl scan field, which revision 4 moved
              here off the home cover. The cover took the much louder
              FaultyTerminal, and this is the right home for the quiet
              one: a dossier is the page someone actually READS, across
              twenty-three routes, and a glyph storm behind three
              thousand words of prose would be unreadable. A slow cyan
              grid with a scan band passing over it is a field you can
              read on top of.

              It carries its own reduced-motion, no-WebGL and
              context-lost fallbacks internally — see the header of the
              component — so it needs no gate here. */}
          <ScanField />

          <div className="relative">
            <div className="t-anno mb-4 text-signal">
              {p.client} · {p.category}
            </div>

            {/* Uppercase and tracked in hard, so it takes a smaller size
                and fewer words per line than the serif it replaced, and
                is allowed to wrap to three lines rather than being shrunk
                to fit one.

                `xray` rather than `wipe` from revision 3: this is the
                page's own h1, and a dossier resolving out of a wireframe
                is the detective-mode arrival. One per page — the
                sections below keep the wipe, because a document where
                every heading unscrambles cannot be skimmed. */}
            <Reveal
              as="h1"
              effect="xray"
              className="t-display-xl max-w-[22ch] text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem]"
            >
              {p.title}
            </Reveal>

            <p className="mt-6 max-w-3xl text-lg leading-snug text-mute sm:text-[1.375rem]">
              {p.teaser}
            </p>

            {/* The title block's three figures. Each cell used to carry
                its label twice over — "Stack" above "6 technologies in
                stack", "Notes" above "7 architecture entries" — which is
                a column header repeated inside its own column. The label
                is the term; the cell is the figure, set in the poster
                register because that is what a figure is for. */}
            <dl className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-3">
              <div className="bg-ground p-3.5">
                <dt className="t-anno-sm mb-1 text-mute">
                  {PROJECT_DETAIL_COPY.statusPrefix}
                </dt>
                <dd className="t-poster text-xl text-body">{p.status}</dd>
              </div>
              <div className="bg-ground p-3.5">
                <dt className="t-anno-sm mb-1 text-mute">Stack</dt>
                <dd className="t-poster text-xl text-body">{p.stack.length}</dd>
              </div>
              <div className="bg-ground p-3.5">
                <dt className="t-anno-sm mb-1 text-mute">Architecture notes</dt>
                <dd className="t-poster text-xl text-body">
                  {p.architecture.length}
                </dd>
              </div>
            </dl>

            {actions.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {actions.map((link, i) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    /* Exactly one filled control per page. The live build
                       is the thing a visitor most wants, so it gets it. */
                    className={i === 0 ? "btn btn-signal" : "btn"}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              /* No links is a deliberate state, not a gap: the repository
                 is private or internal. The data file's rule is that a
                 button going nowhere is worse than no button, so this
                 says why and offers the one route that does work. */
              <div className="panel-flat ticks mt-8 p-5">
                <p className="t-anno-sm text-mute">
                  {PROJECT_DETAIL_COPY.noLinksNote}
                </p>
                <Link href="/contact" className="btn mt-4">
                  {PROJECT_DETAIL_COPY.noLinksCta}
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Overview */}
        <section className="py-12">
          <h2 className="t-anno mb-5 text-signal">
            {PROJECT_DETAIL_COPY.overviewEyebrow}
          </h2>
          <p className="t-prose text-[1.0625rem] leading-relaxed">{p.overview}</p>
        </section>

        {/* The callout schedule. */}
        <section className="border-t border-rule py-12">
          <header className="mb-10">
            <h2 className="t-anno mb-3 text-signal">
              {PROJECT_DETAIL_COPY.breakdownEyebrow}
            </h2>
            <Reveal
              as="p"
              effect="wipe"
              className="t-display-xl text-[1.75rem] sm:text-[2.25rem]"
            >
              {PROJECT_DETAIL_COPY.breakdownHeading}
            </Reveal>
            <p className="t-prose mt-3 text-mute">
              {PROJECT_DETAIL_COPY.breakdownBody}
            </p>
          </header>

          {/* The leader line of the drawing, and the one place on the
              site where the real geometry animates rather than a box
              being revealed: an SVG rule that inks itself from the top
              once the schedule comes into view, the way a blueprint is
              drawn or an overlay resolves.

              `preserveAspectRatio="none"` lets one 100-unit line stretch
              to whatever height eleven entries need, which is why the
              dash length passed to Reveal is 100 — the line's own length
              in user units, before the stretch. `non-scaling-stroke`
              keeps it a hairline at any height.

              Hidden below `sm`, where the grid collapses to one column
              and there is no gutter for it to run down. */}
          <div className="relative">
            <Reveal
              effect="draw"
              drawLength={100}
              className="pointer-events-none absolute inset-y-0 left-[4.75rem] hidden w-px sm:block"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 1 100"
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <line
                  x1="0.5"
                  y1="0"
                  x2="0.5"
                  y2="100"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  className="stroke-rule-strong"
                />
              </svg>
            </Reveal>

            <ol className="divide-y divide-rule border-y border-rule">
              {p.architecture.map((entry, i) => (
                <li
                  key={entry.label}
                  className="grid gap-x-6 gap-y-2 py-6 sm:grid-cols-[4rem_1fr]"
                >
                  {/* The number is the drawing's callout tag. It sits in
                      its own column so the prose keeps a single left edge
                      all the way down the page — a list that indents its
                      body under a number loses that, and the measure is
                      the only thing making eleven entries readable. */}
                  <div className="t-anno-sm pt-1 text-mute">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0">
                    <h3 className="t-anno mb-2 text-body">{entry.label}</h3>
                    <p className="max-w-[62ch] leading-relaxed text-mute">
                      {entry.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Highlights, with the admission given its own weight. */}
        <section className="border-t border-rule py-12">
          <h2 className="t-anno mb-3 text-signal">
            {PROJECT_DETAIL_COPY.highlightsEyebrow}
          </h2>
          <Reveal
            as="p"
            effect="wipe"
            className="t-display-xl mb-8 text-[1.75rem] sm:text-[2.25rem]"
          >
            {PROJECT_DETAIL_COPY.highlightsHeading}
          </Reveal>

          <ul className="divide-y divide-rule border-y border-rule">
            {highlights.map((h) => (
              <li key={h} className="flex gap-4 py-4">
                {/* A decorative dash, so it is coloured as furniture.
                    In the accent family it repeated up to eleven times
                    down a single list, which is the accent budget spent
                    entirely on punctuation. */}
                <span aria-hidden="true" className="t-anno-sm mt-1 text-mute">
                  —
                </span>
                <span className="max-w-[64ch] leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>

          {honest && (
            /* The contingency, at full size rather than as a footnote.
               The whole design is named after this sentence existing. */
            <p className="contingency mt-8 border-t-0 pt-0 text-[0.8125rem]">
              <span>Honest about</span>
              <span className="max-w-[64ch]">
                {honest.replace(/^Honest about\s*/i, "")}
              </span>
            </p>
          )}
        </section>

        {/* Stack */}
        <section className="border-t border-rule py-12">
          <h2 className="t-anno mb-5 text-signal">
            {PROJECT_DETAIL_COPY.stackEyebrow}
          </h2>
          <TagRow items={p.stack} wrap />
        </section>

        {/* Prev / next, so the set reads as a set. */}
        <nav
          aria-label="Other projects"
          className="grid gap-px border border-rule bg-rule sm:grid-cols-2"
        >
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="group scan hud bg-ground p-5">
              <span className="t-anno-sm block text-mute">
                ← {PROJECT_DETAIL_COPY.prevLabel}
              </span>
              <span className="t-display mt-2 block text-lg transition-colors duration-150 group-hover:text-detect">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="bg-ground p-5" />
          )}

          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group scan hud bg-ground p-5 sm:text-right"
            >
              <span className="t-anno-sm block text-mute">
                {PROJECT_DETAIL_COPY.nextLabel} →
              </span>
              <span className="t-display mt-2 block text-lg transition-colors duration-150 group-hover:text-detect">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="bg-ground p-5" />
          )}
        </nav>
      </article>
    </main>
  );
}
