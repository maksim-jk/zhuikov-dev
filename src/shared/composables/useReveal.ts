import type { MaybeElementRef } from '@vueuse/core'

const REVEAL_THRESHOLD = 0.15

export const useReveal = (target: MaybeElementRef, onReveal?: () => void) => {
  const isVisible = ref(false)

  const { stop } = useIntersectionObserver(
    target,
    ([entry]: IntersectionObserverEntry[]) => {
      if (!entry?.isIntersecting) return
      isVisible.value = true
      onReveal?.()
      stop()
    },
    { threshold: REVEAL_THRESHOLD },
  )

  return { isVisible, stop }
}
