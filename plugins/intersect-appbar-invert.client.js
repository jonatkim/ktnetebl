export default defineNuxtPlugin(async (nuxtApp) => {
  if (!nuxtApp.$pinia || !import.meta.client) return

  const { useMainStore } = await import('~/stores/useMainStore')

  nuxtApp.vueApp.directive('intersect-appbar-invert', {
    mounted(el, binding) {
      const mainStore = useMainStore(nuxtApp.$pinia)
      const value = binding.value || {}
      const resetOnUnmount = value.resetOnUnmount !== false
      let rafId = null

      const getOverlayBottom = () => {
        const appbarEl = document.querySelector('.portal-appbar')
        if (!appbarEl) return 0
        let bottom = Math.max(0, appbarEl.getBoundingClientRect().bottom)
        const megamenuEl = document.querySelector('.portal-appbar-megamenu')
        if (megamenuEl) {
          bottom = Math.max(bottom, megamenuEl.getBoundingClientRect().bottom)
        }
        return bottom
      }

      const applyInvertByOverlap = () => {
        const rect = el.getBoundingClientRect()
        const overlayBottom = getOverlayBottom()
        // Section이 앱바(메가메뉴 포함) 영역과 겹치면 invert true
        const overlapsAppbar = rect.top <= overlayBottom && rect.bottom > 0
        mainStore.setPortalAppbarInvert(overlapsAppbar)
      }

      const scheduleApply = () => {
        if (rafId !== null) return
        rafId = window.requestAnimationFrame(() => {
          rafId = null
          applyInvertByOverlap()
        })
      }

      const onScroll = () => scheduleApply()
      const onResize = () => scheduleApply()
      const onClick = () => scheduleApply()

      scheduleApply()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize, { passive: true })
      document.addEventListener('click', onClick, true)

      el.__intersectInvertAppbarCleanup = () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        document.removeEventListener('click', onClick, true)
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId)
          rafId = null
        }
        if (resetOnUnmount) {
          mainStore.setPortalAppbarInvert(false)
        }
      }
    },
    unmounted(el) {
      el.__intersectInvertAppbarCleanup?.()
      delete el.__intersectInvertAppbarCleanup
    },
  })
})
