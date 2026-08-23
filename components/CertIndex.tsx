"use client";

import { useMemo, useState } from "react";
import { CERTS, ROWS, forRow, type Cert } from "@/lib/certs";
import GlowCard from "./ui/GlowCard";
import Reveal from "./Reveal";
import SplitReveal from "./SplitReveal";

/* Certifications, in the same material as the rest of the site.

   This page used to be its own world: shelf rows of 5rem type staggered
   across the full viewport, a black band that wiped over the one under
   the cursor, a curtain that grew out of the clicked row, and behind it
   a three.js deck of certificates drawn onto canvas textures and dealt
   one per scroll. It was the most elaborate thing on the site and the
   only page that shared no vocabulary with any other — different
   container, different type scale, different motion, different colours.

   What a visitor wants here is plain: what the credentials are, roughly
   what they cover, and a link that proves each one. That is a card
   grid, and the site already has a card grid — the same GlowCard, the
   same radius and proximity glow, the same section heading and eyebrow
   as Selected work and the project index.

   The filter is what survives of the old shelves: the six groupings are
   still there, as a row of chips rather than as a staircase. */

const seal = (
  <svg viewBox="0 0 120 120" aria-hidden="true" className="cert-seal">
    <circle cx="60" cy="60" r="53" />
    <circle cx="60" cy="60" r="45" className="cert-seal-inner" />
    <path d="M40 61 L53 76 L82 43" className="cert-seal-check" />
  </svg>
);

export default function CertIndex() {
  const [rowId, setRowId] = useState("all");

  const counts = useMemo(
    () => Object.fromEntries(ROWS.map((r) => [r.id, forRow(r).length])),
    []
  );

  const shown: Cert[] = useMemo(() => {
    const row = ROWS.find((r) => r.id === rowId) ?? ROWS[0];
    return forRow(row);
  }, [rowId]);

  return (
    <main id="content" tabIndex={-1} className="wrap cert-main">
      <div className="page-head">
        <span className="eyebrow">Certifications</span>
        <SplitReveal as="h1" text="Verified credentials" className="display display-lg" />
        <p>
          {CERTS.length} credentials from LinkedIn Learning, covering cloud platforms, automation,
          infrastructure as code and observability. Each one links to its own verification page, so
          you can confirm every single one.
        </p>
      </div>

      {/* A group of related controls, not a list of links: the group is
          labelled, each chip reports its own pressed state, and the
          count is part of the accessible name so it is not read as a
          bare number after the label. */}
      <div className="cert-filters" role="group" aria-label="Filter certificates">
        {ROWS.map((r) => (
          <button
            key={r.id}
            type="button"
            className={"cert-chip" + (r.id === rowId ? " is-on" : "")}
            aria-pressed={r.id === rowId}
            onClick={() => setRowId(r.id)}
          >
            {r.label}
            <span className="cert-chip-count" aria-hidden="true">
              {counts[r.id]}
            </span>
            <span className="sr-only">{`, ${counts[r.id]} certificates`}</span>
          </button>
        ))}
      </div>

      {/* The chips carry the counts, so this is not there to inform a
          sighted reader twice — it is the live region that tells a
          screen reader the grid changed under a filter press. */}
      <p className="eyebrow cert-count" aria-live="polite">
        {`${shown.length} ${shown.length === 1 ? "credential" : "credentials"}`}
      </p>

      {/* Keyed on the filter so the reveal replays when the set changes
          — without it the incoming cards would appear already-shown,
          since the group has been in view the whole time. */}
      <Reveal key={rowId} className="cert-grid" pop stagger={0.045}>
        {shown.map((c) => (
          <GlowCard key={c.url}>
            <article className="cert-card">
              <div className="cert-card-head">
                {seal}
                <span className="eyebrow cert-date">{c.date}</span>
              </div>
              <h2 className="card-title cert-name">{c.name}</h2>
              {c.skills.length > 0 && (
                <div className="cert-skills">
                  {c.skills.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <a
                className="lnk cert-link"
                href={c.url}
                target="_blank"
                rel="noopener"
                /* The card's own heading is not in the link, so a screen
                   reader reading links out of context would hear one
                   identical "Show credential" per card. */
                aria-label={`Show credential for ${c.name}`}
              >
                Show credential ↗
              </a>
            </article>
          </GlowCard>
        ))}
      </Reveal>

      <p className="micro cert-foot">(all issued by LinkedIn Learning · verification opens on linkedin.com)</p>
    </main>
  );
}
