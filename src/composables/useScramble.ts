import type { Directive } from 'vue'
import { prefersReducedMotion } from './useFx'

const GLYPHS = '█▓▒░<>/\\|=+*#%@$&01АБВГДЖЗЛФЦШЯ'
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

export function scramble(el: HTMLElement, text: string, duration = 650): void {
  if (prefersReducedMotion()) {
    el.textContent = text
    return
  }
  const start = performance.now()
  const frame = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const revealed = Math.floor(progress * text.length)
    let out = ''
    for (let i = 0; i < text.length; i++) {
      out += i < revealed || text[i] === ' ' ? text[i] : randomGlyph()
    }
    el.textContent = out
    if (progress < 1) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

const observer =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const el = entry.target as HTMLElement
            scramble(el, el.dataset.text ?? '')
            observer?.unobserve(el)
          }
        },
        { threshold: 0.6 },
      )
    : null

const onHover = (event: Event) => {
  const el = event.currentTarget as HTMLElement
  scramble(el, el.dataset.text ?? '', 400)
}

export const vScramble: Directive<HTMLElement, string> = {
  mounted(el, { value }) {
    el.dataset.text = value
    el.textContent = value
    el.addEventListener('mouseenter', onHover)
    observer?.observe(el)
  },
  updated(el, { value, oldValue }) {
    if (value === oldValue) return
    el.dataset.text = value
    el.textContent = value
  },
  unmounted(el) {
    el.removeEventListener('mouseenter', onHover)
    observer?.unobserve(el)
  },
}
