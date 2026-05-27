<template>
  <div class="psm-account-container">
    <div class="psm-account-card psm-account-card--register">
      <div class="psm-account-card__header">
        <h1>Register</h1>
      </div>
      <div class="psm-account-card__body">
        <EblSubHeader title="In-Progress Tasks" />
        <EblInfo class="psm-account-form psm-account-form--register">
          <EblInfoItem label="HMM Shipper ID" has-input>
            <EblInput v-model="form.shipperId" placeholder="HMM Shipper ID" />
          </EblInfoItem>

          <EblInfoItem label="MID" required has-input>
            <div class="psm-account-form__inline">
              <EblInput
                v-model="form.mid"
                placeholder="example@email.com"
                class="psm-account-form__grow"
                :readonly="midVerified"
              />
              <EblBtn color="outlined" :disabled="midVerified" @click="onClickSendCode">{{
                sendCodeLabel
              }}</EblBtn>
            </div>
          </EblInfoItem>

          <EblInfoItem v-if="!midVerified" label="" has-input>
            <div class="psm-account-form__inline">
              <EblInput
                v-model="form.verificationCode"
                placeholder="Verification Code"
                class="psm-account-form__grow"
                :disabled="!midCodeSent"
              />
              <EblBtn color="outlined" :disabled="!midCodeSent" @click="onClickVerify"
                >Verify</EblBtn
              >
            </div>
          </EblInfoItem>

          <EblInfoItem label="Password" required has-input>
            <EblInput
              v-model="form.password"
              helper-text="10-12 characters, mix of at least 3 types: uppercase, lowercase, numbers, or symbols."
              placeholder="Enter your password"
            />
          </EblInfoItem>

          <EblInfoItem label="Confirm Password" required has-input>
            <EblInput
              v-model="form.confirmPassword"
              type="password"
              placeholder="Re-enter your password"
            />
          </EblInfoItem>

          <EblInfoItem label="User Name" required has-input>
            <EblInput v-model="form.userName" placeholder="Enter your name" />
          </EblInfoItem>

          <EblInfoItem label="Phone Number" required has-input>
            <EblInput v-model="form.phoneNumber" placeholder="Enter Phone Number" />
          </EblInfoItem>

          <EblInfoItem label="Fax Number" has-input>
            <EblInput v-model="form.faxNumber" placeholder="Enter Fax Number" />
          </EblInfoItem>
        </EblInfo>
        <VDivider class="my-6" />
        <EblSubHeader title="Payments Info" />
        <EblInfo class="psm-account-form psm-account-form--register">
          <EblInfoItem label="Card No" has-input>
            <EblInput v-model="form.cardNo" placeholder="Enter Card Number (16 digits)" />
          </EblInfoItem>
          <EblInfoItem label="Payment Date" has-input>
            <EblInput v-model="form.paymentDate" readonly />
          </EblInfoItem>
          <EblInfoItem label="Coupon" has-input>
            <div class="psm-account-form__inline">
              <EblInput v-model="form.coupon" class="psm-account-form__grow" />
              <EblBtn color="outlined">Register</EblBtn>
            </div>
          </EblInfoItem>
        </EblInfo>

        <VDivider class="my-6" />

        <EblSubHeader title="Company Info" />
        <EblInfo class="psm-account-form psm-account-form--register">
          <EblInfoItem label="Country" required has-input>
            <EblSelect
              v-model="form.country"
              :options="countryOptions"
              block
              placeholder="Select"
            />
          </EblInfoItem>
          <EblInfoItem label="Role" required has-input>
            <EblSelect v-model="form.role" :options="roleOptions" block placeholder="Select" />
          </EblInfoItem>
          <EblInfoItem label="Company Name" required has-input>
            <EblInput v-model="form.companyName" placeholder="Enter your Company Name" />
          </EblInfoItem>
          <EblInfoItem label="DUNS Number" required has-input>
            <EblInput v-model="form.dunsNumber" placeholder="Enter DUNS Number" />
          </EblInfoItem>
          <EblInfoItem label="Corporation Number" has-input>
            <EblInput v-model="form.corporationNumber" placeholder="Enter Corporation Number" />
          </EblInfoItem>
          <EblInfoItem label="Owner" required has-input>
            <EblInput v-model="form.owner" placeholder="Enter Owner Name" />
          </EblInfoItem>
          <EblInfoItem label="Zip code" has-input>
            <EblInput
              v-model="form.zipCode"
              prepend-icon="ebli:search"
              placeholder="Search zip code"
            />
          </EblInfoItem>
          <EblInfoItem label="Spot Code" has-input>
            <EblInput v-model="form.spotCode" placeholder="Enter Spot Code" />
          </EblInfoItem>
          <EblInfoItem label="City/Region" has-input>
            <EblInput
              v-model="form.cityRegion"
              prepend-icon="ebli:search"
              placeholder="Choose MID"
            />
          </EblInfoItem>
          <EblInfoItem label="Address 1" has-input>
            <EblInput v-model="form.address1" prepend-icon="ebli:search" placeholder="Choose MID" />
          </EblInfoItem>
          <EblInfoItem label="Address 2" has-input>
            <EblInput v-model="form.address2" placeholder="Input a Address 2" />
          </EblInfoItem>
          <EblInfoItem label="Company Logo" required tooltip="Upload company logo" has-input>
            <EblFileInput
              v-model="form.companyLogoFiles"
              accept=".bmp,.gif,.svg,.png,.jpg,.jpeg"
              help-text="파일 사이즈 : 148 * 148, 파일 타입 : bmp, gif, svg, png, jpg, jpeg"
            />
          </EblInfoItem>
        </EblInfo>

        <VDivider class="my-6" />

        <EblSubHeader title="Consent To Receive" />
        <EblInfo class="psm-account-form psm-account-form--register">
          <EblInfoItem label="E-Mail" has-input>
            <div class="psm-account-consent__group">
              <EblRadioBtn v-model="form.emailConsent" value="agree" name="email-consent"
                >Agreement</EblRadioBtn
              >
              <EblRadioBtn v-model="form.emailConsent" value="refuse" name="email-consent"
                >Refuse</EblRadioBtn
              >
            </div>
          </EblInfoItem>
          <EblInfoItem label="SMS" has-input>
            <div class="psm-account-consent__group">
              <EblRadioBtn v-model="form.smsConsent" value="agree" name="sms-consent"
                >Agreement</EblRadioBtn
              >
              <EblRadioBtn v-model="form.smsConsent" value="refuse" name="sms-consent"
                >Refuse</EblRadioBtn
              >
            </div>
          </EblInfoItem>
        </EblInfo>

        <VDivider class="my-6" />

        <EblSubHeader title="Terms And Conditions" />
        <div class="psm-account-terms">
          <div class="psm-account-terms__item psm-account-terms__item--all">
            <EblCheckbox v-model="allTermsChecked">Agree to All Terms &amp; Conditions</EblCheckbox>
          </div>

          <details
            v-for="term in termItems"
            :key="term.key"
            class="psm-account-terms__item"
            :open="termOpen[term.key]"
          >
            <summary class="psm-account-terms__summary" @click.prevent="toggleTerm(term.key)">
              <EblCheckbox v-model="form[term.key]" @click.stop>
                <EblBadge v-if="term.required" variant="tonal" color="pink">Required</EblBadge>
                {{ term.label }}
              </EblCheckbox>
              <VIcon class="psm-account-terms__chevron" icon="ebli:chevron-bottom" />
            </summary>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="psm-account-terms__content" v-html="term.content" />
          </details>
        </div>
      </div>
      <div class="psm-account-card__footer actions">
        <EblBtn large class="psm-account-form__submit">Cancel</EblBtn>
        <EblBtn color="cta" large class="psm-account-form__submit">Register</EblBtn>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'blank' })

const form = reactive({
  shipperId: '',
  mid: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
  userName: '',
  phoneNumber: '',
  faxNumber: '',
  cardNo: '',
  paymentDate: '5th Of Every Month',
  coupon: '202511-A001-HDMU-01',
  country: null,
  role: null,
  companyName: '',
  dunsNumber: '',
  corporationNumber: '',
  owner: '',
  zipCode: '',
  spotCode: '',
  cityRegion: '',
  address1: '',
  address2: '',
  companyLogoFiles: [],
  emailConsent: 'agree',
  smsConsent: 'agree',
  termsOfService: true,
  privacyPolicy: true,
})

const countryOptions = [
  { label: 'Select', value: 'select' },
  { label: 'Korea', value: 'kr' },
  { label: 'Singapore', value: 'sg' },
]

const roleOptions = [
  { label: 'Select', value: 'select' },
  { label: 'Carrier', value: 'carrier' },
  { label: 'Shipper', value: 'shipper' },
  { label: 'Bank', value: 'bank' },
]

const termItems = [
  {
    key: 'termsOfService',
    label: 'Terms of Service',
    required: true,
    content:
      '약관 내용이 들어가는 영역입니다.<br>약관 내용이 들어가는 영역입니다. 약관 내용이 들어가는 영역입니다. 약관 내용이 들어가는 영역입니다. 약관 내용이 들어가는 영역입니다. 약관 내용이 들어가는 영역입니다. 약관 내용이 들어가는 영역입니다. 약관 내용이 들어가는 영역입니다. 약관 내용이 들어가는 영역입니다.',
  },
  {
    key: 'privacyPolicy',
    label: 'Privacy Policy',
    required: true,
    content:
      '개인정보 처리방침 내용이 들어가는 영역입니다.<br>개인정보 처리방침 내용이 들어가는 영역입니다. 개인정보 처리방침 내용이 들어가는 영역입니다. 개인정보 처리방침 내용이 들어가는 영역입니다. 개인정보 처리방침 내용이 들어가는 영역입니다. 개인정보 처리방침 내용이 들어가는 영역입니다. 개인정보 처리방침 내용이 들어가는 영역입니다. 개인정보 처리방침 내용이 들어가는 영역입니다. 개인정보 처리방침 내용이 들어가는 영역입니다.',
  },
]

const termOpen = reactive({
  termsOfService: false,
  privacyPolicy: true,
})

// Publish-only MID verification state
const midCodeSent = ref(false)
const midVerified = ref(false)

const sendCodeLabel = computed(() => {
  if (midVerified.value) return 'Verified'
  return midCodeSent.value ? 'Resend Code' : 'Send Code'
})

const onClickSendCode = () => {
  if (midVerified.value) return
  midCodeSent.value = true
}

const onClickVerify = () => {
  if (!midCodeSent.value) return
  midVerified.value = true
}

const toggleTerm = (key) => {
  termOpen[key] = !termOpen[key]
}

const allTermsChecked = computed({
  get: () => termItems.every((term) => !!form[term.key]),
  set: (checked) => {
    termItems.forEach((term) => {
      form[term.key] = checked
    })
  },
})
</script>
