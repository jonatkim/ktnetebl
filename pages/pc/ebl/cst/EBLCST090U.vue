<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #tooltip>
        •알림 관련 설정을 할 수 있습니다.<br />
        •사용자별로 알람 이벤트를 선택하여 변경할 수 있습니다.
      </template>
      <template #util>
        <EblBtn large color="outlined" @click="resetForm">Cancel</EblBtn>
        <EblBtn color="cta" large :disabled="!isFormChanged" @click="saveForm">Save</EblBtn>
      </template>
    </EblPageHeader>
    <div class="ebl-card-container">
      <!-- Alarm Settings Section -->
      <EblSubHeader>
        <h2>Notification Info</h2>
      </EblSubHeader>

      <EblInfo style="--ebl-info-label-width: 170px">
        <EblInfoItem
          label="Alarm Type"
          tooltip="알림은 SMS 메시지 수신 건수 제한을 받습니다."
          class="px-4"
        >
          <div class="checkbox-row">
            <EblCheckbox v-model="alarmSettings.email">E-Mail</EblCheckbox>
            <EblCheckbox v-model="alarmSettings.sms">SMS</EblCheckbox>
          </div>
        </EblInfoItem>

        <VDivider class="my-2" />
        <EblInfoItem label="Message Alarm" class="px-4">
          <div class="checkbox-row">
            <EblCheckbox v-model="alarmSettings.modifyRequestApproval"
              >수정 요청 승인대기</EblCheckbox
            >
            <EblCheckbox v-model="alarmSettings.paperConversionRequestApproval">
              종이변환 요청 승인대기
            </EblCheckbox>
            <EblCheckbox v-model="alarmSettings.surrenderRequestApproval"
              >써랜더 요청 승인대기</EblCheckbox
            >
          </div>
        </EblInfoItem>

        <VDivider class="my-2" />
        <EblInfoItem label="Do Not Disturb mode" class="px-4">
          <EblCheckbox v-model="alarmSettings.doNotDisturb">
            선택한 설정과 시간에 알림 받지 않음
          </EblCheckbox>
          <!-- Day Selection (visible only if Do Not Disturb is enabled) -->
          <div v-if="alarmSettings.doNotDisturb">
            <VDivider class="my-3 mr-n4" />
            <div class="day-selection">
              <EblBtn
                v-for="day in days"
                :key="day.value"
                pill
                icon
                :outlined="!alarmSettings.disturbDays.includes(day.value)"
                :color="alarmSettings.disturbDays.includes(day.value) ? 'primary' : ''"
                class="day-btn"
                @click="toggleDay(day.value)"
              >
                {{ day.label }}
              </EblBtn>
            </div>
            <VDivider class="my-3 mr-n4" />
            <!-- Time Selection -->
            <div class="time-selection">
              <div class="time-input-group">
                <EblSelect
                  v-model="alarmSettings.startTime"
                  :options="timeOptions"
                  class="time-input"
                />
                <span class="time-separator">-</span>
                <EblSelect
                  v-model="alarmSettings.endTime"
                  :options="endTimeOptions"
                  class="time-input"
                />
              </div>
            </div>
          </div>
        </EblInfoItem>
        <VDivider class="my-2" />
      </EblInfo>
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from '~/stores/toast'
import { useDialogStore } from '~/stores/useDialogStore'

const toastStore = useToastStore()
const dialogStore = useDialogStore()

// 페이지 정보
const pageInfo = ref({
  title: 'Notification Settings',
  breadcrumbItems: [{ text: 'Settings' }, { text: 'Notification Settings' }],
})

// alarmSettings 기본값
const initialAlarmSettings = {
  email: true,
  sms: true,
  modifyRequestApproval: true,
  paperConversionRequestApproval: true,
  surrenderRequestApproval: false,
  doNotDisturb: false,
  disturbDays: [],
  startTime: '19:00',
  endTime: '09:00',
}
const alarmSettings = reactive({ ...initialAlarmSettings })

// 변경 감지
const isFormChanged = computed(() =>
  Object.keys(initialAlarmSettings).some((key) => {
    if (Array.isArray(alarmSettings[key])) {
      return (
        alarmSettings[key].length !== initialAlarmSettings[key].length ||
        alarmSettings[key].some((v, i) => v !== initialAlarmSettings[key][i])
      )
    }
    return alarmSettings[key] !== initialAlarmSettings[key]
  }),
)

// 리셋
const resetForm = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: 'Discard Changes',
    message: 'Any unsaved changes will be lost.\nDo you want to reset the fields?',
    confirmText: 'Reset',
  })
  if (confirmed) {
    Object.keys(alarmSettings).forEach((key) => {
      if (Array.isArray(initialAlarmSettings[key])) {
        alarmSettings[key] = [...initialAlarmSettings[key]]
      } else {
        alarmSettings[key] = initialAlarmSettings[key]
      }
    })
  }
}

// 저장
const saveForm = () => {
  // TODO: API 호출 등 저장 로직
  Object.keys(alarmSettings).forEach((key) => {
    if (Array.isArray(alarmSettings[key])) {
      initialAlarmSettings[key] = [...alarmSettings[key]]
    } else {
      initialAlarmSettings[key] = alarmSettings[key]
    }
  })
  toastStore.add({ text: 'Saved successfully.' })
}

// Days of week
const days = [
  { label: '월', value: 'MON' },
  { label: '화', value: 'TUE' },
  { label: '수', value: 'WED' },
  { label: '목', value: 'THU' },
  { label: '금', value: 'FRI' },
  { label: '토', value: 'SAT' },
  { label: '일', value: 'SUN' },
]

// Time options (30-minute intervals)
const timeOptions = computed(() => {
  const options = []
  for (let i = 0; i < 24; i++) {
    options.push(
      { label: `${String(i).padStart(2, '0')}:00`, value: `${String(i).padStart(2, '0')}:00` },
      { label: `${String(i).padStart(2, '0')}:30`, value: `${String(i).padStart(2, '0')}:30` },
    )
  }
  return options
})

// End time options (only times after start time)
const endTimeOptions = computed(() => {
  const options = []
  const [startHour, startMinute] = alarmSettings.startTime.split(':').map(Number)

  for (let i = 0; i < 24; i++) {
    const times = [
      { hour: i, minute: 0, value: `${String(i).padStart(2, '0')}:00` },
      { hour: i, minute: 30, value: `${String(i).padStart(2, '0')}:30` },
    ]

    times.forEach((time) => {
      // startTime보다 큰 시간만 추가
      if (time.hour > startHour || (time.hour === startHour && time.minute > startMinute)) {
        options.push({ label: time.value, value: time.value })
      }
    })
  }

  return options
})

// Toggle day selection
const toggleDay = (day) => {
  const index = alarmSettings.disturbDays.indexOf(day)
  if (index > -1) {
    alarmSettings.disturbDays.splice(index, 1)
  } else {
    alarmSettings.disturbDays.push(day)
  }
}
</script>

<style scoped lang="scss">
.day-selection {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  .day-btn {
    min-width: 40px;
    min-height: 40px;
  }
}

.time-selection {
  .time-input-group {
    display: flex;
    gap: 8px;
    align-items: center;

    .time-input {
      width: 150px;
    }

    .time-separator {
      color: #6b7280;
      font-weight: 500;
    }
  }
}
</style>
