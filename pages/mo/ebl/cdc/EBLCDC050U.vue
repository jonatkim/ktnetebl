<template>
  <div class="ebl-page-container pt-0">
    <EblTabs
      v-model="activeTab"
      v-sticky="32"
      :items="[
        { label: 'ALL', value: 'all' },
        { label: 'ISSUED', value: 'issued' },
        { label: 'AMENDING', value: 'amending' },
        { label: 'SWITCHING', value: 'switching' },
        { label: 'DELIVERY', value: 'delivery' },
        { label: 'PENDING', value: 'pending' },
        { label: 'VOIDED', value: 'voided' },
      ]"
      no-wrap
      class="mx-n6 pt-6 px-6 mb-6"
    />
    <EblSubHeader>
      <h2>Total</h2>
      <span class="count">{{ totalCount }}</span>
      <template #util>
        <EblBtn icon="ebli:filter2" outlined @click="openFilter" />
      </template>
    </EblSubHeader>

    <div class="ebl-card-list">
      <div v-if="filteredItems.length === 0" class="ebl-card-item__empty">
        <VImg src="~/assets/images/common/not_result_found.png" width="150" height="74" />
        <h3>No results found</h3>
        <p>
          No data matches your current filter settings.<br />
          Please try adjusting your filters or date range.
        </p>
      </div>
      <EblCardItem
        v-for="item in visibleItems"
        :key="item.id"
        :item="item"
        @bl-no:click="goToDetail"
      />
    </div>

    <div v-if="showMore" class="ebl-more-list ebl-more-list--wrap">
      <EblBtn
        v-if="!isLoadingMore"
        block
        class="ebl-more-list__btn"
        append-icon="ebli:chevron-bottom"
        @click="loadMore"
      >
        More ({{ currentCount }} / {{ totalCount }})
      </EblBtn>
      <div v-else class="ebl-more-list__loading">
        <Vue3Lottie animation-link="/lottie/loadingSpinner.json" :height="60" :width="120" />
      </div>
    </div>

    <EblFilterBottomSheet
      v-model="showFilter"
      v-model:filter-value="appliedFilter"
      title="Filter"
      query-place-holder="Search Company Name, B/L No"
      date-label="Sent Date"
      @filter:apply="onFilterApply"
      @filter:reset="onFilterReset"
    >
      <template #filters="{ pending }">
        <div class="ebl-filter-dialog__section">
          <EblInfoItem label="Cargo Type" vertical has-input>
            <EblSelect 
              v-model="pending.cargoType" 
              block 
              :options="[
                { label: 'All Cargo', value: '' },
                { label: 'DG', value: 'dg' }
              ]" 
            />
          </EblInfoItem>
        </div>
      </template>
    </EblFilterBottomSheet>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'sub',
  appbarTitle: 'Sent',
})

// ============================================
// Router 설정
// ============================================
const router = useRouter()

// ============================================
// 상태 데이터
// ============================================
const activeTab = ref('all')
const pageSize = 10
const currentCount = ref(pageSize)
const isLoadingMore = ref(false)
const showFilter = ref(false)

const appliedFilter = ref({
  query: '',
  status: '',
  cargoType: '',
  range: {
    from: '',
    to: '',
  },
})

// ============================================
// 필터 관련 메서드
// ============================================
const openFilter = () => {
  showFilter.value = true
}

const resetPagination = () => {
  currentCount.value = pageSize
}

const onFilterApply = resetPagination
const onFilterReset = resetPagination

// ============================================
// 페이지 이동 메서드
// ============================================
const goToDetail = () => {
  router.push('/mo/ebl/cdc/EBLCDC110P')
}

// ============================================
// 샘플 데이터
// ============================================
const STATUS_BADGE_CONFIG = {
  issued: { label: 'ISSUED', color: 'mint', tooltip: 'Issued' },
  amending: { label: 'AMENDING', color: 'violet', tooltip: 'Amending' },
  switching: { label: 'SWITCHING', color: 'violet', tooltip: 'Switching' },
  delivery: { label: 'DELIVERY', color: 'violet', tooltip: 'Delivery' },
  pending: { label: 'PENDING', color: 'amber', tooltip: 'Pending' },
  voided: { label: 'VOIDED', color: 'red', tooltip: 'Voided' },
  
  dg: { 
    label: 'DG', 
    color: 'dg', 
    tooltip: '위험물정보(Dangerous cargo)는\nPC환경에서 조회가 가능합니다.' 
  }
}

const SECOND_BADGE_TYPES = [
  { label: 'ISSUE', color: 'gray', tooltip: 'Issue' },
  { label: 'SACC', color: 'gray', tooltip: 'SACC' },
  { label: 'ENDORSE', color: 'gray', tooltip: 'Endorse' },
]

const COMPANIES = [
  'Hyundai Merchant Marine',
  'CJ Logistics Corporation',
  'Evergreen Line',
  'MSC',
  'COSCO',
]

const ROUTE_FROM_LIST = [
  'BUSAN, KOREA',
  'GWANGYANG INTERNATIONAL CONTAINER TERMINAL, REPUBLIC OF KOREA',
  'INCHON, KOREA',
  'SHANGHAI WAIGAOQIAO, CHINA',
  'HO CHI MINH CITY, VIETNAM',
]

const ROUTE_FROM_CODE_LIST = ['KRBUS', 'KRGWA', 'KRINC', 'CNSHA', 'VNSGN']

const ROUTE_TO_LIST = [
  'BOSTON, MA',
  'LOS ANGELES/LONG BEACH, UNITED STATES OF AMERICA',
  'ROTTERDAM, NETHERLANDS',
  'SINGAPORE PSA TERMINAL, SINGAPORE',
  'HAMBURG, GERMANY',
 ]

const ROUTE_TO_CODE_LIST = ['USBOS', 'USLAX', 'NLRTM', 'SGSIN', 'DEHAM']

const STATUSES = ['issued', 'amending', 'switching', 'delivery', 'pending', 'voided']

const items = ref(
  Array.from({ length: 50 }, (_, index) => {
    const status = STATUSES[index % STATUSES.length]
    let badgeList = [STATUS_BADGE_CONFIG[status], SECOND_BADGE_TYPES[index % SECOND_BADGE_TYPES.length]]

    const isDangerous = index === 0 || index % 6 === 0
    if (isDangerous) {
      badgeList.push(STATUS_BADGE_CONFIG['dg'])
    } else if (index === 0) {
      badgeList = [STATUS_BADGE_CONFIG['dg'], SECOND_BADGE_TYPES[index % SECOND_BADGE_TYPES.length]]
    }

    return {
      id: index + 1,
      blNo: `HDMUSELM7032842${String(index + 1).padStart(2, '0')}DPBL`,
      badges: badgeList, 
      shipper: {
        name: COMPANIES[index % COMPANIES.length],
        logo: `https://i.pravatar.cc/150?img=${(index % 50) + 1}`,
        subtitle: '',
      },
      routeFrom: ROUTE_FROM_LIST[index % ROUTE_FROM_LIST.length],
      routeTo: ROUTE_TO_LIST[index % ROUTE_TO_LIST.length],
      routeFromCode: ROUTE_FROM_CODE_LIST[index % ROUTE_FROM_CODE_LIST.length],
      routeToCode: ROUTE_TO_CODE_LIST[index % ROUTE_TO_CODE_LIST.length],
      date: `2026-02-${String((index % 28) + 1).padStart(2, '0')} 15:15:00`,
      status: status,
      isDangerousCargo: isDangerous
    }
  }),
)

// ============================================
// 계산된 속성
// ============================================
const filteredItems = computed(() => {
  let result = items.value

  // 1. 상단 탭 필터
  if (activeTab.value !== 'all') {
    result = result.filter((item) => item.status === activeTab.value)
  }

  // 2. 검색 필터
  if (appliedFilter.value.query.trim()) {
    const query = appliedFilter.value.query.toLowerCase()
    result = result.filter(
      (item) =>
        item.shipper.name.toLowerCase().includes(query) || item.blNo.toLowerCase().includes(query),
    )
  }

  if (appliedFilter.value.cargoType === 'dg') {
    result = result.filter(item => item.isDangerousCargo === true)
  }

  // 4. 날짜 범위 필터
  if (appliedFilter.value.range && typeof appliedFilter.value.range === 'object') {
    const { from, to } = appliedFilter.value.range
    if (from || to) {
      result = result.filter((item) => {
        const itemDate = item.date.split(' ')[0]
        return (!from || itemDate >= from) && (!to || itemDate <= to)
      })
    }
  }

  return result
})

const totalCount = computed(() => filteredItems.value.length)
const visibleItems = computed(() => filteredItems.value.slice(0, currentCount.value))
const showMore = computed(
  () => filteredItems.value.length > pageSize && currentCount.value < filteredItems.value.length,
)

const loadMore = () => {
  if (isLoadingMore.value) return
  isLoadingMore.value = true
  setTimeout(() => {
    currentCount.value = Math.min(currentCount.value + pageSize, filteredItems.value.length)
    isLoadingMore.value = false
  }, 1000)
}

watch(
  filteredItems,
  () => {
    currentCount.value = Math.min(pageSize, filteredItems.value.length)
    isLoadingMore.value = false
  },
  { immediate: true },
)
</script>

<style scoped>
:deep(.ebl-badge--dg) {
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  padding-right: 28px !important; /* 느낌표 아이콘 공간 확보 */
  position: relative !important;
  
  /* 시안 조건 반영 */
  background: transparent !important;
  border: 1px solid #FF1C1C !important;
  color: #FF1C1C !important;
}

/* 느낌표 아이콘 인젝션 */
:deep(.ebl-badge--dg)::after {
  content: '' !important;
  display: block !important;
  width: 16px !important;
  height: 16px !important;
  position: absolute !important;
  right: 6px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  background: url('/images/badgeExclamation.svg') no-repeat 50% 50% !important;
  background-size: contain !important;
}
</style>