export const packBits = (cells: Uint8Array): Uint8Array => {
  const bytes = new Uint8Array(Math.ceil(cells.length / 8))
  for (let i = 0; i < cells.length; i++) {
    if (cells[i]) bytes[i >> 3]! |= 1 << (7 - (i & 7))
  }
  return bytes
}

export const unpackBits = (bytes: Uint8Array, length: number): Uint8Array => {
  const cells = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    cells[i] = ((bytes[i >> 3] ?? 0) >> (7 - (i & 7))) & 1
  }
  return cells
}

export const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export const base64ToBytes = (value: string): Uint8Array | null => {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
    return Uint8Array.from(binary, char => char.charCodeAt(0))
  }
  catch {
    return null
  }
}

export const encodeCells = (cells: Uint8Array): string => bytesToBase64(packBits(cells))

export const decodeCells = (value: string, length: number): Uint8Array | null => {
  const bytes = base64ToBytes(value)
  if (!bytes || bytes.length !== Math.ceil(length / 8)) return null
  return unpackBits(bytes, length)
}
