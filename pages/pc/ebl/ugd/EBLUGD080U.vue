<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #tooltip>
        •공지사항 12사용자 문의 항목을 선택하면 상세 내용을 확인할 수 있습니다. <br />
        •상세 화면을 통해 문의에 대한 답변의 확인이 가능합니다.
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <div class="ebl-tabs-container">
        <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      </div>

      <EblSubHeader class="mt-6">
        <h2>Total</h2>
        <span class="count">{{ formatNumber(filteredNoticeList.length) }}</span>
      </EblSubHeader>

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

      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :row-data="paginatedNoticeList"
        :column-defs="colDefs"
        :dom-layout="'autoHeight'"
        @cell-clicked="onCellClicked"
      />

      <div class="ebl-pagination--container mt-3">
        <div>
          Count
          <EblSelect
            v-model="itemsPerPage"
            placeholder="Items per page"
            :options="pageSizeOptions"
            class="ml-2"
          />
        </div>
        <EblPagination
          v-model="currentPage"
          :length="Math.ceil(filteredNoticeList.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>
    </div>

    <EblDialog
      v-model="detailOpen"
      transition="slide-x-reverse-transition"
      scrollable
      content-class="ebl-dialog fill-height"
      @close="closeDetail"
    >
      <VCard width="800" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Notice Details</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeDetail">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblInfo class="ebl-notice-detail">
            <EblInfoItem label="Category">
              {{ detailRow?.category || '-' }}
            </EblInfoItem>
            <EblInfoItem label="Title">
              {{ detailRow?.title || '-' }}
            </EblInfoItem>
            <EblInfoItem label="Message">
              {{ detailRow?.message || '-' }}
            </EblInfoItem>
            <EblInfoItem label="Add Date">
              {{ detailRow?.addDate || '-' }}
            </EblInfoItem>
          </EblInfo>
        </VCardText>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'

const { formatNumber } = useFormat()

const detailOpen = ref(false)
const detailRow = ref(null)

const pageInfo = ref({
  title: 'Notices',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'User Guides' }, { text: 'Notices' }],
})

const activeTab = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const pageSizeOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
]

const filters = reactive({
  title: '',
  message: '',
  dateRange: null,
})

const appliedFilters = reactive({
  title: '',
  message: '',
  dateRange: null,
})

const applyFilters = () => {
  appliedFilters.title = filters.title
  appliedFilters.message = filters.message
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  currentPage.value = 1
}

const resetFilters = () => {
  filters.title = ''
  filters.message = ''
  filters.dateRange = null
  appliedFilters.title = ''
  appliedFilters.message = ''
  appliedFilters.dateRange = null
  currentPage.value = 1
}

const noticeCategoryMap = {
  0: {
    category: 'category1',
    title: '서비스 긴급점검 공지입니다',
    message:
      '서비스 안정성 강화를 위해 긴급 점검이 진행됩니다. 점검 시간 동안 일부 기능 이용이 제한될 수 있으며, 작업 완료 후 순차적으로 정상화됩니다. 회원가입부터 eBL 발행까지 자주 사용하는 메뉴는 점검 종료 후 다시 확인해 주시기 바랍니다.',
  },
  1: {
    category: 'category2',
    title: '정기 배포 일정 안내',
    message:
      '정기 배포가 예정되어 있습니다. 신규 기능 반영과 성능 개선이 함께 포함되며, 배포 당일에는 짧은 시간 동안 페이지 새로고침이 발생할 수 있습니다. 업무 영향이 예상되는 경우 사전에 주요 작업을 저장해 주세요.',
  },
  2: {
    category: 'category3',
    title: '보안 정책 업데이트 안내',
    message:
      '보안 강화를 위해 비밀번호 정책과 세션 유지 시간이 일부 변경됩니다. 장시간 미사용 시 자동 로그아웃이 적용될 수 있으며, 중요 메뉴 접근 시 추가 인증이 요구될 수 있습니다.',
  },
  3: {
    category: 'category4',
    title: '신규 기능 오픈 공지',
    message:
      '사용 편의성 향상을 위한 신규 기능이 오픈되었습니다. 목록 조회, 상세 확인, 검색 성능 개선이 포함되어 있으며, 기능별 사용 방법은 공지와 자료실을 통해 순차적으로 안내될 예정입니다.',
  },
}

const pad = (value) => String(value).padStart(2, '0')

const formatDateTime = (date) => {
  return (
    [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-') +
    ' ' +
    [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(':')
  )
}

const generateMockNotices = () => {
  const notices = []

  for (let i = 1; i <= 48; i++) {
    const pattern = noticeCategoryMap[(i - 1) % Object.keys(noticeCategoryMap).length]
    const date = new Date()
    date.setDate(date.getDate() - (i - 1) * 3)
    date.setHours(15, 30, 20, 0)

    notices.push({
      id: i,
      no: i,
      category: pattern.category,
      title: `${pattern.title}${i % 4 === 0 ? ' - ' + String(i).padStart(2, '0') : ''}`,
      message:
        i % 5 === 0
          ? `${pattern.message}\n\n추가 안내 사항은 공지사항 본문과 향후 업데이트 공지를 통해 다시 안내드리겠습니다.`
          : pattern.message,
      addDate: formatDateTime(date),
    })
  }

  return notices
}

const mockNoticeData = ref(generateMockNotices())

const categories = computed(() => {
  const values = new Set(mockNoticeData.value.map((item) => item.category))
  return Array.from(values)
})

const tabItems = computed(() => {
  const items = [{ label: 'ALL', value: 0 }]
  categories.value.forEach((category, index) => {
    items.push({ label: category, value: index + 1 })
  })
  return items
})

const filteredNoticeList = computed(() => {
  return mockNoticeData.value.filter((item) => {
    if (activeTab.value > 0) {
      const selectedCategory = categories.value[activeTab.value - 1]
      if (item.category !== selectedCategory) {
        return false
      }
    }

    if (
      appliedFilters.title &&
      !item.title.toLowerCase().includes(appliedFilters.title.toLowerCase())
    ) {
      return false
    }

    if (
      appliedFilters.message &&
      !item.message.toLowerCase().includes(appliedFilters.message.toLowerCase())
    ) {
      return false
    }

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

const paginatedNoticeList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredNoticeList.value.slice(start, start + itemsPerPage.value)
})

const colDefs = ref([
  {
    field: 'no',
    headerName: 'No',
    width: 60,
    maxWidth: 80,
    sort: 'desc',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 120,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
    minWidth: 240,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'addDate',
    headerName: 'Add Date',
    width: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

const onCellClicked = (params) => {
  if (params.column.getColId() !== 'title') return
  detailRow.value = params.data
  detailOpen.value = true
}

const closeDetail = () => {
  detailOpen.value = false
}

watch([activeTab, itemsPerPage], () => {
  currentPage.value = 1
})

watch(
  () => filteredNoticeList.value.length,
  (length) => {
    const totalPages = Math.max(1, Math.ceil(length / itemsPerPage.value))
    if (currentPage.value > totalPages) {
      currentPage.value = totalPages
    }
  },
)
</script>
