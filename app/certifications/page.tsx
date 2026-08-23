import { pageMetadata } from "@/lib/seo";
import CertIndex from "@/components/CertIndex";
import { CERTS } from "@/lib/certs";

export const metadata = pageMetadata({
  title: "Certifications",
  description: `${CERTS.length} verified credentials across cloud platforms, automation, infrastructure as code and observability.`,
  path: "/certifications",
});

export default function Certifications() {
  return <CertIndex />;
}
