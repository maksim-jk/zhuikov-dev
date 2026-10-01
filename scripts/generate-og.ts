import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const WIDTH = 1200
const HEIGHT = 630
const PHOTO = 460
const FONT_URL = 'https://github.com/google/fonts/raw/main/ofl/unbounded/Unbounded%5Bwght%5D.ttf'

const CARDS = [
  {
    code: 'ru',
    name: 'Максим Жуйков',
    role: 'Senior Frontend Engineer',
    line: 'Ташкент  ·  Vue, Nuxt, React, TypeScript',
  },
  {
    code: 'en',
    name: 'Maksim Zhuikov',
    role: 'Senior Frontend Engineer',
    line: 'Tashkent  ·  Vue, Nuxt, React, TypeScript',
  },
] as const

const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const cardSvg = (fontUrl: string, name: string, role: string, line: string): string => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face { font-family: 'Unbounded'; src: url('${fontUrl}'); }
    </style>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0b0c0e"/>
  <g stroke="#262a31" stroke-width="1">
    ${Array.from({ length: 12 }, (_, index) => `<line x1="${80 + index * 96}" y1="0" x2="${80 + index * 96}" y2="${HEIGHT}"/>`).join('')}
    ${Array.from({ length: 7 }, (_, index) => `<line x1="0" y1="${40 + index * 92}" x2="${WIDTH}" y2="${40 + index * 92}"/>`).join('')}
  </g>
  <circle cx="612" cy="188" r="7" fill="#ffb547"/>
  <text x="632" y="196" fill="#ffb547" font-family="Unbounded, Arial, sans-serif" font-size="22" font-weight="500" letter-spacing="3">${escapeXml(role.toUpperCase())}</text>
  <text x="612" y="300" fill="#e9e6df" font-family="Unbounded, Arial, sans-serif" font-size="68" font-weight="600">${escapeXml(name)}</text>
  <text x="612" y="372" fill="#8a8f98" font-family="Unbounded, Arial, sans-serif" font-size="28">${escapeXml(line)}</text>
  <text x="612" y="470" fill="#5a5f68" font-family="Unbounded, Arial, sans-serif" font-size="22" letter-spacing="1">maksim-jk.github.io/zhuikov-dev</text>
</svg>`

const roundedPhoto = async (): Promise<Buffer> => {
  const photo = await sharp(resolve(ROOT, 'public/photo.jpg'))
    .resize(PHOTO, PHOTO, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer()
  const mask = Buffer.from(
    `<svg width="${PHOTO}" height="${PHOTO}" xmlns="http://www.w3.org/2000/svg"><rect width="${PHOTO}" height="${PHOTO}" rx="28" fill="#fff"/></svg>`,
  )
  return sharp(photo).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
}

const main = async (): Promise<void> => {
  const fontResponse = await fetch(FONT_URL)
  if (!fontResponse.ok) throw new Error(`font ${fontResponse.status}`)
  const fontPath = '/tmp/Unbounded-og.ttf'
  await writeFile(fontPath, Buffer.from(await fontResponse.arrayBuffer()))
  const photo = await roundedPhoto()
  const frame = Buffer.from(
    `<svg width="${PHOTO + 8}" height="${PHOTO + 8}" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="${PHOTO + 4}" height="${PHOTO + 4}" rx="30" fill="none" stroke="#ffb547" stroke-width="3"/></svg>`,
  )

  await mkdir(resolve(ROOT, 'public/og'), { recursive: true })

  for (const card of CARDS) {
    const background = await sharp(Buffer.from(cardSvg(`file://${fontPath}`, card.name, card.role, card.line)))
      .png()
      .toBuffer()
    await sharp(background)
      .composite([
        { input: frame, left: 68, top: 80 },
        { input: photo, left: 72, top: 84 },
      ])
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(resolve(ROOT, `public/og/${card.code}.jpg`))
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
