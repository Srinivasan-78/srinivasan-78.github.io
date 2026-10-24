/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌​​​​‌​​​‌​‌​‌‌‌​‌‌​​‌​​‌‌​​​​‌‌​‌​​​​‌‌​‌‌‌​‌‌​‌​​​​‌​‌​​‌​​‌‌‌​​‌​​‌‌‌​‌​‌​‌​​‌​‌‌​‌‌​‌‌‌‌​‌​​‌​‌‌​‌​‌​‌​‌​‌​‌​‌​‌​‌​​‌‌‌​​‌​​​‌​‌​‌‌​‌‌​​​‌‌‌​​‌‌​‌‌‌​‌‌‌​​‌‌‌​​‌​​‌‌​‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.hEvL47hRruKoKUUNElsw95
 */
"use client";

import { useEffect, useState } from "react";
import ClickSpark from "@/components/reactbits/ClickSpark/ClickSpark";
import TargetCursor from "@/components/reactbits/TargetCursor/TargetCursor";
import useTheme from "@/lib/useTheme";
import usePerfTier from "@/lib/usePerfTier";

/* The site-wide interaction layer: a spark on every click, and a
 * targeting reticle for a cursor.
 *
 * These two are the clearest Arkham/comic quotations available, and
 * they are also the two with the most ways to go wrong, so the gating
 * is the point of this file.
 *
 * THE CURSOR IS POINTER-ONLY AND DESKTOP-ONLY. `TargetCursor` hides the
 * real cursor and draws its own, which is a straightforward
 * accessibility and usability hazard in three situations: on a touch
 * device there is no cursor to replace and hiding it does nothing
 * useful; on a trackpad-less or assistive setup the system cursor may
 * be the thing the user depends on; and under reduced motion a spinning
 * reticle is exactly the kind of persistent animation that setting
 * exists to remove. So it mounts only when a fine pointer with hover
 * is present AND motion is allowed, and only above the `sm` breakpoint.
 *
 * It also never replaces a FOCUS affordance. The keyboard path is the
 * `:focus-visible` ring in §2 plus the HUD brackets in §5e, both of
 * which are untouched by this. The reticle is a pointer embellishment,
 * never the only signal that something is interactive.
 *
 * THE SPARK IS CHEAP AND ON ONE LISTENER. `ClickSpark` wraps the whole
 * document and draws into a single canvas, so it costs one listener and
 * one canvas rather than per-element state. It is removed entirely
 * under reduced motion.
 *
 * Both are mounted client-side after the first paint rather than
 * server-rendered: they are decoration over a page that is already
 * complete, and nothing here is allowed to be in the critical path of
 * reading the site. That is why this component renders its children
 * straight through on the server and the first client frame — the page
 * is never waiting on it. */

export default function InteractionFx({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const tier = usePerfTier();
  const [motionOk, setMotionOk] = useState(false);
  const [pointerFine, setPointerFine] = useState(false);

  useEffect(() => {
    if (typeof matchMedia === "undefined") return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    /* A fine pointer that can hover, and a viewport wide enough that a
       custom cursor is not fighting a touch-first layout. */
    const fine = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 640px)");

    const sync = () => {
      setMotionOk(!reduce.matches);
      setPointerFine(fine.matches);
    };
    sync();

    /* Live, not read-once. A visitor can change the OS setting, and a
       laptop with a touchscreen can switch primary pointer mid-session
       — both should take effect without a reload. */
    reduce.addEventListener("change", sync);
    fine.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
    };
  }, []);

  /* The reticle locks onto anything interactive. Driven off real
     selectors rather than a bespoke class, so a control added later is
     targeted automatically instead of being silently left out. */
  /* THE TOP TIER ONLY, and this is the single biggest frame saving on
     the site rather than a marginal one.

     `spinDuration` is what makes it expensive, and not obviously: the
     reticle rotates continuously, so the component's `busy` condition
     is never false and its requestAnimationFrame loop never stops. It
     is not a cursor that costs something while you move the mouse — it
     is a permanent sixty-times-a-second loop writing transforms to
     four corner elements, running on every page of the site, forever,
     whether or not anything is happening. Every other animation here
     sleeps; this one cannot, because spinning IS the animation.

     On a machine with frames to spare that is affordable and it is the
     signature interaction of the whole register. On one without, it is
     a tax levied on scrolling, on reading, and on every other effect
     that now has to share what is left. So `lite` and `off` get the
     real cursor, which is not a degraded version of anything — the
     spark below still fires on click, and the lock-on brackets were
     always pointer-only decoration over an already-complete page. */
  const cursor =
    motionOk && pointerFine && tier === "full" ? (
      <TargetCursor
        targetSelector="a, button, [role='button'], summary, input, select, textarea"
        /* The two inks of §1b, and the reticle uses both: it rests in
           the transient one — white on the slab, black on paper — and
           turns yellow the moment it locks onto something. Black and
           yellow on a black ground; black and gold on a white one. */
        cursorColor={theme === "dark" ? "#ffffff" : "#000000"}
        cursorColorOnTarget={theme === "dark" ? "#f5c518" : "#866900"}
        spinDuration={6}
        hoverDuration={0.25}
        size={26}
        cornerSize={8}
        thickness={1}
        padding={8}
        dotSize={2}
        matchRadius
        /* The default cursor stays. Hiding it is the one setting here
           with a real downside and no upside: the reticle reads as an
           overlay ON the pointer, which is what detective mode actually
           looks like, and a visitor never loses the thing they aim
           with if a frame drops. */
        hideDefaultCursor={false}
        clickEffect
        /* THE FIX for "wherever the lock-on effect is in play the theme
           of the original site is lost".

           This component defaults to `blendMode: 'difference'`, and
           `mix-blend-mode: difference` INVERTS whatever it is drawn
           over. So the reticle was not tinting the page under it, it
           was photographically negating it — amber went blue, the bone
           ground went near-black, and the site's palette visibly
           inverted wherever the cursor hovered. On a design whose
           entire premise is two independently-authored palettes with
           measured contrast, an effect that inverts them is the single
           most damaging default in the vendored set.

           `normal` composites it like any other element. The reticle is
           already cyan against both grounds by §1b, so it needs no
           blend trick to be visible. */
        blendMode="normal"
      />
    ) : null;

  return (
    <>
      {cursor}
      {/* The signal and the probe, and the one place on the site that
          spends the static accent on pure decoration — justified because it exists
          only in the instant after a click and leaves nothing behind,
          so it never sits in the composition the §1b budget governs.

          ALWAYS MOUNTED, enabled via a prop. An earlier version
          returned bare `children` until it had checked the motion
          preference and then swapped in this wrapper, which changed the
          shape of the tree after mount — React therefore unmounted and
          remounted Nav, the entire page and the Footer on every single
          load. That threw away component state (the project filters
          among it) and re-fired every scroll reveal. Toggling a prop on
          a component that is always there has none of those effects. */}
      <ClickSpark
        /* `h-full` is in the component's own class list and this is the
           element wrapping the whole document, so it is overridden:
           a percentage height here resolves against nothing useful and
           is one of the few ways this wrapper could affect layout. */
        className="!h-auto"
        disabled={!motionOk}
        sparkColor={
          theme === "dark" ? ["#f5c518", "#ffffff"] : ["#866900", "#000000"]
        }
        sparkSize={9}
        sparkRadius={18}
        sparkCount={8}
        sparkWidth={1.5}
        duration={420}
        extraScale={1.1}
        randomness={0.4}
        spread={360}
        glow={0.5}
        /* `ring` is OFF because it crashes.

           Upstream `drawRing` computes
             radius = 2 + s.radius * 0.6 * EASINGS['ease-out'](p)
           and its easing returns a negative value for part of the
           range, so the radius goes negative and `ctx.arc` throws
           `IndexSizeError: The radius provided (-25.4797) is negative`,
           which surfaced as a runtime error overlay. It is a genuine
           bug in the vendored file rather than a misuse of the API.

           Disabled rather than patched. Editing a vendored file is the
           one thing that makes it unmaintainable — the patch is
           invisible and the next registry fetch silently reverts it —
           and the ring was the least interesting part of the effect.
           The sparks themselves are unaffected. */
        ring={false}
        layer="front"
      >
        {children}
      </ClickSpark>
    </>
  );
}
