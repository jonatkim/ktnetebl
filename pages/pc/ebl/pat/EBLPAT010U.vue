<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn v-if="activeTab === 'contacts'" color="cta" large @click="openAddDialog"
          >Add Partner</EblBtn
        >
        <EblBtn
          v-else-if="activeTab === 'invitations'"
          color="cta"
          large
          @click="inv_openCreateDialog"
          >Create Invitation</EblBtn
        >
        <EblBtn v-else-if="activeTab === 'carrier'" color="cta" large @click="car_openAddDialog"
          >Add Mapping</EblBtn
        >
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- 탭 -->
      <div class="ebl-tabs-container mb-6">
        <EblTabs v-model="activeTab" :items="tabItems" size="lg" />
      </div>

      <!-- ===== Contacts 탭 ===== -->
      <template v-if="activeTab === 'contacts'">
        <EblSubHeader>
          <h2>Total</h2>
          <span class="count">{{ formatNumber(rowData.length) }}</span>

          <template #tooltip>
            •나의 파트너 메뉴에서는 직접 등록한 파트너의 목록을 확인할 수 있습니다.<br />
            •파트너는 역할별로 구분이 가능합니다.
          </template>
        </EblSubHeader>

        <div class="ebl-page-filters">
          <EblInput
            v-model="filters.companyName"
            clearable
            placeholder="Company Name"
            :style="{ width: '180px' }"
            @keydown.enter="applyFilters"
          />
          <EblInput
            v-model="filters.dunsNo"
            clearable
            placeholder="DUNS No"
            :style="{ width: '180px' }"
            @keydown.enter="applyFilters"
          />
          <EblSelect
            v-model="filters.roles"
            placeholder="Roles"
            :options="roleOptions"
            clearable
            style="width: 180px"
          />
          <EblDatePicker
            v-model="filters.dateRange"
            range
            clearable
            placeholder="View Date"
            :start-date="filters.dateRange?.[0]"
            :focus-start-date="true"
            auto-apply
            style="width: 260px"
          />
          <EblBtn outlined @click="applyFilters">Search</EblBtn>
          <EblBtn icon="ebli:refresh" outlined @click="resetFilters" />
        </div>

        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="paginatedRowData"
          :column-defs="colDefs"
          :dom-layout="'autoHeight'"
          @grid-ready="onGridReady"
          @cell-clicked="onCellClicked"
        />
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
            :length="Math.ceil(filteredRowData.length / itemsPerPage)"
            total-visible="5"
            show-first-last-page
          />
        </div>

        <!-- Contacts Dialog (Detail/Add/Modify) -->
        <EblDialog
          v-model="dialogOpen"
          transition="slide-x-reverse-transition"
          content-class="ebl-dialog ebl-dialog--multiple fill-height"
          :persistent="dialogMode !== 'detail'"
          scrollable
          @close="closeDialog"
        >
          <VCard :width="450" class="ebl-dialog__card"> <!--2026.05.18 사이즈 고정처리 진행-->
            <VCardTitle class="ebl-dialog__header">
              <span class="title">{{
                dialogMode === 'detail'
                  ? 'Partners Detail'
                  : dialogMode === 'add'
                    ? 'Add Partners'
                    : 'Modify Partners'
              }}</span>
              <VSpacer />
              <EblBtn icon pill small @click="closeDialog">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>

            <!-- 읽기 전용 뷰 -->
            <VCardText v-if="dialogMode === 'detail'" class="ebl-dialog__text flex-auto">
              <EblSubHeader>
                <h3>User Info</h3>
              </EblSubHeader>
              <EblInfo>
                <EblInfoItem label="MID">{{ detailRow?.mid || '-' }}</EblInfoItem>
                <EblInfoItem label="User Name">{{ detailRow?.userName || '-' }}</EblInfoItem>
                <EblInfoItem label="Phone Number">{{ detailRow?.phoneNumber || '-' }}</EblInfoItem>
                <EblInfoItem label="Fax Number">{{ detailRow?.faxNumber || '-' }}</EblInfoItem>
                <EblInfoItem label="Add Date">{{ detailRow?.addDate || '-' }}</EblInfoItem> <!--2026.05.18 주석 해제-->
              </EblInfo>

              <VDivider class="mt-6" />

              <EblSubHeader class="mt-6">
                <h3>Company Info</h3>
              </EblSubHeader>
              <EblInfo>
                <EblInfoItem label="Country">{{ detailRow?.country || '-' }}</EblInfoItem>
                <EblInfoItem label="Role">{{ detailRow?.role || '-' }}</EblInfoItem>
                <EblInfoItem label="Company Name" has-input>
                  <div class="ebl-thumbs-item">
                    <div v-if="detailRow?.companyName" class="ebl-thumbs-item__avatar">
                      <img :src="detailRow?.companyLogo" alt="Logo" />
                    </div>
                    <span class="ebl-thumbs-item__content">{{
                      detailRow?.companyName || '-'
                    }}</span>
                  </div>
                </EblInfoItem>
                <EblInfoItem label="DUNS Number">{{ detailRow?.dunsNumber || '-' }}</EblInfoItem>
                <EblInfoItem label="Corporation Number">{{
                  detailRow?.corporationNumber || '-'
                }}</EblInfoItem>
                <EblInfoItem label="Owner">{{ detailRow?.owner || '-' }}</EblInfoItem>
                <EblInfoItem label="zip code">{{ detailRow?.zipCode || '-' }}</EblInfoItem>
                <EblInfoItem label="Spot Code">{{ detailRow?.spotCode || '-' }}</EblInfoItem>
                <EblInfoItem label="City/Region">{{ detailRow?.cityRegion || '-' }}</EblInfoItem>
                <EblInfoItem label="Address 1">{{ detailRow?.address1 || '-' }}</EblInfoItem>
                <EblInfoItem label="Address 2">{{ detailRow?.address2 || '-' }}</EblInfoItem>
                <EblInfoItem label="Company Logo">
                  <div v-if="detailRow?.companyLogo" style="width: 150px; height: 100px">
                    <img :src="detailRow.companyLogo" alt="Company Logo" style="width: 100%" />
                  </div>
                  <span v-else>-</span>
                </EblInfoItem>
              </EblInfo>
            </VCardText>

            <!-- 편집 가능 뷰 (Add/Modify) -->
            <VCardText v-else class="ebl-dialog__text flex-auto">
              <EblSubHeader>
                <h3>User Info</h3>
              </EblSubHeader>
              <EblInfo>
                <EblInfoItem label="MID" has-input>
                  <EblInput
                    v-model="formData.mid"
                    placeholder="Choose MID"
                    prepend-icon="ebli:search"
                    :disabled="dialogMode === 'modify'"
                    readonly
                    @click="openPotentialDialog"
                  />
                </EblInfoItem>
                <EblInfoItem label="User Name" required has-input>
                  <EblInput v-model="formData.userName" placeholder="Input a User Name" />
                </EblInfoItem>
                <EblInfoItem label="Phone Number" required has-input>
                  <EblInput v-model="formData.phoneNumber" placeholder="Input a Phone Number" />
                </EblInfoItem>
                <EblInfoItem label="Fax Number" has-input>
                  <EblInput v-model="formData.faxNumber" placeholder="Input a Fax Number" />
                </EblInfoItem>
                <!-- <EblInfoItem label="Add Date" has-input>
                  <EblInput
                    :model-value="formData.addDate || new Date().toISOString().split('T')[0]"
                    placeholder="Auto generated"
                    disabled
                  />
                </EblInfoItem> -->
              </EblInfo>
              <VDivider class="mt-6" />

              <EblSubHeader class="mt-6">
                <h3>Company Info</h3>
              </EblSubHeader>
              <EblInfo>
                <EblInfoItem label="Country" has-input>
                  <EblInput
                    v-model="formData.country"
                    placeholder="MID 선택 후 자동기입"
                    disabled
                  />
                </EblInfoItem>
                <EblInfoItem label="Role" has-input>
                  <EblInput v-model="formData.role" placeholder="MID 선택 후 자동기입" disabled />
                </EblInfoItem>
                <EblInfoItem label="Company Name" has-input>
                  <EblInput
                    v-model="formData.companyName"
                    placeholder="MID 선택 후 자동기입"
                    disabled
                  />
                </EblInfoItem>
                <EblInfoItem label="DUNS Number" has-input>
                  <EblInput
                    v-model="formData.dunsNumber"
                    placeholder="MID 선택 후 자동기입"
                    disabled
                  />
                </EblInfoItem>
                <EblInfoItem label="Corporation Number" has-input>
                  <EblInput
                    v-model="formData.corporationNumber"
                    placeholder="MID 선택 후 자동기입"
                    disabled
                  />
                </EblInfoItem>
                <EblInfoItem label="Owner" has-input>
                  <EblInput v-model="formData.owner" placeholder="MID 선택 후 자동기입" disabled />
                </EblInfoItem>
                <EblInfoItem label="zip code" has-input>
                  <EblInput
                    v-model="formData.zipCode"
                    placeholder="MID 선택 후 자동기입"
                    disabled
                  />
                </EblInfoItem>
                <EblInfoItem label="Spot Code" has-input>
                  <EblInput
                    v-model="formData.spotCode"
                    placeholder="MID 선택 후 자동기입"
                    disabled
                  />
                </EblInfoItem>
                <EblInfoItem label="City/Region" has-input>
                  <EblInput
                    v-model="formData.cityRegion"
                    placeholder="MID 선택 후 자동기입"
                    disabled
                  />
                </EblInfoItem>
                <EblInfoItem label="Address 1" has-input>
                  <EblInput
                    v-model="formData.address1"
                    placeholder="MID 선택 후 자동기입"
                    disabled
                  />
                </EblInfoItem>
                <EblInfoItem label="Address 2" has-input>
                  <EblInput
                    v-model="formData.address2"
                    placeholder="MID 선택 후 자동기입"
                    disabled
                  />
                </EblInfoItem>
                <EblInfoItem label="Company Logo" has-input>
                  <div v-if="formData.companyLogo" style="width: 150px">
                    <img :src="formData.companyLogo" alt="Logo" style="width: 100%" />
                  </div>
                </EblInfoItem>
              </EblInfo>
            </VCardText>

            <!-- Action Buttons -->
            <VCardActions class="ebl-dialog__actions">
              <template v-if="dialogMode === 'detail'">
                <EblBtn color="danger" large @click="handleDelete">Delete</EblBtn>
                <VSpacer />
                <EblBtn color="cta" large @click="switchToModify">Modify</EblBtn>
              </template>
              <template v-else>
                <VSpacer />
                <EblBtn large @click="closeDialog">Cancel</EblBtn>
                <EblBtn color="cta" large :disabled="!canSave" @click="handleSave">Save</EblBtn>
              </template>
            </VCardActions>
          </VCard>
          <VSlideXReverseTransition>
            <VCard v-if="potentialOpen" width="800" class="ebl-dialog__card">
              <VCardTitle class="ebl-dialog__header">
                <span class="title">Potential Partners</span>
                <VSpacer />
                <EblBtn icon pill small @click="closePotentialDialog">
                  <VIcon icon="ebli:close" :size="20" />
                </EblBtn>
              </VCardTitle>

              <VCardText class="ebl-dialog__text flex-auto">
                <EblSubHeader>
                  <h2>Total</h2>
                  <span class="count">{{ formatNumber(potentialData.length) }}</span>
                  <template #util>
                    <EblSelect
                      v-model="potentialFilters.companyName"
                      placeholder="Company Name"
                      :options="[
                        { label: 'Company Name', value: 'Company Name' },
                        { label: 'Role', value: 'Role' },
                        { label: 'DUNS No', value: 'DUNS No' },
                        { label: 'MID', value: 'MID' },
                      ]"
                      style="width: 180px"
                    />
                    <EblInput
                      v-model="potentialFilters.search"
                      placeholder="Placeholder"
                      prepend-icon="ebli:search"
                      clearable
                      style="width: 300px"
                    />
                  </template>
                </EblSubHeader>

                <!-- Potential Partners Grid -->
                <AgGridVue
                  class="ebl-data-grid ag-theme-quartz"
                  :row-data="potentialData"
                  :column-defs="potentialColDefs"
                  :dom-layout="'autoHeight'"
                  :row-selection="'single'"
                  @grid-ready="onPotentialGridReady"
                  @selection-changed="onPotentialSelectionChanged"
                />
              </VCardText>

              <VCardActions class="ebl-dialog__actions">
                <VSpacer />
                <EblBtn large @click="closePotentialDialog">Cancel</EblBtn>
                <EblBtn
                  color="cta"
                  large
                  :disabled="!selectedPotential"
                  @click="handleSelectPotential"
                  >Select</EblBtn
                >
              </VCardActions>
            </VCard>
          </VSlideXReverseTransition>
        </EblDialog>
      </template>

      <!-- ===== My Invitations 탭 ===== -->
      <template v-if="activeTab === 'invitations'">
        <EblSubHeader>
          <h2>Total</h2>
          <span class="count">{{ formatNumber(inv_rowData.length) }}</span>
        </EblSubHeader>

        <div class="ebl-page-filters">
          <EblInput
            v-model="inv_filters.companyName"
            clearable
            placeholder="Company Name"
            :style="{ width: '180px' }"
            @keydown.enter="inv_applyFilters"
          />
          <EblInput
            v-model="inv_filters.mid"
            clearable
            placeholder="MID"
            :style="{ width: '180px' }"
            @keydown.enter="inv_applyFilters"
          />
          <EblSelect
            v-model="inv_filters.receptionStatus"
            placeholder="Reception Status"
            :options="inv_receptionStatusOptions"
            clearable
            style="width: 200px"
          />
          <EblDatePicker
            v-model="inv_filters.dateRange"
            range
            clearable
            placeholder="View Date"
            :start-date="inv_filters.dateRange?.[0]"
            :focus-start-date="true"
            auto-apply
            style="width: 260px"
          />
          <EblBtn outlined @click="inv_applyFilters">Search</EblBtn>
          <EblBtn icon="ebli:refresh" outlined @click="inv_resetFilters" />
        </div>

        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="inv_paginatedRowData"
          :column-defs="inv_colDefs"
          :dom-layout="'autoHeight'"
          @grid-ready="inv_onGridReady"
          @cell-clicked="inv_onCellClicked"
        />
        <div class="ebl-pagination--container mt-3">
          <div>
            Count
            <EblSelect
              v-model="inv_itemsPerPage"
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
            v-model="inv_page"
            :length="Math.ceil(inv_sortedRowData.length / inv_itemsPerPage)"
            total-visible="5"
            show-first-last-page
          />
        </div>

        <!-- My Invitations Dialog -->
        <EblDialog
          v-model="inv_dialogOpen"
          transition="slide-x-reverse-transition"
          content-class="ebl-dialog ebl-dialog--multiple fill-height"
          scrollable
          :persistent="inv_createOpen"
          @close="inv_closeDialog"
        >
          <VCard v-if="inv_detailOpen" width="800" class="ebl-dialog__card">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">Invitation Detail</span>
              <VSpacer />
              <EblBtn icon pill small @click="inv_closeDialog">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>
            <VCardText class="ebl-dialog__text flex-auto">
              <EblSubHeader><h3>Invitation Info</h3></EblSubHeader>
              <EblInfo>
                <EblInfoItem label="MID" has-input>
                  <div style="display: flex; align-items: center; gap: 12px">
                    <span>{{ inv_detailRow?.mid || '-' }}</span>
                    <VSpacer />
                    <EblBtn
                      outlined
                      :disabled="!['Expiration', 'Error'].includes(inv_detailRow?.receptionStatus)"
                      @click="inv_openCreateFromResend"
                      >Resend</EblBtn
                    >
                  </div>
                </EblInfoItem>
                <EblInfoItem label="Company Name" has-input>
                  <div class="ebl-thumbs-item">
                    <div v-if="inv_detailRow?.companyLogo" class="ebl-thumbs-item__avatar">
                      <img :src="inv_detailRow.companyLogo" :alt="inv_detailRow.companyName" />
                    </div>
                    <span class="ebl-thumbs-item__content">{{
                      inv_detailRow?.companyName || '-'
                    }}</span>
                  </div>
                </EblInfoItem>
                <EblInfoItem label="Title">{{ inv_detailRow?.title || '-' }}</EblInfoItem>
                <EblInfoItem label="Message">{{ inv_detailRow?.message || '-' }}</EblInfoItem>
                <EblInfoItem label="Send Date">{{ inv_detailRow?.sendDate || '-' }}</EblInfoItem>
                <EblInfoItem label="Reception Status">{{
                  inv_detailRow?.receptionStatus || '-'
                }}</EblInfoItem>
                <EblInfoItem label="Expiration Date">{{
                  inv_detailRow?.expirationDate || '-'
                }}</EblInfoItem>
              </EblInfo>
            </VCardText>
            <!-- <VCardActions class="ebl-dialog__actions">
              <EblBtn large @click="inv_closeDialog">Back</EblBtn>
            </VCardActions> -->
          </VCard>

          <VSlideXReverseTransition>
            <VCard v-if="inv_createOpen" width="720" class="ebl-dialog__card">
              <VCardTitle class="ebl-dialog__header">
                <span class="title">Create Invitation</span>
                <VSpacer />
                <EblBtn icon pill small @click="inv_closeCreateDialog">
                  <VIcon icon="ebli:close" :size="20" />
                </EblBtn>
              </VCardTitle>
              <VCardText class="ebl-dialog__text flex-auto">
                <EblInfo vertical>
                  <EblInfoItem label="Recipient" required has-input>
                    <div style="display: flex; gap: 12px; align-items: flex-start">
                      <EblInput
                        v-model="inv_createForm.recipient"
                        placeholder="Input a E-Mail"
                        counter
                        :maxlength="20"
                        style="flex: 1"
                        :error="!!inv_createFormErrors.recipient"
                        :error-message="inv_createFormErrors.recipient"
                      />
                      <EblBtn
                        outlined
                        style="flex-shrink: 0; white-space: nowrap"
                        @click="inv_handleDuplicateCheck"
                        >Duplicate Check</EblBtn
                      >
                    </div>
                  </EblInfoItem>
                  <EblInfoItem label="Company Name" required has-input>
                    <EblInput
                      v-model="inv_createForm.companyName"
                      placeholder="Input a Company Name"
                      :error="!!inv_createFormErrors.companyName"
                      :error-message="inv_createFormErrors.companyName"
                    />
                  </EblInfoItem>
                  <EblInfoItem label="Title" required has-input>
                    <EblInput
                      v-model="inv_createForm.title"
                      placeholder="Input a Title"
                      :error="!!inv_createFormErrors.title"
                      :error-message="inv_createFormErrors.title"
                    />
                  </EblInfoItem>
                  <EblInfoItem label="Message" required has-input>
                    <EblTextarea
                      v-model="inv_createForm.message"
                      :rows="6"
                      placeholder="작성 내용..."
                      :error="!!inv_createFormErrors.message"
                      :error-message="inv_createFormErrors.message"
                    />
                  </EblInfoItem>
                </EblInfo>
              </VCardText>
              <VCardActions class="ebl-dialog__actions">
                <EblBtn large @click="inv_closeCreateDialog">Cancel</EblBtn>
                <EblBtn color="cta" large @click="inv_handleSend">Send</EblBtn>
              </VCardActions>
            </VCard>
          </VSlideXReverseTransition>
        </EblDialog>
      </template>

      <!-- ===== Carrier ID Mapping 탭 ===== -->
      <template v-if="activeTab === 'carrier'">
        <EblSubHeader>
          <h2>Total</h2>
          <span class="count">{{ formatNumber(car_rowData.length) }}</span>
        </EblSubHeader>

        <AgGridVue
          class="ebl-data-grid ag-theme-quartz"
          :row-data="car_paginatedRowData"
          :column-defs="car_colDefs"
          :dom-layout="'autoHeight'"
          @grid-ready="car_onGridReady"
          @cell-clicked="car_onCellClicked"
        />
        <div class="ebl-pagination--container mt-3">
          <div>
            Count
            <EblSelect
              v-model="car_itemsPerPage"
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
            v-model="car_page"
            :length="Math.ceil(car_rowData.length / car_itemsPerPage)"
            total-visible="5"
            show-first-last-page
          />
        </div>

        <!-- Carrier ID Mapping Dialog -->
        <EblDialog
          v-model="car_dialogOpen"
          content-class="ebl-dialog ebl-dialog--multiple fill-height"
          transition="slide-x-reverse-transition "
          scrollable
          @close="car_closeDialog"
        >
          <VCard width="480" class="ebl-dialog__card">
            <VCardTitle class="ebl-dialog__header">
              <span class="title">User Info</span>
              <VSpacer />
              <EblBtn icon pill small @click="car_closeDialog">
                <VIcon icon="ebli:close" :size="20" />
              </EblBtn>
            </VCardTitle>
            <VCardText class="ebl-dialog__text flex-auto">
              <EblInfo vertical>
                <EblInfoItem label="MID" has-input>
                  <EblInput
                    v-model="car_formData.mid"
                    placeholder="xxx@ktnet.co.kr"
                    :readonly="car_isEditMode"
                  />
                </EblInfoItem>
                <EblInfoItem label="Carrier Code" has-input required>
                  <EblInput
                    v-model="car_formData.carrierCode"
                    placeholder="1234"
                    prepend-icon="ebli:search"
                    :error-message="car_errors.carrierCode"
                    @click:prepend="car_searchCarrierCode"
                    @input="car_errors.carrierCode = ''"
                  />
                </EblInfoItem>
                <EblInfoItem label="Shipper ID" has-input required>
                  <EblInput
                    v-model="car_formData.shipperId"
                    placeholder="Input a Shipper ID"
                    :error-message="car_errors.shipperId"
                    @input="car_errors.shipperId = ''"
                  />
                </EblInfoItem>
                <EblInfoItem label="Company Name" has-input required>
                  <EblInput
                    v-model="car_formData.companyName"
                    placeholder="Input a Company Name"
                    :error-message="car_errors.companyName"
                    @input="car_errors.companyName = ''"
                  />
                </EblInfoItem>
              </EblInfo>
            </VCardText>
            <VCardActions class="ebl-dialog__actions">
              <VSpacer />
              <EblBtn large @click="car_closeDialog">Cancel</EblBtn>
              <EblBtn color="cta" large @click="car_saveUserInfo">Save</EblBtn>
            </VCardActions>
          </VCard>
        </EblDialog>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
import { useDialogStore } from '~/stores/useDialogStore'
import { useToastStore } from '~/stores/toast'
import { AgGridVue } from 'ag-grid-vue3'
import CompanyNameCellRenderer from '~/components/grid/CompanyNameCellRenderer.vue'

const { formatNumber } = useFormat()
const dialogStore = useDialogStore()
const toastStore = useToastStore()

// ===== 탭 =====
const activeTab = ref('contacts')
const tabItems = [
  { label: 'Contacts', value: 'contacts' },
  { label: 'My Invitations', value: 'invitations' },
  { label: 'Carrier ID Mapping', value: 'carrier' },
]

const pageInfo = ref({
  title: 'Partners',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Management' }, { text: 'Partners' }],
})

// ============================================================
// ===== Contacts (EBLPAT010U) =====
// ============================================================
const gridApi = shallowRef(null)
const potentialGridApi = shallowRef(null)
const dialogOpen = ref(false)
const dialogMode = ref('detail') // 'detail', 'add', 'modify'
const potentialOpen = ref(false)
const detailRow = ref(null)
const selectedPotential = ref(null)

const page = ref(1)
const itemsPerPage = ref(10)

const roleOptions = [
  { label: 'All', value: '' },
  { label: 'Shipper', value: 'Shipper' },
  { label: 'Carrier', value: 'Carrier' },
  { label: 'Bank/Nego Agent', value: 'Bank/Nego Agent' },
  { label: 'Bank', value: 'Bank' },
]

const formData = reactive({
  mid: '',
  userName: '',
  phoneNumber: '',
  faxNumber: '',
  addDate: '',
  country: '',
  role: '',
  companyName: '',
  dunsNumber: '',
  corporationNumber: '',
  owner: '',
  zipCode: '',
  spotCode: '',
  cityRegion: '',
  address1: '',
  address2: '',
  companyLogo: '',
})

const canSave = computed(() => formData.mid && formData.userName && formData.phoneNumber)

const potentialFilters = reactive({ companyName: 'Company Name', search: '' })

// 더미 데이터 생성 함수
const generateDummyData = () => {
  const data = []
  const countries = ['KR', 'USA', 'CN', 'JP']
  const roles = ['Shipper', 'Carrier', 'Bank/Nego Agent', 'Bank']
  const companies = [
    'KTNETBL1',
    'CJ Logistics Corporation',
    'KEB Hana Bank',
    'Hyundai Merchant Marine Co. Ltd',
  ]
  const owners = ['Gil-Dong Hong', 'Kevin Brown', 'James Park', 'A-Yong Kim']

  for (let i = 1; i <= 100; i++) {
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = date.toISOString().split('T')[0]

    data.push({
      no: i,
      country: countries[i % countries.length],
      role: roles[i % roles.length],
      companyName: companies[i % companies.length],
      dunsNumber: 'x'.repeat(15),
      mid: `xxx@${companies[i % companies.length].toLowerCase().replace(/\s/g, '')}.com`,
      owner: owners[i % owners.length],
      phoneNumber: 'xxxxxxxxxxxx',
      addDate: formattedDate,
      userName: owners[i % owners.length],
      faxNumber: 'xxxxxxxxxxxx',
      corporationNumber: 'x'.repeat(15),
      zipCode: '12345',
      spotCode: '-',
      cityRegion: 'Seoul/Gangnam-gu',
      address1: '21, Samseong-dong',
      address2: '-',
      companyLogo: `https://i.pravatar.cc/120?img=${(i % 70) + 1}`,
    })
  }
  return data
}

const rowData = ref(generateDummyData())
const sortedRowData = computed(() => {
  return [...rowData.value].sort((a, b) => (b.no ?? 0) - (a.no ?? 0))
})

// Potential Partners 더미 데이터
const potentialData = ref([
  {
    companyName: 'KTNETBL1',
    role: 'Shipper',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@ktnet.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=21',
  },
  {
    companyName: 'CJ Logistics Corporation',
    role: 'Carrier',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@cj.com',
    companyLogo: 'https://i.pravatar.cc/120?img=22',
  },
  {
    companyName: 'KEB Hana Bank',
    role: 'Bank',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@hana.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=23',
  },
  {
    companyName: 'KTNETBL1',
    role: 'Carrier',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@ktnet.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=24',
  },
  {
    companyName: 'CJ Logistics Corporation',
    role: 'Bank',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@cj.com',
    companyLogo: 'https://i.pravatar.cc/120?img=25',
  },
  {
    companyName: 'KEB Hana Bank',
    role: 'Carrier',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@hana.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=26',
  },
  {
    companyName: 'KTNETBL1',
    role: 'Bank',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@ktnet.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=27',
  },
  {
    companyName: 'CJ Logistics Corporation',
    role: 'Shipper',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@cj.com',
    companyLogo: 'https://i.pravatar.cc/120?img=28',
  },
  {
    companyName: 'Hyundai Merchant Marine Co. Ltd',
    role: 'Carrier',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@HY.com',
    companyLogo: 'https://i.pravatar.cc/120?img=29',
  },
  {
    companyName: 'KEB Hana Bank',
    role: 'Carrier',
    dunsNumber: 'x'.repeat(15),
    mid: 'xxx@hana.co.kr',
    companyLogo: 'https://i.pravatar.cc/120?img=30',
  },
])

// 필터가 적용된 데이터
const filteredRowData = computed(() => {
  return sortedRowData.value.filter((row) => {
    const matchesCompanyName = (row.companyName || '')
      .toLowerCase()
      .includes(appliedFilters.companyName.toLowerCase())
    const matchesDunsNo = (row.dunsNumber || '')
      .toLowerCase()
      .includes(appliedFilters.dunsNo.toLowerCase())
    const matchesRoles = appliedFilters.roles === '' || (row.role || '') === appliedFilters.roles

    let matchesDate = true
    if (appliedFilters.dateRange && appliedFilters.dateRange[0] && appliedFilters.dateRange[1]) {
      const rowDate = new Date(row.addDate || row.date)
      const startDate = new Date(appliedFilters.dateRange[0])
      const endDate = new Date(appliedFilters.dateRange[1])
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = rowDate >= startDate && rowDate <= endDate
    }

    return matchesCompanyName && matchesDunsNo && matchesRoles && matchesDate
  })
})

// 최대 페이지 수
const maxPage = computed(() => {
  return Math.ceil(filteredRowData.value.length / itemsPerPage.value)
})

// 페이지네이션된 rowData
const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRowData.value.slice(start, end)
})

// itemsPerPage 변경 시 현재 페이지 조정
watch([itemsPerPage, () => rowData.value.length], () => {
  if (page.value > maxPage.value) {
    page.value = Math.max(1, maxPage.value)
  }
  if (page.value < 1) {
    page.value = 1
  }
})

// Column Definitions
const colDefs = ref([
  {
    field: 'no',
    headerName: 'No',
    width: 60,
    maxWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'country',
    headerName: 'Country',
    width: 88,
    minWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'role',
    headerName: 'Roles',
    width: 120,
    minWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'companyName',
    headerName: 'Company Name',
    flex: 1,
    minWidth: 180,
    cellDataType: false,
    cellRenderer: CompanyNameCellRenderer,
    cellClass: 'line-2',
    cellRendererParams: (params) => ({
      name:
        typeof params.data?.companyName === 'string'
          ? params.data.companyName
          : (params.data?.companyName?.name ?? ''),
      logo: params.data?.companyLogo || params.data?.companyName?.logo || '',
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'dunsNumber',
    headerName: 'DUNS Number',
    width: 180,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'mid',
    headerName: 'MID',
    flex: 1,
    minWidth: 180,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'owner',
    headerName: 'Administrator',
    width: 150,
    minWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'addDate',
    headerName: 'Add Date',
    width: 120,
    minWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// Potential Partners Column Definitions
const potentialColDefs = ref([
  {
    field: 'companyName',
    headerName: 'Company Name',
    flex: 1,
    minWidth: 200,
    cellStyle: {
      display: 'flex',
      alignItems: 'flex-start',
      paddingTop: '0',
      paddingBottom: '0',
    },
    cellDataType: false,
    cellClass: 'line-2',
    cellRenderer: CompanyNameCellRenderer,
    cellRendererParams: (params) => ({
      name: params.data?.companyName || '',
      logo: params.data?.companyLogo || '',
      prefix: params.data?.country || '',
      showSelector: true,
    }),
    headerStyle: { justifyContent: 'flex-start' },
    rowSelection: {
      checkboxes: true,
      headerCheckbox: false,
    },
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 150,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'dunsNumber',
    headerName: 'DUNS Number',
    width: 150,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'mid',
    headerName: 'MID',
    flex: 1,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// ===== 필터 로직 =====
// 기본 날짜 범위 반환
function getDefaultDateRange() {
  return [new Date('2025-12-01'), new Date('2026-01-01')]
}

// 필터 상태 (입력용)
const filters = reactive({
  companyName: '',
  dunsNo: '',
  roles: '',
  dateRange: getDefaultDateRange(),
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  companyName: '',
  dunsNo: '',
  roles: '',
  dateRange: null,
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.companyName = filters.companyName
  appliedFilters.dunsNo = filters.dunsNo
  appliedFilters.roles = filters.roles
  appliedFilters.dateRange = filters.dateRange ? [...filters.dateRange] : null
  page.value = 1
}

// 모든 필터 조건 초기화
const resetFilters = () => {
  filters.companyName = ''
  filters.dunsNo = ''
  filters.roles = ''
  filters.dateRange = getDefaultDateRange()
  appliedFilters.companyName = ''
  appliedFilters.dunsNo = ''
  appliedFilters.roles = ''
  appliedFilters.dateRange = null
  page.value = 1
}

// AG Grid 이벤트 핸들러
const onGridReady = (params) => {
  gridApi.value = params.api
}

const onPotentialGridReady = (params) => {
  potentialGridApi.value = params.api
}

// 셀 클릭 핸들러
const onCellClicked = (params) => {
  if (params.column.getColId() === 'companyName' || params.column.getColId() === 'mid') {
    detailRow.value = params.data
    dialogMode.value = 'detail'
    dialogOpen.value = true
  }
}

const onPotentialSelectionChanged = () => {
  const selected = potentialGridApi.value?.getSelectedRows()
  selectedPotential.value = selected?.[0] || null
}

const closeDialog = () => {
  dialogOpen.value = false
  dialogMode.value = 'detail'
  detailRow.value = null
  // Reset form
  Object.keys(formData).forEach((key) => {
    formData[key] = ''
  })
}

const openAddDialog = () => {
  dialogMode.value = 'add'
  dialogOpen.value = true
}

const switchToModify = () => {
  // formData에 detailRow 데이터 복사
  Object.keys(detailRow.value).forEach((key) => {
    if (key in formData) {
      formData[key] = detailRow.value[key]
    }
  })
  dialogMode.value = 'modify'
}

const openPotentialDialog = () => {
  potentialOpen.value = true
}

const closePotentialDialog = () => {
  potentialOpen.value = false
  selectedPotential.value = null
}

const handleSelectPotential = () => {
  if (selectedPotential.value) {
    formData.mid = selectedPotential.value.mid
    formData.companyName = selectedPotential.value.companyName
    formData.role = selectedPotential.value.role
    formData.dunsNumber = selectedPotential.value.dunsNumber
    // 기타 필드들도 자동 입력되도록 설정 (더미 데이터)
    formData.country = 'KR'
    formData.corporationNumber = 'x'.repeat(15)
    formData.owner = 'Gil-Dong Hong'
    formData.zipCode = '12345'
    formData.spotCode = '-'
    formData.cityRegion = 'Seoul/Gangnam-gu'
    formData.address1 = '21, Samseong-dong'
    formData.address2 = '-'
    formData.companyLogo = selectedPotential.value.companyLogo || ''
    closePotentialDialog()
  }
}

const handleDelete = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: '경고',
    icon: 'warning',
    message: '해당 파트너를 삭제 하시겠습니까?',
    confirmText: '확인',
    cancelText: '취소',
  })

  if (!confirmed) return

  // rowData에서 해당 항목 제거
  const index = rowData.value.findIndex((row) => row.no === detailRow.value.no)
  if (index > -1) {
    rowData.value.splice(index, 1)
  }
  closeDialog()
}

const handleSave = () => {
  if (dialogMode.value === 'add') {
    const newItem = {
      no: Math.max(...rowData.value.map((r) => r.no)) + 1,
      ...formData,
      addDate: new Date().toISOString().split('T')[0],
    }
    rowData.value.unshift(newItem)
    console.log('Add:', newItem)
  } else if (dialogMode.value === 'modify') {
    const index = rowData.value.findIndex((row) => row.no === detailRow.value.no)
    if (index > -1) {
      Object.keys(formData).forEach((key) => {
        rowData.value[index][key] = formData[key]
      })
    }
    console.log('Modify:', formData)
  }
  closeDialog()
}

// ============================================================
// ===== My Invitations (EBLPAT050U) =====
// ============================================================
const inv_gridApi = shallowRef(null)
const inv_page = ref(1)
const inv_itemsPerPage = ref(10)
const inv_detailOpen = ref(false)
const inv_createOpen = ref(false)
const inv_detailRow = ref(null)

const inv_dialogOpen = computed({
  get: () => inv_detailOpen.value || inv_createOpen.value,
  set: (value) => {
    if (!value) inv_closeDialog()
  },
})

const inv_createForm = reactive({ recipient: '', companyName: '', title: '', message: '' })
const inv_createFormErrors = reactive({ recipient: '', companyName: '', title: '', message: '' })
const inv_tempNum = ref(1)

const inv_receptionStatusOptions = [
  { label: 'All', value: '' },
  { label: 'Send', value: 'Send' },
  { label: 'Read', value: 'Read' },
  { label: 'Expiration', value: 'Expiration' },
  { label: 'Error', value: 'Error' },
]

const inv_generateDummyData = () => {
  const data = []
  const companies = [
    { name: 'KTNETBL1', logo: 'https://i.pravatar.cc/120?img=10' },
    { name: 'CJ Logistics Corporation', logo: 'https://i.pravatar.cc/120?img=20' },
    { name: 'KEB Hana Bank', logo: 'https://i.pravatar.cc/120?img=30' },
    { name: 'Hyundai Merchant Marine Co. Ltd', logo: 'https://i.pravatar.cc/120?img=40' },
  ]
  const mids = ['xxx@ktnet.co.kr', 'xxx@cj.com', 'xxx@hana.co.kr', 'xxx@HY.com', 'xxx@ebl.com']
  const statuses = ['Send', 'Read', 'Expiration', 'Error']
  const administrators = ['Gil-Dong Hong', 'Kevin Brown', 'James Park', 'A-Yong Kim']
  for (let i = 1; i <= 100; i++) {
    const randomDays = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - randomDays)
    const formattedDate = date.toISOString().split('T')[0]
    const formattedDateTime = `${formattedDate} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:20`
    const company = companies[i % companies.length]
    data.push({
      no: i,
      mid: mids[i % mids.length],
      companyName: company.name,
      companyLogo: company.logo,
      sendDate: formattedDateTime,
      receptionStatus: statuses[i % statuses.length],
      administrator: administrators[i % administrators.length],
      expirationDate: formattedDate,
      title: 'eBL 물류 포털 시스템에 귀사를 초대합니다.',
      message: '메시지 내용입니다.',
    })
  }
  return data
}

const inv_rowData = ref(inv_generateDummyData())
const inv_sortedRowData = computed(() =>
  [...inv_rowData.value].sort((a, b) => (b.no ?? 0) - (a.no ?? 0)),
)

const inv_filters = reactive({
  companyName: '',
  mid: '',
  receptionStatus: '',
  dateRange: null,
})
const inv_appliedFilters = reactive({
  companyName: '',
  mid: '',
  receptionStatus: '',
  dateRange: null,
})

const inv_filteredRowData = computed(() => {
  return inv_sortedRowData.value.filter((row) => {
    const matchesCompanyName = (row.companyName || '')
      .toLowerCase()
      .includes(inv_appliedFilters.companyName.toLowerCase())
    const matchesRecipient = (row.mid || '')
      .toLowerCase()
      .includes(inv_appliedFilters.mid.toLowerCase())
    const matchesStatus =
      inv_appliedFilters.receptionStatus === '' ||
      row.receptionStatus === inv_appliedFilters.receptionStatus
    let matchesDate = true
    if (inv_appliedFilters.dateRange?.[0] && inv_appliedFilters.dateRange?.[1]) {
      const rowDate = new Date(row.sendDate)
      const start = new Date(inv_appliedFilters.dateRange[0])
      start.setHours(0, 0, 0, 0)
      const end = new Date(inv_appliedFilters.dateRange[1])
      end.setHours(23, 59, 59, 999)
      matchesDate = rowDate >= start && rowDate <= end
    }
    return matchesCompanyName && matchesRecipient && matchesStatus && matchesDate
  })
})

const inv_paginatedRowData = computed(() => {
  const start = (inv_page.value - 1) * inv_itemsPerPage.value
  return inv_filteredRowData.value.slice(start, start + inv_itemsPerPage.value)
})

watch([inv_itemsPerPage, () => inv_rowData.value.length], () => {
  const max = Math.ceil(inv_filteredRowData.value.length / inv_itemsPerPage.value)
  if (inv_page.value > max) inv_page.value = Math.max(1, max)
})

const inv_colDefs = ref([
  {
    field: 'no',
    headerName: 'No',
    width: 60,
    maxWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'mid',
    headerName: 'MID',
    width: 220,
    minWidth: 200,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'companyName',
    headerName: 'Company Name',
    flex: 1,
    minWidth: 180,
    cellDataType: false,
    cellRenderer: CompanyNameCellRenderer,
    cellClass: 'line-2',
    cellRendererParams: (params) => ({
      name: params.data?.companyName || '',
      logo: params.data?.companyLogo || '',
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'sendDate',
    headerName: 'Send Date',
    width: 210,
    minWidth: 190,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    field: 'administrator',
    headerName: 'Administrator',
    width: 170,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
    cellStyle: (params) =>
      params.data?.receptionStatus === 'Expiration' ? { color: '#ff1c1c' } : null,
  },
  {
    field: 'expirationDate',
    headerName: 'Expiration Date',
    width: 160,
    minWidth: 150,
    headerStyle: { justifyContent: 'flex-start' },
    cellStyle: (params) =>
      params.data?.receptionStatus === 'Expiration' ? { color: '#ff1c1c' } : null,
  },
])

const inv_applyFilters = () => {
  Object.assign(inv_appliedFilters, {
    ...inv_filters,
    dateRange: inv_filters.dateRange ? [...inv_filters.dateRange] : null,
  })
  inv_page.value = 1
}
const inv_resetFilters = () => {
  Object.assign(inv_filters, {
    companyName: '',
    mid: '',
    receptionStatus: '',
    dateRange: null,
  })
  Object.assign(inv_appliedFilters, {
    companyName: '',
    mid: '',
    receptionStatus: '',
    dateRange: null,
  })
  inv_page.value = 1
}
const inv_onGridReady = (params) => {
  inv_gridApi.value = params.api
}
const inv_onCellClicked = (params) => {
  if (['mid', 'companyName'].includes(params.column.getColId())) {
    inv_detailRow.value = params.data
    inv_detailOpen.value = true
    inv_createOpen.value = false
  }
}
const inv_openCreateDialog = () => {
  inv_createOpen.value = true
  inv_detailOpen.value = false
}
const inv_openCreateFromResend = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: '경고',
    icon: 'warning',
    message: '초대장을 재발송 하시겠습니까?',
    confirmText: '확인',
    cancelText: '취소',
  })
  if (!confirmed) return
  inv_detailOpen.value = false
  toastStore.add({ text: '해당 이메일로 초대장을 발송 하였습니다.' })
}
const inv_closeCreateDialog = () => {
  inv_createOpen.value = false
  if (!inv_detailOpen.value) inv_closeDialog()
}
const inv_closeDialog = () => {
  inv_detailOpen.value = false
  inv_createOpen.value = false
  inv_detailRow.value = null
  Object.assign(inv_createForm, { recipient: '', companyName: '', title: '', message: '' })
  Object.assign(inv_createFormErrors, { recipient: '', companyName: '', title: '', message: '' })
}
const inv_handleDuplicateCheck = () => {
  inv_tempNum.value++
  if (inv_tempNum.value % 2 === 0) {
    inv_createFormErrors.recipient = ''
    toastStore.add({ text: '해당 이메일로 초대장 발송이 가능합니다.' })
  } else {
    inv_createFormErrors.recipient = '이미 등록된 사용자의 이메일 주소입니다.'
  }
}
const inv_handleSend = () => {
  Object.assign(inv_createFormErrors, { recipient: '', companyName: '', title: '', message: '' })
  let valid = true
  if (!inv_createForm.recipient.trim()) {
    inv_createFormErrors.recipient = '필수 항목입니다.'
    valid = false
  }
  if (!inv_createForm.companyName.trim()) {
    inv_createFormErrors.companyName = '필수 항목입니다.'
    valid = false
  }
  if (!inv_createForm.title.trim()) {
    inv_createFormErrors.title = '필수 항목입니다.'
    valid = false
  }
  if (!inv_createForm.message.trim()) {
    inv_createFormErrors.message = '필수 항목입니다.'
    valid = false
  }
  if (valid) {
    inv_closeDialog()
    toastStore.add({ text: '해당 이메일로 초대장을 발송 하였습니다.' })
  }
}

// ============================================================
// ===== Carrier ID Mapping (EBLSET020U) =====
// ============================================================
const car_gridApi = ref(null)
const car_page = ref(1)
const car_itemsPerPage = ref(10)
const car_dialogOpen = ref(false)
const car_isEditMode = ref(false)

const car_formData = ref({
  mid: '',
  carrierCode: '',
  shipperId: '',
  companyName: '',
  companyLogo: '',
})
const car_errors = ref({ carrierCode: '', shipperId: '', companyName: '' })

const car_companies = [
  {
    name: 'Hyundai Merchant Marine Co. Ltd',
    logo: 'https://i.pravatar.cc/120?img=11',
    carrierCode: 'HMM1',
    shipperId: 'MasterID@hmm.com',
  },
  {
    name: 'MSC',
    logo: 'https://i.pravatar.cc/120?img=12',
    carrierCode: 'MSC1',
    shipperId: 'MasterID@msc.com',
  },
  {
    name: 'Maersk Line',
    logo: 'https://i.pravatar.cc/120?img=13',
    carrierCode: 'MAEU',
    shipperId: 'MasterID@maersk.com',
  },
  {
    name: 'CMA CGM',
    logo: 'https://i.pravatar.cc/120?img=14',
    carrierCode: 'CMDU',
    shipperId: 'MasterID@cma.com',
  },
  {
    name: 'Evergreen',
    logo: 'https://i.pravatar.cc/120?img=15',
    carrierCode: 'EGLV',
    shipperId: 'MasterID@evergreen.com',
  },
  {
    name: 'COSCO',
    logo: 'https://i.pravatar.cc/120?img=16',
    carrierCode: 'COSU',
    shipperId: 'MasterID@cosco.com',
  },
  {
    name: 'ONE',
    logo: 'https://i.pravatar.cc/120?img=17',
    carrierCode: 'ONEY',
    shipperId: 'MasterID@one.com',
  },
  {
    name: 'Hapag-Lloyd',
    logo: 'https://i.pravatar.cc/120?img=18',
    carrierCode: 'HLCU',
    shipperId: 'MasterID@hapag.com',
  },
  {
    name: 'Yang Ming',
    logo: 'https://i.pravatar.cc/120?img=19',
    carrierCode: 'YMLU',
    shipperId: 'MasterID@ym.com',
  },
  {
    name: 'OOCL',
    logo: 'https://i.pravatar.cc/120?img=21',
    carrierCode: 'OOLU',
    shipperId: 'MasterID@oocl.com',
  },
]

const car_rowData = ref(
  (() => {
    const data = []
    const mids = ['xxx@ktnet.co.kr', 'xxx@cj.com', 'xxx@hana.co.kr', 'xxx@HY.com', 'xxx@ebl.com']
    const dates = [
      '2025-09-19 15:30:20',
      '2025-08-20 15:30:20',
      '2025-07-15 09:20:10',
      '2025-06-10 14:50:30',
      '2025-05-05 11:00:00',
      '2025-04-01 15:30:20',
      '2025-03-24 15:30:20',
    ]
    for (let i = 1; i <= 50; i++) {
      const company = car_companies[i % car_companies.length]
      data.push({
        no: i,
        mid: mids[i % mids.length],
        companyName: company.name,
        companyLogo: company.logo,
        shipperId: company.shipperId,
        carrierCode: company.carrierCode,
        sendDate: dates[i % dates.length],
      })
    }
    return data.sort((a, b) => b.no - a.no)
  })(),
)

const car_paginatedRowData = computed(() => {
  const start = (car_page.value - 1) * car_itemsPerPage.value
  return car_rowData.value.slice(start, start + car_itemsPerPage.value)
})

const car_colDefs = ref([
  {
    headerName: 'No',
    field: 'no',
    width: 60,
    maxWidth: 100,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'MID',
    field: 'mid',
    width: 200,
    minWidth: 180,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'Company Name',
    field: 'companyName',
    flex: 1,
    minWidth: 180,
    cellDataType: false,
    cellRenderer: CompanyNameCellRenderer,
    cellClass: 'line-2',
    cellRendererParams: (params) => ({
      name: params.data?.companyName || '',
      logo: params.data?.companyLogo || '',
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'Shipper ID',
    field: 'shipperId',
    width: 190,
    minWidth: 170,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'Carrier Code',
    field: 'carrierCode',
    width: 190,
    minWidth: 170,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'Send Date',
    field: 'sendDate',
    width: 210,
    minWidth: 190,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

const car_onGridReady = (params) => {
  car_gridApi.value = params.api
}
const car_onCellClicked = (params) => {
  if (params.column.colId === 'mid') car_openEditDialog(params.data)
}
const car_openAddDialog = () => {
  car_isEditMode.value = false
  car_formData.value = { mid: '', carrierCode: '', shipperId: '', companyName: '', companyLogo: '' }
  car_errors.value = { carrierCode: '', shipperId: '', companyName: '' }
  car_dialogOpen.value = true
}
const car_openEditDialog = (data) => {
  car_isEditMode.value = true
  car_formData.value = {
    mid: data.mid,
    carrierCode: data.carrierCode,
    shipperId: data.shipperId,
    companyName: data.companyName,
    companyLogo: data.companyLogo || '',
  }
  car_errors.value = { carrierCode: '', shipperId: '', companyName: '' }
  car_dialogOpen.value = true
}
const car_closeDialog = () => {
  car_dialogOpen.value = false
  car_errors.value = { carrierCode: '', shipperId: '', companyName: '' }
}
const car_searchCarrierCode = () => {
  console.log('Search carrier code')
}
const car_saveUserInfo = () => {
  car_errors.value = { carrierCode: '', shipperId: '', companyName: '' }
  let hasError = false
  if (!car_formData.value.carrierCode) {
    car_errors.value.carrierCode = '필수 항목을 입력해 주세요.'
    hasError = true
  }
  if (!car_formData.value.shipperId) {
    car_errors.value.shipperId = '필수 항목을 입력해 주세요.'
    hasError = true
  }
  if (!car_formData.value.companyName) {
    car_errors.value.companyName = '필수 항목을 입력해 주세요.'
    hasError = true
  }
  if (hasError) return
  console.log('Save user info:', car_formData.value)
  car_closeDialog()
}
</script>
