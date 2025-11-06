<template>
  <div v-if="isOpen" class="modal-mask">
    <div class="modal-wrapper" ref="target">
      <div class="modal-container">
        <!-- Close icon inside child -->
        <font-awesome-icon 
          icon="fa-solid fa-x" 
          @click="handleClick" 
          class="close-icon"
        />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["modal-close"]);
const handleClick = () => emit('modal-close');

const target = ref(null)
onClickOutside(target, () => emit('modal-close'))
</script>

<style scoped>
.modal-mask{
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-wrapper {
  position: relative;
  width: 666px;
  border: 1px solid #000;
  border-radius: 17px;
  background-color: white;
  z-index: 999;
}

.modal-container {
  position: relative; /* Needed for absolute positioning of close icon */
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: black;
  font-size: 1.2rem;
  z-index: 10;
}

@media only screen and (max-width: 940px) {
  .modal-wrapper {
    max-height: 400px;
    max-width: 300px;
    overflow-y: auto;
  }
}
</style>
