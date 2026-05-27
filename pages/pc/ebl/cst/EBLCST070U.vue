<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo" />

    <div class="ebl-card-container">
      <!-- Sub Header -->
      <EblSubHeader>
        <h2>Total</h2>
        <span class="count">{{ formatNumber(totalCount) }}</span>
        <template #tooltip>
          • 컨테이너 관리 메뉴에서는 등록한 컨테이너 코드의 목록을 확인할 수 있습니다. <br />
          • 표준 코드를 선택하여 관리할 수 있습니다.<br />
        </template>
      </EblSubHeader>

      <!-- Filters -->
      <div class="ebl-page-filters">
        <EblInput
          v-model="filters.codeName"
          clearable
          placeholder="Code Name"
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
    </div>

    <EblDialog
      v-model="editDialogOpen"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog"
      @close="closeEditDialog"
    >
      <VCard width="520" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Modify Container Type</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeEditDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblInfo style="--ebl-info-label-width: 170px">
            <EblInfoItem label="Current Container Type" has-input>
              <EblInput v-model="editForm.currentType" readonly />
            </EblInfoItem>
            <EblInfoItem label="New Container Type" has-input>
              <EblInput v-model="editForm.newType" placeholder="Placeholder" />
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="closeEditDialog">Cancel</EblBtn>
          <EblBtn color="cta" large :disabled="!editForm.newType.trim()" @click="saveEditDialog"
            >Save</EblBtn
          >
        </VCardActions>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { useToastStore } from '~/stores/toast'

definePageMeta({ layout: 'default' })

const { formatNumber } = useFormat()
const toastStore = useToastStore()

// ============================================================================
// PAGE INFO
// ============================================================================
const pageInfo = {
  title: 'Container Mgmt',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Management' }, { text: 'Container Mgmt' }],
}

// ============================================================================
// STATE
// ============================================================================
const gridApi = ref(null)
const page = ref(1)
const itemsPerPage = ref(10)
const editDialogOpen = ref(false)
const selectedRowNo = ref(null)
const editForm = ref({
  currentType: '',
  newType: '',
})

// Container Type 옵션
const containerTypeOptions = ['20FP', '40FP', '20GP', '40GP', '40HC', '45HC']

// 더미 데이터 (100개 샘플)
const generateDummyData = () => {
  const data = []
  const codeNames = ['20피트 컨테이너', '컨테이너 코드명', '공동코드 번호', '컨테이너 코드명']
  const creators = ['xxx@ktnet.co.kr', 'admin@ktnet.co.kr', 'user@ktnet.co.kr']

  for (let i = 1; i <= 100; i++) {
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

    data.push({
      no: i,
      containerType: i <= 10 ? containerTypeOptions[i % containerTypeOptions.length] : '',
      code: i <= 20 ? `${i % 5 === 0 ? '공동코드' : i % 3 === 0 ? '22GP' : '22GP'} 번호` : '',
      codeName: codeNames[i % codeNames.length],
      creator: creators[i % creators.length],
      addDate: formattedDate,
    })
  }
  return data
}

const rowData = ref(generateDummyData())

// ===== 필터 로직 =====
// 필터 상태 (입력용)
const filters = ref({
  codeName: '',
  dateRange: null,
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = ref({
  codeName: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.value.codeName = filters.value.codeName
  appliedFilters.value.dateRange = filters.value.dateRange ? [...filters.value.dateRange] : null
  page.value = 1
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.value = {
    codeName: '',
    dateRange: null,
  }
  appliedFilters.value = {
    codeName: '',
    dateRange: null,
  }
  page.value = 1
}

// ============================================================================
// AG GRID CONFIG
// ============================================================================

const colDefs = ref([
  {
    headerName: '',
    field: 'no',
    width: 60,
    cellStyle: { justifyContent: 'center' },
  },
  {
    headerName: 'Container Type',
    field: 'containerType',
    width: 200,
    cellStyle: { cursor: 'pointer' },
    cellClass: 'ag-link',
  },
  {
    headerName: 'Code',
    field: 'code',
    width: 180,
  },
  {
    headerName: 'Code Name',
    field: 'codeName',
    flex: 1,
  },
  {
    headerName: 'Creator',
    field: 'creator',
    width: 200,
  },
  {
    headerName: 'Add Date',
    field: 'addDate',
    width: 200,
  },
])

// ============================================================================
// COMPUTED
// ============================================================================
const totalCount = computed(() => rowData.value.length)

const filteredRowData = computed(() => {
  let filtered = [...rowData.value]

  // Code Name 필터
  if (appliedFilters.value.codeName) {
    const searchTerm = appliedFilters.value.codeName.toLowerCase()
    filtered = filtered.filter((row) => row.codeName.toLowerCase().includes(searchTerm))
  }

  // 날짜 범위 필터
  if (appliedFilters.value.dateRange?.length === 2) {
    const [startDate, endDate] = appliedFilters.value.dateRange
    filtered = filtered.filter((row) => {
      const rowDate = new Date(row.addDate)
      return rowDate >= new Date(startDate) && rowDate <= new Date(endDate)
    })
  }

  return filtered
})

const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRowData.value.slice(start, end)
})

// ============================================================================
// WATCHERS
// ============================================================================
// 페이지 범위 초과 방지
watch([itemsPerPage, () => rowData.value.length], () => {
  const maxPages = Math.ceil(filteredRowData.value.length / itemsPerPage.value)
  if (page.value > maxPages && maxPages > 0) {
    page.value = maxPages
  } else if (page.value < 1) {
    page.value = 1
  }
})

// ============================================================================
// GRID HANDLERS
// ============================================================================
const onGridReady = (params) => {
  gridApi.value = params.api
}

const onCellClicked = (event) => {
  // Skip checkbox/no column
  if (!event.data || event.column.colId === '0') return

  selectedRowNo.value = event.data.no
  editForm.value.currentType = event.data.containerType || ''
  editForm.value.newType = ''
  editDialogOpen.value = true
}

const closeEditDialog = () => {
  editDialogOpen.value = false
  selectedRowNo.value = null
  editForm.value.currentType = ''
  editForm.value.newType = ''
}

const saveEditDialog = () => {
  const newType = editForm.value.newType.trim()
  if (!newType || selectedRowNo.value == null) return

  const target = rowData.value.find((row) => row.no === selectedRowNo.value)
  if (!target) {
    closeEditDialog()
    return
  }

  if (target.containerType !== newType) {
    target.containerType = newType
    // TODO: API 호출하여 서버에 저장
    toastStore.add({
      text: 'Container type updated successfully!',
      color: 'success',
    })
  }

  closeEditDialog()
}

// ============================================================================
// DATA HANDLERS
// ============================================================================
</script>

<style scoped></style>
