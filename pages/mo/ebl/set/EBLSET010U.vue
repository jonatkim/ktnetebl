<template>
  <div class="ebl-page-container">
    <EblSubHeader title="User Info" small class="mb-3" />
    <EblInfo vertical class="mb-6" style="--ebl-info-row-gap: 16px">
      <EblInfoItem label="MID" has-input>
        <EblInput v-model="formData.mid" placeholder="MID" readonly />
      </EblInfoItem>

      <EblInfoItem label="Password" has-input>
        <EblBtn outlined color="ghost" class="px-3" @click="showChangePasswordDialog = true">
          Change Password
        </EblBtn>
      </EblInfoItem>

      <EblInfoItem label="User Name" has-input required>
        <EblInput v-model="formData.userName" placeholder="Enter user name" />
      </EblInfoItem>

      <EblInfoItem label="Phone Number" has-input>
        <EblInput v-model="formData.phoneNumber" placeholder="Placeholder" />
      </EblInfoItem>

      <EblInfoItem label="Fax Number" has-input>
        <EblInput v-model="formData.faxNumber" placeholder="Placeholder" />
      </EblInfoItem>

      <EblInfoItem label="Permission Type" has-input>
        <EblInput v-model="formData.permissionType" placeholder="Permission Type" readonly />
      </EblInfoItem>
    </EblInfo>

    <div class="ebl-page-actions">
      <EblBtn large class="flex-1" @click="handleCancel"> Cancel </EblBtn>
      <EblBtn color="cta" large class="flex-1" @click="handleSave"> Save </EblBtn>
    </div>
    <!-- Change Password BottomSheet -->
    <EblBottomSheet v-model="showChangePasswordDialog">
      <VCard class="ebl-bottom-sheet__card">
        <VCardTitle class="ebl-bottom-sheet__header">
          <span class="title">Change Password</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click="showChangePasswordDialog = false">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-bottom-sheet__text">
          <EblInfo vertical>
            <EblInfoItem has-input label="New Password">
              <EblInput
                v-model="passwordForm.newPassword"
                :type="passwordForm.showPassword ? 'text' : 'password'"
                placeholder="Enter New Password"
                :error-message="passwordErrors.newPassword"
              >
                <template #append>
                  <EblBtn
                    :icon="passwordForm.showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                    size="x-small"
                    color="ghost"
                    @click="passwordForm.showPassword = !passwordForm.showPassword"
                  />
                </template>
              </EblInput>
            </EblInfoItem>
            <EblInfoItem has-input label="Confirm Password">
              <EblInput
                v-model="passwordForm.confirmPassword"
                :type="passwordForm.showPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                :error-message="passwordErrors.confirmPassword"
              >
                <template #append>
                  <EblBtn
                    :icon="passwordForm.showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                    size="x-small"
                    color="ghost"
                    @click="passwordForm.showPassword = !passwordForm.showPassword"
                  />
                </template>
              </EblInput>
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-bottom-sheet__action">
          <EblBtn outlined large class="flex-1" @click="showChangePasswordDialog = false">
            Cancel
          </EblBtn>
          <EblBtn color="cta" large class="flex-1" @click="handleChangePassword"> Save </EblBtn>
        </VCardActions>
      </VCard>
    </EblBottomSheet>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogStore } from '~/stores/useDialogStore'
import { useToastStore } from '~/stores/toast'

// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'detail',
  appbarTitle: 'My Profile',
})

const dialogStore = useDialogStore()
const toastStore = useToastStore()

// ============================================
// 폼 데이터 (추후 API에서 로드)
// ============================================
const formData = ref({
  mid: 'xxx@ktnet.co.kr',
  userName: 'Gil-Dong Hong',
  phoneNumber: '',
  faxNumber: '',
  permissionType: 'Viewer (Read-only)',
})

const passwordForm = ref({
  newPassword: '',
  confirmPassword: '',
  showPassword: false,
})

const showChangePasswordDialog = ref(false)
const passwordErrors = ref({
  newPassword: '',
  confirmPassword: '',
})

// ============================================
// Save 액션
// ============================================
const handleSave = () => {
  if (!formData.value.userName?.trim()) return

  // 저장 로직 (API 호출 예시)
  console.log('Saving profile data:', formData.value)

  toastStore.add({ text: 'Saved successfully.' })
}

// ============================================
// Cancel 액션
// ============================================
const handleCancel = async () => {
  await dialogStore.showConfirm({
    title: 'Discard Changes',
    message: 'Any unsaved changes will be lost.\nDo you want to reset the fields?',
    confirmText: 'Reset',
    cancelText: 'Cancel',
  })
}

// ============================================
// Change Password 액션
// ============================================
const handleChangePassword = async () => {
  // 에러 초기화
  passwordErrors.value = {
    newPassword: '',
    confirmPassword: '',
  }

  // 검증
  let hasError = false

  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'New Password is required.'
    hasError = true
  }

  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Confirm Password is required.'
    hasError = true
  }

  if (
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword !== passwordForm.value.confirmPassword
  ) {
    passwordErrors.value.confirmPassword = 'Passwords do not match.'
    hasError = true
  }

  if (hasError) return

  // 비밀번호 변경 (API 호출)
  console.log('Changing password:', passwordForm.value)

  // 다이얼로그 닫기 및 폼 초기화
  showChangePasswordDialog.value = false
  passwordForm.value = { newPassword: '', confirmPassword: '', showPassword: false }
  passwordErrors.value = {
    newPassword: '',
    confirmPassword: '',
  }

  toastStore.add({ text: 'Password has been changed.' })
}
</script>
