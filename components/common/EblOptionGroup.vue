<template>
  <div class="ebl-option-group">
    <div v-if="title" class="ebl-option-group__title">{{ title }}</div>
    <div class="ebl-option-group__list" :class="{ 'ebl-option-group--vertical': vertical }">
      <div
        v-for="option in normalizedOptions"
        :key="option.value"
        class="ebl-option-group__item"
        :class="{ 'is-selected': isSelected(option.value) }"
        @click="handleSelect(option.value)"
      >
        <span class="label">{{ option.label }}</span>
        <VIcon
          v-if="isSelected(option.value)"
          icon="ebli:check-line"
          size="24"
          class="check-icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 옵션 그룹 제목
  title: {
    type: String,
    default: null,
  },
  // 선택된 값 (단일 선택: string/number, 다중 선택: array)
  modelValue: {
    type: [String, Number, Array],
    default: null,
  },
  // 옵션 배열 [{label: '라벨', value: '값'}, {value: '값'}, '문자열', ...]
  options: {
    type: Array,
    required: true,
  },
  // 다중 선택 가능 여부
  multiple: {
    type: Boolean,
    default: false,
  },
  // 세로 정렬 여부
  vertical: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// options 형식 정규화: 문자열, 객체 등 다양한 형식 지원
const normalizeOptions = (opts) => {
  return opts.map((opt) => {
    if (typeof opt === 'string') {
      // 문자열인 경우
      return { label: opt, value: opt }
    }
    if (typeof opt === 'object' && opt.value !== undefined) {
      // 객체인 경우: label이 없으면 value를 label로 사용
      return { label: opt.label || opt.value, value: opt.value }
    }
    return opt
  })
}

const normalizedOptions = computed(() => normalizeOptions(props.options))

const isSelected = (value) => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value)
  }
  return props.modelValue === value
}

const handleSelect = (value) => {
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(value)

    if (index > -1) {
      // 이미 선택됨 -> 제거
      current.splice(index, 1)
    } else {
      // 선택 안됨 -> 추가
      current.push(value)
    }

    emit('update:modelValue', current)
  } else {
    // 단일 선택
    emit('update:modelValue', value)
  }
}
</script>
