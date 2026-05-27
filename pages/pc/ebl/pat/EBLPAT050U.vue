<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="cta" large @click="openCreateDialog">Create Invitation</EblBtn>
      </template>
    </EblPageHeader>
    <div class="ebl-card-container">
      <!-- EblSubHeader -->
      <EblSubHeader>
        <h2>total</h2>
        <span class="count">{{ formatNumber(rowData.length) }}</span>
        <template #tooltip>
          •초대장 발송 이력 메뉴를 통해 초대장의 수신여부를 확인할 수 있습니다.<br />
          •초대장은 이메일로 발송되며, 초대장별로 내용을 편집할 수 있습니다.
        </template>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters">
        <EblInput
          v-model="filters.companyName"
          clearable
          placeholder="Company Name"
          style="width: 180px"
         @keydown.enter="applyFilters" />
        <EblInput
          v-model="filters.recipient"
          clearable
          placeholder="Recipient"
          style="width: 180px"
         @keydown.enter="applyFilters" />
        <EblSelect
          v-model="filters.receptionStatus"
          placeholder="Reception Status"
          :options="receptionStatusOptions"
          clearable
          style="width: 200px"
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
          :length="Math.ceil(sortedRowData.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>

      <!-- EBLPAT020U - Invitation Detail / Create Invitation Dialog -->
      <EblDialog
        v-model="dialogOpen"
        transition="slide-x-reverse-transition"
        content-class="ebl-dialog ebl-dialog--multiple"
        :persistent="createOpen"
        @close="closeDialog"
      >
        <VCard v-if="detailOpen" width="480" class="ebl-dialog__card">
          <VCardTitle class="ebl-dialog__header">
            <span class="title">Invitation Detail</span>
            <VSpacer />
            <EblBtn icon pill small @click="closeDialog">
              <VIcon icon="ebli:close" :size="20" />
            </EblBtn>
          </VCardTitle>

          <VCardText class="ebl-dialog__text">
            <EblSubHeader>
              <h3>Invitation Info</h3>
            </EblSubHeader>
            <EblInfo>
              <EblInfoItem label="Recipient" hasInput>
                <div style="display: flex; align-items: center; gap: 12px">
                  <span class="ebl-link">{{ detailRow?.recipient || '-' }}</span>
                  <EblBtn
                    outlined
                    @click="openCreateFromResend"
                    :disabled="!['Expiration', 'Error'].includes(detailRow?.receptionStatus)"
                  >
                    Resend
                  </EblBtn>
                </div>
              </EblInfoItem>
              <EblInfoItem label="Company Name">{{ detailRow?.companyName || '-' }}</EblInfoItem>
              <EblInfoItem label="Title">{{ detailRow?.title || '-' }}</EblInfoItem>
              <EblInfoItem label="Message">{{ detailRow?.message || '-' }}</EblInfoItem>
              <EblInfoItem label="Send Date">{{ detailRow?.sendDate || '-' }}</EblInfoItem>
              <EblInfoItem label="Reception Status">{{
                detailRow?.receptionStatus || '-'
              }}</EblInfoItem>
              <EblInfoItem label="Expiration Date">{{
                detailRow?.expirationDate || '-'
              }}</EblInfoItem>
            </EblInfo>
          </VCardText>

          <VCardActions class="ebl-dialog__actions">
            <EblBtn large @click="closeDialog">Back</EblBtn>
          </VCardActions>
        </VCard>

        <v-slide-x-reverse-transition>
          <VCard v-if="createOpen" width="720" class="ebl-dialog__card">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">Create Invitation</span>
              <VSpacer />
              <EblBtn icon pill small @click="closeCreateDialog">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>

            <VCardText class="ebl-dialog__text">
              <EblInfo vertical>
                <EblInfoItem label="Recipient" required hasInput>
                  <div style="display: flex; gap: 12px; align-items: flex-start">
                    <EblInput
                      v-model="createForm.recipient"
                      placeholder="Input a E-Mail"
                      counter
                      :maxlength="20"
                      style="flex: 1"
                      :error="!!createFormErrors.recipient"
                      :errorMessage="createFormErrors.recipient"
                      :helperText="recipientHelper"
                    />
                    <EblBtn
                      outlined
                      style="flex-shrink: 0; white-space: nowrap"
                      @click="handleDuplicateCheck"
                    >
                      Duplicate Check
                    </EblBtn>
                  </div>
                </EblInfoItem>
                <EblInfoItem label="Company Name" required hasInput>
                  <EblInput
                    v-model="createForm.companyName"
                    placeholder="Input a Company Name"
                    :error="!!createFormErrors.companyName"
                    :errorMessage="createFormErrors.companyName"
                  />
                </EblInfoItem>
                <EblInfoItem label="Title" required hasInput>
                  <EblInput
                    v-model="createForm.title"
                    placeholder="Input a Title"
                    :error="!!createFormErrors.title"
                    :errorMessage="createFormErrors.title"
                  />
                </EblInfoItem>
                <EblInfoItem label="Message" required hasInput>
                  <EblTextarea
                    v-model="createForm.message"
                    :rows="6"
                    placeholder="작성 내용..."
                    :error="!!createFormErrors.message"
                    :errorMessage="createFormErrors.message"
                  />
                </EblInfoItem>
              </EblInfo>
            </VCardText>

            <VCardActions class="ebl-dialog__actions">
              <EblBtn large @click="closeCreateDialog">Cancel</EblBtn>
              <EblBtn color="cta" large @click="handleSend">Send</EblBtn>
            </VCardActions>
          </VCard>
        </v-slide-x-reverse-transition>
      </EblDialog>
    </div>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { useDialogStore } from '~/stores/useDialogStore'
import { useToastStore } from '~/stores/toast'
import { AgGridVue } from 'ag-grid-vue3'

// ==================== Composables & Stores ====================
const { formatNumber } = useFormat()
const dialogStore = useDialogStore()
const toastStore = useToastStore()

// ==================== Page Meta ====================
const pageInfo = ref({
  title: 'My Invitations',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Partners' }, { text: 'My Invitations' }],
})

// ==================== Dialog State ====================
const detailOpen = ref(false) // Invitation Detail 다이얼로그 상태
const createOpen = ref(false) // Create Invitation 다이얼로그 상태
const detailRow = ref(null) // 선택된 초대장 상세 데이터

// 다이얼로그 통합 상태 (Detail 또는 Create 중 하나라도 열려있으면 true)
const dialogOpen = computed({
  get: () => detailOpen.value || createOpen.value,
  set: (value) => {
    if (!value) closeDialog()
  },
})

// ==================== Form State ====================
// Create Invitation 폼 데이터
const createForm = reactive({
  recipient: '',
  companyName: '',
  title: '',
  message: '',
})

// Create Invitation 폼 에러 메시지
const createFormErrors = reactive({
  recipient: '',
  companyName: '',
  title: '',
  message: '',
})

const recipientHelper = ref('') // Recipient 필드 헬퍼 텍스트
const tempNum = ref(1) // Duplicate Check 번갈아가며 테스트용 카운터

// ==================== Grid State ====================
const gridApi = shallowRef(null)
const page = ref(1) // 현재 페이지
const itemsPerPage = ref(10) // 페이지당 아이템 수

// Reception Status 필터 옵션
const receptionStatusOptions = [
  { label: 'All', value: '' },
  { label: 'Send', value: 'Send' },
  { label: 'Read', value: 'Read' },
  { label: 'Expiration', value: 'Expiration' },
  { label: 'Error', value: 'Error' },
]

// ==================== Data Generation ====================
// 더미 데이터 생성 (100개의 초대장 데이터)
const generateDummyData = () => {
  const data = []
  const companies = [
    'KTNETBL1',
    'CJ Logistics Corporation',
    'KEB Hana Bank',
    'Hyundai Merchant Marine Co. Ltd',
  ]
  const recipients = ['xxx@ktnet.co.kr', 'xxx@cj.com', 'xxx@hana.co.kr', 'xxx@HY.com']
  const statuses = ['Send', 'Read', 'Expiration', 'Error']

  for (let i = 1; i <= 100; i++) {
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = date.toISOString().split('T')[0]
    const formattedDateTime = `${formattedDate} ${String(Math.floor(Math.random() * 24)).padStart(
      2,
      '0',
    )}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:20`

    data.push({
      no: i,
      recipient: recipients[i % recipients.length],
      companyName: companies[i % companies.length],
      sendDate: formattedDateTime,
      receptionStatus: statuses[i % statuses.length],
      expirationDate: formattedDate,
      title: 'eBL 물류 포털 시스템에 귀사를 초대합니다.',
      message: '메시지 내용입니다. 메시지 내용입니다. 메시지 내용입니다.',
    })
  }
  return data
}

const rowData = ref(generateDummyData())

// No 내림차순 정렬
const sortedRowData = computed(() => {
  return [...rowData.value].sort((a, b) => (b.no ?? 0) - (a.no ?? 0))
})

// 필터가 적용된 데이터
const filteredRowData = computed(() => {
  return sortedRowData.value.filter((row) => {
    const matchesCompanyName = (row.companyName || '')
      .toLowerCase()
      .includes(appliedFilters.companyName.toLowerCase())
    const matchesRecipient = (row.recipient || '')
      .toLowerCase()
      .includes(appliedFilters.recipient.toLowerCase())
    const matchesReceptionStatus =
      appliedFilters.receptionStatus === '' || (row.status || '') === appliedFilters.receptionStatus

    let matchesDate = true
    if (appliedFilters.dateRange && appliedFilters.dateRange[0] && appliedFilters.dateRange[1]) {
      const rowDate = new Date(row.sendDate || row.date)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = rowDate >= startDate && rowDate <= endDate
    }

    return matchesCompanyName && matchesRecipient && matchesReceptionStatus && matchesDate
  })
})

// 페이지네이션 적용된 데이터
const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRowData.value.slice(start, end)
})

// 페이지 수 변경 시 현재 페이지 재조정
watch([itemsPerPage, () => rowData.value.length], () => {
  const maxPage = Math.ceil(filteredRowData.value.length / itemsPerPage.value)
  if (page.value > maxPage) {
    page.value = Math.max(1, maxPage)
  }
  if (page.value < 1) {
    page.value = 1
  }
})

// ==================== AG Grid Column Definitions ====================
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
    field: 'recipient',
    headerName: 'Recipient',
    width: 220,
    minWidth: 180,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'companyName',
    headerName: 'Company Name',
    flex: 1,
    minWidth: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'sendDate',
    headerName: 'Send Date',
    width: 200,
    minWidth: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'receptionStatus',
    headerName: 'Reception Status',
    width: 160,
    minWidth: 140,
    headerStyle: { justifyContent: 'flex-start' },
    cellStyle: (params) => {
      // Expiration/Error는 빨간색 표시
      if (params.value === 'Expiration' || params.value === 'Error') {
        return { color: '#ff1c1c' }
      }
      return null
    },
  },
  {
    field: 'expirationDate',
    headerName: 'Expiration Date',
    width: 160,
    minWidth: 140,
    headerStyle: { justifyContent: 'flex-start' },
    cellStyle: (params) => {
      // Reception Status가 Expiration이면 만료일도 빨간색
      if (params.data?.receptionStatus === 'Expiration') {
        return { color: '#ff1c1c' }
      }
      return null
    },
  },
])

// ==================== Filters ====================
// 필터 초기 날짜 범위 (2025-12-01 ~ 2026-01-01)
function getDefaultDateRange() {
  return [new Date('2025-12-01'), new Date('2026-01-01')]
}

// 필터 상태 (입력용)
const filters = reactive({
  companyName: '',
  recipient: '',
  receptionStatus: '',
  dateRange: getDefaultDateRange(),
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  companyName: '',
  recipient: '',
  receptionStatus: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.companyName = filters.companyName
  appliedFilters.recipient = filters.recipient
  appliedFilters.receptionStatus = filters.receptionStatus
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  page.value = 1
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.companyName = ''
  filters.recipient = ''
  filters.receptionStatus = ''
  filters.dateRange = getDefaultDateRange()
  appliedFilters.companyName = ''
  appliedFilters.recipient = ''
  appliedFilters.receptionStatus = ''
  appliedFilters.dateRange = null
  page.value = 1
}

// ==================== Grid Event Handlers ====================
const onGridReady = (params) => {
  gridApi.value = params.api
}

// 셀 클릭 시 Invitation Detail 다이얼로그 열기 (Recipient, Company Name 컬럼만)
const onCellClicked = (params) => {
  if (params.column.getColId() === 'recipient' || params.column.getColId() === 'companyName') {
    detailRow.value = params.data
    detailOpen.value = true
    createOpen.value = false
  }
}

// ==================== Dialog Handlers ====================
// Create Invitation 다이얼로그 열기
const openCreateDialog = () => {
  createOpen.value = true
  detailOpen.value = false
}

// Resend 버튼 클릭 (Expiration/Error 상태에만 활성화)
const openCreateFromResend = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: '경고',
    icon: 'warning',
    message: '초대장을 재발송 하시겠습니까?',
    confirmText: '확인',
    cancelText: '취소',
  })

  if (!confirmed) return

  detailOpen.value = false
  toastStore.add({
    text: '해당 이메일로 초대장을 발송 하였습니다.',
  })
}

// Create Invitation 다이얼로그 닫기
const closeCreateDialog = () => {
  createOpen.value = false
  if (!detailOpen.value) closeDialog()
}

// 모든 다이얼로그 닫기 및 폼 초기화
const closeDialog = () => {
  detailOpen.value = false
  createOpen.value = false
  detailRow.value = null
  createForm.recipient = ''
  createForm.companyName = ''
  createForm.title = ''
  createForm.message = ''
  clearErrors()
}

// ==================== Form Validation ====================
// 에러 및 헬퍼 메시지 초기화
const clearErrors = () => {
  createFormErrors.recipient = ''
  createFormErrors.companyName = ''
  createFormErrors.title = ''
  createFormErrors.message = ''
  recipientHelper.value = ''
}

// Duplicate Check 버튼 클릭 (임시: 번갈아가며 성공/실패 표시)
const handleDuplicateCheck = () => {
  tempNum.value++
  const isSuccess = tempNum.value % 2 === 0

  if (isSuccess) {
    createFormErrors.recipient = ''
    recipientHelper.value = '해당 이메일로 초대장 발송이 가능합니다.'
  } else {
    recipientHelper.value = ''
    createFormErrors.recipient = '이미 등록된 사용자의 이메일 주소입니다.'
  }
}

// 폼 유효성 검사
const validateForm = () => {
  clearErrors()
  let isValid = true

  // 필수 항목 검사
  if (!createForm.recipient.trim()) {
    createFormErrors.recipient = '필수 항목입니다.'
    isValid = false
  }
  if (!createForm.companyName.trim()) {
    createFormErrors.companyName = '필수 항목입니다.'
    isValid = false
  }
  if (!createForm.title.trim()) {
    createFormErrors.title = '필수 항목입니다.'
    isValid = false
  }
  if (!createForm.message.trim()) {
    createFormErrors.message = '필수 항목입니다.'
    isValid = false
  }

  // 중복 이메일 검사 (실제 API 연동 시 서버에서 처리)
  if (createForm.recipient.trim() && isValid) {
    const existingRecipient = rowData.value.some(
      (item) => item.recipient.toLowerCase() === createForm.recipient.toLowerCase(),
    )
    if (existingRecipient) {
      createFormErrors.recipient = '이미 등록된 사용자의 이메일 주소입니다.'
      isValid = false
    }
  }

  return isValid
}

// Send 버튼 클릭 (유효성 검사 후 초대장 발송)
const handleSend = () => {
  if (validateForm()) {
    createOpen.value = false
    if (!detailOpen.value) closeDialog()
    console.log('초대장 발송:', createForm)
    toastStore.add({
      text: '해당 이메일로 초대장을 발송 하였습니다.',
    })
  }
}
</script>
