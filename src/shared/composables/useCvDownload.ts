import type { ProfileCv } from '~/shared/constants'

import { PROFILE_CV } from '~/shared/constants'

export const useCvDownload = () => {
  const { t, locale } = useI18n()
  const pickedLang = useState<string | null>('cv-lang', () => null)
  const files = PROFILE_CV.map(file => ({
    ...file,
    href: publicPath(file.href),
  }))

  const selected = computed<ProfileCv>(() =>
    files.find(file => file.lang === (pickedLang.value ?? locale.value)) ?? files[0]!,
  )

  const selectedIndex = computed(() => {
    const index = PROFILE_CV.findIndex(file => file.lang === selected.value.lang)
    return Math.max(0, index)
  })

  const downloadLabel = computed(() => t('cv.download', { language: t(`cv.languages.${selected.value.lang}`) }))

  const isSelected = (lang: string): boolean => selected.value.lang === lang

  const select = (lang: string): void => {
    pickedLang.value = lang
  }

  return {
    files,
    selected,
    selectedIndex,
    downloadLabel,
    isSelected,
    select,
  }
}
