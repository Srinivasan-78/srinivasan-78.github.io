/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​​‌‌​‌‌‌​​‌‌​‌​​​​​‌​​‌‌​‌​​​‌‌​‌​​​​​‌‌​‌​‌​‌‌‌​‌‌​​‌‌‌‌​​‌​‌​‌​​‌​​​‌‌‌​​​​‌​‌​‌‌​​‌‌​​​‌‌​‌‌‌​‌​‌​‌‌‌‌​​​​‌​​‌‌​‌​‌​​‌‌‌‌​‌​​​‌‌‌​‌‌​‌‌‌​​‌‌​​​‌​​‌​​‌‌‌‌​​‌‌​‌​​​‌​​‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.SsA4h5vyR8VcuxMOGnbO4I
 */
/* Renders the site's social card and icon set from the site's own tokens.
 *
 * Run by hand, not by the build:
 *
 *     npm run build            # the fonts have to exist first
 *     npx playwright@1.62.1 install chromium   # once
 *     node scripts/make-brand-assets.mjs
 *
 * Playwright is deliberately not a dependency of this project. These are
 * five committed files that change about once a year; carrying a browser
 * download in every CI install to regenerate them would cost more than it
 * saves. The script finds Playwright wherever npx already put it.
 *
 * Why generate them at all rather than draw them once in an editor: the
 * card and the icons are made of the same colours, the same two typefaces
 * and the same words as the site. Anything hand-made drifts from those the
 * first time a token changes — which is exactly what had happened. The
 * assets this replaces were built from a four-hue palette (sage, slate,
 * plum, brass) that app/globals.css retired, so the social card and the
 * favicon were showing colours that appear nowhere on the site.
 *
 * The fonts come out of the built site — next/font downloads and subsets
 * them at build time, so `out/` is the only place they exist — which also
 * guarantees the card is set in the same files the pages are set in.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const PUBLIC = path.join(ROOT, "public");
const PORT = 4519;

/* ---------- tokens: the same values as :root in app/globals.css ---------- */
const T = {
  black: "#000000",
  ink: "#f5f5f7",
  ink45: "#86868b",
  ink15: "rgba(255,255,255,0.10)",
  accent: "#2997ff",       // the dark theme's link blue
  accentSolid: "#0071e3",  // the accent as a fill behind white
};

/* ---------- fonts: lifted out of the built stylesheet ---------- */
function faces() {
  const dir = path.join(OUT, "_next/static/css");
  if (!fs.existsSync(dir)) throw new Error("No out/ — run `npm run build` first.");
  const css = fs.readdirSync(dir).map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("");
  const wanted = [];
  for (const block of css.match(/@font-face\{[^}]*\}/g) ?? []) {
    // The latin subset only: the card has no Cyrillic or Greek in it.
    if (!/unicode-range:u\+00\?\?/.test(block)) continue;
    const family = block.match(/font-family:([^;]+);/)?.[1];
    const url = block.match(/url\(([^)]+)\)/)?.[1];
    const weight = block.match(/font-weight:([^;]+);/)?.[1] ?? "400";
    if (!family || !url) continue;
    const file = path.join(OUT, url.replace(/^\//, ""));
    if (!fs.existsSync(file)) continue;
    const b64 = fs.readFileSync(file).toString("base64");
    const name = /Inter/i.test(family) ? "Site Sans" : "Site Mono";
    wanted.push(`@font-face{font-family:"${name}";font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64}) format("woff2")}`);
  }
  if (!wanted.some((f) => f.includes("Site Sans"))) throw new Error("Inter not found in out/");
  if (!wanted.some((f) => f.includes("Site Mono"))) throw new Error("JetBrains Mono not found in out/");
  return wanted.join("");
}

const FONTS = faces();

const shell = (w, h, body, extra = "") => `<!doctype html><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;background:${T.black};overflow:hidden}
body{font-family:"Site Sans",sans-serif;color:${T.ink};-webkit-font-smoothing:antialiased}
${extra}</style>${body}`;

/* ---------- the social card ---------- */
/* Same information as the card it replaces — title, role, stack, three
   counts, domain — in the palette and the two typefaces the site actually
   uses. The left rail is the site's own scroll indicator, which is the one
   piece of ambient chrome the pages kept. */
const og = shell(1200, 630, `
<div class="rail"></div>
<div class="pad">
  <p class="eyebrow">DevOps engineer · Bangalore, IN</p>
  <h1>Srinivasan<br>Vijayaraghavan</h1>
  <p class="lede">I automate the release nobody wants to do by hand.</p>
  <p class="stack">AWS · Azure · GitHub Actions · Ansible · Terraform</p>
  <div class="micros"><span>5 yrs shipping</span><span>2 clouds</span><span>22 certs</span></div>
  <p class="domain">srinidevops.com</p>
</div>`, `
.rail{position:absolute;left:0;top:0;bottom:0;width:6px;background:linear-gradient(to bottom,${T.accent},${T.accentSolid})}
.pad{position:absolute;inset:0;padding:72px 80px 64px 86px;display:flex;flex-direction:column}
.eyebrow{font-family:"Site Mono",monospace;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:${T.ink45}}
h1{margin-top:26px;font-size:86px;font-weight:600;letter-spacing:-.035em;line-height:1.02}
.lede{margin-top:26px;font-size:28px;font-weight:400;letter-spacing:-.01em;color:${T.ink};opacity:.82}
.stack{margin-top:14px;font-family:"Site Mono",monospace;font-size:19px;letter-spacing:.02em;color:${T.ink45}}
.micros{margin-top:auto;display:flex;gap:12px}
.micros span{font-family:"Site Mono",monospace;font-size:18px;letter-spacing:.04em;color:${T.ink};
  border:1px solid ${T.ink15};border-radius:999px;padding:9px 18px}
.domain{position:absolute;right:80px;bottom:64px;font-family:"Site Mono",monospace;font-size:19px;
  letter-spacing:.06em;color:${T.accent}}`);

/* ---------- the monogram ---------- */
/* Full bleed, no rounding: every platform that shows this applies its own
   mask, and a corner radius baked in shows up as a dark ring inside theirs.
   White on --accent-solid is the site's primary button, which is the one
   filled shape the design already has. */
const icon = (size) => shell(size, size, `<div class="m">SV</div>`, `
html,body{background:${T.accentSolid}}
.m{width:100%;height:100%;display:flex;align-items:center;justify-content:center;
  font-size:${Math.round(size * 0.44)}px;font-weight:700;letter-spacing:${-size * 0.02}px;
  color:#fff;padding-bottom:${Math.round(size * 0.02)}px}`);

/* ---------- ICO, written by hand ---------- */
/* The .ico container takes PNG payloads directly (Vista onwards, which is
   every browser that matters), so this is a header, one directory entry per
   size, and the PNG bytes — no encoder needed. */
function ico(pngs) {
  const dir = Buffer.alloc(6 + 16 * pngs.length);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2); // type: icon
  dir.writeUInt16LE(pngs.length, 4);
  let offset = dir.length;
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    dir.writeUInt8(size >= 256 ? 0 : size, e);
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1);
    dir.writeUInt8(0, e + 2);   // palette
    dir.writeUInt8(0, e + 3);   // reserved
    dir.writeUInt16LE(1, e + 4);  // colour planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(data.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([dir, ...pngs.map((p) => p.data)]);
}

/* ---------- render ---------- */
function playwrightPath() {
  const roots = [path.join(ROOT, "node_modules/playwright/index.mjs")];
  try {
    const found = execSync("find ~/.npm/_npx -maxdepth 4 -type d -name playwright 2>/dev/null | head -1", { encoding: "utf8" }).trim();
    if (found) roots.push(path.join(found, "index.mjs"));
  } catch { /* npx cache absent; the local copy may still be there */ }
  const hit = roots.find((p) => fs.existsSync(p));
  if (!hit) throw new Error("Playwright not found. Run: npx playwright@1.62.1 install chromium");
  return hit;
}

const pages = new Map();
const server = http.createServer((req, res) => {
  const body = pages.get(req.url.split("?")[0]);
  if (!body) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(body);
});

const SIZES = [
  { file: "favicon-32.png", size: 32 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
];

pages.set("/og", og);
for (const { size } of SIZES) pages.set(`/icon-${size}`, icon(size));
pages.set("/icon-16", icon(16));

await new Promise((r) => server.listen(PORT, r));
const { chromium } = await import(playwrightPath());
const browser = await chromium.launch();

async function shoot(route, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: "png" });
  await ctx.close();
  return buf;
}

const write = (name, buf) => {
  fs.writeFileSync(path.join(PUBLIC, name), buf);
  console.log(`  ${name.padEnd(22)} ${(buf.length / 1024).toFixed(1)} KB`);
};

console.log("public/");
write("og.png", await shoot("/og", 1200, 630));
const icons = {};
for (const { file, size } of SIZES) {
  icons[size] = await shoot(`/icon-${size}`, size, size);
  write(file, icons[size]);
}
write("favicon.ico", ico([
  { size: 16, data: await shoot("/icon-16", 16, 16) },
  { size: 32, data: icons[32] },
]));

await browser.close();
server.close();
