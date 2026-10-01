export enum TerminalLineKind {
  INPUT = 'input',
  OUTPUT = 'output',
  ERROR = 'error',
  ACCENT = 'accent',
}

export interface TerminalLine {
  id: number
  kind: TerminalLineKind
  text: string
}

export type TerminalCommandHandler = (args: string[]) => void
