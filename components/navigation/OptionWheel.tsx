"use client";

import {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
  useMemo,
  useRef,
  forwardRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import "./OptionWheel.css";

/* A curved option wheel: a vertical list bent around an invisible arc,
   with the centred option selected.

   The interaction model is the point of it, so it is worth stating what
   the model is rather than leaving it in the arithmetic below.

   There are two numbers. `target` is where the wheel is being asked to
   sit — an item index, fractional while a finger is down. `pos` is
   where it actually is. One requestAnimationFrame loop walks `pos`
   toward `target` with frame-rate-independent exponential smoothing:

       pos += (target - pos) * (1 - exp(-dt / tau))

   The `1 - exp(-dt/tau)` factor is what makes it frame-rate
   independent. A plain `pos += (target - pos) * 0.2` moves twice as far
   per second at 120Hz as it does at 60Hz; this does not.

   Neither number is React state. They live in refs, and the loop writes
   transforms, opacity and filters straight onto the option elements. A
   wheel that re-rendered React on every frame would be doing sixty
   reconciliations a second to move some text.

   Exactly one thing here is React state: which option is settled on.
   That is discrete — it changes when the wheel crosses from one option
   to the next, a few times per interaction, not sixty times a second —
   and React has to render it, because it drives the selected class and
   `aria-selected`. Position in refs, selection in state; the split is
   what each of the two is actually for.

   Each option's distance from centre, `d`, drives everything:

       y        d * step                    vertical position
       x        curve, via 1 - cos(theta)   the bend
       rotate   -d * tilt                   the tilt into the arc
       opacity  1 - |d| * fade, floored     the fade
       blur     ramps to `blur` px          the depth of field
       --ow-p   1 at centre, 0 by one step  colour + weight blend

   `--ow-p` is exposed as a custom property rather than being resolved
   here, so the stylesheet decides what proximity *means* — colour,
   weight, whatever the design wants — without this file knowing. */

export type OptionWheelHandle = {
  focus: () => void;
};

export type OptionWheelProps = {
  items: string[];
  defaultSelected?: number;
  /** Colour of an option at rest. */
  textColor?: string;
  /** Colour of the centred option. Blended by --ow-p in the stylesheet. */
  activeColor?: string;
  /** Which edge the list is anchored to; the arc bends away from it. */
  side?: "left" | "right";
  /** Option size, in rem. */
  fontSize?: number;
  /** Line step, as a multiple of fontSize. */
  spacing?: number;
  /** How far the arc pushes distant options toward the edge. */
  curve?: number;
  /** Degrees of rotation per step away from centre. */
  tilt?: number;
  /** Blur in px reached by the furthest legible option. */
  blur?: number;
  /** Opacity lost per step away from centre. */
  fade?: number;
  minOpacity?: number;
  /** Smoothing time constant in ms. Lower is snappier. */
  smoothing?: number;
  /** Distance from the anchored edge, in px. */
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  /** Selection tick. Empty string — the default — means no audio. */
  soundUrl?: string;
  soundVolume?: number;
  className?: string;
  /** Fires when the settled selection changes. */
  onChange?: (index: number, item: string) => void;
  /** Fires when the centred option is chosen: tapped again, or Enter. */
  onActivate?: (index: number, item: string) => void;
  "aria-label"?: string;
};

/** Radians of arc per step. Fixed: `curve` scales the resulting offset. */
const ARC = 0.34;
/** Movement in px before a pointer press counts as a drag, not a tap. */
const DRAG_THRESHOLD = 6;
/** Quiet time after the last wheel tick before the wheel snaps. */
const WHEEL_SNAP_MS = 140;
/** Below this, `pos` is close enough to `target` to stop the loop. */
const REST_EPSILON = 0.002;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

const OptionWheel = forwardRef<OptionWheelHandle, OptionWheelProps>(function OptionWheel(
  {
    items,
    defaultSelected = 0,
    textColor = "currentColor",
    activeColor = "currentColor",
    side = "left",
    fontSize = 2.2,
    spacing = 1.35,
    curve = 1.15,
    tilt = 7,
    blur = 1.8,
    fade = 0.25,
    minOpacity = 0.08,
    smoothing = 180,
    inset = 32,
    loop = false,
    draggable = true,
    soundUrl = "",
    soundVolume = 0.2,
    className = "",
    onChange,
    onActivate,
    "aria-label": ariaLabel,
  },
  ref
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const count = items.length;
  const startIndex = clamp(defaultSelected, 0, Math.max(count - 1, 0));

  const [selected, setSelected] = useState(startIndex);

  const posRef = useRef(startIndex);
  const targetRef = useRef(startIndex);
  /** Step height in px. Measured, because fontSize is in rem. */
  const stepRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  /** Last index handed to onChange, so it only fires on real changes. */
  const reportedRef = useRef(startIndex);
  const reducedRef = useRef(false);

  const dragRef = useRef<{
    id: number;
    startY: number;
    startTarget: number;
    moved: boolean;
  } | null>(null);
  const wheelSnapRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handlers read live props through a ref, so the rAF loop and the
  // pointer listeners never capture a stale value and never need to be
  // rebuilt when a prop changes.
  const cfg = useRef({ count, loop, fade, minOpacity, blur, curve, tilt, side, smoothing, onChange });
  cfg.current = { count, loop, fade, minOpacity, blur, curve, tilt, side, smoothing, onChange };

  /** Signed distance from `pos` to item `i`, wrapped when looping. */
  const distance = useCallback((i: number, pos: number) => {
    const { count: n, loop: wrap } = cfg.current;
    let d = i - pos;
    if (wrap && n > 1) {
      if (d > n / 2) d -= n;
      else if (d < -n / 2) d += n;
    }
    return d;
  }, []);

  /** Writes one frame. No React, no layout reads — assignments only. */
  const paint = useCallback(() => {
    const pos = posRef.current;
    const step = stepRef.current;
    const { fade: fd, minOpacity: minOp, blur: bl, curve: cv, tilt: tl, side: sd } = cfg.current;
    const edge = sd === "left" ? -1 : 1;

    for (let i = 0; i < optionRefs.current.length; i++) {
      const el = optionRefs.current[i];
      if (!el) continue;

      const d = distance(i, pos);
      const ad = Math.abs(d);
      const theta = d * ARC;

      const y = d * step;
      const x = edge * (1 - Math.cos(theta)) * cv * step * 1.6;
      const rot = -d * tl;
      const opacity = Math.max(minOp, 1 - ad * fd);
      const blurPx = Math.min(ad * 0.55, 1) * bl;
      const p = clamp(1 - ad, 0, 1);

      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = blurPx > 0.02 ? `blur(${blurPx.toFixed(2)}px)` : "none";
      el.style.setProperty("--ow-p", p.toFixed(3));
      /* Only an option that has faded to nothing stops taking taps.
         The threshold has to sit below `minOpacity`, or a short list —
         where every option is floored at the minimum — would make its
         furthest entries permanently untappable, reachable by drag
         alone. It is here for long, looping lists whose far side is
         genuinely invisible. */
      el.style.pointerEvents = opacity <= 0.06 ? "none" : "auto";
    }
  }, [distance]);

  const settledIndex = useCallback(() => {
    const { count: n, loop: wrap } = cfg.current;
    const raw = Math.round(posRef.current);
    if (!n) return 0;
    return wrap ? ((raw % n) + n) % n : clamp(raw, 0, n - 1);
  }, []);

  /* Called from the frame loop and from the drag handler. Renders only
     when the settled option actually changes. */
  const publish = useCallback(
    (idx: number) => {
      if (idx === reportedRef.current) return;
      reportedRef.current = idx;
      setSelected(idx);
      playTickRef.current();
      cfg.current.onChange?.(idx, itemsRef.current[idx]);
    },
    []
  );

  // Held in refs so `publish` needs no dependencies and never goes stale.
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const playTickRef = useRef<() => void>(() => {});

  const playTick = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    // A blocked autoplay policy is not an error worth surfacing.
    void a.play().catch(() => {});
  }, []);
  playTickRef.current = playTick;

  const tick = useCallback(
    (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;

      const tau = Math.max(cfg.current.smoothing, 1) / 1000;
      const k = reducedRef.current ? 1 : 1 - Math.exp(-dt / tau);
      posRef.current += (targetRef.current - posRef.current) * k;

      if (Math.abs(targetRef.current - posRef.current) < REST_EPSILON) {
        posRef.current = targetRef.current;
      }

      paint();
      publish(settledIndex());

      if (posRef.current === targetRef.current) {
        rafRef.current = null;
        lastTsRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [paint, settledIndex, publish]
  );

  /** Starts the loop if it is not already running. */
  const run = useCallback(() => {
    if (rafRef.current !== null) return;
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const setTarget = useCallback(
    (value: number) => {
      const { count: n, loop: wrap } = cfg.current;
      targetRef.current = wrap ? value : clamp(value, 0, Math.max(n - 1, 0));
      run();
    },
    [run]
  );

  const snap = useCallback(() => setTarget(Math.round(targetRef.current)), [setTarget]);

  // Measure the step from the rendered type rather than assuming a root
  // font size, and re-measure when the box changes.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    /* Measured off a rendered option, not computed from the prop.

       The prop sets a default; the stylesheet is free to override it,
       and this one does — the labels shrink with the viewport so
       "Certifications" fits a 320px screen and a phone in landscape.
       Deriving the step from the prop instead would keep desktop-sized
       spacing under phone-sized type, which is exactly how a wheel ends
       up with its last option below the fold. */
    const measure = () => {
      const sample = optionRefs.current.find(Boolean) ?? root;
      const size = parseFloat(getComputedStyle(sample).fontSize) || 16;
      stepRef.current = size * spacing;
      paint();
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [fontSize, spacing, paint]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!soundUrl) return;
    const a = new Audio(soundUrl);
    a.volume = clamp(soundVolume, 0, 1);
    a.preload = "auto";
    audioRef.current = a;
    return () => {
      a.pause();
      a.src = "";
      audioRef.current = null;
    };
  }, [soundUrl, soundVolume]);

  // One teardown for everything the component can leave running.
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (wheelSnapRef.current) clearTimeout(wheelSnapRef.current);
      wheelSnapRef.current = null;
    },
    []
  );

  useImperativeHandle(ref, () => ({ focus: () => rootRef.current?.focus() }), []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || e.button !== 0) return;
    dragRef.current = {
      id: e.pointerId,
      startY: e.clientY,
      startTarget: targetRef.current,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.abs(dy) < DRAG_THRESHOLD) return;
    drag.moved = true;
    // Pull the sheet down and earlier items come to centre, which is
    // the direction the content moves, not the direction the index does.
    const step = stepRef.current || 1;
    targetRef.current = drag.startTarget - dy / step;
    posRef.current = targetRef.current;
    paint();
    publish(settledIndex());
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    // Never leave an option stranded between two positions.
    if (drag.moved) snap();
  };

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    const step = stepRef.current || 1;
    targetRef.current = targetRef.current + e.deltaY / step;
    const { count: n, loop: wrap } = cfg.current;
    if (!wrap) targetRef.current = clamp(targetRef.current, 0, Math.max(n - 1, 0));
    run();
    if (wheelSnapRef.current) clearTimeout(wheelSnapRef.current);
    wheelSnapRef.current = setTimeout(snap, WHEEL_SNAP_MS);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const current = Math.round(targetRef.current);
    switch (e.key) {
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        setTarget(current - 1);
        break;
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        setTarget(current + 1);
        break;
      case "Home":
        e.preventDefault();
        setTarget(0);
        break;
      case "End":
        e.preventDefault();
        setTarget(count - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onActivate?.(settledIndex(), items[settledIndex()]);
        break;
      default:
        break;
    }
  };

  const onOptionClick = (index: number) => {
    // A drag that ended on an option must not read as a tap on it.
    if (dragRef.current?.moved) return;

    /* Tap once to bring an option to centre; tap the centred one to
       choose it.

       The test is against `target` — where the wheel is going — not
       against `pos`, where it currently is. Exponential smoothing
       approaches its target without ever quite arriving, so requiring
       the two to be equal makes the second tap of a deliberate
       double-tap do nothing for the better part of a second. Aiming at
       the target means the second tap counts as soon as the first one
       has been registered.

       The distance tolerance is what stops a tap landing mid-fling from
       counting: if the wheel is still a third of a step away from where
       it is going, this was a tap at a moving option, not a choice. */
    const heading = Math.round(targetRef.current);
    const arrived = Math.abs(targetRef.current - posRef.current) < 0.35;
    if (index === heading && arrived) {
      onActivate?.(index, items[index]);
      return;
    }
    setTarget(index);
  };

  const style = useMemo(
    () =>
      ({
        "--ow-font-size": `${fontSize}rem`,
        "--ow-inset": `${inset}px`,
        "--ow-text": textColor,
        "--ow-active": activeColor,
      }) as CSSProperties,
    [fontSize, inset, textColor, activeColor]
  );

  return (
    <div
      ref={rootRef}
      className={`option-wheel option-wheel--${side} ${className}`.trim()}
      style={style}
      role="listbox"
      aria-label={ariaLabel}
      aria-activedescendant={count ? `ow-option-${selected}` : undefined}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
    >
      <div className="option-wheel__track">
        {items.map((item, i) => (
          <div
            key={item}
            id={`ow-option-${i}`}
            ref={(el) => {
              optionRefs.current[i] = el;
            }}
            className={
              "option-wheel__item" + (i === selected ? " option-wheel__item--selected" : "")
            }
            role="option"
            aria-selected={i === selected}
            onClick={() => onOptionClick(i)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
});

export default OptionWheel;
