import { SITE_LOCALES, localePath } from '../../src/shared/constants/site'

const href = (origin: string, code: string): string => {
  const path = localePath(code)
  return path === '/' ? `${origin}/` : `${origin}${path}`
}

export default defineEventHandler((event) => {
  const origin = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  const lastmod = new Date().toISOString().slice(0, 10)
  const alternates = [
    ...SITE_LOCALES.map(locale =>
      `    <xhtml:link rel="alternate" hreflang="${locale.language}" href="${href(origin, locale.code)}"/>`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${href(origin, 'ru')}"/>`,
  ].join('\n')

  const urls = SITE_LOCALES.map(locale => `  <url>
    <loc>${href(origin, locale.code)}</loc>
    <lastmod>${lastmod}</lastmod>
${alternates}
  </url>`).join('\n')

  event.node?.res?.setHeader('content-type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
})
