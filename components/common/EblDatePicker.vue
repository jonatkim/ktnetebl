<template>
  <div class="ebl-date-picker" :class="{ 'is-error': props.error }">
    <VueDatePicker
      ref="datepicker"
      :key="pickerKey"
      v-bind="forwardedAttrs"
      v-model="innerValue"
      :input-attrs="{ clearable: false }"
      @open="handleOpen"
      @closed="handleClosed"
      @cleared="(e) => emit('clear', e)"
      @date-click="(e) => emit('day-click', e)"
      @update-month-year="(e) => emit('update-month-year', e)"
      @text-input="(event, parsedDate) => emit('text-input', event, parsedDate)"
      @focus="() => emit('focus')"
      @blur="() => emit('blur')"
    >
      <!-- EblInput을 사용한 커스텀 입력 필드 -->
      <template #dp-input="{ value, onClear, onBlur, onFocus, onKeypress }">
        <EblInput
          :model-value="value"
          :size="props.size"
          :disabled="props.disabled"
          :readonly="props.readonly"
          :error="props.error"
          :placeholder="forwardedAttrs.placeholder"
          :clearable="props.clearable"
          append-icon="ebli:calendar"
          @clear="onClear"
          @blur="onBlur"
          @focus="(e) => handleInputFocus(onFocus, e)"
          @keypress="onKeypress"
        />
      </template>
      <!-- 이전/다음 화살표 커스텀 아이콘 -->
      <template #left-side-icon>
        <VIcon icon="ebli:chevron-left" />
      </template>
      <template #right-side-icon>
        <VIcon icon="ebli:chevron-right" />
      </template>

      <!-- 연도 표시 커스텀 -->
      <template #year="{ value }"> {{ value }}{{ currentLocale === 'ko' ? '년' : '' }} </template>

      <!-- Range 모드일 때 날짜 범위 단축 버튼 -->
      <template v-if="props.range" #menu-header>
        <div class="ebl-date-picker__header-util">
          <span>날짜 선택</span>
          <VSpacer />
          <EblBtn :disabled="props.disabled" @click="selectPrev(7)">1주일</EblBtn>
          <EblBtn :disabled="props.disabled" @click="selectPrev(15)">15일</EblBtn>
          <EblBtn :disabled="props.disabled" @click="selectPrev(30)">1개월</EblBtn>
        </div>
      </template>

      <!-- 부모가 제공하면 action-buttons 슬롯을 전달 (v12.1+ props: value, selectDate, selectionDisabled) -->
      <template v-if="$slots['action-buttons']" #action-buttons="slotProps">
        <slot name="action-buttons" v-bind="slotProps" />
      </template>
      <!-- 하위 호환: action-row 슬롯이 있으면 그대로 포워딩 -->
      <template v-else-if="$slots['action-row']" #action-row="slotProps">
        <slot name="action-row" v-bind="slotProps" />
      </template>
    </VueDatePicker>

    <!-- Helper/Error Message -->
    <Transition name="ebl-message">
      <div
        v-if="props.helperMessage || props.errorMessage || $slots.message"
        class="ebl-message"
        :class="{ 'is-error': props.error }"
      >
        <slot
          name="message"
          :text="props.errorMessage || props.helperMessage || ''"
          :is-error="props.error"
        >
          {{ props.errorMessage || props.helperMessage }}
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { ko, enUS } from 'date-fns/locale'
import { useLocale } from '~/composables/useLocale'

defineOptions({ inheritAttrs: false })
const { locale } = useLocale()
const currentLocale = computed(() => locale.value)

const dpRef = useTemplateRef('datepicker')

const props = defineProps({
  clearable: {
    type: Boolean,
    default: false,
  },
  range: {
    type: Boolean,
    default: false,
  },
  // preset: 날짜 선택 모드 프리셋
  preset: {
    type: String,
    default: 'date',
    validator: (value) => ['date', 'datetime', 'time', 'month', 'year'].includes(value),
  },
  modelValue: {
    type: [String, Number, Date, Array, Object, null],
    default: null,
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  helperMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'update:modelValue',
  'open',
  'closed',
  'clear',
  'day-click',
  'update-month-year',
  'text-input',
  'focus',
  'blur',
])
const attrs = useAttrs()

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 내부 컴포넌트 재마운트용 키 값
const pickerKey = computed(() => {
  const isRange = Boolean(props.range)
  return `ktdp-${props.preset}-${props.size}-${isRange}-${props.clearable}`
})

const forwardedAttrs = computed(() => {
  const fmt = attrs.format || getDefaultFormat(props.preset)
  const isRange = Boolean(props.range)
  const dateFnsLocale = currentLocale.value === 'ko' ? ko : enUS

  return {
    ...attrs,
    // 기본 설정
    disabled: props.disabled,
    readonly: props.readonly,
    range: props.range,
    yearFirst: true,
    weekStart: 0,
    locale: attrs.locale || dateFnsLocale,
    formats: {
      input: fmt,
      preview: fmt,
    },
    floating: { arrow: false, offset: 12 },
    // 모드별 설정
    multiCalendars: isRange ? 2 : undefined,
    timePicker: props.preset === 'time',
    monthPicker: props.preset === 'month',
    yearPicker: props.preset === 'year',

    // v12: timeConfig 객체로 시간 선택 활성화
    timeConfig: {
      enableTimePicker: props.preset === 'datetime' || props.preset === 'time',
    },
  }
})
const isAutoApply = computed(() => {
  // auto-apply 또는 autoApply 속성 모두 지원
  if ('auto-apply' in attrs || 'autoApply' in attrs) return true
  const value = attrs['auto-apply'] ?? attrs['autoApply']
  if (value === '' || value === true || value === 'true') return true
  return false
})

function getDefaultFormat(preset) {
  switch (preset) {
    case 'datetime':
      return 'yyyy-MM-dd HH:mm'
    case 'time':
      return 'HH:mm'
    case 'month':
      return 'yyyy-MM'
    case 'year':
      return 'yyyy'
    default:
      return 'yyyy-MM-dd'
  }
}

function handleOpen() {
  emit('open')
}

function handleClosed() {
  emit('closed')
}

function handleInputFocus(orig, e) {
  if (typeof orig === 'function') orig(e)
}

// Range 모드: 날짜 범위 단축 선택 함수
function selectPrev(days) {
  const today = new Date()
  const prevDate = new Date(today)
  prevDate.setDate(today.getDate() - days)

  innerValue.value = [prevDate, today]
  if (isAutoApply.value) {
    dpRef.value?.closeMenu()
  }
}
</script>
