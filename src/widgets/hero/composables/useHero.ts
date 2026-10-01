import type { HeroCurrentJob, HeroLine } from '../hero.types'

import { PROFILE_EXPERIENCE, PROFILE_STACK } from '~/shared/constants'

const WEIGHT_MIN = 200
const WEIGHT_MAX = 900
const INFLUENCE_RADIUS = 0.28

const toLine = (id: string, text: string): HeroLine => ({
  id,
  letters: [...text].map((char, index, all) => ({
    id: `${id}-${index}`,
    char,
    position: (index + 0.5) / all.length,
  })),
})

export const useHero = () => {
  const { t, locale } = useI18n()
  const title = ref<HTMLElement | null>(null)

  const currentJob = computed<HeroCurrentJob | null>(() => {
    const job = PROFILE_EXPERIENCE.find(item => !item.end)
    if (!job) return null
    return {
      id: job.id,
      company: job.company,
      logo: publicPath(job.logo),
      url: job.url,
      since: formatMonth(job.start, locale.value),
      project: job.clients[0]?.name ?? null,
    }
  })
  const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(title)

  const lines = computed<HeroLine[]>(() => [
    toLine('first', t('hero.first-name')),
    toLine('last', t('hero.last-name')),
  ])

  const isTracking = computed(() => !isOutside.value)

  const letterStyle = (lineIndex: number, position: number): Record<string, string> | undefined => {
    if (!isTracking.value || !elementWidth.value) return undefined
    const lineCount = lines.value.length
    const dx = elementX.value / elementWidth.value - position
    const dy = (elementY.value / elementHeight.value - (lineIndex + 0.5) / lineCount) * 0.6
    const influence = Math.max(0, 1 - Math.hypot(dx, dy) / INFLUENCE_RADIUS)
    const weight = Math.round(WEIGHT_MIN + (WEIGHT_MAX - WEIGHT_MIN) * influence ** 1.5)
    return { fontVariationSettings: `'wght' ${weight}` }
  }

  const stack = [...PROFILE_STACK, ...PROFILE_STACK]

  const trackCta = (id: string): void => {
    track('cta_click', { id })
  }

  return {
    title,
    currentJob,
    lines,
    isTracking,
    letterStyle,
    stack,
    trackCta,
  }
}
