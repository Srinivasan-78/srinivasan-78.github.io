import { pageMetadata } from "@/lib/seo";
import CertMenu from "@/components/CertMenu";

export const metadata = pageMetadata({
  title: "Certifications",
  description:
    "22 verified credentials across cloud platforms, automation, infrastructure as code, and observability.",
  path: "/certifications",
});

export default function Certifications() {
  return <CertMenu />;
}
