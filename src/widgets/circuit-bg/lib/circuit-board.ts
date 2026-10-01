import type { CircuitBoard, CircuitChip, CircuitPoint, CircuitTrace } from '../circuit-bg.types'

export const CIRCUIT_WIDTH = 1600

export const CIRCUIT_HEIGHT = 1000

export const CIRCUIT_GRID = 40

export const CIRCUIT_PULSE = 36

export const CIRCUIT_TRAVEL_PART = 0.6

const SEED = 20250201

const EDGE_TRACES = 14

const PIN_CHANCE = 0.75

const LIVE_CHANCE = 0.35

const DIRECTIONS: CircuitPoint[] = [
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
]

const CHIPS: Omit<CircuitChip, 'id' | 'pins'>[] = [
  { x: 160, y: 240, width: 160, height: 120 },
  { x: 1120, y: 160, width: 120, height: 120 },
  { x: 1240, y: 600, width: 200, height: 160 },
  { x: 320, y: 720, width: 120, height: 160 },
]

const createRandom = (seed: number): (() => number) => {
  let state = seed
  return () => {
    state = (state + 0x6D2B79F5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const randomInt = (random: () => number, min: number, max: number): number =>
  min + Math.floor(random() * (max - min + 1))

const isDiagonal = (direction: number): boolean => direction % 2 === 1

const maxSteps = (point: CircuitPoint, step: CircuitPoint): number => {
  const limitX = step.x > 0 ? (CIRCUIT_WIDTH - point.x) : step.x < 0 ? point.x : Infinity
  const limitY = step.y > 0 ? (CIRCUIT_HEIGHT - point.y) : step.y < 0 ? point.y : Infinity
  return Math.floor(Math.min(limitX, limitY) / CIRCUIT_GRID)
}

const walk = (random: () => number, start: CircuitPoint, initialDirection: number): CircuitPoint[] => {
  const points = [start]
  let direction = initialDirection
  const segments = randomInt(random, 3, 5)

  for (let segment = 0; segment < segments; segment++) {
    const current = points[points.length - 1]!
    const step = DIRECTIONS[direction]!
    const wanted = isDiagonal(direction) ? randomInt(random, 1, 3) : randomInt(random, 2, 7)
    const steps = Math.min(wanted, maxSteps(current, step))
    if (steps < 1) break

    points.push({ x: current.x + step.x * steps * CIRCUIT_GRID, y: current.y + step.y * steps * CIRCUIT_GRID })
    direction = (direction + (random() < 0.5 ? 1 : 7)) % 8
  }

  return points
}

const measure = (points: CircuitPoint[]): number =>
  points.slice(1).reduce((sum, point, index) => {
    const previous = points[index]!
    return sum + Math.hypot(point.x - previous.x, point.y - previous.y)
  }, 0)

const createTrace = (random: () => number, id: number, points: CircuitPoint[]): CircuitTrace => {
  const length = Math.round(measure(points))
  const speed = randomInt(random, 150, 260)
  const duration = Math.max(2.5, length / speed / CIRCUIT_TRAVEL_PART)

  return {
    id,
    d: points.map((point, index) => `${index ? 'L' : 'M'}${point.x} ${point.y}`).join(''),
    start: points[0]!,
    end: points[points.length - 1]!,
    length,
    duration: Number(duration.toFixed(2)),
    delay: Number((-random() * duration).toFixed(2)),
    isLive: random() < LIVE_CHANCE,
  }
}

const createEdgeStart = (random: () => number): { point: CircuitPoint, direction: number } => {
  const side = randomInt(random, 0, 3)
  const col = randomInt(random, 1, CIRCUIT_WIDTH / CIRCUIT_GRID - 1) * CIRCUIT_GRID
  const row = randomInt(random, 1, CIRCUIT_HEIGHT / CIRCUIT_GRID - 1) * CIRCUIT_GRID

  if (side === 0) return { point: { x: 0, y: row }, direction: 0 }
  if (side === 1) return { point: { x: CIRCUIT_WIDTH, y: row }, direction: 4 }
  if (side === 2) return { point: { x: col, y: 0 }, direction: 2 }
  return { point: { x: col, y: CIRCUIT_HEIGHT }, direction: 6 }
}

export const createCircuitBoard = (): CircuitBoard => {
  const random = createRandom(SEED)
  const routes: CircuitPoint[][] = []

  const chips = CHIPS.map((chip, id): CircuitChip => {
    const pins = chip.height / CIRCUIT_GRID - 1

    for (let pin = 1; pin <= pins; pin++) {
      const y = chip.y + pin * CIRCUIT_GRID
      if (random() < PIN_CHANCE) routes.push(walk(random, { x: chip.x, y }, 4))
      if (random() < PIN_CHANCE) routes.push(walk(random, { x: chip.x + chip.width, y }, 0))
    }

    return { ...chip, id, pins }
  })

  for (let index = 0; index < EDGE_TRACES; index++) {
    const { point, direction } = createEdgeStart(random)
    routes.push(walk(random, point, direction))
  }

  const traces = routes
    .filter(points => points.length > 1)
    .map((points, id) => createTrace(random, id, points))

  return { width: CIRCUIT_WIDTH, height: CIRCUIT_HEIGHT, chips, traces }
}
