<template>
  <VLayout v-show="uiReady">
    <!-- App Header -->
    <VAppBar color="black" height="52" scroll-behavior="hide" flat class="pub-appbar">
      <template #prepend>
        <VImg src="~/assets/images/common/eblk_dark.svg?url=" alt="ktnet" class="logo-ktnet" />
      </template>
      <VTabs
        v-model="activeTab"
        class="pub-appbar-gnb"
        height="52"
        @update:model-value="onTabChange"
      >
        <VTab value="dashboard" :ripple="false" title="대시보드">
          <VIcon size="large">mdi-view-dashboard-outline</VIcon>
        </VTab>
        <VTab value="components" :ripple="false" title="컴포넌트">
          <VIcon size="large">mdi-puzzle-outline</VIcon>
        </VTab>
        <VTab value="documents" :ripple="false" title="가이드">
          <VIcon size="large">mdi-book-open-page-variant-outline</VIcon>
        </VTab>
      </VTabs>
      <template #append>
        <VBtn
          variant="text"
          aria-label="Wunderface 홈으로 이동"
          href="https://www.wunderface.com"
          target="_blank"
          rel="noopener"
          class="px-0 mr-n2"
        >
          <LogoWaSvg class="logo-wa" alt="wunderface" />
        </VBtn>
      </template>
    </VAppBar>

    <!-- LNB: 대시보드 탭이 아닐 때만 표시 -->
    <PubLnb v-if="activeTab === 'components'" />

    <!-- Main -->
    <VMain class="pub-main">
      <slot />
    </VMain>
  </VLayout>
</template>

<script setup>
import PubLnb from '~/components/layout/PubLnb.vue'
import LogoWaSvg from '~/assets/images/guide/logo_wa.svg'

const router = useRouter()
const route = useRoute()

const uiReady = ref(false)
onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      uiReady.value = true
    })
  })
})

// 탭 상태: URL에 따라 결정
const activeTab = computed({
  get() {
    if (route.path === '/publish/guide/dashboard') return 'dashboard'
    if (route.path === '/publish/guide/documents') return 'documents'
    if (route.path.startsWith('/publish/guide')) return 'components'
    return 'documents'
  },
  set(value) {
    onTabChange(value)
  },
})

function onTabChange(tab) {
  if (tab === 'dashboard') router.push('/publish/guide/dashboard')
  else if (tab === 'components') router.push('/publish/guide/buttons')
  else router.push('/publish/guide/documents')
}
</script>

<style lang="scss" scoped></style>
