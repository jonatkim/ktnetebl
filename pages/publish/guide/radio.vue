<template>
  <div class="pub-guide-layout">
    <h2>EblRadioBtn 가이드</h2>
    <p class="guide-subtitle">라디오 버튼 컴포넌트입니다</p>

    <div class="pub-preview pub-preview--wrap">
      <!-- 기본 상태 -->
      <div class="example-section">
        <h3>기본 상태</h3>
        <div class="example-box">
          <div class="component-row">
            <EblRadioBtn v-model="basicSelected" value="option1" name="basic">Option 1</EblRadioBtn>
            <EblRadioBtn v-model="basicSelected" value="option2" name="basic">Option 2</EblRadioBtn>
            <EblRadioBtn v-model="basicSelected" value="option3" name="basic">Option 3</EblRadioBtn>
          </div>
          <p>선택된 값: {{ basicSelected }}</p>
          <div class="component-row" style="opacity: 0.6">
            <EblRadioBtn disabled value="disabled1" name="disabled">Disabled</EblRadioBtn>
            <EblRadioBtn disabled :model-value="'disabled2'" value="disabled2" name="disabled"
              >Disabled Checked</EblRadioBtn
            >
          </div>
        </div>
        <CodeBlock :code="basicExample" language="vue" max-height="200px" />
      </div>

      <!-- 색상 변형 -->
      <div class="example-section">
        <h3>색상 - 기본 색상</h3>
        <div class="example-box">
          <div class="component-row">
            <EblRadioBtn v-model="colorSelected1" value="primary" name="color1" color="primary"
              >Primary</EblRadioBtn
            >
            <EblRadioBtn v-model="colorSelected1" value="subtle" name="color1" color="subtle"
              >Subtle</EblRadioBtn
            >
            <EblRadioBtn v-model="colorSelected1" value="inverse" name="color1" color="inverse"
              >Inverse</EblRadioBtn
            >
            <EblRadioBtn v-model="colorSelected1" value="ghost" name="color1" color="ghost"
              >ghost</EblRadioBtn
            >
          </div>
          <p>선택된 값: {{ colorSelected1 }}</p>
        </div>
        <CodeBlock :code="colorExample" language="vue" max-height="200px" />
      </div>

      <!-- 색상 - 커스텀 -->
      <div class="example-section">
        <h3>색상 - 커스텀 색상</h3>
        <div class="example-box">
          <div class="component-row">
            <EblRadioBtn v-model="customColorSelected" value="red" name="custom" color="#FF6B6B"
              >Red</EblRadioBtn
            >
            <EblRadioBtn v-model="customColorSelected" value="teal" name="custom" color="#4ECDC4"
              >Teal</EblRadioBtn
            >
            <EblRadioBtn v-model="customColorSelected" value="yellow" name="custom" color="#FFE66D"
              >Yellow</EblRadioBtn
            >
            <EblRadioBtn v-model="customColorSelected" value="mint" name="custom" color="#95E1D3"
              >Mint</EblRadioBtn
            >
          </div>
          <div class="component-row">
            <EblRadioBtn v-model="customColorSelected" value="sky" name="custom" color="#A8D8EA"
              >Sky Blue</EblRadioBtn
            >
            <EblRadioBtn v-model="customColorSelected" value="purple" name="custom" color="#AA96DA"
              >Purple</EblRadioBtn
            >
            <EblRadioBtn v-model="customColorSelected" value="pink" name="custom" color="#FCBAD3"
              >Pink</EblRadioBtn
            >
            <EblRadioBtn v-model="customColorSelected" value="orange" name="custom" color="#FFA502"
              >Orange</EblRadioBtn
            >
          </div>
          <p>선택된 값: {{ customColorSelected }}</p>
        </div>
        <CodeBlock :code="customColorExample" language="vue" max-height="200px" />
      </div>

      <!-- 값 표시 예제 -->
      <div class="example-section">
        <h3>값을 버튼으로 표시</h3>
        <div class="example-box">
          <div class="component-row">
            <EblRadioBtn v-model="buttonValueSelected" value="small" name="size">Small</EblRadioBtn>
            <EblRadioBtn v-model="buttonValueSelected" value="medium" name="size"
              >Medium</EblRadioBtn
            >
            <EblRadioBtn v-model="buttonValueSelected" value="large" name="size">Large</EblRadioBtn>
          </div>
          <div class="display-box--info">
            <p>선택된 크기:</p>
            <EblBtn
              :small="buttonValueSelected === 'small'"
              :large="buttonValueSelected === 'large'"
              color="primary"
            >
              {{ buttonValueSelected || '선택하세요' }}
            </EblBtn>
          </div>
        </div>
        <CodeBlock :code="buttonValueExample" language="vue" max-height="200px" />
      </div>

      <!-- 버튼으로 라디오 선택 -->
      <div class="example-section">
        <h3>버튼으로 라디오 선택</h3>
        <div class="example-box">
          <div class="component-row">
            <EblRadioBtn v-model="buttonControlSelected" value="optionA" name="buttonControl"
              >Option A</EblRadioBtn
            >
            <EblRadioBtn v-model="buttonControlSelected" value="optionB" name="buttonControl"
              >Option B</EblRadioBtn
            >
            <EblRadioBtn v-model="buttonControlSelected" value="optionC" name="buttonControl"
              >Option C</EblRadioBtn
            >
          </div>
          <div class="display-box--info">
            <p>버튼으로 선택:</p>
            <div class="button-row">
              <EblBtn
                :variant="buttonControlSelected === 'optionA' ? 'elevated' : 'outlined'"
                @click="buttonControlSelected = 'optionA'"
              >
                Select A
              </EblBtn>
              <EblBtn
                :variant="buttonControlSelected === 'optionB' ? 'elevated' : 'outlined'"
                @click="buttonControlSelected = 'optionB'"
              >
                Select B
              </EblBtn>
              <EblBtn
                :variant="buttonControlSelected === 'optionC' ? 'elevated' : 'outlined'"
                @click="buttonControlSelected = 'optionC'"
              >
                Select C
              </EblBtn>
            </div>
          </div>
        </div>
        <CodeBlock :code="buttonControlExample" language="vue" max-height="200px" />
      </div>
    </div>

    <!-- Props 설명 -->
    <PubPropsSection :props="radioPropsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })
// PubPropsSection은 Nuxt 자동 컴포넌트 임포트로 사용됩니다.
// (중복) 두 번째 definePageMeta 제거 — 페이지 메타는 하나만 필요합니다.
const basicSelected = ref('option1')
const colorSelected1 = ref('primary')
const customColorSelected = ref('red')
const buttonValueSelected = ref('')
const buttonControlSelected = ref('')

const radioPropsData = [
  {
    name: 'modelValue',
    type: 'String | Number | Boolean',
    default: 'null',
    desc: '선택된 값 (v-model로 바인딩)',
  },
  {
    name: 'value',
    type: 'String | Number | Boolean',
    default: '-',
    desc: '이 라디오 버튼의 값 (필수)',
    required: true,
  },
  {
    name: 'color',
    type: 'String',
    default: 'primary',
    desc: '색상: primary, subtle, inverse, ghost 또는 hex 색상',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '비활성화 상태',
  },
  {
    name: 'name',
    type: 'String',
    default: 'null',
    desc: '라디오 그룹 이름 (동일한 name을 가진 라디오 버튼들이 그룹화됨)',
  },
]

const basicExample = `<div class="radio-row">
  <EblRadioBtn v-model="basicSelected" value="option1" name="group">Option 1</EblRadioBtn>
  <EblRadioBtn v-model="basicSelected" value="option2" name="group">Option 2</EblRadioBtn>
  <EblRadioBtn v-model="basicSelected" value="option3" name="group">Option 3</EblRadioBtn>
</div>`

const colorExample = `<EblRadioBtn v-model="colorSelected1" value="primary" name="color" color="primary">Primary</EblRadioBtn>
<EblRadioBtn v-model="colorSelected1" value="subtle" name="color" color="subtle">Subtle</EblRadioBtn>`

const customColorExample = `<EblRadioBtn v-model="customColorSelected" value="red" name="custom" color="#FF6B6B">Red</EblRadioBtn>
<EblRadioBtn v-model="customColorSelected" value="teal" name="custom" color="#4ECDC4">Teal</EblRadioBtn>`

const buttonValueExample = `<div class="radio-row">
  <EblRadioBtn v-model="buttonValueSelected" value="small" name="size">Small</EblRadioBtn>
  <EblRadioBtn v-model="buttonValueSelected" value="medium" name="size">Medium</EblRadioBtn>
  <EblRadioBtn v-model="buttonValueSelected" value="large" name="size">Large</EblRadioBtn>
</div>

<div class="value-display">
  <p>선택된 크기:</p>
  <EblBtn
    :small="buttonValueSelected === 'small'"
    :large="buttonValueSelected === 'large'"
    color="primary"
  >
    {{ buttonValueSelected || '선택하세요' }}
  </EblBtn>
</div>`

const buttonControlExample = `<div class="radio-row">
  <EblRadioBtn v-model="buttonControlSelected" value="optionA" name="control">Option A</EblRadioBtn>
  <EblRadioBtn v-model="buttonControlSelected" value="optionB" name="control">Option B</EblRadioBtn>
  <EblRadioBtn v-model="buttonControlSelected" value="optionC" name="control">Option C</EblRadioBtn>
</div>

<div class="button-controls">
  <EblBtn
    :variant="buttonControlSelected === 'optionA' ? 'elevated' : 'outlined'"
    @click="buttonControlSelected = 'optionA'"
  >
    Select A
  </EblBtn>
  <EblBtn
    :variant="buttonControlSelected === 'optionB' ? 'elevated' : 'outlined'"
    @click="buttonControlSelected = 'optionB'"
  >
    Select B
  </EblBtn>
  <EblBtn
    :variant="buttonControlSelected === 'optionC' ? 'elevated' : 'outlined'"
    @click="buttonControlSelected = 'optionC'"
  >
    Select C
  </EblBtn>
</div>`
</script>

<style lang="scss" scoped></style>
