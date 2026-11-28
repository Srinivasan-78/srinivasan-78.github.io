"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

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
    return <span aria-hidden="true" className="block h-10 w-10" />;
  }

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      aria-label={`Switch to the ${next} theme`}
      title={`Switch to the ${next} theme`}
      className="flex h-10 w-10 items-center justify-center rounded-[var(--r-pill)] border border-rule bg-panel-2 text-body transition-colors duration-200 hover:border-signal hover:text-signal"
    >
      {/* A sun and a moon, not the filled/hollow disc this used to be.
          The disc was the smaller idea and it failed the only test that
          matters: the owner could not find the control on the live page.
          Two states of one shape is only legible to someone who already
          knows there are two states — at 10px, with no label and nothing
          beside it to compare against, it read as a dot.

          The glyph shows the destination, like the label does: a sun
          means "switch to light". */}
      {next === "dark" ? (
        <FiMoon aria-hidden="true" className="h-[1.125rem] w-[1.125rem]" />
      ) : (
        <FiSun aria-hidden="true" className="h-[1.125rem] w-[1.125rem]" />
      )}
    </button>
  );
}
