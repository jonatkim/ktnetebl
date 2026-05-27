<template>
  <div class="ebl-grid-item ebl-grid-item--wrap" @click="$emit('click')">
    <div class="ebl-grid-item__row bl-row">
      <span class="ebl-grid-item__bl-no">{{ blNo }}</span>
      <div class="ebl-grid-item__badge">
        <EblBadge
          v-tooltip:top="blStatus?.tooltip"
          variant="tonal"
          size="sm"
          :color="blStatus?.color"
        >
          <VIcon v-if="blStatus?.icon" :icon="blStatus?.icon" :size="16" />
          {{ blStatus?.value }}
        </EblBadge>
        <EblBadge v-if="transactionStatus" variant="tonal" size="sm" color="gray">
          {{ transactionStatus }}
        </EblBadge>
      </div>
    </div>
    <VDivider />
    <div class="ebl-grid-item__row">
      <div class="ebl-company-cell">
        <div class="ebl-company-cell__logo">
          <img :src="companyName?.logo" :alt="companyName?.name" />
        </div>
        <div class="ebl-company-cell__name">
          <span v-if="companyName?.prefix" class="ebl-company-cell__prefix">{{
            companyName?.prefix
          }}</span>
          <span>{{ companyName?.name }}</span>
        </div>
      </div>
    </div>
    <VDivider />
    <div class="ebl-grid-item__row">
      <div class="ebl-routing-cell">
        <div class="ebl-routing-cell__location">
          <span class="ebl-routing-cell__city" v-tooltip:top="routing.origin.name">
            {{ routing.origin.code }}
          </span>
        </div>
        <div class="ebl-routing-cell__arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="4"
            viewBox="0 0 36 4"
            fill="none"
          >
            <path d="M0 3.33594H34L31.2679 0.335938" stroke="#295BFF" />
          </svg>
        </div>
        <div class="ebl-routing-cell__location">
          <span class="ebl-routing-cell__city" v-tooltip:top="routing.destination.name">
            {{ routing.destination.code }}
          </span>
        </div>
      </div>
    </div>
    <VDivider />
    <div class="ebl-grid-item__row">
      <span class="ebl-grid-item__date">{{ receivedDate }}</span>
    </div>
  </div>
</template>

<script setup>
import EblBadge from '~/components/common/EblBadge.vue'

const props = defineProps({
  blNo: { type: String, required: true },

  companyName: {
    type: Object,
    default: () => ({ name: '', logo: '', prefix: '' }),
  },
  blStatus: {
    type: Object,
    default: () => ({ value: '', color: '', tooltip: '' }),
  },
  transactionStatus: { type: String, default: '' },
  routing: {
    type: Object,
    default: () => ({ origin: { code: '', name: '' }, destination: { code: '', name: '' } }),
  },
  receivedDate: { type: String, default: '' },
})
</script>
