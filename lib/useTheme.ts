/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌​‌‌​​‌​​‌‌‌‌​‌​​‌‌​‌​‌​‌​​‌‌​‌‌​‌​​​​‌‌​‌​​‌​‌​‌​​‌​​‌​‌‌​​‌​‌‌​‌‌​​​​‌‌​​​‌​‌‌​‌​‌​​‌‌‌​​​​​‌‌‌​​​‌​​‌​‌‌​‌​‌‌​‌‌​‌​‌‌​​‌‌​​​‌‌​‌‌‌​​‌‌​‌‌​​‌​‌​​​​​‌​‌​​‌​​‌​​‌‌​‌​‌​​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.vOMShiRYl1jpq-mf76PRMM
 */
"use client";

import { useEffect, useState } from "react";

/* Which palette is active, as React state.
 *
 * The stylesheet already themes itself off `html[data-theme]` without
 * any JavaScript — see §1 of globals.css — so nothing that can be done
 * in CSS should use this hook. It exists for the one thing CSS cannot
 * reach: the WebGL backgrounds in components/reactbits, which are
 * passed colours as props and compile them into shader uniforms. Those
 * cannot read a custom property, so something has to tell them which
 * palette they are painting into.
 *
 * Not wiring this was the cause of the bug the owner reported as "the
 * top section is not working on light and dark mode as expected":
 * four of the five vendored fields accept a `lightMode` flag and all
 * five were being handed dark-theme colours unconditionally, so on the
 * bone-paper palette they painted a dark panel over it.
 *
 * `light` is the default for the same reason the stylesheet defaults to
 * it: the server renders <html> with no data-theme attribute, because
 * it cannot know the visitor's stored choice. BootScript writes the
 * real value before the first paint, and the observer below picks up
 * every later change, so the theme toggle re-tints a live shader
 * without a reload. */

export type Theme = "light" | "dark";

function read(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function useTheme(): Theme {
  /* Initialised to the default rather than to `read()` so the first
     client render matches the server's markup. Reading the real value
     here would make this a hydration mismatch on every dark-theme
     visit; the effect below corrects it on the same tick. */
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(read());

    const mo = new MutationObserver(() => setTheme(read()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  return theme;
}
