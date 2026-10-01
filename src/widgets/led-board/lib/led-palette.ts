// Зеркало токенов из _abstracts.scss — canvas не умеет читать SCSS-переменные
export const LED_PALETTE = {
  panel: '#15171b',
  plate: '#1a1d22',
  housing: '#0b0c0e',
  housingStroke: '#353a43',
  lever: '#8a8f98',
  leverOn: '#e9e6df',
  ledOff: '#2b2218',
  ledCore: '#fff4d6',
  led: '#ffb547',
  ledGlow: 'rgba(255, 181, 71, 0.38)',
  ledGlowEdge: 'rgba(255, 181, 71, 0)',
  glowRgb: [255, 181, 71],
} as const
