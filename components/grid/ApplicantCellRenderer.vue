<template>
  <div class="ag-applicant-cell">
    <div class="ag-applicant-cell__logo">
      <img v-if="logoUrl" :src="logoUrl" :alt="value" />
      <span v-else>🏢</span>
    </div>
    <span class="ag-applicant-cell__name">{{ value }}</span>
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

const value = computed(() => props.params.value ?? '')
const logoUrl = computed(() => props.params.data?.applicantLogo ?? '')
</script>
