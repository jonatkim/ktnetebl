<template>
  <div class="device-mismatch">
    <h1>접근 환경이 맞지 않습니다</h1>
    <p>
      요청하신 화면은
      <strong>{{ expectedLabel }}</strong>
      환경에서만 접근할 수 있습니다.
    </p>
    <p class="muted">요청 경로: {{ fromPath }}</p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'blank' })

const route = useRoute()
const fromPath = computed(() => String(route.query.from || ''))
const expectedLabel = computed(() => (route.query.expect === 'mo' ? '모바일' : 'PC'))
</script>

<style scoped>
.device-mismatch {
  max-width: 720px;
  padding: 32px;
}
.muted {
  opacity: 0.6;
}
</style>
