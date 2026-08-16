# srinivasan-portfolio (Next.js)

Real portfolio for Srinivasan Vijayaraghavan, rebuilt from the existing
static site at `srinivasan-78.github.io` (custom domain
`www.srinidevops.com`, see `public/CNAME`) onto the motion-scaffold
(Lenis + GSAP ScrollTrigger, split-text reveals, inertia cursor,
scroll-progress rail) built earlier in this thread.

## Structure

```
public/                 favicons, og.png, resume.pdf, robots.txt, sitemap.xml, CNAME
app/
  layout.tsx             nav, footer, theme script, JSON-LD, motion chrome
  page.tsx                 home — profile, stats, availability, explore
  work/page.tsx             selected work (6 items)
  projects/page.tsx         projects grouped by category
  experience/page.tsx       Thomson Reuters + GraniteRiverLabs + education
  certifications/page.tsx   22 credentials
  contact/page.tsx          form + contact cards
  globals.css               real design tokens (light/dark)
components/
  SmoothScrollProvider.tsx, Cursor.tsx, ProgressRail.tsx, SplitReveal.tsx
  Nav.tsx, Footer.tsx, ThemeToggle.tsx
```
