import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import GlowCard from "@/components/ui/GlowCard";

/* No path and no `noindex` flag of its own: Next emits `noindex` for a
   not-found page already, and adding a second robots tag saying
   `noindex, follow` left two of them arguing in the head. */
export const metadata = pageMetadata({
  title: "Page not found",
  description: "That address points elsewhere. Here are the pages that are ready and waiting for you.",
  path: null,
});

const ROUTES = [
  { href: "/", title: "Home", body: "Profile, skills, and availability.", go: "Go home" },
  { href: "/projects", title: "Projects", body: "Live tools and platform engineering builds.", go: "View projects" },
  { href: "/certifications", title: "Certifications", body: "22 verifiable credentials.", go: "View certifications" },
  { href: "/contact", title: "Contact", body: "Send a message.", go: "Get in touch" },
];

export default function NotFound() {
  return (
    <main id="content" tabIndex={-1} className="wrap" style={{ padding: "3.5rem 24px 5rem" }}>
      <div className="page-head">
        <span className="eyebrow">404</span>
        <h1 className="display display-lg">Let&rsquo;s get you back on track</h1>
        <p>
          That address points somewhere else, and everything else on the site is right here
          waiting. Pick whichever one you were after.
        </p>
      </div>


      <div className="explore-grid" style={{ marginTop: "2rem" }}>
        {ROUTES.map((r) => (
          <GlowCard key={r.href}>
            <Link href={r.href} className="card">
              <h2 className="card-title">{r.title}</h2>
              <p className="card-body">{r.body}</p>
              <span className="go">{r.go}</span>
            </Link>
          </GlowCard>
        ))}
      </div>
    </main>
  );
}
