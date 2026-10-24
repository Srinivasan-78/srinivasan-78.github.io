/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌​​​​‌‌​​‌​​​‌​‌​​‌‌​​‌‌‌​​​​‌‌​‌​‌​​‌​​​‌‌‌​‌​​​​​‌​‌​​‌‌​‌​‌‌‌​​​‌​‌‌‌‌​‌​​‌‌​​‌​‌​​‌‌​‌‌‌​‌‌​​​​‌​‌‌‌​​‌​​‌​‌‌​‌​​‌‌​‌‌​‌​‌​​​‌​‌​​‌‌​​​​​‌‌‌​‌‌‌​‌‌​​​‌​​‌‌​​​‌‌​‌‌​​‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.hdS8jGAMqze7arZmE0wbcg
 */
import type { ElementType, ReactNode } from "react";
import SectionHead from "@/components/primitives/SectionHead";

/* The home page's section head — now a thin delegate.
 *
 * This file used to carry its own copy of the header markup: the index
 * on its rule, the kicker interrupting it, the title, the lede, the
 * aside. It was written that way because `SectionHead` hard-coded its
 * title size, and revision 2 needed the heavier uppercase register.
 *
 * That left three hand-rolled headers across the site — this one and
 * two more written out inside the projects pages — which is exactly the
 * drift `SectionHead`'s own comment warns about: five slightly
 * different section headers read as carelessness even when no single
 * one of them is wrong. A second copy of a layout is a second place to
 * forget to fix something.
 *
 * So the register became a prop on the primitive and the markup now
 * exists once. What is left here is the home page's *defaults* — the
 * `lg` register and a title that arrives on a wipe — which is a
 * legitimate thing for a page to own, and spares eight call sites from
 * repeating two props each. It is a preset, not a component. */

type CaseHeadProps = {
  index: string;
  total?: string;
  kicker: string;
  title: string;
  lede?: string;
  titleAs?: ElementType;
  /** Right-hand slot — a count, a filter row, a link out. */
  aside?: ReactNode;
  /** `mute` where the viewport's two signal uses are already spent. */
  kickerTone?: "signal" | "mute";
  className?: string;
};

export default function CaseHead({
  index,
  total,
  kicker,
  title,
  lede,
  titleAs = "h2",
  aside,
  kickerTone = "signal",
  className = "",
}: CaseHeadProps) {
  return (
    <SectionHead
      index={index}
      total={total}
      kicker={kicker}
      title={title}
      lede={lede}
      titleAs={titleAs}
      aside={aside}
      kickerTone={kickerTone}
      className={className}
      size="lg"
      titleReveal
    />
  );
}
