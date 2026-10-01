import { LED_CELL_COUNT, LED_COLS, LED_ROWS } from './led-grid'
import { LED_PALETTE } from './led-palette'

const EXPORT_CELL = 12

export const createLedPng = (cells: Uint8Array): Promise<Blob> => {
  const canvas = new OffscreenCanvas(LED_COLS * EXPORT_CELL, LED_ROWS * EXPORT_CELL)
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.reject(new Error('2d context is unavailable'))

  ctx.fillStyle = LED_PALETTE.housing
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const radius = EXPORT_CELL * 0.36
  for (let i = 0; i < LED_CELL_COUNT; i++) {
    const col = i % LED_COLS
    const row = (i - col) / LED_COLS
    ctx.fillStyle = cells[i] ? LED_PALETTE.led : LED_PALETTE.ledOff
    ctx.shadowColor = cells[i] ? LED_PALETTE.ledGlow : 'transparent'
    ctx.shadowBlur = cells[i] ? EXPORT_CELL * 0.8 : 0
    ctx.beginPath()
    ctx.arc((col + 0.5) * EXPORT_CELL, (row + 0.5) * EXPORT_CELL, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  return canvas.convertToBlob({ type: 'image/png' })
}
