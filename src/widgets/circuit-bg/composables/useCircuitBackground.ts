import { CIRCUIT_GRID, CIRCUIT_PULSE, createCircuitBoard } from '../lib/circuit-board'

import type { CircuitChip, CircuitTrace } from '../circuit-bg.types'
import type { StyleValue } from 'vue'

const CIRCUIT_BOARD = createCircuitBoard()

const PIN_LENGTH = 8

export const useCircuitBackground = () => {
  const viewBox = `0 0 ${CIRCUIT_BOARD.width} ${CIRCUIT_BOARD.height}`

  const liveTraces = CIRCUIT_BOARD.traces.filter(trace => trace.isLive)

  const getPulseStyle = (trace: CircuitTrace): StyleValue => ({
    'strokeDasharray': `${CIRCUIT_PULSE} ${trace.length + CIRCUIT_PULSE}`,
    '--from': `${CIRCUIT_PULSE}`,
    '--to': `${-trace.length}`,
    'animationDuration': `${trace.duration}s`,
    'animationDelay': `${trace.delay}s`,
  })

  const getNodeStyle = (trace: CircuitTrace): StyleValue => ({
    animationDuration: `${trace.duration}s`,
    animationDelay: `${trace.delay}s`,
  })

  const getPins = (chip: CircuitChip): string =>
    Array.from({ length: chip.pins }, (_, index) => {
      const pinY = chip.y + (index + 1) * CIRCUIT_GRID
      return `M${chip.x - PIN_LENGTH} ${pinY}H${chip.x}M${chip.x + chip.width} ${pinY}H${chip.x + chip.width + PIN_LENGTH}`
    }).join('')

  return {
    board: CIRCUIT_BOARD,
    viewBox,
    liveTraces,
    getPulseStyle,
    getNodeStyle,
    getPins,
  }
}
