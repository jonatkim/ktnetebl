<template>
  <div :class="['code-block', { 'code-block--dark': dark }]" class="language-${language}">
    <button
      type="button"
      class="copy"
      :class="{ copied }"
      :title="copied ? '복사됨!' : '복사'"
      @click="copyCode"
    />
    <span class="lang">{{ language }}</span>
    <div
      class="code-block__content"
      :style="maxHeight ? { maxHeight, overflowY: 'auto' } : {}"
      v-html="highlightedCode"
    />
  </div>
</template>

<script setup>
import { codeToHtml } from 'shiki'

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'javascript',
  },
  dark: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: String,
    default: '',
  },
})

const theme = computed(() => (props.dark ? 'github-dark' : 'github-light'))

const toastStore = typeof useToastStore === 'function' ? useToastStore() : null
const copied = ref(false)
const highlightedCode = ref('')

// 코드 하이라이팅 함수
const highlightCode = async (code) => {
  try {
    highlightedCode.value = await codeToHtml(code, {
      lang: props.language,
      theme: theme.value,
    })
  } catch (e) {
    console.error('Shiki highlighting error:', e)
    highlightedCode.value = `<pre>${escapeHtml(code)}</pre>`
  }
}

// 초기 로드
onMounted(async () => {
  await highlightCode(props.code)
})

// code prop이 변경되면 재하이라이팅
watch(
  () => props.code,
  async (newCode) => {
    await highlightCode(newCode)
  },
)

// 복사 기능 (폴백 지원)
const copyCode = async () => {
  if (typeof window === 'undefined') return

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.code)
      onCopySuccess()
      return
    }
    // Clipboard API 미지원 시 폴백
    copyCodeFallback(props.code)
    onCopySuccess()
  } catch (e) {
    console.warn('Clipboard API failed, using fallback:', e)
    try {
      copyCodeFallback(props.code)
      onCopySuccess()
    } catch (err) {
      onCopyError(err || e)
    }
  }
}

// 폴백: execCommand를 사용한 복사
const copyCodeFallback = (text) => {
  const textarea = document.createElement('textarea')
  const activeElement = document.activeElement

  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.contain = 'strict'
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  textarea.style.fontSize = '12pt'

  const selection = document.getSelection()
  const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  document.body.appendChild(textarea)
  textarea.select()
  textarea.selectionStart = 0
  textarea.selectionEnd = text.length

  try {
    document.execCommand('copy')
  } catch (err) {
    console.error('Fallback copy failed:', err)
    throw err
  }

  document.body.removeChild(textarea)

  // 이전 선택 상태 복구
  if (range && selection) {
    selection.removeAllRanges()
    selection.addRange(range)
  }

  // 이전 포커스 복구
  if (activeElement) {
    activeElement.focus()
  }
}

const onCopySuccess = () => {
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1600)

  if (toastStore) {
    toastStore.add({ text: '코드가 복사되었습니다.', type: 'success', timeout: 2000 })
  }
}

const onCopyError = (err) => {
  if (toastStore) {
    toastStore.add({
      text: '복사에 실패했습니다. 수동으로 복사해 주세요.',
      type: 'error',
      timeout: 3000,
    })
  }
  console.error('Copy failed:', err)
}

const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
</script>

<style lang="scss" scoped>
.code-block {
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background: #fff;
  margin: 0;
  overflow: hidden;

  &--dark {
    background: #24292e;
    border-color: rgba(255, 255, 255, 0.12);

    .code-block__content {
      background: #24292e;
    }

    .lang {
      color: #8b949e;
    }
  }

  &:hover {
    .copy {
      opacity: 1;
    }
    .lang {
      opacity: 0;
    }
  }

  .copy {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    opacity: 0;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>')
      center / 18px no-repeat;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 1;

    &:hover {
      border-color: #1976d2;
      background-color: rgba(25, 118, 210, 0.08);
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%231976d2" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>');
    }

    &:active {
      transform: scale(0.95);
    }

    &.copied {
      opacity: 1;
      border-color: #4caf50;
      background-color: rgba(76, 175, 80, 0.08);
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%234caf50" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>');
    }
  }

  .lang {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    pointer-events: none;
  }

  &__content {
    padding: 12px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.5;

    // // Shiki가 생성한 pre/code 태그 스타일 리셋
    // :deep(pre) {
    //   background: transparent !important;
    //   padding: 0 !important;
    //   margin: 0 !important;
    //   border: none !important;
    //   overflow: visible !important;
    //   font-family: 'Courier New', 'Monaco', monospace !important;
    //   font-size: 13px !important;
    //   line-height: 1.6 !important;
    // }

    // :deep(code) {
    //   background: transparent !important;
    //   padding: 0 !important;
    //   border: none !important;
    //   font-family: 'Courier New', 'Monaco', monospace !important;
    //   color: inherit !important;
    // }

    // // Shiki 토큰 스타일 유지
    // :deep(span) {
    //   font-style: inherit;
    //   font-weight: inherit;
    // }
  }
}
</style>
