<script setup lang="ts">
import { computed } from 'vue'

// Иконка задаётся строками: '#' — закрашенный пиксель, '.' — пустой
const props = defineProps<{ rows: string[] }>()

const pixels = computed(() =>
  props.rows.flatMap((row, y) =>
    [...row].flatMap((cell, x) => (cell === '#' ? [{ x, y }] : [])),
  ),
)
</script>

<template>
  <svg
    :viewBox="`0 0 ${rows[0].length} ${rows.length}`"
    shape-rendering="crispEdges"
    aria-hidden="true"
  >
    <rect v-for="p in pixels" :key="`${p.x}-${p.y}`" :x="p.x" :y="p.y" width="1" height="1" />
  </svg>
</template>

<style scoped>
svg {
  display: block;
  fill: currentColor;
}
</style>
