<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #tooltip>
        •환경 설정 메뉴를 통해 내 정보 관리 및 알림 설정, 선사 ID 매핑 등이 가능합니다.<br />
        •사용자별로 알람 이벤트를 선택하여 변경할 수 있습니다.
      </template>
    </EblPageHeader>
    <div class="ebl-card-container">
      <!-- Configuration Settings Section -->
      <EblSubHeader class="cursor-pointer" @click="configOpen = !configOpen">
        <h2>Configuration Settings</h2>
        <template #util>
          <VIcon
            icon="ebli:chevron-up"
            size="20"
            class="ma-2"
            :class="{ 'rotate-180': !configOpen }"
          />
        </template>
      </EblSubHeader>

      <v-expand-transition>
        <EblInfo v-show="configOpen" style="--ebl-info-label-width: 170px">
          <EblInfoItem label="Profile Change" hasInput class="px-4">
            <EblBtn outlined>Shortcut</EblBtn>
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem
            v-if="userType === 'carrier'"
            label="Departure/Arrival"
            hasInput
            class="px-4"
          >
            <EblBtn outlined>Shortcut</EblBtn>
          </EblInfoItem>
          <VDivider v-if="userType === 'carrier'" class="my-2" />

          <EblInfoItem
            v-if="userType === 'carrier'"
            label="Reverse Side T&C Mgmt"
            hasInput
            class="px-4"
          >
            <EblBtn outlined>Shortcut</EblBtn>
          </EblInfoItem>
          <VDivider v-if="userType === 'carrier'" class="my-2" />

          <EblInfoItem label="Sign Mgmt" hasInput class="px-4">
            <EblBtn outlined>Shortcut</EblBtn>
          </EblInfoItem>
          <VDivider class="my-2" />

          <EblInfoItem v-if="userType === 'carrier'" label="Container Mgmt" hasInput class="px-4">
            <EblBtn outlined>Shortcut</EblBtn>
          </EblInfoItem>
          <VDivider v-if="userType === 'carrier'" class="my-2" />

          <EblInfoItem
            v-if="userType === 'shipper'"
            label="Carrier ID Mapping"
            hasInput
            class="px-4"
          >
            <EblBtn outlined>Shortcut</EblBtn>
          </EblInfoItem>
          <VDivider v-if="userType === 'shipper'" class="my-2" />
        </EblInfo>
      </v-expand-transition>

      <!-- Alarm Settings Section -->
      <EblSubHeader class="cursor-pointer mt-12" @click="alarmOpen = !alarmOpen">
        <h2>Alarm Setting</h2>
        <template #util>
          <VIcon
            icon="ebli:chevron-up"
            size="20"
            class="ma-2"
            :class="{ 'rotate-180': !alarmOpen }"
          />
        </template>
      </EblSubHeader>

      <v-expand-transition>
        <EblInfo v-show="alarmOpen" style="--ebl-info-label-width: 170px">
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
                  <span class="time-separator">~</span>
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
      </v-expand-transition>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '~/stores/useMainStore'
import { useFormat } from '~/composables/useFormat'

const mainStore = useMainStore()
const { formatNumber } = useFormat()

// 페이지 정보
const pageInfo = ref({
  title: 'Settings',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Settings' }],
})

// 사용자 타입 (선사/화주/은행)
const userType = computed(() => mainStore.userType)

// Alarm Settings
const alarmSettings = reactive({
  email: true,
  sms: true,
  modifyRequestApproval: true,
  paperConversionRequestApproval: true,
  surrenderRequestApproval: false,
  doNotDisturb: false,
  disturbDays: [],
  startTime: '19:00',
  endTime: '09:00',
})

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

// 섹션 펼침/접힘
const configOpen = ref(true)
const alarmOpen = ref(true)
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
      width: 100px;
    }

    .time-separator {
      color: #6b7280;
      font-weight: 500;
    }
  }
}
</style>
