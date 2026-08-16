import CertMenu from "@/components/CertMenu";

export const metadata = {
  title: "Certifications — Srinivasan Vijayaraghavan",
  description:
    "22 verified credentials across cloud platforms, automation, infrastructure as code, and observability.",
  alternates: { canonical: "/certifications" },
  openGraph: {
    title: "Certifications — Srinivasan Vijayaraghavan",
    description:
      "22 verified credentials across cloud platforms, automation, infrastructure as code, and observability.",
    url: "/certifications",
  },
};

export default function Certifications() {
  return <CertMenu />;
}
