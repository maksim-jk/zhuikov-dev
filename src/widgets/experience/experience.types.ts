import type { ExperienceItem } from '~/shared/constants'

export interface ExperienceEntry extends ExperienceItem {
  period: string
  duration: string
  isCurrent: boolean
}
