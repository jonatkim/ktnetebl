<template>
  <div :class="['ebl-sub-header', 'ebl-sub-header--wrap', { 'ebl-sub-header--small': small }]">
    <div class="ebl-sub-header__title">
      <slot>
        <h2>{{ title }}</h2>
      </slot>

      <EblTooltip v-if="tooltipText || $slots.tooltip" location="top start">
        <template #activator="{ props }">
          <EblBtn
            icon="ebli:information"
            pill
            color="ghost"
            class="ebl-sub-header__btn-tooltip"
            v-bind="props"
          />
        </template>
        <template #default>
          <div v-if="$slots.tooltip" class="ebl-sub-header__tooltip">
            <slot name="tooltip" />
          </div>
          <div v-else-if="tooltipText" class="ebl-sub-header__tooltip" v-html="tooltipText" />
        </template>
      </EblTooltip>
    </div>
    <!-- 유틸 슬롯 (내용이 있으면 표시) -->
    <div v-if="$slots.util" class="ebl-sub-header__util">
      <slot name="util" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 섹션 제목
  title: {
    type: String,
    default: '',
  },
  // 툴팁 텍스트 (선택사항)
  tooltipText: {
    type: String,
    default: null,
  },
  small: {
    type: Boolean,
    default: false,
  },
})
</script>
