<script setup>
import IconExternal from "./IconExternal.vue";

const year = new Date().getFullYear();

const links = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chuluunbat-purev/",
  },
  { label: "GitHub", href: "https://github.com/cpurev" },
];
</script>

<template>
  <footer class="footer">
    <span>&copy; {{ year }} Chuluunbat Purev</span>
    <template v-for="link in links" :key="link.label">
      <span class="dot" aria-hidden="true">&middot;</span>
      <a :href="link.href" target="_blank" rel="noreferrer" class="link">
        {{ link.label }}
        <IconExternal />
      </a>
    </template>
  </footer>
</template>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: max(1rem, env(safe-area-inset-bottom));
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  font-size: var(--fs-xs);
  color: #6b6b6b;
  pointer-events: none; /* only the links take clicks; the sea stays interactive */
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  color: #121212;
  pointer-events: auto;
  text-decoration: underline;
  text-decoration-color: rgba(18, 18, 18, 0.25);
  text-underline-offset: 3px;
  transition: text-decoration-color var(--dur-fast) var(--ease);
}

.link:hover {
  text-decoration-color: currentColor;
}

.dot {
  opacity: 0.5;
}
</style>
