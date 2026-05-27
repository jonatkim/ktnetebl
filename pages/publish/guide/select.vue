<template>
  <div class="pub-guide-layout">
    <h2>EblSelect 가이드</h2>
    <p class="guide-subtitle">Select 컴포넌트의 다양한 기능과 옵션을 확인해보세요</p>

    <!-- 1. 플레이그라운드 -->
    <section class="guide-section">
      <h3>플레이그라운드</h3>

      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview">
          <div class="d-flex flex-column ga-3">
            <EblSelect
              v-model="playgroundValue"
              :options="playgroundOptions"
              :placeholder="playgroundProps.placeholder"
              :prepend-icon="playgroundProps.prependIcon || undefined"
              :append-icon="playgroundProps.appendIcon || undefined"
              :lines="playgroundProps.lines"
              :clearable="playgroundProps.clearable"
              :multiple="playgroundProps.multiple"
              :combobox="playgroundProps.combobox"
              :filter-mode="playgroundProps.filterMode"
              :small="playgroundProps.size === 'small'"
              :large="playgroundProps.size === 'large'"
              :outlined="playgroundProps.outlined"
              :disabled="playgroundProps.disabled"
              :readonly="playgroundProps.readonly"
              :helper-text="playgroundProps.helperText"
              :error-message="playgroundProps.errorMessage"
            />
            <div v-if="playgroundValue" style="margin-top: 16px; font-size: 14px; color: #666">
              선택된 값:
              <code style="background: #f5f7fa; padding: 2px 6px; border-radius: 4px">{{
                playgroundValue
              }}</code>
            </div>
          </div>
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <label>옵션 세트</label>
            <div class="button-group">
              <EblBtn
                v-for="opt in optionSets"
                :key="opt.value"
                :outlined="selectedOptionsSet !== opt.value"
                :color="selectedOptionsSet === opt.value ? 'primary' : 'subtle'"
                @click="selectedOptionsSet = opt.value"
              >
                {{ opt.label }}
              </EblBtn>
            </div>
          </div>

          <div class="d-flex">
            <div class="control-group">
              <label>기타</label>
              <div class="button-group">
                <EblBtn
                  :outlined="!playgroundProps.clearable"
                  :color="playgroundProps.clearable ? 'primary' : 'subtle'"
                  @click="playgroundProps.clearable = !playgroundProps.clearable"
                >
                  clearable
                </EblBtn>
                <EblBtn
                  :outlined="!playgroundProps.multiple"
                  :color="playgroundProps.multiple ? 'primary' : 'subtle'"
                  @click="playgroundProps.multiple = !playgroundProps.multiple"
                >
                  multiple
                </EblBtn>
                <EblBtn
                  :outlined="!playgroundProps.combobox"
                  :color="playgroundProps.combobox ? 'primary' : 'subtle'"
                  @click="playgroundProps.combobox = !playgroundProps.combobox"
                >
                  combobox
                </EblBtn>
                <EblBtn
                  :outlined="!playgroundProps.disabled"
                  :color="playgroundProps.disabled ? 'primary' : 'subtle'"
                  @click="playgroundProps.disabled = !playgroundProps.disabled"
                >
                  disabled
                </EblBtn>
                <EblBtn
                  :outlined="!playgroundProps.readonly"
                  :color="playgroundProps.readonly ? 'primary' : 'subtle'"
                  @click="playgroundProps.readonly = !playgroundProps.readonly"
                >
                  readonly
                </EblBtn>
              </div>
            </div>
            <div class="control-group">
              <label>사이즈</label>
              <div class="button-group">
                <EblBtn
                  v-for="s in sizeOptions"
                  :key="s"
                  :outlined="playgroundProps.size !== s"
                  :color="playgroundProps.size === s ? 'primary' : 'subtle'"
                  @click="playgroundProps.size = s"
                >
                  {{ s }}
                </EblBtn>
              </div>
            </div>
          </div>

          <div class="control-group">
            <label>라인 (텍스트 줄 수)</label>
            <div class="button-group">
              <EblBtn
                v-for="opt in lineOptions"
                :key="opt.value"
                :outlined="playgroundProps.lines !== opt.value"
                :color="playgroundProps.lines === opt.value ? 'primary' : 'subtle'"
                @click="playgroundProps.lines = opt.value"
              >
                {{ opt.label }}
              </EblBtn>
            </div>
          </div>

          <div class="control-group" v-if="playgroundProps.combobox">
            <label>필터 방식</label>
            <div class="button-group">
              <EblBtn
                :outlined="playgroundProps.filterMode !== 'includes'"
                :color="playgroundProps.filterMode === 'includes' ? 'primary' : 'subtle'"
                @click="playgroundProps.filterMode = 'includes'"
              >
                includes
              </EblBtn>
              <EblBtn
                :outlined="playgroundProps.filterMode !== 'startsWith'"
                :color="playgroundProps.filterMode === 'startsWith' ? 'primary' : 'subtle'"
                @click="playgroundProps.filterMode = 'startsWith'"
              >
                startsWith
              </EblBtn>
            </div>
          </div>

          <div class="control-group">
            <label>플레이스홀더</label>
            <EblInput v-model="playgroundProps.placeholder" placeholder="Placeholder" />
          </div>

          <div class="d-flex">
            <div class="control-group">
              <label>프리펜드 아이콘</label>
              <div class="button-group">
                <EblBtn
                  v-for="opt in iconOptions"
                  :key="opt.value || 'none'"
                  icon
                  pill
                  :color="playgroundProps.prependIcon === opt.value ? 'primary' : 'ghost'"
                  @click="playgroundProps.prependIcon = opt.value"
                >
                  <template v-if="opt.value"><VIcon :icon="opt.value" /></template>
                  <template v-else><VIcon icon="mdi-cancel" /></template>
                </EblBtn>
              </div>
            </div>

            <div class="control-group">
              <label>어펜드 아이콘</label>
              <div class="button-group">
                <EblBtn
                  v-for="opt in iconOptions"
                  :key="'append-' + (opt.value || 'none')"
                  icon
                  pill
                  :color="playgroundProps.appendIcon === opt.value ? 'primary' : 'ghost'"
                  @click="playgroundProps.appendIcon = opt.value"
                >
                  <template v-if="opt.value"><VIcon :icon="opt.value" /></template>
                  <template v-else><VIcon icon="mdi-cancel" /></template>
                </EblBtn>
              </div>
            </div>
          </div>

          <div class="control-group">
            <label>메시지</label>
            <EblInput v-model="playgroundProps.helperText" placeholder="Helper Message" />
            <EblInput
              v-model="playgroundProps.errorMessage"
              placeholder="Error Message (입력 시 오류 상태)"
            />
          </div>

          <div class="control-actions">
            <EblBtn color="primary" block @click="resetPlayground"> 초기화 </EblBtn>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">생성 코드:</p>
          <CodeBlock :code="generatedCode" language="vue" dark max-height="200px" />
        </div>
      </div>
    </section>

    <!-- 2. Combobox -->
    <section class="guide-section">
      <h3>Combobox (검색 필터링)</h3>
      <p class="guide-subtitle">combobox prop을 사용하면 입력값으로 옵션을 필터링할 수 있습니다.</p>

      <div class="pub-preview--wrap">
        <div class="pub-preview__preview d-flex flex-column ga-4">
          <EblSelect
            v-model="comboboxValue"
            :options="manyOptions"
            placeholder="타이핑으로 검색"
            combobox
            clearable
            block
          />
          <div style="font-size: 14px; color: #666">
            선택된 값:
            <code style="background: #f5f7fa; padding: 2px 6px; border-radius: 4px">{{
              comboboxValue || '(없음)'
            }}</code>
          </div>
        </div>
        <div class="pub-preview__code">
          <p class="code-label">사용 코드:</p>
          <CodeBlock
            code='<EblSelect v-model="value" :options="options" placeholder="타이핑으로 검색" combobox clearable />'
            language="vue"
            dark
            max-height="100px"
          />
        </div>
      </div>
    </section>

    <!-- 3. Filter Mode -->
    <section class="guide-section">
      <h3>Filter Mode</h3>
      <p class="guide-subtitle">
        combobox에서 <code>filterMode</code>를 사용하면 검색 방식을 <code>includes</code> 또는
        <code>startsWith</code>로 제어할 수 있습니다.
      </p>

      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview d-flex flex-column ga-4">
          <div>
            <p class="code-label">includes</p>
            <EblSelect
              v-model="filterModeIncludesValue"
              :options="filterModeOptions"
              placeholder="예: an 입력"
              combobox
              clearable
              block
              filter-mode="includes"
            />
          </div>

          <div>
            <p class="code-label">startsWith</p>
            <EblSelect
              v-model="filterModeStartsWithValue"
              :options="filterModeOptions"
              placeholder="예: an 입력"
              combobox
              clearable
              block
              filter-mode="startsWith"
            />
          </div>

          <div class="result-display">
            <div>테스트 추천 키워드: <code>an</code>, <code>se</code>, <code>gr</code></div>
            <div>includes 선택값: <code>{{ filterModeIncludesValue || '(없음)' }}</code></div>
            <div>
              startsWith 선택값: <code>{{ filterModeStartsWithValue || '(없음)' }}</code>
            </div>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">사용 코드:</p>
          <CodeBlock :code="filterModeCode" language="vue" dark max-height="220px" />
        </div>
      </div>
    </section>

    <!-- 4. Enter로 옵션 추가 -->
    <section class="guide-section">
      <h3>Enter로 옵션 추가 및 선택</h3>
      <p class="guide-subtitle">
        <code>combobox</code>에서 검색 결과가 없을 때 <code>no-result</code> 슬롯으로 안내를
        보여주고, <code>@enter</code> 이벤트에서 새 옵션을 추가한 뒤 바로 선택할 수 있습니다.
        <br />
        <code>EBLCDC010U</code>의 위치 입력 패턴과 동일한 흐름입니다.
      </p>

      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview d-flex flex-column ga-4">
          <EblSelect
            v-model="enterCreateValue"
            :options="enterCreateOptions"
            placeholder="예: Busan 입력 후 Enter"
            combobox
            clearable
            block
            filter-mode="startsWith"
            @enter="appendEnterOption"
          >
            <template #no-result="{ query }">
              <strong>"{{ query }}"</strong>으로 시작하는 항목이 없습니다.<br />
              <kbd>enter</kbd>를 눌러 새 항목을 추가하세요
            </template>
          </EblSelect>

          <div class="result-display">
            <div>
              현재 선택값:
              <code>{{ enterCreateValue || '(없음)' }}</code>
            </div>
            <div>
              현재 옵션:
              <code>{{ enterCreateOptions.map((item) => item.label).join(', ') }}</code>
            </div>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">사용 코드:</p>
          <CodeBlock :code="enterCreateCode" language="vue" dark max-height="320px" />
        </div>
      </div>
    </section>

    <!-- 5. 커스텀 옵션 슬롯 -->
    <section class="guide-section">
      <h3>커스텀 옵션 슬롯</h3>

      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview">
          <EblSelect v-model="customSlot" :options="shortOptions" placeholder="커스텀 옵션">
            <template #option="{ option }">
              <div class="custom-option">
                <VIcon icon="ebli:check" size="16" />
                <span>{{ option.label }}</span>
              </div>
            </template>
          </EblSelect>
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <label>선택된 값</label>
            <p style="font-size: 14px; color: #666">
              {{ customSlot || '(empty)' }}
            </p>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">슬롯 사용 코드:</p>
          <CodeBlock :code="slotTemplateCode" language="vue" dark max-height="300px" />
        </div>
      </div>
    </section>

    <!-- Props 설명 -->
    <PubPropsSection :props="propsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'

definePageMeta({ layout: 'guide' })

// Playground
const playgroundValue = ref(null)
const selectedOptionsSet = ref('short')
const playgroundProps = reactive({
  placeholder: '선택하세요',
  size: 'medium',
  lines: 1,
  filterMode: 'includes',
  prependIcon: '',
  appendIcon: '',
  helperText: '',
  errorMessage: '',
  outlined: true,
  clearable: false,
  multiple: false,
  combobox: false,
  disabled: false,
  readonly: false,
})

const sizeOptions = ['small', 'medium', 'large']
const lineOptions = [
  { label: '1줄 (기본)', value: 1 },
  { label: '워드랩', value: 0 },
  { label: '2줄', value: 2 },
  { label: '3줄', value: 3 },
]

const optionSets = [
  { label: '짧은', value: 'short' },
  { label: '긴', value: 'long' },
  { label: '한글', value: 'korean' },
  { label: '혼합', value: 'mixed' },
  { label: '많음 (10+)', value: 'many' },
]

const iconOptions = [
  { value: '', label: 'None' },
  { value: 'ebli:layout', label: 'layout' },
  { value: 'ebli:check', label: 'check' },
  { value: 'ebli:search', label: 'search' },
  { value: 'ebli:filter', label: 'filter' },
]

const resetPlayground = () => {
  playgroundValue.value = null
  Object.assign(playgroundProps, {
    placeholder: '선택하세요',
    size: 'medium',
    lines: 1,
    filterMode: 'includes',
    prependIcon: '',
    appendIcon: '',
    helperText: '',
    errorMessage: '',
    outlined: true,
    clearable: false,
    multiple: false,
    combobox: false,
    disabled: false,
    readonly: false,
  })
}

const shortOptions = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
  { label: 'Disabled', value: 'opt4', disabled: true },
]

const longOptions = [
  { label: '매우 긴 옵션 텍스트 예제입니다 말줄임 처리 확인용', value: 'long1' },
  {
    label: 'This is a very long option text to demonstrate text ellipsis feature',
    value: 'long2',
  },
  { label: '普通长度选项', value: 'long3' },
]

const koreanOptions = [
  { label: '서울특별시', value: 'seoul' },
  { label: '부산광역시', value: 'busan' },
  { label: '대구광역시', value: 'daegu' },
  { label: '인천광역시', value: 'incheon' },
  { label: '광주광역시', value: 'gwangju' },
  { label: '대전광역시', value: 'daejeon' },
]

const mixedOptions = [
  { label: 'Apple 🍎', value: 'apple' },
  { label: 'Banana 🍌', value: 'banana' },
  { label: '오렌지 🍊', value: 'orange' },
  { label: 'Grape 포도', value: 'grape' },
]

const manyOptions = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
  { label: 'Delta', value: 'delta' },
  { label: 'Epsilon', value: 'epsilon' },
  { label: 'Zeta', value: 'zeta' },
  { label: 'Eta', value: 'eta' },
  { label: 'Theta', value: 'theta' },
  { label: 'Iota', value: 'iota' },
  { label: 'Kappa', value: 'kappa' },
  { label: 'Lambda', value: 'lambda' },
  { label: 'Mu', value: 'mu' },
]

const filterModeOptions = [
  { label: 'Angel', value: 'angel' },
  { label: 'Anise', value: 'anise' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cranberry', value: 'cranberry' },
  { label: 'Mango', value: 'mango' },
  { label: 'Orange', value: 'orange' },
  { label: 'Sea Salt', value: 'sea-salt' },
  { label: 'Grape', value: 'grape' },
]

const enterCreateOptions = ref([
  { label: 'Seoul', value: 'Seoul' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Shanghai', value: 'Shanghai' },
  { label: 'Tokyo', value: 'Tokyo' },
])

const playgroundOptions = computed(() => {
  const sets = {
    short: shortOptions,
    long: longOptions,
    korean: koreanOptions,
    mixed: mixedOptions,
    many: manyOptions,
  }
  return sets[selectedOptionsSet.value] || shortOptions
})

// Combobox 예제
const comboboxValue = ref(null)
const filterModeIncludesValue = ref(null)
const filterModeStartsWithValue = ref(null)
const enterCreateValue = ref(null)

// 커스텀 슬롯 예제
const customSlot = ref(null)

const appendEnterOption = ({ query }) => {
  const trimmedQuery = String(query || '').trim()
  if (!trimmedQuery) return

  const exists = enterCreateOptions.value.some(
    (item) => item.label.toLowerCase() === trimmedQuery.toLowerCase(),
  )

  if (!exists) {
    enterCreateOptions.value = [
      ...enterCreateOptions.value,
      { label: trimmedQuery, value: trimmedQuery },
    ]
  }

  enterCreateValue.value = trimmedQuery
}

// Generated Code
const generatedCode = computed(() => {
  const parts = ['<EblSelect v-model="value"']

  parts.push(' :options="options"')

  if (playgroundProps.placeholder && playgroundProps.placeholder !== '선택하세요') {
    parts.push(` placeholder="${playgroundProps.placeholder}"`)
  }
  if (playgroundProps.prependIcon) {
    parts.push(` prepend-icon="${playgroundProps.prependIcon}"`)
  }
  if (playgroundProps.appendIcon) {
    parts.push(` append-icon="${playgroundProps.appendIcon}"`)
  }
  if (playgroundProps.size !== 'medium') {
    parts.push(` ${playgroundProps.size}`)
  }
  if (playgroundProps.lines !== 1) {
    parts.push(` :lines="${playgroundProps.lines}"`)
  }
  if (!playgroundProps.outlined) {
    parts.push(' :outlined="false"')
  }
  if (playgroundProps.clearable) {
    parts.push(' clearable')
  }
  if (playgroundProps.multiple) {
    parts.push(' multiple')
  }
  if (playgroundProps.combobox) {
    parts.push(' combobox')
    if (playgroundProps.filterMode !== 'includes') {
      parts.push(` filter-mode="${playgroundProps.filterMode}"`)
    }
  }
  if (playgroundProps.disabled) {
    parts.push(' disabled')
  }
  if (playgroundProps.readonly) {
    parts.push(' readonly')
  }
  if (playgroundProps.helperText) {
    parts.push(` helper-text="${playgroundProps.helperText}"`)
  }
  if (playgroundProps.errorMessage) {
    parts.push(` error-message="${playgroundProps.errorMessage}"`)
  }

  parts.push(' />')
  return parts.join('')
})

const slotTemplateCode = `<EblSelect v-model="value" :options="options" placeholder="커스텀 옵션">
  <template #option="{ option }">
    <div class="custom-option">
      <VIcon icon="ebli:check" size="16" />
      <span>{{ option.label }}</span>
    </div>
  </template>
</EblSelect>

<style scoped>
.custom-option {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>`

const filterModeCode = `<EblSelect
  v-model="value"
  :options="options"
  placeholder="예: an 입력"
  combobox
  clearable
  filter-mode="startsWith"
/>`

const enterCreateCode = `<EblSelect
  v-model="value"
  :options="options"
  placeholder="예: Busan 입력 후 Enter"
  combobox
  clearable
  filter-mode="startsWith"
  @enter="appendOption"
>
  <template #no-result="{ query }">
    <strong>"{{ query }}"</strong>으로 시작하는 항목이 없습니다.<br />
    <kbd>enter</kbd>를 눌러 새 항목을 추가하세요
  </template>
</EblSelect>

const appendOption = ({ query }) => {
  const value = query.trim()
  if (!value) return

  options.value.push({ label: value, value })
  selected.value = value
}`

const propsData = [
  { name: 'modelValue', type: 'Any', default: 'null', desc: '선택된 값 (v-model)' },
  {
    name: 'options',
    type: 'Array',
    default: '[]',
    desc: '옵션 배열. { label, value, disabled? } 형태',
  },
  { name: 'placeholder', type: 'String', default: "'Select'", desc: '플레이스홀더 텍스트' },
  { name: 'prependIcon', type: 'String', default: "''", desc: '앞쪽 아이콘' },
  { name: 'appendIcon', type: 'String', default: "''", desc: '뒤쪽 아이콘 (slot으로도 가능)' },
  {
    name: 'lines',
    type: 'Number',
    default: '1',
    desc: '값 표시 줄 수: 0=워드랩(말줄임 없음), 1=1줄 말줄임, n=n줄 말줄임',
  },
  { name: 'clearable', type: 'Boolean', default: 'false', desc: '선택값 지우기 버튼 표시' },
  { name: 'multiple', type: 'Boolean', default: 'false', desc: '다중 선택 모드 (체크박스 표시)' },
  { name: 'helperText', type: 'String', default: "''", desc: '하단 도움말 메시지' },
  { name: 'errorMessage', type: 'String', default: "''", desc: '에러 메시지 (에러 상태로 변경)' },
  { name: 'small', type: 'Boolean', default: 'false', desc: '작은 사이즈 (28px)' },
  { name: 'large', type: 'Boolean', default: 'false', desc: '큰 사이즈 (48px)' },
  { name: 'outlined', type: 'Boolean', default: 'true', desc: '테두리 표시 여부' },
  { name: 'block', type: 'Boolean', default: 'false', desc: '가로 100% 확장' },
  { name: 'disabled', type: 'Boolean', default: 'false', desc: '비활성화 상태' },
  { name: 'readonly', type: 'Boolean', default: 'false', desc: '읽기 전용 (선택 불가)' },
  {
    name: 'combobox',
    type: 'Boolean',
    default: 'false',
    desc: '입력 필터링 모드 - 타이핑으로 옵션을 검색/필터링',
  },
  {
    name: 'filterMode',
    type: "'includes' | 'startsWith'",
    default: "'includes'",
    desc: 'combobox 검색 방식. includes는 포함 검색, startsWith는 앞글자 일치 검색',
  },
  {
    name: '@enter',
    type: 'Event',
    default: '-',
    desc: 'combobox에서 Enter 입력 시 발생. { query } 형태로 현재 입력값을 전달',
  },
]
</script>

<style scoped>
.custom-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-label {
  font-size: 13px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.custom-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-display {
  margin-top: 16px;
  padding: 12px;
  background: var(--bg-surface-subtle, #f5f7fa);
  border-radius: 8px;
  font-size: 14px;
}

.result-display code {
  padding: 2px 6px;
  background: #fff;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: var(--text-link, #295bff);
}
</style>
