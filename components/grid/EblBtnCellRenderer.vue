<template>
  <div class="ag-btn-cell">
    <EblBtn
      :icon="buttonIcon"
      :color="color"
      :outlined="outlined"
      :small="small"
      :large="large"
      :text="textVariant"
      :pill="pill"
      :disabled="disabled"
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      :height="height"
      @click="handleClick"
    >
      {{ label }}
    </EblBtn>
  </div>
</template>

<script setup>
const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
})

const rendererParams = computed(() => props.params?.cellRendererParams || props.params?.colDef?.cellRendererParams || {})
const icon = computed(() => rendererParams.value.icon || props.params.icon || '')
const color = computed(() => rendererParams.value.color || props.params.color || 'subtle')
const outlined = computed(() => rendererParams.value.outlined ?? props.params.outlined ?? false)
const small = computed(() => rendererParams.value.small ?? props.params.small ?? true)
const large = computed(() => rendererParams.value.large ?? props.params.large ?? false)
const textVariant = computed(() => rendererParams.value.text ?? props.params.text ?? false)
const pill = computed(() => rendererParams.value.pill ?? props.params.pill ?? false)
const label = computed(() => rendererParams.value.label || props.params.label || '')
const prependIcon = computed(() => {
  if (rendererParams.value.prependIcon || props.params.prependIcon) {
    return rendererParams.value.prependIcon || props.params.prependIcon
  }
  return label.value && icon.value ? icon.value : ''
})
const appendIcon = computed(() => rendererParams.value.appendIcon || props.params.appendIcon || '')
const buttonIcon = computed(() => {
  if (rendererParams.value.iconOnly != null) {
    return rendererParams.value.iconOnly ? icon.value : false
  }
  return label.value ? false : icon.value || false
})
const height = computed(() => rendererParams.value.height ?? props.params.height ?? '')
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
