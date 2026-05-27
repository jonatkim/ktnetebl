<template>
  <div class="ebl-page-container pt-0">
    <!-- 필터 탭 -->
    <EblTabs
      v-model="activeTab"
      v-sticky="32"
      :items="tabItems"
      no-wrap
      class="mx-n6 pt-6 px-6 mb-6"
    />
    <EblSubHeader>
      <h2>Total</h2>
      <span class="count">{{ filteredItems.length }}</span>
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
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="ebl-card-item ga-2"
        @click="openDetail(item)"
      >
        <div class="ebl-card-item__head-badge">
          <EblBadge color="blue" variant="tonal">{{ item.type }}</EblBadge>
          <div class="view">
            <VIcon icon="ebli:eye-open" size="16" />
            <span>{{ item.viewCount }}</span>
          </div>
        </div>
        <div class="ebl-card-item__title">{{ item.title }}</div>
        <div class="ebl-card-item__date">{{ item.date }}</div>
      </div>
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
        More ({{ currentCount }} / {{ filteredItems.length }})
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
      query-place-holder="Search Sub ID, User Name"
      date-label="Add Date"
      @filter:apply="onFilterApply"
      @filter:reset="onFilterReset"
    />
    <!-- 게시물 상세 바텀시트 -->
    <EblBottomSheet v-model="showDetail" scrollable>
      <VCard
        v-pull-trigger="{
          handle: handleRef,
          onTrigger: () => (showDetail = false),
        }"
        class="ebl-bottom-sheet__card"
      >
        <div ref="handleRef" class="ebl-bottom-sheet__handle" />
        <VCardTitle class="px-6 pt-5 pb-4">
          <div class="ebl-detail-header">
            <div class="ebl-detail-header__head-badge">
              <EblBadge color="blue" variant="tonal">Carrier</EblBadge>
              <div class="view">
                <VIcon icon="ebli:eye-open" size="16" />
                <span>758</span>
              </div>
            </div>
            <div class="ebl-detail-header__title">
              홈페이지 사용자 메뉴얼 홈페이지 사용자 메뉴얼 홈페이지 사용자 메뉴얼 홈페이지 사용자
              메뉴얼 홈페이지 사용자 메뉴얼 홈페이지 사용자 메뉴얼
            </div>
            <div class="ebl-detail-header__date">2025-09-01 15:15:00</div>
          </div>
        </VCardTitle>
        <VCardText class="ebl-bottom-sheet__text pt-0">
          <!-- 상세 정보 -->
          <EblInfo vertical class="ebl-info--gray" style="--ebl-info-row-gap: 12px">
            <EblInfoItem label="Message" has-input>
              <p class="content">
                홈페이지 사용자 매뉴얼입니다. <br />회원가입부터 eBL 발행까지 사용자를 위한 모든
                방법을 확인 하실 수 있습니다.
              </p>
            </EblInfoItem>
            <EblInfoItem has-input>
              <template #label>
                Attachment
                <small class="ea">3</small>
              </template>
              <EblBtn append-icon="ebli:download" color="outlined" block class="file-item">
                file name1.png
              </EblBtn>
              <EblBtn append-icon="ebli:download" color="outlined" block class="file-item">
                file name2.png
              </EblBtn>
              <EblBtn append-icon="ebli:download" color="outlined" block class="file-item">
                file name3.png
              </EblBtn>
            </EblInfoItem>
            <EblInfoItem label="Creator" has-input> Admin1 </EblInfoItem>
          </EblInfo>
        </VCardText>
      </VCard>
    </EblBottomSheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'sub',
  appbarTitle: 'Resources',
})

// ============================================
// 상태 데이터
// ============================================
const activeTab = ref('all')
const pageSize = 10
const currentCount = ref(pageSize)
const isLoadingMore = ref(false)
const showFilter = ref(false)
const showDetail = ref(false)
const handleRef = ref(null)
const selectedItem = ref(null)

const appliedFilter = ref({
  query: '',
  range: {
    from: null,
    to: null,
  },
})

// ============================================
// 탭 설정
// ============================================
const tabItems = ref([
  { label: 'ALL', value: 'all' },
  { label: 'Carrier', value: 'carrier' },
  { label: 'Shipper', value: 'shipper' },
  { label: 'Bank', value: 'bank' },
])

// ============================================
// 더미 데이터
// ============================================
const allData = ref([
  // Carrier
  {
    id: 1,
    title: 'Carrier Operations Manual 2025',
    type: 'Carrier',
    viewCount: 758,
    date: '2025-09-19 15:30:20',
  },
  {
    id: 2,
    title: 'eBL Carrier Integration Guide',
    type: 'Carrier',
    viewCount: 1068,
    date: '2025-08-20 15:30:20',
  },
  {
    id: 3,
    title: 'Shipping Documentation Standards',
    type: 'Carrier',
    viewCount: 3528,
    date: '2025-04-01 15:30:20',
  },
  {
    id: 4,
    title: 'Carrier Compliance Checklist',
    type: 'Carrier',
    viewCount: 591,
    date: '2025-03-24 15:30:20',
  },
  {
    id: 5,
    title: 'Port Operations Procedures',
    type: 'Carrier',
    viewCount: 423,
    date: '2025-02-14 15:30:20',
  },
  {
    id: 6,
    title: 'Container Management System',
    type: 'Carrier',
    viewCount: 267,
    date: '2025-01-30 15:30:20',
  },
  // Shipper
  {
    id: 7,
    title: 'Shipper Quick Start Guide',
    type: 'Shipper',
    viewCount: 912,
    date: '2025-09-18 10:15:00',
  },
  {
    id: 8,
    title: 'How to Create an eBL',
    type: 'Shipper',
    viewCount: 1456,
    date: '2025-08-25 14:20:30',
  },
  {
    id: 9,
    title: 'Documentation Requirements',
    type: 'Shipper',
    viewCount: 834,
    date: '2025-07-15 09:45:00',
  },
  {
    id: 10,
    title: 'Shipper Best Practices',
    type: 'Shipper',
    viewCount: 645,
    date: '2025-06-20 11:30:00',
  },
  {
    id: 11,
    title: 'Customs Declaration Process',
    type: 'Shipper',
    viewCount: 501,
    date: '2025-05-10 16:00:00',
  },
  // Bank
  {
    id: 12,
    title: 'Bank Operations Guide',
    type: 'Bank',
    viewCount: 289,
    date: '2025-09-15 13:15:00',
  },
  {
    id: 13,
    title: 'eBL Verification Process',
    type: 'Bank',
    viewCount: 412,
    date: '2025-08-28 10:30:00',
  },
  {
    id: 14,
    title: 'Bank Compliance Requirements',
    type: 'Bank',
    viewCount: 356,
    date: '2025-07-22 15:45:00',
  },
  {
    id: 15,
    title: 'Letter of Credit Processing',
    type: 'Bank',
    viewCount: 534,
    date: '2025-06-18 09:20:00',
  },
])

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
// 계산된 속성
// ============================================
const filteredItems = computed(() => {
  let result = allData.value

  // activeTab 필터링
  if (activeTab.value !== 'all') {
    result = result.filter((item) => item.type.toLowerCase() === activeTab.value)
  }

  // 검색 필터링
  if (appliedFilter.value.query) {
    const query = appliedFilter.value.query.toLowerCase()
    result = result.filter((item) => item.title.toLowerCase().includes(query))
  }

  // 날짜 범위 필터링
  if (appliedFilter.value.range.from || appliedFilter.value.range.to) {
    const from = appliedFilter.value.range.from ? new Date(appliedFilter.value.range.from) : null
    const to = appliedFilter.value.range.to ? new Date(appliedFilter.value.range.to) : null

    result = result.filter((item) => {
      const itemDate = new Date(item.date.split(' ')[0])
      if (from && itemDate < from) return false
      if (to && itemDate > to) return false
      return true
    })
  }

  return result
})

const visibleItems = computed(() => {
  return filteredItems.value.slice(0, currentCount.value)
})

const showMore = computed(() => {
  return filteredItems.value.length > currentCount.value
})

// ============================================
// 이벤트 핸들러
// ============================================
const openDetail = (item) => {
  selectedItem.value = item
  showDetail.value = true
}

const loadMore = () => {
  isLoadingMore.value = true
  setTimeout(() => {
    currentCount.value += pageSize
    isLoadingMore.value = false
  }, 600)
}
</script>
