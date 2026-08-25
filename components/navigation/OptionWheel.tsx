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
import { haptic } from "@/lib/haptics";
import "./OptionWheel.css";

/* A curved option wheel: a vertical list bent around an invisible arc,
   with the centred option selected.

   The interaction model is the point of it, so it is worth stating what
   the model is rather than leaving it in the arithmetic below.

   There are three numbers. `target` is where the wheel is being asked to
   sit — an item index, fractional while a finger is down. `pos` is where
   it actually is. `vel` is how fast `pos` is moving, in steps per
   second. One requestAnimationFrame loop integrates a spring that pulls
   `pos` toward `target`:

       a    = -w^2 * (pos - target) - 2 * zeta * w * vel
       vel += a * dt
       pos += vel * dt

   This used to be exponential smoothing — `pos += (target - pos) * k` —
   which has no velocity term at all. That is the difference that matters
   here, and it is worth being explicit about why:

     - A flick did nothing. Smoothing only knows the distance left to
       travel, so releasing after a fast 20px drag and releasing after a
       slow one produced the identical motion. The wheel could be dragged
       but never thrown.
     - Releasing always stopped dead at the detent, because the wheel
       arrived with no momentum to carry past it.
     - Grabbing the wheel mid-flight restarted the motion from a standstill.

   The spring fixes all three, because velocity is a number the system
   carries rather than one it recomputes. The finger's release velocity
   is handed to the spring directly (see `endDrag`), a re-target mid-
   flight keeps whatever velocity `pos` already had, and where the wheel
   lands is chosen by projecting that velocity forward rather than by
   rounding off where the finger happened to stop.

   dt is clamped, which is what keeps the integration stable across a
   dropped frame; the spring itself is frame-rate independent because it
   is integrated in real time rather than per frame.

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
/** And this, in steps per second, is slow enough to count as stopped. */
const REST_VELOCITY = 0.02;

/* Damping ratios. 1 is critically damped — it reaches the target and
   stops, with no overshoot. Below 1 it overshoots and comes back.

   Which one applies is decided by what caused the movement, not by
   taste. A flick carried momentum, and momentum that stops dead at the
   detent reads as hitting a wall, so a released drag settles at 0.8 and
   is allowed a little overshoot. A keyboard press, a tap on an option or
   a trackpad snap carried none, so those settle at 1: a wheel that
   bounces when you press the down arrow is bouncing for no reason. */
const DAMPING_GESTURE = 0.8;
const DAMPING_DISCRETE = 1;

/** Frames longer than this are treated as this long, so a dropped frame
    or a backgrounded tab cannot integrate the spring into orbit. */
const MAX_FRAME = 0.032;

/* Deceleration for the momentum projection, and the ceiling on what it
   is allowed to project.

   0.998 is the rate a native scroll view decelerates at, and the
   projection derived from it — velocity * 499 — is what makes a flick
   feel like it throws the wheel rather than nudges it. The clamp is
   because this list has five entries: without it, a hard flick on a
   trackpad projects tens of steps, the wheel clamps to the last option
   anyway, and the whole gesture resolves as "go to the end" no matter
   how it was aimed. Three steps is far enough to cross the list and
   short enough that aim still decides where it lands. */
const DECELERATION = 0.998;
const MAX_PROJECTED_STEPS = 3;

/* Rubber-banding past the ends of a non-looping list. The further past
   the last option the finger goes, the less the wheel follows it —
   which says "there is nothing more here" while still tracking, where a
   hard clamp just reads as the wheel having frozen. */
const RUBBER = 0.55;
/** How many steps past the end the resistance is scaled against. */
const RUBBER_RANGE = 2.4;

/** How many recent pointer samples are kept for the velocity estimate. */
const SAMPLE_WINDOW = 5;
/** Samples older than this are stale — a finger that paused before
    lifting released at rest, whatever it was doing 200ms ago. */
const SAMPLE_MAX_AGE = 120;

/** Apple's momentum projection: where a throw at this velocity comes to
    rest. Note this is the exponential-decay form, not v^2/2a. */
function project(velocity: number) {
  return (velocity / 1000) * DECELERATION / (1 - DECELERATION);
}

/** Progressive resistance past a boundary. `overshoot` and the result
    are both in steps. */
function rubberband(overshoot: number) {
  const sign = Math.sign(overshoot);
  const o = Math.abs(overshoot);
  return sign * ((o * RUBBER_RANGE * RUBBER) / (RUBBER_RANGE + RUBBER * o));
}

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
  /** Current velocity of `pos`, in steps per second. Carried across the
      handoff from finger to spring, and preserved through a re-target so
      reversing mid-flight bends the motion instead of restarting it. */
  const velRef = useRef(0);
  /** Damping ratio the spring is currently running at — see the two
      constants above. */
  const dampingRef = useRef(DAMPING_DISCRETE);
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
    /** Recent (y, timestamp) pairs, oldest first. The release velocity
        comes from these rather than from the last move event alone: a
        single pair straddling one slow frame reports a velocity the
        finger never had. */
    samples: { y: number; t: number }[];
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

  /* `pos` for a looping list drifts further from 0 with every wrap, and
     nothing resets it — each grab starts from wherever the last one left
     off. Harmless for the arithmetic, which is all relative, but the
     numbers grow without bound over a long session. This folds it back
     into range at the one moment it can be done without a visible jump:
     the instant a finger takes over, when `pos` and `target` are about
     to be set to the same value anyway. */
  const settledPos = useCallback((pos: number) => {
    const { count: n, loop: wrap } = cfg.current;
    if (!wrap || n <= 0) return pos;
    return ((pos % n) + n) % n;
  }, []);

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
      /* The detent, on the frame it happens. A wheel that clicks under
         the finger is the whole reason a physical one feels precise, and
         a selection change is exactly the kind of discrete, meaningful
         commit that earns a haptic — as opposed to firing one
         continuously through the drag, which trains the hand to ignore
         it. See lib/haptics.ts for the vocabulary this belongs to. */
      haptic("detent");
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
      const dt = Math.min((ts - lastTsRef.current) / 1000, MAX_FRAME);
      lastTsRef.current = ts;

      if (reducedRef.current) {
        /* Reduced motion gets no travel at all: the wheel is simply at
           the option that was chosen. Springing there more slowly is
           still springing. */
        posRef.current = targetRef.current;
        velRef.current = 0;
      } else {
        /* Response, in seconds — how quickly the spring reaches the
           target. Not a duration: a spring has no fixed one. The
           `smoothing` prop is still the knob that sets it, read as a
           time constant and doubled, which lands the default 180 on
           0.36s — inside the 0.3–0.4 range that a picker wants and
           close enough to the old feel that nothing calling this
           component needs to be retuned. */
        const response = (Math.max(cfg.current.smoothing, 1) / 1000) * 2;
        const w = (2 * Math.PI) / response;
        const zeta = dampingRef.current;

        const a =
          -(w * w) * (posRef.current - targetRef.current) - 2 * zeta * w * velRef.current;
        velRef.current += a * dt;
        posRef.current += velRef.current * dt;
      }

      /* Rest is both conditions, not either. Distance alone calls the
         wheel settled at the exact moment an under-damped spring passes
         through its target at full speed, which would cut the overshoot
         off mid-flight — the bounce would only ever be visible on the
         way out. */
      if (
        Math.abs(targetRef.current - posRef.current) < REST_EPSILON &&
        Math.abs(velRef.current) < REST_VELOCITY
      ) {
        posRef.current = targetRef.current;
        velRef.current = 0;
      }

      paint();
      publish(settledIndex());

      if (posRef.current === targetRef.current && velRef.current === 0) {
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

  /* `damping` says what kind of movement this is — a gesture that
     carried momentum, or a discrete jump that did not — and `velocity`
     is the finger's speed at release, in steps per second, handed
     straight to the spring so there is no seam between the drag and the
     animation that follows it.

     Omitting `velocity` deliberately leaves whatever velocity `pos`
     already had. That is what makes a re-target mid-flight bend the
     motion rather than restart it: press the down arrow twice quickly
     and the second press adds to a wheel that is already moving,
     instead of stopping it and starting again. */
  const setTarget = useCallback(
    (
      value: number,
      { damping = DAMPING_DISCRETE, velocity }: { damping?: number; velocity?: number } = {}
    ) => {
      const { count: n, loop: wrap } = cfg.current;
      targetRef.current = wrap ? value : clamp(value, 0, Math.max(n - 1, 0));
      dampingRef.current = damping;
      if (velocity !== undefined) velRef.current = velocity;
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

    /* The grab starts from `pos` — where the wheel is on screen right
       now — not from `target`, where it was heading. Those two are the
       same at rest and quite far apart mid-flight, and starting from the
       target is what makes a wheel jump under a finger that catches it
       in motion.

       The spring is stopped rather than left running: the finger is the
       authority from here on, and a spring still pulling toward its old
       target would be fighting it. */
    posRef.current = settledPos(posRef.current);
    targetRef.current = posRef.current;
    velRef.current = 0;

    dragRef.current = {
      id: e.pointerId,
      startY: e.clientY,
      startTarget: posRef.current,
      moved: false,
      samples: [{ y: e.clientY, t: e.timeStamp }],
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;

    // Kept regardless of the threshold: the velocity at release is the
    // velocity of the last few moves, including the ones that happened
    // before the gesture was confidently a drag.
    drag.samples.push({ y: e.clientY, t: e.timeStamp });
    if (drag.samples.length > SAMPLE_WINDOW) drag.samples.shift();

    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.abs(dy) < DRAG_THRESHOLD) return;
    drag.moved = true;
    // Pull the sheet down and earlier items come to centre, which is
    // the direction the content moves, not the direction the index does.
    const step = stepRef.current || 1;
    const raw = drag.startTarget - dy / step;

    /* Past the ends of a list that does not loop, the wheel follows the
       finger less and less rather than stopping against a wall. It is
       still moving, so the gesture still reads as heard; it is barely
       moving, so it also reads as "this is the end". */
    const { count: n, loop: wrap } = cfg.current;
    let next = raw;
    if (!wrap && n > 0) {
      const lo = 0;
      const hi = n - 1;
      if (raw < lo) next = lo + rubberband(raw - lo);
      else if (raw > hi) next = hi + rubberband(raw - hi);
    }

    targetRef.current = next;
    posRef.current = next;
    velRef.current = 0;
    paint();
    publish(settledIndex());
  };

  /** Finger speed at release, in steps per second, signed the same way
      `target` is. Measured across the newest samples still inside the
      age window rather than the last event pair. */
  const releaseVelocity = (samples: { y: number; t: number }[], now: number) => {
    const step = stepRef.current || 1;
    const fresh = samples.filter((sample) => now - sample.t <= SAMPLE_MAX_AGE);
    if (fresh.length < 2) return 0;
    const first = fresh[0];
    const last = fresh[fresh.length - 1];
    const dt = last.t - first.t;
    if (dt <= 0) return 0;
    // Dragging down (positive dy) lowers the index, hence the negation.
    return -((last.y - first.y) / step) / (dt / 1000);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    // Never leave an option stranded between two positions.
    if (!drag.moved) return;

    /* Where the wheel lands is chosen from where the gesture was going,
       not from where the finger happened to let go. Project the release
       velocity forward the way a scroll view decelerates, then snap to
       the option nearest that projected point — so a flick throws the
       wheel past two options and a slow drag released in the same place
       settles on the nearest one.

       The velocity then goes to the spring as its initial velocity,
       which is what removes the seam: the first frame after the finger
       lifts is moving at exactly the speed the finger was. */
    const v = releaseVelocity(drag.samples, e.timeStamp);
    const projected =
      posRef.current + clamp(project(v), -MAX_PROJECTED_STEPS, MAX_PROJECTED_STEPS);

    setTarget(Math.round(projected), { damping: DAMPING_GESTURE, velocity: v });
  };

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    const step = stepRef.current || 1;
    targetRef.current = targetRef.current + e.deltaY / step;
    const { count: n, loop: wrap } = cfg.current;
    if (!wrap) targetRef.current = clamp(targetRef.current, 0, Math.max(n - 1, 0));
    /* A trackpad already carries its own momentum — the browser keeps
       sending deltas after the fingers lift — so the wheel must not add
       a second helping of it. Critically damped, and the target is the
       delta itself rather than a projection of it. */
    dampingRef.current = DAMPING_DISCRETE;
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
