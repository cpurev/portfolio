/* eslint-env node */
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import seo, { siteUrlFrom } from "./vite-plugin-seo.js";

/* In dev, serve /api/chat with the same handler Vercel runs in production,
   reading GEMINI_API_KEY from .env.local. The system prompt is private notes
   kept out of git: in production it is the CHAT_SYSTEM_PROMPT env var, in dev
   it is read from portfolio-chat-system-prompt.md when present. */
const PROMPT_FILE = "portfolio-chat-system-prompt.md";
const systemPromptFrom = (env) =>
  env.CHAT_SYSTEM_PROMPT ||
  (existsSync(PROMPT_FILE) ? readFileSync(PROMPT_FILE, "utf8") : undefined);

const chatApi = (env) => ({
  name: "chat-api",
  configureServer(server) {
    server.middlewares.use("/api/chat", async (req, res) => {
      try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const { handleChat } = await server.ssrLoadModule("/api/chat.js");
        const response = await handleChat(
          new Request("http://localhost/api/chat", {
            method: req.method,
            headers: { "content-type": req.headers["content-type"] ?? "" },
            body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
          }),
          env.GEMINI_API_KEY,
          systemPromptFrom(env)
        );
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        if (response.body) {
          for await (const chunk of response.body) res.write(chunk);
        }
        res.end();
      } catch (err) {
        server.config.logger.error(String(err?.stack ?? err));
        res.statusCode = 500;
        res.end();
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue(), chatApi(env), seo(siteUrlFrom(env))],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
