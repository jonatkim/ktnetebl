<script setup>
const props = defineProps({
  // AG Grid Vue will pass a single `params` object to cell renderer components
  params: { type: Object, default: () => ({}) },
})

import { computed } from 'vue'

const text = computed(() => {
  const p = props.params || {}
  if (p.value !== undefined && p.value !== null) return p.value
  if (p.data?.value !== undefined && p.data?.value !== null) return p.data.value
  const field = p.colDef?.field
  if (field && p.data && Object.prototype.hasOwnProperty.call(p.data, field)) return p.data[field]
  return ''
})
</script>

<template>
  <div class="two-line-ellipsis">{{ text }}</div>
</template>
