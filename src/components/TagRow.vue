<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  label: { type: String, default: "Technologies" },
});
</script>

<template>
  <ul v-if="items.length" class="tag-row" :aria-label="label">
    <li v-for="item in items" :key="item" class="tag-row__item">{{ item }}</li>
  </ul>
</template>

<style scoped>
.tag-row {
  display: flex;
  flex-wrap: wrap;
  row-gap: 0.25rem;
}

.tag-row::before {
  content: "# " / "";
  color: var(--ink-dim);
  white-space: pre;
}

.tag-row__item {
  display: inline-flex;
  align-items: center;
  font-size: var(--fs-xs);
  text-transform: lowercase;
  color: var(--ink-dim);
  white-space: nowrap;
}

.tag-row__item:not(:last-child)::after {
  content: "\00b7";
  margin: 0 0.6rem;
  opacity: 0.6;
}
</style>
