<template>
  <div class="ebl-page-container">
    <EblSubHeader title="Notification" small class="mb-3" style="min-height: 24px" />
    <div class="ebl-setting-box">
      <h3 class="ebl-setting-box__label">Alarm Type</h3>
      <div class="ebl-setting-box__item">
        <span class="label">E-Mail</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
      <div class="ebl-setting-box__item">
        <span class="label">SMS</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
      <div class="ebl-setting-box__desc">알림톡SMS 메시지 수신 시 건당 비용이 발생합니다.</div>
    </div>
    <div v-if="userType === 'carrier'" class="ebl-setting-box">
      <h3 class="ebl-setting-box__label">Message Alarm</h3>
      <div class="ebl-setting-box__item">
        <span class="label">수정 요청 승인대기</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
      <div class="ebl-setting-box__item">
        <span class="label">종이변환 요청 승인대기</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
      <div class="ebl-setting-box__item">
        <span class="label">써랜더 요청 승인대기</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
    </div>
    <div v-if="userType === 'shipper'" class="ebl-setting-box">
      <h3 class="ebl-setting-box__label">Message Alarm</h3>
      <div class="ebl-setting-box__item">
        <span class="label">eBL 발행</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
      <div class="ebl-setting-box__item">
        <span class="label">요청 응답</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
      <div class="ebl-setting-box__item">
        <span class="label">양도 요청 승인대기</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
    </div>
    <div v-else class="ebl-setting-box">
      <h3 class="ebl-setting-box__label">Message Alarm</h3>
      <div class="ebl-setting-box__item">
        <span class="label">요청 응답</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
      <div class="ebl-setting-box__item">
        <span class="label">양도 요청 승인대기</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
    </div>
    <div class="ebl-setting-box">
      <h3 class="ebl-setting-box__label">Do Not Disturb mode</h3>
      <div class="ebl-setting-box__item">
        <span class="label">선택한 요일과 시간에 알림 받지 않음</span>
        <EblSwitch v-model="dummyCheck" />
      </div>
      <div class="ebl-setting-box__item">
        <div class="ebl-day-selection">
          <EblBtn
            v-for="day in days"
            :key="day.value"
            pill
            :outlined="!disturbDays.includes(day.value)"
            :color="disturbDays.includes(day.value) ? 'primary' : ''"
            class="day-btn"
            :class="{ 'day-btn--active': disturbDays.includes(day.value) }"
            @click="toggleDay(day.value)"
          >
            {{ day.label }}
          </EblBtn>
        </div>
      </div>
      <div class="ebl-setting-box__item">
        <div class="ebl-time-selection">
          <EblSelect
            v-model="alarmSettings.startTime"
            :options="timeOptions"
            class="time-input"
            @update:model-value="(val) => (alarmSettings.startTime = val)"
          />
          <span class="time-separator">-</span>
          <EblSelect
            v-model="alarmSettings.endTime"
            :options="endTimeOptions"
            class="time-input"
            @update:model-value="(val) => (alarmSettings.endTime = val)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useMainStore } from '~/stores/useMainStore'

// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'Detail',
  appbarTitle: 'Settings',
})

// ============================================
// Store
// ============================================
const mainStore = useMainStore()

// ============================================
// 기본 State
// ============================================
const dummyCheck = ref(false)
const disturbDays = ref(['MON', 'TUE', 'WED', 'THU', 'FRI'])
const alarmSettings = reactive({
  startTime: '01:00',
  endTime: '10:00',
})

// 사용자 타입 (선사/화주/은행)
const userType = computed(() => mainStore.userType)

// ============================================
// 요일 목록
// ============================================
const days = [
  { label: '월', value: 'MON' },
  { label: '화', value: 'TUE' },
  { label: '수', value: 'WED' },
  { label: '목', value: 'THU' },
  { label: '금', value: 'FRI' },
  { label: '토', value: 'SAT' },
  { label: '일', value: 'SUN' },
]

// ============================================
// 시간 옵션
// ============================================
// Start time 옵션 (30분 단위 - 문자열 배열)
const timeOptions = computed(() => {
  const options = []
  for (let i = 0; i < 24; i++) {
    options.push(`${String(i).padStart(2, '0')}:00`, `${String(i).padStart(2, '0')}:30`)
  }
  return options
})

// End time 옵션 (Start time 이후의 시간만 - 문자열 배열)
const endTimeOptions = computed(() => {
  const options = []
  const [startHour, startMinute] = alarmSettings.startTime.split(':').map(Number)

  for (let i = 0; i < 24; i++) {
    for (const min of [0, 30]) {
      const optionValue = `${String(i).padStart(2, '0')}:${String(min).padStart(2, '0')}`
      const optionHour = i
      const optionMinute = min

      // startTime 이후 시간만 포함
      if (optionHour > startHour || (optionHour === startHour && optionMinute > startMinute)) {
        options.push(optionValue)
      }
    }
  }

  return options
})

watch(
  () => alarmSettings.startTime,
  () => {
    if (!endTimeOptions.value.includes(alarmSettings.endTime)) {
      alarmSettings.endTime = endTimeOptions.value[0] || ''
    }
  },
)

// ============================================
// 함수
// ============================================
// 요일 토글
const toggleDay = (day) => {
  const index = disturbDays.value.indexOf(day)
  if (index > -1) {
    disturbDays.value.splice(index, 1)
  } else {
    disturbDays.value.push(day)
  }
}
</script>
