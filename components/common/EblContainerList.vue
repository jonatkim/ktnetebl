<template>
  <div class="ebl-container-list">
    <!-- Header -->
    <div class="ebl-container-list__header">
      <div class="ebl-container-list__title-row">
        <h3 class="ebl-container-list__title">
          Total
          <small>{{ filteredList.length }}</small>
        </h3>
        <slot name="util" />
      </div>

      <!-- Search Input -->
      <EblInput
        v-model="searchQuery"
        placeholder="Search"
        clearable
        prepend-icon="ebli:search"
        class="ebl-container-list__search"
      />
    </div>

    <!-- List Container -->
    <div ref="listRef" class="ebl-container-list__items">
      <div
        v-for="item in filteredList"
        :key="getItemKey(item)"
        class="ebl-container-list__item"
        :class="{
          'ebl-container-list__item--active': isSelected(item),
          'ebl-container-list__item--draft': !item.containerNo,
        }"
        :data-item-key="getItemKey(item)"
        @click="selectItem(item)"
      >
        <slot name="item" :item="item">
          <div class="ebl-container-list__item-no">{{ item.containerNo }}</div>
        </slot>
        <VIcon icon="ebli:chevron-right" :size="14" class="ebl-container-list__item-icon" />
      </div>

      <!-- Empty State -->
      <div v-if="filteredList.length === 0" class="ebl-container-list__empty">
        <div class="ebl-container-list__empty-text">No containers found</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import EblInput from './EblInput.vue'

const props = defineProps({
  list: {
    type: Array,
    required: true,
    default: () => [],
  },
  modelValue: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')

const listRef = ref(null)
// 신규 Draft 항목도 안정적으로 선택/비교할 수 있도록 id를 우선 키로 사용한다.
const getItemKey = (item) => item?.id ?? item?.containerNo ?? ''

// Filtered list based on search query
const filteredList = computed(() => {
  if (!searchQuery.value) return props.list

  const query = searchQuery.value.toLowerCase()
  return props.list.filter(
    (item) =>
      (item.containerNo && item.containerNo.toLowerCase().includes(query)) ||
      (item.sealNo && item.sealNo.toLowerCase().includes(query)) ||
      (item.sizeType && item.sizeType.toLowerCase().includes(query)),
  )
})

// Check if item is selected
const isSelected = (item) => {
  if (!props.modelValue) return false
  const selectedKey = getItemKey(props.modelValue)
  const itemKey = getItemKey(item)
  return selectedKey !== '' && selectedKey === itemKey
}

// Select item
const selectItem = async (item) => {
  emit('update:modelValue', item)
  await scrollSelectedIntoView('center')
}

// 외부에서 항목을 추가한 뒤에도 현재 선택 항목이 리스트 중앙에 오도록 맞춘다.
const scrollSelectedIntoView = async (block = 'nearest') => {
  await nextTick()
  const selectedEl = listRef.value?.querySelector('.ebl-container-list__item--active')
  selectedEl?.scrollIntoView({ block, behavior: 'smooth' })
}

defineExpose({
  scrollSelectedIntoView,
})
</script>
