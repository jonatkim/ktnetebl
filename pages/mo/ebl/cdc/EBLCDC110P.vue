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
          <EblBadge variant="tonal" color="mint">ISSUED</EblBadge>              
          <EblBadge variant="tonal" color="gray">ISSUE</EblBadge>
          <!--2026.06.25추가-->
          <EblBadge v-if="isDangerous" color="dg" variant="outlined">
            <span>DG</span>
          </EblBadge>
        </div>
      </div>

      <div v-if="isDangerous" class="ebl-dg-notice-box">
        <div class="ebl-dg-notice-box__inner">
          <p>위험물정보는 PC환경에서 조회가 가능합니다.</p>
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
            avatar-bg="#ffffff"
            size="x-lg"
          />
        </EblInfoItem>
      </EblInfo>
    </section>
    <VDivider thickness="12" class="section-divider my-6 mx-n6" />
    <EblBtn block color="outlined" height="44px" class="mb-2" @click="transactionDialog = true"
      >eBL Transaction</EblBtn
    >

    <EblTabs
      v-model="activeTab"
      v-sticky="isDangerous ? 202 : 173"
      :items="[
        { label: 'B/L Info', value: 'bl' },
        { label: 'Container Info', value: 'container' },
        { label: 'T&C Info', value: 'tnc' },
      ]"
      no-wrap
      class="mx-n6 pt-4 px-6 mb-4"
    />
    <template v-if="activeTab === 'bl'">
      <VExpansionPanels
        v-model="blInfoPanels"
        variant="accordion"
        flat
        rounded="0"
        class="ebl-expansion-panels border"
        expand-icon="ebli:chevron-bottom"
        eager
      >
        <VExpansionPanel :value="1">
          <VExpansionPanelTitle>Document Party</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="ebl-detail">
              <div class="ebl-detail__item">
                <div class="ebl-detail__label">Shipper</div>
                <div class="ebl-detail__title">KTNETEBL1</div>
                <div class="ebl-detail__text">
                  338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR
                </div>
              </div>
              <div class="ebl-detail__item">
                <div class="ebl-detail__label">Consignee</div>
                <div class="ebl-detail__title">CJ Logistics Corporation</div>
                <div class="ebl-detail__text">1750 S Wolf Rd, Des Plaines, IL 60018, USA</div>
              </div>
              <div class="ebl-detail__item">
                <div class="ebl-detail__label">Notify Party</div>
                <div class="ebl-detail__title">CJ Logistics Corporation</div>
                <div class="ebl-detail__text mb-2">1750 S Wolf Rd, Des Plaines, IL 60018, USA</div>
                <div class="ebl-detail__title">CJ Logistics Corporation</div>
                <div class="ebl-detail__text mb-2">1750 S Wolf Rd, Des Plaines, IL 60018, USA</div>
                <div class="ebl-detail__title">CJ Logistics Corporation</div>
                <div class="ebl-detail__text">1750 S Wolf Rd, Des Plaines, IL 60018, USA</div>
              </div>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
        <VExpansionPanel :value="2">
          <VExpansionPanelTitle>B/L Detail</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="ebl-detail">
              <div class="ebl-detail__item">
                <div class="ebl-detail__label">Booking No</div>
                <div class="ebl-detail__title">KTNETEBL1</div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">B/L Type</div>
                  <div class="ebl-detail__title">BOL</div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Freight Term</div>
                  <div class="ebl-detail__title">PRE</div>
                </div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">B/L Type</div>
                  <div class="ebl-detail__title">BOL</div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Freight Term</div>
                  <div class="ebl-detail__title">PRE</div>
                </div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Planned Departure Date</div>
                  <div class="ebl-detail__title">2025-10-14</div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">To Service Term</div>
                  <div class="ebl-detail__title">2025-10-28</div>
                </div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Issued Place</div>
                  <div class="ebl-detail__title">KRPUS</div>
                  <div class="ebl-detail__text">(BUSAN, KOREA)</div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Paid At</div>
                  <div class="ebl-detail__title">KRPUS</div>
                  <div class="ebl-detail__text">(BUSAN, KOREA)</div>
                </div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Issue Date</div>
                  <div class="ebl-detail__title">2025-10-14</div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">On Board Date</div>
                  <div class="ebl-detail__title">2025-10-14</div>
                </div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">IsToOrder</div>
                  <div class="ebl-detail__title">Y</div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Endorsement Type</div>
                  <div class="ebl-detail__title">Endorse</div>
                </div>
              </div>

              <div class="ebl-detail__item">
                <div class="ebl-detail__label">Endorsee</div>
                <div class="ebl-detail__title">
                  <EblAvatarLabel
                    logo="https://i.pravatar.cc/150?img=1"
                    title="APL Company Limited"
                    subtitle="338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR"
                    title-first
                    avatar-bg="#ffffff"
                    size="lg"
                  />
                </div>
              </div>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
        <VExpansionPanel :value="3">
          <VExpansionPanelTitle>Routing & Value</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="ebl-detail">
              <div class="ebl-detail__item">
                <div class="ebl-detail__label">Carrier</div>
                <div class="ebl-detail__title">
                  <EblAvatarLabel
                    logo="https://i.pravatar.cc/150?img=2"
                    title="HMM Company Limited"
                    subtitle="338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR"
                    title-first
                    avatar-bg="#ffffff"
                    size="lg"
                  />
                </div>
              </div>
              <div class="ebl-detail__item">
                <div class="ebl-detail__label">Vessel</div>
                <div class="ebl-detail__title">SEASPAN BELLWETHER</div>
              </div>
              <div class="ebl-detail__item">
                <div class="ebl-detail__label">Origin Cargo Type</div>
                <div class="ebl-detail__title">0060E</div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">From Service Term</div>
                  <div class="ebl-detail__title">CY</div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">To Service Team</div>
                  <div class="ebl-detail__title">CY</div>
                </div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Place of Receipt</div>
                  <div class="ebl-detail__title">KRPUS</div>
                  <div class="ebl-detail__text">(BUSAN, KOREA)</div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Port of Load</div>
                  <div class="ebl-detail__title">KRPUS</div>
                  <div class="ebl-detail__text">(BUSAN, KOREA)</div>
                </div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Port of Discharge</div>
                  <div class="ebl-detail__title">USBOS</div>
                  <div class="ebl-detail__text">(BOSTON, MA)</div>
                </div>

                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Place of Delivery</div>
                  <div class="ebl-detail__title">USBOS</div>
                  <div class="ebl-detail__text">(BOSTON, MA)</div>
                </div>
              </div>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
        <VExpansionPanel :value="4">
          <VExpansionPanelTitle>Cargo Info</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="ebl-detail">
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Origin Cargo Type</div>
                  <div class="ebl-detail__title">FCL</div>
                </div>

                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Destination Cargo Type</div>
                  <div class="ebl-detail__title">FCL</div>
                </div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">HS Code</div>
                  <div class="ebl-detail__title">420292</div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Total Weight / UNIT</div>
                  <div class="ebl-detail__title">
                    21183.47
                    <small>KGM</small>
                  </div>
                </div>
              </div>
              <div class="ebl-detail__row">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Total Volume / UNIT</div>
                  <div class="ebl-detail__title">
                    60.548
                    <small>MTQ</small>
                  </div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Total Package / UNIT</div>
                  <div class="ebl-detail__title">
                    60.548
                    <small>PKG</small>
                  </div>
                </div>
              </div>
              <div class="ebl-detail__item">
                <div class="ebl-detail__label">Description of Goods</div>
                <div class="ebl-detail__text">
                  “SHIPPER'S LOAD, COUNT, SEALED & WEIGHT S.T.C”<br />
                  1 X 40''H DV CONTAINER<br />
                  303 PACKAGES<br />
                  HMMU6431138 / 24H0354452 / 40HC / 30 3PKG / 21183.47 KGS / 60.548 CBM<br />
                  BLUE BACKPACK LB MOCHILA DAV<br />
                  PO.102286561-10 SAP 210106103 590 PCS<br />
                  MARCA : LABEL<br />
                  Total Number of Container or Packages(in words) : ONE(1) CONTAINER ONLY<br />
                </div>
              </div>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </template>
    <template v-else-if="activeTab === 'container'">
      <EblSelect
        v-model="selectedContainerIndex"
        block
        :options="['HMMU6431138', 'HMMU6431139', 'HMMU6431140']"
      />
      <EblInfo vertical label-color="#6B7C93" class="mt-6 ga-2">
        <EblInfoItem label="Container No" has-input>HMMU6431138</EblInfoItem>
        <VDivider />
        <EblInfoItem label="Seal No" has-input>24H0354452</EblInfoItem>
        <VDivider />
        <EblInfoItem label="Size / Type" has-input>24H0354452</EblInfoItem>
        <VDivider />
        <EblInfoItem label="PKG / Unit" has-input>21183.47 / MTQ</EblInfoItem>
        <VDivider />
        <EblInfoItem label="Gross Weight" has-input>303 / MTQ</EblInfoItem>
        <VDivider />
        <EblInfoItem label="Tare" has-input>3800 /</EblInfoItem>
        <VDivider />
        <EblInfoItem label="VGM" has-input>21183.47</EblInfoItem>
        <VDivider />
        <EblInfoItem label="Volume / Unit" has-input>60.548 / MTQ</EblInfoItem>
        <VDivider />
        <EblInfoItem label="S/C" has-input>S</EblInfoItem>
        <VDivider />
        <EblInfoItem label="RF" has-input>N</EblInfoItem>
        <VDivider />
        <EblInfoItem label="Temp / Unit" has-input>-</EblInfoItem>
        <VDivider />
        <EblInfoItem label="DG Name" has-input>-</EblInfoItem>
        <VDivider />
        <EblInfoItem label="IMDG" has-input>-</EblInfoItem>
      </EblInfo>
    </template>
    <template v-else-if="activeTab === 'tnc'">
      <VExpansionPanels
        v-model="tncPanels"
        variant="accordion"
        flat
        rounded="0"
        class="ebl-expansion-panels border"
        expand-icon="ebli:chevron-bottom"
        eager
      >
        <VExpansionPanel :value="0">
          <VExpansionPanelTitle>T&C</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="ebl-detail">
              <div class="ebl-detail__item">
                <div class="ebl-detail__title">CONTAINER BILL OF LADING</div>
                <div class="ebl-detail__text">
                  Received by the Carrier or Subcontractor from the Merchant in apparent good order
                  and condition unless otherwise indicated, the Goods, or the containers packages
                  said to...
                </div>
              </div>
              <div class="ebl-detail__item">
                <div class="ebl-detail__title">1. DEFINITIONS</div>
                <div class="ebl-detail__text">When used in this Bill of Lading :</div>
              </div>
              <div class="ebl-detail__item">
                <div class="ebl-detail__title">2. CLAUSE PARAMOUNT</div>
                <div class="ebl-detail__text">
                  (A) Except as provided in (B) below, the international Convention for the
                  Unification of ...
                </div>
              </div>
              <div class="ebl-detail__item">
                <div class="ebl-detail__title">9. GOVERNING LAW AND JURISDICTION</div>
                <div class="ebl-detail__text">
                  (A) Any claims arising from or in connection with or relating to this Bill of
                  Lading shall ...
                </div>
              </div>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
        <VExpansionPanel :value="1">
          <VExpansionPanelTitle>Additional T&C</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="ebl-detail">
              <div class="ebl-detail__item">
                <div class="ebl-detail__text">message</div>
              </div>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
        <VExpansionPanel :value="2">
          <VExpansionPanelTitle>Additional Comment</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="ebl-detail">
              <div class="ebl-detail__item">
                <div class="ebl-detail__text">-</div>
              </div>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </template>
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
        <VCardActions class="ebl-full-dialog__actions">
          <EblBtn large block outlined class="download">Download</EblBtn>
        </VCardActions>
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
                <EblBadge variant="tonal" color="mint">ISSUED</EblBadge>
            
                <EblBadge variant="tonal" color="gray">ISSUE</EblBadge>
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router' // 2026.06.25 추가
const route = useRoute() // 2026.06.25 추가
// 2026.06.25 추가: 라우터 쿼리 스트링 값을 읽어와 현재 데이터가 위험물인지 판단 (기본값 'N')
const isDangerous = computed(() => route.query.isDg === 'Y')

// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'detail',
  appbarTitle: 'B/L Details',
})

// ============================================
// 기본 상태
// ============================================
const activeTab = ref('bl')
const blInfoPanels = ref(1)
const tncPanels = ref(0)
const selectedContainerIndex = ref(0)
const previewDialog = ref(false)
const transactionDialog = ref(false)

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
<style scoped>
.ebl-dg-notice-box {
  width: 100%;
  background-color: #FFF0F0 !important;
  margin-top: -8px;
  border-radius:0px 0px 8px 8px; overflow:hidden;
}

.ebl-dg-notice-box__inner {
  background-color: #FFF0F0 !important;
  border-radius: 4px;
  padding: 16px 24px 8px;
  text-align: center;
  margin-top: -8px;
}

.ebl-dg-notice-box__inner p {
  color: #FF1C1C !important; /* 시안의 위험물 강조 레드 컬러 */
  font-size: 14px;
  font-weight: 500;
  margin: 0 !important;
  line-height: 1.4;
}

/* 리스트 페이지에서 등록했던 정규 테마 클래스(--dg) 스타일을 상세 페이지에도 연동 */
:deep(.ebl-badge--dg) {
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  padding-right: 28px !important; /* 느낌표 아이콘 공간 */
  position: relative !important;
  background: transparent !important;
  border: 1px solid #FF1C1C !important;
  color: #FF1C1C !important;
}

:deep(.ebl-badge--dg)::after {
  content: '' !important;
  display: block !important;
  width: 16px !important;
  height: 16px !important;
  position: absolute !important;
  right: 6px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  background: url('/images/badgeExclamation.svg') no-repeat 50% 50% !important;
  background-size: contain !important;
}
</style>