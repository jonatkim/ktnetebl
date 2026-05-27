<template>
  <div
    class="ebl-bl-no ebl-bl-no--wrap"
    :class="{
      'ebl-bl-no--empty': !currentNo,
      'ebl-bl-no--small': small,
      'ebl-bl-no--disabled': disabled,
    }"
    @click="onClickBlNo"
  >
    <template v-if="!currentNo">
      <div class="ebl-bl-no__empty">
        <VIcon icon="ebli:search" :size="20" />
        <span>select a B/L</span>
      </div>
    </template>
    <template v-else>
      <div class="ebl-bl-no__label">
        <div class="ebl-bl-no__no">{{ currentNo }}</div>
        <div v-if="badges.length">
          <EblBadge
            v-for="(badge, index) in badges"
            :key="index"
            v-tooltip:top="badge?.tooltip"
            variant="tonal"
            :color="badge?.color || 'gray'"
            class="mr-2"
          >
            <VIcon v-if="badge?.icon" :icon="badge.icon" :size="16" />
            {{ badge.value }}
          </EblBadge>
        </div>
      </div>
      <div v-if="refresh" class="ebl-bl-no__util">
        <EblBtn icon pill large :disabled="disabled" @click.stop="$emit('refresh')">
          <VIcon icon="ebli:refresh" :size="20" />
        </EblBtn>
      </div>
    </template>
  </div>
</template>

<script setup>
const emit = defineEmits(['click', 'click-empty', 'refresh', 'update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  no: {
    type: String,
    default: '',
  },
  badges: {
    type: Array,
    default: () => [],
  },
  small: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  refresh: {
    type: Boolean,
    default: false,
  },
})

const currentNo = computed(() => props.modelValue || props.no)

const onClickBlNo = () => {
  if (props.disabled) return
  if (!currentNo.value) {
    emit('click-empty')
    return
  }
  emit('click', currentNo.value)
}
</script>
