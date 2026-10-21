/* eslint-env node */
import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

/* In dev, serve /api/chat with the same handler Vercel runs in production,
   reading GEMINI_API_KEY from .env.local. */
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
          env.GEMINI_API_KEY
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
export default defineConfig(({ mode }) => ({
  plugins: [vue(), chatApi(loadEnv(mode, process.cwd(), ""))],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
}));
