<template>
  <div class="ebl-exception-page">
    <div class="ebl-exception-page__panel">
      <div class="ebl-exception-page__image">
        <VImg :src="imageSrc" :alt="title" />
      </div>
      <h1 class="ebl-exception-page__title">{{ title }}</h1>
      <p class="ebl-exception-page__message">{{ message }}</p>
      <!-- 필요할 것 같아서 넣어두었습니다. 불필요시 제거하시면 되요 -->
      <div class="ebl-exception-page__actions">
        <EblBtn color="cta" large @click="handleGoHome">Home</EblBtn>
        <EblBtn outlined large @click="handleClearError">Go Back</EblBtn>
      </div>
    </div>
  </div>
</template>

<script setup>
import error404Img from '~/assets/images/common/error_404.png?url'
import error500Img from '~/assets/images/common/error_500.png?url'
import { computed } from 'vue'
const router = useRouter()

const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
})

// Nuxt error 객체가 비어 있어도 기본적으로 500 화면이 나오도록 보정합니다.
const normalizedStatusCode = computed(() => Number(props.error?.statusCode || 500))

const title = computed(() => {
  if (normalizedStatusCode.value === 404) return 'Page Not Found'
  if (normalizedStatusCode.value === 500) return 'Error!'
  return 'Error!'
})

const message = computed(() => {
  if (normalizedStatusCode.value === 404) {
    return `We're sorry for the inconvenience.
The page you requested could not be found.`
  }
  if (normalizedStatusCode.value === 500) {
    return `We apologize for the inconvenience.
A system error has occurred.
Please contact the administrator
if the problem persists.`
  }
  return `We apologize for the inconvenience.
A system error has occurred.`
})

const imageSrc = computed(() => (normalizedStatusCode.value === 404 ? error404Img : error500Img))

const handleGoHome = async () => {
  // clearError()는 현재 Nuxt 에러 상태를 해제하고, redirect 옵션으로 홈으로 이동합니다.
  await clearError({ redirect: '/' })
}

const handleClearError = async () => {
  // 에러 상태를 먼저 해제한 뒤, 직전 페이지로 복귀합니다.
  await clearError()
  router.back()
}
</script>
