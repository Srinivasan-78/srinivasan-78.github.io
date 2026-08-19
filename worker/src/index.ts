import { SYSTEM_PROMPT } from "./knowledge";

export interface Env {
  GEMINI_API_KEY: string;
  ALLOWED_ORIGINS: string;
  /* Present only when the ratelimit binding in wrangler.toml is deployed;
     `wrangler dev` leaves it undefined, so every use is guarded rather
     than assumed. */
  RATE_LIMITER?: { limit(opts: { key: string }): Promise<{ success: boolean }> };
}

/* Swap to a "-lite" model (e.g. gemini-3.5-flash-lite) if the free-tier
   quota turns out to be the binding constraint — the request shape is
   identical. The current free-tier limits are not published as a static
   table; they are shown per-key in AI Studio. */
const MODEL = "gemini-3.7-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;
/* Thinking tokens are drawn from this same budget, so it has to leave room
   for both the reasoning and the two-to-four sentences the answer is meant to
   be. At 800 a long question could spend the whole allowance thinking and
   finish with no text at all. */
const MAX_OUTPUT_TOKENS = 2000;

/* Caps, in the order an abusive request would hit them. They bound spend and
   latency per request — the per-IP rate limiter bounds requests per visitor. */
const MAX_MESSAGE_CHARS = 1500;
const MAX_TURNS = 16;
const MAX_TOTAL_CHARS = 12000;

type Turn = { role: "user" | "assistant"; content: string };

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  if (!origin || !allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

/* Rejects anything that is not the shape the widget sends. Doing this before
   the upstream call means a malformed or oversized body costs nothing. */
function parseTurns(payload: unknown): { turns: Turn[] } | { error: string } {
  if (typeof payload !== "object" || payload === null) return { error: "Expected a JSON object." };
  const raw = (payload as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return { error: "Expected a non-empty messages array." };
  if (raw.length > MAX_TURNS) return { error: "Conversation is too long. Start a new one." };

  const turns: Turn[] = [];
  let total = 0;
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return { error: "Malformed message." };
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return { error: "Malformed message role." };
    if (typeof content !== "string" || content.trim() === "") return { error: "Malformed message content." };
    if (content.length > MAX_MESSAGE_CHARS) return { error: "That message is too long." };
    total += content.length;
    if (total > MAX_TOTAL_CHARS) return { error: "Conversation is too long. Start a new one." };
    turns.push({ role, content });
  }
  if (turns[0].role !== "user") return { error: "Conversation must start with a visitor message." };
  if (turns[turns.length - 1].role !== "user") return { error: "Expected a visitor message last." };
  return { turns };
}

function sse(event: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

/* Gemini calls the assistant side "model"; the widget and the rest of this
   worker call it "assistant". The rename happens here and nowhere else. */
function toGeminiContents(turns: Turn[]) {
  return turns.map((t) => ({
    role: t.role === "assistant" ? "model" : "user",
    parts: [{ text: t.content }],
  }));
}

type GeminiChunk = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    /* No CORS headers on the response means a browser on another domain
       cannot read it, but the request still ran. Refusing outright is what
       actually stops a cloned page from spending the quota. */
    if (!cors["Access-Control-Allow-Origin"]) {
      return json({ error: "Origin not allowed." }, 403, {});
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405, cors);
    }

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    if (env.RATE_LIMITER) {
      const { success } = await env.RATE_LIMITER.limit({ key: ip });
      if (!success) {
        return json({ error: "Too many messages. Give it a minute." }, 429, cors);
      }
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON." }, 400, cors);
    }

    const parsed = parseTurns(payload);
    if ("error" in parsed) return json({ error: parsed.error }, 400, cors);

    let upstream: Response;
    try {
      upstream = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          /* Header rather than the ?key= query parameter: an API key in a URL
             ends up in logs and referrers far too easily. */
          "x-goog-api-key": env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: toGeminiContents(parsed.turns),
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: {
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            temperature: 0.3,
            /* The answers are short lookups over a fixed reference, not
               reasoning problems. Low keeps latency and token spend down;
               the budget above is what stops thinking from eating the reply. */
            thinkingConfig: { thinkingLevel: "low" },
          },
        }),
      });
    } catch (err) {
      console.error("upstream unreachable", err);
      return json({ error: "The assistant is unreachable right now." }, 502, cors);
    }

    /* An upstream failure is still a clean status code at this point, because
       nothing has been streamed yet — worth reporting properly rather than
       opening a 200 and immediately erroring inside it. */
    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => "");
      console.error("upstream error", upstream.status, detail.slice(0, 500));
      const message =
        upstream.status === 429
          ? "The assistant has hit its daily limit. Try again tomorrow, or use the contact page."
          : "Something went wrong answering that. Try again, or use the contact page.";
      return json({ error: message }, upstream.status === 429 ? 429 : 502, cors);
    }

    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();

    /* Deliberately not awaited: the response has to start flowing before the
       model finishes, which is the entire point of streaming. Errors from here
       on are reported down the stream, because the 200 is already on the wire. */
    (async () => {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sawText = false;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          /* Upstream frames are separated by a blank line and can be split
             across network chunks, so the tail is kept until it is complete. */
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const line = frame.split("\n").find((l) => l.startsWith("data:"));
            if (!line) continue;
            /* Anything that is not a JSON frame — a keepalive, a comment, a
               sentinel — is skipped rather than aborting an answer that is
               otherwise streaming fine. */
            let chunk: GeminiChunk;
            try {
              chunk = JSON.parse(line.slice(5).trim()) as GeminiChunk;
            } catch {
              continue;
            }

            if (chunk.promptFeedback?.blockReason) {
              throw new Error("That question was blocked by a safety filter.");
            }
            const candidate = chunk.candidates?.[0];
            const text = candidate?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
            if (text) {
              sawText = true;
              await writer.write(sse({ type: "delta", text }));
            }
            /* STOP and MAX_TOKENS are normal endings. Anything else — SAFETY,
               RECITATION — means the answer was cut off for a reason the
               visitor should be told about rather than left guessing. */
            const finish = candidate?.finishReason;
            if (finish && finish !== "STOP" && finish !== "MAX_TOKENS") {
              throw new Error("The answer was stopped early. Try rephrasing.");
            }
          }
        }
        if (!sawText) throw new Error("The assistant returned an empty answer. Try rephrasing.");
        await writer.write(sse({ type: "done" }));
      } catch (err) {
        console.error("stream failed", err);
        const message =
          err instanceof Error && err.message.length < 120
            ? err.message
            : "Something went wrong answering that. Try again, or use the contact page.";
        await writer.write(sse({ type: "error", message }));
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-store",
        ...cors,
      },
    });
  },
};
