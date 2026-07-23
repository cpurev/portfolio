<script setup>
import Projects from './components/Projects.vue'
import Experience from './components/Experience.vue'

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const links = [
  { label: 'GitHub', href: 'https://github.com/cpurev' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/chuluunbat-purev/' },
  { label: 'Email', href: 'mailto:puluunbat@gmail.com' },
]
</script>

<template>
  <a class="skip-link" href="#work">Skip to content</a>

  <header class="hero container reveal">
    <!-- Top utility bar -->
    <div class="topbar">
      <div class="topbar__meta">
        <span class="mono-label">VER 3.0</span>
        <span class="topbar__sep" aria-hidden="true"></span>
        <span class="mono-label topbar__date">{{ today }}</span>
      </div>
      <nav class="topbar__links" aria-label="Social">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noreferrer"
          class="topbar__link"
        >{{ link.label }}</a>
      </nav>
    </div>

    <span class="hairline"></span>

    <!-- Left hero -->
    <div class="hero__body">
      <h1 class="hero__name">Chuluunbat Purev</h1>
      <p class="hero__role">
        <span class="hero__tick" aria-hidden="true"></span>
        Software Engineer
      </p>
      <p class="hero__text">
        A developer specializing in building (and occasionally designing)
        exceptional websites, applications, and everything in between.
      </p>
    </div>
  </header>

  <main id="work">
    <Experience class="reveal" style="--reveal-delay: 120ms;" />
    <Projects class="reveal" style="--reveal-delay: 170ms;" />
  </main>

  <footer class="footer container">
    <span class="hairline"></span>
    <div class="footer__row">
      <p class="footer__copy mono-label">© {{ new Date().getFullYear() }} Chuluunbat Purev</p>
      <span class="mono-label footer__ver">VER 3.0</span>
    </div>
  </footer>
</template>

<style scoped>
.hero {
  padding-top: clamp(1.5rem, 4vw, 2.25rem);
}

/* ------------------------------------------------------------ top bar */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  padding-bottom: 0.85rem;
}

.topbar__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.topbar__sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--accent);
  flex: none;
}

.topbar__date {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar__links {
  display: flex;
  gap: 1.25rem;
  flex: none;
}

.topbar__link {
  font-size: var(--fs-label);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--ink-3);
}
.topbar__link:hover {
  color: var(--accent);
}

/* --------------------------------------------------------------- hero */
.hero__body {
  padding-top: clamp(3rem, 9vw, 6rem);
  padding-bottom: clamp(3rem, 9vw, 6rem);
}

.hero__name {
  font-weight: 600;
  font-size: clamp(2.4rem, 10vw, 5.25rem);
  line-height: 0.98;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  overflow-wrap: break-word;
}

.hero__role {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: clamp(1.25rem, 3vw, 1.75rem);
  font-size: clamp(1.05rem, 3vw, 1.4rem);
  font-weight: 500;
  color: var(--accent);
}

.hero__tick {
  width: 1.75rem;
  height: 2px;
  background: var(--accent);
  flex: none;
}

.hero__text {
  max-width: 54ch;
  margin-top: 1.5rem;
  font-size: var(--fs-base);
  line-height: var(--lh-body);
  color: var(--ink-2);
}

/* ------------------------------------------------------------- footer */
.footer {
  margin-top: var(--section-gap);
  padding-bottom: 2.5rem;
}

.footer__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.5rem;
}

.footer__ver {
  color: var(--ink-3);
}

/* --------------------------------------------------------- responsive */
@media (max-width: 560px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }
  .topbar__date {
    white-space: normal;
  }
}
</style>
