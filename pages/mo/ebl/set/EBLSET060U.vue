<template>
  <div class="ebl-page-container pt-0">
    <!-- 탭 네비게이션 -->
    <EblTabs
      v-model="activeTab"
      v-sticky="32"
      stretch
      :items="[
        { label: 'Company Info', value: 'companyInfo' },
        { label: 'Co-worker', value: 'coWorker' },
      ]"
      no-wrap
      class="mx-n6 pt-6 px-6 mb-6"
    />

    <!-- Company Info 탭 -->
    <template v-if="activeTab === 'companyInfo'">
      <EblInfo vertical class="mb-6" style="--ebl-info-row-gap: 16px">
        <EblInfoItem label="Country" has-input required>
          <EblInput v-model="formData.country" readonly placeholder="Enter country" />
        </EblInfoItem>

        <EblInfoItem label="Role" has-input required>
          <EblInput v-model="formData.role" readonly placeholder="Enter role" />
        </EblInfoItem>

        <EblInfoItem label="Company Name" has-input required>
          <EblInput v-model="formData.companyName" readonly placeholder="Enter company name" />
        </EblInfoItem>

        <EblInfoItem label="DUNS Number" has-input>
          <EblInput v-model="formData.dunsNumber" readonly placeholder="Enter DUNS number" />
        </EblInfoItem>

        <EblInfoItem label="Corporation Number" has-input>
          <EblInput
            v-model="formData.corporationNumber"
            readonly
            placeholder="Enter corporation number"
          />
        </EblInfoItem>

        <EblInfoItem label="Owner" has-input required>
          <EblInput v-model="formData.owner" readonly placeholder="Enter owner name" />
        </EblInfoItem>

        <EblInfoItem label="zip code" has-input>
          <EblInput v-model="formData.zipCode" readonly placeholder="Enter zip code" />
        </EblInfoItem>

        <EblInfoItem label="Spot Code" has-input>
          <EblInput v-model="formData.spotCode" readonly placeholder="Enter spot code" />
        </EblInfoItem>

        <EblInfoItem label="City/Region" has-input>
          <EblInput v-model="formData.cityRegion" readonly placeholder="Enter city/region" />
        </EblInfoItem>

        <EblInfoItem label="Address 1" has-input required>
          <EblInput v-model="formData.address1" readonly placeholder="Enter address 1" />
        </EblInfoItem>

        <EblInfoItem label="Address 2" has-input>
          <EblInput v-model="formData.address2" readonly placeholder="Enter address 2" />
        </EblInfoItem>

        <EblInfoItem label="Company Logo" has-input>
          <div class="ebl-img-viewbox">
            <VImg :src="formData.companyLogo" width="120" cover class="ebl-img-viewbox__img" />
          </div>
        </EblInfoItem>
      </EblInfo>
    </template>

    <!-- Co-worker 탭 -->
    <template v-else-if="activeTab === 'coWorker'">
      <!-- 헤더 (총 개수 + 필터 버튼) -->
      <EblSubHeader>
        <h2>Total</h2>
        <span class="count">{{ totalCount }}</span>
        <template #util>
          <EblBtn icon="ebli:filter2" outlined @click="openFilter" />
        </template>
      </EblSubHeader>

      <!-- Co-worker 카드 리스트 -->
      <div class="ebl-card-list">
        <!-- 검색 결과 없음 -->
        <div v-if="filteredItems.length === 0" class="ebl-card-item__empty">
          <VImg src="~/assets/images/common/not_result_found.png" width="150" height="74" />
          <h3>No results found</h3>
          <p>
            No data matches your current filter settings.<br />
            Please try adjusting your filters or date range.
          </p>
        </div>

        <!-- Co-worker 카드 아이템 -->
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="ebl-card-item ebl-card-item--co-worker"
          @click="openUserDetail(item)"
        >
          <div class="ebl-card-item__name">
            <h3 class="name">{{ item.name }}</h3>
            <EblBadge color="black" variant="tonal" pill>{{ item.role }}</EblBadge>
          </div>
          <div class="ebl-card-item__department">{{ item.department }}</div>
          <div class="ebl-card-item__email">{{ item.email }}</div>
        </div>
      </div>

      <!-- More 버튼 (페이지네이션) -->
      <div v-if="showMore" class="ebl-more-list ebl-more-list--wrap">
        <EblBtn
          v-if="!isLoadingMore"
          block
          class="ebl-more-list__btn"
          append-icon="ebli:chevron-bottom"
          @click="loadMore"
        >
          More ({{ currentCount }} / {{ totalCount }})
        </EblBtn>
        <!-- 로딩 스피너 -->
        <div v-else class="ebl-more-list__loading">
          <Vue3Lottie animation-link="/lottie/loadingSpinner.json" :height="60" :width="120" />
        </div>
      </div>

      <!-- 필터 바텀시트 -->
      <EblFilterBottomSheet
        v-model="showFilter"
        v-model:filter-value="appliedFilter"
        title="Filter"
        query-place-holder="Search Sub ID, User Name"
        date-label="Add Date"
        @filter:apply="onFilterApply"
        @filter:reset="onFilterReset"
      />

      <!-- 사용자 상세 바텀시트 -->
      <EblBottomSheet v-model="showSubUserDetail" scrollable>
        <VCard
          v-pull-trigger="{
            handle: handleRef,
            onTrigger: () => (showSubUserDetail = false),
          }"
          class="ebl-bottom-sheet__card"
        >
          <div ref="handleRef" class="ebl-bottom-sheet__handle" />
          <VCardTitle class="px-6 pt-5 pb-4">
            <!-- 사용자 기본 정보 -->
            <div class="ebl-user-detail">
              <div class="ebl-user-detail__name">
                <h3 class="name">{{ selectedCoWorker.name }}</h3>
                <EblBadge color="black" variant="tonal" pill>{{ selectedCoWorker.role }}</EblBadge>
              </div>
              <div class="ebl-user-detail__department">{{ selectedCoWorker.department }}</div>
            </div>
          </VCardTitle>
          <VCardText class="ebl-bottom-sheet__text pt-0">
            <!-- 사용자 상세 정보 -->
            <EblInfo vertical class="ebl-info--gray" style="--ebl-info-row-gap: 12px">
              <EblInfoItem label="Email" has-input>
                {{ selectedCoWorker.email }}
              </EblInfoItem>
              <EblInfoItem label="Phone Number" has-input>
                {{ selectedCoWorker.phoneNumber }}
              </EblInfoItem>
              <EblInfoItem label="Permission Type" has-input>
                {{ selectedCoWorker.permissionType }}
              </EblInfoItem>
              <EblInfoItem label="Added Date" has-input>
                {{ selectedCoWorker.addDate }}
              </EblInfoItem>
            </EblInfo>
          </VCardText>

          <!-- 액션 버튼 -->
          <VCardActions class="ebl-bottom-sheet__action">
            <EblBtn color="outlined" large block @click="handleResetPassword">
              Reset Password
            </EblBtn>
          </VCardActions>
        </VCard>
      </EblBottomSheet>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDialogStore } from '~/stores/useDialogStore'
import { useToastStore } from '~/stores/toast'

// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'detail',
  appbarTitle: 'My Company',
})

// ============================================
// Store
// ============================================
const dialogStore = useDialogStore()
const toastStore = useToastStore()

// ============================================
// 기본 State
// ============================================
const activeTab = ref('companyInfo') // 활성 탭 (companyInfo | coWorker)

// ============================================
// Company Info 폼 데이터
// ============================================
const formData = ref({
  country: 'KR',
  role: 'Shipper',
  companyName: 'KTNETBL1',
  dunsNumber: '',
  corporationNumber: '',
  owner: 'Gil-Dong Hong',
  zipCode: '',
  spotCode: '',
  cityRegion: '',
  address1: '',
  address2: '',
  companyLogo: 'https://api.dicebear.com/9.x/identicon/svg?seed=9',
})

// ============================================
// Co-worker 바텀시트 관련
// ============================================
const showSubUserDetail = ref(false) // 사용자 상세 바텀시트 표시 여부
const handleRef = ref(null) // 바텀시트 드래그 핸들 ref
const selectedCoWorker = ref({
  id: null,
  name: '',
  department: '',
  email: '',
  subId: '',
  role: '',
  phoneNumber: '',
  permissionType: '',
  addDate: '',
})

// ============================================
// Co-worker 리스트 및 필터 State
// ============================================
const showFilter = ref(false) // 필터 바텀시트 표시 여부
const appliedFilter = ref({
  query: '', // 검색어 (Sub ID, User Name)
  status: '', // 상태 (미사용)
  range: {
    from: null, // 시작 날짜
    to: null, // 종료 날짜
  },
})

// ============================================
// Co-worker 페이지네이션
// ============================================
const itemsPerPage = ref(10) // 페이지당 아이템 수
const currentCount = ref(10) // 현재 표시 중인 아이템 수
const isLoadingMore = ref(false) // More 버튼 로딩 상태

// ============================================
// Co-worker 더미 데이터
// ============================================
const allCoWorkers = ref([
  {
    id: 1,
    name: 'Andy Jung',
    department: 'Customer Management Team',
    email: 'no1jyy@ktnet.co.kr',
    subId: 'no1jyy@ktnet.co.kr',
    role: 'Director',
    phoneNumber: '+82-2-1234-5678',
    permissionType: 'Viewer (Read-only)',
    addDate: '2025-09-19',
  },
  {
    id: 2,
    name: 'Y.P Park',
    department: 'Sales Department',
    email: 'KTNETHelp@ktnet.co.kr',
    subId: 'KTNETHelp@ktnet.co.kr',
    role: 'Manager',
    phoneNumber: '+82-2-2345-6789',
    permissionType: 'Editor',
    addDate: '2025-08-15',
  },
  {
    id: 3,
    name: 'Gil-Dong Hong',
    department: 'Marketing Team',
    email: 'Hong446@ktnet.co.kr',
    subId: 'Hong446@ktnet.co.kr',
    role: 'Associate',
    phoneNumber: '+82-2-3456-7890',
    permissionType: 'Viewer (Read-only)',
    addDate: '2025-07-22',
  },
  {
    id: 4,
    name: 'James Kim',
    department: 'Planning Department',
    email: 'Banker123@ktnet.co.kr',
    subId: 'Banker123@ktnet.co.kr',
    role: 'Senior Associate',
    phoneNumber: '+82-2-4567-8901',
    permissionType: 'Editor',
    addDate: '2025-06-10',
  },
  {
    id: 5,
    name: 'Sarah Lee',
    department: 'Finance Department',
    email: 'sarah.lee@ktnet.co.kr',
    subId: 'sarah.lee@ktnet.co.kr',
    role: 'Senior Manager',
    phoneNumber: '+82-2-5678-9012',
    permissionType: 'Admin',
    addDate: '2025-05-05',
  },
  {
    id: 6,
    name: 'Michael Johnson',
    department: 'Operations Team',
    email: 'michael.johnson@ktnet.co.kr',
    subId: 'michael.johnson@ktnet.co.kr',
    role: 'Director',
    phoneNumber: '+82-2-6789-0123',
    permissionType: 'Admin',
    addDate: '2025-04-18',
  },
  {
    id: 7,
    name: 'Emma Chen',
    department: 'HR Department',
    email: 'emma.chen@ktnet.co.kr',
    subId: 'emma.chen@ktnet.co.kr',
    role: 'Manager',
    phoneNumber: '+82-2-7890-1234',
    permissionType: 'Editor',
    addDate: '2025-03-25',
  },
  {
    id: 8,
    name: 'David Park',
    department: 'IT Department',
    email: 'david.park@ktnet.co.kr',
    subId: 'david.park@ktnet.co.kr',
    role: 'Associate',
    phoneNumber: '+82-2-8901-2345',
    permissionType: 'Editor',
    addDate: '2025-02-14',
  },
  {
    id: 9,
    name: 'Jessica Kim',
    department: 'Legal Team',
    email: 'jessica.kim@ktnet.co.kr',
    subId: 'jessica.kim@ktnet.co.kr',
    role: 'Senior Associate',
    phoneNumber: '+82-2-9012-3456',
    permissionType: 'Viewer (Read-only)',
    addDate: '2025-01-30',
  },
  {
    id: 10,
    name: 'Robert Wilson',
    department: 'Customer Service',
    email: 'robert.wilson@ktnet.co.kr',
    subId: 'robert.wilson@ktnet.co.kr',
    role: 'Manager',
    phoneNumber: '+82-2-0123-4567',
    permissionType: 'Viewer (Read-only)',
    addDate: '2024-12-20',
  },
  {
    id: 11,
    name: 'Sophia Zhang',
    department: 'Accounting Team',
    email: 'sophia.zhang@ktnet.co.kr',
    subId: 'sophia.zhang@ktnet.co.kr',
    role: 'Associate',
    phoneNumber: '+82-2-1111-2222',
    permissionType: 'Editor',
    addDate: '2024-11-18',
  },
  {
    id: 12,
    name: 'Thomas Brown',
    department: 'Logistics Team',
    email: 'thomas.brown@ktnet.co.kr',
    subId: 'thomas.brown@ktnet.co.kr',
    role: 'Manager',
    phoneNumber: '+82-2-3333-4444',
    permissionType: 'Viewer (Read-only)',
    addDate: '2024-10-25',
  },
  {
    id: 13,
    name: 'Victoria Martinez',
    department: 'Compliance Department',
    email: 'victoria.martinez@ktnet.co.kr',
    subId: 'victoria.martinez@ktnet.co.kr',
    role: 'Senior Associate',
    phoneNumber: '+82-2-5555-6666',
    permissionType: 'Admin',
    addDate: '2024-09-12',
  },
  {
    id: 14,
    name: 'Christopher Lee',
    department: 'Business Development',
    email: 'christopher.lee@ktnet.co.kr',
    subId: 'christopher.lee@ktnet.co.kr',
    role: 'Director',
    phoneNumber: '+82-2-7777-8888',
    permissionType: 'Admin',
    addDate: '2024-08-30',
  },
])

// ============================================
// Computed - Co-worker 필터링 및 페이지네이션
// ============================================
// 필터링된 데이터 (검색어 + 날짜 범위)
const filteredItems = computed(() => {
  return allCoWorkers.value.filter((item) => {
    // 검색어 필터링 (Sub ID, User Name)
    if (appliedFilter.value.query) {
      const query = appliedFilter.value.query.toLowerCase()
      const matchesQuery =
        item.subId.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)
      if (!matchesQuery) return false
    }

    // 날짜 범위 필터링 (Add Date)
    if (appliedFilter.value.range?.from) {
      const itemDate = new Date(item.addDate)
      const fromDate = new Date(appliedFilter.value.range.from)
      if (itemDate < fromDate) return false
    }

    if (appliedFilter.value.range?.to) {
      const itemDate = new Date(item.addDate)
      const toDate = new Date(appliedFilter.value.range.to)
      if (itemDate > toDate) return false
    }

    return true
  })
})

// 전체 개수 (필터링 적용 후)
const totalCount = computed(() => filteredItems.value.length)

// 표시할 데이터 (페이지네이션 적용)
const visibleItems = computed(() => {
  return filteredItems.value.slice(0, currentCount.value)
})

// More 버튼 표시 여부
const showMore = computed(() => {
  return currentCount.value < filteredItems.value.length
})

// ============================================
// Co-worker 관련 함수
// ============================================
// 필터 바텀시트 열기
const openFilter = () => {
  showFilter.value = true
}

// 사용자 상세 바텀시트 열기
const openUserDetail = (item) => {
  selectedCoWorker.value = { ...item }
  showSubUserDetail.value = true
}

// 비밀번호 재설정
const handleResetPassword = async () => {
  const result = await dialogStore.showConfirm({
    title: 'Reset Password',
    message: 'Reset password?\nA temporary password will be sent via email immediately.',
    confirmText: 'Reset',
    cancelText: 'Cancel',
  })

  if (!result) return

  // 토스트 표시 후 바텀시트 닫기
  toastStore.add({ text: 'Temporary password sent via email.' })
  showSubUserDetail.value = false
}

// More 버튼 클릭 시 추가 로딩
const loadMore = async () => {
  isLoadingMore.value = true
  // API 호출 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 500))
  currentCount.value += itemsPerPage.value
  isLoadingMore.value = false
}

// 필터 적용
const onFilterApply = () => {
  // 필터 적용 시 처음부터 다시 표시
  currentCount.value = itemsPerPage.value
  showFilter.value = false
}

// 필터 초기화
const onFilterReset = () => {
  appliedFilter.value = {
    query: '',
    status: '',
    range: {
      from: null,
      to: null,
    },
  }
  currentCount.value = itemsPerPage.value
}
</script>
