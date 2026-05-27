<template>
  <div class="ebl-page-container pt-0">
    <!-- 빈 상세 페이지 -->
    <div v-sticky="56" class="ebl-header-box ebl-header-box--wrap">
      <div class="ebl-header-box__inner">
        <div class="ebl-header-box__title">
          <h3>HDMUSKLM70328427</h3>
          <EblBtn
            icon="ebli:search"
            pill
            small
            class="ebl-header-box__search"
            @click="previewDialog = true"
          />
        </div>
        <div class="ebl-header-box__badge">
          <VTooltip location="top" scroll-strategy="close">
            <template #activator="{ props }">
              <span v-bind="props">
                <EblBadge variant="tonal" color="mint">ISSUED</EblBadge>
              </span>
            </template>
            <span>Sample Tooltip</span>
          </VTooltip>
          <VTooltip location="top" scroll-strategy="close">
            <template #activator="{ props }">
              <span v-bind="props">
                <EblBadge variant="tonal" color="gray">ISSUE</EblBadge>
              </span>
            </template>
            <span>Sample Tooltip</span>
          </VTooltip>
        </div>
      </div>
    </div>
    <section class="mt-6">
      <EblInfo vertical>
        <EblInfoItem label="Recipient" has-input>
          <EblAvatarLabel
            logo="https://i.pravatar.cc/150?img=1"
            title="KTNETEBL1"
            subtitle="338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR"
            title-first
            size="x-lg"
          />
        </EblInfoItem>
      </EblInfo>
    </section>
    <VDivider thickness="12" class="section-divider my-6 mx-n6" />
    <EblBtn block color="outlined" height="44px" class="mb-3" @click="attachDocumentDialog = true"
      >Attach Documents</EblBtn
    >
    <EblBtn block color="outlined" height="44px" class="mb-6" @click="transactionDialog = true"
      >eBL Transaction</EblBtn
    >
    <EblSubHeader class="mb-3">
      <h2 class="fs-16">B/L History</h2>
    </EblSubHeader>
    <ul class="compose-history-list">
      <li
        v-for="(item, index) in historyList"
        :key="index"
        class="compose-history-item"
        @click="handleHistoryClick(item)"
      >
        <div class="logo">
          <img :src="item.logo" :alt="item.company" />
        </div>
        <div class="content">
          <div class="company">
            <p>{{ item.company }}</p>
            <span>{{ item.name }}</span>
          </div>
          <div class="status">
            <p :class="{ owner: item.isOwner }">
              {{ item.status }}
            </p>
            <span v-if="item.status !== 'Release Agent'">{{ item.date }}</span>
          </div>
        </div>
      </li>
    </ul>
    <VDivider thickness="12" class="section-divider my-6 mx-n6" />

    <EblSubHeader class="mb-3">
      <h2 class="fs-16">Comment</h2>
    </EblSubHeader>
    <EblTextarea v-model="envelopeComment" placeholder="요청 사항을 입력해 주세요." class="mb-6" />
    <div v-sticky="{ bottom: 0 }" class="ebl-floating-action d-flex ga-3">
      <EblBtn large class="flex-1" @click="handleReject">Reject</EblBtn>
      <EblBtn color="cta" large class="flex-1" @click="paperSignDialog = true">Approve</EblBtn>
    </div>

    <EblBottomSheet v-model="paperSignDialog" max-height="502" scrollable persistent>
      <VCard class="ebl-bottom-sheet__card paper-sign-sheet">
        <VCardTitle class="ebl-bottom-sheet__header">
          <span class="title">Paper Sign</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click="paperSignDialog = false">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>
        <VCardText class="ebl-bottom-sheet__text paper-sign-sheet__body">
          <div class="paper-sign-list">
            <div
              v-for="(sign, index) in signatureList"
              :key="index"
              class="paper-sign-item"
              :class="{ 'is-active': selectedSignature === index }"
              @click="selectedSignature = index"
            >
              <div class="paper-sign-item__radio" />
              <div class="paper-sign-item__thumbnail">
                <VImg
                  :src="`https://api.dicebear.com/9.x/identicon/svg?seed=${index + 10}`"
                  :alt="sign.name"
                  width="60"
                  cover
                />
              </div>
              <div class="paper-sign-item__info">
                <p class="paper-sign-item__name">{{ sign.name }}</p>
                <span class="paper-sign-item__size">{{ sign.size }}</span>
              </div>
            </div>
          </div>
        </VCardText>
        <VCardActions class="ebl-bottom-sheet__action">
          <EblBtn large block @click="paperSignDialog = false">Cancel</EblBtn>
          <EblBtn color="cta" large block @click="handleApprove">Select</EblBtn>
        </VCardActions>
      </VCard>
    </EblBottomSheet>

    <VDialog v-model="previewDialog" fullscreen scrollable content-class="ebl-full-dialog">
      <VCard class="ebl-full-dialog__card">
        <!-- 헤더 -->
        <VCardTitle class="ebl-full-dialog__header">
          <span class="title">eBL Preview</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click="previewDialog = false">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>
        <VCardText class="ebl-full-dialog__text">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              border-radius: 8px;
              background: #fafafa;
            "
          >
            Sample Box
          </div>
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog v-model="attachDocumentDialog" fullscreen scrollable content-class="ebl-full-dialog">
      <VCard class="ebl-full-dialog__card">
        <!-- 헤더 -->
        <VCardTitle class="ebl-full-dialog__header">
          <span class="title">Attach Documents</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click="closeAttachDialog">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>
        <VCardText class="ebl-full-dialog__text">
          <!-- 폴더 그리드 (2열 로우) -->
          <template v-for="(row, rowIndex) in attachFolderRows" :key="`row-${rowIndex}`">
            <div
              style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px"
            >
              <EblFolderItem
                v-for="folder in row"
                :key="folder.name"
                :name="folder.name"
                :files="folder.files"
                :is-active="expandedAttachFolder?.name === folder.name"
                @click="handleAttachFolderClick(folder)"
              />
            </div>
            <!-- 확장된 폴더 콘텐츠 (선택된 폴더 바로 아래 로우) -->
            <VExpandTransition>
              <div v-if="rowIndex === expandedAttachRowIndex && expandedAttachFolder?.files.length">
                <div class="file-list--expand-wrap mb-3">
                  <div v-if="expandedAttachFolder?.files.length" class="file-list">
                    <div
                      v-for="file in expandedAttachFolder.files"
                      :key="file.id"
                      class="file-item"
                    >
                      <div class="file-details">
                        <p class="file-name">{{ expandedAttachFolder.name }}_0{{ file.id }}.png</p>
                        <span class="file-meta">20 KB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </VExpandTransition>
          </template>
        </VCardText>
      </VCard>
    </VDialog>
    <VDialog v-model="transactionDialog" fullscreen scrollable content-class="ebl-full-dialog">
      <VCard class="ebl-full-dialog__card">
        <!-- 헤더 -->
        <VCardTitle class="ebl-full-dialog__header">
          <span class="title">Transaction Status</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click="transactionDialog = false">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>
        <VCardText class="ebl-full-dialog__text pt-0">
          <div v-sticky="0" class="ebl-header-box ebl-header-box--wrap pa-0">
            <div class="ebl-header-box__inner rounded-0">
              <div class="ebl-header-box__title">
                <h3>HDMUSKLM70328427</h3>
              </div>
              <div class="ebl-header-box__badge">
                <VTooltip location="top" scroll-strategy="close">
                  <template #activator="{ props }">
                    <span v-bind="props">
                      <EblBadge variant="tonal" color="mint">ISSUED</EblBadge>
                    </span>
                  </template>
                  <span>Sample Tooltip</span>
                </VTooltip>
                <VTooltip location="top" scroll-strategy="close">
                  <template #activator="{ props }">
                    <span v-bind="props">
                      <EblBadge variant="tonal" color="gray">ISSUE</EblBadge>
                    </span>
                  </template>
                  <span>Sample Tooltip</span>
                </VTooltip>
              </div>
            </div>
          </div>

          <!-- 트랜잭션 리스트 -->
          <div v-if="visibleTransactions.length > 0" class="ebl-tx-card--list mt-6">
            <EblTxCard
              v-for="tx in visibleTransactions"
              :key="tx.id"
              :transaction="tx"
              :is-expanded="expandedTransactionIdx === tx.id"
              @click="toggleTransaction(tx.id)"
            />
          </div>

          <!-- More 버튼 -->
          <div v-if="showMoreTransaction" class="ebl-more-list ebl-more-list--wrap mt-4">
            <EblBtn
              v-if="!isLoadingMoreTransaction"
              block
              class="ebl-more-list__btn"
              append-icon="ebli:chevron-bottom"
              @click="loadMoreTransaction"
            >
              More ({{ currentTransactionCount }} / {{ transactions.length }})
            </EblBtn>
            <div v-else class="ebl-more-list__loading">
              <Vue3Lottie animation-link="/lottie/loadingSpinner.json" :height="60" :width="120" />
            </div>
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'detail',
  appbarTitle: 'Envelope Detail',
})

// ============================================
// Store imports
// ============================================
const toastStore = useToastStore()

// ============================================
// 기본 상태
// ============================================
const previewDialog = ref(false)
const attachDocumentDialog = ref(false)
const transactionDialog = ref(false)
const paperSignDialog = ref(false)
const envelopeComment = ref('Hyundai Merchant Marine가 양도 요청을 하였습니다.')
const expandedAttachFolder = ref(null)
const selectedSignature = ref(0)

const signatureList = ref([
  { name: 'name.png', size: '20 KB' },
  { name: 'name.png', size: '20 KB' },
  { name: 'name.png', size: '20 KB' },
  { name: 'name.png', size: '20 KB' },
  { name: 'name.png', size: '20 KB' },
  { name: 'name.png', size: '20 KB' },
])

const handleReject = () => {
  toastStore.add({ text: 'Request rejected.' })
}

const handleApprove = () => {
  const selected = signatureList.value[selectedSignature.value]
  paperSignDialog.value = false
  toastStore.add({ text: `Approved with signature: ${selected.name}` })
}

// ============================================
// 폴더/첨부 관련
// ============================================
let loadingTimer = null

const createFiles = (count) => Array.from({ length: count }, (_, index) => ({ id: index + 1 }))

const folderItems = ref([
  { name: 'Commercial Invoice', files: createFiles(5) },
  { name: 'Packing List', files: createFiles(10) },
  { name: 'Insurance Policy', files: createFiles(2) },
  { name: 'Certificate of Origin', files: createFiles(0) },
  { name: 'Bill of Exchange', files: createFiles(2) },
  { name: 'Courier Waybill', files: createFiles(2) },
])

const handleAttachFolderClick = (folder) => {
  if (expandedAttachFolder.value?.name === folder.name) {
    expandedAttachFolder.value = null
    if (loadingTimer) {
      clearTimeout(loadingTimer)
      loadingTimer = null
    }
  } else {
    expandedAttachFolder.value = null
    if (loadingTimer) {
      clearTimeout(loadingTimer)
      loadingTimer = null
    }
    loadingTimer = setTimeout(() => {
      expandedAttachFolder.value = folder
      loadingTimer = null
    }, 300)
  }
}

const closeAttachDialog = () => {
  attachDocumentDialog.value = false
  expandedAttachFolder.value = null
}

// 폴더 로우 (2열) 구성
const attachFolderRows = computed(() => {
  const rows = []
  const items = folderItems.value
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2))
  }
  return rows
})

// 선택된 폴더가 속한 로우 인덱스
const expandedAttachRowIndex = computed(() => {
  if (!expandedAttachFolder.value) return -1
  return attachFolderRows.value.findIndex((row) =>
    row.some((item) => item.name === expandedAttachFolder.value?.name),
  )
})

// 히스토리 목록
const historyList = ref([
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'B/L ISSUE Carrier',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=1',
    isOwner: false,
  },
  {
    company: 'KTNETEBL1',
    name: 'Gil-Dong Hong',
    status: 'ENDORSE TO ORDER',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=2',
    isOwner: false,
  },
  {
    company: 'KTNETEBL1',
    name: 'Gil-Dong Hong',
    status: 'TRANSFER',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=3',
    isOwner: false,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'Current Owner',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=4',
    isOwner: true,
  },
  {
    company: 'KTNETEBL1',
    name: 'Gil-Dong Hong',
    status: 'Release Agent',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=5',
    isOwner: false,
  },
])

// ============================================
// 트랜잭션 관련 상태
// ============================================
const expandedTransactionIdx = ref(null)
const transactionPageSize = 10
const currentTransactionCount = ref(transactionPageSize)
const isLoadingMoreTransaction = ref(false)

// 샘플 트랜잭션 데이터
const TRANSACTION_TYPES = ['SACC', 'ENDORSE TO ORDER', 'TRANSFER']
const COMPANIES = [
  'Hyundai Merchant Marine',
  'HapagLloyd',
  'CJ Logistics Corporation',
  'Evergreen Line',
  'MSC',
  'COSCO',
  'KTNETEBL1',
  'APL Company Limited',
  'Maersk Line',
  'OOCL',
]

const transactions = ref(
  Array.from({ length: 100 }, (_, idx) => {
    const typeIdx = idx % TRANSACTION_TYPES.length
    const actorIdx = (idx + 1) % COMPANIES.length
    const recipientIdx = (idx + 2) % COMPANIES.length

    const day = String((idx % 28) + 1).padStart(2, '0')
    const hour = String((idx % 24) + 1).padStart(2, '0')
    const minute = String((idx % 60) + 5).padStart(2, '0')

    return {
      id: idx,
      type: TRANSACTION_TYPES[typeIdx],
      datetime: `2025-09-${day} ${hour}:${minute}:00`,
      actor: {
        name: COMPANIES[actorIdx],
        logo: `https://i.pravatar.cc/150?img=${(actorIdx % 50) + 1}`,
      },
      recipient: {
        name: COMPANIES[recipientIdx],
        logo: `https://i.pravatar.cc/150?img=${(recipientIdx % 50) + 1}`,
      },
      comments: [
        `[써렌더 요청 승인] Comment : Hyundai Merchant Marine의 써렌더 요청이 승인되었습니다.`,
      ],
    }
  }),
)

// ============================================
// 계산된 속성
// ============================================
const visibleTransactions = computed(() =>
  transactions.value.slice(0, currentTransactionCount.value),
)

const showMoreTransaction = computed(
  () =>
    transactions.value.length > transactionPageSize &&
    currentTransactionCount.value < transactions.value.length,
)

// ============================================
// 트랜잭션 메서드
// ============================================
const toggleTransaction = (txId) => {
  expandedTransactionIdx.value = expandedTransactionIdx.value === txId ? null : txId
}

const loadMoreTransaction = () => {
  if (isLoadingMoreTransaction.value) return
  isLoadingMoreTransaction.value = true
  setTimeout(() => {
    currentTransactionCount.value = Math.min(
      currentTransactionCount.value + transactionPageSize,
      transactions.value.length,
    )
    isLoadingMoreTransaction.value = false
  }, 1000)
}
</script>
