<template>
  <Teleport to="body">
    <!-- 팝업 배경 및 컨테이너 -->
    <div 
      v-if="isOpen" 
      class="layer-popup-mask"
      @click.self="closePopup"
    >
      <div
        ref="popupRef"
        class="layer-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="json-popup-title"
        aria-describedby="json-popup-desc"
        tabindex="-1"
        @keydown.esc="closePopup"
      >
        <!-- 팝업 헤더 -->
        <div class="layer-popup__header">
          <h2 id="json-popup-title" class="layer-popup__title">
            JSON 소스 원본 보기
          </h2>
          <button 
            type="button" 
            class="layer-popup__close-btn" 
            aria-label="팝업 닫기"
            @click="closePopup"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <!-- 팝업 본문 -->
        <div id="json-popup-desc" class="layer-popup__body">
          <p class="sr-only">아래 트리 구조를 통해 JSON 데이터 소스를 확인할 수 있습니다.</p>
          
          <!-- SSR 방지를 위한 ClientOnly 처리 -->
          <ClientOnly fallback="데이터를 불러오는 중입니다...">
            <JsonViewer 
              :value="jsonData" 
              copyable 
              boxed 
              sort 
              theme="light" 
              :expanded="true"
            />
          </ClientOnly>
        </div>

        <!-- 팝업 푸터 -->
        <div class="layer-popup__footer">
          <button 
            type="button" 
            class="btn btn--primary" 
            @click="closePopup"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  jsonData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:isOpen', 'close'])

const popupRef = ref(null)
let previousActiveElement = null

// 팝업 열림/닫힘에 따른 접근성 초점 제어
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    // 팝업 열릴 때 기존 포커스 요소 저장 후 팝업으로 초점 이동
    previousActiveElement = document.activeElement
    await nextTick()
    popupRef.value?.focus()
    document.body.style.overflow = 'hidden' // 배경 스크롤 방지
  } else {
    // 팝업 닫힐 때 이전 요소로 초점 복구
    document.body.style.overflow = ''
    if (previousActiveElement) {
      previousActiveElement.focus()
    }
  }
})

const closePopup = () => {
  emit('update:isOpen', false)
  emit('close')
}
</script>

<style lang="scss" scoped>
/* 프로젝트 SCSS 가이드라인에 맞춘 기본 스타일 예시 */
.layer-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.layer-popup {
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  outline: none;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }

  &__close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 4px;
  }

  &__body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }

  &__footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

/* 스크린 리더 전용 (접근성 필수 클래스) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>