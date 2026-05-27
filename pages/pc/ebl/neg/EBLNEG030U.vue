<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo" />
    <div class="ebl-card-container">
      <!-- EblSubHeader -->
      <EblSubHeader>
        <h2>total</h2>
        <span class="count">{{ formatNumber(9999) }}</span>
        <template #tooltip>
          •매입서류 관리 메뉴에서는 개설은행 할으로 요청한 심사 항목을 확인할 수 있습니다.<br />
          •심사 결과를 승인/반려 할 수 있습니다.
        </template>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters">
        <EblInput
          v-model="filters.purchaseBank"
          clearable
          placeholder="Purchase Bank"
          :style="{ width: '180px' }"
         @keydown.enter="applyFilters" />
        <EblInput
          v-model="filters.lcNo"
          clearable
          placeholder="L/C No"
          :style="{ width: '180px' }"
         @keydown.enter="applyFilters" />
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
        <EblBtn icon="ebli:refresh" outlined color="transparent" @click="resetFilters" />
      </div>

      <!-- AG Grid -->
      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :rowData="paginatedRowData"
        :columnDefs="colDefs"
        :dom-layout="'autoHeight'"
        @grid-ready="onGridReady"
        @cell-clicked="onCellClicked"
      >
      </AgGridVue>
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

      <!-- EBLNEG060P - Presentation Detail Dialog -->
      <EblDialog
        v-model="detailOpen"
        transition="slide-x-reverse-transition"
        content-class="ebl-dialog ebl-dialog--multiple"
        :persistent="rejectOpen"
        @close="closeDetail"
      >
        <VCard width="480" class="ebl-dialog__card">
          <VCardTitle class="ebl-dialog__header">
            <span class="title">Presentation Detail</span>
            <VSpacer />
            <EblBtn icon pill small @click="closeDetail">
              <VIcon icon="ebli:close" :size="20" />
            </EblBtn>
          </VCardTitle>

          <VCardText class="ebl-dialog__text">
            <EblSubHeader>
              <h3>Presentation</h3>
              <template #util>
                <EblBtn color="tertiary">Download All</EblBtn>
              </template>
            </EblSubHeader>
            <EblInfo>
              <EblInfoItem label="L/C No">
                <span class="ebl-link">{{ detailRow?.lcNo || '-' }}</span>
              </EblInfoItem>
              <EblInfoItem label="Purchase Bank">{{ detailRow?.purchaseBank || '-' }}</EblInfoItem>
              <EblInfoItem label="Opening Bank">{{ detailRow?.openingBank || '-' }}</EblInfoItem>
              <EblInfoItem label="Cover Letter" hasInput>
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">xxxxxxxxxxxxxxxx</span>
                  <EblBtn outlined small icon="ebli:download" />
                </div>
              </EblInfoItem>
              <EblInfoItem label="B/L No">
                <span class="ebl-link">{{ detailRow?.blNo || '-' }}</span>
              </EblInfoItem>
              <EblInfoItem label="Completion Notice" hasInput>
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">xxxxxxxxxxxxxxxx</span>
                  <EblBtn outlined small icon="ebli:download" />
                </div>
              </EblInfoItem>
              <EblInfoItem label="Attachment (3)" hasInput>
                <div style="display: flex; flex-direction: column; gap: 8px">
                  <div class="ebl-file-item">
                    <span class="ebl-file-item__name">파일명.PDF</span>
                    <EblBtn outlined small icon="ebli:download" />
                  </div>
                  <div class="ebl-file-item">
                    <span class="ebl-file-item__name">파일명2.PDF</span>
                    <EblBtn outlined small icon="ebli:download" />
                  </div>
                  <div class="ebl-file-item">
                    <span class="ebl-file-item__name">파일명3.PDF</span>
                    <EblBtn outlined small icon="ebli:download" />
                  </div>
                </div>
              </EblInfoItem>
            </EblInfo>
          </VCardText>

          <VCardActions class="ebl-dialog__actions">
            <EblBtn color="danger" large @click="openRejectDialog">Reject</EblBtn>
            <VSpacer />
            <EblBtn color="cta" large @click="handleApprove">Approve</EblBtn>
          </VCardActions>
        </VCard>
        <v-slide-x-reverse-transition>
          <!-- EBLNEG040P - Reason for Rejection Dialog -->
          <VCard v-if="rejectOpen" width="600" class="ebl-dialog__card">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">Reason for Rejection</span>
              <VSpacer />
              <EblBtn icon pill small @click="closeRejectDialog">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>

            <VCardText class="ebl-dialog__text">
              <EblTextarea
                v-model="rejectReason"
                placeholder="작성 내용..."
                :rows="6"
                counter
                :maxlength="5000"
              />
            </VCardText>

            <VCardActions class="ebl-dialog__actions">
              <VSpacer />
              <EblBtn large @click="closeRejectDialog">Cancel</EblBtn>
              <EblBtn color="cta" large :disabled="!rejectReason.trim()" @click="handleReject"
                >Submit</EblBtn
              >
            </VCardActions>
          </VCard>
        </v-slide-x-reverse-transition>
      </EblDialog>
    </div>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'
import IconBtnCellRenderer from '~/components/grid/IconBtnCellRenderer.vue'

const { formatNumber } = useFormat()
const gridApi = shallowRef(null)
const detailOpen = ref(false)
const rejectOpen = ref(false)
const detailRow = ref(null)
const rejectReason = ref('')

const pageInfo = ref({
  title: 'Presentation',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'eNego Management' }, { text: 'Presentation' }],
})

// 그리드 페이지네이션
const page = ref(1)
const itemsPerPage = ref(10)

// 더미 데이터 생성 함수
const generateDummyData = () => {
  const data = []
  const banks = [
    'Bank Name',
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
    const formattedDateTime = `${formattedDate} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`

    data.push({
      no: i,
      lcNo:
        i % 2 === 0
          ? `LC${String(i).padStart(10, '0')}`
          : i % 3 === 0
            ? `x${String(i * 123).padStart(12, 'x')}`
            : `LC${String(i).padStart(10, '0')}`,
      purchaseBank: banks[i % banks.length],
      openingBank: banks[(i + 1) % banks.length],
      blNo:
        i % 2 === 0
          ? `HDMUSELM${70328430 + i}`
          : i % 3 === 0
            ? `OOOOOOOOOOOOOOOOOOOO`
            : `HDMUHD5ELM${70328430 + i}`,
      lastUpdate: formattedDateTime,
    })
  }
  return data
}

const rowData = ref(generateDummyData())

// 필터가 적용된 데이터
const filteredRowData = computed(() => {
  return rowData.value.filter((row) => {
    const matchesPurchaseBank = (row.purchaseBank || '')
      .toLowerCase()
      .includes(appliedFilters.purchaseBank.toLowerCase())
    const matchesLcNo = (row.lcNo || '').toLowerCase().includes(appliedFilters.lcNo.toLowerCase())

    let matchesDate = true
    if (appliedFilters.dateRange && appliedFilters.dateRange[0] && appliedFilters.dateRange[1]) {
      const rowDate = new Date(row.lastUpdate)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = rowDate >= startDate && rowDate <= endDate
    }

    return matchesPurchaseBank && matchesLcNo && matchesDate
  })
})

// 최대 페이지 수
const maxPage = computed(() => {
  return Math.ceil(filteredRowData.value.length / itemsPerPage.value)
})

// 페이지네이션된 rowData
const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRowData.value.slice(start, end)
})

// itemsPerPage 변경 시 현재 페이지 조정
watch(itemsPerPage, () => {
  if (page.value > maxPage.value) {
    page.value = Math.max(1, maxPage.value)
  }
})

// Column Definitions
const colDefs = ref([
  {
    field: 'no',
    headerName: 'No',
    width: 80,
    maxWidth: 100,
    sort: 'desc',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'lcNo',
    headerName: 'L/C No',

    width: 180,
    minWidth: 150,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'purchaseBank',
    headerName: 'Purchase Bank',

    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'openingBank',
    headerName: 'Opening Bank',

    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'blNo',
    headerName: 'B/L No',

    width: 220,
    minWidth: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'lastUpdate',
    headerName: 'Last Update',

    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'download',
    headerName: 'Download',
    width: 120,
    maxWidth: 150,
    cellRenderer: IconBtnCellRenderer,
    cellRendererParams: {
      icon: 'ebli:download',
      onClick: (data) => {
        console.log('Download clicked for row:', data)
        // 다운로드 로직 추가
      },
    },
    headerStyle: { justifyContent: 'center' },
    suppressMenu: true,
    sortable: false,
  },
])

// ===== 필터 로직 =====
// 기본 날짜 범위 반환
function getDefaultDateRange() {
  const today = new Date()
  const start = new Date(today)
  start.setFullYear(start.getFullYear() - 1)
  return [start, today]
}

// 필터 상태 (입력용)
const filters = reactive({
  purchaseBank: '',
  lcNo: '',
  dateRange: getDefaultDateRange(),
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  purchaseBank: '',
  lcNo: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.purchaseBank = filters.purchaseBank
  appliedFilters.lcNo = filters.lcNo
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  page.value = 1
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.purchaseBank = ''
  filters.lcNo = ''
  filters.dateRange = getDefaultDateRange()
  appliedFilters.purchaseBank = ''
  appliedFilters.lcNo = ''
  appliedFilters.dateRange = null
  page.value = 1
}

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
  rejectOpen.value = false
  rejectReason.value = ''
}

const openRejectDialog = () => {
  rejectOpen.value = true
}

const closeRejectDialog = () => {
  rejectOpen.value = false
  rejectReason.value = ''
}

const handleApprove = () => {
  console.log('Approved:', detailRow.value)
  // 승인 로직 추가
  closeDetail()
}

const handleReject = () => {
  console.log('Rejected with reason:', rejectReason.value)
  // 반려 로직 추가
  closeDetail()
}
</script>
