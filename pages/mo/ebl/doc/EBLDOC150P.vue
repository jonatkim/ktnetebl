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
            logo="https://api.dicebear.com/9.x/identicon/svg?seed=9"
            title="KTNETEBL1"
            subtitle="338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR"
            title-first
            avatar-bg="#ffffff"
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
    <div v-sticky="{ bottom: 0 }" class="ebl-floating-action">
      <EblBtn color="cta" block large @click="eblRequestTypeDialog = true">Request</EblBtn>
    </div>

    <EblBottomSheet v-model="eblRequestTypeDialog" persistent>
      <VCard class="ebl-bottom-sheet__card">
        <VCardTitle class="ebl-bottom-sheet__header">
          <span class="title">eBL Request</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click.stop="closeRequestDialog">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>
        <VCardText class="ebl-bottom-sheet__text">
          <EblOptionGroup
            v-model="eblRequestType"
            :options="requestOptions"
            multiple
            title="Please select a request type for the carrier"
            vertical
          />
        </VCardText>
      </VCard>
    </EblBottomSheet>
    <EblBottomSheet v-model="eblRequestDialog" persistent>
      <VCard class="ebl-bottom-sheet__card">
        <VCardTitle class="ebl-bottom-sheet__header">
          <span class="title">eBL Request</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click.stop="closeRequestDialog">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>
        <VCardText class="ebl-bottom-sheet__text">
          <EblCardItem
            :item="{
              blNo: 'HDMUSELM703284201DPBL',
              shipper: {
                logo: 'https://api.dicebear.com/9.x/identicon/svg?seed=10',
                name: 'Hyundai Merchant Marine',
              },
              requestText: 'Transfer of Possession',
              routeFrom: 'BUSAN, KOREA',
              routeTo: 'BOSTON, MA',
              routeFromCode: 'KRBUS',
              routeToCode: 'USBOS',
              date: '2026-02-01 15:15:00',
            }"
            outlined
            class="mb-5"
          />
          <EblInfo vertical>
            <EblInfoItem label="Request Type" has-input>
              <EblSelect
                v-model="eblRequestTypeIndex"
                option-size="md"
                block
                :options="[
                  {
                    label: 'Surrender for Amendment',
                    value: 'Amendment',
                  },
                  {
                    label: 'Switch to Paper',
                    value: 'Paper',
                  },
                  {
                    label: 'Surrender for Delivery',
                    value: 'Delivery',
                  },
                ]"
              />
            </EblInfoItem>
            <EblInfoItem label="Comment" has-input>
              <EblTextarea
                v-model="requestComment"
                placeholder="요청 사항을 입력해 주세요."
                :maxlength="1000"
                counter
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>
        <VCardActions class="ebl-bottom-sheet__action">
          <EblBtn large block @click.stop="closeRequestDialog">Cancel</EblBtn>
          <EblBtn color="cta" large block @click="submitRequest">Submit</EblBtn>
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
const dialogStore = useDialogStore()
const toastStore = useToastStore()

// ============================================
// 기본 상태
// ============================================
const previewDialog = ref(false)
const attachDocumentDialog = ref(false)
const transactionDialog = ref(false)
const envelopeComment = ref('Hyundai Merchant Marine가 양도 요청을 하였습니다.')
const eblRequestTypeDialog = ref(false)
const expandedAttachFolder = ref(null)
const requestOptions = ref([
  { label: 'Amendment', value: 'Amendment' },
  { label: 'Paper', value: 'Paper' },
  { label: 'Delivery', value: 'Delivery' },
])
const eblRequestType = ref([])
const eblRequestDialog = ref(false)
const requestComment = ref('')

const eblRequestTypeIndex = computed({
  get: () => {
    const current = Array.isArray(eblRequestType.value)
      ? eblRequestType.value[0]
      : eblRequestType.value
    return requestOptions.value.findIndex((opt) => opt.value === current)
  },
  set: (index) => {
    const option = requestOptions.value[index]
    eblRequestType.value = option ? [option.value] : []
  },
})

// eblRequestType이 변경되면 다이얼로그 전환
watch(eblRequestType, (newValue) => {
  if (!Array.isArray(newValue) || newValue.length === 0) return

  eblRequestTypeDialog.value = false
  setTimeout(() => {
    eblRequestDialog.value = true
  }, 300) // 바텀시트 닫힘 애니메이션 후 오픈
})

const closeRequestDialog = () => {
  eblRequestDialog.value = false
  eblRequestTypeDialog.value = false
  eblRequestType.value = []
  requestComment.value = ''
}

const submitRequest = async () => {
  const requestType = eblRequestType.value[0]

  // 요청 타입에 따른 메시지 매핑
  const confirmMessages = {
    Amendment: {
      title: 'Surrender for Amendment',
      message: 'Request an amendment for this document? It will be surrendered for correction.',
      successMessage: 'Surrender for amendment has been submitted',
    },
    Paper: {
      title: 'Switch to Paper',
      message: 'Switch to a paper document? The electronic version will be surrendered.',
      successMessage: 'Switch to paper B/L has been requested.',
    },
    Delivery: {
      title: 'Surrender for Delivery',
      message: 'Surrender this document for delivery? This action cannot be undone.',
      successMessage: 'Surrender for delivery has been submitted.',
    },
  }

  const config = confirmMessages[requestType]
  if (!config) return

  // 컨펌 다이얼로그 표시
  const result = await dialogStore.showConfirm({
    title: config.title,
    message: config.message,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  })

  // 확인 버튼을 클릭했을 경우
  if (result) {
    eblRequestDialog.value = false
    toastStore.add({ text: config.successMessage })
    eblRequestType.value = []
    requestComment.value = ''
  }
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
    logo: 'https://api.dicebear.com/9.x/identicon/svg?seed=1',
    isOwner: false,
  },
  {
    company: 'KTNETEBL1',
    name: 'Gil-Dong Hong',
    status: 'ENDORSE TO ORDER',
    date: '2025-09-01 15:00:00',
    logo: 'https://api.dicebear.com/9.x/identicon/svg?seed=2',
    isOwner: false,
  },
  {
    company: 'KTNETEBL1',
    name: 'Gil-Dong Hong',
    status: 'TRANSFER',
    date: '2025-09-01 15:00:00',
    logo: 'https://api.dicebear.com/9.x/identicon/svg?seed=3',
    isOwner: false,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'Current Owner',
    date: '2025-09-01 15:00:00',
    logo: 'https://api.dicebear.com/9.x/identicon/svg?seed=4',
    isOwner: true,
  },
  {
    company: 'KTNETEBL1',
    name: 'Gil-Dong Hong',
    status: 'Release Agent',
    date: '2025-09-01 15:00:00',
    logo: 'https://api.dicebear.com/9.x/identicon/svg?seed=5',
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
        logo: `https://api.dicebear.com/9.x/identicon/svg?seed=${(actorIdx % 50) + 1}`,
      },
      recipient: {
        name: COMPANIES[recipientIdx],
        logo: `https://api.dicebear.com/9.x/identicon/svg?seed=${(recipientIdx % 50) + 1}`,
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
