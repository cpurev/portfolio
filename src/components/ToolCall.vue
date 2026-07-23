<script setup>
defineProps({
  tool: { type: String, required: true },
  arg: { type: String, required: true },
  label: { type: String, default: null },
  meta: { type: String, default: null },
});
</script>

<template>
  <div class="toolcall">
    <h2 v-if="label" class="sr-only">{{ label }}</h2>

    <p class="toolcall__line" aria-hidden="true">
      <span class="toolcall__dot"></span>
      <span class="toolcall__cmd">
        <span class="toolcall__tool">{{ tool }}</span
        ><span class="dim">(</span>{{ arg }}<span class="dim">)</span>
      </span>
    </p>

    <div class="toolcall__output">
      <p v-if="meta" class="toolcall__meta dim" aria-hidden="true">
        <span class="toolcall__elbow"></span>{{ meta }}
      </p>
      <div class="toolcall__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolcall__line {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: baseline;
  gap: 0 0.6ch;
  font-size: var(--fs-base);
}

.toolcall__dot {
  width: 0.55em;
  height: 0.55em;
  border-radius: 50%;
  background: var(--accent);
  align-self: center;
}

.toolcall__cmd {
  min-width: 0;
  overflow-wrap: anywhere;
}

.toolcall__tool {
  font-weight: 600;
}

.toolcall__output {
  margin-left: 0.4rem;
  padding-left: 1.25rem;
  border-left: 1px solid var(--line);
  margin-top: 0.35rem;
}

.toolcall__meta {
  display: flex;
  align-items: center;
  gap: 0.6ch;
  font-size: var(--fs-sm);
  margin-bottom: 0.75rem;
}

.toolcall__elbow {
  width: 0.55em;
  height: 0.55em;
  border-left: 1px solid var(--ink-dim);
  border-bottom: 1px solid var(--ink-dim);
  transform: translateY(-0.15em);
  flex: none;
}

@media (max-width: 480px) {
  .toolcall__output {
    padding-left: 0.8rem;
  }
}

/* Compact pane mode: narrower gutter, space is at a premium */
@media (min-width: 1100px) {
  .toolcall__output {
    padding-left: 0.9rem;
  }
  .toolcall__meta {
    margin-bottom: 0.5rem;
  }
}
</style>
