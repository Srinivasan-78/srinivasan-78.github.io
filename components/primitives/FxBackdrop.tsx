/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌​​​​‌‌​‌‌​‌​‌​‌‌​‌​​‌​‌​‌‌​​‌​‌‌​‌​​​‌‌‌​​‌​‌​‌‌​​‌​‌‌‌​‌​‌​‌​‌​​​‌​‌‌‌​​​​​‌‌​​​‌‌​‌‌​‌‌‌‌​‌‌‌‌​​‌​​‌‌​​​​​‌‌‌‌​​‌​‌​‌​​​​​‌‌‌‌​‌​​​‌‌​‌‌‌​‌​​​‌‌‌​‌‌​‌‌‌​​‌‌​‌‌‌​​​‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.hmZVZ9YuQpcoy0yPz7Gnn1
 */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import useTheme from "@/lib/useTheme";
import usePerfTier from "@/lib/usePerfTier";

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
 * SIX — the field is sized to the machine, not to the monitor. Added
 * in revision 13, for "how does this run on a potato PC".
 *
 * Rules one through five are all about WHEN a field runs. None of them
 * touched HOW MUCH it costs per frame while it does, and that is the
 * number that decides whether a visitor gets sixty frames or twenty.
 * Every field here is a full-bleed fragment shader, so its cost is
 * literally the pixel count of the largest element on the page times
 * the instruction count of the shader, every frame. Both halves are
 * configurable, and `lite` in LITE_PROPS turns both down:
 *
 *   RESOLUTION. `dpr: 0.6` renders at 36% of the fragments of `dpr: 1`
 *   and the browser scales the result up. On a field held at 0.34
 *   opacity behind a feathered mask and under a headline, the
 *   difference is not visible — which is the test that matters, not
 *   whether it is measurable.
 *
 *   PER-POINTER WORK. `mouseReact` is the expensive one, and not
 *   because of the uniform write. Each vendored field sleeps when
 *   nothing is changing — FaultyTerminal stops its loop after 2.5
 *   quiet seconds — and a pointer-reactive field wakes on every single
 *   pointermove, so a cursor resting anywhere over the cover pins the
 *   shader at the refresh rate indefinitely. Turning it off is what
 *   lets the field go quiet and stay quiet.
 *
 * On `off` nothing mounts at all, which is the reduced-motion path in
 * rule three reached by a second route.
 *
 * SEVEN caps the canvas to a pixel budget so the cost is set by the
 * machine rather than by the monitor, and EIGHT stops the autonomous
 * animation after twenty seconds — both at every tier, including
 * `full`. Each has its own note above its table below.
 *
 * Deliberately NOT here: a pause-when-hidden listener. Each vendored
 * component already drives its own rAF and several accept a `pause`
 * prop, and reaching into them to coordinate that would mean patching
 * vendored files — which is the one thing that makes a vendored
 * dependency unmaintainable. The mount gate in rule two is the coarser
 * but honest version: offscreen means unmounted, which stops the loop
 * by removing it.
 *
 * ONE VENDORED FILE IS PATCHED, and it is recorded here rather than
 * left to be rediscovered. `FaultyTerminal` treated `mouseReact` as a
 * shader uniform only: the flag reached `uUseMouse` and nothing else,
 * so a field told to ignore the pointer still ran
 * `getBoundingClientRect` on every pointermove over the document, still
 * woke its loop, and still counted the resulting chase as `busy`. That
 * made rules six and eight above both partly fictional — `lite` did not
 * stop the field waking on the mouse, and `pause` could not reach an
 * idle state while a cursor sat over the cover. The patch reads the
 * flag in the two listeners and in the frame's `engaged` term, so it
 * governs the whole pointer path instead of one uniform. It is a
 * behaviour fix to a prop the component already documents, not a new
 * feature, which is the only shape of change worth making to a
 * vendored file. */

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

/* SEVEN — the canvas is sized to a pixel budget, not to the monitor.
 *
 * This is the memory rule, and it is separate from the tier rules
 * because it applies at every tier including `full`. A WebGL field's
 * resident cost is not its shader, it is its buffers, and they are all
 * proportional to the backing store:
 *
 *   canvas colour buffer   w × h × 4 bytes
 *   driver's second buffer same again, for double buffering
 *   FaultyTerminal's FBOs  two targets × two attachments
 *
 * At `dpr: 1` on a 2560-wide monitor that backing store is 2560 × 1200,
 * so the canvas alone is 12 MB and the whole context lands somewhere
 * north of 40 MB — for a texture rendered at 0.34 opacity behind a
 * feathered mask, under a headline.
 *
 * The budget caps the LONG EDGE in device pixels and lets CSS scale
 * the result up to fill the element. 1100 is the number because these
 * fields have no fine detail to lose: the glyph grid, the dither
 * matrix and the ray cone are all low-frequency at the opacities §5b
 * holds them to, and the mask destroys the edges where upscaling would
 * show. On a 1440p monitor that is a dpr near 0.43 and roughly a fifth
 * of the memory; on a laptop at 1366 it is 0.8 and barely a change; on
 * a phone it is capped at 1 and the `lite` tier takes it from there.
 *
 * It also makes cost independent of the display, which is the property
 * that actually matters: a 4K monitor is not evidence of a fast GPU,
 * and before this the biggest screens were charged the most for the
 * same decoration. */
const PIXEL_BUDGET = 1100;

/* EIGHT — nothing loops forever, including these. Revision 13.
 *
 * §5c of globals.css opens by stating this as the first of three
 * motion rules the stylesheet does not break: "nothing loops forever —
 * a thing still moving after you have read it is demanding attention".
 * Every CSS animation on the site honours it. The vendored fields never
 * did, and the audit that found it was looking for something else.
 *
 * Only ONE of the five has an idle path of its own: FaultyTerminal
 * stops its loop after 2.5 seconds with nothing changing. LetterGlitch,
 * LightRays, Beams and Dither all gate correctly on document
 * visibility and on their own IntersectionObserver — so none of them
 * burns frames in a background tab or while scrolled away — but while
 * on screen they animate at the refresh rate indefinitely. On /projects,
 * /contact, /certifications and /hobby that is a shader running for as
 * long as the page head is in view, which on a short page is the whole
 * visit.
 *
 * So the gate is applied from out here instead. Each field has a prop
 * that genuinely halts its `requestAnimationFrame` loop rather than
 * just hiding the result — verified against each one's `busy`
 * condition, which is why these are five different prop names and not
 * a guess at a common one:
 *
 *   terminal  `pause`            -> busy = !(pause || reduce) || ...
 *   letters   `speed: 0`         -> busy = (!reduce && speed > 0) || ...
 *   rays      `raysSpeed: 0`     -> busy = speed > 0 || ...
 *   beams     `paused`           -> moving = !paused && !reduce
 *   dither    `disableAnimation` -> busy = !disableAnimation || ...
 *
 * IT HALTS THE CLOCK, NOT THE FIELD, and that distinction is why this
 * is safe to do while someone is looking at it. Every one of those
 * `busy` conditions has further terms after the `|| ...` — pointer
 * presence, a click still decaying, an intro still playing — so a
 * halted field still redraws in response to the pointer and still
 * finishes whatever it was mid-way through. What stops is time
 * advancing on its own. A visitor who moves the mouse over a held
 * field gets the same response they always did; a visitor who has
 * stopped interacting gets a still image instead of a shader.
 *
 * TWENTY SECONDS, which is §5c's own scale rather than a new one: the
 * cover's wash ran two twelve-second cycles before revision 13 removed
 * it, the status tick pulses three times, the sweep crosses once.
 * Twenty is long enough that the field reads as ambient rather than as
 * an intro that cuts off, and short enough that it is not still running
 * when someone is three paragraphs into the page.
 *
 * Scrolling away and back restarts it, because rule two unmounts the
 * field entirely when it leaves the viewport — so this is a budget per
 * visit to a page head, not per session. */
const MOTION_MS = 20000;

const HALT_PROPS: Record<BackdropKind, Record<string, unknown>> = {
  /* The CRT halts its pointer inputs as well as its clock, and it is
     the only field here that needs to.
   *
     The note above says a halted field still responds to the pointer,
     and for the other four that is both true and cheap. For this one
     it was the hole in the rule. `terminal` is the only field in the
     set with an idle path of its own — it stops after 2.5 quiet
     seconds — and `mouseReact` is what prevents it ever reaching one:
     a cursor resting anywhere over the cover counts as activity, so
     the loop stays open at the refresh rate indefinitely. Setting
     `pause` alone therefore bought nothing on the one page it was
     most needed: the field kept drawing the heaviest shader on the
     site at full rate, now without even the motion to show for it.
   *
     So for the first twenty seconds the cover is fully reactive —
     which is the whole of the design intent, since arriving is a
     thing that happens once — and after that it is a still image.
     Scrolling away and back restores it, the same as every other
     field here, because rule two unmounts on exit. */
  terminal: { pause: true, mouseReact: false, clickEffect: false },
  letters: { speed: 0 },
  rays: { raysSpeed: 0 },
  beams: { paused: true },
  dither: { disableAnimation: true },
};

/* Which prop each field takes its ratio in. Four call it `dpr`;
   LightRays calls it `maxDevicePixelRatio`. Getting this wrong fails
   silently — an unknown prop is ignored and the field quietly renders
   at full resolution — which is why it is a table rather than a
   spread. */
const DPR_PROP: Record<BackdropKind, string> = {
  terminal: "dpr",
  letters: "dpr",
  rays: "maxDevicePixelRatio",
  beams: "dpr",
  dither: "dpr",
};

/* Rule six, per field. Merged over the caller's props on the `lite`
   tier and ignored on `full`.
 *
 * Written here rather than at each call site on purpose: the downgrade
 * is a property of the SHADER, not of the page it sits behind, and
 * five call sites each guessing at it is five chances to leave one
 * expensive. A caller that needs to differ passes `liteProps`.
 *
 * Note which props are NOT turned down. Colour, tint and `lightMode`
 * stay exactly as the caller set them, because a field that changes
 * palette on a slow machine is a visibly different design rather than
 * a cheaper one. `lite` is the same composition drawn with fewer
 * fragments, and anything that breaks that promise does not belong in
 * this table. */
const LITE_PROPS: Record<BackdropKind, Record<string, unknown>> = {
  /* The cover's CRT, and the heaviest thing on the site — four of the
     six knobs below are per-fragment costs rather than features.
     `chromaticAberration` alone triples the samples in the main pass,
     for a fringe that is invisible under a 0.34-opacity mask. */
  terminal: {
    dpr: 0.6,
    mouseReact: false,
    chromaticAberration: 0,
    glow: 0,
    flickerAmount: 0.2,
    scanlineIntensity: 0.2,
    timeScale: 0.25,
    clickEffect: false,
    pageLoadAnimation: false,
  },
  /* A glyph field redraws every cell it decides to mutate, so the rate
     is the cost here rather than the resolution. */
  letters: { dpr: 0.65, smooth: false, interactive: false },
  /* `followMouse` is this field's `mouseReact`; the rest of the cone is
     already cheap. */
  rays: {
    maxDevicePixelRatio: 0.7,
    followMouse: false,
    cursorShadow: false,
    clickPulse: false,
    noiseAmount: 0,
  },
  /* `quality` is Beams' own ray-step count — the one knob in the set
     that reduces shader instructions rather than fragments, so it is
     the cheapest win available here. */
  beams: { dpr: 0.65, quality: 0.5, mouseInteraction: false, glow: 0 },
  /* Dither's ordered-matrix pass is applied at the pixel size it is
     given, so dropping the ratio makes the dots larger rather than the
     image softer — which is why it goes less far than the others. */
  dither: {
    dpr: 0.75,
    enableMouseInteraction: false,
    clickRipple: false,
    trail: 0,
  },
};

type FxBackdropProps = {
  kind: BackdropKind;
  /** Passed through to the vendored component, for both themes. */
  props?: Record<string, unknown>;
  /** Merged over `props` only on the light palette. */
  lightProps?: Record<string, unknown>;
  /** Merged over `props` only on the dark palette. */
  darkProps?: Record<string, unknown>;
  /** Merged last, on the `lite` tier only — overrides LITE_PROPS. */
  liteProps?: Record<string, unknown>;
  /** Layer opacity. These are TEXTURES, not backgrounds — see below. */
  opacity?: number;
  className?: string;
};

export default function FxBackdrop({
  kind,
  props = {},
  lightProps = {},
  darkProps = {},
  liteProps = {},
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
  /* Rule six. Live rather than read-once, so PerfGuard measuring a bad
     framerate unmounts the field — or re-mounts it at a lower
     resolution — without a reload. */
  const tier = usePerfTier();
  /* Rule seven. Tracked rather than read once, because a window resize
     or a drag to a second monitor changes the answer — and passing it
     as a prop rather than remounting is deliberate: every field re-reads
     its ratio from a live settings ref inside its own ResizeObserver
     callback, so a new value takes effect on the resize that caused it
     without the shader being torn down and recompiled. */
  const [budgetDpr, setBudgetDpr] = useState(1);
  /* Rule eight. False while the field is allowed to animate. */
  const [held, setHeld] = useState(false);

  useEffect(() => {
    /* The clock only runs while the field is actually mounted and on
       screen, so a visitor who arrives, scrolls straight past the head
       and comes back later gets the motion they would have got on
       arrival rather than a field that spent its budget unwatched. */
    if (!visible || !settled) return;

    const t = window.setTimeout(() => setHeld(true), MOTION_MS);
    return () => {
      window.clearTimeout(t);
      /* Reset on the way out, so the next time this becomes visible the
         budget starts over. Cheap: leaving the viewport unmounts the
         field anyway under rule two, so there is nothing running to be
         restarted by this. */
      setHeld(false);
    };
  }, [visible, settled]);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      /* The long edge, not the width: a tall narrow viewport still has
         a backing store as large as the side it is long on. */
      const edge = Math.max(window.innerWidth, window.innerHeight);
      const device = window.devicePixelRatio || 1;
      /* Never UP. On a small window `PIXEL_BUDGET / edge` exceeds 1 and
         would ask for a backing store larger than the device can show,
         which is the opposite of the point. */
      setBudgetDpr(Math.min(device, PIXEL_BUDGET / Math.max(edge, 1)));
    };

    /* Coalesced to one measurement per frame. A window drag fires
       `resize` far faster than the screen refreshes, and each extra
       call here would re-render every backdrop on the page. */
    const onResize = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

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
  const dprKey = DPR_PROP[kind];
  const tierProps = tier === "lite" ? { ...LITE_PROPS[kind], ...liteProps } : {};

  const tuned = {
    ...props,
    ...(theme === "dark" ? darkProps : lightProps),
    /* Rule six, applied after the palette merges so a downgrade cannot
       be silently undone by a palette override. */
    ...tierProps,
    /* Rule seven, applied after rule six and last of all, and the two
       MULTIPLY rather than one overriding the other — which is the
       whole reason this is computed here instead of being a number in
       LITE_PROPS.
     *
     * They answer different questions. The budget asks how many pixels
     * this DISPLAY should be charged for, and is the same on a fast
     * machine as a slow one. `lite` asks what fraction of that a weak
     * GPU should actually draw. Taking the lower of the two instead
     * would mean a slow machine on a large monitor getting no reduction
     * at all from `lite`, because the budget had already cut deeper —
     * exactly backwards, since that is the machine that needs both.
     *
     * Floored at 0.25 so the product cannot collapse on a very large
     * display: below that the upscale starts to show as softness in the
     * mask's falloff rather than as nothing. */
    [dprKey]: Math.max(
      0.25,
      budgetDpr *
        (typeof tierProps[dprKey] === "number"
          ? (tierProps[dprKey] as number)
          : 1)
    ),
    /* Rule eight, after the resolution rules because it is unrelated to
       them and must not be overridden by either. */
    ...(held ? HALT_PROPS[kind] : {}),
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
      {visible && settled && tier !== "off" && (
        <div
          className="fx-layer"
          style={{ ["--fx-opacity" as string]: opacity }}
        >
          {/* Keyed on the theme AND the tier, so either change remounts
              the field rather than leaving a shader that compiled the
              old values as uniforms. Cheaper than it looks: a theme
              change is a deliberate, rare act and a demotion happens
              at most twice in a session, while the alternative is a
              field that silently disagrees with the page it sits
              behind — or, for the tier, one that keeps drawing at full
              resolution after the page has decided it cannot afford
              to. Several of the props in LITE_PROPS are read live from
              a settings ref and would have taken effect anyway; the
              resolution ones are not, which is what makes the remount
              the honest mechanism rather than an optimisation. */}
          <Live key={`${theme}:${tier}`} {...tuned} />
        </div>
      )}
    </div>
  );
}
