/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​​‌​​‌‌​​​‌‌​‌​​‌‌‌​​​‌‌​‌​​​‌‌​‌‌​‌​‌​‌​​​​​‌​‌‌​​​​‌​‌​​‌​​‌​​​​‌​​‌‌​‌​‌​​‌​​​​‌‌​‌‌​​‌‌‌​‌‌​‌‌‌​​‌‌​​‌​‌​‌‌​​​‌​​‌‌​‌‌​‌​‌​​​​​‌​​‌‌​‌​‌​‌‌‌​​​​​‌‌‌‌​‌​​‌​‌‌​​‌​‌​‌​‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.RcN4mPXRBjCgnebmA5pzYU
 */
"use client";

import { useId, useState, type ReactNode } from "react";

/* Progressive disclosure, as a click and only as a click.

   Nothing on this site expands on hover or on scroll. That is partly
   the introvert reading of the persona — the visitor opens what they
   want open, and the page never grabs — and partly that the data here
   is genuinely long: twenty initiatives with a problem and a solution
   each, twenty projects with six to eleven architecture notes. Showing
   all of it at once is the mistake the previous design made and then
   had to patch with a "show more" cap.

   Implementation note: the open/close animation is a grid-template-rows
   transition from 0fr to 1fr rather than max-height. max-height needs a
   magic number that is either too small (content clipped) or too large
   (the ease runs out before the box does, so a short panel snaps). The
   grid version animates to the content's real height. Both rows and the
   `overflow: hidden` wrapper are in globals.css under .disclose-body. */

type DiscloseProps = {
  /** The always-visible row. Becomes the button's content. */
  summary: ReactNode;
  children: ReactNode;
  /** Mono label for the affordance, right-aligned. */
  openLabel?: string;
  closeLabel?: string;
  defaultOpen?: boolean;
  className?: string;
};

export default function Disclose({
  summary,
  children,
  openLabel = "Open",
  closeLabel = "Close",
  defaultOpen = false,
  className = "",
}: DiscloseProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="group flex w-full items-start justify-between gap-4 text-left"
      >
        <span className="min-w-0 flex-1">{summary}</span>

        <span className="t-anno-sm mt-1 flex shrink-0 items-center gap-1.5 text-mute transition-colors duration-150 group-hover:text-detect">
          {open ? closeLabel : openLabel}
          {/* A plus that becomes a minus. Two spans rather than an icon
              font, and the vertical bar is what rotates away — so the
              reduced-motion case still lands on the right glyph. */}
          <span
            aria-hidden="true"
            className="relative inline-block h-2.5 w-2.5"
          >
            <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
            <span
              className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current transition-transform duration-150 ${
                open ? "scale-y-0" : "scale-y-100"
              }`}
            />
          </span>
        </span>
      </button>

      <div id={id} className="disclose-body" data-open={open}>
        <div>{children}</div>
      </div>
    </div>
  );
}
