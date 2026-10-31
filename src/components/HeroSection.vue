<script setup lang="ts">
import { toRef } from 'vue'
import type { ContactLink } from '../data/resume'
import { useTypewriter } from '../composables/useTypewriter'
import GlitchText from './GlitchText.vue'

const props = defineProps<{
  name: string
  role: string
  location: string
  tagline: string
  contacts: ContactLink[]
  started: boolean
}>()

const roleLine = `> ${props.role} · Vue 3 / TypeScript`
const { output, done } = useTypewriter(roleLine, toRef(props, 'started'))
</script>

<template>
  <section id="top" class="hero container">
    <div class="window hero__window">
      <div class="window__bar">
        <span class="window__title">resume.txt</span>
        <span class="window__buttons" aria-hidden="true"><i /><i /></span>
      </div>
      <div class="window__body">
        <p class="hero__status">
          <span class="hero__block" aria-hidden="true" />
          Открыт к предложениям · {{ location }}
        </p>
        <h1 class="hero__name"><GlitchText :text="name" /></h1>
        <p class="hero__role" :aria-label="roleLine">
          <span class="hero__ghost" aria-hidden="true">{{ roleLine }}</span>
          <span class="hero__typed" aria-hidden="true">{{ output }}<span v-if="!done" class="hero__caret" /></span>
        </p>
        <div :class="['hero__rest', { 'is-shown': done }]">
          <p class="hero__tagline">{{ tagline }}</p>
          <div class="hero__actions">
            <a
              v-for="(contact, index) in contacts"
              :key="contact.href"
              :href="contact.href"
              :class="['btn', { 'btn--primary': index === 0 }]"
              :target="contact.href.startsWith('http') ? '_blank' : undefined"
              :rel="contact.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            >
              <span class="btn__label">{{ contact.label }}</span>
              {{ contact.value }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: clamp(48px, 9vw, 96px);
  padding-bottom: clamp(48px, 8vw, 80px);
}

.hero__window {
  animation: power-on 0.6s steps(6) both;
}

.window__body {
  padding: clamp(24px, 5vw, 48px);
}

.hero__status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 4px 12px;
  border: 2px solid var(--fg);
  font-size: 1.2rem;
  line-height: 1.2;
}

.hero__block {
  width: 10px;
  height: 16px;
  background: var(--fg);
  animation: blink 1s steps(1) infinite;
}

.hero__name {
  margin: 32px 0 0;
  font-family: var(--font-pixel);
  font-size: clamp(1.25rem, 5.4vw, 3rem);
  font-weight: 400;
  line-height: 1.3;
  text-transform: uppercase;
  text-shadow: 4px 4px 0 var(--shade);
}

.hero__role {
  display: grid;
  margin: 20px 0 0;
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  line-height: 1.3;
}

/* Невидимая копия держит место, чтобы вёрстка не прыгала во время печати */
.hero__ghost,
.hero__typed {
  grid-area: 1 / 1;
}

.hero__ghost {
  visibility: hidden;
}

.hero__caret {
  display: inline-block;
  width: 0.5em;
  height: 1em;
  margin-left: 2px;
  vertical-align: -0.12em;
  background: var(--fg);
}

.hero__rest {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s steps(4), transform 0.4s steps(4);
}

.hero__rest.is-shown {
  opacity: 1;
  transform: none;
}

.hero__tagline {
  max-width: 660px;
  margin: 20px 0 0;
  font-size: 1.35rem;
  line-height: 1.45;
  color: var(--muted);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 36px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  border: 3px solid var(--fg);
  background: var(--bg);
  font-size: 1.3rem;
  line-height: 1.1;
  box-shadow: 4px 4px 0 var(--fg);
}

.btn--primary {
  background: var(--fg);
  color: var(--bg);
}

.btn:hover {
  background: var(--fg);
  color: var(--bg);
  animation: jitter 0.25s steps(2);
}

.btn--primary:hover {
  background: var(--bg);
  color: var(--fg);
}

.btn:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}

.btn__label {
  font-family: var(--font-pixel);
  font-size: 0.55rem;
  text-transform: uppercase;
}

@keyframes power-on {
  0% { clip-path: inset(50% 0 50% 0); }
  40% { clip-path: inset(49% 0 49% 0); }
  100% { clip-path: inset(-20px); }
}
</style>
