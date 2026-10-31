import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const theme = ref<Theme>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

watch(theme, (value) => {
  document.documentElement.dataset.theme = value
  try {
    localStorage.setItem('theme', value)
  } catch {
    // localStorage может быть недоступен (приватный режим) — тема просто не сохранится
  }
})

export function useTheme() {
  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggle }
}
