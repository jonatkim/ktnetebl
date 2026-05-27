<template>
  <div class="psm-account-container">
    <div class="psm-account-card">
      <div class="psm-account-card__header psm-account-card__header--app-bar">
        <EblBtn
          v-if="isMobile"
          icon="ebli:chevron-left"
          color="ghost"
          aria-label="뒤로가기"
          class="ebl-appbar-mo__btn"
          @click="onClickBack"
        />
        <h1>Reset Password</h1>
      </div>
      <div class="psm-account-card__body">
        <p v-if="isMobile" class="psm-account-card__description">
          가입하신 사용자 정보를 입력해주세요.<br />
          이메일로 임시 비밀번호가 발송됩니다.
        </p>
        <EblInfo vertical class="psm-account-form">
          <EblInfoItem label="ID" has-input>
            <EblInput v-model="form.userId" placeholder="Enter Your ID(E-mail)" />
          </EblInfoItem>
          <EblInfoItem label="User Name" has-input>
            <EblInput v-model="form.userName" placeholder="Enter User Name" />
          </EblInfoItem>

          <EblInfoItem label="Phone Number" has-input>
            <EblInput v-model="form.phoneNumber" type="tel" placeholder="Enter your Phone Number" />
          </EblInfoItem>
        </EblInfo>
        <div class="psm-account-form__error-message">사용자 정보를 다시 확인해 주세요!</div>
      </div>
      <div class="psm-account-card__footer">
        <EblBtn
          color="cta"
          large
          block
          :disabled="!isFormValid"
          class="psm-account-form__submit"
          @click="onClickReset"
          >Reset</EblBtn
        >
        <template v-if="!isMobile">
          <p class="psm-account-card__hint">
            가입하신 사용자 정보를 입력해주세요.<br />
            이메일로 임시 비밀번호가 발송됩니다.
          </p>
          <VDivider class="my-6" />
          <NuxtLink to="#" class="psm-account-form__link return-signin">Return to Sign in</NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { useBackButton } from '~/composables/useBackButton'

definePageMeta({ layout: 'blank' })

const toastStore = useToastStore()
const { handleBack } = useBackButton()
const { smAndDown } = useDisplay()
const isMobile = smAndDown
const form = reactive({
  userId: '',
  userName: '',
  phoneNumber: '',
})

const isFormValid = computed(
  () => form.userId.trim() && form.userName.trim() && form.phoneNumber.trim(),
)

const onClickBack = () => {
  handleBack()
}
const onClickReset = () => {
  toastStore.add({
    text: `{no1jyy@ktnet.co.kr} 이메일 주소로\n임시 비밀번호가 발송되었습니다.`,
  })
}
</script>
