<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="danger" large @click="handleDelete">Delete</EblBtn>
        <EblBtn color="primary" outlined large @click="handleSave">Save</EblBtn>
      </template>
    </EblPageHeader>

    <!-- B/L No -->
    <div class="ebl-card-container mb-3">
      <!-- <EblSubHeader small>
        <h2>B/L No</h2>
      </EblSubHeader> -->
      <EblBlNo
        :no="formData.blNo"
        :badges="blBadges"
        @click="handleBlNoClick"
        @click-empty="handleBlNoEmpty"
        @refresh="handleBlNoRefresh"
      />
    </div>

    <!-- Main Content -->
    <div class="ebl-card-container">
      <!-- Action Buttons -->
      <div class="d-flex justify-end ga-2">
        <EblBtn color="tertiary" @click="openActionDialog('amendment')">Amendment</EblBtn>
        <EblBtn color="tertiary" @click="openActionDialog('paper')">Paper</EblBtn>
        <EblBtn color="tertiary" @click="openActionDialog('delivery')">Delivery</EblBtn>
      </div>

      <!-- Recipient -->
      <EblSubHeader small>
        <h2>Recipient</h2>
      </EblSubHeader>
      <EblRecipient
        :items="formData.recipient"
        class="mb-4"
        @click="handleRecipientClick"
        @click-empty="handleRecipientEmpty"
        @refresh="handleRecipientRefresh"
      />

      <!-- Preview & History -->
      <div class="ebl-2-column mb-4">
        <!-- B/L Preview -->
        <div class="ebl-compose-preview-section">
          <EblSubHeader small class="mb-3">
            <h2>B/L Preview</h2>
            <template #util>
              <EblBtn color="outlined" prepend-icon="ebli:download" @click="handleDownload">
                Download
              </EblBtn>
            </template>
          </EblSubHeader>
          <div class="preview-content">
            <p class="file-name">
              <span>{{ previewFile.name }}</span>
              <small>{{ previewFile.size }}</small>
            </p>
            <img :src="previewFile.url" :alt="previewFile.name" class="preview-image" />
            <EblBtn
              color="tertiary"
              pill
              icon="ebli:search"
              small
              class="btn-search"
              @click="handlePreview"
            />
          </div>
        </div>

        <!-- B/L History -->
        <div class="ebl-compose-history-section">
          <EblSubHeader small class="mb-3">
            <h2>B/L History</h2>
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
                  <span>{{ item.date }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Attach Documents -->
      <EblSubHeader small>
        <h2>Attach Documents</h2>
      </EblSubHeader>
      <div class="ebl-folder-grid mt-1 mb-4">
        <EblFolderItem
          v-for="item in folderGridItems"
          :key="item.name"
          :name="item.name"
          :files="item.files"
          :is-add="item.isAdd"
          @click="handleFolderClick(item)"
          @add="handleFolderAdd"
        />
      </div>

      <!-- Message -->
      <EblSubHeader small class="mb-3">
        <h2>Message</h2>
        <template #tooltip>수신인에게 보낼 메시지를 입력해 주세요</template>
      </EblSubHeader>
      <EblTextarea
        v-model="formData.message"
        placeholder="메시지를 입력하세요"
        :maxlength="500"
        counter
      />
      <!-- Action Buttons Anchor (for intersection observer) -->
      <div v-intersect="onActionButtonsIntersect" class="action-buttons-anchor" />
      <div class="ebl-page-actions--wrap">
        <VSpacer />
        <EblBtn color="cta" :disabled="showAction" large>Endorse</EblBtn>
        <EblBtn color="cta" :disabled="showAction" large>Transfer</EblBtn>
      </div>
      <div
        :class="[
          'ebl-page-actions--wrap',
          'ebl-page-actions--sticky',
          { visible: !isIntersectingAction },
        ]"
      >
        <VSpacer />
        <EblBtn color="cta" :disabled="showAction" large>Endorse</EblBtn>
        <EblBtn color="cta" :disabled="showAction" large>Transfer</EblBtn>
      </div>
    </div>
    <!-- Attach Documents Dialog -->
    <EblDialog
      v-model="folderDialog.open"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog ebl-dialog--multiple fill-height"
      scrollable
      @close="closeDialog"
    >
      <VCard width="500" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Attach Documents</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <!-- 폴더 그리드 (3열 로우) -->
          <div class="ebl-folder-grid--dialog mb-6">
            <template v-for="(row, rowIndex) in dialogFolderRows" :key="`row-${rowIndex}`">
              <div class="ebl-folder-grid--dialog-row">
                <EblFolderItem
                  v-for="folder in row"
                  :key="folder.name"
                  :name="folder.name"
                  :files="folder.files"
                  :is-active="folderDialog.expandedFolder?.name === folder.name"
                  :has-remove="folder.isAdded"
                  :is-loading="
                    folderDialog.isLoading && folderDialog.loadingFolderName === folder.name
                  "
                  @click="handleDialogFolderClick(folder)"
                  @remove="handleDialogFolderRemove(folder)"
                />
              </div>

              <!-- 확장된 폴더 콘텐츠 (선택된 폴더 바로 아래 로우) -->
              <VExpandTransition appear leave-absolute>
                <div v-if="rowIndex === expandedRowIndex">
                  <div class="file-list--expand-wrap">
                    <!-- 첨부 파일 리스트 -->
                    <div v-if="folderDialog.expandedFolder?.files.length" class="file-list">
                      <div
                        v-for="file in folderDialog.expandedFolder.files"
                        :key="file.id"
                        class="file-item"
                      >
                        <div class="file-details">
                          <p class="file-name">name.png</p>
                          <span class="file-meta">20 KB</span>
                        </div>
                        <div class="file-meta-right">
                          <span class="company">Hyundai Merchant Marine Co. Ltd</span>
                          <span class="date">2025-09-01 15:00:00</span>
                        </div>
                        <EblBtn icon small color="ghost">
                          <VIcon size="16">mdi-trash-can-outline</VIcon>
                        </EblBtn>
                      </div>
                      <!-- 파일 업로드 -->
                    </div>
                    <EblFileInput
                      v-model="folderDialog.uploadFiles"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      placeholder="Click here to upload your file or drag."
                      help-text="PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (50MB max)"
                    />
                  </div>
                </div>
              </VExpandTransition>
            </template>
          </div>

          <!-- Optional Documents -->
          <EblSubHeader small>
            <h3>Optional Documents (Tap to Add)</h3>
          </EblSubHeader>
          <div class="d-flex ga-2">
            <EblSelect
              v-model="folderDialog.selectedDoc"
              placeholder="Select"
              :options="availableOptionalDocs"
              class="block"
            />
            <EblBtn color="outlined" @click="addOptionalDocToDialog">Add</EblBtn>
          </div>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="closeDialog">Cancel</EblBtn>
          <EblBtn color="cta" large @click="saveFolderDoc">Save</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>

    <!-- Action Dialog (Amendment/Paper/Delivery) -->
    <EblDialog
      v-model="actionDialog.open"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog fill-height"
      scrollable
      @close="closeActionDialog"
    >
      <VCard width="520" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">eBL Request</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeActionDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <!-- B/L Info -->
          <div class="ebl-info-box ebl-info-box--wrap mb-6">
            <div class="ebl-info-box--row">
              <h3 class="bl-no">
                {{ formData.blNo }}
              </h3>
            </div>
            <VDivider />
            <div class="ebl-info-box--row">
              <div class="ebl-info-box--col">
                <span class="label">From</span>
                <div class="company">
                  <div class="logo">
                    <img src="~/assets/images/common/ci/HMM.png" alt="hmm" />
                  </div>
                  <span> HMM </span>
                </div>
              </div>
            </div>
            <VDivider />
            <div class="ebl-info-box--row">
              <div class="ebl-info-box--col">
                <span class="label">label</span>
                <span class="text"><strong>KRPUS</strong> (BUSAN, KOREA)</span>
              </div>
              <div class="ebl-info-box--col">
                <span class="label">label</span>
                <span class="text"><strong>2025-10-14 </strong></span>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <EblInfo vertical>
            <EblInfoItem label="Recipient" has-input>
              <EblInput
                v-model="actionDialog.formData.recipient"
                readonly
                placeholder="Recipient name"
              />
            </EblInfoItem>
            <EblInfoItem label="Request Type" has-input>
              <!--2026.05.18 select 내 block 변수 추가-->
              <EblSelect
                v-model="actionDialog.formData.requestType"
                placeholder="Select request type"
                :options="requestTypeOptions"
                block
              />
            </EblInfoItem>
            <EblInfoItem label="Send Date" has-input>
              <EblDatePicker
                v-model="actionDialog.formData.sendDate"
                readonly
                placeholder="Select date"
              />
            </EblInfoItem>
            <EblInfoItem label="Comment" has-input>
              <EblTextarea
                v-model="actionDialog.formData.comment"
                placeholder="Enter your comment"
                :maxlength="1000"
                counter
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="closeActionDialog">Cancel</EblBtn>
          <EblBtn color="cta" large @click="submitActionDialog">Submit</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>

    <!-- Delete Dialog (B/L Select) -->
    <EblDialog
      v-model="deleteDialog.open"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog ebl-dialog--multiple"
      scrollable
      @close="closeDeleteDialog"
    >
      <VCard width="900" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">B/L Select</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeDeleteDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <!-- Total Count and Search -->
          <EblSubHeader small>
            <h3>Total</h3>
            <span class="count">{{ formatNumber(filteredBlListData.length) }}</span>
            <template #util>
              <EblSelect
                v-model="deleteDialog.searchFieldType"
                :options="searchFieldOptions"
                style="width: 150px"
              />
              <EblInput
                v-model="deleteDialog.searchKeyword"
                :placeholder="`Search ${searchFieldOptions.find((o) => o.value === deleteDialog.searchFieldType)?.label}`"
                clearable
                prepend-icon="ebli:search"
              />
            </template>
          </EblSubHeader>

          <!-- AG Grid -->
          <AgGridVue
            class="ebl-data-grid ag-theme-quartz"
            :row-data="paginatedBlListData"
            :column-defs="colDefsDelete"
            :dom-layout="'autoHeight'"
            :row-selection="rowSelectionBlList"
            @grid-ready="onDeleteGridReady"
            @selection-changed="onDeleteSelectionChanged"
          />

          <!-- Pagination -->
          <div class="ebl-pagination--container justify-center mt-3">
            <EblPagination
              v-model="deleteDialog.page"
              :length="blTotalPages"
              total-visible="5"
              show-first-last-page
            />
          </div>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="closeDeleteDialog">Cancel</EblBtn>
          <EblBtn color="cta" large :disabled="!deleteDialog.selectedBlNo" @click="handleSelectBlNo"
            >Select</EblBtn
          >
        </VCardActions>
      </VCard>
    </EblDialog>

    <!-- Preview Dialog -->
    <EblDialog
      v-model="previewDialog.open"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog fill-height"
      scrollable
      @close="closePreviewDialog"
    >
      <VCard width="700" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Preview</span>
          <VSpacer />
          <EblBtn icon pill small @click="closePreviewDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              min-height: 700px;
              background-color: #efeff1;
            "
          >
            previewer
          </div>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn color="cta" large>Download</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>

    <!-- Recipient Select Dialog -->
    <EblDialog
      v-model="recipientSelectDialogOpen"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog fill-height"
      @close="closeRecipientDialog"
    >
      <VCard width="820" class="ebl-dialog__card ebl-bl-select">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Recipient</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeRecipientDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text overflow-y-auto">
          <div class="ebl-bl-select__top">
            <div class="ebl-bl-select__total">
              Total <strong>{{ filteredRecipientItems.length }}</strong>
            </div>
            <div class="ebl-bl-select__filters">
              <EblSelect
                v-model="recipientSelectFilters.key"
                :options="recipientSelectFilterOptions"
                class="ebl-bl-select__filter"
              />
              <EblInput v-model="recipientSelectFilters.query" placeholder="Search..." />
            </div>
          </div>

          <div class="ebl-bl-select__table-wrap">
            <AgGridVue
              class="ebl-data-grid ag-theme-quartz"
              :row-data="pagedRecipientItems"
              :column-defs="recipientSelectColDefs"
              :row-selection="recipientSelectRowSelection"
              :dom-layout="'autoHeight'"
              @grid-ready="onRecipientGridReady"
              @selection-changed="onRecipientSelectionChanged"
              @row-clicked="onRecipientRowClicked"
            />
          </div>

          <div class="ebl-bl-select__pagination">
            <EblPagination
              v-model="recipientSelectPage"
              :length="Math.ceil(filteredRecipientItems.length / recipientSelectPerPage) || 1"
              total-visible="7"
              show-first-last-page
            />
          </div>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="closeRecipientDialog">Cancel</EblBtn>
          <EblBtn color="cta" large @click="confirmRecipientSelection">Select</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3'
import { useFormat } from '~/composables/useFormat'
import { useToastStore } from '~/stores/toast'
import { useDialogStore } from '~/stores/useDialogStore'
import CompanyNameCellRenderer from '~/components/grid/CompanyNameCellRenderer.vue'
import BadgeCellRenderer from '~/components/grid/BadgeCellRenderer.vue'
import previewSample from '@/assets/images/temp/preview_sample.png'

const { formatNumber } = useFormat()
const route = useRoute()
const dialogStore = useDialogStore()
const toastStore = useToastStore()

// 페이지 정보
const pageInfo = ref({
  title: 'Compose Envelope',
  breadcrumbItems: [{ text: 'Menu' }, { text: 'Documents' }, { text: 'Compose Envelope' }],
})

// 폼 데이터
const formData = reactive({
  blNo: 'HDMUSELM70328426',
  recipient: {
    name: 'KTNETEBL1',
    logo: 'https://i.pravatar.cc/150',
    address: '338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR',
  },
  message: '',
})
// Sticky Action Buttons - v-intersection
const isIntersectingAction = ref(true)

const showAction = computed(() => {
  // 예시로 message가 있을 때만 액션 버튼 보이기
  return formData.message?.trim().length === 0
})

const onActionButtonsIntersect = (isIntersecting) => {
  isIntersectingAction.value = isIntersecting
}

// B/L 배지
const blBadges = ref([{ value: 'ISSUED', color: 'mint' }, { value: 'ISSUE' }])

// 미리보기 파일 정보
const previewFile = reactive({
  name: 'File name.pdf',
  size: '128KB',
  url: previewSample,
})

// 히스토리 목록
const historyList = ref([
  {
    company:
      'Hyundai Merchant Marine Global Logistics Division International Document Coordination Center and Special Cargo Administration Team',
    name: 'Gil-Dong Hong Senior Manager of Trade Operations and Intercontinental Documentation Control Headquarters',
    status: 'B/L ISSUE Carrier',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=0',
    isOwner: false,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'ENDORSE TO ORDER',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=1',
    isOwner: false,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'TRANSFER',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=2',
    isOwner: false,
  },
  {
    company:
      'KTNET Electronic Bill of Lading Platform Operations Center and Cross Border Trade Infrastructure Management Office',
    name: 'Alexandria Catherine Robertson-Williams-Montgomery the Third',
    status: 'Current Owner',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=3',
    isOwner: true,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'Release Agent',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=4',
    isOwner: false,
  },
  {
    company: 'HMM',
    name: 'Gil-Dong Hong',
    status: 'Release Agent',
    date: '2025-09-01 15:00:00',
    logo: 'https://i.pravatar.cc/150?img=5',
    isOwner: false,
  },
])

// 폴더 아이템 생성
const createFiles = (count) => Array.from({ length: count }, (_, index) => ({ id: index + 1 }))

const folderItems = ref([
  { name: 'Commercial Invoice', files: createFiles(5) },
  { name: 'Packing List', files: createFiles(10) },
  { name: 'Insurance Policy', files: createFiles(1) },
  { name: 'Certificate of Origin', files: createFiles(4) },
  { name: 'Bill of Exchange', files: createFiles(0) },
  { name: 'Courier Waybill', files: createFiles(2) },
  { name: 'Others', files: createFiles(2) },
])

const folderGridItems = computed(() => [
  ...folderItems.value,
  { name: 'Add document', files: [], isAdd: true },
])

// 다이얼로그 상태
const folderDialog = reactive({
  open: false,
  selectedFolder: null,
  expandedFolder: null,
  selectedDoc: null,
  uploadFiles: [],
  addedFolders: [], // 옵셔널로 추가된 폴더들
  isLoading: false, // 폴더 로딩 상태
  loadingFolderName: null, // 로딩 대상 폴더명
})

let loadingTimer = null

// Request Type Options
const requestTypeOptions = ref([
  { value: 'amendment', label: 'Surrender for Amendment' },
  { value: 'paper', label: 'Switch to Paper' },
  { value: 'delivery', label: 'Surrender for Delivery' },
])

// 액션 다이얼로그 상태
const actionDialog = reactive({
  open: false,
  type: null, // 'amendment', 'paper', 'delivery'
  formData: {
    recipient: '',
    requestType: '',
    sendDate: null,
    comment: '',
  },
})

// Delete 다이얼로그 상태
const deleteDialog = reactive({
  open: false,
  selectedBlNo: null,
  searchFieldType: 'blNo',
  searchKeyword: '',
  page: 1,
  itemsPerPage: 10,
})

// Preview 다이얼로그 상태
const previewDialog = reactive({
  open: false,
})

// Recipient Select 다이얼로그 상태
const recipientSelectDialogOpen = ref(false)
const recipientSelectFilters = ref({
  key: 'companyName',
  query: '',
})
const recipientSelectFilterOptions = [
  { label: 'Company Name', value: 'companyName' },
  { label: 'Owner', value: 'owner' },
  { label: 'DUNS No', value: 'dunsNo' },
  { label: 'MID', value: 'mid' },
]
const recipientSelectPage = ref(1)
const recipientSelectPerPage = ref(10) //2026.05.18 recepient count 변경 8 -> 10
const selectedRecipientId = ref(null)

const recipientBaseItem = {
  companyName: 'KTNETEBL',
  country: 'KR',
  owner: 'Gil-Dong Hong',
  dunsNo: '123456789',
  mid: 'user1@ktnet.co.kr',
  companyAddress: '338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR',
  companyLogo: 'https://i.pravatar.cc/150?img=11',
}

const recipientCompanyNames = [
  'KTNETEBL',
  'CJ Logistics',
  'Hana Bank',
  'HMM',
  'Maersk',
  'CMA CGM',
  'ONE',
  'MSC',
  'Evergreen',
  'COSCO',
]

const recipientOwners = [
  'Gil-Dong Hong',
  'Kevin Brown',
  'James Park',
  'Soo-Min Lee',
  'Anna Schmidt',
  'Marco Rossi',
  'Lars Jensen',
  'Wei Chen',
  'Min-Ho Chen',
  'Noam Cohen',
]

const recipientCountries = ['KR', 'US', 'CN', 'JP', 'SG', 'DE', 'FR', 'DK', 'TW', 'HK']

const recipientAddresses = [
  '338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR',
  '1750 S Wolf Rd, Des Plaines, IL 60018, US',
  '66, Eulji-ro, Jung-gu, Seoul, KR',
  'Esplanaden 50, 1263 Copenhagen, DK',
  '4 Quai d Arenc, 13002 Marseille, FR',
  'Shibaura, Minato-ku, Tokyo, JP',
  'Chemin Rieu 12-14, 1208 Geneva, CH',
  'No. 1, Sec. 2, Zhongshan N. Rd., Taipei, TW',
  'No. 378 Dong Da Ming Road, Shanghai, CN',
  'Harbour Centre, 25 Harbour Road, HK',
]

const recipientSelectItems = ref(
  Array.from({ length: 30 }, (_, index) => {
    const nameIndex = (index * 3) % recipientCompanyNames.length
    const ownerIndex = (index * 5) % recipientOwners.length
    const countryIndex = (index * 7) % recipientCountries.length
    const addressIndex = (index * 11) % recipientAddresses.length
    const dunsNumber = 100000000 + (((index + 1) * 7919) % 900000000)

    return {
      ...recipientBaseItem,
      id: index + 1,
      companyName: `${recipientCompanyNames[nameIndex]} ${index + 1}`,
      country: recipientCountries[countryIndex],
      owner: recipientOwners[ownerIndex],
      dunsNo: String(dunsNumber),
      mid: `user${index + 1}@example.com`,
      companyAddress: recipientAddresses[addressIndex],
      companyLogo: `https://i.pravatar.cc/150?img=${11 + (index % 30)}`,
    }
  }),
)

// Delete Dialog 검색 필드 옵션
const searchFieldOptions = ref([
  { value: 'blNo', label: 'B/L No' },
  { value: 'company', label: 'Company Name' },
])

// Delete Dialog - AG Grid
const deleteGridApi = ref(null)
const rowSelectionBlList = {
  mode: 'singleRow',
  checkboxes: false,
  enableClickSelection: true,
}

const colDefsDelete = ref([
  {
    headerName: 'Company Name',
    field: 'company',
    flex: 1,
    minWidth: 180,
    cellStyle: {
      display: 'flex',
      alignItems: 'center',
    },
    cellRenderer: CompanyNameCellRenderer,
    cellRendererParams: (params) => ({
      name: params.data?.company || '',
      logo: params.data?.logo || '',
      prefix: params.data?.country || '',
      showSelector: true,
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'B/L No',
    field: 'blNo',
    flex: 1,
    minWidth: 180,
    cellClass: 'ag-link',
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'B/L Status',
    field: 'blStatus',
    width: 120,
    minWidth: 120,
    cellRenderer: BadgeCellRenderer,
    cellRendererParams: {
      color: 'mint',
    },
    cellStyle: { textAlign: 'center' },
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'Transaction Status',
    field: 'transactionStatus',
    width: 120,
    minWidth: 120,
    cellRenderer: BadgeCellRenderer,
    cellRendererParams: {
      color: 'gray',
    },
    cellStyle: { textAlign: 'center' },
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'Received Date',
    field: 'receivedDate',
    flex: 1,
    minWidth: 180,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

const recipientSelectRowSelection = {
  mode: 'singleRow',
  checkboxes: false,
  enableClickSelection: true,
}

const recipientSelectGridApi = ref(null)

const recipientSelectColDefs = ref([
  {
    headerName: 'Company Name',
    field: 'companyName',
    flex: 1,
    minWidth: 220,
    cellStyle: {
      display: 'flex',
      alignItems: 'center',
    },
    cellRenderer: CompanyNameCellRenderer,
    cellRendererParams: (params) => ({
      name: params.data?.companyName || '',
      logo: params.data?.companyLogo || '',
      prefix: params.data?.country || '',
      showSelector: true,
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'Owner',
    field: 'owner',
    width: 160,
    minWidth: 140,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'DUNS No',
    field: 'dunsNo',
    width: 140,
    minWidth: 120,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'MID',
    field: 'mid',
    width: 180,
    minWidth: 160,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

// 샘플 B/L 목록
const blListData = ref(
  Array.from({ length: 8 }, (_, i) => ({
    blNo: i === 0 ? 'OOOOOOOOOOOOOOOOOOOOO' : `HDMUSELM7032842${7 + i}`,
    company: 'From KTNETEBL1',
    blStatus: 'ISSUED',
    transactionStatus: 'ISSU',
    receivedDate: '2025-09-01 15:15',
    logo: `https://i.pravatar.cc/150?img=${i}`,
  })),
)

// 옵션 문서 목록
const optionalDocuments = ref([
  { value: 1, label: 'Letter of Credit (L/C)' },
  { value: 2, label: 'Export Declaration Certificate' },
  { value: 3, label: 'Certificate of Shipment' },
  { value: 4, label: 'Quantity / Weight Certificate' },
  { value: 5, label: 'Inspection Certificate' },
  { value: 6, label: 'Declaration' },
  { value: 7, label: 'Animal Quarantine Certificate' },
  { value: 8, label: 'Non-Hazardous Certificate' },
  { value: 9, label: 'Import Declaration Certificate' },
  { value: 10, label: 'Beneficiary Certificate' },
  { value: 11, label: 'Phytosanitary Certificate' },
  { value: 12, label: 'Freight Receipt' },
  { value: 13, label: 'Sanitary Certificate' },
  { value: 14, label: 'Certificate of Conformity' },
  { value: 15, label: "Manufacturer's Certificate" },
  { value: 16, label: 'Quality Certificate' },
])

// 다이알로그에 표시할 폴더들 (기본 폴더 + 추가된 폴더)
const dialogFolderItems = computed(() => {
  return [
    ...folderItems.value.filter((item) => item.name !== 'Others'),
    ...folderDialog.addedFolders.map((docValue) => {
      const doc = optionalDocuments.value.find((d) => d.value === docValue)
      return {
        name: doc?.label || '',
        files: [],
        isAdded: true,
      }
    }),
  ]
})

// 다이알로그 폴더 로우(3열) 구성
const dialogFolderRows = computed(() => {
  const rows = []
  const items = dialogFolderItems.value
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3))
  }
  return rows
})

// 선택된 폴더가 속한 로우 인덱스
const expandedRowIndex = computed(() => {
  if (!folderDialog.expandedFolder) return -1
  return dialogFolderRows.value.findIndex((row) =>
    row.some((item) => item.name === folderDialog.expandedFolder?.name),
  )
})

// 사용 가능한 옵셔널 문서 (이미 추가된 것 제외)
const availableOptionalDocs = computed(() => {
  return optionalDocuments.value.filter((doc) => !folderDialog.addedFolders.includes(doc.value))
})

// Delete Dialog - 필터링된 B/L 목록
const filteredBlListData = computed(() => {
  if (!deleteDialog.searchKeyword) return blListData.value

  const keyword = deleteDialog.searchKeyword.toLowerCase()
  return blListData.value.filter((item) => {
    if (deleteDialog.searchFieldType === 'blNo') {
      return item.blNo.toLowerCase().includes(keyword)
    } else if (deleteDialog.searchFieldType === 'company') {
      return item.company.toLowerCase().includes(keyword)
    }
    return true
  })
})

// Delete Dialog - 페이지네이션된 데이터
const paginatedBlListData = computed(() => {
  const start = (deleteDialog.page - 1) * deleteDialog.itemsPerPage
  const end = start + deleteDialog.itemsPerPage
  return filteredBlListData.value.slice(start, end)
})

// Delete Dialog - 총 페이지 수
const blTotalPages = computed(() => {
  return Math.ceil(filteredBlListData.value.length / deleteDialog.itemsPerPage)
})

// Recipient Select - 필터링된 데이터
const filteredRecipientItems = computed(() => {
  const query = recipientSelectFilters.value.query.trim().toLowerCase()
  if (!query) return recipientSelectItems.value
  const key = recipientSelectFilters.value.key
  return recipientSelectItems.value.filter((item) =>
    String(item[key] || '')
      .toLowerCase()
      .includes(query),
  )
})

// Recipient Select - 페이지네이션된 데이터
const pagedRecipientItems = computed(() => {
  const start = (recipientSelectPage.value - 1) * recipientSelectPerPage.value
  return filteredRecipientItems.value.slice(start, start + recipientSelectPerPage.value)
})

// 이벤트 핸들러
const handleSave = () => {
  console.log('Save clicked', formData)
  // TODO: API 저장 로직
  toastStore.add({
    text: '작성중인 Envelope가 저장되었습니다.’',
    color: 'success',
  })
}

const handleDelete = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: '경고',
    icon: 'warning',
    message: '작성중인 Envelope를 삭제 하시겠습니까?',
    confirmText: '확인',
    cancelText: '취소',
  })

  if (!confirmed) return

  deleteDialog.open = true
  deleteDialog.selectedBlNo = null
  deleteDialog.searchFieldType = 'blNo'
  deleteDialog.searchKeyword = ''
  deleteDialog.page = 1
}

const handleBlNoClick = (data) => {
  console.log('B/L No clicked', data)
}

const handleBlNoEmpty = () => {
  console.log('B/L No empty clicked')
}

const handleBlNoRefresh = () => {
  console.log('B/L No refresh clicked')
}

// Action Dialog 핸들러
const openActionDialog = (type) => {
  actionDialog.type = type
  actionDialog.formData = {
    recipient: formData.recipient.name,
    requestType: type,
    sendDate: new Date(),
    comment: '',
  }
  actionDialog.open = true
}

const closeActionDialog = () => {
  actionDialog.open = false
  actionDialog.type = null
  actionDialog.formData = {
    recipient: '',
    requestType: null,
    sendDate: null,
    comment: '',
  }
}

const submitActionDialog = async () => {
  const typeLabels = {
    amendment: 'Surrender for Amendment',
    paper: 'Paper B/L',
    delivery: 'Delivery Order',
  }

  const result = await dialogStore.showConfirm({
    title: '확인',
    message: `선사에게 ${typeLabels[actionDialog.type]} 요청을 하시겠습니까?`,
    confirmText: '확인',
    cancelText: '취소',
  })

  if (result) {
    console.log('Submit action:', {
      type: actionDialog.type,
      ...actionDialog.formData,
    })
    closeActionDialog()
  }
}

const handleRecipientClick = (data) => {
  recipientSelectDialogOpen.value = true
}

const handleRecipientEmpty = () => {
  console.log('Recipient empty clicked')
}

const handleRecipientRefresh = () => {
  console.log('Recipient refresh clicked')
}

const handleDownload = () => {
  console.log('Download clicked', previewFile)
}

const handlePreview = () => {
  previewDialog.open = true
}

const handleHistoryClick = (item) => {
  console.log('History item clicked', item)
}

const handleFolderClick = (folder) => {
  if (!folder.isAdd) {
    folderDialog.selectedFolder = folder
    folderDialog.expandedFolder = folder
    folderDialog.uploadFiles = []
    folderDialog.selectedDoc = null
    folderDialog.open = true
  }
}

const handleFolderAdd = () => {
  folderDialog.selectedFolder = null
  folderDialog.expandedFolder = null
  folderDialog.uploadFiles = []
  folderDialog.selectedDoc = null
  folderDialog.addedFolders = []
  folderDialog.open = true
}

// 다이얼로그 폴더 클릭 핸들러
const handleDialogFolderClick = (folder) => {
  if (folderDialog.expandedFolder?.name === folder.name) {
    // 같은 폴더 재클릭 시 닫기
    folderDialog.expandedFolder = null
    folderDialog.isLoading = false
    folderDialog.loadingFolderName = null
    if (loadingTimer) {
      clearTimeout(loadingTimer)
      loadingTimer = null
    }
  } else {
    // 다른 폴더 클릭 - 열려있는 폴더 먼저 닫기
    folderDialog.expandedFolder = null
    folderDialog.uploadFiles = []
    folderDialog.isLoading = true
    folderDialog.loadingFolderName = folder.name

    if (loadingTimer) {
      clearTimeout(loadingTimer)
      loadingTimer = null
    }

    // 300ms 딜레이 후 파일목록 확장
    loadingTimer = setTimeout(() => {
      folderDialog.expandedFolder = folder
      folderDialog.isLoading = false
      folderDialog.loadingFolderName = null
      loadingTimer = null
    }, 0)
  }
}

const handleDialogFolderRemove = (folder) => {
  if (!folder.isAdded) return
  const docValue = optionalDocuments.value.find((doc) => doc.label === folder.name)?.value
  if (!docValue) return
  folderDialog.addedFolders = folderDialog.addedFolders.filter((id) => id !== docValue)
  if (folderDialog.expandedFolder?.name === folder.name) {
    folderDialog.expandedFolder = null
    folderDialog.uploadFiles = []
  }
}

// 다이얼로그 핸들러
const closeDialog = () => {
  folderDialog.open = false
  folderDialog.selectedFolder = null
  folderDialog.expandedFolder = null
  folderDialog.selectedDoc = null
  folderDialog.uploadFiles = []
  folderDialog.isLoading = false
  folderDialog.loadingFolderName = null
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = null
  }
}

const addOptionalDocToDialog = () => {
  if (folderDialog.selectedDoc && !folderDialog.addedFolders.includes(folderDialog.selectedDoc)) {
    folderDialog.addedFolders.push(folderDialog.selectedDoc)
    folderDialog.selectedDoc = null
    console.log('Added optional document:', folderDialog.addedFolders)
  }
}

const saveFolderDoc = () => {
  console.log('Save folder document:', {
    expandedFolder: folderDialog.expandedFolder?.name,
    uploadedFiles: folderDialog.uploadFiles,
    addedDocuments: folderDialog.addedFolders,
  })
  closeDialog()
}

// Delete Dialog 핸들러
const onDeleteGridReady = (params) => {
  deleteGridApi.value = params.api
}

const onDeleteSelectionChanged = () => {
  const selected = deleteGridApi.value?.getSelectedRows()
  deleteDialog.selectedBlNo = selected?.[0]?.blNo || null
}

const closeDeleteDialog = () => {
  deleteDialog.open = false
  deleteDialog.selectedBlNo = null
  deleteDialog.searchFieldType = 'blNo'
  deleteDialog.searchKeyword = ''
  deleteDialog.page = 1
}

const handleSelectBlNo = () => {
  if (deleteDialog.selectedBlNo) {
    console.log('Selected B/L No for deletion:', deleteDialog.selectedBlNo)
    closeDeleteDialog()
  }
}

const closePreviewDialog = () => {
  previewDialog.open = false
}

const closeRecipientDialog = () => {
  recipientSelectDialogOpen.value = false
}

const onRecipientGridReady = (params) => {
  recipientSelectGridApi.value = params.api
}

const onRecipientSelectionChanged = () => {
  const selected = recipientSelectGridApi.value?.getSelectedRows()
  selectedRecipientId.value = selected?.[0]?.id || null
}

const onRecipientRowClicked = (params) => {
  selectedRecipientId.value = params.data?.id || null
  params.node?.setSelected(true)
}

const confirmRecipientSelection = () => {
  const selected = recipientSelectItems.value.find((item) => item.id === selectedRecipientId.value)
  if (!selected) return
  formData.recipient = {
    name: selected.companyName,
    address: selected.companyAddress,
    logo: selected.companyLogo,
  }
  recipientSelectDialogOpen.value = false
}
</script>
