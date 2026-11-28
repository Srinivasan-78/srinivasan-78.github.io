import Link from "next/link";
import Reveal from "@/components/primitives/Reveal";
import SectionHead from "@/components/primitives/SectionHead";
import { HOME_COPY } from "@/lib/data/profile";

/* The side-projects teaser.

   `HOME_COPY.sideProjects` has been in the data unrendered since
   revision 6, which removed this section on the grounds that a home
   page summarising a page one click away is a page asking to be
   scrolled past twice. That argument was about the previous section,
   which rendered the same twenty project panels one level of detail
   down — a preview of /projects, on the home page.

   This is not that. It is four claims and one link: no cards, no
   panels, no duplicated project list. What it costs is a screen of
   height; what it buys is that a visitor who never reaches the nav
   still learns there are twenty builds behind it. The copy is the
   author's own, verbatim from the data. */
export default function SideProjects() {
  return (
    <section
      id="side-projects"
      className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20"
    >
      {/* One column, not a 7/5 split. The four claims were a bullet
          list crammed into the narrow half of the grid beside the copy
          that introduced them — a sidebar to a paragraph. They are the
          only thing this section has to show, so they get the full
          measure as four cards and the prose sits above them. */}
      <SectionHead
        size="lg"
        kicker={HOME_COPY.sideProjects.eyebrow}
        title={HOME_COPY.sideProjects.heading}
        lede={HOME_COPY.sideProjects.body}
        titleReveal
      />

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {HOME_COPY.sideProjects.bullets.map((bullet, i) => (
          <li key={bullet} className="h-full">
            <Reveal delay={i * 40} className="h-full">
              <div className="glass glass-spec h-full overflow-hidden p-6">
                <span
                  aria-hidden="true"
                  className="relative block h-1.5 w-1.5 rounded-full bg-signal"
                />
                <p className="relative mt-4 text-[1.0625rem] leading-snug font-medium text-body">
                  {bullet}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={80} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link href="/projects" className="link text-[0.9375rem] font-medium">
          {HOME_COPY.sideProjects.cta}
        </Link>
        <p className="text-[0.8125rem] text-mute">
          {HOME_COPY.sideProjects.ctaNote}
        </p>
      </Reveal>
    </section>
  );
}
