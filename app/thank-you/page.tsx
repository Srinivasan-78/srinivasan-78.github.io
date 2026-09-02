/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌‌‌‌‌​‌‌‌​​​​​‌‌​‌​​​​‌‌​‌‌​‌​‌​​​​​‌​‌​‌​​​‌​‌​​​​‌‌​‌​​‌​​​​​‌‌​​‌​​‌​​‌‌‌​​‌​‌‌​​​​‌‌​‌‌​​​​‌‌​​​​​‌‌‌‌​​​​‌‌​‌​‌‌​‌‌‌​‌‌​​‌​​​​‌‌​‌​​​​‌​​‌‌​​‌‌‌​‌​​‌​‌​​​‌‌​​​​​​‌‌​‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1._phmAQCH2NXl0xkvCBgJ05
 */
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import GlowCard from "@/components/ui/GlowCard";
import { PROJECTS } from "@/lib/projects";
import { CERTS } from "@/lib/certs";
import { FiCheckCircle, FiArrowUpRight, FiLayers, FiAward, FiDownload, FiHome } from "react-icons/fi";

export const metadata = pageMetadata({
  title: "Message Sent",
  description: "Your message reached my inbox. I answer genuine enquiries within a couple of working days.",
  path: "/thank-you",
  noindex: true,
});

const NEXT = [
  { href: "/projects", title: "Projects", body: `${PROJECTS.length} platform builds, utilities and open source repos.`, icon: FiLayers, go: "View Projects" },
  { href: "/certifications", title: "Certifications", body: `${CERTS.length} verified credentials with direct ID check links.`, icon: FiAward, go: "View Credentials" },
  { href: "/resume.pdf", title: "Résumé", body: "The one-page summary in PDF format.", icon: FiDownload, go: "Download Résumé", download: true },
];

export default function ThankYou() {
  return (
    <main id="content" tabIndex={-1} className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] pb-24 transition-colors duration-300">
      <div className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#34c759]/10 border border-[#34c759]/30 text-emerald-700 dark:text-[#34c759] text-xs font-mono mb-6 backdrop-blur-md">
          <FiCheckCircle className="w-4 h-4" />
          <span>Message Delivered Safely</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tightest leading-[1.12] pb-1 max-w-3xl mx-auto mb-6 text-[#1d1d1f] dark:text-white">
          Thank you for reaching out.
        </h1>

        <p className="text-base sm:text-lg text-[#6e6e73] dark:text-[#86868b] max-w-xl mx-auto leading-relaxed mb-12">
          Your message has landed in my primary inbox. I read every email and typically reply within 24–48 hours.
        </p>

        {/* 3-Card Explore Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-12">
          {NEXT.map((n) => {
            const Icon = n.icon;
            return n.download ? (
              <GlowCard key={n.href}>
                <a
                  href={n.href}
                  download
                  className="p-6 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 transition-all flex flex-col justify-between h-full group block"
                >
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-amber-600 dark:text-[#e5a93b] mb-3 shadow-sm dark:shadow-none">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-[#1d1d1f] dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors">
                      {n.title}
                    </h2>
                    <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                      {n.body}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1d1d1f] dark:text-white">
                    <span>{n.go}</span>
                    <FiArrowUpRight className="w-4 h-4 text-amber-600 dark:text-[#e5a93b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              </GlowCard>
            ) : (
              <GlowCard key={n.href}>
                <Link
                  href={n.href}
                  className="p-6 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 transition-all flex flex-col justify-between h-full group block"
                >
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-amber-600 dark:text-[#e5a93b] mb-3 shadow-sm dark:shadow-none">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-[#1d1d1f] dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors">
                      {n.title}
                    </h2>
                    <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                      {n.body}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1d1d1f] dark:text-white">
                    <span>{n.go}</span>
                    <FiArrowUpRight className="w-4 h-4 text-amber-600 dark:text-[#e5a93b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              </GlowCard>
            );
          })}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black/5 hover:bg-black/10 text-[#1d1d1f] border border-black/10 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white dark:border-white/15 font-semibold text-sm transition-all hover:scale-105 active:scale-95"
        >
          <FiHome className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </main>
  );
}
