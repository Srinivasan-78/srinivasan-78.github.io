/* The site's navigation, in one place.

   The header row and the mobile wheel are different interfaces onto the
   same set of destinations, and the wheel has to be able to work out
   which one the visitor is currently on. Two copies of this list would
   drift the moment a route is added. */

export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/certifications", label: "Certifications" },
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
