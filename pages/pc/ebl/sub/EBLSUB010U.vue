<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="cta" large @click="openAddDialog">Add User</EblBtn>
      </template>
    </EblPageHeader>
    <div class="ebl-card-container">
      <!-- EblSubHeader -->
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
        content-class="ebl-dialog ebl-dialog--multiple"
        scrollable
        :persistent="passwordOpen"
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
                  <div class="ebl-btn-item">
                    <span class="ebl-file-item__name">{{
                      detailRow?.password ? 'x'.repeat(detailRow.password.length) : '-'
                    }}</span>
                    <EblBtn outlined @click="openPasswordDialog">Change</EblBtn>
                  </div>
                </EblInfoItem>
                <EblInfoItem label="User Name">{{ detailRow?.userName || '-' }}</EblInfoItem>
                <EblInfoItem label="Department">{{ detailRow?.department || '-' }}</EblInfoItem>
                <EblInfoItem label="Class">{{ detailRow?.class || '-' }}</EblInfoItem>
                <EblInfoItem label="Phone Number">{{ detailRow?.phoneNumber || '-' }}</EblInfoItem>
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
                    type="password"
                    placeholder="Enter your password"
                  />
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
                    type="password"
                    placeholder="Re-enter your password"
                  />
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
              </EblInfo>
            </template>

            <VDivider class="my-6" />

            <!-- User Authority Section -->
            <EblSubHeader>
              <h3>User Authority</h3>
            </EblSubHeader>
            <template v-if="dialogMode === 'view'">
              <ul class="ebl-tree-list">
                <template v-for="section in authorityData" :key="section.title">
                  <!-- Section (depth-1) -->
                  <li class="ebl-tree-list__item ebl-tree-list__item--depth-1">
                    <VIcon icon="ebli:arrow-bottom" :size="20" />
                    <span>{{ section.title }}</span>
                  </li>
                  <!-- Section children (depth-2 & 3) -->
                  <template v-for="child in section.children" :key="child.name">
                    <li class="ebl-tree-list__item ebl-tree-list__item--depth-2">
                      <VIcon v-if="child.children?.length" icon="ebli:arrow-bottom" :size="20" />
                      <span>{{ child.name }}</span>
                      <VSpacer />
                      <EblBadge :color="getBadgeColor(child.type, child.value)" variant="tonal">{{
                        child.type
                      }}</EblBadge>
                    </li>
                    <!-- Grandchildren (depth-3) -->
                    <template v-if="child.children?.length">
                      <li
                        v-for="grandchild in child.children"
                        :key="grandchild.name"
                        class="ebl-tree-list__item ebl-tree-list__item--depth-3"
                      >
                        <span>{{ grandchild.name }}</span>
                        <VSpacer />
                        <EblBadge
                          :color="getBadgeColor(grandchild.type, grandchild.value)"
                          variant="tonal"
                          >{{ grandchild.type }}</EblBadge
                        >
                      </li>
                    </template>
                  </template>
                </template>
              </ul>
            </template>
            <template v-else>
              <ul class="ebl-tree-list">
                <template v-for="section in authorityData" :key="section.title">
                  <!-- Section (depth-1) -->
                  <li class="ebl-tree-list__item ebl-tree-list__item--depth-1">
                    <VIcon icon="ebli:arrow-bottom" :size="20" />
                    <span>{{ section.title }}</span>
                  </li>
                  <!-- Section children (depth-2 & 3) with switches -->
                  <template v-for="child in section.children" :key="child.name">
                    <li class="ebl-tree-list__item ebl-tree-list__item--depth-2">
                      <VIcon v-if="child.children?.length" icon="ebli:arrow-bottom" :size="20" />
                      <span>{{ child.name }}</span>
                      <VSpacer />
                      <EblSwitch v-model="child.value" :label="child.type" />
                    </li>
                    <!-- Grandchildren (depth-3) with switches -->
                    <template v-if="child.children?.length">
                      <li
                        v-for="grandchild in child.children"
                        :key="grandchild.name"
                        class="ebl-tree-list__item ebl-tree-list__item--depth-3"
                      >
                        <span>{{ grandchild.name }}</span>
                        <VSpacer />
                        <EblSwitch v-model="grandchild.value" :label="grandchild.type" />
                      </li>
                    </template>
                  </template>
                </template>
              </ul>
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

        <!-- Password Reset Dialog -->
        <VSlideXReverseTransition>
          <VCard v-if="passwordOpen" width="400" class="ebl-dialog__card align-self-start">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">Reset password</span>
              <VSpacer />
              <EblBtn icon pill small @click="closePasswordDialog">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>

            <VCardText class="ebl-dialog__text">
              <EblInfo vertical>
                <EblInfoItem label="User ID" has-input>
                  <EblInput v-model="passwordForm.userId" disabled />
                </EblInfoItem>
                <EblInfoItem label="New Password" has-input required>
                  <EblInput
                    v-model="passwordForm.newPassword"
                    :type="passwordForm.showPassword ? 'text' : 'password'"
                    placeholder="Input a New Password"
                  >
                    <template #append>
                      <EblBtn
                        :icon="passwordForm.showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                        size="x-small"
                        color="ghost"
                        @click="passwordForm.showPassword = !passwordForm.showPassword"
                      />
                    </template>
                  </EblInput>
                  <template #hint>
                    <span class="text-caption text-muted"
                      >※ 영문 대소문자/숫자/특수문자 중 3가지 이상 조합, 10~12자</span
                    >
                  </template>
                </EblInfoItem>
                <EblInfoItem label="Confirm Password" has-input required>
                  <EblInput
                    v-model="passwordForm.confirmPassword"
                    :type="passwordForm.showPassword ? 'text' : 'password'"
                    placeholder="Input a Confirm new Password"
                  >
                    <template #append>
                      <EblBtn
                        :icon="passwordForm.showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                        size="x-small"
                        color="ghost"
                        @click="passwordForm.showPassword = !passwordForm.showPassword"
                      />
                    </template>
                  </EblInput>
                </EblInfoItem>
              </EblInfo>
            </VCardText>

            <VCardActions class="ebl-dialog__actions">
              <VSpacer />
              <EblBtn large @click="closePasswordDialog">Cancel</EblBtn>
              <EblBtn color="cta" large @click="handlePasswordSave">Save</EblBtn>
            </VCardActions>
          </VCard>
        </VSlideXReverseTransition>
      </EblDialog>
    </div>
  </div>
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3'
import { useDialogStore } from '~/stores/useDialogStore'

const dialogStore = useDialogStore()
const { formatNumber } = useFormat()

// 페이지 정보
const pageInfo = ref({
  title: 'Directory',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Sub Users' }, { text: 'Directory' }],
})

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
const passwordOpen = ref(false)
const dialogMode = ref(null) // null | 'view' | 'add' | 'modify'
const detailRow = ref(null)

// 비밀번호 변경 폼
const passwordForm = reactive({
  userId: '',
  newPassword: '',
  confirmPassword: '',
  showPassword: false,
})

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

// 권한 데이터
const authorityData = ref([
  {
    title: 'Dashboard',
    type: 'Read',
    children: [
      { name: 'In-Progress Tasks', type: 'Read', value: true },
      { name: 'My B/L Statistics', type: 'Read', value: true },
      { name: 'Recent B/L Tasks', type: 'Read', value: true },
      { name: 'Carbon Savings', type: 'Read', value: false },
    ],
  },
  {
    title: 'Documents',
    type: 'Read',
    children: [
      {
        name: 'Create B/L',
        type: 'Create',
        value: true,
        children: [{ name: 'Enter Password', type: 'Create', value: true }],
      },
      {
        name: 'Sent',
        type: 'Read',
        value: true,
        children: [
          { name: 'B/L Detail', type: 'Read', value: true },
          { name: 'eBL Transaction', type: 'Read', value: true },
          { name: 'Preview', type: 'Read', value: true },
        ],
      },
      { name: 'Draft', type: 'Read', value: true },
    ],
  },
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
    sort: 'desc',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'subId',
    headerName: 'Sub ID',
    minWidth: 200,
    flex: 1,

    cellRenderer: (params) => {
      return `<a class="ebl-link">${params.value}</a>`
    },
  },
  {
    field: 'userName',
    headerName: 'User Name',
    width: 150,
  },
  {
    field: 'department',
    headerName: 'Department',
    minWidth: 200,
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
  if (params.column.getColId() === 'subId') {
    detailRow.value = params.data
    dialogMode.value = 'view'
    dialogOpen.value = true
  }
}

// 다이얼로그 핸들러
const closeDialog = () => {
  dialogOpen.value = false
  dialogMode.value = null
  detailRow.value = null
}

const openPasswordDialog = () => {
  passwordForm.userId = detailRow.value?.subId || ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordOpen.value = true
}

const closePasswordDialog = () => {
  passwordOpen.value = false
  passwordForm.userId = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const handlePasswordSave = async () => {
  if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
    await dialogStore.showAlert({
      title: '알림',
      icon: 'info',
      message: '모든 필드를 입력해주세요.',
    })
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    await dialogStore.showAlert({
      title: '알림',
      icon: 'warning',
      message: '비밀번호가 일치하지 않습니다.',
    })
    return
  }

  // 비밀번호 변경 로직
  console.log('Password changed:', passwordForm)
  closePasswordDialog()
  await dialogStore.showAlert({
    title: '성공',
    icon: 'success',
    message: '비밀번호가 변경되었습니다.',
  })
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
  if (passwordOpen.value) {
    closePasswordDialog()
  }
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

// 뱃지 색상
const getBadgeColor = (type, enabled = true) => {
  if (!enabled) return 'gray'
  const colors = {
    Read: 'pink',
    Create: 'amber',
  }
  return colors[type] || 'gray'
}
</script>
