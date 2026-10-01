export const SITE_GA_ID = 'G-11RHWVKWBX'
export const SITE_REPO = 'zhuikov-dev'
export const SITE_HOST = 'https://maksim-jk.github.io'
export const SITE_BASE = `/${SITE_REPO}/`
export const SITE_URL = `${SITE_HOST}/${SITE_REPO}`

export const SITE_LOCALES = [
  { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
  { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
] as const

export const SITE_DEFAULT_LOCALE = 'ru'

export const localePath = (code: string): string =>
  code === SITE_DEFAULT_LOCALE ? '/' : `/${code}`
