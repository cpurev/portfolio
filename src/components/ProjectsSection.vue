<script setup>
import PromptLine from "./PromptLine.vue";
import ToolCall from "./ToolCall.vue";
import IconExternal from "./IconExternal.vue";
import TagRow from "./TagRow.vue";

const items = [
  {
    name: "Phase One Club",
    description: "Landing page for the athleisure brand Phase One Club",
    languages: ["TypeScript", "React"],
    link: "https://www.phaseoneclub.se/",
  },
  {
    name: "Machine Advanced Solutions Network",
    description: "A full information website of a company MASN",
    languages: ["TypeScript", "Vue3"],
    link: "https://www.masn.mn/",
  },
  {
    name: "UA Scholars",
    description:
      "Scholarship submission service for Alaskan high-school delegates at University of Alaska",
    languages: ["TypeScript", "Vue2", "Fastify", "Prisma"],
    link: "https://www.alaska.edu/scholars/",
  },
  {
    name: "Portfolio",
    description:
      "This site — a portfolio styled as a Claude Code terminal session, built with Vue 3",
    languages: ["Vue3", "Vite"],
    link: "@",
  },
  {
    name: "Fletnix",
    description: "Mock streaming site with user authentication and roles",
    languages: ["React", "NextJS", "MongoDB", "Tailwind"],
    link: "https://fletnix.vercel.app/",
  },
  {
    name: "Our Winter World",
    description: "A WordPress plugin for snow educational activities",
    languages: ["React", "WordPress", "PHP"],
    link: "http://ourwinterworld.org/",
  },
];

const isLink = (item) => item.link && item.link !== "@";
const numberOf = (index) => String(index + 1).padStart(2, "0");
</script>

<template>
  <section aria-label="Projects">
    <PromptLine text="show me his projects" />

    <ToolCall
      tool="Bash"
      arg="ls ~/projects"
      label="Projects"
      :meta="`${items.length} directories`"
    >
      <div class="project-list">
        <component
          :is="isLink(item) ? 'a' : 'div'"
          v-for="(item, index) in items"
          :key="item.name"
          class="project"
          :href="isLink(item) ? item.link : null"
          :target="isLink(item) ? '_blank' : null"
          :rel="isLink(item) ? 'noreferrer' : null"
        >
          <span class="project__index dim" aria-hidden="true">{{
            numberOf(index)
          }}</span>
          <div class="project__body">
            <h3 class="project__title">
              <span class="project__name">{{ item.name }}</span>
              <IconExternal v-if="isLink(item)" class="project__arrow" />
              <span v-else class="project__badge mono-label">you are here</span>
            </h3>
            <p class="project__desc dim">{{ item.description }}</p>
            <TagRow :items="item.languages" />
          </div>
        </component>
      </div>
    </ToolCall>
  </section>
</template>

<style scoped>
.project {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 0 0.5rem;
  padding: 1.5rem 0.75rem 1.5rem 1rem;
  border-bottom: 1px solid var(--line);
  border-left: 2px solid transparent;
  color: inherit;
  transition: background-color var(--dur) var(--ease),
    border-left-color var(--dur) var(--ease);
}
a.project {
  cursor: pointer;
}
a.project:hover,
a.project:focus-visible {
  background-color: var(--hover);
  border-left-color: var(--accent);
}

.project__index {
  font-size: var(--fs-sm);
  font-variant-numeric: tabular-nums;
  padding-top: 0.15rem;
}

.project__body {
  min-width: 0;
}

.project__title {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: var(--fs-lg);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.project__name {
  background-image: linear-gradient(var(--accent), var(--accent));
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0% 1px;
  transition: background-size var(--dur) var(--ease);
}
a.project:hover .project__name,
a.project:focus-visible .project__name {
  background-size: 100% 1px;
}

.project__arrow {
  color: var(--ink-dim);
  transition: transform var(--dur) var(--ease), color var(--dur) var(--ease);
}
a.project:hover .project__arrow,
a.project:focus-visible .project__arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

.project__badge {
  color: var(--ok);
  border: 1px solid var(--line);
  padding: 0.1rem 0.4rem;
}

.project__desc {
  font-size: var(--fs-sm);
  line-height: var(--lh-body);
  margin-bottom: 0.75rem;
  max-width: 60ch;
}

/* Full-width tab panel on desktop: tighter rows so all six fit one screen */
@media (min-width: 1100px) {
  .project {
    padding: 0.75rem 0.75rem 0.75rem 1rem;
  }
  .project__title {
    margin-bottom: 0.2rem;
  }
  .project__desc {
    margin-bottom: 0.45rem;
  }
}
</style>
