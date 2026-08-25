"use client";

/* React Bits <Strands />, ported to TypeScript.

   Upstream logic kept intact: the same two shaders, the same uniform
   set, the same per-frame prop read out of a ref so a prop change never
   costs a React render.

   Three additions, all of them about a WebGL canvas living inside a
   button that sits on every page of the site rather than inside a demo:

   * prefers-reduced-motion. The strands are continuous ambient motion
     with no start and no end, which is the exact case the setting is
     for. The loop stops and the last frame stays — the colour is
     decoration either way, so there is nothing to fall back to.

   * The loop stops when the canvas is off screen, when the tab is
     hidden, and — with `playOnHover` — whenever the pointer is not on
     the control. A requestAnimationFrame chain driving a fragment
     shader does not get cheaper for being invisible, and this one is
     mounted for the whole session. Paused time is subtracted from the
     clock the shader reads, so resuming continues the motion rather
     than jumping to wherever the phase would have drifted to.

   * Size comes from a ResizeObserver, not from `window.resize`. The
     launcher changes width when its label changes — "Ask about me" to
     "Close" — and the window does not resize when it does. */

import { Renderer, Program, Mesh, Color, Triangle, RenderTarget } from "ogl";
import { useEffect, useRef, type CSSProperties } from "react";

import "./Strands.css";

const MAX_STRANDS = 12;
const MAX_COLORS = 8;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(2.0 * PI * (t + vec3(0.00, 0.33, 0.67)));
}

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}

vec3 strandColor(float t) {
  if (uColorCount > 0) return samplePalette(t);
  return spectrum(t);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);

  float e = 0.06 + uIntensity * 0.94;
  float env = pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper);

  vec3 col = vec3(0.0);

  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;

    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;

    float tt = uTime * uSpeed;
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;

    float amp = (0.1 + 0.02 * e) * env * uAmplitude;
    float y = w * amp;

    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;

    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += strandColor(h) * g * env;
  }

  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);

  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;

  fragColor = vec4(col * uOpacity, alpha);
}
`;

const GLASS_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform vec2 uResolution;
uniform float uRadius;
uniform float uRefraction;
uniform float uDispersion;

out vec4 fragColor;

vec2 toUv(vec2 p) {
  return p * (uResolution.y / uResolution) + 0.5;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  float d = length(p);
  float r = uRadius;

  float edge = fwidth(d) * 1.5;
  float mask = 1.0 - smoothstep(r - edge, r + edge, d);
  if (mask <= 0.0) {
    fragColor = vec4(0.0);
    return;
  }

  // sphere height: 0 at the rim, 1 at the center
  float z = sqrt(max(r * r - d * d, 0.0)) / r;
  float nd = d / r; // 0 at the center, 1 at the rim

  // refraction is confined to a narrow band near the rim; the rest stays undistorted
  vec2 dir = d > 0.0 ? p / d : vec2(0.0);
  float lens = smoothstep(0.85, 1.0, nd) * pow(nd, 6.0);
  vec2 offset = -dir * lens * uRefraction * 0.15;
  vec2 disp = -dir * lens * uDispersion * 0.012;

  vec3 light;
  light.r = texture(uScene, toUv(p + offset - disp)).r;
  light.g = texture(uScene, toUv(p + offset)).g;
  light.b = texture(uScene, toUv(p + offset + disp)).b;

  // neutral fresnel rim (no color tint so the glass stays clear)
  float fres = pow(1.0 - z, 3.0);
  vec3 rim = vec3(1.0) * fres * 0.18;

  // specular highlight from the upper-left
  vec2 lightDir = normalize(vec2(-0.55, 0.6));
  float spec = pow(max(dot(p / max(r, 1e-4), lightDir), 0.0), 6.0);
  spec *= smoothstep(r, r * 0.55, d);

  vec3 emissive = light + rim + vec3(spec) * 0.4;
  float emissiveA = clamp(max(max(emissive.r, emissive.g), emissive.b), 0.0, 1.0);

  // almost clear glass body: only a faint neutral darkening, mostly near the rim
  float bodyA = 0.05 + fres * 0.05;

  // composite emissive light over the clear body (premultiplied)
  float outA = emissiveA + bodyA * (1.0 - emissiveA);
  vec3 outRGB = emissive;

  outRGB *= mask;
  outA *= mask;

  fragColor = vec4(outRGB, outA);
}
`;

function buildPalette(colors: string[]): [number, number, number][] {
  const filled = colors && colors.length ? colors : ["#ffffff"];
  const padded: [number, number, number][] = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    const hex = filled[i] ?? filled[filled.length - 1];
    const c = new Color(hex);
    padded.push([c.r, c.g, c.b]);
  }
  return padded;
}

export type StrandsProps = {
  /** Palette cycled across the strands. Empty array uses the built-in spectrum. */
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  hueShift?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  /** Renders the strands inside a refractive glass ball. */
  glass?: boolean;
  refraction?: number;
  dispersion?: number;
  glassSize?: number;
  /**
   * Run only while the pointer is over (or focus is inside) the parent
   * element; hold a still frame otherwise. For a strand that lives
   * behind a persistent control rather than in a hero.
   */
  playOnHover?: boolean;
  className?: string;
  style?: CSSProperties;
};

export default function Strands({
  colors = ["#FF4242", "#7C3AED", "#06B6D4", "#EAB308"],
  count = 3,
  speed = 0.5,
  amplitude = 1,
  waviness = 1,
  thickness = 0.7,
  glow = 2.6,
  taper = 3,
  spread = 1,
  hueShift = 0,
  intensity = 0.6,
  saturation = 1.5,
  opacity = 1,
  scale = 1.5,
  glass = false,
  refraction = 1,
  dispersion = 1,
  glassSize = 1,
  playOnHover = false,
  className = "",
  style,
}: StrandsProps) {
  const propsRef = useRef({
    colors,
    count,
    speed,
    amplitude,
    waviness,
    thickness,
    glow,
    taper,
    spread,
    hueShift,
    intensity,
    saturation,
    opacity,
    scale,
    glass,
    refraction,
    dispersion,
    glassSize,
  });
  propsRef.current = {
    colors,
    count,
    speed,
    amplitude,
    waviness,
    thickness,
    glow,
    taper,
    spread,
    hueShift,
    intensity,
    saturation,
    opacity,
    scale,
    glass,
    refraction,
    dispersion,
    glassSize,
  };

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    /* Everything below is inside a try. A WebGL context is not something
       a page is entitled to: a browser caps how many can exist at once,
       a GPU reset takes them away, and a driver can simply refuse. This
       component is decoration behind a label — when it cannot draw, the
       correct outcome is an empty div, not an exception climbing into
       the nearest error boundary and replacing the page around it.

       That is not hypothetical here: /contact already runs a three.js
       scene, and asking for the second context is exactly where this
       fails first. */
    try {
      return mount(ctn);
    } catch {
      return;
    }

    function mount(ctn: HTMLDivElement) {
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    /* A container that has not been laid out yet reports 0, and a
       RenderTarget sized 0 is a GL error rather than an empty texture.
       One is the smallest size that is not that. */
    const measure = () => ({
      width: Math.max(ctn.offsetWidth, 1),
      height: Math.max(ctn.offsetHeight, 1),
    });
    const first = measure();

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [first.width, first.height] },
        uColors: { value: buildPalette(propsRef.current.colors) },
        uColorCount: { value: Math.min(propsRef.current.colors.length, MAX_COLORS) },
        uStrandCount: { value: Math.min(propsRef.current.count, MAX_STRANDS) },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uWaviness: { value: waviness },
        uThickness: { value: thickness },
        uGlow: { value: glow },
        uTaper: { value: taper },
        uSpread: { value: spread },
        uHueShift: { value: hueShift },
        uIntensity: { value: intensity },
        uOpacity: { value: opacity },
        uScale: { value: scale },
        uSaturation: { value: saturation },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const renderTarget = new RenderTarget(gl, {
      width: first.width,
      height: first.height,
    });

    const glassProgram = new Program(gl, {
      vertex: VERT,
      fragment: GLASS_FRAG,
      uniforms: {
        uScene: { value: renderTarget.texture },
        uResolution: { value: [first.width, first.height] },
        uRadius: { value: 0.46 * glassSize },
        uRefraction: { value: refraction },
        uDispersion: { value: dispersion },
      },
    });
    const glassMesh = new Mesh(gl, { geometry, program: glassProgram });

    ctn.appendChild(gl.canvas);

    function resize() {
      const { width, height } = measure();
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
      renderTarget.setSize(width, height);
      glassProgram.uniforms.uResolution.value = [width, height];
    }
    const ro = new ResizeObserver(resize);
    ro.observe(ctn);
    resize();

    /* One frame, drawn on demand. Used both by the loop and by the
       paths that have to leave something on screen without starting
       one — reduced motion, and the last frame before the loop stops. */
    const draw = (t: number) => {
      const current = propsRef.current;
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uColors.value = buildPalette(current.colors);
      program.uniforms.uColorCount.value = Math.min(current.colors.length, MAX_COLORS);
      program.uniforms.uStrandCount.value = Math.min(
        Math.max(Math.round(current.count), 1),
        MAX_STRANDS,
      );
      program.uniforms.uSpeed.value = current.speed;
      program.uniforms.uAmplitude.value = current.amplitude;
      program.uniforms.uWaviness.value = current.waviness;
      program.uniforms.uThickness.value = current.thickness;
      program.uniforms.uGlow.value = current.glow;
      program.uniforms.uTaper.value = current.taper;
      program.uniforms.uSpread.value = current.spread;
      program.uniforms.uHueShift.value = current.hueShift;
      program.uniforms.uIntensity.value = current.intensity;
      program.uniforms.uOpacity.value = current.opacity;
      program.uniforms.uScale.value = current.scale;
      program.uniforms.uSaturation.value = current.saturation;

      if (current.glass) {
        renderer.render({ scene: mesh, target: renderTarget });
        glassProgram.uniforms.uScene.value = renderTarget.texture;
        glassProgram.uniforms.uRefraction.value = current.refraction;
        glassProgram.uniforms.uDispersion.value = current.dispersion;
        glassProgram.uniforms.uRadius.value = 0.46 * current.glassSize;
        renderer.render({ scene: glassMesh });
      } else {
        renderer.render({ scene: mesh });
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let animateId = 0;
    let running = false;
    let visible = true;
    let hovered = !playOnHover;

    /* The shader's clock, less whatever time it spent paused. Without
       this, a strand that stops for ten seconds resumes ten seconds
       further along its phase, which reads as a jump at the exact
       moment the pointer arrives. */
    let lastT = 0;
    let stoppedAt = 0;
    let offset = 0;

    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      if (stoppedAt !== 0) {
        offset += t - stoppedAt;
        stoppedAt = 0;
      }
      lastT = t;
      draw(t - offset);
    };
    const start = () => {
      if (running) return;
      running = true;
      animateId = requestAnimationFrame(update);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      stoppedAt = lastT;
      cancelAnimationFrame(animateId);
    };
    /* Whether the loop should be running is three conditions ANDed
       together, and each of them changes from its own event. Deciding
       it in one place is what keeps a tab-visibility change from
       restarting a loop that an off-screen canvas had just stopped. */
    const sync = () => {
      if (visible && hovered && !document.hidden && !reduced.matches) start();
      else stop();
    };

    const io = new IntersectionObserver(entries => {
      visible = entries.some(e => e.isIntersecting);
      sync();
    });
    io.observe(ctn);

    const onReduced = () => {
      sync();
      // Reduced motion still gets a picture, just not a moving one.
      if (reduced.matches) draw(0);
    };
    reduced.addEventListener("change", onReduced);
    document.addEventListener("visibilitychange", sync);

    /* The host is the parent, not the canvas: the canvas is
       `pointer-events: none` so it can sit under a label, which means it
       never sees a pointer of its own. Focus counts as well — a keyboard
       user reaching the control gets the same answer a pointer does. */
    const host = ctn.parentElement;
    const onEnter = () => {
      hovered = true;
      sync();
    };
    const onLeave = () => {
      hovered = false;
      sync();
    };
    if (playOnHover && host) {
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("focusin", onEnter);
      host.addEventListener("focusout", onLeave);
    }

    draw(0);
    sync();

    /* A lost context is a normal event — a backgrounded tab on a phone
       is enough to cause one. Stop the loop and leave the canvas as it
       is; drawing into a dead context is what turns a recoverable blip
       into a throw. */
    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    gl.canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      stop();
      gl.canvas.removeEventListener("webglcontextlost", onContextLost);
      io.disconnect();
      ro.disconnect();
      reduced.removeEventListener("change", onReduced);
      document.removeEventListener("visibilitychange", sync);
      if (playOnHover && host) {
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("pointerleave", onLeave);
        host.removeEventListener("focusin", onEnter);
        host.removeEventListener("focusout", onLeave);
      }
      if (gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ctnDom} className={`strands-container ${className}`.trim()} style={style} />;
}
