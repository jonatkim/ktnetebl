<template>
  <div class="ebl-page-container">
    <!-- 검색 영역 -->
    <div class="ebl-page-mo__search">
      <EblInput
        v-model="searchQuery"
        placeholder="문서 검색..."
        prepend-icon="mdi-magnify"
        clearable
        hide-details
      />
      <VBtn size="small" variant="outlined" class="ml-2" @click="showBottomSheet = true">
        Bottom Sheet
      </VBtn>
    </div>

    <!-- 필터 탭 -->
    <EblTabs v-model="activeTab" :items="filterTabs" no-wrap class="mx-n6 pt-6 px-6 mb-3" />
    <EblTabs v-model="activeTab" :items="filterTabs" variant="pill" no-wrap class="px-6" />
    <EblTabs
      v-model="activeTab"
      :items="[
        { label: 'All', value: 'all' },
        { label: 'Issued', value: 'issued' },
        { label: 'Draft', value: 'draft' },
      ]"
    />

    <!-- 문서 리스트 -->
    <div class="ebl-page-mo__list">
      <div v-if="filteredDocuments.length === 0" class="ebl-page-mo__empty">
        <VIcon icon="mdi-file-document-outline" size="48" color="#ccc" />
        <p>문서가 없습니다</p>
      </div>

      <div v-for="item in filteredDocuments" :key="item.id" class="ebl-document-item">
        <div class="ebl-document-item__header">
          <div class="ebl-document-item__icon">
            <VIcon :icon="getDocIcon(item.type)">
              {{ item.type }}
            </VIcon>
          </div>
          <div class="ebl-document-item__info">
            <div class="ebl-document-item__title">{{ item.title }}</div>
            <div class="ebl-document-item__meta">
              <span class="badge">{{ item.status }}</span>
              <span class="date">{{ formatDate(item.createdAt) }}</span>
            </div>
          </div>
          <div class="ebl-document-item__actions">
            <VBtn icon size="small" variant="text">
              <VIcon icon="mdi-chevron-right" />
            </VBtn>
          </div>
        </div>
        <div v-if="item.description" class="ebl-document-item__desc">
          {{ item.description }}
        </div>
      </div>
    </div>

    <EblBottomSheet v-model="showBottomSheet" persistent>
      <VCard
        ref="sheetRef"
        v-pull-trigger="{
          handle: handleRef,
          onTrigger: () => (showBottomSheet = false),
        }"
        class="ebl-bottom-sheet__card"
      >
        <div ref="handleRef" class="ebl-bottom-sheet__handle" />
        <VCardTitle class="ebl-bottom-sheet__header">
          <span class="title">Transaction Status</span>
          <VSpacer />
          <EblBtn icon pill small @click="transactionStatusOpen = false">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>
        <VCardText class="ebl-bottom-sheet__text">
          선택된 동작이나 간단한 안내를 여기에 넣을 수 있습니다.
          <div class="mt-2 text-caption">임계 진행률: {{ pullProgress.toFixed(2) }}</div>
        </VCardText>
        <VCardActions class="ebl-bottom-sheet__action">
          <VSpacer />
          <VBtn variant="text" @click="showBottomSheet = false">닫기</VBtn>
        </VCardActions>
      </VCard>
    </EblBottomSheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'main',
  appbarTitle: 'Documents',
})

// ============================================
// 상태 데이터
// ============================================
const searchQuery = ref('')
const activeTab = ref('all')
const showBottomSheet = ref(false)
const sheetRef = ref(null)
const handleRef = ref(null)
const pullProgress = ref(0)

const filterTabs = [
  { label: 'All', value: 'all' },
  { label: 'Issued', value: 'issued' },
  { label: 'Draft', value: 'draft' },
  { label: 'Approved', value: 'approved' },
  { label: 'Very long Title Example', value: 'long' },
  { label: 'Temp', value: 'temp' },
]

// 샘플 문서 데이터 (50개)
const documents = ref(
  Array.from({ length: 50 }, (_, index) => {
    const types = ['BL', 'INV', 'PKG', 'CO', 'MNF', 'CD']
    const statuses = ['Issued', 'Draft', 'Approved']
    const typeIndex = index % types.length
    const statusIndex = index % statuses.length
    const type = types[typeIndex]
    const status = statuses[statusIndex]

    return {
      id: index + 1,
      title: `${type} HDMUSKELM7032842${String(index + 1).padStart(3, '0')}`,
      type,
      status,
      description: `Document description for item ${index + 1}`,
      createdAt: new Date(2025, 8, (index % 28) + 1),
    }
  }),
)

// ============================================
// 계산된 속성
// ============================================
const filteredDocuments = computed(() => {
  let result = documents.value

  // 탭 필터
  if (activeTab.value !== 'all') {
    result = result.filter((doc) => doc.status.toLowerCase() === activeTab.value.toLowerCase())
  }

  // 검색 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) || doc.description.toLowerCase().includes(query),
    )
  }

  return result
})

// ============================================
// 메서드
// ============================================
const getDocIcon = (type) => {
  const iconMap = {
    BL: 'mdi-file-document',
    INV: 'mdi-receipt',
    PKG: 'mdi-package-variant',
    CO: 'mdi-certificate',
    MNF: 'mdi-list-box',
    CD: 'mdi-clipboard-list',
  }
  return iconMap[type] || 'mdi-file-document-outline'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<style lang="scss" scoped>
.ebl-document-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:active {
    background-color: #f9f9f9;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background-color: #f0f0f0;
    color: #666;
    flex-shrink: 0;

    .v-icon {
      font-size: 18px;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #999;

    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      background-color: #f0f0f0;
      color: #666;
      font-weight: 500;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  &__desc {
    margin-top: 8px;
    padding-left: 44px;
    font-size: 13px;
    color: #666;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
