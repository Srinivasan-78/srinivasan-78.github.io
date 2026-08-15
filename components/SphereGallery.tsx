"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import type * as T from "three";
import { PROJECTS, CATEGORIES, type Project } from "@/lib/projects";

/* A gallery on the inside of a sphere.

   The camera sits at the origin and never moves. Every card is a patch
   of the sphere's surface built directly in spherical coordinates, so
   the cards are genuinely curved rather than flat quads faked into a
   ring — that curvature is the whole look. Dragging rotates the world
   group around the stationary camera.

   Card faces are canvas textures, not DOM. CSS3DRenderer would give
   crisper text, but it can't bend an element across a sphere patch, and
   the bend is the point. Canvas also means one draw call per card.

   Motion is deliberately two-stage: pointer input writes to a *target*
   angle, and the render loop lerps the live angle toward it at a fixed
   rate. That's the same shape as Lenis's `lerp` scrolling used
   elsewhere on the site, so the drag feels like the rest of the page
   rather than like a separate toy. Throw velocity decays into the same
   target, so a flick and a drag resolve through one code path. */

/* Latitude bands covering the whole sphere, pole to pole. */
const LAT_STEP = 30; // degrees between rows
const ROW_LAT = [-75, -45, -15, 15, 45, 75];
const COLS_EQ = 12; // columns on the bands nearest the equator
const RADIUS = 1000;
const ROW_OFFSET = 5;
const CARD_PX = 640;
/* Far enough to bring a pole band to centre without taking the XYZ
   Euler anywhere near the ±90° singularity. */
const PITCH_LIMIT = (75 * Math.PI) / 180;
const LERP = 0.09;
/* Leaves a hairline gutter between neighbouring cards, like the
   reference's grid rules. */
const GUTTER = 0.92;

const rad = (d: number) => (d * Math.PI) / 180;

/* A band at latitude φ has circumference 2πR·cos(φ), so holding the
   column count fixed would squash every card toward the poles by
   cos(φ) — which is exactly what made the cards look non-square. Drop
   columns proportionally instead and the arc width per card stays
   equal to the arc height, so cards read square at every latitude and
   curve on all four edges. */
const colsAt = (latDeg: number) =>
  Math.max(3, Math.round(COLS_EQ * Math.cos(rad(latDeg))));

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function drawCover(
  x: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const r = Math.max(dw / img.width, dh / img.height);
  const w = img.width * r;
  const h = img.height * r;
  x.save();
  x.beginPath();
  x.rect(dx, dy, dw, dh);
  x.clip();
  x.drawImage(img, dx + (dw - w) / 2, dy + (dh - h) / 2, w, h);
  x.restore();
}

function wrap(
  x: CanvasRenderingContext2D,
  text: string,
  left: number,
  top: number,
  maxW: number,
  lineH: number,
  maxLines: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (x.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else line = t;
  }
  if (lines.length < maxLines && line) lines.push(line);
  lines.slice(0, maxLines).forEach((l, i) => x.fillText(l, left, top + i * lineH));
}

function drawCard(p: Project, img: HTMLImageElement | null, mono: string, display: string) {
  const c = document.createElement("canvas");
  c.width = CARD_PX;
  c.height = CARD_PX;
  const x = c.getContext("2d")!;

  x.fillStyle = "#08090b";
  x.fillRect(0, 0, 640, 640);
  x.strokeStyle = "rgba(255,255,255,0.10)";
  x.lineWidth = 2;
  x.strokeRect(1, 1, 638, 638);

  x.textBaseline = "middle";

  // Top meta row — client left, category right, mirroring the reference.
  x.font = `500 19px ${mono}`;
  x.fillStyle = "rgba(240,240,235,0.85)";
  x.fillText(p.client.toUpperCase(), 44, 46);
  x.textAlign = "right";
  x.fillStyle = "rgba(240,240,235,0.40)";
  x.fillText(p.category.toUpperCase(), 596, 46);
  x.textAlign = "left";

  // Artwork — the dominant element now that the cell reads square.
  const ix = 44,
    iy = 74,
    iw = 552,
    ih = 380;
  if (img && img.complete && img.naturalWidth) drawCover(x, img, ix, iy, iw, ih);
  else {
    x.fillStyle = "#14161a";
    x.fillRect(ix, iy, iw, ih);
  }
  x.strokeStyle = "rgba(255,255,255,0.14)";
  x.lineWidth = 2;
  x.strokeRect(ix, iy, iw, ih);

  // Title
  x.fillStyle = "#f4f2ec";
  x.font = `500 33px ${display}`;
  wrap(x, p.title, 44, 496, 552, 38, 2);

  // Tag pills
  x.font = `400 16px ${mono}`;
  let tx = 44;
  for (const t of p.tags) {
    const label = t.toUpperCase();
    const w = x.measureText(label).width + 26;
    x.strokeStyle = "rgba(255,255,255,0.18)";
    x.lineWidth = 2;
    x.strokeRect(tx, 576, w, 34);
    x.fillStyle = "rgba(240,240,235,0.62)";
    x.fillText(label, tx + 13, 594);
    tx += w + 10;
  }

  // Status, right-aligned like the reference's year
  x.textAlign = "right";
  x.fillStyle = "rgba(240,240,235,0.40)";
  x.fillText(p.status.toUpperCase(), 596, 594);
  x.textAlign = "left";

  return c;
}

export default function SphereGallery() {
  const hostRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [mode, setMode] = useState<"sphere" | "list">("sphere");
  const [filter, setFilter] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [hovered, setHovered] = useState<Project | null>(null);
  const [supported, setSupported] = useState(true);

  // Live handles the render loop reads without re-running the effect.
  const filterRef = useRef<string | null>(null);
  filterRef.current = filter;
  const applyRef = useRef<(f: string | null) => void>(() => {});

  useEffect(() => {
    if (mode !== "sphere") return;
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("list");
      return;
    }

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const mod = await import("three").catch(() => null);
      if (!mod) {
        setSupported(false);
        return;
      }
      // Annotated rather than narrowed: `patch` below is a hoisted
      // function declaration, and TS won't carry a narrowing into one.
      const THREE: typeof import("three") = mod;
      if (disposed) return;

      const mono = cssVar("--font-mono", "ui-monospace, monospace");
      const display = cssVar("--font-display", "Helvetica, Arial, sans-serif");
      if (document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          /* fonts are cosmetic here — never block the scene on them */
        }
      }
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        72,
        host.clientWidth / host.clientHeight,
        1,
        4000
      );
      const world = new THREE.Group();
      scene.add(world);

      /* One texture per project, reused across every slot that shows it.
         Filtering swaps which texture a slot points at, so the sphere
         re-fills instead of developing holes. */
      const textures: T.CanvasTexture[] = PROJECTS.map((p) => {
        const tex = new THREE.CanvasTexture(drawCard(p, null, mono, display));
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        /* Prefer the stock photo pulled down by `npm run images`, but
           never depend on it — fall back to the repo's own art so the
           gallery is never blank on a fresh clone. Same-origin either
           way, which matters: a cross-origin image would taint the
           canvas and WebGL would refuse the texture upload. */
        const img = new Image();
        let usedFallback = false;
        img.onload = () => {
          const c = drawCard(p, img, mono, display);
          tex.image = c;
          tex.needsUpdate = true;
        };
        img.onerror = () => {
          if (usedFallback) return;
          usedFallback = true;
          img.src = p.image;
        };
        img.src = `/images/projects/${p.slug}.jpg`;
        return tex;
      });

      const dPhi = rad(LAT_STEP) * GUTTER;

      function patch(t0: number, p0: number, dTheta: number) {
        const N = 14,
          M = 14;
        const pos: number[] = [],
          uv: number[] = [],
          idx: number[] = [];
        for (let v = 0; v <= M; v++)
          for (let u = 0; u <= N; u++) {
            const th = t0 + (u / N - 0.5) * dTheta;
            const ph = p0 + (v / M - 0.5) * dPhi;
            pos.push(
              RADIUS * Math.sin(th) * Math.cos(ph),
              RADIUS * Math.sin(ph),
              -RADIUS * Math.cos(th) * Math.cos(ph)
            );
            uv.push(u / N, v / M);
          }
        for (let v = 0; v < M; v++)
          for (let u = 0; u < N; u++) {
            const a = v * (N + 1) + u;
            idx.push(a, a + N + 1, a + 1, a + 1, a + N + 1, a + N + 2);
          }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        g.setIndex(idx);
        return g;
      }

      type Slot = {
        mesh: T.Mesh;
        mat: T.MeshBasicMaterial;
        center: T.Vector3;
        project: Project;
        hover: number;
        base: number;
        row: number;
        col: number;
      };
      const slots: Slot[] = [];

      ROW_LAT.forEach((lat, r) => {
        const p0 = rad(lat);
        const cols = colsAt(lat);
        const colStep = (Math.PI * 2) / cols;
        const dTheta = colStep * GUTTER;
        /* Odd bands are rotated half a cell so the seams don't stack
           into a visible vertical line running up the sphere. */
        const shift = r % 2 ? colStep / 2 : 0;
        for (let c = 0; c < cols; c++) {
          const t0 = colStep * c + shift;
          const mat = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
          });
          const mesh = new THREE.Mesh(patch(t0, p0, dTheta), mat);
          mesh.renderOrder = 1;
          world.add(mesh);
          slots.push({
            mesh,
            mat,
            center: new THREE.Vector3(
              Math.sin(t0) * Math.cos(p0),
              Math.sin(p0),
              -Math.cos(t0) * Math.cos(p0)
            ),
            project: PROJECTS[0],
            hover: 0,
            base: 1,
            row: r,
            col: c,
          });
        }
      });

      /* Assignment is recomputed rather than toggled: a filtered set of
         n projects tiles every slot, so the sphere always looks full
         instead of developing holes. */
      function assign(f: string | null) {
        const pool = f ? PROJECTS.filter((p) => p.client === f) : PROJECTS;
        const list = pool.length ? pool : PROJECTS;
        slots.forEach((s) => {
          const p = list[(s.col + s.row * ROW_OFFSET) % list.length];
          s.project = p;
          s.mat.map = textures[PROJECTS.indexOf(p)];
          s.mat.needsUpdate = true;
        });
      }
      assign(filterRef.current);
      applyRef.current = assign;

      // ---- input -------------------------------------------------
      let yaw = 0,
        pitch = 0,
        tYaw = 0,
        tPitch = 0,
        vYaw = 0,
        vPitch = 0;
      let dragging = false,
        moved = 0,
        lastX = 0,
        lastY = 0;
      let leaving = false;
      const ndc = new THREE.Vector2(-2, -2);
      const ray = new THREE.Raycaster();
      const tmp = new THREE.Vector3();
      let hoverSlot: Slot | null = null;

      const el = renderer.domElement;
      el.style.touchAction = "none";

      const setNdc = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      };

      const onDown = (e: PointerEvent) => {
        if (leaving) return;
        dragging = true;
        moved = 0;
        lastX = e.clientX;
        lastY = e.clientY;
        vYaw = vPitch = 0;
        el.setPointerCapture(e.pointerId);
        el.style.cursor = "grabbing";
      };

      const onMove = (e: PointerEvent) => {
        setNdc(e);
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        moved += Math.abs(dx) + Math.abs(dy);
        vYaw = -dx * 0.0022;
        vPitch = -dy * 0.0022;
        tYaw += vYaw;
        tPitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, tPitch + vPitch));
      };

      const onUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        el.style.cursor = "grab";
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* pointer already gone */
        }
        // A tap, not a drag — 6px of slop covers trackpad jitter.
        if (moved < 6 && hoverSlot) open(hoverSlot);
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        tYaw += e.deltaX * 0.0016;
        tPitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, tPitch + e.deltaY * 0.0016));
      };

      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      el.addEventListener("wheel", onWheel, { passive: false });
      el.style.cursor = "grab";

      // ---- open transition ---------------------------------------
      function open(slot: Slot) {
        if (leaving) return;
        leaving = true;
        el.style.cursor = "default";

        /* Rotate the clicked card to dead centre first, then rush it at
           the camera. Shrinking the mesh scale pulls it *down* the
           radius toward the origin, so it grows on screen — no camera
           move required, which keeps every other card's perspective
           honest while it happens. */
        const c = slot.center;
        // world.rotation is Euler XYZ, so v' = Rx(pitch)·Ry(yaw)·v.
        // Solving Rx·Ry·centre = (0,0,-1) gives yaw = +longitude and
        // pitch = -latitude. The sign on yaw is easy to get backwards.
        const targetYaw = Math.atan2(c.x, -c.z);
        const targetPitch = -Math.asin(Math.max(-1, Math.min(1, c.y)));

        const spin = { y: tYaw, p: tPitch };
        // Take the short way round rather than unwinding accumulated turns.
        const turns = Math.round((tYaw - targetYaw) / (Math.PI * 2));
        const endYaw = targetYaw + turns * Math.PI * 2;

        gsap.killTweensOf(spin);
        gsap
          .timeline()
          .to(spin, {
            y: endYaw,
            p: targetPitch,
            duration: 0.75,
            ease: "power3.inOut",
            onUpdate: () => {
              tYaw = spin.y;
              tPitch = spin.p;
            },
          })
          .to(slot.mesh.scale, { x: 0.3, y: 0.3, z: 0.3, duration: 0.75, ease: "power3.in" }, 0.35)
          .to(
            slots.filter((s) => s !== slot).map((s) => s.mat),
            { opacity: 0, duration: 0.5, ease: "power2.in" },
            0.35
          )
          .to(
            veilRef.current,
            {
              opacity: 1,
              duration: 0.35,
              ease: "power2.in",
              onComplete: () => router.push(`/projects/${slot.project.slug}`),
            },
            0.85
          );
      }

      // ---- loop --------------------------------------------------
      const tick = () => {
        if (!dragging && !leaving) {
          tYaw += vYaw;
          tPitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, tPitch + vPitch));
          vYaw *= 0.94;
          vPitch *= 0.94;
          if (Math.abs(vYaw) < 1e-5) vYaw = 0;
          if (Math.abs(vPitch) < 1e-5) vPitch = 0;
        }
        yaw += (tYaw - yaw) * LERP;
        pitch += (tPitch - pitch) * LERP;
        world.rotation.set(pitch, yaw, 0);
        world.updateMatrixWorld();

        if (!leaving) {
          ray.setFromCamera(ndc, camera);
          const hit = ray.intersectObjects(world.children, false)[0];
          const found = hit ? slots.find((s) => s.mesh === hit.object) || null : null;
          if (found !== hoverSlot) {
            hoverSlot = found;
            setHovered(found ? found.project : null);
            el.style.cursor = dragging ? "grabbing" : found ? "pointer" : "grab";
          }
        }

        for (const s of slots) {
          tmp.copy(s.center).applyQuaternion(world.quaternion);
          const facing = -tmp.z; // dot with the camera's forward axis
          s.mesh.visible = facing > 0.02;
          if (!s.mesh.visible) continue;
          // Edge cards fall off in brightness — that vignette is what
          // sells the enclosure. Squared so the falloff is not linear.
          const t = Math.max(0, Math.min(1, (facing - 0.2) / 0.6));
          const target = 0.26 + 0.74 * t * t;
          const want = s === hoverSlot ? 1 : 0;
          s.hover += (want - s.hover) * 0.14;
          s.base += (target - s.base) * 0.2;
          const lift = 1 - s.hover * 0.045;
          s.mesh.scale.setScalar(leaving && s === hoverSlot ? s.mesh.scale.x : lift);
          s.mat.color.setScalar(Math.min(1, s.base + s.hover * 0.45));
        }

        renderer.render(scene, camera);
      };
      gsap.ticker.add(tick);

      const onResize = () => {
        if (!host.clientWidth) return;
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", onResize);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        el.removeEventListener("wheel", onWheel);
        slots.forEach((s) => {
          s.mesh.geometry.dispose();
          s.mat.dispose();
        });
        textures.forEach((t) => t.dispose());
        renderer.dispose();
        el.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [mode, router]);

  // Filtering must not tear down the scene — push it in through the ref.
  useEffect(() => {
    applyRef.current(filter);
  }, [filter]);

  // Sphere mode owns the viewport; list mode gives the page back.
  useEffect(() => {
    if (mode !== "sphere") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mode]);

  if (!supported && mode === "sphere") {
    return <ProjectList onSphere={null} />;
  }

  return (
    <div className={mode === "sphere" ? "sph-root" : undefined}>
      {mode === "sphere" ? (
        <div className="sph-stage">
          <div ref={hostRef} className="sph-canvas" />
          <div ref={veilRef} className="sph-veil" />

          <div className="sph-hint micro">
            Drag to look around · click a card to open
          </div>

          <div className="sph-readout">
            <span className="micro micro-bright">
              {hovered ? hovered.title : `${PROJECTS.length} public repositories`}
            </span>
            <span className="micro">{hovered ? hovered.teaser : "Srinivasan Vijayaraghavan"}</span>
          </div>

          <div className="sph-dock">
            <button type="button" className="sph-pill is-on">
              Sphere
            </button>
            <button type="button" className="sph-pill" onClick={() => setMode("list")}>
              List
            </button>
          </div>

          <div className="sph-filter">
            <button
              type="button"
              className="sph-round"
              onClick={() => setFilterOpen((o) => !o)}
              aria-expanded={filterOpen}
            >
              {filter ?? "Filter"}
            </button>
            {filterOpen && (
              <div className="sph-filter-menu">
                <button
                  type="button"
                  className={!filter ? "is-on" : undefined}
                  onClick={() => {
                    setFilter(null);
                    setFilterOpen(false);
                  }}
                >
                  All work
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={filter === c ? "is-on" : undefined}
                    onClick={() => {
                      setFilter(c);
                      setFilterOpen(false);
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <ProjectList onSphere={() => setMode("sphere")} />
      )}
    </div>
  );
}

function ProjectList({ onSphere }: { onSphere: (() => void) | null }) {
  return (
    <main className="wrap" style={{ padding: "2.5rem 24px" }}>
      <span className="eyebrow c-sage">Projects</span>
      <h1 className="display display-lg" style={{ margin: "0.4rem 0 0.5rem" }}>
        Things I build outside work
      </h1>
      <div className="micro-row">
        <span className="micro micro-bright">{PROJECTS.length} public repositories</span>
        {onSphere && (
          <button type="button" className="sph-pill" onClick={onSphere}>
            Back to sphere
          </button>
        )}
      </div>
      <div className="proj-list">
        {PROJECTS.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="card" data-cursor-hover>
            <span className="eyebrow">{p.client}</span>
            <h2 className="post-title">{p.title}</h2>
            <p className="proj-teaser">{p.teaser}</p>
            <span className="go">Read more →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
