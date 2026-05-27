<template>
  <div :class="['ebl-info', { 'ebl-info--vertical': vertical }]" :style="infoStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed, provide } from 'vue'

const props = defineProps({
  vertical: {
    type: Boolean,
    default: false,
  },
  labelColor: {
    type: String,
    default: '',
  },
})

// vertical prop을 자식 컴포넌트에 전달
provide('ebl-info-vertical', props.vertical)

const infoStyle = computed(() => {
  if (!props.labelColor) return undefined
  return {
    '--ebl-info-label-color': props.labelColor,
  }
})
</script>

<style scoped lang="scss"></style>
