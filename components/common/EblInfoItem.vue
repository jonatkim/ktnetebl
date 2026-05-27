<template>
  <div :class="['ebl-info-item', { 'ebl-info-item--vertical': isVertical }]">
    <div class="ebl-info-item__label">
      <slot name="label">
        <span class="ebl-info-item__label-text">{{ label }}</span>
        <span v-if="required" class="ebl-info-item__required">*</span>
        <VIcon
          v-if="tooltip"
          :size="isVertical ? 16 : 20"
          icon="ebli:information"
          v-tooltip:top-start="tooltip"
        ></VIcon>
      </slot>
    </div>
    <div class="ebl-info-item__content" :class="[{ 'has-input': hasInput }, contentClass]">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  tooltip: {
    type: String,
    default: '',
  },
  vertical: {
    type: Boolean,
    default: undefined,
  },
  hasInput: {
    type: Boolean,
    default: false,
  },
  contentClass: {
    type: [String, Array, Object],
    default: '',
  },
})

// vertical prop은 부모 EblInfo에서 provide/inject로 전달받음
// 개별 아이템의 vertical prop이 있으면 우선 적용
const parentVertical = inject('ebl-info-vertical', false)
const isVertical = computed(() => (props.vertical !== undefined ? props.vertical : parentVertical))
</script>
