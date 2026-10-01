import { TransitionPresets } from '@vueuse/core'

import type { CertificateItem } from '~/shared/constants'

import { PROFILE_CERTIFICATES, PROFILE_STATS } from '~/shared/constants'

const COUNTER_DURATION = 1600

export const useAbout = () => {
  const { n } = useI18n()
  const stats = ref<HTMLElement | null>(null)
  const targets = ref(PROFILE_STATS.map(() => 0))

  const animated = useTransition(targets, {
    duration: COUNTER_DURATION,
    transition: TransitionPresets.easeOutExpo,
  })

  const counters = computed(() =>
    PROFILE_STATS.map((stat, index) => ({
      ...stat,
      display: `${n(Math.round(animated.value[index] ?? 0))}${stat.suffix}`,
    })),
  )

  useReveal(stats, () => {
    targets.value = PROFILE_STATS.map(stat => stat.value)
  })

  const certificates = PROFILE_CERTIFICATES.map(item => ({
    ...item,
    image: publicPath(item.image),
    issuers: item.issuers.map(issuer => ({
      ...issuer,
      logo: publicPath(issuer.logo),
    })),
  }))

  const openedId = ref<string | null>(null)

  const opened = computed<CertificateItem | null>(() =>
    certificates.find(item => item.id === openedId.value) ?? null,
  )

  const getHost = (url: string): string => new URL(url).hostname.replace(/^www\./, '')

  const openCertificate = (id: string): void => {
    openedId.value = id
    track('certificate_open', { id })
  }

  const closeCertificate = (): void => {
    openedId.value = null
  }

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeCertificate()
  })

  return {
    stats,
    counters,
    certificates,
    getHost,
    opened,
    openCertificate,
    closeCertificate,
  }
}
