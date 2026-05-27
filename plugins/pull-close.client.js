export default defineNuxtPlugin((nuxtApp) => {
  const DEFAULT_THRESHOLD = 72
  const VALID_DIRECTIONS = new Set(['down', 'up', 'left', 'right'])

  const resolveEl = (value, fallback) => {
    if (!value) return fallback
    const resolved = typeof value === 'function' ? value() : value
    if (!resolved) return fallback
    if (typeof resolved === 'object' && resolved !== null && 'value' in resolved) {
      return resolved.value ?? fallback
    }
    return resolved
  }

  const resolveDirection = (arg) => (VALID_DIRECTIONS.has(arg) ? arg : 'down')

  const getDelta = (direction, startX, startY, currentX, currentY) => {
    const rawDelta =
      direction === 'left' || direction === 'right' ? currentX - startX : currentY - startY
    if (direction === 'up' || direction === 'left') return Math.max(0, -rawDelta)
    return Math.max(0, rawDelta)
  }

  nuxtApp.vueApp.directive('pull-trigger', {
    mounted(el, binding) {
      const state = {
        dragging: false,
        startY: 0,
        currentY: 0,
        startX: 0,
        currentX: 0,
        direction: 'down',
        targetEl: el,
        handleEl: null,
        originalTransform: '',
        threshold: DEFAULT_THRESHOLD,
        onTrigger: () => {},
        onProgress: null,
        requireHandle: false,
        shouldPreventDefault: false,
      }

      const updateHandle = (opts) => {
        const hasHandleOption = Object.prototype.hasOwnProperty.call(opts, 'handle')
        let nextHandle = hasHandleOption ? resolveEl(opts.handle, null) : null
        if (hasHandleOption && !nextHandle && el?.querySelector) {
          nextHandle = el.querySelector('.ebl-bottom-sheet__handle')
        }
        state.handleEl = nextHandle
      }

      const syncOptions = () => {
        const opts = binding.value || {}
        state.direction = resolveDirection(binding.arg)
        state.targetEl = el
        state.threshold = typeof opts.threshold === 'number' ? opts.threshold : DEFAULT_THRESHOLD
        state.onTrigger = typeof opts.onTrigger === 'function' ? opts.onTrigger : () => {}
        state.onProgress = typeof opts.onProgress === 'function' ? opts.onProgress : null
        state.requireHandle = Object.prototype.hasOwnProperty.call(opts, 'handle')
        state.shouldPreventDefault = !!opts.preventDefault
        updateHandle(opts)
      }

      const applyTransform = (delta) => {
        if (!state.targetEl || !state.targetEl.style) return
        const base =
          state.originalTransform && state.originalTransform !== 'none'
            ? state.originalTransform
            : ''
        const axis = state.direction === 'left' || state.direction === 'right' ? 'X' : 'Y'
        const sign = state.direction === 'up' || state.direction === 'left' ? -1 : 1
        const translate = `translate${axis}(${delta * sign}px)`
        state.targetEl.style.transform = base ? `${base} ${translate}` : translate
      }

      const resetTransform = () => {
        if (!state.targetEl || !state.targetEl.style) return
        state.targetEl.style.transition = 'transform 0.2s ease'
        state.targetEl.style.transform = state.originalTransform || ''
        window.setTimeout(() => {
          if (state.targetEl) state.targetEl.style.transition = ''
        }, 200)
      }

      const onTouchStart = (event) => {
        syncOptions()
        if (state.requireHandle) {
          if (!state.handleEl) {
            return
          }
          const target = event.target
          if (!(target instanceof Node) || !state.handleEl.contains(target)) {
            return
          }
        }
        state.dragging = true
        state.startY = event.touches[0]?.clientY || 0
        state.currentY = state.startY
        state.startX = event.touches[0]?.clientX || 0
        state.currentX = state.startX
        if (state.targetEl && state.targetEl.style) {
          state.originalTransform = state.targetEl.style.transform || ''
          state.targetEl.style.transition = 'none'
        }
      }

      const onTouchMove = (event) => {
        if (!state.dragging) return
        if (state.shouldPreventDefault && event.cancelable) event.preventDefault()
        state.currentY = event.touches[0]?.clientY || 0
        state.currentX = event.touches[0]?.clientX || 0
        const delta = getDelta(
          state.direction,
          state.startX,
          state.startY,
          state.currentX,
          state.currentY,
        )
        if (state.onProgress) {
          const progress = Math.min(1, delta / state.threshold)
          state.onProgress(progress)
        }
        applyTransform(delta)
      }

      const onTouchEnd = () => {
        if (!state.dragging) return
        const delta = getDelta(
          state.direction,
          state.startX,
          state.startY,
          state.currentX,
          state.currentY,
        )
        state.dragging = false
        resetTransform()
        if (delta >= state.threshold) state.onTrigger()
      }

      const attachHandlers = () => {
        const target = el
        if (!target?.addEventListener) {
          return
        }
        target.addEventListener('touchstart', onTouchStart, { passive: true })
        target.addEventListener('touchmove', onTouchMove, { passive: false })
        target.addEventListener('touchend', onTouchEnd)
        target.addEventListener('touchcancel', onTouchEnd)
        state.boundEl = target
      }

      const detachHandlers = () => {
        if (!state.boundEl) return
        state.boundEl.removeEventListener('touchstart', onTouchStart)
        state.boundEl.removeEventListener('touchmove', onTouchMove)
        state.boundEl.removeEventListener('touchend', onTouchEnd)
        state.boundEl.removeEventListener('touchcancel', onTouchEnd)
        state.boundEl = null
      }

      state.handlers = {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        syncOptions,
        attachHandlers,
        detachHandlers,
      }
      syncOptions()
      attachHandlers()
      window.requestAnimationFrame(() => {
        if (el._pullClose) state.handlers.syncOptions()
      })
      el._pullClose = state
    },
    updated(el) {
      const state = el._pullClose
      if (!state) return
      state.handlers.syncOptions()
    },
    unmounted(el) {
      const state = el._pullClose
      if (!state?.handlers) return
      state.handlers.detachHandlers()
      delete el._pullClose
    },
  })
})
