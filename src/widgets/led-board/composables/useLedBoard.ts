import { LedTool } from '../led-board.types'
import { decodeCells, encodeCells } from '../lib/bitset'
import {
  LED_CELL_COUNT,
  LED_COLS,
  LED_HASH_KEY,
  LED_ROWS,
  LED_STORAGE_KEY,
  stepLife,
  toIndex,
  traceLine,
} from '../lib/led-grid'
import { DEFAULT_PRESET } from '../model/default-preset'

import type { LedBoardChange, LedCellPoint } from '../led-board.types'

const PERSIST_DELAY = 400
const LIFE_INTERVAL = 110

const readHashPreset = (hash: string): Uint8Array | null => {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const value = params.get(LED_HASH_KEY)
  return value ? decodeCells(value, LED_CELL_COUNT) : null
}

const createDefaultCells = (): Uint8Array =>
  decodeCells(DEFAULT_PRESET, LED_CELL_COUNT) ?? new Uint8Array(LED_CELL_COUNT)

const countLit = (cells: Uint8Array): number => cells.reduce((sum, value) => sum + value, 0)

const useLedBoardState = () => {
  const route = useRoute()
  const storage = useLocalStorage(LED_STORAGE_KEY, '')
  const changeHook = createEventHook<LedBoardChange>()

  let cells = createDefaultCells()
  const litCount = ref(countLit(cells))
  const tool = ref<LedTool>(LedTool.AUTO)
  const isLifeRunning = ref(false)

  let strokeValue: 0 | 1 = 1
  let lastPoint: LedCellPoint | null = null

  const persist = useDebounceFn(() => {
    storage.value = encodeCells(cells)
  }, PERSIST_DELAY)

  const replaceCells = (next: Uint8Array, shouldPersist = true): void => {
    cells = next
    litCount.value = countLit(cells)
    changeHook.trigger({ indices: null })
    if (shouldPersist) persist()
  }

  const load = (): void => {
    const fromHash = readHashPreset(route.hash)
    const fromStorage = storage.value ? decodeCells(storage.value, LED_CELL_COUNT) : null
    replaceCells(fromHash ?? fromStorage ?? createDefaultCells(), Boolean(fromHash))
  }

  const getCells = (): Uint8Array => cells

  const setCells = (points: LedCellPoint[], value: 0 | 1): void => {
    const changed: number[] = []
    for (const { col, row } of points) {
      if (col < 0 || col >= LED_COLS || row < 0 || row >= LED_ROWS) continue
      const index = toIndex(col, row)
      if (cells[index] === value) continue
      cells[index] = value
      changed.push(index)
    }
    if (!changed.length) return
    litCount.value += value ? changed.length : -changed.length
    changeHook.trigger({ indices: changed })
    persist()
  }

  const startStroke = (point: LedCellPoint): void => {
    if (tool.value === LedTool.PAN) return
    if (tool.value === LedTool.DRAW) strokeValue = 1
    else if (tool.value === LedTool.ERASE) strokeValue = 0
    else strokeValue = cells[toIndex(point.col, point.row)] ? 0 : 1
    lastPoint = point
    setCells([point], strokeValue)
  }

  const moveStroke = (point: LedCellPoint): void => {
    if (!lastPoint) return
    if (point.col === lastPoint.col && point.row === lastPoint.row) return
    setCells(traceLine(lastPoint, point), strokeValue)
    lastPoint = point
  }

  const endStroke = (): void => {
    lastPoint = null
  }

  const lifeLoop = useIntervalFn(() => {
    replaceCells(stepLife(cells))
  }, LIFE_INTERVAL, { immediate: false })

  const stopLife = (): void => {
    lifeLoop.pause()
    isLifeRunning.value = false
  }

  const startLife = (): void => {
    lifeLoop.resume()
    isLifeRunning.value = true
  }

  const toggleLife = (): void => {
    if (isLifeRunning.value) stopLife()
    else startLife()
  }

  const clear = (): void => {
    stopLife()
    replaceCells(new Uint8Array(LED_CELL_COUNT))
  }

  const invert = (): void => {
    replaceCells(cells.map(value => (value ? 0 : 1)))
  }

  const reset = (): void => {
    stopLife()
    replaceCells(createDefaultCells())
  }

  const setTool = (value: LedTool): void => {
    tool.value = value
  }

  const createShareUrl = (origin: string, path: string): string =>
    `${origin}${path}#${LED_HASH_KEY}=${encodeCells(cells)}`

  return {
    tool,
    litCount,
    isLifeRunning,
    onChange: changeHook.on,
    load,
    getCells,
    startStroke,
    moveStroke,
    endStroke,
    toggleLife,
    startLife,
    stopLife,
    clear,
    invert,
    reset,
    setTool,
    createShareUrl,
  }
}

export const useLedBoard = createSharedComposable(useLedBoardState)
