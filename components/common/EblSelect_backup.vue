<template>
  <div
    ref="rootRef"
    class="ebl-select"
    :class="[
      sizeClass,
      {
        'ebl-select--outlined': outlined,
        'ebl-select--block': block,
        'is-open': isOpen,
        'is-focused': isFocused,
        'is-disabled': disabled,
        'is-readonly': readonly,
        'is-error': error,
      },
    ]"
    @keydown.stop.prevent="onKeydown"
  >
    <div
      ref="controlRef"
      class="ebl-select__control"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="isOpen"
      :aria-disabled="disabled"
      @click="toggle"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <div v-if="prependIcon" class="ebl-select__prepend">
        <VIcon :icon="prependIcon" />
      </div>
      <div class="ebl-select__value" :class="{ 'is-placeholder': !selectedLabel }">
        <slot name="label" :label="selectedLabel || placeholder">
          {{ selectedLabel || placeholder }}
        </slot>
      </div>
      <VSpacer />
      <div v-if="$slots.append" class="ebl-select__append">
        <slot name="append" />
      </div>
      <button
        v-if="clearable && hasValue && !disabled && !readonly"
        type="button"
        class="ebl-select__clear"
        aria-label="Clear selection"
        @click.stop="clearValue"
      >
        <VIcon icon="ebli:delete" />
      </button>
      <VIcon class="ebl-select__arrow" icon="ebli:arrow-bottom" />
    </div>

    <Teleport to="body">
      <VSlideYTransition :duration="{ enter: 120, leave: 100 }">
        <ul v-if="isOpen" ref="menuRef" class="ebl-select__menu" role="listbox" :style="menuStyle">
          <li
            v-for="opt in normalizedOptions"
            :key="opt.value"
            class="ebl-select__option"
            :class="{
              'is-active': opt.value === modelValue,
              'is-disabled': opt.disabled,
            }"
            role="option"
            :aria-selected="opt.value === modelValue"
            @click="onSelect(opt)"
          >
            <div class="ebl-select__option-row">
              <span
                v-if="multiple"
                class="ebl-select__check"
                :class="{ 'is-checked': isSelected(opt.value), 'is-disabled': opt.disabled }"
              >
                <VIcon v-if="isSelected(opt.value)" icon="ebli:check" size="12" />
              </span>
              <slot name="option" :option="opt">{{ opt.label }}</slot>
            </div>
          </li>
        </ul>
      </VSlideYTransition>
    </Teleport>

    <Transition name="ebl-select-message">
      <div
        v-if="helperText || errorMessage || $slots.message"
        class="ebl-select__message"
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { VSlideYTransition } from 'vuetify/components'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, null],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select',
  },
  prependIcon: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: '',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  helperText: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  small: { type: Boolean, default: false },
  large: { type: Boolean, default: false },
  outlined: { type: Boolean, default: true },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close'])

const rootRef = ref(null)
const controlRef = ref(null)
const menuRef = ref(null)
const isOpen = ref(false)
const isFocused = ref(false)
const menuStyle = ref({})

const normalizedOptions = computed(() =>
  props.options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number' || typeof opt === 'boolean') {
      return { label: String(opt), value: opt, disabled: false }
    }
    return {
      label: opt?.label ?? '',
      value: opt?.value,
      disabled: !!opt?.disabled,
    }
  }),
)

const selectedLabel = computed(() => {
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? props.modelValue : []
    return normalizedOptions.value
      .filter((opt) => values.includes(opt.value))
      .map((opt) => opt.label)
      .join(', ')
  }
  const found = normalizedOptions.value.find((opt) => opt.value === props.modelValue)
  return found ? found.label : ''
})

const hasValue = computed(() => {
  if (props.multiple) return Array.isArray(props.modelValue) && props.modelValue.length > 0
  return props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
})

const isSelected = (value) => {
  if (props.multiple) {
    const values = Array.isArray(props.modelValue) ? props.modelValue : []
    return values.includes(value)
  }
  return props.modelValue === value
}

const sizeClass = computed(() => {
  if (props.small) return 'ebl-select--small'
  if (props.large) return 'ebl-select--large'
  return 'ebl-select--medium'
})

const error = computed(() => !!props.errorMessage)

const closeMenu = () => {
  if (!isOpen.value) return
  isOpen.value = false
  emit('close')
}

const toggle = () => {
  if (props.disabled || props.readonly) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => updateMenuPosition())
  }
  emit(isOpen.value ? 'open' : 'close')
}

const updateMenuPosition = () => {
  if (!controlRef.value) return
  const rect = controlRef.value.getBoundingClientRect()
  menuStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 6}px`,
    left: `${rect.left}px`,
    minWidth: `${rect.width}px`,
    zIndex: '9999',
  }
}

const onSelect = (opt) => {
  if (opt.disabled) return
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? props.modelValue.slice() : []
    const exists = current.includes(opt.value)
    const next = exists ? current.filter((v) => v !== opt.value) : [...current, opt.value]
    emit('update:modelValue', next)
    emit('change', next)
  } else {
    emit('update:modelValue', opt.value)
    emit('change', opt.value)
    closeMenu()
  }
}

const clearValue = (e) => {
  e.stopPropagation()
  if (props.disabled || props.readonly) return
  const cleared = props.multiple ? [] : null
  emit('update:modelValue', cleared)
  emit('change', cleared)
  closeMenu()
  controlRef.value?.focus()
}

const handleClickOutside = (e) => {
  const rootEl = rootRef.value
  const menuEl = menuRef.value
  if (!rootEl) return

  const clickedInsideRoot = rootEl.contains(e.target)
  const clickedInsideMenu = menuEl?.contains?.(e.target)

  if (!clickedInsideRoot && !clickedInsideMenu) {
    closeMenu()
  }
}

const handleScroll = () => {
  if (isOpen.value) {
    updateMenuPosition()
  }
}

const handleFocus = () => {
  if (props.disabled || props.readonly) return
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

const onKeydown = (e) => {
  if (props.disabled || props.readonly) return
  if (['Enter', ' ', 'Spacebar'].includes(e.key)) {
    toggle()
  } else if (e.key === 'Escape') {
    closeMenu()
  } else if (e.key === 'ArrowDown') {
    if (!isOpen.value) toggle()
  }
}

watch(
  () => props.disabled,
  (val) => {
    if (val) closeMenu()
  },
)

watch(
  () => props.modelValue,
  () => {
    if (isOpen.value) {
      nextTick(() => updateMenuPosition())
    }
  },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
})

defineExpose({
  open: () => !props.disabled && !props.readonly && toggle(),
  close: closeMenu,
})
</script>
