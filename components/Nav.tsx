export default function Nav() {
  return (
    <header
      style={{
        position: "fixed",
        top: 2,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.25rem var(--gap)",
        pointerEvents: "none",
      }}
    >
      <span className="eyebrow" style={{ pointerEvents: "auto" }}>
        LOOMLINE · v2.0.0
      </span>
      <nav
        style={{
          display: "flex",
          gap: "1.5rem",
          pointerEvents: "auto",
        }}
      >
        <a className="eyebrow" href="#principles" data-cursor-hover>
          How it works
        </a>
        <a className="eyebrow" href="#gallery" data-cursor-hover>
          Modules
        </a>
        <a className="eyebrow" href="#audience" data-cursor-hover>
          Who it's for
        </a>
      </nav>
    </header>
  );
}
