<template>
  <div :class="['ebl-toast-container', `ebl-toast-container--${position}`]">
    <TransitionGroup name="toast" tag="div" :class="['ebl-toast-wrapper', `ebl-toast-wrapper--${position}`]" :move-class="null">
      <div
        v-for="item in toastItems"
        :key="item.id"
        :class="['ebl-toast', `ebl-toast--${getToastType(item)}`]"
        :style="getToastStyle(item)"
      >
        <div class="ebl-toast__content">
          <VIcon v-if="iconMap[getToastType(item)]" :icon="iconMap[getToastType(item)]" :size="20" />
          <span class="ebl-toast__text">{{ item.text }}</span>
        </div>
        <EblBtn
          icon="mdi-close"
          @click="toastStore.remove(item.id)" color="ghost" small
          class="ebl-toast__close"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
const toastStore = useToastStore()
const position = computed(() => toastStore.position || 'bottom')

const iconMap = {
  success: 'ebli:success',
  error: 'ebli:error',
  warning: 'ebli:warning',
  info: 'ebli:information',
}

// 우선순위: type > backgroundColor, color
const getToastType = (item) => {
  return item.type || 'default'
}

// 커스텀 배경색 및 글자색 적용 (CSS 변수 사용)
const getToastStyle = (item) => {
  const style = {}
  
  // type이 없고 backgroundColor가 있으면 배경색 CSS 변수 설정
  if (!item.type && item.backgroundColor) {
    style['--toast-bg-color'] = item.backgroundColor
    style['--toast-border-color'] = item.backgroundColor
  }
  
  // type이 없고 color가 있으면 글자색 CSS 변수 설정
  if (!item.type && item.color) {
    style['--toast-text-color'] = item.color
  }
  
  return style
}

// 타임아웃 처리를 computed로 간소화
const toastItems = computed(() => {
  toastStore.queue.forEach((item) => {
    if (!item.timeoutId && item.timeout !== 0) {
      // timeout이 0이면 자동 닫힘 없음, 닫기 버튼으로만 제거
      item.timeoutId = setTimeout(() => {
        toastStore.remove(item.id)
      }, item.timeout || 4000)
    }
  })
  return toastStore.queue
})

onUnmounted(() => {
  toastStore.queue.forEach((item) => {
    if (item.timeoutId) {
      try {
        clearTimeout(item.timeoutId)
      } catch {}
    }
  })
})
</script>