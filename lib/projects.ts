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
    demo: "https://www.srinidevops.com/Self-Healing-Deployment/",
    links: [
      { url: "https://www.srinidevops.com/Self-Healing-Deployment/", label: "Open demo ↗" },
      { url: "https://github.com/Srinivasan-78/Self-Healing-Deployment", label: "Source ↗" },
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
    demo: "https://www.srinidevops.com/pdf/",
    links: [{ url: "https://www.srinidevops.com/pdf/", label: "Open tool ↗" }],
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
    links: [{ url: "https://vfactorsolutions.com/", label: "Visit site ↗" }],
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
    links: [{ url: "https://github.com/Srinivasan-78/Multicloud", label: "View repo ↗" }],
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
    demo: "https://www.srinidevops.com/Multi_AI/",
    links: [{ url: "https://github.com/Srinivasan-78/Multi_AI", label: "View repo ↗" }],
  },
  {
    slug: "repo2graph",
    title: "repo2graph",
    client: "Platform engineering",
    category: "Code intelligence",
    status: "Active",
    teaser:
      "Point it at a codebase and it draws the map: a queryable graph of who calls what, plus chunks ready for a RAG pipeline.",
    tags: ["Python", "tree-sitter", "RAG"],
    stack: ["Python", "tree-sitter", "Neo4j / Cypher", "GraphML", "GitHub Actions", "JSONL"],
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
        label: "Outputs and automation",
        body: "A single self-contained graph.html, an overview written for a person to read first, and JSONL, GraphML and idempotent Cypher for everything else. A composite Action keeps a fresh graph beside your own code, and a dispatch job maps any repo from the Actions tab.",
      },
    ],
    highlights: [
      "Sixteen languages parsed with tree-sitter, zero configuration",
      "Chunks carry their graph neighbourhood, so retrieval lands on the right code",
      "graph.html is one file: no server, no install, drag, zoom and search in a browser",
      "Honest about approximation: name-matched calls carry a confidence score, and a missing edge never proves a missing call",
      "Entrypoints are marked and ranked by reach, so the main paths through a project are findable",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/repo2graph", label: "View repo \u2197" }],
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
    links: [{ url: "https://github.com/Srinivasan-78/Homelabbing", label: "View repo ↗" }],
  },
  {
    slug: "simple-actions",
    title: "Simple-Actions",
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
    /* No public link. https://github.com/Srinivasan-78/Simple-Actions answered 404 to an
       anonymous request, so the button that pointed at it was a dead CTA.
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
    /* No public link. https://github.com/Srinivasan-78/WixTemplate answered 404 to an
       anonymous request, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "brainrot-study",
    title: "Brainrot Study",
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
    links: [{ url: "https://github.com/Srinivasan-78/Brainrot_Study", label: "View repo ↗" }],
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
    /* No public link. https://github.com/Srinivasan-78/ImgCreation answered 404 to an
       anonymous request, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "imgautomation",
    title: "ImgAutomation",
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
    /* No public link. https://github.com/Srinivasan-78/ImgAutomation answered 404 to an
       anonymous request, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "speedtestdd",
    title: "SpeedTestDD",
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
    /* No public link. https://github.com/Srinivasan-78/SpeedTestDD answered 404 to an
       anonymous request, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
];


export function projectBySlug(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
