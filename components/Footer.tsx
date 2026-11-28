import Link from "next/link";
import { FOOTER_LINKS, FOOTER_COPY, PROFILE } from "@/lib/data/profile";

/* The colophon.

   It used to be set as a drawing's title block: three ruled cells
   labelled "Drawn by", "Station" and "Revision", sharing hairlines, at
   the corner of the sheet. That is a real engineering-drawing
   convention rather than a borrowed look, and it belonged to the
   identity this pass replaced.

   What survives is the content, in three plain columns on a surface
   that matches the rest of the new language. The labels are now what
   they describe rather than drawing vocabulary, and the provenance
   claim ("Watermarked at source") stays, because it is true: every
   source file in this repository carries a keyed authorship watermark
   and a bot audits them nightly.

   FOOTER_LINKS is untouched, including its order and its two external
   entries.

   The year is computed, not written. A footer that says 2026 in 2027
   is the smallest possible broken promise, and this one is rendered on
   the server at build time — the site is statically exported — so it is
   the build date rather than the visitor's clock. For a site that
   rebuilds on every push that is the more honest of the two. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div aria-hidden="true" className="rule-soft" />

        <div className="grid gap-8 py-12 sm:grid-cols-3">
          <div>
            <div className="t-anno-sm mb-2 text-mute">Built by</div>
            <div className="t-display text-[1.0625rem] text-body">
              {PROFILE.name}
            </div>
            <div className="mt-1 text-[0.875rem] text-mute">{PROFILE.role}</div>
          </div>

          <div>
            <div className="t-anno-sm mb-2 text-mute">Based in</div>
            <div className="text-[0.9375rem] text-body">{PROFILE.location}</div>
            <div className="mt-1 text-[0.875rem] text-mute">
              {PROFILE.website.host}
            </div>
          </div>

          <div>
            <div className="t-anno-sm mb-2 text-mute">Licence</div>
            <div className="text-[0.9375rem] text-body">© {year} · MIT</div>
            <div className="mt-1 text-[0.875rem] text-mute">
              Watermarked at source
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="rule-soft" />

        <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-5 gap-y-2.5"
          >
            {FOOTER_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.875rem] text-mute transition-colors duration-200 hover:text-body"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.875rem] text-mute transition-colors duration-200 hover:text-body"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <p className="text-[0.8125rem] text-mute">
            © {year} {FOOTER_COPY.copyrightSuffix}
          </p>
        </div>
      </div>
    </footer>
  );
}
