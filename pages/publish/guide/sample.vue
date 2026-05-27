<template>
  <div class="guide-sample">
    <h1>Guide Sample</h1>
    <p>이 페이지는 guide 레이아웃을 사용하는 샘플입니다.</p>
    <ul>
      <li><NuxtLink to="/pc/ebl/cdb/EBLCDB001U">PC EBL: /pc/ebl/cdb/EBLCDB001U</NuxtLink></li>
      <li><NuxtLink to="/mo/ebl/cdb/EBLCDB001U">MO EBL: /mo/ebl/cdb/EBLCDB001U</NuxtLink></li>
      <li><NuxtLink to="/portal/sin/PSMSIN001U">Portal: /portal/sin/PSMSIN001U</NuxtLink></li>
    </ul>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'guide' })
</script>

<style scoped>
.guide-sample {
  padding: 24px;
}
</style>
