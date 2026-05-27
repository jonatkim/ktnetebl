<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn v-if="activeTab === 'routes'" color="cta" large @click="rt_openAddDialog"
          >Add Routes</EblBtn
        >
        <EblBtn v-else-if="activeTab === 'tnc'" color="cta" large @click="tnc_openAddDialog"
          >Add Terms</EblBtn
        >
        <EblBtn v-else-if="activeTab === 'signatures'" color="cta" large @click="sig_openAddDialog"
          >Add Sign</EblBtn
        >
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- 탭 -->
      <div class="ebl-tabs-container mb-6">
        <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      </div>

      <!-- ===== Routes 탭 ===== -->
      <template v-if="activeTab === 'routes'">
        <EblSubHeader>
          <h2>Total</h2>
          <span class="count">{{ formatNumber(rt_totalCount) }}</span>
          <template #tooltip>
            •출도착지 관리 메뉴에서는 등록한 출도착지의 목록을 확인할 수 있습니다.<br />
            •카테고리 선택 및 지역코드를 입력하여 등록할 수 있습니다.
          </template>
        </EblSubHeader>

        <div class="ebl-page-filters">
          <EblInput
            v-model="rt_filters.regionCode"
            clearable
            placeholder="Region Code"
            :style="{ width: '180px' }"
            @keydown.enter="rt_applyFilters"
          />
          <EblInput
            v-model="rt_filters.regionName"
            clearable
            placeholder="Region Name"
            :style="{ width: '180px' }"
            @keydown.enter="rt_applyFilters"
          />
          <EblDatePicker
            v-model="rt_filters.dateRange"
            range
            clearable
            placeholder="View Date"
            :start-date="rt_filters.dateRange?.[0]"
            :focus-start-date="true"
            style="width: 260px"
            auto-apply
          />
          <EblBtn outlined @click="rt_applyFilters">Search</EblBtn>
          <EblBtn icon="ebli:refresh" outlined @click="rt_resetFilters" />
          <div style="flex: 1" />
          <EblBtn outlined :disabled="rt_selectedRows.length === 0" @click="rt_deleteSelected"
            >Delete</EblBtn
          >
        </div>

        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="rt_paginatedRowData"
          :column-defs="rt_colDefs"
          :dom-layout="'autoHeight'"
          :row-selection="multiRowSelection"
          @grid-ready="rt_onGridReady"
          @selection-changed="rt_onSelectionChanged"
        />
        <div class="ebl-pagination--container mt-3">
          <div>
            Count
            <EblSelect
              v-model="rt_itemsPerPage"
              placeholder="Items per page"
              :options="pageSizeOptions"
              class="ml-2"
            />
          </div>
          <EblPagination
            v-model="rt_page"
            :length="Math.ceil(rt_filteredRowData.length / rt_itemsPerPage)"
            total-visible="5"
            show-first-last-page
          />
        </div>
      </template>

      <!-- ===== Terms & Conditions 탭 ===== -->
      <template v-else-if="activeTab === 'tnc'">
        <EblSubHeader>
          <h2>Total</h2>
          <span class="count">{{ formatNumber(tnc_totalCount) }}</span>
          <template #tooltip>
            •T&amp;C Mgmt 메뉴에서는 등록한 약관 목록을 확인합니다.<br />
            •약관 제목과 내용을 입력하여 등록할 수 있습니다.
          </template>
        </EblSubHeader>

        <div class="ebl-page-filters">
          <EblInput
            v-model="tnc_filters.title"
            clearable
            placeholder="Title"
            :style="{ width: '180px' }"
            @keydown.enter="tnc_applyFilters"
          />
          <EblDatePicker
            v-model="tnc_filters.dateRange"
            range
            clearable
            placeholder="View Date"
            :start-date="tnc_filters.dateRange?.[0]"
            :focus-start-date="true"
            style="width: 260px"
            auto-apply
          />
          <EblBtn outlined @click="tnc_applyFilters">Search</EblBtn>
          <EblBtn icon="ebli:refresh" outlined @click="tnc_resetFilters" />
          <div style="flex: 1" />
          <EblBtn outlined :disabled="tnc_selectedRows.length === 0" @click="tnc_deleteSelected"
            >Delete</EblBtn
          >
        </div>

        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="tnc_paginatedRowData"
          :column-defs="tnc_colDefs"
          :dom-layout="'autoHeight'"
          :row-selection="multiRowSelection"
          @grid-ready="tnc_onGridReady"
          @selection-changed="tnc_onSelectionChanged"
          @cell-clicked="tnc_onCellClicked"
        />
        <div class="ebl-pagination--container mt-3">
          <div>
            Count
            <EblSelect
              v-model="tnc_itemsPerPage"
              placeholder="Items per page"
              :options="pageSizeOptions"
              class="ml-2"
            />
          </div>
          <EblPagination
            v-model="tnc_page"
            :length="Math.ceil(tnc_filteredRowData.length / tnc_itemsPerPage)"
            total-visible="5"
            show-first-last-page
          />
        </div>
      </template>

      <!-- ===== Signatures 탭 ===== -->
      <template v-else-if="activeTab === 'signatures'">
        <EblSubHeader>
          <h2>Total</h2>
          <span class="count">{{ formatNumber(sig_totalCount) }}</span>
          <template #tooltip>
            • 서명 관리 메뉴에서는 선사의 서명 이미지를 등록 및 관리할 수 있습니다.<br />
            • BMP, GIF, SVG, PNG, JPG, JPEG 형식의 이미지 파일을 지원합니다. (50MB max)
          </template>
          <template #util>
            <EblBtn outlined :disabled="sig_selectedRows.length === 0" @click="sig_deleteSelected"
              >Delete</EblBtn
            >
          </template>
        </EblSubHeader>

        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="sig_paginatedRowData"
          :column-defs="sig_colDefs"
          :dom-layout="'autoHeight'"
          :row-selection="multiRowSelection"
          :row-height="70"
          @selection-changed="sig_onSelectionChanged"
        />
        <div class="ebl-pagination--container mt-3">
          <div>
            Count
            <EblSelect
              v-model="sig_itemsPerPage"
              placeholder="Items per page"
              :options="pageSizeOptions"
              class="ml-2"
            />
          </div>
          <EblPagination
            v-model="sig_page"
            :length="Math.ceil(sig_filteredRowData.length / sig_itemsPerPage)"
            total-visible="5"
            show-first-last-page
          />
        </div>
      </template>

      <!-- ===== Containers 탭 ===== -->
      <template v-else-if="activeTab === 'containers'">
        <EblSubHeader>
          <h2>Total</h2>
          <span class="count">{{ formatNumber(ctn_totalCount) }}</span>
          <template #tooltip>
            • 컨테이너 관리 메뉴에서는 등록한 컨테이너 코드의 목록을 확인할 수 있습니다. <br />
            • 표준 코드를 선택하여 관리할 수 있습니다.<br />
          </template>
        </EblSubHeader>

        <div class="ebl-page-filters">
          <EblInput
            v-model="ctn_filters.codeName"
            clearable
            placeholder="Code Name"
            :style="{ width: '180px' }"
            @keydown.enter="ctn_applyFilters"
          />
          <EblDatePicker
            v-model="ctn_filters.dateRange"
            range
            clearable
            placeholder="View Date"
            :start-date="ctn_filters.dateRange?.[0]"
            :focus-start-date="true"
            style="width: 260px"
            auto-apply
          />
          <EblBtn outlined @click="ctn_applyFilters">Search</EblBtn>
          <EblBtn icon="ebli:refresh" outlined @click="ctn_resetFilters" />
        </div>

        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="ctn_paginatedRowData"
          :column-defs="ctn_colDefs"
          :dom-layout="'autoHeight'"
          @grid-ready="ctn_onGridReady"
          @cell-clicked="ctn_onCellClicked"
        />
        <div class="ebl-pagination--container mt-3">
          <div>
            Count
            <EblSelect
              v-model="ctn_itemsPerPage"
              placeholder="Items per page"
              :options="pageSizeOptions"
              class="ml-2"
            />
          </div>
          <EblPagination
            v-model="ctn_page"
            :length="Math.ceil(ctn_filteredRowData.length / ctn_itemsPerPage)"
            total-visible="5"
            show-first-last-page
          />
        </div>
      </template>
    </div>

    <!-- ===== Routes: Add Dialog ===== -->
    <EblDialog
      v-model="rt_dialogOpen"
      transition="slide-x-reverse-transition"
      @close="rt_closeDialog"
    >
      <VCard width="450" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Add Departure/Arrival</span>
          <VSpacer />
          <EblBtn icon pill small @click="rt_closeDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text pr-8">
          <EblSubHeader>
            <h3>Departure</h3>
          </EblSubHeader>
          <EblInfo>
            <EblInfoItem label="Region Code" has-input>
              <EblInput
                v-model="rt_formData.departure.regionCode"
                placeholder="KRPUS"
                prepend-icon="ebli:search"
                :error-message="rt_errors.departureRegionCode"
                @click:prepend="rt_searchRegionCode('departure')"
                @input="rt_handleDepartureInput"
              />
            </EblInfoItem>
            <EblInfoItem label="Region Name" has-input>
              <EblInput
                v-model="rt_formData.departure.regionName"
                placeholder="BUSAN, KOREA"
                readonly
              />
            </EblInfoItem>
          </EblInfo>

          <VDivider class="my-6" />

          <EblSubHeader>
            <h3>Arrival</h3>
          </EblSubHeader>
          <EblInfo>
            <EblInfoItem label="Region Code" has-input>
              <EblInput
                v-model="rt_formData.arrival.regionCode"
                placeholder="KRSEL"
                prepend-icon="ebli:search"
                :error-message="rt_errors.arrivalRegionCode"
                @click:prepend="rt_searchRegionCode('arrival')"
                @input="rt_handleArrivalInput"
              />
            </EblInfoItem>
            <EblInfoItem label="Region Name" has-input>
              <EblInput
                v-model="rt_formData.arrival.regionName"
                placeholder="SEOUL, KOREA"
                readonly
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="rt_closeDialog">Cancel</EblBtn>
          <EblBtn color="cta" large @click="rt_saveData">Save</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>

    <!-- ===== T&C: Add/Edit Dialog ===== -->
    <EblDialog
      v-model="tnc_dialogOpen"
      transition="slide-x-reverse-transition"
      @close="tnc_closeDialog"
    >
      <VCard width="640" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">{{ tnc_isEditMode ? 'Edit T&amp;C' : 'Add T&amp;C' }}</span>
          <VSpacer />
          <EblBtn icon pill small @click="tnc_closeDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblInfo vertical>
            <EblInfoItem label="T&amp;C Order" has-input>
              <EblSelect
                v-model="tnc_formData.order"
                placeholder="Select T&C Order"
                :options="tnc_orderOptions"
                :error-message="tnc_errors.order"
                block
                @update:model-value="tnc_errors.order = ''"
              />
            </EblInfoItem>
            <EblInfoItem label="T&amp;C Title" has-input>
              <EblInput
                v-model="tnc_formData.title"
                placeholder="Input a T&C Title"
                :error-message="tnc_errors.title"
                @input="tnc_errors.title = ''"
              />
            </EblInfoItem>
            <EblInfoItem label="T&amp;C Message" has-input>
              <EblTextarea
                v-model="tnc_formData.message"
                placeholder="Input a T&C Message"
                :error-message="tnc_errors.message"
                :maxlength="500"
                counter
                @input="tnc_errors.message = ''"
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="tnc_closeDialog">Cancel</EblBtn>
          <EblBtn color="cta" large @click="tnc_saveData">Save</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>

    <!-- ===== Signatures: Add Dialog ===== -->
    <EblDialog
      v-model="sig_dialogOpen"
      transition="slide-x-reverse-transition"
      @close="sig_closeDialog"
    >
      <VCard width="520" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Add Sign</span>
          <VSpacer />
          <EblBtn icon pill small @click="sig_closeDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblInfo vertical>
            <EblInfoItem label="Signature" has-input required>
              <EblFileInput
                v-model="sig_formData.files"
                accept="image/*"
                placeholder="Click here to upload your file or drag."
                help-text="BMP, GIF, SVG, PNG, JPG, JPEG (50MB max)"
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="sig_closeDialog">Cancel</EblBtn>
          <EblBtn color="cta" large :disabled="!sig_formData.files.length" @click="sig_saveSign"
            >Save</EblBtn
          >
        </VCardActions>
      </VCard>
    </EblDialog>

    <!-- ===== Containers: Edit Dialog ===== -->
    <EblDialog
      v-model="ctn_editDialogOpen"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog"
      @close="ctn_closeEditDialog"
    >
      <VCard width="520" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Modify Container Type</span>
          <VSpacer />
          <EblBtn icon pill small @click="ctn_closeEditDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblInfo style="--ebl-info-label-width: 170px">
            <EblInfoItem label="Current Container Type" has-input>
              <EblInput v-model="ctn_editForm.currentType" readonly />
            </EblInfoItem>
            <EblInfoItem label="New Container Type" has-input>
              <EblInput v-model="ctn_editForm.newType" placeholder="Placeholder" />
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="ctn_closeEditDialog">Cancel</EblBtn>
          <EblBtn
            color="cta"
            large
            :disabled="!ctn_editForm.newType.trim()"
            @click="ctn_saveEditDialog"
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
import CodeNameCellRenderer from '~/components/grid/CodeNameCellRenderer.vue'
import ThumbsCellRenderer from '~/components/grid/ThumbsCellRenderer.vue'

definePageMeta({ layout: 'default' })

const { formatNumber } = useFormat()
const toastStore = useToastStore()

// ============================================================================
// PAGE INFO & TABS
// ============================================================================
const pageInfo = {
  title: 'Carrier Management',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Management' }, { text: 'Carrier Management' }],
}

const activeTab = ref('routes')
const tabItems = [
  { label: 'Routes', value: 'routes' },
  { label: 'Terms & Conditions', value: 'tnc' },
  { label: 'Signatures', value: 'signatures' },
  { label: 'Containers', value: 'containers' },
]

// ============================================================================
// SHARED
// ============================================================================
const pageSizeOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
]

const multiRowSelection = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
}

// ============================================================================
// ===== ROUTES (EBLCST010U) =====
// ============================================================================
const rt_gridApi = ref(null)
const rt_page = ref(1)
const rt_itemsPerPage = ref(10)
const rt_selectedRows = ref([])
const rt_dialogOpen = ref(false)

const rt_formData = ref({
  departure: { regionCode: '', regionName: '' },
  arrival: { regionCode: '', regionName: '' },
})

const rt_errors = ref({
  departureRegionCode: '',
  arrivalRegionCode: '',
})

const rt_regionData = [
  { code: 'KRPUS', name: 'BUSAN, KOREA' },
  { code: 'KRSEL', name: 'SEOUL, KOREA' },
  { code: 'USBOS', name: 'BOSTON, MA' },
  { code: 'USNYC', name: 'NEW YORK, NY' },
  { code: 'JPTYO', name: 'TOKYO, JAPAN' },
  { code: 'CNSHA', name: 'SHANGHAI, CHINA' },
]

const rt_rowData = ref([
  {
    departureCode: 'KRPUS',
    departureName: 'BUSAN, KOREA',
    arrivalCode: 'KRSEL',
    arrivalName: 'SEOUL, KOREA',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-09-19 15:30:20',
  },
  {
    departureCode: 'KRPUS',
    departureName: 'BUSAN, KOREA',
    arrivalCode: 'USBOS',
    arrivalName: 'BOSTON, MA',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-08-20 09:09:09',
  },
])

for (let i = 3; i <= 50; i++) {
  rt_rowData.value.push({
    departureCode: 'KRPUS',
    departureName: 'BUSAN, KOREA',
    arrivalCode: 'KRSEL',
    arrivalName: 'SEOUL, KOREA',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-09-19 15:30:20',
  })
}

const rt_filters = ref({ regionCode: '', regionName: '', dateRange: null })
const rt_appliedFilters = ref({ regionCode: '', regionName: '', dateRange: null })

const rt_colDefs = ref([
  {
    headerName: '',
    width: 60,
    cellClass: 'text-center',
    valueGetter: (params) =>
      rt_filteredRowData.value.length -
      ((rt_page.value - 1) * rt_itemsPerPage.value + params.node.rowIndex),
  },
  {
    headerName: 'Departure',
    field: 'departure',
    flex: 1,
    minWidth: 200,
    cellRenderer: CodeNameCellRenderer,
    cellRendererParams: { codeField: 'departureCode', nameField: 'departureName' },
    autoHeight: true,
  },
  {
    headerName: 'Arrival',
    field: 'arrival',
    flex: 1,
    minWidth: 200,
    cellRenderer: CodeNameCellRenderer,
    cellRendererParams: { codeField: 'arrivalCode', nameField: 'arrivalName' },
    autoHeight: true,
  },
  { headerName: 'Creator', field: 'creator', width: 180 },
  { headerName: 'Add Date', field: 'addDate', width: 180 },
])

const rt_totalCount = computed(() => rt_filteredRowData.value.length)

const rt_filteredRowData = computed(() => {
  let filtered = [...rt_rowData.value]
  if (rt_appliedFilters.value.regionCode) {
    const t = rt_appliedFilters.value.regionCode.toLowerCase()
    filtered = filtered.filter(
      (r) => r.departureCode.toLowerCase().includes(t) || r.arrivalCode.toLowerCase().includes(t),
    )
  }
  if (rt_appliedFilters.value.regionName) {
    const t = rt_appliedFilters.value.regionName.toLowerCase()
    filtered = filtered.filter(
      (r) => r.departureName.toLowerCase().includes(t) || r.arrivalName.toLowerCase().includes(t),
    )
  }
  if (rt_appliedFilters.value.dateRange?.length === 2) {
    const [s, e] = rt_appliedFilters.value.dateRange
    filtered = filtered.filter((r) => {
      const d = new Date(r.addDate)
      return d >= new Date(s) && d <= new Date(e)
    })
  }
  return filtered
})

const rt_paginatedRowData = computed(() => {
  const start = (rt_page.value - 1) * rt_itemsPerPage.value
  return rt_filteredRowData.value.slice(start, start + rt_itemsPerPage.value)
})

const rt_applyFilters = () => {
  rt_appliedFilters.value = {
    regionCode: rt_filters.value.regionCode,
    regionName: rt_filters.value.regionName,
    dateRange: rt_filters.value.dateRange ? [...rt_filters.value.dateRange] : null,
  }
  rt_page.value = 1
}

const rt_resetFilters = () => {
  rt_filters.value = { regionCode: '', regionName: '', dateRange: null }
  rt_appliedFilters.value = { regionCode: '', regionName: '', dateRange: null }
  rt_page.value = 1
}

const rt_onGridReady = (params) => {
  rt_gridApi.value = params.api
}

const rt_onSelectionChanged = () => {
  rt_selectedRows.value = rt_gridApi.value.getSelectedRows()
}

const rt_openAddDialog = () => {
  rt_formData.value = {
    departure: { regionCode: '', regionName: '' },
    arrival: { regionCode: '', regionName: '' },
  }
  rt_errors.value = { departureRegionCode: '', arrivalRegionCode: '' }
  rt_dialogOpen.value = true
}

const rt_closeDialog = () => {
  rt_dialogOpen.value = false
  rt_errors.value = { departureRegionCode: '', arrivalRegionCode: '' }
}

const rt_searchRegion = (type) => {
  const code =
    type === 'departure'
      ? rt_formData.value.departure.regionCode
      : rt_formData.value.arrival.regionCode
  const region = rt_regionData.find((r) => r.code.toUpperCase() === code.toUpperCase())
  if (type === 'departure') {
    rt_formData.value.departure.regionName = region?.name ?? ''
  } else {
    rt_formData.value.arrival.regionName = region?.name ?? ''
  }
}

const rt_handleDepartureInput = () => {
  rt_errors.value.departureRegionCode = ''
  rt_searchRegion('departure')
}

const rt_handleArrivalInput = () => {
  rt_errors.value.arrivalRegionCode = ''
  rt_searchRegion('arrival')
}

const rt_searchRegionCode = (type) => {
  console.log('Search region code for:', type)
}

const rt_saveData = () => {
  rt_errors.value = { departureRegionCode: '', arrivalRegionCode: '' }
  let hasError = false
  if (!rt_formData.value.departure.regionCode) {
    rt_errors.value.departureRegionCode = '필수 항목을 입력해 주세요.'
    hasError = true
  }
  if (!rt_formData.value.arrival.regionCode) {
    rt_errors.value.arrivalRegionCode = '필수 항목을 입력해 주세요.'
    hasError = true
  }
  if (hasError) return
  rt_rowData.value.unshift({
    departureCode: rt_formData.value.departure.regionCode,
    departureName: rt_formData.value.departure.regionName,
    arrivalCode: rt_formData.value.arrival.regionCode,
    arrivalName: rt_formData.value.arrival.regionName,
    creator: 'xxx@ktnet.co.kr',
    addDate: new Date().toLocaleString('ko-KR'),
  })
  rt_closeDialog()
}

const rt_deleteSelected = () => {
  if (!rt_selectedRows.value.length) return
  rt_selectedRows.value.forEach((sel) => {
    const idx = rt_rowData.value.findIndex(
      (r) =>
        r.departureCode === sel.departureCode &&
        r.arrivalCode === sel.arrivalCode &&
        r.addDate === sel.addDate,
    )
    if (idx !== -1) rt_rowData.value.splice(idx, 1)
  })
  rt_selectedRows.value = []
}

// ============================================================================
// ===== TERMS & CONDITIONS (EBLCST020U) =====
// ============================================================================
const tnc_gridApi = ref(null)
const tnc_page = ref(1)
const tnc_itemsPerPage = ref(10)
const tnc_selectedRows = ref([])
const tnc_dialogOpen = ref(false)
const tnc_isEditMode = ref(false)
const tnc_originalOrder = ref(null)

const tnc_formData = ref({ order: null, title: '', message: '' })
const tnc_errors = ref({ order: '', title: '', message: '' })

const tnc_rowData = ref([
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
      'The carrier and ship shall not be liable for any loss or damage unless suit is brought within one year of delivery.',
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
    message: 'General Average shall be adjusted according to the York-Antwerp Rules.',
    creator: 'manager@ktnet.co.kr',
    addDate: '2025-07-10 15:45:20',
  },
  {
    order: 2,
    title: 'NOTICE OF LOSS OR DAMAGE',
    message:
      'Notice of loss or damage must be given in writing to the carrier before or at the time of removal of the goods.',
    creator: 'admin@ktnet.co.kr',
    addDate: '2025-07-05 08:20:00',
  },
  {
    order: 1,
    title: 'ACCEPTANCE OF BILL OF LADING',
    message:
      'The shipper accepts this Bill of Lading with all its terms and conditions as set forth herein.',
    creator: 'manager@ktnet.co.kr',
    addDate: '2025-06-30 12:00:30',
  },
])

const tnc_filters = ref({ title: '', dateRange: null })
const tnc_appliedFilters = ref({ title: '', dateRange: null })

const tnc_orderOptions = computed(() =>
  Array.from({ length: tnc_rowData.value.length + 1 }, (_, i) => ({
    label: String(i + 1),
    value: i + 1,
  })),
)

const tnc_colDefs = ref([
  { headerName: 'Order', field: 'order', width: 80, cellClass: 'text-center' },
  { headerName: 'Title', field: 'title', flex: 1, minWidth: 200 },
  {
    headerName: 'Message',
    field: 'message',
    flex: 1,
    minWidth: 250,
    wrapText: true,
    autoHeight: true,
    cellClass: 'ebl-ellipsis-2',
  },
  { headerName: 'Creator', field: 'creator', width: 180 },
  { headerName: 'Add Date', field: 'addDate', width: 180 },
])

const tnc_totalCount = computed(() => tnc_filteredRowData.value.length)

const tnc_filteredRowData = computed(() => {
  let filtered = [...tnc_rowData.value]
  if (tnc_appliedFilters.value.title) {
    const t = tnc_appliedFilters.value.title.toLowerCase()
    filtered = filtered.filter(
      (r) => r.title.toLowerCase().includes(t) || r.message.toLowerCase().includes(t),
    )
  }
  if (tnc_appliedFilters.value.dateRange?.length === 2) {
    const [s, e] = tnc_appliedFilters.value.dateRange
    filtered = filtered.filter((r) => {
      const d = new Date(r.addDate)
      return d >= new Date(s) && d <= new Date(e)
    })
  }
  return filtered
})

const tnc_paginatedRowData = computed(() => {
  const start = (tnc_page.value - 1) * tnc_itemsPerPage.value
  return tnc_filteredRowData.value.slice(start, start + tnc_itemsPerPage.value)
})

const tnc_applyFilters = () => {
  tnc_appliedFilters.value = {
    title: tnc_filters.value.title,
    dateRange: tnc_filters.value.dateRange ? [...tnc_filters.value.dateRange] : null,
  }
  tnc_page.value = 1
}

const tnc_resetFilters = () => {
  tnc_filters.value = { title: '', dateRange: null }
  tnc_appliedFilters.value = { title: '', dateRange: null }
  tnc_page.value = 1
}

const tnc_onGridReady = (params) => {
  tnc_gridApi.value = params.api
}

const tnc_onSelectionChanged = () => {
  tnc_selectedRows.value = tnc_gridApi.value.getSelectedRows()
}

const tnc_onCellClicked = (params) => {
  if (!params.data || params.colDef.field === undefined) return
  if (params.column.colId !== '0') tnc_editRow(params.data)
}

const tnc_openAddDialog = () => {
  tnc_isEditMode.value = false
  const maxOrder = Math.max(...tnc_rowData.value.map((r) => r.order), 0)
  tnc_formData.value = { order: maxOrder + 1, title: '', message: '' }
  tnc_errors.value = { order: '', title: '', message: '' }
  tnc_dialogOpen.value = true
}

const tnc_editRow = (row) => {
  tnc_isEditMode.value = true
  tnc_originalOrder.value = row.order
  tnc_formData.value = { order: row.order, title: row.title, message: row.message }
  tnc_errors.value = { order: '', title: '', message: '' }
  tnc_dialogOpen.value = true
}

const tnc_closeDialog = () => {
  tnc_dialogOpen.value = false
  tnc_originalOrder.value = null
  tnc_errors.value = { order: '', title: '', message: '' }
}

const tnc_saveData = () => {
  tnc_errors.value = { order: '', title: '', message: '' }
  let hasError = false
  if (!tnc_formData.value.order) {
    tnc_errors.value.order = '필수 항목을 입력해 주세요.'
    hasError = true
  }
  if (!tnc_formData.value.title) {
    tnc_errors.value.title = '필수 항목을 입력해 주세요.'
    hasError = true
  }
  if (!tnc_formData.value.message) {
    tnc_errors.value.message = '필수 항목을 입력해 주세요.'
    hasError = true
  }
  if (hasError) return

  if (tnc_isEditMode.value) {
    const newOrder = tnc_formData.value.order
    const oldOrder = tnc_originalOrder.value
    if (oldOrder !== newOrder) {
      if (newOrder < oldOrder) {
        tnc_rowData.value.forEach((r) => {
          if (r.order >= newOrder && r.order < oldOrder) r.order += 1
        })
      } else {
        tnc_rowData.value.forEach((r) => {
          if (r.order > oldOrder && r.order <= newOrder) r.order -= 1
        })
      }
    }
    const idx = tnc_rowData.value.findIndex((r) => r.order === oldOrder)
    if (idx !== -1) {
      tnc_rowData.value[idx] = {
        ...tnc_formData.value,
        creator: tnc_rowData.value[idx].creator,
        addDate: tnc_rowData.value[idx].addDate,
      }
    }
  } else {
    tnc_rowData.value.unshift({
      ...tnc_formData.value,
      creator: 'xxx@ktnet.co.kr',
      addDate: new Date().toLocaleString('ko-KR'),
    })
  }
  tnc_closeDialog()
}

const tnc_deleteSelected = () => {
  if (!tnc_selectedRows.value.length) return
  tnc_selectedRows.value.forEach((sel) => {
    const idx = tnc_rowData.value.findIndex((r) => r.order === sel.order)
    if (idx !== -1) tnc_rowData.value.splice(idx, 1)
  })
  tnc_selectedRows.value = []
  tnc_rowData.value.sort((a, b) => b.order - a.order)
  tnc_rowData.value.forEach((r, i) => {
    r.order = tnc_rowData.value.length - i
  })
}

// ============================================================================
// ===== SIGNATURES (EBLCST040U) =====
// ============================================================================
const sig_page = ref(1)
const sig_itemsPerPage = ref(10)
const sig_selectedRows = ref([])
const sig_dialogOpen = ref(false)
const sig_signPreview = ref(null)

const sig_formData = ref({ files: [] })

const sig_rowData = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    fileName: 'file name.png',
    fileSize: '100 KB',
    creator: 'xxx@ktnet.co.kr',
    addDate: '2025-09-19 13:30:20',
    thumbImage: `https://i.pravatar.cc/150?img=${(i + 1) % 20}`,
  })),
)

const sig_colDefs = ref([
  {
    headerName: '',
    width: 60,
    valueGetter: (params) => params.node.rowIndex + 1,
    cellClass: 'text-center',
    cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  },
  {
    headerName: 'Sign',
    field: 'thumbImage',
    flex: 1,
    cellRenderer: ThumbsCellRenderer,
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
  {
    headerName: 'Volume',
    field: 'fileSize',
    width: 150,
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
  {
    headerName: 'Creator',
    field: 'creator',
    width: 200,
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
  {
    headerName: 'Add Date',
    field: 'addDate',
    width: 200,
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
])

const sig_totalCount = computed(() => sig_rowData.value.length)

const sig_filteredRowData = computed(() =>
  [...sig_rowData.value].sort((a, b) => new Date(b.addDate) - new Date(a.addDate)),
)

const sig_paginatedRowData = computed(() => {
  const start = (sig_page.value - 1) * sig_itemsPerPage.value
  return sig_filteredRowData.value.slice(start, start + sig_itemsPerPage.value)
})

const sig_onSelectionChanged = (event) => {
  sig_selectedRows.value = event.api.getSelectedRows()
}

const sig_openAddDialog = () => {
  sig_formData.value.files = []
  sig_signPreview.value = null
  sig_dialogOpen.value = true
}

const sig_closeDialog = () => {
  sig_dialogOpen.value = false
  sig_formData.value.files = []
  sig_signPreview.value = null
}

const sig_formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const sig_saveSign = () => {
  if (!sig_formData.value.files?.length) return
  const file = sig_formData.value.files[0]
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  sig_rowData.value.unshift({
    id: sig_rowData.value.length + 1,
    fileName: file.name,
    fileSize: sig_formatFileSize(file.size),
    creator: 'xxx@ktnet.co.kr',
    addDate: formattedDate,
    thumbImage: sig_signPreview.value,
  })
  sig_closeDialog()
}

const sig_deleteSelected = () => {
  if (!sig_selectedRows.value.length) return
  const ids = sig_selectedRows.value.map((r) => r.id)
  sig_rowData.value = sig_rowData.value.filter((r) => !ids.includes(r.id))
  sig_selectedRows.value = []
}

watch(
  () => sig_formData.value.files,
  (newFiles) => {
    if (newFiles?.length > 0 && newFiles[0].type?.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        sig_signPreview.value = e.target?.result
      }
      reader.readAsDataURL(newFiles[0])
    } else {
      sig_signPreview.value = null
    }
  },
  { deep: true },
)

// ============================================================================
// ===== CONTAINERS (EBLCST070U) =====
// ============================================================================
const ctn_gridApi = ref(null)
const ctn_page = ref(1)
const ctn_itemsPerPage = ref(10)
const ctn_editDialogOpen = ref(false)
const ctn_selectedRowNo = ref(null)
const ctn_editForm = ref({ currentType: '', newType: '' })

const ctn_containerTypeOptions = ['20FP', '40FP', '20GP', '40GP', '40HC', '45HC']

const ctn_generateDummyData = () => {
  const codeNames = ['20피트 컨테이너', '컨테이너 코드명', '공동코드 번호', '컨테이너 코드명']
  const creators = ['xxx@ktnet.co.kr', 'admin@ktnet.co.kr', 'user@ktnet.co.kr']
  const pad = (n) => String(n).padStart(2, '0')
  return Array.from({ length: 100 }, (_, idx) => {
    const i = idx + 1
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 365))
    return {
      no: i,
      containerType: i <= 10 ? ctn_containerTypeOptions[i % ctn_containerTypeOptions.length] : '',
      code: i <= 20 ? '22GP 번호' : '',
      codeName: codeNames[i % codeNames.length],
      creator: creators[i % creators.length],
      addDate: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
    }
  })
}

const ctn_rowData = ref(ctn_generateDummyData())
const ctn_filters = ref({ codeName: '', dateRange: null })
const ctn_appliedFilters = ref({ codeName: '', dateRange: null })

const ctn_colDefs = ref([
  { headerName: '', field: 'no', width: 60, cellStyle: { justifyContent: 'center' } },
  {
    headerName: 'Container Type',
    field: 'containerType',
    width: 200,
    cellStyle: { cursor: 'pointer' },
    cellClass: 'ag-link',
  },
  { headerName: 'Code', field: 'code', width: 180 },
  { headerName: 'Code Name', field: 'codeName', flex: 1 },
  { headerName: 'Creator', field: 'creator', width: 200 },
  { headerName: 'Add Date', field: 'addDate', width: 200 },
])

const ctn_totalCount = computed(() => ctn_rowData.value.length)

const ctn_filteredRowData = computed(() => {
  let filtered = [...ctn_rowData.value]
  if (ctn_appliedFilters.value.codeName) {
    const t = ctn_appliedFilters.value.codeName.toLowerCase()
    filtered = filtered.filter((r) => r.codeName.toLowerCase().includes(t))
  }
  if (ctn_appliedFilters.value.dateRange?.length === 2) {
    const [s, e] = ctn_appliedFilters.value.dateRange
    filtered = filtered.filter((r) => {
      const d = new Date(r.addDate)
      return d >= new Date(s) && d <= new Date(e)
    })
  }
  return filtered
})

const ctn_paginatedRowData = computed(() => {
  const start = (ctn_page.value - 1) * ctn_itemsPerPage.value
  return ctn_filteredRowData.value.slice(start, start + ctn_itemsPerPage.value)
})

const ctn_applyFilters = () => {
  ctn_appliedFilters.value = {
    codeName: ctn_filters.value.codeName,
    dateRange: ctn_filters.value.dateRange ? [...ctn_filters.value.dateRange] : null,
  }
  ctn_page.value = 1
}

const ctn_resetFilters = () => {
  ctn_filters.value = { codeName: '', dateRange: null }
  ctn_appliedFilters.value = { codeName: '', dateRange: null }
  ctn_page.value = 1
}

const ctn_onGridReady = (params) => {
  ctn_gridApi.value = params.api
}

const ctn_onCellClicked = (event) => {
  if (!event.data || event.column.colId === '0') return
  ctn_selectedRowNo.value = event.data.no
  ctn_editForm.value.currentType = event.data.containerType || ''
  ctn_editForm.value.newType = ''
  ctn_editDialogOpen.value = true
}

const ctn_closeEditDialog = () => {
  ctn_editDialogOpen.value = false
  ctn_selectedRowNo.value = null
  ctn_editForm.value = { currentType: '', newType: '' }
}

const ctn_saveEditDialog = () => {
  const newType = ctn_editForm.value.newType.trim()
  if (!newType || ctn_selectedRowNo.value == null) return
  const target = ctn_rowData.value.find((r) => r.no === ctn_selectedRowNo.value)
  if (!target) {
    ctn_closeEditDialog()
    return
  }
  if (target.containerType !== newType) {
    target.containerType = newType
    toastStore.add({ text: 'Container type updated successfully!', color: 'success' })
  }
  ctn_closeEditDialog()
}

// ============================================================================
// WATCHERS
// ============================================================================
watch([rt_itemsPerPage, () => rt_rowData.value.length], () => {
  const max = Math.ceil(rt_filteredRowData.value.length / rt_itemsPerPage.value)
  if (rt_page.value > max && max > 0) rt_page.value = max
  else if (rt_page.value < 1) rt_page.value = 1
})

watch([tnc_itemsPerPage, () => tnc_rowData.value.length], () => {
  const max = Math.ceil(tnc_filteredRowData.value.length / tnc_itemsPerPage.value)
  if (tnc_page.value > max && max > 0) tnc_page.value = max
  else if (tnc_page.value < 1) tnc_page.value = 1
})

watch([sig_itemsPerPage, () => sig_rowData.value.length], () => {
  const max = Math.ceil(sig_filteredRowData.value.length / sig_itemsPerPage.value)
  if (sig_page.value > max && max > 0) sig_page.value = max
  else if (sig_page.value < 1) sig_page.value = 1
})

watch([ctn_itemsPerPage, () => ctn_rowData.value.length], () => {
  const max = Math.ceil(ctn_filteredRowData.value.length / ctn_itemsPerPage.value)
  if (ctn_page.value > max && max > 0) ctn_page.value = max
  else if (ctn_page.value < 1) ctn_page.value = 1
})
</script>

<style scoped></style>
