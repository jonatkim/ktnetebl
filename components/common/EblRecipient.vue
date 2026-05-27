<template>
  <div
    class="ebl-recipient ebl-recipient--wrap"
    :class="{ 'ebl-recipient--small': small, 'ebl-recipient--disabled': disabled }"
    @click="onClickRecipient"
  >
    <template v-if="!items?.name">
      <div class="ebl-recipient__empty">
        <VIcon icon="ebli:search" :size="20" />
        <span>select a Recipient</span>
      </div>
    </template>
    <template v-else>
      <div v-if="items?.logo" class="ebl-recipient__logo">
        <img :src="items?.logo" alt="logo" />
      </div>
      <div class="ebl-recipient__label">
        <div class="ebl-recipient__name">{{ items?.name }}</div>
        <div class="ebl-recipient__address">{{ items?.address }}</div>
      </div>
      <div v-if="!hideRefresh" class="ebl-recipient__util">
        <EblBtn icon pill large :disabled="disabled" @click.stop="$emit('refresh')">
          <VIcon icon="ebli:refresh" :size="20" />
        </EblBtn>
      </div>
    </template>
  </div>
</template>

<script setup>
const emit = defineEmits(['click', 'click-empty', 'refresh'])

const props = defineProps({
  items: {
    type: Object,
    default: () => ({
      name: '',
      address: '',
      logo: '',
    }),
  },
  small: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideRefresh: {
    type: Boolean,
    default: false,
  },
})

const onClickRecipient = () => {
  if (props.disabled) return
  if (!props.items?.name) {
    emit('click-empty')
    return
  }
  emit('click', props.items)
}
</script>
