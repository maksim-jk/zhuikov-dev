import { LED_CELL_COUNT, LED_COLS, LED_ROWS } from '../lib/led-grid'
import { LED_PALETTE } from '../lib/led-palette'
import { createLedSprites, LED_FRAME_COUNT } from '../lib/led-sprites'

import type { LedAnimation, LedBoardChange, LedCellPoint, LedRendererTargets } from '../led-board.types'

const MIN_CELL_SIZE = 8
const ANIMATION_DURATION = 160
const SWEEP_DELAY_PER_COL = 5

const easeOutBack = (t: number): number => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
}

export const useLedRenderer = ({ canvas, glow, viewport }: LedRendererTargets) => {
  const board = useLedBoard()
  const { pixelRatio } = useDevicePixelRatio()

  const viewportWidth = ref(0)
  const cellSize = computed(() => Math.max(MIN_CELL_SIZE, viewportWidth.value / LED_COLS))
  const isScrollable = computed(() => cellSize.value * LED_COLS > viewportWidth.value + 1)
  const canvasStyle = computed(() => ({
    width: `${cellSize.value * LED_COLS}px`,
    height: `${cellSize.value * LED_ROWS}px`,
  }))

  const progress = new Float32Array(LED_CELL_COUNT)
  const animations = new Map<number, LedAnimation>()
  let sprites: OffscreenCanvas[] = []
  let ctx: CanvasRenderingContext2D | null = null
  let glowCtx: CanvasRenderingContext2D | null = null
  let glowImage: ImageData | null = null
  let cellPx = 0

  const drawCell = (index: number): void => {
    if (!ctx) return
    const col = index % LED_COLS
    const row = (index - col) / LED_COLS
    const x = Math.round(col * cellPx)
    const y = Math.round(row * cellPx)
    const frame = Math.round(Math.min(1, Math.max(0, progress[index]!)) * (LED_FRAME_COUNT - 1))
    const sprite = sprites[frame]
    if (!sprite) return
    ctx.drawImage(sprite, x, y, Math.round((col + 1) * cellPx) - x, Math.round((row + 1) * cellPx) - y)
  }

  const drawAll = (): void => {
    for (let i = 0; i < LED_CELL_COUNT; i++) drawCell(i)
  }

  const drawGlow = (): void => {
    if (!glowCtx || !glowImage) return
    const cells = board.getCells()
    const [r, g, b] = LED_PALETTE.glowRgb
    const data = glowImage.data
    for (let i = 0; i < LED_CELL_COUNT; i++) {
      const offset = i * 4
      data[offset] = r
      data[offset + 1] = g
      data[offset + 2] = b
      data[offset + 3] = cells[i] ? 255 : 0
    }
    glowCtx.putImageData(glowImage, 0, 0)
  }

  const tick = (): void => {
    const now = performance.now()
    for (const [index, animation] of animations) {
      const elapsed = now - animation.start
      if (elapsed < 0) continue
      const t = Math.min(1, elapsed / ANIMATION_DURATION)
      progress[index] = animation.from + (animation.to - animation.from) * easeOutBack(t)
      drawCell(index)
      if (t >= 1) animations.delete(index)
    }
    if (!animations.size) loop.pause()
  }

  const loop = useRafFn(tick, { immediate: false })

  const animate = (indices: Iterable<number>, sweep: boolean): void => {
    const cells = board.getCells()
    const now = performance.now()
    for (const index of indices) {
      const target = cells[index]!
      const current = animations.get(index)
      if (!current && progress[index] === target) continue
      animations.set(index, {
        from: progress[index]!,
        to: target,
        start: sweep ? now + (index % LED_COLS) * SWEEP_DELAY_PER_COL : now,
      })
    }
    if (animations.size) loop.resume()
  }

  const snap = (): void => {
    progress.set(board.getCells())
    animations.clear()
    drawAll()
  }

  const setup = (): void => {
    const target = canvas.value
    const glowTarget = glow.value
    if (!target || !glowTarget) return

    cellPx = cellSize.value * pixelRatio.value
    target.width = Math.round(cellPx * LED_COLS)
    target.height = Math.round(cellPx * LED_ROWS)
    ctx = target.getContext('2d')
    sprites = createLedSprites(cellPx)

    glowTarget.width = LED_COLS
    glowTarget.height = LED_ROWS
    glowCtx = glowTarget.getContext('2d')
    glowImage = glowCtx?.createImageData(LED_COLS, LED_ROWS) ?? null

    drawAll()
    drawGlow()
  }

  useResizeObserver(viewport, ([entry]: ResizeObserverEntry[]) => {
    const width = entry?.contentRect.width ?? 0
    if (Math.abs(width - viewportWidth.value) < 1) return
    viewportWidth.value = width
    nextTick(setup)
  })

  board.onChange(({ indices }: LedBoardChange) => {
    drawGlow()
    if (indices) {
      animate(indices, false)
      return
    }
    if (board.isLifeRunning.value) {
      snap()
      return
    }
    animate(Array.from({ length: LED_CELL_COUNT }, (_, i) => i), true)
  })

  const pointToCell = (event: PointerEvent): LedCellPoint => ({
    col: Math.min(LED_COLS - 1, Math.max(0, Math.floor(event.offsetX / cellSize.value))),
    row: Math.min(LED_ROWS - 1, Math.max(0, Math.floor(event.offsetY / cellSize.value))),
  })

  const toDataUrl = (): string => canvas.value?.toDataURL('image/png') ?? ''

  return {
    cellSize,
    canvasStyle,
    isScrollable,
    pointToCell,
    toDataUrl,
  }
}
