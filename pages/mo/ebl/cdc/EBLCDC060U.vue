<template>
  <div class="ebl-page-container">
    <!-- 필터 탭 -->
    <EblSubHeader>
      <h2>Total</h2>
      <span class="count">{{ totalCount }}</span>
      <template #util>
        <EblBtn icon="ebli:filter2" outlined @click="openFilter" />
      </template>
    </EblSubHeader>

    <!-- 카드 리스트 -->
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

    <!-- More 버튼 -->
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
        <!-- 로딩 스피너 샘플 -->
        <Vue3Lottie animation-link="/lottie/loadingSpinner.json" :height="60" :width="120" />
      </div>
    </div>

    <!-- 필터 바텀시트 -->
    <EblFilterBottomSheet
      v-model="showFilter"
      v-model:filter-value="appliedFilter"
      title="Filter"
      query-place-holder="Search Company Name, B/L No"
      date-label="Save Date"
      @filter:apply="onFilterApply"
      @filter:reset="onFilterReset"
    />
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
  appbarTitle: 'Draft',
})

// ============================================
// Router 설정
// ============================================
const router = useRouter()

// ============================================
// 상태 데이터
// ============================================
const pageSize = 10
const currentCount = ref(pageSize)
const isLoadingMore = ref(false)
const showFilter = ref(false)

const appliedFilter = ref({
  query: '',
  status: '',
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
  router.push('/mo/ebl/doc/EBLDOC150P')
}

// ============================================
// 샘플 데이터
// ============================================
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

const items = ref(
  Array.from({ length: 50 }, (_, index) => {
    const status = 'draft'
    return {
      id: index + 1,
      blNo: `HDMUSELM7032842${String(index + 1).padStart(2, '0')}DPBL`,
      badges: [{ label: 'DRAFT', color: 'pink', tooltip: 'Draft' }],
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
      status,
    }
  }),
)

// ============================================
// 계산된 속성
// ============================================
const filteredItems = computed(() => {
  let result = items.value

  // 검색 필터
  if (appliedFilter.value.query.trim()) {
    const query = appliedFilter.value.query.toLowerCase()
    result = result.filter(
      (item) =>
        item.shipper.name.toLowerCase().includes(query) || item.blNo.toLowerCase().includes(query),
    )
  }

  // 날짜 범위 필터
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
  }, 1000) // 1초 딜레이로 로딩 시뮬레이션
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
