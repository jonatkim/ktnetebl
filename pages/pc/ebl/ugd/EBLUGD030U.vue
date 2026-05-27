<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #tooltip>
        •자료실에서는 공유 자료와 관련 자료를 조회할 수 있습니다.<br />
        •카테고리와 검색 기능으로 원하는 자료를 찾을 수 있습니다.
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- 카테고리 탭 -->
      <div class="ebl-tabs-container mb-6">
        <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      </div>

      <!-- Total 서브헤더 -->
      <EblSubHeader>
        <h2>Total</h2>
        <span class="count">{{ formatNumber(filteredResourceList.length) }}</span>
        <template #util>
          <EblBtn outlined prepend-icon="ebli:download"> Download </EblBtn>
        </template>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters mb-3">
        <EblInput
          v-model="filters.title"
          clearable
          placeholder="Search by title..."
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblInput
          v-model="filters.message"
          clearable
          placeholder="Search by message..."
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
          auto-apply
          style="width: 260px"
        />
        <EblBtn outlined @click="applyFilters">Search</EblBtn>
        <EblBtn icon="ebli:refresh" outlined @click="resetFilters" />
      </div>

      <!-- 자료실 AG Grid -->
      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :row-data="paginatedResourceList"
        :column-defs="colDefs"
        :dom-layout="'autoHeight'"
        @grid-ready="onGridReady"
        @cell-clicked="onCellClicked"
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
          :length="Math.ceil(filteredResourceList.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>
    </div>

    <!-- Resources Detail Dialog -->
    <EblDialog
      v-model="detailOpen"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog fill-height"
      scrollable
      @close="closeDetail"
    >
      <VCard width="800" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Resources Detail</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeDetail">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblSubHeader>
            <h3>Resources Info</h3>
          </EblSubHeader>

          <EblInfo>
            <EblInfoItem label="Recipient">
              {{ detailRow?.recipient || '-' }}
            </EblInfoItem>
            <EblInfoItem label="Title">
              {{ detailRow?.title || '-' }}
            </EblInfoItem>
            <EblInfoItem label="Message">
              <div style="word-break: break-word; line-height: 1.5">
                {{ detailRow?.message || '-' }}
              </div>
            </EblInfoItem>
            <EblInfoItem label="Attachment" has-input>
              <template #label>
                Attachment
                <EblBadge pill variant="tonal" color="blue" size="sm" class="btn-badge">3</EblBadge>
              </template>
              <div v-if="detailRow?.attachments && detailRow.attachments.length > 0">
                <div
                  v-for="(att, index) in detailRow.attachments"
                  :key="index"
                  class="ebl-file-item mb-2"
                >
                  <span class="ebl-file-item__name">{{ att.filename }}</span>
                  <EblBtn outlined size="small"> Download </EblBtn>
                </div>
              </div>
              <div v-else>-</div>
            </EblInfoItem>
            <EblInfoItem label="Creator">
              {{ detailRow?.creator || '-' }}
            </EblInfoItem>
            <EblInfoItem label="Viewers">
              {{ formatNumber(detailRow?.viewers || 0) }}
            </EblInfoItem>
            <EblInfoItem label="Add Date">
              {{ detailRow?.addDate || '-' }}
            </EblInfoItem>
          </EblInfo>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <EblBtn color="cta" large> Check </EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'

const { formatNumber } = useFormat()
const gridApi = ref(null)
const detailOpen = ref(false)
const detailRow = ref(null)

// ============================================================
// Tabs
// ============================================================
const activeTab = ref('all')
const tabItems = [
  { label: 'ALL', value: 'all' },
  { label: 'Carrier', value: 'carrier' },
  { label: 'Shipper', value: 'shipper' },
  { label: 'Bank', value: 'bank' },
]

// ============================================================
// Page Info
// ============================================================
const pageInfo = ref({
  title: 'Download',
  breadcrumbItems: [{ text: 'Help Desk' }, { text: 'Download' }],
})

// ============================================================
// State
// ============================================================
const currentPage = ref(1)
const itemsPerPage = ref(10)

// ===== 필터 로직 =====
// 필터 상태 (입력용)
const filters = reactive({
  title: '',
  message: '',
  dateRange: null,
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  title: '',
  message: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.title = filters.title
  appliedFilters.message = filters.message
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  currentPage.value = 1
}

// ============================================================
// Mock Data (실제로는 API에서 가져옴)
// ============================================================
const generateMockData = () => {
  const data = []
  const categories = ['Carrier', 'Shipper', 'Bank', 'Carrier', 'Shipper']
  const recipients = ['All', 'All', 'All', 'All', 'All']
  const creators = ['Admin1', 'Admin1', 'Admin1', 'Admin1', 'Admin1']

  const mockTitles = [
    '롤페이지 사용자 메뉴얼',
    'Resources Title',
    '기본 설정 가이드',
    '문서 관리 튜토리얼',
    '자주 묻는 질문',
  ]

  const mockMessages = [
    '롤페이지 사용자 메뉴얼입니다. 회정기업의 ebl 발급사자를 위한 모든 방법을 정리 하였습니다. 롤페이지 사용자 메뉴얼입니다. 회정기업의 ebl 발급사자를 위한 모든 방법을 정리 하였습니다. 롤페이지 사용자 메뉴얼입니다. 회정기업의 ebl 발급사자를 위한 모든 방법을 정리 하였습니다.',
    'Resources를 설명합니다.',
    '기본 설정에 대한 상세한 가이드를 제공합니다.',
    '문서 관리 방법을 단계별로 설명합니다.',
    '자주 묻는 질문과 답변을 모았습니다.',
  ]

  for (let i = 1; i <= 50; i++) {
    // 랜덤 날짜 생성 (최근 1년 내)
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = date.toISOString().split('T')[0]

    data.push({
      id: i,
      no: i,
      category: categories[i % categories.length],
      title: mockTitles[i % mockTitles.length],
      message: mockMessages[i % mockMessages.length],
      creator: creators[i % creators.length],
      viewers: Math.floor(Math.random() * 10000) + 100,
      addDate: formattedDate,
      recipient: recipients[i % recipients.length],
      attachments: [
        {
          filename: `name${String(i).padStart(5, '0')}.png`,
        },
        {
          filename: `name.png`,
        },
        {
          filename: `name${String(i * 2).padStart(6, '0')}.png`,
        },
      ],
    })
  }
  return data
}

const mockResourceData = ref(generateMockData())

// ============================================================
// Computed
// ============================================================

// 필터링된 자료실 목록
const filteredResourceList = computed(() => {
  return mockResourceData.value.filter((item) => {
    // 탭 필터
    if (activeTab.value !== 'all' && item.category.toLowerCase() !== activeTab.value) {
      return false
    }

    // 제목 검색
    if (
      appliedFilters.title &&
      !item.title.toLowerCase().includes(appliedFilters.title.toLowerCase())
    ) {
      return false
    }

    // 내용 검색
    if (
      appliedFilters.message &&
      !item.message.toLowerCase().includes(appliedFilters.message.toLowerCase())
    ) {
      return false
    }

    // 날짜 범위 필터
    if (appliedFilters.dateRange && appliedFilters.dateRange.length === 2) {
      const itemDate = new Date(item.addDate)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      endDate.setHours(23, 59, 59, 999)
      if (itemDate < startDate || itemDate > endDate) {
        return false
      }
    }

    return true
  })
})

// 페이지네이션된 자료 목록
const paginatedResourceList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredResourceList.value.slice(start, end)
})

// ============================================================
// Column Definitions
// ============================================================
const colDefs = ref([
  {
    field: 'no',
    headerName: '',
    width: 60,
    maxWidth: 80,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
    minWidth: 250,
    wrapText: true,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'creator',
    headerName: 'Creator',
    width: 120,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'viewers',
    headerName: 'Viewers',
    width: 120,
    headerStyle: { justifyContent: 'flex-end' },
    cellStyle: { textAlign: 'right' },
    valueFormatter: (params) => formatNumber(params.value || 0),
  },
  {
    field: 'addDate',
    headerName: 'Add Date',
    width: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// ============================================================
// Methods
// ============================================================

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.title = ''
  filters.message = ''
  filters.dateRange = null
  appliedFilters.title = ''
  appliedFilters.message = ''
  appliedFilters.dateRange = null
  currentPage.value = 1
}

// AG Grid Ready
const onGridReady = (params) => {
  gridApi.value = params.api
}

// 셀 클릭 - 상세 다이얼로그 열기
const onCellClicked = (params) => {
  if (params.column.getColId() === 'title') {
    detailRow.value = params.data
    detailOpen.value = true
  }
}

// 다이얼로그 닫기
const closeDetail = () => {
  detailOpen.value = false
}
</script>

<style scoped lang="scss">
// Resources 페이지는 _common.scss에서 스타일 적용
</style>
