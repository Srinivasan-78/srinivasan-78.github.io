/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​​‌​‌‌‌​‌‌​​‌​​​‌‌​​‌‌​‌​‌​​‌​‌​‌‌‌​‌​​‌‌​‌​‌‌‌​‌‌‌​‌‌‌​​​​​‌‌‌​​​‌​‌​‌​‌​​​‌‌‌​‌​‌​‌‌‌​​‌​​‌‌‌​​​‌​‌‌‌‌​‌​​‌​‌‌​‌​​‌​‌​​‌​​‌‌‌​​​​​‌‌‌​​‌​​‌‌‌‌​‌​​​‌‌​​​​​‌‌​‌‌‌​​‌​​​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.AvFjWMwpqTurqzZRprz0nF
 */
import ContactForm from "@/components/ContactForm";
import CopyEmailCard from "@/components/CopyEmailCard";
import Icon from "@/components/primitives/Icon";
import Reveal from "@/components/primitives/Reveal";
import SectionHead from "@/components/primitives/SectionHead";
import FxBackdrop from "@/components/primitives/FxBackdrop";
import { SignalBeam } from "@/components/primitives/Texture";
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
        {/* This comment used to say the header was written out here
            rather than taken from SectionHead, because the primitive's
            title size was hard-coded below the xl page register. That
            stopped being true when the register became a prop and all
            three hand-rolled copies were migrated back — the call is
            right there. Correcting it rather than deleting it, because
            a comment that describes code that no longer exists is how
            the drift started.

            The beam is the warm graphic on the page: a cone of light
            thrown up from the lower left, where a searchlight would be.
            The detective grid is the cold one over it. Both are sibling
            layers, aria-hidden and pointer-events off, because each
            carries its own opacity and would otherwise fade the
            headline sitting on top of it. */}
        <div className="relative mb-10 overflow-hidden sm:mb-14">
          <SignalBeam />
          {/* The searchlight, moving. The static cone in §5b is
              exactly this shape; the page asking someone to step into
              the light gets the animated version. */}
          <FxBackdrop
            kind="rays"
            opacity={0.34}
            props={{
              raysOrigin: "top-center",
              raysSpeed: 0.7,
              lightSpread: 0.9,
              rayLength: 1.6,
              rayDensity: 1.4,
              glow: 0.45,
              haze: 0.25,
              followMouse: true,
              mouseInfluence: 0.12,
              intro: true,
              maxDevicePixelRatio: 1.5,
            }}
            lightProps={{ raysColor: "#bfbfbb", intensity: 0.45 }}
            darkProps={{ raysColor: "#f5c518", intensity: 0.5 }}
          />

          <div className="relative">
            <SectionHead
              index="05"
              total="05"
              kicker={CONTACT_COPY.eyebrow}
              title={CONTACT_COPY.heading}
              titleAs="h1"
              lede={CONTACT_COPY.body}
              size="xl"
              titleReveal
              titleEffect="xray"
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
        <div className="grid gap-12 border-t border-rule pt-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="t-display text-[1.5rem] sm:text-[1.75rem]">
              {CONTACT_COPY.formHeading}
            </h2>
            <p className="t-prose mt-3 text-[0.9375rem] leading-relaxed text-mute">
              {CONTACT_COPY.formBody}
            </p>

            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* Six channels as one ruled column. No heading: the data
                carries no label for this block, and a list of six
                labelled links needs no second label to introduce it. */}
            <ul className="divide-y divide-rule border-y border-rule">
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

            <div className="mt-8 border-t border-rule pt-6">
              <h2 className="t-anno-sm text-mute">{CONTACT_COPY.responseLabel}</h2>
              <p className="t-display mt-2 text-[1.25rem]">
                {CONTACT_COPY.responseHeadline}
              </p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-mute">
                {CONTACT_COPY.responseBody}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
