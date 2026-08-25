const BOOT_SCRIPT = `
(function(){
  // Marks that scripting is live. The scroll-reveal transition in
  // globals.css starts its elements at opacity 0 and relies on an
  // IntersectionObserver to turn them on, so without this flag a visitor
  // with JS blocked or broken would get a page of invisible headings.
  // Scoped to html.js, set here before paint, so no-JS simply skips the
  // animation and shows the content.
  document.documentElement.classList.add('js');
})();
`;

/* One job, and it has to happen before the first paint: set html.js,
   which is what gates the scroll-reveal transition.

   This was ThemeScript, and its other half read a stored theme
   preference and switched the document to light for a visitor who had
   chosen it. There is no longer anything to choose — the site is dark,
   the palette is defined once in :root, and the toggle that wrote that
   preference is gone — so the branch and the name went with it.

   Note it renders inside <body>, not <head> — App Router does not
   reliably execute a raw inline <script> placed in <head>. */
export default function BootScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />;
}
