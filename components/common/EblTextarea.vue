<template>
  <div
    class="ebl-textarea"
    :class="[
      {
        'is-focused': isFocused,
        'is-disabled': disabled,
        'is-error': error,
        'is-readonly': readonly,
      },
    ]"
  >
    <!-- Wrapper -->
    <div class="ebl-textarea__wrapper">
      <!-- Textarea -->
      <textarea
        ref="textareaRef"
        v-model="textareaValue"
        class="ebl-textarea__textarea"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :rows="rows"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />

      <!-- Counter -->
      <div v-if="counter" class="ebl-textarea__counter">
        <template v-if="counter === true && !maxlength">
          {{ currentLength }}
        </template>
        <template v-else> {{ currentLength }}/{{ maxlength || counter }} </template>
      </div>
    </div>

    <!-- Helper/Error Message -->
    <Transition name="ebl-message">
      <div
        v-if="helperText || errorMessage || $slots.message"
        class="ebl-message"
        :class="{ 'is-error': error }"
      >
        <slot name="message" :text="errorMessage || helperText || ''" :is-error="error">
          {{ errorMessage || helperText }}
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 4,
  },
  helperText: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  counter: {
    type: [Boolean, Number],
    default: false,
  },
  maxlength: {
    type: [String, Number],
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'input'])

const textareaRef = ref(null)
const isFocused = ref(false)
const currentLength = computed(() => String(props.modelValue ?? '').length)

const textareaValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const error = computed(() => !!props.errorMessage)

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleInput = (event) => {
  emit('input', event.target.value)
}

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
})
</script>
