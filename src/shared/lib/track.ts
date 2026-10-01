import { SITE_GA_ID } from '~/shared/constants'

export const track = (name: string, params: Record<string, string> = {}): void => {
  if (!import.meta.client || import.meta.dev) return
  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer
  dataLayer?.push(['event', name, { send_to: SITE_GA_ID, ...params }])
}
