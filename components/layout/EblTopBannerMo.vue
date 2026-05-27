<template>
  <EblBottomSheet :model-value="true" persistent opacity="0.6">
    <div class="ebl-top-banner-mo">
      <div class="ebl-top-banner-mo__top">
        <EblCheckbox v-model="doNotShowToday" color="subtle" class="ebl-top-banner-mo__checkbox">
          Do not show today
        </EblCheckbox>
        <EblBtn
          icon="ebli:close"
          color="ghost"
          pill
          class="ebl-top-banner-mo__close"
          @click="closeBanner"
        />
      </div>

      <VCard class="ebl-top-banner-mo__card">
        <VCardText class="ebl-top-banner-mo__text">
          <Transition name="ebl-top-banner-mo-roll" mode="out-in">
            <div :key="currentNotice.id" class="ebl-top-banner-mo__message">
              {{ currentNotice.message }}
            </div>
          </Transition>
        </VCardText>

        <VCardActions class="ebl-top-banner-mo__action">
          <EblBtn color="tertiary" append-icon="ebli:chevron-right" @click="handleNoticeClick">
            Read More
          </EblBtn>
          <div v-if="isMultiple" class="ebl-top-banner-mo__pagination">
            {{ currentIndex + 1 }}/{{ notices.length }}
          </div>
        </VCardActions>
      </VCard>
    </div>
  </EblBottomSheet>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useMainStore } from '~/stores/useMainStore'

const TOP_BANNER_STORAGE_KEY = 'ebl_top_banner_hidden_date'
const TOP_BANNER_ROTATION_MS = 4000

const main = useMainStore()
const router = useRouter()
const currentIndex = ref(0)
const doNotShowToday = ref(false)
let rotationTimer = null

const notices = computed(() => main.topBannerItems)
const isMultiple = computed(() => notices.value.length > 1)
const currentNotice = computed(
  () =>
    notices.value[currentIndex.value] || {
      id: 'empty',
      message: '',
      href: '',
    },
)

const getTodayKey = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const syncBannerVisibility = () => {
  if (!import.meta.client) return
  const hiddenDate = localStorage.getItem(TOP_BANNER_STORAGE_KEY)
  // 오늘 숨김이 저장된 경우 모바일 바텀시트도 바로 숨긴다.
  if (hiddenDate === getTodayKey()) {
    main.hideTopBanner()
  }
}

const stopRotation = () => {
  if (rotationTimer) {
    window.clearInterval(rotationTimer)
    rotationTimer = null
  }
}

const syncRotation = () => {
  stopRotation()
  // 모바일은 hover pause 없이 다중 공지일 때만 자동 롤링한다.
  if (!import.meta.client || !isMultiple.value) return

  rotationTimer = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % notices.value.length
  }, TOP_BANNER_ROTATION_MS)
}

const handleNoticeClick = () => {
  if (!currentNotice.value?.href) return
  router.push(currentNotice.value.href)
}

const closeBanner = () => {
  // 체크 후 닫으면 오늘 날짜를 저장해 당일 재노출을 막는다.
  if (import.meta.client && doNotShowToday.value) {
    localStorage.setItem(TOP_BANNER_STORAGE_KEY, getTodayKey())
  }
  main.hideTopBanner()
}

watch(
  () => notices.value.length,
  () => {
    if (currentIndex.value >= notices.value.length) {
      currentIndex.value = 0
    }
    syncRotation()
  },
)

onMounted(() => {
  syncBannerVisibility()
  syncRotation()
})

onBeforeUnmount(() => {
  stopRotation()
})
</script>
