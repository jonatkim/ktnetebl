<template>
  <div class="ebl-company-cell">
    <span v-if="showSelector" class="ebl-company-cell__selector" aria-hidden="true">
      <span class="ebl-company-cell__selector-outer">
        <span class="ebl-company-cell__selector-inner" />
      </span>
    </span>
    <div class="ebl-company-cell__logo">
      <img :src="logo" :alt="name" />
    </div>
    <div class="ebl-company-cell__name" v-tooltip:top="name">
      <span v-if="prefix" class="ebl-company-cell__prefix">{{ prefix }}</span>
      <span>{{ name }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
})

const resolvedParams = computed(() => {
  if (typeof props.params === 'function') {
    return props.params(props.params)
  }
  return props.params
})

const name = computed(() => resolvedParams.value.name || '')
const logo = computed(() => resolvedParams.value.logo || '')
const prefix = computed(() => resolvedParams.value.prefix || '')
const showSelector = computed(() => !!resolvedParams.value.showSelector)
</script>
