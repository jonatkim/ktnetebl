<template>
  <div class="pub-guide-layout">
    <h2>EblTextarea 커스텀 가이드</h2>
    <p class="guide-subtitle">텍스트 영역 입력 필드 컴포넌트</p>

    <!-- 기본 사용법 -->
    <h3>기본 사용법</h3>
    <div class="pub-preview pub-preview--wrap pub-preview--2col">
      <div class="pub-preview__preview">
        <EblTextarea v-model="basicValue" placeholder="텍스트를 입력하세요" />
      </div>
      <div class="pub-preview__code">
        <CodeBlock :code="basicCode" language="vue" dark />
      </div>
    </div>

    <!-- 문자 제한 -->
    <h3>문자 제한 (Counter)</h3>
    <div class="pub-preview pub-preview--wrap pub-preview--2col">
      <div class="pub-preview__preview">
        <EblTextarea
          v-model="counterValue"
          placeholder="최대 50자"
          :maxlength="50"
          counter
          helper-text="최대 50자까지 입력 가능합니다"
        />
      </div>
      <div class="pub-preview__code">
        <CodeBlock :code="counterCode" language="vue" dark />
      </div>
    </div>

    <!-- 에러 상태 -->
    <h3>에러 상태</h3>
    <div class="pub-preview pub-preview--wrap pub-preview--2col">
      <div class="pub-preview__preview">
        <EblTextarea
          v-model="errorValue"
          placeholder="에러 상태"
          error-message="입력 형식이 올바르지 않습니다"
        />
      </div>
      <div class="pub-preview__code">
        <CodeBlock :code="errorCode" language="vue" dark />
      </div>
    </div>

    <!-- 비활성화 -->
    <h3>비활성화 (Disabled)</h3>
    <div class="pub-preview pub-preview--wrap pub-preview--2col">
      <div class="pub-preview__preview">
        <EblTextarea
          v-model="disabledValue"
          placeholder="비활성화됨"
          disabled
          helper-text="이 필드는 비활성화되어 있습니다"
        />
      </div>
      <div class="pub-preview__code">
        <CodeBlock :code="disabledCode" language="vue" dark />
      </div>
    </div>

    <!-- 읽기 전용 -->
    <h3>읽기 전용 (Readonly)</h3>
    <div class="pub-preview pub-preview--wrap pub-preview--2col">
      <div class="pub-preview__preview">
        <EblTextarea v-model="readonlyValue" readonly helper-text="이 내용은 수정할 수 없습니다" />
      </div>
      <div class="pub-preview__code">
        <CodeBlock :code="readonlyCode" language="vue" dark />
      </div>
    </div>

    <!-- Props 설명 -->
    <PubPropsSection :props="textareaPropsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

const basicValue = ref('')
const counterValue = ref('')
const errorValue = ref('이것은 에러입니다')
const disabledValue = ref('비활성화된 텍스트')
const readonlyValue = ref('이 내용은 읽기만 가능합니다')

const basicCode = `<EblTextarea
  v-model="value"
  placeholder="텍스트를 입력하세요"
/>`

const counterCode = `<EblTextarea
  v-model="value"
  placeholder="최대 50자"
  :maxlength="50"
  counter
  helper-text="최대 50자까지 입력 가능합니다"
/>`

const errorCode = `<EblTextarea
  v-model="value"
  placeholder="에러 상태"
  error-message="입력 형식이 올바르지 않습니다"
/>`

const disabledCode = `<EblTextarea
  v-model="value"
  placeholder="비활성화됨"
  disabled
  helper-text="이 필드는 비활성화되어 있습니다"
/>`

const readonlyCode = `<EblTextarea
  v-model="value"
  readonly
  helper-text="이 내용은 수정할 수 없습니다"
/>`

const textareaPropsData = [
  { name: 'modelValue', type: 'String | Number', default: "''", desc: 'v-model 양방향 바인딩' },
  { name: 'placeholder', type: 'String', default: "''", desc: '플레이스홀더 텍스트' },
  { name: 'rows', type: 'Number', default: '4', desc: '텍스트 영역 행 수' },
  { name: 'maxlength', type: 'String | Number', default: 'undefined', desc: '최대 입력 길이' },
  { name: 'counter', type: 'Boolean | Number', default: 'false', desc: '문자 제한 표시' },
  { name: 'helperText', type: 'String', default: "''", desc: '도움말 텍스트' },
  { name: 'errorMessage', type: 'String', default: "''", desc: '에러 메시지' },
  { name: 'disabled', type: 'Boolean', default: 'false', desc: '비활성화 상태' },
  { name: 'readonly', type: 'Boolean', default: 'false', desc: '읽기 전용 상태' },
]
</script>

<style scoped lang="scss"></style>
