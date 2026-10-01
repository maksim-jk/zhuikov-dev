const pageView = (pagePath: string): void => {
  track('page_view', {
    page_path: pagePath,
    page_location: window.location.href,
  })
}

export default defineNuxtPlugin(() => {
  if (import.meta.dev) return

  const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
  const router = useRouter()

  router.afterEach((to, from) => {
    if (from.matched.length > 0 && to.path === from.path) return
    pageView(`${base}${to.fullPath.split('#')[0]}`)
  })
})
