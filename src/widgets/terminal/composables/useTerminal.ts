import { TerminalLineKind } from '../terminal.types'

import type { TerminalCommandHandler, TerminalLine } from '../terminal.types'

import {
  PROFILE_CV,
  PROFILE_EMAIL,
  PROFILE_EXPERIENCE,
  PROFILE_GITHUB,
  PROFILE_LINKEDIN,
  PROFILE_STACK,
  PROFILE_TELEGRAM,
} from '~/shared/constants'

const COMMANDS = [
  'help',
  'whoami',
  'stack',
  'experience',
  'contact',
  'cv ru',
  'cv en',
  'led clear',
  'led invert',
  'led reset',
  'led life',
  'lang en',
  'lang ru',
  'clear',
]

export const useTerminal = () => {
  const { t, tm, rt, locale } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const board = useLedBoard()

  const input = ref<HTMLInputElement | null>(null)
  const { focused } = useFocus(input)
  const command = ref('')
  const lines = ref<TerminalLine[]>([])
  const history: string[] = []
  let historyIndex = -1
  let lineId = 0

  const print = (text: string | string[], kind: TerminalLineKind = TerminalLineKind.OUTPUT): void => {
    const items = Array.isArray(text) ? text : [text]
    lines.value.push(...items.map(item => ({ id: lineId++, kind, text: item })))
  }

  const printMessages = (key: string): void => {
    print((tm(key) as unknown as string[]).map(item => rt(item)))
  }

  const runLed = (action: string | undefined): void => {
    const actions: Record<string, () => void> = {
      clear: board.clear,
      invert: board.invert,
      reset: board.reset,
      life: board.startLife,
    }
    const run = action ? actions[action] : undefined
    if (!run) {
      print(t('terminal.not-found', { cmd: `led ${action ?? ''}`.trim() }), TerminalLineKind.ERROR)
      return
    }
    run()
    print(t('terminal.led-done'), TerminalLineKind.ACCENT)
  }

  const runLang = async (code: string | undefined): Promise<void> => {
    if (code !== 'ru' && code !== 'en') {
      print(t('terminal.not-found', { cmd: `lang ${code ?? ''}`.trim() }), TerminalLineKind.ERROR)
      return
    }
    print(t('terminal.lang-done'), TerminalLineKind.ACCENT)
    if (code !== locale.value) await navigateTo(`${switchLocalePath(code)}#terminal`)
  }

  const runCv = async (code: string | undefined): Promise<void> => {
    const file = PROFILE_CV.find(item => item.lang === (code ?? locale.value))
    if (!file) {
      print(t('terminal.not-found', { cmd: `cv ${code ?? ''}`.trim() }), TerminalLineKind.ERROR)
      return
    }
    const href = publicPath(file.href)
    const fileName = href.split('/').pop() ?? href
    track('cv_download', { language: file.lang, file_name: fileName })
    print(`→ ${href}`, TerminalLineKind.ACCENT)
    await navigateTo(href, { external: true, open: { target: '_blank' } })
  }

  const handlers: Record<string, TerminalCommandHandler> = {
    help: () => printMessages('terminal.help'),
    whoami: () => printMessages('terminal.whoami'),
    stack: () => print(PROFILE_STACK.join(' · ')),
    experience: () => print(PROFILE_EXPERIENCE.map(item =>
      `${item.start} → ${item.end ?? t('experience.present')}  ${item.company.padEnd(14)} ${t(`experience.items.${item.id}.role`)}`,
    )),
    contact: () => print([`email     ${PROFILE_EMAIL}`, `telegram  ${PROFILE_TELEGRAM}`, `linkedin  ${PROFILE_LINKEDIN}`, `github    ${PROFILE_GITHUB}`]),
    cv: ([code]) => runCv(code),
    led: ([action]) => runLed(action),
    lang: ([code]) => runLang(code),
    clear: () => {
      lines.value = []
    },
    sudo: () => print('nice try 🙂', TerminalLineKind.ERROR),
  }

  const submit = (): void => {
    const value = command.value.trim()
    command.value = ''
    historyIndex = -1
    if (!value) return

    print(value, TerminalLineKind.INPUT)
    history.unshift(value)

    const [name = '', ...args] = value.toLowerCase().split(/\s+/)
    track('terminal_command', { command: name })
    const handler = handlers[name]
    if (handler) handler(args)
    else print(t('terminal.not-found', { cmd: name }), TerminalLineKind.ERROR)
  }

  const browseHistory = (direction: 1 | -1): void => {
    if (!history.length) return
    historyIndex = Math.min(history.length - 1, Math.max(-1, historyIndex + direction))
    command.value = historyIndex === -1 ? '' : history[historyIndex] ?? ''
  }

  const autocomplete = (): void => {
    const value = command.value.trimStart().toLowerCase()
    if (!value) return
    const match = COMMANDS.find(item => item.startsWith(value))
    if (match) command.value = match
  }

  const onKeydown = (event: KeyboardEvent): void => {
    const actions: Record<string, () => void> = {
      Enter: submit,
      ArrowUp: () => browseHistory(1),
      ArrowDown: () => browseHistory(-1),
      Tab: autocomplete,
    }
    const action = actions[event.key]
    if (!action) return
    event.preventDefault()
    action()
  }

  const focusInput = (): void => {
    focused.value = true
  }

  const runSuggestion = (value: string): void => {
    command.value = value
    submit()
  }

  print(t('terminal.welcome'), TerminalLineKind.ACCENT)

  return {
    input,
    command,
    lines,
    suggestions: ['help', 'whoami', 'cv', 'led life'],
    onKeydown,
    focusInput,
    runSuggestion,
  }
}
