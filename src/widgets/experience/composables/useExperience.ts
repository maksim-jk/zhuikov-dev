import type { ExperienceEntry } from '../experience.types'
import type { ExperienceClient } from '~/shared/constants'

import { PROFILE_EXPERIENCE } from '~/shared/constants'

export const useExperience = () => {
  const { t, tm, rt, locale } = useI18n()
  const openIds = ref<string[]>(PROFILE_EXPERIENCE[0] ? [PROFILE_EXPERIENCE[0].id] : [])

  const formatDuration = (months: number): string => {
    const years = Math.floor(months / 12)
    const rest = months % 12
    return [
      years ? t('experience.years', { n: years }, years) : '',
      rest ? t('experience.months', { n: rest }) : '',
    ].filter(Boolean).join(' ')
  }

  const entries = computed<ExperienceEntry[]>(() =>
    PROFILE_EXPERIENCE.map(item => ({
      ...item,
      logo: publicPath(item.logo),
      clients: item.clients.map(client => ({
        ...client,
        logo: publicPath(client.logo),
      })),
      isCurrent: !item.end,
      period: `${formatMonth(item.start, locale.value)} — ${item.end ? formatMonth(item.end, locale.value) : t('experience.present')}`,
      duration: formatDuration(monthsBetween(item.start, item.end)),
    })),
  )

  const getHost = (url: string): string => new URL(url).hostname.replace(/^www\./, '')

  const getPrimaryClient = (clients: ExperienceClient[]): ExperienceClient | null =>
    clients.length === 1 ? clients[0] ?? null : null

  const getPoints = (id: string): string[] =>
    (tm(`experience.items.${id}.points`) as unknown as string[]).map(point => rt(point))

  const isOpen = (id: string): boolean => openIds.value.includes(id)

  const toggle = (id: string): void => {
    if (isOpen(id)) {
      openIds.value = openIds.value.filter(item => item !== id)
      return
    }
    openIds.value = [...openIds.value, id]
    track('experience_open', { id })
  }

  return {
    entries,
    getHost,
    getPrimaryClient,
    getPoints,
    isOpen,
    toggle,
  }
}
