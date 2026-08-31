/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌‌​‌​​‌‌‌​‌‌‌​‌‌​​‌‌​​‌‌​​​‌‌​‌​‌​​​​​‌‌‌​‌‌​​‌‌‌​‌​‌​‌‌​‌​‌​​‌‌​‌‌‌​​‌‌​​​‌​​‌​‌​​‌‌​‌​​​‌‌​​‌‌‌​​‌‌​‌​​​​‌​​‌‌‌​‌​​​‌​​‌​​‌​‌​​‌​​​​‌​​‌​‌​​​‌‌​​​‌​‌‌​​​‌‌​‌‌​‌​​‌​‌‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.zwfcPvujnbSFsBtIHJ1ciq
 */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import GlowCard from "@/components/ui/GlowCard";
import { FiRefreshCw, FiHome, FiArrowUpRight, FiLayers, FiMail } from "react-icons/fi";

const ROUTES = [
  { href: "/", title: "Home", body: "Overview, production architecture, and work status.", icon: FiHome, go: "Go Home" },
  { href: "/projects", title: "Projects", body: "Platform builds, utilities, and tools.", icon: FiLayers, go: "View Projects" },
  { href: "/contact", title: "Contact", body: "Send a direct message.", icon: FiMail, go: "Get in Touch" },
];

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="content" tabIndex={-1} className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] pb-24 transition-colors duration-300">
      <div className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-600 dark:text-[#ff453a] mb-6 backdrop-blur-md">
          <span>Application Error</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tightest leading-[1.18] pb-1 max-w-3xl mx-auto mb-6 text-[#1d1d1f] dark:text-white">
          Let&rsquo;s try that again.
        </h1>

        <p className="text-base sm:text-lg text-[#6e6e73] dark:text-[#86868b] max-w-xl mx-auto leading-relaxed mb-4">
          A client component encountered an unexpected error. Everything you had is safe.
        </p>

        {error.digest && (
          <p className="text-xs font-mono text-[#86868b] mb-8">
            Reference code: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            type="button"
            onClick={reset}
            className="px-8 py-3.5 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="px-7 py-3.5 rounded-full bg-black/5 hover:bg-black/10 text-[#1d1d1f] border border-black/10 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white dark:border-white/15 font-semibold text-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            Back Home
          </Link>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
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
                    <h2 className="text-lg font-bold text-[#1d1d1f] dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors">
                      {r.title}
                    </h2>
                    <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
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
