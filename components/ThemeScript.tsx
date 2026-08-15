const THEME_SCRIPT = `
(function(){
  var d = document.documentElement;
  var t = null;
  try { t = localStorage.getItem('theme'); } catch(e) {}
  // Dark is this site's default, unconditionally. The OS colour-scheme
  // preference is deliberately NOT consulted: a light-mode OS was
  // flipping first-time visitors into light mode. Only an explicit
  // choice the visitor made with the toggle overrides dark.
  d.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
})();
`;

// Server component (no "use client") — this is a plain inline <script>,
// not interactive, so it doesn't need to be a client component.
export default function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
