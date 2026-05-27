<template>
  <div
    class="ebl-input"
    :class="[
      sizeClass,
      {
        'is-focused': isFocused,
        'is-disabled': disabled,
        'is-error': error,
        'is-readonly': readonly,
      },
    ]"
  >
    <div class="ebl-input__wrapper">
      <!-- Prepend Icon or Slot -->
      <div v-if="prependIcon || $slots.prepend" class="ebl-input__prepend">
        <slot name="prepend">
          <VIcon v-if="prependIcon" :icon="prependIcon" />
        </slot>
      </div>
      <!-- Prepend Text or Slot -->
      <div v-if="prependText || $slots.prependText" class="ebl-input__prepend-text">
        <slot name="prependText">
          <span v-if="prependText">{{ prependText }}</span>
        </slot>
      </div>

      <!-- Input -->
      <input
        ref="inputRef"
        v-model="inputValue"
        class="ebl-input__input"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="normalizedMaxlength"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />

      <!-- Counter -->
      <div v-if="counter" class="ebl-input__counter">
        <template v-if="counter === true && !normalizedMaxlength">
          {{ currentLength }}
        </template>
        <template v-else> {{ currentLength }}/{{ normalizedMaxlength || counter }} </template>
      </div>

      <!-- Clear Button -->
      <button
        v-if="clearable && inputValue"
        type="button"
        class="ebl-input__clear"
        @click="handleClear"
      >
        <VIcon icon="ebli:delete" size="20" />
      </button>

      <!-- Append Text or Slot -->
      <div v-if="appendText || $slots.appendText" class="ebl-input__append-text">
        <slot name="appendText">
          <span v-if="appendText">{{ appendText }}</span>
        </slot>
      </div>

      <!-- Append Icon or Slot -->
      <div v-if="appendIcon || $slots.append" class="ebl-input__append">
        <slot name="append">
          <VIcon v-if="appendIcon" :icon="appendIcon" />
        </slot>
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
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  prependText: {
    type: String,
    default: '',
  },
  prependIcon: {
    type: String,
    default: '',
  },
  appendText: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: '',
  },
  helperText: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  clearable: {
    type: Boolean,
    default: false,
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

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'input', 'clear'])

const inputRef = ref(null)
const isFocused = ref(false)
const currentLength = ref(0)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const sizeClass = computed(() => {
  return `ebl-input--${props.size}`
})

const error = computed(() => !!props.errorMessage)

const normalizedMaxlength = computed(() => {
  const max = Number(props.maxlength)
  return Number.isFinite(max) && max > 0 ? max : undefined
})

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleInput = (event) => {
  let nextValue = event.target.value ?? ''

  // number 타입은 브라우저 maxlength가 적용되지 않아 컴포넌트에서만 길이 제한을 강제한다.
  if (props.type === 'number' && normalizedMaxlength.value && nextValue.length > normalizedMaxlength.value) {
    nextValue = nextValue.slice(0, normalizedMaxlength.value)
    event.target.value = nextValue
    inputValue.value = nextValue
  }

  // IME 조합 중에도 실시간으로 현재 길이 업데이트 (한글 조합 중 카운트 표시)
  currentLength.value = nextValue.length
  emit('input', nextValue)
}

const handleClear = () => {
  inputValue.value = ''
  emit('clear')
  inputRef.value?.focus()
}

watch(
  () => props.modelValue,
  (value) => {
    currentLength.value = String(value ?? '').length
  },
  { immediate: true }
)

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>
