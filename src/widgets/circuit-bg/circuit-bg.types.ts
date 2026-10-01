export interface CircuitPoint {
  x: number
  y: number
}

export interface CircuitChip extends CircuitPoint {
  id: number
  width: number
  height: number
  pins: number
}

export interface CircuitTrace {
  id: number
  d: string
  start: CircuitPoint
  end: CircuitPoint
  length: number
  duration: number
  delay: number
  isLive: boolean
}

export interface CircuitBoard {
  width: number
  height: number
  chips: CircuitChip[]
  traces: CircuitTrace[]
}
