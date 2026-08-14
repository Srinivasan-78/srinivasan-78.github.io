import SplitReveal from "@/components/SplitReveal";

export const metadata = { title: "Certifications — Srinivasan Vijayaraghavan" };

const CERTS: { name: string; date: string; skills: string[] }[] = [
  { name: "Microsoft Azure: Networking Concepts", date: "Jul 2026", skills: ["Microsoft Azure"] },
  { name: "Software Architecture Foundations", date: "Jul 2026", skills: ["Software Architecture"] },
  { name: "Learning Apache Tomcat", date: "Apr 2026", skills: ["Tomcat"] },
  { name: "Learning GitLab", date: "Mar 2026", skills: ["GitLab"] },
  { name: "Networking Foundations: Networking Basics", date: "Mar 2026", skills: ["Network Administration"] },
  { name: "Advanced GitHub Actions", date: "Mar 2026", skills: ["GitHub"] },
  { name: "Building Infrastructure as Code (IaC) with Azure Bicep: Part 1", date: "Mar 2026", skills: ["Bicep", "Cloud Development"] },
  { name: "Monitoring and Observability with Datadog", date: "Jul 2025", skills: ["System Monitoring", "Datadog"] },
  { name: "Asking for Feedback as an Employee", date: "Dec 2023", skills: ["Constructive Feedback"] },
  { name: "Installing Apache, MySQL, and PHP", date: "Jun 2023", skills: ["MySQL", "Apache"] },
  { name: "Apache Web Server: Administration", date: "Jun 2023", skills: ["Apache"] },
  { name: "DevOps Foundations: Continuous Delivery/Continuous Integration", date: "Jun 2023", skills: ["CI/CD", "DevOps"] },
  { name: "Azure Essential Training for Developers", date: "Jun 2023", skills: ["Microsoft Azure"] },
  { name: "Learning Azure DevOps", date: "Jun 2023", skills: ["Azure DevOps Services"] },
  { name: "Red Hat Certified Engineer (EX294) Cert Prep: 3 Managing Systems with Ansible", date: "Jun 2023", skills: ["Red Hat Linux", "Ansible"] },
  { name: "Red Hat Certified Engineer (EX294) Cert Prep: 2 Using Ansible Playbooks", date: "Jun 2023", skills: ["Red Hat Linux", "Ansible"] },
  { name: "Red Hat Certified Engineer (EX294) Cert Prep: 1 Foundations of Ansible", date: "Jun 2023", skills: ["RHEL"] },
  { name: "Learning Ansible", date: "Jun 2023", skills: ["Ansible"] },
  { name: "Ansible Essential Training", date: "Jun 2023", skills: ["Ansible"] },
  { name: "Introduction to Linux", date: "Sep 2021", skills: [] },
  { name: "Learning Cloud Computing: Core Concepts", date: "Sep 2021", skills: [] },
  { name: "Cloud Architecture: Core Concepts", date: "Aug 2021", skills: [] },
];

export default function Certifications() {
  return (
    <main className="wrap" style={{ padding: "2.5rem 24px" }}>
      <span className="eyebrow c-plum">03 — Certifications</span>
      <SplitReveal as="h1" text="Certifications & learning" className="display" />
      <p style={{ color: "var(--ink-70)", maxWidth: "58ch" }}>
        Twenty-two credentials across cloud platforms, automation, infrastructure as code, and
        observability — all issued by LinkedIn Learning.
      </p>

      <div style={{ marginTop: "2rem" }}>
        {CERTS.map((c) => (
          <div
            key={c.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              padding: "0.9rem 0",
              borderTop: "1px solid var(--ink-15)",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: "0.95rem" }}>{c.name}</div>
              <div style={{ marginTop: "0.3rem" }}>
                {c.skills.map((s) => <span key={s} className="tag" style={{ color: "var(--plum)", borderColor: "var(--plum-line)", background: "var(--plum-wash)" }}>{s}</span>)}
              </div>
            </div>
            <span className="eyebrow" style={{ whiteSpace: "nowrap", color: "var(--ink-45)" }}>{c.date}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
