import GlowCard from "./ui/GlowCard";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";

/* Seven skill areas, each with a hand-drawn scene.

   These were story-rings: a horizontally scrolling row of 78px circles
   that you tapped to open a shared panel underneath. Two problems with
   that, now that this is the first section on the page. It was the only
   Instagram grammar on a site built out of cards, and it hid six of the
   seven tool lists behind a tap on a control that looked like an avatar.

   Same drawings, same groupings, same tools — on the card the rest of
   the site is made of, with every list visible. The scenes keep their
   circular clip, because that is the composition they were drawn for;
   their colours are theme tokens now rather than the baked-in dark hexes
   they carried, so they hold in the light theme too. */

type Skill = { label: string; title: string; items: string[]; svg: string };

const SKILLS: Skill[] = [
  {
    label: "Pipelines",
    title: "CI/CD & Automation",
    items: ["GitHub Actions", "GitLab CI", "Azure Pipelines", "Azure DevOps Services", "Pipeline design", "Rollback & promotion", "Code quality gates"],
    svg: "<svg class=\"skill-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip1\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip1)\"><circle cx=\"100\" cy=\"100\" r=\"56\" fill=\"none\" stroke=\"var(--ink-45)\" stroke-opacity=\"0.45\" stroke-width=\"12\"/><path d=\"M100 44 A56 56 0 1 1 44 100\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"12\" stroke-linecap=\"round\"/><polygon points=\"44,84 44,116 18,100\" fill=\"var(--accent)\"/><circle cx=\"156.0\" cy=\"100.0\" r=\"9\" fill=\"var(--ink)\"/><circle cx=\"72.0\" cy=\"148.5\" r=\"9\" fill=\"var(--ink)\"/><circle cx=\"72.0\" cy=\"51.5\" r=\"9\" fill=\"var(--ink)\"/></g></svg>",
  },
  {
    label: "AWS \u00b7 Azure",
    title: "Cloud Platforms",
    items: ["AWS EC2", "Security Groups", "Key Pairs", "Azure Storage", "Azure NLB", "Azure App Config", "ACR", "AzCopy", "Bicep", "Terraform", "GCP", "Oracle Cloud"],
    svg: "<svg class=\"skill-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip2\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip2)\"><path d=\"M0 148 Q50 124 100 144 T200 134 L200 200 L0 200 Z\" fill=\"var(--ink-45)\" fill-opacity=\"0.45\"/><path d=\"M60 108 a28 28 0 0 1 52-11 a24 24 0 0 1 36 13 a21 21 0 0 1-5 42 H68 a25 25 0 0 1-8-44 Z\" fill=\"var(--ink)\"/><circle cx=\"74\" cy=\"170\" r=\"6\" fill=\"var(--accent)\"/><circle cx=\"100\" cy=\"170\" r=\"6\" fill=\"var(--accent)\"/><circle cx=\"126\" cy=\"170\" r=\"6\" fill=\"var(--accent)\"/></g></svg>",
  },
  {
    label: "Ansible",
    title: "Config Management & Containers",
    items: ["Ansible", "Jinja2", "vars/vault architecture", "Docker", "ARM images", "WiX packaging", "dpkg"],
    svg: "<svg class=\"skill-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip3\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip3)\"><rect x=\"36\" y=\"36\" width=\"36\" height=\"36\" rx=\"5\" fill=\"var(--accent)\" fill-opacity=\"1\" stroke=\"var(--ink)\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"82\" y=\"36\" width=\"36\" height=\"36\" rx=\"5\" fill=\"var(--ink-45)\" fill-opacity=\"0.55\" stroke=\"var(--ink)\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"128\" y=\"36\" width=\"36\" height=\"36\" rx=\"5\" fill=\"var(--ink-45)\" fill-opacity=\"0.55\" stroke=\"var(--ink)\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"36\" y=\"82\" width=\"36\" height=\"36\" rx=\"5\" fill=\"var(--ink-45)\" fill-opacity=\"0.55\" stroke=\"var(--ink)\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"82\" y=\"82\" width=\"36\" height=\"36\" rx=\"5\" fill=\"var(--ink-45)\" fill-opacity=\"0.55\" stroke=\"var(--ink)\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"128\" y=\"82\" width=\"36\" height=\"36\" rx=\"5\" fill=\"var(--accent)\" fill-opacity=\"1\" stroke=\"var(--ink)\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"36\" y=\"128\" width=\"36\" height=\"36\" rx=\"5\" fill=\"var(--ink-45)\" fill-opacity=\"0.55\" stroke=\"var(--ink)\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"82\" y=\"128\" width=\"36\" height=\"36\" rx=\"5\" fill=\"var(--accent)\" fill-opacity=\"1\" stroke=\"var(--ink)\" stroke-opacity=\"0.45\" stroke-width=\"2\"/><rect x=\"128\" y=\"128\" width=\"36\" height=\"36\" rx=\"5\" fill=\"var(--ink-45)\" fill-opacity=\"0.55\" stroke=\"var(--ink)\" stroke-opacity=\"0.45\" stroke-width=\"2\"/></g></svg>",
  },
  {
    label: "Languages",
    title: "Scripting & Languages",
    items: ["Python", "Bash/Shell", "Batch", "YAML", "C/C++", ".NET deployment"],
    svg: "<svg class=\"skill-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip4\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip4)\"><rect x=\"22\" y=\"40\" width=\"156\" height=\"120\" rx=\"8\" fill=\"var(--paper-raised)\" stroke=\"var(--ink-45)\" stroke-opacity=\"0.8\" stroke-width=\"3\"/><path d=\"M22 66 H178\" stroke=\"var(--ink-45)\" stroke-opacity=\"0.7\" stroke-width=\"3\"/><circle cx=\"38\" cy=\"53\" r=\"5\" fill=\"var(--accent)\"/><circle cx=\"52\" cy=\"53\" r=\"5\" fill=\"var(--ink-45)\"/><circle cx=\"66\" cy=\"53\" r=\"5\" fill=\"var(--ink)\"/><path d=\"M42 90 l16 13 -16 13\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><rect x=\"72\" y=\"94\" width=\"58\" height=\"8\" rx=\"4\" fill=\"var(--ink)\" fill-opacity=\"0.85\"/><rect x=\"72\" y=\"114\" width=\"42\" height=\"8\" rx=\"4\" fill=\"var(--ink)\" fill-opacity=\"0.65\"/><rect x=\"72\" y=\"134\" width=\"66\" height=\"8\" rx=\"4\" fill=\"var(--ink)\" fill-opacity=\"0.45\"/></g></svg>",
  },
  {
    label: "Monitoring",
    title: "Monitoring & Reliability",
    items: ["Datadog", "Health validation", "Fail-fast gates", "SSH", "Wireshark", "Network administration", "Linux/Ubuntu", "Windows Server", "RHEL", "Apache", "Tomcat", "MySQL"],
    svg: "<svg class=\"skill-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip5\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip5)\"><circle cx=\"100\" cy=\"100\" r=\"26\" fill=\"none\" stroke=\"var(--ink-45)\" stroke-opacity=\"0.70\" stroke-width=\"3\"/><circle cx=\"100\" cy=\"100\" r=\"48\" fill=\"none\" stroke=\"var(--ink-45)\" stroke-opacity=\"0.57\" stroke-width=\"3\"/><circle cx=\"100\" cy=\"100\" r=\"70\" fill=\"none\" stroke=\"var(--ink-45)\" stroke-opacity=\"0.44\" stroke-width=\"3\"/><circle cx=\"100\" cy=\"100\" r=\"92\" fill=\"none\" stroke=\"var(--ink-45)\" stroke-opacity=\"0.31\" stroke-width=\"3\"/><polyline points=\"14,100 50,100 64,66 82,134 98,84 112,112 128,100 186,100\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g></svg>",
  },
  {
    label: "Microservices",
    title: "Microservices & Migrations",
    items: ["Service provisioning", "DB scripting", "Traffic routing", "Azure migrations", "DR failover/failback", "Solr sync"],
    svg: "<svg class=\"skill-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip6\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip6)\"><path d=\"M0 56 Q100 16 200 56\" fill=\"none\" stroke=\"var(--ink-45)\" stroke-opacity=\"0.5\" stroke-width=\"3\"/><path d=\"M0 144 Q100 184 200 144\" fill=\"none\" stroke=\"var(--ink-45)\" stroke-opacity=\"0.5\" stroke-width=\"3\"/><path d=\"M32 128 C 74 128, 86 72, 130 72\" fill=\"none\" stroke=\"var(--ink)\" stroke-width=\"8\" stroke-linecap=\"round\"/><polygon points=\"124,56 124,88 158,72\" fill=\"var(--ink)\"/><path d=\"M168 72 C 126 72, 114 128, 70 128\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"8\" stroke-linecap=\"round\"/><polygon points=\"76,112 76,144 42,128\" fill=\"var(--accent)\"/></g></svg>",
  },
  {
    label: "Architecture",
    title: "Architecture & Design",
    items: ["Cloud architecture", "Solution design", "Software architecture", "Infrastructure as Code", "Multi-tenant systems", "Cost guardrails"],
    svg: "<svg class=\"skill-art\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" preserveAspectRatio=\"xMidYMid slice\" aria-hidden=\"true\"><defs><clipPath id=\"ringclip7\"><circle cx=\"100\" cy=\"100\" r=\"100\"/></clipPath></defs><g clip-path=\"url(#ringclip7)\"><path d=\"M100 34 L160 68 L160 132 L100 166 L40 132 L40 68 Z\" fill=\"none\" stroke=\"var(--ink-45)\" stroke-width=\"4\"/><path d=\"M100 34 L100 100 M100 100 L160 132 M100 100 L40 132\" stroke=\"var(--ink-45)\" stroke-width=\"3\" stroke-opacity=\"0.7\"/><circle cx=\"100\" cy=\"100\" r=\"13\" fill=\"var(--accent)\"/><circle cx=\"100\" cy=\"34\" r=\"8\" fill=\"var(--ink)\"/><circle cx=\"160\" cy=\"132\" r=\"8\" fill=\"var(--ink)\"/><circle cx=\"40\" cy=\"132\" r=\"8\" fill=\"var(--ink)\"/></g></svg>",
  },
];

export default function Highlights() {
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead label="Skills" title="What I love working with" />

        <Reveal className="skill-grid" pop stagger={0.05}>
          {SKILLS.map((s) => (
            <GlowCard key={s.label}>
              <article className="skill-card">
                <div
                  className="skill-ring"
                  /* Static, self-authored SVG scenes — no user input
                     involved. */
                  dangerouslySetInnerHTML={{ __html: s.svg }}
                />
                <h3 className="card-title skill-title">{s.title}</h3>
                <div className="skill-items">
                  {s.items.map((i) => (
                    <span key={i} className="tag">
                      {i}
                    </span>
                  ))}
                </div>
              </article>
            </GlowCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
