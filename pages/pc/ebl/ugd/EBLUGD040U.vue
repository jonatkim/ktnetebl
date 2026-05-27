<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="cta" large @click="openRegisterDialog"> Register </EblBtn>
      </template>
      <template #tooltip>
        •사용자 문의 항목을 선택하면 상세 내용을 확인할 수 있습니다. <br />
        •상세 화면을 통해 문의에 대한 답변의 확인이 가능합니다.
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- 카테고리 탭 -->
      <div class="ebl-tabs-container">
        <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      </div>

      <!-- Total 서브헤더 -->
      <EblSubHeader class="mt-6">
        <h2>Total</h2>
        <span class="count">{{ formatNumber(filteredQnaList.length) }}</span>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters my-3">
        <EblInput
          v-model="filters.title"
          clearable
          placeholder="Title"
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblInput
          v-model="filters.message"
          clearable
          placeholder="Message"
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

      <!-- Q&A AG Grid -->
      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :row-data="paginatedQnaList"
        :column-defs="colDefs"
        :dom-layout="'autoHeight'"
        @grid-ready="onGridReady"
        @cell-clicked="onCellClicked"
      />

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
          :length="Math.ceil(filteredQnaList.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>
    </div>

    <!-- Q&A Detail Dialog -->
    <EblDialog
      v-model="detailOpen"
      transition="slide-x-reverse-transition"
      scrollable
      content-class="ebl-dialog fill-height"
      @close="closeDetail"
    >
      <VCard width="800" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Q&A Detail</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeDetail">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblSubHeader>
            <h3>Q&A Info</h3>
          </EblSubHeader>

          <EblInfo>
            <EblInfoItem label="Category">
              {{ detailRow?.category || '-' }}
            </EblInfoItem>
            <EblInfoItem label="Answer Status">
              <EblBadge
                v-if="detailRow?.answerStatus"
                :color="getStatusColor(detailRow?.answerStatus)"
                variant="tonal"
                pill
              >
                {{ detailRow?.answerStatus }}
              </EblBadge>
              <span v-else>-</span>
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
            <VDivider class="my-6" />
            <EblInfoItem label="Answerer">
              {{ detailRow?.answerer || '-' }}
            </EblInfoItem>
            <EblInfoItem label="Answer">
              <div style="word-break: break-word; line-height: 1.5">
                {{ detailRow?.answer || '-' }}
              </div>
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

    <!-- Q&A Register Dialog -->
    <EblDialog
      v-model="registerOpen"
      transition="slide-x-reverse-transition"
      scrollable
      content-class="ebl-dialog fill-height"
      @close="closeRegister"
    >
      <VCard width="900" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Q&A Register</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeRegister">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblSubHeader>
            <h3>Q&A Info</h3>
          </EblSubHeader>

          <EblInfo vertical>
            <EblInfoItem label="Category" required has-input>
              <EblSelect
                v-model="registerForm.category"
                placeholder="Select"
                :options="categoryOptions"
                block
              />
            </EblInfoItem>
            <EblInfoItem label="Title" required has-input>
              <EblInput v-model="registerForm.title" placeholder="Input a Title" />
            </EblInfoItem>
            <EblInfoItem label="Message" required has-input>
              <EblTextarea
                v-model="registerForm.message"
                placeholder="Input a Message"
                :counter="5000"
                :max-length="5000"
              />
            </EblInfoItem>
            <EblInfoItem
              label="Attachment"
              has-input
              :tooltip="`업로드 제약 사항\n전체 개수: 1개 , 단일 사이즈: 5MB, 전체 사이즈: 50MB,\n파일 타입: bmp, gif, svg, png, jpg, jpeg, tif, tiff, hwp, hwpx, doc, docx, xls, xlsx, ppt, pptx, pdf, zip`"
            >
              <EblFileInput
                v-model="registerForm.attachments"
                multiple
                accept=".bmp,.gif,.svg,.png,.jpg,.jpeg,.tif,.hwp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.zip"
                :max-size="50"
                placeholder="Click here to upload your file or drag"
                help-text="bmp, gif, svg, png, jpg, jpeg, tif, tiff, hwp, hwpx, doc, docx, xls, xlsx, ppt, pptx, pdf, zip (5MB max)"
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <EblBtn large @click="closeRegister"> Cancel </EblBtn>
          <EblBtn color="cta" large @click="handleRegisterSave"> Save </EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'
import BadgeCellRenderer from '~/components/grid/BadgeCellRenderer.vue'
import IconBtnCellRenderer from '~/components/grid/IconBtnCellRenderer.vue'

const { formatNumber } = useFormat()
const gridApi = ref(null)
const detailOpen = ref(false)
const detailRow = ref(null)
const registerOpen = ref(false)

// ============================================================
// Page Info
// ============================================================
const pageInfo = ref({
  title: 'Q&A',
  breadcrumbItems: [{ text: 'Help Desk' }, { text: 'User Guides' }, { text: 'Q&A' }],
})

// ============================================================
// State
// ============================================================
const activeTab = ref(0)
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

// Register Form
const registerForm = reactive({
  category: '',
  title: '',
  message: '',
  attachments: [],
})

// ============================================================
// Mock Data (실제로는 API에서 가져옴)
// ============================================================
const generateMockData = () => {
  const data = []
  const categories = ['eBL', 'Category', 'Category', 'Category']
  const answerStatuses = ['Waiting', 'Completed', 'Waiting', 'Completed']
  const answerers = ['Admin1', 'Admin1', '-', 'Admin1']

  const mockTitles = ['eBL 등록 방법 문의 드립니다', 'Q&A Title', 'Q&A Title', 'Q&A Title']

  const mockMessages = [
    'eBL 등록을 위한 절부 문서는 어떤 것들이 있는지 문의 드립니다. 또한, 해당 양식이 있는지도 궁금합니다.',
    'Q&A 내용입니다.',
    'Q&A 내용입니다.',
    'Q&A 내용입니다.',
  ]

  const mockAnswers = [
    'eBL 등록 방법에 대해 안내드립니다. 절부 문서는 여러가지만 있으며, 해당 양식도 이번 것들이 있습니다.',
    'Q&A 답변입니다.',
    '',
    'Q&A 답변입니다.',
  ]

  for (let i = 1; i <= 50; i++) {
    // 랜덤 날짜 생성 (최근 1년 내)
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ')

    data.push({
      id: i,
      no: i,
      category: categories[i % categories.length],
      title: mockTitles[i % mockTitles.length],
      message: mockMessages[i % mockMessages.length],
      answerer: answerers[i % answerers.length],
      answerStatus: answerStatuses[i % answerStatuses.length],
      answer: mockAnswers[i % mockAnswers.length],
      addDate: formattedDate,
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

const mockQnaData = ref(generateMockData())

// ============================================================
// Category Options & Tabs
// ============================================================
const categories = computed(() => {
  const cats = new Set(mockQnaData.value.map((item) => item.category))
  return Array.from(cats).sort()
})

const categoryOptions = computed(() => {
  return categories.value.map((cat) => ({ label: cat, value: cat }))
})

const tabItems = computed(() => {
  const items = [{ label: 'ALL', value: 0 }]
  categories.value.forEach((cat, index) => {
    items.push({ label: cat, value: index + 1 })
  })
  return items
})

// ============================================================
// Computed
// ============================================================

// 필터링된 Q&A 목록
const filteredQnaList = computed(() => {
  return mockQnaData.value.filter((item) => {
    // 탭 필터
    if (activeTab.value > 0) {
      const selectedCategory = categories.value[activeTab.value - 1]
      if (item.category !== selectedCategory) {
        return false
      }
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

// 페이지네이션된 Q&A 목록
const paginatedQnaList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredQnaList.value.slice(start, end)
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
    minWidth: 200,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'attachments',
    headerName: 'Attachment',
    width: 110,
    valueFormatter: () => '',
    cellRenderer: IconBtnCellRenderer,
    cellRendererParams: {
      icon: 'ebli:download',
      outlined: true,
      onClick: (data) => {
        console.log('Attachments:', data.attachments)
      },
    },
    cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    headerStyle: { justifyContent: 'center' },
  },
  {
    field: 'answerer',
    headerName: 'Answerer',
    width: 120,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'answerStatus',
    headerName: 'Answer Status',
    width: 140,
    headerStyle: { justifyContent: 'flex-start' },
    cellRenderer: BadgeCellRenderer,
    cellRendererParams: {
      variant: 'tonal',
    },
    valueGetter: (params) => params.data?.answerStatus,
  },
  {
    field: 'addDate',
    headerName: 'Add Date',
    width: 180,
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

// Status 색상 매핑
const getStatusColor = (status) => {
  if (status === 'Waiting') return 'amber'
  if (status === 'Completed') return 'mint'
  return 'default'
}

// Detail 다이얼로그 닫기
const closeDetail = () => {
  detailOpen.value = false
}

// Register 다이얼로그 열기
const openRegisterDialog = () => {
  registerForm.category = ''
  registerForm.title = ''
  registerForm.message = ''
  registerForm.attachments = []
  registerOpen.value = true
}

// Register 다이얼로그 닫기
const closeRegister = () => {
  registerOpen.value = false
}

// Register 저장
const handleRegisterSave = () => {
  // TODO: API 호출하여 저장
  console.log('Register Save:', registerForm)
  closeRegister()
}
</script>

<style scoped lang="scss">
// Q&A 페이지는 _common.scss에서 스타일 적용
</style>
