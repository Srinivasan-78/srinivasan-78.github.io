/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌‌​​​​‌‌​‌​​​​‌‌​​‌‌‌​‌‌​​​​‌​‌‌​‌​​​​‌‌‌​​​‌​‌​‌‌​‌​​‌​‌‌​‌​​‌​‌‌​‌​​‌​‌​​​‌​​‌‌​‌‌‌​‌​‌​‌​‌​‌​​​‌‌​​‌​‌​‌‌‌​‌​‌‌‌‌‌​‌​‌‌​‌​​‌​​‌‌‌‌​‌‌​​‌‌‌​‌‌​‌​​​​‌‌‌​‌​‌​‌‌​‌‌​​​‌​​​​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.8hgahqZZZQ7UFW_ZOghulB
 */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import useTheme from "@/lib/useTheme";

/* The one gate every heavy background goes through.
 *
 * Revision 4 puts a real WebGL field behind five different page heads,
 * using the React Bits backgrounds vendored in components/reactbits.
 * Each of those is 20–35 KB of shader code running its own
 * requestAnimationFrame loop, and dropping five of them onto the site
 * unmanaged is how a portfolio ends up with a framerate problem instead
 * of a design. So none of them is used directly — they all come through
 * here, and this file owns the four rules that keep them affordable.
 *
 * ONE — nothing loads until it is needed. Every backdrop is a
 * `next/dynamic` import with `ssr: false`, so each lands in its own
 * chunk and a visitor only downloads the shader for the page they are
 * actually on. This is also a correctness requirement, not just a
 * weight one: these components touch `window` and `document` during
 * module evaluation, so server-rendering them would break the static
 * export.
 *
 * TWO — nothing mounts until it is on screen. An IntersectionObserver
 * gates the mount, not merely the animation, so a field below the fold
 * has no canvas and no GL context at all until it is scrolled to.
 *
 * THREE — reduced motion gets the static field instead. Not a paused
 * canvas: no mount, no context, no shader compile. `.detect-grid` from
 * globals.css §5e renders in its place, which is a composition in its
 * own right rather than a blank panel. This is the same contract
 * components/primitives/ScanField.tsx already honoured, applied to the
 * vendored components too, which do not enforce it themselves.
 *
 * FOUR — the static field is always behind the live one. It is a
 * sibling that renders unconditionally, so a failed chunk, a refused
 * GL context or a lost context leaves the composition intact rather
 * than leaving a hole. Nothing here has to detect failure for that to
 * work, which is why it is the arrangement rather than a handler.
 *
 * FIVE — nothing mounts while the page is still arriving. Added in
 * revision 12, for the lag at the top of the home page.
 *
 * Rules one and two were about weight and about offscreen work, and
 * both held. Neither covered the case that actually hurt: a field that
 * is ON screen at the top of the page, whose IntersectionObserver
 * therefore fires on the very first callback. The cover's field is
 * `FaultyTerminal`, the heaviest shader in the set, and it was
 * compiling its program, allocating its textures and drawing its first
 * frames in the same few hundred milliseconds the browser was parsing
 * a large document, executing the page's JavaScript and hydrating the
 * React tree. Everything in that window competes for one main thread,
 * and the shader was winning — which is why arriving felt slow while
 * scrolling, later, felt fine.
 *
 * So the mount now waits for the browser to tell us it is no longer
 * busy: `requestIdleCallback` after a frame has been painted, raced
 * against a plain timer so the field cannot fail to arrive on a page
 * that never produces a frame — see the effect for why that case is
 * real rather than theoretical. The visitor sees the static
 * `.detect-grid` composition for a beat and then the live field
 * switches on over it, which is a better reading of "the detective
 * overlay comes up" than having it already running before the page is
 * legible.
 *
 * Deliberately NOT here: a pause-when-hidden listener. Each vendored
 * component already drives its own rAF and several accept a `pause`
 * prop, and reaching into them to coordinate that would mean patching
 * vendored files — which is the one thing that makes a vendored
 * dependency unmaintainable. The mount gate in rule two is the coarser
 * but honest version: offscreen means unmounted, which stops the loop
 * by removing it. */

/* Each entry is its own chunk. Keyed by name rather than taking a
   component as a prop, because `next/dynamic` needs a static import
   specifier to split on — a caller passing a component would defeat
   the whole arrangement. */
const BACKDROPS = {
  /* Arkham's CRT. The home cover only: curvature, scanlines, chromatic
     aberration and a glyph field, which is the loudest thing on the
     site and should stay the thing you see first and once. */
  terminal: dynamic(() => import("@/components/reactbits/FaultyTerminal/FaultyTerminal"), {
    ssr: false,
  }),
  /* A field of mutating glyphs. On /projects because a roster of
     deployment work is the one page where streaming characters read as
     the subject rather than as decoration. */
  letters: dynamic(() => import("@/components/reactbits/LetterGlitch/LetterGlitch"), {
    ssr: false,
  }),
  /* Searchlight. The §5b beam is a static cone of exactly this; on
     /contact it gets the moving version, since that page is the one
     asking someone to step into the light. */
  rays: dynamic(() => import("@/components/reactbits/LightRays/LightRays"), {
    ssr: false,
  }),
  /* Shafts of light across a dark plane — deco, and the right register
     for a wall of credentials. */
  beams: dynamic(() => import("@/components/reactbits/Beams/Beams"), {
    ssr: false,
  }),
  /* Dithered waves at a visible pixel size. The one overtly RETRO-GAME
     field in the set, so it belongs to /hobby and nowhere else. */
  dither: dynamic(() => import("@/components/reactbits/Dither/Dither"), {
    ssr: false,
  }),
} as const;

export type BackdropKind = keyof typeof BACKDROPS;

/* Which fields accept a light-palette flag. Four of the five do;
   `dither` does not, and is handed a transparent background and
   palette-appropriate colours by its caller instead. Getting this
   wrong is what made the fields paint a dark panel over the bone
   paper — see the header of lib/useTheme.ts. */
const SUPPORTS_LIGHT_MODE: Record<BackdropKind, boolean> = {
  terminal: true,
  letters: true,
  rays: true,
  beams: true,
  dither: false,
};

type FxBackdropProps = {
  kind: BackdropKind;
  /** Passed through to the vendored component, for both themes. */
  props?: Record<string, unknown>;
  /** Merged over `props` only on the light palette. */
  lightProps?: Record<string, unknown>;
  /** Merged over `props` only on the dark palette. */
  darkProps?: Record<string, unknown>;
  /** Layer opacity. These are TEXTURES, not backgrounds — see below. */
  opacity?: number;
  className?: string;
};

export default function FxBackdrop({
  kind,
  props = {},
  lightProps = {},
  darkProps = {},
  opacity = 0.3,
  className = "",
}: FxBackdropProps) {
  const host = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  /* Rule five. Separate from `visible` on purpose: this one latches
     true once and stays, because the page only arrives once, while
     `visible` keeps tracking the viewport for the life of the page. */
  const [settled, setSettled] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    /* Two routes to the same latch, whichever arrives first.
     *
     * THE FAST ROUTE is a frame, then idle: `requestAnimationFrame`
     * puts this behind the first paint rather than alongside it, and
     * `requestIdleCallback` then waits for the main thread to have
     * nothing better to do — which is exactly the condition a
     * decorative shader should wait for.
     *
     * THE BACKSTOP is a plain timer, and it is here because the fast
     * route can legitimately never run. `requestAnimationFrame` does
     * not fire when the page is not producing frames — a background
     * tab is the real-world case, and a headless browser under a
     * virtual time budget is how this was found. Hinging the mount on
     * rAF alone meant that in those conditions the cover kept its
     * static field forever and the live one never arrived. A decorative
     * layer failing to a composition that is complete without it is
     * the right failure, but it should not be reachable by something
     * as ordinary as opening the site in a background tab.
     *
     * So the timer guarantees arrival and the idle path gets there
     * sooner on a normal load. Nothing is double-counted: `setSettled`
     * to the same value twice is one state change, and React bails out
     * of the second render. */
    let idle = 0;
    let usedIdle = false;

    const backstop = window.setTimeout(() => setSettled(true), 1500);

    const raf = requestAnimationFrame(() => {
      const ric = window.requestIdleCallback;
      if (typeof ric !== "function") {
        setSettled(true);
        return;
      }
      usedIdle = true;
      idle = ric(() => setSettled(true), { timeout: 1200 }) as unknown as number;
    });

    return () => {
      window.clearTimeout(backstop);
      cancelAnimationFrame(raf);
      if (usedIdle) window.cancelIdleCallback?.(idle);
    };
  }, []);

  useEffect(() => {
    /* Rule three. Checked in an effect rather than with a CSS query so
       the component can decline to mount at all; a media query could
       only have hidden it after the context already existed. */
    if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const el = host.current;
    if (!el) return;

    /* Rule two. No observer available (a test environment) means mount
       immediately — degrading towards the richer experience is safe
       here, because the static field underneath is what would show
       otherwise and it is not a failure state. */
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVisible(entry.isIntersecting);
      },
      /* A generous margin so the field is already running by the time
         it is actually looked at, rather than starting as it arrives. */
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Live = BACKDROPS[kind];

  /* FIVE — a field is a TEXTURE, not a background.

     This is the fix for the bug reported as "some issue with textures"
     and "empty boxes". Every vendored field renders a canvas sized
     `h-full w-full`, and although all five request `alpha: true`, each
     one paints a substantial amount of opaque colour — `dither`
     defaults its background to solid black outright. Dropped in at
     full strength that is not a texture behind the page, it is a
     rectangle on top of it: a dark panel with a straight edge, which
     on the light palette reads as a broken empty box.

     So the live layer is composited the way every other texture in
     §5b is: held well below full strength, and masked so its alpha
     reaches zero before the container edge. The mask is the important
     half — a gradient painted into a box that clips at
     `overflow: hidden` ends in a straight line, and a straight line is
     a shape. `.fx-layer` in globals.css §5e carries both. */
  const tuned = {
    ...props,
    ...(theme === "dark" ? darkProps : lightProps),
    ...(SUPPORTS_LIGHT_MODE[kind] ? { lightMode: theme === "light" } : {}),
  };

  return (
    <div
      ref={host}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Rule four: unconditional, and first so it sits behind. */}
      <div className="detect-grid absolute inset-0" />
      {visible && settled && (
        <div
          className="fx-layer"
          style={{ ["--fx-opacity" as string]: opacity }}
        >
          {/* Keyed on the theme so a palette change remounts the
              field rather than leaving a shader that compiled its
              colours as uniforms under the old one. Cheaper than it
              looks: a theme change is a deliberate, rare act, and the
              alternative is a field that silently disagrees with the
              page it sits behind. */}
          <Live key={theme} {...tuned} />
        </div>
      )}
    </div>
  );
}
