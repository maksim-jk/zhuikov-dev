const SHOW_AFTER_VIEWPORTS = 0.8
const RING_RADIUS = 26
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

export const useScrollTop = () => {
  const { y } = useWindowScroll()
  const { height: viewportHeight } = useWindowSize()
  const { height: pageHeight } = useElementSize(() => (import.meta.client ? document.documentElement : null))

  const isVisible = computed(() => y.value > viewportHeight.value * SHOW_AFTER_VIEWPORTS)

  const progress = computed(() => {
    const scrollable = pageHeight.value - viewportHeight.value
    return scrollable > 0 ? Math.min(1, y.value / scrollable) : 0
  })

  const ringOffset = computed(() => RING_LENGTH * (1 - progress.value))

  // Сеттер y из useWindowScroll обрывает smooth-скролл на полпути, поэтому скроллим напрямую
  const scrollToTop = (): void => {
    track('scroll_top')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    isVisible,
    ringRadius: RING_RADIUS,
    ringLength: RING_LENGTH,
    ringOffset,
    scrollToTop,
  }
}
