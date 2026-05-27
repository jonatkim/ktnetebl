export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('sticky', {
    mounted(el, binding) {
      el.style.position = 'sticky'
      el.style.zIndex = '10' // sticky 요소는 기본적으로 z-index 부여
      applyStickyStyles(el, binding)
    },
    updated(el, binding) {
      // 업데이트될 때도 값 재적용
      applyStickyStyles(el, binding)
    },
  })
})

const applyStickyStyles = (el, binding) => {
  const value = binding.value

  if (typeof value === 'number') {
    el.style.top = `${value}px`
    el.style.bottom = ''
    return
  }

  if (typeof value === 'string') {
    el.style.top = value
    el.style.bottom = ''
    return
  }

  if (typeof value === 'object' && value !== null) {
    if (value.top !== undefined) {
      el.style.top = typeof value.top === 'number' ? `${value.top}px` : value.top
    } else {
      el.style.top = ''
    }

    if (value.bottom !== undefined) {
      el.style.bottom = typeof value.bottom === 'number' ? `${value.bottom}px` : value.bottom
    } else {
      el.style.bottom = ''
    }

    if (value.zIndex !== undefined) {
      el.style.zIndex = String(value.zIndex)
    }
  }
}
