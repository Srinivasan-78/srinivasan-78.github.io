import type { ElementType } from "react";
import Reveal from "./Reveal";

/* Every major section opens the same way: a case index, a kicker in the
   annotation register, the subject in the display face, and an optional
   lede in prose.

   It is a single component rather than a pattern copied per page so the
   rhythm cannot drift — the previous design had five section headers
   that were each slightly different, which reads as carelessness even
   when no single one of them is wrong.

   The `size` prop exists because that promise nearly broke. The title
   was hard-coded to `t-display`, so when the display face changed to a
   heavy uppercase grotesque and pages needed the larger `t-display-xl`
   register for their h1, two separate hand-rolled copies of this header
   appeared rather than one shared component — which is precisely the
   drift the paragraph above is about. The register is a prop now, so
   there is one header again. */

/* Three registers, because a heavy face needs them.

   md — mixed case, quieter. For a coda or a sub-section that should not
        shout over the section above it.
   lg — the section headline. Uppercase and tracked in.
   xl — a page's h1. The same treatment, one step up.

   The measure caps matter more than the sizes. A heavy uppercase
   grotesque shrunk to fit one line has given up its only advantage, so
   each of these caps the line and lets a long headline wrap to two or
   three instead. The caps get tighter as the size grows, which is the
   opposite of what a naive scale would do and is correct: the bigger
   the type, the fewer characters belong on a line. */
export type SectionHeadSize = "md" | "lg" | "xl";

/* The sizes are fluid clamps now rather than three breakpoint steps —
   see `.t-h1`/`.t-h2`/`.t-h3` in globals.css §3. The measure caps stay,
   and they still get tighter as the size grows: the bigger the type,
   the fewer characters belong on a line. */
const TITLE_CLASS: Record<SectionHeadSize, string> = {
  md: "t-display t-h3 max-w-2xl",
  lg: "t-display t-h2 max-w-[26ch]",
  xl: "t-display-xl t-h1 max-w-[22ch]",
};

type SectionHeadProps = {
  /* `index` and `total` are no longer rendered.
     They drew a case number on a hairline rule above every heading —
     "03 / 05" — which was the dossier identity stating itself once per
     section. The props stay in the type because eight call sites across
     five routes pass them and those routes are redesigned in later
     passes; removing the numbering is one edit here instead of eight
     there. They go when the last caller stops passing them. */
  index?: string;
  total?: string;
  kicker: string;
  title: string;
  lede?: string;
  titleAs?: ElementType;
  size?: SectionHeadSize;
  /* Bring the title in on a wipe — a hard edge travelling across it.
     A comic panel is read one edge at a time, and the wipe is the only
     entrance in the system with a direction. Off by default so a
     reference table does not animate its own heading. */
  titleReveal?: boolean;
  /* Which entrance, when titleReveal is on. `wipe` stays the default
     so no existing call site changes behaviour.

     `xray` is the detective-mode one: the heading arrives as a cyan
     outline and fills in. It is reserved for a page's own h1 and used
     at most once per page — a document where every heading resolves
     out of a wireframe is a document that cannot be skimmed, which is
     the same reason DecryptText is only ever on the one status line
     in the hero. */
  titleEffect?: "wipe" | "xray";
  /* The kicker is the one accent the header spends. A section that
     already has a filled control or a bold screen in the same viewport
     asks for `mute` instead, so the budget of two per viewport holds. */
  kickerTone?: "signal" | "mute";
  /** Right-hand slot — a filter row, a count, a link out. */
  aside?: React.ReactNode;
  className?: string;
};

export default function SectionHead({
  kicker,
  title,
  lede,
  titleAs: Title = "h2",
  size = "md",
  titleReveal = false,
  titleEffect = "wipe",
  kickerTone = "signal",
  aside,
  className = "",
}: SectionHeadProps) {
  return (
    <header className={`mb-7 sm:mb-9 ${className}`}>
      {/* The eyebrow. A short label directly above the headline, which
          is where a product page puts the category of what it is about
          to tell you — rather than a numbered rule running the width of
          the page, which is where a case file puts the file number. */}
      <div
        className={`t-anno-sm mb-3 ${
          kickerTone === "signal" ? "text-signal" : "text-mute"
        }`}
      >
        {kicker}
      </div>

      <div
        className={`flex flex-col md:flex-row md:items-end md:justify-between ${
          size === "md" ? "gap-6" : "gap-8"
        }`}
      >
        <div className="min-w-0">
          {titleReveal ? (
            /* `Reveal` renders the element itself, so the heading tag is
               passed to it rather than nested inside — wrapping a
               heading in an animated div would put a non-heading between
               the landmark and the outline. */
            <Reveal
              as={Title}
              effect={titleEffect}
              className={TITLE_CLASS[size]}
            >
              {title}
            </Reveal>
          ) : (
            <Title className={TITLE_CLASS[size]}>{title}</Title>
          )}

          {lede && (
            <p
              className={`t-prose text-[0.9375rem] leading-relaxed text-mute sm:text-base ${
                size === "md" ? "mt-4" : size === "lg" ? "mt-5" : "mt-6"
              }`}
            >
              {lede}
            </p>
          )}
        </div>

        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </header>
  );
}
