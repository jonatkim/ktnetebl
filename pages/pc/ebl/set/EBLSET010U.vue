<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #tooltip>
        •내 정보를 확인하고 수정할 수 있습니다.<br />
        •비밀번호 변경 및 이름과 연락처 수정이 가능합니다.
      </template>
      <template #util>
        <EblBtn large color="outlined" @click="resetForm">Cancel</EblBtn>
        <EblBtn color="cta" large :disabled="!isFormChanged" @click="saveForm">Save</EblBtn>
      </template>
    </EblPageHeader>
    <div class="ebl-card-container">
      <!-- User Info Section -->
      <EblSubHeader class="cursor-pointer">
        <h2>User Info</h2>
      </EblSubHeader>

      <EblInfo style="--ebl-info-label-width: 170px">
        <EblInfoItem label="MID" has-input class="px-4">
          <EblInput v-model="formData.mid" readonly placeholder="User Name" style="width: 250px" />
        </EblInfoItem>
        <VDivider class="my-2" />

        <EblInfoItem label="Password" has-input class="px-4">
          <EblBtn outlined @click="showPasswordDialog = true">Change Password</EblBtn>
        </EblInfoItem>
        <VDivider class="my-2" />

        <EblInfoItem label="User Name" has-input class="px-4">
          <EblInput v-model="formData.userName" placeholder="User Name" style="width: 250px" />
        </EblInfoItem>
        <VDivider class="my-2" />

        <EblInfoItem label="Phone Number" has-input class="px-4">
          <EblInput
            v-model="formData.phoneNumber"
            placeholder="Phone Number"
            style="width: 250px"
          />
        </EblInfoItem>
        <VDivider class="my-2" />

        <EblInfoItem label="Fax Number" has-input class="px-4">
          <EblInput v-model="formData.faxNumber" placeholder="Fax Number" style="width: 250px" />
        </EblInfoItem>
        <VDivider class="my-2" />

        <EblInfoItem label="Permission Type" has-input class="px-4">
          <EblInput
            v-model="formData.permissionType"
            placeholder="Permission Type"
            readonly
            style="width: 250px"
          />
        </EblInfoItem>
        <VDivider class="mt-2" />
      </EblInfo>
    </div>
    <EblDialog v-model="showPasswordDialog" content-class="ebl-dialog ebl-dialog--center">
      <VCard width="400" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Change password</span>
          <VSpacer />
          <EblBtn icon pill small @click="showPasswordDialog = false">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>
        <VCardText class="ebl-dialog__text">
          <EblInfo vertical>
            <EblInfoItem label="User ID" has-input>
              <EblInput v-model="passwordForm.userId" readonly />
            </EblInfoItem>
            <EblInfoItem label="New Password" has-input>
              <EblInput
                v-model="passwordForm.newPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter New Password"
                helper-text="10-12 characters, mix of at least 3 types: uppercase, lowercase, numbers, or symbols"
              >
                <template #append>
                  <EblBtn
                    :icon="showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                    small
                    color="ghost"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </EblInput>
            </EblInfoItem>
            <EblInfoItem label="Confirm Password" has-input>
              <EblInput
                v-model="passwordForm.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                :error-message="errorMessages"
              >
                <template #append>
                  <EblBtn
                    :icon="showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                    small
                    color="ghost"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </EblInput>
            </EblInfoItem>
          </EblInfo>
        </VCardText>
        <VCardActions class="justify-end">
          <EblBtn @click="showPasswordDialog = false">Cancel</EblBtn>
          <EblBtn color="cta" :disabled="!isPasswordValid" @click="onPasswordSave">Save</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { useDialogStore } from '~/stores/useDialogStore'
import { useToastStore } from '~/stores/toast.js'
const dialogStore = useDialogStore()
const toastStore = useToastStore()
// 페이지 정보
const pageInfo = ref({
  title: 'My profile',
  breadcrumbItems: [{ text: 'Account' }, { text: 'My profile' }],
})

// 초기값 변수
const initialFormData = {
  mid: 'xxx@ktnet.co.kr',
  userName: 'Gil-Dong Hong',
  phoneNumber: 'XXXXXXXXXXXX',
  faxNumber: 'XXXXXXXXXXXX',
  permissionType: 'Viewer',
}
const showPassword = ref(false)

// Form data
const formData = reactive({ ...initialFormData })

// Reset form
const resetForm = async () => {
  // 여기에 컨펌 다이알로그
  const result = await dialogStore.showConfirm({
    title: 'Discard Changes',
    message: 'Any unsaved changes will be lost. \nDo you want to reset the fields?\n',
    confirmText: 'Reset',
    cancelText: 'Cancel',
  })
  if (result) {
    Object.assign(formData, initialFormData)
  }
}

// Save form
const saveForm = () => {
  // TODO: API 호출 로직
  console.log('Form data:', formData)
  toastStore.add({ text: 'Saved successfully.' })
}

// Save 버튼 활성화 여부
const isFormChanged = computed(() => {
  return (
    formData.userName !== initialFormData.userName ||
    formData.phoneNumber !== initialFormData.phoneNumber ||
    formData.faxNumber !== initialFormData.faxNumber
  )
})

// 비밀번호 변경 다이얼로그 상태
const showPasswordDialog = ref(false)

// 비밀번호 변경 폼
const passwordForm = reactive({
  userId: formData.mid,
  newPassword: '',
  confirmPassword: '',
})

// 비밀번호 변경 유효성
const isPasswordValid = computed(() => {
  const pw = passwordForm.newPassword
  const confirm = passwordForm.confirmPassword
  // 10-12 chars, at least 3 types
  const types = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/]
  const typeCount = types.reduce((acc, t) => acc + t.test(pw), 0)
  return pw.length >= 10 && pw.length <= 12 && typeCount >= 3 && pw === confirm && pw.length > 0
})

const errorMessages = computed(() => {
  if (!passwordForm.newPassword && !passwordForm.confirmPassword) {
    return ''
  }
  if (isPasswordValid.value) {
    return ''
  }
  return '양식에 맞게 비밀번호를 재입력해 주세요.'
})

const onPasswordSave = () => {
  // 유효성 검사
  if (errorMessages.value) {
    return
  }
  // TODO: 실제 비밀번호 변경 API 호출
  showPasswordDialog.value = false
  toastStore.add({ text: 'Password has been changed.' })
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}
</script>
