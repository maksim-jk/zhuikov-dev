import { LED_PALETTE } from './led-palette'

export const LED_FRAME_COUNT = 7

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t

const drawFrame = (ctx: OffscreenCanvasRenderingContext2D, size: number, t: number): void => {
  ctx.fillStyle = LED_PALETTE.panel
  ctx.fillRect(0, 0, size, size)

  const inset = size * 0.06
  ctx.fillStyle = LED_PALETTE.plate
  ctx.beginPath()
  ctx.roundRect(inset, inset, size - inset * 2, size - inset * 2, size * 0.14)
  ctx.fill()

  const ledX = size * 0.5
  const ledY = size * 0.3
  const ledRadius = size * 0.17

  if (t > 0) {
    const halo = ctx.createRadialGradient(ledX, ledY, ledRadius * 0.5, ledX, ledY, ledRadius * 2.6)
    halo.addColorStop(0, LED_PALETTE.ledGlow)
    halo.addColorStop(1, LED_PALETTE.ledGlowEdge)
    ctx.globalAlpha = t
    ctx.fillStyle = halo
    ctx.fillRect(inset, inset, size - inset * 2, size - inset * 2)
    ctx.globalAlpha = 1
  }

  ctx.fillStyle = LED_PALETTE.ledOff
  ctx.beginPath()
  ctx.arc(ledX, ledY, ledRadius, 0, Math.PI * 2)
  ctx.fill()

  if (t > 0) {
    const core = ctx.createRadialGradient(ledX - ledRadius * 0.3, ledY - ledRadius * 0.3, 0, ledX, ledY, ledRadius)
    core.addColorStop(0, LED_PALETTE.ledCore)
    core.addColorStop(0.55, LED_PALETTE.led)
    core.addColorStop(1, LED_PALETTE.led)
    ctx.globalAlpha = t
    ctx.fillStyle = core
    ctx.beginPath()
    ctx.arc(ledX, ledY, ledRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  const housingX = size * 0.32
  const housingY = size * 0.55
  const housingWidth = size * 0.36
  const housingHeight = size * 0.34
  ctx.fillStyle = LED_PALETTE.housing
  ctx.strokeStyle = LED_PALETTE.housingStroke
  ctx.lineWidth = Math.max(1, size * 0.03)
  ctx.beginPath()
  ctx.roundRect(housingX, housingY, housingWidth, housingHeight, size * 0.06)
  ctx.fill()
  ctx.stroke()

  const pivotY = housingY + housingHeight / 2
  const knobY = lerp(housingY + housingHeight * 0.95, housingY - housingHeight * 0.05, t)
  ctx.strokeStyle = t > 0.5 ? LED_PALETTE.leverOn : LED_PALETTE.lever
  ctx.lineWidth = Math.max(1, size * 0.08)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(ledX, pivotY)
  ctx.lineTo(ledX, knobY)
  ctx.stroke()

  ctx.fillStyle = t > 0.5 ? LED_PALETTE.leverOn : LED_PALETTE.lever
  ctx.beginPath()
  ctx.arc(ledX, knobY, size * 0.075, 0, Math.PI * 2)
  ctx.fill()
}

export const createLedSprites = (size: number): OffscreenCanvas[] => {
  const pixelSize = Math.max(1, Math.ceil(size))
  return Array.from({ length: LED_FRAME_COUNT }, (_, frame) => {
    const canvas = new OffscreenCanvas(pixelSize, pixelSize)
    const ctx = canvas.getContext('2d')
    if (ctx) drawFrame(ctx, pixelSize, frame / (LED_FRAME_COUNT - 1))
    return canvas
  })
}
