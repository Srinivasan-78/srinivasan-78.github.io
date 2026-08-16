export default function Footer() {
  return (
    <footer className="section">
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
          {/* Plain-text email on every page: recruiters copy-paste, and
              it was previously reachable only via the contact route. */}
          <a className="eyebrow lnk" href="mailto:srinivasan.shyam2000@gmail.com">
            srinivasan.shyam2000@gmail.com
          </a>
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
