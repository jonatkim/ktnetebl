<template>
  <div class="ebl-task-card" :class="{ 'ebl-task-card--outlined': outlined }" :style="colorStyle">
    <!-- Header with Title and Tooltip -->
    <div class="ebl-task-card__head">
      <span class="ebl-task-card__title">
        {{ title }}
      </span>
      <EblTooltip v-if="tooltip" location="top">
        <template #activator="{ props }">
          <VIcon icon="ebli:information" class="tooltip" size="20" v-bind="props" />
        </template>
        <template #default>
          {{ tooltip }}
        </template>
      </EblTooltip>
      <VSpacer />
      <VProgressLinear
        v-if="progress != null"
        v-model="progressValue"
        bg-color="#DCE3EB"
        color="#0EE50F"
        height="8"
        rounded
      />
    </div>

    <!-- Main Value -->
    <div class="ebl-task-card__value">
      <div class="value">{{ value }}</div>
      <div class="unit">{{ unit }}</div>
    </div>

    <!-- Stats List (Optional) -->
    <div v-if="stats && stats.length" class="ebl-task-card__stats">
      <template v-for="(stat, index) in stats" :key="`stat-${index}`">
        <div class="stat-item">
          <span class="value">{{ stat.value }}</span>
          <span class="label">{{ stat.label }}</span>
        </div>
        <VDivider v-if="index < stats.length - 1" vertical class="divider" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 카드 제목
  title: {
    type: String,
    required: true,
  },
  // 카드 설명 툴팁 (선택사항)
  tooltip: {
    type: String,
    default: null,
  },
  // 메인 값
  value: {
    type: [String, Number],
    required: true,
  },
  // 값의 단위
  unit: {
    type: String,
    required: true,
  },
  // 하단 상세 통계 배열 [{label: '라벨', value: '값'}, ...]
  stats: {
    type: Array,
    default: null,
  },
  // 카드 색상 테마 (primary, secondary, success, warning, error, info) 또는 HEX
  color: {
    type: String,
    default: 'default',
  },
  // 아웃라인 스타일 (배경 제거)
  outlined: {
    type: Boolean,
    default: false,
  },
  // 진행률
  progress: {
    type: [Number, String],
    default: undefined,
  },
})

const progressValue = computed(() => {
  const val = Number(props.progress)
  console.log('progress val:', val)
  return isNaN(val) ? 0 : val
})

const colorStyle = computed(() => {
  const presetMap = {
    default: 'var(--border-accent-blue)',
    blue: 'var(--border-accent-blue)',
    violet: 'var(--border-accent-violet)',
    pink: 'var(--border-accent-pink)',
    red: 'var(--border-accent-red)',
    amber: 'var(--border-accent-amber)',
    mint: 'var(--border-accent-mint)',
    green: 'var(--border-accent-green)',
    neutral: 'var(--border-accent-neutral)',
  }

  const resolved = presetMap[props.color] || props.color

  return {
    '--task-card-color': resolved,
  }
})
</script>

<style lang="scss" scoped>
// 스타일은 _common.scss에서 관리
</style>
