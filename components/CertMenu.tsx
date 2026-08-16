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

/* Instead of a marker scribble, hovering a shelf presses a rubber
   validation stamp onto it.

   The reason to prefer it here: CertViewer already draws a circular
   "✓ VERIFIED" seal onto every certificate texture. Reusing that exact
   mark on the menu means the row you hover carries the same stamp as
   the cards it opens into — the menu and the deck stop looking like two
   unrelated screens. A scribble was generic annotation; a seal is the
   thing certificates actually have.

   Nothing about the press is fixed. Angle, scale overshoot and offset
   are re-rolled on every hover, and the ring is drawn with an uneven
   dash pattern so the ink reads as patchy rather than printed. Two
   presses on the same row never land identically. */

/* Irregular gaps around the ring — a real stamp never transfers a
   continuous line of ink. Picked at random per press. */
const INK_PATTERNS = [
  "42 7 96 5 61 9 74 4",
  "88 6 54 11 70 5 39 8",
  "31 9 118 4 66 12 48 6",
  "72 5 45 10 91 6 58 9",
  "105 8 37 6 82 11 44 5",
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

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
                    className="fm-stamp"
                    viewBox="0 0 120 120"
                    aria-hidden="true"
                  >
                    <defs>
                      {/* Unique per row — duplicate ids would make every
                          row's curved text follow the first row's arc. */}
                      <path
                        id={`arc-${row.id}`}
                        d="M60 60 m-38 0 a38 38 0 0 1 76 0"
                        fill="none"
                      />
                    </defs>
                    <circle className="fm-stamp-ring" cx="60" cy="60" r="53" />
                    <circle className="fm-stamp-ring inner" cx="60" cy="60" r="45" />
                    <path className="fm-stamp-check" d="M40 61 L53 76 L82 43" />
                    <text className="fm-stamp-arc">
                      <textPath href={`#arc-${row.id}`} startOffset="50%">
                        LINKEDIN LEARNING
                      </textPath>
                    </text>
                    <text className="fm-stamp-foot" x="60" y="96">
                      VERIFIED
                    </text>
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

/* The band wipe and the stamp press are GSAP because both need eases
   and a shared kill; the colour flip is left to CSS because the resting
   colour is `var(--ink)`, and GSAP would have to parse that custom
   property as a colour to tween back to it. Toggling a class sidesteps
   that entirely. */
function hover(el: HTMLElement, on: boolean) {
  el.classList.toggle("is-hot", on);
  const fill = el.querySelector(".fm-fill");
  const stamp = el.querySelector<SVGSVGElement>(".fm-stamp");
  const ring = el.querySelectorAll<SVGCircleElement>(".fm-stamp-ring");

  gsap.killTweensOf([fill, stamp]);

  gsap.to(fill, {
    scaleY: on ? 1 : 0,
    duration: on ? 0.42 : 0.3,
    ease: on ? "power3.out" : "power2.in",
  });

  if (!stamp) return;

  if (!on) {
    // Lifting off is a plain fade. Reversing the press would read as the
    // stamp being pulled back up, which is not what leaving a row means.
    gsap.to(stamp, { opacity: 0, duration: 0.22, ease: "power2.in" });
    return;
  }

  /* Re-rolled per press: angle, where on the row it lands, and how the
     ink breaks around the ring. A stamp applied by hand is never square
     to the page and never inks identically twice. */
  const angle = rand(-15, 9);
  ring.forEach((r) =>
    r.setAttribute(
      "stroke-dasharray",
      INK_PATTERNS[Math.floor(Math.random() * INK_PATTERNS.length)]
    )
  );

  // Reduced motion means no press, not no stamp — the seal still says
  // the shelf is verified, it just arrives already landed.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(stamp, { opacity: 1, scale: 1, rotate: angle, xPercent: 0, yPercent: 0 });
    return;
  }

  gsap.fromTo(
    stamp,
    { opacity: 0, scale: 1.75, rotate: angle - 14, xPercent: rand(-6, 6), yPercent: rand(-8, 8) },
    {
      opacity: 1,
      scale: 1,
      rotate: angle,
      // power4.out lands it hard and then stops dead — the deceleration
      // curve IS the impact. An elastic ease would make it bounce like
      // rubber rather than press like a stamp.
      duration: 0.34,
      ease: "power4.out",
    }
  );
}
