import type { Metadata } from "next";

const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Srinivasan Vijayaraghavan, DevOps Engineer",
};

/* Next replaces the parent `openGraph` object wholesale rather than merging
   into it, so a page that declares its own title and url silently drops the
   layout's image and siteName. Every page therefore builds its metadata
   through here, and the social card can never go missing again. */
export function pageMetadata({
  title,
  description,
  path,
  noindex,
}: {
  title: string;
  description: string;
  /* Root-relative, with a leading slash — "" for the home page. */
  path: string;
  noindex?: boolean;
}): Metadata {
  const fullTitle = `${title} — Srinivasan Vijayaraghavan`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: path || "/" },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      siteName: "Srinivasan Vijayaraghavan",
      title: fullTitle,
      description,
      url: path || "/",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
