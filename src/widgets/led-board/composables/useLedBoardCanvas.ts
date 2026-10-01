import { LedTool } from '../led-board.types'

export const useLedBoardCanvas = () => {
  const canvas = ref<HTMLCanvasElement | null>(null)
  const glow = ref<HTMLCanvasElement | null>(null)
  const viewport = ref<HTMLElement | null>(null)

  const board = useLedBoard()
  const { canvasStyle, isScrollable, pointToCell } = useLedRenderer({ canvas, glow, viewport })

  const isPanMode = computed(() => board.tool.value === LedTool.PAN)

  const onPointerDown = (event: PointerEvent): void => {
    if (isPanMode.value || event.button > 0) return
    board.stopLife()
    board.startStroke(pointToCell(event))
  }

  const onPointerMove = (event: PointerEvent): void => {
    if (isPanMode.value || !event.buttons) return
    board.moveStroke(pointToCell(event))
  }

  useEventListener('pointerup', board.endStroke)
  useEventListener('pointercancel', board.endStroke)

  useReveal(viewport, board.load)

  return {
    canvas,
    glow,
    viewport,
    canvasStyle,
    isScrollable,
    isPanMode,
    onPointerDown,
    onPointerMove,
  }
}
