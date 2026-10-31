<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, version } from 'vue'

const emit = defineEmits<{ done: [] }>()

const LINES = [
  'DK-BIOS (C) 2026 · Voronezh Systems',
  'CPU: Frontend Core @ 3.5 GHz ............ OK',
  'Проверка памяти: 640K ................... OK',
  `Загрузка модулей: vue@${version}, typescript ... OK`,
  'Подключение GraphQL ..................... OK',
  'Монтирование компонентов ................ OK',
]

const shown = ref(0)
const percent = ref(0)
const leaving = ref(false)
let timer: number | undefined

const finish = () => {
  if (leaving.value) return
  clearTimeout(timer)
  leaving.value = true
  window.setTimeout(() => emit('done'), 350)
}

const step = () => {
  if (shown.value < LINES.length) {
    shown.value++
    timer = window.setTimeout(step, 150 + Math.random() * 120)
  } else if (percent.value < 100) {
    percent.value = Math.min(100, percent.value + 8 + Math.floor(Math.random() * 14))
    timer = window.setTimeout(step, 45)
  } else {
    timer = window.setTimeout(finish, 250)
  }
}

const onKey = (event: KeyboardEvent) => {
  event.preventDefault()
  finish()
}

onMounted(() => {
  step()
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div :class="['boot', { 'boot--leaving': leaving }]" role="status" aria-label="Загрузка" @click="finish">
    <div class="boot__inner">
      <p v-for="text in LINES.slice(0, shown)" :key="text" class="boot__line">{{ text }}</p>
      <div v-if="shown === LINES.length" class="boot__progress">
        <div class="boot__bar"><div class="boot__fill dither" :style="{ width: `${percent}%` }" /></div>
        <span>{{ String(percent).padStart(3, '0') }}%</span>
      </div>
      <p class="boot__hint">Нажмите любую клавишу, чтобы пропустить_</p>
    </div>
  </div>
</template>

<style scoped>
.boot {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--bg);
  font-size: 1.35rem;
  cursor: pointer;
}

.boot--leaving {
  animation: boot-out 0.35s steps(5) forwards;
}

.boot__inner {
  width: min(640px, 100%);
}

.boot__line {
  margin: 0 0 6px;
  white-space: pre-wrap;
}

.boot__progress {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
}

.boot__bar {
  flex: 1;
  height: 22px;
  padding: 3px;
  border: 3px solid var(--fg);
}

.boot__fill {
  height: 100%;
}

.boot__hint {
  margin: 28px 0 0;
  color: var(--muted);
  animation: blink 1.2s steps(1) infinite;
}

@keyframes boot-out {
  0% { clip-path: inset(0); }
  100% { clip-path: inset(50% 0 50% 0); }
}
</style>
