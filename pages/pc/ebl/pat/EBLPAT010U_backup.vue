<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="cta" large @click="openAddDialog">Add Partner</EblBtn>
      </template>
    </EblPageHeader>
    <div class="ebl-card-container">
      <!-- EblSubHeader -->
      <EblSubHeader>
        <h2>total</h2>
        <span class="count">{{ formatNumber(rowData.length) }}</span>
        <template #tooltip>
          •나의 파트너 메뉴에서는 직접 등록한 파트너의 목록을 확인할 수 있습니다.<br />
          •파트너는 역할별로 구분이 가능합니다.
        </template>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters">
        <EblInput
          v-model="filters.companyName"
          clearable
          placeholder="Company Name"
          style="width: 180px"
          @keydown.enter="applyFilters"
        />
        <EblInput
          v-model="filters.dunsNo"
          clearable
          placeholder="DUNS No"
          style="width: 180px"
          @keydown.enter="applyFilters"
        />
        <EblSelect
          v-model="filters.roles"
          placeholder="Roles"
          :options="roleOptions"
          clearable
          style="width: 180px"
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
        />
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

      <!-- EBLPAT020U - Partners Dialog (Detail/Add/Modify) -->
      <EblDialog
        v-model="dialogOpen"
        transition="slide-x-reverse-transition"
        content-class="ebl-dialog ebl-dialog--multiple"
        :persistent="dialogMode !== 'detail'"
        scrollable
        @close="closeDialog"
      >
        <VCard width="480" class="ebl-dialog__card">
          <VCardTitle class="ebl-dialog__header">
            <span class="title">{{
              dialogMode === 'detail'
                ? 'Partners Detail'
                : dialogMode === 'add'
                  ? 'Add Partners'
                  : 'Modify Partners'
            }}</span>
            <VSpacer />
            <EblBtn icon pill small @click="closeDialog">
              <VIcon icon="ebli:close" :size="20" />
            </EblBtn>
          </VCardTitle>

          <!-- 읽기 전용 뷰 -->
          <VCardText v-if="dialogMode === 'detail'" class="ebl-dialog__text">
            <EblSubHeader>
              <h3>User Info</h3>
            </EblSubHeader>
            <EblInfo>
              <EblInfoItem label="MID">{{ detailRow?.mid || '-' }}</EblInfoItem>
              <EblInfoItem label="User Name">{{ detailRow?.userName || '-' }}</EblInfoItem>
              <EblInfoItem label="Phone Number">{{ detailRow?.phoneNumber || '-' }}</EblInfoItem>
              <EblInfoItem label="Fax Number">{{ detailRow?.faxNumber || '-' }}</EblInfoItem>
              <EblInfoItem label="Add Date">{{ detailRow?.addDate || '-' }}</EblInfoItem>
            </EblInfo>

            <EblSubHeader class="mt-6">
              <h3>Company Info</h3>
            </EblSubHeader>
            <EblInfo>
              <EblInfoItem label="Country">{{ detailRow?.country || '-' }}</EblInfoItem>
              <EblInfoItem label="Role">{{ detailRow?.role || '-' }}</EblInfoItem>
              <EblInfoItem label="Company Name" has-input>
                <div class="ebl-thumbs-item">
                  <div v-if="detailRow?.companyName" class="ebl-thumbs-item__avatar">
                    <img src="~/assets/images/common/ci/HMM.png" alt="Logo" />
                  </div>
                  <span class="ebl-thumbs-item__content">{{ detailRow?.companyName || '-' }}</span>
                </div>
              </EblInfoItem>
              <EblInfoItem label="DUNS Number">{{ detailRow?.dunsNumber || '-' }}</EblInfoItem>
              <EblInfoItem label="Corporation Number">{{
                detailRow?.corporationNumber || '-'
              }}</EblInfoItem>
              <EblInfoItem label="Owner">{{ detailRow?.owner || '-' }}</EblInfoItem>
              <EblInfoItem label="zip code">{{ detailRow?.zipCode || '-' }}</EblInfoItem>
              <EblInfoItem label="Spot Code">{{ detailRow?.spotCode || '-' }}</EblInfoItem>
              <EblInfoItem label="City/Region">{{ detailRow?.cityRegion || '-' }}</EblInfoItem>
              <EblInfoItem label="Address 1">{{ detailRow?.address1 || '-' }}</EblInfoItem>
              <EblInfoItem label="Address 2">{{ detailRow?.address2 || '-' }}</EblInfoItem>
              <EblInfoItem label="Company Logo">
                <div v-if="detailRow?.companyLogo" style="width: 150px; height: 100px">
                  <img :src="detailRow.companyLogo" alt="Company Logo" style="width: 100%" />
                </div>
                <span v-else>-</span>
              </EblInfoItem>
            </EblInfo>
          </VCardText>

          <!-- 편집 가능 뷰 (Add/Modify) -->
          <VCardText v-else class="ebl-dialog__text">
            <EblSubHeader>
              <h3>User Info</h3>
            </EblSubHeader>
            <EblInfo>
              <EblInfoItem label="MID" has-input>
                <EblInput
                  v-model="formData.mid"
                  placeholder="Choose MID"
                  prepend-icon="ebli:search"
                  :disabled="dialogMode === 'modify'"
                  readonly
                  @click="openPotentialDialog"
                />
              </EblInfoItem>
              <EblInfoItem label="User Name" required has-input>
                <EblInput v-model="formData.userName" placeholder="Input a User Name" />
              </EblInfoItem>
              <EblInfoItem label="Phone Number" required has-input>
                <EblInput v-model="formData.phoneNumber" placeholder="Input a Phone Number" />
              </EblInfoItem>
              <EblInfoItem label="Fax Number" has-input>
                <EblInput v-model="formData.faxNumber" placeholder="Input a Fax Number" />
              </EblInfoItem>
              <EblInfoItem label="Add Date" has-input>
                <EblInput
                  :model-value="formData.addDate || new Date().toISOString().split('T')[0]"
                  placeholder="Auto generated"
                  disabled
                />
              </EblInfoItem>
            </EblInfo>

            <EblSubHeader class="mt-6">
              <h3>Company Info</h3>
            </EblSubHeader>
            <EblInfo>
              <EblInfoItem label="Country" has-input>
                <EblInput v-model="formData.country" placeholder="MID 선택 후 자동기입" disabled />
              </EblInfoItem>
              <EblInfoItem label="Role" has-input>
                <EblInput v-model="formData.role" placeholder="MID 선택 후 자동기입" disabled />
              </EblInfoItem>
              <EblInfoItem label="Company Name" has-input>
                <EblInput
                  v-model="formData.companyName"
                  placeholder="MID 선택 후 자동기입"
                  disabled
                />
              </EblInfoItem>
              <EblInfoItem label="DUNS Number" has-input>
                <EblInput
                  v-model="formData.dunsNumber"
                  placeholder="MID 선택 후 자동기입"
                  disabled
                />
              </EblInfoItem>
              <EblInfoItem label="Corporation Number" has-input>
                <EblInput
                  v-model="formData.corporationNumber"
                  placeholder="MID 선택 후 자동기입"
                  disabled
                />
              </EblInfoItem>
              <EblInfoItem label="Owner" has-input>
                <EblInput v-model="formData.owner" placeholder="MID 선택 후 자동기입" disabled />
              </EblInfoItem>
              <EblInfoItem label="zip code" has-input>
                <EblInput v-model="formData.zipCode" placeholder="MID 선택 후 자동기입" disabled />
              </EblInfoItem>
              <EblInfoItem label="Spot Code" has-input>
                <EblInput v-model="formData.spotCode" placeholder="MID 선택 후 자동기입" disabled />
              </EblInfoItem>
              <EblInfoItem label="City/Region" has-input>
                <EblInput
                  v-model="formData.cityRegion"
                  placeholder="MID 선택 후 자동기입"
                  disabled
                />
              </EblInfoItem>
              <EblInfoItem label="Address 1" has-input>
                <EblInput v-model="formData.address1" placeholder="MID 선택 후 자동기입" disabled />
              </EblInfoItem>
              <EblInfoItem label="Address 2" has-input>
                <EblInput v-model="formData.address2" placeholder="MID 선택 후 자동기입" disabled />
              </EblInfoItem>
              <EblInfoItem label="Company Logo" has-input>
                <div v-if="formData.companyLogo" style="width: 150px">
                  <img :src="formData.companyLogo" alt="Logo" style="width: 100%" />
                </div>
              </EblInfoItem>
            </EblInfo>
          </VCardText>

          <!-- Action Buttons -->
          <VCardActions class="ebl-dialog__actions">
            <template v-if="dialogMode === 'detail'">
              <EblBtn color="danger" large @click="handleDelete">Delete</EblBtn>
              <VSpacer />
              <EblBtn color="cta" large @click="switchToModify">Modify</EblBtn>
            </template>
            <template v-else>
              <VSpacer />
              <EblBtn large @click="closeDialog">Cancel</EblBtn>
              <EblBtn color="cta" large :disabled="!canSave" @click="handleSave">Save</EblBtn>
            </template>
          </VCardActions>
        </VCard>
        <VSlideXReverseTransition>
          <VCard v-if="potentialOpen" width="1200" class="ebl-dialog__card">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">Potential Partners</span>
              <VSpacer />
              <EblBtn icon pill small @click="closePotentialDialog">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>

            <VCardText class="ebl-dialog__text">
              <EblSubHeader>
                <h2>Total</h2>
                <span class="count">{{ formatNumber(potentialData.length) }}</span>
                <template #util>
                  <EblSelect
                    v-model="potentialFilters.companyName"
                    placeholder="Company Name"
                    :options="[
                      { label: 'Company Name', value: 'Company Name' },
                      { label: 'Role', value: 'Role' },
                      { label: 'DUNS No', value: 'DUNS No' },
                      { label: 'MID', value: 'MID' },
                    ]"
                    style="width: 180px"
                  />
                  <EblInput
                    v-model="potentialFilters.search"
                    placeholder="Placeholder"
                    prepend-icon="ebli:search"
                    clearable
                    style="width: 300px"
                  />
                </template>
              </EblSubHeader>

              <!-- Potential Partners Grid -->
              <AgGridVue
                class="ebl-data-grid ag-theme-quartz"
                :row-data="potentialData"
                :column-defs="potentialColDefs"
                :dom-layout="'autoHeight'"
                :row-selection="'single'"
                @grid-ready="onPotentialGridReady"
                @selection-changed="onPotentialSelectionChanged"
              />
            </VCardText>

            <VCardActions class="ebl-dialog__actions">
              <VSpacer />
              <EblBtn large @click="closePotentialDialog">Cancel</EblBtn>
              <EblBtn
                color="cta"
                large
                :disabled="!selectedPotential"
                @click="handleSelectPotential"
                >Select</EblBtn
              >
            </VCardActions>
          </VCard>
        </VSlideXReverseTransition>
      </EblDialog>
    </div>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { useDialogStore } from '~/stores/useDialogStore'
import { AgGridVue } from 'ag-grid-vue3'
import CompanyNameCellRenderer from '~/components/grid/CompanyNameCellRenderer.vue'

const { formatNumber } = useFormat()
const dialogStore = useDialogStore()
const gridApi = shallowRef(null)
const potentialGridApi = shallowRef(null)
const dialogOpen = ref(false)
const dialogMode = ref('detail') // 'detail', 'add', 'modify'
const potentialOpen = ref(false)
const detailRow = ref(null)
const selectedPotential = ref(null)

const pageInfo = ref({
  title: 'My Partners',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Partners' }, { text: 'My Partners' }],
})

// 그리드 페이지네이션
const page = ref(1)
const itemsPerPage = ref(10)

// Role 옵션
const roleOptions = [
  { label: 'All', value: '' },
  { label: 'Shipper', value: 'Shipper' },
  { label: 'Carrier', value: 'Carrier' },
  { label: 'Bank/Nego Agent', value: 'Bank/Nego Agent' },
  { label: 'Bank', value: 'Bank' },
]

// Form Data
const formData = reactive({
  mid: '',
  userName: '',
  phoneNumber: '',
  faxNumber: '',
  addDate: '',
  country: '',
  role: '',
  companyName: '',
  dunsNumber: '',
  corporationNumber: '',
  owner: '',
  zipCode: '',
  spotCode: '',
  cityRegion: '',
  address1: '',
  address2: '',
  companyLogo: '',
})

const canSave = computed(() => {
  return formData.mid && formData.userName && formData.phoneNumber
})

// Potential Filters
const potentialFilters = reactive({
  companyName: 'Company Name',
  search: '',
})

// 더미 데이터 생성 함수
const generateDummyData = () => {
  const data = []
  const countries = ['KR', 'USA', 'CN', 'JP']
  const roles = ['Shipper', 'Carrier', 'Bank/Nego Agent', 'Bank']
  const companies = [
    'KTNETBL1',
    'CJ Logistics Corporation',
    'KEB Hana Bank',
    'Hyundai Merchant Marine Co. Ltd',
  ]
  const owners = ['Gil-Dong Hong', 'Kevin Brown', 'James Park', 'A-Yong Kim']

  for (let i = 1; i <= 100; i++) {
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = date.toISOString().split('T')[0]

    data.push({
      no: i,
      country: countries[i % countries.length],
      role: roles[i % roles.length],
      companyName: companies[i % companies.length],
      dunsNumber: 'x'.repeat(15),
      mid: `xxx@${companies[i % companies.length].toLowerCase().replace(/\s/g, '')}.com`,
      owner: owners[i % owners.length],
      phoneNumber: 'xxxxxxxxxxxx',
      addDate: formattedDate,
      userName: owners[i % owners.length],
      faxNumber: 'xxxxxxxxxxxx',
      corporationNumber: 'x'.repeat(15),
      zipCode: '12345',
      spotCode: '-',
      cityRegion: 'Seoul/Gangnam-gu',
      address1: '21, Samseong-dong',
      address2: '-',
      companyLogo: `https://i.pravatar.cc/120?img=${(i % 70) + 1}`,
    })
  }
  return data
}

const rowData = ref(generateDummyData())
const sortedRowData = computed(() => {
  return [...rowData.value].sort((a, b) => (b.no ?? 0) - (a.no ?? 0))
})

// Potential Partners 더미 데이터
const potentialData = ref([
  {
    companyName: 'KTNETBL1',
    role: 'Shipper',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@ktnet.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=21',
  },
  {
    companyName: 'CJ Logistics Corporation',
    role: 'Carrier',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@cj.com',
    companyLogo: 'https://i.pravatar.cc/120?img=22',
  },
  {
    companyName: 'KEB Hana Bank',
    role: 'Bank',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@hana.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=23',
  },
  {
    companyName: 'KTNETBL1',
    role: 'Carrier',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@ktnet.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=24',
  },
  {
    companyName: 'CJ Logistics Corporation',
    role: 'Bank',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@cj.com',
    companyLogo: 'https://i.pravatar.cc/120?img=25',
  },
  {
    companyName: 'KEB Hana Bank',
    role: 'Carrier',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@hana.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=26',
  },
  {
    companyName: 'KTNETBL1',
    role: 'Bank',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@ktnet.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=27',
  },
  {
    companyName: 'CJ Logistics Corporation',
    role: 'Shipper',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@cj.com',
    companyLogo: 'https://i.pravatar.cc/120?img=28',
  },
  {
    companyName: 'Hyundai Merchant Marine Co. Ltd',
    role: 'Carrier',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@HY.com',
    companyLogo: 'https://i.pravatar.cc/120?img=29',
  },
  {
    companyName: 'KEB Hana Bank',
    role: 'Carrier',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@hana.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=30',
  },
])

// 필터가 적용된 데이터
const filteredRowData = computed(() => {
  return sortedRowData.value.filter((row) => {
    const matchesCompanyName = (row.companyName || '')
      .toLowerCase()
      .includes(appliedFilters.companyName.toLowerCase())
    const matchesDunsNo = (row.dunsNumber || '')
      .toLowerCase()
      .includes(appliedFilters.dunsNo.toLowerCase())
    const matchesRoles = appliedFilters.roles === '' || (row.role || '') === appliedFilters.roles

    let matchesDate = true
    if (appliedFilters.dateRange && appliedFilters.dateRange[0] && appliedFilters.dateRange[1]) {
      const rowDate = new Date(row.addDate || row.date)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = rowDate >= startDate && rowDate <= endDate
    }

    return matchesCompanyName && matchesDunsNo && matchesRoles && matchesDate
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
watch([itemsPerPage, () => rowData.value.length], () => {
  if (page.value > maxPage.value) {
    page.value = Math.max(1, maxPage.value)
  }
  if (page.value < 1) {
    page.value = 1
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
    field: 'country',
    headerName: 'Country',
    width: 120,
    minWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'role',
    headerName: 'Roles',
    width: 120,
    minWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'companyName',
    headerName: 'Company Name',
    flex: 1,
    minWidth: 180,
    cellDataType: false,
    cellRenderer: CompanyNameCellRenderer,
    cellClass: 'line-2',
    cellRendererParams: (params) => ({
      name:
        typeof params.data?.companyName === 'string'
          ? params.data.companyName
          : (params.data?.companyName?.name ?? ''),
      logo: params.data?.companyLogo || params.data?.companyName?.logo || '',
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'dunsNumber',
    headerName: 'DUNS No',
    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'mid',
    headerName: 'MID',
    flex: 1,
    minWidth: 180,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'owner',
    headerName: 'Owner',
    width: 120,
    minWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'addDate',
    headerName: 'Add Date',
    width: 120,
    minWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// Potential Partners Column Definitions
const potentialColDefs = ref([
  {
    field: 'companyName',
    headerName: 'Company Name',
    flex: 1,
    minWidth: 200,
    headerStyle: { justifyContent: 'flex-start' },
    rowSelection: {
      checkboxes: true,
      headerCheckbox: false,
    },
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 200,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'dunsNumber',
    headerName: 'DUNS No',
    width: 300,
    minWidth: 200,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'mid',
    headerName: 'MID',
    flex: 1,
    minWidth: 200,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// ===== 필터 로직 =====
// 기본 날짜 범위 반환
function getDefaultDateRange() {
  return [new Date('2025-12-01'), new Date('2026-01-01')]
}

// 필터 상태 (입력용)
const filters = reactive({
  companyName: '',
  dunsNo: '',
  roles: '',
  dateRange: getDefaultDateRange(),
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  companyName: '',
  dunsNo: '',
  roles: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.companyName = filters.companyName
  appliedFilters.dunsNo = filters.dunsNo
  appliedFilters.roles = filters.roles
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  page.value = 1
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.companyName = ''
  filters.dunsNo = ''
  filters.roles = ''
  filters.dateRange = getDefaultDateRange()
  appliedFilters.companyName = ''
  appliedFilters.dunsNo = ''
  appliedFilters.roles = ''
  appliedFilters.dateRange = null
  page.value = 1
}

// AG Grid 이벤트 핸들러
const onGridReady = (params) => {
  gridApi.value = params.api
}

const onPotentialGridReady = (params) => {
  potentialGridApi.value = params.api
}

// 셀 클릭 핸들러
const onCellClicked = (params) => {
  if (params.column.getColId() === 'companyName' || params.column.getColId() === 'mid') {
    detailRow.value = params.data
    dialogMode.value = 'detail'
    dialogOpen.value = true
  }
}

const onPotentialSelectionChanged = () => {
  const selected = potentialGridApi.value?.getSelectedRows()
  selectedPotential.value = selected?.[0] || null
}

const closeDialog = () => {
  dialogOpen.value = false
  dialogMode.value = 'detail'
  detailRow.value = null
  // Reset form
  Object.keys(formData).forEach((key) => {
    formData[key] = ''
  })
}

const openAddDialog = () => {
  dialogMode.value = 'add'
  dialogOpen.value = true
}

const switchToModify = () => {
  // formData에 detailRow 데이터 복사
  Object.keys(detailRow.value).forEach((key) => {
    if (key in formData) {
      formData[key] = detailRow.value[key]
    }
  })
  dialogMode.value = 'modify'
}

const openPotentialDialog = () => {
  potentialOpen.value = true
}

const closePotentialDialog = () => {
  potentialOpen.value = false
  selectedPotential.value = null
}

const handleSelectPotential = () => {
  if (selectedPotential.value) {
    formData.mid = selectedPotential.value.mid
    formData.companyName = selectedPotential.value.companyName
    formData.role = selectedPotential.value.role
    formData.dunsNumber = selectedPotential.value.dunsNumber
    // 기타 필드들도 자동 입력되도록 설정 (더미 데이터)
    formData.country = 'KR'
    formData.corporationNumber = 'x'.repeat(15)
    formData.owner = 'Gil-Dong Hong'
    formData.zipCode = '12345'
    formData.spotCode = '-'
    formData.cityRegion = 'Seoul/Gangnam-gu'
    formData.address1 = '21, Samseong-dong'
    formData.address2 = '-'
    formData.companyLogo = selectedPotential.value.companyLogo || ''
    closePotentialDialog()
  }
}

const handleDelete = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: '경고',
    icon: 'warning',
    message: '해당 파트너를 삭제 하시겠습니까?',
    confirmText: '확인',
    cancelText: '취소',
  })

  if (!confirmed) return

  // rowData에서 해당 항목 제거
  const index = rowData.value.findIndex((row) => row.no === detailRow.value.no)
  if (index > -1) {
    rowData.value.splice(index, 1)
  }
  closeDialog()
}

const handleSave = () => {
  if (dialogMode.value === 'add') {
    // 새 항목 추가
    const newItem = {
      no: Math.max(...rowData.value.map((r) => r.no)) + 1,
      ...formData,
      addDate: new Date().toISOString().split('T')[0],
    }
    rowData.value.unshift(newItem)
    console.log('Add:', newItem)
  } else if (dialogMode.value === 'modify') {
    // 기존 항목 수정
    const index = rowData.value.findIndex((row) => row.no === detailRow.value.no)
    if (index > -1) {
      Object.keys(formData).forEach((key) => {
        rowData.value[index][key] = formData[key]
      })
    }
    console.log('Modify:', formData)
  }
  closeDialog()
}
</script>
