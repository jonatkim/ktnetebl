<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo" />

    <div class="ebl-card-container">
      <!-- View Type Tabs -->
      <EblTabs v-model="activeTab" :items="tabItems" size="lg" />

      <!-- EblSubHeader -->
      <EblSubHeader class="mt-6">
        <h2>Total</h2>
        <span class="count">{{ formatNumber(filteredRowData.length) }}</span>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters">
        <EblInput
          v-model="filters.companyName"
          clearable
          placeholder="Company Name"
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblInput
          v-model="filters.blNo"
          clearable
          placeholder="B/L No"
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblDatePicker
          v-model="filters.dateRange"
          range
          clearable
          placeholder="Save Date"
          :start-date="filters.dateRange?.[0]"
          :focus-start-date="true"
        />
        <EblBtn outlined @click="applyFilters">Search</EblBtn>
        <EblBtn icon="ebli:refresh" outlined @click="resetFilters" />
      </div>

      <!-- Tab Content: List View -->
      <template v-if="activeTab === 'list'">
        <!-- AG Grid - List View -->
        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="paginatedRowData"
          :column-defs="listColDefs"
          :dom-layout="'autoHeight'"
          @grid-ready="onGridReady"
          @cell-clicked="onCellClicked"
        />
      </template>

      <!-- Tab Content: Grid View -->
      <template v-else-if="activeTab === 'grid'">
        <!-- Grid View Container -->
        <div class="ebl-grid-view ebl-grid-view--wrap">
          <EblGridViewItem
            v-for="(item, index) in paginatedRowData"
            :key="index"
            :bl-no="item.blNo"
            :company-name="item.companyName"
            :bl-status="item.blStatus"
            :routing="item.routing"
            :received-date="item.receivedDate"
            @click="onGridItemClick(item)"
          />
        </div>
      </template>

      <!-- Pagination -->
      <div class="ebl-pagination--container mt-3">
        <div>
          Count
          <EblSelect
            v-model="itemsPerPage"
            placeholder="Items per page"
            :options="itemsPerPageOptions"
            class="ml-2"
          />
        </div>
        <EblPagination
          v-model="page"
          :length="Math.ceil(filteredRowData.length / itemsPerPage)"
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
import CompanyNameCellRenderer from '~/components/grid/CompanyNameCellRenderer.vue'
import BadgeCellRenderer from '~/components/grid/BadgeCellRenderer.vue'
import RoutingCodeCellRenderer from '~/components/grid/RoutingCodeCellRenderer.vue'
import EblGridViewItem from '~/components/grid/EblGridViewItem.vue'

const router = useRouter()
const { formatNumber } = useFormat()
const gridApi = shallowRef(null)
const activeTab = ref('list')

// 페이지 정보
const pageInfo = ref({
  title: 'Draft',
  breadcrumbItems: [{ text: 'Menu' }, { text: 'Documents' }, { text: 'Draft' }],
})

// 보기 탭 (List/Grid)
const tabItems = [
  { label: 'List View', value: 'list', icon: 'ebli:list' },
  { label: 'Grid View', value: 'grid', icon: 'ebli:grid' },
]

// 페이지네이션 (List/Grid 뷰별)
const listPage = ref(1)
const listItemsPerPage = ref(10)
const gridPage = ref(1)
const gridItemsPerPage = ref(12)

// 현재 탭에 따른 페이지 번호
const page = computed({
  get: () => (activeTab.value === 'list' ? listPage.value : gridPage.value),
  set: (val) => {
    if (activeTab.value === 'list') listPage.value = val
    else gridPage.value = val
  },
})

const itemsPerPage = computed({
  get: () => (activeTab.value === 'list' ? listItemsPerPage.value : gridItemsPerPage.value),
  set: (val) => {
    if (activeTab.value === 'list') {
      listItemsPerPage.value = val
      listPage.value = 1
    } else {
      gridItemsPerPage.value = val
      gridPage.value = 1
    }
  },
})

// 탭별 항목 수 옵션
const itemsPerPageOptions = computed(() => {
  if (activeTab.value === 'list') {
    return [
      { label: '10', value: 10 },
      { label: '20', value: 20 },
      { label: '50', value: 50 },
      { label: '100', value: 100 },
    ]
  } else {
    return [
      { label: '12', value: 12 },
      { label: '24', value: 24 },
      { label: '48', value: 48 },
      { label: '96', value: 96 },
    ]
  }
})

// 더미 데이터 생성
const generateDummyData = () => {
  const data = []
  const companies = [
    'KTNETEBL1',
    'KTNETEBL2',
    'KTNETEBL3',
    'VERY LONG COMPANY NAME FOR TESTING TRUNCATION AND ELLIPSIS BEHAVIOR IN THE GRID CELL RENDERER',
  ]
  const blStatus = ['DRAFT']
  const blStatusBadgeColorMap = {
    DRAFT: 'black',
  }
  const blStatusTooltipMap = {
    DRAFT: '작성중',
  }
  const routingData = [
    {
      origin: { code: 'KRPUS', name: 'BUSAN, KOREA' },
      destination: { code: 'USBOS', name: 'BOSTON, USA' },
    },
    {
      origin: { code: 'KRINC', name: 'INCHEON, KOREA' },
      destination: { code: 'DEHAM', name: 'HAMBURG, GERMANY' },
    },
    {
      origin: { code: 'KRKAN', name: 'GWANGYANG, KOREA' },
      destination: { code: 'USNYC', name: 'NEW YORK, USA' },
    },
  ]

  for (let i = 1; i <= 9280; i++) {
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`

    const routingInfo = routingData[i % routingData.length]
    const statusValue = blStatus[i % blStatus.length]
    const companyIndex = i % companies.length
    data.push({
      no: i,
      blNo: `HDMUSEL${String(i).padStart(10, '0')}`,
      companyName: {
        name: companies[companyIndex],
        logo: `https://i.pravatar.cc/150?img=${(i % 20) + 1}`,
        prefix: 'TO',
      },
      blStatus: {
        value: statusValue,
        color: blStatusBadgeColorMap[statusValue],
        tooltip: blStatusTooltipMap[statusValue],
      },
      routing: routingInfo,
      receivedDate: formattedDate,
    })
  }

  return data
}

const rowData = ref(generateDummyData())

// ===== 필터 로직 =====
// 필터 상태 (입력용)
const filters = reactive({
  companyName: '',
  blNo: '',
  dateRange: getDefaultDateRange(),
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  companyName: '',
  blNo: '',
  dateRange: getDefaultDateRange(),
})

// 기본 날짜 범위 반환
function getDefaultDateRange() {
  return [new Date('2025-12-01'), new Date('2026-01-01')]
}

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.companyName = filters.companyName
  appliedFilters.blNo = filters.blNo
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : getDefaultDateRange()
  if (activeTab.value === 'list') {
    listPage.value = 1
  } else {
    gridPage.value = 1
  }
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.companyName = ''
  filters.blNo = ''
  filters.dateRange = getDefaultDateRange()
  appliedFilters.companyName = ''
  appliedFilters.blNo = ''
  appliedFilters.dateRange = getDefaultDateRange()
  if (activeTab.value === 'list') {
    listPage.value = 1
  } else {
    gridPage.value = 1
  }
}

// 필터링된 데이터
const filteredRowData = computed(() => {
  return rowData.value.filter((row) => {
    const matchesCompanyName = (row.companyName?.name || '')
      .toLowerCase()
      .includes(appliedFilters.companyName.toLowerCase())
    const matchesBlNo = row.blNo.toLowerCase().includes(appliedFilters.blNo.toLowerCase())

    let matchesDate = true
    if (appliedFilters.dateRange && appliedFilters.dateRange[0] && appliedFilters.dateRange[1]) {
      const rowDate = new Date(row.receivedDate)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = rowDate >= startDate && rowDate <= endDate
    }

    return matchesCompanyName && matchesBlNo && matchesDate
  })
})

// 페이지네이션된 데이터
const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRowData.value.slice(start, end)
})

// 페이지네이션 수정 시 페이지 재조정
watch([listItemsPerPage, gridItemsPerPage, () => rowData.value.length], () => {
  const currentMaxPage = Math.ceil(filteredRowData.value.length / itemsPerPage.value)

  if (activeTab.value === 'list' && listPage.value > currentMaxPage) {
    listPage.value = Math.max(1, currentMaxPage)
  }
  if (activeTab.value === 'grid' && gridPage.value > currentMaxPage) {
    gridPage.value = Math.max(1, currentMaxPage)
  }
})

// 컬럼 정의
const listColDefs = ref([
  {
    field: 'no',
    headerName: '',
    width: 60,
    maxWidth: 100,
    cellStyle: { display: 'flex', justifyContent: 'flex-end' },
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'companyName',
    headerName: 'Company Name',
    flex: 1,
    minWidth: 180,
    cellRenderer: CompanyNameCellRenderer,
    cellRendererParams: (params) => ({
      name: params.data?.companyName?.name || '',
      logo: params.data?.companyName?.logo || '',
      prefix: params.data?.companyName?.prefix || '',
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'blNo',
    headerName: 'B/L No',
    flex: 1,
    minWidth: 180,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'blStatus',
    headerName: 'B/L Status',
    width: 110,
    minWidth: 110,
    cellRenderer: BadgeCellRenderer,
    cellRendererParams: (params) => ({
      color: params.data?.blStatus?.color,
      tooltip: params.data?.blStatus?.tooltip,
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'routing',
    headerName: 'Routing',
    flex: 1,
    minWidth: 200,
    cellRenderer: RoutingCodeCellRenderer,
    cellStyle: { display: 'flex', alignItems: 'center' },
    cellRendererParams: (params) => ({
      origin: params.data?.routing?.origin || { code: '', name: '' },
      destination: params.data?.routing?.destination || { code: '', name: '' },
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'receivedDate',
    headerName: 'Save Date',
    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// 그리드 이벤트 핸들러
const onGridReady = (params) => {
  gridApi.value = params.api
}

// 셀 클릭
const onCellClicked = (params) => {
  if (params.colDef.field === 'blNo' || params.colDef.field === 'companyName') {
    router.push('/pc/ebl/cdc/EBLCDC010U')
  }
}

// 그리드 아이템 클릭
const onGridItemClick = (item) => {
  console.log('Grid Item Clicked:', item)
  router.push('/pc/ebl/cdc/EBLCDC010U')
}
</script>
