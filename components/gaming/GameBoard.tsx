import Icon from "@/components/primitives/Icon";
import Reveal from "@/components/primitives/Reveal";
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
 * mentioning that its author paints is a page with the wrong name.
 *
 * THE BAT IS GONE, and that is a deliberate removal rather than a
 * repair. A bat silhouette beside every favourite and every pursuit was
 * the last of the ops/case-file identity still being drawn anywhere on
 * the site — costume, by its own design brief's test — and it had no
 * reading in a warm, lit, glass language. The glyph, the fixed ground
 * mark, the route-transition swarm and their paint all went together,
 * rather than one of them being re-tinted to survive. */
export default function GameBoard() {
  return (
    <section className="relative">
      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="relative mb-10 sm:mb-12">
          {/* The WebGL dither field and the halftone screen that used to
              sit behind this head are gone; the ambient wash is what
              lights it, same as every other page. */}
          <div
            aria-hidden="true"
            className="head-wash pointer-events-none absolute -inset-x-8 -top-28 -z-10 h-[40rem]"
          />

          <div className="relative">
            <div className="t-anno-sm mb-3 text-signal">
              {GAMING_COPY.eyebrow}
            </div>

            <Reveal
              as="h1"
              effect="wipe"
              className="t-display-xl t-h1 max-w-[20ch]"
            >
              {GAMING_COPY.heading}
            </Reveal>

            <p className="t-prose t-lead mt-6 text-mute">{GAMING_COPY.body}</p>
          </div>
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

          <ul className="grid gap-3 sm:grid-cols-3">
            {FAVOURITES.map((game, i) => (
              <li key={game.id} className="h-full">
                <Reveal delay={i * 60} className="h-full">
                  <div className="glass glass-card glass-spec h-full p-5 sm:p-6">
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

          <ul className="grid gap-3 sm:grid-cols-3">
            {PURSUITS.map((p, i) => (
              <li key={p.id} className="h-full">
                {/* No hover affordance. Nothing in these is clickable,
                    and a hover state on a surface that cannot be used
                    is a promise the page does not keep. */}
                <Reveal delay={i * 60} className="h-full">
                  <div className="panel h-full p-5 sm:p-6">
                    <span className="flex items-center gap-2.5 text-mute">
                      <Icon name={p.icon} className="h-4 w-4" />
                      <span className="t-poster text-[1.25rem] leading-none text-body">
                        {p.title}
                      </span>
                    </span>
                    <p className="mt-3 text-[0.875rem] leading-relaxed text-mute">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        {/* The library, by genre. */}
        {/* Wraps, unlike the two rows above it, because this one has a
            count on the right as well as a subhead on the left and both
            are `shrink-0`. Two unshrinkable labels plus a rule between
            them do not fit a 375px column, and with nothing able to give
            the row simply ran past the viewport edge. */}
        <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="t-anno-sm shrink-0 text-mute">
            {GAMING_COPY.librarySubhead}
          </h2>
          <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          <span className="t-anno-sm shrink-0 text-mute">
            {BY_GENRE.length} genres · {GAME_COUNT} games
          </span>
        </div>

        <ul className="divide-y divide-rule border-y border-rule">
          {BY_GENRE.map((segment) => (
            <li key={segment.id} id={segment.id} className="hobby-segment py-6">
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
