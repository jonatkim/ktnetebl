<template>
  <VApp class="ebl-app">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <EblGlobalDialogs />
    <EblToast />
    <GlobalLoading />
    <EblGlobalLoginDialog />
  </VApp>
</template>

<script setup>
import EblGlobalDialogs from '~/components/common/EblGlobalDialogs.vue'
import EblGlobalLoginDialog from '~/components/common/EblGlobalLoginDialog.vue'
import EblToast from '~/components/common/EblToast.vue'
import GlobalLoading from '~/components/global/GlobalLoading.vue'

const route = useRoute()
const { deviceClass } = useEblDevice()

/**
 * 라우트 기준 앱 모드 판별
 * - /portal/** → is-portal (반응형)
 * - 그 외 → is-ebl (업무 적응형)
 */
const appMode = computed(() => {
  return route.path.startsWith('/portal') ? 'is-portal' : 'is-ebl'
})

useHead(() => ({
  htmlAttrs: {
    class: `${appMode.value} ${deviceClass.value}`,
  },
  bodyAttrs: {
    class: deviceClass.value,
  },
}))
</script>
