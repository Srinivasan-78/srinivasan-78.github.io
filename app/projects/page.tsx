/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌‌​​‌​​‌‌‌​​‌​‌‌‌​‌‌​​‌‌​‌‌​‌​​‌‌​​‌​​​‌‌​‌​​​​‌‌​​​‌​‌​‌​​​​​‌​​‌​‌‌​‌‌‌‌​​‌​‌​‌​‌​‌​‌​​‌​‌‌​‌​‌‌‌‌‌​‌‌‌​​‌​​‌‌​​‌​‌​‌​‌​​​​​‌‌​​​​‌​​‌‌​‌‌​​​‌‌​​‌‌​‌​​‌‌‌​​‌​‌‌‌‌‌​‌​‌‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.99vm241PKyUK_rePa63N_Y
 */
import { pageMetadata } from "@/lib/seo";
import ProjectIndex from "@/components/ProjectIndex";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Platform engineering experiments, AI developer tooling and MCP servers, homelab automation and small tools, with live demos and public repos — including repo2graph, an open-source code-graph engine for AI coding agents.",
  path: "/projects",
});

export default function Projects() {
  return <ProjectIndex />;
}
