<template>
  <VDialog
    v-model="dialog.open"
    content-class="ebl-global-dialog"
    :persistent="dialog.persistent"
    :max-width="isEblPc ? 400 : 300"
    @click:outside="onOverlayCancel"
    @keydown.esc="onOverlayCancel"
  >
    <VFadeTransition mode="out-in">
      <VCard :key="dialogKey" class="ebl-global-dialog--card">
        <VCardTitle v-if="hasTitle">
          <VIcon
            v-if="iconInfo"
            :icon="iconInfo.name"
            :size="24"
            class="mr-4"
            :style="{ color: iconInfo.color }"
          />
          {{ dialog.title }}
          <VSpacer />
          <EblBtn v-if="dialog.showCloseButton" icon pill small @click="onClose">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>
        <VCardTitle v-else-if="dialog.showCloseButton">
          <VSpacer />
          <EblBtn icon pill small @click="onClose">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>
        <VCardText :class="{ 'pl-16': iconInfo }">
          {{ dialog.message }}
        </VCardText>
        <VCardActions class="justify-end">
          <EblBtn
            v-if="dialog.type === 'confirm'"
            :large="isEblMo"
            :class="{ 'flex-1': isEblMo }"
            @click="onClose"
          >
            {{ dialog.cancelText }}
          </EblBtn>
          <EblBtn color="cta" :large="isEblMo" :class="{ 'flex-1': isEblMo }" @click="onConfirm">
            {{ dialog.confirmText }}
          </EblBtn>
        </VCardActions>
      </VCard>
    </VFadeTransition>
  </VDialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDialogStore } from '~/stores/useDialogStore'

const dialogStore = useDialogStore()
const { dialog } = storeToRefs(dialogStore)
const { isEblPc, isEblMo } = useEblDevice()

const hasTitle = computed(() => (dialog.value?.title || '').trim().length > 0)

const dialogKey = computed(() =>
  [dialog.value?.title, dialog.value?.message, dialog.value?.icon, dialog.value?.type].join('|'),
)

const iconMap = {
  info: {
    name: 'ebli:information',
    color: 'var(--icon-info-normal, #295BFF)',
  },
  error: {
    name: 'ebli:error',
    color: 'var(--icon-danger-normal, #FF1C1C)',
  },
  warning: {
    name: 'ebli:warning',
    color: 'var(--icon-warning-normal, #F59E0B)',
  },
  success: {
    name: 'ebli:success',
    color: 'var(--icon-success-normal, #24FFA6)',
  },
}

const iconInfo = computed(() => {
  const key = dialog.value?.icon
  if (!key) return null
  return iconMap[key] || null
})

// 확인 버튼 클릭
const onConfirm = () => {
  // Confirm 타입은 true 반환, Alert는 기본값(undefined)
  const value = dialog.value?.type === 'confirm' ? true : undefined
  dialogStore.resolveAndClose(value)
}

// 취소/닫기 버튼 클릭
const onClose = () => {
  dialogStore.resolveAndClose(false)
}

// 배경 클릭 또는 ESC 키
const onOverlayCancel = () => {
  if (dialog.value?.persistent) return
  dialogStore.resolveAndClose(false)
}
</script>
