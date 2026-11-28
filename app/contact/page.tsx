import ContactForm from "@/components/ContactForm";
import CopyEmailCard from "@/components/CopyEmailCard";
import Icon from "@/components/primitives/Icon";
import SectionHead from "@/components/primitives/SectionHead";
import { CONTACT_COPY, CONTACT_METHODS } from "@/lib/data/profile";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: CONTACT_COPY.metaTitle,
  description: CONTACT_COPY.metaDescription,
  path: "/contact",
});

/* Contact.

   A 7/5 sheet: the form takes seven columns because it is the one thing
   on this page with a primary action, and the six direct channels take
   five as a ruled list rather than six tiles. Six identical cards would
   say the six routes are interchangeable; they are not — the email is
   the one he actually reads, which is why it is the first row and the
   only one that carries a control.

   This page is a server component. The two stateful leaves are the form
   and the copy button, and both are imported rather than inlined, so
   everything else here is HTML by the time a browser sees it.

   One h1, in the header below. One `btn-signal`, inside the form — and
   the form is the one thing on this page that does not get a graphic or
   a motion effect. A field that animates while someone is filling it in
   is a field arguing with them.

   CORRECTION, revision 7: this comment used to say that `phone`,
   `linkedin` and `github` had no entry in the Icon primitive's map and
   were falling back to a neutral glyph. All three are in `ICONS` —
   lines 70, 77 and 82 — mapped to FiGithub, FiLinkedin and FiPhone.
   Either they were added and the note was not updated, or the note was
   wrong when written. Corrected rather than deleted, because a comment
   describing a defect that does not exist sends the next reader to fix
   nothing. */
export default function Contact() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* The page head. A moving WebGL light-ray field used to sit
            behind it over a static searchlight gradient — the page that
            asks someone to step into the light getting the animated
            version of the cone. Both are replaced by the ambient wash
            the rest of the site is lit by. */}
        <div className="relative mb-10 sm:mb-14">
          <div
            aria-hidden="true"
            className="head-wash pointer-events-none absolute -inset-x-8 -top-28 -z-10 h-[40rem]"
          />

          <div className="relative">
            <SectionHead
              kicker={CONTACT_COPY.eyebrow}
              title={CONTACT_COPY.heading}
              titleAs="h1"
              lede={CONTACT_COPY.body}
              size="xl"
              titleReveal
              className="mb-0"
            />
          </div>
        </div>

        {/* The résumé's contact line used to be printed here as a title
            block: location, phone and email set as annotation between
            two rules. It is gone, because every fact in it appears
            again within one screen of itself — the location in the
            kicker above, the phone and the email as rows of the list to
            the right, each with its own label and its own control. The
            email was on the page three times once the mailto was
            counted. A fact appears once per page, so the strip was the
            copy that had to go rather than the row that can be used. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="t-display t-h3">{CONTACT_COPY.formHeading}</h2>
            <p className="t-prose mt-3 text-[0.9375rem] leading-relaxed text-mute">
              {CONTACT_COPY.formBody}
            </p>

            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* Six channels as one column on a single card. No heading:
                the data carries no label for this block, and a list of
                six labelled links needs no second label to introduce
                it. One card rather than six — six identical cards would
                say the six routes are interchangeable, and they are
                not. */}
            <ul className="panel divide-y divide-rule overflow-hidden">
              {CONTACT_METHODS.map((method) =>
                method.copyable ? (
                  <li key={method.id}>
                    <CopyEmailCard method={method} />
                  </li>
                ) : (
                  <li key={method.id}>
                    <a
                      href={method.href}
                      {...(method.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      {...(method.download ? { download: true } : {})}
                      className="group flex items-start justify-between gap-4 p-5"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2.5 text-mute">
                          <Icon name={method.icon} className="h-4 w-4" />
                          <span className="t-anno">{method.label}</span>
                        </span>

                        <span className="mt-3 block text-[0.9375rem] break-all text-body transition-colors duration-150 group-hover:text-detect">
                          {method.value}
                        </span>
                      </span>

                      <span className="t-anno-sm mt-1 shrink-0 text-mute">
                        {method.action}
                      </span>
                    </a>
                  </li>
                )
              )}
            </ul>

            <div className="glass glass-card glass-spec mt-4 p-6">
              <h2 className="t-anno-sm text-mute">
                {CONTACT_COPY.responseLabel}
              </h2>
              <p className="t-display mt-2 text-[1.25rem]">
                {CONTACT_COPY.responseHeadline}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-mute">
                {CONTACT_COPY.responseBody}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
