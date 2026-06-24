<template>
  <div class="ebl-grid-item ebl-grid-item--wrap" @click="$emit('click')">
    <div class="ebl-grid-item__row bl-row">
      <span class="ebl-grid-item__bl-no">{{ blNo }}</span>

      <div class="ebl-grid-item__badge">
        <EblBadge
          v-tooltip:top="'위험물정보(Dangerous cargo)는 PC환경에서 조회가 가능합니다.'"
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
        <!--2026.06.24 추가-->
        <EblBadge 
          v-if="dg === 'Y'" 
          variant="outlined" 
          size="sm" 
          color="error" 
          class="ml-1"
          :style="{
            color: '#FF1C1C !important',
            borderColor: '#FF1C1C !important',
            backgroundColor: 'transparent !important'
          }"
        >
          DG
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

  // [추가] 부모 컴포넌트(EBLCDC050U.vue)에서 넘겨받을 dg 속성 선언
    dg: { type: String, default: 'N' },
  
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