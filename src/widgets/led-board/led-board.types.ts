import type { Ref } from 'vue'

export enum LedTool {
  AUTO = 'auto',
  DRAW = 'draw',
  ERASE = 'erase',
  PAN = 'pan',
}

export interface LedCellPoint {
  col: number
  row: number
}

export interface LedBoardChange {
  indices: number[] | null
}

export interface LedAnimation {
  from: number
  to: number
  start: number
}

export interface LedRendererTargets {
  canvas: Ref<HTMLCanvasElement | null>
  glow: Ref<HTMLCanvasElement | null>
  viewport: Ref<HTMLElement | null>
}

export interface LedToolOption {
  id: LedTool
  labelKey: string
  icon: string
}
