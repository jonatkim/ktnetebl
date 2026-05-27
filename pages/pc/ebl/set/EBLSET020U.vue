<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #tooltip> HMM과의 선사 ID를 매핑하는 화면입니다. </template>
      <template #util>
        <EblBtn color="cta" large @click="openAddDialog">Add User Info</EblBtn>
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- Sub Header -->
      <EblSubHeader>
        <h2>Total</h2>
        <span class="count">{{ formatNumber(totalCount) }}</span>
      </EblSubHeader>

      <!-- AG Grid -->
      <AgGridVue
        class="ebl-data-grid ag-theme-quartz"
        :rowData="paginatedRowData"
        :columnDefs="colDefs"
        :dom-layout="'autoHeight'"
        @grid-ready="onGridReady"
        @cell-clicked="onCellClicked"
      />

      <!-- Pagination -->
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
          :length="Math.ceil(rowData.length / itemsPerPage)"
          total-visible="5"
          show-first-last-page
        />
      </div>

      <!-- Add/Edit User Info Dialog -->
      <EblDialog v-model="dialogOpen" transition="slide-x-reverse-transition" @close="closeDialog">
        <VCard width="480" class="ebl-dialog__card">
          <VCardTitle class="ebl-dialog__header">
            <span class="title">User Info</span>
            <VSpacer />
            <EblBtn icon pill small @click="closeDialog">
              <VIcon icon="ebli:close" :size="20" />
            </EblBtn>
          </VCardTitle>

          <VCardText class="ebl-dialog__text">
            <EblInfo vertical>
              <EblInfoItem label="MID" hasInput>
                <EblInput
                  v-model="formData.mid"
                  placeholder="xxx@ktnet.co.kr"
                  :readonly="isEditMode"
                />
              </EblInfoItem>

              <EblInfoItem label="Carrier Code" hasInput required>
                <EblInput
                  v-model="formData.carrierCode"
                  placeholder="1234"
                  append-icon="ebli:search"
                  :error-message="errors.carrierCode"
                  @click:append="searchCarrierCode"
                  @input="errors.carrierCode = ''"
                />
              </EblInfoItem>

              <EblInfoItem label="Shipper ID" hasInput required>
                <EblInput
                  v-model="formData.shipperId"
                  placeholder="Input a Shipper ID"
                  :error-message="errors.shipperId"
                  @input="errors.shipperId = ''"
                />
              </EblInfoItem>

              <EblInfoItem label="Company Name" hasInput required>
                <EblInput
                  v-model="formData.companyName"
                  placeholder="Input a Company Name"
                  :error-message="errors.companyName"
                  @input="errors.companyName = ''"
                />
              </EblInfoItem>
            </EblInfo>
          </VCardText>

          <VCardActions class="ebl-dialog__footer">
            <VSpacer />
            <EblBtn large @click="closeDialog">Cancel</EblBtn>
            <EblBtn color="cta" large @click="saveUserInfo">Save</EblBtn>
          </VCardActions>
        </VCard>
      </EblDialog>
    </div>
  </div>
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3'

definePageMeta({ layout: 'default' })

const { formatNumber } = useFormat()

// Page Info
const pageInfo = {
  title: 'Carrier ID Mapping',
  breadcrumbs: [
    { title: 'Dashboard', disabled: false, href: '/pc/dashboard' },
    { title: 'Settings', disabled: false },
    { title: 'Carrier ID Mapping', disabled: true },
  ],
}

// Grid state
const gridApi = ref(null)
const page = ref(1)
const itemsPerPage = ref(10)

// Dialog state
const dialogOpen = ref(false)
const isEditMode = ref(false)

// Form data
const formData = ref({
  mid: '',
  carrierCode: '',
  shipperId: '',
  companyName: '',
})

// Error messages
const errors = ref({
  carrierCode: '',
  shipperId: '',
  companyName: '',
})

// Sample data
const rowData = ref([
  {
    no: 10,
    mid: 'xxx@ktnet.co.kr',
    companyName: 'KTNETEBL1',
    shipperId: 'MasterID@hmm.com',
    carrierCode: '1234',
    addDate: '2025-09-19 15:30:20',
  },
  {
    no: 9,
    mid: 'xxx@ktnet.co.kr',
    companyName: 'KTNETEBL1',
    shipperId: 'MasterID@hmm.com',
    carrierCode: '1234',
    addDate: '2025-08-20 15:30:20',
  },
  {
    no: 2,
    mid: 'xxx@ktnet.co.kr',
    companyName: 'KTNETEBL1',
    shipperId: 'MasterID@hmm.com',
    carrierCode: '1234',
    addDate: '2025-04-01 15:30:20',
  },
  {
    no: 1,
    mid: 'xxx@ktnet.co.kr',
    companyName: 'KTNETEBL1',
    shipperId: 'MasterID@hmm.com',
    carrierCode: '1234',
    addDate: '2025-03-24 15:30:20',
  },
])

// Add more sample data to reach 9999
for (let i = 5; i <= 50; i++) {
  rowData.value.push({
    no: i,
    mid: 'xxx@ktnet.co.kr',
    companyName: 'KTNETEBL1',
    shipperId: 'MasterID@hmm.com',
    carrierCode: '1234',
    addDate: '2025-03-24 15:30:20',
  })
}

const totalCount = computed(() => rowData.value.length)

// Column definitions
const colDefs = ref([
  {
    headerName: 'No',
    field: 'no',
    width: 80,
    cellClass: 'text-center',
  },
  {
    headerName: 'MID',
    field: 'mid',
    flex: 1,
    minWidth: 180,
  },
  {
    headerName: 'Company Name',
    field: 'companyName',
    flex: 1,
    minWidth: 150,
  },
  {
    headerName: 'Shipper ID',
    field: 'shipperId',
    flex: 1,
    minWidth: 180,
  },
  {
    headerName: 'Carrier Code',
    field: 'carrierCode',
    width: 140,
  },
  {
    headerName: 'Add Date',
    field: 'addDate',
    width: 180,
  },
])

// Pagination
const paginatedRowData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return rowData.value.slice(start, end)
})

// Grid methods
const onGridReady = (params) => {
  gridApi.value = params.api
}

const onCellClicked = (params) => {
  if (params.column.colId === 'mid') {
    openEditDialog(params.data)
  }
}

// Dialog methods
const openAddDialog = () => {
  isEditMode.value = false
  formData.value = {
    mid: '',
    carrierCode: '',
    shipperId: '',
    companyName: '',
  }
  errors.value = {
    carrierCode: '',
    shipperId: '',
    companyName: '',
  }
  dialogOpen.value = true
}

const openEditDialog = (data) => {
  isEditMode.value = true
  formData.value = {
    mid: data.mid,
    carrierCode: data.carrierCode,
    shipperId: data.shipperId,
    companyName: data.companyName,
  }
  errors.value = {
    carrierCode: '',
    shipperId: '',
    companyName: '',
  }
  dialogOpen.value = true
}

const closeDialog = () => {
  dialogOpen.value = false
  errors.value = {
    carrierCode: '',
    shipperId: '',
    companyName: '',
  }
}

const searchCarrierCode = () => {
  // TODO: Implement carrier code search
  console.log('Search carrier code')
}

const saveUserInfo = () => {
  // Reset errors
  errors.value = {
    carrierCode: '',
    shipperId: '',
    companyName: '',
  }

  // Validation
  let hasError = false

  if (!formData.value.carrierCode) {
    errors.value.carrierCode = '필수 항목을 입력해 주세요.'
    hasError = true
  }

  if (!formData.value.shipperId) {
    errors.value.shipperId = '필수 항목을 입력해 주세요.'
    hasError = true
  }

  if (!formData.value.companyName) {
    errors.value.companyName = '필수 항목을 입력해 주세요.'
    hasError = true
  }

  if (hasError) {
    return
  }

  // TODO: Implement save logic
  console.log('Save user info:', formData.value)
  closeDialog()
}
</script>
