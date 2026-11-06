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
  <div class="vignette" aria-hidden="true"></div>
</template>

<style scoped>
.sea-grid {
  position: fixed;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  background: #ffffff;
  font-family: var(--font-mono);
}

/* Darkens toward the edges so the bright sea settles around the chat. */
.vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 75% 70% at 50% 50%,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0.07) 70%,
    rgba(0, 0, 0, 0.29) 100%
  );
}
</style>
