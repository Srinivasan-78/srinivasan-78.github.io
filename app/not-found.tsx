import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import GlowCard from "@/components/ui/GlowCard";

export const metadata = pageMetadata({
  title: "Page not found",
  description: "That URL doesn't exist on this site. Pick a working route from the list.",
  path: "/404",
  noindex: true,
});

const ROUTES = [
  { href: "/", title: "Home", body: "Profile, skills, and availability.", go: "Go home" },
  { href: "/projects", title: "Projects", body: "Live tools and platform engineering builds.", go: "View projects" },
  { href: "/certifications", title: "Certifications", body: "22 verifiable credentials.", go: "View certifications" },
  { href: "/contact", title: "Contact", body: "Send a message.", go: "Get in touch" },
];

export default function NotFound() {
  return (
    <main id="content" className="wrap" style={{ padding: "3.5rem 24px 5rem" }}>
      <div className="page-head">
        <span className="eyebrow">404</span>
        <h1 className="display display-lg">That page didn&rsquo;t resolve</h1>
        <p>
          The URL you followed doesn&rsquo;t exist here. No rollback needed — just pick a
          working route below.
        </p>
      </div>


      <div className="explore-grid" style={{ marginTop: "2rem" }}>
        {ROUTES.map((r) => (
          <GlowCard key={r.href}>
            <Link href={r.href} className="card">
              <h3 className="card-title">
                {r.title}
              </h3>
              <p className="card-body">{r.body}</p>
              <span className="go">{r.go}</span>
            </Link>
          </GlowCard>
        ))}
      </div>
    </main>
  );
}
