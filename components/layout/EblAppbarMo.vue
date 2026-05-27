<template>
  <VAppBar class="ebl-appbar-mo" :class="`ebl-appbar-mo--${appbar.type}`" height="56" flat>
    <template #prepend>
      <slot name="left">
        <VAvatar v-if="appbar.type === 'main'" rounded="0" size="56" class="ml-5">
          <VImg src="~/assets/images/common/ci/HMM.png" alt="HMM" />
        </VAvatar>
        <!-- detail: 백버튼 -->
        <EblBtn
          v-else-if="appbar.type === 'detail'"
          icon="ebli:chevron-left"
          color="ghost"
          aria-label="뒤로가기"
          class="ebl-appbar-mo__btn"
          @click="onClickBack"
        />
      </slot>
    </template>
    <VSpacer v-if="appbar.type === 'main'" />
    <!-- sub/detail: 타이틀 -->
    <VAppBarTitle v-if="appbar.type !== 'main'" class="ebl-appbar-mo__title">
      {{ appbar.title }}
    </VAppBarTitle>

    <template #append>
      <slot name="right">
        <template v-if="appbar.appendButtons.length > 0">
          <EblBtn
            v-for="button in appbar.appendButtons"
            :key="button.id || button.icon || button.label"
            :icon="button.icon"
            :color="button.color || 'ghost'"
            :aria-label="button.ariaLabel || button.label || 'appbar action'"
            :class="['ebl-appbar-mo__btn', button.class]"
            @click="button.onClick?.()"
          >
            <template v-if="button.label">
              {{ button.label }}
            </template>
          </EblBtn>
        </template>
        <template v-else>
          <EblBtn
            v-if="appbar.type === 'main'"
            icon
            color="ghost"
            aria-label="알림"
            class="ebl-appbar-mo__btn btn-noti"
          >
            <VIcon>ebli:notification-has-new</VIcon>
            <span class="badge">99+</span>
          </EblBtn>
          <EblBtn
            icon="ebli:menu-line"
            color="ghost"
            aria-label="전체메뉴"
            class="ebl-appbar-mo__btn"
            @click="onMenuClick"
          />
        </template>
      </slot>
    </template>
  </VAppBar>
</template>

<script setup>
import { useAppbarStore } from '~/stores/useAppbarStore'
import { useBackButton } from '~/composables/useBackButton'

defineProps({
  onMenuClick: {
    type: Function,
    default: () => {},
  },
})

const appbar = useAppbarStore()
const { handleBack } = useBackButton()

const onClickBack = () => {
  handleBack(appbar.onBackClick)
}
</script>
