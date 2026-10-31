import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { prefersReducedMotion } from './useFx'

export function useTypewriter(text: string, start: Ref<boolean>, speed = 32) {
  const output = ref('')
  const done = ref(false)
  let timer: number | undefined

  const run = () => {
    if (prefersReducedMotion()) {
      output.value = text
      done.value = true
      return
    }
    let i = 0
    const tick = () => {
      output.value = text.slice(0, ++i)
      if (i < text.length) timer = window.setTimeout(tick, speed + Math.random() * speed)
      else done.value = true
    }
    tick()
  }

  watch(start, (value) => value && run(), { immediate: true })
  onBeforeUnmount(() => clearTimeout(timer))

  return { output, done }
}
