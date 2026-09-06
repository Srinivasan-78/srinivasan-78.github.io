/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​‌​‌​​‌‌​​‌‌​​‌‌​​‌‌​​‌‌‌​​​​​‌‌​​‌​​‌‌‌​​‌‌​‌​‌​‌‌​​​‌‌​​‌​​‌‌‌​​​​​‌‌​​‌​‌​‌​​​​‌‌​​‌‌​​​‌​‌‌​​‌‌‌​‌​​​‌‌​​‌‌​​​‌‌​‌‌​​‌‌‌​‌​​​‌‌‌​‌‌‌‌​​‌​‌​‌‌​​‌​‌‌​​​‌​​‌‌‌​​​‌​‌​​‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.53382sV2peC1gFcgGyYbqI
 */
import { pageMetadata } from "@/lib/seo";
import ProjectIndex from "@/components/ProjectIndex";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Platform engineering experiments, homelab automation and small tools, with live demos and public repos.",
  path: "/projects",
});

export default function Projects() {
  return <ProjectIndex />;
}
