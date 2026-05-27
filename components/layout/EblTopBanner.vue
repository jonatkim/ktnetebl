<template>
  <VAppBar
    flat
    :height="isMultiple ? 72 : 48"
    class="ebl-top-banner"
    :class="{ 'is-multiple': isMultiple }"
  >
    <div
      class="ebl-top-banner__inner"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- 중앙 정렬 유지를 위해 오른쪽 액션 폭과 같은 숨김 영역을 둔다. -->
      <div class="ebl-top-banner__actions ebl-top-banner__actions--spacer" aria-hidden="true">
        <EblCheckbox v-model="doNotShowToday" color="subtle"> Do not show today </EblCheckbox>
        <EblBtn icon="ebli:close" color="ghost" pill />
      </div>

      <div class="ebl-top-banner__center">
        <Transition name="ebl-top-banner-roll" mode="out-in">
          <button
            :key="currentNotice.id"
            type="button"
            class="ebl-top-banner__notice"
            @click="handleNoticeClick"
          >
            <span class="ebl-top-banner__notice-text">{{ currentNotice.message }}</span>
            <VIcon icon="ebli:chevron-right" :size="20" class="ebl-top-banner__notice-icon" />
          </button>
        </Transition>

        <div v-if="isMultiple" class="ebl-top-banner__pagination">
          {{ currentIndex + 1 }}/{{ notices.length }}
        </div>
      </div>

      <div class="ebl-top-banner__actions">
        <EblCheckbox v-model="doNotShowToday" color="subtle"> Do not show today </EblCheckbox>
        <EblBtn icon="ebli:close" color="ghost" pill @click="closeBanner" />
      </div>
    </div>
  </VAppBar>
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
const isRotationPaused = ref(false)

const notices = computed(() => (Array.isArray(main.topBannerItems) ? main.topBannerItems : []))
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
  // 오늘 숨김이 저장돼 있으면 mount 시 즉시 비표시 처리한다.
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
  // 공지가 2개 이상이고 hover pause 상태가 아닐 때만 자동 롤링한다.
  if (!import.meta.client || !isMultiple.value || isRotationPaused.value) return

  rotationTimer = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % notices.value.length
  }, TOP_BANNER_ROTATION_MS)
}

const setRotationPaused = (paused) => {
  isRotationPaused.value = paused
  syncRotation()
}

const handleMouseEnter = () => setRotationPaused(true)

const handleMouseLeave = () => setRotationPaused(false)

const handleNoticeClick = () => {
  if (!currentNotice.value?.href) return
  router.push(currentNotice.value.href)
}

const closeBanner = () => {
  // 체크 후 닫으면 오늘 날짜를 저장해 같은 날에는 다시 띄우지 않는다.
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
