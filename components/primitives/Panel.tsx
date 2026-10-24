/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​‌‌‌​‌​‌​‌‌​​‌​​​​‌‌​‌‌​‌​‌​​‌‌‌​‌‌‌​‌​‌‌​‌​​‌‌​‌‌​​​‌​‌​‌‌​​‌‌​‌​‌‌​‌‌​‌‌‌​​‌​‌​‌‌​​‌‌​​‌​‌​‌​​​​​‌​‌​‌​​‌‌​‌​‌​​‌‌​‌‌‌‌​​‌​‌‌​​‌‌​​‌​‌​‌‌‌​‌​‌‌​‌​​‌​‌​‌​‌​‌​‌​​‌‌​‌‌‌‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.GVCjwZlVknVeASSyfWZUSy
 */
import type { ElementType, ReactNode } from "react";

/* The unit of the whole design.

   A panel is a hairline rule and four corner ticks — the way a
   technical drawing is cropped — never a rounded card with a shadow.
   Depth comes from value steps and rule weight, which is the only kind
   of depth that survives the theme inversion this site does.

   The required anatomy, in order: a mono case index, the subject in the
   display serif, the body, and a CONTINGENCY line stating the failure
   mode. The last one is not optional. A panel with no honest failure
   mode is decoration, and decoration without a subject is the thing
   this design exists to avoid — so `contingency` being absent is a
   design smell worth seeing in the markup.

   See docs/design-contingency.md § "Required anatomy". */

export type PanelState = "live" | "active" | "wip" | "archived" | "reference";

/* The word next to the status tick. Status is never carried by colour
   alone: the tick is the glance, the word is the fact. */
const STATE_LABEL: Record<PanelState, string> = {
  live: "Live",
  active: "Active",
  wip: "In progress",
  archived: "Archived",
  reference: "Reference",
};

/* `probe` is the live colour and is used for nothing else, so a visitor
   learns what it means in one page. Everything dormant is `faint`,
   because a dot that is always coloured tells you nothing. */
const STATE_TONE: Record<PanelState, string> = {
  live: "bg-probe",
  active: "bg-probe",
  wip: "bg-signal",
  archived: "bg-faint",
  reference: "bg-faint",
};

type PanelProps = {
  /** Mono case index, top-left — "04". Pair with `total` for "04 / 09". */
  index?: string;
  total?: string;
  /** Annotation line above the title. Uppercase is applied by the class. */
  kicker?: string;
  title?: string;
  /** Heading level. A panel does not know where it sits, so the caller says. */
  titleAs?: ElementType;
  /** The failure mode, in the author's own words. See the note above. */
  contingency?: string;
  state?: PanelState;
  /** Drop the panel fill and keep only the rule — for panels on a panel. */
  flat?: boolean;
  /** Corner ticks are on by default; off for panels in a dense grid,
      where thirty-two tick marks stop reading as cropping and start
      reading as noise. */
  ticks?: boolean;
  className?: string;
  children?: ReactNode;
};

export default function Panel({
  index,
  total,
  kicker,
  title,
  titleAs: Title = "h3",
  contingency,
  state,
  flat = false,
  ticks = true,
  className = "",
  children,
}: PanelProps) {
  const hasHead = Boolean(index || kicker || title || state);

  return (
    <div
      className={[
        flat ? "panel-flat" : "panel",
        ticks ? "ticks" : "",
        "p-5 sm:p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {hasHead && (
        <div className="mb-4">
          {(index || state) && (
            <div className="mb-2.5 flex items-center justify-between gap-3">
              {index ? (
                <span className="t-anno-sm text-mute">
                  {total ? `Case ${index} / ${total}` : `Case ${index}`}
                </span>
              ) : (
                <span />
              )}

              {state && (
                <span className="t-anno-sm flex items-center gap-1.5 text-mute">
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${STATE_TONE[state]}`}
                  />
                  {STATE_LABEL[state]}
                </span>
              )}
            </div>
          )}

          {/* The kicker is NOT in the accent, and that is a correction
              rather than an oversight.

              It was `text-signal` first, which looked right on a single
              panel and was wrong the moment there were six in a grid:
              twenty initiative panels and a three-up project roster put
              six to nine amber labels on screen at once, against a
              stated budget of two per viewport. An accent that appears
              nine times is not an accent, it is a body colour — and the
              one place the design genuinely needs amber to mean
              something is the single filled control.

              Signal is therefore spent only on a SectionHead kicker,
              which is one per section, and on that control. A panel
              kicker is a label, so it is coloured like one. */}
          {kicker && <div className="t-anno mb-1.5 text-mute">{kicker}</div>}

          {title && (
            <Title className="t-display text-xl sm:text-[1.4rem]">{title}</Title>
          )}
        </div>
      )}

      {children}

      {contingency && (
        <p className="contingency">
          <span>Contingency</span>
          <span>{contingency}</span>
        </p>
      )}
    </div>
  );
}
