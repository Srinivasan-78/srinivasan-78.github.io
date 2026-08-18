import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";

// noindex: a post-submit confirmation has no standalone value in search
// results, and indexing it invites people to land here without submitting.
export const metadata = pageMetadata({
  title: "Message sent",
  description: "Your message reached my inbox. I reply to genuine enquiries within two business days.",
  path: "/thank-you",
  noindex: true,
});

const NEXT = [
  { href: "/projects", title: "Projects", body: "Eleven builds across CI/CD, disaster recovery, and platform engineering.", go: "View projects →" },
  { href: "/certifications", title: "Certifications", body: "22 credentials, each with a verification link.", go: "View certifications →" },
  { href: "/resume.pdf", title: "Résumé", body: "The one-page version, as a PDF.", go: "Download résumé →", download: true },
];

export default function ThankYou() {
  return (
    <main id="content" className="wrap" style={{ padding: "3rem 24px" }}>
      <span className="eyebrow c-brass">200 — OK</span>
      <h1 className="display display-lg" style={{ margin: "0.4rem 0 0.75rem" }}>
        <DecryptedText
          text="Message delivered"
          animateOn="view"
          sequential
          useOriginalCharsOnly
          encryptedClassName="text-encrypted"
        />
      </h1>
      <p style={{ color: "var(--ink-70)", maxWidth: "56ch" }}>
        Thanks for getting in touch. Your message is in my inbox and I read every one. Expect a
        reply within two business days — if it is urgent, email me directly at{" "}
        <a className="lnk" href="mailto:srinivasan.shyam2000@gmail.com">
          srinivasan.shyam2000@gmail.com
        </a>
        .
      </p>

      <div className="card" style={{ marginTop: "2rem", borderLeft: "3px solid var(--sage)" }}>
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
          <span className="eyebrow">contact form — delivery</span>
          <span
            className="tag"
            style={{
              color: "var(--sage)",
              borderColor: "var(--sage-line)",
              background: "var(--sage-wash)",
              margin: 0,
            }}
          >
            SENT
          </span>
        </div>
        <div style={{ borderTop: "1px solid var(--ink-15)", paddingTop: "0.75rem" }}>
          <span className="eyebrow">
            status: <b>received</b> &nbsp;·&nbsp; response SLA: <b>2 business days</b>
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
        {NEXT.map((n) =>
          n.download ? (
            <a key={n.href} href={n.href} download className="card" data-cursor-hover>
              <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.4rem" }}>{n.title}</h3>
              <p style={{ color: "var(--ink-45)", fontSize: "0.84rem", margin: 0 }}>{n.body}</p>
              <span className="go">{n.go}</span>
            </a>
          ) : (
            <Link key={n.href} href={n.href} className="card" data-cursor-hover>
              <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.4rem" }}>{n.title}</h3>
              <p style={{ color: "var(--ink-45)", fontSize: "0.84rem", margin: 0 }}>{n.body}</p>
              <span className="go">{n.go}</span>
            </Link>
          )
        )}
      </div>

      <p style={{ marginTop: "2rem" }}>
        <Link className="lnk" href="/">
          ← Back home
        </Link>
      </p>
    </main>
  );
}
