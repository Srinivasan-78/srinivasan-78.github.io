/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌​‌​‌​‌‌​​​‌​​‌​​‌​‌‌​‌‌​‌​‌​​​‌‌‌​​‌​‌​​​‌‌​​‌​‌‌​‌​​‌‌‌‌​‌​​​‌​‌‌​‌​‌​​​​‌‌​‌​​‌‌​‌​‌​​‌​‌​​​‌‌​‌​​​‌​​‌​​​​‌​​‌‌‌​​‌​‌‌​​​​‌​​​‌​​​‌​​‌‌‌​​​‌‌‌​​‌​​‌​‌‌​‌​‌​​‌​​‌​‌​‌​‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.ubKj9FZz-CMJ4HNXDN9-IU
 */
"use client";

import {
  SiTerraform,
  SiDocker,
  SiKubernetes,
  SiAnsible,
  SiChef,
  SiPuppet,
  SiGithubactions,
  SiGitlab,
  SiPython,
  SiGnubash,
  SiLinux,
  SiDatadog,
  SiGrafana,
  SiPrometheus,
  SiClaude,
  SiCursor,
  SiGithubcopilot,
  SiOllama,
  SiGooglegemini,
  SiHuggingface,
  SiOpenrouter,
  SiFastapi,
  SiStreamlit,
  SiApache,
  SiApachetomcat,
  SiApachesolr,
  SiJinja,
  SiDotnet,
  SiCplusplus,
  SiRedhat,
  SiUbuntu,
  SiAkamai,
  SiPypi,
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
  { node: <SiChef />, title: "Chef", ariaLabel: "Chef" },
  { node: <SiPuppet />, title: "Puppet", ariaLabel: "Puppet" },
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

  /* The AI and LLM half of the same toolchain — MCP servers, agentic
     coding tools and local inference — and the platform layer the
     enterprise work actually runs on. Microsoft marks are wordmarks for
     the same reason AWS and Azure are, above. */
  { node: <Word>MCP</Word>, title: "Model Context Protocol", ariaLabel: "Model Context Protocol" },
  { node: <SiClaude />, title: "Claude / Claude Code", ariaLabel: "Claude and Claude Code" },
  { node: <SiCursor />, title: "Cursor", ariaLabel: "Cursor" },
  { node: <SiGithubcopilot />, title: "GitHub Copilot", ariaLabel: "GitHub Copilot" },
  { node: <SiGooglegemini />, title: "Google Gemini", ariaLabel: "Google Gemini" },
  { node: <SiOpenrouter />, title: "OpenRouter", ariaLabel: "OpenRouter" },
  { node: <SiHuggingface />, title: "Hugging Face", ariaLabel: "Hugging Face" },
  { node: <SiOllama />, title: "Ollama", ariaLabel: "Ollama" },
  { node: <SiFastapi />, title: "FastAPI", ariaLabel: "FastAPI" },
  { node: <SiStreamlit />, title: "Streamlit", ariaLabel: "Streamlit" },
  { node: <SiPypi />, title: "PyPI", ariaLabel: "PyPI" },
  { node: <Word>Bicep</Word>, title: "Azure Bicep", ariaLabel: "Azure Bicep" },
  { node: <SiJinja />, title: "Jinja2", ariaLabel: "Jinja2" },
  { node: <SiApache />, title: "Apache HTTP Server", ariaLabel: "Apache HTTP Server" },
  { node: <SiApachetomcat />, title: "Apache Tomcat", ariaLabel: "Apache Tomcat" },
  { node: <SiApachesolr />, title: "Apache Solr", ariaLabel: "Apache Solr" },
  { node: <Word>SQL Server</Word>, title: "Microsoft SQL Server (T-SQL)", ariaLabel: "Microsoft SQL Server" },
  { node: <Word>PowerShell</Word>, title: "PowerShell", ariaLabel: "PowerShell" },
  { node: <SiDotnet />, title: "C# / .NET", ariaLabel: "C sharp and dot NET" },
  { node: <SiCplusplus />, title: "C / C++", ariaLabel: "C and C plus plus" },
  { node: <SiRedhat />, title: "RHEL", ariaLabel: "Red Hat Enterprise Linux" },
  { node: <SiUbuntu />, title: "Ubuntu", ariaLabel: "Ubuntu" },
  { node: <SiAkamai />, title: "Akamai", ariaLabel: "Akamai" },
  { node: <Word>WiX</Word>, title: "WiX Toolset", ariaLabel: "WiX Toolset" },
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
        /* Kept for the prop's sake — the strip's edge fade is done with
           a mask in globals.css now, so nothing paints this colour. A
           mask has no colour to get wrong, which is what the header's
           translucent material needs. */
        fadeOutColor="var(--paper)"
        scaleOnHover
        hoverSpeed={12}
        ariaLabel="Tooling I work with day to day"
      />
    </div>
  );
}
