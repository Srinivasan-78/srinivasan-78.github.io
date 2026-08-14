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
