<template>
  <EblBottomSheet v-model="modelValue" persistent>
    <VCard class="ebl-bottom-sheet__card">
      <!-- 헤더 -->
      <VCardTitle class="ebl-bottom-sheet__header">
        <span class="title">{{ title }}</span>
        <VSpacer />
        <EblBtn icon color="ghost" @click="modelValue = false">
          <VIcon icon="ebli:close" :size="24" />
        </EblBtn>
      </VCardTitle>

      <!-- 컨텐츠 -->
      <VCardText class="ebl-bottom-sheet__text ebl-filter-dialog__content">
        <!-- 검색 입력 (옵션) -->
        <div v-if="showQuery" class="ebl-filter-dialog__section">
          <slot name="query" :pending="pending">
            <EblInput
              v-model="pending.query"
              :placeholder="queryPlaceHolder"
              clearable
              prepend-icon="ebli:search"
            />
          </slot>
        </div>

        <!-- 상태/필터 선택 (옵션) -->
        <div v-if="statusOptions.length > 0" class="ebl-filter-dialog__section">
          <slot name="status" :pending="pending" :options="statusOptions">
            <EblInfoItem :label="statusLabel" vertical has-input>
              <EblSelect v-model="pending.status" block :options="statusOptions" />
            </EblInfoItem>
          </slot>
        </div>

        <!--2026.06.25 추가 cargo type-->
        <div v-if="props.cargoOptions && props.cargoOptions.length > 0" class="ebl-filter-dialog__section">
          <slot name="cargo-type" :pending="pending" :options="cargoOptions">
            <EblInfoItem :label="cargoLabel" vertical has-input>
              <EblSelect v-model="pending.cargoType" block :options="cargoOptions" />
            </EblInfoItem>
          </slot>
        </div>

        <!-- 추가 필터 슬롯 -->
        <slot name="filters" :pending="pending" />

        <!-- 날짜 범위 (옵션) -->
        <template v-if="filterValue.range && typeof filterValue.range === 'object'">
          <div class="ebl-filter-dialog__section">
            <slot name="date-range" :pending="pending" :label="dateLabel">
              <EblInfoItem vertical :label="dateLabel" content-class="py-0">
                <!-- From/To 버튼 -->
                <div class="ebl-filter-dialog__date-inputs">
                  <div class="ebl-filter-dialog__date-field" @click="toggleFromPicker">
                    <EblBtn
                      class="ebl-filter-dialog__date-btn"
                      :class="{
                        'ebl-filter-dialog__date-btn--active': activeDateField === 'from',
                        'ebl-filter-dialog__date-btn--placeholder': !pending.range?.from,
                      }"
                      outlined
                      append-icon="ebli:calendar"
                    >
                      {{ formatDateDisplay(pending.range?.from) || 'From' }}
                    </EblBtn>
                  </div>

                  <div class="ebl-filter-dialog__date-separator">-</div>

                  <div class="ebl-filter-dialog__date-field" @click="toggleToPicker">
                    <EblBtn
                      class="ebl-filter-dialog__date-btn"
                      :class="{
                        'ebl-filter-dialog__date-btn--active': activeDateField === 'to',
                        'ebl-filter-dialog__date-btn--placeholder': !pending.range?.to,
                      }"
                      outlined
                      append-icon="ebli:calendar"
                    >
                      {{ formatDateDisplay(pending.range?.to) || 'To' }}
                    </EblBtn>
                  </div>
                </div>
              </EblInfoItem>
            </slot>

            <!-- 프리셋 버튼 -->
            <slot name="presets" :presets="rangePresets">
              <div v-if="Object.keys(rangePresets).length > 0" class="ebl-filter-dialog__presets">
                <EblBtn
                  v-for="(preset, key) in rangePresets"
                  :key="key"
                  color="ghost"
                  outlined
                  class="flex-1"
                  :class="{ 'is-active': isPresetActive(key) }"
                  @click="applyPreset(key)"
                >
                  {{ preset.label }}
                </EblBtn>
              </div>
            </slot>

            <!-- 날짜 피커 -->
            <VExpandTransition>
              <div v-if="activeDateField" class="ebl-date-picker-wrapper ebl-date-picker--filter">
                <VDivider class="my-4 mx-2" />
                <div class="ebl-date-picker">
                  <VueDatePicker
                    v-model="activeDateValue"
                    inline
                    :format="'yyyy-MM-dd'"
                    preview-format="yyyy-MM-dd"
                    auto-apply
                    :time-config="{ enableTimePicker: false }"
                    :min-date="activeMinDate"
                    :max-date="activeMaxDate"
                    @update:model-value="activeDateField = null"
                  />
                </div>
              </div>
            </VExpandTransition>
          </div>
        </template>
      </VCardText>

      <!-- 액션 버튼 -->
      <VCardActions class="ebl-bottom-sheet__action">
        <EblBtn large class="flex-1" @click="onReset">Reset</EblBtn>
        <EblBtn color="cta" class="flex-1" large @click="onApply">Apply</EblBtn>
      </VCardActions>
    </VCard>
  </EblBottomSheet>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'

// ============================================
// Props 정의
// ============================================
const props = defineProps({
  /**
   * 바텀시트 표시 여부 (v-model 바인딩)
   * @type {Boolean}
   * @default false
   */
  modelValue: {
    type: Boolean,
    default: false,
  },

  /**
   * 필터값 객체 (양방향 바인딩)
   * 구조: { query: '', status: '', range: false | {from: '', to: ''} }
   * @type {Object}
   * @required
   */
  filterValue: {
    type: Object,
    required: true,
    default: () => ({
      query: '',
      status: '',
      range: false,
    }),
  },

  /**
   * 바텀시트 제목
   * @type {String}
   * @default 'Filter'
   */
  title: {
    type: String,
    default: 'Filter',
  },

  /**
   * 검색 입력 필드 플레이스홀더
   * @type {String}
   * @default 'Search'
   */
  queryPlaceHolder: {
    type: String,
    default: 'Search',
  },

  /**
   * 상태/필터 옵션 배열 (빈 배열이면 미표시)
   * 구조: [{ label: '라벨', value: '값' }, ...]
   * @type {Array}
   * @default []
   */
  statusOptions: {
    type: Array,
    default: () => [],
  },

  /*2026.06.25*/
  /**
   * Cargo Type 필터 레이블
   * @type {String}
   */
  cargoLabel: {
    type: String,
    default: 'Cargo Type',
  },

  /**
   * 상태/필터 레이블
   * @type {String}
   * @default 'Status'
   */
  statusLabel: {
    type: String,
    default: 'Status',
  },

  /**
   * 검색 입력 필드 표시 여부
   * @type {Boolean}
   * @default true
   */
  showQuery: {
    type: Boolean,
    default: true,
  },

  /**
   * 날짜 범위 섹션 레이블
   * @type {String}
   * @default 'Date'
   */
  dateLabel: {
    type: String,
    default: 'Date',
  },

  /**
   * 날짜 프리셋 객체
   * 구조: { '7days': { label: '7 Days', value: 7 }, ... }
   * @type {Object}
   * @default {}
   */
  rangePresets: {
    type: Object,
    default: () => ({
      '7days': { label: '7 Days', value: 7 },
      '14days': { label: '14 Days', value: 14 },
      '1month': { label: '1 Month', value: 30 },
    }),
  },
})

// ============================================
// Emits 정의
// ============================================
const emit = defineEmits([
  'update:modelValue', // 바텀시트 열기/닫기
  'update:filterValue', // 필터값 변경 (v-model:filterValue)
  'filter:apply', // Apply 버튼 클릭
  'filter:reset', // Reset 버튼 클릭
])

// ============================================
// 양방향 바인딩
// ============================================
const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// ============================================
// 내부 상태
// ============================================
const pending = reactive({
  query: props.filterValue.query || '',
  status: props.filterValue.status || '',
  //2026.06.25 추가
  cargoType: props.filterValue.cargoType || '',
  range:
    props.filterValue.range && typeof props.filterValue.range === 'object'
      ? { ...props.filterValue.range }
      : false,
})

const activeDateField = ref(null) // 'from', 'to', null

// ============================================
// 날짜 유틸 함수
// ============================================
const getDateString = (date, daysOffset = 0) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + daysOffset)
  const y = newDate.getFullYear()
  const m = String(newDate.getMonth() + 1).padStart(2, '0')
  const d = String(newDate.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatDateDisplay = (value) => {
  if (!value) return ''
  if (value instanceof Date) return getDateString(value)
  if (typeof value === 'string') return value.slice(0, 10)
  return ''
}

const toDateValue = (value) => {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

// ============================================
// 날짜 피커 상태
// ============================================
const activeDateValue = computed({
  get() {
    if (!activeDateField.value || !pending.range) return null
    const val = pending.range[activeDateField.value]
    return val ? toDateValue(val) : null
  },
  set(value) {
    if (!activeDateField.value || !pending.range) return
    pending.range[activeDateField.value] = value ? formatDateDisplay(value) : ''
  },
})

const activeMinDate = computed(() => {
  if (activeDateField.value !== 'to' || !pending.range) return null
  return toDateValue(pending.range.from)
})

const activeMaxDate = computed(() => {
  if (activeDateField.value !== 'from' || !pending.range) return null
  return toDateValue(pending.range.to)
})

// ============================================
// 헬퍼 메서드
// ============================================
const applyPreset = (presetKey) => {
  if (!pending.range) return
  const preset = props.rangePresets[presetKey]
  if (!preset) return
  const today = new Date()
  pending.range.from = getDateString(today, -preset.value)
  pending.range.to = getDateString(today)
  activeDateField.value = null
}

const toggleFromPicker = () => {
  activeDateField.value = activeDateField.value === 'from' ? null : 'from'
}

const toggleToPicker = () => {
  activeDateField.value = activeDateField.value === 'to' ? null : 'to'
}

const isPresetActive = (presetKey) => {
  if (!pending.range || typeof pending.range !== 'object') return false
  const preset = props.rangePresets[presetKey]
  if (!preset) return false
  const today = new Date()
  const expectedFrom = getDateString(today, -preset.value)
  const expectedTo = getDateString(today)
  const currentFrom = formatDateDisplay(pending.range.from)
  const currentTo = formatDateDisplay(pending.range.to)
  return currentFrom === expectedFrom && currentTo === expectedTo
}

const onApply = () => {
  emit('update:filterValue', {
    query: pending.query,
    status: pending.status,
    cargoType: pending.cargoType, //2026.06.25 
    range: pending.range,
  })
  emit('filter:apply')
  modelValue.value = false
}

const onReset = () => {
  pending.query = ''
  pending.status = ''
  pending.cargoType = '' //2026.06.25
  if (pending.range && typeof pending.range === 'object') {
    pending.range.from = ''
    pending.range.to = ''
  }
  activeDateField.value = null
  emit('update:filterValue', {
    query: pending.query,
    status: pending.status,
    cargoType: pending.cargoType, //2026.06.25
    range:
      pending.range && typeof pending.range === 'object' ? { ...pending.range } : pending.range,
  })
  emit('filter:reset')
  modelValue.value = false
}

// ============================================
// Watchers
// ============================================
watch(
  () => props.filterValue,
  (newVal) => {
    if (modelValue.value) return // 바텀시트 열려있으면 무시
    pending.query = newVal.query || ''
    pending.status = newVal.status || ''
    pending.cargoType = newVal.cargoType || '' //2026.06.25
    pending.range = newVal.range && typeof newVal.range === 'object' ? { ...newVal.range } : false
  },
  { deep: true },
)
</script>
