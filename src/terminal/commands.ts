import { resume } from '../data/resume'

export interface OutputLine {
  text: string
  href?: string
  kind?: 'input' | 'error' | 'muted'
}

export interface TerminalContext {
  args: string[]
  history: readonly string[]
  clear: () => void
  toggleTheme: () => void
  glitch: () => void
}

export interface Command {
  description: string
  hidden?: boolean
  run: (ctx: TerminalContext) => OutputLine[] | void
}

const line = (text: string, extra: Omit<OutputLine, 'text'> = {}): OutputLine => ({ text, ...extra })

export const commands: Record<string, Command> = {
  help: {
    description: 'список команд',
    run: () => [
      ...Object.entries(commands)
        .filter(([, cmd]) => !cmd.hidden)
        .map(([name, cmd]) => line(`${name} — ${cmd.description}`)),
      line('Tab — автодополнение, ↑/↓ — история, Ctrl+L — очистить', { kind: 'muted' }),
    ],
  },
  whoami: {
    description: 'кто я',
    run: () => [line(`${resume.name} — ${resume.role} (${resume.location})`)],
  },
  about: {
    description: 'о себе',
    run: () => resume.about.map((text) => line(text)),
  },
  stack: {
    description: 'технологии',
    run: () => resume.stack.map((g) => line(`${g.title}: ${g.items.join(', ')}`)),
  },
  experience: {
    description: 'ключевые достижения',
    run: () => resume.achievements.map((a, i) => line(`[${i + 1}] ${a.title}. ${a.text}`)),
  },
  education: {
    description: 'образование',
    run: () =>
      [...resume.education, ...resume.extraEducation].map((e) =>
        line(`${e.period} · ${e.degree}, ${e.place}`),
      ),
  },
  contacts: {
    description: 'как связаться',
    run: () => resume.contacts.map((c) => line(`${c.label}: ${c.value}`, { href: c.href })),
  },
  theme: {
    description: 'сменить тему',
    run: (ctx) => {
      ctx.toggleTheme()
      return [line('Тема переключена.', { kind: 'muted' })]
    },
  },
  glitch: {
    description: 'сломать реальность',
    run: (ctx) => {
      ctx.glitch()
      return [line('Сигнал потерян... сигнал восстановлен.', { kind: 'muted' })]
    },
  },
  date: {
    description: 'текущая дата',
    run: () => [line(new Date().toLocaleString('ru-RU'))],
  },
  echo: {
    description: 'повторить текст',
    run: (ctx) => [line(ctx.args.join(' '))],
  },
  history: {
    description: 'история команд',
    run: (ctx) => ctx.history.map((cmd, i) => line(`${i + 1}. ${cmd}`)),
  },
  clear: {
    description: 'очистить экран',
    run: (ctx) => ctx.clear(),
  },
  sudo: {
    description: '',
    hidden: true,
    run: (ctx) =>
      ctx.args.join(' ') === 'hire-me'
        ? [
            line('[sudo] пароль для recruiter: ********', { kind: 'muted' }),
            line('Доступ разрешён. Оффер можно отправить сюда:'),
            ...resume.contacts.map((c) => line(`  ${c.value}`, { href: c.href })),
          ]
        : [line('recruiter не входит в список sudoers. Попробуйте: sudo hire-me', { kind: 'error' })],
  },
}

export const commandNames = Object.keys(commands)
