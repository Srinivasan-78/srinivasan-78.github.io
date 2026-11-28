"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHead from "@/components/primitives/SectionHead";
import TagRow from "@/components/primitives/TagRow";
import Reveal from "@/components/primitives/Reveal";
import { CERTS, ROWS, forRow, type Cert } from "@/lib/certs";
import { CERTIFICATIONS_COPY } from "@/lib/data/profile";

/* The credential index.

   Twenty-four LinkedIn Learning certificates are twenty-four
   near-identical records: a name, a month, a skill or two, a
   verification URL. The previous design drew each one as a card with a
   glyph and a hover state, which made the page read as twenty-four
   claims of equal weight and buried the only thing that distinguishes
   them — the verification link — at the bottom of a tile.

   So this is an index, the way a bibliography is an index: a single
   ruled column, grouped by year, every row the same shape. Scanning it
   top to bottom is the point. The year headings in the display serif
   are the only rhythm the page needs, and they carry the one piece of
   information the list itself cannot state — that the learning is
   continuous rather than a single burst.

   Provenance is a stated value of this record, so the verification link
   is a column of the row rather than a faint afterthought: it sits on
   the `link` class with its underline already drawn, because an
   underline that appears on hover is a citation the reader has to go
   looking for.

   Only the chip row has state, so this whole component is the client
   leaf and the page above it stays a server component. */

/* The year order comes from the data rather than from sorting the
   records, because the strip that reads these years is part of the copy
   and its order is the author's. A year with nothing under the current
   filter is dropped, not shown empty. */
const YEARS = CERTIFICATIONS_COPY.timelineYears;

export default function CertIndex() {
  const [rowId, setRowId] = useState(ROWS[0].id);

  // Optimistic UI filter persistence across navigation
  useEffect(() => {
    try {
      const savedIndex = sessionStorage.getItem("sv_active_tab");
      if (savedIndex !== null) {
        const idx = Number.parseInt(savedIndex, 10);
        if (Number.isInteger(idx) && idx >= 0 && idx < ROWS.length) {
          setRowId(ROWS[idx].id);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const idx = ROWS.findIndex((r) => r.id === rowId);
      if (idx >= 0) {
        sessionStorage.setItem("sv_active_tab", String(idx));
      }
    } catch {}
  }, [rowId]);

  /* Counts are computed once for all six rows, not per render pass of
     the pressed one: a chip that only knows its own total cannot tell
     the visitor what pressing it would cost them. */
  const counts = useMemo(
    () => Object.fromEntries(ROWS.map((r) => [r.id, forRow(r).length])),
    []
  );

  const shown = useMemo(() => {
    const row = ROWS.find((r) => r.id === rowId) ?? ROWS[0];
    return forRow(row);
  }, [rowId]);

  /* Grouped in the years' own order, with empty groups removed. */
  const groups: { year: string; certs: Cert[] }[] = YEARS.map((year) => ({
    year,
    certs: shown.filter((c) => c.year === year),
  })).filter((g) => g.certs.length > 0);

  return (
    <main id="content" tabIndex={-1}>
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* The page header. The halftone screen cut on the diagonal and
            the WebGL beam field behind it are both gone; what lights the
            top of the page is the site's ambient wash, which is three
            static gradients and no shader. This page is a reference
            table, and a graphic layer running all the way down
            twenty-four rows would be wallpaper either way. */}
        <div className="relative mb-10 sm:mb-14">
          <div
            aria-hidden="true"
            className="head-wash pointer-events-none absolute -inset-x-8 -top-28 -z-10 h-[40rem]"
          />

          <div className="relative">
            <SectionHead
              kicker={CERTIFICATIONS_COPY.eyebrow}
              title={CERTIFICATIONS_COPY.heading}
              titleAs="h1"
              lede={CERTIFICATIONS_COPY.body}
              size="xl"
              titleReveal
              className="mb-0"
              aside={
                /* The count is announced once, not printed twice. It
                   used to appear as a figure and then again inside
                   "Showing 24 verified credentials" directly beneath —
                   the same number two inches apart, which is the
                   duplication the brief forbids. The live region now
                   wraps the figure and its noun and nothing else, so a
                   chip press announces "24 / 24 verified credentials"
                   rather than reading the issuer out again every time. */
                <div className="text-left md:text-right">
                  <div aria-live="polite">
                    <div className="t-poster text-[2.75rem] leading-none text-body">
                      {shown.length}
                      {shown.length !== CERTS.length && (
                        <span className="text-[0.55em] text-mute">
                          {" "}
                          / {CERTS.length}
                        </span>
                      )}
                    </div>

                    <div className="t-anno-sm mt-2 text-mute">
                      {CERTIFICATIONS_COPY.showingSuffix}
                    </div>
                  </div>

                  <div className="t-anno-sm mt-1 text-mute">
                    {CERTIFICATIONS_COPY.issuerLabel}
                  </div>
                </div>
              }
            />
          </div>
        </div>

        {/* The filter. Six groupings, each labelled with what it holds —
            the count is the whole reason a chip is worth pressing. The
            chips share one glass sheet so they read as a control group
            rather than six loose pills on the page. */}
        <div className="glass glass-card glass-spec p-4 sm:p-5">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={CERTIFICATIONS_COPY.eyebrow}
          >
            {ROWS.map((row) => (
              <button
                key={row.id}
                type="button"
                className="chip"
                aria-pressed={row.id === rowId}
                onClick={() => setRowId(row.id)}
              >
                {row.label}
                <span aria-hidden="true" className="ml-2 opacity-70">
                  {counts[row.id]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-14">
          {/* One entrance per year group rather than one per row.
              Twenty-four rows arriving one at a time would be a page
              animating itself while it is being read; four groups is the
              rhythm the content already has. */}
          {groups.map((group, i) => (
            <Reveal key={group.year} as="section" delay={Math.min(i, 3) * 40}>
              {/* The year on its own rule: the label interrupts the line
                  rather than sitting above it. Set in the poster
                  register — tabular figures — because a year is a
                  figure, and four of them down the page are the only
                  rhythm a reference table needs. */}
              <div className="flex items-baseline gap-4">
                <h2 className="t-poster t-h2 shrink-0">{group.year}</h2>
                <span aria-hidden="true" className="h-px flex-1 bg-rule" />
                <span className="t-anno-sm shrink-0 text-mute">
                  {group.certs.length}
                </span>
              </div>

              <ul className="mt-5 divide-y divide-rule border-y border-rule">
                {group.certs.map((cert) => (
                  <li
                    key={cert.url}
                    /* Twelve columns from `sm` up and one column below
                       it. At 360px the name gets the full width and
                       wraps; nothing in the row is allowed to set a
                       minimum that would push the page sideways, which
                       is why every cell carries `min-w-0` and the name
                       breaks on a long word rather than overflowing. */
                    className="grid gap-x-4 gap-y-2.5 py-5 sm:grid-cols-12"
                  >
                    <div className="min-w-0 sm:col-span-7">
                      <h3 className="text-[0.9375rem] leading-snug break-words text-body">
                        {cert.name}
                      </h3>

                      {cert.skills.length > 0 && (
                        <TagRow className="mt-2.5" items={cert.skills} wrap />
                      )}
                    </div>

                    <div className="t-metric min-w-0 text-[0.8125rem] text-mute sm:col-span-2">
                      {cert.date}
                    </div>

                    <div className="min-w-0 sm:col-span-3 sm:text-right">
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link t-anno-sm inline-flex min-h-6 items-center py-1"
                        /* The visible label is two words, which is
                           ample next to the name on screen and useless
                           read out of context in a list of twenty-four
                           identical links. The accessible name names
                           the credential it verifies. */
                        aria-label={`${CERTIFICATIONS_COPY.verifiedIdLabel} — ${cert.name}`}
                      >
                        {CERTIFICATIONS_COPY.verifyCta}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* The provenance statement, in the author's words. It is the
            claim the whole page rests on, so it is typeset rather than
            tucked into a tooltip. */}
        <div className="glass glass-card glass-spec mt-12 p-6 sm:p-7">
          <div className="t-anno text-signal">
            {CERTIFICATIONS_COPY.verifiedStrip}
          </div>
          <p className="t-prose mt-3 text-[0.9375rem] leading-relaxed text-mute">
            {CERTIFICATIONS_COPY.footerNote}
          </p>
        </div>
      </section>
    </main>
  );
}
