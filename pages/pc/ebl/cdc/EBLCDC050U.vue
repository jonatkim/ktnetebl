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

        <!--2026.06.24 추가-->
        <EblSelect
          v-model="filters.dgType"
          :options="dgOptions"
          placeholder="Cargo Type"
          :style="{ width: '140px' }"
          @change="applyFilters"
        />

        <EblDatePicker
          v-model="filters.dateRange"
          range
          clearable
          placeholder="Send Date"
          :start-date="filters.dateRange?.[0]"
          :focus-start-date="true"
          style="width: 260px"
          auto-apply
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
        <div v-if="paginatedRowData && paginatedRowData.length > 0" class="ebl-grid-view ebl-grid-view--wrap">
          <EblGridViewItem
            v-for="(item, index) in paginatedRowData"
            :key="index"
            :bl-no="item.blNo"
            :company-name="item.companyName"
            :bl-status="item.blStatus"
            :transaction-status="item.transactionStatus"
            :routing="item.routing"
            :received-date="item.sendDate"
            :dg="item.dg"
            @click="onGridItemClick(item)"
          />
        </div>

        <div v-else class="ebl-grid-nodata-container">
          <div class="nodata-illustration"></div>
          <h3 class="nodata-title">No results found</h3>
          <p class="nodata-desc">No data matches your current filter settings.</p>
          <p class="nodata-desc">Please try adjusting your filters or date range.</p>
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

            <div class="ebl-card-linear py-5 px-6 mb-3">
              <EblInfoItem vertical label="Recipient" content-class="py-0">
                <template #label>
                  <span class="ebl-info-item__label-text small">Recipient</span>
                </template>
                <EblAvatarLabel
                  logo="https://i.pravatar.cc/150?img=1"
                  title="KTNETEBL1"
                  subtitle="338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR"
                  title-first
                />
              </EblInfoItem>
            </div>
            <EblTabs
              v-model="detailTab"
              :items="[
                { value: 'blInfo', label: 'B/L' },
                { value: 'containerInfo', label: 'Container' },
                { value: 'dgInfo', label: 'DG' },
                { value: 'tAndCInfo', label: 'T&C' },
              ]"
              size="lg"
              class="pt-4 mb-5"
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
            <template v-else-if="detailTab === 'containerInfo'">
              <div class="ebl-card-linear d-flex" style="height: 700px">
                <EblContainerList
                  v-model="selectedContainer"
                  :list="containerList"
                  class="border-right"
                />
                <div class="flex-1 pa-5 ebl-scrollbar" style="overflow-y: auto">
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
                      <EblInfoItem label="Shipping Marks">{{
                        selectedContainer.shippingMarks
                      }}</EblInfoItem>
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
          <VCard v-if="transactionStatusOpen" width="700" class="ebl-dialog__card">
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
                  <col width="117px" />
                  <col width="117px" />
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
                          class="line-2"
                        />
                      </td>
                      <td class="ebl-table-grid__cell">
                        <EblAvatarLabel
                          v-tooltip:top="row.recipient"
                          size="sm"
                          logo="https://i.pravatar.cc/150?img=1"
                          :title="row.recipient"
                          title-first
                          class="line-2"
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
          <VCard v-if="previewOpen" width="600" class="ebl-dialog__card">
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
import EblBtnCellRenderer from '~/components/grid/EblBtnCellRenderer.vue'
import RoutingCodeCellRenderer from '~/components/grid/RoutingCodeCellRenderer.vue'
import EblGridViewItem from '~/components/grid/EblGridViewItem.vue'

// Composables
const { formatNumber } = useFormat()

// 상태 관리 - 그리드 & 다이얼로그
const gridApi = shallowRef(null)
const dialogOpen = ref(false)
// 상태 - 뷰 & 탭 선택
const activeTab = ref('list')
const statusTab = ref('_all')
const detailTab = ref('blInfo')
const blInfoPanels = ref(1)

// 상태 - 다이얼로그 표시 여부
const transactionStatusOpen = ref(false)
const previewOpen = ref(false)

// Transaction Status Table
const createTransactionRow = (id, overrides = {}) => ({
  id,
  status: 'ISSU',
  lastUpdate: '2025-09-01 15:15:00',
  actor: 'Hyundai Merchant Marine',
  actorInitials: 'HM',
  recipient: 'KTNETEBL1',
  recipientInitials: 'KT',
  details: ['[발행 완료] Comment : 발행이 완료되었습니다.'],
  ...overrides,
})

const randomPick = (list) => list[Math.floor(Math.random() * list.length)]

const createRandomTransactions = (count) => {
  const statuses = ['ISSU', 'SREJ', 'ENDORSE TO ORDER', 'SACC']
  const actors = [
    { name: 'Hyundai Merchant Marine', initials: 'HM' },
    { name: 'KTNETEBL1', initials: 'KT' },
  ]
  const recipients = [
    { name: 'KTNETEBL1', initials: 'KT' },
    { name: 'CJ Logistics Corporation', initials: 'CJ' },
  ]
  const comments = [
    '[발행 완료] Comment : 발행이 완료되었습니다.',
    '[서렌더 요청 거절] Comment : 서렌더 요청이 거절되었습니다.',
    '[양도 완료] Comment : Endorse to order 처리되었습니다.',
    '[서렌더 요청 승인] Comment : 서렌더 요청이 승인되었습니다.',
  ]

  return Array.from({ length: count }).map((_, index) => {
    const actor = randomPick(actors)
    const recipient = randomPick(recipients)
    const detailCount = Math.floor(Math.random() * 2) + 1
    const details = Array.from({ length: detailCount }).map(() => randomPick(comments))

    return createTransactionRow(index + 1, {
      status: randomPick(statuses),
      actor: actor.name,
      actorInitials: actor.initials,
      recipient: recipient.name,
      recipientInitials: recipient.initials,
      details,
    })
  })
}

const transactionRows = createRandomTransactions(30)

const openTransactionRowId = ref(null)

const isTransactionRowOpen = (id) => openTransactionRowId.value === id

const toggleTransactionRow = (id) => {
  openTransactionRowId.value = openTransactionRowId.value === id ? null : id
}

const computedTransactions = computed(() =>
  transactionRows.map((row) => ({
    ...row,
    isOpen: isTransactionRowOpen(row.id),
  })),
)

// 상태 - 선택된 항목
const detailRow = ref(null)
const selectedContainer = ref(null)

// 더미 텍스트 데이터
const dummyText = `"SHIPPER'S LOAD, COUNT, SEALED & WEIGHT S.T.C"
1 X 40'H DV CONTAINER
303 PACKAGES
HMMU6431138 / 24H0354452 / 40HC / 30 3PKG / 21183.47 KGS / 60.548 CBM
BLUE BACKPACK LB MOCHILA DAV
PO.102286561-10 SAP 210106103 590 PCS
MARCA : LABEL
Total Number of Container or Packages(in words) : ONE(1) CONTAINER ONLY`

// 폼 데이터
const additionalTC = ref(dummyText)
const additionalComment = ref(dummyText)

// 페이지 설정
const pageInfo = ref({
  title: 'Sent',
  breadcrumbItems: [{ text: 'Documents' }, { text: 'Sent' }],
})

// 탭 항목 설정
const tabItems = [
  { label: 'List View', value: 'list', icon: 'ebli:list' },
  { label: 'Grid View', value: 'grid', icon: 'ebli:grid' },
]

// B/L 상태 옵션
const blStatusOptions = [
  { label: 'All', value: '_all' },
  { label: 'ISSUED', value: 'ISSUED' },
  { label: 'AMENDING', value: 'AMENDING' },
  { label: 'SWITCHING', value: 'SWITCHING' },
  { label: 'DELIVERY', value: 'DELIVERY' },
  { label: 'VOIDED', value: 'VOIDED' },
]

const statusTabItems = computed(() =>
  blStatusOptions.map((opt) => ({ label: opt.label, value: opt.value })),
)

// 페이지네이션 상태 - List/Grid 탭별
const listPage = ref(1)
const listItemsPerPage = ref(10)
const gridPage = ref(1)
const gridItemsPerPage = ref(12)

// 폼 데이터 - B/L 상세 정보
const formData = reactive({
  blNo: '',
  companyName: '',
  blStatus: '',
  transactionStatus: '',
  routing: '',
  originPort: '',
  destinationPort: '',
  sendDate: '',
})

// 계산형 속성 - 현재 탭의 페이지 번호
const page = computed({
  get: () => (activeTab.value === 'list' ? listPage.value : gridPage.value),
  set: (val) => {
    if (activeTab.value === 'list') listPage.value = val
    else gridPage.value = val
  },
})

// 계산형 - 현재 탭의 페이지당 항목 수
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

// 계산형 - 탭별 페이지당 항목 수 옵션
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

// 데이터 생성 - 9280개의 B/L 레코드 생성
const generateDummyData = () => {
  const data = []
  const companies = [
    'KTNETEBL1',
    'KTNETEBL2',
    'KTNETEBL3',
    'VERY LONG COMPANY NAME FOR TESTING TRUNCATION AND ELLIPSIS BEHAVIOR IN THE GRID CELL RENDERER',
  ]
  const blStatus = ['ISSUED', 'AMENDING', 'SWITCHING', 'DELIVERY', 'VOIDED']
  const blStatusBadgeColorMap = {
    ISSUED: 'mint',
    AMENDING: 'violet',
    SWITCHING: 'violet',
    DELIVERY: 'violet',
    VOIDED: 'red',
  }
  const blStatusTooltipMap = {
    ISSUED: '발행 완료',
    AMENDING: '수정 요청 수락',
    SWITCHING: '전환 요청 수락',
    DELIVERY: '반환 요청 수락',
    VOIDED: '취소 완료',
  }
  const transactionStatus = ['ISSUE', 'SACC', 'TRANSFER', 'AMENDMENT', 'SWITCH', 'ENDORSEMENT']
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
  const attachmentButtonVariants = [
    {
      label: '',
      icon: 'mdi-paperclip',
      color: 'ghost',
      small: true,
      outlined: false,
      iconOnly: true,
    },
    {
      label: 'Files',
      icon: 'mdi-paperclip',
      color: 'ghost',
      small: true,
      outlined: false,
    },
    {
      label: 'Open',
      icon: 'mdi-paperclip',
      color: 'subtle',
      small: true,
      outlined: true,
    },
    {
      label: 'View',
      icon: 'mdi-paperclip',
      color: 'primary',
      small: true,
      outlined: false,
      pill: true,
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
    const attachmentCount = i % 5 === 0 ? 0 : (i % 3) + 1
    const attachmentButton = attachmentButtonVariants[i % attachmentButtonVariants.length]
    data.push({
      blNo: `HDMUSEL${String(i).padStart(10, '0')}`,
      companyName: {
        name: companies[companyIndex],
        logo: `https://i.pravatar.cc/150?img=${(i % 20) + 1}`,
        prefix: 'To',
      },
      blStatus: {
        value: statusValue,
        color: blStatusBadgeColorMap[statusValue],
        tooltip: blStatusTooltipMap[statusValue],
      },
      transactionStatus: transactionStatus[i % transactionStatus.length],
      attachmentCount,
      attachmentButton,
      routing: routingInfo,
      sendDate: formattedDate,
      /*2026.06.24 추가*/
      dg: i % 2 === 1 ? 'Y' : 'N',
    })
  }

  return data
}

const rowData = ref(generateDummyData())

// 데이터 생성 - 100개의 컨테이너 레코드 생성
const generateContainerData = () => {
  const data = []
  const sizeTypes = ['40HC', '20DC', '40GP', '20GP', '40OT', '20OT']
  const containerPrefixes = ['HMMU', 'COSCO', 'MAEU', 'OOCL', 'EVERGREEN']
  const units = ['PKG', 'CASE', 'PALLET', 'BOX']
  const tempUnits = ['°C', '°F']

  for (let i = 1; i <= 100; i++) {
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
      shippingMarks: `C042202 made
in Korea case 2
C042202 made
in Korea case 2
C042202 made
in Korea case 2`,
    })
  }

  return data
}

// 컨테이너 데이터 참조
const containerList = ref(generateContainerData())

// 약관 데이터
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
  {
    title: 'LIEN',
    description:
      'The Carrier shall have a lien on the goods, on any documents relating to the goods and on...',
  },
  {
    title: 'LIMITATION OF LIABILITY',
    description:
      'The total liability of the Carrier under this Bill of Lading shall be limited to the actual loss or damage...',
  },
  {
    title: 'NOTICE OF LOSS OR DAMAGE',
    description:
      'Unless notice of loss or damage and the general nature of such loss or damage is given in writing...',
  },
  {
    title: 'DECK CARGO',
    description:
      'Goods on deck shall be carried entirely at the risk of the Shipper. The Carrier shall not be liable...',
  },
  {
    title: 'GOVERNING LAW AND JURISDICTION',
    description:
      '(A) Any claims arising from or in connection with or relating to this Bill of Lading shall...',
  },
  {
    title: 'GENERAL AVERAGE',
    description:
      'General Average shall be adjusted according to the York-Antwerp Rules as applicable to the voyage...',
  },
])

// ===== 필터 로직 =====
// [추가] 셀렉트 박스에서 사용할 옵션 데이터 (화면설계서 기준)
const dgOptions = ref([
  { label: 'All Cargo', value: 'ALL' },
  { label: 'DG Only', value: 'DG' }
])

// 필터 상태 - 회사명, B/L 번호, 날짜 범위 (입력용)
const filters = reactive({
  companyName: '',
  blNo: '',
  dateRange: getDefaultDateRange(),
  dgType: 'ALL', // [추가] DG 필터 입력 상태 초기값
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  companyName: '',
  blNo: '',
  dateRange: getDefaultDateRange(),
  dgType: 'ALL', // [추가] 실제 적용될 DG 필터 상태
})

// 기본 날짜 범위 반환 [12월 1일, 1월 1일]
function getDefaultDateRange() {
  return [new Date('2025-12-01'), new Date('2026-01-01')]
}

// 필터 - Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.companyName = filters.companyName
  appliedFilters.blNo = filters.blNo
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : getDefaultDateRange()
  appliedFilters.dgType = filters.dgType // [추가] DG 필터 값 적용

  if (activeTab.value === 'list') {
    listPage.value = 1
  } else {
    gridPage.value = 1
  }
}

// 필터 - 모든 필터 조건 초기화
const resetFilters = () => {
  filters.companyName = ''
  filters.blNo = ''
  filters.dateRange = getDefaultDateRange()
  filters.dgType = 'ALL' // [추가] DG 필터 입력값 초기화

  appliedFilters.companyName = ''
  appliedFilters.blNo = ''
  appliedFilters.dateRange = getDefaultDateRange()
  filters.dgType = 'ALL' // [추가] DG 필터 입력값 초기화

  statusTab.value = '_all'
  if (activeTab.value === 'list') {
    listPage.value = 1
  } else {
    gridPage.value = 1
  }
}

// 계산형 - 회사, B/L 번호, 상태, 날짜로 B/L 데이터 필터링
const filteredRowData = computed(() => {
  return rowData.value.filter((row) => {
    const matchesCompanyName = (row.companyName?.name || '')
      .toLowerCase()
      .includes(appliedFilters.companyName.toLowerCase())
    const matchesBlNo = row.blNo.toLowerCase().includes(appliedFilters.blNo.toLowerCase())

    // 상태 탭 필터 적용
    const matchesBlStatus = statusTab.value === '_all' || row.blStatus?.value === statusTab.value

    // [추가] DG(위험물) 필터 적용 로직
    // 설계서 기준: 'DG Only' 선택 시 데이터의 row.dg(또는 설계서 상의 구분값)가 'Y'인 것만 추출
    const matchesDg = appliedFilters.dgType === 'ALL' || row.dg === 'Y'

    let matchesDate = true
    if (appliedFilters.dateRange && appliedFilters.dateRange[0] && appliedFilters.dateRange[1]) {
      const rowDate = new Date(row.sendDate)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = rowDate >= startDate && rowDate <= endDate
    }

    // [수정] matchesDg 조건을 반환값에 추가
    return matchesCompanyName && matchesBlNo && matchesBlStatus && matchesDate && matchesDg
  })
})

// 계산형 - 최대 페이지 수
const maxPage = computed(() => {
  return Math.ceil(filteredRowData.value.length / itemsPerPage.value)
})

// 계산형 - 현재 페이지 데이터 조회
const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRowData.value.slice(start, end)
})

// 감시 - 페이지당 항목 수 변경 시 페이지 재조정
watch([listItemsPerPage, gridItemsPerPage, () => rowData.value.length], () => {
  const currentMaxPage = Math.ceil(filteredRowData.value.length / itemsPerPage.value)

  if (activeTab.value === 'list' && listPage.value > currentMaxPage) {
    listPage.value = Math.max(1, currentMaxPage)
  }
  if (activeTab.value === 'grid' && gridPage.value > currentMaxPage) {
    gridPage.value = Math.max(1, currentMaxPage)
  }
})

// 그리드 컬럼 정의
const listColDefs = ref([
  {
    colId: 'rowNo',
    headerName: '',
    width: 60,
    maxWidth: 100,
    sortable: false,
    valueGetter: (params) =>
      filteredRowData.value.length - ((page.value - 1) * itemsPerPage.value + params.node.rowIndex),
    cellStyle: { textAlign: 'right' },
    headerStyle: { justifyContent: 'flex-end' },
  },
  {
    field: 'companyName',
    headerName: 'Company Name',
    flex: 1,
    minWidth: 180,
    cellDataType: false,
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
    field: 'attachmentButton',
    headerName: 'Attachment',
    width: 120,
    minWidth: 120,
    //2026.05.18 hide 추가
    hide: true,
    sortable: false,
    filter: false,
    cellDataType: false,
    cellRenderer: EblBtnCellRenderer,
    cellRendererParams: (params) => ({
      ...params.data?.attachmentButton,
      onClick: (row) => onAttachmentClick(row),
      disabled: (row) => !row?.attachmentCount,
    }),
    headerStyle: { justifyContent: 'center' },
    cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  },
  {
    field: 'blStatus',
    headerName: 'B/L Status',
    width: 110,
    minWidth: 110,
    cellDataType: false,
    cellRenderer: BadgeCellRenderer,
    cellRendererParams: (params) => ({
      color: params.data?.blStatus?.color,
      tooltip: '샘플 툴팁 문구입니다.',
    }),
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
  //2026.06.24 추가
  {
    field: 'dg',
    headerName: 'DG',
    width: 60,
    minWidth: 80,
    valueFormatter: (params) => (params.value === 'Y' ? 'Y' : 'N'),
    cellStyle: (params) => {
      if (params.value === 'Y') {
        return { color: '#FF1C1C'}
      }
      return { color: '#121A26' }
    },
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'routing',
    headerName: 'Routing',
    flex: 1,
    minWidth: 200,
    cellDataType: false,
    cellRenderer: RoutingCodeCellRenderer,
    cellStyle: { display: 'flex', alignItems: 'center' },
    cellRendererParams: (params) => ({
      origin: params.data?.routing?.origin || { code: '', name: '' },
      destination: params.data?.routing?.destination || { code: '', name: '' },
    }),
    cellStyle: { display: 'flex', alignItems: 'center' },
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'sendDate',
    headerName: 'Send Date',
    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// 이벤트 핸들러 - 그리드 준비 완료 초기화
const onGridReady = (params) => {
  gridApi.value = params.api
}

// 이벤트 핸들러 - 그리드 셀 클릭
const onCellClicked = (params) => {
  if (params.colDef.field === 'blNo' || params.colDef.field === 'companyName') {
    detailRow.value = params.data
    openDetailDialog(params.data)
  }
}

// 첨부파일 버튼 클릭 시 현재 행 데이터를 기준으로 후속 동작을 연결한다.
const onAttachmentClick = (row) => {
  console.log('Attachment button clicked:', row)
}

// 이벤트 핸들러 - 그리드 뷰 항목 클릭
const onGridItemClick = (item) => {
  detailRow.value = item
  openDetailDialog(item)
}

// 다이얼로그 - 상세 정보 다이얼로그 열기
const openDetailDialog = (row) => {
  formData.blNo = row.blNo
  formData.companyName = row.companyName
  formData.blStatus = row.blStatus?.value || ''
  formData.transactionStatus = row.transactionStatus
  formData.routing = row.routing
  formData.originPort = row.originPort
  formData.destinationPort = row.destinationPort
  formData.sendDate = row.sendDate
  dialogOpen.value = true
}

// 다이얼로그 - 상세 정보 다이얼로그 닫기
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
</script>

<!--2026.06.24 no data 강제처리-->
<style scoped>
:deep(.ag-body-viewport) {
  height:420px;
}
:deep(.ag-overlay-no-rows-center) {
  font-size: 0 !important;
  color: transparent !important;
  border: none !important;
  background: none !important;
  box-shadow: none !important;
  width: 100% !important;
  
  /* [수정 규칙] 중앙 정렬 축을 해제하고, 상단부터 정렬되도록 구조 변경 */
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: flex-start !important; /* 정중앙이 아닌 상단 기준 배치 */
  
  /* [피그마 여백 반영] 설계서 가이드라인 치수를 패딩값으로 그대로 강제 이식 */
  padding-top: 150px !important;    /* 돋보기 일러스트 상단 여백 규격 */
  padding-bottom: 150px !important; /* 서브 설명문 하단 여백 규격 */
  box-sizing: border-box !important;
}
:deep(.ag-overlay-no-rows-center::before) {
  content: "No results found" !important;
  display: block !important;
  text-align: center !important;
  font-family: inherit !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  color: #121A26 !important;
  margin-bottom: 4px !important; 
  
  padding-top: 74px !important;
  background: url("/assets/images/common/nodata.png") no-repeat center top !important;
  background-size: 150px 74px !important;
}
:deep(.ag-overlay-no-rows-center::after) {
  /* \A와 white-space 속성으로 설명문 내부에서만 깔끔하게 줄바꿈 처리 */
  content: "No data matches your current filter settings.\A Please try adjusting your filters or date range." !important;
  white-space: pre-line !important;
  display: block !important;
  text-align: center !important;
  font-family: inherit !important;
  
  /* 피그마 시안 기준: 서브 설명문 스타일 (13px, Regular, 연한 회색) */
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #6B7C93 !important;
  line-height: 1.5 !important;
}
/* 4. 오버레이 컨테이너 외부 프레임 투명화 */
:deep(.ag-overlay-wrapper) {
  background-color: transparent !important;
}

/*grid view nodata case*/
.ebl-grid-nodata-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding-top: 150px;
  padding-bottom: 150px;
}
.ebl-grid-nodata-container .nodata-illustration {
  width: 150px;
  height: 74px;
  background: url("/assets/images/common/nodata.png") no-repeat center top;
  background-size: 150px 74px;
}
.ebl-grid-nodata-container .nodata-title {
  font-size: 18px;
  font-weight: 700;
  color: #121A26;
  margin: 0 0 4px 0;
  font-family: inherit;
  text-align: center;
}
.ebl-grid-nodata-container .nodata-desc {
  font-size: 14px;
  font-weight: 400;
  color: #6B7C93;
  margin: 0;
  line-height: 1.5;
  text-align: center;
  font-family: inherit;
}
</style>