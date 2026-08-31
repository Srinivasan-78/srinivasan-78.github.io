/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​​‌‌​‌​‌​‌‌‌​​‌‌​​​‌​‌​​‌‌​‌​​‌‌​‌‌‌​‌​‌​​‌‌​‌‌​​​‌​​‌​‌‌​‌​​‌‌‌​​‌​​‌‌‌​​​‌​‌‌​​‌​‌​​‌​‌‌​‌​‌‌‌​​​​​‌​‌​​​‌​‌‌​​‌‌‌​‌‌‌​​‌​​​‌​‌‌​‌​‌‌​​‌​​​​‌‌​​​​​‌​​‌​​‌​‌​​​​‌‌​‌‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.SW1M7SbZrqe-pQgr-d0ICq
 */
export type ProjectLink = { url: string; label: string };

/* A project may legitimately have no links: some of these live in
   repositories that are not public. An empty `links` array is that case,
   said out loud — app/projects/[slug]/page.tsx turns it into a contact CTA
   rather than rendering an empty button row. What must never appear here is
   a URL that 404s: a "View repo" button that goes nowhere is worse than no
   button, and every entry below is checked against the live URL. */

export type Project = {
  slug: string;
  title: string;
  /* Shown top-left on the card, the way the reference shows a client name. */
  client: string;
  category: string;
  status: string;
  teaser: string;
  /* Short pills on the card face — kept to 3 so the texture never overflows. */
  tags: string[];
  stack: string[];
  /* Key into the schematic map in ProjectGrid. Defaults to `title`;
     set only where the two have drifted apart. */
  schematic?: string;
  overview: string;
  architecture: { label: string; body: string }[];
  highlights: string[];
  /* The live, running build, when there is one. Every deployed project is
     served from the same domain as this site under its repository name
     (srinidevops.com/<Repo>/), so the index can offer a one-click route to
     the real thing instead of making a visitor read the write-up first to
     find it. Only URLs verified to answer 200 belong here. */
  demo?: string;
  links: ProjectLink[];
};

export const PROJECTS: Project[] = [
  {
    slug: "self-healing-deployment",
    title: "Self-Healing Deployment",
    client: "Live & deployed",
    category: "Platform",
    status: "Live",
    teaser:
      "Trigger a fault on purpose, then watch the pipeline spot it and heal itself.",
    tags: ["CI/CD", "Chaos", "Recovery"],
    stack: ["Ansible", "Docker", "FastAPI", "GitHub Actions", "Python", "GitHub Pages"],
    overview:
      "A deployment pipeline that ships a new version of a web service, checks whether the new version actually works, and puts the old one back automatically when it does not. Two container slots sit behind one port: the outgoing version is stopped but kept, the new one takes the port, and a health gate decides which of them keeps it. Every attempt — success, rollback, or a build that never got that far — is written to a log that a small dashboard draws as a timeline. It generalises the rollback and validation automation I built for production microservices into an open demo you can run for yourself.",
    architecture: [
      {
        label: "Two slots, one door",
        body: "The outgoing version is stopped and renamed `previous` rather than deleted, and the new one starts as `active` on port 8080. A stopped container keeps its filesystem, so restoring it takes a second — which is exactly why nothing here runs with `--rm`.",
      },
      {
        label: "Health gate",
        body: "validate.py requires all three of HTTP 200, a body reporting healthy, and a reply inside the latency budget. A 200 from a service that is broken underneath, or so slow it is useless, does not count as healthy.",
      },
      {
        label: "Retry with backoff",
        body: "A service that has just started often needs a moment, so a failed check retries on a growing delay — 2s, 3s, 4.5s, capped at 10s — before the gate gives up and hands over to rollback.",
      },
      {
        label: "Rollback role",
        body: "It deletes the broken release, renames `previous` back to `active`, starts it and waits for the port. First it checks whether the deploy actually touched anything: a build that failed before the swap must never turn into an outage.",
      },
      {
        label: "Chaos on demand",
        body: "Running the workflow with force_fail set makes the deployed container return HTTP 500 from its health endpoint on purpose. Recovery gets proved whenever you like, instead of waiting for a real outage to prove it for you.",
      },
      {
        label: "Log and dashboard",
        body: "Every ending appends one atomic entry — success, rollback or failed — to deployments.json. A dependency-free HTML page draws it newest-first as a colour-coded timeline and publishes to GitHub Pages after each run.",
      },
    ],
    highlights: [
      "A rollback deliberately fails the run: recovering from a broken release is not a successful release",
      "Health is three checks, not a curl — status code, body and response time",
      "Chaos testing is one workflow input away",
      "A failed build never becomes an outage, because nothing is torn down before the swap",
      "Every tunable lives in one group_vars file, with secrets kept separate",
    ],
    demo: "https://www.srinidevops.com/self-healing-deployment/",
    links: [
      { url: "https://www.srinidevops.com/self-healing-deployment/", label: "Open demo ↗" },
      { url: "https://github.com/Srinivasan-78/self-healing-deployment", label: "Source ↗" },
    ],
  },
  {
    slug: "pdf-tools",
    title: "PDF Tools",
    client: "Live & deployed",
    category: "Utility",
    status: "Live",
    teaser:
      "Drag-and-drop PDF processing that stays entirely in your browser. Your files stay yours.",
    tags: ["Client-side", "Zero upload", "Static"],
    stack: ["pdf-lib", "pdf.js", "JSZip", "Vanilla JS", "PyMuPDF", "FastAPI"],
    overview:
      "Nine PDF tools — merge, split, remove, extract, reorder, rotate, page numbers, add text and edit existing text — on one static page with no build step and no framework. Eight of the nine run entirely in your browser tab: the file is opened, changed and saved without ever leaving your machine, which is what makes it work offline and safe for documents you would never upload anywhere. The ninth, Edit Text, is honest about needing a small helper you run yourself, because rewriting a word in a PDF's own embedded font is something a browser genuinely cannot do.",
    architecture: [
      {
        label: "One page, four screens",
        body: "index.html holds four sections and shows one at a time, so changing screen is a CSS class rather than a page load. Three files — markup, styling and about 490 lines of JavaScript — are the whole site.",
      },
      {
        label: "One state object",
        body: "The chosen tool, the files, the page order, the removed and kept sets, rotations and edits all live in a single state object. Start over throws it away wholesale, so two jobs can never bleed into each other.",
      },
      {
        label: "Page order as numbers",
        body: "Reorder, remove and extract never move real pages while you work; they rearrange a list of indices, and the PDF is built once at the end by copying pages in that order. Three tools, one function, a different list each time.",
      },
      {
        label: "Thumbnails with a personality",
        body: "pdf.js paints each page onto a canvas at 40%, and the chosen tool attaches its own behaviour to that same grid: tap to delete, tap to keep, a rotate button, a drag handle, or a click that opens the page editor.",
      },
      {
        label: "Local output",
        body: "The finished bytes become a Blob and an invisible download link. Nothing was ever on a server — the file was invented in memory a second earlier.",
      },
      {
        label: "Edit Text, the exception",
        body: "A small FastAPI and PyMuPDF helper genuinely removes the old glyphs rather than covering them with a white box, pulls the original embedded font out by its xref, and redraws the new text in it. With no backend configured, that one tool says it is unavailable and the other eight carry on.",
      },
    ],
    highlights: [
      "Eight of the nine tools work with the network unplugged",
      "No build step, no npm install, no framework — open the file and it runs",
      "Redaction deletes the glyphs, because a white box leaves the words copy-pasteable underneath",
      "Click position is flipped and unscaled from screen pixels to PDF points",
      "The one tool that needs a server says so, rather than quietly uploading your file",
    ],
    demo: "https://www.srinidevops.com/browser-pdf-tools/",
    links: [
      { url: "https://www.srinidevops.com/browser-pdf-tools/", label: "Open tool ↗" },
      { url: "https://github.com/Srinivasan-78/browser-pdf-tools", label: "Source ↗" },
    ],
  },
  {
    slug: "vfactor-solutions",
    title: "vFactor Solutions",
    client: "Live & deployed",
    category: "Client build",
    status: "Live",
    teaser:
      "A full recruitment-consultancy site on its own domain: services, reviews, contact.",
    tags: ["Static site", "DNS", "HTTPS"],
    stack: ["Static site", "Vanilla JS", "GitHub Pages", "Formspree", "GoatCounter", "DNS + HTTPS"],
    overview:
      "A complete marketing site for a recruitment, RPO and lead-generation consultancy in Chennai: five static pages, no CMS, no build step. The front page asks visitors to say which of three people they are — hiring for a team, looking for a role, or buying a lead list — and sends each to the section that answers them. I delivered the whole thing: build, custom domain, DNS and HTTPS, forms, analytics consent and the legal pages. It has run itself ever since.",
    architecture: [
      {
        label: "Five pages, two shared files",
        body: "Home, privacy, terms, thank-you and 404 all point at one stylesheet and one script, so fixing the menu or changing a colour once fixes it everywhere. No page carries its own copy of anything.",
      },
      {
        label: "Three audiences, one hero",
        body: "The three 'I am here to' buttons scroll a visitor to the section built for their case and note which type they were, so one page serves three intents without three landing pages.",
      },
      {
        label: "Forms without a backend",
        body: "The review and candidate forms post to Formspree, with a hidden honeypot field that quietly discards bot submissions. They still work with JavaScript off: plain HTML validation, and a hidden field naming the thank-you page.",
      },
      {
        label: "Consent before counting",
        body: "Nothing is requested from the analytics provider until the banner is answered — not the script, not a pixel. The answer lives in localStorage on the visitor's own device, and the privacy page has a button that clears it.",
      },
      {
        label: "Theme before first paint",
        body: "A tiny inline script picks light or dark from the stored choice, or the system preference, before a single pixel is drawn. A dark-mode visitor never gets the flash of white.",
      },
      {
        label: "Delivery",
        body: "GitHub Pages publishes the docs folder on every push to main, with a CNAME file holding the custom domain. The founder photo ships as WebP and JPEG at two widths, and the multi-megabyte original never leaves the repository.",
      },
    ],
    highlights: [
      "Delivered end to end: build, domain, DNS, TLS",
      "Both forms keep working with JavaScript disabled",
      "Reduce-motion, a skip link and a keyboard-closable menu, handled rather than bolted on",
      "Analytics stays entirely unloaded unless the visitor says yes",
      "Push to main, live in about a minute — there is no build server anywhere",
    ],
    demo: "https://vfactorsolutions.com/",
    links: [
      { url: "https://vfactorsolutions.com/", label: "Visit site ↗" },
      { url: "https://github.com/Srinivasan-78/vfactor-solutions-site", label: "Source ↗" },
    ],
  },
  {
    slug: "multi-cloud-free-tier-platform",
    title: "Multi-Cloud Free-Tier Platform",
    client: "Platform engineering",
    category: "Infrastructure",
    status: "Work in progress",
    teaser:
      "One dashboard provisions free-tier compute across four clouds with Terraform, and an hourly sweep keeps every account tidy.",
    tags: ["Terraform", "FastAPI", "Multi-tenant"],
    stack: ["Terraform", "FastAPI", "Celery", "Redis", "Next.js", "Postgres", "Docker Compose"],
    overview:
      "One dashboard that provisions real compute on AWS, GCP, Azure or Oracle Cloud with Terraform, strictly inside each provider's free tier, then lists it all in one place and tears it down automatically after 24 hours. It owns no hardware: you supply your own cloud credentials and it acts on your behalf, more valet than rental company. Provisioning is the straightforward part — the interesting work is making a surprise bill structurally impossible.",
    architecture: [
      {
        label: "Request path",
        body: "Next.js to FastAPI to Redis to a Celery worker to Terraform. Building an instance takes one to three minutes, so the API saves the row, queues the job and answers pending in about 50ms rather than holding the browser open.",
      },
      {
        label: "The browser never picks the machine",
        body: "A request carries only a provider and a resource type. Instance size, region and image are looked up server-side and written into Terraform, so there is no field in which to ask for a $5,000 GPU box, however the request is forged.",
      },
      {
        label: "Four independent locks",
        body: "The allowlist, the server-side locked spec, Terraform variable validation inside the module itself, and a cap of one resource per provider with a 24-hour timer. All four have to be picked, not one.",
      },
      {
        label: "Tenant isolation",
        body: "Each user and provider gets its own Terraform workspace, with the module files symlinked rather than copied — one blueprint, many private state files — and every database query scoped by user, so another tenant's resource simply 404s.",
      },
      {
        label: "Hourly sweep",
        body: "Celery beat fires on the hour, queues a destroy for anything past its expiry and the worker runs terraform destroy. Resources live 24 to 25 hours, comfortably inside every provider's monthly allowance.",
      },
      {
        label: "Credentials",
        body: "Cloud keys are Fernet-encrypted before they reach Postgres and decrypted only by the worker, only at provision or destroy time. Listing credentials returns providers and dates, never a payload; passwords are bcrypt, sessions are JWT.",
      },
    ],
    highlights: [
      "Free-tier enforcement in four layers, two of them below the API",
      "Every resource is destroyed within 25 hours, forgotten or not",
      "Per-tenant Terraform state, with shared modules by symlink",
      "Cloud credentials encrypted at rest and never handed back out",
      "Honest about its edges: Azure and Oracle modules are still stubs, and state locking is local",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/multicloud-free-tier", label: "View repo ↗" }],
  },
  {
    slug: "multi-ai-toolkit",
    title: "Multi-AI Toolkit",
    client: "Platform engineering",
    category: "Orchestration",
    status: "Active",
    teaser:
      "Claude does the planning, free-tier APIs do the legwork, and one request gets spread across five providers.",
    tags: ["Python", "LLM routing", "Failover"],
    stack: ["Python", "Claude CLI", "Groq", "Gemini", "Mistral", "OpenRouter", "Cloudflare Workers"],
    overview:
      "One strong model plans, a crowd of free ones does the legwork. Claude splits a task into subtasks and writes the final answer, while Groq, Gemini, Mistral, Cerebras and OpenRouter run those subtasks in parallel underneath. There are three faces on the same logic — a command line, a terminal app that shows the plan executing live, and a hosted web page. Run locally, Claude is called through the CLI you are already logged into, so the planning rides your existing subscription instead of billing per token.",
    architecture: [
      {
        label: "Planner",
        body: "Claude reads the task, splits it into subtasks, tags each one with a type, and writes the synthesis prompt that will put the results back together later.",
      },
      {
        label: "Routing by subtask type",
        body: "config.yaml maps a type to a provider: extraction to Groq, summarisation to Gemini, bulk to Cerebras, coding to Mistral, hard reasoning to Claude. Rearranging the crew is a config edit, not a code change.",
      },
      {
        label: "Parallel execution",
        body: "Every subtask goes out at once instead of queueing, so a run takes as long as its slowest piece rather than the sum of all of them.",
      },
      {
        label: "Failover",
        body: "A provider that rate-limits or times out hands its subtask to OpenRouter. If that fails too, the subtask records an error and the run carries on — one broken piece never kills the answer, and the synthesiser sees the error like any other result.",
      },
      {
        label: "Synthesis",
        body: "Claude merges the results and settles the disagreements between them, so the expensive model is spent on judgement rather than on chopping.",
      },
      {
        label: "Keys behind a worker",
        body: "The hosted page holds no secrets. A Cloudflare Worker keeps the keys, checks the caller's origin server-side rather than trusting CORS, rate-limits per IP, and caps prompt length and output tokens before any provider is called.",
      },
    ],
    highlights: [
      "The expensive model only plans and synthesises",
      "Provider routing lives in config.yaml, so swapping one is not a code change",
      "Locally, Claude runs through the CLI login rather than a metered API key",
      "A provider that speaks the common OpenAI shape needs three config lines and no new code",
      "Honest about the limit: an origin check stops casual abuse, and provider spend caps are the real backstop",
    ],
    /* No public link: the repository is private, so an anonymous visitor gets a
       404 from it. The hosted page was served from a Pages site that no longer
       exists either — the repo has Pages disabled — so the demo button is gone
       rather than pointing at a dead URL. Restore both the moment it is public
       and published. */
    links: [],
  },
  {
    slug: "repo2graph",
    title: "repo2graph",
    client: "Platform engineering",
    category: "Code intelligence",
    status: "Active",
    teaser:
      "Point it at a codebase and it draws the map: a queryable graph of who calls what, plus chunks ready for a RAG pipeline.",
    tags: ["tree-sitter", "RAG", "GitHub Action"],
    stack: ["Python", "tree-sitter", "Neo4j / Cypher", "GraphML", "GitHub Actions", "GitHub Marketplace", "JSONL"],
    overview:
      "Point it at a codebase and it draws the map. Every folder, file, function, class and import becomes a node, and every containment, call, import, inheritance and co-change becomes an edge. Plain text search finds the files that mention login; the graph finds the function that does the login and hands you its callers and callees with it. It also cuts the code into retrieval chunks that each carry that neighbourhood in their header, which is usually the thing a RAG pipeline was missing.",
    architecture: [
      {
        label: "Parsing",
        body: "tree-sitter reads real code structure rather than guessing from words, so a repo it has never seen needs no configuration. Sixteen languages get full symbol and call extraction, and every other file still lands on the map in its folder, so nothing goes missing.",
      },
      {
        label: "Graph model",
        body: "CONTAINS, DEFINES, IMPORTS, CALLS, CALLS_EXTERNAL, INHERITS and CO_CHANGE, across repo, directory, file, symbol, module and external nodes. Node ids are readable enough to write by hand, like sym:pkg/mod.py::Class.method.",
      },
      {
        label: "Co-change edges",
        body: "Reading the last N commits links the files that keep being edited together, which is surprisingly good at exposing coupling nothing in the code makes obvious.",
      },
      {
        label: "Chunking for retrieval",
        body: "Roughly one chunk per function or class, each opening with its callers, its callees and its docstring, cut at about 4,000 characters with a few lines of overlap so nothing is lost at a seam.",
      },
      {
        label: "Built-in retriever",
        body: "Lexical scoring plus a one-hop walk across the graph, so the surrounding code comes along with every hit. No embedding model, no vector database and no API key needed to start.",
      },
      {
        label: "Outputs, split two ways",
        body: "human/ holds a single self-contained graph.html, an overview written to be read first, and a pre-laid-out GraphML for yEd or Gephi. agent/ holds the JSONL nodes, edges and chunks, an idempotent Cypher script for Neo4j, and a manifest that describes every other file — so a program needs nothing else to make sense of the folder.",
      },
      {
        label: "Published as a Marketplace Action",
        body: "Srinivasan-78/repo2graph@v1 is one step in any workflow: point it at the checkout or at another repo, and it uploads the graph as an artifact, writes the first 40 lines of the overview into the job summary, and exposes node, edge and chunk counts as outputs. commit-branch force-pushes the result to an orphan branch, so a pipeline can curl a current chunks.jsonl instead of rebuilding one.",
      },
      {
        label: "Parallel parsing",
        body: "Files are read one per processor core, capped at eight, so a large repository finishes in a minute or two. The number of workers changes only the wall clock: the graph that comes out is identical either way.",
      },
    ],
    highlights: [
      "Sixteen languages parsed with tree-sitter, zero configuration",
      "Chunks carry their graph neighbourhood, so retrieval lands on the right code",
      "graph.html is one file: no server, no install, drag, zoom and search in a browser",
      "Honest about approximation: name-matched calls carry a confidence score, and a missing edge never proves a missing call",
      "Entrypoints are marked and ranked by reach, so the main paths through a project are findable",
      "On the GitHub Marketplace at v1, so keeping a fresh graph beside your own code is three lines of YAML",
      "It indexes itself: a workflow re-runs on every push to main and weekly, and publishes the graph to a branch",
    ],
    links: [
      { url: "https://github.com/marketplace/actions/repo2graph", label: "GitHub Marketplace \u2197" },
      { url: "https://github.com/Srinivasan-78/repo2graph", label: "View repo \u2197" },
    ],
  },
  {
    slug: "tokenmiser",
    title: "tokenmiser",
    client: "Platform engineering",
    category: "Developer tooling",
    status: "Active",
    teaser:
      "Fifteen skills that teach Claude Code to spend fewer tokens on the same work, and two scripts that prove whether it actually worked.",
    tags: ["Claude Code", "Token cost", "Measurement"],
    stack: ["Node.js", "Python", "Bash", "Claude Code skills", "Markdown", "JSONL"],
    overview:
      "A model has no memory, so every message re-sends the entire conversation from the beginning. That is what you are billed for, and it means message forty in a long session can cost fifteen times what message one cost even if you only typed \u201cyes, do that\u201d. tokenmiser goes after the size of that pile rather than the length of the reply, which is where most advice stops and where under a tenth of the tokens live. Fifteen Markdown skills each take one contributor to the pile \u2014 the always-on rulebook, the conversation history, the tool output, the reply \u2014 and squeeze it, and a PreToolUse hook cuts the noisiest tool output before it ever gets into the context. Nothing runs in the background, nothing leaves the machine, and every claim it makes is checked against the session logs Claude Code already writes.",
    architecture: [
      {
        label: "The pile, not the reply",
        body: "Each turn re-sends the rulebook, the whole session so far, and everything any tool printed. A single test run that dumped 10,000 lines is not paid for once \u2014 it is re-sent with every message for the rest of the session. That is the trap the whole toolkit is built around.",
      },
      {
        label: "Fifteen skills, one lever each",
        body: "Every skill is a Markdown file of instructions and nothing else, and Claude reads the full file only when you invoke it. They split across the four buckets: context size (audit, compress, tools), history (session, prompt), retrieval and tool output (read, delegate, hooks), and the reply itself (speak, git, model).",
      },
      {
        label: "The filter hook",
        body: "A PreToolUse hook rewrites a noisy command before its output reaches the model: test runners keep failures plus context, builds keep errors, installers keep the tail, git log gets an --oneline head. Anything already piped, redirected or joined with && is left completely alone, because appending a pipe there would change what actually runs.",
      },
      {
        label: "Exit codes survive the filter",
        body: "Every rewritten command ends with exit ${PIPESTATUS[0]} and a one-line marker, so a hidden failure can never read as a pass. Custom rules go in a JSON file rather than the script, an environment variable turns it off for one shell, and the hook ships a --selftest.",
      },
      {
        label: "Measure before you type",
        body: "A report totals the always-on context \u2014 the CLAUDE.md, the settings, the description of every installed skill \u2014 and names what is fat. That number is paid at the start of every session, forever, whether any of it gets used or not.",
      },
      {
        label: "Session accounting",
        body: "The bench script reads the usage the API already reported into the local session logs, deduplicated by request id because Claude Code writes several lines per reply. It compares two runs per turn rather than in total, since a harder task honestly costs more \u2014 totals are not a score.",
      },
    ],
    highlights: [
      "The filter hook is usually the biggest single win, because it removes tokens from every later turn as well as this one",
      "Filtered commands preserve the real exit status, so a quiet failure can never be mistaken for a pass",
      "Bench figures are deduplicated by request id; tools that skip that step report sessions two to three times larger than they are",
      "A change that saves 30% and gets the answer wrong is recorded as a loss \u2014 the results log has a column for saying so",
      "Honest about its own cost: fifteen installed skills advertise roughly 1.5k tokens per session, and status prints your figure",
      "No network call anywhere in the repository, and the installer prints its plan and asks before writing",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/tokenmiser", label: "View repo \u2197" }],
  },
  {
    slug: "authormark-watch",
    title: "Master Bot & Repository Supervisor",
    schematic: "authormark-watch",
    client: "Platform engineering",
    category: "Provenance & Automation",
    status: "Active",
    teaser:
      "A centralized Master Bot that supervises, secures, watermarks, and auto-triages every repository across the GitHub account.",
    tags: ["Supervisor Bot", "Provenance", "Actions"],
    stack: ["Node.js", "GitHub Actions", "REST API", "HMAC SHA-256", "Bash", "GitHub CLI"],
    overview:
      "A centralized Master Bot and supervisor that continuously audits, maintains, and enforces repository standards across every repo in the account. Beyond checking for valid @authormark watermarks and tamper-evident HMAC fingerprints, it acts as an autonomous repo maintainer: auto-fixing unmarked files via isolated pull requests, scanning for exposed tokens and secrets, detecting dirty pycache/build artifacts, validating licensing and manifest hygiene, automatically calculating PR size tags (XS through XL), and triaging incoming issues. Operating as an external supervisor, it can never be bypassed or tampered with from inside the repository under test.",
    architecture: [
      {
        label: "Checked from outside",
        body: "Runs standalone supervisor logic outside target repositories, ensuring a tampered workflow or compromised repository configuration cannot falsely declare itself clean.",
      },
      {
        label: "Automated Fix PRs",
        body: "In fix mode, checks out an isolated authormark branch, stamps unmarked or drifted source files with keyed HMAC signatures, and opens a clean, automated pull request without touching the default branch.",
      },
      {
        label: "Secret & hygiene scanning",
        body: "Scans commits and trees for leaked PATs, cloud API keys, AWS credentials, JWT tokens, committed .env files, and tracked metadata artifacts before they become liabilities.",
      },
      {
        label: "Automated PR tagging",
        body: "Calculates line-change deltas to assign size badges (size/XS to size/XL), detects language footprints, and classifies pull request types (type/feat, type/fix, type/ci) with pre-provisioned label palettes.",
      },
      {
        label: "Issue classification & triage",
        body: "Analyzes issue context, keywords, and priority signals to assign severity and category labels automatically, ensuring new issues are categorized on arrival.",
      },
      {
        label: "Consolidated status dashboard",
        body: "All account-wide findings are consolidated into a single GitHub issue that updates in place each day and closes automatically once every repo passes, preventing alert fatigue.",
      },
    ],
    highlights: [
      "Autonomous fix mode opens ready-to-merge pull requests with intact watermarks",
      "Full secret scanner catches exposed tokens and private keys across all branches",
      "Automated PR size and category labeler maintains clean review queues across repos",
      "Single persistent status issue prevents alert fatigue by updating in place",
      "Zero third-party dependencies: built with pure Node.js standard libraries and GitHub APIs",
    ],
    /* Internal supervisor repository; detail page presents contact CTA */
    links: [],
  },
  {
    slug: "zim-assistant",
    title: "Zim Assistant",
    client: "Platform engineering",
    category: "Homelab",
    status: "Active",
    teaser: "A homelab chatbot that searches offline Wikipedia snapshots through a local LLM.",
    tags: ["Python", "Kiwix", "Self-hosted"],
    stack: ["Python", "Kiwix", ".zim archives", "Batch", "Self-hosted"],
    overview:
      "Tooling for running a homelab around .zim archives, which are offline snapshots of Wikipedia and similar knowledge bases, served locally through Kiwix. What you end up with is a knowledge assistant that keeps working happily with the internet unplugged.",
    architecture: [
      {
        label: "Archive layer",
        body: "Kiwix serves the .zim files locally, which turns an offline encyclopedia snapshot into something you can search in full.",
      },
      {
        label: "Application layer",
        body: "A Python app sits over the archives with a UI for querying them conversationally.",
      },
      {
        label: "Launcher",
        body: "A Windows batch launcher brings the whole stack up in one go.",
      },
    ],
    highlights: [
      "Fully offline: every answer comes from your own archives",
      "Runs on ordinary homelab hardware",
      "One command starts the whole stack",
    ],
    /* No public link. https://github.com/Srinivasan-78/kiwix-homelab is private,
       so the button that pointed at it was a dead CTA. Restore the entry the
       moment the repository is public — the detail page reads an empty list as
       "offer the contact route instead". */
    links: [],
  },
  {
    slug: "simple-actions",
    title: "GitHub Actions Snippets",
    client: "CI/CD & packaging",
    category: "Pipelines",
    status: "Reference",
    teaser:
      "Reusable GitHub Actions templates that build, sign and release Windows and Linux installers.",
    tags: ["Actions", "Signing", "Release"],
    stack: ["GitHub Actions", "Self-hosted runners", "MSBuild", "Code signing", "dpkg", "Batch"],
    overview:
      "A library of GitHub Actions workflow templates for building, signing, packaging and cleaning up release artifacts on Windows and Linux runners. It is the scaffolding that gets a desktop project shipping proper releases on day one.",
    architecture: [
      {
        label: "Build stage",
        body: "Runs on a Windows runner: NuGet restore, MSBuild, then building the installer.",
      },
      {
        label: "Signing stage",
        body: "Kept on a self-hosted runner so signing keys stay entirely under your own control. That split is the whole reason the pipeline is composite rather than a single job.",
      },
      {
        label: "Publish stage",
        body: "Pushes the signed output out as a GitHub release.",
      },
      {
        label: "Cleanup stage",
        body: "Clears the intermediate artifacts once the release is published, so storage stays lean build after build.",
      },
    ],
    highlights: [
      "Signing keys stay on infrastructure you own",
      "Windows and Linux packaging in one set of templates",
      "Artifact cleanup is part of the pipeline itself",
    ],
    /* No public link. https://github.com/Srinivasan-78/github-actions-snippets is
       private, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "doc2md-action",
    title: "doc2md-action",
    client: "CI/CD & packaging",
    category: "Actions",
    status: "Active",
    teaser:
      "Turns PDFs, Office files and scans into Markdown \u2014 as a GitHub Action on every push, or in your browser with nothing uploaded.",
    tags: ["Actions", "OCR", "Markdown"],
    stack: ["GitHub Actions", "Python", "Tesseract OCR", "LibreOffice", "tesseract.js", "pdf.js", "Markdown"],
    overview:
      "AI tools and code search cannot read a PDF or a spreadsheet — they read text. This does the reading and leaves behind Markdown that anyone, or anything, can open. Point the Action at a folder of documents and it converts them on every push; or open the browser version, drop files straight in, and get the same Markdown back without committing anything anywhere.",
    architecture: [
      {
        label: "Per-format routing",
        body: "PDFs give up their text per page; Word, PowerPoint and HTML become headings, paragraphs and lists; Excel and CSV become one Markdown table per sheet. Legacy .doc, .xls and .ppt go through LibreOffice into the modern format first.",
      },
      {
        label: "OCR fallback",
        body: "A PDF page holding almost no extractable text is treated as a scan, rendered at the configured DPI and read with Tesseract. Whichever version has more text wins, so a page that did have text loses nothing to the attempt.",
      },
      {
        label: "Browser version",
        body: "The same conversion runs entirely in the tab, served from GitHub Pages. Files are read with the File API and never leave the machine — there is no upload endpoint, because a static host has nothing to upload to.",
      },
      {
        label: "Batch in the browser",
        body: "A dropped folder or .zip converts at once in a worker pool sized from the machine's core count, with a matching pool of OCR workers. Results are held as Blobs so a big batch never fills the JS heap, and folder structure survives into the downloaded zip.",
      },
      {
        label: "Token trimming",
        body: "Compact mode drops blank lines and the headers and footers repeated on every page, and the run reports total tokens and the percentage saved.",
      },
      {
        label: "Traceability and failures",
        body: "Every output file opens with a header naming the document it came from, and a manifest records page counts and whether OCR was needed. One unreadable document is counted as failed and everything else still converts, unless you ask the job to fail on error.",
      },
    ],
    highlights: [
      "Scanned pages picked up by OCR without being asked",
      "A browser version that converts locally, with nothing uploaded",
      "Whole folders and zips at once, on as many cores as the machine has",
      "One merged file when you want to paste a whole document set into a model",
      "A header on every output and a manifest, so any sentence traces back to its source",
    ],
    demo: "https://www.srinidevops.com/doc2md-action/",
    links: [
      { url: "https://www.srinidevops.com/doc2md-action/", label: "Convert a file \u2197" },
      { url: "https://github.com/Srinivasan-78/doc2md-action", label: "View repo \u2197" },
    ],
  },
  {
    slug: "wix-installer-template",
    title: "WiX Installer Template",
    client: "CI/CD & packaging",
    category: "Packaging",
    status: "Reference",
    teaser: "A WiX scaffold that turns a build output into a signed MSI, shortcuts and all.",
    tags: ["WiX", "MSI", "MSBuild"],
    stack: ["WiX Toolset v3", "MSBuild", "Heat harvesting", "MSI", "XML"],
    overview:
      "A reusable WiX Toolset scaffold that turns a desktop app build into a Windows MSI. Directory layout, shortcuts, localization and upgrade handling are already wired up, so a new project starts from a working scaffold.",
    architecture: [
      {
        label: "Component harvesting",
        body: "Heat harvests the published build output into components automatically, so the manifest stays correct as the project grows.",
      },
      {
        label: "Install layout",
        body: "Directory structure, shortcuts and localization are set up front and reused.",
      },
      {
        label: "Upgrade handling",
        body: "Upgrade logic is in from the start, so every later version replaces the last one cleanly.",
      },
    ],
    highlights: [
      "Manifests stay accurate on their own",
      "Upgrade path is right from the first release",
      "Drops into any MSBuild desktop project",
    ],
    /* No public link. https://github.com/Srinivasan-78/wix-installer-template is
       private, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "brainrot-study",
    title: "Study Brainrot Generator",
    schematic: "Brainrot Study — automated video pipeline",
    client: "CI/CD & packaging",
    category: "Automation",
    status: "In progress",
    teaser: "Type in a topic and get back a finished short-form study video: script, voiceover, render.",
    tags: ["Actions", "FFmpeg", "TTS"],
    stack: ["GitHub Actions", "Python", "FFmpeg", "edge-tts", "Gemini", "DeepSeek"],
    overview:
      "Type a topic into a workflow input and finished short-form study videos come back: researched, scripted, narrated, captioned and cut to phone shape. Four stages hand work to each other as files in a build folder rather than talking directly, so any one of them can be rerun or replaced on its own. GitHub Actions is the entire runtime — nothing is installed, nothing is hosted, and the machine disappears when the run ends.",
    architecture: [
      {
        label: "Research",
        body: "Takes the top three real Wikipedia articles, discarding disambiguation pages, and fits them into a 15,000-character budget by equal shares, shortest first, handing unused space back. Otherwise one enormous article crowds the other two out entirely.",
      },
      {
        label: "Script generation",
        body: "Asks for twelve chunks of 25 to 35 words under a strict-JSON contract, working down a ranked list of the Gemini models that are actually free today and falling back to DeepSeek. A quota or missing-model error moves to the next one; a bad key stops immediately, because retrying will never fix it.",
      },
      {
        label: "Validation before trust",
        body: "The script has to parse, hold 6 to 16 chunks, and keep every chunk non-empty and under 60 words — a hand-written script goes through exactly the same gate. A bad one fails here rather than five minutes later inside a finished video.",
      },
      {
        label: "Voice and word timings",
        body: "edge-tts narrates each chunk and returns the start and length of every spoken word. The newer conversational voices return none at all, so the run measures the audio with ffprobe and shares the time out by word length instead, and says so in the log.",
      },
      {
        label: "Captions and cut",
        body: "Word timings become karaoke subtitle tags, three words to a line, with a timer covering the silence before each word — without it the highlight drifts ahead of the voice and the error compounds along the line. FFmpeg burns them into background footage scaled and cropped to 1080×1920, with padding silence and loudness normalisation.",
      },
      {
        label: "Packing and background continuity",
        body: "Chunks are packed into videos up to 55 seconds and never cut in half, so no video ends mid-sentence. Background clips play as one continuous timeline across segments, seeked with the trim filter on a rotated playlist because seeking the concat demuxer silently drops frames.",
      },
    ],
    highlights: [
      "Runs entirely on GitHub Actions: no install, no hosting, no video editor",
      "Stages talk through files, so any one of them can be rerun alone",
      "Model failover ranked by which free models actually have quota today",
      "Caption timing pays for the silences, so it stays locked to the voice",
      "Typed workflow input never reaches the shell: passed as an environment variable and pattern-checked",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/study-brainrot-generator", label: "View repo ↗" }],
  },
  {
    slug: "minecraft-server-setup",
    title: "Minecraft Server GitOps",
    client: "CI/CD & packaging",
    category: "GitOps",
    status: "Active",
    teaser:
      "A game server run entirely by editing text files: push to main, and a robot backs up, deploys and verifies.",
    tags: ["GitOps", "Actions", "systemd"],
    stack: ["GitHub Actions", "Bash", "systemd", "SSH / rsync", "Linux", "PaperMC"],
    overview:
      "A Minecraft server that runs 24/7 on an ordinary Linux box and is administered without ever logging into it. The repository is the source of truth: difficulty, whitelist, ops, memory and game version are files in config/, and a push to main is the deployment. GitHub Actions is the only moving part on the GitHub side — a fresh runner unlocks a deploy key, rsyncs the repo across, backs the world up, applies the change and checks the service came back. The host stays a completely normal machine, so it can be any cloud VM, VPS or Pi you can SSH into.",
    architecture: [
      {
        label: "The repo is the server",
        body: "config/ holds server.env, server.properties, ops.json, whitelist.json and banned-players.json. Whatever those files say is what the host ends up running, so every change has an author, a date and a revert — and drift on the box loses the argument.",
      },
      {
        label: "Three workflows, one shared start",
        body: "provision, deploy and backup all begin with the same composite action: write the deploy key and rsync the repo. They share a concurrency group so only one may touch the machine at a time — two runners restarting the server at once would be a mess.",
      },
      {
        label: "Backup before touching anything",
        body: "The deploy takes a world archive first, then swaps the jar, syncs config and restarts. A change that turns out to be a bad idea always has yesterday's world sitting behind it.",
      },
      {
        label: "A backup that isn't corrupt",
        body: "You cannot tar a live world mid-write, so backup.sh sends save-off and save-all flush into the running server, waits, archives, then save-on — under a shell trap, so saving is switched back on even if the archive step dies. Seven archives are kept.",
      },
      {
        label: "Version switching by symlink",
        body: "server.jar is a symlink into jars/, and old jars are never deleted. Upgrading is one line of server.env; rolling back is reverting that line. Download URLs are resolved from Mojang's manifest or PaperMC's API, skipping any build with a pre-release marker so `latest` never lands friends on a beta.",
      },
      {
        label: "Clean shutdowns",
        body: "run.sh holds the console FIFO open with sleep infinity, because a server that reads EOF on stdin decides the operator has left and quits. It also traps SIGTERM and types `stop` into the console instead of letting Java die mid-save, with 180 seconds allowed for it.",
      },
      {
        label: "Least privilege on the host",
        body: "The service runs as a dedicated no-login user under NoNewPrivileges, ProtectHome, ProtectSystem=full and a single ReadWritePaths, restarting on failure. The deploy user gets a sudoers file listing named scripts rather than blanket root.",
      },
    ],
    highlights: [
      "Administered entirely through pull requests and pushes — nobody SSHes in to change a setting",
      "Every deploy backs up first, and provisioning is idempotent, so re-running it is never destructive",
      "The placeholder UUIDs deliberately fail the deploy, rather than quietly shipping a server nobody can op",
      "Nothing GitHub-specific is installed on the host: any Debian-family box you can SSH into works",
      "Honest about the trade: port 22 must stay open to the internet because runners have no fixed IPs, and push access to main is effectively root",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/minecraft-server-gitops", label: "View repo ↗" }],
  },
  {
    slug: "matter-test-harness-image-builder",
    title: "Matter Test Harness Image Builder",
    client: "Hardware & imaging",
    category: "Hardware",
    status: "Active",
    teaser: "Turns a bare Pi into a certified Matter test harness, then images the finished SD card.",
    tags: ["Bash", "Matter", "Raspberry Pi"],
    stack: ["Bash", "Raspberry Pi", "Ubuntu 22.04", "Docker", "Matter / CHIP", "PiShrink"],
    overview:
      "Bash automation that takes a Raspberry Pi running Ubuntu 22.04 and turns it into a complete Matter (CHIP) Test Harness. It then makes a compressed, distributable image of the finished SD card, so setting up the next machine is a single flash.",
    architecture: [
      {
        label: "Dependency install",
        body: "Installs Docker, Poetry and the rest of the system dependencies the harness needs on a clean Ubuntu 22.04 Pi.",
      },
      {
        label: "Harness build",
        body: "Clones and builds the chip-certification-tool harness on the device itself.",
      },
      {
        label: "Imaging",
        body: "Images the live SD card with dcfldd, capturing the fully provisioned environment exactly as it stands.",
      },
      {
        label: "Shrink",
        body: "PiShrink compresses the result down to a size you can share easily.",
      },
    ],
    highlights: [
      "A certification environment reduced to one flash",
      "Captures the fully built state, ready to flash",
      "PiShrink keeps the image a sane size",
    ],
    /* No public link. https://github.com/Srinivasan-78/matter-th-pi-image is
       private, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "imgautomation",
    title: "Pi Image Build Automation",
    client: "Hardware & imaging",
    category: "Hardware",
    status: "Active",
    teaser: "The unattended bootstrap half of the imaging pipeline. It picks itself back up after every reboot.",
    tags: ["Bash", "Bootstrap", "Unattended"],
    stack: ["Bash", "Raspberry Pi", "Auto-start hooks", "Git automation"],
    overview:
      "The bootstrap half of the imaging pipeline. It takes a plain Ubuntu Pi and gets it to the point where the image builder can take over, entirely on its own. That is the clever part, because the process spans several reboots.",
    architecture: [
      {
        label: "Repo staging",
        body: "Clones the build repo onto an attached external disk rather than the SD card, which keeps the card pristine for imaging.",
      },
      {
        label: "Reboot survival",
        body: "Installs a login hook so the build picks up again after a reboot. That hook is what makes the run genuinely unattended.",
      },
      {
        label: "Handoff",
        body: "Hands over to the main image-builder orchestrator once the machine is in a known state.",
      },
    ],
    highlights: [
      "Carries straight through the reboots a Pi provisioning run needs",
      "Build artifacts stay off the card being imaged",
      "Clean handoff to the image builder",
    ],
    /* No public link. https://github.com/Srinivasan-78/pi-image-build-automation is
       private, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "azure-pipeline-trigger",
    title: "Azure Pipeline Trigger",
    client: "CI/CD & packaging",
    category: "Pipelines",
    status: "Active",
    teaser:
      "One button in GitHub starts an Azure DevOps release, streams its logs back, and records the result.",
    tags: ["Actions", "Azure DevOps", "Datadog"],
    stack: ["GitHub Actions", "Azure DevOps REST API", "Bash", "curl", "jq", "Datadog"],
    overview:
      "GitHub and Azure DevOps do not talk to each other, so promoting a release meant leaving one tab, finding the right pipeline in the other, remembering the right parameters, and then refreshing a page until it finished. This is the telephone line between them: a dispatch form with three dropdowns triggers the Azure pipeline over its REST API, then polls it and copies its logs into the GitHub run as they appear. Success or failure is shipped to Datadog, so months later there is still an answer to which version went where, and whether it worked.",
    architecture: [
      {
        label: "A form instead of a runbook",
        body: "Direction, version and service are workflow_dispatch inputs, two of them dropdowns, so a subscription name cannot be typo'd. All three are handed to the pipeline as templateParameters and the run title repeats them, which makes a list of past runs readable at a glance.",
      },
      {
        label: "Trigger, then verify",
        body: "One POST starts the run. The step checks the HTTP status as well as the returned id, because a 401 with an error body and a successful run both come back as JSON — only one of them has an id, and neither is an exception.",
      },
      {
        label: "Pulling logs that are not pushed",
        body: "Azure does not stream logs out, so the job polls the timeline every 15 seconds and prints any log id it has not printed before, tracked as a seen-list rather than a high-water mark. One final pass runs after the pipeline finishes, so the last lines are never lost.",
      },
      {
        label: "Credentials never in the script",
        body: "The PAT and pipeline id arrive as step env vars rather than being interpolated into the shell, and the trigger call is silent — an earlier verbose curl printed the Basic auth header, which GitHub's secret masking cannot catch because the base64 is not the secret it was given.",
      },
      {
        label: "A bounded wait",
        body: "The poll loop has a timeout, so a wedged pipeline fails the job with that reason instead of holding a runner for six hours until GitHub kills it.",
      },
      {
        label: "The result outlives the run",
        body: "Status, timestamp, service, version and the GitHub run id go to Datadog at the end, and a failed deployment exits non-zero so the GitHub run is red too.",
      },
    ],
    highlights: [
      "One button: no second tab, no remembering pipeline parameters",
      "Azure's logs appear inside the GitHub run while it is still going",
      "A run that fails in Azure fails in GitHub — the two never disagree",
      "Secrets travel through env, never through string interpolation into a shell",
      "Honest about the cost: polling keeps a runner alive for the whole deployment",
    ],
    /* No public link. https://github.com/Srinivasan-78/azure-pipeline-trigger is
       private, so a button pointing at it would be a dead CTA. The detail page
       reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "pi-image-shrink",
    title: "Pi Image Shrink",
    client: "Hardware & imaging",
    category: "Hardware",
    status: "Complete",
    teaser:
      "Cuts a Raspberry Pi backup image down to the space actually used, and grows it back on first boot.",
    tags: ["Bash", "Raspberry Pi", "Imaging"],
    stack: ["Bash", "Raspberry Pi", "ext4 / resize2fs", "losetup", "gzip / xz"],
    overview:
      "A raw copy of a 64 GB card is a 64 GB file even when only 8 GB is in use, because dd copies the empty space too. This shrinks the filesystem and the partition to what is actually there, then plants a first-boot hook that expands it again to fill whatever card it lands on. It is the step that makes an image small enough to publish, and it is the piece the Matter harness image builder hands its output to.",
    architecture: [
      {
        label: "Shrink",
        body: "Checks the filesystem, resizes it to its minimum, then moves the partition end to match. Getting that end offset right is the whole job — one sector out and the image will not mount.",
      },
      {
        label: "Grow back on first boot",
        body: "A hook added inside the image expands the filesystem the first time it starts, so a shrunk image is not a smaller machine, just a smaller file.",
      },
      {
        label: "Compression",
        body: "Optionally gzip or xz the result, in parallel where the tool supports it, since a mostly-empty image compresses extremely well.",
      },
      {
        label: "Refusing the wrong target",
        body: "The script tests that it was handed a regular file, so pointing it at a block device like /dev/sda fails immediately rather than halfway through resizing a live disk.",
      },
    ],
    highlights: [
      "A 64 GB card becomes a file you can actually upload",
      "Expands itself on first boot, so nothing is lost by shrinking",
      "Refuses a block device rather than damaging one",
      "Distinct exit codes per failure, so a build script can tell what went wrong",
    ],
    /* No public link. https://github.com/Srinivasan-78/pi-image-shrink is private,
       so a button pointing at it would be a dead CTA. It is derived from
       Drewsif/PiShrink, which is public and credited in the repository. */
    links: [],
  },
  {
    slug: "speedtestdd",
    title: "dd Block-Size Benchmark",
    client: "Utilities",
    category: "Benchmark",
    status: "Complete",
    teaser: "Sweeps dd block sizes from 512B to 64MB to find the fastest one for this disk.",
    tags: ["Bash", "dd", "I/O"],
    stack: ["Bash", "dd", "I/O benchmarking", "Cache-aware"],
    overview:
      "Works out the best dd block size for a given machine by sweeping from 512 B up to 64 MB and reporting throughput at each step. Worth running before you image or clone a drive: the right block size can save you hours.",
    architecture: [
      {
        label: "Sweep",
        body: "Runs dd across the whole block-size range and records throughput at each step.",
      },
      {
        label: "Cache handling",
        body: "Clears the kernel page cache between runs, so every number reflects real disk I/O and you can trust the winner.",
      },
      {
        label: "Report",
        body: "Prints throughput per block size, so the right value for that particular machine and disk is obvious.",
      },
    ],
    highlights: [
      "Cache-aware, so you can trust every number",
      "Answers one narrow question properly",
      "Run it once before a long imaging job",
    ],
    /* No public link. https://github.com/Srinivasan-78/dd-blocksize-benchmark is
       private, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "automatch",
    title: "automatch",
    client: "AI & Candidate Intelligence",
    category: "Talent Intelligence",
    status: "Active",
    teaser:
      "Deterministic resume parsing and multi-factor job-matching engine with semantic relevance scoring, automated gap analysis, and ATS-optimized recommendations.",
    tags: ["NLP", "Resume Parsing", "ATS Engine"],
    stack: ["Python", "FastAPI", "TypeScript", "Next.js", "spaCy", "Sentence Transformers", "PostgreSQL", "Docker"],
    overview:
      "An automated resume-to-job matching and candidate screening engine built to eliminate keyword gaming and black-box ATS rejections. It extracts semantic skill graphs, work history timelines, and domain competencies from raw PDF and DOCX files without relying on flaky third-party APIs. Resumes are scored against structured job specs across five weighted dimensions: core technical stack, domain depth, leadership experience, certifications, and recency of practice. What comes out is not a blunt similarity percentage, but an explainable match scorecard highlighting exact qualification matches, missing prerequisite skills, and actionable resume optimization suggestions.",
    architecture: [
      {
        label: "Format extraction",
        body: "Dual-engine document parser extracts structured text, section boundaries, and layout geometry from complex multi-column PDFs and DOCX files without losing timeline or semantic context.",
      },
      {
        label: "Entity & skill graph",
        body: "spaCy and custom taxonomy tokenizers normalize varying job titles and synonym technologies into a canonical knowledge graph (e.g. mapping k8s, Kube, and Kubernetes to a single root node).",
      },
      {
        label: "Vector & lexical scoring",
        body: "Hybrid retrieval combines BM25 keyword precision with dense semantic sentence embeddings, preventing buzzword-stuffing from artificially inflating candidate match scores.",
      },
      {
        label: "Multi-factor weighting",
        body: "Calculates separate scores for required vs preferred qualifications, recency of tool usage, and seniority level before synthesizing the overall match index.",
      },
      {
        label: "Explainable gap analysis",
        body: "Generates line-by-line justification reports identifying candidate strengths, missing credentials, and specific resume bullet points that need quantitative metrics.",
      },
      {
        label: "Batch runner & API",
        body: "FastAPI backend handles high-concurrency resume batch processing with Redis task queues and background worker pools, caching parsed profiles in PostgreSQL.",
      },
    ],
    highlights: [
      "Deterministic five-dimension scoring prevents keyword stuffing and false positives",
      "Canonical skill graph resolves synonyms, acronyms, and version variations automatically",
      "Explainable scorecard details why a candidate matched or fell short, with no black-box scores",
      "Zero external data leakage: all parser models run locally inside private Docker containers",
      "High-throughput batch screening processes hundreds of candidate resumes in minutes",
    ],
    links: [],
  },
  {
    slug: "pumpkin-mc",
    title: "Pumpkin (Rust Minecraft Engine)",
    schematic: "Pumpkin (Rust Minecraft Engine)",
    client: "Systems Engineering",
    category: "Game Architecture",
    status: "Active",
    teaser:
      "A blazingly fast, multi-threaded Minecraft server implementation written from scratch in Rust, optimized for extreme concurrency and minimal memory footprint.",
    tags: ["Rust", "Networking", "Concurrency"],
    stack: ["Rust", "Tokio", "Rayon", "Custom Network Protocol", "Zero-Copy Deserialization", "Docker", "Cross-Platform"],
    overview:
      "A high-performance Minecraft server architecture written entirely in Rust to challenge the legacy JVM server model. By leveraging Rust's zero-cost abstractions, fearless concurrency, and deterministic memory management without garbage collection pauses, Pumpkin delivers sub-millisecond tick times, handles thousands of concurrent packet streams, and runs on a fraction of the RAM required by traditional Java servers. It implements the native Minecraft network protocol, custom ECS (Entity Component System) state pipelines, chunk generation caching, and multi-threaded packet serialization.",
    architecture: [
      {
        label: "Async network reactor",
        body: "Tokio-powered non-blocking I/O event loop manages thousands of concurrent client TCP streams with zero-copy packet framing and snappy connection multiplexing.",
      },
      {
        label: "Lock-free world state",
        body: "World chunks and spatial coordinates are partitioned into concurrent memory segments, eliminating thread contention and global mutex locks during player movement.",
      },
      {
        label: "Zero GC pause latency",
        body: "Manual memory allocation and compile-time lifetime checks eliminate Java-style garbage collection stop-the-world spikes, maintaining a rock-solid 20 TPS (Ticks Per Second).",
      },
      {
        label: "Rayon parallel computation",
        body: "Heavy physics, block updates, and collision queries are distributed across available CPU cores using Rayon work-stealing threads.",
      },
      {
        label: "Strict protocol compliance",
        body: "Full implementation of the standard Minecraft packet protocol specification with automated fuzz testing and packet roundtrip validation.",
      },
      {
        label: "Containerized deployment",
        body: "Packaged as a hyper-lean multi-stage Alpine scratch Docker container weighing under 25MB with automated CI/CD cross-compilation.",
      },
    ],
    highlights: [
      "Zero garbage collection pauses ensures consistent sub-millisecond tick latency under heavy load",
      "Memory footprint reduced by up to 80% compared to traditional JVM server runtimes",
      "Multi-threaded work-stealing pipeline scales seamlessly across all available CPU cores",
      "Strict wire protocol conformance validated via automated client connection fuzzing",
      "Minimalist 25MB container image ready for one-command Kubernetes or bare-metal deployment",
    ],
    links: [
      { url: "https://github.com/Srinivasan-78/Pumpkin", label: "Source ↗" },
      { url: "https://pumpkinmc.org/", label: "Project Site ↗" },
    ],
  },
];

export function projectBySlug(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

