<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn large color="cta">test</EblBtn>
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <h3>PC EBL Route</h3>
      <p><strong>Group:</strong> {{ group }}</p>
      <p><strong>ScreenId:</strong> {{ screenId }}</p>
      <p><strong>Path:</strong> {{ route.path }}</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const group = route.params.group || ''
const screenId = route.params.screenId || ''

const pageInfo = ref({
  title: screenId,
  breadcrumbItems: [
    { text: '홈', to: '/' },
    { text: '퍼블리싱 가이드', to: '/publish/guide' },
    { text: screenId },
  ],
  tooltip: `<div>복잡한 내용</div>
    <ul>
      <li>항목 1</li>
    </ul>`,
})
</script>
