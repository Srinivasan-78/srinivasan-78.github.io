/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​‌‌​​‌​​‌‌‌​​‌​‌​​​​​​‌‌​​​​​​‌‌‌​​‌​‌​​​‌‌‌​‌‌​​‌‌​​​‌‌‌​​‌​‌‌​​‌‌​​​‌‌‌​​​​‌‌​​​​‌​​‌‌​‌​‌​‌‌‌‌​​​​‌​‌‌​​‌​​‌‌​‌​‌​‌‌​​‌​‌​‌​‌​​​‌​​‌‌‌​​‌​‌‌​​‌‌​​‌​​​​‌​​​‌‌​‌​​​​‌​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.fNP09Gf9f8a5xY5eQ9fB4-
 */
"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/* The theme switch, and it matters more here than on most sites.

   The two palettes in this design are authored independently rather
   than one derived from the other — the dark ground is warm-cold
   near-black with amber as genuine emission, the light ground is bone
   drafting paper with the accent restated as a stamped ink brown. That
   is the figure-ground reversal the brief is built on, so the toggle is
   not a convenience, it is the second half of the design.

   Three details worth keeping:

   One, the component renders nothing until it has mounted. The server
   cannot know the stored choice, so a button rendered during SSR would
   either claim the wrong state or have to be patched after hydration.
   The real resolution happens in BootScript before first paint; this
   only ever reads what BootScript already decided.

   Two, the reserved box. Returning null on the server and a button on
   the client would shift the header on hydration, so the placeholder
   occupies the same footprint.

   Three, the label says the destination, not the state — "Light" means
   "switch to light". A toggle labelled with its current state is a
   coin flip for the reader. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function apply(next: Theme) {
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
    try {
      /* An explicit choice outranks the OS setting from here on, which
         is what BootScript reads on the next visit. */
      localStorage.setItem("theme", next);
    } catch {
      /* Private mode throws on write. The attribute is already set, so
         the choice holds for this page view and simply does not
         survive a reload. That is the correct failure: a visitor who
         has blocked storage has asked not to be remembered. */
    }
  }

  if (theme === null) {
    return <span aria-hidden="true" className="block h-[30px] w-[86px]" />;
  }

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      className="t-anno-sm flex items-center gap-2 border border-rule px-2.5 py-1.5 text-mute transition-colors duration-150 hover:border-rule-strong hover:text-body"
    >
      {/* A filled/hollow pair rather than a sun and a moon. The design
          is about figure and ground, so the glyph is figure and ground:
          the square is solid when you are heading for dark. */}
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 border border-current ${
          next === "dark" ? "bg-current" : "bg-transparent"
        }`}
      />
      {next === "dark" ? "Dark" : "Light"}
      <span className="sr-only"> — switch to the {next} palette</span>
    </button>
  );
}
