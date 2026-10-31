<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useFx } from '../composables/useFx'

const props = defineProps<{ section: string; progress: number }>()

const { notice } = useFx()
const time = ref('')
const fps = ref(60)

let clockTimer: number | undefined
let frameId = 0
let frames = 0
let since = performance.now()

const tickClock = () => {
  time.value = new Date().toLocaleTimeString('ru-RU')
}

const measure = (now: number) => {
  frames++
  if (now - since >= 1000) {
    fps.value = Math.round((frames * 1000) / (now - since))
    frames = 0
    since = now
  }
  frameId = requestAnimationFrame(measure)
}

onMounted(() => {
  tickClock()
  clockTimer = window.setInterval(tickClock, 1000)
  frameId = requestAnimationFrame(measure)
})

onBeforeUnmount(() => {
  clearInterval(clockTimer)
  cancelAnimationFrame(frameId)
})

const percent = computed(() => Math.round(props.progress * 100))
</script>

<template>
  <footer class="status" aria-label="Статус">
    <span class="status__cell status__section"><span class="status__text">▶ {{ notice || section }}</span></span>
    <span class="status__cell status__progress">
      <span class="status__track"><span class="status__fill dither" :style="{ width: `${percent}%` }" /></span>
      {{ String(percent).padStart(3, '0') }}%
    </span>
    <span class="status__cell status__hint">Ctrl+K — терминал</span>
    <span class="status__cell status__fps">FPS {{ String(fps).padStart(2, '0') }}</span>
    <span class="status__cell">{{ time }}</span>
  </footer>
</template>

<style scoped>
.status {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  height: var(--status-height);
  border-top: 4px solid var(--fg);
  background: var(--bg);
  font-size: 1.15rem;
  line-height: 1;
}

.status__cell {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border-right: 2px solid var(--fg);
  white-space: nowrap;
}

.status__cell:last-child {
  border-right: 0;
}

.status__section {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-transform: uppercase;
}

.status__text {
  overflow: hidden;
  text-overflow: ellipsis;
}

.status__track {
  width: 120px;
  height: 12px;
  padding: 2px;
  border: 2px solid var(--fg);
}

.status__fill {
  display: block;
  height: 100%;
}

@media (max-width: 720px) {
  .status__hint,
  .status__fps {
    display: none;
  }

  .status__track {
    width: 60px;
  }
}
</style>
