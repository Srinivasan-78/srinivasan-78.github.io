import Link from "next/link";

export default function Footer() {
  return (
    <footer className="section site-footer">
      <div
        className="wrap"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span className="eyebrow">© 2026 Srinivasan Vijayaraghavan</span>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          <Link className="eyebrow lnk" href="/privacy">
            Privacy
          </Link>
          <Link className="eyebrow lnk" href="/terms">
            Terms
          </Link>
          <a
            className="eyebrow lnk"
            href="https://www.linkedin.com/in/srini-solution-architect/"
            target="_blank"
            rel="noopener"
          >
            LinkedIn
          </a>
          <a
            className="eyebrow lnk"
            href="https://github.com/Srinivasan-78"
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
