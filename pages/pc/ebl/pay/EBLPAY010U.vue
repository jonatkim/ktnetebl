<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo"> </EblPageHeader>

    <div class="ebl-card-container">
      <div class="ebl-tabs-container mb-6">
        <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      </div>

      <EblSubHeader>
        <h2>Total</h2>
        <span class="count">{{ formatNumber(filteredCurrentList.length) }}</span>
        <template #util>
          <EblBtn outlined @click="openPaymentRegister"> Payment Register </EblBtn>
        </template>
      </EblSubHeader>

      <div class="ebl-page-filters mb-3">
        <template v-if="activeTab === 'payments'">
          <EblDatePicker
            v-model="payFilters.dateRange"
            range
            clearable
            placeholder="View Date"
            :start-date="payFilters.dateRange?.[0]"
            :focus-start-date="true"
            auto-apply
            style="width: 260px"
          />
        </template>

        <template v-else>
          <EblSelect
            v-model="balFilters.transactionType"
            clearable
            placeholder="Transaction Type"
            :options="transactionTypeOptions"
            style="width: 200px"
          />
          <EblDatePicker
            v-model="balFilters.dateRange"
            range
            clearable
            placeholder="View Date"
            :start-date="balFilters.dateRange?.[0]"
            :focus-start-date="true"
            auto-apply
            style="width: 260px"
          />
        </template>

        <EblBtn outlined @click="applyFilters">Search</EblBtn>
        <EblBtn icon="ebli:refresh" outlined @click="resetFilters" />
      </div>

      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :row-data="paginatedCurrentList"
        :column-defs="currentColDefs"
        :dom-layout="'autoHeight'"
        @grid-ready="onGridReady"
      />

      <div class="ebl-pagination--container mt-3">
        <div>
          Count
          <EblSelect
            v-model="itemsPerPage"
            placeholder="Items per page"
            :options="pageSizeOptions"
            class="ml-2"
          />
        </div>
        <EblPagination
          v-model="currentPage"
          :length="Math.ceil(filteredCurrentList.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'

const { formatNumber } = useFormat()
const gridApi = ref(null)

// ============================================================
// Page Info & Tabs
// ============================================================
const pageInfo = ref({
  title: 'Payments',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Payments' }],
})

const activeTab = ref('payments')
const tabItems = [
  { label: 'Payments', value: 'payments' },
  { label: 'Account Balance', value: 'balance' },
]

// ============================================================
// State
// ============================================================
const currentPage = ref(1)
const itemsPerPage = ref(10)

const pageSizeOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
]

const transactionTypeOptions = [
  { label: 'All', value: '' },
  { label: 'Deduction', value: 'Deduction' },
  { label: 'Charge', value: 'Charge' },
  { label: 'Recovery', value: 'Recovery' },
]

// ============================================================
// Filters
// ============================================================
const payFilters = reactive({
  dateRange: null,
})

const payAppliedFilters = reactive({
  dateRange: null,
})

const balFilters = reactive({
  transactionType: '',
  dateRange: null,
})

const balAppliedFilters = reactive({
  transactionType: '',
  dateRange: null,
})

const applyFilters = () => {
  if (activeTab.value === 'payments') {
    payAppliedFilters.dateRange = payFilters.dateRange ? [...payFilters.dateRange] : null
  } else {
    balAppliedFilters.transactionType = balFilters.transactionType
    balAppliedFilters.dateRange = balFilters.dateRange ? [...balFilters.dateRange] : null
  }
  currentPage.value = 1
}

const resetFilters = () => {
  if (activeTab.value === 'payments') {
    payFilters.dateRange = null
    payAppliedFilters.dateRange = null
  } else {
    balFilters.transactionType = ''
    balFilters.dateRange = null
    balAppliedFilters.transactionType = ''
    balAppliedFilters.dateRange = null
  }
  currentPage.value = 1
}

// ============================================================
// Mock Data
// ============================================================
const generatePaymentData = () => {
  const paymentMethods = ['Samsung Card', 'Samsung Card', 'Samsung Card', 'Samsung Card']
  const units = ['Won', 'Won', 'Dollar', 'Won']
  const data = []

  for (let i = 1; i <= 50; i++) {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 180))

    data.push({
      no: i,
      amount: Math.floor(Math.random() * 5 + 1) * 100000,
      unit: units[i % units.length],
      paymentMethod: paymentMethods[i % paymentMethods.length],
      paymentDate: date.toISOString().slice(0, 19).replace('T', ' '),
    })
  }

  return data
}

const generateBalanceData = () => {
  const transactionTypes = ['알림톡 - BL 발행', '충전', '알림톡 요금 할인', '알림톡 - BL 발행']
  const statuses = ['Deduction', 'Charge', 'Recovery', 'Deduction']
  const recipients = ['KTNET', '-', '-', 'KTNET']
  const data = []

  for (let i = 1; i <= 50; i++) {
    const changeDate = new Date()
    changeDate.setDate(changeDate.getDate() - Math.floor(Math.random() * 180))

    const accountStatus = statuses[i % statuses.length]
    let balanceChange = 0

    if (accountStatus === 'Deduction') {
      balanceChange = -300
    } else if (accountStatus === 'Charge') {
      balanceChange = 100000
    } else {
      balanceChange = 300
    }

    const accountBalance = Math.floor(Math.random() * 200 + 1) * 100

    data.push({
      no: i,
      transactionType: transactionTypes[i % transactionTypes.length],
      accountStatus,
      recipient: recipients[i % recipients.length],
      balanceChange,
      accountBalance,
      unit: 'Won',
      changeDate: changeDate.toISOString().slice(0, 19).replace('T', ' '),
    })
  }

  return data
}

const paymentData = ref(generatePaymentData())
const balanceData = ref(generateBalanceData())

// ============================================================
// Computed
// ============================================================
const filteredPaymentList = computed(() => {
  return paymentData.value.filter((item) => {
    if (payAppliedFilters.dateRange && payAppliedFilters.dateRange.length === 2) {
      const itemDate = new Date(item.paymentDate)
      const startDate = new Date(payAppliedFilters.dateRange[0])
      const endDate = new Date(payAppliedFilters.dateRange[1])
      endDate.setHours(23, 59, 59, 999)

      if (itemDate < startDate || itemDate > endDate) {
        return false
      }
    }

    return true
  })
})

const filteredBalanceList = computed(() => {
  return balanceData.value.filter((item) => {
    if (
      balAppliedFilters.transactionType &&
      item.accountStatus !== balAppliedFilters.transactionType
    ) {
      return false
    }

    if (balAppliedFilters.dateRange && balAppliedFilters.dateRange.length === 2) {
      const itemDate = new Date(item.changeDate)
      const startDate = new Date(balAppliedFilters.dateRange[0])
      const endDate = new Date(balAppliedFilters.dateRange[1])
      endDate.setHours(23, 59, 59, 999)

      if (itemDate < startDate || itemDate > endDate) {
        return false
      }
    }

    return true
  })
})

const filteredCurrentList = computed(() => {
  return activeTab.value === 'payments' ? filteredPaymentList.value : filteredBalanceList.value
})

const paginatedCurrentList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredCurrentList.value.slice(start, start + itemsPerPage.value)
})

// ============================================================
// Columns
// ============================================================
const paymentColDefs = [
  {
    field: 'no',
    headerName: '',
    width: 60,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 220,
    headerStyle: { justifyContent: 'flex-start' },
    valueFormatter: (params) => formatNumber(params.value || 0),
  },
  {
    field: 'unit',
    headerName: 'Unit',
    width: 220,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'paymentMethod',
    headerName: 'Payment Method',
    width: 220,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'paymentDate',
    headerName: 'Payment Date',
    flex: 1,
    minWidth: 200,
    headerStyle: { justifyContent: 'flex-start' },
  },
]

const balanceColDefs = [
  {
    field: 'no',
    headerName: '',
    width: 60,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'transactionType',
    headerName: 'Transaction Type',
    width: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'accountStatus',
    headerName: 'Account Status',
    width: 160,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'recipient',
    headerName: 'Recipient',
    width: 140,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'balanceChange',
    headerName: 'Balance change',
    width: 150,
    headerStyle: { justifyContent: 'flex-start' },
    cellStyle: (params) => {
      if (params.value < 0) {
        return { color: '#ff3b30', fontWeight: 400 }
      }
      return { color: '#00c853', fontWeight: 400 }
    },
    valueFormatter: (params) => {
      const value = params.value || 0
      return value > 0 ? `+${formatNumber(value)}` : formatNumber(value)
    },
  },
  {
    field: 'accountBalance',
    headerName: 'Account Balance',
    width: 150,
    headerStyle: { justifyContent: 'flex-start' },
    valueFormatter: (params) => formatNumber(params.value || 0),
  },
  {
    field: 'unit',
    headerName: 'Unit',
    width: 120,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'changeDate',
    headerName: 'Change Date',
    flex: 1,
    minWidth: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
]

const currentColDefs = computed(() => {
  return activeTab.value === 'payments' ? paymentColDefs : balanceColDefs
})

// ============================================================
// Methods
// ============================================================
const onGridReady = (params) => {
  gridApi.value = params.api
}

const openPaymentRegister = () => {
  console.log('Payment Register clicked')
}

// ============================================================
// Watchers
// ============================================================
watch(activeTab, () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})

watch(filteredCurrentList, () => {
  const maxPage = Math.max(1, Math.ceil(filteredCurrentList.value.length / itemsPerPage.value))
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage
  }
})
</script>

<style scoped lang="scss"></style>
