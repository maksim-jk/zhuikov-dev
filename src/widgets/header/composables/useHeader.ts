import type { HeaderNavItem } from '../header.types'

import { CvDownloadSize } from '~/shared/ui'

const SCROLLED_OFFSET = 24

const NAV_ITEMS: HeaderNavItem[] = [
  { id: 'board', labelKey: 'nav.board' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'experience', labelKey: 'nav.experience' },
  { id: 'terminal', labelKey: 'nav.terminal' },
  { id: 'contact', labelKey: 'nav.contact' },
]

export const useHeader = () => {
  const { locale } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const { y } = useWindowScroll()

  const isScrolled = computed(() => y.value > SCROLLED_OFFSET)
  const isEnglish = computed(() => locale.value === 'en')
  const nextLocalePath = computed(() => switchLocalePath(isEnglish.value ? 'ru' : 'en'))

  return {
    navItems: NAV_ITEMS,
    cvSize: CvDownloadSize.SM,
    isScrolled,
    isEnglish,
    nextLocalePath,
  }
}
