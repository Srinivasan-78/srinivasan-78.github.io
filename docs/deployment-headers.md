# Deployment headers

Lighthouse flags several security and caching issues on `www.srinidevops.com` that
**cannot be fixed from this repo**. The site is a Next.js static export
(`output: "export"` in `next.config.mjs`) published to GitHub Pages by
`.github/workflows/deploy.yml` (`actions/upload-pages-artifact` → `actions/deploy-pages`).
GitHub Pages serves files only — it does not let you set custom HTTP response
headers, and `next.config.mjs` `headers()` is silently ignored under
`output: "export"`.

## What can't be fixed on GitHub Pages

| Report finding | Detail |
|---|---|
| `Cache-Control: max-age=600` on every asset ("Use efficient cache lifetimes", est. 288 KiB) | GitHub Pages' CDN hardcodes a 10-minute TTL; not configurable. Files under `/_next/static/` are content-hashed and safe to cache for a year — the short TTL is purely a hosting limit. |
| No `Content-Security-Policy` header | `app/layout.tsx` ships `<meta http-equiv="Content-Security-Policy" content="base-uri 'none'; object-src 'none'">`. That is the ceiling for a meta CSP — `frame-ancestors`, a real `script-src`, and reporting are header-only. |
| No `Strict-Transport-Security` with `includeSubDomains; preload` | GitHub sends only a short apex HSTS. |
| No `Cross-Origin-Opener-Policy` | Header-only; no meta equivalent. |
| No `X-Frame-Options` / CSP `frame-ancestors` (clickjacking) | Cannot be set via meta. |

All are "Unscored / Trust & Safety" audits (or the caching insight) — real hardening
gaps, not score-affecting, but only reachable at the edge.

## Route A (recommended): Cloudflare in front of GitHub Pages

Keep GitHub Pages as the origin; add Cloudflare (free plan) as a proxy.

1. Move DNS for `srinidevops.com` to Cloudflare (or add the zone if it is already there).
2. Set the `www` record to the GitHub Pages target and enable the proxy (orange
   cloud). Keep the `CNAME` file (`www.srinidevops.com`) and GitHub's "Enforce
   HTTPS" as-is.
3. **SSL/TLS → Overview**: Full (strict).
4. **SSL/TLS → Edge Certificates → HTTP Strict Transport Security (HSTS)**: enable,
   `max-age` 2 years (63072000), **Include subdomains** on, **Preload** on,
   **No-Sniff** on. This is where `includeSubDomains` + `preload` come from — a raw
   header alone will not get you onto the preload list without the dashboard toggle.
5. **Rules → Transform Rules → Modify Response Header** (or a Snippet /
   `http_response_headers_transform` ruleset): add, for all requests, the headers
   in the table below.
6. **Caching → Cache Rules**: match `URI Path starts with /_next/static/` → Edge
   Cache TTL 1 year, Browser Cache TTL 1 year. Optionally a second rule for
   `*.woff2` and the favicons.

### Header set (all responses unless noted)

| Header | Value | Why |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://plausible.io; frame-ancestors 'none'; base-uri 'none'; object-src 'none'; upgrade-insecure-requests` | Restricts every resource type to same-origin + Plausible; kills framing, `<base>` hijacking, and plugins. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years across all subdomains; preload-list eligible. |
| `X-Frame-Options` | `DENY` | Clickjacking; belt-and-braces with `frame-ancestors`. |
| `X-Content-Type-Options` | `nosniff` | Stops MIME sniffing. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Trims the referrer on cross-origin navigation. |
| `Cross-Origin-Opener-Policy` | `same-origin` | Process-isolates the top-level window. |
| `Cross-Origin-Resource-Policy` | `same-origin` | Blocks cross-origin embedding of our resources. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` | Denies powerful features and the Topics API. |
| `Cache-Control` — only `/_next/static/*`, `*.woff2`, favicons | `public, max-age=31536000, immutable` | Year-long cache for fingerprinted / immutable assets. |

**On `'unsafe-inline'` in `script-src`:** unavoidable here. A static export injects
inline bootstrap and hydration scripts directly into the HTML, and there is no
server to mint a per-request nonce. Lighthouse will still rate this CSP "moderate"
for that reason. It is still a real win: it blocks injection of *external* scripts
and inline handlers pointing off-origin, which is the common XSS payload path.
Removing `'unsafe-inline'` would need SSR (drop `output: "export"`) or a build step
that hashes every inline script.

## Route B: move hosting to Cloudflare Pages or Netlify

Both read a `public/_headers` file from the repo and apply it at the edge. Nothing
else changes — `deploy.yml` still runs `npm run build`, output still lands in
`out/`; only the publish target moves. On Cloudflare Pages / Netlify, point the
build output at `out` and drop the Pages-artifact steps.

**`public/_headers` is already committed** — it copies to `out/_headers` on every
build and is inert on GitHub Pages, so switching host is the only remaining step.
Its contents:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://plausible.io; frame-ancestors 'none'; base-uri 'none'; object-src 'none'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable
```

`next/font` self-hosts its `.woff2` files under `/_next/static/media/`, so the
`/_next/static/*` rule already covers them; the `/*.woff2` rule is only for fonts
served from elsewhere. Add favicon paths (`/favicon.ico`, `/icon-*.png`,
`/apple-touch-icon.png`) to the long-cache list if you want them covered too.
