<template>
  <label class="ebl-switch" :class="switchClasses">
    <input
      type="checkbox"
      class="ebl-switch__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
    />
    <span class="ebl-switch__track">
      <span class="ebl-switch__thumb"></span>
    </span>
    <span v-if="label" class="ebl-switch__label">{{ label }}</span>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: 'primary',
    validator: (val) =>
      ['primary', 'blue', 'red', 'mint', 'amber', 'pink', 'violet', 'black'].includes(val),
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val),
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const switchClasses = computed(() => ({
  'ebl-switch--checked': props.modelValue,
  'ebl-switch--disabled': props.disabled,
  [`ebl-switch--${props.color}`]: true,
  [`ebl-switch--${props.size}`]: true,
}))

const handleChange = (e) => {
  if (props.disabled) return
  const checked = e.target.checked
  emit('update:modelValue', checked)
  emit('change', checked)
}
</script>
