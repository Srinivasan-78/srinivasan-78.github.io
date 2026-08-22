import { pageMetadata } from "@/lib/seo";
import CertIndex from "@/components/CertIndex";

export const metadata = pageMetadata({
  title: "Certifications",
  description:
    "22 verified credentials across cloud platforms, automation, infrastructure as code and observability.",
  path: "/certifications",
});

export default function Certifications() {
  return <CertIndex />;
}
