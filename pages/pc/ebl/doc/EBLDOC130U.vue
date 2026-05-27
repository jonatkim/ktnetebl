<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo" />

    <div class="ebl-card-container">
      <!-- View Type Tabs -->
      <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      <!-- Status Filter Tabs removed for this page -->

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
          auto-apply
          placeholder="Request Date"
          :start-date="filters.dateRange?.[0]"
          :focus-start-date="true"
          style="width: 260px"
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
            :transaction-status="item.transactionStatus"
            :routing="item.routing"
            :received-date="item.requestDate"
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

      <!-- Detail Dialog -->
      <EblDialog
        v-model="dialog.main"
        transition="slide-x-reverse-transition"
        content-class="ebl-dialog ebl-dialog--multiple fill-height"
        :persistent="dialog.paperSign || dialog.folder || dialog.preview"
        scrollable
        @close="closeMainDialog"
      >
        <VCard width="700" class="ebl-dialog__card ebl-dialog--envelope-detail">
          <VCardTitle class="ebl-dialog__header">
            <span class="title">Sample Details</span>
            <VSpacer />
            <EblBtn icon pill small @click="closeMainDialog">
              <VIcon icon="ebli:close" :size="20" />
            </EblBtn>
          </VCardTitle>

          <VCardText class="ebl-dialog__text overflow-y-auto">
            <div class="ebl-card-linear pa-4 d-flex ga-8 mb-3">
              <h3 class="title blue-text flex-1">HDMUSKLM70328427</h3>
              <div class="ebl-card-linear__utils">
                <EblBadge color="mint" variant="tonal">ISSUED</EblBadge>
                <EblBadge color="gray" variant="tonal">ENDORSE TO ORDER</EblBadge>
              </div>
            </div>

            <div class="ebl-card-linear py-5 px-6 mb-6">
              <EblInfoItem vertical label="Recipient" content-class="py-0">
                <EblAvatarLabel
                  logo="https://i.pravatar.cc/150?img=1"
                  title="KTNETEBL1"
                  subtitle="338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR"
                  title-first
                  avatar-bg="#ffffff"
                />
              </EblInfoItem>
            </div>
            <!-- Preview & History -->
            <div class="ebl-2-column mb-8">
              <!-- B/L Preview -->
              <div class="ebl-compose-preview-section">
                <EblSubHeader small>
                  <h2>B/L Preview</h2>
                  <template #util>
                    <EblBtn color="outlined" prepend-icon="ebli:download" @click="handleDownload">
                      Download
                    </EblBtn>
                  </template>
                </EblSubHeader>
                <div class="preview-content">
                  <p class="file-name">
                    {{ previewFile.name }}
                    <small>{{ previewFile.size }}</small>
                  </p>
                  <img :src="previewFile.url" :alt="previewFile.name" class="preview-image" />
                  <EblBtn
                    color="tertiary"
                    pill
                    icon="ebli:search"
                    small
                    class="btn-search"
                    @click="openPreview"
                  />
                </div>
              </div>

              <!-- B/L History -->
              <div class="ebl-compose-history-section">
                <EblSubHeader small>
                  <h2>B/L History</h2>
                </EblSubHeader>
                <ul class="compose-history-list">
                  <li
                    v-for="(item, index) in historyList"
                    :key="index"
                    class="compose-history-item"
                  >
                    <div class="logo">
                      <img :src="item.logo" :alt="item.comany" />
                    </div>
                    <div class="content">
                      <div class="company">
                        <p>{{ item.company }}</p>
                        <span>{{ item.name }}</span>
                      </div>
                      <div class="status">
                        <p :class="{ owner: item.isOwner }">
                          {{ item.status }}
                        </p>
                        <span>{{ item.date }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Attach Documents -->
            <EblSubHeader small>
              <h2>Attach Documents</h2>
            </EblSubHeader>
            <div class="ebl-folder-grid mt-3 mb-8">
              <EblFolderItem
                v-for="item in folderGridItems"
                :key="item.name"
                :name="item.name"
                :files="item.files"
                @click="handleFolderClick(item)"
              />
            </div>

            <!-- Message -->
            <EblSubHeader small>
              <h2>Message</h2>
              <template #tooltip>수신인에게 보낼 메시지를 입력해 주세요</template>
            </EblSubHeader>
            <EblTextarea
              v-model="formData.message"
              placeholder="메시지를 입력하세요"
              :maxlength="500"
              counter
            />
          </VCardText>

          <VCardActions class="ebl-dialog__actions">
            <EblBtn color="danger" large @click="handleReject">Reject</EblBtn>
            <VSpacer />
            <EblBtn color="cta" large @click="openPaperSign">Approve</EblBtn>
          </VCardActions>
        </VCard>
        <VSlideXReverseTransition leave-absolute>
          <!-- Attach Documents Dialog -->
          <VCard v-if="dialog.folder" width="600" class="ebl-dialog__card">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">Attach Documents</span>
              <VSpacer />
              <EblBtn icon pill small @click="closeFolderDialog">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>

            <VCardText class="ebl-dialog__text">
              <!-- 폴더 그리드 (3열 로우) -->
              <div class="ebl-folder-grid--dialog mb-6">
                <template v-for="(row, rowIndex) in dialogFolderRows" :key="`row-${rowIndex}`">
                  <div class="ebl-folder-grid--dialog-row">
                    <EblFolderItem
                      v-for="folder in row"
                      :key="folder.name"
                      :name="folder.name"
                      :files="folder.files"
                      :is-active="folderDialog.expandedFolder?.name === folder.name"
                      :is-loading="
                        folderDialog.isLoading && folderDialog.loadingFolderName === folder.name
                      "
                      @click="handleDialogFolderClick(folder)"
                    />
                  </div>

                  <!-- 확장된 폴더 콘텐츠 (선택된 폴더 바로 아래 로우) -->
                  <VExpandTransition appear leave-absolute>
                    <div v-if="rowIndex === expandedRowIndex">
                      <div class="file-list--expand-wrap">
                        <!-- 첨부 파일 리스트 -->
                        <div v-if="folderDialog.expandedFolder?.files.length" class="file-list">
                          <div
                            v-for="file in folderDialog.expandedFolder.files"
                            :key="file.id"
                            class="file-item"
                          >
                            <div class="file-details">
                              <p class="file-name">name.png</p>
                              <span class="file-meta">20 KB</span>
                            </div>
                            <div class="file-meta-right">
                              <span class="company">Hyundai Merchant Marine Co. Ltd</span>
                              <span class="date">2025-09-01 15:00:00</span>
                            </div>
                            <EblBtn icon small color="ghost">
                              <VIcon size="16">mdi-trash-can-outline</VIcon>
                            </EblBtn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </VExpandTransition>
                </template>
              </div>
            </VCardText>
          </VCard>
          <VCard
            v-if="dialog.paperSign"
            width="400"
            class="ebl-dialog__card ebl-dialog--paper-sign"
          >
            <VCardTitle class="ebl-dialog__header">
              <span class="title">Paper Sign</span>
              <VSpacer />
              <EblBtn icon pill small @click="dialog.paperSign = false">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>

            <VCardText class="ebl-dialog__text overflow-y-auto">
              <div class="ebl-signature-list">
                <div
                  v-for="file in paperSignFiles"
                  :key="file.path"
                  class="ebl-signature-list__item"
                  :class="{ 'is-active': selectedPaperSign === file.path }"
                  @click="selectedPaperSign = file.path"
                >
                  <EblRadioBtn v-model="selectedPaperSign" :value="file.path" name="paperSign" />
                  <div class="ebl-signature-list__thumb">
                    <VImg :src="file.path" :alt="file.name" />
                  </div>
                  <div class="ebl-signature-list__meta">
                    <div class="name">{{ file.name }}</div>
                    <div class="size">{{ file.size }}</div>
                  </div>
                </div>
              </div>
            </VCardText>

            <VCardActions class="ebl-dialog__actions">
              <VSpacer />
              <EblBtn outlined large @click="dialog.paperSign = false">Cancel</EblBtn>
              <EblBtn color="cta" large @click="handlePaperSignSelect">Select</EblBtn>
            </VCardActions>
          </VCard>
          <VCard v-if="dialog.preview" width="700" class="ebl-dialog__card">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">Preview</span>
              <VSpacer />
              <EblBtn icon pill small @click="dialog.preview = false">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>

            <VCardText class="ebl-dialog__text">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 100%;
                  min-height: 700px;
                  background-color: #efeff1;
                "
              >
                previewer
              </div>
            </VCardText>

            <VCardActions class="ebl-dialog__footer">
              <VSpacer />
              <EblBtn color="cta" large>Download</EblBtn>
            </VCardActions>
          </VCard>
        </VSlideXReverseTransition>
      </EblDialog>
    </div>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'
import CompanyNameCellRenderer from '~/components/grid/CompanyNameCellRenderer.vue'
import BadgeCellRenderer from '~/components/grid/BadgeCellRenderer.vue'
import EblGridViewItem from '~/components/grid/EblGridViewItem.vue'
import previewSample from '@/assets/images/temp/preview_sample.png'

const { formatNumber } = useFormat()
const gridApi = shallowRef(null)
const activeTab = ref('list')
const listItemsPerPage = ref(10)
const gridItemsPerPage = ref(12)
const listPage = ref(1)
const gridPage = ref(1)
const detailRow = ref(null)

// ===== 다이얼로그 상태 통합 관리 =====
const dialog = reactive({
  main: false,
  folder: false,
  paperSign: false,
  preview: false,
})

// 페이지 정보
const pageInfo = ref({
  title: 'Incoming',
  breadcrumbItems: [{ text: 'Documents' }, { text: 'Incoming' }],
})

// 보기 탭 (List/Grid)
const tabItems = [
  { label: 'List View', value: 'list', icon: 'ebli:list' },
  { label: 'Grid View', value: 'grid', icon: 'ebli:grid' },
]

// 현재 탭에 따른 페이지 번호
const page = computed({
  get: () => (activeTab.value === 'list' ? listPage.value : gridPage.value),
  set: (val) => {
    if (activeTab.value === 'list') listPage.value = val
    else gridPage.value = val
  },
})

// 탭에 따른 항목 수
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

// 폼 데이터
const formData = reactive({
  blNo: '',
  companyName: '',
  blStatus: '',
  transactionStatus: '',
  routing: '',
  originPort: '',
  destinationPort: '',
  receivedDate: '',
  message: '',
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
  const blStatus = ['ISSUED', 'AMENDING', 'SWITCHING', 'DELIVERY', 'ENDORSE', 'PENDING', 'VOIDED']
  const blStatusBadgeColorMap = {
    ISSUED: 'mint',
    AMENDING: 'violet',
    SWITCHING: 'violet',
    DELIVERY: 'violet',
    ENDORSE: 'amber',
    PENDING: 'amber',
    VOIDED: 'red',
  }
  const blStatusTooltipMap = {
    ISSUED: '발행 완료',
    AMENDING: '수정 요청 수락',
    SWITCHING: '전환 요청 수락',
    DELIVERY: '반환 요청 수락',
    ENDORSE: '양도 완료',
    PENDING: '요청 진행중',
    VOIDED: '취소 완료',
  }
  const transactionStatus = [
    'ISSUE',
    'SACC',
    'TRANSFER',
    'AMENDMENT',
    'SWITCH',
    'ENDORSE TO ORDER',
    'BLANK ENDORSE',
  ]
  const routingData = [
    {
      origin: { city: 'BUSAN', country: 'KOREA' },
      destination: { city: 'BOSTON', country: 'MA' },
    },
    {
      origin: { city: 'INCHEON', country: 'KOREA' },
      destination: { city: 'HAMBURG', country: 'GERMANY' },
    },
    {
      origin: { city: 'GWANGYANG', country: 'KOREA' },
      destination: { city: 'NEW YORK', country: 'NY' },
    },
  ]

  const sampleComments = [
    'Request for Surrender to Delivery. Please expedite processing and confirm with operations team. Documents attached and awaiting signature.',
    'Request for Switch to Paper. Client requests conversion to paper original; confirm courier pickup and ensure all endorsements are completed prior to dispatch.',
    'Request for Surrender to Amendment. Amendment requested to change consignee details and voyage; verify amendment fees and update system records accordingly.',
    'Request for Switch to Paper. Urgent: beneficiary requires physical copy for customs clearance. Prepare paperwork and notify logistics.',
    'Request for Surrender to Delivery. Additional notes: check freight charges, confirm delivery window, and obtain POD upon completion.',
    'Request for Surrender to Delivery - follow-up required. There are special handling instructions and temperature control noted in shipment remarks.',
    'Request for Surrender to Amendment. This is a time-sensitive amendment involving multiple parties; escalate to supervisor if delays occur.',
  ]

  for (let i = 1; i <= 200; i++) {
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
        prefix: 'From',
      },
      blStatus: {
        value: statusValue,
        color: blStatusBadgeColorMap[statusValue],
        tooltip: blStatusTooltipMap[statusValue],
      },
      transactionStatus: transactionStatus[i % transactionStatus.length],
      routing: routingInfo,
      comment: sampleComments[i % sampleComments.length],
      requestDate: formattedDate,
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

// 필터링된 데이터 (상태 필터 제거됨)
const filteredRowData = computed(() => {
  return rowData.value.filter((row) => {
    const matchesCompanyName = (row.companyName?.name || '')
      .toLowerCase()
      .includes(appliedFilters.companyName.toLowerCase())
    const matchesBlNo = row.blNo.toLowerCase().includes(appliedFilters.blNo.toLowerCase())

    // 상태 필터 없음 - 모두 허용
    const matchesBlStatus = true

    let matchesDate = true
    if (appliedFilters.dateRange && appliedFilters.dateRange[0] && appliedFilters.dateRange[1]) {
      const rowDate = new Date(row.requestDate)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = rowDate >= startDate && rowDate <= endDate
    }

    return matchesCompanyName && matchesBlNo && matchesBlStatus && matchesDate
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
    headerName: 'No',
    width: 80,
    maxWidth: 100,
    sort: 'desc',
    headerStyle: { justifyContent: 'flex-start' },
    //2026.05.18 hide 추가
    hide: true,
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
    valueFormatter: (params) => params.data?.companyName?.name || '',
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
    valueFormatter: (params) => params.data?.blStatus?.value || '',
    //cellStyle: { textAlign: 'center' }, 2026.05.18 textalign 제거
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'transactionStatus',
    headerName: 'Transaction Status',
    width: 160,
    minWidth: 160,
    cellRenderer: BadgeCellRenderer,
    cellRendererParams: {
      color: 'gray',
    },
    cellClass: 'ag-center-cell',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'comment',
    headerName: 'Comment',
    flex: 1,
    minWidth: 200,
    cellClass: 'two-line-ellipsis',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'requestDate',
    headerName: 'Request Date',
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
    detailRow.value = params.data
    openDetailDialog(params.data)
  }
}

// 그리드 아이템 클릭
const onGridItemClick = (item) => {
  console.log('Grid Item Clicked:', item)
  detailRow.value = item
  openDetailDialog(item)
}

// 상세 정보 다이얼로그 열기
const openDetailDialog = (row) => {
  formData.blNo = row.blNo
  formData.companyName = row.companyName?.name || row.companyName
  formData.blStatus = row.blStatus?.value || ''
  formData.transactionStatus = row.transactionStatus
  formData.routing = row.routing
  formData.originPort = row.originPort
  formData.destinationPort = row.destinationPort
  formData.receivedDate = row.requestDate
  formData.message = ''
  dialog.main = true
}

// ===== 다이얼로그 핸들러 =====
const closeMainDialog = () => {
  dialog.main = false
  dialog.paperSign = false
  dialog.folder = false
  dialog.preview = false
  resetFolderDialog()
  detailRow.value = null
}

const handleReject = () => {
  console.log('Reject action')
  closeMainDialog()
}

const handlePaperSignSelect = () => {
  console.log('Selected paper sign:', selectedPaperSign.value)
  dialog.paperSign = false
}

const closeFolderDialog = () => {
  dialog.folder = false
  resetFolderDialog()
}

const resetFolderDialog = () => {
  folderDialog.selectedFolder = null
  folderDialog.expandedFolder = null
  folderDialog.isLoading = false
  folderDialog.loadingFolderName = null
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = null
  }
}

// ===== Preview 관련 =====
const previewFile = reactive({
  name: 'File name.pdf',
  size: '128KB',
  url: previewSample,
})

const handleDownload = () => {
  console.log('Download clicked', previewFile)
}

const openPreview = () => {
  dialog.folder = false
  dialog.paperSign = false
  dialog.preview = true
}

const openPaperSign = () => {
  dialog.folder = false
  dialog.preview = false
  dialog.paperSign = true
}

// 히스토리 목록
const historyList = ref([
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'B/L ISSUE Carrier',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=0',
    isOwner: false,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'ENDORSE TO ORDER',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=1',
    isOwner: false,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'TRANSFER',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=2',
    isOwner: false,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'Current Owner',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=3',
    isOwner: true,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'Release Agent',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=4',
    isOwner: false,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'Release Agent',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=5',
    isOwner: false,
  },
])

// 폴더 아이템 생성
const createFiles = (count) => Array.from({ length: count }, (_, index) => ({ id: index + 1 }))

const folderItems = ref([
  { name: 'Commercial Invoice', files: createFiles(5) },
  { name: 'Packing List', files: createFiles(10) },
  { name: 'Insurance Policy', files: createFiles(1) },
  { name: 'Certificate of Origin', files: createFiles(4) },
  { name: 'Bill of Exchange', files: createFiles(0) },
  { name: 'Courier Waybill', files: createFiles(2) },
  { name: 'Others', files: createFiles(2) },
])

const folderGridItems = computed(() => [...folderItems.value])

let loadingTimer = null

// ===== Paper Sign 관련 =====
const paperSignFiles = ref(generatePaperSignFiles(32))
const selectedPaperSign = ref(paperSignFiles.value[0]?.path || '')

function generatePaperSignFiles(count) {
  const names = ['signature', 'paper_sign', 'stamp', 'sign', 'doc_sign']
  const sizes = ['18 KB', '20 KB', '22 KB', '24 KB', '26 KB', '28 KB', '30 KB']

  return Array.from({ length: count }, (_, index) => {
    const baseName = names[Math.floor(Math.random() * names.length)]
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    const number = String(index + 1).padStart(2, '0')

    return {
      name: `${baseName}_${number}.png`,
      size,
      path: `https://i.pravatar.cc/150?img=${number}`,
    }
  })
}

// ===== Folder 관련 =====
const folderDialog = reactive({
  selectedFolder: null,
  expandedFolder: null,
  isLoading: false,
  loadingFolderName: null,
})

const handleFolderClick = (folder) => {
  if (!folder.isAdd) {
    dialog.preview = false
    dialog.paperSign = false
    folderDialog.selectedFolder = folder
    folderDialog.expandedFolder = folder
    dialog.folder = true
  }
}

// 다이얼로그 폴더 클릭 핸들러
const handleDialogFolderClick = (folder) => {
  if (folderDialog.expandedFolder?.name === folder.name) {
    // 같은 폴더 재클릭 시 닫기
    folderDialog.expandedFolder = null
    folderDialog.isLoading = false
    folderDialog.loadingFolderName = null
    if (loadingTimer) {
      clearTimeout(loadingTimer)
      loadingTimer = null
    }
  } else {
    // 다른 폴더 클릭 - 열려있는 폴더 먼저 닫기
    folderDialog.expandedFolder = null
    folderDialog.isLoading = true
    folderDialog.loadingFolderName = folder.name

    if (loadingTimer) {
      clearTimeout(loadingTimer)
      loadingTimer = null
    }

    // 딜레이 후 파일목록 확장
    loadingTimer = setTimeout(() => {
      folderDialog.expandedFolder = folder
      folderDialog.isLoading = false
      folderDialog.loadingFolderName = null
      loadingTimer = null
    }, 0)
  }
}

// 다이얼로그에 표시할 폴더들
const dialogFolderItems = computed(() => {
  return folderItems.value.filter((item) => item.name !== 'Others')
})

// 다이알로그 폴더 로우(3열) 구성
const dialogFolderRows = computed(() => {
  const rows = []
  const items = dialogFolderItems.value
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3))
  }
  return rows
})

// 선택된 폴더가 속한 로우 인덱스
const expandedRowIndex = computed(() => {
  if (!folderDialog.expandedFolder) return -1
  return dialogFolderRows.value.findIndex((row) =>
    row.some((item) => item.name === folderDialog.expandedFolder?.name),
  )
})

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
</script>
