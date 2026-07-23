<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  label: { type: String, default: 'Technologies' },
})
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
  row-gap: 0.35rem;
}

.tag-row__item {
  display: inline-flex;
  align-items: center;
  font-size: var(--fs-label);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--ink-3);
  white-space: nowrap;
}

.tag-row__item:not(:last-child)::after {
  content: "";
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.45;
  margin: 0 0.7rem;
}
</style>
