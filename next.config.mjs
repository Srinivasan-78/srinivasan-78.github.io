/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  /* `agentUpgrade` records that the 16.4.6 security update was applied
     through `next upgrade --agent=security`, so the build stops nagging
     about the advisory it already carries the fix for. */
  experimental: { inlineCss: true, agentUpgrade: "security" },
  // srinivasan-78.github.io is a *user* page — it serves at the domain
  // root, so no basePath/assetPrefix is needed. If this ever moves to a
  // project repo (username.github.io/repo-name), set both to "/repo-name".
};

export default nextConfig;
