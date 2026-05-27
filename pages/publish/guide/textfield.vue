<template>
  <div class="pub-guide-layout">
    <h2>EblInput 입력 가이드</h2>
    <p class="guide-subtitle">텍스트 입력 기본 컴포넌트입니다.</p>

    <!-- 1. 라이브 플레이그라운드 -->
    <section class="guide-section">
      <h3>플레이그라운드</h3>

      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview">
          <EblInput
            v-model="state.value"
            :type="state.type"
            :size="state.size"
            :placeholder="state.placeholder"
            :prepend-text="state.prependText || undefined"
            :prepend-icon="state.prependIcon || undefined"
            :append-text="state.appendText || undefined"
            :append-icon="state.appendIcon || undefined"
            :helper-text="state.helperText || undefined"
            :error-message="state.errorMessage || undefined"
            :clearable="state.clearable"
            :counter="state.counter || false"
            :maxlength="state.maxlength || undefined"
            :disabled="state.disabled"
            :readonly="state.readonly"
          />
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <label>타입</label>
            <div class="button-group">
              <EblBtn
                v-for="t in typeOptions"
                :key="t"
                :outlined="state.type !== t"
                :color="state.type === t ? 'primary' : 'subtle'"
                @click="state.type = t"
              >
                {{ t }}
              </EblBtn>
            </div>
          </div>
          <div class="d-flex">
            <div class="control-group">
              <label>기타</label>
              <div class="button-group">
                <EblBtn
                  :outlined="!state.clearable"
                  :color="state.clearable ? 'primary' : 'subtle'"
                  @click="state.clearable = !state.clearable"
                  >clearable</EblBtn
                >
                <EblBtn
                  :outlined="!state.disabled"
                  :color="state.disabled ? 'primary' : 'subtle'"
                  @click="state.disabled = !state.disabled"
                  >disabled</EblBtn
                >
                <EblBtn
                  :outlined="!state.readonly"
                  :color="state.readonly ? 'primary' : 'subtle'"
                  @click="state.readonly = !state.readonly"
                  >readonly</EblBtn
                >
              </div>
            </div>
            <div class="control-group">
              <label>사이즈</label>
              <div class="button-group">
                <EblBtn
                  v-for="s in sizeOptions"
                  :key="s"
                  :outlined="state.size !== s"
                  :color="state.size === s ? 'primary' : 'subtle'"
                  @click="state.size = s"
                >
                  {{ s }}
                </EblBtn>
              </div>
            </div>
          </div>

          <div class="control-group">
            <label>플레이스홀더</label>
            <EblInput v-model="state.placeholder" placeholder="Placeholder" />
          </div>

          <div class="d-flex">
            <div class="control-group">
              <label>프리펜드 텍스트</label>
              <EblInput v-model="state.prependText" placeholder="Prepend Text" />
            </div>

            <div class="control-group">
              <label>어펜드 텍스트</label>
              <EblInput v-model="state.appendText" placeholder="Append Text" />
            </div>
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
                  :color="state.prependIcon === opt.value ? 'primary' : 'ghost'"
                  @click="state.prependIcon = opt.value"
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
                  :color="state.appendIcon === opt.value ? 'primary' : 'ghost'"
                  @click="state.appendIcon = opt.value"
                >
                  <template v-if="opt.value"><VIcon :icon="opt.value" /></template>
                  <template v-else><VIcon icon="mdi-cancel" /></template>
                </EblBtn>
              </div>
            </div>
          </div>

          <div class="control-group">
            <label>메시지</label>
            <EblInput v-model="state.helperText" placeholder="Helper Message" />
            <EblInput
              v-model="state.errorMessage"
              placeholder="Error Message (입력 시 오류 상태)"
            />
          </div>

          <div class="control-group">
            <label>카운터/최대길이</label>
            <div class="d-flex" style="gap: 12px">
              <EblInput v-model="state.counter" type="number" placeholder="counter (숫자)" />
              <EblInput v-model="state.maxlength" type="number" placeholder="maxlength (숫자)" />
            </div>
            <p class="hint">counter 또는 maxlength만 지정해도 됩니다.</p>
          </div>

          <div class="control-actions">
            <EblBtn color="primary" block @click="resetState"> 초기화 </EblBtn>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">생성 코드:</p>
          <CodeBlock :code="generatedCode" language="vue" dark max-height="200px" />
        </div>
      </div>
    </section>

    <!-- 2. 슬롯 예제 -->
    <section class="guide-section">
      <h3>슬롯 예제</h3>

      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview">
          <div style="display: flex; flex-direction: column; gap: 16px; width: 100%">
            <!-- Prepend Slot -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">Prepend 슬롯</p>
              <EblInput v-model="slotExample1" placeholder="커스텀 prepend">
                <template #prepend>
                  <VIcon icon="ebli:search" color="primary" />
                </template>
              </EblInput>
            </div>

            <!-- Append Slot -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">Append 슬롯</p>
              <EblInput v-model="slotExample2" placeholder="커스텀 append">
                <template #append>
                  <EblBtn icon="ebli:chevron-bottom" size="x-small" color="ghost" />
                </template>
              </EblInput>
            </div>

            <!-- All Slots -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">모든 슬롯 조합</p>
              <EblInput v-model="slotExample3" placeholder="전체 슬롯 사용">
                <template #prepend>
                  <VIcon icon="ebli:search" />
                </template>
                <template #append>
                  <EblBtn icon="ebli:chevron-bottom" size="x-small" color="ghost" />
                </template>
              </EblInput>
            </div>
          </div>
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <label>슬롯 값</label>
            <p style="font-size: 12px; color: #666; margin-bottom: 8px">
              slotExample1: {{ slotExample1 || '(empty)' }}
            </p>
            <p style="font-size: 12px; color: #666; margin-bottom: 8px">
              slotExample2: {{ slotExample2 || '(empty)' }}
            </p>
            <p style="font-size: 12px; color: #666; margin-bottom: 8px">
              slotExample3: {{ slotExample3 || '(empty)' }}
            </p>
          </div>
        </div>

        <div class="pub-preview__code">
          <p class="code-label">슬롯 사용 코드:</p>
          <CodeBlock :code="slotCode" language="vue" dark max-height="300px" />
        </div>
      </div>
    </section>

    <!-- 3. 유효성 검사 예제 -->
    <section class="guide-section">
      <h3>유효성 검사 예제</h3>

      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview">
          <div style="display: flex; flex-direction: column; gap: 24px; width: 100%">
            <!-- 필수 입력 -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">필수 입력</p>
              <EblInput
                v-model="validation.required"
                placeholder="필수 입력 필드"
                :error-message="validation.requiredError"
                @blur="validateRequired"
              />
            </div>

            <!-- 이메일 -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">이메일</p>
              <EblInput
                v-model="validation.email"
                type="email"
                placeholder="example@email.com"
                prepend-icon="ebli:attachment"
                :error-message="validation.emailError"
                @input="validateEmail"
              />
            </div>

            <!-- 최소 길이 -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">최소 길이 (4자 이상)</p>
              <EblInput
                v-model="validation.minLength"
                placeholder="최소 4자 입력"
                counter
                :error-message="validation.minLengthError"
                @input="validateMinLength"
              />
            </div>

            <!-- 비밀번호 확인 -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">비밀번호</p>
              <EblInput
                v-model="validation.password"
                type="password"
                placeholder="비밀번호 입력"
                prepend-icon="ebli:filter"
              />
            </div>
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">비밀번호 확인</p>
              <EblInput
                v-model="validation.passwordConfirm"
                type="password"
                placeholder="비밀번호 재입력"
                prepend-icon="ebli:filter"
                :error-message="validation.passwordError"
                @input="validatePassword"
              />
            </div>

            <!-- 숫자만 입력 (패턴) -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">전화번호 (숫자만)</p>
              <EblInput
                v-model="validation.phone"
                placeholder="01012345678"
                prepend-icon="ebli:upload"
                :error-message="validation.phoneError"
                @input="validatePhone"
              />
            </div>
          </div>
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <label>검증 상태</label>
            <div style="font-size: 12px; color: #666; line-height: 1.6">
              <p>✓ 필수: {{ validation.required ? '입력됨' : '미입력' }}</p>
              <p>✓ 이메일: {{ validation.emailError ? '❌' : '✅' }}</p>
              <p>✓ 최소길이: {{ validation.minLengthError ? '❌' : '✅' }}</p>
              <p>✓ 비밀번호: {{ validation.passwordError ? '❌' : '✅' }}</p>
              <p>✓ 전화번호: {{ validation.phoneError ? '❌' : '✅' }}</p>
            </div>
          </div>

          <div class="control-actions">
            <EblBtn color="primary" block @click="resetValidation"> 초기화 </EblBtn>
          </div>
        </div>

        <div class="pub-preview__code">
          <CodeGroup :items="validationCodeItems" dark />
        </div>
      </div>
    </section>

    <!-- 4. 패스워드 보기/숨기기 -->
    <section class="guide-section">
      <h3>패스워드 보기/숨기기</h3>

      <div class="pub-preview--wrap pub-preview--2col">
        <div class="pub-preview__preview">
          <div style="display: flex; flex-direction: column; gap: 24px; width: 100%">
            <!-- 기본 패스워드 -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">기본 패스워드</p>
              <EblInput
                v-model="passwordDemo.password"
                type="password"
                placeholder="비밀번호 입력"
                prepend-icon="ebli:calendar"
              />
            </div>

            <!-- 패스워드 토글 (Append 슬롯 사용) -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">보기/숨기기 토글</p>
              <EblInput
                v-model="passwordDemo.passwordToggle"
                :type="passwordDemo.showPassword ? 'text' : 'password'"
                placeholder="비밀번호 입력"
                prepend-icon="ebli:filter"
              >
                <template #append>
                  <EblBtn
                    :icon="passwordDemo.showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                    size="x-small"
                    color="ghost"
                    @click="passwordDemo.showPassword = !passwordDemo.showPassword"
                  />
                </template>
              </EblInput>
            </div>

            <!-- 보안 강도 표시 -->
            <div>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px">보안 강도 표시</p>
              <EblInput
                v-model="passwordDemo.passwordStrength"
                :type="passwordDemo.showPasswordStrength ? 'text' : 'password'"
                placeholder="비밀번호 입력"
                prepend-icon="ebli:search"
                :helper-text="
                  passwordDemo.passwordStrength
                    ? `보안 강도: ${getPasswordStrength(passwordDemo.passwordStrength)}`
                    : ''
                "
              >
                <template #append>
                  <EblBtn
                    :icon="passwordDemo.showPasswordStrength ? 'ebli:eye-open' : 'ebli:eye-close'"
                    size="x-small"
                    color="ghost"
                    @click="passwordDemo.showPasswordStrength = !passwordDemo.showPasswordStrength"
                  />
                </template>
              </EblInput>
            </div>
          </div>
        </div>

        <div class="pub-preview__controls">
          <div class="control-group">
            <label>상태 정보</label>
            <div style="font-size: 12px; color: #666; line-height: 1.6">
              <p>패스워드: {{ passwordDemo.passwordToggle || '(empty)' }}</p>
              <p>보기 상태: {{ passwordDemo.showPassword ? '보이는 중' : '숨겨진 상태' }}</p>
              <p v-if="passwordDemo.passwordStrength">
                보안 강도: {{ getPasswordStrength(passwordDemo.passwordStrength) }}
              </p>
            </div>
          </div>

          <div class="control-actions">
            <EblBtn color="primary" block @click="resetPasswordDemo"> 초기화 </EblBtn>
          </div>
        </div>

        <div class="pub-preview__code">
          <CodeGroup :items="passwordToggleCodeItems" dark />
        </div>
      </div>
    </section>

    <!-- 5. Props 및 API 문서 -->
    <section class="guide-section">
      <h3>API 문서</h3>
      <PubPropsSection :props="propsData" :events="eventsData" :slots="slotsData" />
    </section>
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

const typeOptions = ['text', 'password', 'email', 'number']
const sizeOptions = ['small', 'medium', 'large']
const iconOptions = [
  { label: '없음', value: '' },
  { label: '검색', value: 'ebli:search' },
  { label: '글로벌', value: 'ebli:global' },
  { label: '필터', value: 'ebli:filter' },
]

const state = reactive({
  value: '',
  type: 'text',
  size: 'medium',
  placeholder: 'Placeholder',
  prependText: '',
  prependIcon: '',
  appendText: '',
  appendIcon: '',
  helperText: '',
  errorMessage: '',
  clearable: false,
  counter: 0,
  maxlength: 0,
  disabled: false,
  readonly: false,
})

const slotExample1 = ref('')
const slotExample2 = ref('')
const slotExample3 = ref('')

// Password demo
const passwordDemo = reactive({
  password: '',
  passwordToggle: '',
  showPassword: false,
  passwordStrength: '',
  showPasswordStrength: false,
})

const getPasswordStrength = (password = '') => {
  if (password.length < 6) return '약함'
  if (password.length < 10 && /[a-z]/.test(password) && /[0-9]/.test(password)) return '보통'
  if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) return '강함'
  if (
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  )
    return '매우 강함'
  return '보통'
}

const resetPasswordDemo = () => {
  Object.assign(passwordDemo, {
    password: '',
    passwordToggle: '',
    showPassword: false,
    passwordStrength: '',
    showPasswordStrength: false,
  })
}

// Validation examples
const validation = reactive({
  required: '',
  requiredError: '',
  email: '',
  emailError: '',
  minLength: '',
  minLengthError: '',
  password: '',
  passwordConfirm: '',
  passwordError: '',
  phone: '',
  phoneError: '',
})

const validateRequired = () => {
  validation.requiredError = validation.required.trim() === '' ? '필수 입력 항목입니다.' : ''
}

const validateEmail = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  validation.emailError =
    validation.email && !emailPattern.test(validation.email) ? '올바른 이메일 형식이 아닙니다.' : ''
}

const validateMinLength = () => {
  validation.minLengthError =
    validation.minLength && validation.minLength.length < 4 ? '최소 4자 이상 입력해주세요.' : ''
}

const validatePassword = () => {
  validation.passwordError =
    validation.passwordConfirm && validation.password !== validation.passwordConfirm
      ? '비밀번호가 일치하지 않습니다.'
      : ''
}

const validatePhone = () => {
  const phonePattern = /^[0-9]+$/
  validation.phoneError =
    validation.phone && !phonePattern.test(validation.phone) ? '숫자만 입력 가능합니다.' : ''
}

const resetValidation = () => {
  Object.assign(validation, {
    required: '',
    requiredError: '',
    email: '',
    emailError: '',
    minLength: '',
    minLengthError: '',
    password: '',
    passwordConfirm: '',
    passwordError: '',
    phone: '',
    phoneError: '',
  })
}

const resetState = () => {
  Object.assign(state, {
    value: '',
    type: 'text',
    size: 'medium',
    placeholder: 'Placeholder',
    prependText: '',
    prependIcon: '',
    appendText: '',
    appendIcon: '',
    helperText: '',
    errorMessage: '',
    clearable: false,
    counter: 0,
    maxlength: 0,
    disabled: false,
    readonly: false,
  })
}

const generatedCode = computed(() => {
  const parts = ['<EblInput v-model="value"']
  if (state.type && state.type !== 'text') parts.push(` type="${state.type}"`)
  if (state.size && state.size !== 'medium') parts.push(` size="${state.size}"`)
  if (state.placeholder) parts.push(` placeholder="${state.placeholder}"`)
  if (state.prependText) parts.push(` prepend-text="${state.prependText}"`)
  if (state.prependIcon) parts.push(` prepend-icon="${state.prependIcon}"`)
  if (state.appendText) parts.push(` append-text="${state.appendText}"`)
  if (state.appendIcon) parts.push(` append-icon="${state.appendIcon}"`)
  if (state.helperText) parts.push(` helper-text="${state.helperText}"`)
  if (state.errorMessage) parts.push(` error-message="${state.errorMessage}"`)
  if (state.clearable) parts.push(' clearable')
  if (state.counter && Number(state.counter) > 0) parts.push(` :counter="${Number(state.counter)}"`)
  if (state.maxlength && Number(state.maxlength) > 0)
    parts.push(` :maxlength="${Number(state.maxlength)}"`)
  if (state.disabled) parts.push(' disabled')
  if (state.readonly) parts.push(' readonly')
  parts.push(' />')
  return parts.join('')
})

const slotCode = `<!-- Prepend 슬롯 -->
<EblInput v-model="value" placeholder="커스텀 prepend">
  <template #prepend>
    <VIcon icon="ebli:search" color="primary" />
  </template>
</EblInput>

<!-- Append 슬롯 -->
<EblInput v-model="value" placeholder="커스텀 append">
  <template #append>
    <EblBtn icon="ebli:chevron-bottom" size="x-small" color="ghost" />
  </template>
</EblInput>

<!-- 모든 슬롯 조합 -->
<EblInput v-model="value" placeholder="전체 슬롯 사용">
  <template #prepend>
    <VIcon icon="ebli:search" />
  </template>
  <template #append>
    <EblBtn icon="ebli:chevron-bottom" size="x-small" color="ghost" />
  </template>
</EblInput>`

const validationCodeItems = computed(() => [
  {
    title: 'Script',
    code: validationScriptCode,
    language: 'javascript',
  },
  {
    title: 'Template',
    code: validationTemplateCode,
    language: 'vue',
  },
])

const validationScriptCode = `import { reactive } from 'vue'

const validation = reactive({
  required: '',
  requiredError: '',
  email: '',
  emailError: '',
  minLength: '',
  minLengthError: '',
  password: '',
  passwordConfirm: '',
  passwordError: '',
  phone: '',
  phoneError: '',
})

// 필수 입력 검증
const validateRequired = () => {
  validation.requiredError = validation.required.trim() === ''
    ? '필수 입력 항목입니다.'
    : ''
}

// 이메일 검증
const validateEmail = () => {
  const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
  validation.emailError = validation.email && !emailPattern.test(validation.email)
    ? '올바른 이메일 형식이 아닙니다.'
    : ''
}

// 최소 길이 검증
const validateMinLength = () => {
  validation.minLengthError = validation.minLength && validation.minLength.length < 4
    ? '최소 4자 이상 입력해주세요.'
    : ''
}

// 비밀번호 일치 검증
const validatePassword = () => {
  validation.passwordError = validation.passwordConfirm &&
    validation.password !== validation.passwordConfirm
    ? '비밀번호가 일치하지 않습니다.'
    : ''
}

// 숫자만 입력 검증
const validatePhone = () => {
  const phonePattern = /^[0-9]+$/
  validation.phoneError = validation.phone && !phonePattern.test(validation.phone)
    ? '숫자만 입력 가능합니다.'
    : ''
}`

const validationTemplateCode = `  <!-- 필수 입력 -->
  <EblInput
    v-model="validation.required"
    placeholder="필수 입력 필드"
    :error-message="validation.requiredError"
    @blur="validateRequired"
  />

  <!-- 이메일 -->
  <EblInput
    v-model="validation.email"
    type="email"
    placeholder="example@email.com"
    :error-message="validation.emailError"
    @input="validateEmail"
  />

  <!-- 최소 길이 -->
  <EblInput
    v-model="validation.minLength"
    placeholder="최소 4자 입력"
    counter
    :error-message="validation.minLengthError"
    @input="validateMinLength"
  />

  <!-- 비밀번호 확인 -->
  <EblInput
    v-model="validation.password"
    type="password"
    placeholder="비밀번호 입력"
  />
  <EblInput
    v-model="validation.passwordConfirm"
    type="password"
    placeholder="비밀번호 재입력"
    :error-message="validation.passwordError"
    @input="validatePassword"
  />

  <!-- 숫자만 입력 -->
  <EblInput
    v-model="validation.phone"
    placeholder="01012345678"
    :error-message="validation.phoneError"
    @input="validatePhone"
  />`

const validationCode = `import { reactive } from 'vue'

const validation = reactive({
  required: '',
  requiredError: '',
  email: '',
  emailError: '',
  minLength: '',
  minLengthError: '',
  password: '',
  passwordConfirm: '',
  passwordError: '',
  phone: '',
  phoneError: '',
})

// 필수 입력 검증
const validateRequired = () => {
  validation.requiredError = validation.required.trim() === ''
    ? '필수 입력 항목입니다.'
    : ''
}

// 이메일 검증
const validateEmail = () => {
  const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
  validation.emailError = validation.email && !emailPattern.test(validation.email)
    ? '올바른 이메일 형식이 아닙니다.'
    : ''
}

// 최소 길이 검증
const validateMinLength = () => {
  validation.minLengthError = validation.minLength && validation.minLength.length < 4
    ? '최소 4자 이상 입력해주세요.'
    : ''
}

// 비밀번호 일치 검증
const validatePassword = () => {
  validation.passwordError = validation.passwordConfirm &&
    validation.password !== validation.passwordConfirm
    ? '비밀번호가 일치하지 않습니다.'
    : ''
}

// 숫자만 입력 검증
const validatePhone = () => {
  const phonePattern = /^[0-9]+$/
  validation.phoneError = validation.phone && !phonePattern.test(validation.phone)
    ? '숫자만 입력 가능합니다.'
    : ''
}

// Template
  <!-- 필수 입력 -->
  <EblInput
    v-model="validation.required"
    placeholder="필수 입력 필드"
    :error-message="validation.requiredError"
    @blur="validateRequired"
  />

  <!-- 이메일 -->
  <EblInput
    v-model="validation.email"
    type="email"
    placeholder="example@email.com"
    :error-message="validation.emailError"
    @input="validateEmail"
  />

  <!-- 최소 길이 -->
  <EblInput
    v-model="validation.minLength"
    placeholder="최소 4자 입력"
    counter
    :error-message="validation.minLengthError"
    @input="validateMinLength"
  />

  <!-- 비밀번호 확인 -->
  <EblInput
    v-model="validation.password"
    type="password"
    placeholder="비밀번호 입력"
  />
  <EblInput
    v-model="validation.passwordConfirm"
    type="password"
    placeholder="비밀번호 재입력"
    :error-message="validation.passwordError"
    @input="validatePassword"
  />

  <!-- 숫자만 입력 -->
  <EblInput
    v-model="validation.phone"
    placeholder="01012345678"
    :error-message="validation.phoneError"
    @input="validatePhone"
  />`

const passwordToggleCodeItems = computed(() => [
  {
    title: 'Script',
    code: passwordToggleScriptCode,
    language: 'javascript',
  },
  {
    title: 'Template',
    code: passwordToggleTemplateCode,
    language: 'vue',
  },
])

const passwordToggleScriptCode = `import { reactive } from 'vue'

const passwordForm = reactive({
  passwordToggle: '',
  showPassword: false,
  passwordStrength: '',
  showPasswordStrength: false,
})

const getPasswordStrength = (password) => {
  if (password.length < 6) return '약함'
  if (password.length < 10 && /[a-z]/.test(password) && /[0-9]/.test(password)) return '보통'
  if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) return '강함'
  if (
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  )
    return '매우 강함'
  return '보통'
}`

const passwordToggleTemplateCode = `  <!-- 기본 패스워드 입력 -->
  <EblInput
    v-model="passwordForm.password"
    type="password"
    placeholder="비밀번호 입력"
  />

  <!-- 패스워드 보기/숨기기 토글 -->
  <EblInput
    v-model="passwordForm.passwordToggle"
    :type="passwordForm.showPassword ? 'text' : 'password'"
    placeholder="비밀번호 입력"
  >
    <template #append>
      <EblBtn
        :icon="passwordForm.showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
        size="x-small"
        color="ghost"
        @click="passwordForm.showPassword = !passwordForm.showPassword"
      />
    </template>
  </EblInput>

  <!-- 패스워드 강도 표시 -->
  <EblInput
    v-model="passwordForm.passwordStrength"
    :type="passwordForm.showPasswordStrength ? 'text' : 'password'"
    placeholder="비밀번호 입력"
    :helper-text="
      passwordForm.passwordStrength
        ? \`강도: \${getPasswordStrength(passwordForm.passwordStrength)}\`
        : ''
    "
  >
    <template #append>
      <EblBtn
        :icon="passwordForm.passwordStrength ? 'ebli:eye-open' : 'ebli:eye-close'"
        size="x-small"
        color="ghost"
        @click="passwordForm.showPasswordStrength = !passwordForm.showPasswordStrength"
      />
    </template>
  </EblInput>`

const propsData = [
  { name: 'modelValue', type: 'String | Number', default: "''", desc: 'v-model 바인딩 값' },
  {
    name: 'type',
    type: 'String',
    default: "'text'",
    desc: '입력 타입 (text, password, email, number 등)',
  },
  {
    name: 'size',
    type: 'String',
    default: "'medium'",
    desc: '입력 크기 (small: 28px, medium: 36px, large: 48px)',
  },
  { name: 'placeholder', type: 'String', default: "''", desc: '플레이스홀더 텍스트' },
  { name: 'prependText', type: 'String', default: "''", desc: '입력 앞 텍스트' },
  { name: 'prependIcon', type: 'String', default: "''", desc: '입력 앞 아이콘 클래스' },
  { name: 'appendText', type: 'String', default: "''", desc: '입력 뒤 텍스트' },
  { name: 'appendIcon', type: 'String', default: "''", desc: '입력 뒤 아이콘 클래스' },
  { name: 'helperText', type: 'String', default: "''", desc: '헬퍼 메시지' },
  { name: 'errorMessage', type: 'String', default: "''", desc: '에러 메시지 (표시 시 오류 상태)' },
  { name: 'clearable', type: 'Boolean', default: 'false', desc: '입력값 삭제 버튼 표시' },
  {
    name: 'counter',
    type: 'Boolean | Number',
    default: 'false',
    desc: '글자수 카운터(숫자 지정 시 최대치 표시)',
  },
  { name: 'maxlength', type: 'String | Number', default: 'undefined', desc: '최대 입력 길이' },
  { name: 'disabled', type: 'Boolean', default: 'false', desc: '비활성화' },
  { name: 'readonly', type: 'Boolean', default: 'false', desc: '읽기 전용' },
]

const eventsData = [
  { name: 'update:modelValue', payload: 'value', desc: '입력값 변경(v-model)' },
  { name: 'focus', payload: 'event', desc: '포커스 시 발생' },
  { name: 'blur', payload: 'event', desc: '블러 시 발생' },
  { name: 'input', payload: 'value', desc: '입력 중 발생' },
  { name: 'clear', payload: '-', desc: 'Clear 버튼 클릭 시' },
]

const slotsData = [
  { name: 'prependText', desc: '입력 앞 텍스트 영역 커스텀 컨텐츠' },
  { name: 'prepend', desc: '입력 앞 아이콘 영역 커스텀 컨텐츠 (prependIcon보다 우선)' },
  { name: 'appendText', desc: '입력 뒤 텍스트 영역 커스텀 컨텐츠' },
  { name: 'append', desc: '입력 뒤 아이콘 영역 커스텀 컨텐츠 (appendIcon보다 우선)' },
  {
    name: 'message',
    desc: '헬퍼/에러 메시지 영역 커스텀 (slot props: text, is-error)',
  },
]
</script>

<style scoped></style>
