"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { CERTS, ROWS, forRow, type Row } from "@/lib/certs";
import CertViewer from "./CertViewer";

/* Navigation modelled on freshman.tv's menu: full-bleed rows of large
   serif type, each row starting at a different indent so the block
   reads as ragged setting rather than a list, hairline dashed rules
   between them, and a hover that inverts the whole band to black while
   the label drops to a muted grey.

   Two details do most of the work:

   1. The band wipes vertically from its centre rather than fading. A
      fade reads as a hover state; a wipe reads as a mechanism.
   2. A red scribble draws itself over the label on the way in and
      un-draws on the way out. It's a stroke-dashoffset animation on a
      single path, so it always draws in the same direction and never
      looks like it's being erased backwards. */

/* A pool of hand-marked annotation strokes — loops, underlines,
   strikes, brackets, zigzags — so the mark-up never repeats the same
   shape twice on the same title. One is picked at random on every
   hover-in rather than being fixed per row.

   Every path carries pathLength="1" and is dashed 1 / offset 1. That
   normalisation is not cosmetic: the draw-on animation is a
   stroke-dashoffset tween, and a hardcoded dash length only hides the
   stroke if it happens to exceed the path's real arc length. Get that
   wrong and the tail of the path wraps back into the next dash and
   stays painted permanently. Normalising to 1 makes it independent of
   geometry, so new scribbles can be added without measuring anything. */
const SCRIBBLES: string[] = [
  // Loose double loop — encircles the word twice.
  "M40 62C40 20 150 8 300 12C460 16 570 30 566 62C562 96 430 112 290 108C150 104 44 92 46 60C48 30 200 16 340 22C470 28 556 44 540 74",
  // Single lopsided oval with an overshoot.
  "M300 10C150 10 44 34 44 62C44 90 150 110 300 110C450 110 556 90 556 62C556 34 450 10 300 10C214 10 128 20 74 38",
  // Two-pass strike through the middle.
  "M34 66C160 58 300 62 566 56M46 82C180 90 320 74 552 78",
  // Scratchy double underline.
  "M30 92C140 78 260 84 380 80C460 77 520 84 572 74M50 106C170 94 300 100 420 94C490 90 540 94 576 88",
  // Zigzag struck across.
  "M36 96L120 40L204 96L288 40L372 96L456 40L540 96",
  // Bracketed on both sides, like flagging a passage.
  "M120 16C60 20 44 40 44 62C44 86 62 104 120 108M480 16C540 20 556 40 556 62C556 86 538 104 480 108",
  // Single wavy underline.
  "M32 88C110 70 190 100 270 82C350 64 430 96 510 78C540 71 556 74 570 80",
  // Tight scribble knot, like crossing something out messily.
  "M60 60C120 30 180 90 240 40C300 20 340 100 400 50C440 24 480 80 540 60C560 53 570 66 552 70",
  // Circle-and-tick, a quick approval mark.
  "M300 14C180 8 60 34 56 62C52 92 190 112 320 106C450 100 552 78 548 52C544 30 430 12 340 16M420 40L480 88L560 20",
  // Corner brackets top-left and bottom-right, like framing a clip.
  "M50 24H26V50M550 96H574V70",
  // Long single underline with a hook at the end.
  "M40 92C180 78 340 84 560 76C572 75 578 82 566 92C558 98 548 96 552 88",
  // Vertical hatch marks across the word, like tally strokes.
  "M110 24V100M200 20V104M290 24V100M380 20V104M470 24V100",
  // Arrow underline pointing right, like directing attention onward.
  "M36 90C180 76 340 82 500 80M470 60L520 82L468 104",
  // Spiral coil sitting under the word.
  "M300 96C260 96 236 78 244 58C252 38 288 34 300 50C312 64 296 78 280 70C268 64 270 50 284 48",
  // Cross-out X spanning the whole word.
  "M40 20L560 100M560 20L40 100",
  // Star-scratch, a quick asterisk-like flourish.
  "M300 20V100M220 34L380 88M380 34L220 88",
  // Boxed rectangle around the word, hand-drawn wobble.
  "M36 26C220 16 400 14 566 30C572 62 570 90 564 100C380 112 200 110 40 96C32 70 30 44 36 26",
  // Short double tick, like a proofreader's checkmark repeated.
  "M60 60L100 90L170 30M420 60L460 90L530 30",
  // Loose scrawl underline with three uneven passes.
  "M34 80C160 70 300 76 550 68M40 92C180 84 320 88 560 82M46 104C190 98 330 100 566 96",
  // Circling swoop that opens at the top, like a lasso.
  "M300 16C160 16 50 40 48 66C46 94 180 110 320 106C460 102 560 82 554 56C550 40 480 26 400 20",
];

export default function CertMenu() {
  const [open, setOpen] = useState<Row | null>(null);
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const curtainRef = useRef<HTMLDivElement>(null);

  /* Memoised so the prop keeps its identity across CertViewer's own
     re-renders — a fresh array each time would retear the WebGL scene
     on every focus change. */
  const openCerts = useMemo(() => (open ? forRow(open) : []), [open]);

  /* The curtain grows out of the clicked row's own rectangle, so the
     black band the user was already looking at is what becomes the
     viewer. Opening from the centre of the screen instead would break
     the causal link between the click and the result. */
  const openRow = (row: Row) => {
    const el = rowRefs.current[row.id];
    const curtain = curtainRef.current;
    if (!el || !curtain) {
      setOpen(row);
      return;
    }
    const r = el.getBoundingClientRect();
    gsap.set(curtain, {
      display: "block",
      top: r.top,
      height: r.height,
      opacity: 1,
    });
    gsap.to(curtain, {
      top: 0,
      height: window.innerHeight,
      duration: 0.55,
      ease: "power3.inOut",
      onComplete: () => setOpen(row),
    });
  };

  const closeRow = () => {
    setOpen(null);
    const curtain = curtainRef.current;
    if (!curtain) return;
    gsap.to(curtain, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => gsap.set(curtain, { display: "none" }),
    });
  };

  // Body scroll is the viewer's, not the page's, while it is up.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <main className="fm-main">
        <header className="fm-head">
          <span className="eyebrow c-plum">Certifications</span>
          <p>
            {CERTS.length} verified credentials. Pick a shelf — each one opens as a
            corridor you travel through.
          </p>
        </header>

        <nav className="fm-rows" aria-label="Certificate categories">
          {ROWS.map((row) => {
            const n = forRow(row).length;
            return (
              <button
                key={row.id}
                type="button"
                ref={(el) => {
                  rowRefs.current[row.id] = el;
                }}
                className="fm-row"
                onClick={() => openRow(row)}
                onMouseEnter={(e) => hover(e.currentTarget, true)}
                onMouseLeave={(e) => hover(e.currentTarget, false)}
                onFocus={(e) => hover(e.currentTarget, true)}
                onBlur={(e) => hover(e.currentTarget, false)}
              >
                <span className="fm-fill" aria-hidden="true" />
                <span className="fm-label" style={{ marginLeft: `${row.indent}%` }}>
                  <span className="fm-text">{row.label}</span>
                  <sup className="fm-count">({n})</sup>
                  <svg
                    className="fm-scribble"
                    viewBox="0 0 600 120"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path pathLength="1" />
                  </svg>
                </span>
              </button>
            );
          })}
        </nav>

        <footer className="fm-foot">
          <span className="micro">(drag or scroll inside a shelf to travel)</span>
          <span className="micro">(issued by LinkedIn Learning)</span>
        </footer>
      </main>

      <div ref={curtainRef} className="fm-curtain" aria-hidden="true" />

      {open && <CertViewer row={open} certs={openCerts} onClose={closeRow} />}
    </>
  );
}

/* The band wipe and the scribble draw are GSAP because both need
   eases and a shared kill; the colour flip is left to CSS because the
   resting colour is `var(--ink)`, and GSAP would have to parse that
   custom property as a colour to tween back to it. Toggling a class
   sidesteps that entirely. */
function hover(el: HTMLElement, on: boolean) {
  el.classList.toggle("is-hot", on);
  const fill = el.querySelector(".fm-fill");
  const path = el.querySelector<SVGPathElement>(".fm-scribble path");

  gsap.killTweensOf([fill, path]);

  /* A fresh random scribble every time the mark draws in, so the same
     title doesn't wear the same annotation twice in a row.

     Order matters: kill first, then swap `d`, then force the dash fully
     retracted. Re-entering while the previous mark was still undrawing
     left the offset part-way, so the new path appeared already
     half-painted instead of drawing from nothing. */
  if (on && path) {
    path.setAttribute("d", SCRIBBLES[Math.floor(Math.random() * SCRIBBLES.length)]);
    gsap.set(path, { strokeDashoffset: 1 });
  }

  gsap.to(fill, {
    scaleY: on ? 1 : 0,
    duration: on ? 0.42 : 0.3,
    ease: on ? "power3.out" : "power2.in",
  });
  gsap.to(path, {
    strokeDashoffset: on ? 0 : 1,
    duration: on ? 0.55 : 0.35,
    ease: on ? "power2.out" : "power2.in",
  });
}
