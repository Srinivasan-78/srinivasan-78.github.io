import Link from "next/link";
import SplitReveal from "@/components/SplitReveal";

const EXPLORE = [
  { href: "/projects", title: "Projects", body: "Live tools, a Terraform multi-cloud platform, and automation pipelines — 11 builds." },
  { href: "/work", title: "Selected work", body: "Six projects across two companies, including public upstream contribution." },
  { href: "/experience", title: "Experience", body: "Full role breakdowns at Thomson Reuters and GraniteRiverLabs, plus education." },
  { href: "/certifications", title: "Certifications", body: "22 credentials in cloud, automation, and infrastructure — all verifiable." },
  { href: "/contact", title: "Get in touch", body: "Open to DevOps, cloud infrastructure, and automation conversations." },
];

export default function Page() {
  return (
    <main>
      <header className="wrap" style={{ padding: "3.5rem 24px 2.5rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "#4D5D53",
              color: "#F7F3E8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              flexShrink: 0,
            }}
          >
            SV
          </div>
          <div>
            <SplitReveal as="h1" text="Srinivasan Vijayaraghavan" className="display" stagger={0.015} />
            <p className="eyebrow" style={{ marginTop: 4 }}>
              DevOps Engineer · Cloud Infrastructure &amp; Automation
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
          {[
            ["5", "years shipping"],
            ["4", "clouds automated"],
            ["22", "certifications"],
          ].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem" }}>{n}</div>
              <div className="eyebrow">{l}</div>
            </div>
          ))}
        </div>

        <p style={{ maxWidth: "58ch", marginTop: "1.5rem", color: "var(--ink-70)" }}>
          I turn fragile, manual deployments into <strong>fast, reliable automation</strong> — the
          pipelines, safety nets, and monitoring that let teams ship without holding their breath.
          Currently leveling up toward Cloud Solutions Architecture.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <a href="/resume.pdf" className="btn primary" download>
            Download résumé
          </a>
          <a href="/contact" className="btn ghost">
            Get in touch
          </a>
        </div>
      </header>

      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Availability</span>
          <h2 className="display" style={{ fontSize: "1.6rem", marginTop: 6 }}>
            Deployment regions
          </h2>
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span className="eyebrow">work authorization — health check</span>
              <span className="eyebrow" style={{ color: "var(--sage)" }}>2/2 regions healthy</span>
            </div>
            {[
              ["us-east", "AUTHORIZED", "US citizen"],
              ["ap-south", "AUTHORIZED", "OCI — indefinite right to work in India"],
            ].map(([region, status, note]) => (
              <div
                key={region}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                  padding: "0.6rem 0",
                  borderTop: "1px solid var(--ink-15)",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{region}</span>
                <span className="tag" style={{ color: "var(--sage)", borderColor: "var(--sage-line)" }}>
                  {status}
                </span>
                <span style={{ color: "var(--ink-45)", fontSize: "0.85rem" }}>{note}</span>
              </div>
            ))}
            <div className="eyebrow" style={{ marginTop: "1rem" }}>
              sponsorship_required: <b>false</b> · failover: <b>instant</b> · currently based in Bangalore
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Explore</span>
          <h2 className="display" style={{ fontSize: "1.6rem", marginTop: 6 }}>
            Where to next
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            {EXPLORE.map((e) => (
              <Link key={e.href} href={e.href} className="card" data-cursor-hover>
                <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.4rem" }}>{e.title}</h3>
                <p style={{ color: "var(--ink-70)", fontSize: "0.9rem", margin: 0 }}>{e.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
