<template>
  <div class="pub-guide-layout">
    <h2>EblToast 토스트 가이드</h2>
    <p class="guide-subtitle">토스트의 위치, 색상, 타임아웃을 실시간으로 테스트해보세요</p>

    <!-- 1. 커스텀 토스트 생성기 -->
    <section class="guide-section">
      <h3>커스텀 토스트 생성기</h3>

      <div class="display-box">
        <div class="control-group">
          <label>위치</label>
          <div class="button-group">
            <EblBtn
              v-for="pos in positions"
              :key="pos.value"
              :outlined="toastProps.position !== pos.value"
              :color="toastProps.position === pos.value ? 'primary' : 'subtle'"
              @click="changePosition(pos.value)"
            >
              {{ pos.label }}
            </EblBtn>
          </div>
          <p class="hint">
            현재: <strong>{{ toastProps.position }}</strong>
          </p>
        </div>
        <div class="d-flex">
          <div class="control-group">
            <label>타입</label>
            <div class="color-options">
              <button
                v-for="type in typeOptions"
                :key="type.value"
                class="color-btn"
                :style="{ backgroundColor: type.color }"
                :title="type.label"
                @click="selectType(type.value)"
                :class="{ active: toastProps.type === type.value }"
              >
                <VIcon
                  v-if="toastProps.type === type.value"
                  icon="mdi-check"
                  :size="16"
                  color="white"
                />
              </button>
            </div>
            <p class="hint">
              현재:
              <strong>{{ typeOptions.find((t) => t.value === toastProps.type)?.label }}</strong>
            </p>
          </div>

          <div class="control-group">
            <label>배경색</label>
            <div style="display: flex; gap: 12px; align-items: center">
              <input
                v-model="toastProps.backgroundColor"
                type="color"
                class="control-input"
                style="width: 60px; height: 40px; padding: 4px; cursor: pointer"
              />
              <span class="hint" style="margin: 0">{{ toastProps.backgroundColor }}</span>
            </div>
          </div>

          <div class="control-group">
            <label>글자색</label>
            <div style="display: flex; gap: 12px; align-items: center">
              <input
                v-model="toastProps.color"
                type="color"
                class="control-input"
                style="width: 60px; height: 40px; padding: 4px; cursor: pointer"
              />
              <span class="hint" style="margin: 0">{{ toastProps.color }}</span>
            </div>
          </div>
        </div>

        <div class="control-group">
          <label>타임아웃</label>
          <div class="button-group">
            <EblBtn
              :outlined="toastProps.timeout !== 0"
              :color="toastProps.timeout === 0 ? 'primary' : 'subtle'"
              @click="toastProps.timeout = 0"
            >
              닫기 (0ms)
            </EblBtn>
            <EblBtn
              :outlined="toastProps.timeout !== 3000"
              :color="toastProps.timeout === 3000 ? 'primary' : 'subtle'"
              @click="toastProps.timeout = 3000"
            >
              3초
            </EblBtn>
            <EblBtn
              :outlined="toastProps.timeout !== 4000"
              :color="toastProps.timeout === 4000 ? 'primary' : 'subtle'"
              @click="toastProps.timeout = 4000"
            >
              4초
            </EblBtn>
            <EblBtn
              :outlined="toastProps.timeout !== 5000"
              :color="toastProps.timeout === 5000 ? 'primary' : 'subtle'"
              @click="toastProps.timeout = 5000"
            >
              5초
            </EblBtn>
          </div>
          <input
            v-model.number="toastProps.timeout"
            type="number"
            min="0"
            max="10000"
            step="500"
            class="control-input"
            placeholder="직접 입력 (ms)"
          />
        </div>

        <div class="control-group">
          <label>메시지</label>
          <input
            v-model="toastProps.text"
            type="text"
            placeholder="토스트 메시지 입력"
            class="control-input"
          />
        </div>

        <div class="control-actions">
          <EblBtn color="primary" block @click="displayToast"> 토스트 표시 </EblBtn>
        </div>
      </div>

      <div class="code-preview">
        <p class="code-label">생성 코드:</p>
        <CodeBlock :code="generatedCode" language="javascript" dark max-height="120px" />
      </div>
    </section>

    <!-- 2. 빠른 예제 모음 -->
    <section class="guide-section">
      <h3>빠른 예제</h3>
      <div class="examples-grid">
        <div v-for="(example, idx) in examples" :key="idx" class="example-card">
          <div class="example-header">
            <h4>{{ example.name }}</h4>
            <span class="example-type">{{ example.type }}</span>
          </div>
          <p class="example-desc">{{ example.description }}</p>
          <EblBtn color="primary" block @click="displayExampleToast(example)"> 테스트 </EblBtn>
        </div>
      </div>
    </section>

    <!-- 3. 위치별 테스트 -->
    <section class="guide-section">
      <h3>위치별 테스트</h3>
      <p class="section-desc">각 위치에서 토스트가 어떻게 표시되는지 확인하세요</p>
      <div class="button-group">
        <EblBtn
          v-for="pos in positions"
          :key="pos.value"
          color="primary"
          @click="testPositionToast(pos.value)"
        >
          {{ pos.label }}
        </EblBtn>
      </div>
    </section>

    <!-- 4. Props 및 API 문서 -->
    <section class="guide-section">
      <h3>API 문서</h3>

      <div class="api-subsection">
        <h4>Store 사용</h4>
        <CodeBlock :code="storeUsageCode" language="javascript" dark />
      </div>

      <div class="api-subsection">
        <h4>위치 변경 (전역)</h4>
        <CodeBlock :code="positionUsageCode" language="javascript" dark />
      </div>

      <div class="api-subsection">
        <h4>타임아웃 없는 토스트</h4>
        <CodeBlock :code="noTimeoutUsageCode" language="javascript" dark />
      </div>

      <div class="api-subsection">
        <h4>모든 옵션 사용</h4>
        <CodeBlock :code="fullUsageCode" language="javascript" dark />
      </div>
    </section>

    <!-- Props 설명 -->
    <PubPropsSection :props="toastPropsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

const toastStore = useToastStore()

// 위치 옵션
const positions = [
  { value: 'top', label: '상단 중앙' },
  { value: 'top-start', label: '좌상단' },
  { value: 'top-end', label: '우상단' },
  { value: 'bottom', label: '하단 중앙' },
  { value: 'bottom-start', label: '좌하단' },
  { value: 'bottom-end', label: '우하단' },
]

// 타입 옵션
const typeOptions = [
  { label: 'Default', value: 'default', color: '#6c757d' },
  { label: 'Success', value: 'success', color: '#24a148' },
  { label: 'Error', value: 'error', color: '#e53935' },
  { label: 'Warning', value: 'warning', color: '#f57c00' },
  { label: 'Info', value: 'info', color: '#1976d2' },
  { label: 'Primary', value: 'primary', color: '#476dfc' },
]

// 토스트 속성
const toastProps = reactive({
  position: 'bottom',
  type: 'default',
  backgroundColor: null,
  color: null,
  timeout: 4000,
  text: '토스트 메시지입니다!',
})

// 위치 변경 감시: store에 반영
watch(
  () => toastProps.position,
  (newPos) => {
    toastStore.setPosition(newPos)
  },
)

// 배경색/글자색 변경 시 타입을 default로 변경
watch(
  () => toastProps.backgroundColor,
  (newColor) => {
    if (newColor && toastProps.type !== 'default') {
      toastProps.type = 'default'
    }
  },
)

watch(
  () => toastProps.color,
  (newColor) => {
    if (newColor && toastProps.type !== 'default') {
      toastProps.type = 'default'
    }
  },
)

// 초기값 설정
onMounted(() => {
  toastProps.position = toastStore.position || 'bottom'
})

// 위치 변경 함수
const changePosition = (pos) => {
  toastProps.position = pos
}

// 생성된 코드 계산
const generatedCode = computed(() => {
  const type = toastProps.type === 'default' ? '' : `, type: '${toastProps.type}'`
  const bgColor = toastProps.backgroundColor
    ? `, backgroundColor: '${toastProps.backgroundColor}'`
    : ''
  const textColor = toastProps.color ? `, color: '${toastProps.color}'` : ''
  const timeout = toastProps.timeout === 4000 ? '' : `, timeout: ${toastProps.timeout}`
  return `toastStore.add({ text: '${toastProps.text}'${type}${bgColor}${textColor}${timeout} })`
})

// 사용법 코드 예제들
const storeUsageCode = computed(
  () => `// Pinia store 직접 사용
const toastStore = useToastStore()

// 기본 사용 (4초 자동 닫힘)
toastStore.add({ text: '메시지입니다' })

// 색상 지정
toastStore.add({ text: '성공 메시지', color: 'success' })

// 타임아웃 지정
toastStore.add({ text: '임시 메시지', timeout: 3000 })

// 색상 + 타임아웃
toastStore.add({
  text: '완료 메시지',
  color: 'success',
  timeout: 5000
})`,
)

const positionUsageCode = computed(
  () => `// 전역 위치 변경 (모든 토스트에 적용)
const toastStore = useToastStore()

// 위치 변경
toastStore.setPosition('top-start')

// 토스트 추가 (변경된 위치에 표시)
toastStore.add({ text: '좌상단에 표시됩니다' })
toastStore.add({ text: '이것도 좌상단에' })
toastStore.add({ text: '이것도 좌상단에' })

// 다른 위치로 변경
toastStore.setPosition('bottom-end')
toastStore.add({ text: '우하단에 표시됩니다' })`,
)

const noTimeoutUsageCode = computed(
  () => `// 타임아웃 없는 토스트 (닫기 버튼으로만 제거)
const toastStore = useToastStore()

// timeout: 0 으로 설정하면 자동 닫힘 없음
toastStore.add({
  text: '중요한 알림입니다. 닫기 버튼을 클릭하세요.',
  color: 'warning',
  timeout: 0
})

// 다른 토스트와 함께 표시
toastStore.add({ text: '일반 메시지 (4초)', color: 'info' })
toastStore.add({ text: '중요 메시지 (닫기)', color: 'warning', timeout: 0 })`,
)

const fullUsageCode = computed(
  () => `// 모든 옵션을 사용한 예제
const toastStore = useToastStore()

// 위치 변경
toastStore.setPosition('top-end')

// 여러 토스트 추가
const toastId1 = toastStore.add({
  text: '성공: 작업이 완료되었습니다',
  color: 'success',
  timeout: 3000
})

const toastId2 = toastStore.add({
  text: '중요: 이 메시지는 닫기 버튼으로만 제거됩니다',
  color: 'warning',
  timeout: 0
})

const toastId3 = toastStore.add({
  text: '오류: 문제가 발생했습니다',
  color: 'error',
  timeout: 5000
})

// 특정 토스트 제거
setTimeout(() => {
  toastStore.remove(toastId1)
}, 6000)`,
)

// Props 데이터
const toastPropsData = [
  {
    name: 'position',
    type: 'String',
    default: "'bottom'",
    description: '토스트 표시 위치 (전역 설정)',
    options: ['top', 'bottom', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
  },
  {
    name: 'text',
    type: 'String',
    default: "''",
    description: '토스트 메시지 내용',
  },
  {
    name: 'color',
    type: 'String',
    default: "'default'",
    description: '토스트 색상/타입',
    options: ['default', 'success', 'error', 'warning', 'info', 'primary'],
  },
  {
    name: 'timeout',
    type: 'Number',
    default: '4000',
    description: '자동 닫힘 시간(ms). 0이면 닫기 버튼으로만 제거',
  },
]

// 사전 정의된 예제들
const examples = [
  {
    name: '성공',
    type: '3초',
    description: '작업이 성공적으로 완료됨',
    type: 'success',
    text: '작업이 성공적으로 완료되었습니다!',
    timeout: 3000,
  },
  {
    name: '오류',
    type: '5초',
    description: '오류 발생',
    type: 'error',
    text: '오류가 발생했습니다. 다시 시도해주세요.',
    timeout: 5000,
  },
  {
    name: '경고',
    type: '4초',
    description: '주의가 필요한 상황',
    type: 'warning',
    text: '주의: 이 작업은 되돌릴 수 없습니다.',
    timeout: 4000,
  },
  {
    name: '정보',
    type: '3.5초',
    description: '일반 정보 제공',
    type: 'info',
    text: '새로운 업데이트가 있습니다.',
    timeout: 3500,
  },
  {
    name: '중요 알림',
    type: '닫기',
    description: '닫기 버튼으로만 제거',
    type: 'primary',
    text: '중요한 알림입니다. 닫기 버튼을 클릭하세요.',
    timeout: 0,
  },
  {
    name: '확인 필요',
    type: '닫기',
    description: '사용자 확인이 필요한 메시지',
    type: 'warning',
    text: '이 변경사항을 저장하시겠습니까?',
    timeout: 0,
  },
]

// 예제 토스트 표시
const displayExampleToast = (example) => {
  toastStore.add({
    text: example.text,
    type: example.type,
    timeout: example.timeout,
  })
}

// 위치별 테스트 토스트 표시
const testPositionToast = (position) => {
  toastStore.setPosition(position)
  toastStore.add({
    text: `${position} 위치에서 표시됩니다`,
    type: 'info',
    timeout: 3000,
  })
}

// 타입 선택 시 커스텀 색상 초기화
const selectType = (value) => {
  toastProps.type = value
  toastProps.backgroundColor = null
  toastProps.color = null
}

// 토스트 표시 함수
const displayToast = () => {
  toastStore.add({
    text: toastProps.text,
    type: toastProps.type === 'default' ? undefined : toastProps.type,
    backgroundColor: toastProps.backgroundColor || undefined,
    color: toastProps.color || undefined,
    timeout: toastProps.timeout,
  })
}
</script>

<style lang="scss" scoped></style>

