"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
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

export default function HeroShowcase({ children }: { children: ReactNode }) {
  const router = useRouter();

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
          behindGlowColor="rgba(41, 151, 255, 0.45)"
          behindGlowSize="55%"
          innerGradient="linear-gradient(145deg, #14161c 0%, #0b1c2c 100%)"
          onContactClick={() => router.push("/contact")}
        />
      </div>
    </div>
  );
}
