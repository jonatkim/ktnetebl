<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo" />
    <div class="ebl-card-container">
      <!-- EblSubHeader -->
      <EblSubHeader>
        <h2>total</h2>
        <span class="count">{{ formatNumber(9280) }}</span>
        <template #tooltip>
          •eBL 매입 현황 메뉴에서는 현재 진행중인 B/L 매입 내역을 확인할 수 있습니다.<br />
          •역할에 따라 화주/은행으로 구분하여 확인이 가능합니다.
        </template>
        <template #util>
          <EblBtn outlined icon="ebli:setting" />
        </template>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters">
        <EblInput
          v-model="filters.applicant"
          clearable
          placeholder="Applicant"
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblInput
          v-model="filters.recipient"
          clearable
          placeholder="Recipient"
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblSelect
          v-model="filters.purchaseStatus"
          placeholder="Purchase Status"
          :options="purchaseStatusOptions"
          clearable
          multiple
        />
        <EblDatePicker
          v-model="filters.dateRange"
          range
          clearable
          placeholder="Date Range"
          :start-date="filters.dateRange?.[0]"
          :focus-start-date="true"
          style="width: 260px"
          auto-apply
        />
        <EblBtn outlined @click="applyFilters">Search</EblBtn>
        <EblBtn icon="ebli:refresh" outlined color="transparent" @click="resetFilters" />
      </div>

      <!-- AG Grid -->
      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :row-data="paginatedRowData"
        :column-defs="colDefs"
        :dom-layout="'autoHeight'"
        @grid-ready="onGridReady"
        @cell-clicked="onCellClicked"
      />
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
          v-model="page"
          :length="Math.ceil(rowData.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>

      <!-- EBLNEG050P - eNego Detail Dialog -->
      <EblDialog v-model="detailOpen" transition="slide-x-reverse-transition" @close="closeDetail">
        <VCard width="450" class="ebl-dialog__card">
          <VCardTitle class="ebl-dialog__header">
            <span class="title">eNego Detail</span>
            <VSpacer />
            <EblBtn icon pill small @click="closeDetail">
              <VIcon icon="ebli:close" :size="20" />
            </EblBtn>
          </VCardTitle>

          <VCardText class="ebl-dialog__text">
            <EblSubHeader>
              <h3>eNego Info</h3>
            </EblSubHeader>
            <EblInfo>
              <EblInfoItem label="L/C No">{{ detailRow?.lcNo || '-' }}</EblInfoItem>
              <EblInfoItem label="Transaction No">{{
                detailRow?.transactionNo || '-'
              }}</EblInfoItem>
              <EblInfoItem label="B/L No">
                <span class="ebl-link">{{ detailRow?.blNo || '-' }}</span>
              </EblInfoItem>
              <EblInfoItem label="Applicant" has-input>
                <div class="ebl-thumbs-item">
                  <div
                    v-if="detailRow?.applicantLogo"
                    :src="detailRow.applicantLogo"
                    alt="Logo"
                    class="ebl-thumbs-item__avatar"
                  >
                    <img src="~/assets/images/common/ci/HMM.png" />
                  </div>
                  <span class="ebl-thumbs-item__content">{{ detailRow?.applicant || '-' }}</span>
                </div>
              </EblInfoItem>
              <EblInfoItem label="Applicant Date">{{
                detailRow?.applicationDate || '-'
              }}</EblInfoItem>
              <EblInfoItem label="Purchase Bank">{{ detailRow?.purchaseBank || '-' }}</EblInfoItem>
              <EblInfoItem label="D/C">Purchase</EblInfoItem>
              <EblInfoItem label="Purchase Status">{{
                detailRow?.purchaseStatus || '-'
              }}</EblInfoItem>
              <EblInfoItem label="Document No">XXXXXXXXXXXXXX</EblInfoItem>
              <EblInfoItem label="D/C Date">{{ detailRow?.applicationDate || '-' }}</EblInfoItem>
              <EblInfoItem label="Purchase Amount">1,000,000</EblInfoItem>
              <EblInfoItem label="Unit">Dollar</EblInfoItem>
              <EblInfoItem label="Opening Bank">{{ detailRow?.openingBank || '-' }}</EblInfoItem>
              <EblInfoItem label="Attache(I/V)" has-input>
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">filename.png</span>
                  <EblBtn outlined>Preview</EblBtn>
                </div>
              </EblInfoItem>
              <EblInfoItem label="Attache(P/L)" has-input>
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">filename0202.png</span>
                  <EblBtn outlined>Preview</EblBtn>
                </div>
              </EblInfoItem>
              <EblInfoItem label="Attache(C/O)" has-input>
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">filenamefkdjfkdj.png</span>
                  <EblBtn outlined>Preview</EblBtn>
                </div>
              </EblInfoItem>
              <EblInfoItem label="Attache(Insurance)" has-input>
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">filename.png</span>
                  <EblBtn outlined>Preview</EblBtn>
                </div>
              </EblInfoItem>
            </EblInfo>
          </VCardText>
        </VCard>
      </EblDialog>
    </div>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'
import CompanyNameCellRenderer from '~/components/grid/CompanyNameCellRenderer.vue'

const { formatNumber } = useFormat()
const gridApi = shallowRef(null)
const detailOpen = ref(false)
const detailRow = ref(null)

const pageInfo = ref({
  title: 'Negotiation',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Management' }, { text: 'Negotiation' }],
})

// 그리드 페이지네이션
const page = ref(1)
const itemsPerPage = ref(10)
// 더미 데이터 생성 함수
const generateDummyData = () => {
  const data = []
  const statuses = [
    'Purchase progress',
    'Purchase Approval',
    'Complementary submission',
    'Complementary Approval',
    'Documents Return',
    'Return completed',
  ]
  const companies = [
    'Samsung Electronics',
    'Hyundai Motor',
    'LG Display',
    'SK Hynix',
    'Posco',
    'Hanwha Solutions',
  ]
  const banks = [
    'KB Kookmin Bank',
    'Shinhan Bank',
    'Hana Bank',
    'Woori Bank',
    'NH Bank',
    'IBK Bank',
  ]

  for (let i = 1; i <= 100; i++) {
    // 랜덤 날짜 생성 (최근 1년 내)
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = date.toISOString().split('T')[0]

    data.push({
      no: i,
      lcNo: `LC${String(i).padStart(10, '0')}`,
      transactionNo: `TRX${String(i * 123).padStart(10, '0')}`,
      blNo: `HDMUSELM${70328400 + i}`,
      applicationDate: formattedDate,
      applicant: companies[i % companies.length],
      applicantLogo: `https://i.pravatar.cc/150?img=${i % 70}`,
      purchaseBank: banks[i % banks.length],
      openingBank: banks[(i + 1) % banks.length],
      purchaseStatus: statuses[i % statuses.length],
    })
  }
  return data
}

const rowData = ref(generateDummyData())

// 최대 페이지 수
const maxPage = computed(() => {
  return Math.ceil(rowData.value.length / itemsPerPage.value)
})

// 페이지네이션된 rowData
const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return rowData.value.slice(start, end)
})

// itemsPerPage 변경 시 현재 페이지 조정
watch(itemsPerPage, () => {
  if (page.value > maxPage.value) {
    page.value = Math.max(1, maxPage.value)
  }
})

// Column Definitions: Defines the columns to be displayed.
const colDefs = ref([
  {
    field: 'no',
    headerName: '',
    width: 60,
    maxWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'lcNo',
    headerName: 'L/C No',

    width: 150,
    minWidth: 120,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'transactionNo',
    headerName: 'Transaction No',
    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'blNo',
    headerName: 'B/L No',

    width: 200,
    minWidth: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'applicationDate',
    headerName: 'Application Date',

    width: 150,
    minWidth: 130,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'applicant',
    headerName: 'Applicant',
    width: 180,
    minWidth: 150,
    flex: 1,
    cellDataType: false,
    cellRenderer: CompanyNameCellRenderer,
    cellClass: 'line-2',
    cellRendererParams: (params) => ({
      name:
        typeof params.data?.applicant === 'string'
          ? params.data.applicant
          : (params.data?.applicant?.name ?? ''),
      logo: params.data?.applicantLogo || params.data?.applicantLogo?.logo || '',
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'purchaseBank',
    headerName: 'Purchase Bank',

    width: 150,
    minWidth: 130,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'openingBank',
    headerName: 'Opening Bank',

    width: 150,
    minWidth: 130,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'purchaseStatus',
    headerName: 'Purchase Status',

    width: 160,
    minWidth: 140,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// ===== 필터 로직 =====
// 기본 날짜 범위 반환
function getDefaultDateRange() {
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - 30)
  return [start, today]
}

// 필터 상태 (입력용)
const filters = reactive({
  applicant: '',
  recipient: '',
  purchaseStatus: [],
  dateRange: getDefaultDateRange(),
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  applicant: '',
  recipient: '',
  purchaseStatus: [],
  dateRange: getDefaultDateRange(),
})

// Purchase Status 옵션
const purchaseStatusOptions = ref([
  { label: 'All', value: '_all' },
  { label: 'Purchase progress', value: 'Purchase progress' },
  { label: 'Purchase Approval', value: 'Purchase Approval' },
  { label: 'Complementary submission', value: 'Complementary submission' },
  { label: 'Complementary Approval', value: 'Complementary Approval' },
  { label: 'Documents Return', value: 'Documents Return' },
  { label: 'Return completed', value: 'Return completed' },
])

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.applicant = filters.applicant
  appliedFilters.recipient = filters.recipient
  appliedFilters.purchaseStatus = [...filters.purchaseStatus]
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  page.value = 1
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.applicant = ''
  filters.recipient = ''
  filters.purchaseStatus = []
  filters.dateRange = getDefaultDateRange()
  appliedFilters.applicant = ''
  appliedFilters.recipient = ''
  appliedFilters.purchaseStatus = []
  appliedFilters.dateRange = getDefaultDateRange()
  page.value = 1
}

// purchaseStatus watch - All 선택 처리
watch(
  () => filters.purchaseStatus,
  (newValue, oldValue) => {
    if (!Array.isArray(newValue)) return
    if (!oldValue || !Array.isArray(oldValue)) return

    const hasAll = newValue.includes('_all')
    const hadAll = oldValue.includes('_all')
    const allValues = purchaseStatusOptions.value
      .filter((opt) => opt.value !== '_all')
      .map((opt) => opt.value)
    const allOthersSelected = allValues.every((v) => newValue.includes(v))

    // All이 새로 추가된 경우
    if (!hadAll && hasAll) {
      filters.purchaseStatus = ['_all', ...allValues]
    }
    // All이 있는데 다른 항목 중 하나라도 빠진 경우
    else if (hasAll && !allOthersSelected) {
      filters.purchaseStatus = newValue.filter((v) => v !== '_all')
    }
  },
  { deep: true },
)

// AG Grid 이벤트 핸들러
const onGridReady = (params) => {
  gridApi.value = params.api
}

// 셀 클릭 핸들러
const onCellClicked = (params) => {
  if (params.column.getColId() === 'lcNo') {
    detailRow.value = params.data
    detailOpen.value = true
  }
}

const closeDetail = () => {
  detailOpen.value = false
}
</script>
