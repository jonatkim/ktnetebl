<template>
  <VAppBar height="64" flat class="ebl-appbar">
    <div class="ebl-appbar__container">
      <div class="ebl-appbar__brand">
        <VAvatar variant="outlined" size="48" class="me-3 pa-2" color="#F5F7FA">
          <VImg :src="userTypeIconSrc" :max-width="24" cover alt="logo" />
        </VAvatar>
        <div class="ebl-appbar__title-wrap">
          <div class="ebl-appbar__company">Hyundai Merchant Marine Co. Ltd</div>
          <div class="ebl-appbar__user">Gil-Dong Hong</div>
        </div>
      </div>

      <div class="ebl-appbar__utils">
        <EblSelect
          v-model="selectLang"
          :options="langOptions"
          prepend-icon="ebli:global"
          class="me-2"
        />
        <VMenu
          v-model="isNotificationMenuOpen"
          location="bottom end"
          offset="28"
          :close-on-content-click="false"
          transition="scroll-y-transition"
        >
          <template #activator="{ props }">
            <EblBtn outlined icon class="btn-noti me-2" v-bind="props">
              <VIcon>ebli:notification-has-new</VIcon>
              <span class="badge">99+</span>
            </EblBtn>
          </template>

          <div class="ebl-notification-menu ebl-notification-menu--wrap">
            <div class="ebl-notification-menu__header">
              <h3>Notification</h3>
              <EblBtn icon outlined>
                <VIcon icon="ebli:setting" :size="16" />
              </EblBtn>
            </div>
            <div class="ebl-notification-menu__body">
              <div
                v-for="item in notificationItems"
                :key="item.id"
                class="ebl-notification-menu__card"
                :class="{ 'is-read': item.isRead }"
                @click="handleNotificationClick(item)"
              >
                <div class="ebl-notification-menu__card-head">
                  <EblAvatarLabel
                    :logo="item.logoSrc"
                    :icon="item.icon"
                    :title="item.title"
                    size="sm"
                  />
                  <div class="ebl-notification-menu__date">
                    {{ item.receivedAt }}
                  </div>
                  <span
                    v-if="!item.isRead"
                    class="ebl-notification-menu__badge"
                    aria-label="Unread notification"
                  />
                </div>
                <div class="ebl-notification-menu__message" v-html="item.message" />
              </div>
            </div>
          </div>
        </VMenu>
        <EblBtn outlined icon="ebli:menu" :class="{ 'is-active': isMenuOpen }" @click="toggleMenu">
          전체메뉴
        </EblBtn>
      </div>
    </div>
  </VAppBar>

  <Teleport to="body">
    <!-- 스크림 전환 -->
    <Transition name="ebl-global-menu-scrim">
      <div
        v-if="isMenuOpen"
        class="ebl-global-menu--scrim"
        :style="globalMenuLayoutStyle"
        @click="closeMenu"
      />
    </Transition>

    <!-- 메뉴 전환 -->
    <Transition name="ebl-global-menu-wrap">
      <div v-if="isMenuOpen" class="ebl-global-menu--wrap" :style="globalMenuLayoutStyle">
        <div class="ebl-global-menu__panel">
          <div class="ebl-global-menu__header">
            <template v-if="currentMenuTab === 'workspace'">
              <h3>
                Workspace
                <EblBtn icon="ebli:dashboard" large color="inverse" pill />
              </h3>
            </template>
            <template v-else-if="currentMenuTab === 'service'">
              <h3>
                Service
                <EblBtn icon="ebli:home" large color="inverse" pill />
              </h3>
            </template>
            <VSpacer />
            <div class="ebl-global-menu-tab" :class="`is-${currentMenuTab}`">
              <div class="ebl-global-menu-tab__inner">
                <div class="ebl-global-menu-tab__thumb" />
                <button
                  type="button"
                  :class="[
                    'ebl-global-menu-tab__option',
                    { 'ebl-global-menu-tab__option--active': currentMenuTab === 'workspace' },
                  ]"
                  @click="setCurrentMenuTab('workspace')"
                >
                  Workspace
                </button>
                <button
                  type="button"
                  :class="[
                    'ebl-global-menu-tab__option',
                    { 'ebl-global-menu-tab__option--active': currentMenuTab === 'service' },
                  ]"
                  @click="setCurrentMenuTab('service')"
                >
                  Service
                </button>
              </div>
            </div>
          </div>
          <div class="ebl-global-menu__body">
            <template v-if="currentMenuTab === 'workspace'">
              <div class="ebl-global-menu-grid">
                <div
                  v-for="section in workspaceMenuSections"
                  :key="section.id"
                  class="ebl-global-menu-grid__column"
                >
                  <button
                    v-if="section.path"
                    type="button"
                    class="ebl-global-menu-grid__title ebl-global-menu-grid__title--link"
                    @click="goToPath(section.path)"
                  >
                    {{ section.label }}
                  </button>
                  <h4 v-else class="ebl-global-menu-grid__title">
                    {{ section.label }}
                  </h4>
                  <div v-if="section.children?.length" class="ebl-global-menu-grid__list">
                    <button
                      v-for="item in section.children"
                      :key="item.id"
                      type="button"
                      class="ebl-global-menu-grid__link"
                      @click="goToPath(item.path)"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="currentMenuTab === 'service'">
              <div class="ebl-global-menu-grid">
                <div
                  v-for="section in serviceMenus"
                  :key="section.id"
                  class="ebl-global-menu-grid__column"
                >
                  <h4 class="ebl-global-menu-grid__title">
                    {{ section.label }}
                  </h4>
                  <div class="ebl-global-menu-grid__list">
                    <button
                      v-for="item in section.children"
                      :key="item.id"
                      type="button"
                      class="ebl-global-menu-grid__link"
                      @click="goToPath(item.path)"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="ebl-global-menu__footer">
            <button
              type="button"
              class="ebl-global-menu__footer-link"
              @click="goToPath('/PSM/PLC/PSMPLC010U')"
            >
              Privacy Policy
            </button>
            <VSpacer />
            <EblBtn color="ghost" @click="closeMenu"> Logout </EblBtn>
          </div>
          <!-- 메가 메뉴 내부 구조는 새 디자인 기준으로 다시 조립한다. -->
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed, ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '~/stores/useMainStore'
import userTypeShipIcon from '~/assets/images/icons/ebli/user_type_ship.svg?url'
import userTypeBankIcon from '~/assets/images/icons/ebli/user_type_bank.svg?url'
import userTypeContainerIcon from '~/assets/images/icons/ebli/user_type_container.svg?url'

const { locale } = useI18n()
const mainStore = useMainStore()
const router = useRouter()

const langOptions = [
  { label: 'KO', value: 'ko' },
  { label: 'EN', value: 'en' },
]

const selectLang = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value
  },
})

const currentMenuTab = ref('workspace')
const isNotificationMenuOpen = ref(false)

// 알림 목록은 추후에 API요청 및 스토어로 관리 해야될것 같아요.
const notificationItems = [
  {
    id: 'notification-1',
    title: 'Hyundai Merchant Marine',
    message: 'An <em>invitation</em> has been sent to Hyundai Merchant Marine',
    receivedAt: '2026-04-07',
    isRead: false,
    logoSrc: '/images/sample/ktnet_logo.png',
    icon: '',
  },
  {
    id: 'notification-2',
    title: 'Requested',
    message: '<em>[BOL] DKJHFKH373GFVG</em> Switch to Paper Requested. (By: {이름} / {화주})',
    receivedAt: '2026-04-07',
    isRead: false,
    logoSrc: '',
    icon: 'ebli:sent',
  },
  {
    id: 'notification-3',
    title: 'Amendment Requested',
    message:
      '<em>[BOL] DKJHFKH373GFVG</em> Surrender for Amendment Requested. (By: {이름} / {화주})',
    receivedAt: '2026-04-06',
    isRead: true,
    logoSrc: '',
    icon: 'ebli:sent',
  },
  {
    id: 'notification-4',
    title: 'Q&A',
    message: 'A reply has been posted to your <em>Q&amp;A</em> inquiry.',
    receivedAt: '2026-04-05',
    isRead: true,
    logoSrc: '',
    icon: 'ebli:question',
  },
  {
    id: 'notification-5',
    title: 'Issued',
    message: '<em>[BOL] DKJHFKH373GFVG</em> BL Issued to {선사}. (By: {이름})',
    receivedAt: '2026-04-04',
    isRead: true,
    logoSrc: '',
    icon: 'ebli:sent',
  },
  {
    id: 'notification-6',
    title: 'Issued',
    message: '<em>[BOL] DKJHFKH373GFVG</em> BL Issued to {선사}. (By: {이름})',
    receivedAt: '2026-04-04',
    isRead: true,
    logoSrc: '',
    icon: 'ebli:sent',
  },
  {
    id: 'notification-7',
    title: 'Issued',
    message: '<em>[BOL] DKJHFKH373GFVG</em> BL Issued to {선사}. (By: {이름})',
    receivedAt: '2026-04-04',
    isRead: true,
    logoSrc: '',
    icon: 'ebli:sent',
  },
]

// 공통 메뉴 섹션
const commonManageSection = {
  id: 'manage',
  label: 'Manage',
  path: null,
  children: [
    { id: 'EBLPAT010U', label: 'MY Partners', path: '/pc/EBL/PAT/EBLPAT010U' },
    { id: 'EBLSUB010U', label: 'Sub Users', path: '/pc/EBL/SUB/EBLSUB010U' },
    { id: 'EBLPAY010U', label: 'Payments', path: '/pc/EBL/PAY/EBLPAY010U' },
  ],
}

const commonHelpDeskSection = {
  id: 'helpdesk',
  label: 'Help Desk',
  path: null,
  children: [
    { id: 'EBLUGD080U', label: 'Notices', path: '/pc/EBL/UGD/EBLUGD080U' },
    { id: 'EBLUGD020U', label: 'FAQ', path: '/pc/EBL/UGD/EBLUGD020U' },
    { id: 'EBLUGD030U', label: 'Resources', path: '/pc/EBL/UGD/EBLUGD030U' },
    { id: 'EBLUGD040U', label: 'Q&A', path: '/pc/EBL/UGD/EBLUGD040U' },
  ],
}

const isMenuOpen = ref(false)
const globalMenuLayoutTop = ref('64px')
const activeUserType = computed(() => mainStore.userType)
const globalMenuLayoutStyle = computed(() => ({
  '--v-layout-top': globalMenuLayoutTop.value,
}))
// 사용자 회사 로고가 있으면 로고가 표시되도록, 없으면 사용자 유형 아이콘이 표시되도록 한다.
const userTypeIconSrc = computed(() => {
  switch (activeUserType.value) {
    case 'carrier':
      return userTypeShipIcon
    case 'bank':
      return userTypeBankIcon
    case 'shipper':
    default:
      return userTypeContainerIcon
  }
})

// 메가 메뉴는 화면별 원본 메뉴와 별도로, 디자인에 맞는 컬럼 구조를 직접 정의한다.
const workspaceMenuSections = computed(() => {
  if (activeUserType.value === 'carrier') {
    return [
      { id: 'dashboard', label: 'Dashboard', path: '/pc/EBL/CDB/EBLCDB010U', children: [] },
      {
        id: 'documents',
        label: 'Documents',
        path: null,
        children: [
          { id: 'EBLCDC050U', label: 'Sent', path: '/pc/EBL/CDC/EBLCDC050U' },
          { id: 'EBLCDC060U', label: 'Draft', path: '/pc/EBL/CDC/EBLCDC060U' },
          { id: 'EBLCDC070U', label: 'Incoming', path: '/pc/EBL/CDC/EBLCDC070U' },
          { id: 'EBLCDC080U', label: 'Archive', path: '/pc/EBL/CDC/EBLCDC080U' },
        ],
      },
      {
        id: 'account',
        label: 'Account',
        path: null,
        children: [
          { id: 'EBLSET010U', label: 'My Profile', path: '/pc/EBL/SET/EBLSET010U' },
          { id: 'EBLSET030U', label: 'My Company', path: '/pc/EBL/SET/EBLSET030U' },
          { id: 'EBLSUB010U', label: 'Users Log', path: '/pc/EBL/SUB/EBLSUB010U' },
        ],
      },
      {
        id: 'management',
        label: 'Management',
        path: null,
        children: [
          { id: 'EBLPAT010U', label: 'Partners', path: '/pc/EBL/PAT/EBLPAT010U' },
          { id: 'EBLPAY010U', label: 'Payments', path: '/pc/EBL/PAY/EBLPAY010U' },
          { id: 'EBLCST070U', label: 'Carrier Management', path: '/pc/EBL/CST/EBLCST070U' },
        ],
      },
      {
        id: 'setting-column',
        label: 'Setting',
        path: null,
        children: [
          { id: 'EBLFAV010U', label: 'Favorites', path: '/pc/EBL/FAV/EBLFAV010U' },
          { id: 'EBLSET040U', label: 'Notification Settings', path: '/pc/EBL/SET/EBLSET040U' },
        ],
      },
      {
        id: 'helpdesk-column',
        label: 'Help Desk',
        path: null,
        children: [
          { id: 'EBLUGD080U', label: 'Notices', path: '/pc/EBL/UGD/EBLUGD080U' },
          { id: 'EBLUGD020U', label: 'FAQ', path: '/pc/EBL/UGD/EBLUGD020U' },
          { id: 'EBLUGD040U', label: 'Q&A', path: '/pc/EBL/UGD/EBLUGD040U' },
          { id: 'EBLUGD050U', label: 'Download', path: '/pc/EBL/UGD/EBLUGD050U' },
        ],
      },
    ]
  }

  if (activeUserType.value === 'shipper') {
    return [
      { id: 'dashboard', label: 'Dashboard', path: '/pc/EBL/SDB/EBLSDB010U', children: [] },
      {
        id: 'documents',
        label: 'Documents',
        path: null,
        children: [
          { id: 'EBLDOC030U', label: 'Inbox', path: '/pc/EBL/DOC/EBLDOC030U' },
          { id: 'EBLDOC100U', label: 'Sent', path: '/pc/EBL/DOC/EBLDOC100U' },
          { id: 'EBLDOC110U', label: 'Draft', path: '/pc/EBL/DOC/EBLDOC110U' },
          { id: 'EBLDOC130U', label: 'Incoming', path: '/pc/EBL/DOC/EBLDOC130U' },
          { id: 'EBLDOC120U', label: 'Archive', path: '/pc/EBL/DOC/EBLDOC120U' },
        ],
      },
      {
        id: 'enego',
        label: 'eNego Managements',
        path: null,
        children: [
          { id: 'EBLNEG010U', label: 'eNego List', path: '/pc/EBL/NEG/EBLNEG010U' },
          { id: 'EBLNEG030U', label: 'Presentation', path: '/pc/EBL/NEG/EBLNEG030U' },
        ],
      },
      {
        id: 'setting',
        label: 'Setting',
        path: null,
        children: [
          { id: 'EBLSET010U', label: 'My profile', path: '/pc/EBL/SET/EBLSET010U' },
          { id: 'EBLSET020U', label: 'Carrier ID Mapping', path: '/pc/EBL/SET/EBLSET020U' },
          { id: 'EBLFAV010U', label: 'Favorites', path: '/pc/EBL/FAV/EBLFAV010U' },
        ],
      },
      {
        id: 'manage',
        label: 'Manage',
        path: null,
        children: [...commonManageSection.children],
      },
      {
        id: 'helpdesk',
        label: 'Help Desk',
        path: null,
        children: [...commonHelpDeskSection.children],
      },
    ]
  }

  if (activeUserType.value === 'bank') {
    return [
      { id: 'dashboard', label: 'Dashboard', path: '/pc/EBL/BDB/EBLBDB010U', children: [] },
      {
        id: 'documents',
        label: 'Documents',
        path: null,
        children: [
          { id: 'EBLDOC030U', label: 'Inbox', path: '/pc/EBL/DOC/EBLDOC030U' },
          { id: 'EBLDOC110U', label: 'Draft', path: '/pc/EBL/DOC/EBLDOC110U' },
          { id: 'EBLDOC100U', label: 'Sent', path: '/pc/EBL/DOC/EBLDOC100U' },
          { id: 'EBLDOC130U', label: 'Incoming', path: '/pc/EBL/DOC/EBLDOC130U' },
          { id: 'EBLDOC120U', label: 'Archive', path: '/pc/EBL/DOC/EBLDOC120U' },
        ],
      },
      {
        id: 'enego',
        label: 'eNego Managements',
        path: null,
        children: [
          { id: 'EBLNEG010U', label: 'eNego List', path: '/pc/EBL/NEG/EBLNEG010U' },
          { id: 'EBLNEG030U', label: 'Presentation', path: '/pc/EBL/NEG/EBLNEG030U' },
        ],
      },
      {
        id: 'setting',
        label: 'Setting',
        path: null,
        children: [
          { id: 'EBLSET010U', label: 'My profile', path: '/pc/EBL/SET/EBLSET010U' },
          { id: 'EBLSET020U', label: 'Carrier ID Mapping', path: '/pc/EBL/SET/EBLSET020U' },
          { id: 'EBLFAV010U', label: 'Favorites', path: '/pc/EBL/FAV/EBLFAV010U' },
        ],
      },
      {
        id: 'manage',
        label: 'Manage',
        path: null,
        children: [...commonManageSection.children],
      },
      {
        id: 'helpdesk',
        label: 'Help Desk',
        path: null,
        children: [...commonHelpDeskSection.children],
      },
    ]
  }

  return []
})

// Service 탭은 최신 디자인 기준의 컬럼 그룹 구조를 그대로 사용한다.
const serviceMenus = [
  {
    id: 'solutions',
    label: 'Solutions',
    children: [
      { id: 'PSMSOL010U-1', label: 'Digital Axis', path: '/PSM/SOL/PSMSOL010U' },
      {
        id: 'PSMSOL010U-2',
        label: 'Electronic Bill of Landing',
        path: '/PSM/SOL/PSMSOL010U',
      },
      { id: 'PSMSOL010U-3', label: 'Negotiation', path: '/PSM/SOL/PSMSOL010U' },
      { id: 'PSMSOL010U-4', label: 'Presentation', path: '/PSM/SOL/PSMSOL010U' },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    children: [
      { id: 'PSMPLT010U-1', label: 'Technology', path: '/PSM/PLT/PSMPLT010U' },
      { id: 'PSMPLT010U-2', label: 'Payments', path: '/PSM/PLT/PSMPLT010U' },
      {
        id: 'PSMPLT010U-3',
        label: 'Industrial Standards',
        path: '/PSM/PLT/PSMPLT010U',
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    children: [
      { id: 'PSMRSC010U-1', label: 'FAQ', path: '/PSM/RSC/PSMRSC010U' },
      { id: 'PSMRSC010U-2', label: 'Tutorials', path: '/PSM/RSC/PSMRSC010U' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    children: [
      { id: 'PSMABU010U-1', label: 'About KTNET', path: '/PSM/ABU/PSMABU010U' },
      { id: 'PSMCTU010U-1', label: 'Contact US', path: '/PSM/CTU/PSMCTU010U' },
    ],
  },
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleNotificationClick = (item) => {
  console.log('notification-click', item)
  isNotificationMenuOpen.value = false
}

const setCurrentMenuTab = (tab) => {
  currentMenuTab.value = tab
}

const goToPath = async (path) => {
  if (!path) return
  closeMenu()
  await router.push(path)
}

const syncGlobalMenuLayoutTop = () => {
  if (!import.meta.client) return
  const mainEl = document.querySelector('main.v-main')
  const layoutTop = mainEl ? getComputedStyle(mainEl).getPropertyValue('--v-layout-top').trim() : ''
  globalMenuLayoutTop.value = layoutTop || '64px'
}

watch(isMenuOpen, async (open) => {
  if (!open) return
  await nextTick()
  syncGlobalMenuLayoutTop()
})

watch(
  () => mainStore.topBannerVisible,
  async () => {
    if (!isMenuOpen.value) return
    await nextTick()
    syncGlobalMenuLayoutTop()
  },
)
</script>
