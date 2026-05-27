<template>
  <div class="ag-icon-btn-cell">
    <EblBtn
      :icon="icon"
      :color="color"
      :outlined="outlined"
      :small="small"
      :disabled="disabled"
      @click="handleClick"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
})

const rendererParams = computed(
  () => props.params?.cellRendererParams || props.params?.colDef?.cellRendererParams || {},
)
const icon = computed(() => rendererParams.value.icon || props.params.icon || 'ebli:download')
const color = computed(() => rendererParams.value.color || props.params.color || 'subtle')
const outlined = computed(() => rendererParams.value.outlined ?? props.params.outlined ?? false)
const small = computed(() => rendererParams.value.small ?? props.params.small ?? true)
const disabled = computed(() => {
  const disabledValue = rendererParams.value.disabled ?? props.params.disabled
  return typeof disabledValue === 'function' ? disabledValue(props.params.data) : !!disabledValue
})
const onClick = computed(() => rendererParams.value.onClick || props.params.onClick)

const handleClick = (e) => {
  e.stopPropagation()
  if (disabled.value) return
  if (onClick.value) onClick.value(props.params.data)
}
</script>

<style scoped></style>
