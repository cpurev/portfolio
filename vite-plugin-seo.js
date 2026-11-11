/* eslint-env node */

/* SEO for search engines and AI agents.
   - Replaces __SITE_URL__ in index.html (canonical, Open Graph).
   - Fills <!--seo:jsonld--> and <!--seo:profile--> in index.html from PROFILE
     below, so the static HTML carries the whole profile for crawlers and
     agents that don't run JavaScript (the visible page is a canvas and a chat).
   - Emits robots.txt, sitemap.xml and llms.txt into the build.
   The URL comes from SITE_URL if set, else the production domain Vercel
   provides at build time (VERCEL_PROJECT_PRODUCTION_URL).

   PROFILE is the one place these facts live. Keep it at the same level of
   detail as the chat: an overview, no internals. */

export const siteUrlFrom = (env) => {
  const url =
    env.SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`);
  // A localhost canonical in production would drop the site from search.
  if (!url && env.VERCEL) {
    throw new Error(
      "No site URL: set SITE_URL or expose Vercel system environment variables"
    );
  }
  return (url || "http://localhost:5173").replace(/\/+$/, "");
};

const PROFILE = {
  name: "Chuluunbat Purev",
  givenName: "Chuluunbat",
  familyName: "Purev",
  alternateName: "Purev",
  email: "puluunbat@gmail.com",
  linkedin: "https://www.linkedin.com/in/cpurev/",
  github: "https://github.com/cpurev",
  roles: ["Software Engineer", "AI Engineer", "Full-Stack Developer"],
  summary:
    "Chuluunbat Purev (goes by Purev) is a full-stack software engineer and AI engineer in Stockholm, Sweden. He builds AI products, LLM agents, MCP servers and the cloud infrastructure they run on, and is open to new software engineering and AI engineering roles in Stockholm or remote.",
  hiring:
    "If you are looking for a software engineer, full-stack developer or AI engineer in Stockholm, Sweden, or for a remote role: Purev is open to new opportunities. He ships features end to end, from React and TypeScript frontends to Python and FastAPI backends, PostgreSQL, and Google Cloud or Azure infrastructure with Terraform, Kubernetes and CI/CD. On the AI side he builds LLM agents, tool calling, MCP servers and LLM evaluation. Contact him by email or LinkedIn.",
  experience: [
    {
      period: "2025 to present",
      role: "Software Engineer",
      company: "Talendary",
      companyUrl: "https://www.talendary.com",
      place: "Stockholm, Sweden",
      description:
        "He builds an AI-driven recruitment platform at a Stockholm startup, owning features end to end across frontend, backend, cloud infrastructure and AI features such as LLM agents and an AI interviewer.",
      skills: [
        "TypeScript",
        "Remix",
        "React",
        "Python",
        "FastAPI",
        "PostgreSQL",
        "Google Cloud",
        "Terraform",
        "Kubernetes",
        "LLM agents",
      ],
    },
    {
      period: "2023 to 2024",
      role: "Software Developer",
      company: "Fairbanks North Star Borough",
      companyUrl: "https://www.fnsb.gov",
      place: "Alaska, USA",
      description:
        "He delivered software for the borough government: Python automation, full-stack web development, API integrations and legacy-to-cloud migration on Azure.",
      skills: ["Azure", "C#", ".NET", "Vue", "TypeScript", "Python", "Go"],
    },
    {
      period: "2021 to 2023",
      role: "Student Systems Engineer",
      company: "University of Alaska Fairbanks",
      companyUrl: "https://www.alaska.edu",
      place: "Alaska, USA",
      description:
        "He built full-stack web applications, maintained CI/CD pipelines, improved accessibility (WCAG) and handled tier 2 support.",
      skills: ["Vue", "React", "TypeScript", "Fastify", "Prisma", "Python"],
    },
  ],
  education: [
    {
      name: "Stockholm University",
      degree: "MSc in Computer and Systems Sciences (2026)",
    },
    {
      name: "University of Alaska Fairbanks",
      degree: "BSc in Computer Science (2023)",
    },
  ],
  skills: [
    ["Languages", "TypeScript, JavaScript, Python, C#, Go"],
    ["Frontend", "React, Remix, Vue, Tailwind"],
    ["Backend", "FastAPI, Node.js, Fastify, .NET, gRPC, PostgreSQL"],
    [
      "Cloud",
      "Google Cloud (GCP), Azure, Kubernetes, Docker, Terraform, GitHub Actions",
    ],
    [
      "AI",
      "LLM agents, tool calling, MCP (Model Context Protocol), LangChain, LangGraph, Google ADK, LLM evaluation, Vertex AI, Azure OpenAI",
    ],
  ],
  projects: [
    {
      name: "qlaude",
      description:
        "A lightweight Claude Code-style coding agent harness for a local Qwen model running through Ollama, with sandboxed agent trees in Docker.",
      tech: ["TypeScript", "Ollama", "Docker", "MCP"],
      url: "https://github.com/cpurev/qlaude",
    },
    {
      name: "cstack",
      description:
        "A Claude Code plugin of seven lightweight skills for reviewing, fixing and testing code, which fix the model's angle rather than its intelligence.",
      tech: ["Claude Code", "Python", "Node.js", "Lightpanda"],
      url: "https://github.com/cpurev/cstack",
    },
    {
      name: "linkedin-for-agent",
      description:
        "An MCP server that lets an AI agent search LinkedIn jobs and tells it which applicant tracking system (ATS) each apply link leads to.",
      tech: ["TypeScript", "MCP", "Playwright", "Lightpanda"],
      url: "https://github.com/cpurev/linkedin-for-agent",
    },
    {
      name: "go-ocr",
      description:
        "Turns receipt photos into structured JSON with Tesseract OCR.",
      tech: ["Go", "Tesseract", "MongoDB"],
      url: "https://github.com/cpurev/go-ocr",
    },
    {
      name: "go-drive-mcp",
      description:
        "An MCP server giving AI agents scoped access to Google Drive (private repo).",
      tech: ["Go", "MCP", "OAuth2"],
    },
    {
      name: "celebsimil",
      description:
        "A celebrity lookalike finder that runs face matching entirely in the browser with Go compiled to WebAssembly and an ONNX model (private repo).",
      tech: ["Go", "WebAssembly", "ONNX"],
    },
    {
      name: "UA Scholars",
      description:
        "Scholarship submission service for Alaskan high-school delegates at the University of Alaska.",
      tech: ["TypeScript", "Vue", "Fastify", "Prisma"],
      url: "https://www.alaska.edu/scholars/",
    },
  ],
};

const P = PROFILE;

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;

/* Visually hidden (sr-only) until the footer's "Text version" link targets
   #profile, so crawlers, agents and screen readers get it and visitors can
   open it too.
   Every section opens with his name so it stands alone when an agent
   retrieves one passage. */
const profileHtml = () => `<article class="sr-only" id="profile">
      <a class="profile__close" href="#">Close</a>
      <h1>${esc(P.name)}, Software Engineer and AI Engineer in Stockholm</h1>
      <section id="about">
        <h2>About ${esc(P.name)}</h2>
        <p>${esc(P.summary)}</p>
      </section>
      <section id="hire">
        <h2>Hiring a software engineer or AI engineer in Stockholm</h2>
        <p>${esc(P.hiring)}</p>
        <p>Email ${link(`mailto:${P.email}`, P.email)}, ${link(
  P.linkedin,
  "LinkedIn"
)} or ${link(P.github, "GitHub")}.</p>
      </section>
      <section id="experience">
        <h2>${esc(P.name)}'s work experience</h2>
        ${P.experience
          .map(
            (e) => `<h3>${esc(e.role)} at ${esc(e.company)} (${esc(
              e.period
            )})</h3>
        <p>${esc(P.name)}: ${esc(e.role)} at ${link(
              e.companyUrl,
              e.company
            )}, ${esc(e.place)}, ${esc(e.period)}. ${esc(
              e.description
            )} Stack: ${esc(e.skills.join(", "))}.</p>`
          )
          .join("\n        ")}
      </section>
      <section id="projects">
        <h2>Projects by ${esc(P.name)}</h2>
        ${P.projects
          .map(
            (p) => `<h3>${esc(p.name)}</h3>
        <p>${esc(p.name)}, built by ${esc(P.alternateName)}: ${esc(
              p.description
            )} Built with ${esc(p.tech.join(", "))}.${
              p.url ? ` ${link(p.url, p.url)}` : ""
            }</p>`
          )
          .join("\n        ")}
      </section>
      <section id="skills">
        <h2>${esc(P.name)}'s skills</h2>
        <ul>
          ${P.skills
            .map(([k, v]) => `<li>${esc(k)}: ${esc(v)}</li>`)
            .join("\n          ")}
        </ul>
      </section>
      <section id="education">
        <h2>${esc(P.name)}'s education</h2>
        <ul>
          ${P.education
            .map((e) => `<li>${esc(e.degree)}, ${esc(e.name)}</li>`)
            .join("\n          ")}
        </ul>
      </section>
    </article>`;

/* Structured data: tells Google and AI agents who this page is about. */
const jsonLd = (url) => {
  const person = `${url}/#person`;
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url: `${url}/`,
      name: P.name,
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${url}/#profile`,
      url: `${url}/`,
      name: `${P.name} | Software Engineer & AI Engineer in Stockholm`,
      isPartOf: { "@id": `${url}/#website` },
      mainEntity: { "@id": person },
    },
    {
      "@type": "Person",
      "@id": person,
      name: P.name,
      alternateName: P.alternateName,
      givenName: P.givenName,
      familyName: P.familyName,
      url: `${url}/`,
      image: `${url}/images/headshot_1.jpg`,
      email: `mailto:${P.email}`,
      jobTitle: P.roles,
      description: P.summary,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Stockholm",
        addressCountry: "SE",
      },
      worksFor: {
        "@type": "Organization",
        name: P.experience[0].company,
        url: P.experience[0].companyUrl,
      },
      alumniOf: P.education.map((e) => ({
        "@type": "CollegeOrUniversity",
        name: e.name,
      })),
      knowsAbout: P.skills.flatMap(([, v]) => v.split(", ")),
      seeks: {
        "@type": "Demand",
        description:
          "Software engineering, full-stack or AI engineering roles in Stockholm or remote",
      },
      sameAs: [P.linkedin, P.github],
    },
    ...P.projects
      .filter((p) => p.url?.startsWith("https://github.com/"))
      .map((p) => ({
        "@type": "SoftwareSourceCode",
        name: p.name,
        description: p.description,
        codeRepository: p.url,
        programmingLanguage: p.tech[0],
        keywords: p.tech.join(", "),
        author: { "@id": person },
      })),
  ];
  return `<script type="application/ld+json">
${JSON.stringify(
  { "@context": "https://schema.org", "@graph": graph },
  null,
  2
)}
    </script>`;
};

const robots = (url) => `# Search engines and AI agents are welcome.
User-agent: *
Allow: /
Disallow: /api/

${[
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
]
  .map((agent) => `User-agent: ${agent}\nAllow: /\nDisallow: /api/\n`)
  .join("\n")}
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

/* llms.txt: a plain summary for AI agents (https://llmstxt.org). */
const llms = (url) => `# ${P.name}

> ${P.summary}

## Hiring

${P.hiring}

- Email: ${P.email}
- [LinkedIn](${P.linkedin})
- [GitHub](${P.github})

## Experience

${P.experience
  .map(
    (e) =>
      `- ${e.role}, [${e.company}](${e.companyUrl}), ${e.place} (${e.period}): ${e.description}`
  )
  .join("\n")}

## Projects

${P.projects
  .map(
    (p) =>
      `- ${p.url ? `[${p.name}](${p.url})` : p.name}: ${
        p.description
      } (${p.tech.join(", ")})`
  )
  .join("\n")}

## Skills

${P.skills.map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## Education

${P.education.map((e) => `- ${e.degree}, ${e.name}`).join("\n")}

## Links

- [Portfolio](${url}/): this site, with an "Ask about me" chat
`;

export default function seo(url) {
  return {
    name: "seo",
    // "pre", so the placeholders are gone before Vite parses href/src URLs.
    transformIndexHtml: {
      enforce: "pre",
      transform: (html) =>
        html
          .replace("<!--seo:jsonld-->", jsonLd(url))
          .replace("<!--seo:profile-->", profileHtml())
          .replaceAll("__SITE_URL__", url),
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
