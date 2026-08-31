/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌‌​​‌​‌‌​​​​‌​‌‌‌​​‌‌​‌​‌‌​‌​​‌​‌​‌‌​​‌‌‌​​​‌​‌‌‌​‌‌​​‌‌‌​​‌​​‌​‌​‌‌‌​‌‌‌​​‌​​‌‌‌​​‌​​​‌‌‌​​‌​‌‌​‌​‌‌​‌​‌​​​​​​‌‌​​‌​​‌‌​‌​​​​‌‌‌​‌​‌​‌‌​​‌​‌​‌​​‌‌‌​​‌‌‌‌​‌​​​‌​‌‌​‌​‌​​​‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.yasZVqvrWrr9kP2hueNz-G
 */
"use client";

import { useMemo, useState } from "react";
import { CERTS, ROWS, forRow, type Cert } from "@/lib/certs";
import GlowCard from "./ui/GlowCard";
import {
  FiAward,
  FiExternalLink,
  FiCheckCircle,
  FiSearch,
  FiCalendar,
} from "react-icons/fi";

export default function CertIndex() {
  const [rowId, setRowId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(
    () => Object.fromEntries(ROWS.map((r) => [r.id, forRow(r).length])),
    []
  );

  const yearBreakdown = useMemo(() => {
    return {
      "2026": CERTS.filter((c) => c.year === "2026").length,
      "2025": CERTS.filter((c) => c.year === "2025").length,
      "2023": CERTS.filter((c) => c.year === "2023").length,
      "2021": CERTS.filter((c) => c.year === "2021").length,
    };
  }, []);

  const filteredCerts = useMemo(() => {
    const row = ROWS.find((r) => r.id === rowId) ?? ROWS[0];
    const baseList = forRow(row);

    const q = searchQuery.toLowerCase().trim();
    if (!q) return baseList;

    return baseList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)) ||
        c.date.toLowerCase().includes(q)
    );
  }, [rowId, searchQuery]);

  return (
    <main
      id="content"
      tabIndex={-1}
      className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] pb-24 transition-colors duration-300 selection:bg-[#e5a93b]/30 selection:text-black dark:selection:text-white"
    >
      {/* 1. Hero Section */}
      <header className="pt-20 pb-12 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] mb-6 backdrop-blur-md">
          <FiAward className="w-3.5 h-3.5 text-amber-600 dark:text-[#e5a93b]" />
          <span>Continuous Learning & Verification</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest leading-[1.18] pb-1 max-w-4xl mx-auto mb-6 text-[#1d1d1f] dark:text-white">
          Certifications & verified skills.
        </h1>

        <p className="text-base sm:text-xl font-normal text-[#6e6e73] dark:text-[#86868b] max-w-2xl mx-auto leading-relaxed mb-8">
          24 verified industry credentials covering cloud platforms (AWS & Azure), automation (Ansible & IaC), Linux systems, and observability. Every credential links to its official permanent verification ID.
        </p>

        {/* Yearly Growth Timeline Counters */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-[#6e6e73] dark:text-[#86868b] mb-10 pb-8 border-b border-black/10 dark:border-white/10 max-w-3xl mx-auto">
          <div className="flex items-center gap-1.5">
            <FiCalendar className="w-3.5 h-3.5 text-amber-600 dark:text-[#e5a93b]" />
            <span>2026 ({yearBreakdown["2026"]})</span>
          </div>
          <div>•</div>
          <div>2025 ({yearBreakdown["2025"]})</div>
          <div>•</div>
          <div>2023 ({yearBreakdown["2023"]})</div>
          <div>•</div>
          <div>2021 ({yearBreakdown["2021"]})</div>
          <div>•</div>
          <span className="text-emerald-600 dark:text-[#34c759] font-semibold">
            ✓ 100% Issuer Verified
          </span>
        </div>

        {/* Search & Category Filter Matrix */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by credential or skill (e.g. Ansible, Azure, Chef, Puppet, Datadog)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {ROWS.map((r) => {
              const isSelected = rowId === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRowId(r.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-md scale-105"
                      : "bg-[#f5f5f7] hover:bg-black/5 dark:bg-[#09090c]/80 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  }`}
                >
                  <span>{r.label}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? "opacity-75" : "text-[#86868b] dark:text-[#a1a1a6]"
                    }`}
                  >
                    {counts[r.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. Credentials Bento Grid */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 text-xs text-[#6e6e73] dark:text-[#86868b] font-mono px-2">
          <span>Showing {filteredCerts.length} verified credentials</span>
          <span>Issuer: LinkedIn Learning</span>
        </div>

        {filteredCerts.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10">
            <FiAward className="w-8 h-8 mx-auto text-[#86868b] mb-3" />
            <h3 className="text-lg font-bold text-[#1d1d1f] dark:text-white mb-1">
              No certifications found matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-xs text-[#6e6e73] dark:text-[#86868b] mb-4">
              Try searching for &ldquo;Azure&rdquo;, &ldquo;Ansible&rdquo;, &ldquo;Chef&rdquo;, or &ldquo;Puppet&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setRowId("all");
              }}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-black text-white dark:bg-white dark:text-black"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <GlowCard key={cert.url}>
                <article className="p-6 sm:p-7 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 flex flex-col justify-between h-full hover:border-black/25 dark:hover:border-white/25 transition-all group">
                  <div>
                    {/* Seal & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-amber-600 dark:text-[#e5a93b] group-hover:scale-110 transition-transform shadow-sm dark:shadow-none">
                        <FiAward className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono text-[#6e6e73] dark:text-[#86868b]">
                        {cert.date}
                      </span>
                    </div>

                    {/* Cert Name */}
                    <h2 className="text-lg font-bold text-[#1d1d1f] dark:text-white tracking-tight mb-4 group-hover:text-[#0066cc] dark:group-hover:text-[#f5f5f7] transition-colors leading-snug">
                      {cert.name}
                    </h2>

                    {/* Skills Tags */}
                    {cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {cert.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-[#424245] dark:text-[#a1a1a6]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Verification CTA */}
                  <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[11px] font-mono text-[#6e6e73] dark:text-[#86868b] flex items-center gap-1">
                      <FiCheckCircle className="w-3.5 h-3.5 text-[#34c759]" />
                      Verified ID
                    </span>

                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#0066cc] dark:text-[#2997ff] hover:underline"
                      aria-label={`Verify credential for ${cert.name}`}
                    >
                      <span>Verify ↗</span>
                      <FiExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </article>
              </GlowCard>
            ))}
          </div>
        )}
      </section>

      {/* 3. Footer */}
      <footer className="mt-20 px-6 max-w-4xl mx-auto text-center text-xs text-[#6e6e73] dark:text-[#86868b] border-t border-black/10 dark:border-white/10 pt-10">
        <p>
          All 24 certifications are official credentials issued by LinkedIn Learning and verified with permanent certificate IDs.
        </p>
      </footer>
    </main>
  );
}
