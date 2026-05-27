<template>
  <div class="pub-guide-layout">
    <h2>EblCheckbox 가이드</h2>
    <p class="guide-subtitle">체크박스 컴포넌트입니다</p>

    <div class="pub-preview pub-preview--wrap">
      <!-- 기본 상태 -->
      <div class="example-section">
        <h3>기본 상태</h3>
        <div class="example-box">
          <div class="checkbox-row">
            <EblCheckbox v-model="basic1">Item Label</EblCheckbox>
            <EblCheckbox v-model="basic2">Item Label</EblCheckbox>
            <EblCheckbox v-model="basic3">Item Label</EblCheckbox>
          </div>
          <div class="checkbox-row disabled-row">
            <EblCheckbox disabled>Item Label</EblCheckbox>
            <EblCheckbox disabled :model-value="true">Item Label</EblCheckbox>
            <EblCheckbox disabled :model-value="false">Item Label</EblCheckbox>
          </div>
        </div>
        <CodeBlock :code="basicExample" language="vue" max-height="200px" />
      </div>

      <!-- 색상 변형 -->
      <div class="example-section">
        <h3>색상 - 기본 색상</h3>
        <div class="example-box">
          <div class="checkbox-row">
            <EblCheckbox v-model="color1" color="primary">Primary</EblCheckbox>
            <EblCheckbox v-model="color2" color="subtle">Subtle</EblCheckbox>
            <EblCheckbox v-model="color3" color="inverse">Inverse</EblCheckbox>
            <EblCheckbox v-model="color4" color="ghost">ghost</EblCheckbox>
          </div>
        </div>
        <CodeBlock :code="colorExample" language="vue" max-height="200px" />
      </div>

      <!-- 색상 - 커스텀 -->
      <div class="example-section">
        <h3>색상 - 커스텀 색상</h3>
        <div class="example-box">
          <div class="checkbox-row">
            <EblCheckbox v-model="customColor1" color="#FF6B6B">Red</EblCheckbox>
            <EblCheckbox v-model="customColor2" color="#4ECDC4">Teal</EblCheckbox>
            <EblCheckbox v-model="customColor3" color="#FFE66D">Yellow</EblCheckbox>
            <EblCheckbox v-model="customColor4" color="#95E1D3">Mint</EblCheckbox>
          </div>
          <div class="checkbox-row">
            <EblCheckbox v-model="customColor5" color="#A8D8EA">Sky Blue</EblCheckbox>
            <EblCheckbox v-model="customColor6" color="#AA96DA">Purple</EblCheckbox>
            <EblCheckbox v-model="customColor7" color="#FCBAD3">Pink</EblCheckbox>
            <EblCheckbox v-model="customColor8" color="#FFA502">Orange</EblCheckbox>
          </div>
        </div>
        <CodeBlock :code="customColorExample" language="vue" max-height="200px" />
      </div>

      <!-- Indeterminate (중간 상태) -->
      <div class="example-section">
        <h3>Indeterminate 상태</h3>
        <div class="example-box">
          <div class="checkbox-group">
            <EblCheckbox v-model="parentChecked" :indeterminate="isIndeterminate">
              모두 선택
            </EblCheckbox>
            <div class="checkbox-children">
              <EblCheckbox v-model="child1">항목 1</EblCheckbox>
              <EblCheckbox v-model="child2">항목 2</EblCheckbox>
              <EblCheckbox v-model="child3">항목 3</EblCheckbox>
            </div>
          </div>
        </div>
        <CodeGroup :items="indeterminateCodeItems" />
      </div>

      <!-- 비활성화 -->
      <div class="example-section">
        <h3>비활성화 상태</h3>
        <div class="example-box">
          <div class="checkbox-row">
            <EblCheckbox disabled>Disabled</EblCheckbox>
            <EblCheckbox disabled :model-value="true">Checked & Disabled</EblCheckbox>
            <EblCheckbox disabled color="subtle">Subtle & Disabled</EblCheckbox>
          </div>
        </div>
        <CodeBlock :code="disabledExample" language="vue" max-height="200px" />
      </div>
    </div>

    <!-- Props 설명 -->
    <PubPropsSection :props="checkboxPropsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

const checkboxPropsData = [
  {
    name: 'modelValue',
    type: 'Boolean | null',
    default: 'false',
    desc: '체크 상태 (null은 indeterminate 상태)',
  },
  {
    name: 'color',
    type: 'String',
    default: 'primary',
    desc: '색상: primary, subtle, inverse, ghost',
  },
  { name: 'disabled', type: 'Boolean', default: 'false', desc: '비활성화 상태' },
  {
    name: 'indeterminate',
    type: 'Boolean',
    default: 'false',
    desc: '중간 상태 (모두 선택되지 않은 상태)',
  },
]

// 기본 상태
const basic1 = ref(false)
const basic2 = ref(true)
const basic3 = ref(false)

// 색상 - 기본
const color1 = ref(true)
const color2 = ref(true)
const color3 = ref(true)
const color4 = ref(true)

// 색상 - 커스텀
const customColor1 = ref(true)
const customColor2 = ref(true)
const customColor3 = ref(true)
const customColor4 = ref(true)
const customColor5 = ref(true)
const customColor6 = ref(true)
const customColor7 = ref(true)
const customColor8 = ref(true)

// Indeterminate
const child1 = ref(true)
const child2 = ref(true)
const child3 = ref(false)

const isIndeterminate = computed(() => {
  const checkedCount = [child1.value, child2.value, child3.value].filter(Boolean).length
  return checkedCount > 0 && checkedCount < 3
})

const parentChecked = computed({
  get() {
    return [child1.value, child2.value, child3.value].every(Boolean) ? true : false
  },
  set(val) {
    child1.value = val
    child2.value = val
    child3.value = val
  },
})

// 코드 샘플
const basicExample = `<EblCheckbox v-model="checked">
  Item Label
</EblCheckbox>

<!-- Disabled -->
<EblCheckbox disabled>Item Label</EblCheckbox>
<EblCheckbox disabled :model-value="true">Item Label</EblCheckbox>`

const colorExample = `<EblCheckbox v-model="checked" color="primary">Primary</EblCheckbox>
<EblCheckbox v-model="checked" color="subtle">Subtle</EblCheckbox>
<EblCheckbox v-model="checked" color="inverse">Inverse</EblCheckbox>
<EblCheckbox v-model="checked" color="ghost">ghost</EblCheckbox>`

const customColorExample = `<!-- 16진수 색상 사용 -->
<EblCheckbox v-model="checked" color="#FF6B6B">Red</EblCheckbox>
<EblCheckbox v-model="checked" color="#4ECDC4">Teal</EblCheckbox>
<EblCheckbox v-model="checked" color="#FFE66D">Yellow</EblCheckbox>
<EblCheckbox v-model="checked" color="#95E1D3">Mint</EblCheckbox>

<!-- RGB 색상도 사용 가능 -->
<EblCheckbox v-model="checked" color="rgb(168, 216, 234)">Sky Blue</EblCheckbox>
<EblCheckbox v-model="checked" color="rgb(170, 150, 218)">Purple</EblCheckbox>`

const indeterminateCodeItems = [
  {
    title: 'Template',
    code: `<div class="checkbox-group">
  <EblCheckbox v-model="parentChecked" :indeterminate="isIndeterminate">
    모두 선택
  </EblCheckbox>
  <div class="checkbox-children">
    <EblCheckbox v-model="child1">항목 1</EblCheckbox>
    <EblCheckbox v-model="child2">항목 2</EblCheckbox>
    <EblCheckbox v-model="child3">항목 3</EblCheckbox>
  </div>
</div>`,
    language: 'vue',
  },
  {
    title: 'Script',
    code: `// Indeterminate 상태 계산
const child1 = ref(true)
const child2 = ref(true)
const child3 = ref(false)

// 일부만 선택된 상태인지 판단
const isIndeterminate = computed(() => {
  const checkedCount = [child1.value, child2.value, child3.value].filter(Boolean).length
  return checkedCount > 0 && checkedCount < 3
})

// 부모 체크박스 상태 관리
const parentChecked = computed({
  get() {
    return [child1.value, child2.value, child3.value].every(Boolean) ? true : false
  },
  set(val) {
    child1.value = val
    child2.value = val
    child3.value = val
  },
})`,
    language: 'javascript',
  },
]

const disabledExample = `<EblCheckbox disabled>Disabled</EblCheckbox>
<EblCheckbox disabled :model-value="true">Checked & Disabled</EblCheckbox>
<EblCheckbox disabled color="subtle">Subtle & Disabled</EblCheckbox>`
</script>

