/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌​‌‌​‌‌​‌​‌‌​‌​​‌​‌​​‌‌​‌​​‌​‌‌​​‌‌​​​‌‌​‌‌​​‌‌​​‌‌​​‌‌‌​​‌​​‌‌‌​‌‌‌​​‌‌​‌​‌​‌​​‌‌​‌​‌​‌​​​‌​‌​‌‌​‌​​‌‌‌​​​‌​​‌‌​‌​‌​‌‌​‌​‌‌​‌‌​​‌​‌​‌​​​​‌‌​‌​​‌​​​​‌​​​‌‌​​‌​​​‌​‌​​‌‌‌​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.KkJif6frw5MQZq5keCHFE8
 */
import Link from "next/link";
import DecryptText from "@/components/primitives/DecryptText";
import Reveal from "@/components/primitives/Reveal";
import FxBackdrop from "@/components/primitives/FxBackdrop";
import SpecBlock from "@/components/primitives/SpecBlock";
import Spotlight from "@/components/primitives/Spotlight";
import { Halftone, SignalBeam } from "@/components/primitives/Texture";
import { HOME_COPY, PROFILE } from "@/lib/data/profile";
import { AUTHORIZATION_COPY } from "@/lib/data/authorization";

/* The cover of the dossier, and the only part of this page that is not a
   numbered case.

   The composition is 7/4 with the ninth column left empty. That gap is
   the point: a case file opens on a mostly-blank sheet with the subject
   on one side and the front matter on the other, and the emptiness
   between them is what makes the two read as separate registers rather
   than as one crowded header.

   Two texture layers sit behind the content, and they are siblings
   rather than classes on the container for a reason that is easy to get
   wrong: `.halftone` and the beam both carry their own `opacity`, and
   opacity applies to a whole subtree. Put either class on the grid and
   the headline, the bio and the buttons all fade with it. As siblings
   they stay behind the type instead of over it. The halftone is cut on
   a `shard` — one of only two hard diagonals on the page, so the cover
   ends on the same angle the closing poster begins on.

   The plasma field sits *under* the beam rather than beside it, and the
   two are deliberately counted as one accent. Both are the same fact —
   light arriving from off-page — at two frequencies: the beam is a fixed
   cone, the plasma a slow drift behind it that stops after two cycles.
   Read as two separate marks they would blow the budget; read as one
   light source with a flicker in it, which is how they actually land,
   the viewport still spends amber exactly twice — this, and the one
   filled control.

   The status tick is `probe`, not signal, and it pulses three times and
   stops — a status light that throbs forever is an alarm, and alarm
   means one thing on this site.

   The ready badge is the one label on the page that resolves out of
   noise. It is the right sentence for it: a status line settling under
   scrutiny is the detective-mode convention, and the real string is
   what sits in the HTML — the scramble only happens after mount, so a
   crawler and a reader with scripting off get the words. Nothing else
   on the page gets this, because a page where every label unscrambles
   is a page that cannot be read.

   `.t-depth` is on the h1 and was checked at 360px before it stayed:
   the offsets are 2px and 4px against a 36px heavy uppercase glyph, so
   the second plate reads as off-register printing rather than as a
   drop shadow, and the letterforms keep their counters.

   The front matter deliberately does not restate anything the page
   already says. Revision 1 listed a Status row carrying the same string
   as the status line two inches above it, and a Clouds row carrying the
   same figure and the same sentence as case 01. Both are gone; the
   station is already in the eyebrow. What is left — role, employer and
   the author's alma mater — appears nowhere else on the page.

   REVISION 3. The scan field goes in behind everything else, and the
   cover is the one place on the site that gets the WebGL version —
   the detective overlay switching on is a thing that happens once, on
   arrival, and a site where every section runs a shader is a site
   with a framerate problem instead of an opening.

   It is a fourth texture sibling rather than a class, for the same
   subtree-opacity reason the comment above gives for the other three,
   and it is listed first so it sits furthest back: the beam and the
   plasma are warm light arriving from off-page, and the scan is a
   cold grid laid over the sheet. The order is what keeps them reading
   as two different kinds of light rather than one muddle.

   The pointer reticle needs the hero to be a spotlight host, so the
   content is wrapped in `Spotlight`. That wrapper is also what writes
   --mx/--my, and the reticle inherits them — one listener for the
   whole cover. Both are pointer-only; there is nothing to mark
   without a pointer, and the keyboard path gets the HUD brackets on
   the front matter instead. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* All three are siblings, absolutely positioned, aria-hidden and
          pointer-events off — and each carries its own mask, so none of
          them ends on a straight line where the section clips. */}
      {/* REVISION 4 — the cover's field is the Arkham CRT now.
          `ScanField` (the hand-written ogl shader) was correct and far
          too quiet; the owner's reading of the whole revision was
          "I don't see motion graphics". FaultyTerminal is the loudest
          thing in the vendored set — curvature, scanlines, chromatic
          aberration, a mutating glyph field and a glitch on click — and
          the cover is the one place on the site that should be loud,
          because arriving is a thing that happens once.

          Tinted to the detect cyan rather than its own palette, so the
          field belongs to the detective register in §1b instead of
          introducing a third colour. `mouseReact` is on: the overlay
          responding to where you point is the entire Arkham
          convention. */}
      <FxBackdrop
        kind="terminal"
        /* Held low and masked — see rule five in FxBackdrop. The CRT
           is the loudest field in the set and the only reason it can
           sit behind a headline at all is that it is composited as a
           texture rather than as a background. */
        opacity={0.34}
        props={{
          scale: 1.6,
          gridMul: [2, 1],
          digitSize: 1.2,
          timeScale: 0.4,
          scanlineIntensity: 0.4,
          glitchAmount: 1,
          flickerAmount: 0.5,
          noiseAmp: 0.7,
          chromaticAberration: 1.5,
          curvature: 0.08,
          vignette: 0.6,
          mouseReact: true,
          mouseStrength: 0.3,
          glow: 0.5,
          clickEffect: true,
          pageLoadAnimation: true,
          /* ONE, not 1.5, and this is free rather than a concession.
             Fragment cost scales with the square of this: 1.5 means
             2.25× the shader invocations per frame of a full-bleed
             canvas on the largest element of the page. What it buys is
             finer detail in the glyph field and the scanlines — behind
             `opacity: 0.34` and a feathered mask, under a headline.
             There is nothing there to see at the higher rate, and the
             cover is the one place on the site that cannot afford to
             be the thing that drops frames. */
          dpr: 1,
        }}
        /* Yellow on the slab, graphite on paper.
           The tint has to change with the palette and the reasoning
           inverts between them: against black the field IS the signal,
           so it takes the yellow; against white a yellow wash turns to
           weak tea and the only honest reading is a grey screen on a
           white sheet. Same translation §1 makes for the accent. */
        lightProps={{ tint: "#8f8f8c", brightness: 0.9 }}
        darkProps={{ tint: "#f5c518", brightness: 0.5 }}
      />
      <div
        aria-hidden="true"
        className="plasma pointer-events-none absolute inset-0"
      />
      <SignalBeam />
      <Halftone className="shard" />

      <Spotlight className="relative">
      <div aria-hidden="true" className="reticle" />
      <div className="relative mx-auto max-w-6xl px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* The subject */}
          <div className="lg:col-span-7">
            <div className="t-anno-sm text-mute">{HOME_COPY.eyebrow}</div>

            <div className="mt-3 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="tick-pulse h-1.5 w-1.5 rounded-full bg-probe"
              />
              <DecryptText
                text={AUTHORIZATION_COPY.readyBadge}
                className="t-anno-sm text-mute"
              />
            </div>

            {/* The page's one h1. Archivo Black is heavy and set
                uppercase here, so it takes a smaller size and fewer
                words per line than the serif it replaced — capped at
                about sixteen characters a line and allowed to run to
                three, which is how a poster sets a headline rather than
                shrinking it to fit one. */}
            <Reveal
              as="h1"
              effect="wipe"
              className="t-display-xl t-depth mt-6 max-w-[16ch] text-[2.25rem] sm:text-[3.25rem] lg:text-[4rem]"
            >
              {HOME_COPY.headline}
            </Reveal>

            <div className="t-prose mt-8 text-[0.9375rem] leading-relaxed text-mute sm:text-base">
              <p>{HOME_COPY.bio}</p>
              <p>
                {HOME_COPY.bioSecondary.before}
                <Link href={HOME_COPY.bioSecondary.link.href} className="link">
                  {HOME_COPY.bioSecondary.link.label}
                </Link>
                {HOME_COPY.bioSecondary.after}
              </p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {/* The electric border goes on the one filled control and
                  nowhere else. It is an edge, not a surface: a conic
                  gradient rotating behind a one-pixel inset, three turns
                  and done. A second one on the page would turn the
                  primary action into a row of equals. */}
              <Link href="/contact" className="btn btn-signal electric">
                {HOME_COPY.ctaContact}
              </Link>
              {/* A real file request, not a gated one — see the privacy
                  page: nothing is tracked per person for this download. */}
              <a href={PROFILE.resumePath} download className="btn">
                {HOME_COPY.ctaResume}
              </a>
              <Link href="/projects" className="btn">
                {HOME_COPY.ctaProjects}
              </Link>
            </div>
          </div>

          {/* The front matter. Column nine is deliberately skipped. */}
          <div className="lg:col-span-4 lg:col-start-9">
            {/* `hud` adds the four transient cyan brackets over the
                panel's own static amber corner ticks — a scan of a
                drawing, laid on the drawing. `sweep` crosses it once
                on arrival. Both are on the panel rather than the grid
                so neither can catch the headline. */}
            <Reveal effect="sweep" className="panel ticks hud p-5 sm:p-6">
              <SpecBlock
                caption="Front matter"
                rows={[
                  { label: "Role", value: PROFILE.roleShort },
                  { label: "Employer", value: PROFILE.currentEmployer },
                ]}
              />

              {/* Not a spec row: a forty-six character institution name
                  in a right-aligned tabular cell overflows a four-column
                  panel. A value that has to wrap is prose with a label,
                  not a figure. */}
              <div className="mt-5 border-t border-rule pt-4">
                <div className="t-anno-sm text-mute">Alumni</div>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-body">
                  {PROFILE.alumniOf}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      </Spotlight>
    </section>
  );
}
