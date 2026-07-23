<script setup>
import SectionHeading from './SectionHeading.vue'
import TagRow from './TagRow.vue'

const items = [
  { period: '2025 - Present', role: 'Software Engineer', company: 'Talendary', link: 'https://www.fnsb.gov', description: 'Creating an AI driven recruitment platform, owning features end to end, from front end to backend to cloud infrastructure, in a fast-moving startup where engineering stays close to the commercial and product side.', skills: ['Remix', 'TypeScript', 'Python', 'FastAPI', 'HTML/CSS'] },
  { period: '2023 - 2024', role: 'Software Developer', company: 'Fairbanks North Star Borough', link: 'https://www.fnsb.gov', description: 'Deliver high-quality reliable software solutions to the borough goverment with diverse projects such as Python automation scripts, full stack web development, and API integrations. Provide leadership and self-starter contributions within Information Integration department.', skills: ['Azure', 'Vue', 'JavaScript', 'TypeScript', 'Python', 'C#', 'GO', 'HTML/CSS'] },
  { period: '2021 - 2023', role: 'Student Systems Engineer', company: 'University of Alaska', link: 'https://www.alaska.edu', description: 'Collaborated with students and staff to create full-stack web applications, resolve tickets, mentor users, improve accessibility, and maintain CI/CD pipelines.', skills: ['React', 'Vue', 'JavaScript', 'TypeScript', 'Python', 'Ruby', 'HTML/CSS', 'PHP'] },
]
</script>

<template>
  <section class="experience container" aria-label="Experience">
    <SectionHeading title="Experience" index="01" :count="String(items.length).padStart(2, '0')" />

    <div class="role-list">
      <a
        v-for="item in items"
        :key="item.company"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        class="role"
      >
        <span class="role__period mono-label">{{ item.period }}</span>

        <div class="role__body">
          <h3 class="role__title">
            <span class="role__name">{{ item.role }}</span>
            <font-awesome-icon
              icon="fa-solid fa-arrow-up-right-from-square"
              class="role__arrow"
            />
          </h3>
          <span class="role__company">{{ item.company }}</span>
          <p class="role__desc">{{ item.description }}</p>
          <TagRow :items="item.skills" label="Skills" />
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.experience {
  margin-top: var(--section-gap);
}

.role {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 0 1.5rem;
  padding: 1.75rem 0.75rem 1.75rem 1rem;
  border-bottom: 1px solid var(--line);
  border-left: 2px solid transparent;
  color: inherit;
  transition: background-color var(--dur) var(--ease), border-left-color var(--dur) var(--ease);
}
.role:hover,
.role:focus-visible {
  background-color: var(--hover);
  border-left-color: var(--accent);
}

.role__period {
  padding-top: 0.3rem;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.role__body {
  min-width: 0;
}

.role__title {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: var(--fs-lg);
  font-weight: 500;
  margin-bottom: 0.4rem;
}

.role__name {
  background-image: linear-gradient(var(--accent), var(--accent));
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0% 1px;
  transition: background-size var(--dur) var(--ease);
}
.role:hover .role__name,
.role:focus-visible .role__name {
  background-size: 100% 1px;
}

.role__arrow {
  font-size: 0.7em;
  color: var(--ink-3);
  transition: transform var(--dur) var(--ease), color var(--dur) var(--ease);
}
.role:hover .role__arrow,
.role:focus-visible .role__arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

.role__company {
  display: block;
  font-size: var(--fs-sm);
  color: var(--ink);
  margin-bottom: 0.75rem;
}

.role__desc {
  font-size: var(--fs-sm);
  line-height: var(--lh-body);
  color: var(--ink-2);
  margin-bottom: 0.85rem;
  max-width: 62ch;
}

@media (max-width: 620px) {
  .role {
    grid-template-columns: 1fr;
    gap: 0.6rem 0;
  }
  .role__period {
    padding-top: 0;
    order: -1;
  }
}
</style>
