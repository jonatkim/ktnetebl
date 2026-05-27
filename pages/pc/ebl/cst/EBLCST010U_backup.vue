<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="cta" large @click="openAddDialog">Add Departure/Arrival</EblBtn>
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- Sub Header -->
      <EblSubHeader>
        <h2>Total</h2>
        <span class="count">{{ formatNumber(totalCount) }}</span>
        <template #tooltip>
          •출도착지 관리 메뉴에서는 등록한 출도착지의 목록을 확인할 수 있습니다.<br />
          •카테고리 선택 및 지역코드를 입력하여 등록할 수 있습니다.
        </template>
      </EblSubHeader>

      <!-- Filters -->
      <div class="ebl-page-filters">
        <EblInput
          v-model="filters.regionCode"
          clearable
          placeholder="Region Code"
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblInput
          v-model="filters.regionName"
          clearable
          placeholder="Region Name"
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
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
        <div style="flex: 1"></div>
        <EblBtn outlined :disabled="selectedRows.length === 0" @click="deleteSelected">
          Delete
        </EblBtn>
      </div>

      <!-- AG Grid -->
      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :row-data="paginatedRowData"
        :column-defs="colDefs"
        :dom-layout="'autoHeight'"
        :row-selection="rowSelection"
        @grid-ready="onGridReady"
        @selection-changed="onSelectionChanged"
      />

      <!-- Pagination -->
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
          :length="Math.ceil(filteredRowData.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>

      <!-- Add Departure/Arrival Dialog -->
      <EblDialog v-model="dialogOpen" transition="slide-x-reverse-transition" @close="closeDialog">
        <VCard width="520" class="ebl-dialog__card">
          <VCardTitle class="ebl-dialog__header">
            <span class="title">Add Departure/Arrival</span>
            <VSpacer />
            <EblBtn icon pill small @click="closeDialog">
              <VIcon icon="ebli:close" :size="20" />
            </EblBtn>
          </VCardTitle>

          <VCardText class="ebl-dialog__text">
            <EblSubHeader>
              <h3>Departure</h3>
            </EblSubHeader>
            <EblInfo>
              <EblInfoItem label="Region Code" has-input>
                <EblInput
                  v-model="formData.departure.regionCode"
                  placeholder="KRPUS"
                  append-icon="ebli:search"
                  :error-message="errors.departureRegionCode"
                  @click:append="searchRegionCode('departure')"
                  @input="handleDepartureInput"
                />
              </EblInfoItem>

              <EblInfoItem label="Region Name" has-input>
                <EblInput
                  v-model="formData.departure.regionName"
                  placeholder="BUSAN, KOREA"
                  readonly
                />
              </EblInfoItem>
            </EblInfo>

            <VDivider class="my-6" />

            <EblSubHeader>
              <h3>Arrival</h3>
            </EblSubHeader>
            <EblInfo>
              <EblInfoItem label="Region Code" has-input>
                <EblInput
                  v-model="formData.arrival.regionCode"
                  placeholder="KRSEL"
                  append-icon="ebli:search"
                  :error-message="errors.arrivalRegionCode"
                  @click:append="searchRegionCode('arrival')"
                  @input="handleArrivalInput"
                />
              </EblInfoItem>

              <EblInfoItem label="Region Name" has-input>
                <EblInput
                  v-model="formData.arrival.regionName"
                  placeholder="SEOUL, KOREA"
                  readonly
                />
              </EblInfoItem>
            </EblInfo>
          </VCardText>

          <VCardActions class="ebl-dialog__footer">
            <VSpacer />
            <EblBtn large @click="closeDialog">Cancel</EblBtn>
            <EblBtn color="cta" large @click="saveData">Save</EblBtn>
          </VCardActions>
        </VCard>
      </EblDialog>
    </div>
  </div>
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3'
import CodeNameCellRenderer from '~/components/grid/CodeNameCellRenderer.vue'

definePageMeta({ layout: 'default' })

const { formatNumber } = useFormat()

// Page Info
const pageInfo = {
  title: 'Departure/Arrival',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Settings' }, { text: 'Departure/Arrival' }],
}

// Grid state
const gridApi = ref(null)
const page = ref(1)
const itemsPerPage = ref(10)
const selectedRows = ref([])

// Row selection configuration (AG Grid v32.2+)
const rowSelection = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
}

// Dialog state
const dialogOpen = ref(false)

// Form data
const formData = ref({
  departure: {
    regionCode: '',
    regionName: '',
  },
  arrival: {
    regionCode: '',
    regionName: '',
  },
})

// Error messages
const errors = ref({
  departureRegionCode: '',
  arrivalRegionCode: '',
})

// Sample region data for search
const regionData = [
  { code: 'KRPUS', name: 'BUSAN, KOREA' },
  { code: 'KRSEL', name: 'SEOUL, KOREA' },
  { code: 'USBOS', name: 'BOSTON, MA' },
  { code: 'USNYC', name: 'NEW YORK, NY' },
  { code: 'JPTYO', name: 'TOKYO, JAPAN' },
  { code: 'CNSHA', name: 'SHANGHAI, CHINA' },
]

// Sample data
const rowData = ref([
  {
    departureCode: 'KRPUS',
    departureName: 'BUSAN, KOREA',
    arrivalCode: 'KRSEL',
    arrivalName: 'SEOUL, KOREA',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-08-30 09:09:09',
  },
  {
    departureCode: 'KRPUS',
    departureName: 'BUSAN, KOREA',
    arrivalCode: 'USBOS',
    arrivalName: 'BOSTON, MA',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-08-20 09:09:09',
  },
  {
    departureCode: 'KRSEL',
    departureName: 'SEOUL, KOREA',
    arrivalCode: 'KRPUS',
    arrivalName: 'BUSAN, KOREA',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-04-01 09:09:09',
  },
  {
    departureCode: 'USBOS',
    departureName: 'BOSTON, MA',
    arrivalCode: 'KRPUS',
    arrivalName: 'BUSAN, KOREA',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-03-24 09:09:09',
  },
])

// Add more sample data
for (let i = 5; i <= 50; i++) {
  rowData.value.push({
    departureCode: 'KRPUS',
    departureName: 'BUSAN, KOREA',
    arrivalCode: 'KRSEL',
    arrivalName: 'SEOUL, KOREA',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-03-24 09:09:09',
  })
}

const totalCount = computed(() => filteredRowData.value.length)

// Column definitions
const colDefs = ref([
  {
    headerName: '',
    width: 60,
    cellClass: 'text-center',
    valueGetter: (params) => {
      return (
        filteredRowData.value.length -
        ((page.value - 1) * itemsPerPage.value + params.node.rowIndex)
      )
    },
  },
  {
    headerName: 'Departure',
    field: 'departure',
    flex: 1,
    minWidth: 200,
    cellRenderer: CodeNameCellRenderer,
    cellRendererParams: {
      codeField: 'departureCode',
      nameField: 'departureName',
    },
    autoHeight: true,
  },
  {
    headerName: 'Arrival',
    field: 'arrival',
    flex: 1,
    minWidth: 200,
    cellRenderer: CodeNameCellRenderer,
    cellRendererParams: {
      codeField: 'arrivalCode',
      nameField: 'arrivalName',
    },
    autoHeight: true,
  },
  {
    headerName: 'Creator',
    field: 'creator',
    width: 180,
  },
  {
    headerName: 'Add Date',
    field: 'addDate',
    width: 180,
  },
])

// ===== 필터 로직 =====
// 필터 상태 (입력용)
const filters = ref({
  regionCode: '',
  regionName: '',
  dateRange: null,
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = ref({
  regionCode: '',
  regionName: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.value.regionCode = filters.value.regionCode
  appliedFilters.value.regionName = filters.value.regionName
  appliedFilters.value.dateRange = filters.value.dateRange ? [...filters.value.dateRange] : null
  page.value = 1
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.value = {
    regionCode: '',
    regionName: '',
    dateRange: null,
  }
  appliedFilters.value = {
    regionCode: '',
    regionName: '',
    dateRange: null,
  }
  page.value = 1
}

// Filtered data
const filteredRowData = computed(() => {
  let filtered = [...rowData.value]

  if (appliedFilters.value.regionCode) {
    const searchTerm = appliedFilters.value.regionCode.toLowerCase()
    filtered = filtered.filter(
      (row) =>
        row.departureCode.toLowerCase().includes(searchTerm) ||
        row.arrivalCode.toLowerCase().includes(searchTerm),
    )
  }

  if (appliedFilters.value.regionName) {
    const searchTerm = appliedFilters.value.regionName.toLowerCase()
    filtered = filtered.filter(
      (row) =>
        row.departureName.toLowerCase().includes(searchTerm) ||
        row.arrivalName.toLowerCase().includes(searchTerm),
    )
  }

  if (appliedFilters.value.dateRange && appliedFilters.value.dateRange.length === 2) {
    const [startDate, endDate] = appliedFilters.value.dateRange
    filtered = filtered.filter((row) => {
      const rowDate = new Date(row.addDate)
      return rowDate >= new Date(startDate) && rowDate <= new Date(endDate)
    })
  }

  return filtered
})

// Pagination
const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRowData.value.slice(start, end)
})

// Grid methods
const onGridReady = (params) => {
  gridApi.value = params.api
}

const onSelectionChanged = () => {
  selectedRows.value = gridApi.value.getSelectedRows()
}

// Dialog methods
const openAddDialog = () => {
  formData.value = {
    departure: {
      regionCode: '',
      regionName: '',
    },
    arrival: {
      regionCode: '',
      regionName: '',
    },
  }
  errors.value = {
    departureRegionCode: '',
    arrivalRegionCode: '',
  }
  dialogOpen.value = true
}

const closeDialog = () => {
  dialogOpen.value = false
  errors.value = {
    departureRegionCode: '',
    arrivalRegionCode: '',
  }
}

const searchRegion = (type) => {
  const code =
    type === 'departure' ? formData.value.departure.regionCode : formData.value.arrival.regionCode
  if (!code) return

  const region = regionData.find((r) => r.code.toUpperCase() === code.toUpperCase())
  if (region) {
    if (type === 'departure') {
      formData.value.departure.regionName = region.name
    } else {
      formData.value.arrival.regionName = region.name
    }
  } else {
    if (type === 'departure') {
      formData.value.departure.regionName = ''
    } else {
      formData.value.arrival.regionName = ''
    }
  }
}

const handleDepartureInput = () => {
  errors.value.departureRegionCode = ''
  searchRegion('departure')
}

const handleArrivalInput = () => {
  errors.value.arrivalRegionCode = ''
  searchRegion('arrival')
}

const searchRegionCode = (type) => {
  // TODO: Open region code search dialog/dropdown
  console.log('Search region code for:', type)
}

const saveData = () => {
  // Reset errors
  errors.value = {
    departureRegionCode: '',
    arrivalRegionCode: '',
  }

  // Validation
  let hasError = false

  if (!formData.value.departure.regionCode) {
    errors.value.departureRegionCode = '필수 항목을 입력해 주세요.'
    hasError = true
  }

  if (!formData.value.arrival.regionCode) {
    errors.value.arrivalRegionCode = '필수 항목을 입력해 주세요.'
    hasError = true
  }

  if (hasError) {
    return
  }

  // TODO: Implement save logic
  console.log('Save data:', formData.value)
  closeDialog()
}

const deleteSelected = () => {
  if (selectedRows.value.length === 0) return

  // TODO: Implement delete logic
  console.log('Delete selected:', selectedRows.value)

  // Remove from rowData
  selectedRows.value.forEach((selectedRow) => {
    const index = rowData.value.findIndex(
      (row) =>
        row.departureCode === selectedRow.departureCode &&
        row.arrivalCode === selectedRow.arrivalCode &&
        row.addDate === selectedRow.addDate,
    )
    if (index !== -1) {
      rowData.value.splice(index, 1)
    }
  })
  selectedRows.value = []
}
</script>
