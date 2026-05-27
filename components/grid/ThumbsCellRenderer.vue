<template>
  <div class="ebl-thumbs-cell">
    <div class="ebl-thumbs-cell__thumb">
      <img v-if="src" :src="src" :alt="label || 'Thumbnail'" />
      <div v-else class="ebl-thumbs-cell__placeholder">
        <VIcon icon="mdi-image-outline" :size="30" />
      </div>
    </div>
    <span v-if="label" class="ebl-thumbs-cell__label">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
})

const src = computed(() => props.params.data?.thumbImage ?? '')
const label = computed(() => props.params.data?.fileName ?? '')
</script>
