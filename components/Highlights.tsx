"use client";

import { useState } from "react";

/* Story-style skill rings, carried over from the static site: each ring
   is a hand-drawn SVG scene for that skill area, clipped to a circle by
   its own <clipPath> so it holds even without the CSS mask. Tapping one
   opens the panel of concrete tools underneath. */

type Ring = { label: string; title: string; items: string[]; svg: string };

const RINGS: Ring[] = [
  {
    label: "Pipelines",
    title: "CI/CD & Automation",
    items: ["GitHub Actions", "GitLab CI", "Azure Pipelines", "Azure DevOps Services", "Pipeline design", "Rollback & promotion", "Code quality gates"],
    svg: "<svg class=\"ring-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip1\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip1)\"><rect width=\"200\" height=\"200\" fill=\"#28332D\"/><circle cx=\"100\" cy=\"100\" r=\"56\" fill=\"none\" stroke=\"#A8BC9E\" stroke-opacity=\"0.45\" stroke-width=\"12\"/><path d=\"M100 44 A56 56 0 1 1 44 100\" fill=\"none\" stroke=\"#E5BC6B\" stroke-width=\"12\" stroke-linecap=\"round\"/><polygon points=\"44,84 44,116 18,100\" fill=\"#E5BC6B\"/><circle cx=\"156.0\" cy=\"100.0\" r=\"9\" fill=\"#F7F3E8\"/><circle cx=\"72.0\" cy=\"148.5\" r=\"9\" fill=\"#F7F3E8\"/><circle cx=\"72.0\" cy=\"51.5\" r=\"9\" fill=\"#F7F3E8\"/></g></svg>",
  },
  {
    label: "AWS \u00b7 Azure",
    title: "Cloud Platforms",
    items: ["AWS EC2", "Security Groups", "Key Pairs", "Azure Storage", "Azure NLB", "Azure App Config", "ACR", "AzCopy", "Bicep", "Terraform", "GCP", "Oracle Cloud"],
    svg: "<svg class=\"ring-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip2\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip2)\"><rect width=\"200\" height=\"200\" fill=\"#23303E\"/><path d=\"M0 148 Q50 124 100 144 T200 134 L200 200 L0 200 Z\" fill=\"#A3BDD8\" fill-opacity=\"0.45\"/><path d=\"M60 108 a28 28 0 0 1 52-11 a24 24 0 0 1 36 13 a21 21 0 0 1-5 42 H68 a25 25 0 0 1-8-44 Z\" fill=\"#F7F3E8\"/><circle cx=\"74\" cy=\"170\" r=\"6\" fill=\"#E5BC6B\"/><circle cx=\"100\" cy=\"170\" r=\"6\" fill=\"#E5BC6B\"/><circle cx=\"126\" cy=\"170\" r=\"6\" fill=\"#E5BC6B\"/></g></svg>",
  },
  {
    label: "Ansible",
    title: "Config Management & Containers",
    items: ["Ansible", "Jinja2", "vars/vault architecture", "Docker", "ARM images", "WiX packaging", "dpkg"],
    svg: "<svg class=\"ring-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip3\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip3)\"><rect width=\"200\" height=\"200\" fill=\"#28332D\"/><rect x=\"36\" y=\"36\" width=\"36\" height=\"36\" rx=\"5\" fill=\"#E5BC6B\" fill-opacity=\"1\" stroke=\"#F7F3E8\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"82\" y=\"36\" width=\"36\" height=\"36\" rx=\"5\" fill=\"#A8BC9E\" fill-opacity=\"0.55\" stroke=\"#F7F3E8\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"128\" y=\"36\" width=\"36\" height=\"36\" rx=\"5\" fill=\"#A8BC9E\" fill-opacity=\"0.55\" stroke=\"#F7F3E8\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"36\" y=\"82\" width=\"36\" height=\"36\" rx=\"5\" fill=\"#A8BC9E\" fill-opacity=\"0.55\" stroke=\"#F7F3E8\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"82\" y=\"82\" width=\"36\" height=\"36\" rx=\"5\" fill=\"#A8BC9E\" fill-opacity=\"0.55\" stroke=\"#F7F3E8\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"128\" y=\"82\" width=\"36\" height=\"36\" rx=\"5\" fill=\"#E5BC6B\" fill-opacity=\"1\" stroke=\"#F7F3E8\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"36\" y=\"128\" width=\"36\" height=\"36\" rx=\"5\" fill=\"#A8BC9E\" fill-opacity=\"0.55\" stroke=\"#F7F3E8\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"82\" y=\"128\" width=\"36\" height=\"36\" rx=\"5\" fill=\"#E5BC6B\" fill-opacity=\"1\" stroke=\"#F7F3E8\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"128\" y=\"128\" width=\"36\" height=\"36\" rx=\"5\" fill=\"#A8BC9E\" fill-opacity=\"0.55\" stroke=\"#F7F3E8\" stroke-opacity=\"0.45\" stroke-width=\"2\"/></g></svg>",
  },
  {
    label: "Languages",
    title: "Scripting & Languages",
    items: ["Python", "Bash/Shell", "Batch", "YAML", "C/C++", ".NET deployment"],
    svg: "<svg class=\"ring-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip4\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip4)\"><rect width=\"200\" height=\"200\" fill=\"#191A17\"/><rect x=\"22\" y=\"40\" width=\"156\" height=\"120\" rx=\"8\" fill=\"#28332D\" stroke=\"#A8BC9E\" stroke-opacity=\"0.8\" stroke-width=\"3\"/><path d=\"M22 66 H178\" stroke=\"#A8BC9E\" stroke-opacity=\"0.7\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"53\" r=\"5\" fill=\"#E5BC6B\"/><circle cx=\"52\" cy=\"53\" r=\"5\" fill=\"#A8BC9E\"/><circle cx=\"66\" cy=\"53\" r=\"5\" fill=\"#F7F3E8\"/><path d=\"M42 90 l16 13 -16 13\" fill=\"none\" stroke=\"#E5BC6B\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><rect x=\"72\" y=\"94\" width=\"58\" height=\"8\" rx=\"4\" fill=\"#F7F3E8\" fill-opacity=\"0.85\"/><rect x=\"72\" y=\"114\" width=\"42\" height=\"8\" rx=\"4\" fill=\"#F7F3E8\" fill-opacity=\"0.65\"/><rect x=\"72\" y=\"134\" width=\"66\" height=\"8\" rx=\"4\" fill=\"#F7F3E8\" fill-opacity=\"0.45\"/></g></svg>",
  },
  {
    label: "Monitoring",
    title: "Monitoring & Reliability",
    items: ["Datadog", "Health validation", "Fail-fast gates", "SSH", "Wireshark", "Network administration", "Linux/Ubuntu", "Windows Server", "RHEL", "Apache", "Tomcat", "MySQL"],
    svg: "<svg class=\"ring-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip5\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip5)\"><rect width=\"200\" height=\"200\" fill=\"#2E2431\"/><circle cx=\"100\" cy=\"100\" r=\"26\" fill=\"none\" stroke=\"#C2A8C7\" stroke-opacity=\"0.70\" stroke-width=\"3\"/><circle cx=\"100\" cy=\"100\" r=\"48\" fill=\"none\" stroke=\"#C2A8C7\" stroke-opacity=\"0.57\" stroke-width=\"3\"/><circle cx=\"100\" cy=\"100\" r=\"70\" fill=\"none\" stroke=\"#C2A8C7\" stroke-opacity=\"0.44\" stroke-width=\"3\"/><circle cx=\"100\" cy=\"100\" r=\"92\" fill=\"none\" stroke=\"#C2A8C7\" stroke-opacity=\"0.31\" stroke-width=\"3\"/><polyline points=\"14,100 50,100 64,66 82,134 98,84 112,112 128,100 186,100\" fill=\"none\" stroke=\"#E5BC6B\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g></svg>",
  },
  {
    label: "Microservices",
    title: "Microservices & Migrations",
    items: ["Service provisioning", "DB scripting", "Traffic routing", "Azure migrations", "DR failover/failback", "Solr sync"],
    svg: "<svg class=\"ring-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip6\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip6)\"><rect width=\"200\" height=\"200\" fill=\"#23303E\"/><path d=\"M0 56 Q100 16 200 56\" fill=\"none\" stroke=\"#A3BDD8\" stroke-opacity=\"0.5\" stroke-width=\"3\"/><path d=\"M0 144 Q100 184 200 144\" fill=\"none\" stroke=\"#A3BDD8\" stroke-opacity=\"0.5\" stroke-width=\"3\"/><path d=\"M32 128 C 74 128, 86 72, 130 72\" fill=\"none\" stroke=\"#F7F3E8\" stroke-width=\"8\" stroke-linecap=\"round\"/><polygon points=\"124,56 124,88 158,72\" fill=\"#F7F3E8\"/><path d=\"M168 72 C 126 72, 114 128, 70 128\" fill=\"none\" stroke=\"#E5BC6B\" stroke-width=\"8\" stroke-linecap=\"round\"/><polygon points=\"76,112 76,144 42,128\" fill=\"#E5BC6B\"/></g></svg>",
  },
  {
    label: "Architecture",
    title: "Architecture & Design",
    items: ["Cloud architecture", "Solution design", "Software architecture", "Infrastructure as Code", "Multi-tenant systems", "Cost guardrails"],
    svg: "<svg class=\"ring-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip7\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip7)\"><rect width=\"200\" height=\"200\" fill=\"#2E2431\"/><path d=\"M100 34 L160 68 L160 132 L100 166 L40 132 L40 68 Z\" fill=\"none\" stroke=\"#C2A8C7\" stroke-width=\"4\"/><path d=\"M100 34 L100 100 M100 100 L160 132 M100 100 L40 132\" stroke=\"#C2A8C7\" stroke-width=\"3\" stroke-opacity=\"0.7\"/><circle cx=\"100\" cy=\"100\" r=\"13\" fill=\"#E5BC6B\"/><circle cx=\"100\" cy=\"34\" r=\"8\" fill=\"#F7F3E8\"/><circle cx=\"160\" cy=\"132\" r=\"8\" fill=\"#F7F3E8\"/><circle cx=\"40\" cy=\"132\" r=\"8\" fill=\"#F7F3E8\"/></g></svg>",
  },
];

export default function Highlights() {
  const [open, setOpen] = useState<number | null>(null);
  const active = open === null ? null : RINGS[open];

  return (
    <div className="wrap">
      <div className="highlights">
        {RINGS.map((r, i) => (
          <button
            key={r.label}
            type="button"
            className={"hl" + (open === i ? " active" : "")}
            aria-label={r.title}
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="hl-ring">
              <span
                className="ring-mask"
                // Static, self-authored SVG scenes — no user input involved.
                dangerouslySetInnerHTML={{ __html: r.svg }}
              />
            </div>
            <div className="hl-label">{r.label}</div>
          </button>
        ))}
      </div>

      <div className={"hl-panel" + (active ? " open" : "")}>
        {active && (
          <>
            <h4>{active.title}</h4>
            <ul>
              {active.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
