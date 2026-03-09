<script setup>
import Projects from './components/Projects.vue';
import Experience from './components/Experience.vue';
const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const sections = [
  {
    category: 'PROFILE',
    headline: 'Software Developer Builds Digital Experiences That Matter',
    body: 'A passionate software developer with a keen eye for detail and a love for clean, efficient code. Specializing in building modern web applications that deliver exceptional user experiences.',
  },
  {
    category: 'EXPERIENCE',
    headline: 'Full-Stack Engineering: From Concept to Deployment',
    body: 'Years of hands-on experience building production-grade applications across the entire stack. Proficient in JavaScript, TypeScript, Vue.js, React, Node.js, and modern cloud infrastructure.',
  },
  {
    category: 'PROJECTS',
    headline: 'Portfolio of Projects Showcases Range and Depth',
    body: 'A diverse collection of projects spanning web applications, developer tools, and creative experiments. Each project reflects a commitment to quality craftsmanship and solving real problems.',
  },
  {
    category: 'COMMUNITY',
    headline: 'Open Source Contributions and Community Involvement',
    body: 'Active contributor to the developer community through open source projects, knowledge sharing, and collaboration. Believes in the power of community-driven development.',
  },
  {
    category: 'PHILOSOPHY',
    headline: 'The Pursuit of Continuous Learning Never Stops',
    body: 'Technology evolves rapidly, and staying ahead means embracing lifelong learning. Every challenge is an opportunity to grow and refine the craft of software development.',
  },
]
</script>

<template>
  <div class="halftone" style="max-width: 888px; margin: 0 auto; padding: 2rem 1.5rem 4rem;">

    <!-- Top bar -->
    <!-- <div style="display: flex; justify-content: space-between; align-items: center; font-size: var(--f-small); color: var(--privy-muted); padding-bottom: 0.75rem;">
      <span>{{ today }}</span>
      <div style="display: flex; gap: 1.5rem;">
        <a href="https://github.com/" target="_blank" rel="noreferrer" style="color: var(--privy-muted); text-decoration: none;">GitHub</a>
        <a href="https://linkedin.com/" target="_blank" rel="noreferrer" style="color: var(--privy-muted); text-decoration: none;">LinkedIn</a>
        <a href="mailto:hello@example.com" style="color: var(--privy-muted); text-decoration: none;">Email</a>
      </div>
    </div> -->

    <!-- Masthead -->
    <div style="text-align: center; padding: 1.25rem 0 0.5rem;">
      <h1 style="color: var(--text-primary-color); font-weight: 800;font-size: clamp(2rem, 6vw, 3.5rem); letter-spacing: 0.04em; text-transform: uppercase;">Chuluunbat Purev</h1>
    </div>

    <!-- Bottom rule -->
    <div style="height: 0.5px; background: var(--privy-fg);"></div>
    <div style="padding: 0.75rem 0; display: flex; justify-content: space-between; align-items: center; font-size: var(--f-small); color: var(--privy-muted);">
      <span>VER 3.0</span>
      <span>{{ today }}</span>
      <div style="display: flex; gap: 1.5rem;">
        <a href="https://github.com/cpurev" target="_blank" rel="noreferrer" style="color: var(--privy-muted); text-decoration: none;">GitHub</a>
        <a href="https://www.linkedin.com/in/chuluunbat-purev/" target="_blank" rel="noreferrer" style="color: var(--privy-muted); text-decoration: none;">LinkedIn</a>
        <a href="mailto:puluunbat@gmail.com" style="color: var(--privy-muted); text-decoration: none;">Email</a>
      </div>
    </div>
    <div style="height: 0.5px; background: var(--privy-fg);"></div>

    <!-- Lead article -->
    <div style="padding-top: 2rem; text-align: center; border-bottom: 1px solid var(--privy-muted); padding-bottom: 2rem; margin-bottom: 2rem;">
      <h2 style="font-size: var(--f-xxl); line-height: 1.4; margin: 0.75rem auto; max-width: 700px;">Software Engineer</h2>
      <div style="width: 163px; height: 1px; background: var(--privy-fg); margin: 0.75rem auto;"></div>
      <p style="font-size: var(--f-medium); line-height: 1.8; max-width: 600px; margin: 0 auto; color: var(--privy-muted);">
        A developer specializing in building (and occasionally designing) exceptional websites, applications, and everything in between.
      </p>
    </div>

    
    <Projects />

    <Experience />

  </div>
  <footer style=" padding-bottom: 1rem; text-align: center; font-size: var(--f-small); color: var(--privy-muted); padding-top: 1rem;">
    <p>© {{ new Date().getFullYear() }} Chuluunbat Purev</p>
  </footer>
</template>

<style scoped>
.halftone {
  position: relative;
}
.halftone::after {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle, rgb(255, 255, 255, 0.3) 0.6px, transparent 0.6px) 0 0 / 3px 3px,
    radial-gradient(circle, rgba(255, 255, 255, 0.16) 0.4px, transparent 0.4px) 1.5px 1.5px / 3px 3px;
  pointer-events: none;
  z-index: 9999;
}
</style>
