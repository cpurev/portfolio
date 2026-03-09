<script setup>
import { onMounted, computed } from 'vue'

const props = defineProps({
    folderName: String,
    iconImg: String,
    color: String,
    x: Number,
    y: Number
    
})

const iconClass = computed(() => 'fa-solid ' + props.iconImg + ' fa-10x')

onMounted(() =>{
    gsap.registerPlugin(Draggable);
    Draggable.create("#folder", {
        bounds: ".wrapper",
        inertia: true
        });
})
</script>

<template>
    <div id="folder" :style="{ left: x + 'px', bottom: y + 'px', color: color  }">
      <font-awesome-icon :icon = iconClass class="folder-icon"/>
      <div class="folder-name">{{ folderName }}</div>
    </div>
</template>
  
  
  <style scoped>
  #folder {
    width: 100px;
    height: 100px;
    position: absolute;
    cursor: move;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  #folder:active{
    border: 1px dotted black;
  }
  .folder-icon {
    font-size: 55px;
  }
  
  .folder-name {
    width: 100%;
    height: 30%;
    background: transparent;
    color: var(--privy-fg);
    text-align: center;
    line-height: 30px;
  }
  </style>
  