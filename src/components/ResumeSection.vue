<script setup lang="ts">
import { vReveal } from '../composables/useReveal'
import { vScramble } from '../composables/useScramble'

defineProps<{
  id: string
  index: string
  title: string
}>()
</script>

<template>
  <section :id="id" v-reveal class="section container">
    <header class="section__head">
      <h2 class="section__title">
        <span class="section__index">[{{ index }}]</span> <span v-scramble="title" />
      </h2>
      <div class="section__rule dither" aria-hidden="true" />
    </header>
    <slot />
  </section>
</template>

<style scoped>
.section {
  padding-block: clamp(40px, 7vw, 64px);
  scroll-margin-top: 64px;
}

.section__head {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.section__title {
  margin: 0;
  font-family: var(--font-pixel);
  font-size: clamp(0.95rem, 2.8vw, 1.4rem);
  font-weight: 400;
  line-height: 1.5;
  text-transform: uppercase;
}

.section__index {
  color: var(--muted);
}

.section__rule {
  flex: 1;
  min-width: 40px;
  height: 12px;
  border: 2px solid var(--fg);
}
</style>
