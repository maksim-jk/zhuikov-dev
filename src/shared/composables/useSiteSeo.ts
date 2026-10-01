import { PROFILE_EMAIL, PROFILE_EXPERIENCE, PROFILE_LINKS, PROFILE_STACK, localePath } from '~/shared/constants'

const jsonLd = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, '\\u003c')

export const useSiteSeo = () => {
  const { t, locale } = useI18n()
  const i18nHead = useLocaleHead({ seo: true })
  const origin = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

  const currentLocale = (): 'ru' | 'en' => locale.value === 'en' ? 'en' : 'ru'

  const pageUrl = computed(() => {
    const path = localePath(currentLocale())
    return path === '/' ? `${origin}/` : `${origin}${path}`
  })

  const graph = computed(() => {
    const code = currentLocale()
    const name = `${t('hero.first-name')} ${t('hero.last-name')}`
    const alternateName = code === 'ru' ? 'Maksim Zhuikov' : 'Максим Жуйков'
    const job = PROFILE_EXPERIENCE.find(item => item.end === null)
    const personId = `${origin}/#person`
    const websiteId = `${origin}/#website`

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': websiteId,
          'url': `${origin}/`,
          name,
          'inLanguage': ['ru-RU', 'en-US'],
          'publisher': { '@id': personId },
        },
        {
          '@type': 'Person',
          '@id': personId,
          name,
          alternateName,
          'jobTitle': t('hero.role'),
          'description': t('meta.description'),
          'url': pageUrl.value,
          'image': `${origin}/photo.jpg`,
          'email': `mailto:${PROFILE_EMAIL}`,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Tashkent',
            'addressCountry': 'UZ',
          },
          'worksFor': {
            '@type': 'Organization',
            'name': job?.company,
            'url': job?.url ?? undefined,
          },
          'knowsAbout': PROFILE_STACK,
          'knowsLanguage': ['ru', 'en'],
          'sameAs': PROFILE_LINKS.map(link => link.href),
        },
        {
          '@type': 'ProfilePage',
          '@id': `${pageUrl.value}#profile`,
          'url': pageUrl.value,
          'name': t('meta.title'),
          'description': t('meta.description'),
          'inLanguage': locale.value === 'ru' ? 'ru-RU' : 'en-US',
          'isPartOf': { '@id': websiteId },
          'about': { '@id': personId },
          'mainEntity': { '@id': personId },
          'primaryImageOfPage': {
            '@type': 'ImageObject',
            'url': `${origin}/og/${locale.value}.jpg`,
            'width': 1200,
            'height': 630,
          },
        },
      ],
    }
  })

  useHead(() => ({
    htmlAttrs: { lang: i18nHead.value.htmlAttrs?.lang },
    link: [
      ...(i18nHead.value.link ?? []),
      ...PROFILE_LINKS.map(link => ({ rel: 'me', href: link.href })),
    ],
    meta: [...(i18nHead.value.meta ?? [])],
    script: [{
      key: 'ld-json',
      type: 'application/ld+json',
      innerHTML: jsonLd(graph.value),
    }],
  }))

  useSeoMeta({
    title: () => t('meta.title'),
    description: () => t('meta.description'),
    author: () => `${t('hero.first-name')} ${t('hero.last-name')}`,
    robots: 'index, follow, max-image-preview:large',
    ogType: 'profile',
    ogTitle: () => t('meta.title'),
    ogDescription: () => t('meta.description'),
    ogUrl: () => pageUrl.value,
    ogSiteName: () => `${t('hero.first-name')} ${t('hero.last-name')}`,
    ogImage: () => `${origin}/og/${locale.value}.jpg`,
    ogImageAlt: () => t('meta.title'),
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/jpeg',
    twitterCard: 'summary_large_image',
    twitterTitle: () => t('meta.title'),
    twitterDescription: () => t('meta.description'),
    twitterImage: () => `${origin}/og/${locale.value}.jpg`,
    twitterImageAlt: () => t('meta.title'),
  })
}
