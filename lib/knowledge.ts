/*!
 * @authormark v1 -- do not remove (authorship watermark)
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 */
export interface KnowledgeEntry {
  id: string;
  category: "identity" | "experience" | "projects" | "skills" | "authorization" | "certifications" | "contact" | "general";
  keywords: string[];
  patterns?: RegExp[];
  answer: string;
  followUps?: string[];
  actionLink?: {
    label: string;
    url: string;
  };
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // 1. Identity & Overview
  {
    id: "overview",
    category: "identity",
    keywords: ["who", "about", "srinivasan", "background", "summary", "profile", "bio", "experience", "role", "what does he do", "intro"],
    patterns: [
      /who\s+is\s+srinivasan/i,
      /what\s+does\s+(he|srinivasan)\s+do/i,
      /tell\s+me\s+about\s+(him|srinivasan)/i,
      /give\s+me\s+(an\s+)?overview/i,
    ],
    answer:
      "Srinivasan Vijayaraghavan is a DevOps & Platform Systems Engineer with 5+ years of hands-on experience building resilient cloud infrastructure across AWS and Azure. He specializes in automated zero-downtime CI/CD releases, multi-terabyte cloud storage migrations, self-healing systems, and infrastructure as code (IaC) with Terraform and Ansible.",
    followUps: [
      "What is his enterprise experience?",
      "Is he authorized to work in the US?",
      "What are his key projects?",
    ],
    actionLink: {
      label: "Download Résumé (PDF)",
      url: "/resume.pdf",
    },
  },

  // 2. Work Authorization & US Status
  {
    id: "work_authorization",
    category: "authorization",
    keywords: [
      "visa", "authorization", "work authorization", "authorized", "us", "usa", "united states",
      "sponsorship", "sponsor", "green card", "ead", "tn", "citizen", "eligibility", "india",
      "remote", "hire", "relocation", "mobility", "legal"
    ],
    patterns: [
      /work\s+authoriz/i,
      /authorized\s+to\s+work/i,
      /need\s+(visa\s+)?sponsorship/i,
      /eligible\s+to\s+work/i,
      /us\s+citizen/i,
      /us\s+work/i,
    ],
    answer:
      "Srinivasan is fully authorized to work in both the United States and India with ZERO employer visa sponsorship required. He is available for immediate hire across US and India roles (remote or on-site) with no immigration overhead or visa waiting periods.",
    followUps: [
      "What is his current location?",
      "How do I get in touch with him?",
      "What are his strongest technical skills?",
    ],
    actionLink: {
      label: "Discuss a Role",
      url: "/contact",
    },
  },

  // 3. Enterprise Experience - Thomson Reuters
  {
    id: "thomson_reuters",
    category: "experience",
    keywords: [
      "thomson", "reuters", "thomson reuters", "azure migration", "unmanaged disk", "blob storage",
      "storage cost", "managed disks", "dr", "disaster recovery"
    ],
    patterns: [
      /thomson\s+reuters/i,
      /azure\s+storage\s+migration/i,
      /cost\s+reduction/i,
    ],
    answer:
      "At Thomson Reuters, Srinivasan spearheaded the migration of legacy unmanaged VHD disks across multi-terabyte production VM clusters to Azure Managed Disks and tiered Azure Blob Storage. This initiative achieved a 40% reduction in monthly cloud storage spend, eliminated disk throttling bottlenecks, and established automated snapshot-based disaster recovery replication with zero production downtime.",
    followUps: [
      "Tell me about his work at Granite River Labs",
      "What tools does he use for CI/CD?",
      "Explore all 21 platform builds",
    ],
    actionLink: {
      label: "Explore Selected Experience",
      url: "/#experience",
    },
  },

  // 4. Enterprise Experience - Granite River Labs (GRL)
  {
    id: "granite_river_labs",
    category: "experience",
    keywords: [
      "granite", "river", "labs", "grl", "matter", "smart home", "test harness", "iot", "firmware", "image builder"
    ],
    patterns: [
      /granite\s+river/i,
      /grl/i,
      /matter\s+test/i,
      /smart\s+home/i,
    ],
    answer:
      "At Granite River Labs, Srinivasan engineered an automated test harness image pipeline for Matter Smart Home compliance certification. By containerizing test runners with Docker and orchestrating test suites using Python and Ansible, he reduced test setup and execution cycle times by 60%, delivering deterministic, reproducible test environments across physical lab hardware.",
    followUps: [
      "What is his experience at Thomson Reuters?",
      "What is his Python experience?",
      "What certifications does he hold?",
    ],
    actionLink: {
      label: "View Matter Image Builder Project",
      url: "/projects/matter-test-harness-image-builder",
    },
  },

  // 5. Projects - Master Bot / Repository Supervisor
  {
    id: "master_bot",
    category: "projects",
    keywords: [
      "master bot", "supervisor", "authormark", "watermark", "secret scanner", "hygiene", "pr tag", "bot", "triage"
    ],
    patterns: [
      /master\s+bot/i,
      /authormark/i,
      /repository\s+supervisor/i,
      /secret\s+scann/i,
    ],
    answer:
      "The Master Bot & Repository Supervisor is an autonomous platform supervisor that continuously audits, secures, and maintains every repository in Srinivasan's GitHub account. It enforces @authormark cryptographic watermarks, automatically opens ready-to-merge fix PRs with keyed HMAC signatures, scans for leaked PATs/API keys, lints code hygiene, tags PR sizes (size/XS to size/XL), and consolidates findings into a single daily dashboard issue to eliminate alert fatigue.",
    followUps: [
      "Tell me about the automatch project",
      "Tell me about his Self-Healing Deployment pipeline",
      "Explore all projects",
    ],
    actionLink: {
      label: "View Master Bot Breakdown",
      url: "/projects/authormark-watch",
    },
  },

  // 6. Projects - automatch
  {
    id: "automatch",
    category: "projects",
    keywords: [
      "automatch", "resume", "matcher", "parsing", "screening", "nlp", "ats", "candidate", "job matching", "spacy"
    ],
    patterns: [
      /automatch/i,
      /resume\s+(parser|match)/i,
      /ats\s+engine/i,
      /screening/i,
    ],
    answer:
      "automatch is an intelligent resume-to-job matching and candidate screening engine. It parses complex multi-column PDFs and DOCX files, normalizes skills using a canonical knowledge graph (via spaCy), and executes 5-dimension deterministic scoring (tech stack, domain depth, leadership, certifications, recency). It generates explainable match reports detailing strengths and gaps with zero data leakage.",
    followUps: [
      "Tell me about the Master Bot project",
      "What NLP and Python tools does he use?",
      "View all projects",
    ],
    actionLink: {
      label: "View automatch Overview",
      url: "/projects/automatch",
    },
  },

  // 7. Projects - Self-Healing Deployment Pipeline
  {
    id: "self_healing",
    category: "projects",
    keywords: [
      "self healing", "deployment", "blue green", "zero downtime", "rollback", "chaos", "pipeline", "release", "flags"
    ],
    patterns: [
      /self\s*healing/i,
      /zero\s*downtime/i,
      /blue\s*green/i,
      /automated\s*rollback/i,
    ],
    answer:
      "The Self-Healing Deployment Pipeline is Srinivasan's flagship release architecture. It features dual-slot blue/green swapping on port 8080, automated health gates (verifying HTTP 200, latency budgets, and dependency responses), exponential backoff retries, instant automated rollback if verification fails, on-demand chaos fault injection, and automated GitHub Pages deployment timelines.",
    followUps: [
      "How does the rollback mechanism work?",
      "What tools are in his DevOps stack?",
      "Explore all 21 projects",
    ],
    actionLink: {
      label: "View Architecture Deep Dive",
      url: "/projects/self-healing-deployment",
    },
  },

  // 9. Technical Skills & Tools
  {
    id: "skills_stack",
    category: "skills",
    keywords: [
      "skills", "stack", "technologies", "tools", "aws", "azure", "kubernetes", "k8s", "docker",
      "terraform", "ansible", "python", "bash", "linux", "datadog", "prometheus", "grafana",
      "ci/cd", "github actions", "gitlab", "devops", "cloud"
    ],
    patterns: [
      /what\s+(tech|tools|skills|languages)/i,
      /technical\s+stack/i,
      /technologies\s+used/i,
      /devops\s+skills/i,
    ],
    answer:
      "Srinivasan's primary technical domains include:\n• Cloud Platforms: Microsoft Azure, Amazon Web Services (AWS)\n• Infrastructure as Code & Config: Terraform, Ansible, Chef, Puppet\n• Containers & Orchestration: Docker, Kubernetes, Containerd, Helm\n• CI/CD Automation: GitHub Actions, GitLab CI, Azure Pipelines, Jenkins\n• Languages & Scripting: Python, Bash, Node.js/TypeScript, Rust\n• Observability: Datadog, Prometheus, Grafana, CloudWatch, ELK",
    followUps: [
      "What certifications does he have in AWS/Azure?",
      "What is his experience with Kubernetes?",
      "View interactive skills workbench",
    ],
    actionLink: {
      label: "Explore Skills Workbench",
      url: "/#skills",
    },
  },

  // 10. Certifications
  {
    id: "certifications",
    category: "certifications",
    keywords: [
      "certifications", "certs", "certified", "credentials", "badges", "aws cert", "azure cert", "rhce", "verification"
    ],
    patterns: [
      /certification/i,
      /certified/i,
      /credentials/i,
    ],
    answer:
      "Srinivasan holds 24 verified industry certifications across cloud engineering, Linux systems, infrastructure automation, and observability—including credentials from AWS, Microsoft Azure, Red Hat / Ansible, Linux Foundation, and Datadog. Every credential is 100% issuer-verified with permanent verification IDs.",
    followUps: [
      "Explore all 24 certifications",
      "What is his work experience?",
      "Download his résumé",
    ],
    actionLink: {
      label: "View Verified Certifications",
      url: "/certifications",
    },
  },

  // 11. Contact, Location & Availability
  {
    id: "contact_info",
    category: "contact",
    keywords: [
      "contact", "email", "reach", "hire", "touch", "location", "bangalore", "timezone", "linkedin", "github", "phone", "message"
    ],
    patterns: [
      /how\s+to\s+contact/i,
      /get\s+in\s+touch/i,
      /what\s+is\s+his\s+email/i,
      /where\s+is\s+he\s+based/i,
      /how\s+can\s+i\s+reach/i,
    ],
    answer:
      "Srinivasan is based in Bangalore, India (IST / UTC+5:30) and is open to full-time remote or hybrid opportunities globally.\n• Email: srinivasan.shyam2000@gmail.com\n• GitHub: github.com/Srinivasan-78\n• Direct Contact Form: Available on the contact page",
    followUps: [
      "Download Résumé (PDF)",
      "Is he authorized to work in the US?",
      "Explore his projects",
    ],
    actionLink: {
      label: "Send a Message",
      url: "/contact",
    },
  },

  // 12. Philosophy & Engineering Standards
  {
    id: "philosophy",
    category: "general",
    keywords: [
      "philosophy", "approach", "culture", "reliability", "best practices", "how he works", "process"
    ],
    patterns: [
      /how\s+does\s+he\s+work/i,
      /engineering\s+philosophy/i,
      /approach\s+to\s+devops/i,
    ],
    answer:
      "Srinivasan's engineering philosophy is anchored in three rules:\n1. Zero-Downtime by Default: Every release must have automated health checks and instant reversible rollback.\n2. Infrastructure as Code: If it's not codified in Terraform/Ansible and checked into Git, it doesn't exist in production.\n3. Calm Observability: Meaningful alerts that trigger only when user SLOs are at risk, with zero notification spam.",
    followUps: [
      "See the Release Reliability Architecture",
      "Check his work authorization",
      "Download his résumé",
    ],
    actionLink: {
      label: "View Release Flow Diagram",
      url: "/#reliability",
    },
  },
];

// Conversational greetings & conversational fallbacks
const GREETING_RESPONSE = {
  answer:
    "Hello! I am Srinivasan's interactive portfolio assistant. I can answer questions about his 5+ years of DevOps experience, US/India work authorization, enterprise case studies (Thomson Reuters & GRL), 20 open-source builds, and technical skills.",
  followUps: [
    "What does Srinivasan do?",
    "Is he authorized to work in the US?",
    "What are his key projects?",
    "How can I contact him?",
  ],
};

const THANKS_RESPONSE = {
  answer:
    "You're very welcome! If you have any further questions or would like to discuss a role, feel free to reach out directly to Srinivasan.",
  followUps: [
    "Send a message to Srinivasan",
    "Download his résumé (PDF)",
    "View his GitHub repositories",
  ],
  actionLink: {
    label: "Go to Contact Page",
    url: "/contact",
  },
};

const OFF_TOPIC_RESPONSE = {
  answer:
    "I'm specifically focused on Srinivasan's background, cloud/DevOps engineering experience, 20 project builds, certifications, and work authorization. Here are some topics you might find helpful:",
  followUps: [
    "What does Srinivasan do?",
    "Is he authorized to work in the US?",
    "What's his experience with Azure & AWS?",
    "Tell me about the Master Bot project",
  ],
};

export interface KnowledgeMatchResult {
  answer: string;
  followUps: string[];
  actionLink?: {
    label: string;
    url: string;
  };
}

/**
 * Intelligent client-side matcher that finds the most relevant knowledge response
 * using pattern matching, token overlap scoring, and synonym analysis.
 */
export function matchKnowledgeQuery(rawQuery: string): KnowledgeMatchResult {
  const query = rawQuery.trim();
  if (!query) {
    return {
      answer: GREETING_RESPONSE.answer,
      followUps: GREETING_RESPONSE.followUps,
    };
  }

  const lower = query.toLowerCase();

  // 1. Detect pure greetings
  if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|howdy|sup)\b/i.test(lower) && lower.length < 25) {
    return GREETING_RESPONSE;
  }

  // 2. Detect appreciation / farewell
  if (/^(thanks|thank\s*you|cheers|awesome|great|bye|goodbye)\b/i.test(lower) && lower.length < 30) {
    return THANKS_RESPONSE;
  }

  // 3. Score all entries in the knowledge base
  let bestEntry: KnowledgeEntry | null = null;
  let highestScore = 0;

  // Extract query tokens (ignoring short stop-words)
  const stopWords = new Set(["a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "is", "are", "do", "does", "his", "he", "him", "me", "tell", "show", "what", "about", "with"]);
  const tokens = lower
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !stopWords.has(t));

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;

    // Pattern matches get highest weight
    if (entry.patterns) {
      for (const pattern of entry.patterns) {
        if (pattern.test(lower)) {
          score += 15;
        }
      }
    }

    // Direct keyword matches
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      if (lower.includes(kwLower)) {
        score += kwLower.includes(" ") ? 8 : 4;
      }
    }

    // Token overlap matches
    for (const token of tokens) {
      for (const kw of entry.keywords) {
        const kwLower = kw.toLowerCase();
        if (kwLower === token) {
          score += 3;
        } else if (kwLower.includes(token) || token.includes(kwLower)) {
          score += 1.5;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  // If match confidence is sufficient, return the matched entry
  if (bestEntry && highestScore >= 3) {
    return {
      answer: bestEntry.answer,
      followUps: bestEntry.followUps ?? [
        "What are his key projects?",
        "What is his work authorization?",
        "How can I contact him?",
      ],
      actionLink: bestEntry.actionLink,
    };
  }

  // If score is too low or off-topic, return graceful guardrail with recommendations
  return OFF_TOPIC_RESPONSE;
}

