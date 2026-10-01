import { effectScope } from 'vue'

import type { Directive } from 'vue'

const MAGNETIC_STRENGTH = 0.28
const MAGNETIC_TRANSITION = 'translate 0.4s cubic-bezier(0.22, 1, 0.36, 1)'

const scopes = new WeakMap<HTMLElement, ReturnType<typeof effectScope>>()

const vReveal: Directive<HTMLElement, number | undefined> = {
  getSSRProps: () => ({ class: 'reveal' }),
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}s`)

    const scope = effectScope()
    scope.run(() => {
      useReveal(el, () => el.classList.add('is-visible'))
    })
    scopes.set(el, scope)
  },
  unmounted(el) {
    scopes.get(el)?.stop()
    scopes.delete(el)
  },
}

const vMagnetic: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    const strength = binding.value ?? MAGNETIC_STRENGTH
    const baseTransition = getComputedStyle(el).transition
    el.style.transition = [baseTransition, MAGNETIC_TRANSITION].filter(Boolean).join(', ')

    const scope = effectScope()
    scope.run(() => {
      useEventListener(el, 'pointermove', (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        const rect = el.getBoundingClientRect()
        const x = (event.clientX - rect.left - rect.width / 2) * strength
        const y = (event.clientY - rect.top - rect.height / 2) * strength
        el.style.translate = `${x}px ${y}px`
      })
      useEventListener(el, 'pointerleave', () => {
        el.style.translate = ''
      })
    })
    scopes.set(el, scope)
  },
  unmounted(el) {
    scopes.get(el)?.stop()
    scopes.delete(el)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', vReveal)
  nuxtApp.vueApp.directive('magnetic', vMagnetic)
})
