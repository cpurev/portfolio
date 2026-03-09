<script setup>
const items = [
  { period: '2025 - Present', role: 'Software Engineering Intern', company: 'Talendary', link: 'https://www.fnsb.gov', description: 'Creating an AI driven recruitment platform at a startup.', skills: ['Remix', 'TypeScript', 'Python', 'FastAPI', 'HTML/CSS'] },
  { period: '2023 - 2024', role: 'Software Developer', company: 'Fairbanks North Star Borough', link: 'https://www.fnsb.gov', description: 'Deliver high-quality reliable software solutions to the borough goverment with diverse projects such as Python automation scripts, full stack web development, and API integrations. Provide leadership and self-starter contributions within Information Integration department.', skills: ['Azure', 'Vue', 'JavaScript', 'TypeScript', 'Python', 'C#', 'GO', 'HTML/CSS'] },
  { period: '2021 - 2023', role: 'Student Systems Engineer', company: 'University of Alaska', link: 'https://www.alaska.edu', description: 'Collaborated with students and staff to create full-stack web applications, resolve tickets, mentor users, improve accessibility, and maintain CI/CD pipelines.', skills: ['React', 'Vue', 'JavaScript', 'TypeScript', 'Python', 'Ruby', 'HTML/CSS', 'PHP'] },
]

</script>

<template>
  <div style="max-width: 888px; margin: 0 auto; padding: 2rem 1.5rem;">

    <div style="text-align: center; margin-bottom: 2rem;">
      <h2 style="font-size: var(--f-xxl); line-height: 1.4; margin: 0.75rem auto; max-width: 700px;">Experience</h2>
      <div style="width: 163px; height: 1px; background: var(--privy-fg); margin: 0.75rem auto;"></div>
    </div>

    <div>
      <a
        v-for="(item, index) in items"
        :key="item.company"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        class="experience-row"
        style="display: block; text-decoration: none; color: inherit; padding: 1.25rem 0;"
      >
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
         <h3 style="font-weight: 800; font-size: var(--f-large); line-height: 1.4; margin: 0;">
            {{ item.role }}
            <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" size="xs" style="color: var(--privy-muted); margin-left: 0.25rem;" />
          </h3>
        </div>
        <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.35rem; padding-left: 2rem;">
          <span style="font-size: var(--f-small); color: var(--privy-fg);">{{ item.company }}</span>
          <span style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--privy-muted);">{{ item.period }}</span>
        </div>
        <p style="font-size: var(--f-small); line-height: 1.75; color: var(--privy-muted); margin: 0; padding-left: 2rem;">{{ item.description }}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; padding-left: 2rem;">
          <span
            v-for="skill in item.skills"
            :key="skill"
            style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--privy-muted); border: 1px solid var(--privy-border); padding: 2px 8px;"
          >{{ skill }}</span>
        </div>
      </a>
    </div>


  </div>
</template>

<style scoped>
</style>
