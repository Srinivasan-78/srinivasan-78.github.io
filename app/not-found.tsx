import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";

export const metadata = { title: "Page not found — Srinivasan Vijayaraghavan" };

const ROUTES = [
  { href: "/", title: "Home", body: "Profile, skills, and availability.", go: "Go home →" },
  { href: "/projects", title: "Projects", body: "Live tools and platform engineering builds.", go: "View projects →" },
  { href: "/certifications", title: "Certifications", body: "22 verifiable credentials.", go: "View certifications →" },
  { href: "/contact", title: "Contact", body: "Send a message.", go: "Get in touch →" },
];

export default function NotFound() {
  return (
    <main id="content" className="wrap" style={{ padding: "3rem 24px" }}>
      <span className="eyebrow c-brass">404</span>
      <h1 className="display display-lg" style={{ margin: "0.4rem 0 0.75rem" }}>
        <DecryptedText text="That page didn't resolve" animateOn="view" sequential useOriginalCharsOnly encryptedClassName="text-encrypted" />
      </h1>
      <p style={{ color: "var(--ink-70)", maxWidth: "56ch" }}>
        The URL you followed doesn&rsquo;t exist here. No rollback needed — just pick a working
        route below.
      </p>

      <div className="card" style={{ marginTop: "2rem", borderLeft: "3px solid var(--brass)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          <span className="eyebrow">route lookup — failed</span>
          <span className="tag" style={{ color: "var(--brass)", borderColor: "var(--brass-line)", background: "var(--brass-wash)", margin: 0 }}>
            404
          </span>
        </div>
        <div style={{ borderTop: "1px solid var(--ink-15)", paddingTop: "0.75rem" }}>
          <span className="eyebrow">
            status: <b>no matching page</b> &nbsp;·&nbsp; suggested action: <b>see below</b>
          </span>
        </div>
      </div>

      <div
        className="accent-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        {ROUTES.map((r) => (
          <Link key={r.href} href={r.href} className="card" data-cursor-hover>
            <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.4rem" }}>
              <DecryptedText text={r.title} animateOn="view" sequential useOriginalCharsOnly encryptedClassName="text-encrypted" />
            </h3>
            <p style={{ color: "var(--ink-45)", fontSize: "0.84rem", margin: 0 }}>{r.body}</p>
            <span className="go">{r.go}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
