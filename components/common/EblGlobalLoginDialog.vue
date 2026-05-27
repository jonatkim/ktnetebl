<template>
  <EblDialog
    v-model="dialogOpen"
    :content-class="'ebl-dialog ebl-dialog--center'"
    :max-width="isMobile ? 320 : 540"
    persistent
  >
    <VCard :width="isMobile ? 320 : 540" class="ebl-dialog__card">
      <VCardTitle class="ebl-dialog__header">
        <span class="title">Sign in</span>
        <VSpacer />
        <EblBtn icon pill small @click="onClose">
          <VIcon icon="ebli:close" :size="20" />
        </EblBtn>
      </VCardTitle>

      <VCardText class="ebl-dialog__text">
        <EblInfo vertical class="psm-account-form">
          <EblInfoItem label="ID" has-input>
            <EblInput v-model="form.id" placeholder="Enter your ID (Email)" />
          </EblInfoItem>

          <EblInfoItem label="Password" has-input>
            <EblInput
              v-model="form.password"
              placeholder="Enter Password"
              :type="showPassword ? 'text' : 'password'"
            >
              <template #append>
                <EblBtn
                  :icon="showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                  size="x-small"
                  color="ghost"
                  @click="showPassword = !showPassword"
                />
              </template>
            </EblInput>
          </EblInfoItem>
        </EblInfo>
      </VCardText>

      <VCardActions class="ebl-dialog__footer">
        <EblBtn color="cta" large :disabled="!isFormValid" @click="onSignIn">Sign in</EblBtn>
      </VCardActions>
    </VCard>
  </EblDialog>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { useMainStore } from '~/stores/useMainStore'

const main = useMainStore()
const { smAndDown } = useDisplay()
// 반응형 대응은 했지만 모바일쪽에선 세션타임아웃 시 로그인 팝업이 뜨는 정책이 아직 정해지지 않음 -> 일단은 모바일에서도 동일하게 팝업으로 띄우도록 함
const isMobile = smAndDown

const form = reactive({
  id: '',
  password: '',
})
const showPassword = ref(false)

const dialogOpen = computed({
  get: () => main.globalLoginDialogOpen,
  set: (val) => {
    if (val) {
      main.openGlobalLoginDialog()
      return
    }
    main.closeGlobalLoginDialog()
  },
})

const isFormValid = computed(() => form.id.trim() && form.password.trim())

const resetForm = () => {
  form.id = ''
  form.password = ''
  showPassword.value = false
}

const onClose = () => {
  resetForm()
  main.closeGlobalLoginDialog()
}

const onSignIn = () => {
  // TODO: 인증 API 연동 후 성공 시 닫기
  onClose()
}
</script>
