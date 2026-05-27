<template>
  <v-overlay v-model="isVisible" persistent :scrim="true" class="align-center justify-center">
    <div class="global-loading__container">
      <Vue3Lottie animationLink="/lottie/loadingSpinner.json" :height="160" :width="320" />
    </div>
  </v-overlay>
</template>

<script setup>
import { useMainStore } from '~/stores/useMainStore'

const main = useMainStore()

const isVisible = computed(() => main.globalLoading)
</script>
