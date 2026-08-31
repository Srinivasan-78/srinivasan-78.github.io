/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​​‌‌​‌‌‌‌​​​​‌​‌‌​‌​​‌‌​‌‌​​​‌​​​​​‌​‌‌‌‌​‌​​​‌‌​​‌‌​‌​​​‌​​​‌‌‌‌​​​​‌‌​‌​‌​​‌‌‌​​​​​​‌​‌‌​‌​‌‌‌​‌‌‌​‌‌​‌​​‌​‌​‌‌​​‌​‌‌‌​​​‌​‌​​​‌​​​‌​‌‌‌‌‌​‌​​‌‌‌‌​‌​​​‌‌‌​‌‌‌​​​‌​‌‌​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.cxZlAz3Dxjp-wiYqD_OGqm
 */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import ProfileCard from "./ui/ProfileCard";

/* The hero composition: what is said, and who is saying it.

   Two columns from 980px up, stacked with the copy first below that,
   which is the right reading order on a phone regardless of how it is
   drawn. Both share the site's one container width — the hero does not
   get a wider frame than the sections under it.

   The draggable badge used to hang below this. It lives on /contact
   now: an object you pull on belongs next to the thing you are being
   asked to do, not in front of the sentence that has to be read first.

   The layout itself is in globals.css under .hero-showcase. */

/* The card itself is dark in both themes on purpose — a laminated badge
   is the one thing in the room that is not the colour of the room — so
   `innerGradient` below is not theme-keyed and must not become so.

   The bloom behind it is the opposite case: it is blurred 50px and lands
   on the *page*, not on the card, so what it has to work against changes
   with the theme. Over white paper the blue is a lift. Over the near-black
   page it is a coloured haze around a dark rectangle, which is the foil-
   and-sheen problem one layer out. Dark mode gets a neutral one at a
   fraction of the alpha: still a soft separation from the page, no hue. */
const BEHIND_GLOW_LIGHT = "rgba(41, 151, 255, 0.45)";
const BEHIND_GLOW_DARK = "rgba(255, 255, 255, 0.1)";

export default function HeroShowcase({ children }: { children: ReactNode }) {
  const router = useRouter();

  /* Starts false — light — so the prerendered markup and the first client
     paint agree. <html> carries no data-theme on the server; BootScript
     writes it before paint, so the attribute can only be read at effect
     time. Same MutationObserver ClickSpark uses to keep its canvas colour
     in step with the toggle. */
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setDark(root.getAttribute("data-theme") === "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="hero-showcase">
      <div className="hero-copy">{children}</div>

      <div className="hero-stage-card">
        <ProfileCard
          className="pc-quiet"
          name="Srinivasan Vijayaraghavan"
          title="DevOps / SRE"
          handle="srinivasan.devops"
          status="Open to conversations"
          contactText="Contact"
          avatarUrl="/assets/profile/avatar.svg"
          iconUrl="/assets/profile/pattern.svg"
          showUserInfo
          enableTilt
          /* Mobile tilt stays off. It needs a motion permission prompt on
             iOS, and a card that moves when you walk is not worth asking
             for one. */
          enableMobileTilt={false}
          behindGlowEnabled
          behindGlowColor={dark ? BEHIND_GLOW_DARK : BEHIND_GLOW_LIGHT}
          behindGlowSize="55%"
          innerGradient="linear-gradient(145deg, #14161c 0%, #0b1c2c 100%)"
          onContactClick={() => router.push("/contact")}
        />
      </div>
    </div>
  );
}
