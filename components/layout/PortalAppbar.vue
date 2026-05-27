<template>
  <div ref="appbarRootRef">
    <!-- Mobile: LNB drawer -->
    <EblLnbMo v-if="isMobile" v-model="isDrawerOpen" />

    <VAppBar
      floating
      :height="appbarHeight"
      flat
      scroll-behavior="hide"
      scroll-threshold="100"
      extension-height="0"
      :class="['portal-appbar', ...appbarClasses]"
    >
      <div class="portal-appbar__inner">
        <NuxtLink to="/portal/hom/PSMHOM010U" class="portal-appbar__brand" aria-label="EBLK home">
          <VImg
            :src="appbarLogoSrc"
            alt="EBLK Logo"
            width="120"
            height="40"
            class="portal-appbar__logo"
          />
        </NuxtLink>

        <template v-if="isMobile">
          <EblBtn icon color="ghost" class="btn-drawer" @click="toggleDrawer">
            <VIcon icon="ebli:menu-line" :size="24" />
          </EblBtn>
        </template>

        <template v-else>
          <nav class="portal-appbar__nav" aria-label="Primary">
            <div v-for="menu in menus" :key="menu.key" class="portal-appbar__nav-item">
              <button type="button" class="portal-appbar__nav-btn" @click="toggleMenu(menu.key)">
                {{ menu.label }}
              </button>
            </div>
          </nav>

          <div class="portal-appbar__utils">
            <EblSelect
              v-model="currentLocale"
              :outlined="false"
              :options="[
                { label: 'EN', value: 'en' },
                { label: 'KO', value: 'ko' },
              ]"
              prepend-icon="ebli:global"
              class="ebl-lang-select"
              menu-class="ebl-lang-menu"
            />
            <span class="portal-appbar__util-dot" aria-hidden="true">&ZeroWidthSpace;</span>
            <NuxtLink to="/portal/reg/PSMREG010U" class="portal-appbar__util-link"
              >Register</NuxtLink
            >
            <span class="portal-appbar__util-dot" aria-hidden="true">&ZeroWidthSpace;</span>
            <NuxtLink to="/" class="portal-appbar__util-link">Workspace</NuxtLink>
          </div>
        </template>
      </div>

      <!-- Extension: Megamenu -->
      <template #extension>
        <VExpandTransition>
          <div v-if="isSubmenuOpen && !isMobile" class="portal-appbar-megamenu">
            <div class="portal-appbar-megamenu__inner">
              <!-- 화면에는 보이지 않지만 양쪽여백을 맞추기 위한 ghost 요소 -->
              <div
                class="portal-appbar-megamenu__ghost portal-appbar-megamenu__ghost--brand"
                aria-hidden="true"
              >
                <VImg
                  :src="appbarLogoSrc"
                  alt="EBLK Logo"
                  width="120"
                  height="40"
                  class="portal-appbar__logo"
                />
              </div>

              <div class="portal-appbar-megamenu__wrap">
                <section
                  v-for="menu in menus"
                  :key="menu.key"
                  class="portal-appbar-megamenu__group"
                  :class="{ 'is-active': activeMenuKey === menu.key }"
                >
                  <ul class="portal-appbar-megamenu__list">
                    <li v-for="item in menu.items" :key="item.label">
                      <NuxtLink
                        :to="item.to"
                        class="portal-appbar-megamenu__link"
                        @click="closeSubmenu"
                      >
                        {{ item.label }}
                      </NuxtLink>
                    </li>
                  </ul>
                </section>
              </div>
              <!-- 화면에는 보이지 않지만 양쪽여백을 맞추기 위한 ghost 요소 -->
              <div
                class="portal-appbar-megamenu__ghost portal-appbar-megamenu__ghost--utils"
                aria-hidden="true"
              >
                <div class="portal-appbar__utils">
                  <EblSelect
                    v-model="currentLocale"
                    :outlined="false"
                    :options="[
                      { label: 'EN', value: 'en' },
                      { label: 'KO', value: 'ko' },
                    ]"
                    prepend-icon="ebli:global"
                    class="ebl-lang-select"
                    menu-class="ebl-lang-menu"
                  />
                  <span class="portal-appbar__util-dot" aria-hidden="true">&ZeroWidthSpace;</span>
                  <span class="portal-appbar__util-link">Register</span>
                  <span class="portal-appbar__util-dot" aria-hidden="true">&ZeroWidthSpace;</span>
                  <span class="portal-appbar__util-link">Workspace</span>
                </div>
              </div>
            </div>
          </div>
        </VExpandTransition>
      </template>
    </VAppBar>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import EblLnbMo from '~/components/layout/EblLnbMo.vue'
import { useMainStore } from '~/stores/useMainStore'
import { watch, computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useLocale } from '~/composables/useLocale'
import appbarLogoLight from '~/assets/images/common/eblk.svg?url'
import appbarLogoDark from '~/assets/images/common/eblk_dark.svg?url'

const { smAndDown } = useDisplay()
const isMobile = smAndDown // 모바일 여부
const appbarHeight = computed(() => (isMobile.value ? 56 : 93)) // 앱바 높이
const mainStore = useMainStore() // Pinia 메인스토어
const { locale, setLocale } = useLocale() // 전역 다국어 상태

// 앱바 테마(라이트/다크)는 store에서 직접 가져옴
const appbarTheme = computed(() => mainStore.portalAppbarTheme)
// 앱바 인버트(반전) 상태
const appbarInvert = computed(() => mainStore.portalAppbarInvert)
// 앱바 반전 상태까지 반영해 최종 로고 라이트/다크 버전을 선택한다.
const appbarLogoSrc = computed(() => {
  const isDarkLogo = appbarInvert.value
    ? appbarTheme.value !== 'dark'
    : appbarTheme.value === 'dark'
  return isDarkLogo ? appbarLogoDark : appbarLogoLight
})
// 상단 고정 여부(투명도 처리용)
const isAtTop = ref(true)

// 앱바 클래스: 테마/인버트/투명
const appbarClasses = computed(() => {
  const classes = [`is-${appbarTheme.value}`]
  if (appbarInvert.value) classes.push('is-invert')
  if (isAtTop.value && !isSubmenuOpen.value) classes.push('is-transparent')
  return classes
})

const isDrawerOpen = ref(false) // 모바일 LNB 드로어
const activeMenuKey = ref(null) // 활성화된 메가메뉴
const appbarRootRef = ref(null) // 앱바 루트 ref
const currentLocale = computed({
  get: () => locale.value,
  set: (value) => {
    void setLocale(value)
  },
}) // 포털 언어 선택 상태(ko/en)

// 앱바 메뉴 목록
const menus = ref([
  {
    key: 'solutions',
    label: 'Solutions',
    items: [
      { label: 'Digital Axis', to: '/portal/sol/PSMSOL010U' },
      { label: 'Electronic B/L', to: '/portal/sol/PSMSOL020U' },
      { label: 'Negotiation', to: '/portal/sol/PSMSOL030U' },
      { label: 'Presentation', to: '/portal/sol/PSMSOL040U' },
    ],
  },
  {
    key: 'platform',
    label: 'Platform',
    items: [
      { label: 'Technology', to: '/portal/plt/PSMPLT010U' },
      { label: 'Security', to: '/portal/plt/PSMPLT020U' },
      { label: 'Industrial Standards', to: '/portal/plt/PSMPLT030U' },
    ],
  },
  {
    key: 'resources',
    label: 'Resources',
    items: [
      { label: 'FAQ', to: '/portal/rsc/PSMRSC010U' },
      { label: 'Tutorials', to: '/portal/rsc/PSMRSC020U' },
    ],
  },
  {
    key: 'company',
    label: 'Company',
    items: [
      { label: 'About KTNET', to: '/portal/cpn/PSMCPN010U' },
      { label: 'Contact Us', to: '/portal/cpn/PSMCPN020U' },
    ],
  },
])

// 메가메뉴 오픈 여부
const isSubmenuOpen = computed(() => activeMenuKey.value !== null)

// 모바일 LNB 드로어 토글
const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}
// 메가메뉴 토글
const toggleMenu = (key) => {
  activeMenuKey.value = activeMenuKey.value === key ? null : key
}
// 메가메뉴 닫기
const closeSubmenu = () => {
  activeMenuKey.value = null
}
// 스크롤 이벤트 핸들러: 최상단 여부 갱신 및 스크롤 시 메가메뉴 닫기
const handleScroll = () => {
  isAtTop.value = window.scrollY <= 0
  if (activeMenuKey.value !== null) {
    closeSubmenu()
  }
}

// 앱바 외부 클릭 시 메가메뉴 닫기
const handleClickOutside = (event) => {
  if (!appbarRootRef.value) return
  if (appbarRootRef.value.contains(event.target)) return
  closeSubmenu()
}

// 모바일 전환 시 메가메뉴 닫기
watch(isMobile, (mobile) => {
  if (mobile) {
    closeSubmenu()
  }
})

// 스크롤/클릭 이벤트 등록

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
})

// 이벤트 해제
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>
