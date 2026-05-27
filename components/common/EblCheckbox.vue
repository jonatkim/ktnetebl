<template>
  <label class="ebl-checkbox" :class="{ 'ebl-checkbox--disabled': disabled }">
    <input
      v-model="checkedValue"
      type="checkbox"
      :disabled="disabled"
      :indeterminate="indeterminate"
      class="ebl-checkbox__input"
    />
    <span class="ebl-checkbox__box" :class="colorClass" :style="customColorStyle">
      <VIcon v-if="checkedValue && !indeterminate" icon="ebli:check" class="ebl-checkbox__icon" />
      <VIcon v-else-if="indeterminate" icon="ebli:indeterminate" class="ebl-checkbox__icon" />
    </span>
    <span v-if="$slots.default" class="ebl-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [Boolean, null],
    default: false,
  },
  color: {
    type: String,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const predefinedColors = ['primary', 'subtle', 'inverse', 'ghost']
const isPredefinedColor = computed(() => predefinedColors.includes(props.color))

const colorClass = computed(() => {
  return isPredefinedColor.value ? `ebl-checkbox__box--${props.color}` : ''
})

const customColorStyle = computed(() => {
  return !isPredefinedColor.value ? { color: props.color } : {}
})

const checkedValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
