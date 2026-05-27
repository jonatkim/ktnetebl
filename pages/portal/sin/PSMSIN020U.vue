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
        <h1>Find ID</h1>
      </div>
      <div class="psm-account-card__body">
        <p v-if="isMobile" class="psm-account-card__description">
          아이디를 찾으시려면<br />
          본인확인이 필요합니다.
        </p>
        <EblInfo vertical class="psm-account-form">
          <EblInfoItem label="User Name" has-input>
            <EblInput v-model="form.userName" placeholder="Enter User Name" />
          </EblInfoItem>

          <EblInfoItem label="Phone Number" has-input>
            <EblInput v-model="form.phoneNumber" type="tel" placeholder="Enter your Phone Number" />
          </EblInfoItem>
        </EblInfo>
        <div class="psm-account-form__error-message">등록된 아이디가 존재하지 않습니다.</div>
      </div>
      <div class="psm-account-card__footer">
        <EblBtn
          color="cta"
          large
          block
          :disabled="!isFormValid"
          class="psm-account-form__submit"
          @click="showDialog = true"
          >Search</EblBtn
        >
        <p v-if="!isMobile" class="psm-account-card__hint">
          본인 확인을 통해 아이디를 확인하실 수 있습니다.<br />
          마스킹 처리되어 아이디의 일부만 표시됩니다.
        </p>
      </div>
    </div>
    <EblDialog
      v-model="showDialog"
      :fullscreen="isMobile"
      :content-class="isMobile ? 'ebl-full-dialog' : 'ebl-dialog ebl-dialog--center'"
    >
      <VCard
        :width="isMobile ? '100%' : 500"
        :class="isMobile ? 'ebl-full-dialog__card' : 'ebl-dialog__card'"
      >
        <VCardTitle :class="isMobile ? 'ebl-full-dialog__header' : 'ebl-dialog__header'">
          <span class="title">Find ID</span>
          <VSpacer />
          <EblBtn v-if="isMobile" icon color="ghost" @click="showDialog = false">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
          <EblBtn v-else icon pill small @click="showDialog = false">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>
        <VCardText
          class="ebl-dialog__text pt-6"
          :class="isMobile ? 'ebl-full-dialog__text' : 'ebl-dialog__text'"
        >
          <p class="psm-account-card__find-id-result">
            등록된 아이디는<br />
            <strong>eric**@gmail.com</strong> 입니다.
          </p>
        </VCardText>
        <VCardActions :class="isMobile ? 'ebl-full-dialog__actions' : 'ebl-dialog__footer'">
          <EblBtn large>Reset Password</EblBtn>
          <EblBtn color="cta" large>Sign in</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { useBackButton } from '~/composables/useBackButton'

definePageMeta({ layout: 'blank' })

const { smAndDown } = useDisplay()
const { handleBack } = useBackButton()
const isMobile = smAndDown
const showDialog = ref(false)
const form = reactive({
  userName: '',
  phoneNumber: '',
})

const isFormValid = computed(() => form.userName.trim() && form.phoneNumber.trim())

const onClickBack = () => {
  handleBack()
}
</script>
