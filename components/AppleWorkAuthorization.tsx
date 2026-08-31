/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌‌​‌​‌​‌‌​​‌​‌​‌‌‌​‌​​‌‌‌‌​‌‌​​‌​​​‌‌‌‌​‌​​‌‌​​‌​‌​‌​​​‌​‌​​‌‌​‌‌​​‌​‌‌​​‌​‌‌‌​‌‌​​‌​‌​‌​‌​‌​​​​‌​​‌​‌‌​‌​​​‌‌​​‌‌​‌‌‌‌​​‌​‌​‌​​‌​​‌‌​​​‌‌​‌‌​​‌​​​‌​‌​​​​​​‌‌​​​​​​‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import GlowCard from "./ui/GlowCard";
import {
  FiCheckCircle,
  FiShield,
  FiGlobe,
  FiClock,
  FiArrowUpRight,
  FiUserCheck,
  FiFileText,
  FiMapPin,
} from "react-icons/fi";

type ClearanceRegion = {
  id: "us" | "in" | "global";
  title: string;
  flag: string;
  badge: string;
  headline: string;
  statusText: string;
  summary: string;
  deploymentRegions: string[];
  engagementModels: string[];
  highlights: string[];
};

const CLEARANCE_DATA: ClearanceRegion[] = [
  {
    id: "us",
    title: "United States",
    flag: "🇺🇸",
    badge: "US Citizen",
    headline: "Full US Employment Authorization",
    statusText: "Ready for Immediate Hire (No Visa Sponsorship Needed)",
    summary:
      "Born in the United States with full legal right to work permanently for any US entity. Zero visa dependencies, no H-1B transfer overhead, and immediate start capability.",
    deploymentRegions: ["us-east-1 (N. Virginia)", "us-west-2 (Oregon)", "us-east-2 (Ohio)"],
    engagementModels: ["Full-Time W-2", "C2C / 1099 Contractor", "Direct Hire"],
    highlights: [
      "No H-1B, OPT, or employer sponsorship required",
      "Immediate onboarding capability for US entities",
      "Compliant with US tax, payroll, and background checks",
    ],
  },
  {
    id: "in",
    title: "India",
    flag: "🇮🇳",
    badge: "OCI Cardholder",
    headline: "Overseas Citizen of India (OCI)",
    statusText: "Indefinite Right to Live & Work in India",
    summary:
      "Holds permanent Overseas Citizen of India status granting indefinite multi-purpose, lifelong entry and unrestricted right to work, consult, or operate in India.",
    deploymentRegions: ["ap-south-1 (Mumbai)", "ap-south-2 (Hyderabad)", "Bangalore HQ"],
    engagementModels: ["Direct Full-Time", "Independent Consultant", "Retainer"],
    highlights: [
      "Permanent employment authorization in India",
      "No employment visa or work permit required",
      "Based in Bangalore with immediate local availability",
    ],
  },
  {
    id: "global",
    title: "Global Distributed",
    flag: "🌐",
    badge: "Global Remote",
    headline: "Multi-Region Distributed Availability",
    statusText: "High-Bandwidth Overlap with US & APAC",
    summary:
      "Experience running 24/7 mission-critical operations across distributed cross-continental engineering teams with seamless timezone handoffs.",
    deploymentRegions: ["Global Edge / AWS Multi-Region", "Azure Global WAN"],
    engagementModels: ["Global Distributed Teams", "Async First Architecture"],
    highlights: [
      "Daily real-time overlap with US Eastern & Pacific",
      "5 years enterprise cross-border collaboration track record",
      "Zero-friction remote setup with self-service tooling",
    ],
  },
];

export default function AppleWorkAuthorization() {
  const [activeTab, setActiveTab] = useState<"us" | "in" | "global">("us");
  const [times, setTimes] = useState<{ est: string; ist: string; utc: string }>({
    est: "--:--",
    ist: "--:--",
    utc: "--:--",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimes({
        est: now.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        ist: now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        utc: now.toLocaleTimeString("en-GB", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeClearance =
    CLEARANCE_DATA.find((c) => c.id === activeTab) || CLEARANCE_DATA[0];

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-black/10 dark:border-white/10">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#34c759]/10 border border-[#34c759]/30 text-emerald-700 dark:text-[#34c759] text-xs font-mono mb-3 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
            <span>Work Authorization & Global Mobility</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tightest leading-tight text-[#1d1d1f] dark:text-white">
            Authorized to work in the US and India.
          </h2>

          <p className="text-[#6e6e73] dark:text-[#86868b] text-base sm:text-lg mt-2 max-w-2xl leading-relaxed">
            Immediate hire eligibility across two primary tech hubs with zero employer visa sponsorship overhead.
          </p>
        </div>

        <Link
          href="/contact"
          className="px-6 py-3 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold text-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap self-start md:self-auto shadow-md"
        >
          Discuss a Role →
        </Link>
      </div>

      {/* Global Timezone Sync Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 mb-8 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#6e6e73] dark:text-[#86868b]">
          <FiClock className="w-3.5 h-3.5 text-amber-600 dark:text-[#e5a93b]" />
          <span>Live Operations Clocks:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-[#6e6e73] dark:text-[#86868b]">🇺🇸 US Eastern (EST):</span>
            <span className="font-bold text-[#1d1d1f] dark:text-white">{times.est}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#6e6e73] dark:text-[#86868b]">🇮🇳 India (IST):</span>
            <span className="font-bold text-[#1d1d1f] dark:text-white">{times.ist}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#6e6e73] dark:text-[#86868b]">🌐 UTC:</span>
            <span className="font-bold text-[#1d1d1f] dark:text-white">{times.utc}</span>
          </div>
        </div>
      </div>

      {/* Interactive Dual-Clearance Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Jurisdiction Selector */}
        <div className="lg:col-span-4 space-y-3">
          {CLEARANCE_DATA.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <GlowCard key={item.id} chrome={false}>
                <button
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full p-5 rounded-2xl text-left border transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-white dark:bg-white/10 border-black/25 dark:border-white/30 shadow-lg scale-[1.01]"
                      : "bg-[#f5f5f7] dark:bg-[#09090c]/80 border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl">{item.flag}</span>
                    <div>
                      <div className="font-bold text-sm text-[#1d1d1f] dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-xs text-[#6e6e73] dark:text-[#86868b] font-mono">
                        {item.badge}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-pulse" />
                  )}
                </button>
              </GlowCard>
            );
          })}
        </div>

        {/* Right Column: Holographic Digital Clearance Pass */}
        <div className="lg:col-span-8">
          <GlowCard>
            <div className="p-8 sm:p-10 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 relative overflow-hidden">
              
              {/* Top Pass Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-2xl shadow-sm">
                    {activeClearance.flag}
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-[#e5a93b] block">
                      Clearance Protocol · {activeClearance.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                      {activeClearance.headline}
                    </h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34c759]/10 text-emerald-700 dark:text-[#34c759] text-xs font-mono font-semibold self-start sm:self-auto">
                  <FiCheckCircle className="w-3.5 h-3.5" />
                  <span>Immediate Hire Ready</span>
                </div>
              </div>

              {/* Status & Summary */}
              <div className="py-6 space-y-4">
                <p className="text-sm sm:text-base text-[#424245] dark:text-[#a1a1a6] leading-relaxed">
                  {activeClearance.summary}
                </p>

                {/* Key Legal Guarantees */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {activeClearance.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-xs text-[#1d1d1f] dark:text-[#f5f5f7] flex items-start gap-2"
                    >
                      <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-[#34c759] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid: Supported Regions & Engagement Models */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-black/10 dark:border-white/10">
                <div>
                  <div className="text-xs font-mono text-[#6e6e73] dark:text-[#86868b] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <FiMapPin className="w-3.5 h-3.5" />
                    <span>Primary Target Regions</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeClearance.deploymentRegions.map((region) => (
                      <span
                        key={region}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#1d1d1f] dark:text-[#a1a1a6]"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono text-[#6e6e73] dark:text-[#86868b] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <FiFileText className="w-3.5 h-3.5" />
                    <span>Eligible Contracting Models</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeClearance.engagementModels.map((model) => (
                      <span
                        key={model}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#1d1d1f] dark:text-[#a1a1a6]"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </GlowCard>
        </div>

      </div>

    </section>
  );
}

