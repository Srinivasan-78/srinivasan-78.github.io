import type { MetadataRoute } from "next";

/* A web app manifest for a portfolio is not about installability — there is
   no app here to install. It is about what Android does when someone adds
   the site to their home screen: without one, Chrome guesses at an icon
   from whatever favicon it can find and scales the 32px one, and it labels
   the shortcut with the full <title>. This names the shortcut and hands it
   the 192 and 512 icons it actually wants.
   iOS reads apple-touch-icon.png instead, which is declared in the layout. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Srinivasan Vijayaraghavan — DevOps Engineer",
    short_name: "Srinivasan V",
    description:
      "DevOps Engineer specializing in CI/CD, cloud infrastructure, and automation across AWS and Azure.",
    start_url: "/",
    display: "browser",
    // Matches the <meta name="theme-color"> in the layout and the site's
    // default theme, which is the dark one.
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      // Declared as maskable too: the monogram is full-bleed on a solid
      // ground, so a launcher can crop it to any shape without clipping
      // anything but background.
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
