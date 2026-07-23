<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import IconExternal from "./components/IconExternal.vue";
import ExperienceSection from "./components/ExperienceSection.vue";
import ProjectsSection from "./components/ProjectsSection.vue";

const year = new Date().getFullYear();

const resumeUrl =
  "https://drive.google.com/file/d/1p_oI140qzwjDMW-zNRVfYdI1e23R6yKA/view";

const links = [
  { label: "GitHub", href: "https://github.com/cpurev", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chuluunbat-purev/",
    external: true,
  },
  { label: "Email", href: "mailto:puluunbat@gmail.com", external: false },
  { label: "Resume", href: resumeUrl, external: true },
];

const tabs = [
  { id: "profile", path: "~/chuluunbat-purev" },
  { id: "experience", path: "~/experience" },
  { id: "projects", path: "~/projects" },
];

const active = ref(0);
const tabButtons = ref([]);

const selectTab = (index, focus = false) => {
  active.value = (index + tabs.length) % tabs.length;
  const id = tabs[active.value].id;
  window.history.replaceState(null, "", id === "profile" ? " " : `#${id}`);
  if (focus) tabButtons.value[active.value]?.focus();
};

const onTablistKeydown = (event) => {
  const moves = {
    ArrowRight: active.value + 1,
    ArrowLeft: active.value - 1,
    Home: 0,
    End: tabs.length - 1,
  };
  if (event.key in moves) {
    event.preventDefault();
    selectTab(moves[event.key], true);
  }
};

/* Claude Code flavor made real: shift+tab cycles tabs — but only when
   focus is on the tab bar or nowhere, so reverse keyboard navigation
   through page content stays intact. */
const onGlobalKeydown = (event) => {
  if (event.key !== "Tab" || !event.shiftKey) return;
  const el = document.activeElement;
  const onTabBar = tabButtons.value.includes(el);
  if (el === document.body || el === null || onTabBar) {
    event.preventDefault();
    selectTab(active.value + 1, onTabBar);
  }
};

onMounted(() => {
  const index = tabs.findIndex((t) => `#${t.id}` === window.location.hash);
  if (index > 0) active.value = index;
  window.addEventListener("keydown", onGlobalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onGlobalKeydown);
});
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>

  <div class="desktop">
    <div class="terminal reveal">
      <header class="titlebar">
        <nav
          class="tabbar"
          role="tablist"
          aria-label="Sections"
          @keydown="onTablistKeydown"
        >
          <button
            v-for="(tab, index) in tabs"
            :id="`tab-${tab.id}`"
            :key="tab.id"
            :ref="(el) => (tabButtons[index] = el)"
            role="tab"
            type="button"
            class="tab"
            :aria-selected="active === index"
            :aria-controls="`panel-${tab.id}`"
            :tabindex="active === index ? 0 : -1"
            @click="selectTab(index)"
          >
            <span class="tab__label">{{ tab.path }}</span>
          </button>
        </nav>
      </header>

      <main id="main" class="panel">
        <div
          v-show="active === 0"
          id="panel-profile"
          class="tabpage"
          role="tabpanel"
          aria-labelledby="tab-profile"
        >
          <section class="hello" aria-label="About">
            <span class="hello__boxtitle" aria-hidden="true"
              >Claude Code v4.0</span
            >
            <div class="hello__grid">
              <div class="hello__left">
                <p class="hello__hi">Welcome back!</p>
                <svg
                  class="hello__buddy"
                  viewBox="0 0 104 64"
                  fill="currentColor"
                  shape-rendering="crispEdges"
                  aria-hidden="true"
                  focusable="false"
                >
                  <rect x="8" y="0" width="8" height="8" />
                  <rect x="88" y="0" width="8" height="8" />
                  <rect x="0" y="8" width="16" height="8" />
                  <rect x="88" y="8" width="16" height="8" />
                  <rect x="16" y="16" width="8" height="8" />
                  <rect x="80" y="16" width="8" height="8" />
                  <rect x="24" y="24" width="56" height="8" />
                  <rect x="24" y="32" width="16" height="8" />
                  <rect x="48" y="32" width="8" height="8" />
                  <rect x="64" y="32" width="16" height="8" />
                  <rect x="24" y="40" width="56" height="8" />
                  <rect x="32" y="48" width="40" height="8" />
                  <rect x="24" y="56" width="8" height="8" />
                  <rect x="40" y="56" width="8" height="8" />
                  <rect x="56" y="56" width="8" height="8" />
                  <rect x="72" y="56" width="8" height="8" />
                </svg>
                <h1 class="hello__name">Chuluunbat Purev</h1>
                <p class="hello__meta dim">
                  Software Engineer with xhigh effort &middot; Stockholm
                </p>
                <p class="hello__cwd dim">~/chuluunbat-purev</p>
                <p class="hello__text">
                  A developer specializing in building (and occasionally
                  designing) exceptional websites, applications, and everything
                  in between.
                </p>
                <ul class="hello__links" aria-label="Links">
                  <li v-for="link in links" :key="link.label">
                    <a
                      :href="link.href"
                      :target="link.external ? '_blank' : null"
                      :rel="link.external ? 'noreferrer' : null"
                      class="hello__link"
                    >
                      {{ link.label }}
                      <IconExternal
                        v-if="link.external"
                        class="hello__link-icon"
                      />
                    </a>
                  </li>
                </ul>
              </div>

              <div class="hello__right">
                <h2 class="hello__rh">Tips for getting started</h2>
                <ul class="hello__list dim">
                  <li>
                    <button
                      type="button"
                      class="hello__jump"
                      @click="selectTab(1, true)"
                    >
                      Open ~/experience
                    </button>
                    &mdash; 3 roles, 2021 &rarr; present
                  </li>
                  <li>
                    <button
                      type="button"
                      class="hello__jump"
                      @click="selectTab(2, true)"
                    >
                      Open ~/projects
                    </button>
                    &mdash; 6 shipped projects
                  </li>
                  <li>Press shift+tab to cycle tabs</li>
                </ul>
                <span class="hairline hello__rule" aria-hidden="true"></span>
                <h2 class="hello__rh">What's new</h2>
                <ul class="hello__list dim">
                  <li class="trunc">
                    Building an AI-driven recruitment platform at Talendary
                  </li>
                  <li class="trunc">
                    Portfolio v4.0 &mdash; redesigned as a Claude Code session
                  </li>
                </ul>
                <p class="hello__more dim">
                  <a
                    class="hello__jump"
                    :href="resumeUrl"
                    target="_blank"
                    rel="noreferrer"
                    >/resume</a
                  >
                  for the full history
                </p>
              </div>
            </div>
          </section>
        </div>

        <div
          v-show="active === 1"
          id="panel-experience"
          class="tabpage"
          role="tabpanel"
          aria-labelledby="tab-experience"
        >
          <ExperienceSection />
        </div>

        <div
          v-show="active === 2"
          id="panel-projects"
          class="tabpage"
          role="tabpanel"
          aria-labelledby="tab-projects"
        >
          <ProjectsSection />
        </div>
      </main>

      <footer class="dock">
        <p class="dock__mode dim">
          <span class="dock__dot" aria-hidden="true">&#9673;</span>
          xhigh &middot; /effort
        </p>
        <span class="hairline" aria-hidden="true"></span>
        <p class="dock__input" aria-hidden="true">
          <span class="dock__caret">&#10095;</span>
          <span class="cursor"></span>
        </p>
        <span class="hairline" aria-hidden="true"></span>
        <div class="dock__rows">
          <p class="dock__row">
            <span class="dock__brand">
              <span class="dock__star" aria-hidden="true">&#10043;</span>
              Fable 5
              <span class="dim" aria-hidden="true">&#9474;</span>
              portfolio
              <span class="dock__ctx dim" aria-hidden="true"
                ><span class="dock__ctx-fill">&#9608;</span
                >&#9617;&#9617;&#9617;&#9617;&#9617;&#9617;&#9617;&#9617;&#9617;
                12%</span
              >
            </span>
            <a
              class="hello__jump dock__rc"
              :href="resumeUrl"
              target="_blank"
              rel="noreferrer"
              >/resume</a
            >
          </p>
          <p class="dock__row">
            <span class="dim"
              >&#9205;&#9205; auto mode on (shift+tab to cycle) &middot; &copy;
              {{ year }} Chuluunbat Purev</span
            >
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* ----------------------------------------------------------- the desktop */
.desktop {
  height: 100%;
  padding: clamp(0.5rem, 1.8vh, 1.25rem) clamp(0.5rem, 2vw, 1.5rem);
}

/* ---------------------------------------------------- the terminal window */
.terminal {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 10px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
  overflow: hidden;
}

/* -------------------------------------------------------------- title bar */
.titlebar {
  display: flex;
  flex: none;
  padding: 0.5rem 0.6rem;
  background: var(--bg-raise);
  border-bottom: 1px solid var(--line);
}

.tabbar {
  display: flex;
  flex: 1;
  min-width: 0;
  gap: 0.4rem;
}

.tab {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.9rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: inherit;
  font-size: var(--fs-sm);
  color: var(--ink-dim);
  cursor: pointer;
  transition: color var(--dur) var(--ease),
    background-color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.tab:hover {
  color: var(--ink);
  background: var(--hover);
}
.tab[aria-selected="true"] {
  background: var(--bg);
  color: var(--accent-strong);
  border-color: var(--line);
}
.tab:focus-visible {
  outline-offset: 1px;
}

.tab__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ------------------------------------------------------------- tab panels */
.panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
}

.tabpage {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-width: 1080px;
  padding: clamp(0.75rem, 2vh, 1.5rem) clamp(1rem, 3vw, 2rem);
}

/* ------------------------------------------------- welcome screen (about) */
.hello {
  position: relative;
  margin-top: 0.6rem;
  border: 1px solid var(--line);
  border-radius: 10px;
}

.hello__boxtitle {
  position: absolute;
  top: -0.72em;
  left: 1.25rem;
  padding: 0 0.6ch;
  background: var(--bg);
  font-size: var(--fs-sm);
  color: var(--ink-dim);
}

.hello__grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  padding: clamp(1.1rem, 3vh, 1.75rem) clamp(1rem, 2.5vw, 1.75rem);
}

.hello__left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding-right: clamp(1rem, 2.5vw, 1.75rem);
  text-align: center;
}

.hello__hi {
  font-weight: 600;
}

.hello__buddy {
  width: clamp(3.75rem, 9vh, 5rem);
  height: auto;
  margin: 0.4rem 0;
  color: var(--accent);
}

.hello__name {
  font-size: var(--fs-h1);
  font-weight: 600;
  letter-spacing: -0.01em;
  overflow-wrap: break-word;
}

.hello__meta,
.hello__cwd {
  font-size: var(--fs-sm);
}

.hello__text {
  max-width: 46ch;
  margin-top: 0.4rem;
  font-size: var(--fs-sm);
  line-height: var(--lh-body);
}

.hello__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 1.5rem;
}

.hello__link {
  display: inline-flex;
  align-items: center;
  gap: 0.45ch;
  padding-block: 0.6rem;
  font-size: var(--fs-sm);
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--line);
  text-underline-offset: 0.3em;
  cursor: pointer;
  transition: color var(--dur) var(--ease),
    text-decoration-color var(--dur) var(--ease);
}
.hello__link:hover,
.hello__link:focus-visible {
  color: var(--accent-strong);
  text-decoration-color: var(--accent-strong);
}

.hello__link-icon {
  color: var(--ink-dim);
  transition: color var(--dur) var(--ease);
}
.hello__link:hover .hello__link-icon,
.hello__link:focus-visible .hello__link-icon {
  color: var(--accent-strong);
}

.hello__right {
  min-width: 0;
  padding-left: clamp(1rem, 2.5vw, 1.75rem);
  border-left: 1px solid var(--line);
}

.hello__rh {
  font-size: var(--fs-base);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.hello__list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: var(--fs-sm);
}

.hello__list li {
  min-width: 0;
}

.trunc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hello__rule {
  margin: 1rem 0;
}

.hello__jump {
  padding: 0;
  background: none;
  border: none;
  font: inherit;
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--line);
  text-underline-offset: 0.3em;
  cursor: pointer;
  transition: color var(--dur) var(--ease),
    text-decoration-color var(--dur) var(--ease);
}
.hello__jump:hover,
.hello__jump:focus-visible {
  color: var(--accent-strong);
  text-decoration-color: var(--accent-strong);
}

.hello__more {
  margin-top: 0.75rem;
  font-size: var(--fs-sm);
}

/* ------------------------------------------------- input + status dock */
.dock {
  flex: none;
  padding-bottom: 0.55rem;
}

.dock__mode {
  padding: 0 1rem 0.35rem;
  text-align: right;
  font-size: var(--fs-xs);
}

.dock__dot {
  color: var(--accent);
}

.dock__input {
  display: flex;
  align-items: center;
  gap: 0.6ch;
  padding: 0.45rem 1rem;
}

.dock__caret {
  color: var(--accent);
  font-weight: 600;
}

.dock__rows {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.45rem 1rem 0;
  font-size: var(--fs-xs);
}

.dock__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.15rem 1.5rem;
}

.dock__brand {
  display: inline-flex;
  align-items: baseline;
  gap: 0.7ch;
}

.dock__star {
  color: var(--accent);
}

.dock__rc {
  font-size: var(--fs-xs);
  color: var(--ink-dim);
}

.dock__ctx {
  margin-left: 0.9ch;
}

.dock__ctx-fill {
  color: var(--ink);
}

/* --------------------------------------------------------------- narrow */
@media (max-width: 760px) {
  .hello__grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .hello__left {
    padding-right: 0;
  }
  .hello__right {
    padding-left: 0;
    border-left: none;
    border-top: 1px solid var(--line);
    padding-top: 1.25rem;
  }
}

@media (max-width: 640px) {
  .tab {
    padding: 0.8rem 0.4rem;
    font-size: var(--fs-label);
    letter-spacing: 0;
  }
}
</style>
