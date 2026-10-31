import { ref } from 'vue'

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

const glitchActive = ref(false)
const notice = ref('')
let glitchTimer: number | undefined
let noticeTimer: number | undefined

export function useFx() {
  const burst = (duration = 700) => {
    if (prefersReducedMotion()) return
    glitchActive.value = true
    clearTimeout(glitchTimer)
    glitchTimer = window.setTimeout(() => (glitchActive.value = false), duration)
  }

  const notify = (text: string, duration = 3500) => {
    notice.value = text
    clearTimeout(noticeTimer)
    noticeTimer = window.setTimeout(() => (notice.value = ''), duration)
  }

  return { glitchActive, notice, burst, notify }
}
