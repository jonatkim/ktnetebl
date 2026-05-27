<template>
  <div class="ebl-routing-cell">
    <div class="ebl-routing-cell__location">
      <span class="ebl-routing-cell__city">{{ origin.city }},</span>
      <span class="ebl-routing-cell__country">{{ origin.country }}</span>
    </div>
    <div class="ebl-routing-cell__arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="4" viewBox="0 0 36 4" fill="none">
        <path d="M0 3.33594H34L31.2679 0.335938" stroke="#295BFF" />
      </svg>
    </div>
    <div class="ebl-routing-cell__location">
      <span class="ebl-routing-cell__city">{{ destination.city }},</span>
      <span class="ebl-routing-cell__country">{{ destination.country }}</span>
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

const buildLocation = (location) => {
  if (!location) return { city: '', country: '' }
  if (location.city || location.country) {
    return {
      city: location.city || '',
      country: location.country || '',
    }
  }

  const [city = '', country = ''] = String(location.name || '')
    .split(',')
    .map((text) => text.trim())

  return { city, country }
}

const origin = computed(() => buildLocation(resolvedParams.value.origin))
const destination = computed(() => buildLocation(resolvedParams.value.destination))
</script>
