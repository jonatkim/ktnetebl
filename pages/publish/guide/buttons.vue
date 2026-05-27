<template>
  <div class="pub-guide-layout">
    <h2>EblBtn 커스텀 가이드</h2>
    <p class="guide-subtitle">아래에서 버튼 속성을 선택하면 실시간으로 버튼과 코드가 변경됩니다</p>

    <div class="pub-preview pub-preview--wrap pub-preview--2col">
      <!-- 미리보기 -->
      <div class="pub-preview__preview">
        <EblBtn
          :color="buttonProps.color || undefined"
          :outlined="buttonProps.outlined"
          :pill="buttonProps.pill"
          :disabled="buttonProps.disabled"
          :small="buttonProps.size === 'small'"
          :large="buttonProps.size === 'large'"
          :icon="buttonProps.icon"
          :prepend-icon="buttonProps.prependIcon || undefined"
          :append-icon="buttonProps.appendIcon || undefined"
        >
          {{ buttonText }}
        </EblBtn>
      </div>

      <!-- 속성 설정 -->
      <div class="pub-preview__controls">
        <!-- 텍스트 -->
        <div class="control-group">
          <label>버튼 텍스트</label>
          <input
            v-model="buttonText"
            type="text"
            placeholder="버튼 텍스트 입력"
            class="control-input"
          />
        </div>

        <!-- 색상 셀렉트 박스 -->
        <div class="control-group">
          <label>색상</label>
          <select v-model="buttonProps.color" class="control-input">
            <option v-for="color in colors" :key="color" :value="color === 'default' ? '' : color">
              {{ color }}
            </option>
          </select>
        </div>

        <!-- 크기 셀렉트 박스 -->
        <div class="control-group">
          <label>크기</label>
          <select v-model="buttonProps.size" class="control-input">
            <option v-for="size in sizes" :key="size" :value="size === 'medium' ? '' : size">
              {{ size }}
            </option>
          </select>
        </div>

        <!-- 추가 옵션 체크 박스 -->
        <div class="control-group">
          <label>추가 옵션</label>
          <div class="control-toggles">
            <label class="control-checkbox">
              <input v-model="buttonProps.outlined" type="checkbox" />
              <span>Outlined</span>
            </label>
            <label class="control-checkbox">
              <input v-model="buttonProps.pill" type="checkbox" />
              <span>Pill</span>
            </label>
            <label class="control-checkbox">
              <input v-model="buttonProps.disabled" type="checkbox" />
              <span>Disabled</span>
            </label>
          </div>
        </div>

        <!-- 아이콘 셀렉트 박스 -->
        <div class="control-group">
          <label>아이콘</label>
          <select v-model="buttonProps.icon" class="control-input">
            <option v-for="icon in icons" :key="icon || 'none'" :value="icon">
              {{ icon || 'None' }}
            </option>
          </select>
        </div>

        <!-- 프리펜드/앱펜드 아이콘 셀렉트 박스 (아이콘 셀렉트가 null이면 활성화) -->
        <div v-if="buttonProps.icon === null" class="control-group">
          <label>Prepend 아이콘</label>
          <select v-model="buttonProps.prependIcon" class="control-input">
            <option v-for="icon in prependAppendIcons" :key="icon || 'none-prepend'" :value="icon">
              {{ icon || 'None' }}
            </option>
          </select>
        </div>

        <div v-if="buttonProps.icon === null" class="control-group">
          <label>Append 아이콘</label>
          <select v-model="buttonProps.appendIcon" class="control-input">
            <option v-for="icon in prependAppendIcons" :key="icon || 'none-append'" :value="icon">
              {{ icon || 'None' }}
            </option>
          </select>
        </div>
      </div>

      <!-- 생성된 코드 -->
      <div class="pub-preview__code">
        <CodeBlock :code="generatedCode" language="vue" dark max-height="300px" />
      </div>

      <!-- 사전 정의된 예제들 -->
      <div class="pub-preview__preset">
        <div class="examples-grid">
          <div
            v-for="(example, idx) in examples"
            :key="idx"
            class="example-card"
            @click="applyExample(example)"
          >
            <div class="example-preview">
              <EblBtn
                :color="example.color"
                :outlined="example.outlined"
                :pill="example.pill"
                :disabled="example.disabled"
                :small="example.small"
                :large="example.large"
                :icon="example.icon"
                :prepend-icon="example.prependIcon || undefined"
                :append-icon="example.appendIcon || undefined"
              >
                {{ example.label }}
              </EblBtn>
            </div>
            <p class="example-name">{{ example.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Props 설명 -->
    <PubPropsSection :props="buttonPropsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

const buttonText = ref('버튼')
const buttonProps = ref({
  color: '',
  size: '',
  outlined: false,
  pill: false,
  disabled: false,
  icon: null,
  prependIcon: '',
  appendIcon: '',
})

const buttonPropsData = [
  {
    name: 'color',
    type: 'String',
    default: 'primary',
    desc: '색상: primary, subtle, inverse, ghost, cta, tertiary, danger',
  },
  { name: 'size', type: 'String', default: 'medium', desc: '크기: small, medium, large' },
  { name: 'outlined', type: 'Boolean', default: 'false', desc: '테두리만 있는 스타일' },
  { name: 'pill', type: 'Boolean', default: 'false', desc: '둥근 버튼 스타일' },
  { name: 'disabled', type: 'Boolean', default: 'false', desc: '비활성화 상태' },
  { name: 'icon', type: 'String', default: 'null', desc: '아이콘만 표시 (prepend/append 불가)' },
  { name: 'prependIcon', type: 'String', default: 'null', desc: '텍스트 앞에 아이콘 표시' },
  { name: 'appendIcon', type: 'String', default: 'null', desc: '텍스트 뒤에 아이콘 표시' },
]

const colors = ['default', 'primary', 'subtle', 'inverse', 'ghost', 'cta', 'tertiary', 'danger']
const sizes = ['small', 'medium', 'large']
const icons = [null, 'mdi-check', 'mdi-star-outline', 'mdi-heart-outline', 'mdi-alert-outline']
const prependAppendIcons = [
  '',
  'mdi-chevron-left',
  'mdi-chevron-right',
  'mdi-plus',
  'mdi-download',
  'mdi-upload',
]

const examples = [
  {
    name: 'Primary Button',
    label: 'Primary',
    color: 'primary',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: false,
  },
  {
    name: 'Subtle Button',
    label: 'Subtle',
    color: 'subtle',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: false,
  },
  {
    name: 'inverse Button',
    label: 'inverse',
    color: 'inverse',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: false,
  },
  {
    name: 'ghost Button',
    label: 'ghost',
    color: 'ghost',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: false,
  },
  {
    name: 'CTA Button',
    label: 'CTA',
    color: 'cta',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: false,
  },
  {
    name: 'Tertiary Button',
    label: 'Tertiary',
    color: 'tertiary',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: false,
  },
  {
    name: 'Danger Button',
    label: 'Danger',
    color: 'danger',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: false,
  },
  {
    name: 'Primary Outlined',
    label: 'Outlined',
    color: 'primary',
    outlined: true,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: false,
  },
  {
    name: 'Pill Button',
    label: 'Pill',
    color: 'primary',
    outlined: false,
    pill: true,
    disabled: false,
    small: false,
    large: false,
    icon: false,
  },
  {
    name: 'Small Button',
    label: 'Small',
    color: 'primary',
    outlined: false,
    pill: false,
    disabled: false,
    small: true,
    large: false,
    icon: false,
  },
  {
    name: 'Large Button',
    label: 'Large',
    color: 'primary',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: true,
    icon: false,
  },
  {
    name: 'Icon Button',
    label: 'Icon',
    color: 'primary',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: 'mdi-check',
  },
  {
    name: 'Disabled Button',
    label: 'Disabled',
    color: 'primary',
    outlined: false,
    pill: false,
    disabled: true,
    small: false,
    large: false,
    icon: false,
  },
  {
    name: 'Prepend Icon',
    label: 'Prepend Icon',
    color: 'subtle',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: false,
    prependIcon: 'mdi-download',
  },
  {
    name: 'Append Icon',
    label: 'Append Icon',
    color: 'inverse',
    outlined: false,
    pill: false,
    disabled: false,
    small: false,
    large: false,
    icon: false,
    appendIcon: 'mdi-chevron-right',
  },
]

// 생성된 코드
const generatedCode = computed(() => {
  let attrs = []

  if (buttonProps.value.color) {
    attrs.push(`color="${buttonProps.value.color}"`)
  }
  if (buttonProps.value.size === 'small') {
    attrs.push('small')
  }
  if (buttonProps.value.size === 'large') {
    attrs.push('large')
  }
  if (buttonProps.value.outlined) {
    attrs.push('outlined')
  }
  if (buttonProps.value.pill) {
    attrs.push('pill')
  }
  if (buttonProps.value.disabled) {
    attrs.push('disabled')
  }
  if (buttonProps.value.icon) {
    attrs.push(`icon="${buttonProps.value.icon}"`)
  }
  if (buttonProps.value.prependIcon) {
    attrs.push(`prepend-icon="${buttonProps.value.prependIcon}"`)
  }
  if (buttonProps.value.appendIcon) {
    attrs.push(`append-icon="${buttonProps.value.appendIcon}"`)
  }

  const attrString = attrs.length > 0 ? ' ' + attrs.join(' ') : ''

  return `<EblBtn${attrString}>
  ${buttonText.value}
</EblBtn>`
})

// 예제 적용
const applyExample = (example) => {
  buttonText.value = example.label
  buttonProps.value.color = example.color || ''
  buttonProps.value.size = example.small ? 'small' : example.large ? 'large' : ''
  buttonProps.value.outlined = example.outlined
  buttonProps.value.pill = example.pill
  buttonProps.value.disabled = example.disabled
  buttonProps.value.icon = example.icon || null
  buttonProps.value.prependIcon = example.prependIcon || ''
  buttonProps.value.appendIcon = example.appendIcon || ''
}
</script>

<style scoped lang="scss"></style>
