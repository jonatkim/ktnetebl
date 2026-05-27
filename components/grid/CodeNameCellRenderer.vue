<template>
  <div class="ebl-code-name-cell">
    <div class="ebl-cell-code">{{ code }}</div>
    <div class="ebl-cell-name">{{ name }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
})

const code = computed(
  () => props.params.data?.[props.params.colDef?.cellRendererParams?.codeField] ?? '',
)
const name = computed(
  () => props.params.data?.[props.params.colDef?.cellRendererParams?.nameField] ?? '',
)
</script>
