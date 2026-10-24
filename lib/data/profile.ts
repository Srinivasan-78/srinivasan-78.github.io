/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​‌​​​‌​‌​​‌‌​‌​​‌‌​​​‌​​‌​‌​​​‌‌​‌​​​​‌‌​​​‌​​‌‌​​​‌​‌​‌‌‌‌‌​‌‌‌‌​​‌​‌​​​​‌‌​​‌‌​​‌‌​‌‌‌​‌‌​​​‌‌​‌​​​‌​‌​‌​‌​‌​‌​​‌​​​‌‌​‌​‌​‌​​‌​​​​‌‌‌​​​​​​‌​‌‌​‌​​‌‌​‌​​​‌‌​​‌‌​​‌‌‌​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.TSLJ411_yC3v4UR5Hp-4fv
 */

/* Identity, the numbers, and every page's copy — as data.

   The counts are read from the already-clean data modules rather than
   typed out again, so a prose sentence and the grid it describes cannot
   disagree. `lib/projects.ts` and `lib/certs.ts` are imported for their
   lengths only; nothing here re-exports them. */

import { PROJECTS } from "@/lib/projects";
import { CERTS } from "@/lib/certs";

/* ------------------------------------------------------------------ */
/* Identity                                                            */
/* ------------------------------------------------------------------ */

export type Profile = {
  name: string;
  role: string;
  roleShort: string;
  location: string;
  locationShort: string;
  email: string;
  phone: string;
  /** The phone number in `tel:` form, which is not the displayed form. */
  phoneHref: string;
  linkedin: { url: string; handle: string };
  github: { url: string; handle: string };
  website: { url: string; host: string };
  resumePath: string;
  alumniOf: string;
  currentEmployer: string;
};

export const PROFILE: Profile = {
  name: "Srinivasan Vijayaraghavan",
  role: "DevOps / Site Reliability Engineer",
  roleShort: "DevOps Engineer",
  location: "Bangalore, India",
  locationShort: "Bangalore, IN",
  email: "srinivasan.shyam2000@gmail.com",
  phone: "+91 97910 25934",
  phoneHref: "tel:+919791025934",
  linkedin: {
    url: "https://www.linkedin.com/in/srini-solution-architect/",
    handle: "srini-solution-architect",
  },
  github: {
    url: "https://github.com/Srinivasan-78",
    handle: "github.com/Srinivasan-78",
  },
  website: {
    url: "https://www.srinidevops.com",
    host: "srinidevops.com",
  },
  resumePath: "/resume.pdf",
  alumniOf: "Madras Institute of Technology, Anna University",
  currentEmployer: "Thomson Reuters",
};

/* The footer's outbound and internal links, in the order they are read.
   Kept separate from `lib/nav.ts`: the footer carries the legal pages
   and the two profiles, which the header deliberately does not. */
export type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

export const FOOTER_LINKS: FooterLink[] = [
  { href: "/projects", label: "Projects" },
  /* The games used to be a coda at the foot of /projects, so this
     linked to `#off-the-clock` on that page. They are a route of their
     own now — a coda beneath twenty project panels is a section nobody
     reaches, which is the whole reason the anchor had to exist in the
     first place. */
  { href: "/hobby", label: "Hobby" },
  { href: "/certifications", label: "Certifications" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: PROFILE.linkedin.url, label: "LinkedIn ↗", external: true },
  { href: PROFILE.github.url, label: "GitHub ↗", external: true },
];

export const FOOTER_COPY = {
  /* The year is resolved at render — only the shape is fixed here. */
  copyrightSuffix: `${PROFILE.name} · ${PROFILE.locationShort}`,
} as const;

/* ------------------------------------------------------------------ */
/* The numbers                                                         */
/* ------------------------------------------------------------------ */

export type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

export const STATS: Stat[] = [
  { value: 5, suffix: " Years", label: "Keeping production running at scale" },
  { value: 15, suffix: "+", label: "Microservices architected & maintained" },
  { value: CERTS.length, label: "Verified industry credentials earned" },
  { value: 2, suffix: " Clouds", label: "Deep production experience (AWS & Azure)" },
  { value: 100, suffix: "%", label: "Data integrity held across same-region & cross-region Azure DR migrations" },
  { value: 17, suffix: " Languages", label: "Parsed by repo2graph, his open-source MCP server for AI coding agents" },
];

/* The credentials the closing banner states plainly. They carried a
   check glyph in the markup; the glyph was decoration and the claim is
   the data.

   Two entries were removed here, not lost: "US Citizen (No visa
   sponsorship needed)" and "OCI Cardholder (India)". The closing banner
   sits one section below the work-authorisation grid, which already
   states both facts with their regions, contracting models and local
   availability — so printing them again at the foot of the same page
   was the seventh and eighth time a visitor had read them. The
   authoritative statement lives in `lib/data/authorization.ts` and is
   rendered once, in the clearance section.

   What is left is the two claims that section does not make. */
export const TRUST_MARKS: string[] = [
  "5 Years Enterprise Cloud Track Record",
  "Open-Source MCP Server Maintainer",
];

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

export const HOME_COPY = {
  eyebrow: `${PROFILE.name} · ${PROFILE.role} · ${PROFILE.locationShort}`,
  headline: "I build infrastructure that makes shipping software feel easy.",
  bio: "Five years automating releases, cloud migrations, and disaster recovery across AWS and Azure. At Thomson Reuters I own release, upgrade and disaster-recovery automation for a multitenant Azure platform of 15+ microservices, built on GitHub Actions, Ansible and Datadog. I design resilient systems so engineering teams can focus on building products, not fighting deployments.",

  /* The open-source side of the same discipline. Split around the one
     inline link rather than stored as markup, so the sentence survives
     whatever the link is rendered as. */
  bioSecondary: {
    before: "I also maintain ",
    link: { href: "/projects/repo2graph", label: "repo2graph" },
    after: ", an open-source MCP server that gives AI coding agents cited, token-bounded answers about any codebase.",
  },

  ctaContact: "Get in touch",
  ctaResume: "Download Résumé",
  ctaProjects: `Explore all ${PROJECTS.length} builds`,

  reliability: {
    eyebrow: "Reliability by Design",
    heading: "How I approach zero-downtime releases.",
    body: "Every step is automated, measured, and verified before user traffic touches it. If something looks off, traffic reverts immediately.",
  },

  sideProjects: {
    eyebrow: "Side Projects & Tools",
    heading: "Things I’ve built on the side.",
    body: "Practical tools, deployment orchestrators, AI developer tooling, and browser utilities I use in my day-to-day workflow — including repo2graph, an MIT-licensed code-graph engine and MCP server shipped on PyPI, npm, Docker and the GitHub Marketplace.",
    bullets: [
      `${PROJECTS.length} Production Builds`,
      "Self-Healing Pipelines",
      "Open Source Tools",
      "MCP Servers & Agentic Workflows",
    ],
    cta: `Explore All ${PROJECTS.length} Projects`,
    ctaNote: "Interactive filters, live demos & source code",
  },

  closing: {
    heading: "Let’s build something dependable together.",
    body: "I’m open to senior DevOps, Site Reliability Engineering, Cloud Architecture, and AI developer-tooling roles. Let’s talk about what your team is building.",
    ctaPrimary: "Start a Conversation",
    ctaSecondary: "LinkedIn Profile",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

/* The two builds that lead the index, in order. Kept as slugs rather than a
   flag on the project so the running order is one edit in one place, and a
   slug that no longer exists simply drops out instead of rendering an empty
   card. */
export const FEATURED_SLUGS: string[] = ["self-healing-deployment", "repo2graph"];

export const FEATURED_LABELS: string[] = [
  "Featured Flagship Build",
  "Highlighted Build — AI & Code Intelligence",
];

/** Used for a featured slot beyond the two that have their own label. */
export const FEATURED_LABEL_FALLBACK = "Highlighted Build";

export const PROJECTS_COPY = {
  metaTitle: "Projects",
  metaDescription:
    "Platform engineering experiments, AI developer tooling and MCP servers, homelab automation and small tools, with live demos and public repos — including repo2graph, an open-source code-graph engine for AI coding agents.",
  eyebrow: "Platform Engineering & Open Source",
  heading: "Things I build for the craft of it.",
  body: `${PROJECTS.length} platform orchestrators, deployment tools, and cloud utilities. Designed to solve real infrastructure problems and tested in production.`,
  statTotalSuffix: "Total Builds",
  statDemosSuffix: "Live Hosted Deployments",
  statTested: "100% Tested Architecture",
  searchPlaceholder: "Search by project name, technology (e.g. Docker, Ansible, Python, Azure)...",
  clearLabel: "Clear",
  allFilterLabel: "All",
  filterPrefix: "Filter:",
  showMoreNoun: "builds",
  emptyHeadingPrefix: "No projects found matching",
  emptyBody: "Try searching for “Docker”, “Ansible”, “Azure”, or “Python”.",
  emptyReset: "Reset Filters",
  featuredDemoCta: "Launch Live Demo",
  featuredArchitectureCta: "System Architecture",
  cardReadCta: "Read Overview",
  cardDemoCta: "Live App",

  contributions: {
    eyebrow: "Open-Source Contributions",
    heading: "Patches sent to other people’s projects",
    body: "Forks where I fixed a bug or extended behaviour upstream and sent the change back as a pull request.",
    viewPr: "View pull request",
    privateRepo: "Upstream repository is private",
    mergedLabel: "Merged",
    openLabel: "Open",
  },

  footerNote: `Built with care by ${PROFILE.name}.`,
  footerExplorePrefix: "Explore all repositories on",
  footerExploreLink: "GitHub ↗",
} as const;

/** Copy for a single project's dossier page. */
export const PROJECT_DETAIL_COPY = {
  back: "Back to Projects",
  statusPrefix: "Status:",
  stackCountSuffix: "technologies in stack",
  overviewEyebrow: "Overview",
  overviewHeading: "Architecture Overview",
  breakdownEyebrow: "Architecture Breakdown",
  breakdownHeading: "How it works",
  breakdownBody: "Core mechanics, failure recovery paths, and system design decisions.",
  stepPrefix: "Step",
  highlightsEyebrow: "Key Takeaways",
  highlightsHeading: "Engineering Highlights",
  stackEyebrow: "Stack & Tools",
  stackHeading: "Technologies Used",
  noLinksCta: "Ask me about this project",
  noLinksNote: "Internal enterprise or private repository",
  demoActionLabel: "Open live build ↗",
  prevLabel: "Previous Build",
  nextLabel: "Next Build",
  directoryLabel: "Directory",
  moreHeading: "Explore More Projects",
  moreAllPrefix: "All",
  moreAllSuffix: "builds",
  moreCardCta: "Overview",
  /** The diagram caption, which names the project it is drawing. */
  diagramCaption: (title: string) => `System Architecture: How ${title} functions.`,
} as const;

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */

export const CERTIFICATIONS_COPY = {
  metaTitle: "Certifications",
  metaDescription: `${CERTS.length} verified credentials across cloud platforms, automation, infrastructure as code and observability.`,
  eyebrow: "Continuous Learning & Verification",
  heading: "Certifications & verified skills.",
  body: "24 verified industry credentials covering cloud platforms (AWS & Azure), automation (Ansible & IaC), Linux systems, and observability. Every credential links to its official permanent verification ID.",
  /* The years the timeline strip counts, in the order it reads them. */
  timelineYears: ["2026", "2025", "2023", "2021"],
  verifiedStrip: "100% Issuer Verified",
  searchPlaceholder: "Search by credential or skill (e.g. Ansible, Azure, Chef, Puppet, Datadog)...",
  clearLabel: "Clear",
  issuerLabel: "Issuer: LinkedIn Learning",
  showingPrefix: "Showing",
  showingSuffix: "verified credentials",
  verifiedIdLabel: "Verified ID",
  verifyCta: "Verify ↗",
  showMoreNoun: "credentials",
  emptyHeadingPrefix: "No certifications found matching",
  emptyBody: "Try searching for “Azure”, “Ansible”, “Chef”, or “Puppet”.",
  emptyReset: "Reset Filters",
  footerNote:
    "All 24 certifications are official credentials issued by LinkedIn Learning and verified with permanent certificate IDs.",
} as const;

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export type ContactIconToken =
  | "mail"
  | "phone"
  | "linkedin"
  | "github"
  | "globe"
  | "download";

export type ContactMethod = {
  id: string;
  /** Mono label above the value. */
  label: string;
  /** What the visitor reads as the value. */
  value: string;
  href: string;
  /** The small action word at the end of the row. */
  action: string;
  icon: ContactIconToken;
  external?: boolean;
  download?: boolean;
  /** The row offers a copy-to-clipboard control as well as the link. */
  copyable?: boolean;
};

export const CONTACT_METHODS: ContactMethod[] = [
  {
    id: "email",
    label: "Email Directly",
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    action: "Copy",
    icon: "mail",
    copyable: true,
  },
  /* Phone — as published on the résumé. */
  {
    id: "phone",
    label: "Phone",
    value: PROFILE.phone,
    href: PROFILE.phoneHref,
    action: "Call ↗",
    icon: "phone",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: PROFILE.linkedin.handle,
    href: PROFILE.linkedin.url,
    action: "Connect ↗",
    icon: "linkedin",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: PROFILE.github.handle,
    href: PROFILE.github.url,
    action: "Source ↗",
    icon: "github",
    external: true,
  },
  {
    id: "website",
    label: "Website",
    value: PROFILE.website.host,
    href: PROFILE.website.url,
    action: "Home ↗",
    icon: "globe",
  },
  {
    id: "resume",
    label: "Résumé",
    value: "Download PDF",
    href: PROFILE.resumePath,
    action: "Save ↓",
    icon: "download",
    download: true,
  },
];

/** The copy-email control's two states. */
export const COPY_EMAIL_COPY = {
  idle: "Copy",
  copied: "Copied",
  linkTitle: "Open mail client",
  buttonTitle: "Copy email to clipboard",
} as const;

export type ContactFormField = {
  id: "name" | "email" | "message";
  label: string;
  placeholder: string;
  autoComplete?: string;
  type: "text" | "email" | "textarea";
  rows?: number;
  /** Minimum accepted length, when the field states one. */
  minLength?: number;
  required: boolean;
  errors: {
    missing: string;
    invalid: string;
  };
};

export const CONTACT_FORM_FIELDS: ContactFormField[] = [
  {
    id: "name",
    label: "Your Name",
    placeholder: "Jane Doe",
    autoComplete: "name",
    type: "text",
    minLength: 2,
    required: true,
    errors: {
      missing: "Please enter your name.",
      invalid: "Please provide a valid name.",
    },
  },
  {
    id: "email",
    label: "Email Address",
    placeholder: "jane@company.com",
    autoComplete: "email",
    type: "email",
    required: true,
    errors: {
      missing: "Please enter your email so I can reply.",
      invalid: "Please enter a valid email address.",
    },
  },
  {
    id: "message",
    label: "Message",
    placeholder: "Tell me about the role, project, or infrastructure challenge...",
    type: "textarea",
    rows: 5,
    minLength: 10,
    required: true,
    errors: {
      missing: "Please write a brief message.",
      invalid: "Please provide a little more detail (10+ characters).",
    },
  },
];

export const CONTACT_FORM_COPY = {
  /* Formspree, as documented on the privacy page. */
  endpoint: "https://formspree.io/f/xrpzzlaz",
  submit: "Send Message",
  submitting: "Sending message...",
  counterEmpty: "10 min chars",
  counterSuffix: "chars (10 min)",
  submitFailed: `Submission failed. Please try again or email me directly at ${PROFILE.email}.`,
  networkFailed: `Network connection error. Please try again or email me directly at ${PROFILE.email}.`,
  successPath: "/thank-you",
} as const;

export const CONTACT_COPY = {
  metaTitle: "Contact",
  metaDescription: "Get in touch about DevOps, cloud infrastructure and automation roles.",
  eyebrow: `Direct Contact · ${PROFILE.locationShort}`,
  heading: "Let’s work together.",
  body: "Whether you’re hiring for a senior DevOps, Site Reliability, Cloud Architecture or AI developer-tooling role, or want to talk through an infrastructure challenge, feel free to reach out.",
  /* The résumé's own contact line, repeated verbatim under the lead. */
  contactLine: `${PROFILE.location} · ${PROFILE.phone} · ${PROFILE.email}`,
  formHeading: "Send a Message",
  formBody: "Fill in your details below. Messages go straight to my primary inbox.",
  responseLabel: "Response Time",
  responseHeadline: "Typically responds within 24 hours",
  responseBody: "Available for interviews, technical consultations, and architecture discussions.",
} as const;

/* ------------------------------------------------------------------ */
/* Thank you / 404                                                     */
/* ------------------------------------------------------------------ */

export type DestinationCard = {
  href: string;
  title: string;
  body: string;
  go: string;
  icon: "home" | "layers" | "award" | "mail" | "download";
  download?: boolean;
};

export const THANK_YOU_COPY = {
  metaTitle: "Message Sent",
  metaDescription:
    "Your message reached my inbox. I answer genuine enquiries within a couple of working days.",
  eyebrow: "Message Delivered Safely",
  heading: "Thank you for reaching out.",
  body: "Your message has landed in my primary inbox. I read every email and typically reply within 24–48 hours.",
  home: "Back to Homepage",
} as const;

export const THANK_YOU_NEXT: DestinationCard[] = [
  { href: "/projects", title: "Projects", body: `${PROJECTS.length} platform builds, utilities and open source repos.`, icon: "layers", go: "View Projects" },
  { href: "/certifications", title: "Certifications", body: `${CERTS.length} verified credentials with direct ID check links.`, icon: "award", go: "View Credentials" },
  { href: PROFILE.resumePath, title: "Résumé", body: "The one-page summary in PDF format.", icon: "download", go: "Download Résumé", download: true },
];

export const NOT_FOUND_COPY = {
  metaTitle: "Page Not Found",
  metaDescription:
    "The requested address was not found. Explore the active pages of Srinivasan's DevOps portfolio.",
  eyebrow: "Error 404 · Page Not Found",
  heading: "Let’s get you back on track.",
  body: "That link seems to point somewhere that no longer exists. Here are the main sections ready for you:",
} as const;

export const NOT_FOUND_ROUTES: DestinationCard[] = [
  { href: "/", title: "Home", body: "Overview, production architecture, and work status.", icon: "home", go: "Go Home" },
  { href: "/projects", title: "Projects", body: `${PROJECTS.length} platform builds, utilities, and open source tools.`, icon: "layers", go: "View Projects" },
  { href: "/certifications", title: "Certifications", body: `${CERTS.length} verified credentials and skills.`, icon: "award", go: "View Credentials" },
  { href: "/contact", title: "Contact", body: "Send a direct message or discuss a role.", icon: "mail", go: "Get in Touch" },
];

/* ------------------------------------------------------------------ */
/* Legal                                                               */
/* ------------------------------------------------------------------ */

/* The legal pages are prose, so they are stored as prose: a lead
   paragraph and an ordered list of sections, each with a heading and its
   paragraphs. Inline links are held as their own records on the section
   rather than as markup inside a string, so the words survive whatever
   element ends up wrapping them. */

export type LegalLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type LegalSection = {
  heading: string;
  /** Paragraphs, in order. */
  paragraphs: string[];
  /** The bulleted list this section carries, if any. */
  bullets?: { label?: string; text: string }[];
  /** Links referenced from this section's prose. */
  links?: LegalLink[];
};

export const PRIVACY_COPY = {
  metaTitle: "Privacy Policy",
  metaDescription:
    "What this site stores, and how the contact form and analytics look after your data.",
  eyebrow: "Legal & Privacy",
  heading: "Privacy Policy",
  updated: "18 August 2026",
  updatedPrefix: "Last updated:",
  lead:
    "This is a personal portfolio, and your visit stays refreshingly simple. It’s a static site with no application server, no user accounts and no database behind it. Below is exactly what happens to your data when you visit.",
  sections: [
    {
      heading: "Who runs this site",
      paragraphs: [
        `${PROFILE.name}, an individual based in ${PROFILE.location}. For any privacy question or request, email ${PROFILE.email}.`,
      ],
      links: [{ label: PROFILE.email, href: `mailto:${PROFILE.email}` }],
    },
    {
      heading: "What the site stores in your browser",
      paragraphs: [
        "The site sets no tracking cookies and no advertising cookies. It uses one entry of browser localStorage:",
        "Your browser keeps it locally, and you can clear it any time through its site-data settings. It stays on your own device.",
      ],
      bullets: [
        {
          label: "Notice dismissal",
          text: "remembers that you closed the privacy notice, so it is not shown on every page.",
        },
      ],
    },
    {
      heading: "Analytics",
      paragraphs: [
        "Site traffic is measured with Plausible Analytics, a privacy-focused, cookieless analytics service. Plausible does not set cookies, does not collect personal data, and does not track visitors across sites or over time. It records aggregate counts only: page URL, referrer, country, and the general browser and device type. Every visitor stays anonymous, and the numbers serve one purpose: telling me which pages are useful.",
        "Plausible processes this data in the EU. Their privacy policy is at plausible.io/privacy ↗. If you run a content blocker the analytics script just doesn’t load, and the site works exactly the same.",
      ],
      links: [
        { label: "plausible.io/privacy ↗", href: "https://plausible.io/privacy", external: true },
      ],
    },
    {
      heading: "The contact form",
      paragraphs: [
        "The contact form is handled by Formspree, a third-party form service. When you submit it, the name, email address, and message you typed are sent to Formspree, which forwards them to my email inbox and retains a copy in its own dashboard.",
        "Formspree’s own privacy policy is at formspree.io/legal/privacy-policy ↗. If you would rather not use a third-party form at all, email me directly instead.",
      ],
      bullets: [
        { label: "What I do with it:", text: "read it and reply. That is the only purpose." },
        {
          label: "Who else sees it:",
          text: "nobody. It is not added to a mailing list, not sold, and not shared with third parties.",
        },
        {
          label: "How long it is kept:",
          text: "as long as the conversation is useful. Ask me to delete a submission and I will remove it from both my inbox and the Formspree dashboard.",
        },
      ],
      links: [
        {
          label: "formspree.io/legal/privacy-policy ↗",
          href: "https://formspree.io/legal/privacy-policy",
          external: true,
        },
      ],
    },
    {
      heading: "Hosting and server logs",
      paragraphs: [
        "The site is hosted on GitHub Pages. Like any web host, GitHub receives the requests your browser makes and may log IP addresses for security and abuse prevention. I have no access to those logs. See GitHub’s privacy statement ↗.",
      ],
      links: [
        {
          label: "GitHub’s privacy statement ↗",
          href: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",
          external: true,
        },
      ],
    },
    {
      heading: "Files you download",
      paragraphs: [
        "The résumé PDF is a plain static file. Downloading it is an ordinary file request. Nothing is gated, nothing is tracked per person, and you don’t have to give me anything for it.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `Because the site holds no account data, the only personal data that can exist is a contact-form message you chose to send, and you stay in control of it. Ask me at any time to tell you what I hold, correct it, or delete it. Email ${PROFILE.email} and I will action it.`,
      ],
      links: [{ label: PROFILE.email, href: `mailto:${PROFILE.email}` }],
    },
  ] as LegalSection[],
  crossLink: { label: "Read Terms of Use →", href: "/terms" },
} as const;

export const TERMS_COPY = {
  metaTitle: "Terms of Use",
  metaDescription:
    "The terms covering use of this portfolio site, its content, the résumé and the linked project demos.",
  eyebrow: "Legal & Terms",
  heading: "Terms of Use",
  updated: "18 August 2026",
  updatedPrefix: "Last updated:",
  lead: `This is the personal portfolio of ${PROFILE.name}. By using the site you accept the terms below. They’re short because the site is simple: it publishes information about my work and gives you a way to contact me. Nothing is sold here.`,
  sections: [
    {
      heading: "What the site is",
      paragraphs: [
        "An informational portfolio. It isn’t a product or a service, and there’s no uptime commitment. Pages, projects and the résumé may change or disappear at any time without notice.",
      ],
    },
    {
      heading: "Content and copyright",
      paragraphs: [
        "The written content, page designs and the résumé on this site are my own work and stay my copyright. You’re welcome to read it, quote it with attribution, share the links, and pass the résumé to colleagues while you’re considering me for a role.",
        "A few things need my written permission first:",
      ],
      bullets: [
        { text: "Republish the content as your own, in whole or in part." },
        {
          text: "Use the résumé, my name, or my likeness in job listings, candidate databases, or marketing material.",
        },
        {
          text: "Submit me as a candidate to any employer or client without my explicit prior agreement.",
        },
        { text: "Scrape the site to train commercial models or to build mailing lists." },
      ],
    },
    {
      heading: "Third-party names and logos",
      paragraphs: [
        "Names such as AWS, Azure, Terraform, Kubernetes, Datadog, Wireshark, and the employers listed in my history belong to their respective owners. They appear here to describe the technologies I have worked with and the work I have done. Their appearance is not a claim of endorsement, affiliation, or sponsorship.",
      ],
    },
    {
      heading: "Projects and demos",
      paragraphs: [
        "The projects section links to demos, repositories, and merge requests. Those are shown as work samples. They are provided as is, may go offline, and come with no warranty and no support. Where work was done for an employer, only what is public or non-confidential is described here.",
      ],
    },
    {
      heading: "Contacting me",
      paragraphs: [
        "The contact form and the email address are open for genuine professional enquiries. Please keep them clear of unsolicited sales pitches, bulk mail, and unlawful content. See the Privacy Policy for how messages are handled.",
      ],
      links: [{ label: "Privacy Policy", href: "/privacy" }],
    },
    {
      heading: "Liability",
      paragraphs: [
        "The site is provided as is. To the extent the law allows, I accept no liability for any loss arising from use of the site or from reliance on its content.",
      ],
    },
  ] as LegalSection[],
  crossLink: { label: "Read Privacy Policy →", href: "/privacy" },
} as const;
