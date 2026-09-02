/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​​‌​​‌​‌​​‌​​‌‌‌​​​‌​‌‌‌​​​‌​‌‌‌​​‌​​‌‌‌​‌​​​‌‌‌​​​‌​‌​​‌​‌‌​‌‌‌​‌​​​‌​​‌‌‌​​‌‌​​‌​‌​‌​​​​​‌​‌​‌​‌​​​‌​‌​‌​​​‌‌​‌​‌​​‌‌​‌‌‌‌​‌‌​​‌​‌​‌​​​​‌‌​‌‌‌​‌‌‌​​‌‌​​​​​‌​‌​​‌‌​‌​​‌​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.bRqqrtqKtNeATTjoeCw0SH
 */
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import GlowCard from "@/components/ui/GlowCard";
import { CERTS } from "@/lib/certs";
import { PROJECTS } from "@/lib/projects";
import { FiArrowUpRight, FiHome, FiLayers, FiAward, FiMail } from "react-icons/fi";

export const metadata = pageMetadata({
  title: "Page Not Found",
  description: "The requested address was not found. Explore the active pages of Srinivasan's DevOps portfolio.",
  path: null,
});

const ROUTES = [
  { href: "/", title: "Home", body: "Overview, production architecture, and work status.", icon: FiHome, go: "Go Home" },
  { href: "/projects", title: "Projects", body: `${PROJECTS.length} platform builds, utilities, and open source tools.`, icon: FiLayers, go: "View Projects" },
  { href: "/certifications", title: "Certifications", body: `${CERTS.length} verified credentials and skills.`, icon: FiAward, go: "View Credentials" },
  { href: "/contact", title: "Contact", body: "Send a direct message or discuss a role.", icon: FiMail, go: "Get in Touch" },
];

export default function NotFound() {
  return (
    <main id="content" tabIndex={-1} className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] pb-24 transition-colors duration-300">
      <div className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] mb-6 backdrop-blur-md">
          <span>Error 404 · Page Not Found</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tightest leading-[1.18] pb-1 max-w-3xl mx-auto mb-6 text-[#1d1d1f] dark:text-white">
          Let&rsquo;s get you back on track.
        </h1>

        <p className="text-base sm:text-lg text-[#6e6e73] dark:text-[#86868b] max-w-xl mx-auto leading-relaxed mb-12">
          That link seems to point somewhere that no longer exists. Here are the main sections ready for you:
        </p>

        {/* 4-Card Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {ROUTES.map((r) => {
            const Icon = r.icon;
            return (
              <GlowCard key={r.href}>
                <Link
                  href={r.href}
                  className="p-6 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 transition-all flex flex-col justify-between h-full group block"
                >
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-amber-600 dark:text-[#e5a93b] mb-3 shadow-sm dark:shadow-none">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors">
                      {r.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                      {r.body}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1d1d1f] dark:text-white">
                    <span>{r.go}</span>
                    <FiArrowUpRight className="w-4 h-4 text-amber-600 dark:text-[#e5a93b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              </GlowCard>
            );
          })}
        </div>

      </div>
    </main>
  );
}
