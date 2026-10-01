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

  const share = async (): Promise<void> => {
    await copy(board.createShareUrl(requestUrl.origin, route.path))
  }

  const exportPng = async (): Promise<void> => {
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
    setTool: board.setTool,
    clear: board.clear,
    invert: board.invert,
    reset: board.reset,
    toggleLife: board.toggleLife,
    share,
    exportPng,
  }
}
