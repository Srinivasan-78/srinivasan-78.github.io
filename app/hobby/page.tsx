/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​‌‌‌​‌‌​‌​‌​​‌​​​‌​‌​‌‌‌​​​​​​‌‌​​​​​‌‌‌‌​​​​‌‌‌​​‌‌​‌​​‌​‌​​​‌‌‌​​‌​‌‌‌​‌​​​‌‌‌​​‌‌​‌‌​‌​‌‌​‌‌​​​‌​​​‌‌​​‌​​‌‌​‌​‌‌​‌​‌‌​​​​​‌‌​​‌​​​‌‌​‌‌​​‌​​‌‌‌‌​‌‌​​‌‌‌​‌‌​​‌​​​‌‌‌​‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.WjEp0xsJ9tskb2kX26Ogdw
 */
import GameBoard from "@/components/gaming/GameBoard";
import { GAMING_COPY } from "@/lib/data/gaming";
import { pageMetadata } from "@/lib/seo";

/* The fourth destination. Previously a coda at the foot of /projects —
   see the header of components/gaming/GameBoard.tsx for why it is a
   route of its own now.

   Title and description come from the same copy object the page body
   reads, rather than being typed out a second time here. They were
   identical strings in two files elsewhere on this site, which is the
   arrangement where the social card and the page it describes quietly
   stop matching. */
export const metadata = pageMetadata({
  title: GAMING_COPY.metaTitle,
  description: GAMING_COPY.metaDescription,
  path: "/hobby",
});

export default function Hobby() {
  return (
    <main id="content" tabIndex={-1}>
      <GameBoard />
    </main>
  );
}
