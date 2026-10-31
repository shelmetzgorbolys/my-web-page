<script setup lang="ts">
import { computed, ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import BootScreen from './components/BootScreen.vue'
import GlitchOverlay from './components/GlitchOverlay.vue'
import HeroSection from './components/HeroSection.vue'
import ResumeSection from './components/ResumeSection.vue'
import StatusBar from './components/StatusBar.vue'
import TerminalWindow from './components/TerminalWindow.vue'
import { prefersReducedMotion, useFx } from './composables/useFx'
import { useKonami } from './composables/useKonami'
import { useScrollSpy } from './composables/useScrollSpy'
import { resume } from './data/resume'
import { SOURCE_URL } from './terminal/commands'

const year = new Date().getFullYear()

const SECTIONS = {
  top: 'resume.txt',
  stack: 'Стек',
  achievements: 'Достижения',
  about: 'О себе',
  education: 'Образование',
  terminal: 'Терминал',
} as const

const BOOT_KEY = 'booted'
const booted = ref(prefersReducedMotion() || sessionStorage.getItem(BOOT_KEY) === '1')
const onBooted = () => {
  sessionStorage.setItem(BOOT_KEY, '1')
  booted.value = true
}

const { active, progress } = useScrollSpy(Object.keys(SECTIONS))
const sectionLabel = computed(() => SECTIONS[active.value as keyof typeof SECTIONS] ?? '')

const { burst, notify } = useFx()
useKonami(() => {
  burst(1600)
  notify('DEV MODE: ON')
})
</script>

<template>
  <BootScreen v-if="!booted" @done="onBooted" />
  <GlitchOverlay />

  <AppHeader :active="active" />

  <main>
    <HeroSection
      :name="resume.name"
      :role="resume.role"
      :location="resume.location"
      :tagline="resume.tagline"
      :contacts="resume.contacts"
      :started="booted"
    />

    <ResumeSection id="stack" index="01" title="Стек">
      <div class="stack">
        <div v-for="group in resume.stack" :key="group.title" class="stack__group">
          <h3 class="label">{{ group.title }}</h3>
          <ul class="chips">
            <li v-for="item in group.items" :key="item" class="chip">{{ item }}</li>
          </ul>
        </div>
      </div>
    </ResumeSection>

    <ResumeSection id="achievements" index="02" title="Достижения">
      <ol class="cards">
        <li v-for="(item, i) in resume.achievements" :key="item.title" class="window card">
          <div class="window__bar">
            <span class="window__title">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="window__buttons" aria-hidden="true"><i /><i /></span>
          </div>
          <div class="card__body">
            <h3 class="card__title">{{ item.title }}</h3>
            <p class="card__text">{{ item.text }}</p>
          </div>
        </li>
      </ol>
    </ResumeSection>

    <ResumeSection id="about" index="03" title="О себе">
      <div class="about">
        <p v-for="paragraph in resume.about" :key="paragraph">{{ paragraph }}</p>
      </div>
    </ResumeSection>

    <ResumeSection id="education" index="04" title="Образование">
      <div class="edu">
        <div class="edu__col">
          <h3 class="label">Высшее</h3>
          <ul class="timeline">
            <li v-for="item in resume.education" :key="item.degree" class="timeline__item">
              <span class="timeline__period">{{ item.period }}</span>
              <p class="timeline__degree">{{ item.degree }}</p>
              <p class="timeline__place">{{ item.place }}</p>
            </li>
          </ul>
        </div>
        <div class="edu__col">
          <h3 class="label">Дополнительное</h3>
          <ul class="timeline">
            <li v-for="item in resume.extraEducation" :key="item.degree" class="timeline__item">
              <span class="timeline__period">{{ item.period }}</span>
              <p class="timeline__degree">{{ item.degree }}</p>
              <p class="timeline__place">{{ item.place }}</p>
            </li>
          </ul>
        </div>
      </div>
    </ResumeSection>

    <ResumeSection id="terminal" index="05" title="Терминал">
      <p class="terminal-intro">
        Резюме можно изучить и через командную строку. Попробуйте <kbd>help</kbd>,
        а из любого места страницы терминал откроется по <kbd>Ctrl</kbd>+<kbd>K</kbd>.
      </p>
      <TerminalWindow />
    </ResumeSection>
  </main>

  <footer class="footer">
    <div class="footer__band dither" aria-hidden="true" />
    <div class="container footer__inner">
      <p>© {{ year }} {{ resume.name }} · Vue 3 + TypeScript + Vite</p>
      <a :href="SOURCE_URL" target="_blank" rel="noopener noreferrer">&lt;исходный код /&gt;</a>
    </div>
  </footer>

  <StatusBar :section="sectionLabel" :progress="progress" />
</template>

<style scoped>
.label {
  margin: 0 0 14px;
  font-family: var(--font-pixel);
  font-size: 0.6rem;
  font-weight: 400;
  line-height: 1.6;
  text-transform: uppercase;
  color: var(--muted);
}

.stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 32px 40px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  padding: 4px 12px;
  border: 2px solid var(--fg);
  font-size: 1.3rem;
  line-height: 1.3;
  cursor: default;
}

.chip:hover {
  background: var(--fg);
  color: var(--bg);
  animation: jitter 0.2s steps(2);
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  transition: transform 0.15s steps(2), box-shadow 0.15s steps(2);
}

.card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 9px 9px 0 var(--fg);
}

.card:hover .window__bar {
  animation: bar-flicker 0.3s steps(3);
}

@keyframes bar-flicker {
  33% { filter: invert(1); }
  66% { filter: none; transform: translateX(3px); }
}

.terminal-intro {
  max-width: 720px;
  margin: 0 0 24px;
  font-size: 1.4rem;
  line-height: 1.4;
  color: var(--muted);
}

kbd {
  padding: 0 6px;
  border: 2px solid var(--fg);
  box-shadow: 2px 2px 0 var(--fg);
  font: inherit;
  color: var(--fg);
}

.card__body {
  padding: 20px 22px 24px;
}

.card__title {
  margin: 0 0 10px;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.15;
}

.card__text {
  margin: 0;
  font-size: 1.3rem;
  line-height: 1.35;
  color: var(--muted);
}

.about {
  max-width: 760px;
  padding-left: 20px;
  border-left: 6px solid var(--fg);
}

.about p {
  margin: 0 0 16px;
  font-size: 1.4rem;
  line-height: 1.45;
  color: var(--muted);
}

.about p:first-child {
  font-size: 1.7rem;
  color: var(--fg);
}

.about p:last-child {
  margin-bottom: 0;
}

.edu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.timeline {
  margin: 0;
  padding: 0;
  list-style: none;
  border-left: 4px dotted var(--fg);
}

.timeline__item {
  position: relative;
  padding: 0 0 28px 24px;
}

.timeline__item:last-child {
  padding-bottom: 0;
}

.timeline__item::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 2px;
  width: 16px;
  height: 16px;
  background: var(--fg);
  box-shadow: inset 0 0 0 4px var(--fg), inset 0 0 0 8px var(--bg);
}

.timeline__period {
  font-family: var(--font-pixel);
  font-size: 0.6rem;
}

.timeline__degree {
  margin: 8px 0 4px;
  font-size: 1.45rem;
  font-weight: 500;
  line-height: 1.2;
}

.timeline__place {
  margin: 0;
  font-size: 1.3rem;
  color: var(--muted);
}

.footer {
  margin-top: 32px;
}

.footer__band {
  height: 24px;
  border-block: 4px solid var(--fg);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  padding-block: 24px 40px;
  font-size: 1.3rem;
}

.footer p {
  margin: 0;
}

.footer a:hover {
  background: var(--fg);
  color: var(--bg);
}

@media (max-width: 640px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
