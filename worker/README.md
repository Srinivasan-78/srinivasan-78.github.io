# Chat worker

The site is a static export on GitHub Pages, so it has no server of its own.
This Cloudflare Worker is the only piece that holds the API key: the browser
talks to the worker, the worker talks to the Gemini API and streams the reply
back as server-sent events.

Provider: Google Gemini (`gemini-3.7-flash`), on the free tier — no card, no
per-message bill. Called over plain `fetch`, no SDK, so the whole worker is
~43 KiB. Swap `MODEL` in `src/index.ts` to a `-lite` variant if the free-tier
quota turns out to be the binding constraint; the request shape is identical.

The knowledge base is built at module load from `../lib/projects.ts`,
`../lib/certs.ts`, and `src/profile.ts`, so a project or certification added to
the site reaches the assistant on the next worker deploy without being re-typed.

## Deploy from GitHub Actions (the normal path)

One workflow, `.github/workflows/deploy.yml`, run by hand from the Actions tab.
Nothing deploys on a push. Three jobs in sequence:

1. **worker** — typechecks, uploads the API key as a Worker secret, deploys this
   worker, and emits its URL as a job output.
2. **build** — writes that URL into the job environment as
   `NEXT_PUBLIC_CHAT_API` and builds the static site with it. Next inlines the
   value, because a static export has no runtime in which to look it up. If the
   worker deploy produced no URL the job fails here rather than shipping a site
   whose chat button cannot work.
3. **publish** — uploads the result to GitHub Pages.

The URL comes from the deploy that just ran, so there is no repository variable
to keep in sync and no way to build the site against a stale endpoint. Every run
deploys both halves together.

Three repository **secrets** are the entire setup (Settings → Secrets and
variables → Actions):

| Secret | Where it comes from |
| --- | --- |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey — free, no card |
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → the "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages, in the right-hand sidebar |

### Secrets in logs

The key is typed into GitHub once and read by the pipeline only as a masked
value:

- Actions masks registered secrets in log output automatically; the pipeline
  re-masks all three with `::add-mask::` up front, which also covers a step that
  reads one into a shell variable of its own.
- The wrangler action pipes the key straight to `wrangler secret put`, which
  prints the secret's *name* on success and never its value.
- The raw wrangler output (`command-output`) is never echoed — only the worker
  URL is written to the run summary.
- The key is never inlined into the site bundle. `NEXT_PUBLIC_CHAT_API` holds
  the worker URL, which is public by design; the key stays in Cloudflare.

## Deploy from your machine (fallback)

Wrangler needs Node.js 22 or newer (the site itself builds fine on 18). This
machine has it under nvm, so start each shell with `nvm use 22`.

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put GEMINI_API_KEY   # paste the key at the prompt
npm run deploy
```

## Local development

Put the key in `worker/.dev.vars` (gitignored — it is a secret file, not config):

```
GEMINI_API_KEY=...
```

Then `npm run dev` serves the worker on http://localhost:8787, which is already
on the origin allowlist alongside the site's `next dev` on port 3000. Point the
site at it with `NEXT_PUBLIC_CHAT_API=http://localhost:8787` in `.env.local`.

`npx wrangler tail` streams live logs from the deployed worker.

## What is enforced, and where

| Control | Where | Value |
| --- | --- | --- |
| Origin allowlist | `ALLOWED_ORIGINS` in `wrangler.toml` | the two site domains, the github.io domain, and localhost |
| Per-IP rate limit | Cloudflare ratelimit binding | 15 requests / 60s |
| Message length | `src/index.ts` | 1500 chars |
| Conversation length | `src/index.ts` | 16 turns, 12000 chars total |
| Reply length | `maxOutputTokens` | 800 |
| Topic scope | `SYSTEM_PROMPT` in `src/knowledge.ts` | refuse anything not about Srinivasan |

A request from an origin that is not on the list gets a 403 before Gemini is
ever called, which is what stops a cloned copy of the page from spending the
quota.

## Free-tier quota

Google no longer publishes the free-tier limits as a static table — they are
shown per-key on the AI Studio rate-limit page. When the daily cap is hit the
API returns 429 and the worker surfaces "the assistant has hit its daily limit"
rather than a generic failure, so it is visible rather than silent.

One thing to know about the free tier: Google may use free-tier prompts and
responses to improve their products. Everything this worker sends is already
public on the site, so there is nothing private in it — but it is the reason a
paid tier exists.

## Scope enforcement

The assistant is instructed to answer only about Srinivasan and to refuse
everything else — code help, general knowledge, translation, roleplay, prompt
extraction — with one exact sentence, defined once in `../lib/assistant.ts` and
shared by both builds. The widget matches that sentence and labels the reply
"Out of scope" instead of styling it as an answer.

This is a prompt-level boundary, which is the honest description of it: it holds
for ordinary visitors and for the obvious jailbreak attempts, and a determined
adversary with enough attempts may still get an off-topic answer out of it. The
things that cap the damage if that happens are enforced in code — the origin
allowlist, the rate limit, and the 800-token reply ceiling.

## Changing what the assistant knows

- Résumé, bio, work authorization, contact routing → `src/profile.ts`
- Projects and certifications → the site's own `lib/projects.ts` and `lib/certs.ts`
- Tone, scope rules, refusal wording → `SYSTEM_PROMPT` in `src/knowledge.ts`
  (the refusal sentence itself lives in `../lib/assistant.ts`)

Redeploy the worker after any of these.
