import { PROFILE_EMAIL, PROFILE_LINKS } from '~/shared/constants'

const COPIED_RESET_DELAY = 2000

const CLOCK_INTERVAL = 30_000

const PROFILE_TIME_ZONE = 'Asia/Tashkent'

export const useContact = () => {
  const { locale } = useI18n()
  const { copy, copied } = useClipboard({ copiedDuring: COPIED_RESET_DELAY, legacy: true })
  const now = useNow({ interval: CLOCK_INTERVAL })

  const localTime = computed(() =>
    now.value.toLocaleTimeString(locale.value, { hour: '2-digit', minute: '2-digit', timeZone: PROFILE_TIME_ZONE }),
  )

  const copyEmail = async (): Promise<void> => {
    await copy(PROFILE_EMAIL)
  }

  return {
    email: PROFILE_EMAIL,
    mailto: `mailto:${PROFILE_EMAIL}`,
    links: PROFILE_LINKS,
    year: new Date().getFullYear(),
    localTime,
    copied,
    copyEmail,
  }
}
