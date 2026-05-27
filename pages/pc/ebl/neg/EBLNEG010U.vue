<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo" />
    <div class="ebl-card-container">
      <!-- Tabs -->
      <div class="ebl-tabs-container mb-6">
        <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      </div>

      <!-- ===== Negotiation List Tab ===== -->
      <template v-if="activeTab === 'negotiation'">
        <!-- EblSubHeader -->
        <EblSubHeader>
          <h2>total</h2>
          <span class="count">{{ formatNumber(neg_filteredRowData.length) }}</span>
          <template #tooltip>
            •eBL 매입 현황 메뉴에서는 현재 진행중인 B/L 매입 내역을 확인할 수 있습니다.<br />
            •역할에 따라 화주/은행으로 구분하여 확인이 가능합니다.
          </template>
        </EblSubHeader>

        <!-- 필터 영역 -->
        <div class="ebl-page-filters">
          <EblInput
            v-model="neg_filters.applicant"
            clearable
            placeholder="Applicant"
            :style="{ width: '180px' }"
            @keydown.enter="neg_applyFilters"
          />
          <EblInput
            v-model="neg_filters.recipient"
            clearable
            placeholder="Recipient"
            :style="{ width: '180px' }"
            @keydown.enter="neg_applyFilters"
          />
          <EblSelect
            v-model="neg_filters.negotiationStatus"
            placeholder="Negotiation Status"
            :options="neg_negotiationStatusOptions"
            clearable
            multiple
          />
          <EblDatePicker
            v-model="neg_filters.dateRange"
            range
            clearable
            placeholder="Date Range"
            :start-date="neg_filters.dateRange?.[0]"
            :focus-start-date="true"
            style="width: 260px"
            auto-apply
          />
          <EblBtn outlined @click="neg_applyFilters">Search</EblBtn>
          <EblBtn icon="ebli:refresh" outlined color="transparent" @click="neg_resetFilters" />
        </div>

        <!-- AG Grid -->
        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="neg_paginatedRowData"
          :column-defs="neg_colDefs"
          :dom-layout="'autoHeight'"
          @grid-ready="neg_onGridReady"
          @cell-clicked="neg_onCellClicked"
        />
        <div class="ebl-pagination--container mt-3">
          <div>
            Count
            <EblSelect
              v-model="neg_itemsPerPage"
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
            v-model="neg_page"
            :length="neg_maxPage"
            total-visible="5"
            show-first-last-page
          />
        </div>
      </template>

      <!-- ===== Presentation Tab ===== -->
      <template v-else-if="activeTab === 'presentation'">
        <!-- EblSubHeader -->
        <EblSubHeader>
          <h2>total</h2>
          <span class="count">{{ formatNumber(pre_filteredRowData.length) }}</span>
          <template #tooltip>
            •매입서류 관리 메뉴에서는 개설은행 앞으로 요청된 심사 항목을 확인할 수 있습니다. <br />
            •심사 결과를 승인/반려 할 수 있습니다.
          </template>
        </EblSubHeader>

        <!-- 필터 영역 -->
        <div class="ebl-page-filters">
          <EblInput
            v-model="pre_filters.purchaseBank"
            clearable
            placeholder="Purchase Bank"
            :style="{ width: '200px' }"
            @keydown.enter="pre_applyFilters"
          />
          <EblInput
            v-model="pre_filters.lcNo"
            clearable
            placeholder="L/C No"
            :style="{ width: '200px' }"
            @keydown.enter="pre_applyFilters"
          />
          <EblDatePicker
            v-model="pre_filters.dateRange"
            range
            clearable
            placeholder="Date Range"
            :start-date="pre_filters.dateRange?.[0]"
            :focus-start-date="true"
            style="width: 260px"
            auto-apply
          />
          <EblBtn outlined @click="pre_applyFilters">Search</EblBtn>
          <EblBtn icon="ebli:refresh" outlined color="transparent" @click="pre_resetFilters" />
        </div>

        <!-- AG Grid -->
        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="pre_paginatedRowData"
          :column-defs="pre_colDefs"
          :dom-layout="'autoHeight'"
          @grid-ready="pre_onGridReady"
          @cell-clicked="pre_onCellClicked"
        />
        <div class="ebl-pagination--container mt-3">
          <div>
            Count
            <EblSelect
              v-model="pre_itemsPerPage"
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
            v-model="pre_page"
            :length="pre_maxPage"
            total-visible="5"
            show-first-last-page
          />
        </div>
      </template>
    </div>

    <!-- ===== EBLNEG050P - Negotiation Detail Dialog ===== -->
    <EblDialog
      v-model="neg_detailOpen"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog fill-height"
      scrollable
      @close="neg_closeDetail"
    >
      <VCard width="450" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Negotiation Detail</span>
          <VSpacer />
          <EblBtn icon pill small @click="neg_closeDetail">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblSubHeader>
            <h3>Negotiation Info</h3>
          </EblSubHeader>
          <EblInfo>
            <EblInfoItem label="L/C No">{{ neg_detailRow?.lcNo || '-' }}</EblInfoItem>
            <EblInfoItem label="Transaction No" has-input content-class="line-height-20">
              <template v-if="Array.isArray(neg_detailRow?.transactionNo)">
                {{ neg_detailRow.transactionNo.join(', ') }}
              </template>
              <template v-else>{{ neg_detailRow?.transactionNo || '-' }}</template>
            </EblInfoItem>
            <EblInfoItem label="B/L No" has-input content-class="line-height-20">
              <template v-if="Array.isArray(neg_detailRow?.blNo)">
                <template v-for="(bl, idx) in neg_detailRow.blNo" :key="`bl-${idx}`">
                  <span v-if="idx > 0">, </span>
                  <span class="ebl-link">{{ bl }}</span>
                </template>
              </template>
              <template v-else>
                <span class="ebl-link">{{ neg_detailRow?.blNo || '-' }}</span>
              </template>
            </EblInfoItem>
            <EblInfoItem label="Applicant" has-input>
              <div class="ebl-thumbs-item">
                <div v-if="neg_detailRow?.applicantLogo" alt="Logo" class="ebl-thumbs-item__avatar">
                  <img :src="neg_detailRow.applicantLogo" />
                </div>
                <span class="ebl-thumbs-item__content">{{ neg_detailRow?.applicant || '-' }}</span>
              </div>
            </EblInfoItem>
            <EblInfoItem label="Application Date">{{
              neg_detailRow?.applicationDate || '-'
            }}</EblInfoItem>
            <EblInfoItem label="Negotiating Bank">{{
              neg_detailRow?.negotiatingBank || '-'
            }}</EblInfoItem>
            <EblInfoItem label="Neg/Col">Negotiation</EblInfoItem>
            <EblInfoItem label="Negotiation Status">{{
              neg_detailRow?.negotiationStatus || '-'
            }}</EblInfoItem>
            <EblInfoItem label="Document No">XXXXXXXXXXXXXX</EblInfoItem>
            <EblInfoItem label="Neg/Col Date">{{
              neg_detailRow?.applicationDate || '-'
            }}</EblInfoItem>
            <EblInfoItem label="Negotiation Amount">1,000,000</EblInfoItem>
            <EblInfoItem label="Unit">Dollar</EblInfoItem>
            <EblInfoItem label="Issuing Bank">{{ neg_detailRow?.issuingBank || '-' }}</EblInfoItem>
            <EblInfoItem label="Attache(I/V)" has-input>
              <div class="ebl-file-item">
                <span class="ebl-file-item__name">filename.png</span>
                <EblBtn outlined>Preview</EblBtn>
              </div>
            </EblInfoItem>
            <EblInfoItem label="Attache(P/L)" has-input>
              <div class="ebl-file-item">
                <span class="ebl-file-item__name">filename0202.png</span>
                <EblBtn outlined>Preview</EblBtn>
              </div>
            </EblInfoItem>
            <EblInfoItem label="Attache(C/O)" has-input>
              <div class="ebl-file-item">
                <span class="ebl-file-item__name">filenamefkdjfkdj.png</span>
                <EblBtn outlined>Preview</EblBtn>
              </div>
            </EblInfoItem>
            <EblInfoItem label="Attache(Insurance)" has-input>
              <div class="ebl-file-item">
                <span class="ebl-file-item__name">filename.png</span>
                <EblBtn outlined>Preview</EblBtn>
              </div>
            </EblInfoItem>
          </EblInfo>
        </VCardText>
      </VCard>
    </EblDialog>

    <!-- ===== EBLNEG060P - Presentation Detail Dialog ===== -->
    <EblDialog
      v-model="pre_detailOpen"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog ebl-dialog--multiple fill-height"
      scrollable
      @close="pre_closeDetail"
    >
      <VCard width="450" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Presentation Detail</span>
          <VSpacer />
          <EblBtn icon pill small @click="pre_closeDetail">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblSubHeader>
            <h3>Presentation Info</h3>
            <template #util>
              <EblBtn color="tertiary" @click="console.log('Download All')">Download All</EblBtn>
            </template>
          </EblSubHeader>
          <EblInfo>
            <EblInfoItem label="L/C No">
              <span class="ebl-link">{{ pre_detailRow?.lcNo || '-' }}</span>
            </EblInfoItem>
            <EblInfoItem label="Negotiating Bank">{{
              pre_detailRow?.purchaseBank || '-'
            }}</EblInfoItem>
            <EblInfoItem label="Issuing Bank">{{ pre_detailRow?.openingBank || '-' }}</EblInfoItem>
            <EblInfoItem label="Cover Letter" has-input>
              <div class="ebl-file-item">
                <span class="ebl-file-item__name ebl-link">xxxxxxxxxxxxxxxx</span>
                <EblBtn outlined>Download</EblBtn>
              </div>
            </EblInfoItem>
            <EblInfoItem label="B/L No">
              <span class="ebl-link">{{ pre_detailRow?.blNo || '-' }}</span>
            </EblInfoItem>
            <EblInfoItem label="Completion Notice" has-input>
              <div class="ebl-file-item">
                <span class="ebl-file-item__name ebl-link">xxxxxxxxxxxxxxxx</span>
                <EblBtn outlined>Download</EblBtn>
              </div>
            </EblInfoItem>
            <EblInfoItem label="Attachment" has-input>
              <template #label>
                Attachment
                <EblBadge pill variant="tonal" color="blue" size="sm" class="btn-badge">3</EblBadge>
              </template>
              <div style="display: flex; flex-direction: column; gap: 8px">
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">파일명.PDF</span>
                  <EblBtn outlined>Download</EblBtn>
                </div>
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">파일명2.PDF</span>
                  <EblBtn outlined>Download</EblBtn>
                </div>
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">파일명3.PDF</span>
                  <EblBtn outlined>Download</EblBtn>
                </div>
              </div>
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-dialog__actions">
          <EblBtn color="danger" large @click="pre_openRejectDialog">Reject</EblBtn>
          <VSpacer />
          <EblBtn color="cta" large @click="pre_handleApprove">Approve</EblBtn>
        </VCardActions>
      </VCard>
      <VSlideXReverseTransition leave-absolute>
        <!-- EBLNEG040P - Reason for Rejection Dialog -->
        <VCard v-if="pre_rejectOpen" width="600" class="ebl-dialog__card">
          <VCardTitle class="ebl-dialog__header">
            <span class="title">Reason for Rejection</span>
            <VSpacer />
            <EblBtn icon pill small @click="pre_closeRejectDialog">
              <VIcon icon="ebli:close" :size="20" />
            </EblBtn>
          </VCardTitle>

          <VCardText class="ebl-dialog__text">
            <EblTextarea
              v-model="pre_rejectReason"
              placeholder="작성 내용..."
              :rows="6"
              counter
              :maxlength="5000"
            />
          </VCardText>

          <VCardActions class="ebl-dialog__actions">
            <VSpacer />
            <EblBtn large @click="pre_closeRejectDialog">Cancel</EblBtn>
            <EblBtn color="cta" large :disabled="!pre_rejectReason.trim()" @click="pre_handleReject"
              >Submit</EblBtn
            >
          </VCardActions>
        </VCard>
      </VSlideXReverseTransition>
    </EblDialog>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'
import CompanyNameCellRenderer from '~/components/grid/CompanyNameCellRenderer.vue'
import IconBtnCellRenderer from '~/components/grid/IconBtnCellRenderer.vue'

const { formatNumber } = useFormat()

// ===== 탭 =====
const activeTab = ref('negotiation')
const tabItems = [
  { label: 'Negotiation List', value: 'negotiation' },
  { label: 'Presentation', value: 'presentation' },
]

const pageInfo = ref({
  title: 'Negotiation',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Management' }, { text: 'Negotiation' }],
})

// ===== 기본 날짜 범위 =====
function getDefaultDateRange30() {
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - 30)
  return [start, today]
}

function getDefaultDateRange1Y() {
  const today = new Date()
  const start = new Date(today)
  start.setFullYear(start.getFullYear() - 1)
  return [start, today]
}

// =============================================
// ===== Negotiation List Tab (neg_ prefix) =====
// =============================================

const neg_gridApi = shallowRef(null)
const neg_detailOpen = ref(false)
const neg_detailRow = ref(null)
const neg_page = ref(1)
const neg_itemsPerPage = ref(10)

const neg_negotiationStatusOptions = ref([
  { label: 'All', value: '_all' },
  { label: 'Under Negotiation', value: 'Under Negotiation' },
  { label: 'Approved by Negotiating Bank', value: 'Approved by Negotiating Bank' },
  { label: 'Dishonoured by Negotiating Bank', value: 'Dishonoured by Negotiating Bank' },
  { label: 'Additional Documents Submitted', value: 'Additional Documents Submitted' },
  { label: 'Additional Documents Approved', value: 'Additional Documents Approved' },
  { label: 'Additional Documents Rejected', value: 'Additional Documents Rejected' },
  { label: 'Approved by Issuing Bank', value: 'Approved by Issuing Bank' },
  { label: 'Dishonoured by Issuing Bank', value: 'Dishonoured by Issuing Bank' },
])

const neg_generateDummyData = () => {
  const statuses = [
    'Under Negotiation',
    'Approved by Negotiating Bank',
    'Dishonoured by Negotiating Bank',
    'Additional Documents Submitted',
    'Additional Documents Approved',
    'Additional Documents Rejected',
    'Approved by Issuing Bank',
    'Dishonoured by Issuing Bank',
  ]
  const companies = [
    { name: 'HMM', logo: 'https://picsum.photos/seed/hmm/40/40' },
    { name: 'Maersk Line', logo: 'https://picsum.photos/seed/maersk/40/40' },
    { name: 'MSC', logo: 'https://picsum.photos/seed/msc/40/40' },
    { name: 'CMA CGM', logo: 'https://picsum.photos/seed/cma/40/40' },
    { name: 'Evergreen', logo: 'https://picsum.photos/seed/evergreen/40/40' },
    { name: 'OOCL', logo: 'https://picsum.photos/seed/oocl/40/40' },
  ]
  const banks = [
    'KB Kookmin Bank',
    'Shinhan Bank',
    'Hana Bank',
    'Woori Bank',
    'NH Bank',
    'IBK Bank',
  ]
  return Array.from({ length: 100 }, (_, idx) => {
    const i = idx + 1
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = date.toISOString().split('T')[0]
    const txCount = i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1
    const blCount = i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1
    return {
      no: i,
      lcNo: `LC${String(i).padStart(10, '0')}`,
      transactionNo: Array.from(
        { length: txCount },
        (_, t) => `TRX${String(i * 123 + t).padStart(10, '0')}`,
      ),
      blNo: Array.from({ length: blCount }, (_, b) => `HDMUSELM${70328400 + i + b}`),
      applicationDate: formattedDate,
      applicant: companies[i % companies.length].name,
      applicantLogo: companies[i % companies.length].logo,
      negotiatingBank: banks[i % banks.length],
      issuingBank: banks[(i + 1) % banks.length],
      negotiationStatus: statuses[i % statuses.length],
    }
  })
}

const neg_rowData = ref(neg_generateDummyData())

const neg_filters = reactive({
  applicant: '',
  recipient: '',
  negotiationStatus: [],
  dateRange: getDefaultDateRange30(),
})

const neg_appliedFilters = reactive({
  applicant: '',
  recipient: '',
  negotiationStatus: [],
  dateRange: getDefaultDateRange30(),
})

const neg_filteredRowData = computed(() => {
  return neg_rowData.value.filter((row) => {
    const matchesApplicant = (row.applicant || '')
      .toLowerCase()
      .includes(neg_appliedFilters.applicant.toLowerCase())
    const matchesStatus =
      !neg_appliedFilters.negotiationStatus.length ||
      neg_appliedFilters.negotiationStatus.includes('_all') ||
      neg_appliedFilters.negotiationStatus.includes(row.negotiationStatus)
    return matchesApplicant && matchesStatus
  })
})

const neg_maxPage = computed(() =>
  Math.ceil(neg_filteredRowData.value.length / neg_itemsPerPage.value),
)

const neg_paginatedRowData = computed(() => {
  const start = (neg_page.value - 1) * neg_itemsPerPage.value
  return neg_filteredRowData.value.slice(start, start + neg_itemsPerPage.value)
})

watch(neg_itemsPerPage, () => {
  if (neg_page.value > neg_maxPage.value) neg_page.value = Math.max(1, neg_maxPage.value)
})

const neg_colDefs = ref([
  {
    field: 'no',
    headerName: '',
    width: 60,
    maxWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'lcNo',
    headerName: 'L/C No',
    width: 150,
    minWidth: 120,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'transactionNo',
    headerName: 'Transaction No',
    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'blNo',
    headerName: 'B/L No',
    width: 200,
    minWidth: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'applicationDate',
    headerName: 'Application Date',
    width: 150,
    minWidth: 130,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'applicant',
    headerName: 'Applicant',
    width: 180,
    minWidth: 150,
    flex: 1,
    cellDataType: false,
    cellRenderer: CompanyNameCellRenderer,
    cellClass: 'line-2',
    cellRendererParams: (params) => ({
      name:
        typeof params.data?.applicant === 'string'
          ? params.data.applicant
          : (params.data?.applicant?.name ?? ''),
      logo: params.data?.applicantLogo || '',
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'negotiatingBank',
    headerName: 'Negotiating Bank',
    width: 160,
    minWidth: 130,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'issuingBank',
    headerName: 'Issuing Bank',
    width: 150,
    minWidth: 130,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'negotiationStatus',
    headerName: 'Negotiation Status',
    width: 200,
    minWidth: 160,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

const neg_applyFilters = () => {
  neg_appliedFilters.applicant = neg_filters.applicant
  neg_appliedFilters.recipient = neg_filters.recipient
  neg_appliedFilters.negotiationStatus = [...neg_filters.negotiationStatus]
  neg_appliedFilters.dateRange = neg_filters.dateRange ? [...neg_filters.dateRange] : null
  neg_page.value = 1
}

const neg_resetFilters = () => {
  neg_filters.applicant = ''
  neg_filters.recipient = ''
  neg_filters.negotiationStatus = []
  neg_filters.dateRange = getDefaultDateRange30()
  neg_appliedFilters.applicant = ''
  neg_appliedFilters.recipient = ''
  neg_appliedFilters.negotiationStatus = []
  neg_appliedFilters.dateRange = getDefaultDateRange30()
  neg_page.value = 1
}

watch(
  () => neg_filters.negotiationStatus,
  (newValue, oldValue) => {
    if (!Array.isArray(newValue) || !Array.isArray(oldValue)) return
    const hasAll = newValue.includes('_all')
    const hadAll = oldValue.includes('_all')
    const allValues = neg_negotiationStatusOptions.value
      .filter((o) => o.value !== '_all')
      .map((o) => o.value)
    const allOthersSelected = allValues.every((v) => newValue.includes(v))
    if (!hadAll && hasAll) {
      neg_filters.negotiationStatus = ['_all', ...allValues]
    } else if (hasAll && !allOthersSelected) {
      neg_filters.negotiationStatus = newValue.filter((v) => v !== '_all')
    }
  },
  { deep: true },
)

const neg_onGridReady = (params) => {
  neg_gridApi.value = params.api
}

const neg_onCellClicked = (params) => {
  if (params.column.getColId() === 'lcNo') {
    neg_detailRow.value = params.data
    neg_detailOpen.value = true
  }
}

const neg_closeDetail = () => {
  neg_detailOpen.value = false
}

// =============================================
// ===== Presentation Tab (pre_ prefix) =====
// =============================================

const pre_gridApi = shallowRef(null)
const pre_detailOpen = ref(false)
const pre_rejectOpen = ref(false)
const pre_detailRow = ref(null)
const pre_rejectReason = ref('')
const pre_page = ref(1)
const pre_itemsPerPage = ref(10)

const pre_generateDummyData = () => {
  const banks = [
    'Bank Name',
    'KB Kookmin Bank',
    'Shinhan Bank',
    'Hana Bank',
    'Woori Bank',
    'NH Bank',
    'IBK Bank',
  ]
  return Array.from({ length: 100 }, (_, idx) => {
    const i = idx + 1
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = date.toISOString().split('T')[0]
    const formattedDateTime = `${formattedDate} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`
    return {
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
    }
  })
}

const pre_rowData = ref(pre_generateDummyData())

const pre_filters = reactive({
  purchaseBank: '',
  lcNo: '',
  dateRange: getDefaultDateRange1Y(),
})

const pre_appliedFilters = reactive({
  purchaseBank: '',
  lcNo: '',
  dateRange: null,
})

const pre_filteredRowData = computed(() => {
  return pre_rowData.value.filter((row) => {
    const matchesPurchaseBank = (row.purchaseBank || '')
      .toLowerCase()
      .includes(pre_appliedFilters.purchaseBank.toLowerCase())
    const matchesLcNo = (row.lcNo || '')
      .toLowerCase()
      .includes(pre_appliedFilters.lcNo.toLowerCase())
    let matchesDate = true
    if (pre_appliedFilters.dateRange?.[0] && pre_appliedFilters.dateRange?.[1]) {
      const rowDate = new Date(row.lastUpdate)
      const startDate = new Date(pre_appliedFilters.dateRange[0])
      const endDate = new Date(pre_appliedFilters.dateRange[1])
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = rowDate >= startDate && rowDate <= endDate
    }
    return matchesPurchaseBank && matchesLcNo && matchesDate
  })
})

const pre_maxPage = computed(() =>
  Math.ceil(pre_filteredRowData.value.length / pre_itemsPerPage.value),
)

const pre_paginatedRowData = computed(() => {
  const start = (pre_page.value - 1) * pre_itemsPerPage.value
  return pre_filteredRowData.value.slice(start, start + pre_itemsPerPage.value)
})

watch(pre_itemsPerPage, () => {
  if (pre_page.value > pre_maxPage.value) pre_page.value = Math.max(1, pre_maxPage.value)
})

const pre_colDefs = ref([
  {
    field: 'no',
    headerName: '',
    width: 60,
    maxWidth: 100,
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
    headerName: 'Negotiating Bank',
    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'openingBank',
    headerName: 'Issuing Bank',
    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'blNo',
    headerName: 'B/L No',
    flex: 1,
    width: 220,
    minWidth: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'lastUpdate',
    headerName: 'Request Date',
    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  // {
  //   field: 'download',
  //   headerName: 'Download',
  //   width: 120,
  //   maxWidth: 150,
  //   cellRenderer: IconBtnCellRenderer,
  //   cellRendererParams: {
  //     icon: 'ebli:download',
  //     onClick: (data) => {
  //       console.log('Download clicked for row:', data)
  //     },
  //   },
  //   headerStyle: { justifyContent: 'center' },
  //   suppressMenu: true,
  //   sortable: false,
  // },
])

const pre_applyFilters = () => {
  pre_appliedFilters.purchaseBank = pre_filters.purchaseBank
  pre_appliedFilters.lcNo = pre_filters.lcNo
  pre_appliedFilters.dateRange = pre_filters.dateRange ? [...pre_filters.dateRange] : null
  pre_page.value = 1
}

const pre_resetFilters = () => {
  pre_filters.purchaseBank = ''
  pre_filters.lcNo = ''
  pre_filters.dateRange = getDefaultDateRange1Y()
  pre_appliedFilters.purchaseBank = ''
  pre_appliedFilters.lcNo = ''
  pre_appliedFilters.dateRange = null
  pre_page.value = 1
}

const pre_onGridReady = (params) => {
  pre_gridApi.value = params.api
}

const pre_onCellClicked = (params) => {
  if (params.column.getColId() === 'lcNo') {
    pre_detailRow.value = params.data
    pre_detailOpen.value = true
  }
}

const pre_closeDetail = () => {
  pre_detailOpen.value = false
  pre_rejectOpen.value = false
  pre_rejectReason.value = ''
}

const pre_openRejectDialog = () => {
  pre_rejectOpen.value = true
}

const pre_closeRejectDialog = () => {
  pre_rejectOpen.value = false
  pre_rejectReason.value = ''
}

const pre_handleApprove = () => {
  console.log('Approved:', pre_detailRow.value)
  pre_closeDetail()
}

const pre_handleReject = () => {
  console.log('Rejected:', pre_detailRow.value, 'Reason:', pre_rejectReason.value)
  pre_closeDetail()
}
</script>
