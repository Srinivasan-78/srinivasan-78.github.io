/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​‌​‌​​‌‌​​‌​​‌​‌‌‌‌‌​‌‌‌​​‌‌​‌‌​‌​‌​​‌​‌​​​‌​‌‌‌​‌​‌​‌​​​​​‌​​‌‌​‌​‌​‌​​​​‌‌​​‌‌​​‌‌​‌‌‌​​‌​​‌​‌​‌​​​‌​‌​​​‌​‌​‌​‌‌​​‌‌‌‌​‌​​‌​‌‌​‌​​‌‌‌​​​‌​​‌‌​‌‌​​‌​​‌​​‌​‌‌​‌​‌‌​‌‌​​​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.E2_sjQuA5C3rTQVzZq6Ikb
 */
import type { Metadata, Viewport } from "next";
import {
  Archivo_Black,
  Inter_Tight,
  JetBrains_Mono,
  Oswald,
} from "next/font/google";
import "./globals.css";
import BootScript from "@/components/BootScript";
import Nav from "@/components/Nav";
import SkillTicker from "@/components/SkillTicker";
import Footer from "@/components/Footer";
import InteractionFx from "@/components/primitives/InteractionFx";
import BatGround from "@/components/primitives/BatGround";
import BrandSprite from "@/components/primitives/BrandSprite";
import { BatSprite } from "@/components/primitives/BatGlyph";
import CookieNotice from "@/components/CookieNotice";
import Analytics from "@/components/Analytics";

/* All four self-hosted at build time by next/font, so there is no
   request to fonts.googleapis.com at runtime and no swap flash.

   This replaces Instrument Serif, which was the first pass's display
   face and was wrong. It is a high-contrast editorial serif: beautiful
   at a glance, and structurally thin — the thick-to-thin modulation
   means its stems carry almost no weight at any size. On a near-black
   ground that reads as frail, which is the opposite of the subject. A
   dossier about keeping production systems standing cannot be set in a
   typeface that looks like it might blow over.

   Archivo Black replaces it. Single weight, and that weight is heavy:
   a geometric grotesque with closed apertures and almost no
   modulation, so a headline lands as a block of ink rather than as a
   line of lettering. It is also the correct historical reference — the
   Gotham of Batman '89 is Art Deco, and Deco display lettering is
   geometric, heavy and wide. Furst's city and this typeface are
   drawing on the same source.

   Oswald is the second display register, for numerals and the poster
   moments. Condensed and tall, it gives figures the vertical drama a
   wide grotesque cannot — a stat block set in it reads like a
   scoreboard, which is exactly what a stat block is. The pairing is
   also a real one rather than a convenience: wide-heavy against
   narrow-heavy is how poster and comic-cover lettering has always
   handled a headline next to a number.

   Inter Tight carries the prose, because the prose here is genuinely
   long — twenty project write-ups of six to eleven paragraphs each.

   JetBrains Mono is annotation only: labels, case numbers, the
   contingency line. The moment it carries a paragraph the design
   becomes the terminal pastiche it was built to avoid. */
const display = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-display-face",
});

/* REVISION 12 — one weight, and not preloaded.

   It asked for 500, 600 and 700, which is three font files per subset.
   `.t-poster` in §3 is the ONLY rule in the stylesheet that selects
   this face, and it hard-sets `font-weight: 700`, so nothing could
   ever reach the other two — they were downloaded and never drawn.

   `preload: false` because the poster face is not on the cover. Its
   first appearance is the figure in case 01, below the fold on every
   viewport this was checked at. A preload is a promise that the bytes
   are needed for the first screen, and four of them were competing
   with each other and with the critical CSS for the opening
   connection; this one was the promise that was not true. It still
   loads immediately — `swap` plus the Haettenschweiler/Impact
   fallback means the figures are legible in a condensed face
   throughout, which is the whole reason that fallback stack is
   specific rather than `sans-serif`. */
const poster = Oswald({
  subsets: ["latin"],
  display: "swap",
  weight: "700",
  preload: false,
  variable: "--font-poster-face",
});

const sans = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-face",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono-face",
});

export const viewport: Viewport = {
  /* Matches --c-ground, and revision 11 is the proof that it has to
     be checked by hand: the palette went white-and-black / black-and-
     yellow and these two still held the old bone and blue-black, which
     is precisely the mismatch the rest of this note warns about.

     Original note follows.

     Matches --c-ground. The browser chrome on mobile tints from this
     before any CSS has been read, so a mismatch shows as a band of the
     wrong colour above the page on every load.

     Two entries, because there are two --paper values now. These are
     matched by the OS preference rather than by data-theme — the
     browser resolves them itself, with no stylesheet and no script — so
     a visitor who has explicitly chosen the palette their OS is not set
     to gets the other bar. That is the whole of what this can express,
     and a one-colour bar would be wrong for half of visitors instead of
     a few. */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.srinidevops.com"),
  alternates: { canonical: "/" },
  title: "Srinivasan Vijayaraghavan — DevOps / Site Reliability Engineer",
  description:
    "DevOps / Site Reliability Engineer working on cloud infrastructure, reliability, release automation and AI developer tooling across Azure and AWS. Five years spent making releases calm, predictable and easy to trust — and the maintainer of repo2graph, an open-source MCP server for AI coding agents.",
  keywords: [
    "DevOps Engineer",
    "Site Reliability Engineer",
    "Azure",
    "AWS",
    "GitHub Actions",
    "Ansible",
    "Datadog",
    "Disaster Recovery",
    "Release Automation",
    "Model Context Protocol",
    "MCP server",
    "repo2graph",
    "Bangalore",
  ],
  authors: [{ name: "Srinivasan Vijayaraghavan" }],
  /* Without max-image-preview:large, Google caps any thumbnail it chooses
     to show at a small size. It is a permission, not a request — it does
     not make Google pick an image, it only stops it from shrinking one it
     has already picked. */
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Srinivasan Vijayaraghavan",
    /* The canonical in `alternates` only emits <link rel="canonical">;
       og:url is a separate tag and Next does not derive one from it. Every
       other page gets this through pageMetadata in lib/seo.ts — the home
       page builds its metadata here, so it has to be stated. */
    url: "/",
    title: "Srinivasan Vijayaraghavan — DevOps / Site Reliability Engineer",
    description:
      "Cloud infrastructure, reliability, release automation and AI developer tooling across Azure and AWS.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Srinivasan Vijayaraghavan, DevOps / Site Reliability Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Srinivasan Vijayaraghavan — DevOps / Site Reliability Engineer",
    description:
      "Cloud infrastructure, reliability, release automation and AI developer tooling across Azure and AWS.",
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.srinidevops.com/#website",
      url: "https://www.srinidevops.com/",
      name: "Srinivasan Vijayaraghavan — DevOps Engineer",
      description:
        "DevOps engineer working on CI/CD, cloud infrastructure and automation across AWS and Azure.",
      publisher: { "@id": "https://www.srinidevops.com/#person" },
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": "https://www.srinidevops.com/#person",
      name: "Srinivasan Vijayaraghavan",
      url: "https://www.srinidevops.com/",
      image: "https://www.srinidevops.com/og.png",
      jobTitle: ["DevOps Engineer", "Site Reliability Engineer"],
      description:
        "DevOps / Site Reliability Engineer working on cloud infrastructure, reliability, release automation and AI developer tooling across Azure and AWS.",
      email: "mailto:srinivasan.shyam2000@gmail.com",
      telephone: "+91-97910-25934",
      nationality: { "@type": "Country", name: "United States" },
      address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
      worksFor: { "@type": "Organization", name: "Thomson Reuters" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Madras Institute of Technology, Anna University" },
      knowsAbout: [
        "DevOps",
        "Site Reliability Engineering",
        "CI/CD",
        "Amazon Web Services",
        "Microsoft Azure",
        "Ansible",
        "Chef",
        "Puppet",
        "Terraform",
        "Bicep",
        "ARM Templates",
        "Jinja2",
        "Docker",
        "GitHub Actions",
        "GitLab CI",
        "Azure DevOps",
        "Kubernetes",
        "Azure Kubernetes Service",
        "Datadog",
        "Pingdom",
        "Infrastructure as Code",
        "Disaster Recovery",
        "Release Automation",
        "Azure Service Bus",
        "Azure Key Vault",
        "Azure Storage",
        "AzCopy",
        "Microsoft SQL Server",
        "T-SQL",
        "Apache HTTP Server",
        "Apache Tomcat",
        "Apache Solr",
        "Akamai",
        "Windows Server",
        "Red Hat Enterprise Linux",
        "Ubuntu",
        "Python",
        "Bash",
        "PowerShell",
        "C#",
        "C++",
        "Model Context Protocol",
        "Large Language Models",
        "Retrieval Augmented Generation",
        "Agentic Coding Workflows",
        "Prompt Engineering",
        "Ollama",
        "Role-Based Access Control",
        "Secret Management",
        "Bring Your Own Key Encryption",
        "ITSM Change Management",
        "WiX Toolset",
      ],
      sameAs: [
        "https://www.linkedin.com/in/srini-solution-architect/",
        "https://github.com/Srinivasan-78",
      ],
    },
    {
      /* The open-source work named on the résumé, stated as its own entity
         so a search engine can connect the person to the project rather
         than inferring it from prose. */
      "@type": "SoftwareSourceCode",
      "@id": "https://www.srinidevops.com/projects/repo2graph#software",
      name: "repo2graph",
      description:
        "Open-source code-graph engine and MCP server that gives AI coding agents cited, token-bounded answers about any codebase — tree-sitter parsing across 17 languages, BM25 and graph retrieval, and a GitHub Action for PR blast-radius analysis. No LLM or API key required.",
      url: "https://www.srinidevops.com/projects/repo2graph",
      codeRepository: "https://github.com/Srinivasan-78/repo2graph",
      programmingLanguage: "Python",
      license: "https://opensource.org/licenses/MIT",
      author: { "@id": "https://www.srinidevops.com/#person" },
      maintainer: { "@id": "https://www.srinidevops.com/#person" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // No data-theme attribute here, deliberately. The server cannot know
    // the visitor's stored choice or their OS setting, so it renders the
    // attribute unset — which the stylesheet reads as light, the same
    // palette this page has always shipped. BootScript then writes the
    // real value before the first paint, so there is nothing to flash.
    //
    // suppressHydrationWarning is what makes that legal: BootScript has
    // already changed <html> by the time React hydrates, and without it
    // React would flag the attribute it did not render.
    <html
      lang="en"
      className={`${display.variable} ${poster.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* GitHub Pages cannot set response headers, so the part of a CSP
            that is honoured in a <meta> ships here. base-uri and object-src
            are safe to lock fully; frame-ancestors, a strict script-src and
            HSTS/COOP need a real header — see docs/deployment-headers.md. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="base-uri 'none'; object-src 'none'"
        />
        {/* Plausible is the one cross-origin the page contacts, on every
            route, immediately after hydration. */}
        <link rel="preconnect" href="https://plausible.io" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* What is deliberately NOT here any more.

          The sticky call-to-action bar and the chat widget's floating
          launcher are both gone. The brief's governing constraint is
          that nothing on the page demands attention — it is read off a
          person whose own tools are built around consent before
          counting, no telemetry, and a local-first default. A bubble
          that follows the visitor down the page asking them to talk is
          the opposite of that, and a site that contradicts its author's
          stated values in its chrome is not a portfolio, it is a
          template with his name on it.

          The cookie notice stays, because consent before counting is a
          value rather than a nuisance, and analytics must not load
          until it is answered. It is restyled as a quiet ruled panel
          rather than a floating card.

          Earlier ambient chrome — a WebGL background field, a cursor
          lens, a scroll-velocity skew driver, a corner clock, an
          app-wide click-spark canvas — was removed before this
          redesign. All of it was decoration with no subject. */}
      <body>
        <BootScript />
        {/* The glyph definitions, once per page. Every brand mark in
            the ticker and every bat divider is a ~40-byte <use>
            pointing in here rather than a kilobyte of inline path
            data — see the header of BrandSprite.tsx.

            MOUNTED HERE, NOT IN Nav, and that placement is the whole
            point. Nav carries "use client", so anything it imports
            joins the client graph: putting BrandSprite there shipped
            `react-dom/server` to the browser and added 108 KB to the
            bundle for a function that only ever runs at build time.
            This file is a server component, so the sprite is rendered
            during `next build` and the browser receives markup. */}
        <BrandSprite />
        <BatSprite />
        {/* The bat ground: four faint marks, one per quadrant, fixed
            behind every page. First child so it sits furthest back —
            §5h gives every other direct child of <body> `z-index: 1`,
            which is what keeps the whole document above it without
            each section having to opt in. */}
        <BatGround />
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        {/* Revision 4's site-wide interaction layer: a click spark and
            a targeting reticle for a cursor. It wraps the chrome as
            well as the content so a click on the nav sparks too.

            It renders its children straight through until it has
            checked the pointer type and the motion preference, so the
            page is never waiting on it and a reduced-motion or
            touch visitor gets exactly the markup they got before.
            Everything it adds is decoration over an already-complete
            page — see the header of the component. */}
        <InteractionFx>
          {/* The ticker is handed to Nav rather than imported by it, so
              it stays a server component and its thirty-nine marks
              stay markup instead of becoming JavaScript. Measured at
              24 KB gzipped on the home page, and in the expensive
              place — see the header of SkillTicker.tsx. */}
          <Nav ticker={<SkillTicker />} />
          {children}
          <Footer />
        </InteractionFx>
        <CookieNotice />
        <Analytics />
      </body>
    </html>
  );
}
