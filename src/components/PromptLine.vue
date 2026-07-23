<script setup>
defineProps({
  text: { type: String, default: "" },
  cursor: { type: Boolean, default: false },
});
</script>

<template>
  <p class="prompt">
    <span class="prompt__mark" aria-hidden="true">&gt;</span>
    <span class="prompt__text"
      >{{ text }}<span v-if="cursor" class="cursor" aria-hidden="true"></span
    ></span>
  </p>
</template>

<style scoped>
.prompt {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0 0.6ch;
  font-size: var(--fs-base);
  line-height: var(--lh-body);
}

.prompt__mark {
  color: var(--accent);
  font-weight: 600;
}

.prompt__text {
  color: var(--ink);
  overflow-wrap: anywhere;
  min-width: 0;
}
</style>
