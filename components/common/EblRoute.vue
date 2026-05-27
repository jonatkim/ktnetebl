<template>
  <div class="ebl-route">
    <div class="ebl-route__side">
      <VTooltip
        location="top start"
        open-on-click
        :open-on-hover="false"
        :open-on-focus="false"
        :close-on-content-click="false"
        scroll-strategy="close"
        :disabled="!fromTooltip"
      >
        <template #activator="{ props: tooltipProps }">
          <span v-bind="tooltipProps" class="ebl-route__chunk ebl-route__code">
            <span class="ebl-route__text">{{ fromCodeDisplay }}</span>
          </span>
        </template>
        <div class="ebl-route__tooltip">
          <div>{{ fromCity }}</div>
          <div v-if="fromCountry">{{ fromCountry }}</div>
        </div>
      </VTooltip>
    </div>
    <div class="ebl-route__arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="4" viewBox="0 0 36 4" fill="none">
        <path d="M0 3.33594H34L31.2679 0.335938" stroke="#295BFF" />
      </svg>
    </div>
    <div class="ebl-route__side ebl-route__side--to">
      <VTooltip
        location="top start"
        open-on-click
        :open-on-hover="false"
        :open-on-focus="false"
        :close-on-content-click="false"
        scroll-strategy="close"
        :disabled="!toTooltip"
      >
        <template #activator="{ props: tooltipProps }">
          <span v-bind="tooltipProps" class="ebl-route__chunk ebl-route__code">
            <span class="ebl-route__text">{{ toCodeDisplay }}</span>
          </span>
        </template>
        <div class="ebl-route__tooltip">
          <div>{{ toCity }}</div>
          <div v-if="toCountry">{{ toCountry }}</div>
        </div>
      </VTooltip>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  from: {
    type: String,
    default: '',
  },
  to: {
    type: String,
    default: '',
  },
  fromCode: {
    type: String,
    default: '',
  },
  toCode: {
    type: String,
    default: '',
  },
})

const splitPlace = (value) => {
  if (!value) return { city: '', country: '' }
  const parts = value.split(',')
  if (parts.length < 2) {
    return { city: value.trim(), country: '' }
  }
  return {
    city: parts[0].trim(),
    country: parts.slice(1).join(',').trim(),
  }
}

const fromPlace = computed(() => splitPlace(props.from))
const toPlace = computed(() => splitPlace(props.to))

const fromCity = computed(() => fromPlace.value.city)
const fromCountry = computed(() => fromPlace.value.country)
const toCity = computed(() => toPlace.value.city)
const toCountry = computed(() => toPlace.value.country)

const DEFAULT_CODE = '-----'
const fromCodeDisplay = computed(() => (props.fromCode || '').trim() || DEFAULT_CODE)
const toCodeDisplay = computed(() => (props.toCode || '').trim() || DEFAULT_CODE)
const fromTooltip = computed(() => (props.from || '').trim())
const toTooltip = computed(() => (props.to || '').trim())
</script>
