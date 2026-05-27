<template>
  <div class="pub-guide-layout">
    <h2>EblDatePicker 가이드</h2>
    <p class="guide-subtitle">
      VueDatePicker를 얇게 감싼 래퍼입니다. 기본 locale은 한국어(ko), modelType은 format이며 타입에
      맞춰 포맷이 자동 지정됩니다. 아래 플레이그라운드에서 주요 속성을 바로 조절해 보세요.
    </p>

    <section class="guide-section">
      <h3>플레이그라운드</h3>
      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview">
          <div class="d-flex flex-column ga-3">
            <EblDatePicker
              v-model="state.value"
              :preset="state.preset"
              :size="state.size"
              :range="state.range"
              :disabled="state.disabled"
              :readonly="state.readonly"
              :placeholder="state.placeholder"
              :format="state.format || undefined"
              :model-type="state.modelType"
              :auto-apply="state.autoApply"
              :text-input="state.textInput"
              :clearable="state.clearable"
            />

            <p class="preview-value">선택 값: {{ displayValue }}</p>
          </div>
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <label>Preset</label>
            <div class="button-group">
              <EblBtn
                v-for="p in presetOptions"
                :key="p"
                size="small"
                :outlined="state.preset !== p"
                :color="state.preset === p ? 'primary' : 'subtle'"
                @click="setPreset(p)"
              >
                {{ p }}
              </EblBtn>
            </div>
          </div>

          <div class="control-group">
            <label>Size</label>
            <div class="button-group">
              <EblBtn
                v-for="s in sizeOptions"
                :key="s"
                size="small"
                :outlined="state.size !== s"
                :color="state.size === s ? 'primary' : 'subtle'"
                @click="state.size = s"
              >
                {{ s }}
              </EblBtn>
            </div>
          </div>

          <div class="control-group">
            <label>Range</label>
            <div>
              <EblSwitch v-model="state.range" label="Range 모드" />
            </div>
          </div>

          <div class="control-group">
            <label>Placeholder</label>
            <EblInput v-model="state.placeholder" size="small" />
          </div>

          <div class="control-group">
            <label>Format</label>
            <EblInput v-model="state.format" size="small" placeholder="(auto)" />
          </div>

          <div class="control-group">
            <label>Model Type</label>
            <div class="button-group">
              <EblBtn
                v-for="mt in modelTypeOptions"
                :key="mt"
                size="small"
                :outlined="state.modelType !== mt"
                :color="state.modelType === mt ? 'primary' : 'subtle'"
                @click="state.modelType = mt"
              >
                {{ mt }}
              </EblBtn>
            </div>
          </div>

          <div class="control-group">
            <label>옵션</label>
            <div class="d-flex ga-4">
              <EblSwitch
                v-model="state.autoApply"
                v-tooltip:top="`날짜/시간을 고르자마자 값을 확정하고 메뉴를 닫는 옵션.`"
                label="auto-apply"
              />
              <EblSwitch
                v-model="state.textInput"
                v-tooltip:top="`입력창에 직접 타이핑을 허용할지 여부/설정.`"
                label="text-input"
              />
              <EblSwitch v-model="state.disabled" label="disabled" />
              <EblSwitch v-model="state.readonly" label="readonly" />
              <EblSwitch v-model="state.clearable" label="clearable" />
            </div>
          </div>

          <div class="control-actions">
            <EblBtn color="primary" block @click="resetState">초기화</EblBtn>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">생성 코드</p>
          <CodeBlock :code="codeSnippet" language="vue" dark max-height="260px" />
        </div>
      </div>
    </section>

    <section class="guide-section">
      <h3>date range 슬롯 예제</h3>
      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview">
          <div class="d-flex flex-column ga-3">
            <EblDatePicker
              v-model="actionState.value"
              :start-date="prevMonthStart"
              :focus-start-date="true"
              :range="true"
              auto-apply
            >
            </EblDatePicker>
          </div>
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <label>샘플 설명</label>
            <p style="font-size: 13px; color: #666">
              {{ actionState.value }}
            </p>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">Action Row 코드</p>
          <CodeGroup :items="actionCodeItems" dark />
        </div>
      </div>
    </section>
    <section class="guide-section">
      <h3>Action Row 슬롯 예제</h3>
      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview">
          <div class="d-flex flex-column ga-3">
            <EblDatePicker
              v-model="actionState.value"
              :start-date="prevMonthStart"
              :focus-start-date="true"
              preset="date"
              :range="true"
            >
              <template #action-row="{ selectDate, closePicker, disabled }">
                <div class="w-100 d-flex ga-2" style="align-items: center">
                  <VSpacer />
                  <EblBtn
                    small
                    color="primary"
                    :disabled="disabled"
                    @click="selectPrev(7, selectDate)"
                  >
                    이전 1주일
                  </EblBtn>
                  <EblBtn
                    small
                    color="primary"
                    :disabled="disabled"
                    @click="selectPrev(30, selectDate)"
                  >
                    이전 30일
                  </EblBtn>
                  <EblBtn
                    small
                    color="primary"
                    :disabled="disabled"
                    @click="selectPrev(365, selectDate)"
                  >
                    이전 1년
                  </EblBtn>
                  <EblBtn small :outlined="true" :disabled="disabled" @click="selectDate?.()">
                    적용
                  </EblBtn>
                  <EblBtn small :outlined="true" :disabled="disabled" @click="closePicker?.()">
                    닫기
                  </EblBtn>
                </div>
              </template>
            </EblDatePicker>

            <p class="preview-value">
              Action 값:
              {{
                actionState.value && actionState.value.length
                  ? formatYMD(actionState.value[0]) + ' ~ ' + formatYMD(actionState.value[1])
                  : '선택 안 됨'
              }}
            </p>
          </div>
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <label>샘플 설명</label>
            <p style="font-size: 13px; color: #666">
              "이전 n일" 버튼을 누르면 해당 기간의 날짜 범위가 선택됩니다.
            </p>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">Action Row 코드</p>
          <CodeGroup :items="actionCodeItems" dark />
        </div>
      </div>
    </section>

    <section class="guide-section">
      <h3>이벤트 확인</h3>
      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview flex-column ga-3">
          <EblDatePicker
            v-model="eventState.value"
            :preset="eventState.preset"
            :range="eventState.range"
            :auto-apply="true"
            :text-input="true"
            @open="onOpen"
            @closed="onClosed"
            @text-input="onTextInput"
            @clear="onClear"
            @update-month-year="onUpdateMonthYear"
            @day-click="onDayClick"
            @focus="onFocus"
            @blur="onBlur"
          />

          <div class="mt-3">
            <p class="preview-value">최근 이벤트:</p>
            <ul style="font-size: 12px; color: #666; padding-left: 16px">
              <li v-for="(e, idx) in eventLog" :key="idx">{{ e }}</li>
            </ul>
          </div>
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <label>Preset</label>
            <div class="button-group">
              <EblBtn
                v-for="p in presetOptions"
                :key="'ev-' + p"
                :outlined="eventState.preset !== p"
                :color="eventState.preset === p ? 'primary' : 'subtle'"
                @click="eventState.preset = p"
              >
                {{ p }}
              </EblBtn>
            </div>
          </div>

          <div class="control-group">
            <label>Range</label>
            <div>
              <EblSwitch v-model="eventState.range" label="Range 모드" />
            </div>
          </div>

          <div class="control-actions">
            <EblBtn color="primary" block @click="resetEvents">이벤트 로그 초기화</EblBtn>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">이벤트 코드</p>
          <CodeGroup :items="eventCodeItems" dark />
        </div>
      </div>
    </section>

    <section class="guide-section">
      <h3>메시지 확인</h3>
      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview">
          <div class="d-flex flex-column" style="gap: 24px">
            <div>
              <p class="preview-label">헬퍼 메시지 예제</p>
              <EblDatePicker
                v-model="messageState.helperValue"
                preset="date"
                :auto-apply="true"
                helper-message="날짜를 선택해주세요 (YYYY-MM-DD)"
                placeholder="날짜 선택"
              />
            </div>

            <div>
              <p class="preview-label">에러 메시지 예제 (오늘 이전 선택 시 에러)</p>
              <EblDatePicker
                v-model="messageState.errorValue"
                preset="date"
                :auto-apply="true"
                :error="isErrorDate"
                error-message="오늘 이후의 날짜를 선택해주세요"
                placeholder="날짜 선택"
              />
            </div>
          </div>
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <p class="preview-value">헬퍼 값: {{ messageState.helperValue || '선택 안 됨' }}</p>
            <p class="preview-value">에러 값: {{ messageState.errorValue || '선택 안 됨' }}</p>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">메시지 코드</p>
          <CodeGroup :items="messageCodeItems" dark />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'guide' })

const presetOptions = ['date', 'datetime', 'time', 'month', 'year']
const sizeOptions = ['small', 'medium', 'large']
const modelTypeOptions = ['format', 'timestamp', 'string', 'date']

const state = reactive({
  value: '',
  preset: 'date',
  size: 'medium',
  range: false,
  placeholder: 'yyyy-MM-dd',
  format: '',
  modelType: 'format',
  autoApply: true,
  textInput: true,
  disabled: false,
  readonly: false,
  clearable: true,
})

const displayValue = computed(() => {
  if (state.range) return formatRange(state.value)
  return state.value || '선택 안 됨'
})

const codeSnippet = computed(() => {
  const lines = [
    '<EblDatePicker',
    '  v-model="value"',
    `  preset="${state.preset}"`,
    state.size !== 'medium' ? `  size="${state.size}"` : '',
    state.range ? '  range' : '',
    state.placeholder ? `  placeholder="${state.placeholder}"` : '',
    state.format ? `  format="${state.format}"` : '',
    state.modelType !== 'format' ? `  model-type="${state.modelType}"` : '',
    !state.autoApply ? '  :auto-apply="false"' : '',
    !state.textInput ? '  :text-input="false"' : '',
    state.disabled ? '  disabled' : '',
    state.readonly ? '  readonly' : '',
    '/>',
  ].filter(Boolean)
  return lines.join('\n')
})

const actionState = reactive({ value: [], preset: 'date' })
const actionCodeItems = [
  {
    title: 'Template',
    language: 'vue',
    code: [
      '<EblDatePicker',
      '  v-model="actionState.value"',
      '  :start-date="prevMonthStart"',
      '  :focus-start-date="true"',
      '  preset="date"',
      '  :range="true"',
      '>',
      '  <template #action-row="{ selectDate, closePicker, disabled }">',
      '    <div class="w-100 d-flex ga-2" style="align-items: center">',
      '      <VSpacer />',
      '      <EblBtn small color="primary" :disabled="disabled" @click="selectPrev(7, selectDate)">이전 1주일</EblBtn>',
      '      <EblBtn small color="primary" :disabled="disabled" @click="selectPrev(30, selectDate)">이전 30일</EblBtn>',
      '      <EblBtn small color="primary" :disabled="disabled" @click="selectPrev(365, selectDate)">이전 1년</EblBtn>',
      '      <EblBtn small :outlined="true" :disabled="disabled" @click="selectDate?.()">적용</EblBtn>',
      '      <EblBtn small :outlined="true" :disabled="disabled" @click="closePicker?.()">닫기</EblBtn>',
      '    </div>',
      '  </template>',
      '</EblDatePicker>',
    ].join('\n'),
  },
  {
    title: 'Script',
    language: 'javascript',
    code: [
      'const actionState = reactive({ value: [], preset: "date" })',
      'const prevMonthStart = computed(() => {',
      '  const now = new Date()',
      '  return new Date(now.getFullYear(), now.getMonth() - 1, 1)',
      '})',
      'function selectPrev(days, selectDate) {',
      '  const today = new Date()',
      '  const start = new Date(today)',
      '  start.setDate(start.getDate() - days)',
      '  actionState.value = [start, today]',
      '  if (selectDate) nextTick(() => selectDate())',
      '}',
    ].join('\n'),
  },
]

const eventState = reactive({ value: '', preset: 'date', range: false })
const eventLog = ref([])
const eventCodeItems = [
  {
    title: 'Template',
    language: 'vue',
    code: [
      '<EblDatePicker',
      '  v-model="eventState.value"',
      '  :preset="eventState.preset"',
      '  :range="eventState.range"',
      '  :auto-apply="true"',
      '  :text-input="true"',
      '  @open="onOpen"',
      '  @closed="onClosed"',
      '  @text-input="onTextInput"',
      '  @clear="onClear"',
      '  @update-month-year="onUpdateMonthYear"',
      '  @day-click="onDayClick"',
      '  @focus="onFocus"',
      '  @blur="onBlur"',
      '/>',
      '<ul>',
      '  <li v-for="(e, idx) in eventLog" :key="idx">{{ e }}</li>',
      '</ul>',
    ].join('\n'),
  },
  {
    title: 'Script',
    language: 'javascript',
    code: [
      'const eventState = reactive({ value: "", preset: "date", range: false })',
      'const eventLog = ref([])',
      'function pushEvent(label, payload) {',
      '  const text = payload ? `${label}: ${JSON.stringify(payload)}` : label',
      '  eventLog.value.unshift(text)',
      '  if (eventLog.value.length > 8) eventLog.value.pop()',
      '}',
      'const onOpen = () => pushEvent("열기")',
      'const onClosed = () => pushEvent("닫기")',
      'const onTextInput = (event, parsedDate) => {',
      '  const inputValue = event?.target?.value || ""',
      '  pushEvent("텍스트-입력", `${inputValue}${parsedDate ? ` (파싱: ${formatYMD(parsedDate)})` : " (파싱 실패)"}`)',
      '}',
      'const onClear = () => pushEvent("초기화")',
      'const onUpdateMonthYear = (payload) => pushEvent("월-년-변경", payload)',
      'const onDayClick = (payload) => pushEvent("날짜-클릭", payload)',
      'const onFocus = () => pushEvent("포커스")',
      'const onBlur = () => pushEvent("블러")',
    ].join('\n'),
  },
]

const messageState = reactive({
  helperValue: '',
  errorValue: '',
})
const messageCodeItems = [
  {
    title: 'Template',
    language: 'vue',
    code: [
      '<EblDatePicker',
      '  v-model="messageState.helperValue"',
      '  preset="date"',
      '  :auto-apply="true"',
      '  helper-message="날짜를 선택해주세요 (YYYY-MM-DD)"',
      '  placeholder="날짜 선택"',
      '/>',
      '',
      '<EblDatePicker',
      '  v-model="messageState.errorValue"',
      '  preset="date"',
      '  :auto-apply="true"',
      '  :error="isErrorDate"',
      '  error-message="오늘 이후의 날짜를 선택해주세요"',
      '  placeholder="날짜 선택"',
      '/>',
    ].join('\n'),
  },
  {
    title: 'Script',
    language: 'javascript',
    code: [
      'const messageState = reactive({',
      '  helperValue: "",',
      '  errorValue: "",',
      '})',
      '',
      'const isErrorDate = computed(() => {',
      '  if (!messageState.errorValue) return false',
      '  const selected = new Date(messageState.errorValue)',
      '  const today = new Date()',
      '  today.setHours(0, 0, 0, 0)',
      '  return selected < today',
      '})',
    ].join('\n'),
  },
]

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatYMD(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const prevMonthStart = computed(() => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() - 1, 1)
})

function selectPrev(days, selectDate) {
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - days)
  actionState.value = [start, today]
  if (selectDate) nextTick(() => selectDate?.())
}

const isErrorDate = computed(() => {
  if (!messageState.errorValue) return false
  const selected = new Date(messageState.errorValue)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selected < today
})

function pushEvent(label, payload) {
  const text = payload ? `${label}: ${JSON.stringify(payload)}` : label
  eventLog.value.unshift(text)
  if (eventLog.value.length > 8) eventLog.value.pop()
}

function onOpen() {
  pushEvent('열기')
}
function onClosed() {
  pushEvent('닫기')
}
function onTextInput(event, parsedDate) {
  const inputValue = event?.target?.value || ''
  pushEvent(
    '텍스트-입력',
    `${inputValue}${parsedDate ? ` (파싱: ${formatYMD(parsedDate)})` : ' (파싱 실패)'}`,
  )
}
function onClear() {
  pushEvent('초기화')
}
function onUpdateMonthYear(payload) {
  pushEvent('월-년-변경', payload)
}
function onDayClick(payload) {
  pushEvent('날짜-클릭', payload)
}
function onFocus() {
  pushEvent('포커스')
}
function onBlur() {
  pushEvent('블러')
}

function resetState() {
  state.value = ''
  state.preset = 'date'
  state.size = 'medium'
  state.range = false
  state.placeholder = 'yyyy-MM-dd'
  state.format = ''
  state.modelType = 'format'
  state.autoApply = true
  state.textInput = true
  state.disabled = false
  state.readonly = false
}

function resetEvents() {
  eventState.value = ''
  eventState.preset = 'date'
  eventState.range = false
  eventLog.value = []
}

function setPreset(preset) {
  state.preset = preset
  state.placeholder = getPlaceholder(preset, state.range)
  state.value = state.range ? [] : ''
}

watch(
  () => state.preset,
  () => {
    state.placeholder = getPlaceholder(state.preset, state.range)
    state.value = state.range ? [] : ''
  },
)

watch(
  () => state.range,
  () => {
    state.placeholder = getPlaceholder(state.preset, state.range)
    state.value = state.range ? [] : ''
  },
)

function formatRange(value) {
  if (!Array.isArray(value) || value.length === 0) return '선택 안 됨'
  return value.filter(Boolean).join('  ~  ')
}

function getPlaceholder(preset, range) {
  const base = {
    date: 'yyyy-MM-dd',
    datetime: 'yyyy-MM-dd HH:mm',
    time: 'HH:mm',
    month: 'yyyy-MM',
    year: 'yyyy',
  }[preset]
  if (!range) return base
  return `${base} ~ ${base}`
}
</script>
