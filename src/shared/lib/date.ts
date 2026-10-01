const parseMonth = (value: string): Date => {
  const [year = 0, month = 1] = value.split('-').map(Number)
  return new Date(year, month - 1, 1)
}

export const monthsBetween = (start: string, end: string | null, now: Date = new Date()): number => {
  const from = parseMonth(start)
  const to = end ? parseMonth(end) : now
  return Math.max(1, (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth() + 1)
}

export const formatMonth = (value: string, locale: string): string =>
  parseMonth(value).toLocaleDateString(locale, { month: 'short', year: 'numeric' })
