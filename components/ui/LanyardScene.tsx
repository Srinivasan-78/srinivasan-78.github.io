/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​‌​‌​‌​​​​‌​​​‌‌​‌​‌​‌‌‌​​‌‌​‌‌​‌​​‌​‌‌‌​​​‌​​‌‌​​​‌​‌‌​​‌​​​‌‌​​‌‌​​‌‌​‌​‌​​‌‌​​‌‌​​‌​​‌‌​​​‌‌‌​‌‌‌​‌‌‌​‌‌‌​‌‌​‌​​‌​‌​‌‌​‌​​‌​‌​​‌‌​‌‌‌‌​​​​‌​‌​‌​‌​‌​​​‌​‌​‌​‌​​‌​​‌​​‌​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.5B5siq1dfjfLwwiZSxUERJ
 */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useInView } from "@/lib/useInView";

/* The gate in front of the 3D badge.

   <Lanyard /> pulls in three.js, a WebGL renderer, drei and a Rapier
   physics build compiled to WebAssembly, plus a 2.4 MB model. None of
   that should be spent on someone who is never going to see it, so the
   real component loads only when all of these hold:

     * the badge has actually scrolled into view,
     * the OS is not asking for reduced motion,
     * the connection is not one the visitor is trying to conserve —
       Data Saver on, or a 2G/slow-2G effective type.

   It is also gated to pointer devices, which is a reversal: width used
   to be excluded on the grounds that a phone renders it perfectly well
   and the drag reads better under a thumb. Rendering was never the
   problem. The gesture is. The canvas has to allow the page to scroll
   through it, so `touch-action: pan-y` hands vertical drags to the
   browser — and a vertical drag on the badge is the obvious thing to
   try. The browser takes the gesture, the pointer is cancelled, and the
   pull dies halfway. A cursor has no such conflict, because a mouse
   drag is never also a scroll.

   `(hover: hover) and (pointer: fine)` rather than width alone, because
   width does not mean what it needs to here: an iPad Pro is 1024 or
   1366 across and is still a thumb. The width term stays as a floor —
   the badge is a 2.4 MB model in a column that is only worth spending
   on a screen wide enough to show it beside the form.

   Anyone the gate turns away gets the static badge below: the same
   artwork, hanging from the same cord, drawn in CSS. It is a fallback,
   not a placeholder — nothing is missing from the page. */

const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => <StaticBadge />,
});

/* The badge is a printed object: its faces are artwork, not CSS.

   Two sets were drawn, one per page colour, and the scene picked
   between them by contrast rather than by match — a near-black badge on
   a black page and a near-white one on a white page are the same
   failure, an object that disappears into its background. The page is
   white and only white now, so the dark set is simply the right one and
   there is no longer a choice to make. That is also what a real
   laminated badge does: hang there being the one thing in the room that
   is not the colour of the room. */
const ART = {
  front: "/assets/lanyard/card-front.svg",
  back: "/assets/lanyard/card-back.svg",
} as const;

/* The cord is a meshline tint rather than a texture, and it reads as
   part of the badge, so it takes the same tone. */
const CORD = "#2e2e34";

function StaticBadge() {
  return (
    <div className="badge-static" aria-hidden="true">
      <span className="badge-cord" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ART.front} alt="" width={260} height={390} />
    </div>
  );
}

type SaveDataConnection = { saveData?: boolean; effectiveType?: string };

function connectionIsFrugal() {
  const conn = (navigator as Navigator & { connection?: SaveDataConnection }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}

export default function LanyardScene() {
  const { ref, inView } = useInView<HTMLDivElement>("0px 0px -5% 0px");
  const [capable, setCapable] = useState(false);

  /* Both queries are read in an effect, never in render or a useState
     initialiser: <html> is prerendered at build time with the static
     badge in place, so touching window during render would be a
     hydration mismatch. Listening to `change` on the media queries
     rather than to `resize` also keeps this off the scroll path — on a
     phone the URL bar collapsing fires resize, and this would be
     re-evaluated for it. */
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(min-width: 721px) and (hover: hover) and (pointer: fine)");
    const decide = () =>
      setCapable(pointer.matches && !motion.matches && !connectionIsFrugal());
    decide();
    motion.addEventListener("change", decide);
    pointer.addEventListener("change", decide);
    return () => {
      motion.removeEventListener("change", decide);
      pointer.removeEventListener("change", decide);
    };
  }, []);

  const live = capable && inView;

  return (
    <div ref={ref} className="lanyard-slot">
      {live ? (
        <Lanyard
          position={[0, -1.4, 12.5]}
          gravity={[0, -40, 0]}
          fov={20}
          frontImage={ART.front}
          backImage={ART.back}
          imageFit="cover"
          lanyardWidth={0.5}
          lanyardColor={CORD}
          ariaLabel="A 3D conference badge hanging from a lanyard. Drag it to swing it."
        />
      ) : (
        <StaticBadge />
      )}
      {/* Only claim it can be pulled when the physics build is the thing
          on screen. The fallback is a picture and says nothing. There is
          one string now rather than a pointer/touch pair, because the
          gate above means the only visitor who ever sees this has a
          cursor. */}
      {live && <p className="micro lanyard-caption">(drag the badge)</p>}
    </div>
  );
}
