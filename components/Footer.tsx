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
        <div style={{ display: "flex", gap: "1.25rem" }}>
          <a
            className="eyebrow"
            href="https://www.linkedin.com/in/srini-solution-architect/"
            target="_blank"
            rel="noopener"
          >
            LinkedIn
          </a>
          <a
            className="eyebrow"
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
