import { SITE_BASE, SITE_DEFAULT_LOCALE, SITE_HOST, SITE_LOCALES, SITE_URL } from './src/shared/constants/site'

const resolveSiteUrl = (): string => {
  const fromEnv = process.env.NUXT_PUBLIC_SITE_URL ?? process.env.SITE_URL
  if (!fromEnv || fromEnv.includes('localhost')) return SITE_URL
  return fromEnv.replace(/\/$/, '')
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
  ],

  $development: {
    app: {
      head: {
        link: [
          { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        ],
      },
    },
  },

  $production: {
    app: {
      baseURL: SITE_BASE,
      head: {
        link: [
          { rel: 'icon', type: 'image/svg+xml', href: `${SITE_BASE}favicon.svg` },
        ],
      },
    },
    nitro: {
      preset: 'github-pages',
      prerender: {
        crawlLinks: true,
        failOnError: false,
        routes: ['/', '/en', '/sitemap.xml', '/robots.txt'],
      },
    },
  },

  components: [
    { path: '~/widgets', pathPrefix: false, extensions: ['vue'] },
    { path: '~/shared/ui', pathPrefix: false, extensions: ['vue'] },
  ],

  imports: {
    dirs: [
      'shared/lib',
      'shared/composables',
      'widgets/*/composables',
    ],
  },

  devtools: { enabled: true },

  app: {
    baseURL: '/',
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0b0c0e' },
      ],
    },
  },

  css: ['~/assets/scss/main.scss'],

  runtimeConfig: {
    public: {
      siteUrl: resolveSiteUrl(),
    },
  },

  srcDir: 'src',

  future: {
    compatibilityVersion: 4,
  },

  features: {
    inlineStyles: true,
  },

  compatibilityDate: '2025-01-01',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_abstracts.scss" as *;\n',
        },
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'cyrillic'],
    },
    families: [
      { name: 'Unbounded', provider: 'google', weights: ['200 900'] },
      { name: 'Geist', provider: 'google', weights: ['400 700'] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 700] },
    ],
  },

  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    baseUrl: SITE_HOST,
    locales: SITE_LOCALES.map(locale => ({ ...locale })),
    defaultLocale: SITE_DEFAULT_LOCALE,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  },
})
