<template>
  <div
    class="ebl-folder-item"
    :class="{ 'is-add': isAdd, 'is-active': isActive }"
    @click="onClickFolder"
  >
    <EblBtn
      v-if="hasRemove"
      class="ebl-folder-item__remove"
      icon
      pill
      small
      color="tertiary"
      @click.stop="onClickRemove"
    >
      <VIcon icon="ebli:close" :size="14" />
    </EblBtn>
    <div v-if="!isAdd" class="ebl-folder-item__count">
      <span>{{ filesCount }}</span>
    </div>

    <div class="ebl-folder-item__contents">
      <div v-if="isAdd" class="ebl-folder-item__add">
        <VIcon icon="ebli:plus" :size="13" />
      </div>
      <div v-else class="ebl-folder-item__icon">
        <img src="~/assets/images/common/folder.png" :alt="`${name} folder`" />
      </div>
      <div class="ebl-folder-item__name">{{ name }}</div>
    </div>
    <v-overlay :model-value="isLoading" scrim="white" class="align-center justify-center" contained>
      <v-progress-circular indeterminate color="primary" />
    </v-overlay>
  </div>
</template>

<script setup>
const emit = defineEmits(['click', 'add', 'remove'])

const props = defineProps({
  files: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    default: '',
  },
  isAdd: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  hasRemove: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const filesCount = computed(() => props.files?.length || 0)

const onClickFolder = () => {
  if (props.isAdd) {
    emit('add')
    return
  }
  emit('click')
}

const onClickRemove = () => {
  emit('remove')
}
</script>
