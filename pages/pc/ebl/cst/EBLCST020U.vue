<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="cta" large @click="openAddDialog">Add T&C</EblBtn>
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- Sub Header -->
      <EblSubHeader>
        <h2>Total</h2>
        <span class="count">{{ formatNumber(totalCount) }}</span>
        <template #tooltip>
          •T&C Mgmt 메뉴에서는 등록한 약관 목록을 확인합니다.<br />
          •약관 제목과 내용을 입력하여 등록할 수 있습니다.
        </template>
      </EblSubHeader>

      <!-- Filters -->
      <div class="ebl-page-filters">
        <EblInput
          v-model="filters.title"
          clearable
          placeholder="Title"
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
        @cell-clicked="onCellClicked"
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

      <!-- Add/Edit T&C Dialog -->
      <EblDialog v-model="dialogOpen" transition="slide-x-reverse-transition" @close="closeDialog">
        <VCard width="640" class="ebl-dialog__card">
          <VCardTitle class="ebl-dialog__header">
            <span class="title">{{ isEditMode ? 'Edit T&C' : 'Add T&C' }}</span>
            <VSpacer />
            <EblBtn icon pill small @click="closeDialog">
              <VIcon icon="ebli:close" :size="20" />
            </EblBtn>
          </VCardTitle>

          <VCardText class="ebl-dialog__text">
            <EblInfo vertical>
              <EblInfoItem label="T&C Order" has-input>
                <EblSelect
                  v-model="formData.order"
                  placeholder="Select T&C Order"
                  :options="orderOptions"
                  :error-message="errors.order"
                  block
                  @update:model-value="errors.order = ''"
                />
              </EblInfoItem>

              <EblInfoItem label="T&C Title" has-input>
                <EblInput
                  v-model="formData.title"
                  placeholder="Input a T&C Title"
                  :error-message="errors.title"
                  @input="errors.title = ''"
                />
              </EblInfoItem>

              <EblInfoItem label="T&C Message" has-input>
                <div style="position: relative">
                  <EblTextarea
                    v-model="formData.message"
                    placeholder="Input a T&C Message"
                    :error-message="errors.message"
                    :maxlength="500"
                    counter
                    @input="errors.message = ''"
                  />
                </div>
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

definePageMeta({ layout: 'default' })

const { formatNumber } = useFormat()

// Page Info
const pageInfo = {
  title: 'T&C Mgmt',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Settings' }, { text: 'T&C Mgmt' }],
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
const isEditMode = ref(false)
const originalOrder = ref(null)

// Form data
const formData = ref({
  order: null,
  title: '',
  message: '',
})

// Error messages
const errors = ref({
  order: '',
  title: '',
  message: '',
})

// Sample data
const rowData = ref([
  {
    order: 10,
    title: 'SUPERSENDING CLAUSE',
    message:
      'All agreement of freight engagements for the Goods are superseded by this Bill of Lading.',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-09-19 13:30:20',
  },
  {
    order: 9,
    title: 'GOVERNING LAW AND JURISDICTION',
    message:
      'Any claims arising from or in connection with this bill of lading shall be governed by the laws of England and Wales.',
    creator: 'admin@ktnet.co.kr',
    addDate: '2025-08-15 14:30:45',
  },
  {
    order: 8,
    title: 'CLAIM PARAMOUNT',
    message:
      'The carrier reserves the right to claim a lien on all cargo for freight, charges and any other amounts due.',
    creator: 'admin@ktnet.co.kr',
    addDate: '2025-08-10 09:15:20',
  },
  {
    order: 7,
    title: 'LIABILITY LIMITATION',
    message:
      'The carrier and ship shall not be liable for any loss or damage unless suit is brought within one year of delivery or the date when the goods should have been delivered.',
    creator: 'manager@ktnet.co.kr',
    addDate: '2025-08-05 11:45:00',
  },
  {
    order: 6,
    title: 'DANGEROUS GOODS',
    message:
      'Shipper warrants that dangerous goods are properly classified, packaged, marked and labeled in accordance with international regulations.',
    creator: 'admin@ktnet.co.kr',
    addDate: '2025-07-28 16:20:30',
  },
  {
    order: 5,
    title: 'INSPECTION OF GOODS',
    message:
      'The carrier does not guarantee the condition of the goods and reserves the right to inspect cargo at any time.',
    creator: 'manager@ktnet.co.kr',
    addDate: '2025-07-20 13:10:15',
  },
  {
    order: 4,
    title: 'FREIGHT PAYMENT TERMS',
    message:
      'Freight is payable in full without deduction at the port of destination by the consignee unless otherwise agreed in writing.',
    creator: 'admin@ktnet.co.kr',
    addDate: '2025-07-15 10:30:45',
  },
  {
    order: 3,
    title: 'GENERAL AVERAGE',
    message:
      'General Average shall be adjusted according to the York-Antwerp Rules. The Shipper/Consignee shall pay their proportion of General Average contributions.',
    creator: 'manager@ktnet.co.kr',
    addDate: '2025-07-10 15:45:20',
  },
  {
    order: 2,
    title: 'NOTICE OF LOSS OR DAMAGE',
    message:
      'Notice of loss or damage must be given in writing to the carrier before or at the time of removal of the goods from the custody of the carrier.',
    creator: 'admin@ktnet.co.kr',
    addDate: '2025-07-05 08:20:00',
  },
  {
    order: 1,
    title: 'ACCEPTANCE OF BILL OF LADING',
    message:
      'The shipper accepts this Bill of Lading with all its terms and conditions as set forth herein. The shipper is bound by the terms and conditions.',
    creator: 'manager@ktnet.co.kr',
    addDate: '2025-06-30 12:00:30',
  },
])

const totalCount = computed(() => filteredRowData.value.length)

// T&C Order options - 동적으로 전체 목록 수에 따라 생성
const orderOptions = computed(() => {
  return Array.from({ length: rowData.value.length + 1 }, (_, i) => ({
    label: String(i + 1),
    value: i + 1,
  }))
})

// Column definitions
const colDefs = ref([
  {
    headerName: 'Order',
    field: 'order',
    width: 80,
    cellClass: 'text-center',
  },
  {
    headerName: 'Title',
    field: 'title',
    flex: 1,
    minWidth: 200,
  },
  {
    headerName: 'Message',
    field: 'message',
    flex: 1,
    minWidth: 250,
    wrapText: true,
    autoHeight: true,
    cellClass: 'ebl-ellipsis-2',
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
  title: '',
  dateRange: null,
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = ref({
  title: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.value.title = filters.value.title
  appliedFilters.value.dateRange = filters.value.dateRange ? [...filters.value.dateRange] : null
  page.value = 1
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.value = {
    title: '',
    dateRange: null,
  }
  appliedFilters.value = {
    title: '',
    dateRange: null,
  }
  page.value = 1
}

// Filtered data
const filteredRowData = computed(() => {
  let filtered = [...rowData.value]

  if (appliedFilters.value.title) {
    const searchTerm = appliedFilters.value.title.toLowerCase()
    filtered = filtered.filter(
      (row) =>
        row.title.toLowerCase().includes(searchTerm) ||
        row.message.toLowerCase().includes(searchTerm),
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

const onCellClicked = (params) => {
  // 체크박스, 헤더 행 클릭 무시
  if (params.colDef.field === undefined || !params.data) return
  // 셀 더블클릭 또는 특정 필드 클릭시 편집 다이얼로그 열기
  if (params.column.colId !== '0') {
    editRow(params.data)
  }
}

// Dialog methods
const openAddDialog = () => {
  isEditMode.value = false
  const maxOrder = Math.max(...rowData.value.map((row) => row.order), 0)
  formData.value = {
    order: maxOrder + 1,
    title: '',
    message: '',
  }
  errors.value = {
    order: '',
    title: '',
    message: '',
  }
  dialogOpen.value = true
}

const editRow = (row) => {
  isEditMode.value = true
  originalOrder.value = row.order
  formData.value = {
    order: row.order,
    title: row.title,
    message: row.message,
  }
  errors.value = {
    order: '',
    title: '',
    message: '',
  }
  dialogOpen.value = true
}

const closeDialog = () => {
  dialogOpen.value = false
  originalOrder.value = null
  errors.value = {
    order: '',
    title: '',
    message: '',
  }
}

const saveData = () => {
  // Reset errors
  errors.value = {
    order: '',
    title: '',
    message: '',
  }

  // Validation
  let hasError = false

  if (!formData.value.order) {
    errors.value.order = '필수 항목을 입력해 주세요.'
    hasError = true
  }

  if (!formData.value.title) {
    errors.value.title = '필수 항목을 입력해 주세요.'
    hasError = true
  }

  if (!formData.value.message) {
    errors.value.message = '필수 항목을 입력해 주세요.'
    hasError = true
  }

  if (formData.value.message.length > 500) {
    errors.value.message = '500자 이하로 입력해 주세요.'
    hasError = true
  }

  if (hasError) {
    return
  }

  // TODO: Implement save logic
  console.log('Save data:', formData.value)

  if (isEditMode.value) {
    const newOrder = formData.value.order
    const oldOrder = originalOrder.value

    // Order가 변경된 경우 - 범위 내의 다른 항목들의 Order 조정
    if (oldOrder !== newOrder) {
      if (newOrder < oldOrder) {
        // 작은 순서로 이동 (예: 10 → 5)
        // 5부터 9까지의 Order를 +1씩 증가 (뒤로 밀기)
        rowData.value.forEach((row) => {
          if (row.order >= newOrder && row.order < oldOrder) {
            row.order += 1
          }
        })
      } else {
        // 큰 순서로 이동 (예: 5 → 10)
        // 6부터 10까지의 Order를 -1씩 감소 (앞으로 당기기)
        rowData.value.forEach((row) => {
          if (row.order > oldOrder && row.order <= newOrder) {
            row.order -= 1
          }
        })
      }
    }

    // 편집 중인 약관 업데이트
    const currentIndex = rowData.value.findIndex((row) => row.order === oldOrder)
    if (currentIndex !== -1) {
      rowData.value[currentIndex] = {
        ...formData.value,
        creator: rowData.value[currentIndex].creator,
        addDate: rowData.value[currentIndex].addDate,
      }
    }
  } else {
    // Add new row
    rowData.value.unshift({
      ...formData.value,
      creator: 'xxx@ktnet.co.kr',
      addDate: new Date().toLocaleString('ko-KR'),
    })
  }

  closeDialog()
}

const deleteSelected = () => {
  if (selectedRows.value.length === 0) return

  // TODO: Implement delete logic
  console.log('Delete selected:', selectedRows.value)

  // Remove from rowData
  selectedRows.value.forEach((selectedRow) => {
    const index = rowData.value.findIndex((row) => row.order === selectedRow.order)
    if (index !== -1) {
      rowData.value.splice(index, 1)
    }
  })
  selectedRows.value = []

  // 삭제 후 Order를 재정렬 (구멍 없게) - 내림차순 유지
  rowData.value.sort((a, b) => b.order - a.order)
  rowData.value.forEach((row, index) => {
    row.order = rowData.value.length - index
  })
}
</script>
