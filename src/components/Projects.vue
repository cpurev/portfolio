<script setup>
import { ref, computed } from 'vue'
import SectionHeading from './SectionHeading.vue'
import TagRow from './TagRow.vue'

const items = [
  {img: "", name:'Phase One Club', description:'A landing page for a athleasure brand Phase One Club', languages:['TypeScript', 'React'],link:'https://www.phaseoneclub.se/'},
  {img: "", name:'Machine Advanced Solutions Network', description:'A full information website of a company MASN', languages:['TypeScript', 'Vue3'],link:'https://www.masn.mn/'},
  {img: "scholars_proj.png", name:'UA Scholars', description:'Web service for Alaskan highschool delegators to submit their students for scholarship opportunities in University of Alaska', languages:['TypeScript', 'Vue2', 'Fastify', 'Prisma'], link:'https://www.alaska.edu/scholars/'},
  {img: "prot_proj.png", name:'Portfolio', description:'Portfolio website created from scratch with Vue3 and Greensock javascript animation library', languages:['Vue3', 'Greensock'], link:'/'},
  {img: "fletnix_proj.png", name:'Fletnix', description:'Fully functional mock up streaming site with user authentication and roles', languages:['React', 'NextJS', 'MongoDB', 'Tailwind'], link:'https://fletnix.vercel.app/'},
  {img: "oww_proj.png", name:'Our Winter World', description:'A WordPress plugin for snow educational activities', languages:['React', 'WordPress', 'PHP'], link:'http://ourwinterworld.org/'}
]

const VISIBLE = 3
const expanded = ref(false)
const canExpand = computed(() => items.length > VISIBLE)
const primaryItems = computed(() => items.slice(0, VISIBLE))
const overflowItems = computed(() => items.slice(VISIBLE))

const isLink = (item) => item.link && item.link !== '@'
const numberOf = (index) => String(index + 1).padStart(2, '0')
</script>

<template>
  <section class="projects container" aria-label="Projects">
    <SectionHeading title="Projects" index="02" :count="String(items.length).padStart(2, '0')" />

    <div class="project-list">
      <component
        :is="isLink(item) ? 'a' : 'div'"
        v-for="(item, index) in primaryItems"
        :key="item.name"
        class="project"
        :class="{ 'project--wip': !isLink(item) }"
        :href="isLink(item) ? item.link : null"
        :target="isLink(item) ? '_blank' : null"
        :rel="isLink(item) ? 'noreferrer' : null"
      >
        <span class="project__index" aria-hidden="true">{{ numberOf(index) }}</span>
        <div class="project__body">
          <h3 class="project__title">
            <span class="project__name">{{ item.name }}</span>
            <font-awesome-icon
              v-if="isLink(item)"
              icon="fa-solid fa-arrow-up-right-from-square"
              class="project__arrow"
            />
            <span v-else class="project__wip mono-label">WIP</span>
          </h3>
          <p class="project__desc">{{ item.description }}</p>
          <TagRow :items="item.languages" />
        </div>
      </component>

      <!-- Overflow rows: animate to auto height -->
      <div v-if="canExpand" class="more" :class="{ 'is-open': expanded }">
        <div id="projects-more" class="more__inner" :inert="expanded ? null : true">
          <component
            :is="isLink(item) ? 'a' : 'div'"
            v-for="(item, index) in overflowItems"
            :key="item.name"
            class="project"
            :class="{ 'project--wip': !isLink(item) }"
            :href="isLink(item) ? item.link : null"
            :target="isLink(item) ? '_blank' : null"
            :rel="isLink(item) ? 'noreferrer' : null"
          >
            <span class="project__index" aria-hidden="true">{{ numberOf(index + VISIBLE) }}</span>
            <div class="project__body">
              <h3 class="project__title">
                <span class="project__name">{{ item.name }}</span>
                <font-awesome-icon
                  v-if="isLink(item)"
                  icon="fa-solid fa-arrow-up-right-from-square"
                  class="project__arrow"
                />
                <span v-else class="project__wip mono-label">WIP</span>
              </h3>
              <p class="project__desc">{{ item.description }}</p>
              <TagRow :items="item.languages" />
            </div>
          </component>
        </div>
      </div>
    </div>

    <div v-if="canExpand" class="toggle-wrap">
      <button
        type="button"
        class="toggle"
        :aria-expanded="expanded"
        aria-controls="projects-more"
        @click="expanded = !expanded"
      >
        <span class="mono-label">{{ expanded ? 'Show less' : 'Show all' }}</span>
        <font-awesome-icon icon="fa-solid fa-chevron-down" class="toggle__icon" :class="{ 'is-up': expanded }" />
      </button>
    </div>
  </section>
</template>

<style scoped>
.projects {
  margin-top: var(--section-gap);
}

.project {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 0 0.5rem;
  padding: 1.5rem 0.75rem 1.5rem 1rem;
  border-bottom: 1px solid var(--line);
  border-left: 2px solid transparent;
  color: inherit;
  transition: background-color var(--dur) var(--ease), border-left-color var(--dur) var(--ease);
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
  color: var(--accent);
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
  font-size: 0.7em;
  color: var(--ink-3);
  transition: transform var(--dur) var(--ease), color var(--dur) var(--ease);
}
a.project:hover .project__arrow,
a.project:focus-visible .project__arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

.project__wip {
  color: var(--ink-3);
  border: 1px solid var(--line);
  padding: 0.1rem 0.4rem;
}

.project__desc {
  font-size: var(--fs-sm);
  line-height: var(--lh-body);
  color: var(--ink-2);
  margin-bottom: 0.75rem;
  max-width: 60ch;
}

/* animate-to-auto-height overflow */
.more {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--dur-slow) var(--ease);
}
.more.is-open {
  grid-template-rows: 1fr;
}
.more__inner {
  overflow: hidden;
  min-height: 0;
}

.toggle-wrap {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  color: var(--ink-3);
  transition: color var(--dur) var(--ease);
}
.toggle:hover {
  color: var(--accent);
}
.toggle__icon {
  font-size: 0.7rem;
  transition: transform var(--dur) var(--ease);
}
.toggle__icon.is-up {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .more {
    transition: none;
  }
}
</style>
