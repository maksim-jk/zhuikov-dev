export interface HeroLetter {
  id: string
  char: string
  position: number
}

export interface HeroLine {
  id: string
  letters: HeroLetter[]
}

export interface HeroCurrentJob {
  id: string
  company: string
  logo: string
  url: string | null
  since: string
  project: string | null
}
