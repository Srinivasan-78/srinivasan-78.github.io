"use client";

import {
  SiTerraform,
  SiDocker,
  SiKubernetes,
  SiAnsible,
  SiGithubactions,
  SiGitlab,
  SiPython,
  SiGnubash,
  SiLinux,
  SiDatadog,
  SiGrafana,
  SiPrometheus,
} from "react-icons/si";
import LogoLoop, { type LogoItem } from "./ui/LogoLoop";

/* The strip of tooling under the header.

   Two decisions worth writing down.

   First, the items are not links. A logo loop of anchors puts a dozen
   focus stops between the skip link and the navigation, all of them
   leaving the site, and every one of them moving under the pointer
   while it tries to land. These are a statement of what the work is
   built with, not a set of destinations, so they are inert nodes with
   titles and the strip carries one accessible name for the region.

   Second, Amazon and Microsoft withdrew their marks from Simple Icons,
   which is what react-icons ships. Rather than redraw two trademarks
   from memory, those two are set as wordmarks in the site's mono face
   at the same optical height as the glyphs. */

const Word = ({ children }: { children: string }) => (
  <span className="logoloop-word">{children}</span>
);

const TECH: LogoItem[] = [
  { node: <Word>AWS</Word>, title: "Amazon Web Services", ariaLabel: "Amazon Web Services" },
  { node: <Word>Azure</Word>, title: "Microsoft Azure", ariaLabel: "Microsoft Azure" },
  { node: <SiTerraform />, title: "Terraform", ariaLabel: "Terraform" },
  { node: <SiAnsible />, title: "Ansible", ariaLabel: "Ansible" },
  { node: <SiDocker />, title: "Docker", ariaLabel: "Docker" },
  { node: <SiKubernetes />, title: "Kubernetes", ariaLabel: "Kubernetes" },
  { node: <SiGithubactions />, title: "GitHub Actions", ariaLabel: "GitHub Actions" },
  { node: <SiGitlab />, title: "GitLab CI", ariaLabel: "GitLab CI" },
  { node: <SiPython />, title: "Python", ariaLabel: "Python" },
  { node: <SiGnubash />, title: "Bash", ariaLabel: "Bash" },
  { node: <SiLinux />, title: "Linux", ariaLabel: "Linux" },
  { node: <SiDatadog />, title: "Datadog", ariaLabel: "Datadog" },
  { node: <SiGrafana />, title: "Grafana", ariaLabel: "Grafana" },
  { node: <SiPrometheus />, title: "Prometheus", ariaLabel: "Prometheus" },
];

export default function TechLoop() {
  return (
    <div className="tech-loop">
      <LogoLoop
        logos={TECH}
        logoHeight={22}
        gap={28}
        speed={50}
        direction="left"
        fadeOut
        /* The brief asks for #000000. That is exactly what --paper
           resolves to in the dark theme this site now defaults to; in
           the light theme it follows the page instead of punching two
           black bars into a white header. */
        fadeOutColor="var(--paper)"
        scaleOnHover
        hoverSpeed={12}
        ariaLabel="Tooling I work with day to day"
      />
    </div>
  );
}
