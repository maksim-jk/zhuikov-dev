export default defineEventHandler((event) => {
  const origin = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

  event.node?.res?.setHeader('content-type', 'text/plain; charset=utf-8')

  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
})
