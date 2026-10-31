<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { commandNames, commands, type OutputLine } from '../terminal/commands'
import { useTheme } from '../composables/useTheme'
import { useFx } from '../composables/useFx'

const { toggle: toggleTheme } = useTheme()
const { burst } = useFx()

const PROMPT = 'guest@resume:~$'

const input = ref('')
const lines = ref<OutputLine[]>([
  { text: 'DK-SHELL v1.0 — интерактивное резюме.', kind: 'muted' },
  { text: 'Введите help, чтобы увидеть список команд.', kind: 'muted' },
])
const history = ref<string[]>([])
let historyIndex = -1

const inputEl = ref<HTMLInputElement>()
const screenEl = ref<HTMLElement>()

const scrollToBottom = async () => {
  await nextTick()
  screenEl.value?.scrollTo({ top: screenEl.value.scrollHeight })
}

const execute = (raw: string) => {
  const trimmed = raw.trim()
  lines.value.push({ text: `${PROMPT} ${raw}`, kind: 'input' })
  if (!trimmed) return

  history.value.push(trimmed)
  const [name = '', ...args] = trimmed.split(/\s+/)
  const command = commands[name.toLowerCase()]

  if (!command) {
    lines.value.push({ text: `команда не найдена: ${name}. Введите help`, kind: 'error' })
    return
  }

  const output = command.run({
    args,
    history: history.value,
    clear: () => (lines.value = []),
    toggleTheme,
    glitch: () => burst(1200),
  })
  if (output) lines.value.push(...output)
}

const onSubmit = () => {
  execute(input.value)
  input.value = ''
  historyIndex = -1
  scrollToBottom()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    const matches = commandNames.filter((n) => !commands[n].hidden && n.startsWith(input.value.trim()))
    if (matches.length === 1) input.value = `${matches[0]} `
    else if (matches.length > 1) {
      lines.value.push({ text: matches.join('  '), kind: 'muted' })
      scrollToBottom()
    }
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    if (!history.value.length) return
    event.preventDefault()
    const last = history.value.length - 1
    if (event.key === 'ArrowUp') historyIndex = historyIndex < 0 ? last : Math.max(historyIndex - 1, 0)
    else historyIndex = historyIndex < 0 || historyIndex >= last ? -1 : historyIndex + 1
    input.value = historyIndex < 0 ? '' : history.value[historyIndex]
  } else if (event.key === 'l' && event.ctrlKey) {
    event.preventDefault()
    lines.value = []
  }
}

const run = (cmd: string) => {
  execute(cmd)
  scrollToBottom()
  inputEl.value?.focus({ preventScroll: true })
}

// Глобальные горячие клавиши: Ctrl/⌘+K или «/» — открыть терминал
const onGlobalKey = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null
  const typing = target?.closest('input, textarea, [contenteditable="true"]')
  const isShortcut = (event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)
  if (!isShortcut) return
  event.preventDefault()
  document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  inputEl.value?.focus({ preventScroll: true })
}

onMounted(() => window.addEventListener('keydown', onGlobalKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKey))

const quick = ['help', 'whoami', 'stack', 'contacts', 'sudo hire-me']
</script>

<template>
  <div class="window terminal" @click="inputEl?.focus({ preventScroll: true })">
    <div class="window__bar">
      <span class="window__title">dk-shell — bash</span>
      <span class="window__buttons" aria-hidden="true"><i /><i /></span>
    </div>
    <div ref="screenEl" class="terminal__screen" aria-live="polite">
      <p
        v-for="(item, i) in lines"
        :key="i"
        :class="['terminal__line', item.kind && `terminal__line--${item.kind}`]"
      >
        <a
          v-if="item.href"
          :href="item.href"
          :target="item.href.startsWith('http') ? '_blank' : undefined"
          rel="noopener noreferrer"
        >{{ item.text }}</a>
        <template v-else>{{ item.text }}</template>
      </p>
      <form class="terminal__prompt" @submit.prevent="onSubmit">
        <label for="terminal-input" class="terminal__ps1">{{ PROMPT }}</label>
        <input
          id="terminal-input"
          ref="inputEl"
          v-model="input"
          class="terminal__input"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          @keydown="onKeydown"
        />
      </form>
    </div>
    <div class="terminal__quick">
      <button v-for="cmd in quick" :key="cmd" type="button" @click.stop="run(cmd)">{{ cmd }}</button>
    </div>
  </div>
</template>

<style scoped>
.terminal {
  cursor: text;
}

.terminal__screen {
  height: 340px;
  padding: 16px 20px;
  overflow-y: auto;
  font-size: 1.3rem;
  line-height: 1.35;
  scrollbar-width: thin;
  scrollbar-color: var(--fg) transparent;
}

.terminal__line {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.terminal__line--input {
  margin-top: 8px;
}

.terminal__line--muted {
  color: var(--muted);
}

.terminal__line--error::before {
  content: '! ';
}

.terminal__line a {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.terminal__line a:hover {
  background: var(--fg);
  color: var(--bg);
}

.terminal__prompt {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.terminal__ps1 {
  flex-shrink: 0;
}

.terminal__input {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  caret-color: var(--fg);
  caret-shape: block;
}

.terminal__quick {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 20px 16px;
  border-top: 2px dashed var(--fg);
}

.terminal__quick button {
  padding: 2px 10px;
  border: 2px solid var(--fg);
  background: var(--bg);
  color: var(--fg);
  font: inherit;
  font-size: 1.1rem;
  cursor: pointer;
}

.terminal__quick button:hover {
  background: var(--fg);
  color: var(--bg);
}
</style>
