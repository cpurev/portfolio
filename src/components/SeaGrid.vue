<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { SeaEngine } from "../sea/engine.js";

/* Full-screen grid of cells with drifting jellyfish (see src/sea/).
   Press "a" to switch between ASCII glyphs and each cell's alpha (0–255). */

const props = defineProps({
  mode: { type: String, default: "glyph" }, // "glyph" | "alpha"
});

const canvas = ref(null);
let engine = null;
let mode = props.mode;

const onKeydown = (event) => {
  if (event.key !== "a" || event.metaKey || event.ctrlKey || event.altKey)
    return;
  // Typing in the chat (or any field) must not flip the background.
  const el = event.target;
  if (
    el.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)
  )
    return;
  mode = mode === "alpha" ? "glyph" : "alpha";
  engine.setMode(mode);
};

onMounted(() => {
  engine = new SeaEngine(canvas.value, { mode });
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  engine?.destroy();
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <canvas ref="canvas" class="sea-grid" aria-hidden="true"></canvas>
</template>

<style scoped>
.sea-grid {
  position: fixed;
  inset: 0;
  display: block;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  font-family: var(--font-mono);
}
</style>
