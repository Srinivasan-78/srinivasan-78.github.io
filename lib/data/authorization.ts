/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌‌​​‌​‌​​‌‌​‌​‌​​​‌‌‌​‌‌​‌‌​​​‌​​​‌‌‌​‌​​​‌​​​‌‌​‌​‌‌​​‌‌‌​​‌​​‌‌​‌​‌​‌​​​‌​​​‌‌​‌​​‌​‌‌‌‌​​‌​‌​‌​​​‌​‌‌​‌​‌​​‌​​​‌​​​‌‌​‌‌‌‌​‌‌‌‌​​​​‌​​‌​‌​​‌‌‌‌​​‌​‌‌‌​‌​‌​‌‌​‌​​‌​‌​‌‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.9MGlGDk95DiyQjDoxJyuiY
 */

/* Work authorization, as data. The flag emoji stay — they are content a
   visitor reads, not styling. */

export type ClearanceRegionId = "us" | "in" | "global";

export type ClearanceRegion = {
  id: ClearanceRegionId;
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

export const CLEARANCE_DATA: ClearanceRegion[] = [
  {
    id: "us",
    title: "United States",
    flag: "🇺🇸",
    badge: "US Citizen",
    headline: "Full US Employment Authorization",
    statusText: "Ready for Immediate Hire (No Visa Sponsorship Needed)",
    summary:
      "A U.S. Citizen with full legal right to work permanently for any US entity. Zero visa dependencies, no H-1B transfer overhead, and immediate start capability.",
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

/* The operations clocks strip. The times themselves are computed at
   render; these are the zones and the labels they are read under. */
export type OperationsClock = {
  id: "est" | "ist" | "utc";
  label: string;
  timeZone: string;
  locale: string;
  hour12: boolean;
};

export const OPERATIONS_CLOCKS: OperationsClock[] = [
  { id: "est", label: "🇺🇸 US Eastern (EST):", timeZone: "America/New_York", locale: "en-US", hour12: true },
  { id: "ist", label: "🇮🇳 India (IST):", timeZone: "Asia/Kolkata", locale: "en-IN", hour12: true },
  { id: "utc", label: "🌐 UTC:", timeZone: "UTC", locale: "en-GB", hour12: false },
];

export const AUTHORIZATION_COPY = {
  eyebrow: "Work Authorization & Global Mobility",
  heading: "Authorized to work in the US and India.",
  body: "Immediate hire eligibility across two primary tech hubs with zero employer visa sponsorship overhead.",
  cta: "Discuss a Role →",
  clocksLabel: "Live Operations Clocks:",
  /* Shown with no time yet resolved, before the first client tick. */
  clockPlaceholder: "--:--",
  passBadgePrefix: "Clearance Protocol ·",
  readyBadge: "Immediate Hire Ready",
  regionsLabel: "Primary Target Regions",
  engagementLabel: "Eligible Contracting Models",
} as const;

/* The same two facts as they appear on the contact page, where they are
   stated as prose rather than as a selectable pass. */
export const AUTHORIZATION_NOTICE = {
  title: "Work Authorization Status",
  unitedStatesLabel: "United States:",
  unitedStates: "US Citizen (Immediate hire, zero visa sponsorship required).",
  indiaLabel: "India:",
  india: "OCI Cardholder (Indefinite right to live and work in India).",
  summary: "U.S. Citizen · OCI Holder — authorized to work in the United States and India.",
} as const;
