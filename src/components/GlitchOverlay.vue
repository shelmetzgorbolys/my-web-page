<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { prefersReducedMotion, useFx } from '../composables/useFx'

interface Band {
  id: number
  top: number
  height: number
  shift: number
  dither: boolean
}

const { glitchActive } = useFx()
const bands = ref<Band[]>([])
let nextId = 0
let idleTimer: number | undefined
let burstTimer: number | undefined

const spawn = (count: number) => {
  bands.value = Array.from({ length: count }, () => ({
    id: nextId++,
    top: Math.random() * 100,
    height: 2 + Math.random() * 10,
    shift: (Math.random() - 0.5) * 40,
    dither: Math.random() > 0.6,
  }))
  window.setTimeout(() => (bands.value = []), 90 + Math.random() * 90)
}

const scheduleIdle = () => {
  idleTimer = window.setTimeout(() => {
    if (!document.hidden) spawn(1 + Math.floor(Math.random() * 3))
    scheduleIdle()
  }, 3500 + Math.random() * 6000)
}

watch(glitchActive, (active) => {
  clearInterval(burstTimer)
  document.documentElement.classList.toggle('is-glitching', active)
  if (active) burstTimer = window.setInterval(() => spawn(3 + Math.floor(Math.random() * 4)), 70)
})

onMounted(() => {
  if (!prefersReducedMotion()) scheduleIdle()
})

onBeforeUnmount(() => {
  clearTimeout(idleTimer)
  clearInterval(burstTimer)
})
</script>

<template>
  <div class="overlay" aria-hidden="true">
    <div
      v-for="band in bands"
      :key="band.id"
      :class="['band', { dither: band.dither }]"
      :style="{ top: `${band.top}%`, height: `${band.height}px`, transform: `translateX(${band.shift}px)` }"
    />
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 150;
  pointer-events: none;
  overflow: hidden;
}

.band {
  position: absolute;
  left: -40px;
  right: -40px;
  backdrop-filter: invert(1);
}

.band.dither {
  backdrop-filter: none;
  opacity: 0.85;
}
</style>
