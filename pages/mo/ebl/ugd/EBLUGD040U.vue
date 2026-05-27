<template>
  <div class="ebl-page-container pt-0">
    <!-- 필터 탭 -->
    <EblTabs
      v-model="activeTab"
      v-sticky="32"
      :items="tabItems"
      no-wrap
      class="mx-n6 pt-6 px-6 mb-6"
    />
    <EblSubHeader>
      <h2>Total</h2>
      <span class="count">{{ filteredItems.length }}</span>
      <template #util>
        <EblBtn icon="ebli:filter2" outlined @click="openFilter" />
      </template>
    </EblSubHeader>

    <!-- 카드 리스트 -->
    <div class="ebl-card-list">
      <div v-if="filteredItems.length === 0" class="ebl-card-item__empty">
        <VImg src="~/assets/images/common/not_result_found.png" width="150" height="74" />
        <h3>No results found</h3>
        <p>
          No data matches your current filter settings.<br />
          Please try adjusting your filters or date range.
        </p>
      </div>
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="ebl-card-item ga-2"
        @click="openDetail(item)"
      >
        <div class="ebl-card-item__head-badge">
          <EblBadge color="blue" variant="tonal">{{ item.type }}</EblBadge>
          <div class="status" :class="{ completed: item.status === 'Completed' }">
            {{ item.status }}
          </div>
        </div>
        <div class="ebl-card-item__title">{{ item.title }}</div>
        <div class="ebl-card-item__date">{{ item.date }}</div>
      </div>
    </div>

    <!-- More 버튼 -->
    <div
      v-if="showMore"
      v-intersect="onMoreButtonIntersect"
      class="ebl-more-list ebl-more-list--wrap"
    >
      <EblBtn
        v-if="!isLoadingMore"
        block
        class="ebl-more-list__btn"
        append-icon="ebli:chevron-bottom"
        @click="loadMore"
      >
        More ({{ currentCount }} / {{ filteredItems.length }})
      </EblBtn>
      <div v-else class="ebl-more-list__loading">
        <!-- 로딩 스피너 샘플 -->
        <Vue3Lottie animation-link="/lottie/loadingSpinner.json" :height="60" :width="120" />
      </div>
    </div>

    <!-- 플로팅 버튼 -->
    <div class="ebl-floating-btn--wrapper" :class="{ 'is-lifted': isMoreButtonVisible }">
      <EblBtn
        pill
        icon="ebli:edit"
        color="cta"
        class="ebl-floating-btn__edit"
        @click="onFloatingBtnClick"
      />
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
    <!-- 게시물 상세 바텀시트 -->
    <EblBottomSheet v-model="showDetail" scrollable>
      <VCard
        v-pull-trigger="{
          handle: handleRef,
          onTrigger: () => (showDetail = false),
        }"
        class="ebl-bottom-sheet__card"
      >
        <div ref="handleRef" class="ebl-bottom-sheet__handle" />
        <VCardTitle class="px-6 pt-5 pb-4">
          <div class="ebl-detail-header">
            <div class="ebl-detail-header__head-badge">
              <EblBadge color="blue" variant="tonal">Category1</EblBadge>
              <div class="status completed">Completed</div>
            </div>
            <div class="ebl-detail-header__title">
              홈페이지 사용자 메뉴얼 홈페이지 사용자 메뉴얼 홈페이지 사용자 메뉴얼 홈페이지 사용자
              메뉴얼 홈페이지 사용자 메뉴얼 홈페이지 사용자 메뉴얼
            </div>
            <div class="ebl-detail-header__date">2025-09-01 15:15:00</div>
          </div>
        </VCardTitle>
        <VCardText class="ebl-bottom-sheet__text pt-0">
          <!-- 상세 정보 -->
          <EblInfo vertical class="ebl-info--gray" style="--ebl-info-row-gap: 12px">
            <EblInfoItem label="Messae" has-input>
              <p class="content">
                홈페이지 사용자 매뉴얼입니다. <br />회원가입부터 eBL 발행까지 사용자를 위한 모든
                방법을 확인 하실 수 있습니다.
              </p>
            </EblInfoItem>
            <EblInfoItem has-input>
              <template #label>
                Attachment
                <small class="ea">3</small>
              </template>
              <EblBtn append-icon="ebli:download" color="outlined" block class="file-item">
                file name1.png
              </EblBtn>
              <EblBtn append-icon="ebli:download" color="outlined" block class="file-item">
                file name2.png
              </EblBtn>
              <EblBtn append-icon="ebli:download" color="outlined" block class="file-item">
                file name3.png
              </EblBtn>
            </EblInfoItem>
            <EblInfoItem label="Answer" has-input>
              <p class="content">문의 답변드립니다.</p>
            </EblInfoItem>
            <EblInfoItem label="Answer Date" has-input> 2025-09-19 09:00:00 </EblInfoItem>
          </EblInfo>
        </VCardText>
      </VCard>
    </EblBottomSheet>

    <!-- Q&A Register 풀팝업 -->
    <VDialog v-model="showRegister" fullscreen scrollable content-class="ebl-full-dialog">
      <VCard class="ebl-full-dialog__card">
        <VCardTitle class="ebl-full-dialog__header">
          <span class="title">Q&A Register</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click="closeRegister">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-full-dialog__text pt-0">
          <EblInfo vertical style="--ebl-info-row-gap: 16px">
            <EblInfoItem label="Category" has-input required>
              <EblSelect
                v-model="registerForm.category"
                placeholder="Select"
                block
                :options="categoryOptions"
              />
            </EblInfoItem>

            <EblInfoItem label="Title" has-input required>
              <EblInput v-model="registerForm.title" placeholder="Enter title" />
            </EblInfoItem>

            <EblInfoItem label="Message" has-input required>
              <EblTextarea
                v-model="registerForm.message"
                placeholder="Please enter the message"
                :rows="6"
                counter
                :maxlength="1000"
              />
            </EblInfoItem>

            <EblInfoItem label="Attachment" has-input>
              <EblFileInput
                v-model="registerForm.attachments"
                placeholder="Click here to upload your file."
                multiple
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-full-dialog__actions">
          <EblBtn large class="flex-1" @click="closeRegister">Cancel</EblBtn>
          <EblBtn
            color="cta"
            large
            class="flex-1"
            :disabled="!registerForm.category || !registerForm.title || !registerForm.message"
            @click="saveRegister"
            >Save</EblBtn
          >
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'sub',
  appbarTitle: 'Q&A',
})

// ============================================
// 상태 데이터
// ============================================
const activeTab = ref('all')
const pageSize = 10
const currentCount = ref(pageSize)
const isLoadingMore = ref(false)
const showFilter = ref(false)
const showDetail = ref(false)
const handleRef = ref(null)
const selectedItem = ref(null)
const isMoreButtonVisible = ref(false)
const showRegister = ref(false)

const registerForm = ref({
  category: '',
  title: '',
  message: '',
  attachments: [],
})

const categoryOptions = ref([
  { label: 'Category1', value: 'category1' },
  { label: 'Category2', value: 'category2' },
  { label: 'Category3', value: 'category3' },
])

const appliedFilter = ref({
  query: '',
  range: {
    from: null,
    to: null,
  },
})

// ============================================
// 탭 설정
// ============================================
const tabItems = ref([
  { label: 'ALL', value: 'all' },
  { label: 'Category1', value: 'category1' },
  { label: 'Category2', value: 'category2' },
  { label: 'Category3', value: 'category3' },
])

// ============================================
// 더미 데이터
// ============================================
const allData = ref([
  // Carrier
  {
    id: 1,
    title: 'Carrier Operations Manual 2025',
    type: 'category1',
    status: 'Completed',
    date: '2025-09-19 15:30:20',
  },
  {
    id: 2,
    title: 'eBL Carrier Integration Guide',
    type: 'category1',
    status: 'Waiting',
    date: '2025-08-20 15:30:20',
  },
  {
    id: 3,
    title: 'Shipping Documentation Standards',
    type: 'category1',
    status: 'Completed',
    date: '2025-04-01 15:30:20',
  },
  {
    id: 4,
    title: 'Carrier Compliance Checklist',
    type: 'category1',
    status: 'Completed',
    date: '2025-03-24 15:30:20',
  },
  {
    id: 5,
    title: 'Port Operations Procedures',
    type: 'category1',
    status: 'Completed',
    date: '2025-02-14 15:30:20',
  },
  {
    id: 6,
    title: 'Container Management System',
    type: 'category1',
    status: 'Completed',
    date: '2025-01-30 15:30:20',
  },
  // Shipper
  {
    id: 7,
    title: 'Shipper Quick Start Guide',
    type: 'category2',
    status: 'Completed',
    date: '2025-09-18 10:15:00',
  },
  {
    id: 8,
    title: 'How to Create an eBL',
    type: 'category2',
    status: 'Completed',
    date: '2025-08-25 14:20:30',
  },
  {
    id: 9,
    title: 'Documentation Requirements',
    type: 'category2',
    status: 'Waiting',
    date: '2025-07-15 09:45:00',
  },
  {
    id: 10,
    title: 'Shipper Best Practices',
    type: 'category2',
    status: 'Completed',
    date: '2025-06-20 11:30:00',
  },
  {
    id: 11,
    title: 'Customs Declaration Process',
    type: 'category2',
    status: 'Waiting',
    date: '2025-05-10 16:00:00',
  },
  // Bank
  {
    id: 12,
    title: 'Bank Operations Guide',
    type: 'category3',
    status: 'Completed',
    date: '2025-09-15 13:15:00',
  },
  {
    id: 13,
    title: 'eBL Verification Process',
    type: 'category3',
    status: 'Completed',
    date: '2025-08-28 10:30:00',
  },
  {
    id: 14,
    title: 'Bank Compliance Requirements',
    type: 'category3',
    status: 'Completed',
    date: '2025-07-22 15:45:00',
  },
  {
    id: 15,
    title: 'Letter of Credit Processing',
    type: 'category3',
    status: 'Completed',
    date: '2025-06-18 09:20:00',
  },
])

// ============================================
// 필터 관련 메서드
// ============================================
const openFilter = () => {
  showFilter.value = true
}

const resetPagination = () => {
  currentCount.value = pageSize
}

const onFilterApply = resetPagination
const onFilterReset = resetPagination

// ============================================
// 계산된 속성
// ============================================
const filteredItems = computed(() => {
  let result = allData.value

  // activeTab 필터링
  if (activeTab.value !== 'all') {
    result = result.filter((item) => item.type.toLowerCase() === activeTab.value)
  }

  // 검색 필터링
  if (appliedFilter.value.query) {
    const query = appliedFilter.value.query.toLowerCase()
    result = result.filter((item) => item.title.toLowerCase().includes(query))
  }

  // 날짜 범위 필터링
  if (appliedFilter.value.range.from || appliedFilter.value.range.to) {
    const from = appliedFilter.value.range.from ? new Date(appliedFilter.value.range.from) : null
    const to = appliedFilter.value.range.to ? new Date(appliedFilter.value.range.to) : null

    result = result.filter((item) => {
      const itemDate = new Date(item.date.split(' ')[0])
      if (from && itemDate < from) return false
      if (to && itemDate > to) return false
      return true
    })
  }

  return result
})

const visibleItems = computed(() => {
  return filteredItems.value.slice(0, currentCount.value)
})

const showMore = computed(() => {
  return filteredItems.value.length > currentCount.value
})

// ============================================
// 이벤트 핸들러
// ============================================
const openDetail = (item) => {
  selectedItem.value = item
  showDetail.value = true
}

const loadMore = () => {
  isLoadingMore.value = true
  setTimeout(() => {
    currentCount.value += pageSize
    isLoadingMore.value = false
  }, 600)
}

const onFloatingBtnClick = () => {
  showRegister.value = true
}

const closeRegister = () => {
  showRegister.value = false
}

const saveRegister = () => {
  console.log('Save register:', registerForm.value)
  // TODO: 저장 로직 구현
  showRegister.value = false
}

const onMoreButtonIntersect = (isIntersecting) => {
  isMoreButtonVisible.value = isIntersecting
}
</script>
