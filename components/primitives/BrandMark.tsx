/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​​‌​‌‌‌‌​‌​​‌‌​​‌​‌​‌‌​‌‌​​​​‌‌‌​​​​‌​​​​​‌​‌‌​​‌‌‌​‌‌​​​‌​​‌​‌‌​​‌​‌​‌‌‌‌‌​‌​‌​​​‌​‌​‌‌‌‌‌​‌‌‌‌​‌​​‌‌‌​‌‌​​‌‌‌​​​‌​‌​​​​‌‌​‌​​​‌​‌​‌‌​​​‌​​​‌​‌‌​‌​‌​​​​​‌​‌‌‌​​​‌​‌‌​‌‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.1zel8AgbY_Q_zvqCEb-Aqn
 */
import {
  SiAkamai,
  SiAnsible,
  SiApache,
  SiApachesolr,
  SiApachetomcat,
  SiChef,
  SiClaude,
  SiCplusplus,
  SiCursor,
  SiDatadog,
  SiDocker,
  SiDotnet,
  SiFastapi,
  SiGithubactions,
  SiGithubcopilot,
  SiGitlab,
  SiGnubash,
  SiGooglegemini,
  SiGrafana,
  SiHuggingface,
  SiJinja,
  SiKubernetes,
  SiLinux,
  SiModelcontextprotocol,
  SiOllama,
  SiOpenrouter,
  SiPrometheus,
  SiPuppet,
  SiPypi,
  SiPython,
  SiRedhat,
  SiStreamlit,
  SiTerraform,
  SiUbuntu,
  SiWix,
} from "react-icons/si";
import type { ToolingMark } from "@/lib/data/skills";

/* The drawn marks for the tooling strip.
 *
 * This is the second file in the design layer that knows about an icon
 * library, and it is separate from Icon.tsx on purpose: that one maps
 * SEMANTIC tokens ("server", "shield") to a neutral line set, while
 * this maps PRODUCT identities to their actual trademarks. Mixing them
 * would mean one map where half the entries are interface glyphs and
 * half are company logos, and a caller could no longer tell which it
 * was going to get.
 *
 * WHY THIS NOW EXISTS. The previous tooling strip set all thirty-nine
 * marks as type, on the reasoning that a strip which is half drawn
 * marks and half words "reads as a strip with sixteen missing images".
 * That reasoning was sound for the ratio it assumed and wrong about
 * the ratio: `react-icons` ships 3,446 Simple Icons, and thirty-five
 * of the thirty-nine marks have a real trademark glyph. The actual
 * split is 35/4, not 23/16, so the strip reads as a logo wall with
 * four deliberate wordmarks in it rather than as a broken one.
 *
 * THE FOUR — five entries, four companies — have no usable glyph
 * because Amazon and Microsoft withdrew their marks from Simple Icons.
 * Those are exactly the entries the data already flags `wordmark:
 * true`: AWS, Azure, Bicep, SQL Server and PowerShell. The data was
 * right before the glyphs existed and it is still right; nothing here
 * redraws a trademark from memory.
 *
 * A mark with no entry in the map falls through to its wordmark too,
 * so adding a tool to the data can never render an empty box — the
 * same failure rule Icon.tsx follows. */

const MARKS: Record<string, React.ComponentType<{ className?: string }>> = {
  terraform: SiTerraform,
  ansible: SiAnsible,
  chef: SiChef,
  puppet: SiPuppet,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  "github-actions": SiGithubactions,
  gitlab: SiGitlab,
  python: SiPython,
  bash: SiGnubash,
  linux: SiLinux,
  datadog: SiDatadog,
  grafana: SiGrafana,
  prometheus: SiPrometheus,
  mcp: SiModelcontextprotocol,
  claude: SiClaude,
  cursor: SiCursor,
  "github-copilot": SiGithubcopilot,
  "google-gemini": SiGooglegemini,
  openrouter: SiOpenrouter,
  huggingface: SiHuggingface,
  ollama: SiOllama,
  fastapi: SiFastapi,
  streamlit: SiStreamlit,
  pypi: SiPypi,
  jinja: SiJinja,
  apache: SiApache,
  "apache-tomcat": SiApachetomcat,
  "apache-solr": SiApachesolr,
  dotnet: SiDotnet,
  cplusplus: SiCplusplus,
  redhat: SiRedhat,
  ubuntu: SiUbuntu,
  akamai: SiAkamai,
  wix: SiWix,
};



export default function BrandMark({
  mark,
  className = "h-4 w-4",
}: {
  mark: ToolingMark;
  className?: string;
}) {
  const Glyph = mark.wordmark ? undefined : MARKS[mark.id];

  /* The wordmark path. Set in the mono face at the same optical height
     as the glyphs beside it, so a row of logos with four words in it
     still sits on one baseline. */
  if (!Glyph) {
    return (
      <span className="t-anno-sm leading-none whitespace-nowrap">
        {mark.word ?? mark.title}
      </span>
    );
  }

  /* A <use> reference, not the glyph itself.
   *
   * The path data lives once in BrandSprite; this is about forty bytes
   * instead of a kilobyte, which matters because the ticker draws
   * thirty-nine marks twice on every one of thirty-six pages. See the
   * header of BrandSprite.tsx for the measurement that prompted it.
   *
   * aria-hidden: the strip carries one accessible name for the whole
   * region, and the visible title sits beside every mark anyway. A
   * glyph that announces itself would read the name twice. */
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <use href={`#bm-${mark.id}`} />
    </svg>
  );
}
