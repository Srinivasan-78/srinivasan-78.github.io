/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​​‌​‌​​​‌​‌​‌‌​‌​‌‌​‌​​​‌‌​​‌‌​‌‌​‌​​‌‌​‌​‌​‌‌​​​‌​​‌​​​‌‌‌​‌‌​‌​‌​​‌​‌‌​​​​‌​​‌‌‌​​‌‌​​​‌​​‌​‌‌​​‌​‌‌‌‌​‌​​‌‌​​‌​​​‌‌‌​​‌‌​‌​‌​‌​‌​‌​​​‌‌​​‌​​‌‌‌‌​‌‌​​‌‌‌​‌‌​​​‌‌​‌​‌​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.AEkFm5bGjXNbYzdsUFOgcV
 */
import { pageMetadata } from "@/lib/seo";
import ProjectIndex from "@/components/ProjectIndex";
import { PROJECTS_COPY } from "@/lib/data/profile";

/* The title and description now come from the same copy object the page
   body reads, rather than being typed out a second time here. They were
   identical strings in two files, which is the arrangement where the
   social card and the page it describes quietly stop matching. */
export const metadata = pageMetadata({
  title: PROJECTS_COPY.metaTitle,
  description: PROJECTS_COPY.metaDescription,
  path: "/projects",
});

/* The route owns the <main> landmark rather than ProjectIndex.

   It did so because this page was two things — the roster and the
   gaming coda beneath it — and a landmark inside the roster component
   would have left the second section outside main, putting real
   content past the end of the skip link's target.

   The coda has moved to /hobby, so the page is one thing again. The
   landmark stays here anyway: ProjectIndex is a client component (it
   owns the search and filter state) and the landmark belongs on the
   server-rendered shell, not inside the interactive leaf. */
export default function Projects() {
  return (
    <main id="content" tabIndex={-1}>
      <ProjectIndex />
    </main>
  );
}
