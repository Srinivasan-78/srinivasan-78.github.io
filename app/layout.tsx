import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Cursor from "@/components/Cursor";
import ProgressRail from "@/components/ProgressRail";

export const metadata: Metadata = {
  title: "Loomline — attribute-driven motion for the web",
  description:
    "Loomline is a small, modular toolkit for scroll effects, cursor tracking, and text reveals — wired up through HTML attributes, not framework lock-in.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ProgressRail />
        <Cursor />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
