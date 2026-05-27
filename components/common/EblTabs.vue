<template>
  <div ref="rootRef" class="ebl-tabs" :class="tabsClass" :style="tabStyle" role="tablist">
    <button
      v-for="(item, idx) in items"
      :key="item.value ?? idx"
      :ref="(el) => setTabRef(el, idx)"
      class="ebl-tab"
      :class="[
        `ebl-tab--${size}`,
        variantClass,
        {
          'is-active': activeValue === item.value,
          'is-disabled': item.disabled,
          'is-stretch': stretch,
        },
      ]"
      :disabled="item.disabled"
      role="tab"
      :aria-selected="activeValue === item.value"
      @click="onSelect(item)"
    >
      <slot name="tab" :item="item" :active="activeValue === item.value" :index="idx">
        <span class="ebl-tab__inner">
          <span v-if="item.icon" class="ebl-tab__icon">
            <VIcon :icon="item.icon" :size="sizeIcon" />
          </span>
          <span class="ebl-tab__label">
            <span class="ebl-tab__title">{{ item.label }}</span>
            <small v-if="item.subtitle" class="ebl-tab__subtitle">{{ item.subtitle }}</small>
          </span>
        </span>
      </slot>
    </button>

    <!-- indicator는 항상 렌더링, 측정 전에는 opacity로 숨김 -->
    <div
      :class="['ebl-tabs__indicator', `ebl-tabs__indicator--${props.variant}`]"
      :style="indicatorStyle"
      aria-hidden="true"
    />
  </div>
</template>

<script setup>
/**
 * EblTabs
 * - indicator는 active tab의 DOMRect 기준으로 이동/크기 변경
 * - "watch로 그려짐 추측" 대신: ResizeObserver로 실제 레이아웃 변화에 반응
 *   1) root RO: 레이아웃/반응형/부모 변화 감지
 *   2) active button RO: 라벨/뱃지/아이콘/폰트 로딩 등으로 active 버튼 크기 변동 감지
 * - watch는 최소(활성 변경, items 변경)만 유지
 */

const props = defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: [String, Number, Object], default: null },
  variant: {
    type: String,
    default: 'line', // 'line' | 'pill'
    validator: (v) => ['line', 'pill'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  align: {
    type: String,
    default: 'start', // start | center | end
    validator: (v) => ['start', 'center', 'end'].includes(v),
  },
  color: { type: String, default: null },
  stretch: { type: Boolean, default: false },
  noWrap: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const rootRef = ref(null)
const tabRefs = ref([]) // v-for 버튼 DOM refs
const indicator = reactive({ left: 0, width: 0, top: 0, height: 0 })

/** modelValue가 없으면 첫 아이템을 active로 */
const activeValue = computed(() => {
  if (props.modelValue !== null && props.modelValue !== undefined) return props.modelValue
  return props.items[0]?.value ?? null
})

const tabsClass = computed(() => [
  `ebl-tabs--${props.variant}`,
  `ebl-tabs--${props.align}`,
  props.noWrap ? 'ebl-tabs--nowrap' : '',
])
const variantClass = computed(() => `ebl-tab--${props.variant}`)

const tabStyle = computed(() => ({
  ...(props.color
    ? {
        '--ebl-tab-color': props.color,
        '--ebl-tab-underline': props.color,
        '--ebl-tab-bg': toRgba(props.color, 0.1),
      }
    : {}),
}))

const sizeIcon = computed(() => (props.size === 'sm' ? 14 : props.size === 'lg' ? 18 : 16))

/** indicator 스타일: line은 X만, pill은 X/Y + height */
const indicatorStyle = computed(() => {
  const base = {
    width: `${indicator.width}px`,
    opacity: indicator.width ? 1 : 0,
  }

  if (props.variant === 'pill') {
    return {
      ...base,
      transform: `translate(${indicator.left}px, ${indicator.top}px)`,
      height: `${indicator.height}px`,
      backgroundColor: 'var(--bg-surface-normal, #fff)',
    }
  }

  return {
    ...base,
    transform: `translateX(${indicator.left}px)`,
    height: '2px',
    backgroundColor:
      props.color || 'var(--ebl-tab-underline, var(--border-accent-darkneutral, #121a26))',
  }
})

const onSelect = (item) => {
  if (item.disabled) return
  emit('update:modelValue', item.value)
  emit('change', item.value)
}

/** v-for ref 콜백: ref([]) 이므로 반드시 .value에 저장 */
const setTabRef = (el, idx) => {
  if (!el) return
  tabRefs.value[idx] = el
}

/** v-for 변경 시 이전 ref 잔존 방지 */
onBeforeUpdate(() => {
  tabRefs.value = []
})
/**
 * color 값을 rgba 문자열로 변환
 * @param {string} color - hex | rgb | rgba
 * @param {number} alpha - 0 ~ 1 (기본 1)
 */
const toRgba = (color, alpha = 1) => {
  if (!color) return null

  // 이미 rgba면 alpha만 교체
  if (color.startsWith('rgba')) {
    return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, (_, r, g, b) => {
      return `rgba(${r.trim()}, ${g.trim()}, ${b.trim()}, ${alpha})`
    })
  }

  // rgb → rgba
  if (color.startsWith('rgb')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
  }

  // hex 처리 (#RGB, #RRGGBB)
  if (color.startsWith('#')) {
    let hex = color.replace('#', '')

    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('')
    }

    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
  }

  // 그 외(color name 등)는 그대로 반환
  return color
}
const raf = () => new Promise((r) => requestAnimationFrame(r))

/**
 * active 탭을 측정해 indicator 업데이트
 * - nextTick: Vue 렌더 반영 대기
 * - rAF: 브라우저 레이아웃 타이밍 보정
 * - 0 사이즈면 1회만 재시도 (무한 루프 방지)
 */
const updateIndicator = async (retry = 0) => {
  await nextTick()
  await raf()

  const idx = props.items.findIndex((it) => it.value === activeValue.value)
  if (idx < 0) return

  const el = tabRefs.value[idx]
  const root = rootRef.value
  if (!el || !root) return

  const rect = el.getBoundingClientRect()
  const rootRect = root.getBoundingClientRect()

  if ((!rect.width || !rect.height || !rootRect.width || !rootRect.height) && retry < 1) {
    requestAnimationFrame(() => updateIndicator(retry + 1))
    return
  }

  if (!rect.width || !rect.height || !rootRect.width || !rootRect.height) return
  const scrollOffset = props.noWrap ? root.scrollLeft : 0
  indicator.left = rect.left - rootRect.left + scrollOffset
  indicator.width = rect.width
  indicator.top = rect.top - rootRect.top
  indicator.height = rect.height

  if (props.noWrap && typeof el.scrollIntoView === 'function') {
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }
}

/**
 * ResizeObserver (root + active 버튼)
 * - root: 전체 레이아웃 변화 감지
 * - active 버튼: 내부 콘텐츠 변화로 버튼 크기 변경 시 감지
 */
let ro = null
let observedActiveBtn = null

const observeActiveButton = () => {
  if (!ro) return

  const idx = props.items.findIndex((it) => it.value === activeValue.value)
  const btn = idx >= 0 ? tabRefs.value[idx] : null

  // 기존 observe 대상이 바뀌면 교체
  if (observedActiveBtn && observedActiveBtn !== btn) ro.unobserve(observedActiveBtn)
  observedActiveBtn = btn

  if (observedActiveBtn) ro.observe(observedActiveBtn)
}

onMounted(async () => {
  // 웹폰트 사용 시 텍스트 폭 확정 후 측정 안정화
  if (document?.fonts?.ready) {
    await document.fonts.ready
  }

  ro = new ResizeObserver(() => {
    updateIndicator()
  })

  // root observe
  if (rootRef.value) ro.observe(rootRef.value)

  // active 버튼 observe
  observeActiveButton()

  updateIndicator()
})

onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
  observedActiveBtn = null
})

/**
 * watch는 최소화
 * - activeValue 변경: active 버튼 observe 교체 + 재측정
 * - items 변경: ref 재수집 이후(active 버튼 교체 포함) 재측정
 */
watch(
  () => activeValue.value,
  () => {
    observeActiveButton()
    updateIndicator()
  },
  { flush: 'post' },
)

watch(
  () => props.items,
  async () => {
    await nextTick()
    observeActiveButton()
    updateIndicator()
  },
  { deep: true, flush: 'post' },
)

watch(
  () => props.align,
  async () => {
    await nextTick()
    observeActiveButton()
    updateIndicator()
  },
  { flush: 'post' },
)
</script>
