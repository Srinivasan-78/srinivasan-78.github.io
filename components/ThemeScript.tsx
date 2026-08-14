const THEME_SCRIPT = `
(function(){
  var d = document.documentElement;
  function stored(){ try{ return localStorage.getItem('theme'); }catch(e){ return null; } }
  var t = stored();
  if (t !== 'dark' && t !== 'light'){
    t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  d.setAttribute('data-theme', t);
})();
`;

// Server component (no "use client") — this is a plain inline <script>,
// not interactive, so it doesn't need to be a client component at all.
export default function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
