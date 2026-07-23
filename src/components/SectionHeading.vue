<script setup>
defineProps({
  title: { type: String, required: true },
  index: { type: [String, Number], default: null },
  count: { type: [String, Number], default: null },
})
</script>

<template>
  <div class="section-heading">
    <div class="section-heading__row">
      <span v-if="index != null" class="section-heading__index">{{ index }}</span>
      <h2 class="section-heading__title">{{ title }}</h2>
      <span v-if="count != null" class="section-heading__count">{{ count }}</span>
    </div>
    <span class="section-heading__rule" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.section-heading {
  margin-bottom: 2rem;
}

.section-heading__row {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.section-heading__index {
  font-size: var(--fs-label);
  letter-spacing: var(--tracking-label);
  color: var(--accent);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.section-heading__title {
  font-size: var(--fs-xl);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.section-heading__count {
  margin-left: auto;
  font-size: var(--fs-label);
  letter-spacing: var(--tracking-label);
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}

.section-heading__rule {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--line-strong);
}
</style>
