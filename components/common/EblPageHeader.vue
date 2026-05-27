<template>
  <div class="ebl-page-header ebl-page-header--wrap">
    <!-- 브레드크럼 -->
    <EblBreadcrumb v-if="breadcrumbItems && breadcrumbItems.length" :items="breadcrumbItems" />

    <!-- 제목 + 유틸 -->
    <div class="ebl-page-header__header">
      <div class="ebl-page-header__title">
        <slot>
          <h1>
            {{ title }}
          </h1>
        </slot>
        <EblTooltip v-if="tooltipText || $slots.tooltip" location="top start">
          <template #activator="{ props }">
            <EblBtn
              icon="ebli:information"
              pill
              color="ghost"
              class="ebl-page-header__btn-tooltip"
              v-bind="props"
            />
          </template>
          <template #default>
            <div v-if="$slots.tooltip" class="ebl-page-header__tooltip">
              <slot name="tooltip" />
            </div>
            <div
              v-else-if="tooltipText"
              class="ebl-page-header__tooltip"
              v-html="tooltipText"
            ></div>
          </template>
        </EblTooltip>
      </div>

      <!-- 유틸 슬롯 (내용이 있으면 표시) -->
      <div v-if="$slots.util" class="ebl-page-header__util">
        <slot name="util" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 브레드크럼 아이템 배열
  breadcrumbItems: {
    type: Array,
    default: () => [],
    // 예: [{ text: '홈', to: '/' }, { text: '메뉴' }]
  },
  // 페이지 제목
  title: {
    type: String,
    required: true,
  },
  // 툴팁 텍스트 (선택사항)
  tooltipText: {
    type: String,
    default: null,
  },
})
</script>
