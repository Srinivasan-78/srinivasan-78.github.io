/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​‌‌‌​‌​‌​‌‌​​‌​‌​​​​​‌‌‌‌​​‌​‌‌​‌‌​​​‌‌‌‌​​​​‌​​​​​‌​‌‌‌​​‌​​‌‌​‌​​‌​​‌‌​‌​​​‌‌‌​​​‌​‌‌‌​‌​​​‌​‌​​‌‌​‌​‌​​​‌​‌​‌​‌‌​​‌​​‌‌‌​​‌‌​​​‌‌​‌‌‌‌​​‌​‌‌‌​‌​‌​‌‌​‌‌​​​‌‌​​‌‌​​‌​​​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.WVPylxAri4qtSQVNcyulfA
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  // srinivasan-78.github.io is a *user* page — it serves at the domain
  // root, so no basePath/assetPrefix is needed. If this ever moves to a
  // project repo (username.github.io/repo-name), set both to "/repo-name".
};

export default nextConfig;
