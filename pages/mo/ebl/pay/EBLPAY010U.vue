<template>
  <div class="ebl-page-container pt-0">
    <!-- 탭 네비게이션 -->
    <EblTabs
      v-model="activeTab"
      v-sticky="32"
      stretch
      :items="[
        { label: 'Payment History', value: 'paymentHistory' },
        { label: 'Account Balance', value: 'accountBalance' },
      ]"
      no-wrap
      class="mx-n6 pt-6 px-6 mb-6"
    />

    <!-- EblSubHeader -->
    <EblSubHeader>
      <h2>Total</h2>
      <span class="count">{{ filteredItems.length }}</span>
      <template #util>
        <EblBtn icon="ebli:filter2" outlined @click="currentData.showFilter = true" />
      </template>
    </EblSubHeader>

    <!-- 필터 바텀시트 -->
    <EblFilterBottomSheet
      v-model="currentData.showFilter"
      v-model:filter-value="currentData.appliedFilter"
      title="Filter"
      :show-query="false"
      :status-options="currentStatusOptions"
      :status-label="activeTab === 'accountBalance' ? 'Transaction Type' : 'Status'"
      :date-label="currentDateLabel"
      @filter:apply="onFilterApply"
      @filter:reset="onFilterReset"
    />

    <!-- 리스트 -->
    <div class="ebl-card-list">
      <div v-if="filteredItems.length === 0" class="ebl-card-item__empty">
        <VImg src="~/assets/images/common/not_result_found.png" width="150" height="74" />
        <h3>No results found</h3>
        <p>No data matches your current filter settings.</p>
      </div>

      <!-- Payment History 리스트만 분기 -->
      <template v-if="activeTab === 'paymentHistory'">
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="ebl-card-item"
          @click="openPaymentDetail(item)"
        >
          <div class="ebl-card-item__date large">{{ item.date }}</div>
          <div class="ebl-card-item__amount mt-1">{{ item.amount }}</div>
        </div>
      </template>

      <!-- Account Balance 리스트만 분기 -->
      <template v-else>
        <div v-for="item in visibleItems" :key="item.id" class="ebl-card-item">
          <div class="ebl-card-item__balance-head">
            <div class="date">{{ item.date }}</div>
            <EblBadge color="black" variant="tonal" pill>{{ item.type }}</EblBadge>
          </div>
          <div class="ebl-card-item__balance-summary">
            <div class="title">{{ item.title }}</div>
            <div class="amount" :class="{ positive: item.isPositive }">
              {{ item.amount }}
            </div>
          </div>
          <div class="ebl-card-item__balance">{{ item.balance }}</div>
          <div v-if="item.provider" class="ebl-card-item__provider">{{ item.provider }}</div>
        </div>
      </template>
    </div>
    <div v-if="showMore" v-intersect="onMoreVisible" class="ebl-more-list ebl-more-list--wrap">
      <EblBtn block class="ebl-more-list__btn" append-icon="ebli:chevron-bottom" @click="loadMore">
        More ({{ currentData.currentCount }} / {{ filteredItems.length }})
      </EblBtn>
    </div>

    <!-- Payment Detail 바텀시트 -->
    <EblBottomSheet v-model="paymentDetail.show" scrollable>
      <VCard
        v-pull-trigger="{
          handle: handleRef,
          onTrigger: () => (paymentDetail.show = false),
        }"
        class="ebl-bottom-sheet__card"
      >
        <div ref="handleRef" class="ebl-bottom-sheet__handle" />
        <VCardTitle class="px-6 pt-5 pb-4">
          <div class="ebl-detail-header">
            <div class="ebl-detail-header__title strong">Payments Detail</div>
            <div class="ebl-detail-header__date-amount">
              <div class="date">{{ paymentDetail.data?.date }}</div>
              <div class="amount">{{ paymentDetail.data?.amount }}</div>
            </div>
          </div>
        </VCardTitle>
        <VCardText class="ebl-bottom-sheet__text pt-0">
          <EblInfo vertical class="ebl-info--gray" style="--ebl-info-row-gap: 12px">
            <EblInfoItem label="Payment Method" has-input>
              {{ paymentDetail.data?.method || '-' }}
            </EblInfoItem>
            <EblInfoItem label="Payment Date" has-input>
              {{ paymentDetail.data?.paymentDate || '-' }}
            </EblInfoItem>
          </EblInfo>
        </VCardText>
      </VCard>
    </EblBottomSheet>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// 페이지 메타 설정
definePageMeta({
  appbarType: 'sub',
  appbarTitle: 'Payments',
})

// Pull trigger 핸들 참조
const handleRef = ref(null)

// 활성 탭 상태
const activeTab = ref('paymentHistory')

// Payment History 데이터
const paymentHistory = reactive({
  allData: [
    { id: 1, date: '2026-01-25 10:05:00', amount: '200,000 Won' },
    { id: 2, date: '2026-01-20 10:05:00', amount: '200,000 Won' },
    { id: 3, date: '2026-01-15 10:05:00', amount: '200,000 Won' },
    { id: 4, date: '2026-01-10 10:05:00', amount: '200,000 Won' },
    { id: 5, date: '2026-01-05 10:05:00', amount: '200,000 Won' },
    { id: 6, date: '2025-12-25 10:05:00', amount: '100,000 Won' },
    { id: 7, date: '2025-12-20 10:05:00', amount: '150,000 Won' },
    { id: 8, date: '2025-12-15 10:05:00', amount: '200,000 Won' },
    { id: 9, date: '2025-12-10 10:05:00', amount: '300,000 Won' },
    { id: 10, date: '2025-12-05 10:05:00', amount: '250,000 Won' },
  ],
  showFilter: false,
  appliedFilter: {
    query: '',
    range: { from: null, to: null },
  },
  currentCount: 6,
  pageSize: 6,
})

// Account Balance 데이터
const accountBalance = reactive({
  allData: [
    {
      id: 1,
      date: '2025-11-31 00:00:00',
      type: 'Recovery',
      title: '알립톡 요금 할인',
      amount: '+300 (Won)',
      isPositive: true,
      balance: '39,700 Won',
    },
    {
      id: 2,
      date: '2025-11-31 00:00:00',
      type: 'Charge',
      title: '충전',
      amount: '+30,000 (Won)',
      isPositive: true,
      balance: '39,400 Won',
    },
    {
      id: 3,
      date: '2025-11-31 00:00:00',
      type: 'Deduction',
      title: '알립톡 - BL 발행',
      amount: '-300 (Won)',
      isPositive: false,
      balance: '9,400 Won',
      provider: 'KTNET',
    },
    {
      id: 4,
      date: '2025-11-25 00:00:00',
      type: 'Deduction',
      title: '알립톡 - BL 발행',
      amount: '-300 (Won)',
      isPositive: false,
      balance: '9,700 Won',
      provider: 'KTNET',
    },
    {
      id: 5,
      date: '2025-11-20 00:00:00',
      type: 'Recovery',
      title: '이용료 환급',
      amount: '+500 (Won)',
      isPositive: true,
      balance: '10,000 Won',
    },
    {
      id: 6,
      date: '2025-11-15 00:00:00',
      type: 'Charge',
      title: '점프 충전',
      amount: '+50,000 (Won)',
      isPositive: true,
      balance: '49,500 Won',
    },
    {
      id: 7,
      date: '2025-11-10 00:00:00',
      type: 'Deduction',
      title: 'eBL 발행',
      amount: '-200 (Won)',
      isPositive: false,
      balance: '100 Won',
    },
    {
      id: 8,
      date: '2025-11-05 00:00:00',
      type: 'Recovery',
      title: '포인트 적립',
      amount: '+1,000 (Won)',
      isPositive: true,
      balance: '1,100 Won',
    },
    {
      id: 9,
      date: '2025-11-01 00:00:00',
      type: 'Charge',
      title: '기본 충전',
      amount: '+100,000 (Won)',
      isPositive: true,
      balance: '100,100 Won',
    },
    {
      id: 10,
      date: '2025-10-25 00:00:00',
      type: 'Deduction',
      title: 'eBL 조회',
      amount: '-50 (Won)',
      isPositive: false,
      balance: '100 Won',
    },
  ],
  showFilter: false,
  appliedFilter: {
    query: '',
    status: 'all',
    range: { from: null, to: null },
  },
  currentCount: 6,
  pageSize: 6,
})

// Payment Detail 상세 정보
const paymentDetail = reactive({
  show: false,
  data: null,
})

// 현재 탭에 따른 데이터 선택
const currentData = computed(() => {
  return activeTab.value === 'paymentHistory' ? paymentHistory : accountBalance
})

// 현재 탭에 따른 날짜 라벨 변경
const currentDateLabel = computed(() => {
  return activeTab.value === 'paymentHistory' ? 'Payment Date' : 'Last Update'
})

// 현재 탭에 따른 상태/필터 옵션 선택
const currentStatusOptions = computed(() => {
  if (activeTab.value === 'paymentHistory') {
    return [] // Payment History: 상태 필터 없음
  }
  // Account Balance: Transaction Type 옵션
  return [
    { label: 'All', value: 'all' },
    { label: 'Recovery', value: 'recovery' },
    { label: 'Charge', value: 'charge' },
    { label: 'Deduction', value: 'deduction' },
  ]
})

// 필터링된 아이템 (쿼리, 거래 타입, 날짜 범위)
const filteredItems = computed(() => {
  const data = currentData.value
  let result = data.allData

  if (data.appliedFilter.query) {
    const query = data.appliedFilter.query.toLowerCase()
    const searchKey = activeTab.value === 'paymentHistory' ? 'date' : 'title'
    result = result.filter((item) => item[searchKey].toLowerCase().includes(query))
  }

  // Account Balance: Transaction Type 필터
  if (
    activeTab.value === 'accountBalance' &&
    data.appliedFilter.status &&
    data.appliedFilter.status !== 'all'
  ) {
    result = result.filter(
      (item) => item.type.toLowerCase() === data.appliedFilter.status.toLowerCase(),
    )
  }

  // 날짜 범위 필터
  if (data.appliedFilter.range.from || data.appliedFilter.range.to) {
    const from = data.appliedFilter.range.from ? new Date(data.appliedFilter.range.from) : null
    const to = data.appliedFilter.range.to ? new Date(data.appliedFilter.range.to) : null

    result = result.filter((item) => {
      const itemDate = new Date(item.date.split(' ')[0])
      if (from && itemDate < from) return false
      if (to && itemDate > to) return false
      return true
    })
  }

  return result
})

// 페이지네이션: 현재 건수만큼 표시
const visibleItems = computed(() => {
  return filteredItems.value.slice(0, currentData.value.currentCount)
})

// 더보기 버튼 표시 여부
const showMore = computed(() => {
  return filteredItems.value.length > currentData.value.currentCount
})

// 필터 적용 시 페이지 초기화
const onFilterApply = () => {
  currentData.value.currentCount = currentData.value.pageSize
}

// 필터 초기화 시 각 탭별 필터값 설정
const onFilterReset = () => {
  const data = currentData.value
  if (activeTab.value === 'paymentHistory') {
    data.appliedFilter.query = ''
    data.appliedFilter.range = { from: null, to: null }
  } else {
    data.appliedFilter.query = ''
    data.appliedFilter.status = 'all'
    data.appliedFilter.range = { from: null, to: null }
  }
  data.currentCount = data.pageSize
}

// Payment History 상세 바텀시트 오픈
const openPaymentDetail = (item) => {
  paymentDetail.data = {
    ...item,
    method: 'Samsung Card',
    paymentDate: '2025-09-19',
  }
  paymentDetail.show = true
}

// 더보기 버튼 클릭 시 아이템 추가로 로드
const loadMore = () => {
  currentData.value.currentCount += currentData.value.pageSize
}

// Intersection Observer: 더보기 버튼 가시성 감지
const onMoreVisible = (isVisible) => {
  currentData.value.isMoreVisible = isVisible
}
</script>
