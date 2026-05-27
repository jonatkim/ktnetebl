<template>
  <div class="pub-guide-layout">
    <h2>EblSwitch 가이드</h2>
    <p class="guide-subtitle">스위치 컴포넌트입니다</p>

    <div class="pub-preview pub-preview--wrap">
      <!-- 기본 사용 -->
      <div class="example-section">
        <h3>기본 사용</h3>
        <div class="example-box">
          <div class="component-row">
            <EblSwitch v-model="basicSwitch" label="기본 스위치" />
          </div>
        </div>
        <CodeBlock :code="basicExample" language="vue" max-height="200px" />
      </div>

      <!-- 크기 -->
      <div class="example-section">
        <h3>크기 (Size)</h3>
        <div class="example-box">
          <div class="component-row">
            <EblSwitch v-model="sizeSwitch" size="sm" label="Small" />
            <EblSwitch v-model="sizeSwitch" size="md" label="Medium" />
            <EblSwitch v-model="sizeSwitch" size="lg" label="Large" />
          </div>
        </div>
        <CodeBlock :code="sizeExample" language="vue" max-height="200px" />
      </div>

      <!-- 색상 -->
      <div class="example-section">
        <h3>색상 (Color)</h3>
        <div class="example-box">
          <div class="component-grid--auto-md">
            <EblSwitch v-model="colorSwitch1" color="primary" label="Primary" />
            <EblSwitch v-model="colorSwitch2" color="blue" label="Blue" />
            <EblSwitch v-model="colorSwitch3" color="red" label="Red" />
            <EblSwitch v-model="colorSwitch4" color="mint" label="Mint" />
            <EblSwitch v-model="colorSwitch5" color="amber" label="Amber" />
            <EblSwitch v-model="colorSwitch6" color="pink" label="Pink" />
            <EblSwitch v-model="colorSwitch7" color="violet" label="Violet" />
            <EblSwitch v-model="colorSwitch8" color="black" label="Black" />
          </div>
        </div>
        <CodeBlock :code="colorExample" language="vue" max-height="250px" />
      </div>

      <!-- 비활성화 -->
      <div class="example-section">
        <h3>비활성화</h3>
        <div class="example-box">
          <div class="component-row">
            <EblSwitch v-model="disabledSwitch1" label="Enabled" />
            <EblSwitch :model-value="false" disabled label="Disabled Off" />
            <EblSwitch :model-value="true" disabled label="Disabled On" />
          </div>
        </div>
        <CodeBlock :code="disabledExample" language="vue" max-height="200px" />
      </div>

      <!-- 레이블 없이 -->
      <div class="example-section">
        <h3>레이블 없이</h3>
        <div class="example-box">
          <div class="component-row">
            <EblSwitch v-model="noLabelSwitch1" />
            <EblSwitch v-model="noLabelSwitch2" color="blue" />
            <EblSwitch v-model="noLabelSwitch3" color="red" />
          </div>
        </div>
        <CodeBlock :code="noLabelExample" language="vue" max-height="200px" />
      </div>
    </div>

    <!-- Props 설명 -->
    <PubPropsSection :props="switchPropsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

const basicSwitch = ref(false)
const sizeSwitch = ref(true)
const colorSwitch1 = ref(true)
const colorSwitch2 = ref(true)
const colorSwitch3 = ref(true)
const colorSwitch4 = ref(true)
const colorSwitch5 = ref(true)
const colorSwitch6 = ref(true)
const colorSwitch7 = ref(true)
const colorSwitch8 = ref(true)
const disabledSwitch1 = ref(true)
const noLabelSwitch1 = ref(false)
const noLabelSwitch2 = ref(true)
const noLabelSwitch3 = ref(false)

const switchPropsData = [
  {
    name: 'modelValue',
    type: 'Boolean',
    default: 'false',
    desc: 'v-model 바인딩 값',
  },
  {
    name: 'label',
    type: 'String',
    default: '',
    desc: '스위치 레이블',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '비활성화 상태',
  },
  {
    name: 'color',
    type: 'String',
    default: 'primary',
    desc: '색상: primary, blue, red, mint, amber, pink, violet, black',
  },
  {
    name: 'size',
    type: 'String',
    default: 'md',
    desc: '크기: sm, md, lg',
  },
]

const basicExample = `<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
const checked = ref(false)
<\/script>

<template>
  <EblSwitch v-model="checked" label="기본 스위치" />
</template>`

const sizeExample = `<EblSwitch v-model="checked" size="sm" label="Small" />
<EblSwitch v-model="checked" size="md" label="Medium" />
<EblSwitch v-model="checked" size="lg" label="Large" />`

const colorExample = `<EblSwitch v-model="checked" color="primary" label="Primary" />
<EblSwitch v-model="checked" color="blue" label="Blue" />
<EblSwitch v-model="checked" color="red" label="Red" />
<EblSwitch v-model="checked" color="mint" label="Mint" />
<EblSwitch v-model="checked" color="amber" label="Amber" />
<EblSwitch v-model="checked" color="pink" label="Pink" />
<EblSwitch v-model="checked" color="violet" label="Violet" />
<EblSwitch v-model="checked" color="black" label="Black" />`

const disabledExample = `<EblSwitch v-model="checked" label="Enabled" />
<EblSwitch :model-value="false" disabled label="Disabled Off" />
<EblSwitch :model-value="true" disabled label="Disabled On" />`

const noLabelExample = `<EblSwitch v-model="checked1" />
<EblSwitch v-model="checked2" color="blue" />
<EblSwitch v-model="checked3" color="red" />`
</script>

<style scoped lang="scss"></style>

