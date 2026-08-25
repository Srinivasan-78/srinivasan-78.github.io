"use client";

/* React Bits <ProfileCard />, ported to TypeScript.

   Upstream's CSS custom properties, upstream's device-orientation path
   behind `enableMobileTilt`, and a reduced-motion guard added here: with
   the OS setting on, the card renders centred and static rather than
   tracking the pointer.

   The tilt engine itself is not upstream's. It was exponential
   smoothing — `current += (target - current) * k` — which has no
   velocity term, and the missing velocity is felt in one specific
   place: the moment the pointer leaves.

   Sweeping off the edge of a card is a throw. The hand is moving, and it
   has a direction and a speed at the instant it leaves. Smoothing knows
   only the distance left to the centre, so it discarded all of that and
   glided the card home along the same path at the same rate whether the
   pointer drifted off or was flicked off. The card felt like it was
   being retracted rather than released.

   It is two springs now, one per axis, and they are separate springs
   rather than one spring on the 2D distance — a single one desyncs the
   moment X and Y are moving at different speeds, which is most of the
   time. Each carries its own velocity, so:

     - while a pointer is on the card the springs are critically damped
       and simply track it, because a card that overshoots the cursor
       you are aiming with reads as loose, not lively;

     - when the pointer leaves, its exit velocity is handed to the
       springs as their initial velocity and the damping drops to 0.8,
       so the card carries the throw through the centre and settles
       back. Bounce here is earned: a gesture with momentum preceded it.

   The intro settle keeps its own slower response, unchanged in feel. */

import React, { useEffect, useRef, useCallback, useMemo, type CSSProperties } from "react";
import "./ProfileCard.css";

const DEFAULT_INNER_GRADIENT = "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
} as const;

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

export type ProfileCardProps = {
  avatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
};

const ProfileCardComponent = ({
  avatarUrl = "<Placeholder for avatar URL>",
  iconUrl,
  grainUrl,
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = "",
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "Javi A. Torres",
  title = "Software Engineer",
  handle = "javicodes",
  status = "Online",
  contactText = "Contact",
  showUserInfo = true,
  onContactClick,
}: ProfileCardProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    /* One velocity per axis, in px/s. These are what the smoothing this
       replaced had no equivalent of. */
    let velX = 0;
    let velY = 0;

    /* Response, in seconds: how quickly the spring reaches the target.
       Not a duration — a spring has none; its settle time falls out of
       these two numbers. The pair mirrors the time constants this used
       to run on, so the tracking still feels the way it did.

       Damping ratio: 1 reaches the target and stops. Below 1 it
       overshoots and comes back. Which applies is decided by what caused
       the movement, never by taste — see the note at the top. */
    const DEFAULT_RESPONSE = 0.28;
    const INITIAL_RESPONSE = 1.2;
    const DAMPING_TRACKING = 1;
    const DAMPING_RELEASE = 0.8;
    /* Longer frames than this are clamped, so a dropped frame or a
       backgrounded tab cannot integrate the spring into orbit. */
    const MAX_FRAME = 0.032;
    /** Below both of these, on both axes, the card has arrived. */
    const REST_DISTANCE = 0.05;
    const REST_VELOCITY = 0.5;

    let damping = DAMPING_TRACKING;
    let initialUntil = 0;

    const setVarsFromXY = (x: number, y: number) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties: Record<string, string> = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
    };

    const step = (ts: number) => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, MAX_FRAME);
      lastTs = ts;

      const response = ts < initialUntil ? INITIAL_RESPONSE : DEFAULT_RESPONSE;
      const w = (2 * Math.PI) / response;

      /* Semi-implicit integration, per axis. Acceleration is the pull
         toward the target minus the drag on the current velocity; the
         new velocity is what moves the position, which is what keeps
         this stable at the frame lengths a browser actually delivers. */
      const ax = -(w * w) * (currentX - targetX) - 2 * damping * w * velX;
      const ay = -(w * w) * (currentY - targetY) - 2 * damping * w * velY;
      velX += ax * dt;
      velY += ay * dt;
      currentX += velX * dt;
      currentY += velY * dt;

      setVarsFromXY(currentX, currentY);

      /* Rest is distance *and* velocity, not distance alone. An
         under-damped spring passes through its target at full speed, and
         a distance-only test calls it settled at exactly that instant —
         which would cut the overshoot off mid-flight, so the release
         bounce would never be seen. */
      const stillFar =
        Math.abs(targetX - currentX) > REST_DISTANCE ||
        Math.abs(targetY - currentY) > REST_DISTANCE ||
        Math.abs(velX) > REST_VELOCITY ||
        Math.abs(velY) > REST_VELOCITY;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number) {
        currentX = x;
        currentY = y;
        velX = 0;
        velY = 0;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x: number, y: number) {
        targetX = x;
        targetY = y;
        /* Deliberately does not touch the velocity. A re-target that
           reset it would stop the card dead every time the pointer moved
           — sixty times a second — and re-accelerate from nothing. Left
           alone, the spring bends its existing motion toward the new
           target, which is the whole reason a moving pointer feels like
           it is dragging the card rather than teleporting it. */
        damping = DAMPING_TRACKING;
        start();
      },
      /* The release. `vx`/`vy` are the pointer's own velocity at the
         instant it left the card, in px/s, handed to the springs as
         their initial velocity so the first frame after the pointer is
         gone is moving at exactly the speed the pointer was — no seam
         between the gesture and the animation that follows it. */
      release(vx: number, vy: number) {
        const shell = shellRef.current;
        if (!shell) return;
        targetX = shell.clientWidth / 2;
        targetY = shell.clientHeight / 2;
        velX = vx;
        velY = vy;
        damping = DAMPING_RELEASE;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs: number) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      },
    };
  }, [enableTilt]);

  const getOffsets = (evt: { clientX: number; clientY: number }, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  /* A finger is scrolling, not aiming. Touch pointers fire pointerenter
     and pointermove exactly like a mouse, so without this the card tilts
     and lights up under every swipe that passes over it. Mobile tilt,
     when it is on, comes from deviceorientation below — never from a
     pointer — so touch has no business driving the tilt engine. */
  const isTiltPointer = (event: PointerEvent) => event.pointerType !== "touch";

  /* A short history of where the pointer has been, so the velocity at
     the moment it leaves comes from the last few moves rather than from
     one event pair — a single pair straddling one slow frame reports a
     speed the hand never had. Samples older than the window are dropped:
     a pointer that paused on the card before drifting off left at rest,
     whatever it was doing 150ms earlier. */
  const samplesRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const SAMPLE_WINDOW = 5;
  const SAMPLE_MAX_AGE = 120;

  const pushSample = (x: number, y: number, t: number) => {
    const samples = samplesRef.current;
    samples.push({ x, y, t });
    if (samples.length > SAMPLE_WINDOW) samples.shift();
  };

  /** Pointer velocity in px/s, per axis, across the fresh samples. */
  const pointerVelocity = (now: number) => {
    const fresh = samplesRef.current.filter((sample) => now - sample.t <= SAMPLE_MAX_AGE);
    if (fresh.length < 2) return { vx: 0, vy: 0 };
    const first = fresh[0];
    const last = fresh[fresh.length - 1];
    const dt = last.t - first.t;
    if (dt <= 0) return { vx: 0, vy: 0 };
    return {
      vx: ((last.x - first.x) / dt) * 1000,
      vy: ((last.y - first.y) / dt) * 1000,
    };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine || !isTiltPointer(event)) return;
      const { x, y } = getOffsets(event, shell);
      pushSample(x, y, event.timeStamp);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine || !isTiltPointer(event)) return;

      shell.classList.add("active");
      shell.classList.add("entering");
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove("entering");
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      // A fresh entry is a fresh gesture; whatever the pointer was doing
      // before it arrived is not part of it.
      samplesRef.current = [{ x, y, t: event.timeStamp }];
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerLeave = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      /* The exit itself is a sample — it is the last and most relevant
         one, and on a fast sweep it can be the only one inside the
         window. */
      const { x, y } = getOffsets(event, shell);
      pushSample(x, y, event.timeStamp);
      const { vx, vy } = pointerVelocity(event.timeStamp);
      samplesRef.current = [];

      tiltEngine.release(vx, vy);

      const checkSettle = () => {
        const { x, y, tx, ty } = tiltEngine.getCurrent();
        const settled = Math.hypot(tx - x, ty - y) < 0.6;
        if (settled) {
          shell.classList.remove("active");
          leaveRafRef.current = null;
        } else {
          leaveRafRef.current = requestAnimationFrame(checkSettle);
        }
      };
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      leaveRafRef.current = requestAnimationFrame(checkSettle);
    },
    [tiltEngine]
  );

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        0,
        shell.clientHeight
      );

      tiltEngine.setTarget(x, y);
    },
    [tiltEngine, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    if (!shell) return;

    // With reduced motion requested, the card is placed dead centre once
    // and no pointer listener is ever attached.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tiltEngine.setImmediate(shell.clientWidth / 2, shell.clientHeight / 2);
      return () => tiltEngine.cancel();
    }

    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;
    const deviceOrientationHandler = handleDeviceOrientation;

    shell.addEventListener("pointerenter", pointerEnterHandler);
    shell.addEventListener("pointermove", pointerMoveHandler);
    shell.addEventListener("pointerleave", pointerLeaveHandler);

    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== "https:") return;
      const anyMotion = window.DeviceMotionEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (anyMotion && typeof anyMotion.requestPermission === "function") {
        anyMotion
          .requestPermission()
          .then((state) => {
            if (state === "granted") {
              window.addEventListener("deviceorientation", deviceOrientationHandler);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", deviceOrientationHandler);
      }
    };
    shell.addEventListener("click", handleClick);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener("pointerenter", pointerEnterHandler);
      shell.removeEventListener("pointermove", pointerMoveHandler);
      shell.removeEventListener("pointerleave", pointerLeaveHandler);
      shell.removeEventListener("click", handleClick);
      window.removeEventListener("deviceorientation", deviceOrientationHandler);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove("entering");
    };
  }, [
    enableTilt,
    enableMobileTilt,
    tiltEngine,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation,
  ]);

  const cardStyle = useMemo(
    () =>
      ({
        "--icon": iconUrl ? `url(${iconUrl})` : "none",
        "--grain": grainUrl ? `url(${grainUrl})` : "none",
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
        "--behind-glow-color": behindGlowColor ?? "rgba(125, 190, 255, 0.67)",
        "--behind-glow-size": behindGlowSize ?? "50%",
      }) as CSSProperties,
    [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]
  );

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  return (
    <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="avatar"
                src={avatarUrl}
                alt={`${name || "User"} avatar`}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={miniAvatarUrl || avatarUrl}
                        alt={`${name || "User"} mini avatar`}
                        loading="lazy"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.style.opacity = "0.5";
                          t.src = avatarUrl;
                        }}
                      />
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status">{status}</div>
                    </div>
                  </div>
                  <button
                    className="pc-contact-btn"
                    onClick={handleContactClick}
                    style={{ pointerEvents: "auto" }}
                    type="button"
                    aria-label={`Contact ${name || "user"}`}
                  >
                    {contactText}
                  </button>
                </div>
              )}
            </div>
            <div className="pc-content">
              <div className="pc-details">
                {/* Not a heading. The card is an object in the hero, not a
                    section of the document, and an <h3> here landed
                    between the page's <h1> and its first <h2> — a level
                    skip for anyone navigating by headings, for a name the
                    hero already states in its own line above. */}
                <div className="pc-name">{name}</div>
                <p>{title}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
