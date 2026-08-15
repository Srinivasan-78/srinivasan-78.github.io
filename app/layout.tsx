import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Cursor from "@/components/Cursor";
import ProgressRail from "@/components/ProgressRail";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ThemeScript from "@/components/ThemeScript";
import VelocitySkew from "@/components/VelocitySkew";
import Hud from "@/components/Hud";
import VantaBackground from "@/components/VantaBackground";

// themeColor belongs on the viewport export in Next 14; leaving it in
// metadata still works but logs a deprecation warning at build time.
export const viewport: Viewport = {
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.srinidevops.com"),
  alternates: { canonical: "/" },
  title: "Srinivasan Vijayaraghavan — DevOps Engineer",
  description:
    "DevOps Engineer specializing in CI/CD, cloud infrastructure, and automation across AWS and Azure. 5 years turning fragile deployments into reliable pipelines.",
  authors: [{ name: "Srinivasan Vijayaraghavan" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Srinivasan Vijayaraghavan",
    title: "Srinivasan Vijayaraghavan — DevOps Engineer",
    description:
      "DevOps Engineer specializing in CI/CD, cloud infrastructure, and automation across AWS and Azure.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Srinivasan Vijayaraghavan, DevOps Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Srinivasan Vijayaraghavan — DevOps Engineer",
    description:
      "DevOps Engineer specializing in CI/CD, cloud infrastructure, and automation across AWS and Azure.",
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Srinivasan Vijayaraghavan",
  url: "https://www.srinidevops.com/",
  image: "https://www.srinidevops.com/og.png",
  jobTitle: "DevOps Engineer",
  description:
    "DevOps Engineer specializing in CI/CD, cloud infrastructure, and automation across AWS and Azure.",
  email: "mailto:srinivasan.shyam2000@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: "Thomson Reuters" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Madras Institute of Technology, Anna University" },
  knowsAbout: [
    "DevOps", "CI/CD", "Amazon Web Services", "Microsoft Azure", "Ansible", "Terraform",
    "Docker", "GitHub Actions", "Kubernetes", "Datadog", "Infrastructure as Code", "Disaster Recovery",
  ],
  sameAs: ["https://www.linkedin.com/in/srini-solution-architect/", "https://github.com/Srinivasan-78"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set here in the server markup rather than left to a
    // script: dark is the unconditional default, so it must be correct
    // even if JS never runs. ThemeScript only downgrades to light for a
    // visitor who explicitly chose it.
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="grain">
        <ThemeScript />
        <VantaBackground />
        <ProgressRail />
        <VelocitySkew />
        <Hud />
        <Cursor />
        <SmoothScrollProvider>
          <Nav />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
