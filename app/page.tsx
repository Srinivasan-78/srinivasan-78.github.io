/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌​​‌​‌‌‌‌​​‌​​‌‌​‌‌‌​‌​‌​​‌​​​‌‌​​‌​​‌‌​‌‌​​​​‌​‌‌​‌​‌‌​‌​‌​​‌‌​​​‌​​‌‌‌‌​​​​‌​​​‌‌​​‌​​‌‌‌‌​‌​​‌​‌‌​‌‌‌​‌​​​​‌‌​‌‌​​‌​​‌​‌​​​‌‌​‌​​​‌‌​‌‌‌‌​‌‌​​​‌​​‌​‌‌‌‌‌​‌​​​‌‌‌​‌​​​‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.iy7R2l-jbxFOKt6J4ob_GG
 */
import Hero from "@/components/home/Hero";
import Figures from "@/components/home/Figures";
import ReleasePath from "@/components/home/ReleasePath";
import Loadout from "@/components/home/Loadout";
import Initiatives from "@/components/home/Initiatives";
import Clearance from "@/components/home/Clearance";

/* The home page is the dossier's table of contents and its five cases,
   in reading order.

   REVISION 6 — three sections removed and one promoted, on
   instruction. Worth recording what went and why it is not a loss:

     Builds   "Things I've built on the side" + "Patches sent to other
              people's projects". Both were a preview of /projects
              rendered on the home page — the same twenty builds, the
              same two contributions, one level of detail down. A home
              page that summarises a page one click away is a page
              asking to be scrolled past twice.

     Close    "Let's build something dependable together". A closing
              CTA, which duplicated the hero's own Contact control and
              the whole of /contact. The nav is sticky now, so the
              contact destination is on screen at every scroll
              position; a terminal call to action is what you need when
              it is NOT.

     Tooling  "Tooling I work with day to day". Not deleted — promoted.
              It is the ticker in the sticky header now, so the
              toolchain is visible from every page and every scroll
              position rather than once, in case 07, on one page. That
              is a straight upgrade in reach for the same content.

   The three components are deleted rather than commented out. Their
   copy survives in lib/data/profile.ts (`sideProjects`, `closing`) and
   the contributions data is still rendered on /projects, so nothing
   here is unrecoverable.

   Section indices renumbered 01–05. They are the page's real ordinals,
   not decoration — a dossier whose contents jump from 04 to 06 is a
   dossier with a page missing.

   No metadata export, deliberately: the root layout's title, description
   and social card already describe this page, and declaring them again
   here is how the two drift apart.

   Every section owns its own <section>, its own container and its own
   top rule, so the page is a list of cases rather than a layout with
   nine special cases in it. Nothing here is a client component — the
   three stateful leaves (domain selection, the initiative filter, the
   operations clocks) are imported by the sections that need them, and
   the rest of this page is HTML by the time it reaches a browser.

   Section rhythm and the container width are fixed by the build
   contract in docs/design-contingency.md §4, not chosen per section. */
export default function Home() {
  return (
    /* tabIndex={-1} is what makes the skip link actually work. Without
       it, following #content moves the viewport but leaves focus on the
       link, so the next Tab goes back into the header the visitor just
       asked to skip. */
    <main id="content" tabIndex={-1}>
      <Hero />
      <Figures />
      <ReleasePath />
      <Loadout />
      <Initiatives />
      <Clearance />
    </main>
  );
}
