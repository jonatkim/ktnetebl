<template>
  <div class="route-page">
    <h1>PORTAL Route</h1>
    <p><strong>Group:</strong> {{ group }}</p>
    <p><strong>ScreenId:</strong> {{ screenId }}</p>
    <p><strong>Path:</strong> {{ route.path }}</p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'portal' })
const route = useRoute()
const group = route.params.group || ''
const screenId = route.params.screenId || ''
</script>

<style scoped>
.route-page {
  padding: 24px;
}
</style>
