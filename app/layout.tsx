/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​​​‌​‌‌​​​​‌​‌​​‌​​‌​​‌‌‌​​‌​​‌‌​‌​‌​‌‌‌​​​‌​‌‌​​‌‌‌​‌‌​‌‌​​​‌‌​​​​‌​‌‌‌​​​‌​‌​‌​‌​​​‌‌​‌​‌‌​​‌‌​‌​‌​‌‌​​‌‌​​‌​​‌‌‌​​‌​​‌‌​‌​‌​​‌‌‌‌​‌​‌‌​‌​​‌‌​​‌‌​​​‌‌​‌​​​‌​​​​​‌​​‌‌​‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.aaI95qglaqTk5fNMOZf4A5
 */
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ScrollProvider from "@/components/ScrollProvider";
import ProgressRail from "@/components/ProgressRail";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BootScript from "@/components/BootScript";
import StickyCta from "@/components/StickyCta";
import CookieNotice from "@/components/CookieNotice";
import ChatWidget from "@/components/ChatWidget";
import Analytics from "@/components/Analytics";
import ClickSpark from "@/components/ui/ClickSpark";

/* Self-hosted at build time by next/font, so there is no request to
   fonts.googleapis.com at runtime and no swap flash. Inter is the
   closest freely-licensed match to the SF Pro metrics the layout is
   tuned for: same x-height ratio, same tight default tracking, and a
   variable weight axis so the display sizes do not need a second file.

   This replaces the commented-out KH Teka block that used to sit at the
   top of globals.css — that typeface is licensed per-domain and its
   files were never in the repo, so every page was silently rendering in
   the fallback stack anyway. */
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono-face",
});

export const viewport: Viewport = {
  /* Matches --paper. The browser chrome on mobile tints from this
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
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.srinidevops.com"),
  alternates: { canonical: "/" },
  title: "Srinivasan Vijayaraghavan — DevOps Engineer",
  description:
    "DevOps engineer working on CI/CD, cloud infrastructure and automation across AWS and Azure. Five years spent making releases calm, predictable and easy to trust.",
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
    title: "Srinivasan Vijayaraghavan — DevOps Engineer",
    description:
      "DevOps engineer working on CI/CD, cloud infrastructure and automation across AWS and Azure.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Srinivasan Vijayaraghavan, DevOps Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Srinivasan Vijayaraghavan — DevOps Engineer",
    description:
      "DevOps engineer working on CI/CD, cloud infrastructure and automation across AWS and Azure.",
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
      jobTitle: "DevOps Engineer",
      description:
        "DevOps engineer working on CI/CD, cloud infrastructure and automation across AWS and Azure.",
      email: "mailto:srinivasan.shyam2000@gmail.com",
      address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
      worksFor: { "@type": "Organization", name: "Thomson Reuters" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Madras Institute of Technology, Anna University" },
      knowsAbout: [
        "DevOps",
        "CI/CD",
        "Amazon Web Services",
        "Microsoft Azure",
        "Ansible",
        "Chef",
        "Puppet",
        "Terraform",
        "Docker",
        "GitHub Actions",
        "Kubernetes",
        "Datadog",
        "Infrastructure as Code",
        "Disaster Recovery",
      ],
      sameAs: [
        "https://www.linkedin.com/in/srini-solution-architect/",
        "https://github.com/Srinivasan-78",
      ],
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
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Ambient chrome that used to live here — a WebGL background field,
          a cursor lens, a scroll-velocity skew driver, and a corner clock —
          has been removed rather than tuned down. Each was decoration with
          no subject, and running four of them at once is what made the page
          read as busy. What is left is one hairline scroll indicator. */}
      <body>
        <BootScript />
        <ProgressRail />
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        {/* One click reaction for the whole app. The canvas is fixed at
            viewport size and pointer-events:none, and the wrapper is
            display:contents, so nothing here is between a visitor and a
            button. See components/ui/ClickSpark.tsx. */}
        <ClickSpark
          /* A token, not a literal: the canvas colour has to change with
             the page. ClickSpark resolves this off <html> at mount. */
          sparkColor="--spark"
          sparkSize={8}
          sparkRadius={12}
          sparkCount={6}
          duration={300}
        >
          <ScrollProvider>
            <Nav />
            {children}
            <Footer />
          </ScrollProvider>
        </ClickSpark>
        <StickyCta />
        <ChatWidget />
        <CookieNotice />
        <Analytics />
      </body>
    </html>
  );
}
