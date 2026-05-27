<template>
  <label class="ebl-radio" :class="{ 'ebl-radio--disabled': disabled }">
    <input
      v-model="radioValue"
      type="radio"
      :value="value"
      :disabled="disabled"
      :name="name"
      class="ebl-radio__input"
    />
    <span class="ebl-radio__circle" :class="colorClass" :style="customColorStyle">
      <span v-if="isChecked" class="ebl-radio__inner-circle"></span>
    </span>
    <span v-if="$slots.default" class="ebl-radio__label">
      <slot />
    </span>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const predefinedColors = ['primary', 'subtle', 'inverse', 'ghost']
const isPredefinedColor = computed(() => predefinedColors.includes(props.color))

const colorClass = computed(() => {
  return isPredefinedColor.value ? `ebl-radio__circle--${props.color}` : ''
})

const customColorStyle = computed(() => {
  return !isPredefinedColor.value ? { color: props.color } : {}
})

const isChecked = computed(() => props.modelValue === props.value)

const radioValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>