<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="cta" large> Payment Register </EblBtn>
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- Total 서브헤더 -->
      <EblSubHeader>
        <h2>Total</h2>
        <span class="count">{{ formatNumber(filteredBillingList.length) }}</span>
        <template #tooltip>
          •청구서 조회 메뉴에서는 사용량 및 청구서 이력을 확인할 수 있습니다.<br />
          •결제내역 확인 및 결제수단을 등록할 수 있습니다.
        </template>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters my-3">
        <EblSelect
          v-model="filters.billingStatus"
          clearable
          placeholder="Billing Status: All"
          :options="billingStatusOptions"
          style="width: 200px"
        />
        <EblSelect
          v-model="filters.paymentStatus"
          clearable
          placeholder="Payment Status: All"
          :options="paymentStatusOptions"
          style="width: 200px"
        />
        <EblDatePicker
          v-model="filters.dateRange"
          range
          clearable
          placeholder="View Date"
          :start-date="filters.dateRange?.[0]"
          :focus-start-date="true"
          style="width: 260px"
          auto-apply
        >
        </EblDatePicker>
        <EblBtn outlined @click="applyFilters">Search</EblBtn>
        <EblBtn icon="ebli:refresh" outlined @click="resetFilters" />
      </div>

      <!-- Billing AG Grid -->
      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :row-data="paginatedBillingList"
        :column-defs="colDefs"
        :dom-layout="'autoHeight'"
        :suppress-column-virtualisation="true"
        @grid-ready="onGridReady"
        @cell-clicked="onCellClicked"
      >
      </AgGridVue>

      <!-- 페이지네이션 -->
      <div class="ebl-pagination--container mt-3">
        <div>
          Count
          <EblSelect
            v-model="itemsPerPage"
            placeholder="Items per page"
            :options="[
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '50', value: 50 },
              { label: '100', value: 100 },
            ]"
            class="ml-2"
          />
        </div>
        <EblPagination
          v-model="currentPage"
          :length="Math.ceil(filteredBillingList.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>
    </div>

    <!-- Billing Detail Dialog -->
    <EblDialog v-model="detailOpen" transition="slide-x-reverse-transition" @close="closeDetail">
      <VCard width="900" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Billing Detail</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeDetail">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <!-- Total 서브헤더 및 월 뱃지 -->
          <EblSubHeader>
            <h2>Total</h2>
            <span class="count">{{ formatNumber(detailItems.length) }}</span>
            <template #util>
              <EblBadge color="black" variant="outlined">
                {{ detailRow?.billingMonth || '-' }}
              </EblBadge>
            </template>
          </EblSubHeader>

          <!-- Detail AG Grid -->
          <AgGridVue
            class="ebl-data-grid ag-theme-quartz"
            :row-data="detailItems"
            :column-defs="detailColDefs"
            :dom-layout="'autoHeight'"
            :suppress-column-virtualisation="true"
            @grid-ready="onDetailGridReady"
          >
          </AgGridVue>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <EblBtn color="cta" large> Check </EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'
import BadgeCellRenderer from '~/components/grid/BadgeCellRenderer.vue'

const { formatNumber } = useFormat()
const gridApi = ref(null)
const detailGridApi = ref(null)
const detailOpen = ref(false)
const detailRow = ref(null)

// ============================================================
// Page Info
// ============================================================
const pageInfo = ref({
  title: 'Billing',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Payments' }, { text: 'Billing' }],
})

// ============================================================
// State
// ============================================================
const currentPage = ref(1)
const itemsPerPage = ref(10)

// ============================================================
// Mock Data (실제로는 API에서 가져옴)
// ============================================================
const generateMockData = () => {
  const data = []
  const billingStatuses = ['Wait', 'Claim', 'Cancellation', 'Wait']
  const paymentStatuses = ['Wait', 'Completed', 'Completed', 'Wait', 'Unpaid']
  const units = ['Dollar', 'Won', 'Won', 'Dollar']

  const mockMonths = ['2025-12', '2025-11', '2025-10', '2025-09', '2025-08', '2025-07']

  for (let i = 1; i <= 50; i++) {
    // 랜덤 날짜 생성 (최근 1년 내)
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const billingDate = date.toISOString().split('T')[0]

    const paymentDate = new Date(date)
    paymentDate.setDate(paymentDate.getDate() + Math.floor(Math.random() * 30))
    const formattedPaymentDate = paymentDate.toISOString().slice(0, 19).replace('T', ' ')

    data.push({
      id: i,
      no: i,
      billingMonth: mockMonths[i % mockMonths.length],
      transfers: Math.floor(Math.random() * 1000) + 100,
      amount: Math.floor(Math.random() * 200000) + 10000,
      unit: units[i % units.length],
      billingDate: billingDate,
      billingStatus: billingStatuses[i % billingStatuses.length],
      paymentDate: formattedPaymentDate,
      paymentStatus: paymentStatuses[i % paymentStatuses.length],
    })
  }
  return data
}

const mockBillingData = ref(generateMockData())

// Detail Mock Data
const generateDetailMockData = (billingMonth) => {
  const data = []
  const itemsUsed = [
    '알림톡 요금 할인',
    '알림톡 - BL 발행',
    '서비스 사용 기본료',
    'eBL 수신',
    '알림톡 - BL 발행',
    '서비스 사용 기본료',
    'eBL 수신',
    '알림톡 요금 할인',
    'eBL 수신',
    '알림톡 요금 할인',
    'eBL 수신',
    'eBL 수신',
  ]
  const recipients = ['-', '-', '현대수출산업', '-', '현대수출산업', '-', '-', '-', '-']
  const amounts = [-300, 100, 1000, 30000, -30000, 30000, 100, -1000, 30000, 100, 30000, 30000]
  const units = ['Won', 'Won', 'Won', 'Won', 'Won', 'Won', 'Won', 'Won', 'Won', 'Won', 'Won', 'Won']
  const options = [
    '알림톡 무료기간',
    '-',
    '선불 자동결제',
    '알림톡 무료기간',
    '알림톡 무료기간',
    '알림톡 무료기간',
    '선불 자동결제',
    '-',
    '알림톡 무료기간',
    '선불 자동결제',
    '-',
    '-',
  ]

  for (let i = 0; i < 12; i++) {
    const randomDay = Math.floor(Math.random() * 28) + 1
    const usedDate = `${billingMonth}-${String(randomDay).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`

    data.push({
      id: i + 1,
      usedDate: usedDate,
      itemsUsed: itemsUsed[i % itemsUsed.length],
      recipient: recipients[i % recipients.length],
      amount: amounts[i % amounts.length],
      unit: units[i % units.length],
      option: options[i % options.length],
    })
  }
  return data
}

const detailItems = ref([])

// ============================================================
// Filter Options
// ============================================================
const billingStatusOptions = ref([
  { label: 'All', value: '' },
  { label: 'Wait', value: 'Wait' },
  { label: 'Claim', value: 'Claim' },
  { label: 'Cancellation', value: 'Cancellation' },
])

const paymentStatusOptions = ref([
  { label: 'All', value: '' },
  { label: 'Wait', value: 'Wait' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Unpaid', value: 'Unpaid' },
])

// ===== 필터 로직 =====
// 필터 상태 (입력용)
const filters = reactive({
  billingStatus: '',
  paymentStatus: '',
  dateRange: null,
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  billingStatus: '',
  paymentStatus: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.billingStatus = filters.billingStatus
  appliedFilters.paymentStatus = filters.paymentStatus
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  currentPage.value = 1
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.billingStatus = ''
  filters.paymentStatus = ''
  filters.dateRange = null
  appliedFilters.billingStatus = ''
  appliedFilters.paymentStatus = ''
  appliedFilters.dateRange = null
  currentPage.value = 1
}

// ============================================================
// Computed
// ============================================================

// 필터링된 Billing 목록
const filteredBillingList = computed(() => {
  return mockBillingData.value.filter((item) => {
    // Billing Status 필터
    if (appliedFilters.billingStatus && item.billingStatus !== appliedFilters.billingStatus) {
      return false
    }

    // Payment Status 필터
    if (appliedFilters.paymentStatus && item.paymentStatus !== appliedFilters.paymentStatus) {
      return false
    }

    // 날짜 범위 필터
    if (appliedFilters.dateRange && appliedFilters.dateRange.length === 2) {
      const itemDate = new Date(item.billingDate)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      endDate.setHours(23, 59, 59, 999)
      if (itemDate < startDate || itemDate > endDate) {
        return false
      }
    }

    return true
  })
})

// 페이지네이션된 Billing 목록
const paginatedBillingList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBillingList.value.slice(start, end)
})

// ============================================================
// Column Definitions
// ============================================================
const colDefs = ref([
  {
    field: 'no',
    headerName: '',
    width: 60,
    maxWidth: 80,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'billingMonth',
    headerName: 'Billing Month',
    width: 140,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'transfers',
    headerName: 'Transfers',
    width: 120,
    headerStyle: { justifyContent: 'flex-end' },
    cellStyle: { textAlign: 'right' },
    valueFormatter: (params) => formatNumber(params.value || 0),
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 140,
    headerStyle: { justifyContent: 'flex-end' },
    cellStyle: { textAlign: 'right' },
    valueFormatter: (params) => formatNumber(params.value || 0),
  },
  {
    field: 'unit',
    headerName: 'UNIT',
    width: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'billingDate',
    headerName: 'Billing Date',
    width: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'billingStatus',
    headerName: 'Billing Status',
    width: 140,
    headerStyle: { justifyContent: 'flex-start' },

    cellRenderer: BadgeCellRenderer,
    cellRendererParams: {
      color: 'gray',
    },
  },
  {
    field: 'paymentDate',
    headerName: 'Payment Date',
    width: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'paymentStatus',
    headerName: 'Payment Status',
    width: 150,
    headerStyle: { justifyContent: 'flex-start' },

    cellRenderer: BadgeCellRenderer,
    cellRendererParams: {
      color: 'gray',
    },
  },
])

// Detail Column Definitions
const detailColDefs = ref([
  {
    field: 'usedDate',
    headerName: 'Used Date',
    width: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'itemsUsed',
    headerName: 'Items Used',
    flex: 1,
    minWidth: 200,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'recipient',
    headerName: 'Recipient',
    width: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 120,
    headerStyle: { justifyContent: 'flex-end' },
    cellStyle: (params) => {
      const style = { textAlign: 'right' }
      if (params.value < 0) {
        style.color = '#ff1c1c'
      }
      return style
    },
    valueFormatter: (params) => formatNumber(params.value || 0),
  },
  {
    field: 'unit',
    headerName: 'UNIT',
    width: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'option',
    headerName: 'Option',
    width: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// ============================================================
// Methods
// ============================================================

// AG Grid Ready
const onGridReady = (params) => {
  gridApi.value = params.api
}

// Detail AG Grid Ready
const onDetailGridReady = (params) => {
  detailGridApi.value = params.api
}

// 셀 클릭 - 상세 다이얼로그 열기
const onCellClicked = (params) => {
  if (params.column.getColId() === 'billingMonth') {
    detailRow.value = params.data
    detailItems.value = generateDetailMockData(params.data.billingMonth)
    detailOpen.value = true
  }
}

// Detail 다이얼로그 닫기
const closeDetail = () => {
  detailOpen.value = false
}

// ============================================================
// Watchers
// ============================================================

// 필터 변경 시 첫 페이지로 초기화
watch(
  [
    () => appliedFilters.billingStatus,
    () => appliedFilters.paymentStatus,
    () => appliedFilters.dateRange,
  ],
  () => {
    currentPage.value = 1
  },
)

// itemsPerPage 변경 시 첫 페이지로 초기화
watch(itemsPerPage, () => {
  currentPage.value = 1
})
</script>

<style scoped lang="scss">
// Billing 페이지는 _common.scss에서 스타일 적용
</style>
