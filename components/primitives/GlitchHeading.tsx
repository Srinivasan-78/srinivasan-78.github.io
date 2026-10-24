/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌​​‌​‌​​‌​‌‌​​‌‌​​​‌​‌‌​‌‌​​​‌‌‌​‌​‌​‌​‌​‌‌‌​‌‌‌​‌​‌​‌‌​‌‌​​​‌‌​​‌​‌​​‌‌​​​‌​‌​​​‌‌‌​‌​‌‌​​‌​‌​‌​​‌​​​‌​‌‌​‌​‌​‌​​​​​‌​​​‌‌‌​‌​​‌​​‌​‌‌‌‌​‌​​​‌‌​​‌‌​‌​​​​‌​​‌‌‌​‌‌​​‌‌​‌​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.IK1luWule1GYR-PGIz3Bvk
 */
"use client";

import { useEffect, useState, type ElementType } from "react";
import GlitchText from "@/components/reactbits/GlitchText/GlitchText";

/* A heading that glitches, with the real heading underneath it.
 *
 * The vendored `GlitchText` is a div that duplicates its text into two
 * offset pseudo-element layers for the RGB split. Dropped straight into
 * a page as an h1 that would be three problems at once:
 *
 *   one, the semantic heading would be a div, so the document would
 *   have no h1 and the accessibility audit would fail;
 *   two, the text is duplicated in the rendered output, which the
 *   duplicate-string audit over the built HTML would flag — correctly,
 *   because a screen reader can read a pseudo-element's content;
 *   three, it is a client component, so a no-script visitor and any
 *   crawler that does not execute JS would get nothing.
 *
 * So the real heading is always rendered as the real tag, and the
 * glitch is swapped in only after mount and only when motion is
 * allowed. Before that moment — and forever, for a reduced-motion
 * visitor — what is on the page is a plain, correctly-tagged,
 * fully-styled heading. The effect is an enhancement laid over a
 * finished page, which is the same contract every entrance in
 * globals.css honours via `html.js`.
 *
 * `aria-hidden` on the glitch layer and the real text kept in an
 * `sr-only` sibling is what stops the duplication reaching the
 * accessibility tree: there is exactly one readable copy of the words
 * either way. */

type GlitchHeadingProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Glitch continuously, or only when pointed at. */
  trigger?: "always" | "hover";
};

export default function GlitchHeading({
  text,
  as: Tag = "h2",
  className = "",
  trigger = "hover",
}: GlitchHeadingProps) {
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setEnhanced(true);
  }, []);

  if (!enhanced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {/* The only copy of the words the accessibility tree sees. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="block">
        <GlitchText
          trigger={trigger}
          /* Short and sparse. A headline that is still tearing itself
             apart after you have read it is a headline you cannot
             read — the same loop rule the rest of the motion layer
             follows. */
          speed={0.6}
          intensity={0.45}
          mode="rgb"
          enableShadows
          /* Inherit the page's own display face and size rather than
             the component's defaults, so this is the site's h1 with an
             effect on it rather than a widget that happens to contain
             the same string. */
          fontSize="inherit"
          fontWeight="inherit"
          color="currentColor"
        >
          {text}
        </GlitchText>
      </span>
    </Tag>
  );
}
