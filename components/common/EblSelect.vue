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
        'is-empty': !options || options.length === 0,
      },
    ]"
    @keydown.stop="onKeydown"
  >
    <div
      ref="controlRef"
      class="ebl-select__control"
      role="button"
      :style="controlStyle"
      :tabindex="disabled || combobox ? -1 : 0"
      :aria-expanded="isOpen"
      :aria-disabled="disabled"
      @click="handleControlClick"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <div v-if="prependIcon" class="ebl-select__prepend">
        <VIcon :icon="prependIcon" />
      </div>
      <div
        class="ebl-select__value"
        :class="{
          'is-placeholder': !selectedLabel && (!combobox || !isOpen),
          'ebl-select__value--combobox': combobox,
        }"
        :style="valueStyle"
      >
        <input
          v-if="combobox"
          ref="inputRef"
          :value="isOpen ? query : selectedLabel"
          :placeholder="selectedLabel || placeholder"
          class="ebl-select__query"
          type="text"
          :maxlength="normalizedMaxLength"
          :tabindex="disabled ? -1 : 0"
          :disabled="disabled"
          autocomplete="off"
          @click.stop="openMenu"
          @input="
            (e) => {
              query = e.target.value
              openMenu()
            }
          "
          @focus="handleFocus"
          @blur="handleBlur"
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
        />
        <template v-else>
          <slot name="label" :label="selectedLabel || placeholder">
            {{ selectedLabel || placeholder }}
          </slot>
        </template>
      </div>
      <VSpacer v-if="!combobox" />
      <div v-if="appendIcon" class="ebl-select__append">
        <VIcon :icon="appendIcon" />
      </div>
      <div v-else-if="$slots.append" class="ebl-select__append">
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
        <ul
          v-if="isOpen"
          ref="menuRef"
          class="ebl-select__menu"
          :class="menuClass"
          role="listbox"
          :style="menuStyle"
        >
          <li
            v-for="(opt, idx) in filteredOptions"
            :key="opt.value"
            class="ebl-select__option"
            :class="{
              'is-active': opt.value === modelValue,
              'is-highlighted': combobox && idx === highlightedIndex,
              'is-disabled': opt.disabled,
            }"
            :data-index="idx"
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
          <li v-if="combobox && filteredOptions.length === 0" class="ebl-select__no-result">
            <slot name="no-result" :query="query">
              No results
            </slot>
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
  combobox: {
    type: Boolean,
    default: false,
  },
  filterMode: {
    type: String,
    default: 'includes',
    validator: (value) => ['includes', 'startsWith'].includes(value),
  },
  maxLength: {
    type: [Number, String],
    default: 20,
  },
  lines: {
    type: Number,
    default: 1,
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
  menuClass: {
    type: String,
    default: '',
  },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close', 'enter'])

const rootRef = ref(null)
const controlRef = ref(null)
const menuRef = ref(null)
const inputRef = ref(null)
const isOpen = ref(false)
const isFocused = ref(false)
const menuStyle = ref({})
const query = ref('')
const highlightedIndex = ref(-1)
const isComposing = ref(false)
let blurTimer = null

const normalizeFilterText = (value) => String(value ?? '').trim().toLowerCase()

const filteredOptions = computed(() => {
  if (!props.combobox || !query.value) return normalizedOptions.value
  const normalizedQuery = normalizeFilterText(query.value)
  if (!normalizedQuery) return normalizedOptions.value

  return normalizedOptions.value.filter((opt) => {
    const normalizedLabel = normalizeFilterText(opt.label)

    if (props.filterMode === 'startsWith') {
      return normalizedLabel.startsWith(normalizedQuery)
    }

    return normalizedLabel.includes(normalizedQuery)
  })
})

const normalizedOptions = computed(() =>
  props.options.map((opt) => {
    // 문자열/숫자/불린: label=값, value=값 자체
    if (typeof opt === 'string' || typeof opt === 'number' || typeof opt === 'boolean') {
      return { label: String(opt), value: opt, disabled: false }
    }
    // 객체: label 없으면 value로 사용, value는 원본값
    return {
      label: opt?.label ?? String(opt?.value ?? ''),
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
const normalizedMaxLength = computed(() => {
  const value = Number(props.maxLength)
  return Number.isFinite(value) && value > 0 ? value : undefined
})

const valueStyle = computed(() => {
  if (props.lines === 0) {
    // word-wrap, no ellipsis
    return {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    }
  } else if (props.lines === 1) {
    // single line ellipsis (default)
    return {}
  } else {
    // multi-line ellipsis
    return {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: props.lines,
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    }
  }
})

const controlStyle = computed(() => ({}))

const closeMenu = () => {
  if (!isOpen.value) return
  isOpen.value = false
  query.value = ''
  highlightedIndex.value = -1
  emit('close')
}

const getEnabledIndexes = () =>
  filteredOptions.value.map((opt, idx) => (opt.disabled ? -1 : idx)).filter((idx) => idx !== -1)

const scrollHighlightedIntoView = () => {
  const menuEl = menuRef.value
  if (!menuEl || highlightedIndex.value < 0) return
  const target = menuEl.querySelector(`[data-index="${highlightedIndex.value}"]`)
  target?.scrollIntoView({ block: 'nearest' })
}

const moveHighlight = (direction) => {
  const enabledIndexes = getEnabledIndexes()
  if (enabledIndexes.length === 0) {
    highlightedIndex.value = -1
    return
  }

  if (highlightedIndex.value < 0) {
    highlightedIndex.value =
      direction > 0 ? enabledIndexes[0] : enabledIndexes[enabledIndexes.length - 1]
  } else {
    const currentPos = enabledIndexes.indexOf(highlightedIndex.value)
    if (currentPos < 0) {
      highlightedIndex.value = enabledIndexes[0]
    } else {
      const nextPos = (currentPos + direction + enabledIndexes.length) % enabledIndexes.length
      highlightedIndex.value = enabledIndexes[nextPos]
    }
  }

  nextTick(() => scrollHighlightedIntoView())
}

const selectHighlighted = () => {
  if (highlightedIndex.value < 0) return
  const opt = filteredOptions.value[highlightedIndex.value]
  if (!opt || opt.disabled) return
  onSelect(opt)
}

const openMenu = () => {
  // 비활성/읽기전용이거나 일반 셀렉트에 옵션이 없으면 열지 않는다.
  if (props.disabled || props.readonly) return
  if (isOpen.value) return
  if (!props.combobox && (!props.options || props.options.length === 0)) return
  isOpen.value = true
  highlightedIndex.value = -1
  nextTick(() => {
    requestAnimationFrame(() => {
      updateMenuPosition()
      if (props.combobox) inputRef.value?.focus()
    })
  })
  emit('open')
}

const toggle = () => {
  // 일반 셀렉트는 옵션이 있을 때만 토글하고, combobox는 빈 목록이어도 열 수 있다.
  if (!props.combobox && (!props.options || props.options.length === 0)) return
  if (props.disabled || props.readonly) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      requestAnimationFrame(() => {
        updateMenuPosition()
        if (props.combobox) inputRef.value?.focus()
      })
    })
  }
  emit(isOpen.value ? 'open' : 'close')
}

const handleControlClick = () => {
  // combobox는 항상 입력 포커스를 우선하고, 일반 셀렉트만 토글로 연다.
  if (props.disabled || props.readonly) return

  if (props.combobox) {
    openMenu()
    nextTick(() => inputRef.value?.focus())
    return
  }

  toggle()
}

const updateMenuPosition = () => {
  // Teleport된 메뉴는 control 위치를 기준으로 매번 화면 좌표를 다시 계산한다.
  if (!isOpen.value || !controlRef.value) return
  const rect = controlRef.value.getBoundingClientRect()
  const menuEl = menuRef.value
  const menuHeight = menuEl?.offsetHeight || 0
  if (!menuEl) return
  if (menuHeight === 0) {
    nextTick(() => {
      if (isOpen.value) updateMenuPosition()
    })
    return
  }
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const shouldOpenUp = menuHeight > spaceBelow && spaceAbove > spaceBelow
  const maxHeight = 264 // CSS와 동일한 고정값
  const visibleMenuHeight = Math.min(menuHeight, maxHeight)
  const menuTop = shouldOpenUp ? Math.max(6, rect.top - visibleMenuHeight - 6) : rect.bottom + 6
  menuStyle.value = {
    position: 'fixed',
    top: `${menuTop}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    maxHeight: `${maxHeight}px`,
    overflowY: 'auto',
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
    query.value = ''
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
  if (blurTimer) {
    clearTimeout(blurTimer)
    blurTimer = null
  }
  isFocused.value = true
}

const handleBlur = () => {
  if (blurTimer) clearTimeout(blurTimer)
  blurTimer = window.setTimeout(() => {
    isFocused.value = false
    if (!props.combobox || !isOpen.value) return

    const activeEl = document.activeElement
    const rootEl = rootRef.value
    const menuEl = menuRef.value
    const isStillInsideRoot = !!(rootEl && activeEl && rootEl.contains(activeEl))
    const isStillInsideMenu = !!(menuEl && activeEl && menuEl.contains(activeEl))

    if (!isStillInsideRoot && !isStillInsideMenu) {
      closeMenu()
    }
  }, 0)
}

const onKeydown = (e) => {
  if (props.disabled || props.readonly) return
  if (props.combobox) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen.value) {
        openMenu()
        nextTick(() => moveHighlight(1))
      } else {
        moveHighlight(1)
      }
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen.value) {
        openMenu()
        nextTick(() => moveHighlight(-1))
      } else {
        moveHighlight(-1)
      }
      return
    }

    if (e.key === 'Enter') {
      if (isComposing.value || e.isComposing || e.keyCode === 229 || e.repeat) return
      if (isOpen.value && highlightedIndex.value >= 0) {
        e.preventDefault()
        selectHighlighted()
        return
      }
      const nextQuery = query.value.trim()
      if (!nextQuery) return
      e.preventDefault()
      emit('enter', { query: nextQuery })
      emit('update:modelValue', nextQuery)
      emit('change', nextQuery)
      closeMenu()
      isFocused.value = false
      nextTick(() => {
        requestAnimationFrame(() => {
          inputRef.value?.blur?.()
          controlRef.value?.blur?.()
        })
      })
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      closeMenu()
      return
    }

    return
  }

  if (['Enter', ' ', 'Spacebar'].includes(e.key)) {
    e.preventDefault()
    toggle()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    closeMenu()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
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

watch(
  () => filteredOptions.value,
  () => {
    if (!props.combobox || !isOpen.value) return
    if (highlightedIndex.value < 0) return
    if (!filteredOptions.value[highlightedIndex.value]) {
      highlightedIndex.value = -1
    }
  },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, true)
})

onBeforeUnmount(() => {
  if (blurTimer) clearTimeout(blurTimer)
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
})

defineExpose({
  open: () => !props.disabled && !props.readonly && toggle(),
  close: closeMenu,
})
</script>
