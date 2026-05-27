<template>
  <div class="ebl-avatar-label" :class="sizeClass">
    <!-- Avatar priority: logo > icon > default -->
    <div v-if="logo" class="ebl-avatar-label__avatar" :style="{ '--avatar-bg': avatarBg }">
      <img :src="logo" :width="avatarSize" :height="avatarSize" :alt="title || 'avatar'" />
    </div>
    <div
      v-else
      class="ebl-avatar-label__avatar ebl-avatar-label__avatar--empty"
      :style="{ '--avatar-bg': avatarBg }"
    >
      <VIcon :icon="icon" :size="avatarIconSize" />
    </div>

    <!-- Label Section (Flex 1) -->
    <div class="ebl-avatar-label__label">
      <slot>
        <template v-if="!titleFirst">
          <div v-if="subtitle" class="ebl-avatar-label__subtitle">
            {{ subtitle }}
          </div>
          <div v-if="title" class="ebl-avatar-label__title">
            {{ title }}
          </div>
        </template>
        <template v-else>
          <div v-if="title" class="ebl-avatar-label__title">
            {{ title }}
          </div>
          <div v-if="subtitle" class="ebl-avatar-label__subtitle">
            {{ subtitle }}
          </div>
        </template>
      </slot>
    </div>

    <!-- Utility Slot -->
    <div v-if="$slots.util" class="ebl-avatar-label__util">
      <slot name="util" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  logo: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'ebli:global',
  },
  subtitle: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg', 'x-lg'].includes(val),
  },
  avatarBg: {
    type: String,
    default: 'var(--bg-canvas-normal, #F5F7FA)',
  },
  titleFirst: {
    type: Boolean,
    default: false,
  },
})

const sizeClass = computed(() => `ebl-avatar-label--${props.size}`)

const avatarSize = computed(() => {
  const map = { sm: 32, md: 44, lg: 56, 'x-lg': 72 }
  return map[props.size] || 44
})
const avatarIconSize = computed(() => {
  const map = { sm: 20, md: 27.5, lg: 32, 'x-lg': 40 }
  return map[props.size] || 27.5
})
</script>
