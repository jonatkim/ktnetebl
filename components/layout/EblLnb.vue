<template>
  <VNavigationDrawer
    v-model="main.lnbVisible"
    class="ebl-lnb"
    width="240"
    elevation="0"
    permanent
    @update:model-value="(v) => main.setLnbVisible(v)"
  >
    <VList nav dense class="ebl-lnb__section">
      <VListItem
        :active="currentPath === dashboardPath"
        class="ebl-lnb__item"
        :ripple="false"
        prepend-icon="ebli:dashboard"
        @click="select('dashboard')"
      >
        <VListItemTitle>Dashboard</VListItemTitle>
      </VListItem>
      <VListSubheader>
        {{ activeUserType === 'carrier' ? 'B/L' : 'Envelope' }}
      </VListSubheader>
      <VListItem
        v-for="item in computedWorkgroup"
        :key="item.id"
        :active="currentPath === item.path"
        class="ebl-lnb__item"
        :ripple="false"
        :prepend-icon="item.icon"
        @click="select(item.id)"
      >
        <VListItemTitle>{{ item.title }}</VListItemTitle>
        <template v-if="item.count" #append>
          <span class="count">{{ item.count }}</span>
        </template>
      </VListItem>
      <VListSubheader>Favorite</VListSubheader>
      <VListItem
        v-for="item in computedFavorites"
        :key="item.id"
        :active="currentPath === item.path"
        class="ebl-lnb__item"
        :ripple="false"
        :prepend-icon="item.icon"
        @click="select(item.id)"
      >
        <VListItemTitle>{{ item.title }}</VListItemTitle>
        <template v-if="item.count" #append>
          <span class="count">{{ item.count }}</span>
        </template>
      </VListItem>
    </VList>

    <template #append>
      <div class="ebl-lnb__quick-actions">
        <EblBtn large prepend-icon="ebli:plus" class="btn-quick-action" @click="onQuickAction">
          {{ activeUserType === 'carrier' ? 'Create B/L' : 'Compose' }}
        </EblBtn>
      </div>
      <div class="ebl-lnb__footer">
        <VList nav dense class="ebl-lnb__section">
          <VListItem
            class="ebl-lnb__item"
            :ripple="false"
            prepend-icon="ebli:settings2"
            @click="onSettings"
          >
            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>
        </VList>
        <VDivider />
        <div class="ebl-lnb__copyright">&copy; EBL Korea</div>
      </div>
    </template>
  </VNavigationDrawer>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '~/stores/useMainStore'
import { usePubStore } from '~/stores/usePubStore'

const router = useRouter()
const main = useMainStore()
const pubStore = usePubStore()
const activeUserType = computed(() => main.userType)

// 현재 라우트 경로
const currentPath = computed(() => router.currentRoute.value.path)

// 사용자 타입별 대시보드 경로
const dashboardPath = computed(() => {
  switch (activeUserType.value) {
    case 'carrier':
      return '/pc/ebl/cdb/EBLCDB010U'
    case 'shipper':
      return '/pc/ebl/sdb/EBLSDB010U'
    case 'bank':
      return '/pc/ebl/bdb/EBLBDB010U'
    default:
      return '/pc/ebl/cdb/EBLCDB010U'
  }
})

// 사용자 타입별 작업 그룹 메뉴 (선사: B/L 관련 / 화주: Envelope 관련)
const computedWorkgroup = computed(() => {
  return activeUserType.value === 'carrier' ? workgroupByCarrier : workgroupByShipper
})

// 선사용 작업 그룹 메뉴
const workgroupByCarrier = [
  { id: 'EBLDOC100U', title: 'Sent', icon: 'ebli:sent', path: '/pc/ebl/doc/EBLDOC100U', count: 3 },
  {
    id: 'EBLDOC110U',
    title: 'Draft',
    icon: 'ebli:draft',
    path: '/pc/ebl/doc/EBLDOC110U',
    count: 0,
  },
  {
    id: 'EBLDOC130U',
    title: 'Incoming',
    icon: 'ebli:incoming',
    path: '/pc/ebl/doc/EBLDOC130U',
    count: 0,
  },
  {
    id: 'EBLDOC120U',
    title: 'Archive',
    icon: 'ebli:archive',
    path: '/pc/ebl/doc/EBLDOC120U',
    count: 15,
  },
]

// 화주/은행용 작업 그룹 메뉴
const workgroupByShipper = [
  {
    id: 'EBLDOC030U',
    title: 'Inbox',
    icon: 'ebli:inbox',
    path: '/pc/ebl/doc/EBLDOC030U',
    count: 3,
  },
  {
    id: 'EBLDOC110U',
    title: 'Draft',
    icon: 'ebli:draft',
    path: '/pc/ebl/doc/EBLDOC110U',
    count: 0,
  },
  { id: 'EBLDOC100U', title: 'Sent', icon: 'ebli:sent', path: '/pc/ebl/doc/EBLDOC100U', count: 0 },
  {
    id: 'EBLDOC130U',
    title: 'Incoming',
    icon: 'ebli:incoming',
    path: '/pc/ebl/doc/EBLDOC130U',
    count: 0,
  },
  {
    id: 'EBLDOC120U',
    title: 'Archive',
    icon: 'ebli:archive',
    path: '/pc/ebl/doc/EBLDOC120U',
    count: 15,
  },
]

// 동적 즐겨찾기 메뉴 - 사용자가 설정한 메뉴 기반
const computedFavorites = computed(() => {
  console.log('main.favorites:', main.favorites)
  const result = main.favorites
    .map((screenId) => {
      const menu = pubStore.pubMenus.find((m) => m.screenId === screenId)
      console.log(`screenId: ${screenId}, found: ${!!menu}`)
      if (!menu) return null
      // screenId에서 폴더명 추출: EBLPAT010U -> pat, EBLSUB010U -> sub
      const folderCode = screenId.substring(3, 6).toLowerCase()
      // levels 배열에서 마지막 항목을 화면명으로 사용
      const screenName =
        menu.levels && menu.levels.length > 0 ? menu.levels[menu.levels.length - 1] : menu.name
      return {
        id: menu.screenId,
        title: screenName,
        icon: 'ebli:favorite',
        path: `/pc/ebl/${folderCode}/${screenId}`,
        count: 0,
      }
    })
    .filter(Boolean)
  console.log('computedFavorites result:', result)
  return result
})

function select(key) {
  // 대시보드 선택 시 사용자 타입별 경로로 이동
  if (key === 'dashboard') {
    try {
      const resolved = router.resolve(dashboardPath.value)
      if (resolved && resolved.name !== undefined) {
        router.push(dashboardPath.value)
      } else {
        console.warn(`Route not found for: ${dashboardPath.value}`)
      }
    } catch (error) {
      console.warn(`Error navigating to: ${dashboardPath.value}`, error)
    }
    return
  }

  // 선택된 항목의 path 찾기
  const allItems = [...computedWorkgroup.value, ...computedFavorites.value]

  const selectedItem = allItems.find((item) => item.id === key)

  if (selectedItem && selectedItem.path) {
    try {
      const resolved = router.resolve(selectedItem.path)
      if (resolved && resolved.name !== undefined) {
        router.push(selectedItem.path)
      } else {
        console.warn(`Route not found for: ${selectedItem.path}`, selectedItem)
      }
    } catch (error) {
      console.warn(`Error navigating to: ${selectedItem.path}`, error)
    }
  } else {
    console.warn(`Path not defined for item: ${key}`)
  }
}

function onQuickAction() {
  console.log('Create B/L clicked')
}

function onSettings() {
  console.log('Settings clicked')
}
</script>
