import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import GlowCard from "@/components/ui/GlowCard";

// noindex: a post-submit confirmation has no standalone value in search
// results, and indexing it invites people to land here without submitting.
export const metadata = pageMetadata({
  title: "Message sent",
  description: "Your message reached my inbox. I reply to genuine enquiries within two business days.",
  path: "/thank-you",
  noindex: true,
});

const NEXT = [
  { href: "/projects", title: "Projects", body: "Eleven builds across CI/CD, disaster recovery, and platform engineering.", go: "View projects" },
  { href: "/certifications", title: "Certifications", body: "22 credentials, each with a verification link.", go: "View certifications" },
  { href: "/resume.pdf", title: "Résumé", body: "The one-page version, as a PDF.", go: "Download résumé", download: true },
];

export default function ThankYou() {
  return (
    <main id="content" className="wrap" style={{ padding: "3.5rem 24px 5rem" }}>
      <div className="page-head">
      <span className="eyebrow">Message sent</span>
      <h1 className="display display-lg">
        Message delivered
      </h1>
      <p>
        Thanks for getting in touch. Your message is in my inbox and I read every one. Expect a
        reply within two business days — if it is urgent, email me directly at{" "}
        <a className="lnk" href="mailto:srinivasan.shyam2000@gmail.com">
          srinivasan.shyam2000@gmail.com
        </a>
        .
      </p>
      </div>

      <div className="explore-grid" style={{ marginTop: "2rem" }}>
        {NEXT.map((n) =>
          n.download ? (
            <GlowCard key={n.href}>
              <a href={n.href} download className="card">
                <h3 className="card-title">{n.title}</h3>
                <p className="card-body">{n.body}</p>
                <span className="go">{n.go}</span>
              </a>
            </GlowCard>
          ) : (
            <GlowCard key={n.href}>
              <Link href={n.href} className="card">
                <h3 className="card-title">{n.title}</h3>
                <p className="card-body">{n.body}</p>
                <span className="go">{n.go}</span>
              </Link>
            </GlowCard>
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
