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
  /* Without this the root layout's twitter block wins and every child
     route shares the home page's card title. */
  twitter: {
    card: "summary_large_image",
    title: "Projects — Srinivasan Vijayaraghavan",
    description:
      "Platform engineering experiments, homelab automation, and small tools — live demos and public repos.",
  },
};

export default function Projects() {
  return <ProjectIndex />;
}
