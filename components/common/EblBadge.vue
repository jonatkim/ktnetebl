<template>
  <span
    class="ebl-badge"
    :class="[colorClass, variantClass, sizeClass, { 'ebl-badge--pill': pill }]"
    :style="customColorStyle"
  >
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: 'black',
  },
  variant: {
    type: String,
    default: 'filled',
    validator: (val) => ['filled', 'outlined', 'tonal'].includes(val),
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg', 'small', 'medium', 'large'].includes(val),
  },
  pill: {
    type: Boolean,
    default: false,
  },
})

const predefinedColors = ['black', 'red', 'pink', 'amber', 'mint', 'blue', 'violet', 'gray', 'dg']//dg전용 badge 스타일 추가
const isPredefinedColor = computed(() => predefinedColors.includes(props.color))

const colorClass = computed(() => (isPredefinedColor.value ? `ebl-badge--${props.color}` : ''))
const variantClass = computed(() => `ebl-badge--${props.variant}`)

const sizeClass = computed(() => {
  const map = {
    sm: 'sm',
    small: 'sm',
    md: 'md',
    medium: 'md',
    lg: 'lg',
    large: 'lg',
  }
  const key = props.size?.toLowerCase?.() ?? 'md'
  const token = map[key] || 'md'
  return `ebl-badge--${token}`
})

const customColorStyle = computed(() => {
  if (!isPredefinedColor.value) {
    if (props.variant === 'filled') {
      return { backgroundColor: props.color, borderColor: props.color, color: '#fff' }
    } else if (props.variant === 'outlined') {
      return { borderColor: props.color, color: props.color }
    } else if (props.variant === 'tonal') {
      // hex 색상이면 26 추가 (약 15% 투명도), 아니면 배경에 opacity 적용
      const bgColor = props.color.startsWith('#') ? `${props.color}26` : props.color
      return {
        backgroundColor: bgColor,
        color: props.color,
        borderColor: 'transparent',
        opacity: props.color.startsWith('#') ? '1' : '0.15',
      }
    }
  }
  return {}
})
</script>
