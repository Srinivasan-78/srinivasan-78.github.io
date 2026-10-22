/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​​‌‌​‌‌‌‌​​‌​‌‌​‌​‌‌​‌​​​​​‌​‌​​​‌‌‌​‌​‌​‌​‌​‌‌‌​‌‌‌​‌​​​‌​‌​‌‌​​‌‌‌​‌‌​‌​​​​‌​​‌​‌‌​​‌‌​‌​​​‌‌​‌‌‌‌​‌‌​​‌​‌​‌‌​‌​​​​‌‌‌‌​​‌​‌​‌​‌‌​​‌​​‌​​​​‌‌​​​​‌​‌‌​‌‌‌​​‌‌​​​​‌​‌‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.cykAGUwEghK4oehyVHanaq
 */
"use client";

import { useEffect, useState } from "react";

/* One capped list, one control.

   Three places on this site render a filtered list of everything at once:
   23 projects, 24 certificates, 20 enterprise initiatives. Each is a
   legitimate thing to want to read in full, and none of it is worth
   facing in a single wall — a visitor deciding whether to keep reading
   should not have to scroll past four screens of cards to find out what
   is below them.

   The shape here is the one Nielsen's pagination work argues for: a
   single default page, one control to open the rest, and no per-page
   selector. Three rules it has to keep, which are the reason this is a
   shared hook rather than three hand-rolled copies:

   1. The count on the control is the number *actually still hidden under
      the current filter*, not the size of the whole collection. A button
      promising twelve more when the active filter holds three is worse
      than no button.
   2. Changing the filter or the search collapses the list again.
      Otherwise "show all" silently stays on, and the next filter the
      visitor picks dumps its entire contents on them — the exact thing
      this is here to prevent.
   3. One level, and the control is a toggle rather than a one-way door.
      It keeps the button mounted, so the keyboard focus that activated it
      still has somewhere to be afterwards. */

export function useCappedList<T>(items: T[], cap: number, resetKey: string) {
  const [expanded, setExpanded] = useState(false);

  /* Collapse whenever the caller's filter identity changes. Keyed on a
     string the caller composes, because the two list pages filter on a
     category *and* a search box and either one moving should reset. */
  useEffect(() => {
    setExpanded(false);
  }, [resetKey]);

  const overflowing = items.length > cap;
  const visible = expanded || !overflowing ? items : items.slice(0, cap);

  return {
    visible,
    expanded,
    /* False when the list already fits, so the control renders at all
       only when it has something to offer. */
    showControl: overflowing,
    hiddenCount: Math.max(0, items.length - cap),
    toggle: () => setExpanded((v) => !v),
  };
}

/* The label spells out what is behind the control, rather than saying
   "Show more" and making the visitor click to find out how much more
   there is. That is the information scent the pattern lives or dies on. */
export function ShowMoreButton({
  expanded,
  hiddenCount,
  noun,
  onClick,
}: {
  expanded: boolean;
  hiddenCount: number;
  /* Plural, and in the page's own vocabulary: "builds", "credentials",
     "initiatives" -- not a generic "items". */
  noun: string;
  onClick: () => void;
}) {
  return (
    <div className="flex justify-center mt-10">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={expanded}
        /* A filled surface, not a hairline outline on the page colour.
           Outlined, this sat on white as a 15%-alpha ring around grey
           type and read as decoration rather than as the one control
           standing between the reader and the rest of the list. */
        className="px-6 py-2.5 rounded-full text-xs font-semibold font-mono tracking-wide border bg-[#f5f5f7] dark:bg-[#09090c] border-black/20 dark:border-white/20 text-[#1d1d1f] dark:text-white hover:border-black/45 dark:hover:border-white/50 hover:bg-black/[0.06] dark:hover:bg-white/10 transition-colors"
      >
        {expanded ? `Show fewer ${noun}` : `Show all ${hiddenCount} more ${noun}`}
      </button>
    </div>
  );
}
