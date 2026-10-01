import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import sharp from 'sharp'

import { encodeCells } from '../src/widgets/led-board/lib/bitset'
import { LED_COLS, LED_ROWS, toIndex } from '../src/widgets/led-board/lib/led-grid'

const ROOT = resolve(import.meta.dirname, '..')
const INPUT = resolve(ROOT, process.argv[2] ?? 'public/photo.jpg')
const OUTPUT = resolve(ROOT, 'src/widgets/led-board/model/default-preset.ts')
const PREVIEW = resolve(ROOT, 'source/led-preview.png')

// Область кадра с лицом и плечами в долях исходника
const CROP = { left: 0.2, top: 0.19, width: 0.6, height: 0.62 }
const PORTRAIT_ROWS = LED_ROWS
const PORTRAIT_OFFSET_COL = 10
const FOCUS = { x: 0.5, y: 0.45, radius: 0.6 }
const GAMMA = Number(process.env.LED_GAMMA ?? 1)
const CURVE = { low: Number(process.env.LED_LOW ?? 0.2), high: Number(process.env.LED_HIGH ?? 0.85) }

const TEXT_LINES = ['HI,', 'I\'M', 'MAKS']
const TEXT_SCALE = 2
const TEXT_ORIGIN = { col: 76, row: 11 }
// Блик фонаря за окном слева от головы, в долях кропа
const MASK_OUT = { left: 0, top: 0.1, right: 0.26, bottom: 0.32 }
const TEXT_LINE_HEIGHT = 18

// Пиксельный шрифт 5×7: каждая строка — 5 бит слева направо
const GLYPHS: Record<string, number[]> = {
  'H': [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  'I': [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
  'M': [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  'A': [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  'K': [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  'S': [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  ',': [0b00000, 0b00000, 0b00000, 0b00000, 0b01100, 0b00100, 0b01000],
  '\'': [0b01100, 0b00100, 0b01000, 0b00000, 0b00000, 0b00000, 0b00000],
}

const smoothstep = (low: number, high: number, value: number): number => {
  const t = Math.min(1, Math.max(0, (value - low) / (high - low)))
  return t * t * (3 - 2 * t)
}

const atkinson = (pixels: Float32Array, width: number, height: number): Uint8Array => {
  const out = new Uint8Array(width * height)
  const spread: Array<[number, number]> = [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]]
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      const value = pixels[i]!
      const lit = value >= 0.5 ? 1 : 0
      out[i] = lit
      const error = (value - lit) / 8
      for (const [dx, dy] of spread) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || nx >= width || ny >= height) continue
        pixels[ny * width + nx]! += error
      }
    }
  }
  return out
}

const renderPortrait = async (): Promise<{ data: Float32Array, width: number, height: number }> => {
  const image = sharp(INPUT)
  const meta = await image.metadata()
  const srcWidth = meta.width ?? 0
  const srcHeight = meta.height ?? 0
  const cropWidth = Math.round(srcWidth * CROP.width)
  const cropHeight = Math.round(srcHeight * CROP.height)
  const height = PORTRAIT_ROWS
  const width = Math.round(height * cropWidth / cropHeight)

  const { data } = await image
    .extract({
      left: Math.round(srcWidth * CROP.left),
      top: Math.round(srcHeight * CROP.top),
      width: cropWidth,
      height: cropHeight,
    })
    .grayscale()
    .resize(width, height, { kernel: 'lanczos3' })
    .normalise({ lower: 2, upper: 98 })
    .sharpen({ sigma: 0.8, m1: 1, m2: 2 })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = new Float32Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dist = Math.hypot((x / width - FOCUS.x) * 1.25, (y / height - FOCUS.y) * 0.85) / FOCUS.radius
      const masked = x / width >= MASK_OUT.left && x / width <= MASK_OUT.right
        && y / height >= MASK_OUT.top && y / height <= MASK_OUT.bottom
      const falloff = masked ? 0 : Math.max(0, 1 - dist ** 3)
      pixels[y * width + x] = smoothstep(CURVE.low, CURVE.high, (data[y * width + x]! / 255) ** GAMMA) * falloff
    }
  }
  return { data: pixels, width, height }
}

const renderMonogram = async (): Promise<{ data: Float32Array, width: number, height: number }> => {
  const width = LED_COLS
  const height = LED_ROWS
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#000"/>
    <text x="50%" y="58%" font-family="Arial Black, Arial" font-weight="900" font-size="48"
      fill="#fff" text-anchor="middle" dominant-baseline="middle">MZ</text>
  </svg>`
  const { data } = await sharp(Buffer.from(svg)).grayscale().raw().toBuffer({ resolveWithObject: true })
  return { data: Float32Array.from(data, value => value / 255), width, height }
}

const compose = (portrait: Uint8Array, width: number, height: number, offsetCol: number): Uint8Array => {
  const cells = new Uint8Array(LED_COLS * LED_ROWS)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const col = x + offsetCol
      if (col < 0 || col >= LED_COLS || y >= LED_ROWS) continue
      cells[toIndex(col, y)] = portrait[y * width + x]!
    }
  }
  return cells
}

const drawText = (cells: Uint8Array): void => {
  TEXT_LINES.forEach((line, lineIndex) => {
    let col = TEXT_ORIGIN.col
    const row = TEXT_ORIGIN.row + lineIndex * TEXT_LINE_HEIGHT
    for (const char of line) {
      const glyph = GLYPHS[char] ?? []
      glyph.forEach((bits, gy) => {
        for (let gx = 0; gx < 5; gx++) {
          if (!((bits >> (4 - gx)) & 1)) continue
          for (let sy = 0; sy < TEXT_SCALE; sy++) {
            for (let sx = 0; sx < TEXT_SCALE; sx++) {
              const c = col + gx * TEXT_SCALE + sx
              const r = row + gy * TEXT_SCALE + sy
              if (c < LED_COLS && r < LED_ROWS) cells[toIndex(c, r)] = 1
            }
          }
        }
      })
      col += char === ',' || char === '\'' ? 4 * TEXT_SCALE : 6 * TEXT_SCALE
    }
  })
}

const writePreview = async (cells: Uint8Array): Promise<void> => {
  const scale = 8
  const raw = Buffer.alloc(LED_COLS * LED_ROWS)
  cells.forEach((lit, i) => {
    raw[i] = lit ? 255 : 24
  })
  mkdirSync(dirname(PREVIEW), { recursive: true })
  await sharp(raw, { raw: { width: LED_COLS, height: LED_ROWS, channels: 1 } })
    .resize(LED_COLS * scale, LED_ROWS * scale, { kernel: 'nearest' })
    .png()
    .toFile(PREVIEW)
}

const main = async (): Promise<void> => {
  const hasPhoto = existsSync(INPUT)
  const source = hasPhoto ? await renderPortrait() : await renderMonogram()
  const bits = atkinson(source.data, source.width, source.height)
  const offset = hasPhoto ? PORTRAIT_OFFSET_COL : 0
  const cells = compose(bits, source.width, source.height, offset)
  if (hasPhoto) drawText(cells)

  writeFileSync(
    OUTPUT,
    `// Сгенерировано scripts/generate-led-preset.ts — не редактировать вручную\nexport const DEFAULT_PRESET = '${encodeCells(cells)}'\n`,
  )
  await writePreview(cells)

  const lit = cells.reduce((sum, value) => sum + value, 0)
  console.log(`${hasPhoto ? 'photo' : 'monogram'} → ${OUTPUT} (${lit}/${cells.length} lit), preview: ${PREVIEW}`)
}

main()
