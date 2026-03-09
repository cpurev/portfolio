<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

</script>
<template>
    <div class="header">
            <div class="nav-bar">
              <div class="links">
                <a href="mailto:puluunbat@gmail.com" aria-label="Email" target="_blank" rel="noreferrer" class="nav-btn">email</a>
                <span class="separator">/</span>
                <a href="https://github.com/cpurev" aria-label="GitHub" target="_blank" rel="noreferrer" class="nav-btn">github</a>
                <span class="separator">/</span>
                <a href="https://www.linkedin.com/in/chuluunbat-purev/" aria-label="Linkedin" target="_blank" rel="noreferrer" class="nav-btn">linkedin</a>
              </div>
            </div>
        </div>
</template>
<style scoped>
.header {
  width: 100%;
}

.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1.5;
  padding: 1rem 0;
}

.links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-btn {
  cursor: pointer;
  color: #343434;
  font: inherit;
  font-size: 1rem;
  background: transparent;
  border: none;
  outline: none;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-btn:hover {
  opacity: 0.5;
}

.nav-btn:active,
.nav-btn:focus,
.nav-btn:focus-visible {
  outline: none;
}

.separator {
  color: #343434;
  user-select: none;
}
</style>
