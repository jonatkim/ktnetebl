<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo" />

    <div class="ebl-card-container">
      <!-- View Type Tabs -->
      <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      <!-- Status Filter Tabs -->
      <EblTabs v-model="statusTab" :items="statusTabItems" variant="pill" stretch class="mt-6" />

      <!-- EblSubHeader -->
      <EblSubHeader class="mt-6">
        <h2>Total</h2>
        <span class="count">{{ formatNumber(filteredRowData.length) }}</span>
      </EblSubHeader>

      <!-- 필터 영역 -->
      <div class="ebl-page-filters">
        <EblInput
          v-model="filters.companyName"
          clearable
          placeholder="Company Name"
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblInput
          v-model="filters.blNo"
          clearable
          placeholder="B/L No"
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblDatePicker
          v-model="filters.dateRange"
          range
          clearable
          auto-apply
          placeholder="Received Date"
          :start-date="filters.dateRange?.[0]"
          :focus-start-date="true"
          style="width: 260px"
        />
        <EblBtn outlined @click="applyFilters">Search</EblBtn>
        <EblBtn icon="ebli:refresh" outlined @click="resetFilters" />
      </div>

      <!-- Tab Content: List View -->
      <template v-if="activeTab === 'list'">
        <!-- AG Grid - List View -->
        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="paginatedRowData"
          :column-defs="listColDefs"
          :dom-layout="'autoHeight'"
          @grid-ready="onGridReady"
          @cell-clicked="onCellClicked"
        />
      </template>

      <!-- Tab Content: Grid View -->
      <template v-else-if="activeTab === 'grid'">
        <!-- Grid View Container -->
        <div class="ebl-grid-view ebl-grid-view--wrap">
          <EblGridViewItem
            v-for="(item, index) in paginatedRowData"
            :key="index"
            :bl-no="item.blNo"
            :company-name="item.companyName"
            :bl-status="item.blStatus"
            :transaction-status="item.transactionStatus"
            :routing="item.routing"
            :received-date="item.receivedDate"
            @click="onGridItemClick(item)"
          />
        </div>
      </template>

      <!-- Pagination -->
      <div class="ebl-pagination--container mt-3">
        <div>
          Count
          <EblSelect
            v-model="itemsPerPage"
            placeholder="Items per page"
            :options="itemsPerPageOptions"
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

      <!-- Detail Dialog -->
      <EblDialog
        v-model="dialogOpen"
        transition="slide-x-reverse-transition"
        content-class="ebl-dialog ebl-dialog--multiple fill-height"
        :persistent="transactionStatusOpen || previewOpen"
        scrollable
        @close="closeDialog"
      >
        <VCard width="700" class="ebl-dialog__card">
          <VCardTitle class="ebl-dialog__header">
            <span class="title">B/L Details</span>
            <VSpacer />
            <EblBtn icon pill small @click="closeDialog">
              <VIcon icon="ebli:close" :size="20" />
            </EblBtn>
          </VCardTitle>

          <VCardText class="ebl-dialog__text overflow-y-auto">
            <div class="ebl-card-linear pa-4 d-flex ga-8 mb-3">
              <h3 class="title blue-text flex-1">HDMUSKLM70328427</h3>
              <div class="ebl-card-linear__utils">
                <EblBadge color="mint" variant="tonal">ISSUED</EblBadge>
                <EblBadge color="gray" variant="tonal">ENDORSE TO ORDER</EblBadge>
              </div>
            </div>

            <div class="ebl-card-linear py-5 px-6 mb-5">
              <EblInfoItem vertical label="Recipient" content-class="py-0">
                <EblAvatarLabel
                  logo="https://i.pravatar.cc/150?img=1"
                  title="KTNETEBL1"
                  subtitle="338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR"
                  title-first
                  avatar-bg="#ffffff"
                />
              </EblInfoItem>
            </div>
            <EblTabs
              v-model="detailTab"
              :items="[
                { value: 'blInfo', label: 'B/L Info' },
                { value: 'containerInfo', label: 'Container Info' },
                { value: 'tAndCInfo', label: 'T&C Info' },
              ]"
              size="lg"
              class="mb-5"
            />
            <template v-if="detailTab === 'blInfo'">
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
                  <VExpansionPanelTitle>
                    <span class="ebl-expansion-panel__question">Document Party</span>
                  </VExpansionPanelTitle>
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
                        <div class="ebl-detail__text">
                          1750 S Wolf Rd, Des Plaines, IL 60018, USA
                        </div>
                      </div>
                      <div class="ebl-detail__item">
                        <div class="ebl-detail__label">Notify Party</div>
                        <div class="ebl-detail__title">CJ Logistics Corporation</div>
                        <div class="ebl-detail__text mb-2">
                          1750 S Wolf Rd, Des Plaines, IL 60018, USA
                        </div>
                        <div class="ebl-detail__title">CJ Logistics Corporation</div>
                        <div class="ebl-detail__text mb-2">
                          1750 S Wolf Rd, Des Plaines, IL 60018, USA
                        </div>
                        <div class="ebl-detail__title">CJ Logistics Corporation</div>
                        <div class="ebl-detail__text">
                          1750 S Wolf Rd, Des Plaines, IL 60018, USA
                        </div>
                      </div>
                    </div>
                  </VExpansionPanelText>
                </VExpansionPanel>
                <VExpansionPanel :value="2">
                  <VExpansionPanelTitle>
                    <span class="ebl-expansion-panel__question">B/L Detail</span>
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <div class="ebl-detail">
                      <div class="ebl-detail__item">
                        <div class="ebl-detail__label">Booking No</div>
                        <div class="ebl-detail__title">KTNETEBL1</div>
                      </div>
                      <div class="d-flex ga-4">
                        <div class="ebl-detail flex-1">
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">B/L Type</div>
                            <div class="ebl-detail__title">BOL</div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Planned Departure Date</div>
                            <div class="ebl-detail__title">2025-10-14</div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Issued Place</div>
                            <div class="ebl-detail__title">
                              KRPUS
                              <small>(BUSAN, KOREA)</small>
                            </div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Issue Date</div>
                            <div class="ebl-detail__title">2025-10-14</div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">IsToOrder</div>
                            <div class="ebl-detail__title">Y</div>
                          </div>
                        </div>
                        <div class="ebl-detail flex-1">
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Freight Term</div>
                            <div class="ebl-detail__title">PRE</div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">To Service Term</div>
                            <div class="ebl-detail__title">2025-10-28</div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Paid At</div>
                            <div class="ebl-detail__title">
                              KRPUS
                              <small>(BUSAN, KOREA)</small>
                            </div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">On Board Date</div>
                            <div class="ebl-detail__title">2025-10-14</div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Endorsement Type</div>
                            <div class="ebl-detail__title">Endorse</div>
                          </div>
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
                          />
                        </div>
                      </div>
                    </div>
                  </VExpansionPanelText>
                </VExpansionPanel>
                <VExpansionPanel :value="3">
                  <VExpansionPanelTitle>
                    <span class="ebl-expansion-panel__question">Routing & Value</span>
                  </VExpansionPanelTitle>
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
                          />
                        </div>
                      </div>
                      <div class="d-flex ga-4">
                        <div class="ebl-detail flex-1">
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Vessel</div>
                            <div class="ebl-detail__title">SEASPAN BELLWETHER</div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">From Service Term</div>
                            <div class="ebl-detail__title">CY</div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Place of Receipt</div>
                            <div class="ebl-detail__title">
                              KRPUS
                              <small>(BUSAN, KOREA)</small>
                            </div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Port of Discharge</div>
                            <div class="ebl-detail__title">
                              USBOS
                              <small>(BOSTON, MA)</small>
                            </div>
                          </div>
                        </div>
                        <div class="ebl-detail flex-1">
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Origin Cargo Type</div>
                            <div class="ebl-detail__title">0060E</div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">To Service Team</div>
                            <div class="ebl-detail__title">CY</div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Port of Load</div>
                            <div class="ebl-detail__title">
                              KRPUS
                              <small>(BUSAN, KOREA)</small>
                            </div>
                          </div>
                          <div class="ebl-detail__item">
                            <div class="ebl-detail__label">Place of Delivery</div>
                            <div class="ebl-detail__title">
                              USBOS
                              <small>(BOSTON, MA)</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </VExpansionPanelText>
                </VExpansionPanel>
                <VExpansionPanel :value="4">
                  <VExpansionPanelTitle>
                    <span class="ebl-expansion-panel__question">Cargo Info</span>
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <div class="ebl-detail">
                      <div class="d-flex ga-4">
                        <div class="ebl-detail__item flex-1">
                          <div class="ebl-detail__label">Origin Cargo Type</div>
                          <div class="ebl-detail__title">FCL</div>
                        </div>
                        <div class="ebl-detail__item flex-1">
                          <div class="ebl-detail__label">Destination Cargo Type</div>
                          <div class="ebl-detail__title">FCL</div>
                        </div>
                        <div class="ebl-detail__item flex-1">
                          <div class="ebl-detail__label">HS Code</div>
                          <div class="ebl-detail__title">420292</div>
                        </div>
                      </div>
                      <div class="d-flex ga-4">
                        <div class="ebl-detail__item flex-1">
                          <div class="ebl-detail__label">Total Weight / UNIT</div>
                          <div class="ebl-detail__title">
                            21183.47
                            <small>KGM</small>
                          </div>
                        </div>
                        <div class="ebl-detail__item flex-1">
                          <div class="ebl-detail__label">Total Volume / UNIT</div>
                          <div class="ebl-detail__title">
                            60.548
                            <small>MTQ</small>
                          </div>
                        </div>
                        <div class="ebl-detail__item flex-1">
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
                          "SHIPPER'S LOAD, COUNT, SEALED & WEIGHT S.T.C"<br />
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
            <template v-else-if="detailTab === 'containerInfo'">
              <div class="ebl-card-linear d-flex" style="height: 634px">
                <EblContainerList
                  v-model="selectedContainer"
                  :list="containerList"
                  class="border-right"
                />
                <div class="flex-1 pa-5">
                  <template v-if="selectedContainer">
                    <EblInfo>
                      <EblInfoItem label="Container No">{{
                        selectedContainer.containerNo
                      }}</EblInfoItem>
                      <EblInfoItem label="Seal No">{{ selectedContainer.sealNo }}</EblInfoItem>
                      <EblInfoItem label="Size / Type">{{
                        selectedContainer.sizeType
                      }}</EblInfoItem>
                      <EblInfoItem label="PKG / Unit">{{ selectedContainer.pkgUnit }}</EblInfoItem>
                      <EblInfoItem label="Gross Weight"
                        >{{ selectedContainer.grossWeight }} / MTQ</EblInfoItem
                      >
                      <EblInfoItem label="Tare">{{ selectedContainer.tare }}</EblInfoItem>
                      <EblInfoItem label="VGM">{{ selectedContainer.netWeight }}</EblInfoItem>
                      <EblInfoItem label="Volume / Unit">{{
                        selectedContainer.volumeUnit
                      }}</EblInfoItem>
                      <EblInfoItem label="S/C">{{ selectedContainer.sc }}</EblInfoItem>
                      <EblInfoItem label="RF">{{ selectedContainer.rf }}</EblInfoItem>
                      <EblInfoItem label="Temp / Unit">{{
                        selectedContainer.tempUnit
                      }}</EblInfoItem>
                      <EblInfoItem label="DG Name">{{ selectedContainer.dgName }}</EblInfoItem>
                      <EblInfoItem label="IMDG">{{ selectedContainer.imdg }}</EblInfoItem>
                    </EblInfo>
                  </template>
                  <template v-else>
                    <div
                      class="text-center py-5"
                      style="color: var(--text-subtle); padding-top: 150px"
                    >
                      Select a container to view details
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <template v-else-if="detailTab === 'tAndCInfo'">
              <div class="ebl-terms-list mb-6">
                <div v-for="term in termsData" :key="term.title" class="ebl-terms-list__item">
                  <div class="ebl-terms-list__title">{{ term.title }}</div>
                  <div class="ebl-terms-list__text">{{ term.description }}</div>
                </div>
              </div>
              <div class="ebl-detail">
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Additional T&C</div>
                  <div class="ebl-detail__title">
                    <EblTextarea
                      v-model="additionalTC"
                      :rows="6"
                      placeholder="텍스트를 입력하세요"
                      readonly
                    />
                  </div>
                </div>
                <div class="ebl-detail__item">
                  <div class="ebl-detail__label">Additional Comment</div>
                  <div class="ebl-detail__title">
                    <EblTextarea
                      v-model="additionalComment"
                      :rows="6"
                      placeholder="텍스트를 입력하세요"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </template>
          </VCardText>

          <VCardActions class="ebl-dialog__actions">
            <EblBtn outlined large @click="togglePreview">Preview</EblBtn>
            <VSpacer />
            <EblBtn outlined large @click="toggleTransactionStatus">eBL Transaction</EblBtn>
          </VCardActions>
        </VCard>
        <!-- Transaction Status Dialog -->
        <VSlideXReverseTransition leave-absolute>
          <VCard v-if="transactionStatusOpen" width="914" class="ebl-dialog__card">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">Transaction Status</span>
              <VSpacer />
              <EblBtn icon pill small @click="transactionStatusOpen = false">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>

            <VCardText class="ebl-dialog__text">
              <table class="ebl-table-grid">
                <colgroup>
                  <col />
                  <col />
                  <col width="220px" />
                  <col width="220px" />
                  <col width="52px" />
                </colgroup>
                <thead>
                  <tr>
                    <th>Transaction Status</th>
                    <th>Last Update</th>
                    <th>Actor</th>
                    <th>Recipient</th>
                    <th class="toggle" />
                  </tr>
                </thead>
                <tbody>
                  <template v-for="row in computedTransactions" :key="row.id">
                    <tr
                      class="ebl-table-grid__row"
                      :class="{ 'is-open': isTransactionRowOpen(row.id) }"
                      @click="toggleTransactionRow(row.id)"
                    >
                      <td class="ebl-table-grid__cell">
                        {{ row.status }}
                      </td>
                      <td class="ebl-table-grid__cell">{{ row.lastUpdate }}</td>
                      <td class="ebl-table-grid__cell">
                        <EblAvatarLabel
                          v-tooltip:top="row.actor"
                          size="sm"
                          logo="https://i.pravatar.cc/150?img=1"
                          :title="row.actor"
                          title-first
                        />
                      </td>
                      <td class="ebl-table-grid__cell">
                        <EblAvatarLabel
                          v-tooltip:top="row.recipient"
                          size="sm"
                          logo="https://i.pravatar.cc/150?img=1"
                          :title="row.recipient"
                          title-first
                        />
                      </td>
                      <td class="ebl-table-grid__cell ebl-table-grid__cell--toggle">
                        <VIcon
                          icon="ebli:chevron-bottom"
                          size="20"
                          :class="{ 'rotate-180': isTransactionRowOpen(row.id) }"
                        />
                      </td>
                    </tr>
                    <tr
                      class="ebl-table-grid__detail-row"
                      :class="{ 'is-open': isTransactionRowOpen(row.id) }"
                    >
                      <td colspan="5">
                        <ul v-if="row.isOpen" class="ebl-table-grid__detail-list">
                          <li v-for="(detail, idx) in row.details" :key="idx">
                            {{ detail }}
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </VCardText>
          </VCard>
          <VCard v-if="previewOpen" width="700" class="ebl-dialog__card">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">eBL Preview</span>
              <VSpacer />
              <EblBtn icon pill small @click="previewOpen = false">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>
            <VCardText class="ebl-dialog__text"> eBL Preview Content<br /> </VCardText>
            <VCardActions class="ebl-dialog__actions">
              <EblBtn color="cta" large>Download</EblBtn>
            </VCardActions>
          </VCard>
        </VSlideXReverseTransition>
      </EblDialog>
    </div>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { AgGridVue } from 'ag-grid-vue3'
import CompanyNameCellRenderer from '~/components/grid/CompanyNameCellRenderer.vue'
import BadgeCellRenderer from '~/components/grid/BadgeCellRenderer.vue'
import RoutingCodeCellRenderer from '~/components/grid/RoutingCodeCellRenderer.vue'
import EblGridViewItem from '~/components/grid/EblGridViewItem.vue'

const { formatNumber } = useFormat()
const gridApi = shallowRef(null)
const dialogOpen = ref(false)
const activeTab = ref('list')
const statusTab = ref('_all')
const detailTab = ref('blInfo')
const blInfoPanels = ref(1)
const transactionStatusOpen = ref(false)
const previewOpen = ref(false)
const detailRow = ref(null)
const selectedContainer = ref(null)

const pageInfo = ref({
  title: 'Inbox',
  breadcrumbItems: [{ text: 'Main' }, { text: 'Documents' }, { text: 'Inbox' }],
})

// 보기 탭 (List/Grid)
const tabItems = [
  { label: 'List View', value: 'list', icon: 'ebli:list' },
  { label: 'Grid View', value: 'grid', icon: 'ebli:grid' },
]
// 상태 필터 탭
const statusTabItems = computed(() =>
  blStatusOptions.map((opt) => ({ label: opt.label, value: opt.value })),
)

// 페이지네이션 (List/Grid 뷰별)
const listPage = ref(1)
const listItemsPerPage = ref(10)
const gridPage = ref(1)
const gridItemsPerPage = ref(12)

// 현재 탭에 따른 페이지 번호
const page = computed({
  get: () => (activeTab.value === 'list' ? listPage.value : gridPage.value),
  set: (val) => {
    if (activeTab.value === 'list') listPage.value = val
    else gridPage.value = val
  },
})

const itemsPerPage = computed({
  get: () => (activeTab.value === 'list' ? listItemsPerPage.value : gridItemsPerPage.value),
  set: (val) => {
    if (activeTab.value === 'list') {
      listItemsPerPage.value = val
      listPage.value = 1
    } else {
      gridItemsPerPage.value = val
      gridPage.value = 1
    }
  },
})

// 탭별 항목 수 옵션
const itemsPerPageOptions = computed(() => {
  if (activeTab.value === 'list') {
    return [
      { label: '10', value: 10 },
      { label: '20', value: 20 },
      { label: '50', value: 50 },
      { label: '100', value: 100 },
    ]
  } else {
    return [
      { label: '12', value: 12 },
      { label: '24', value: 24 },
      { label: '48', value: 48 },
      { label: '96', value: 96 },
    ]
  }
})

// 상태 옵션
const blStatusOptions = [
  { label: 'All', value: '_all' },
  { label: 'ISSUED', value: 'ISSUED' },
  { label: 'AMENDING', value: 'AMENDING' },
  { label: 'SWITCHING', value: 'SWITCHING' },
  { label: 'DELIVERY', value: 'DELIVERY' },
  { label: 'ENDORSE', value: 'ENDORSE' },
  { label: 'PENDING', value: 'PENDING' },
  { label: 'VOIDED', value: 'VOIDED' },
]

// 폼 데이터
const formData = reactive({
  blNo: '',
  companyName: '',
  blStatus: '',
  transactionStatus: '',
  routing: '',
  originPort: '',
  destinationPort: '',
  receivedDate: '',
})

const dummyText = `"SHIPPER'S LOAD, COUNT, SEALED & WEIGHT S.T.C"
1 X 40'H DV CONTAINER
303 PACKAGES
HMMU6431138 / 24H0354452 / 40HC / 30 3PKG / 21183.47 KGS / 60.548 CBM
BLUE BACKPACK LB MOCHILA DAV
PO.102286561-10 SAP 210106103 590 PCS
MARCA : LABEL
Total Number of Container or Packages(in words) : ONE(1) CONTAINER ONLY`

const additionalTC = ref(dummyText)
const additionalComment = ref(dummyText)

const generateContainerData = () => {
  const data = []
  const sizeTypes = ['40HC', '20DC', '40GP', '20GP', '40OT', '20OT']
  const containerPrefixes = ['HMMU', 'COSCO', 'MAEU', 'OOCL', 'EVERGREEN']
  const units = ['PKG', 'CASE', 'PALLET', 'BOX']
  const tempUnits = ['°C', '°F']

  for (let i = 1; i <= 10; i++) {
    const prefix = containerPrefixes[Math.floor(Math.random() * containerPrefixes.length)]
    const sizeType = sizeTypes[Math.floor(Math.random() * sizeTypes.length)]
    const unit = units[Math.floor(Math.random() * units.length)]
    const hasTemp = Math.random() > 0.7

    data.push({
      containerNo: `${prefix}${String(i).padStart(7, '0')}`,
      sealNo: String(Math.floor(Math.random() * 1000000000000)).padStart(12, '0'),
      sizeType: sizeType,
      pkgUnit: `${Math.floor(Math.random() * 500) + 50} / ${unit}`,
      grossWeight: Math.floor(Math.random() * 25000) + 5000,
      tare: `${Math.floor(Math.random() * 4000) + 2000} / KGM`,
      netWeight: Math.floor(Math.random() * 20000) + 5000,
      volumeUnit: `${(Math.random() * 70 + 10).toFixed(2)} / MTQ`,
      sc: Math.random() > 0.5 ? 'Y' : 'N',
      rf: Math.random() > 0.8 ? 'Y' : 'N',
      tempUnit: hasTemp
        ? `${Math.floor(Math.random() * 20) + 5} / ${tempUnits[Math.floor(Math.random() * tempUnits.length)]}`
        : '-',
      dgName: Math.random() > 0.9 ? 'CHEMICAL PRODUCT' : '-',
      imdg: Math.random() > 0.9 ? '3082' : '-',
    })
  }

  return data
}

const containerList = ref(generateContainerData())
const termsData = ref([
  {
    title: 'DEFINITIONS',
    description: 'When used in this Bill of Lading :',
  },
  {
    title: 'CLAUSE PARAMOUNT',
    description:
      '(A) Except as provided in (B) below, the international Convention for the Unification of...',
  },
  {
    title: "SHIPPER'S RESPONSIBILITY FOR CARGO",
    description:
      'The Shipper warrants that the goods are lawfully and properly described and packaged for safe carriage...',
  },
  {
    title: 'FREIGHT CHARGES',
    description:
      'Unless otherwise agreed in writing, all freight, charges and other monies due under this Bill of Lading...',
  },
])

const createTransactionRow = (id, overrides = {}) => ({
  id,
  status: 'ISSU',
  lastUpdate: '2025-09-01 15:15:00',
  actor: 'Hyundai Merchant Marine',
  recipient: 'KTNETEBL1',
  details: ['[발행 완료] Comment : 발행이 완료되었습니다.'],
  ...overrides,
})

const transactionRows = createTransactionRow(1)
const openTransactionRowId = ref(null)

const isTransactionRowOpen = (id) => openTransactionRowId.value === id

const toggleTransactionRow = (id) => {
  openTransactionRowId.value = openTransactionRowId.value === id ? null : id
}

const computedTransactions = computed(() => [
  { ...transactionRows, isOpen: isTransactionRowOpen(transactionRows.id) },
])

// 더미 데이터 생성
const generateDummyData = () => {
  const data = []
  const companies = [
    'KTNETEBL1',
    'KTNETEBL2',
    'KTNETEBL3',
    'VERY LONG COMPANY NAME FOR TESTING TRUNCATION AND ELLIPSIS BEHAVIOR IN THE GRID CELL RENDERER',
  ]
  const blStatus = ['ISSUED', 'AMENDING', 'SWITCHING', 'DELIVERY', 'ENDORSE', 'PENDING', 'VOIDED']
  const blStatusBadgeColorMap = {
    ISSUED: 'mint',
    AMENDING: 'violet',
    SWITCHING: 'violet',
    DELIVERY: 'violet',
    ENDORSE: 'amber',
    PENDING: 'amber',
    VOIDED: 'red',
  }
  const blStatusTooltipMap = {
    ISSUED: '발행 완료',
    AMENDING: '수정 요청 수락',
    SWITCHING: '전환 요청 수락',
    DELIVERY: '반환 요청 수락',
    ENDORSE: '양도 완료',
    PENDING: '요청 진행중',
    VOIDED: '취소 완료',
  }
  const transactionStatus = [
    'ISSUE',
    'SACC',
    'TRANSFER',
    'AMENDMENT',
    'SWITCH',
    'ENDORSE TO ORDER',
    'BLANK ENDORSE',
  ]
  const routingData = [
    {
      origin: { code: 'KRPUS', name: 'BUSAN, KOREA' },
      destination: { code: 'USBOS', name: 'BOSTON, USA' },
    },
    {
      origin: { code: 'KRINC', name: 'INCHEON, KOREA' },
      destination: { code: 'DEHAM', name: 'HAMBURG, GERMANY' },
    },
    {
      origin: { code: 'KRKAN', name: 'GWANGYANG, KOREA' },
      destination: { code: 'USNYC', name: 'NEW YORK, USA' },
    },
  ]

  for (let i = 1; i <= 9280; i++) {
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`

    const routingInfo = routingData[i % routingData.length]
    const statusValue = blStatus[i % blStatus.length]
    const companyIndex = i % companies.length
    data.push({
      no: i,
      blNo: `HDMUSEL${String(i).padStart(10, '0')}`,
      companyName: {
        name: companies[companyIndex],
        logo: `https://i.pravatar.cc/150?img=${(i % 20) + 1}`,
        prefix: 'From',
      },
      blStatus: {
        value: statusValue,
        color: blStatusBadgeColorMap[statusValue],
        tooltip: blStatusTooltipMap[statusValue],
      },
      transactionStatus: transactionStatus[i % transactionStatus.length],
      routing: routingInfo,
      receivedDate: formattedDate,
    })
  }

  return data
}

const rowData = ref(generateDummyData())

// ===== 필터 로직 =====
// 필터 상태 (입력용)
const filters = reactive({
  companyName: '',
  blNo: '',
  dateRange: getDefaultDateRange(),
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  companyName: '',
  blNo: '',
  dateRange: getDefaultDateRange(),
})

// 기본 날짜 범위 반환
function getDefaultDateRange() {
  return [new Date('2025-12-01'), new Date('2026-01-01')]
}

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.companyName = filters.companyName
  appliedFilters.blNo = filters.blNo
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : getDefaultDateRange()
  if (activeTab.value === 'list') {
    listPage.value = 1
  } else {
    gridPage.value = 1
  }
}

// 필터링된 데이터
const filteredRowData = computed(() => {
  return rowData.value.filter((row) => {
    const matchesCompanyName = (row.companyName?.name || '')
      .toLowerCase()
      .includes(appliedFilters.companyName.toLowerCase())
    const matchesBlNo = row.blNo.toLowerCase().includes(appliedFilters.blNo.toLowerCase())

    // 상태 탭 필터 적용
    const matchesBlStatus = statusTab.value === '_all' || row.blStatus?.value === statusTab.value

    let matchesDate = true
    if (appliedFilters.dateRange && appliedFilters.dateRange[0] && appliedFilters.dateRange[1]) {
      const rowDate = new Date(row.receivedDate)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = rowDate >= startDate && rowDate <= endDate
    }

    return matchesCompanyName && matchesBlNo && matchesBlStatus && matchesDate
  })
})

// 최대 페이지
const maxPage = computed(() => {
  return Math.ceil(filteredRowData.value.length / itemsPerPage.value)
})

// 페이지네이션된 데이터
const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRowData.value.slice(start, end)
})

// 페이지네이션 수정 시 페이지 재조정
watch([listItemsPerPage, gridItemsPerPage, () => rowData.value.length], () => {
  const currentMaxPage = Math.ceil(filteredRowData.value.length / itemsPerPage.value)

  if (activeTab.value === 'list' && listPage.value > currentMaxPage) {
    listPage.value = Math.max(1, currentMaxPage)
  }
  if (activeTab.value === 'grid' && gridPage.value > currentMaxPage) {
    gridPage.value = Math.max(1, currentMaxPage)
  }
})

// 컬럼 정의
const listColDefs = ref([
  {
    field: 'no',
    headerName: 'No',
    width: 80,
    maxWidth: 100,
    sort: 'desc',
    headerStyle: { justifyContent: 'flex-start' },
    //2026.05.18 hide 추가
    hide: true,
  },
  {
    field: 'companyName',
    headerName: 'Company Name',
    flex: 1,
    minWidth: 180,
    cellRenderer: CompanyNameCellRenderer,
    cellRendererParams: (params) => ({
      name: params.data?.companyName?.name || '',
      logo: params.data?.companyName?.logo || '',
      prefix: params.data?.companyName?.prefix || '',
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'blNo',
    headerName: 'B/L No',
    flex: 1,
    minWidth: 180,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'blStatus',
    headerName: 'B/L Status',
    width: 110,
    minWidth: 110,
    cellRenderer: BadgeCellRenderer,
    cellRendererParams: (params) => ({
      color: params.data?.blStatus?.color,
      tooltip: params.data?.blStatus?.tooltip,
    }),
    //cellStyle: { textAlign: 'center' }, 2026.05.18 textalign 제거
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'transactionStatus',
    headerName: 'Transaction Status',
    width: 160,
    minWidth: 160,
    cellRenderer: BadgeCellRenderer,
    cellRendererParams: {
      color: 'gray',
    },
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'routing',
    headerName: 'Routing',
    flex: 1,
    minWidth: 200,
    cellRenderer: RoutingCodeCellRenderer,
    cellStyle: { display: 'flex', alignItems: 'center' },
    cellRendererParams: (params) => ({
      origin: params.data?.routing?.origin || { code: '', name: '' },
      destination: params.data?.routing?.destination || { code: '', name: '' },
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'receivedDate',
    headerName: 'Received Date',
    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// 그리드 이벤트 핸들러
const onGridReady = (params) => {
  gridApi.value = params.api
}

// 셀 클릭
const onCellClicked = (params) => {
  if (params.colDef.field === 'blNo' || params.colDef.field === 'companyName') {
    detailRow.value = params.data
    openDetailDialog(params.data)
  }
}

// 그리드 아이템 클릭
const onGridItemClick = (item) => {
  console.log('Grid Item Clicked:', item)
  detailRow.value = item
  openDetailDialog(item)
}

// 상세 정보 다이얼로그 열기
const openDetailDialog = (row) => {
  formData.blNo = row.blNo
  formData.companyName = row.companyName?.name || row.companyName
  formData.blStatus = row.blStatus?.value || ''
  formData.transactionStatus = row.transactionStatus
  formData.routing = row.routing
  formData.originPort = row.originPort
  formData.destinationPort = row.destinationPort
  formData.receivedDate = row.receivedDate
  dialogOpen.value = true
}

// 다이얼로그 닫기
const closeDialog = () => {
  dialogOpen.value = false
  detailRow.value = null
}

// 토글 - Preview 팝업 표시 여부
const togglePreview = () => {
  if (previewOpen.value) {
    previewOpen.value = false
  } else {
    transactionStatusOpen.value = false
    previewOpen.value = true
  }
}

// 토글 - Transaction Status 팝업 표시 여부
const toggleTransactionStatus = () => {
  if (transactionStatusOpen.value) {
    transactionStatusOpen.value = false
  } else {
    previewOpen.value = false
    transactionStatusOpen.value = true
  }
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.companyName = ''
  filters.blNo = ''
  filters.dateRange = getDefaultDateRange()
  appliedFilters.companyName = ''
  appliedFilters.blNo = ''
  appliedFilters.dateRange = getDefaultDateRange()
  statusTab.value = '_all'
  if (activeTab.value === 'list') {
    listPage.value = 1
  } else {
    gridPage.value = 1
  }
}
</script>
