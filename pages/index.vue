<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/publish/guide/dashboard')
    },
  ],
})
</script>

<style scoped lang="scss">
.ebl-title {
  font-size: 1.75rem;
  font-weight: 700;
}

.ebl-subtitle {
  margin-top: 0.5rem;
  color: #4b5563;
}
</style>
