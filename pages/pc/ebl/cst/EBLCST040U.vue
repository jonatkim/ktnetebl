<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="cta" large @click="openAddDialog">Add Sign</EblBtn>
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- Sub Header -->
      <EblSubHeader>
        <h2>Total</h2>
        <span class="count">{{ formatNumber(totalCount) }}</span>
        <template #tooltip>
          • 서명 관리 메뉴에서는 선사의 서명 이미지를 등록 및 관리할 수 있습니다.<br />
          • BMP, GIF, SVG, PNG, JPG, JPEG 형식의 이미지 파일을 지원합니다. (50MB max)
        </template>
        <template #util>
          {{ selectedRows.length }}
          <EblBtn outlined :disabled="selectedRows.length === 0" @click="deleteSelected"
            >Delete</EblBtn
          >
        </template>
      </EblSubHeader>

      <!-- AG Grid -->
      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :row-data="paginatedRowData"
        :column-defs="colDefs"
        :dom-layout="'autoHeight'"
        :row-selection="rowSelection"
        :row-height="70"
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
    </div>

    <!-- Add Sign Dialog -->
    <EblDialog v-model="dialogOpen" transition="slide-x-reverse-transition" @close="closeDialog">
      <VCard width="520" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Add Sign</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblInfo vertical>
            <EblInfoItem label="Signature" has-input required>
              <EblFileInput
                v-model="formData.files"
                accept="image/*"
                placeholder="Click here to upload your file or drag."
                help-text="BMP, GIF, SVG, PNG, JPG, JPEG (50MB max)"
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="closeDialog">Cancel</EblBtn>
          <EblBtn color="cta" large :disabled="!formData.files.length" @click="saveSign"
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
import ThumbsCellRenderer from '~/components/grid/ThumbsCellRenderer.vue'

definePageMeta({ layout: 'default' })

const { formatNumber } = useFormat()

// ============================================================================
// PAGE INFO
// ============================================================================
const pageInfo = {
  title: 'Sign Mgmt',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Settings' }, { text: 'Sign Mgmt' }],
}

// ============================================================================
// STATE
// ============================================================================
const page = ref(1)
const itemsPerPage = ref(10)
const selectedRows = ref([])
const dialogOpen = ref(false)
const signPreview = ref(null)

const formData = ref({
  files: [],
})

// 더미 데이터 (20개 샘플)
const rowData = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    fileName: 'paesil.png',
    fileSize: '100 KB',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-09-19 13:30:20',
    thumbImage: `https://i.pravatar.cc/150?img=${(i + 1) % 20}`,
  })),
)

// ============================================================================
// AG GRID CONFIG
// ============================================================================
const rowSelection = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
}

const cellStyle = { display: 'flex', alignItems: 'center' }

const colDefs = ref([
  {
    headerName: 'No',
    width: 60,
    valueGetter: (params) => params.node.rowIndex + 1,
    cellClass: 'text-center',
    cellStyle: { ...cellStyle, justifyContent: 'center' },
  },
  {
    headerName: 'Sign',
    field: 'thumbImage',
    flex: 1,
    cellRenderer: ThumbsCellRenderer,
    cellStyle,
  },
  {
    headerName: 'Volume',
    field: 'fileSize',
    width: 150,
    cellStyle,
  },
  {
    headerName: 'Creator',
    field: 'creator',
    width: 200,
    cellStyle,
  },
  {
    headerName: 'Add Date',
    field: 'addDate',
    width: 200,
    cellStyle,
  },
])

// ============================================================================
// COMPUTED
// ============================================================================
const totalCount = computed(() => rowData.value.length)

const filteredRowData = computed(() => {
  // 최신순 정렬
  return [...rowData.value].sort((a, b) => new Date(b.addDate) - new Date(a.addDate))
})

const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRowData.value.slice(start, end)
})

// ============================================================================
// WATCHERS
// ============================================================================
// 파일 선택시 이미지 미리보기 생성
watch(
  () => formData.value.files,
  (newFiles) => {
    if (newFiles?.length > 0 && newFiles[0].type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        signPreview.value = e.target?.result
      }
      reader.readAsDataURL(newFiles[0])
    } else {
      signPreview.value = null
    }
  },
  { deep: true },
)

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
// DIALOG HANDLERS
// ============================================================================
const openAddDialog = () => {
  formData.value.files = []
  signPreview.value = null
  dialogOpen.value = true
}

const closeDialog = () => {
  dialogOpen.value = false
  formData.value.files = []
  signPreview.value = null
}

// ============================================================================
// DATA HANDLERS
// ============================================================================
const saveSign = () => {
  if (!formData.value.files?.length) {
    console.warn('Please select a file')
    return
  }

  const file = formData.value.files[0]

  // 현재 시간을 'YYYY-MM-DD HH:mm:ss' 형식으로 포맷
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  const newRow = {
    id: rowData.value.length + 1,
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    creator: 'xxx@ktnet.co.kr',
    addDate: formattedDate,
    thumbImage: signPreview.value,
  }

  rowData.value.unshift(newRow)
  closeDialog()
}

const onSelectionChanged = (event) => {
  selectedRows.value = event.api.getSelectedRows()
}

const deleteSelected = () => {
  if (!selectedRows.value.length) return

  const idsToDelete = selectedRows.value.map((row) => row.id)
  rowData.value = rowData.value.filter((row) => !idsToDelete.includes(row.id))
  selectedRows.value = []
}

// ============================================================================
// UTILS
// ============================================================================
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>
