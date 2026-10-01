export const publicPath = (path: string): string => {
  const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}
