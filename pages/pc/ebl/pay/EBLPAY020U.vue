<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="cta" large @click="openCouponDialog"> Register Coupon </EblBtn>
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- Total 서브헤더 -->
      <EblSubHeader>
        <h2>Total</h2>
        <span class="count">{{ formatNumber(filteredAccountList.length) }}</span>
        <template #tooltip>
          •잔액 현황에서는 포인트 및 금액의 변동사항을 확인할 수 있습니다.<br />
          •현황에는 차감/복원/충전 내역이 포함됩니다.
        </template>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters my-3">
        <EblSelect
          v-model="filters.accountType"
          clearable
          placeholder="Account Type: All"
          :options="accountTypeOptions"
          style="width: 200px"
        />
        <EblSelect
          v-model="filters.accountStatus"
          clearable
          placeholder="Account Status: All"
          :options="accountStatusOptions"
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

      <!-- Account Balance AG Grid -->
      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :rowData="paginatedAccountList"
        :columnDefs="colDefs"
        :dom-layout="'autoHeight'"
        :suppress-column-virtualisation="true"
        @grid-ready="onGridReady"
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
          :length="Math.ceil(filteredAccountList.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>
    </div>

    <!-- Register Coupon Dialog -->
    <EblDialog
      v-model="couponDialogOpen"
      transition="slide-x-reverse-transition"
      @close="closeCouponDialog"
    >
      <VCard width="400" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Register Coupon</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeCouponDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblInfo vertical>
            <EblInfoItem
              label="Coupon No"
              hasInput
              :tooltip="`유효기간이 지난 쿠폰은 등록이 불가합니다.`"
            >
              <EblInput
                v-model="couponForm.couponNo"
                placeholder="Input a Coupon No(16 Number)"
                maxlength="16"
                clearable
                :error-message="couponError"
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <EblBtn color="cta" large @click="checkCoupon"> Check </EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'
import { useToastStore } from '~/stores/toast'

const { formatNumber } = useFormat()
const toastStore = useToastStore()
const gridApi = ref(null)
const couponDialogOpen = ref(false)
const couponForm = reactive({
  couponNo: '',
})
const couponError = ref('')

// ============================================================
// Page Info
// ============================================================
const pageInfo = ref({
  title: 'Account Balance',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Payments' }, { text: 'Account Balance' }],
})

// ============================================================
// State
// ============================================================
const currentPage = ref(1)
const itemsPerPage = ref(10)

// ============================================================
// Options
// ============================================================
const accountTypeOptions = [
  { label: 'Point', value: 'Point' },
  { label: 'Amount', value: 'Amount' },
]

const accountStatusOptions = [
  { label: 'Deduction', value: 'Deduction' },
  { label: 'Charge', value: 'Charge' },
  { label: 'Recovery', value: 'Recovery' },
]

// ===== 필터 로직 =====
// 필터 상태 (입력용)
const filters = reactive({
  accountType: '',
  accountStatus: '',
  dateRange: null,
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  accountType: '',
  accountStatus: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.accountType = filters.accountType
  appliedFilters.accountStatus = filters.accountStatus
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  currentPage.value = 1
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.accountType = ''
  filters.accountStatus = ''
  filters.dateRange = null
  appliedFilters.accountType = ''
  appliedFilters.accountStatus = ''
  appliedFilters.dateRange = null
  currentPage.value = 1
}

// ============================================================
// Mock Data
// ============================================================
const generateMockData = () => {
  const accountTypes = ['Point', 'Amount']
  const accountStatuses = ['Deduction', 'Charge', 'Recovery']

  const data = []

  for (let i = 1; i <= 100; i++) {
    const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)]
    const accountStatus = accountStatuses[Math.floor(Math.random() * accountStatuses.length)]

    const changeDate = new Date(
      2025,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    )

    const beforeChange = Math.floor(Math.random() * 150000) + 5000
    let balanceChange = 0

    if (accountStatus === 'Deduction') {
      balanceChange = -(Math.floor(Math.random() * 50000) + 1000)
    } else if (accountStatus === 'Charge') {
      balanceChange = Math.floor(Math.random() * 100000) + 10000
    } else {
      // Recovery
      balanceChange = Math.floor(Math.random() * 50000) + 5000
    }

    const accountBalance = beforeChange + balanceChange

    data.push({
      no: i,
      accountType,
      accountStatus,
      beforeChange,
      balanceChange,
      accountBalance,
      changeDate: changeDate.toISOString().split('T')[0],
    })
  }

  return data.sort((a, b) => new Date(b.changeDate) - new Date(a.changeDate))
}

const accountList = ref(generateMockData())

// ============================================================
// Computed
// ============================================================
const filteredAccountList = computed(() => {
  let result = [...accountList.value]

  // Account Type 필터
  if (appliedFilters.accountType) {
    result = result.filter((item) => item.accountType === appliedFilters.accountType)
  }

  // Account Status 필터
  if (appliedFilters.accountStatus) {
    result = result.filter((item) => item.accountStatus === appliedFilters.accountStatus)
  }

  // 날짜 범위 필터
  if (appliedFilters.dateRange && appliedFilters.dateRange.length === 2) {
    const [start, end] = appliedFilters.dateRange
    result = result.filter((item) => {
      const itemDate = new Date(item.changeDate)
      return itemDate >= start && itemDate <= end
    })
  }

  return result
})

const paginatedAccountList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAccountList.value.slice(start, end)
})

// ============================================================
// AG Grid Column Definitions
// ============================================================
const colDefs = ref([
  {
    headerName: 'No',
    field: 'no',
    width: 80,
    cellStyle: { textAlign: 'center' },
  },
  {
    headerName: 'Account Type',
    field: 'accountType',
    width: 150,
    cellStyle: { textAlign: 'center' },
  },
  {
    headerName: 'Account Status',
    field: 'accountStatus',
    width: 150,
    cellStyle: { textAlign: 'center' },
  },
  {
    headerName: 'Before change',
    field: 'beforeChange',
    flex: 1,
    minWidth: 150,
    cellStyle: { textAlign: 'right', fontWeight: '500' },
    valueFormatter: (params) => {
      return params.value?.toLocaleString() || '0'
    },
  },
  {
    headerName: 'Balance change',
    field: 'balanceChange',
    flex: 1,
    minWidth: 150,
    cellStyle: (params) => {
      const baseStyle = { textAlign: 'right', fontWeight: '600' }
      if (params.value < 0) {
        return { ...baseStyle, color: '#ff1c1c' }
      }
      return { ...baseStyle, color: '#00c853' }
    },
    valueFormatter: (params) => {
      const value = params.value || 0
      if (value < 0) {
        return value.toLocaleString()
      }
      return `+${value.toLocaleString()}`
    },
  },
  {
    headerName: 'Account Balance',
    field: 'accountBalance',
    flex: 1,
    minWidth: 150,
    cellStyle: { textAlign: 'right', fontWeight: '600' },
    valueFormatter: (params) => {
      return params.value?.toLocaleString() || '0'
    },
  },
  {
    headerName: 'Change Date',
    field: 'changeDate',
    width: 140,
    cellStyle: { textAlign: 'center' },
  },
])

// ============================================================
// Methods
// ============================================================
const onGridReady = (params) => {
  gridApi.value = params.api
}

const openCouponDialog = () => {
  couponDialogOpen.value = true
}

const closeCouponDialog = () => {
  couponDialogOpen.value = false
  couponForm.couponNo = ''
  couponError.value = ''
}

const checkCoupon = () => {
  // 에러 메시지 초기화
  couponError.value = ''

  // 쿠폰 번호 입력 체크
  if (!couponForm.couponNo) {
    couponError.value = 'Please enter a coupon number.'
    return
  }

  // 쿠폰 번호 길이 체크
  if (couponForm.couponNo.length !== 16) {
    couponError.value = 'Coupon number must be 16 digits.'
    return
  }

  // TODO: API 호출로 쿠폰 등록 처리
  console.log('Checking coupon:', couponForm.couponNo)

  // 성공 토스트 표시
  toastStore.add({
    text: 'Coupon registered successfully!',
    color: 'success',
  })

  closeCouponDialog()
}

// ============================================================
// Watchers
// ============================================================

// 필터 변경 시 첫 페이지로 초기화
watch(
  [
    () => appliedFilters.accountType,
    () => appliedFilters.accountStatus,
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

// 페이지 변경 시 상단으로 스크롤
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style lang="scss" scoped></style>
