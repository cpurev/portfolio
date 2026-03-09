<script setup>
import { ref } from 'vue'

defineProps({
  text: {
    type: String,
    required: false
  },
  link:{
    type: String,
    required: true
  }
})
const altText = ref('click me')

</script>

<template>
  <a class="base-btn" :href="link" @mouseover="clickHandler" target="_blank" rel="noreferrer">
    {{ text ? text : altText }}
  </a>
</template>

<style scoped>
.base-btn {
  text-decoration: none;
  padding: 1rem 3rem;
  background: transparent;
  font-size: 1rem;
  border: 1px solid var(--privy-border);
  border-radius: var(--privy-radius);
  color: var(--privy-fg);

  background: linear-gradient(to left, transparent 50%, var(--privy-accent) 50%) right;
  background-size: 200%;
  transition: .3s ease-out;
}
.base-btn:hover {
  background-position: left;
}
</style>
