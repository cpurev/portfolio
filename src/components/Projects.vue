<script setup>
import { ref, computed } from 'vue'

const items = [
  {img: "", name:'Phase One Club', description:'A landing page for a athleasure brand Phase One Club', languages:['TypeScript', 'React'],link:'https://www.phaseoneclub.se/'},
  {img: "", name:'Machine Advanced Solutions Network', description:'A full information website of a company MASN', languages:['TypeScript', 'Vue3'],link:'https://www.masn.mn/'},
  {img: "scholars_proj.png", name:'UA Scholars', description:'Web service for Alaskan highschool delegators to submit their students for scholarship opportunities in University of Alaska', languages:['TypeScript', 'Vue2', 'Fastify', 'Prisma'], link:'https://www.alaska.edu/scholars/'},
  {img: "prot_proj.png", name:'Portfolio', description:'Portfolio website created from scratch with Vue3 and Greensock javascript animation library', languages:['Vue3', 'Greensock'], link:'/'},
  {img: "fletnix_proj.png", name:'Fletnix', description:'Fully functional mock up streaming site with user authentication and roles', languages:['React', 'NextJS', 'MongoDB', 'Tailwind'], link:'https://fletnix.vercel.app/'},
  {img: "oww_proj.png", name:'Our Winter World', description:'A WordPress plugin for snow educational activities', languages:['React', 'WordPress', 'PHP'], link:'http://ourwinterworld.org/'}
]

const expanded = ref(false)
const canExpand = computed(() => items.length > 3)

const handleClick = (link) => { 
  if(link == "@") return; 
  window.open(link, "_blank"); 
}
</script>

<template>
  <div style="max-width: 888px; margin: 0 auto; padding: 2rem 1.5rem;">

    <div style="text-align: center; margin-bottom: 2rem;">
      <h2 style="font-size: var(--f-xxl); line-height: 1.4; margin: 0.75rem auto; max-width: 700px;">Projects</h2>
      <div style="width: 163px; height: 1px; background: var(--privy-fg); margin: 0.75rem auto;"></div>
    </div>

    <div class="projects-list" :class="{ collapsed: canExpand && !expanded }">
      <div
        v-for="(item, index) in items"
        :key="item.name"
        @click="handleClick(item.link)"
        :style="{ cursor: item.link !== '@' ? 'pointer' : 'default' }"
        class="project-row"
        style="display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; padding: 1.25rem 0; border-bottom: 1px solid var(--privy-border);"
      >
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
            <span style="font-size: var(--f-small); color: var(--privy-muted);">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 style="font-weight: 600; font-size: var(--f-large); line-height: 1.4; margin: 0;">
              {{ item.name }}
              <font-awesome-icon v-if="item.link !== '@'" icon="fa-solid fa-arrow-up-right-from-square" size="xs" style="color: var(--privy-muted); margin-left: 0.25rem;" />
              <span v-else style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--privy-muted); margin-left: 0.35rem;">WIP</span>
            </h3>
          </div>
          <p style="font-size: var(--f-small); line-height: 1.75; color: var(--privy-muted); margin: 0;">{{ item.description }}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem;">
            <span
              v-for="lang in item.languages"
              :key="lang"
              style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--privy-muted); border: 1px solid var(--privy-border); padding: 2px 8px;"
            >{{ lang }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="canExpand" @click="expanded = !expanded" class="chevron-toggle" :class="{ 'chevron-toggle--expanded': expanded }">
      <font-awesome-icon icon="fa-solid fa-chevron-down" class="chevron-icon" :class="{ rotated: expanded }" />
    </div>

  </div>
</template>

<style scoped>
.projects-list {
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.projects-list.collapsed {
  max-height: 27rem;
}


.chevron-toggle {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  cursor: pointer;
  margin-top: -3rem;
  padding-bottom: 0.5rem;
  height: 4rem;
  background: linear-gradient(to bottom, transparent 0%, var(--privy-bg) 70%);
}

.chevron-toggle--expanded {
  margin-top: 0;
  height: auto;
  padding: 1rem 0;
  background: none;
  border-top: 1px solid var(--privy-border);
}

.chevron-icon {
  color: var(--privy-muted);
  font-size: 14px;
  transition: transform 0.3s ease, color 0.2s ease;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.chevron-toggle:hover .chevron-icon {
  color: var(--privy-fg);
}
</style>
