/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​​​​​‌​​​​​‌​‌‌​‌‌‌‌​‌​​‌‌​​​‌‌‌​​‌‌​‌​​​‌​‌​‌​​‌​‌‌​‌​​‌‌​‌​‌​‌‌​‌​​‌‌‌​​‌‌​‌‌​‌‌​‌​‌​​​‌‌‌​‌​​​‌‌​​‌​‌‌​​‌​‌‌​‌‌‌‌​‌‌​‌​‌‌​‌​​​‌‌‌​‌‌​​‌​​​‌‌‌‌​​‌​​‌‌‌​​‌​‌​​​​​‌​‌‌‌​‌​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.PAoLsEKMZsmGFYokGdy9At
 */
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

const TITLE_CLASS: Record<SectionHeadSize, string> = {
  md: "t-display max-w-2xl text-[1.5rem] leading-[1.1] sm:text-[2rem] lg:text-[2.25rem]",
  lg: "t-display-xl max-w-[22ch] text-[1.75rem] sm:text-[2.375rem] lg:text-[2.875rem]",
  xl: "t-display-xl max-w-[20ch] text-[2.25rem] sm:text-[3.25rem] lg:text-[4rem]",
};

type SectionHeadProps = {
  index: string;
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
  index,
  total,
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
      {/* The index sits on its own rule, which is what makes the page
          read as a numbered dossier rather than as a stack of sections.
          The rule runs to the full width; the label interrupts it. */}
      <div className="mb-5 flex items-center gap-4">
        <span className="t-anno-sm shrink-0 text-mute">
          {total ? `${index} / ${total}` : index}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-rule" />
        <span
          className={`t-anno shrink-0 ${
            kickerTone === "signal" ? "text-signal" : "text-mute"
          }`}
        >
          {kicker}
        </span>
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
