<script setup lang="ts">
defineProps<{ text: string; tag?: string }>()
</script>

<template>
  <component :is="tag ?? 'span'" class="glitch" :data-text="text">{{ text }}</component>
</template>

<style scoped>
.glitch {
  position: relative;
  display: inline-block;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  background: var(--bg);
  clip-path: inset(100% 0 0 0);
  pointer-events: none;
}

.glitch::before {
  animation: slice-a 5s steps(1) infinite;
}

.glitch::after {
  animation: slice-b 5s steps(1) infinite 0.05s;
}

.glitch:hover::before {
  animation-duration: 0.6s;
}

.glitch:hover::after {
  animation-duration: 0.5s;
}

@keyframes slice-a {
  0%, 88%, 100% { clip-path: inset(100% 0 0 0); transform: none; }
  89% { clip-path: inset(10% 0 70% 0); transform: translateX(-6px); }
  91% { clip-path: inset(55% 0 25% 0); transform: translateX(8px); }
  93% { clip-path: inset(30% 0 52% 0); transform: translateX(-3px); }
  95% { clip-path: inset(78% 0 6% 0); transform: translateX(5px); }
}

@keyframes slice-b {
  0%, 89%, 100% { clip-path: inset(100% 0 0 0); transform: none; }
  90% { clip-path: inset(62% 0 18% 0); transform: translateX(6px); filter: invert(1); }
  92% { clip-path: inset(5% 0 82% 0); transform: translateX(-8px); filter: none; }
  94% { clip-path: inset(40% 0 40% 0); transform: translateX(4px); }
  96% { clip-path: inset(85% 0 2% 0); transform: translateX(-5px); }
}
</style>
