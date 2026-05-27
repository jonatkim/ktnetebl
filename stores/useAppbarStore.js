import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 앱바 전역 상태 관리
 * - type: 'main' | 'sub' | 'detail' (기본값: 'sub')
 * - title: 앱바 타이틀
 * - onBackClick: 백버튼 커스텀 함수 (없으면 router.back())
 */
export const useAppbarStore = defineStore('appbar', () => {
  const route = useRoute()
  const appendButtons = ref([])

  const isPortal = computed(
    () => route.meta.layout === 'portal' || route.path.startsWith('/portal'),
  )

  // 앱바 타입 (포탈은 항상 sub, 그 외는 메타에서 가져오고 없으면 sub)
  const type = computed(() => (isPortal.value ? 'sub' : (route.meta.appbarType ?? 'sub')))

  // 앱바 타이틀
  const title = computed(() => route.meta.appbarTitle ?? '')

  // 백버튼 커스텀 함수 (선택사항)
  const onBackClick = computed(() => route.meta.onBackClick)

  const setAppendButtons = (buttons = []) => {
    if (!buttons) {
      appendButtons.value = []
      return
    }

    appendButtons.value = Array.isArray(buttons) ? buttons : [buttons]
  }

  const clearAppendButtons = () => {
    appendButtons.value = []
  }

  return {
    isPortal,
    type,
    title,
    onBackClick,
    appendButtons,
    setAppendButtons,
    clearAppendButtons,
  }
})
