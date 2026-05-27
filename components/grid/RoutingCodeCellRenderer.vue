<template>
  <div class="ebl-routing-code-cell">
    <span class="ebl-routing-code-cell__code" v-tooltip:top="originName">
      {{ originCode }}
    </span>
    <div class="ebl-routing-code-cell__arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="4" viewBox="0 0 36 4" fill="none">
        <path d="M0 3.33594H34L31.2679 0.335938" stroke="#295BFF" />
      </svg>
    </div>
    <span class="ebl-routing-code-cell__code" v-tooltip:top="destinationName">
      {{ destinationCode }}
    </span>
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

const origin = computed(() => resolvedParams.value.origin || {})
const destination = computed(() => resolvedParams.value.destination || {})

const originCode = computed(() => origin.value.code || '')
const destinationCode = computed(() => destination.value.code || '')
const originName = computed(() => origin.value.name || '')
const destinationName = computed(() => destination.value.name || '')
</script>
