import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BootScript from "@/components/BootScript";
import PerfGuard from "@/components/primitives/PerfGuard";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieNotice from "@/components/CookieNotice";
import Analytics from "@/components/Analytics";
/* Two faces, both self-hosted at build time by next/font, so there is
   no request to fonts.googleapis.com at runtime and no swap flash.

   WHAT WENT, AND WHY. Archivo Black carried the display register and
   Oswald carried the figures: a wide-heavy grotesque abutted against a
   narrow-heavy condensed, which is how a comic cover sets a headline
   next to a number. It was the right pairing for a dossier and it is
   the wrong one for this brief. The new design is one family at
   several sizes — display, body and figures are the same face, and the
   hierarchy is scale, weight and tracking rather than a second
   typeface brought in to shout. Dropping both also drops two font
   files from every page load.

   Inter Tight carries everything read as language. It is the closest
   thing to the system face that self-hosts cleanly, and the fallback
   chain in globals.css §1c leads with -apple-system, so a visitor on
   macOS or iOS sees SF rather than Helvetica while it loads.

   JetBrains Mono survives for exactly one class — `.t-metric`, for
   figures that have to align in a column. It no longer sets a single
   label. */
const sans = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-face",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  /* Annotation only, and not on the first screen of any route. */
  preload: false,
  variable: "--font-mono-face",
});

export const viewport: Viewport = {
  /* These are the two --c-ground values from globals.css §1, and they
     have to be copied by hand every time that palette moves: the
     browser chrome on mobile tints from this before any CSS has been
     read, so a mismatch shows as a band of the wrong colour above the
     page on every load. Two previous revisions shipped stale values
     here, which is why the figures are named rather than described.

     Two entries, because there are two grounds. They are matched by
     the OS preference rather than by data-theme — the browser resolves
     them itself, with no stylesheet and no script — so a visitor who
     has explicitly chosen the palette their OS is not set to gets the
     other bar. That is the whole of what this can express, and one
     colour would be wrong for half of visitors instead of a few. */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e10" },
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
        "Rust",
        "AdonisJS",
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
      className={`${sans.variable} ${mono.variable}`}
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
        {/* Formspree endpoint prefetch for zero-latency contact form dispatch */}
        <link rel="dns-prefetch" href="https://formspree.io" />
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

          The cookie notice stays, restyled as a quiet ruled panel
          rather than a floating card.

          CORRECTION. This note used to end "and analytics must not
          load until it is answered". That was never true of the code
          and is now removed rather than softened: Analytics.tsx has
          always rendered the Plausible script unconditionally, and
          CookieNotice.tsx states in its own header that it is a
          disclosure and not a consent gate — nothing is withheld until
          it is dismissed, and dismissing it grants nothing. The
          justification is what Plausible is here: cookieless,
          aggregate-only, no identifier. Verified in a browser against
          the live site, which requests the script before the notice is
          touched. Left uncorrected, this comment is what a reader
          trusts over the components, and it had already propagated a
          false claim into the README.

          Earlier ambient chrome — a WebGL background field, a cursor
          lens, a scroll-velocity skew driver, a corner clock, an
          app-wide click-spark canvas — was removed before the previous
          redesign. All of it was decoration with no subject.

          THE REBRAND TOOK FOUR MORE THINGS OUT OF HERE, and all four
          were load-bearing for the identity being replaced rather than
          for the site:

            BatGround + BatSprite   four faint bat marks fixed behind
              every page, and the <symbol> definitions they and the
              route transition pointed at. The whole motif goes with
              the dossier.

            BrandSprite             the brand-glyph <symbol> sheet. Its
              only consumer was the skills ticker.

            SkillTicker             thirty-nine tool marks scrolling
              under the nav on a 64-second infinite transform, on every
              route, for the life of the tab. The tools it named are
              rendered properly on the home page out of the same data
              (lib/data/skills.ts via the skills section), so nothing
              factual left with it.

            InteractionFx           a click spark and a targeting
              reticle for the cursor. A reticle is a scope, and this
              design is not aiming at anything.

          The component files all survive — /projects and /hobby still
          import several of them, and those routes are redesigned in a
          later pass. What changed is what the root layout mounts. */}
      <body>
        <BootScript />
        {/* The measured half of the effects budget. BootScript guessed a
            tier from platform hints before paint; this samples the
            framerate the page actually gets once it has settled and
            lowers the tier if the guess was wrong. Renders nothing,
            runs for six seconds and then disconnects — see the header
            for why it is a bounded probe and not a monitor. */}
        <PerfGuard />
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Nav />
        {children}
        <Footer />
        <CookieNotice />
        <Analytics />
      </body>
    </html>
  );
}
