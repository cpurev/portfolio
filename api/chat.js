/* eslint-env node */
import { CANNOT_HELP, TOOLS } from "./_responses.js";

/* POST /api/chat — { messages: [{ role: "user" | "assistant", content }] }
   → { reply }

   Gemini is forced to answer only with function calls (mode ANY), so it
   never writes text: it just routes the question to canned replies in
   _responses.js. Anything it can't route gets CANNOT_HELP. The API key
   stays server-side: GEMINI_API_KEY in Vercel's env, or .env.local in dev. */

const MODEL = "gemini-flash-lite-latest";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const HISTORY = 6; // recent messages sent for context ("tell me more about that")
const MAX_CHARS = 500;
const TIMEOUT_MS = 10000;

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

export async function handleChat(request, apiKey) {
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

  let data;
  try {
    const upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: ROUTER_PROMPT }] },
        contents,
        tools: [{ functionDeclarations: declarations }],
        toolConfig: { functionCallingConfig: { mode: "ANY" } },
        generationConfig: { temperature: 0, maxOutputTokens: 128 },
      }),
    });
    if (!upstream.ok) {
      console.error("Gemini error", upstream.status, await upstream.text());
      return json(502, { error: "The model is unavailable right now" });
    }
    data = await upstream.json();
  } catch (err) {
    console.error("Gemini request failed", err);
    return json(502, { error: "The model is unavailable right now" });
  }

  // Map every function call to its canned reply; ignore any free text.
  const calls = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.functionCall)
    .filter(Boolean);
  const replies = [...new Set(calls.map(replyFor).filter(Boolean))];
  const helpful = replies.filter((r) => r !== CANNOT_HELP);
  return json(200, {
    reply: (helpful.length ? helpful : [CANNOT_HELP]).join("\n\n"),
  });
}

// Vercel Function (Web handler).
export function POST(request) {
  return handleChat(request, process.env.GEMINI_API_KEY);
}
