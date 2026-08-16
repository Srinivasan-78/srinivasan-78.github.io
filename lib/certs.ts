export type Cert = {
  name: string;
  date: string;
  year: string;
  cat: string[];
  skills: string[];
  url: string;
};

const B = "https://www.linkedin.com/learning/certificates/";

export const CERTS: Cert[] = [
  { name: "Microsoft Azure: Networking Concepts", date: "Jul 2026", year: "2026", cat: ["cloud", "systems"], skills: ["Microsoft Azure"], url: B + "16cac5a771e2ab6019b5f13fb8ae762510d7ee0992f9d624fefda195d83454c6/" },
  { name: "Software Architecture Foundations", date: "Jul 2026", year: "2026", cat: ["cloud"], skills: ["Software Architecture"], url: B + "889bb515436ca4669c527304b4d5128b857320830ab40e9669bf837014c82ef5/" },
  { name: "Learning Apache Tomcat", date: "Apr 2026", year: "2026", cat: ["systems"], skills: ["Tomcat"], url: B + "544fb5b80f1725964e8938b8cadf51293b6d22c5ee7efe47edb006c3478fa8a9/" },
  { name: "Learning GitLab", date: "Mar 2026", year: "2026", cat: ["automation"], skills: ["GitLab"], url: B + "a8a1d40ee66e8082de1de1c6046a59e85df59a2313265e006873c35054484062/" },
  { name: "Networking Foundations: Networking Basics", date: "Mar 2026", year: "2026", cat: ["systems"], skills: ["Network Administration"], url: B + "fad30c6997a0d0f12513dc8e7f594d69e59925f1c4c156ee3d3543f4c8ec7329/" },
  { name: "Advanced GitHub Actions", date: "Mar 2026", year: "2026", cat: ["automation"], skills: ["GitHub"], url: B + "f74b462582707cf94ef319100f423e4b84eacf0b23a8afde5ba85a02d1800c00/" },
  { name: "Building Infrastructure as Code (IaC) with Azure Bicep: Part 1", date: "Mar 2026", year: "2026", cat: ["automation", "cloud"], skills: ["Bicep", "Cloud Development"], url: B + "d33a5d367146a60a0c68949be35a89a79127a89a6468c954cfb7a9f00adf6343/" },
  { name: "Monitoring and Observability with Datadog", date: "Jul 2025", year: "2025", cat: ["systems"], skills: ["System Monitoring", "Datadog"], url: B + "d2908b1c28a0e8f1a215dda6098d1efdf85c156ca92109e64f563f9a881f7723/" },
  { name: "Asking for Feedback as an Employee", date: "Dec 2023", year: "2023", cat: [], skills: ["Constructive Feedback"], url: B + "8fe27407cfd057248a6c30a3713e4a44197f56c46b28efaa76eca3e010cd3286/" },
  { name: "Installing Apache, MySQL, and PHP", date: "Jun 2023", year: "2023", cat: ["systems"], skills: ["MySQL", "Apache"], url: B + "a33142e65ae422e2d82c96494130d9283ab137ba2998ea0183fbd46b9c6f7a89/" },
  { name: "Apache Web Server: Administration", date: "Jun 2023", year: "2023", cat: ["systems"], skills: ["Apache"], url: B + "e0acaa3320ae0a09bbc38ab1c832ed11620fbc5076c541f6de29097ca148c864/" },
  { name: "DevOps Foundations: Continuous Delivery/Continuous Integration", date: "Jun 2023", year: "2023", cat: ["automation"], skills: ["CI/CD", "DevOps"], url: B + "7b1398d7e52388686666ad9bab55d86586a43c50ce03982b7d5b537622f97030/" },
  { name: "Azure Essential Training for Developers", date: "Jun 2023", year: "2023", cat: ["cloud"], skills: ["Microsoft Azure"], url: B + "efc75fbd7992be2bad28609939d123866bb1935cf03c962b2795ecbcc1123f89/" },
  { name: "Learning Azure DevOps", date: "Jun 2023", year: "2023", cat: ["cloud", "automation"], skills: ["Azure DevOps Services"], url: B + "46cc5b8a298f7a4d62d32327f7b5e874d7e217439cad7504c010cd12beb48343/" },
  { name: "Red Hat Certified Engineer (EX294) Cert Prep: 3 Managing Systems with Ansible", date: "Jun 2023", year: "2023", cat: ["automation", "systems"], skills: ["Red Hat Linux", "Ansible"], url: B + "e83e39a4551ebc3765064208de73901bc5850a02bbec5d29a4bf5095ea5e47f7/" },
  { name: "Red Hat Certified Engineer (EX294) Cert Prep: 2 Using Ansible Playbooks", date: "Jun 2023", year: "2023", cat: ["automation", "systems"], skills: ["Red Hat Linux", "Ansible"], url: B + "944e99c390435a7f6957bb58ab08ac3042c7e94a3ab1a591d33f3ffe4b750090/" },
  { name: "Red Hat Certified Engineer (EX294) Cert Prep: 1 Foundations of Ansible", date: "Jun 2023", year: "2023", cat: ["automation", "systems"], skills: ["RHEL"], url: B + "55db7fdd0984a59925ea1257bb84f5cda619b64b902e64456c97ef1d62fab7e7/" },
  { name: "Learning Ansible", date: "Jun 2023", year: "2023", cat: ["automation"], skills: ["Ansible"], url: B + "af1f32d594ce681a9859af0a10c7d4bd16229b1b16e73a90d91bc5c03ded41ce/" },
  { name: "Ansible Essential Training", date: "Jun 2023", year: "2023", cat: ["automation"], skills: ["Ansible"], url: B + "e89350b5f670eb29d43b026f67c3c8f640dd8a660e357d39fbf4b77e50318853/" },
  { name: "Introduction to Linux", date: "Sep 2021", year: "2021", cat: ["systems"], skills: [], url: B + "4dd4306f776532ceef3085d8fcd5b2e308f06d1215ba54a8cce7618847e50315/" },
  { name: "Learning Cloud Computing: Core Concepts", date: "Sep 2021", year: "2021", cat: ["cloud"], skills: [], url: B + "a4ef4897cae0f4e37095f9b6d0a4346ff43ceb1bd0785d8bfe173e0a32cc2048/" },
  { name: "Cloud Architecture: Core Concepts", date: "Aug 2021", year: "2021", cat: ["cloud"], skills: [], url: B + "8da2c0609372dcabc6c62fe9f21991dfbb731f88155665b93a08df1e0abf8a97/" },
];


export type Row = {
  id: string;
  label: string;
  match: (c: Cert) => boolean;
  /* Horizontal indent as a viewport percentage. The reference staggers
     every row to a different start so the block reads as a ragged
     column of type rather than a left-aligned list. */
  indent: number;
};

export const ROWS: Row[] = [
  { id: "all", label: "All", match: () => true, indent: 2 },
  { id: "cloud", label: "Cloud", match: (c) => c.cat.includes("cloud"), indent: 19 },
  { id: "automation", label: "Automation", match: (c) => c.cat.includes("automation"), indent: 36 },
  { id: "systems", label: "Systems", match: (c) => c.cat.includes("systems"), indent: 61 },
  { id: "recent", label: "Recent", match: (c) => Number(c.year) >= 2025, indent: 4 },
  { id: "foundations", label: "Foundations", match: (c) => Number(c.year) <= 2021, indent: 41 },
];

export const forRow = (row: Row) => CERTS.filter(row.match);
