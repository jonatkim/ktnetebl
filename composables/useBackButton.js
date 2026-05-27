import { useRouter } from 'vue-router'

/**
 * 백버튼 핸들러 composable
 * - 커스텀 함수 우선 실행
 * - 없으면 router.back() 자동 실행
 */
export const useBackButton = () => {
  const router = useRouter()

  const handleBack = (customFn) => {
    if (customFn && typeof customFn === 'function') {
      customFn()
    } else {
      router.back()
    }
  }

  return {
    handleBack,
  }
}
