<template>
  <div class="portal-layout" :class="{ 'portal-layout--pending': !uiReady }">
    <PortalAppbar />
    <!-- Main content (responsive) -->
    <VMain
      :class="[
        'portal-main',
        { 'portal-main--home': isPortalHome, 'portal-main--sub': !isPortalHome },
      ]"
    >
      <slot />
    </VMain>
    <PortalFooter :class="{ 'psm-footer--home': isPortalHome }" />
  </div>
</template>

<script setup>
import PortalAppbar from '~/components/layout/PortalAppbar.vue'
import PortalFooter from '~/components/layout/PortalFooter.vue'

const uiReady = ref(false)
const route = useRoute()

const isPortalHome = computed(() => route.path.startsWith('/portal/hom/PSMHOM010U'))

onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      uiReady.value = true
    })
  })
})
</script>

<style scoped>
.portal-layout--pending {
  visibility: hidden;
  pointer-events: none;
}
</style>
