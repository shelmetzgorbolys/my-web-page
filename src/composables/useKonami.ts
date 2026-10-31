import { onBeforeUnmount, onMounted } from 'vue'

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA',
]

/** Пасхалка: ↑ ↑ ↓ ↓ ← → ← → B A */
export function useKonami(callback: () => void) {
  let position = 0

  const onKey = (event: KeyboardEvent) => {
    position = event.code === SEQUENCE[position] ? position + 1 : event.code === SEQUENCE[0] ? 1 : 0
    if (position === SEQUENCE.length) {
      position = 0
      callback()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
}
