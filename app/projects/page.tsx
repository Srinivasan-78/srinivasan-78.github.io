import { pageMetadata } from "@/lib/seo";
import ProjectIndex from "@/components/ProjectIndex";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Platform engineering experiments, homelab automation and small tools, with live demos and public repos.",
  path: "/projects",
});

export default function Projects() {
  return <ProjectIndex />;
}
