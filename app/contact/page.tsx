import SplitReveal from "@/components/SplitReveal";

export const metadata = {
  title: "Contact — Srinivasan Vijayaraghavan",
  description: "Get in touch about DevOps, cloud infrastructure, and automation roles.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact — Srinivasan Vijayaraghavan", description: "Get in touch about DevOps, cloud infrastructure, and automation roles.", url: "/contact" },
};

export default function Contact() {
  return (
    <main id="content" className="wrap" style={{ padding: "2.5rem 24px" }}>
      <span className="eyebrow c-brass">04 — Contact</span>
      <SplitReveal as="h1" text="Get in touch" className="display" />
      <p style={{ color: "var(--ink-70)", maxWidth: "58ch" }}>
        Open to conversations about DevOps, cloud infrastructure, and automation roles. Send a
        message below, or reach out directly on any channel.
      </p>

      <form
        action="https://formspree.io/f/xrpzzlaz"
        method="POST"
        style={{ display: "grid", gap: "1rem", maxWidth: 480, marginTop: "2rem" }}
      >
        <div>
          <label htmlFor="name" className="eyebrow" style={{ display: "block", marginBottom: 4 }}>Name</label>
          <input id="name" name="name" required style={inputStyle} />
        </div>
        <div>
          <label htmlFor="email" className="eyebrow" style={{ display: "block", marginBottom: 4 }}>Email</label>
          <input id="email" name="email" type="email" required style={inputStyle} />
        </div>
        <div>
          <label htmlFor="message" className="eyebrow" style={{ display: "block", marginBottom: 4 }}>Message</label>
          <textarea id="message" name="message" required rows={5} style={inputStyle} />
        </div>
        <button type="submit" className="btn primary" style={{ justifySelf: "start" }}>
          Send message
        </button>
      </form>

      <div
        className="accent-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <a className="card" href="mailto:srinivasan.shyam2000@gmail.com" data-cursor-hover>
          <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.3rem" }}>Email</h3>
          <p style={{ color: "var(--ink-70)", margin: 0, fontSize: "0.84rem" }}>srinivasan.shyam2000@gmail.com</p>
        </a>
        <a className="card" href="https://www.linkedin.com/in/srini-solution-architect/" target="_blank" rel="noopener" data-cursor-hover>
          <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.3rem" }}>LinkedIn ↗</h3>
          <p style={{ color: "var(--ink-70)", margin: 0, fontSize: "0.84rem" }}>Full profile, credentials, and recommendations</p>
        </a>
        <a className="card" href="https://github.com/Srinivasan-78" target="_blank" rel="noopener" data-cursor-hover>
          <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.3rem" }}>GitHub ↗</h3>
          <p style={{ color: "var(--ink-70)", margin: 0, fontSize: "0.84rem" }}>Repositories and open-source contributions</p>
        </a>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  border: "1px solid var(--ink-15)",
  borderRadius: 6,
  background: "var(--paper-raised)",
  color: "var(--ink)",
  font: "inherit",
};
