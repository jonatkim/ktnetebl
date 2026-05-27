<template>
  <div v-show="uiReady">
    <!-- PC: 데스크톱 레이아웃 -->
    <template v-if="isPc">
      <EblTopBanner v-if="showTopBanner" />

      <!-- PC Header -->
      <EblAppbar />

      <!-- PC LNB -->
      <EblLnb />
    </template>

    <!-- MO: 모바일 레이아웃 -->
    <template v-else>
      <EblLandscapeOverlay v-if="showLandscapeOverlay" />

      <EblTopBannerMo v-if="showTopBanner && !showLandscapeOverlay" />

      <!-- Mobile NavDrawer -->
      <EblLnbMo v-model="isMobileNavOpen" />

      <!-- Mobile Appbar -->
      <EblAppbarMo v-if="!showLandscapeOverlay" @menu-click="toggleMobileNav" />
    </template>

    <!-- Main -->
    <VMain v-show="!showLandscapeOverlay" class="ebl-main-container">
      <slot />
    </VMain>

    <!-- 개발 도구 -->
    <PubDev v-if="showPubDev" />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '~/stores/useMainStore'
import EblAppbar from '~/components/layout/EblAppbar.vue'
import EblLnb from '~/components/layout/EblLnb.vue'
import EblAppbarMo from '~/components/layout/EblAppbarMo.vue'
import EblLnbMo from '~/components/layout/EblLnbMo.vue'
import EblLandscapeOverlay from '~/components/layout/EblLandscapeOverlay.vue'
import EblTopBanner from '~/components/layout/EblTopBanner.vue'
import EblTopBannerMo from '~/components/layout/EblTopBannerMo.vue'
import PubDev from '~/components/publish/PubDev.vue'

const route = useRoute()
const main = useMainStore()
const uiReady = ref(false)
const isMobileNavOpen = ref(false)
const viewportWidth = ref(0)
const viewportHeight = ref(0)
const hiddenPubDevScreenIds = ['EBLUGD040U']
const topBannerScreenIds = ['EBLCDB010U', 'EBLSDB010U', 'EBLBDB010U']

// PC/MO 판별
const normalizedRoutePath = computed(() => String(route.path || '').toLowerCase())
const isPc = computed(() => normalizedRoutePath.value.startsWith('/pc/ebl'))
const isMoEbl = computed(() => normalizedRoutePath.value.startsWith('/mo/ebl'))
const showLandscapeOverlay = computed(
  () => isMoEbl.value && viewportWidth.value > 0 && viewportWidth.value > viewportHeight.value,
)

const currentScreenId = computed(() => {
  const path = route.path || ''
  const lastSegment = path.split('/').filter(Boolean).pop() || ''
  return lastSegment.toUpperCase()
})

const showPubDev = computed(() => !hiddenPubDevScreenIds.includes(currentScreenId.value))
const isDashboardRoute = computed(() => topBannerScreenIds.includes(currentScreenId.value))
const showTopBanner = computed(
  () => isDashboardRoute.value && main.topBannerVisible && main.topBannerItems.length > 0,
)

// 모바일 네비게이션 토글
const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

const syncViewport = () => {
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
}

onMounted(async () => {
  // 0) 레이아웃이 살짝 튀는 현상을 제어하기 위한 스크립트
  // 1) Nuxt/Vue 마운트
  await nextTick()
  syncViewport()
  window.addEventListener('resize', syncViewport)
  window.addEventListener('orientationchange', syncViewport)
  // 2) 첫 paint 이후 Vuetify layout 계산 완료 시점
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      uiReady.value = true
    })
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewport)
  window.removeEventListener('orientationchange', syncViewport)
})
</script>

<style lang="scss" scoped>
.ebl-layout {
  height: 100dvh;
}
</style>
