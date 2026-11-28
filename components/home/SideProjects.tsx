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
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHead
            size="lg"
            kicker={HOME_COPY.sideProjects.eyebrow}
            title={HOME_COPY.sideProjects.heading}
            lede={HOME_COPY.sideProjects.body}
            titleReveal
            className="mb-0"
          />
        </div>

        <Reveal delay={80} className="lg:col-span-5 lg:col-start-8">
          <div className="glass glass-card glass-spec overflow-hidden p-6 sm:p-7">
            <ul className="relative space-y-3">
              {HOME_COPY.sideProjects.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-baseline gap-3 text-[0.9375rem] text-body"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
                  />
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="relative mt-7">
              <Link href="/projects" className="btn w-full">
                {HOME_COPY.sideProjects.cta}
              </Link>
              <p className="mt-3 text-center text-[0.8125rem] text-mute">
                {HOME_COPY.sideProjects.ctaNote}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
