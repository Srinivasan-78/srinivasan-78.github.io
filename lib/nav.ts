/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌​​‌‌​‌‌‌‌​‌​​‌‌‌​​‌​​‌‌‌​‌​​​​‌‌​‌​‌​​‌‌​‌​‌​​‌‌​​‌‌​‌​‌​​​​​‌​​​​‌​​‌​​‌‌​‌​​‌‌​​‌​​‌‌‌‌​​​​​‌‌​‌‌​​‌‌​​‌‌​​​‌‌​‌‌​​​‌‌​‌‌‌​‌‌​​‌‌‌​‌‌‌‌​​​​​‌‌​​​‌​‌‌‌​‌​‌​‌​‌‌​‌​​‌​​‌‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.szrt553PBM2x6f67gx1uZO
 */
/* The site's navigation, in one place.

   The header row and the mobile wheel are different interfaces onto the
   same set of destinations, and the wheel has to be able to work out
   which one the visitor is currently on. Two copies of this list would
   drift the moment a route is added. */

export type NavItem = {
  href: string;
  label: string;
};

/* Hobby sits fourth, before Contact.

   The order is read as a narrative rather than by importance: the work,
   the credentials for it, the thing done for its own sake, and then how
   to get in touch. Contact stays last because it is the call to action
   and a call to action in the middle of a list is a list with no end.

   It is a destination rather than a section on another page because the
   games were previously a coda at the foot of /projects, and a coda to
   twenty project panels is a thing nobody scrolls to. On its own route
   it is navigable, linkable and has room to be treated properly. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/certifications", label: "Certifications" },
  { href: "/hobby", label: "Hobby" },
  { href: "/contact", label: "Contact" },
];

/** True when `href` is the route the given pathname belongs to. */
export function isActiveRoute(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/* Which item a pathname sits under, including nested routes —
   /projects/imgautomation resolves to Projects. Falls back to the first
   item so the wheel can never initialise on an invalid index. */
export function activeIndex(pathname: string | null): number {
  const found = NAV_ITEMS.findIndex((item) => isActiveRoute(item.href, pathname));
  return found === -1 ? 0 : found;
}
