/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​‌​​​​‌‌‌​​‌​‌​‌​‌​‌​‌​‌​​‌​​‌‌‌​​‌‌​​‌‌​‌‌‌​‌‌‌‌​​​​‌​‌‌​​​​​‌‌‌​​‌​‌​‌‌​‌​​‌‌​​​​‌​‌‌‌‌​​​​‌‌‌​‌​‌​‌‌‌‌​‌​​‌‌‌‌​​​​‌‌‌​​​​​‌‌​​‌‌​​​‌​‌‌​‌​‌​‌​​‌‌​‌‌​‌​​‌​‌​‌​‌​​​‌‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.49URs7xX9Zaxuzxpf-SiTq
 */
import BatGlyph from "@/components/primitives/BatGlyph";
import FxBackdrop from "@/components/primitives/FxBackdrop";
import GlitchHeading from "@/components/primitives/GlitchHeading";
import Icon from "@/components/primitives/Icon";
import Reveal from "@/components/primitives/Reveal";
import { Halftone } from "@/components/primitives/Texture";
import {
  BY_GENRE,
  FAVOURITES,
  GAME_COUNT,
  GAMING_COPY,
  PURSUITS,
} from "@/lib/data/gaming";

/* The hobby page.
 *
 * REVISION 7 — rebuilt, and mostly by subtraction.
 *
 * WHAT WENT. The completed board, the series "chains", the spine, the
 * one-offs credit block, the "in rotation" pair, the most-played bar
 * chart, and every hour figure on the page. All of it on instruction:
 * no comparison, no completion rate, no scoreboard. The page had
 * accumulated five different ways of ranking the same 219 games, which
 * is four more than a hobby needs.
 *
 * Worth recording why the chain idea went, since earlier revisions
 * argued hard for it. "A run of games played in order is a track, so
 * draw it as one" was a good idea resting on a claim — that the run
 * was COMPLETE — and ten linked nodes only reads as "finished all ten"
 * while that claim holds. With completion off the table the chain is a
 * decorated list with a false implication baked into its shape. The
 * form had to go with the claim it was drawing.
 *
 * WHAT REPLACED IT. One axis: genre. Fifteen segments, every game in
 * exactly one, nothing ranked against anything. Puzzle and Detective
 * lead because they are what the owner says he actually likes, not
 * because they are biggest — Action-adventure is three times the size
 * and sits third.
 *
 * Each segment is a labelled rule and a dense run of names in the
 * poster face, the way a poster sets its credits. Printed matter
 * rather than an interface: nothing to click and nothing to filter,
 * because 219 interactive targets would be a worse page than 219
 * words. The count beside each label is the segment's own size — a
 * fact about the list rather than a score — and it is read off the
 * data, so it cannot disagree with the names beneath it.
 *
 * The three pursuits above the list are why the page is called Hobby
 * and not Games. A page listing 219 games under that title while never
 * mentioning that its author paints is a page with the wrong name. */
export default function GameBoard() {
  return (
    <section className="relative">
      {/* The one overtly retro-game field in the set, held low and
          masked so it reads as tooth on the surface rather than as a
          panel — see rule five in FxBackdrop. */}
      <FxBackdrop
        kind="dither"
        opacity={0.22}
        props={{
          waveSpeed: 0.018,
          waveFrequency: 2.6,
          waveAmplitude: 0.26,
          colorNum: 3,
          pixelSize: 3,
          enableMouseInteraction: true,
          mouseRadius: 0.35,
          backgroundColor: "transparent",
        }}
        lightProps={{ waveColor: "#bfbfbb" }}
        darkProps={{ waveColor: "#3d3d3b" }}
      />
      <Halftone />

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-7 sm:mb-9">
          <div className="mb-5 flex items-center gap-4">
            <span className="t-anno-sm shrink-0 text-mute">04 / 05</span>
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            <span className="t-anno shrink-0 text-mute">
              {GAMING_COPY.eyebrow}
            </span>
          </div>

          {/* Glitch rather than the x-ray the other page heads use:
              this is the games page, and RGB-split is the native idiom
              of the medium it is about. */}
          <GlitchHeading
            as="h1"
            text={GAMING_COPY.heading}
            className="t-display-xl max-w-[20ch] text-[2.25rem] sm:text-[3.25rem] lg:text-[4rem]"
          />

          <p className="t-prose mt-6 text-[0.9375rem] leading-relaxed text-mute sm:text-base">
            {GAMING_COPY.body}
          </p>
        </header>

        {/* Favourites, above both the pursuits and the library: this
            is the shortest answer to "what do you play", and a page
            that makes you read 219 names to find out has buried it.
            Three plates, because three items in a row read as a set
            while three rows read as the start of a longer list. */}
        <div className="mb-12">
          <div className="mb-4 flex items-baseline gap-4">
            <h2 className="t-anno-sm shrink-0 text-mute">
              {GAMING_COPY.favouritesSubhead}
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </div>

          <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
            {FAVOURITES.map((game, i) => (
              <li key={game.id}>
                <Reveal
                  effect="sweep"
                  delay={i * 60}
                  className="flex h-full items-center gap-4 bg-ground p-5 sm:p-6"
                >
                  <BatGlyph className="h-5 w-10 shrink-0 text-signal-dim" />
                  <div className="min-w-0">
                    <div className="t-poster text-[1.375rem] leading-none text-body">
                      {game.title}
                    </div>
                    <div className="t-anno-sm mt-2 text-mute">{game.kind}</div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* Away from the screen. */}
        <div className="mb-12">
          <div className="mb-4 flex items-baseline gap-4">
            <h2 className="t-anno-sm shrink-0 text-mute">
              {GAMING_COPY.pursuitsSubhead}
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </div>

          <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
            {PURSUITS.map((p, i) => (
              <li key={p.id}>
                {/* No `.scan` and no `.hud`. Nothing in these is
                    clickable, and a hover affordance on a surface that
                    cannot be used is a promise the page does not keep —
                    the rule components/home/Clearance.tsx states for
                    its own cells, which an earlier version of this
                    page broke. */}
                <Reveal
                  effect="sweep"
                  delay={i * 60}
                  className="flex h-full flex-col bg-ground p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5 text-mute">
                      <Icon name={p.icon} className="h-4 w-4" />
                      <span className="t-poster text-[1.25rem] leading-none text-body">
                        {p.title}
                      </span>
                    </span>
                    <BatGlyph className="h-3 w-6 shrink-0 text-rule-strong" />
                  </div>
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-mute">
                    {p.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* The library, by genre. */}
        <div className="mb-4 flex items-baseline gap-4">
          <h2 className="t-anno-sm shrink-0 text-mute">
            {GAMING_COPY.librarySubhead}
          </h2>
          <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          <span className="t-anno-sm shrink-0 text-mute">
            {BY_GENRE.length} genres · {GAME_COUNT} games
          </span>
        </div>

        <ul className="divide-y divide-rule border-y border-rule">
          {BY_GENRE.map((segment, i) => (
            <li key={segment.id} id={segment.id}>
              <Reveal
                effect="wipe"
                delay={Math.min(i, 8) * 35}
                className="py-6"
              >
                <div className="mb-3 flex items-baseline gap-3">
                  <h3 className="t-poster text-[1.375rem] leading-none text-body">
                    {segment.genre}
                  </h3>
                  <span className="t-anno-sm shrink-0 text-mute">
                    {segment.titles.length}
                  </span>
                </div>

                {/* A credit block. One run of names with a hairline
                    between them rather than a grid — a grid would
                    impose a reading order on games that have none. */}
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  {segment.titles.map((title, t) => (
                    <li key={title} className="flex items-center gap-3">
                      {t > 0 && (
                        <span aria-hidden="true" className="h-3 w-px bg-rule" />
                      )}
                      <span className="t-poster text-[1.0625rem] leading-none text-mute">
                        {title}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="t-prose mt-4 text-[0.8125rem] leading-relaxed text-mute">
          {GAMING_COPY.libraryNote}
        </p>
      </div>
    </section>
  );
}
