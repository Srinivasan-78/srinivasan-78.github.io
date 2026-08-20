"use client";

import "./globals.css";

/* The last resort: this replaces the root layout, so it has to bring its
   own <html> and <body> and cannot use anything the layout provides — no
   header, no footer, no theme script, no fonts loaded through next/font's
   variables. It is styled from the stylesheet's own tokens with
   data-theme="dark" set literally, which is the site's default theme, so
   the page still reads as this site rather than as a browser error.

   Kept deliberately plain. A boundary that itself depends on components is
   a boundary that can fail the same way as the thing it is catching. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <main
          className="wrap"
          style={{ padding: "6rem 24px", display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <span className="eyebrow">Error</span>
          <h1 className="display display-lg" style={{ margin: 0 }}>
            This page didn&rsquo;t load
          </h1>
          <p style={{ maxWidth: "62ch" }}>
            Something failed before the site could finish rendering. Reloading usually clears
            it. If it does not, email{" "}
            <a className="lnk" href="mailto:srinivasan.shyam2000@gmail.com">
              srinivasan.shyam2000@gmail.com
            </a>{" "}
            and I will look at it.
          </p>
          {error.digest && <p className="eyebrow">reference: {error.digest}</p>}
          <div className="hero-actions">
            <button type="button" className="btn primary" onClick={reset}>
              Reload the page
            </button>
            <a href="/" className="btn">
              Back home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
