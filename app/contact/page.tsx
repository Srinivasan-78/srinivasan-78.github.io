import { pageMetadata } from "@/lib/seo";
import SplitReveal from "@/components/SplitReveal";
import ContactForm from "@/components/ContactForm";
import GlowCard from "@/components/ui/GlowCard";
import LanyardScene from "@/components/ui/LanyardScene";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch about DevOps, cloud infrastructure, and automation roles.",
  path: "/contact",
});

export default function Contact() {
  return (
    <main id="content" className="wrap contact-main">
      {/* Four areas, one grid. On a wide screen the badge takes the right
          column beside the heading and the form; on a narrow one
          everything stacks and the form comes before the badge, because
          the form is what the page is for and the badge is what it is
          like. The channel cards run full width underneath either way.
          Layout in globals.css under .contact-layout. */}
      <div className="contact-layout">
        <div className="page-head contact-head">
          <span className="eyebrow">Contact</span>
          <SplitReveal as="h1" text="Get in touch" className="display display-lg" />
          <p>
            Open to conversations about DevOps, cloud infrastructure, and automation roles. Send a
            message below, or reach out directly on any channel.
          </p>
        </div>

        <div className="contact-form-area">
          <ContactForm />
        </div>

        <div className="contact-badge">
          <LanyardScene />
        </div>

        <div className="explore-grid contact-links">
          <GlowCard>
            <a className="card" href="mailto:srinivasan.shyam2000@gmail.com">
              <h3 className="card-title">
                Email
              </h3>
              <p className="card-body">srinivasan.shyam2000@gmail.com</p>
            </a>
          </GlowCard>
          <GlowCard>
            <a className="card" href="https://www.linkedin.com/in/srini-solution-architect/" target="_blank" rel="noopener">
              <h3 className="card-title">
                LinkedIn ↗
              </h3>
              <p className="card-body">Full profile, credentials, and recommendations</p>
            </a>
          </GlowCard>
          <GlowCard>
            <a className="card" href="https://github.com/Srinivasan-78" target="_blank" rel="noopener">
              <h3 className="card-title">
                GitHub ↗
              </h3>
              <p className="card-body">Repositories and open-source contributions</p>
            </a>
          </GlowCard>
        </div>
      </div>
    </main>
  );
}
