<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <template v-if="activeTab === 0">
          <EblBtn large color="outlined" @click="resetForm">Cancel</EblBtn>
          <EblBtn color="cta" large :disabled="!isFormChanged" @click="saveForm">Save</EblBtn>
        </template>
        <template v-else>
          <EblBtn color="cta" large @click="openAddDialog">Add User</EblBtn>
        </template>
      </template>
    </EblPageHeader>
    <div class="ebl-card-container">
      <!-- Tabs -->
      <div class="ebl-tabs-container mb-6">
        <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      </div>

      <!-- Tab Content: Activity Log -->
      <template v-if="activeTab === 0">
        <EblSubHeader class="cursor-pointer">
          <h2>Company Info</h2>
          <template #tooltip>
            •나의 회사 정보를 확인하고 수정할 수 있습니다.<br />
            •권한을 지닌 사용자에 한해 일부 항목을 수정할 수 있습니다.
          </template>
        </EblSubHeader>

        <EblInfo style="--ebl-info-label-width: 170px">
          <EblInfoItem label="Country" has-input required class="px-4">
            <EblSelect
              v-model="companyFormData.country"
              :options="countryOptions"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Role" has-input required class="px-4">
            <EblSelect v-model="companyFormData.role" :options="roleOptions" style="width: 250px" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Company Name" has-input required class="px-4">
            <EblInput
              v-model="companyFormData.companyName"
              placeholder="Company Name"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="DUNS Number" has-input required class="px-4">
            <EblInput
              v-model="companyFormData.dunsNumber"
              placeholder="DUNS Number"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Corporation Number" has-input class="px-4">
            <EblInput
              v-model="companyFormData.corporationNumber"
              placeholder="Corporation Number"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Owner" has-input required class="px-4">
            <EblInput v-model="companyFormData.owner" placeholder="Owner" style="width: 250px" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="zip code" has-input class="px-4">
            <EblInput
              v-model="companyFormData.zipCode"
              placeholder="zip Code"
              readonly
              prepend-icon="ebli:search"
              style="width: 250px"
              @click="() => console.log('zip code search')"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Spot Code" has-input class="px-4">
            <EblInput
              v-model="companyFormData.spotCode"
              placeholder="Spot Code"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="City/Region" has-input class="px-4">
            <EblInput
              v-model="companyFormData.cityRegion"
              placeholder="City/Region"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Address 1" has-input class="px-4">
            <EblInput v-model="companyFormData.address1" placeholder="Address 1" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Address 2" has-input class="px-4">
            <EblInput v-model="companyFormData.address2" placeholder="Address 2" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem
            label="Company Logo"
            :tooltip="`업로드 제약 사항\n전체 개수: 1개 , 단일 사이즈: 5MB, 전체 사이즈: 50MB, 파일 사이즈: 148*148, 파일 타입: bmp, gif, svg, png, jpg, jpeg`"
            has-input
            required
            class="px-4"
          >
            <EblFileInput
              v-model="companyFormData.logoFiles"
              accept="image/*"
              multiple
              placeholder="Click here to upload your file or drag."
              help-text="BMP, GIF, SVG, PNG, JPG, JPEG (50MB max)"
            />
          </EblInfoItem>
          <VDivider class="my-2" />
        </EblInfo>
      </template>

      <!-- Tab Content: Audit Log -->
      <template v-if="activeTab === 1">
        <EblSubHeader>
          <h2>Total</h2>
          <span class="count">{{ formatNumber(rowData.length) }}</span>
          <template #tooltip>
            •서브 사용자 메뉴에서는 등록한 서브 사용자의 목록을 확인할 수 있습니다. <br />
            •서브 사용자는 해당 사업자 소속의 유저만 등록이 가능합니다.
          </template>
        </EblSubHeader>

        <!-- 필터 영역 -->
        <div class="ebl-page-filters">
          <EblInput
            v-model="filters.subId"
            clearable
            placeholder="Sub ID"
            :style="{ width: '180px' }"
            @keydown.enter="applyFilters"
          />
          <EblInput
            v-model="filters.userName"
            clearable
            placeholder="User Name"
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

        <!-- EBLSUB060U - Users Detail & Add/Modify Dialog -->
        <EblDialog
          v-model="dialogOpen"
          transition="slide-x-reverse-transition"
          content-class="ebl-dialog ebl-dialog--multiple fill-height"
          scrollable
          @close="closeDialog"
        >
          <VCard :width="dialogMode === 'view' ? 450 : 580" class="ebl-dialog__card">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">
                {{
                  dialogMode === 'view'
                    ? 'Users Detail'
                    : dialogMode === 'add'
                      ? 'Add Users'
                      : 'Modify Users'
                }}
              </span>
              <VSpacer />
              <EblBtn icon pill small @click="closeDialog">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>

            <VCardText class="ebl-dialog__text flex-auto">
              <!-- User Info Section -->
              <EblSubHeader>
                <h3>User Info</h3>
              </EblSubHeader>
              <template v-if="dialogMode === 'view'">
                <EblInfo>
                  <EblInfoItem label="Company Name" has-input>
                    <div class="ebl-thumbs-item">
                      <div v-if="detailRow?.companyName" class="ebl-thumbs-item__avatar">
                        <img src="~/assets/images/common/ci/HMM.png" />
                      </div>
                      <span class="ebl-thumbs-item__content">{{
                        detailRow?.companyName || '-'
                      }}</span>
                    </div>
                  </EblInfoItem>
                  <EblInfoItem label="Sub ID">{{ detailRow?.subId || '-' }}</EblInfoItem>
                  <EblInfoItem label="Password" has-input>
                    <EblBtn outlined @click="showResetPasswordConfirm">Reset</EblBtn>
                  </EblInfoItem>
                  <EblInfoItem label="User Name">{{ detailRow?.userName || '-' }}</EblInfoItem>
                  <EblInfoItem label="Department">{{ detailRow?.department || '-' }}</EblInfoItem>
                  <EblInfoItem label="Class">{{ detailRow?.class || '-' }}</EblInfoItem>
                  <EblInfoItem label="Phone Number">{{
                    detailRow?.phoneNumber || '-'
                  }}</EblInfoItem>
                  <EblInfoItem label="Permission Type">{{
                    getPermissionTypeLabel(detailRow?.permissionType) || '-'
                  }}</EblInfoItem>
                  <EblInfoItem label="Add Date">{{ detailRow?.addDate || '-' }}</EblInfoItem>
                </EblInfo>
              </template>
              <template v-else>
                <EblInfo vertical>
                  <EblInfoItem label="Company Name" has-input>
                    <EblInput v-model="formData.companyName" disabled />
                  </EblInfoItem>
                  <EblInfoItem label="Sub ID" has-input required>
                    <div style="display: flex; gap: 12px; align-items: flex-start">
                      <EblInput v-model="formData.subId" placeholder="Enter Sub ID" />
                      <EblBtn outlined class="flex-shrink-0">Duplicate Check</EblBtn>
                    </div>
                  </EblInfoItem>
                  <EblInfoItem label="Password" has-input required>
                    <EblInput
                      v-model="formData.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Enter your password"
                    >
                      <template #append>
                        <EblBtn
                          :icon="showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                          small
                          color="ghost"
                          @click="showPassword = !showPassword"
                        />
                      </template>
                    </EblInput>
                    <template #hint>
                      <span class="text-caption text-muted"
                        >※ 10-12 characters, mix of at least 3 types: uppercase, lowercase, numbers,
                        or symbols.</span
                      >
                    </template>
                  </EblInfoItem>
                  <EblInfoItem label="Confirm Password" has-input required>
                    <EblInput
                      v-model="formData.confirmPassword"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Re-enter your password"
                    >
                      <template #append>
                        <EblBtn
                          :icon="showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                          small
                          color="ghost"
                          @click="showPassword = !showPassword"
                        />
                      </template>
                    </EblInput>
                  </EblInfoItem>
                  <EblInfoItem label="User Name" has-input required>
                    <EblInput v-model="formData.userName" placeholder="Enter your name" />
                  </EblInfoItem>
                  <EblInfoItem label="Department" has-input required>
                    <EblInput v-model="formData.department" placeholder="Enter Department" />
                  </EblInfoItem>
                  <EblInfoItem label="Class" has-input required>
                    <EblSelect
                      v-model="formData.class"
                      placeholder="Select"
                      block
                      :options="classOptions"
                    />
                    <EblInput
                      v-if="formData.class === 'Enter Direct'"
                      v-model="formData.classDetail"
                      placeholder="Enter Class"
                      class="mt-2"
                    />
                  </EblInfoItem>
                  <EblInfoItem label="Phone Number">
                    <EblInput v-model="formData.phoneNumber" placeholder="Enter Phone Number" />
                  </EblInfoItem>
                  <EblInfoItem label="Permission Type" has-input required>
                    <EblSelect
                      v-model="formData.permissionType"
                      placeholder="Select"
                      block
                      :options="permissionTypeOptions"
                    />
                  </EblInfoItem>
                </EblInfo>
              </template>
            </VCardText>

            <VCardActions class="ebl-dialog__actions">
              <template v-if="dialogMode === 'view'">
                <EblBtn color="danger" large @click="handleDelete">Delete</EblBtn>
                <VSpacer />
                <EblBtn color="cta" large @click="switchToModify">Modify</EblBtn>
              </template>
              <template v-else>
                <VSpacer />
                <EblBtn large @click="closeDialog">Cancel</EblBtn>
                <EblBtn color="cta" large @click="handleAddSave">{{
                  dialogMode === 'add' ? 'Save' : 'Amend'
                }}</EblBtn>
              </template>
            </VCardActions>
          </VCard>
        </EblDialog>
      </template>
    </div>
  </div>
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3'
import { useToastStore } from '~/stores/toast'
import { useDialogStore } from '~/stores/useDialogStore'
const route = useRoute()
const dialogStore = useDialogStore()
const toastStore = useToastStore()
const { formatNumber } = useFormat()

// 페이지 정보
const pageInfo = ref({
  title: 'My Company',
  breadcrumbItems: [{ text: 'Account' }, { text: 'My Company' }],
})

// 라우트 경로 또는 쿼리 파라미터에 따라 초기 탭 결정
const getInitialTab = () => {
  // 쿼리 파라미터로 tab 지정된 경우 우선 처리
  const queryTab = route.query.tab
  if (queryTab !== undefined) {
    return Number(queryTab) || 0
  }

  // 라우트 파라미터에 따라 결정 (backup)
  const screenId = route.params.screenId || ''
  return screenId.includes('050') ? 1 : 0
}

// 탭 데이터
const activeTab = ref(getInitialTab())
const tabItems = ref([
  { label: 'Company Info', value: 0 },
  { label: 'Co-worker', value: 1 },
])

// Initial form data for change detection
const initialFormData = {
  country: 'KR',
  role: 'Shipper',
  companyName: 'KTNETBL1',
  dunsNumber: 'XXXXXXXXXXXXXXXX',
  corporationNumber: '',
  owner: 'Gil-Dong Hong',
  zipCode: '12345',
  spotCode: '',
  cityRegion: 'Seoul/Gangnam-gu',
  address1: '21, Samseong-dong',
  address2: '',
  logoFiles: [],
}
const companyFormData = reactive({ ...initialFormData })

// Save 버튼 활성화 여부
const isFormChanged = computed(() => {
  return Object.keys(initialFormData).some((key) => {
    if (Array.isArray(companyFormData[key]) && Array.isArray(initialFormData[key])) {
      // Compare arrays (logoFiles)
      return (
        companyFormData[key].length !== initialFormData[key].length ||
        companyFormData[key].some((v, i) => v !== initialFormData[key][i])
      )
    }
    return companyFormData[key] !== initialFormData[key]
  })
})

// Save form
const saveForm = () => {
  // TODO: API 호출 로직
  // After save, update initialFormData
  Object.keys(initialFormData).forEach((key) => {
    if (Array.isArray(companyFormData[key])) {
      initialFormData[key] = [...companyFormData[key]]
    } else {
      initialFormData[key] = companyFormData[key]
    }
  })
  toastStore.add({
    text: 'Saved successfully.',
  })
}

// Reset form to initial values
const resetForm = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: 'Discard Changes',
    message: 'Any unsaved changes will be lost. \nDo you want to reset the fields?',
    confirmText: 'Reset',
  })
  if (confirmed) {
    Object.keys(companyFormData).forEach((key) => {
      if (Array.isArray(initialFormData[key])) {
        companyFormData[key] = [...initialFormData[key]]
      } else {
        companyFormData[key] = initialFormData[key]
      }
    })
  }
}

// ===== 필터 로직 =====
// 필터 상태 (입력용)
const filters = reactive({
  subId: '',
  userName: '',
  dateRange: null,
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  subId: '',
  userName: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.subId = filters.subId
  appliedFilters.userName = filters.userName
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  page.value = 1
}

// 그리드 페이지네이션
const page = ref(1)
const itemsPerPage = ref(10)
const gridApi = ref(null)

// 다이얼로그 상태
const dialogOpen = ref(false)
const dialogMode = ref(null) // null | 'view' | 'add' | 'modify'
const detailRow = ref(null)
const showPassword = ref(false)

// 추가/수정 폼
const formData = reactive({
  companyName: 'KTNETBL1',
  subId: '',
  password: '',
  confirmPassword: '',
  userName: '',
  department: '',
  class: '',
  classDetail: '',
  permissionType: '',
  phoneNumber: '',
})

// Class 옵션
const classOptions = [
  { label: 'Select(선택)', value: '' },
  { label: 'CEO(대표)', value: 'CEO' },
  { label: 'Senior Vice President(부사장)', value: 'Senior Vice President (부사장)' },
  { label: 'Vice President(전무)', value: 'Vice President' },
  { label: 'Senior Vice President(상무)', value: 'Senior Vice President (상무)' },
  { label: 'Director(이사)', value: 'Director' },
  { label: 'Department Head(부장)', value: 'Department Head' },
  { label: 'Senior Manager(차장)', value: 'Senior Manager' },
  { label: 'Manager(과장)', value: 'Manager' },
  { label: 'Senior Associate(대리)', value: 'Senior Associate' },
  { label: 'Junior Associate(주임)', value: 'Junior Associate' },
  { label: 'Associate(사원)', value: 'Associate' },
  { label: 'Enter Direct(직접 입력)', value: 'Enter Direct' },
]
// Permission Type 옵션
const permissionTypeOptions = [
  { label: 'Viewer (Read-only)', value: 'VIEWER' },
  { label: 'Standard (Full Access)', value: 'STANDARD' },
]

// Country 옵션
const countryOptions = ref([
  { label: 'Korea', value: 'KR' },
  { label: 'Japan', value: 'JP' },
  { label: 'China', value: 'CN' },
  { label: 'USA', value: 'US' },
  { label: 'Vietnam', value: 'VN' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Hong Kong', value: 'HK' },
  { label: 'Other', value: 'OTHER' },
])

// Role 옵션
const roleOptions = ref([
  { label: 'Shipper', value: 'Shipper' },
  { label: 'Carrier', value: 'Carrier' },
  { label: 'Bank', value: 'Bank' },
])

// 더미 데이터 생성
const generateDummyData = () => {
  const data = []
  const users = [
    {
      subId: 'no1jyy@ktnet.co.kr',
      userName: 'Andy Jung',
      department: 'Planning Department',
      class: 'Director',
    },
    {
      subId: 'KTNETHelp@ktnet.co.kr',
      userName: 'Y.P Park',
      department: 'Customer Management Team',
      class: 'Manager',
    },
    {
      subId: 'Hong446@ktnet.co.kr',
      userName: 'Gil-Dong Hong',
      department: 'Sales Department',
      class: 'Associate',
    },
    {
      subId: 'Banker123@ktnet.co.kr',
      userName: 'Y.P Park',
      department: 'Planning Department',
      class: 'Director',
    },
    {
      subId: 'no1jyy@ktnet.co.kr',
      userName: 'Andy Jung',
      department: 'Sales Department',
      class: 'Senior Associate',
    },
    {
      subId: 'KTNETHelp@ktnet.co.kr',
      userName: 'Y.P Park',
      department: 'Customer Management Team',
      class: 'Manager',
    },
    {
      subId: 'Banker123@ktnet.co.kr',
      userName: 'Gil-Dong Hong',
      department: 'Planning Department',
      class: 'Associate',
    },
    {
      subId: 'Hong446@ktnet.co.kr',
      userName: 'Andy Jung',
      department: 'Marketing Team',
      class: 'Director',
    },
    {
      subId: 'no1jyy@ktnet.co.kr',
      userName: 'Y.P Park',
      department: 'Marketing Team',
      class: 'Manager',
    },
    {
      subId: 'KTNETHelp@ktnet.co.kr',
      userName: 'Gil-Dong Hong',
      department: 'Customer Management Team',
      class: 'Senior Associate',
    },
  ]

  for (let i = 0; i < 100; i++) {
    const user = users[i % users.length]
    data.push({
      no: i + 1,
      subId: user.subId,
      userName: user.userName,
      department: user.department,
      class: user.class,
      phoneNumber: '000-0000-0000',
      addDate: '2025-09-19',
      password: 'Abcd1234!@#$',
      companyName: 'Hyundai Merchant Marine Co. Ltd',
      permissionType: permissionTypeOptions[i % permissionTypeOptions.length].value,
    })
  }
  return data
}

const rowData = ref(generateDummyData())

// 필터링된 데이터
const filteredRowData = computed(() => {
  return rowData.value.filter((row) => {
    // Sub ID 필터
    if (
      appliedFilters.subId &&
      !row.subId.toLowerCase().includes(appliedFilters.subId.toLowerCase())
    ) {
      return false
    }
    // User Name 필터
    if (
      appliedFilters.userName &&
      !row.userName.toLowerCase().includes(appliedFilters.userName.toLowerCase())
    ) {
      return false
    }
    // Date Range 필터
    if (appliedFilters.dateRange && appliedFilters.dateRange.length === 2) {
      const rowDate = new Date(row.addDate)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      if (rowDate < startDate || rowDate > endDate) {
        return false
      }
    }
    return true
  })
})

// 페이지네이션된 rowData
const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRowData.value.slice(start, end)
})

// itemsPerPage 변경 시 현재 페이지 조정
watch([itemsPerPage, () => filteredRowData.value.length], () => {
  const maxPage = Math.ceil(filteredRowData.value.length / itemsPerPage.value)
  if (page.value > maxPage) {
    page.value = Math.max(1, maxPage)
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
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'subId',
    headerName: 'Sub ID',
    minWidth: 150,
    flex: 1,
    cellRenderer: (params) => {
      return `<a class="ebl-link">${params.value}</a>`
    },
  },
  {
    field: 'userName',
    headerName: 'User Name',
    minWidth: 150,
    flex: 1,
  },
  {
    field: 'department',
    headerName: 'Department',
    minWidth: 150,
    flex: 1,
  },
  {
    field: 'class',
    headerName: 'Class',
    width: 150,
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone Number',
    width: 150,
  },
  {
    field: 'addDate',
    headerName: 'Add Date',
    width: 120,
  },
])

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.subId = ''
  filters.userName = ''
  filters.dateRange = null
  appliedFilters.subId = ''
  appliedFilters.userName = ''
  appliedFilters.dateRange = null
  page.value = 1
}

// AG Grid 이벤트 핸들러
const onGridReady = (params) => {
  gridApi.value = params.api
}

// 셀 클릭 핸들러
const onCellClicked = (params) => {
  detailRow.value = params.data
  dialogMode.value = 'view'
  dialogOpen.value = true
}

// 다이얼로그 핸들러
const closeDialog = () => {
  dialogOpen.value = false
  // dialogMode.value = null
  detailRow.value = null
  showPassword.value = false
}

const showResetPasswordConfirm = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: 'Reset Password',
    message: 'Reset password?\nA temporary password will be sent via email immediately.',
    confirmText: 'Reset',
  })
  if (confirmed) {
    toastStore.add({
      text: 'Temporary password sent via email.',
    })
  }
}

const switchToModify = () => {
  // formData에 detailRow 데이터 복사
  formData.companyName = detailRow.value?.companyName || 'KTNETBL1'
  formData.subId = detailRow.value?.subId || ''
  formData.userName = detailRow.value?.userName || ''
  formData.department = detailRow.value?.department || ''
  formData.class = detailRow.value?.class || ''
  formData.phoneNumber = detailRow.value?.phoneNumber || ''
  formData.password = detailRow.value?.password || ''
  formData.confirmPassword = ''
  showPassword.value = false
  dialogMode.value = 'modify'
}

const openAddDialog = () => {
  dialogMode.value = 'add'
  // 폼 초기화
  formData.companyName = 'KTNETBL1'
  formData.subId = ''
  formData.password = ''
  formData.confirmPassword = ''
  formData.userName = ''
  formData.department = ''
  formData.class = ''
  formData.classDetail = ''
  formData.phoneNumber = ''
  detailRow.value = null
  showPassword.value = false
  dialogOpen.value = true
}

const handleAddSave = async () => {
  if (
    !formData.subId ||
    !formData.password ||
    !formData.userName ||
    !formData.department ||
    !formData.class
  ) {
    await dialogStore.showAlert({
      title: '알림',
      icon: 'info',
      message: '필수 항목을 모두 입력해주세요.',
    })
    return
  }

  if (formData.password !== formData.confirmPassword) {
    await dialogStore.showAlert({
      title: '알림',
      icon: 'warning',
      message: '비밀번호가 일치하지 않습니다.',
    })
    return
  }

  if (dialogMode.value === 'add') {
    // 새 항목 추가
    const newItem = {
      no: Math.max(...rowData.value.map((r) => r.no)) + 1,
      subId: formData.subId,
      userName: formData.userName,
      department: formData.department,
      class: formData.classDetail || formData.class,
      phoneNumber: formData.phoneNumber || '000-0000-0000',
      addDate: new Date().toISOString().split('T')[0],
      password: formData.password,
      companyName: formData.companyName,
    }
    rowData.value.unshift(newItem)
    console.log('Add:', newItem)
  } else if (dialogMode.value === 'modify') {
    // 기존 항목 수정
    const index = rowData.value.findIndex((row) => row.no === detailRow.value.no)
    if (index > -1) {
      rowData.value[index] = {
        ...rowData.value[index],
        subId: formData.subId,
        userName: formData.userName,
        department: formData.department,
        class: formData.classDetail || formData.class,
        phoneNumber: formData.phoneNumber,
      }
    }
    console.log('Modify:', formData)
  }
  closeDialog()
}

const handleDelete = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: '경고',
    icon: 'warning',
    message: '해당 사용자를 삭제하시겠습니까?',
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

const getPermissionTypeLabel = (value) => {
  const opt = permissionTypeOptions.find((opt) => opt.value === value)
  return opt ? opt.label : value
}
</script>
