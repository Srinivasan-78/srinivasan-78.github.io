/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌​‌‌​‌​‌‌​‌‌‌​​‌‌‌​​​​​‌‌‌‌​‌​​​‌‌​‌‌​​​‌‌​​‌​​‌​​​‌​​​‌​​​‌‌​​​‌‌​‌​​​‌​​‌​​​​‌​‌‌​‌​​​‌‌​​‌‌​​‌‌​​​‌​‌‌‌​‌‌‌​‌‌‌​​​​​​‌‌‌​​‌​‌​​‌​​‌​‌‌​‌​​‌​‌​​​‌‌​​​‌‌‌​​​​‌‌​‌​‌​​‌​​‌‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.-npz62DF4HZ31wp9IiF8jN
 */
"use client";

import type { ElementType } from "react";
import { useInView } from "@/lib/useInView";

/* A heading that fades and rises once, the first time it is seen.

   It used to scramble its glyphs and resolve them character by
   character. That reads as noise before it reads as words: the visitor
   waits for the sentence to finish assembling before they can even
   start parsing it, and on a page with a heading every screenful it
   never stops happening. Same component, same call sites — the effect
   underneath is now the site's single shared transition. */
export default function SplitReveal({
  text,
  as: Tag = "span",
  className,
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <Tag
      ref={ref}
      className={[className, "reveal", inView && "is-in"].filter(Boolean).join(" ")}
    >
      {text}
    </Tag>
  );
}
