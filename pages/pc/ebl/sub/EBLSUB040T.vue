<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo" />
    <div class="ebl-card-container">
      <!-- Tabs -->
      <div class="ebl-tabs-container mb-6">
        <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      </div>

      <!-- EblSubHeader -->
      <EblSubHeader>
        <h2>{{ activeTab === 0 ? 'Activity Log' : 'Audit Log' }}</h2>
        <span class="count">{{ formatNumber(filteredLogData.length) }}</span>
        <template #tooltip>
          <template v-if="activeTab === 0">
            •해당 사업자 소속의 사용자별로 업무 활동 기록을 확인할 수 있습니다.<br />
            •다운로드 버튼을 클릭하여 엑셀 파일로 다운로드가 가능합니다.
          </template>
          <template v-else>
            •사용자 감사 로그를 확인할 수 있습니다.<br />
            •로그 데이터는 최대 1년간 보관됩니다.
          </template>
        </template>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters">
        <EblInput
          v-model="filters.userId"
          clearable
          placeholder="User ID"
          style="width: 160px"
          @keydown.enter="applyFilters"
        />
        <EblSelect
          v-model="filters.accessDevice"
          clearable
          placeholder="Access Device"
          :options="deviceOptions"
          style="width: 180px"
        />
        <!-- Activity Log: Request Type -->
        <EblSelect
          v-if="activeTab === 0"
          v-model="filters.requestType"
          clearable
          placeholder="Request Type"
          :options="requestTypeOptions"
          style="width: 180px"
        />
        <!-- Audit Log: Login Result -->
        <EblSelect
          v-if="activeTab === 1"
          v-model="filters.loginResult"
          clearable
          placeholder="Login Result"
          :options="loginResultOptions"
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
        <EblBtn outlined prepend-icon="ebli:download" class="ml-auto"> Download </EblBtn>
      </div>

      <!-- Tab Content: Activity Log -->
      <template v-if="activeTab === 0">
        <!-- AG Grid -->
        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="paginatedActivityLogData"
          :column-defs="activityLogColDefs"
          :dom-layout="'autoHeight'"
          @grid-ready="onGridReady"
        />
      </template>

      <!-- Tab Content: Audit Log -->
      <template v-if="activeTab === 1">
        <!-- AG Grid -->
        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="paginatedAuditLogData"
          :column-defs="auditLogColDefs"
          :dom-layout="'autoHeight'"
          @grid-ready="onGridReady"
        />
      </template>

      <!-- Pagination -->
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
          :length="Math.ceil(filteredLogData.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3'
import BadgeCellRenderer from '~/components/grid/BadgeCellRenderer.vue'

const route = useRoute()
const { formatNumber } = useFormat()

// 페이지 정보
const pageInfo = ref({
  title: 'Users Log',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Sub Users' }, { text: 'Users Log' }],
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
  { label: 'Activity Log', value: 0 },
  { label: 'Audit Log', value: 1 },
])

// ===== 필터 로직 =====
// 필터 상태 (입력용)
const filters = reactive({
  userId: '',
  accessDevice: '',
  requestType: '', // Activity Log용
  loginResult: '', // Audit Log용
  dateRange: null,
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  userId: '',
  accessDevice: '',
  requestType: '', // Activity Log용
  loginResult: '', // Audit Log용
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.userId = filters.userId
  appliedFilters.accessDevice = filters.accessDevice
  appliedFilters.requestType = filters.requestType
  appliedFilters.loginResult = filters.loginResult
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  page.value = 1
}

// 필터 옵션
const deviceOptions = [
  { label: 'All', value: '' },
  { label: 'Web', value: 'Web' },
  { label: 'Mobile', value: 'Mobile' },
]

const requestTypeOptions = [
  { label: 'All', value: '' },
  { label: 'Create', value: 'Create' },
  { label: 'Read', value: 'Read' },
  { label: 'Update', value: 'Update' },
  { label: 'Delete', value: 'Delete' },
]

const loginResultOptions = [
  { label: 'All', value: '' },
  { label: 'Success', value: 'Success' },
  { label: 'Fail', value: 'Fail' },
]

// 페이지네이션
const page = ref(1)
const itemsPerPage = ref(10)
const gridApi = ref(null)

// Activity Log 더미 데이터
const generateActivityLogData = () => {
  const data = []
  const userIds = ['no1jyy@xxx.xxx', 'KTNETHelp@xxx.xxx', 'Hong446@xxx.xxx', 'Banker123@xxx.xxx']
  const userNames = ['Andy Jung', 'Y.P Park', 'Gil-Dong Hong', 'James Kim']
  const devices = ['Web', 'Mobile']
  const menuPaths = [
    'Partners > MY Partners > Partners Detail',
    'Documents > Inbox > Endorse',
    'Sub Users > Directory',
    'Documents > My eBLs',
  ]
  const informations = ['MY Partners', 'Inbox', 'Directory', 'My eBLs']
  const functions = ['Save', 'Read', 'Save', 'Read']

  for (let i = 0; i < 50; i++) {
    const randIdx = i % userIds.length
    data.push({
      no: i + 1,
      userId: userIds[randIdx],
      userName: userNames[randIdx],
      accessDevice: devices[i % devices.length],
      menuPath: menuPaths[i % menuPaths.length],
      information: informations[i % informations.length],
      function: functions[i % functions.length],
      requestTime: '2025-09-19 13:30:20',
    })
  }
  return data
}

// Audit Log 더미 데이터
const generateAuditLogData = () => {
  const data = []
  const userIds = ['no1jyy@xxx.xxx', 'KTNETHelp@xxx.xxx', 'Hong446@xxx.xxx', 'Banker123@xxx.xxx']
  const userNames = ['Andy Jung', 'Y.P Park', 'Gil-Dong Hong', 'James Kim']
  const devices = ['Web', 'Mobile']
  const logInStates = ['Success', 'Fail']
  const connectionIps = ['211.58.154.25', '192.168.1.1', '10.0.0.1']

  for (let i = 0; i < 50; i++) {
    const randIdx = i % userIds.length
    data.push({
      no: i + 1,
      userId: userIds[randIdx],
      userName: userNames[randIdx],
      accessDevice: devices[i % devices.length],
      connectionIp: connectionIps[i % connectionIps.length],
      logIn: logInStates[i % logInStates.length],
      logInDate: '2025-09-19 13:30:20',
      logOutDate: '2025-09-19 13:30:20',
    })
  }
  return data
}

const activityLogData = ref(generateActivityLogData())
const auditLogData = ref(generateAuditLogData())

// 필터링된 데이터
const filteredLogData = computed(() => {
  const currentData = activeTab.value === 0 ? activityLogData.value : auditLogData.value
  return currentData.filter((row) => {
    if (
      appliedFilters.userId &&
      !row.userId.toLowerCase().includes(appliedFilters.userId.toLowerCase())
    ) {
      return false
    }
    if (appliedFilters.accessDevice && row.accessDevice !== appliedFilters.accessDevice) {
      return false
    }
    // Activity Log: Request Type으로 필터링
    if (activeTab.value === 0) {
      if (appliedFilters.requestType && row.function !== appliedFilters.requestType) {
        return false
      }
    }
    // Audit Log: Login Result로 필터링
    if (activeTab.value === 1) {
      if (appliedFilters.loginResult && row.logIn !== appliedFilters.loginResult) {
        return false
      }
    }
    if (appliedFilters.dateRange && appliedFilters.dateRange.length === 2) {
      const rowDate = new Date(row.requestTime || row.logInDate)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      if (rowDate < startDate || rowDate > endDate) {
        return false
      }
    }
    return true
  })
})

// 페이지네이션된 데이터
const paginatedActivityLogData = computed(() => {
  if (activeTab.value !== 0) return []
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLogData.value.slice(start, end)
})

const paginatedAuditLogData = computed(() => {
  if (activeTab.value !== 1) return []
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLogData.value.slice(start, end)
})

// Activity Log Column Definitions
const activityLogColDefs = ref([
  {
    field: 'no',
    headerName: 'No',
    width: 60,
    maxWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'userId',
    headerName: 'Sub ID',
    width: 150,
  },
  {
    field: 'userName',
    headerName: 'User Name',
    width: 120,
  },
  {
    field: 'accessDevice',
    headerName: 'Access Device',
    width: 120,
  },
  {
    field: 'menuPath',
    headerName: 'Menu Path',
    flex: 1,
  },
  {
    field: 'information',
    headerName: 'Information',
    width: 140,
  },
  {
    field: 'function',
    headerName: 'Function',
    width: 120,
  },
])

// Audit Log Column Definitions
const auditLogColDefs = ref([
  {
    field: 'no',
    headerName: 'No',
    width: 60,
    maxWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'userId',
    headerName: 'Sub ID',
    width: 150,
    flex: 1,
  },
  {
    field: 'userName',
    headerName: 'User Name',
    width: 120,
  },
  {
    field: 'accessDevice',
    headerName: 'Access Device',
    width: 120,
  },
  {
    field: 'connectionIp',
    headerName: 'Connection IP',
    width: 140,
  },
  {
    field: 'logIn',
    headerName: 'Log In',
    width: 100,
  },
  {
    field: 'logInDate',
    headerName: 'Log In Date',
    width: 180,
  },
  {
    field: 'logOutDate',
    headerName: 'Log Out Date',
    width: 180,
  },
])

// AG Grid 이벤트 핸들러
const onGridReady = (params) => {
  gridApi.value = params.api
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.userId = ''
  filters.accessDevice = ''
  filters.requestType = ''
  filters.loginResult = ''
  filters.dateRange = null
  appliedFilters.userId = ''
  appliedFilters.accessDevice = ''
  appliedFilters.requestType = ''
  appliedFilters.loginResult = ''
  appliedFilters.dateRange = null
  page.value = 1
}

// 탭 변경 시 페이지 초기화
watch(activeTab, () => {
  page.value = 1
})

// itemsPerPage 변경 시 현재 페이지 조정
watch([itemsPerPage, () => filteredLogData.value.length], () => {
  const maxPage = Math.ceil(filteredLogData.value.length / itemsPerPage.value)
  if (page.value > maxPage) {
    page.value = Math.max(1, maxPage)
  }
  if (page.value < 1) {
    page.value = 1
  }
})
</script>
