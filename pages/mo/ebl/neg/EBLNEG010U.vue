<template>
  <div class="ebl-page-container pt-0">
    <!-- 필터 탭 -->
    <EblTabs
      v-model="activeTab"
      v-sticky="32"
      stretch
      :items="[
        { label: 'eNego List', value: 'negotiation' },
        { label: 'Presentation', value: 'presentation' },
      ]"
      no-wrap
      class="mx-n6 pt-6 px-6 mb-6"
    />
    <EblSubHeader>
      <h2>Total</h2>
      <span class="count">{{ totalCount }}</span>
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
      <template v-if="activeTab === 'negotiation'">
        <EblCardItem
          v-for="item in visibleItems"
          :key="item.id"
          :item="item"
          @bl-no:click="goToDetail"
        />
      </template>
      <template v-else>
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="ebl-card-item"
          @click="openPresentationDetail(item)"
        >
          <div class="ebl-card-item__no">
            {{ item.lcNo }}
            <small>{{ item.blNo }}</small>
          </div>
          <div class="ebl-card-item__bank">
            <div class="bank">
              <div class="label">Negotiating Bank</div>
              <div class="value">{{ item.negotiatingBank }}</div>
            </div>
            <div class="bank">
              <div class="label">Issuing Bank</div>
              <div class="value">{{ item.issuingBank }}</div>
            </div>
          </div>
          <div class="ebl-card-item__date">{{ item.date }}</div>
        </div>
      </template>
    </div>

    <!-- More 버튼 -->
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
      <div v-else class="ebl-more-list__loading">
        <!-- 로딩 스피너 샘플 -->
        <Vue3Lottie animation-link="/lottie/loadingSpinner.json" :height="60" :width="120" />
      </div>
    </div>

    <!-- 필터 바텀시트 -->
    <EblFilterBottomSheet
      v-model="showFilter"
      v-model:filter-value="currentFilter"
      :status-label="activeTab === 'negotiation' ? 'Negotiation Status' : ''"
      :status-options="currentStatusOptions"
      title="Filter"
      :query-place-holder="
        activeTab === 'negotiation' ? 'Search Applicant, Recipient' : 'Search Purchase Bank, L/C No'
      "
      :date-label="activeTab === 'negotiation' ? 'Application Date' : 'Request Date'"
      @filter:apply="onFilterApply"
      @filter:reset="onFilterReset"
    />

    <VDialog
      v-model="detailDialog"
      :transition="dialogTransition"
      fullscreen
      scrollable
      content-class="ebl-full-dialog"
    >
      <VCard class="ebl-full-dialog__card">
        <VCardTitle class="ebl-full-dialog__header">
          <span class="title">eNego Details</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click="detailDialog = false">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-full-dialog__text pa-0">
          <div class="enego-detail-popup">
            <div class="enego-detail-popup__hero">
              <h3>LC240301-KEXIM-KR-000001</h3>
              <EblBadge variant="outlined" color="gray">Under Negotiation</EblBadge>
            </div>

            <section class="enego-detail-popup__section">
              <EblInfo vertical label-color="#6B7C93" class="enego-detail-popup__section-info">
                <EblInfoItem label="Negotiation Ref. No" has-input>
                  <div>LC240301-KEXIM-KR-000001</div>
                  <div>LC240301-KEXIM-KR-000002</div>
                </EblInfoItem>
              </EblInfo>
            </section>

            <section class="enego-detail-popup__section">
              <EblInfo vertical label-color="#6B7C93" class="enego-detail-popup__section-info">
                <EblInfoItem label="B/L No" has-input>
                  <button type="button" class="bl-link" @click="goToBlDetail">
                    HDMUSELM70328426
                  </button>
                  <button type="button" class="bl-link" @click="goToBlDetail">
                    HDMUSELM70328426
                  </button>
                </EblInfoItem>
              </EblInfo>
            </section>

            <section class="enego-detail-popup__section">
              <EblInfo vertical label-color="#6B7C93" class="enego-detail-popup__section-info">
                <EblInfoItem label="Applicant" has-input>
                  <EblAvatarLabel
                    logo="https://i.pravatar.cc/150?img=1"
                    title="Hyundai Merchant Marine"
                    subtitle=""
                    title-first
                  />
                </EblInfoItem>
              </EblInfo>
            </section>

            <div class="enego-detail-popup__grid">
              <EblInfo vertical label-color="#6B7C93" class="enego-detail-popup__info-column">
                <EblInfoItem label="Application Date" has-input>2025-09-19</EblInfoItem>
                <EblInfoItem label="Negotiation Bank" has-input>Bank Name</EblInfoItem>
                <EblInfoItem label="Neg/Col" has-input>Negotiation</EblInfoItem>
                <EblInfoItem label="Negotiation Amount" has-input>1,000,000</EblInfoItem>
                <EblInfoItem label="Attache(I/V)" has-input>
                  <span class="text-link">filename.png</span>
                </EblInfoItem>
                <EblInfoItem label="Attache(C/O)" has-input>
                  <span class="text-link">filename.png</span>
                </EblInfoItem>
              </EblInfo>

              <EblInfo vertical label-color="#6B7C93" class="enego-detail-popup__info-column">
                <EblInfoItem label="Document No" has-input>xxxxxxxxxxxxxx</EblInfoItem>
                <EblInfoItem label="Issuing Bank" has-input>Bank Name</EblInfoItem>
                <EblInfoItem label="Neg/Col Date" has-input>2025-09-19</EblInfoItem>
                <EblInfoItem label="Unit" has-input>Dollar</EblInfoItem>
                <EblInfoItem label="Attache(P/L)" has-input>
                  <span class="text-link">filename.png</span>
                </EblInfoItem>
                <EblInfoItem label="Attache(Insurance)" has-input>
                  <span class="text-link">filename.png</span>
                </EblInfoItem>
              </EblInfo>
            </div>

            <section class="enego-detail-popup__cover">
              <EblInfo vertical class="enego-detail-popup__cover-info">
                <EblInfoItem label="Cover Letter" has-input>
                  <EblFileInput
                    v-model="coverLetterFiles"
                    placeholder="Click here to upload your file."
                  />
                  <div class="error-message">Helper Message</div>
                </EblInfoItem>
              </EblInfo>
            </section>
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="presentationDetailDialog"
      :transition="dialogTransition"
      fullscreen
      scrollable
      content-class="ebl-full-dialog"
    >
      <VCard class="ebl-full-dialog__card">
        <VCardTitle class="ebl-full-dialog__header">
          <span class="title">Presentation Details</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click="closePresentationDetail">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-full-dialog__text pa-0">
          <div class="presentation-detail-popup">
            <div class="ebl-header-box ebl-header-box--wrap mb-6">
              <div class="ebl-header-box__inner">
                <div class="ebl-header-box__title">
                  <h3>{{ presentationDetail.lcNo }}</h3>
                  <EblBtn
                    icon="ebli:search"
                    pill
                    small
                    class="ebl-header-box__search"
                    @click="previewDialog = true"
                  />
                </div>
              </div>
            </div>
            <EblBtn
              outlined
              block
              class="presentation-detail-popup__download-all"
              @click="downloadAll"
            >
              Download All
            </EblBtn>
            <div class="presentation-detail-popup__bank-grid">
              <EblInfo
                vertical
                label-color="#6B7C93"
                class="presentation-detail-popup__bank-column"
              >
                <EblInfoItem label="Negotiating Bank" has-input>
                  {{ presentationDetail.negotiatingBank }}
                </EblInfoItem>
              </EblInfo>
              <EblInfo
                vertical
                label-color="#6B7C93"
                class="presentation-detail-popup__bank-column"
              >
                <EblInfoItem label="Issuing Bank" has-input>
                  {{ presentationDetail.issuingBank }}
                </EblInfoItem>
              </EblInfo>
            </div>

            <EblInfo vertical label-color="#6B7C93" class="presentation-detail-popup__doc-list">
              <div class="presentation-detail-popup__doc-row">
                <EblInfoItem label="Cover Letter" has-input>
                  <span class="text-link">{{ presentationDetail.coverLetter }}</span>
                </EblInfoItem>
                <EblBtn
                  outlined
                  icon="ebli:download"
                  class="download-btn"
                  @click="downloadSingle"
                />
              </div>
              <div class="presentation-detail-popup__doc-row">
                <EblInfoItem label="B/L No" has-input>
                  <span class="text-link" @click="goToBlDetail">{{ presentationDetail.blNo }}</span>
                </EblInfoItem>
                <EblBtn
                  outlined
                  icon="ebli:download"
                  class="download-btn"
                  @click="downloadSingle"
                />
              </div>
              <div class="presentation-detail-popup__doc-row">
                <EblInfoItem label="Completion Notice" has-input>
                  <span class="text-link">{{ presentationDetail.completionNotice }}</span>
                </EblInfoItem>
                <EblBtn
                  outlined
                  icon="ebli:download"
                  class="download-btn"
                  @click="downloadSingle"
                />
              </div>
            </EblInfo>

            <div class="presentation-detail-popup__attachments">
              <h4>
                Attachment <span>{{ presentationDetail.attachments.length }}</span>
              </h4>
              <EblBtn
                v-for="(file, index) in presentationDetail.attachments"
                :key="`${file}-${index}`"
                append-icon="ebli:download"
                color="outlined"
                block
                class="file-item"
                @click="downloadSingle"
              >
                {{ file }}
              </EblBtn>
            </div>
          </div>
        </VCardText>

        <VCardActions class="ebl-full-dialog__actions presentation-detail-popup__actions">
          <EblBtn large class="flex-1" @click="openPresentationRejectSheet">Reject</EblBtn>
          <EblBtn color="cta" large class="flex-1" @click="approvePresentation">Approve</EblBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <EblBottomSheet v-model="presentationRejectSheet" persistent>
      <VCard class="ebl-bottom-sheet__card presentation-reject-sheet">
        <VCardTitle class="ebl-bottom-sheet__header">
          <span class="title">Reason for Rejection</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click="closePresentationRejectSheet">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-bottom-sheet__text">
          <EblInfo vertical label-color="#6B7C93">
            <EblInfoItem label="Comment" has-input>
              <EblTextarea
                v-model="presentationRejectReason"
                :rows="5"
                :maxlength="5000"
                counter
                placeholder="거절 사유를 입력해주세요."
                :error-message="presentationRejectError"
                @input="presentationRejectError = ''"
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-bottom-sheet__action">
          <EblBtn large block @click="closePresentationRejectSheet">Cancel</EblBtn>
          <EblBtn color="cta" large block @click="submitPresentationReject">Submit</EblBtn>
        </VCardActions>
      </VCard>
    </EblBottomSheet>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '~/stores/toast'

// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'sub',
  appbarTitle: 'eNego Management',
})

// ============================================
// 상태 데이터
// ============================================
const router = useRouter()
const toastStore = useToastStore()
// B/L 상세 라우팅 후 뒤로 복귀 시 eNego Details 팝업 재오픈용 세션 키
const DETAIL_DIALOG_RETURN_KEY = 'enego-detail-dialog-open'
const DIALOG_TRANSITION_NAME = 'dialog-transition'
const DETAIL_TARGETS = {
  NEGOTIATION: 'negotiation',
  PRESENTATION: 'presentation',
}

const isValidDetailTarget = (target) =>
  target === DETAIL_TARGETS.NEGOTIATION || target === DETAIL_TARGETS.PRESENTATION

const createDetailDialogReturnPayload = (target, id = null) =>
  JSON.stringify({
    target,
    id,
  })

const parseDetailDialogReturnPayload = (rawValue) => {
  if (!rawValue) return null

  try {
    const parsed = JSON.parse(rawValue)
    if (parsed && isValidDetailTarget(parsed.target)) {
      return {
        target: parsed.target,
        id: parsed.id ?? null,
      }
    }
  } catch {
    // backward compatibility: previously stored as plain string
  }

  if (isValidDetailTarget(rawValue)) {
    return {
      target: rawValue,
      id: null,
    }
  }

  return null
}

const activeTab = ref('negotiation')
const pageSize = 10
const currentCountByTab = ref({
  negotiation: pageSize,
  presentation: pageSize,
})
const isLoadingMore = ref(false)
const showFilter = ref(false)
const detailDialog = ref(false)
const dialogTransition = ref(DIALOG_TRANSITION_NAME)
const presentationDetailDialog = ref(false)
const presentationRejectSheet = ref(false)
const presentationRejectReason = ref('')
const presentationRejectError = ref('')
const selectedNegotiationItemId = ref(null)
const selectedPresentationItem = ref(null)
const coverLetterFiles = ref([])

const defaultFilterValue = () => ({
  query: '',
  status: '',
  range: {
    from: '',
    to: '',
  },
})

const appliedFilters = ref({
  negotiation: defaultFilterValue(),
  presentation: defaultFilterValue(),
})

const negotiationStatusOptions = [
  { label: 'All(전체)', value: 'all' },
  { label: 'Under Negotiation', value: 'under-negotiation' },
  {
    label: 'Approved by Negotiating Bank',
    value: 'approved-by-negotiating-bank',
  },
  {
    label: 'Rejected by Negotiating Bank',
    value: 'rejected-by-negotiating-bank',
  },
  {
    label: 'Additional Documents Submitted to Negotiating Bank',
    value: 'additional-documents-submitted-to-negotiating-bank',
  },
  {
    label: 'Additional Documents Approved by Negotiating Bank',
    value: 'additional-documents-approved-by-negotiating-bank',
  },
  {
    label: 'Additional Documents Rejected by Negotiating Bank',
    value: 'additional-documents-rejected-by-negotiating-bank',
  },
  { label: 'Approved by Issuing Bank', value: 'approved-by-issuing-bank' },
  { label: 'Dishonoured by Issuing Bank', value: 'dishonoured-by-issuing-bank' },
]

const currentStatusOptions = computed(() =>
  activeTab.value === 'negotiation' ? negotiationStatusOptions : [],
)

const currentFilter = computed({
  get: () => appliedFilters.value[activeTab.value],
  set: (value) => {
    appliedFilters.value = {
      ...appliedFilters.value,
      [activeTab.value]: value,
    }
  },
})

const currentCount = computed({
  get: () => currentCountByTab.value[activeTab.value] ?? pageSize,
  set: (value) => {
    currentCountByTab.value = {
      ...currentCountByTab.value,
      [activeTab.value]: value,
    }
  },
})

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

const withDialogNoTransition = (openDialogFn) => {
  dialogTransition.value = false
  openDialogFn()
  nextTick(() => {
    dialogTransition.value = DIALOG_TRANSITION_NAME
  })
}

// ============================================
// 페이지 이동 메서드
// ============================================
const goToDetail = (item) => {
  selectedNegotiationItemId.value = item?.id ?? null
  detailDialog.value = true
}

const goToBlDetail = () => {
  const returnTarget = presentationDetailDialog.value
    ? DETAIL_TARGETS.PRESENTATION
    : DETAIL_TARGETS.NEGOTIATION
  const returnId =
    returnTarget === DETAIL_TARGETS.PRESENTATION
      ? (selectedPresentationItem.value?.id ?? null)
      : selectedNegotiationItemId.value
  sessionStorage.setItem(
    DETAIL_DIALOG_RETURN_KEY,
    createDetailDialogReturnPayload(returnTarget, returnId),
  )
  detailDialog.value = false
  presentationDetailDialog.value = false
  router.push('/mo/ebl/cdc/EBLCDC110P')
}

const openPresentationDetail = (item) => {
  selectedPresentationItem.value = item
  presentationDetailDialog.value = true
}

const closePresentationDetail = () => {
  presentationDetailDialog.value = false
  presentationRejectSheet.value = false
  presentationRejectReason.value = ''
  presentationRejectError.value = ''
}

const presentationDetail = computed(() => {
  const selected = selectedPresentationItem.value || presentationItems.value[0]
  return {
    lcNo: selected?.lcNo || 'xxxxxxxxxxxxxxxxxxxx',
    negotiatingBank: selected?.negotiatingBank || 'Bank Name',
    issuingBank: selected?.issuingBank || 'Bank Name',
    coverLetter: 'xxxxxxxxxxxxxxxxxxxx',
    blNo: selected?.blNo || 'HDMUSELM70328426',
    completionNotice: 'xxxxxxxxxxxxxxxxxxxx',
    attachments: ['file name.png', 'file name.png', 'file name.png'],
  }
})

const downloadAll = () => {
  toastStore.add({ text: 'Download all requested.' })
}

const downloadSingle = () => {
  toastStore.add({ text: 'Download requested.' })
}

const approvePresentation = () => {
  presentationDetailDialog.value = false
  toastStore.add({ text: 'Presentation has been approved.' })
}

const openPresentationRejectSheet = () => {
  presentationRejectError.value = ''
  presentationRejectSheet.value = true
}

const closePresentationRejectSheet = () => {
  presentationRejectSheet.value = false
  presentationRejectReason.value = ''
  presentationRejectError.value = ''
}

const submitPresentationReject = () => {
  if (presentationRejectReason.value.trim().length < 10) {
    presentationRejectError.value = '거절 사유를 10자 이상 입력해 주세요.'
    return
  }
  presentationRejectSheet.value = false
  presentationDetailDialog.value = false
  toastStore.add({ text: 'Rejection has been processed.' })
}

// ============================================
// 샘플 데이터
// ============================================
const STATUS_BADGE_CONFIG = negotiationStatusOptions
  .filter((option) => option.value !== 'all')
  .reduce((acc, option) => {
    acc[option.value] = {
      label: option.label,
      color: 'gray',
      variant: 'outlined',
      tooltip: option.label,
    }
    return acc
  }, {})

const COMPANIES = [
  'Hyundai Merchant Marine',
  'CJ Logistics Corporation',
  'Evergreen Line',
  'MSC',
  'COSCO',
]

const BANK_NAMES = [
  'Korea Eximbank',
  'KEB Hana Bank',
  'Shinhan Bank',
  'Woori Bank',
  'Citi Bank Korea',
]

const STATUSES = negotiationStatusOptions
  .filter((option) => option.value !== 'all')
  .map((option) => option.value)

const negotiationItems = ref(
  Array.from({ length: 50 }, (_, index) => {
    const status = STATUSES[index % STATUSES.length]
    return {
      id: index + 1,
      blNo: `HDMUSELM7032842${String(index + 1).padStart(2, '0')}DPBL`,
      badges: [STATUS_BADGE_CONFIG[status]],
      shipper: {
        name: COMPANIES[index % COMPANIES.length],
        logo: `https://i.pravatar.cc/150?img=${(index % 50) + 1}`,
        subtitle: '',
      },
      date: `2026-02-${String((index % 28) + 1).padStart(2, '0')}`,
      status,
    }
  }),
)

const presentationItems = ref(
  Array.from({ length: 50 }, (_, index) => {
    return {
      id: 'presentation' + index,
      lcNo: `LC240301-KEXIM-KR-${String(index + 1).padStart(6, '0')}`,
      blNo: `PTMUSELM7032842${String(index + 1).padStart(2, '0')}DPBL`,
      negotiatingBank: BANK_NAMES[index % BANK_NAMES.length],
      issuingBank: BANK_NAMES[(index + 2) % BANK_NAMES.length],
      date: `2026-02-${String((index % 28) + 1).padStart(2, '0')} 09:30:00`,
    }
  }),
)

const items = computed(() =>
  activeTab.value === 'negotiation' ? negotiationItems.value : presentationItems.value,
)

// ============================================
// 계산된 속성
// ============================================
const filteredItems = computed(() => {
  let result = items.value
  const filter = currentFilter.value
  const query = filter.query.trim().toLowerCase()

  // 검색 필터
  if (query) {
    if (activeTab.value === 'negotiation') {
      result = result.filter(
        (item) =>
          item.shipper.name.toLowerCase().includes(query) ||
          item.blNo.toLowerCase().includes(query),
      )
    } else {
      result = result.filter(
        (item) =>
          item.lcNo.toLowerCase().includes(query) ||
          item.negotiatingBank.toLowerCase().includes(query) ||
          item.issuingBank.toLowerCase().includes(query),
      )
    }
  }

  // 상태 필터
  if (activeTab.value === 'negotiation' && filter.status && filter.status !== 'all') {
    result = result.filter((item) => item.status === filter.status)
  }

  // 날짜 범위 필터
  if (filter.range && typeof filter.range === 'object') {
    const { from, to } = filter.range
    if (from || to) {
      result = result.filter((item) => {
        const itemDate = item.date.split(' ')[0]
        return (!from || itemDate >= from) && (!to || itemDate <= to)
      })
    }
  }

  return result
})

const totalCount = computed(() => filteredItems.value.length)
const visibleItems = computed(() => filteredItems.value.slice(0, currentCount.value))
const showMore = computed(
  () => filteredItems.value.length > pageSize && currentCount.value < filteredItems.value.length,
)

const loadMore = () => {
  if (isLoadingMore.value) return
  isLoadingMore.value = true
  setTimeout(() => {
    currentCount.value = Math.min(currentCount.value + pageSize, filteredItems.value.length)
    isLoadingMore.value = false
  }, 1000) // 1초 딜레이로 로딩 시뮬레이션
}

watch(
  filteredItems,
  () => {
    currentCount.value = Math.min(pageSize, filteredItems.value.length)
    isLoadingMore.value = false
  },
  { immediate: true },
)

onMounted(() => {
  const returnPayload = parseDetailDialogReturnPayload(
    sessionStorage.getItem(DETAIL_DIALOG_RETURN_KEY),
  )

  if (!returnPayload) {
    return
  }

  sessionStorage.removeItem(DETAIL_DIALOG_RETURN_KEY)

  if (returnPayload.target === DETAIL_TARGETS.NEGOTIATION) {
    selectedNegotiationItemId.value = returnPayload.id ?? null
    activeTab.value = DETAIL_TARGETS.NEGOTIATION
    withDialogNoTransition(() => {
      detailDialog.value = true
    })
  } else if (returnPayload.target === DETAIL_TARGETS.PRESENTATION) {
    activeTab.value = DETAIL_TARGETS.PRESENTATION
    withDialogNoTransition(() => {
      presentationDetailDialog.value = true
    })
  }
})
</script>
