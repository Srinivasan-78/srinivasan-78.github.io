import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Reliability from "@/components/home/Reliability";
import Loadout from "@/components/home/Loadout";
import Initiatives from "@/components/home/Initiatives";
import Clearance from "@/components/home/Clearance";
import SideProjects from "@/components/home/SideProjects";
import Closing from "@/components/home/Closing";

/* The home page, in reading order.

   REBRAND PASS 1. The page was a dossier: a cover, five numbered
   cases, hairline rules between sections, and a case index on every
   heading. The visual identity is now Apple-adjacent — warm light,
   soft elevation, liquid glass — and this file is the running order
   that came out of it.

   What changed here:

     Figures      → Stats. Same six numbers from STATS, as cards.
     ReleasePath  → Reliability. Same six stages, the same caption and
                    the same rollback paragraph, without the drawn SVG
                    rail and the graph-paper ground.
     SideProjects   restored. Its copy has sat unrendered in
                    HOME_COPY.sideProjects since revision 6.
     Closing        restored, for the same reason, and because the nav
                    is a small capsule now rather than a full bar with
                    five labelled destinations — so "Contact" is no
                    longer on screen at every scroll position, which is
                    the argument that removed it.

   Loadout, Initiatives and Clearance are unchanged files. They pick
   up the new palette, type and surfaces through the tokens, and they
   get their own pass with the routes they share components with.

   Every fact the previous version of this page rendered is still
   rendered. Nothing in lib/data was edited.

   No metadata export, deliberately: the root layout's title,
   description and social card already describe this page, and
   declaring them again here is how the two drift apart. */
export default function Home() {
  return (
    /* tabIndex={-1} is what makes the skip link actually work. Without
       it, following #content moves the viewport but leaves focus on the
       link, so the next Tab goes back into the header the visitor just
       asked to skip. */
    <main id="content" tabIndex={-1}>
      {/* Alternating ground — see `.band` in globals.css §5b2. The
          wrapper is here rather than inside each section so the three
          sections this pass does not otherwise touch join the rhythm
          without being edited, and so a section stays one component
          that knows nothing about where it sits in the running order. */}
      <Hero />
      <div className="band">
        <Stats />
      </div>
      <Reliability />
      <div className="band">
        <Loadout />
      </div>
      <Initiatives />
      <div className="band">
        <Clearance />
      </div>
      <SideProjects />
      <div className="band">
        <Closing />
      </div>
    </main>
  );
}
