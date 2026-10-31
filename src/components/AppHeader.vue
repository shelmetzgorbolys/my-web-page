<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import PixelIcon from './PixelIcon.vue'

defineProps<{ active: string }>()

const { theme, toggle } = useTheme()

const links = [
  { href: '#stack', label: 'Стек' },
  { href: '#achievements', label: 'Опыт' },
  { href: '#about', label: 'О себе' },
  { href: '#education', label: 'Образование' },
  { href: '#terminal', label: 'Терминал' },
]

const sun = [
  '....#....',
  '.#.....#.',
  '...###...',
  '..#####..',
  '#.#####.#',
  '..#####..',
  '...###...',
  '.#.....#.',
  '....#....',
]

const moon = [
  '..####...',
  '.###.....',
  '###......',
  '###......',
  '###......',
  '###......',
  '###......',
  '.###.....',
  '..####...',
]
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <a href="#top" class="header__logo">Резюме<span class="header__cursor">_</span></a>
      <nav class="header__nav" aria-label="Разделы">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          :class="{ 'is-active': link.href === `#${active}` }"
          :aria-current="link.href === `#${active}` ? 'true' : undefined"
        >{{ link.label }}</a>
      </nav>
      <button
        class="header__theme"
        type="button"
        :aria-label="theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'"
        @click="toggle"
      >
        <PixelIcon :rows="theme === 'dark' ? sun : moon" class="header__icon" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg);
  border-bottom: 4px solid var(--fg);
}

.header__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 64px;
}

.header__logo {
  font-family: var(--font-pixel);
  font-size: 0.9rem;
  text-transform: uppercase;
}

.header__cursor {
  animation: blink 1s steps(1) infinite;
}

.header__nav {
  display: flex;
  gap: 4px;
  margin-left: auto;
  font-size: 1.3rem;
}

.header__nav a {
  padding: 4px 10px;
}

.header__nav a.is-active {
  box-shadow: inset 0 -4px 0 var(--fg);
}

.header__nav a:hover {
  background: var(--fg);
  color: var(--bg);
}

.header__theme {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 3px solid var(--fg);
  background: var(--bg);
  color: var(--fg);
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--fg);
}

.header__theme:hover {
  background: var(--fg);
  color: var(--bg);
}

.header__theme:active {
  transform: translate(3px, 3px);
  box-shadow: none;
}

.header__icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 720px) {
  .header__nav {
    display: none;
  }

  .header__theme {
    margin-left: auto;
  }
}
</style>
