<template>
  <div class="ebl-page-container">
    <div class="ebl-notification-list ebl-notification-list--wrap">
      <div
        v-for="item in notificationItems"
        :key="item.id"
        class="ebl-notification-list__item"
        :class="{ 'is-read': item.isRead }"
        @click="handleNotificationClick(item)"
      >
        <div class="ebl-notification-list__head">
          <EblAvatarLabel :logo="item.logoSrc" :icon="item.icon" :title="item.title" size="sm" />
          <div class="ebl-notification-list__date">
            {{ item.receivedAt }}
          </div>
          <span
            v-if="!item.isRead"
            class="ebl-notification-list__badge"
            aria-label="Unread notification"
          />
        </div>
        <div class="ebl-notification-list__message" v-html="item.message" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppbarStore } from '~/stores/useAppbarStore'

// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'detail',
  appbarTitle: 'Notifications',
})

const router = useRouter()
const appbar = useAppbarStore()

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

onMounted(() => {
  appbar.setAppendButtons([
    {
      id: 'notification-settings',
      icon: 'ebli:setting',
      color: 'ghost',
      ariaLabel: '알림 설정',
      onClick: () => {
        router.push('/mo/ebl/cst/EBLCST090U')
      },
    },
  ])
})

onBeforeUnmount(() => {
  appbar.clearAppendButtons()
})

const handleNotificationClick = (item) => {
  console.log('notification-click', item)
}
</script>
