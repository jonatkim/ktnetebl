<template>
  <EblBadge
    :color="badgeColor"
    :variant="badgeVariant"
    :size="badgeSize"
    v-tooltip:top="badgeTooltip"
  >
    <VIcon v-if="badgeIcon" :icon="badgeIcon" :size="16" />
    {{ displayText }}
  </EblBadge>
</template>

<script setup>
const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
})

const displayText = computed(() => props.params.value?.value ?? props.params.value ?? '')

const resolvedParams = computed(() => {
  const params = props.params
  const colParams = params?.colDef?.cellRendererParams
  if (typeof colParams === 'function') {
    return colParams(params) || {}
  }
  return params?.cellRendererParams || colParams || {}
})

// cellRendererParams에서 전달된 값 또는 기본값
const badgeVariant = computed(() => resolvedParams.value.variant || props.params.variant || 'tonal')
const badgeSize = computed(() => resolvedParams.value.size || props.params.size || 'sm')
const badgeTooltip = computed(() => resolvedParams.value.tooltip || null)
const badgeIcon = computed(
  () => resolvedParams.value.icon || props.params.value?.icon || props.params.icon || '',
)

// 값에 따라 색상 결정
const badgeColor = computed(() => {
  // 1. cellRendererParams의 color 우선 (명시적 설정)
  if (resolvedParams.value.color) {
    return resolvedParams.value.color
  }

  const value = String(displayText.value || '').toLowerCase()

  // 자동으로 인식하는 값들
  if (value === 'success' || value === 'completed') {
    return 'mint'
  }
  if (value === 'fail') {
    return 'red'
  }
  if (value === 'waiting' || value === 'wait') {
    return 'amber'
  }
  if (value === 'claim') {
    return 'blue'
  }
  if (value === 'cancellation') {
    return 'gray'
  }
  if (value === 'unpaid') {
    return 'red'
  }
  if (value === 'read') {
    return 'gray'
  }
  if (value === 'save') {
    return 'mint'
  }

  // 그 외의 경우 기본값: black
  return 'black'
})
</script>
