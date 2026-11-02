/* eslint-env node */
import { CANNOT_HELP, TOOLS } from "./_responses.js";

/* POST /api/chat — { messages: [{ role: "user" | "assistant", content }] }
   → { reply }

   Two paths, cheapest reliable one first:

   1. generate: one Gemini call writes the answer, grounded in the system prompt
      (role, hard rules, style and the knowledge base). Low temperature, short
      output. The prompt is private source material and is NOT in the repo: it
      arrives as CHAT_SYSTEM_PROMPT from Vercel's env in production, and from
      portfolio-chat-system-prompt.md (gitignored) via vite.config.js in dev.
      Without it, the chat runs on path 2 only.
   2. route (fallback): if generation is unavailable (quota, timeout, empty or
      blocked output), Gemini is forced to pick canned replies from
      _responses.js via function calls, so the chat degrades to terser answers
      instead of an error.

   The API key stays server-side: GEMINI_API_KEY in Vercel's env, or .env.local
   in dev. */

const MODEL = "gemini-flash-lite-latest";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const HISTORY = 6; // recent messages sent for context ("tell me more about that")
const MAX_CHARS = 500;
const TIMEOUT_MS = 10000;
const MAX_REPLY_TOKENS = 400;

const ROUTER_PROMPT =
  "You route visitor questions on Chuluunbat Purev's portfolio site to tools. " +
  "Always call the tool(s) that best answer the latest user message; call several " +
  "only if it clearly asks several things. If nothing fits, call cannot_help.";

const declarations = TOOLS.map(({ name, description, parameters }) =>
  parameters ? { name, description, parameters } : { name, description }
);
const byName = new Map(TOOLS.map((t) => [t.name, t]));

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });

const replyFor = (call) => {
  const tool = byName.get(call?.name);
  if (!tool) return null;
  return typeof tool.reply === "function" ? tool.reply(call.args) : tool.reply;
};

/* One Gemini request; throws on HTTP or network failure. */
const gemini = async (apiKey, body) => {
  const upstream = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify(body),
  });
  if (!upstream.ok) {
    throw new Error(`Gemini ${upstream.status}: ${await upstream.text()}`);
  }
  return upstream.json();
};

/* Path 1: a written answer grounded in the system prompt. Returns null when
   the model produced nothing usable (blocked, empty, cut off before any text). */
const generate = async (apiKey, systemPrompt, contents) => {
  const data = await gemini(apiKey, {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: MAX_REPLY_TOKENS,
    },
  });
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? "")
    .join("")
    .trim();
  return text || null;
};

/* Path 2: canned replies picked by forced function calls; never writes text. */
const route = async (apiKey, contents) => {
  const data = await gemini(apiKey, {
    systemInstruction: { parts: [{ text: ROUTER_PROMPT }] },
    contents,
    tools: [{ functionDeclarations: declarations }],
    toolConfig: { functionCallingConfig: { mode: "ANY" } },
    generationConfig: { temperature: 0, maxOutputTokens: 128 },
  });
  const calls = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.functionCall)
    .filter(Boolean);
  const replies = [...new Set(calls.map(replyFor).filter(Boolean))];
  const helpful = replies.filter((r) => r !== CANNOT_HELP);
  return (helpful.length ? helpful : [CANNOT_HELP]).join("\n\n");
};

export async function handleChat(request, apiKey, systemPrompt) {
  if (request.method !== "POST")
    return json(405, { error: "Method not allowed" });
  if (!apiKey) return json(500, { error: "Chat is not configured" });

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }
  const contents = (Array.isArray(body?.messages) ? body.messages : [])
    .filter(
      (m) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-HISTORY)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.slice(0, MAX_CHARS) }],
    }));
  if (!contents.length || contents[contents.length - 1].role !== "user") {
    return json(400, { error: "Expected a user message last" });
  }

  if (systemPrompt) {
    try {
      const reply = await generate(apiKey, systemPrompt, contents);
      if (reply) return json(200, { reply, source: "generated" });
      console.error("Gemini returned no text, falling back to canned replies");
    } catch (err) {
      console.error("Gemini generation failed, falling back", err);
    }
  }

  try {
    return json(200, {
      reply: await route(apiKey, contents),
      source: "canned",
    });
  } catch (err) {
    console.error("Gemini routing failed", err);
    return json(502, { error: "The model is unavailable right now" });
  }
}

// Vercel Function (Web handler).
export function POST(request) {
  return handleChat(
    request,
    process.env.GEMINI_API_KEY,
    process.env.CHAT_SYSTEM_PROMPT
  );
}
