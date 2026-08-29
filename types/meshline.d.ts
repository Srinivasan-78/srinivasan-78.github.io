/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​​‌​​‌‌​​​​​​‌‌‌​​‌​‌​​​​‌‌​‌‌​​‌‌‌​‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​​​​‌​​‌​​‌​‌​​‌​​‌​‌​​‌‌‌​​‌​​​‌​‌​​‌‌​​‌​​​‌‌​‌​‌​‌‌‌​‌‌‌​‌‌​​‌‌‌​‌‌​‌‌‌‌​‌‌​‌‌​‌​‌​‌​​​​​‌​‌​​‌‌​​‌‌‌​​‌​​‌‌​​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.A09CgbsHIINE25wgomPS93
 */
/* meshline registers two custom elements with react-three-fiber at
   runtime, through `extend()`. TypeScript has no way to learn about them
   from that call, so the JSX intrinsics are declared here — the same
   declaration the component's upstream README asks TS users to add.

   Three props are widened. react-three-fiber accepts a plain array where
   the underlying uniform is a Vector2, and a boolean where it is a 0/1
   flag, converting on assignment; the generated MaterialNode type
   describes the field's final type rather than what may be written to
   it. Widening here keeps the component's call site identical to
   upstream instead of rewriting correct values to satisfy a type. */

import type { MeshLineGeometry, MeshLineMaterial } from "meshline";
import type { Object3DNode, MaterialNode } from "@react-three/fiber";

type MeshLineMaterialNode = Omit<
  MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>,
  "resolution" | "repeat" | "useMap"
> & {
  resolution?: [number, number];
  repeat?: [number, number];
  useMap?: boolean;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
      meshLineMaterial: MeshLineMaterialNode;
    }
  }
}
