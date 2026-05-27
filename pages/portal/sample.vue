<template>
  <div class="portal-sample">
    <h1>Portal Sample</h1>
    <p>포탈 샘플 페이지입니다.</p>
    <ul>
      <li><NuxtLink to="/portal/sin/PSMSIN001U">/portal/sin/PSMSIN001U</NuxtLink></li>
    </ul>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'portal' })
</script>

<style scoped>
.portal-sample {
  padding: 24px;
}
</style>
