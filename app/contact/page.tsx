import { pageMetadata } from "@/lib/seo";
import SplitReveal from "@/components/SplitReveal";
import ContactForm from "@/components/ContactForm";
import DecryptedText from "@/components/DecryptedText";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch about DevOps, cloud infrastructure, and automation roles.",
  path: "/contact",
});

export default function Contact() {
  return (
    <main id="content" className="wrap" style={{ padding: "2.5rem 24px" }}>
      <span className="eyebrow c-brass">04 — Contact</span>
      <SplitReveal as="h1" text="Get in touch" className="display" />
      <p style={{ color: "var(--ink-70)", maxWidth: "58ch" }}>
        Open to conversations about DevOps, cloud infrastructure, and automation roles. Send a
        message below, or reach out directly on any channel.
      </p>

      <ContactForm />

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
          <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.3rem" }}>
            <DecryptedText text="Email" animateOn="view" sequential useOriginalCharsOnly encryptedClassName="text-encrypted" />
          </h3>
          <p style={{ color: "var(--ink-70)", margin: 0, fontSize: "0.84rem" }}>srinivasan.shyam2000@gmail.com</p>
        </a>
        <a className="card" href="https://www.linkedin.com/in/srini-solution-architect/" target="_blank" rel="noopener" data-cursor-hover>
          <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.3rem" }}>
            <DecryptedText text="LinkedIn ↗" animateOn="view" sequential useOriginalCharsOnly encryptedClassName="text-encrypted" />
          </h3>
          <p style={{ color: "var(--ink-70)", margin: 0, fontSize: "0.84rem" }}>Full profile, credentials, and recommendations</p>
        </a>
        <a className="card" href="https://github.com/Srinivasan-78" target="_blank" rel="noopener" data-cursor-hover>
          <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.3rem" }}>
            <DecryptedText text="GitHub ↗" animateOn="view" sequential useOriginalCharsOnly encryptedClassName="text-encrypted" />
          </h3>
          <p style={{ color: "var(--ink-70)", margin: 0, fontSize: "0.84rem" }}>Repositories and open-source contributions</p>
        </a>
      </div>
    </main>
  );
}

