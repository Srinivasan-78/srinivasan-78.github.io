import ProjectIndex from "@/components/ProjectIndex";

export const metadata = {
  title: "Projects — Srinivasan Vijayaraghavan",
  description:
    "Platform engineering experiments, homelab automation, and small tools — live demos and public repos.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Srinivasan Vijayaraghavan",
    description:
      "Platform engineering experiments, homelab automation, and small tools — live demos and public repos.",
    url: "/projects",
  },
};

export default function Projects() {
  return <ProjectIndex />;
}
