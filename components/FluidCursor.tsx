"use client";

/* eslint-disable react/no-unknown-property */
// Lightweight cursor built on the FluidGlass lens mesh: tracks the
// pointer via a raw pointermove listener (not r3f's built-in pointer,
// since the canvas sits pointer-events:none so page clicks pass through
// to whatever's underneath).
import * as THREE from "three";
import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { easing } from "maath";

type PointerRef = React.MutableRefObject<{ x: number; y: number }>;

// useGLTF suspends, and rejects the suspense promise if the model 404s.
// Without a boundary that rejection is an unhandled render error that
// unmounts the whole app (this sits at the layout root, above Nav and
// children) — so a missing/broken lens.glb takes down every page.
class ModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function LensCursor({ pointerRef }: { pointerRef: PointerRef }) {
  const ref = useRef<THREE.Mesh>(null);
  const { nodes } = useGLTF("/assets/3d/lens.glb") as unknown as {
    nodes: Record<string, THREE.Mesh>;
  };
  const geometry = nodes?.Cylinder?.geometry;

  useFrame((state, delta) => {
    if (!ref.current) return;
    const { viewport, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    const nx = (pointerRef.current.x / window.innerWidth) * 2 - 1;
    const ny = -(pointerRef.current.y / window.innerHeight) * 2 + 1;
    easing.damp3(ref.current.position, [(nx * v.width) / 2, (ny * v.height) / 2, 15], 0.15, delta);
  });

  if (!geometry) return null;

  return (
    <mesh ref={ref} scale={0.22} rotation-x={Math.PI / 2} geometry={geometry}>
      <MeshTransmissionMaterial
        ior={1.15}
        thickness={5}
        anisotropy={0.02}
        chromaticAberration={0.12}
        roughness={0}
        transmission={1}
        color="#ffffff"
      />
    </mesh>
  );
}

export default function FluidCursor() {
  const pointerRef = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reduced) return;

    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!enabled) return null;

  return (
    <div className="fluid-cursor" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60 }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
        <ModelErrorBoundary>
          <Suspense fallback={null}>
            <LensCursor pointerRef={pointerRef} />
          </Suspense>
        </ModelErrorBoundary>
      </Canvas>
    </div>
  );
}
