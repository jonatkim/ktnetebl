<template>
  <div v-show="uiReady">
    <VMain class="blank-main">
      <slot />
    </VMain>
  </div>
</template>

<script setup>
const uiReady = ref(false)
onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      uiReady.value = true
    })
  })
})
</script>
