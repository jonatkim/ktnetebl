<template>
  <button
    type="button"
    class="ag-radio-cell"
    :class="{ 'is-selected': isSelected }"
    :aria-pressed="isSelected"
    @click.stop="handleSelect"
  >
    <span class="ag-radio-cell__outer">
      <span v-if="isSelected" class="ag-radio-cell__inner" />
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
})

const selectedId = computed(() => props.params?.selectedId ?? null)
const rowId = computed(() => props.params?.data?.id ?? null)
const isSelected = computed(() => selectedId.value === rowId.value)

const handleSelect = () => {
  props.params?.onSelect?.(props.params)
}
</script>

<style scoped lang="scss">
.ag-radio-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  display: flex;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  &__outer {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: 1.5px solid #c8d3e1;
    border-radius: 50%;
    background: #fff;
    transition:
      border-color 0.15s ease,
      background-color 0.15s ease;
  }

  &__inner {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2f6bff;
  }

  &.is-selected {
    .ag-radio-cell__outer {
      border-color: #2f6bff;
      background: #fff;
    }
  }
}
</style>
