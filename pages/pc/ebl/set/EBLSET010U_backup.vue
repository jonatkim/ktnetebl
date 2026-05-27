<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #tooltip>
        •사용자의 개인 정보 및 회사 정보를 관리합니다.<br />
        •변경사항은 저장 버튼을 클릭하여 저장됩니다.
      </template>
    </EblPageHeader>
    <div class="ebl-card-container">
      <!-- User Info Section -->
      <EblSubHeader class="cursor-pointer" @click="userInfoOpen = !userInfoOpen">
        <h2>User Info</h2>
        <template #util>
          <VIcon
            icon="ebli:chevron-up"
            size="20"
            class="ma-2"
            :class="{ 'rotate-180': !userInfoOpen }"
          />
        </template>
      </EblSubHeader>

      <v-expand-transition>
        <EblInfo v-show="userInfoOpen" style="--ebl-info-label-width: 170px">
          <EblInfoItem label="MID" class="px-4">
            <EblInput
              v-model="formData.mid"
              readonly
              placeholder="User Name"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Password" hasInput class="px-4">
            <EblBtn outlined>Change</EblBtn>
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="User Name" hasInput class="px-4">
            <EblInput v-model="formData.userName" placeholder="User Name" style="width: 250px" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Phone Number" hasInput class="px-4">
            <EblInput
              v-model="formData.phoneNumber"
              placeholder="Phone Number"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Fax Number" hasInput class="px-4">
            <EblInput v-model="formData.faxNumber" placeholder="Fax Number" style="width: 250px" />
          </EblInfoItem>
        </EblInfo>
      </v-expand-transition>

      <!-- Company Info Section -->
      <EblSubHeader class="cursor-pointer mt-12" @click="companyInfoOpen = !companyInfoOpen">
        <h2>Company Info</h2>
        <template #util>
          <VIcon
            icon="ebli:chevron-up"
            size="20"
            class="ma-2"
            :class="{ 'rotate-180': !companyInfoOpen }"
          />
        </template>
      </EblSubHeader>

      <v-expand-transition>
        <EblInfo v-show="companyInfoOpen" style="--ebl-info-label-width: 170px">
          <EblInfoItem label="Country" class="px-4">
            <EblSelect v-model="formData.country" :options="countryOptions" style="width: 250px" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Role" class="px-4">
            <EblSelect v-model="formData.role" :options="roleOptions" style="width: 250px" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Company Name" hasInput class="px-4">
            <EblInput
              v-model="formData.companyName"
              placeholder="Company Name"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="DUNS Number" hasInput class="px-4">
            <EblInput
              v-model="formData.dunsNumber"
              placeholder="DUNS Number"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Corporation Number" hasInput class="px-4">
            <EblInput
              v-model="formData.corporationNumber"
              placeholder="Corporation Number"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Owner" hasInput class="px-4">
            <EblInput v-model="formData.owner" placeholder="Owner" style="width: 250px" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Zip code" hasInput class="px-4">
            <EblInput
              v-model="formData.zipCode"
              placeholder="Zip Code"
              readonly
              prependIcon="ebli:search"
              style="width: 250px"
              @click="() => console.log('zip code search')"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Spot Code" hasInput class="px-4">
            <EblInput v-model="formData.spotCode" placeholder="Spot Code" style="width: 250px" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="City/Region" hasInput class="px-4">
            <EblInput
              v-model="formData.cityRegion"
              placeholder="City/Region"
              style="width: 250px"
            />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Address 1" hasInput class="px-4">
            <EblInput v-model="formData.address1" placeholder="Address 1" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem label="Address 2" hasInput class="px-4">
            <EblInput v-model="formData.address2" placeholder="Address 2" />
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem
            label="Company Logo"
            :tooltip="`업로드 제약 사항\n전체 개수: 1개 , 단일 사이즈: 5MB, 전체 사이즈: 50MB, 파일 사이즈: 148*148, 파일 타입: bmp, gif, svg, png, jpg, jpeg`"
            hasInput
            class="px-4"
          >
            <EblFileInput
              v-model="formData.logoFiles"
              accept="image/*"
              multiple
              placeholder="Click here to upload your file or drag."
              help-text="BMP, GIF, SVG, PNG, JPG, JPEG (50MB max)"
            />
          </EblInfoItem>
          <VDivider class="my-2" />
        </EblInfo>
      </v-expand-transition>

      <!-- Action Buttons -->
      <div class="d-flex mt-4" style="position: sticky; bottom: 44px; z-index: 1000">
        <VSpacer />
        <EblBtn large @click="resetForm">Cancel</EblBtn>
        <EblBtn color="cta" large @click="saveForm" class="ml-2">Save</EblBtn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '~/stores/useMainStore'

const mainStore = useMainStore()

// 페이지 정보
const pageInfo = ref({
  title: 'My profile',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Settings' }, { text: 'My profile' }],
})

// Section expand/collapse state
const userInfoOpen = ref(true)
const companyInfoOpen = ref(true)

// Form data
const formData = reactive({
  mid: 'xxx@ktnet.co.kr',
  userName: 'Gil-Dong Hong',
  phoneNumber: 'XXXXXXXXXXXX',
  faxNumber: 'XXXXXXXXXXXX',
  country: 'KR',
  role: 'Shipper',
  companyName: 'KTNETBL1',
  dunsNumber: 'XXXXXXXXXXXXXXXX',
  corporationNumber: '',
  owner: 'Gil-Dong Hong',
  zipCode: '12345',
  spotCode: '',
  cityRegion: 'Seoul/Gangnam-gu',
  address1: '21, Samseong-dong',
  address2: '',
  logoFiles: [],
})

// Country options
const countryOptions = ref([
  { label: 'Korea', value: 'KR' },
  { label: 'United States', value: 'US' },
  { label: 'China', value: 'CN' },
  { label: 'Japan', value: 'JP' },
])

// Role options
const roleOptions = ref([
  { label: 'Shipper', value: 'Shipper' },
  { label: 'Carrier', value: 'Carrier' },
  { label: 'Bank', value: 'Bank' },
])

// Reset form
const resetForm = () => {
  // Reset to initial values
  formData.userName = 'Gil-Dong Hong'
  formData.phoneNumber = 'XXXXXXXXXXXX'
  formData.faxNumber = 'XXXXXXXXXXXX'
  formData.country = 'KR'
  formData.role = 'Shipper'
  formData.companyName = 'KTNETBL1'
  formData.dunsNumber = 'XXXXXXXXXXXXXXXX'
  formData.corporationNumber = ''
  formData.owner = 'Gil-Dong Hong'
  formData.zipCode = '12345'
  formData.spotCode = ''
  formData.cityRegion = 'Seoul/Gangnam-gu'
  formData.address1 = '21, Samseong-dong'
  formData.address2 = ''
  formData.logoFiles = []
}

// Save form
const saveForm = () => {
  // TODO: API 호출 로직
  console.log('Form data:', formData)
}
</script>
