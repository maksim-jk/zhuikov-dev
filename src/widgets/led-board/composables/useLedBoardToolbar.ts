import { LedTool } from '../led-board.types'
import { createLedPng } from '../lib/led-export'
import { LED_CELL_COUNT } from '../lib/led-grid'

import type { LedToolOption } from '../led-board.types'

const COPIED_RESET_DELAY = 1800

const TOOL_OPTIONS: LedToolOption[] = [
  { id: LedTool.AUTO, labelKey: 'led.tools.auto', icon: '⇅' },
  { id: LedTool.DRAW, labelKey: 'led.tools.draw', icon: '●' },
  { id: LedTool.ERASE, labelKey: 'led.tools.erase', icon: '○' },
  { id: LedTool.PAN, labelKey: 'led.tools.pan', icon: '↔' },
]

export const useLedBoardToolbar = () => {
  const board = useLedBoard()
  const route = useRoute()
  const requestUrl = useRequestURL()
  const isCoarsePointer = useMediaQuery('(pointer: coarse)')
  const { copy, copied } = useClipboard({ copiedDuring: COPIED_RESET_DELAY, legacy: true })

  const downloadLink = ref<HTMLAnchorElement | null>(null)
  const downloadUrl = ref('')

  const releaseDownload = (): void => {
    if (!downloadUrl.value) return
    URL.revokeObjectURL(downloadUrl.value)
    downloadUrl.value = ''
  }

  const tools = computed(() =>
    TOOL_OPTIONS.filter(option => option.id !== LedTool.PAN || isCoarsePointer.value),
  )

  const litLabel = computed(() => `${board.litCount.value.toString().padStart(4, '0')} / ${LED_CELL_COUNT}`)

  const setTool = (value: LedTool): void => {
    board.setTool(value)
    track('led_tool', { tool: value })
  }

  const clear = (): void => {
    board.clear()
    track('led_clear')
  }

  const invert = (): void => {
    board.invert()
    track('led_invert')
  }

  const reset = (): void => {
    board.reset()
    track('led_reset')
  }

  const toggleLife = (): void => {
    board.toggleLife()
    track('led_life', { state: board.isLifeRunning.value ? 'on' : 'off' })
  }

  const share = async (): Promise<void> => {
    track('led_share')
    await copy(board.createShareUrl(requestUrl.origin, route.path))
  }

  const exportPng = async (): Promise<void> => {
    track('led_png')
    const blob = await createLedPng(board.getCells())
    releaseDownload()
    downloadUrl.value = URL.createObjectURL(blob)
    await nextTick()
    downloadLink.value?.click()
    window.setTimeout(releaseDownload, 1000)
  }

  onScopeDispose(releaseDownload)

  return {
    tools,
    tool: board.tool,
    isLifeRunning: board.isLifeRunning,
    litLabel,
    copied,
    downloadLink,
    downloadUrl,
    setTool,
    clear,
    invert,
    reset,
    toggleLife,
    share,
    exportPng,
  }
}
