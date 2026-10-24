/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌‌​‌​​​‌‌​‌‌‌​​‌‌​‌​​​‌​​​​‌​​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌​‌​‌​‌​‌‌‌​‌‌‌​​‌‌​‌​​​‌​‌​‌​‌​‌‌​​​‌​​‌‌​​​‌​​‌​‌​​​‌​‌‌‌​‌‌​​‌​‌​​‌​​‌‌‌​‌‌‌​‌​​‌​​‌​‌‌​​‌​​​‌​‌​​​‌​‌‌​​​‌‌​​‌‌​‌‌‌​‌​​‌‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.z74BzoUw4UbbQvRwIdQc7O
 */
"use client";

import { useEffect, useRef } from "react";

/* The detective-mode scan field. One fullscreen fragment shader, via
 * `ogl`.
 *
 * WHY THIS ONE IS A DEPENDENCY AND THE REST OF THE SITE IS NOT.
 *
 * Everything else in the graphic layer is a gradient, a mask or a
 * clip-path, because CSS does those perfectly and an installed
 * component that duplicates a working gradient is pure cost. See the
 * correction note at the top of §5d in globals.css — the original
 * reason given for refusing a library (a CSP with no script origin)
 * was simply false, so weight is the only argument left, and weight
 * says: pay it exactly where CSS cannot reach.
 *
 * This is that place. The field has to do three things at once that
 * are per-pixel and interdependent: a grid whose brightness varies
 * with its distance from a travelling scan band, a band that bends the
 * grid's apparent density as it passes, and a bloom that reads the
 * result rather than being painted under it. In CSS those are three
 * stacked layers that cannot see each other, which is why the fallback
 * (`.detect-grid`) can only approximate the composition and not the
 * behaviour. In a shader they are four lines that share a variable.
 *
 * WHAT IT COSTS, AND THE FIVE THINGS THAT KEEP THAT HONEST.
 *
 * One, it never runs unseen. An IntersectionObserver stops the frame
 * loop when the field scrolls off, and a visibilitychange listener
 * stops it when the tab is hidden. A background tab painting a shader
 * is the exact kind of ambient waste the rest of this site refuses.
 *
 * Two, reduced motion means it never mounts at all — not a paused
 * canvas, no WebGL context, no shader compile. The CSS grid underneath
 * is the whole experience, and it is a composition rather than a
 * placeholder, so nothing reads as missing.
 *
 * Three, failure is invisible. If the context cannot be created, or is
 * lost later, the component removes its canvas and returns. The
 * `.detect-grid` layer behind it is a sibling and is always painted,
 * so the hero degrades to the static version rather than to a hole.
 *
 * Four, DPR is capped. A hero-sized canvas at a phone's native 3x is
 * nine times the fragments for no perceptible gain on a field this
 * diffuse.
 *
 * Five, the colours come from the stylesheet, not from this file. It
 * reads --c-detect at mount and re-reads it when the theme attribute
 * changes, so the field is themed by the same tokens as everything
 * else and cannot drift from them. */

const VERT = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/* The band travels on a slight diagonal rather than straight down,
   because the cowl and the wing in this visual tradition are diagonal
   and a perfectly horizontal sweep reads as a photocopier. */
const FRAG = /* glsl */ `
  precision mediump float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec3  uDetect;
  uniform float uFade;

  /* Distance to the nearest line of a square grid, in pixels. Worked
     in pixel space so the lines stay one pixel wide at any aspect
     ratio or canvas size, which a uv-space grid does not. */
  float gridDist(vec2 p, float spacing) {
    vec2 g = abs(fract(p / spacing - 0.5) - 0.5) * spacing;
    return min(g.x, g.y);
  }

  void main() {
    vec2 p = vUv * uRes;

    /* The scan band. "axis" is a diagonal coordinate normalised so the
       band crosses the whole field regardless of its shape; the band
       is a gaussian, so it has no edges of its own to give it away.
       (No backticks in here — this is a template literal.) */
    float axis = (p.x * 0.28 + p.y * 0.96) / (uRes.x * 0.28 + uRes.y * 0.96);
    float head = fract(uTime * 0.075) * 1.4 - 0.2;

    /* Squared by multiplication, NOT by pow(). GLSL ES leaves pow(x, y)
       undefined for x < 0, and this term is negative over half the
       field — on a driver that returns NaN there the band vanishes or
       the whole field goes opaque. An integer-valued exponent does not
       make it defined; the spec is about the base. */
    float bd = (axis - head) * 7.0;
    float band = exp(-(bd * bd));

    /* The grid, brightened where the band is passing over it. The
       coupling is the point: one variable feeds the line width, the
       line brightness and the bloom, so all three move together. A
       stack of CSS layers cannot share this. */
    float d = gridDist(p, 46.0);
    float w = 0.9 + band * 1.3;
    float lines = (1.0 - smoothstep(0.0, w, d)) * (0.055 + band * 0.5);

    /* A second, coarser grid at a quarter strength gives the field a
       sense of depth without a perspective transform. */
    float d2 = gridDist(p, 184.0);
    lines += (1.0 - smoothstep(0.0, 1.1, d2)) * (0.05 + band * 0.22);

    /* Bloom off the lower left, where the signal in §5b is thrown
       from. Reads the band so the glow breathes with the sweep. */
    vec2 origin = vec2(0.12, 1.0) * uRes;
    float r = length(p - origin) / length(uRes);
    float bloom = exp(-r * 2.4) * (0.05 + band * 0.07);

    /* Phosphor scanlines, very faint, locked to device pixels. The one
       CRT reference that is a real artifact of the medium rather than
       an illustration of it — same rule as the Ben-Day screen in 5b. */
    float scan = sin(p.y * 1.6) * 0.5 + 0.5;
    float phosphor = scan * 0.012 * (0.4 + band);

    float a = (lines + bloom + phosphor) * uFade;

    /* Dies out towards the top and the right so the field has no edge
       of its own — the same feathering rule every texture in §5b
       follows, done here in the shader instead of a mask-image. */
    a *= smoothstep(0.0, 0.45, vUv.y) * (1.0 - smoothstep(0.55, 1.0, vUv.x) * 0.55);

    gl_FragColor = vec4(uDetect, clamp(a, 0.0, 1.0));
  }
`;

/** Read a hex custom property off <html> as a 0..1 rgb triple. */
function readColor(name: string, fallback: [number, number, number]) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const m = /^#?([0-9a-f]{6})$/i.exec(raw);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  ] as [number, number, number];
}

export default function ScanField({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    /* Reduced motion: never mount. Not a paused canvas — no context at
       all. The CSS field behind this is the complete experience. */
    if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let disposed = false;
    let frame = 0;
    let visible = true;
    let running = false;

    /* ogl is loaded on demand rather than imported at module scope, so
       it lands in its own chunk and a visitor who never reaches a page
       with a scan field never downloads the WebGL runtime. */
    type Disposer = () => void;
    let teardown: Disposer | null = null;

    void (async () => {
      let mod: typeof import("ogl");
      try {
        mod = await import("ogl");
      } catch {
        return; /* chunk failed: the CSS field stands in. */
      }
      if (disposed) return;

      const { Renderer, Program, Mesh, Triangle } = mod;

      let renderer: InstanceType<typeof Renderer>;
      try {
        renderer = new Renderer({
          alpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          /* Capped. See note four at the top of this file. */
          dpr: Math.min(window.devicePixelRatio || 1, 1.75),
          powerPreference: "low-power",
        });
      } catch {
        return; /* no WebGL: the CSS field stands in. */
      }

      const gl = renderer.gl;
      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.setAttribute("aria-hidden", "true");

      const detect = readColor("--c-detect", [0.44, 0.83, 1]);

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: [1, 1] },
          uDetect: { value: detect },
          uFade: { value: 0 },
        },
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      el.appendChild(canvas);

      const resize = () => {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        renderer.setSize(r.width, r.height);
        /* CSS pixels, deliberately — not gl.drawingBuffer*, which is
           CSS px times DPR. The shader works in this space, so a grid
           spacing of 46 means 46 CSS px on every display instead of 46
           device px (23 CSS px on a 2x screen, 15 on a 3x phone). The
           static `.detect-grid` fallback is specified in CSS px at 44,
           and the two have to agree: the shader is supposed to resolve
           to that composition, so a field that densifies with DPR
           would make the fallback read as a different design on
           exactly the devices most likely to see it. */
        program.uniforms.uRes.value = [r.width, r.height];
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(el);

      /* The theme can change under us. Re-read rather than recompute:
         the stylesheet owns the colour, this file only samples it. */
      const mo = new MutationObserver(() => {
        program.uniforms.uDetect.value = readColor("--c-detect", detect);
      });
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      /* A fade rather than a hard switch-on, so the field arrives like
         an overlay being enabled instead of appearing between frames. */
      const start = performance.now();

      const tick = (now: number) => {
        if (disposed) return;
        frame = requestAnimationFrame(tick);
        const t = (now - start) / 1000;
        program.uniforms.uTime.value = t;
        program.uniforms.uFade.value = Math.min(t / 1.2, 1);
        renderer.render({ scene: mesh });
      };

      const run = () => {
        if (running || disposed || !visible) return;
        running = true;
        frame = requestAnimationFrame(tick);
      };
      const halt = () => {
        running = false;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      };

      /* Note one: never runs unseen. */
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visible = entry.isIntersecting;
            if (visible) run();
            else halt();
          }
        },
        { threshold: 0 }
      );
      io.observe(el);

      const onVisibility = () => {
        if (document.hidden) halt();
        else run();
      };
      document.addEventListener("visibilitychange", onVisibility);

      /* Note three: a context lost mid-session degrades to the CSS
         field rather than freezing on the last frame. */
      const onLost = (e: Event) => {
        e.preventDefault();
        halt();
        canvas.remove();
      };
      canvas.addEventListener("webglcontextlost", onLost);

      teardown = () => {
        halt();
        io.disconnect();
        ro.disconnect();
        mo.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.removeEventListener("webglcontextlost", onLost);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        canvas.remove();
      };
    })();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  /* The CSS field is a sibling and is always rendered. It is the
     no-script, reduced-motion, no-WebGL and context-lost path all at
     once, which is why it is a real composition rather than a solid
     colour. */
  return (
    <div className={`scanfield ${className}`} aria-hidden="true">
      <div className="absolute inset-0 detect-grid" />
      <div ref={host} className="absolute inset-0" />
    </div>
  );
}
