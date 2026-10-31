import { onBeforeUnmount, onMounted, ref } from 'vue'

/** Активный раздел и прогресс прокрутки страницы (0–1) */
export function useScrollSpy(ids: string[]) {
  const active = ref(ids[0] ?? '')
  const progress = ref(0)
  let frame = 0

  const update = () => {
    frame = 0
    const doc = document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(window.scrollY / max, 1) : 0

    const line = window.innerHeight * 0.4
    let current = ids[0] ?? ''
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top <= line) current = id
    }
    // В самом низу страницы активен последний раздел
    if (progress.value > 0.995) current = ids[ids.length - 1] ?? current
    active.value = current
  }

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return { active, progress }
}
