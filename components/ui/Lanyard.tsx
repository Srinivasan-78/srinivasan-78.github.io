/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​‌​‌​‌‌​​‌‌​​‌‌​​​‌‌​‌‌​​‌​​​‌​​​​‌​​‌‌‌‌​​​​‌​​‌‌​​​‌​‌​‌​‌​‌‌​​​​‌​‌​​‌‌‌​​‌‌​‌‌‌​​‌‌‌​​​​​‌​​​‌‌​​‌‌‌​​​​​‌‌​​​​‌​‌‌‌‌​​‌​‌‌​‌​​‌​‌‌‌​‌​‌​‌​‌​‌​​​‌​‌‌‌‌‌​‌​​​‌‌‌​‌‌​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.5fcdBxLUaNnpFpayiuT_Gm
 */
/* eslint-disable react/no-unknown-property */
"use client";

/* React Bits <Lanyard />, ported to TypeScript and to Next's static
   asset pipeline.

   The rope, the joints, the drag handling, the band geometry and the
   front/back texture compositing are upstream's, unchanged. What is
   adapted:

   * Assets. Upstream imports card.glb and lanyard.png through the
     bundler, which needs `assetsInclude` in a Vite config. This build is
     Next with `output: "export"`, so both files live in /public and are
     loaded by URL. Nothing has to be taught about .glb.

   * Suspense. useGLTF and useTexture suspend. Upstream leaves the
     boundary to the host app; here one sits inside the Canvas so a
     slow model cannot blank the page around it.

   * Nothing renders on the server: the module is only ever reached
     through the client-only wrapper in LanyardScene.tsx. */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import "./Lanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

/* 0.69 MB, down from 2.34. The model itself is only ~160 KB of it — the
   rest was a 1678x1677 RGBA PNG baked into the binary chunk, and the
   material that samples it is alphaMode OPAQUE, so the renderer was
   discarding that alpha channel anyway. It is stored as JPEG now, at the
   same pixel dimensions: nothing about the card looks different, because
   the only part of this atlas that reaches the screen is the card's edges
   and its unprinted ground — both faces are drawn over it from the SVGs in
   `cardMap` below. */
const CARD_GLB = "/assets/lanyard/card.glb";
const BAND_TEXTURE = "/assets/lanyard/lanyard.png";

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export type LanyardProps = {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
  /** Tint multiplied into the band texture. Upstream is always white. */
  lanyardColor?: string;
  /** Accessible description of the object the canvas draws. */
  ariaLabel?: string;
};

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  lanyardColor = "white",
  ariaLabel = "Draggable 3D badge on a lanyard",
}: LanyardProps) {
  /* The `isMobile` switch that used to live here is gone. It keyed off
     `window.innerWidth < 768` — a breakpoint that appears nowhere else
     in this codebase — and dropped dpr, physics rate, clearcoat and
     curve resolution on a phone. LanyardScene now refuses to mount this
     component at all below 721px or on a coarse pointer, so every one of
     those branches was dead: the quality knobs are simply set to the
     values a pointer device was always getting. */
  return (
    <div className="lanyard-wrapper" role="img" aria-label={ariaLabel}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={1 / 60}>
            <Band
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              lanyardColor={lanyardColor}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

type BandProps = {
  maxSpeed?: number;
  minSpeed?: number;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
  lanyardColor?: string;
};

type CardGLTF = {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  lanyardColor = "white",
}: BandProps) {
  /* `resolution` is upstream's 1000x1000 replaced by the real canvas size.
     Worth being precise about what this does, because it is easy to
     assume it is the pixel-width divisor and it is not: meshline only
     uses `resolution` that way under `sizeAttenuation: 0`, and the
     default is 1, so that branch is compiled out here. What survives is
     `aspect = resolution.x / resolution.y`, which is applied uniformly to
     the clip position and therefore cancels under the perspective divide
     for everything except the ribbon's width.

     So this is a correctness fix to the ribbon's perpendicular, not a
     visibility fix — the cord rendered fine before, and A/B screenshots
     of both values confirm it. The gain is that the aspect is now true
     at any canvas shape and follows a resize, rather than being right
     only when the canvas happens to be square. Practical effect at this
     size is about 12% on the cord's width.

     Selector form, not bare `useThree()`: the identity selector compares
     against the whole store object, which is replaced on every `set()`,
     so `Band` would re-render on `setDpr`, `setEvents` and any
     `performance.regress()` as well as on resize. */
  const size = useThree((s) => s.size);
  const band = useRef<THREE.Mesh & { geometry: MeshLineGeometry }>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody & { lerped?: THREE.Vector3 }>(null);
  const j2 = useRef<RapierRigidBody & { lerped?: THREE.Vector3 }>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(CARD_GLB) as unknown as CardGLTF;
  const texture = useTexture(lanyardImage || BAND_TEXTURE);
  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Composite the front/back images into the card's texture atlas (front = left
  // half, back = right half). Each image is drawn aspect-preserving (no stretch).
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage) return baseMap;
    if (!baseMap) return baseMap;

    const baseImg = baseMap.image as HTMLImageElement;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return baseMap;
    // Keep the original baked atlas for the card edges and any untouched face.
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: HTMLImageElement, rect: { x: number; y: number; w: number; h: number }) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === "contain" ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image as HTMLImageElement, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image as HTMLImageElement, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  // A composited atlas is a texture this component owns, so it is this
  // component's job to release it. Upstream leaks one per unmount.
  useEffect(() => {
    const owned = cardMap !== materials.base.map ? cardMap : null;
    return () => {
      owned?.dispose();
    };
  }, [cardMap, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  /* The release guard, on the window rather than on the mesh.
     `onPointerUp` above only fires when the pointer is still ours at the
     end of the gesture. A drag the browser takes back never gets there:
     `touch-action: pan-y` on the wrapper says a vertical swipe belongs
     to the page, so the first such move raises `pointercancel`, and r3f
     answers that by calling cancelPointer — which fires onPointerOut and
     never synthesises an up.

     Left unhandled, `dragged` stays set: the body is pinned at
     `kinematicPosition` and useFrame keeps driving it from a
     `state.pointer` that has stopped updating, so the badge hangs frozen
     in mid-air and never responds again. Measured after one vertical
     swipe, its centre moved 0.00px over the following four seconds — on
     a phone and on a touchscreen laptop alike.

     These listen to the real DOM events, so they hold whatever r3f's
     synthetic layer decides to do, and they are only attached while a
     drag is actually in flight.

     `lostpointercapture` and `blur` are here because pointerup and
     pointercancel between them do not cover everything. Press on the
     badge, drag, then alt-tab and let go in another window: capture is
     lost and the button comes up somewhere this document never hears
     about. r3f answers lostpointercapture the same way it answers
     pointercancel — cancelPointer, which raises onPointerOut and no up —
     so without these the badge freezes exactly as it did before. That
     path is a mouse path, which is to say the only kind of visitor this
     scene now has. */
  useEffect(() => {
    if (!dragged) return;
    const release = () => drag(false);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("lostpointercapture", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("lostpointercapture", release);
      window.removeEventListener("blur", release);
    };
  }, [dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      [j1, j2].forEach((ref) => {
        const body = ref.current;
        if (!body) return;
        if (!body.lerped) body.lerped = new THREE.Vector3().copy(body.translation());
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, body.lerped.distanceTo(body.translation() as THREE.Vector3))
        );
        body.lerped.lerp(
          body.translation() as THREE.Vector3,
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation() as THREE.Vector3);
      curve.points[1].copy(j2.current.lerped as THREE.Vector3);
      curve.points[2].copy(j1.current.lerped as THREE.Vector3);
      curve.points[3].copy(fixed.current.translation() as THREE.Vector3);
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel() as THREE.Vector3);
      rot.copy(card.current.rotation() as unknown as THREE.Vector3);
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              /* The window guard above may already have ended the drag
                 and, with it, the capture — releasing a pointer id the
                 element no longer holds throws InvalidPointerId from
                 inside an event handler. */
              try {
                (e.target as Element).releasePointerCapture(e.pointerId);
              } catch {
                /* already released */
              }
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current!.translation() as THREE.Vector3))
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          /* Upstream hard-codes white. The band is a ribbon whose
             control points bunch together near the clip, so wherever it
             doubles back on itself the twist catches the light and
             reads as a knot hanging in mid-air. Tinting it lets the
             cord sit against a dark page as a cord. */
          color={lanyardColor}
          depthTest={false}
          resolution={[Math.max(1, size.width), Math.max(1, size.height)]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(CARD_GLB);
