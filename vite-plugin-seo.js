/* eslint-env node */

/* SEO for search engines and AI agents.
   - Replaces __SITE_URL__ in index.html (canonical, Open Graph, JSON-LD).
   - Emits robots.txt, sitemap.xml and llms.txt into the build.
   The URL comes from SITE_URL if set, else the production domain Vercel
   provides at build time (VERCEL_PROJECT_PRODUCTION_URL). */

export const siteUrlFrom = (env) =>
  (
    env.SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    "http://localhost:5173"
  ).replace(/\/+$/, "");

const robots = (url) => `# Search engines and AI agents are welcome.
User-agent: *
Allow: /
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${url}/sitemap.xml
`;

const sitemap = (url) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

/* llms.txt: a plain summary for AI agents (https://llmstxt.org). Keep it at
   the same level of detail as the chat: an overview, no internals. */
const llms = (url) => `# Chuluunbat Purev

> Software engineer and AI engineer in Stockholm, Sweden. Full-stack developer who builds AI products, LLM agents and the cloud infrastructure they run on. Open to new opportunities in Stockholm and remote.

## About

- Name: Chuluunbat Purev
- Location: Stockholm, Sweden
- Roles: Software Engineer, AI Engineer, Full-Stack Developer, Startup Engineer
- Current: Software Engineer at Talendary, an AI-driven recruitment startup in Stockholm (2025 to present), working across frontend, backend, cloud infrastructure and AI features.
- Previously: Software Developer at Fairbanks North Star Borough, Alaska (2023 to 2024); Student Systems Engineer at the University of Alaska Fairbanks (2021 to 2023).
- Education: Computer and Systems Sciences at Stockholm University; BSc in Computer Science, University of Alaska Fairbanks.
- Open to: software engineering, full-stack and AI engineering roles in Stockholm or remote.

## Skills

- Languages: TypeScript, JavaScript, Python, C#, Go
- Frontend: React, Remix, Vue
- Backend: FastAPI, Node.js, .NET, PostgreSQL
- Cloud: Google Cloud (GCP), Azure, Kubernetes, Terraform, CI/CD
- AI: LLM agents, tool calling, MCP, evaluation of LLM output

## Links

- [Portfolio](${url}/): this site, with an "Ask about me" chat
- [LinkedIn](https://www.linkedin.com/in/chuluunbat-purev/)
- [GitHub](https://github.com/cpurev)
- Email: puluunbat@gmail.com
`;

export default function seo(url) {
  return {
    name: "seo",
    // "pre", so the placeholder is gone before Vite parses href/src URLs.
    transformIndexHtml: {
      enforce: "pre",
      transform: (html) => html.replaceAll("__SITE_URL__", url),
    },
    generateBundle() {
      for (const [fileName, source] of [
        ["robots.txt", robots(url)],
        ["sitemap.xml", sitemap(url)],
        ["llms.txt", llms(url)],
      ]) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}
