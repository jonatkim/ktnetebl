<template>
  <button
    :class="[
      'ebl-btn',
      sizeClass,
      `ebl-btn--${props.color}`,
      {
        'ebl-btn--outlined': props.outlined,
        'ebl-btn--icon': isIcon,
        'ebl-btn--disabled': props.disabled,
        'ebl-btn--text': props.text,
        'ebl-btn--block': props.block,
        'ebl-btn--pill': props.pill,
      },
    ]"
    :disabled="props.disabled"
    :style="buttonStyle"
    @click="onClick"
  >
    <!-- 아이콘 버튼: string이면 아이콘만, true면 default slot만 -->
    <template v-if="isIcon">
      <div class="ebl-btn__content">
        <template v-if="typeof props.icon === 'string' && props.icon">
          <VIcon :icon="props.icon" />
        </template>
        <template v-else>
          <slot />
        </template>
      </div>
    </template>
    <template v-else>
      <div v-if="$slots.prepend || prependIcon" class="ebl-btn__prepend">
        <slot name="prepend">
          <VIcon v-if="prependIcon" :icon="prependIcon" />
        </slot>
      </div>
      <div class="ebl-btn__content">
        <slot />
      </div>
      <div v-if="$slots.append || appendIcon" class="ebl-btn__append">
        <slot name="append">
          <VIcon v-if="appendIcon" :icon="appendIcon" />
        </slot>
      </div>
    </template>
  </button>
</template>

<script setup>
// 주요 버튼 프롭 정의
const props = defineProps({
  small: { type: Boolean, default: false },
  large: { type: Boolean, default: false },
  outlined: { type: Boolean, default: false },
  text: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  color: { type: String, default: 'subtle' },
  prependIcon: { type: String, default: '' },
  appendIcon: { type: String, default: '' },
  icon: { type: [Boolean, String], default: false },
  pill: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  height: { type: [String, Number], default: '' },
})

const emit = defineEmits(['click'])

const isIcon = computed(() => {
  return props.icon !== false && props.icon !== null && props.icon !== ''
})
const sizeClass = computed(() => {
  if (props.small) return 'ebl-btn--small'
  if (props.large) return 'ebl-btn--large'
  return 'ebl-btn--medium'
})

const buttonStyle = computed(() => {
  if (props.height === '' || props.height === null || props.height === undefined) return undefined
  const heightValue = typeof props.height === 'number' ? `${props.height}px` : props.height
  return { height: heightValue }
})

function onClick(e) {
  if (!props.disabled) emit('click', e)
}
</script>
