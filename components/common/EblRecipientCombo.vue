<template>
  <div
    ref="rootRef"
    class="ebl-recipient-combo"
    :class="{
      'ebl-recipient-combo--small': small,
      'ebl-recipient-combo--disabled': disabled,
      'ebl-recipient-combo--readonly': readonly,
      'is-open': isOpen,
    }"
  >
    <div class="ebl-recipient-combo__control" @click.stop="focusInput">
      <template v-if="showSelectedSummary">
        <div v-if="selectedItem?.logo" class="ebl-recipient-combo__logo">
          <img :src="selectedItem.logo" :alt="selectedItem.name" />
        </div>

        <div class="ebl-recipient-combo__label">
          <div class="ebl-recipient-combo__name">{{ selectedItem?.name }}</div>
          <div class="ebl-recipient-combo__address">{{ selectedItem?.address }}</div>
        </div>
      </template>
      <template v-else>
        <div class="ebl-recipient-combo__prepend">
          <VIcon icon="ebli:search" :size="20" />
        </div>

        <input
          ref="inputRef"
          :value="modelValue"
          type="text"
          class="ebl-recipient-combo__input"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          autocomplete="off"
          @focus="openMenu"
          @input="onInput"
          @blur="handleBlur"
          @keydown.down.prevent="moveHighlight(1)"
          @keydown.up.prevent="moveHighlight(-1)"
          @keydown.enter.prevent="handleEnter"
          @keydown.esc.prevent="closeMenu"
        />
      </template>

      <div v-if="$slots.append || appendLabel" class="ebl-recipient-combo__append">
        <slot name="append">
          <EblBtn
            prepend-icon="ebli:menu-line"
            :disabled="disabled"
            @click.stop="handleAppendClick"
          >
            {{ appendLabel }}
          </EblBtn>
        </slot>
      </div>
    </div>

    <div
      v-if="isOpen"
      ref="menuRef"
      class="ebl-recipient-combo__menu"
      :class="{ 'is-upward': menuDirection === 'up' }"
      @click.stop
    >
      <div v-if="filteredItems.length === 0" class="ebl-recipient-combo__empty">
        <template v-if="hasQuery">
          <span v-if="recentItems.length > 0">No recent recipients found. </span>
          Press <kbd>Enter</kbd> to search all recipients for
          <strong>'{{ modelValue }}'</strong>
        </template>
        <template v-else>No recent recipients.</template>
      </div>

      <button
        v-for="(item, index) in filteredItems"
        :key="item.id ?? `${item.name}-${index}`"
        :ref="(el) => setOptionRef(el, index)"
        type="button"
        class="ebl-recipient-combo__option"
        :class="{
          'is-selected': isSelectedItem(item),
          'is-highlighted': highlightedIndex === index,
        }"
        @mousedown.prevent="selectItem(item)"
      >
        <div v-if="item.logo" class="ebl-recipient-combo__logo">
          <img :src="item.logo" :alt="item.name" />
        </div>

        <div class="ebl-recipient-combo__label">
          <div class="ebl-recipient-combo__name">{{ item.name }}</div>
          <div class="ebl-recipient-combo__address">{{ item.address }}</div>
        </div>
        <EblBadge v-if="isSelectedItem(item)" color="blue" variant="tonal">Selected</EblBadge>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue', 'change', 'select', 'append-click', 'enter-search'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  selectedItem: {
    type: Object,
    default: null,
  },
  recentItems: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select a Recipient',
  },
  appendLabel: {
    type: String,
    default: 'Party List', // "거래/문서상의 상대 당사자(거래처) 목록, 관계자 목록, 당사자 목록"
  },
  small: {
    type: Boolean,
    default: false,
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

const rootRef = ref(null)
const inputRef = ref(null)
const menuRef = ref(null)
const optionRefs = ref([])
const isOpen = ref(false)
const highlightedIndex = ref(-1)
const isEditing = ref(false)
const menuDirection = ref('down')
let blurTimer = null

const normalize = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
const hasQuery = computed(() => normalize(props.modelValue).length > 0)
const hasSelectedItem = computed(() => !!props.selectedItem?.name)
const showSelectedSummary = computed(
  () => hasSelectedItem.value && !isEditing.value && !isOpen.value,
)

const filteredItems = computed(() => {
  const query = normalize(props.modelValue)
  if (!query) return props.recentItems

  return props.recentItems.filter((item) => {
    const name = normalize(item?.name)
    const address = normalize(item?.address)
    return name.includes(query) || address.includes(query)
  })
})

const setQuery = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const clearQuery = () => setQuery('')

// 선택 여부는 렌더링/하이라이트 판단에서 공통으로 쓴다.
const isSelectedItem = (item) =>
  !!props.selectedItem &&
  item?.name === props.selectedItem?.name &&
  item?.address === props.selectedItem?.address

const setOptionRef = (el, index) => {
  optionRefs.value[index] = el || null
}

const syncHighlightedOptionIntoView = () => {
  if (!isOpen.value || highlightedIndex.value < 0) return

  nextTick(() => {
    const menuEl = menuRef.value
    const optionEl = optionRefs.value[highlightedIndex.value]
    if (!menuEl || !optionEl) return

    const optionCenter = optionEl.offsetTop + optionEl.offsetHeight / 2
    const targetScrollTop = optionCenter - menuEl.clientHeight / 2
    const maxScrollTop = menuEl.scrollHeight - menuEl.clientHeight

    menuEl.scrollTo({
      top: Math.max(0, Math.min(targetScrollTop, maxScrollTop)),
    })
  })
}

// 재오픈 시에는 선택된 항목을, 첫 오픈 시에는 하이라이트 없이 시작한다.
const syncHighlightedIndex = () => {
  if (filteredItems.value.length === 0) {
    highlightedIndex.value = -1
    return
  }

  if (!hasQuery.value && hasSelectedItem.value) {
    const selectedIndex = filteredItems.value.findIndex((item) => isSelectedItem(item))
    highlightedIndex.value = selectedIndex >= 0 ? selectedIndex : 0
    return
  }

  highlightedIndex.value = -1
}

// selectedItem은 유지하고, 검색용 query만 비운 상태로 다시 편집을 시작한다.
const beginEditing = () => {
  if (props.disabled || props.readonly) return

  isEditing.value = true
  isOpen.value = true
  clearQuery()

  nextTick(() => {
    syncHighlightedIndex()
    updateMenuDirection()
    inputRef.value?.focus()
  })
}

// 유효한 재선택 없이 벗어나면 임시 query는 버리고, 기존 선택 상태 또는 placeholder로 복귀한다.
const restoreSelectedState = () => {
  clearQuery()
  closeMenu()
}

const focusInput = () => {
  if (props.disabled) return
  if (showSelectedSummary.value) {
    beginEditing()
    return
  }
  inputRef.value?.focus()
}

const openMenu = () => {
  if (props.disabled || props.readonly) return
  isEditing.value = true
  isOpen.value = true
  nextTick(() => {
    syncHighlightedIndex()
    updateMenuDirection()
  })
}

const closeMenu = () => {
  isOpen.value = false
  highlightedIndex.value = -1
  isEditing.value = false
  optionRefs.value = []
}

const onInput = (event) => {
  const value = event.target.value
  setQuery(value)
  if (!isOpen.value) openMenu()
  nextTick(() => updateMenuDirection())
}

const selectItem = (item) => {
  clearQuery()
  emit('select', item)
  closeMenu()
}

const handleAppendClick = () => {
  restoreSelectedState()
  emit('append-click')
}

const moveHighlight = (step) => {
  if (!isOpen.value) {
    openMenu()
    return
  }
  if (filteredItems.value.length === 0) return

  const lastIndex = filteredItems.value.length - 1
  if (highlightedIndex.value < 0) {
    highlightedIndex.value = 0
    return
  }

  const nextIndex = highlightedIndex.value + step
  if (nextIndex < 0) {
    highlightedIndex.value = lastIndex
    return
  }
  if (nextIndex > lastIndex) {
    highlightedIndex.value = 0
    return
  }

  highlightedIndex.value = nextIndex
}

const selectHighlighted = () => {
  if (!isOpen.value || highlightedIndex.value < 0) return
  const item = filteredItems.value[highlightedIndex.value]
  if (item) selectItem(item)
}

const handleEnter = () => {
  if (filteredItems.value.length > 0 && highlightedIndex.value >= 0) {
    selectHighlighted()
    return
  }

  if (hasQuery.value) {
    emit('enter-search', props.modelValue)
    closeMenu()
  }
}

const handleBlur = () => {
  clearTimeout(blurTimer)
  blurTimer = setTimeout(() => {
    if (rootRef.value?.contains(document.activeElement)) return
    restoreSelectedState()
  }, 0)
}

const handleDocumentClick = (event) => {
  if (!rootRef.value?.contains(event.target)) {
    restoreSelectedState()
  }
}

// 드롭다운은 기본 아래로 열고, 아래 공간이 부족할 때만 위쪽으로 뒤집는다.
const updateMenuDirection = () => {
  if (!rootRef.value || !menuRef.value || typeof window === 'undefined') return

  const rootRect = rootRef.value.getBoundingClientRect()
  const menuRect = menuRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const gap = 8
  const spaceBelow = viewportHeight - rootRect.bottom - gap
  const spaceAbove = rootRect.top - gap

  if (spaceBelow >= menuRect.height) {
    menuDirection.value = 'down'
    return
  }

  if (spaceAbove >= menuRect.height) {
    menuDirection.value = 'up'
    return
  }

  menuDirection.value = 'down'
}

watch(
  () => props.modelValue,
  () => {
    if (!isOpen.value) return
    syncHighlightedIndex()
  },
)

watch(highlightedIndex, () => {
  syncHighlightedOptionIntoView()
})

watch(
  () => props.selectedItem,
  () => {
    if (isOpen.value) {
      syncHighlightedIndex()
    }
    if (hasSelectedItem.value && !isOpen.value) {
      isEditing.value = false
    }
  },
)

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  window.addEventListener('resize', updateMenuDirection)
})

onBeforeUnmount(() => {
  clearTimeout(blurTimer)
  document.removeEventListener('click', handleDocumentClick)
  window.removeEventListener('resize', updateMenuDirection)
})
</script>
