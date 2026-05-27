<template>
  <div class="pub-guide-layout">
    <h2>EblTabs 가이드</h2>
    <p class="guide-subtitle">라인/필 스타일, 서브타이틀, 아이콘을 조합할 수 있는 탭 컴포넌트</p>

    <!-- 인터랙티브 예제 -->
    <section class="guide-section">
      <h3>Tabs 컴포넌트</h3>
      <p class="guide-caption">기본 탭과 커스텀 탭 슬롯(#tab)을 함께 제공합니다.</p>

      <!-- 프리뷰 -->
      <div class="display-box">
        <EblTabs
          :items="items"
          v-model="tab"
          :variant="demoVariant"
          :size="demoSize"
          :align="demoAlign"
          :stretch="demoStretch"
          :color="
            demoColor === 'Default' ? null : colorOptions.find((c) => c.label === demoColor).value
          "
        />
      </div>
      <div class="d-flex my-4">
        <!-- 프롭스 컨트롤 -->
        <div class="control-group">
          <label>Variant</label>
          <div class="option-buttons">
            <EblBtn
              v-for="v in variantOptions"
              :key="v"
              :outlined="demoVariant !== v"
              :color="demoVariant === v ? 'primary' : 'subtle'"
              @click="demoVariant = v"
            >
              {{ v }}
            </EblBtn>
          </div>
        </div>

        <div class="control-group">
          <label>Size</label>
          <div class="option-buttons">
            <EblBtn
              v-for="s in sizeOptions"
              :key="s"
              :outlined="demoSize !== s"
              :color="demoSize === s ? 'primary' : 'subtle'"
              @click="demoSize = s"
            >
              {{ s }}
            </EblBtn>
          </div>
        </div>

        <div class="control-group">
          <label>Align</label>
          <div class="option-buttons">
            <EblBtn
              v-for="a in alignOptions"
              :key="a"
              :disabled="demoStretch"
              :outlined="demoAlign !== a"
              :color="demoAlign === a ? 'primary' : 'subtle'"
              @click="demoAlign = a"
            >
              {{ a }}
            </EblBtn>
          </div>
        </div>

        <div class="control-group">
          <label>Stretch</label>
          <EblSwitch v-model="demoStretch" />
        </div>

        <div class="control-group">
          <label>Color</label>
          <div class="color-options">
            <button
              v-for="c in colorOptions"
              :key="c.label"
              :class="['color-btn', { active: demoColor === c.label }]"
              :style="{ background: c.value }"
              @click="demoColor = c.label"
              :title="c.label"
            >
              <VIcon v-if="demoColor === c.label" icon="mdi-check" :size="16" color="white" />
            </button>
          </div>
        </div>
      </div>

      <!-- 마크업 코드 -->
      <CodeGroup :items="codeGroupItems" />
    </section>

    <!-- 슬롯 예제 가이드 -->
    <section class="guide-section">
      <h3>슬롯 커스텀 예제</h3>

      <!-- 슬롯 예제 프리뷰 -->
      <div class="display-box">
        <EblTabs :items="items" v-model="tab" variant="pill" stretch>
          <template #tab="{ item, active }">
            <div
              style="
                display: flex;
                flex-direction: column;
                gap: 4px;
                text-align: left;
                align-items: flex-start;
              "
            >
              <span style="font-weight: 700">
                {{ item.label }}
                <EblBadge v-if="item.badge" color="red" size="sm">{{ item.badge }}</EblBadge>
              </span>
              <small style="color: var(--text-tertiary, #7a8492)">
                {{ item.subtitle }}
                <VIcon v-if="active" icon="mdi-check" :size="16" color="success" />
              </small>
            </div>
          </template>
        </EblTabs>
      </div>

      <!-- 슬롯 코드 -->
      <CodeBlock :code="slotCode" language="vue" dark max-height="250px" />
    </section>

    <!-- Props -->
    <PubPropsSection :props="tabsProps" :slots="tabsSlots" :events="tabsEvents" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

const items = ref([
  { value: 'all', label: 'All', subtitle: '#,###', icon: 'ebli:global', badge: '12' },
  { value: 'a', label: 'First Tab', subtitle: '#,###' },
  { value: 'b', label: 'Second Tab', subtitle: '###', badge: '3' },
  { value: 'c', label: 'Disabled Tab', subtitle: '##,###', disabled: true },
])
const tab = ref('all')
const demoVariant = ref('pill')
const demoSize = ref('md')
const demoAlign = ref('start')
const demoStretch = ref(false)
const demoColor = ref('Default')

const variantOptions = ['line', 'pill']
const sizeOptions = ['sm', 'md', 'lg']
const alignOptions = ['start', 'center', 'end']

const colorOptions = [
  { label: 'Default', value: '#121a26' },
  { label: 'Gray', value: '#6c757d' },
  { label: 'Primary', value: '#476dfc' },
  { label: 'Success', value: '#24a148' },
  { label: 'Error', value: '#e53935' },
  { label: 'Warning', value: '#f57c00' },
  { label: 'Info', value: '#1976d2' },
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#ffffff' },
]

const generateProps = () => {
  const props = [':items="items"', 'v-model="tab"']

  if (demoVariant.value !== 'line') {
    props.push(`variant="${demoVariant.value}"`)
  }

  if (demoSize.value !== 'md') {
    props.push(`size="${demoSize.value}"`)
  }

  if (!demoStretch.value && demoAlign.value !== 'start') {
    props.push(`align="${demoAlign.value}"`)
  }

  if (demoStretch.value) {
    props.push(':stretch="true"')
  }

  if (demoColor.value !== 'Default') {
    props.push(`color="${colorOptions.find((c) => c.label === demoColor.value).value}"`)
  }

  return props
}

watch(
  () => demoStretch.value,
  (val) => {
    if (val) demoAlign.value = 'start'
  },
)

const demoCode = computed(() => {
  return `<EblTabs\n  ${generateProps().join('\n  ')}\n/>`
})

const scriptCode = computed(() => {
  return `const items = ref([
  { value: 'all', label: 'All', subtitle: '#,###', icon: 'ebli:global' },
  { value: 'a', label: 'First Tab', subtitle: '#,###' },
  { value: 'b', label: 'Second Tab', subtitle: '###' },
  { value: 'c', label: 'Disabled Tab', subtitle: '##,###', disabled: true },
])
const tab = ref('all')`
})

const templateCode = computed(() => {
  return `<EblTabs\n  ${generateProps().join('\n  ')}\n/>`
})

const slotCode = computed(() => {
  return `<EblTabs :items="items" v-model="tab" variant="pill" stretch>
  <template #tab="{ item, active }">
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 4px;
        text-align: left;
        align-items: flex-start;
      "
    >
      <span style="font-weight: 600">{{ item.label }}</span>
      <small style="color: var(--text-tertiary, #7a8492)">{{ item.subtitle }}</small>
    </div>
    <EblBadge v-if="item.badge" color="red" size="sm">{{ item.badge }}</EblBadge>
    <VIcon v-if="active" icon="mdi-check" :size="16" color="success" />
  </template>
</EblTabs>`
})

const codeGroupItems = computed(() => [
  {
    title: 'Template',
    code: templateCode.value,
    language: 'vue',
  },
  {
    title: 'Script',
    code: scriptCode.value,
    language: 'javascript',
  },
])

const tabsProps = [
  {
    name: 'items',
    type: 'Array',
    default: '[]',
    description: '각 탭 데이터 (value, label, subtitle, icon, badge, disabled)',
  },
  {
    name: 'modelValue',
    type: 'String | Number | Object',
    default: '첫 번째 value',
    description: '선택된 탭 value (v-model)',
  },
  { name: 'variant', type: 'String', default: "'line'", description: "스타일: 'line' | 'pill'" },
  { name: 'size', type: 'String', default: "'md'", description: "크기: 'sm' | 'md' | 'lg'" },
  {
    name: 'align',
    type: 'String',
    default: "'start'",
    description: "정렬: 'start' | 'center' | 'end'",
  },
  { name: 'stretch', type: 'Boolean', default: 'false', description: 'true면 한 줄에서 균등 분배' },
  {
    name: 'color',
    type: 'String',
    default: 'primary',
    description: '텍스트와 인디케이터 색상: primary, success, error, warning, info 등',
  },
]

const tabsSlots = [
  {
    name: 'tab',
    props: '{ item, active, index }',
    description: '탭 라벨 전체를 커스텀 (아이콘, 서브타이틀, 뱃지 등 포함)',
  },
]

const tabsEvents = [
  {
    name: 'update:modelValue',
    payload: 'value',
    desc: 'v-model 동기화 (필수)',
  },
  {
    name: 'change',
    payload: 'value',
    desc: '선택 변경 알림 (선택적)',
  },
]
</script>

