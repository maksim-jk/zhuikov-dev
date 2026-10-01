import type { LedCellPoint } from '../led-board.types'

export const LED_COLS = 128

export const LED_ROWS = 72

export const LED_CELL_COUNT = LED_COLS * LED_ROWS

export const LED_STORAGE_KEY = 'led-board:v1'

export const LED_HASH_KEY = 'led'

export const toIndex = (col: number, row: number): number => row * LED_COLS + col

export const traceLine = (from: LedCellPoint, to: LedCellPoint): LedCellPoint[] => {
  const points: LedCellPoint[] = []
  let { col, row } = from
  const dx = Math.abs(to.col - col)
  const dy = -Math.abs(to.row - row)
  const sx = col < to.col ? 1 : -1
  const sy = row < to.row ? 1 : -1
  let error = dx + dy

  while (true) {
    points.push({ col, row })
    if (col === to.col && row === to.row) break
    const doubled = 2 * error
    if (doubled >= dy) {
      error += dy
      col += sx
    }
    if (doubled <= dx) {
      error += dx
      row += sy
    }
  }
  return points
}

export const stepLife = (cells: Uint8Array): Uint8Array => {
  const next = new Uint8Array(cells.length)
  for (let row = 0; row < LED_ROWS; row++) {
    for (let col = 0; col < LED_COLS; col++) {
      let neighbours = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue
          const c = (col + dx + LED_COLS) % LED_COLS
          const r = (row + dy + LED_ROWS) % LED_ROWS
          neighbours += cells[toIndex(c, r)]!
        }
      }
      const alive = cells[toIndex(col, row)]
      next[toIndex(col, row)] = neighbours === 3 || (alive && neighbours === 2) ? 1 : 0
    }
  }
  return next
}
