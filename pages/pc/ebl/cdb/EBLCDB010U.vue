<template>
  <div class="ebl-page-container">
    <EblPageHeader title="Dashboard" />
    <div class="ebl-card-container">
      <!-- In-Progress Tasks Section -->
      <EblSubHeader>
        <h2>In-Progress Tasks</h2>
        <template #util>
          <EblBtn outlined icon="ebli:setting" @click="openTaskDialog" />
        </template>
      </EblSubHeader>
      <div class="ebl-page-description font-weight-bold mb-6">
        <VIcon icon="ebli:information" size="20" />
        최근 7일간의 진행 현황만 표시됩니다.
      </div>

      <div class="ebl-task-card-list">
        <EblTaskCardItem v-for="(item, index) in inProgressItems" :key="index" v-bind="item" />
      </div>
    </div>
    <!-- 2-Row Card Layout -->
    <div class="ebl-card-layout--row mt-5">
      <!-- Left Column - Two Cards -->
      <div class="ebl-card-layout--col">
        <!-- Top Card -->
        <div class="ebl-card-container">
          <EblSubHeader>
            <h2>My B/L Statistics</h2>
          </EblSubHeader>
          <EblSubHeader small>
            <h3 class="font-weight-medium">Filter</h3>
          </EblSubHeader>
          <div class="ebl-dashboard-filter">
            <EblInfo vertical>
              <EblInfoItem label="Issue Date" has-input>
                <div class="date-range">
                  <EblDatePicker v-model="filterStartDate" placeholder="Start date" />
                  <span>-</span>
                  <EblDatePicker v-model="filterEndDate" placeholder="End date" />
                </div>
              </EblInfoItem>
              <!-- <EblInfoItem label="Type" has-input>
                <div class="d-flex align-center ga-4">
                  <EblRadioBtn v-model="filterType" name="blType" value="carrier">
                    Carrier
                  </EblRadioBtn>
                  <EblRadioBtn v-model="filterType" name="blType" value="arrival">
                    Arrival
                  </EblRadioBtn>
                </div>
              </EblInfoItem> -->
            </EblInfo>
          </div>
          <EblSubHeader small class="mt-6">
            <h3 class="font-weight-medium">Total B/L Count</h3>
            <template #util>
              <div class="ebl-dashboard-unit-block">
                <span class="value">100</span>
                <span class="unit">Cases</span>
              </div>
            </template>
          </EblSubHeader>
          <Apexchart
            class="ebl-chart ebl-chart--bar"
            type="bar"
            width="100%"
            height="300"
            :options="barChartOptions"
            :series="barChartSeries"
          />
        </div>

        <!-- Bottom Card -->
        <div class="ebl-card-container">
          <EblSubHeader>
            <h2>Carbon Savings</h2>
          </EblSubHeader>

          <EblSubHeader small class="mb-3">
            <h3 class="font-weight-medium">Total Savings</h3>
            <template #util>
              <div class="ebl-dashboard-unit-block">
                <span class="value">418</span>
                <span class="unit">kg CO₂e</span>
              </div>
            </template>
          </EblSubHeader>
          <VDivider color="#E6E8E9" class="mb-6" />
          <EblSubHeader small>
            <h3 class="font-weight-medium">CO₂ Reduction Trend</h3>
            <template #util>
              <EblTabs v-model="chartFilter" :items="chartFilterTab" variant="pill" />
            </template>
          </EblSubHeader>

          <Apexchart
            class="ebl-chart ebl-chart--area"
            type="area"
            width="100%"
            height="210"
            :options="areaChartOptions"
            :series="areaChartSeries"
          />
          <div class="ebl-chart--info mt-6">
            <div class="title">
              <VIcon icon="ebli:information" size="20" />
              <h3>Reference Standard</h3>
            </div>
            <p>
              Estimated CO₂ reduction of approximately 27.9 kg CO₂e per paper B/L replaced (Source:
              Sia Partners)
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column - Recent B/L Tasks -->
      <div class="ebl-card-layout--col ebl-card-layout--fit">
        <div class="ebl-card-container ebl-bl-tasks--card">
          <EblSubHeader class="mb-6">
            <h2>Recent B/L Tasks</h2>
            <template #util>
              <EblBtn outlined icon="ebli:setting" @click="recentBlTasksDialogOpen = true" />
            </template>
          </EblSubHeader>
          <div class="ebl-bl-tasks ebl-bl-tasks--list">
            <div
              v-for="(item, index) in computedBlTasks"
              :key="index"
              class="ebl-bl-tasks__item"
              :class="{ 'ebl-bl-tasks__noti': item.type === 'noti' }"
            >
              <div class="ebl-bl-tasks__item__row">
                <div class="item-bullet">
                  <div v-if="item.type === 'noti'" class="bullet-icon info">
                    <VIcon icon="ebli:horn-fill" size="20" />
                  </div>
                  <div v-else-if="item.type === 'info'" class="bullet-icon info">
                    <VIcon icon="ebli:three-circles-line" size="12" />
                  </div>
                  <div v-else-if="item.type === 'dot'" class="bullet-dot" />
                </div>
                <div class="item-content" v-html="item.title" />
                <div v-if="item.time" class="item-time">{{ item.time }}</div>
              </div>
              <div v-if="item.details" class="ebl-bl-tasks__item__details">
                <div
                  v-for="(detail, idx) in item.details"
                  :key="idx"
                  class="detail-item"
                  :class="{ 'is-new': detail.isNew }"
                >
                  {{ detail.text }}
                </div>
                <VDivider />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- In-Progress Tasks 설정 다이얼로그 -->
    <EblDialog
      v-model="taskDialogOpen"
      transition="slide-x-reverse-transition"
      @close="taskDialogOpen = false"
    >
      <VCard width="480" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">In-Progress Tasks Settings</span>
          <VSpacer />
          <EblBtn icon pill small @click="taskDialogOpen = false">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <div class="d-flex flex-column ga-3">
            <template v-for="(item, index) in inProgressItems" :key="index">
              <EblCheckbox v-model="item.outlined">
                {{ item.title }}
              </EblCheckbox>
              <VDivider v-if="index < inProgressItems.length - 1" />
            </template>
          </div>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn color="cta" large @click="saveTaskSettings">Save</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>
    <!-- Recent B/L Tasks 설정 다이얼로그 -->
    <EblDialog
      v-model="recentBlTasksDialogOpen"
      transition="slide-x-reverse-transition"
      @close="recentBlTasksDialogOpen = false"
    >
      <VCard width="400" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Recent B/L Tasks</span>
          <VSpacer />
          <EblBtn icon pill small @click="recentBlTasksDialogOpen = false">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <div class="d-flex flex-column ga-3">
            <template v-for="(item, index) in recentBlTasksType" :key="index">
              <EblCheckbox v-model="item.checked">
                {{ item.title }}
              </EblCheckbox>
              <VDivider v-if="index < recentBlTasksType.length - 1" />
            </template>
          </div>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn color="cta" large @click="recentBlTasksDialogOpen = false">Save</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Apexchart from 'vue3-apexcharts'

// ============================================
// In-Progress Tasks 데이터
// ============================================
const inProgressItems = ref([
  {
    title: 'Issue',
    value: 31,
    unit: 'Issue',
    stats: [{ label: 'Draft', value: '10' }],
    color: 'blue',
    outlined: false,
  },
  {
    title: 'Amendment',
    value: 12,
    unit: 'Received',
    stats: [
      { label: 'Approval', value: '7' },
      { label: 'Rejected', value: '5' },
    ],
    color: 'blue',
    outlined: false,
  },
  {
    title: 'Delivery',
    value: 15,
    unit: 'Received',
    stats: [
      { label: 'Approved', value: '10' },
      { label: 'Pending', value: '5' },
    ],
    color: 'blue',
    outlined: false,
  },
  {
    title: 'Paper',
    value: 8,
    unit: 'Received',
    stats: [
      { label: 'Approved', value: '6' },
      { label: 'Pending', value: '2' },
    ],
    color: 'blue',
    outlined: false,
  },
])

// ============================================
// In-Progress Tasks 설정 다이얼로그
// ============================================
const taskDialogOpen = ref(false)

const openTaskDialog = () => {
  taskDialogOpen.value = true
}

const saveTaskSettings = () => {
  taskDialogOpen.value = false
}

// ============================================
// Filter 관련 데이터
// ============================================
const filterStartDate = ref('2025-10-05')
const filterEndDate = ref('2025-11-05')

// ============================================
// 막대 차트 (Bar Chart)
// ============================================

// Carrier별 B/L 건수 데이터
const barChartData = ref([
  { name: 'Carrier A', value: 22, colorFrom: '#C1F67E', colorTo: '#97D449' },
  { name: 'Carrier B', value: 18, colorFrom: '#FF5DCF', colorTo: '#DC2AA7' },
  { name: 'Carrier C', value: 17, colorFrom: '#5991FF', colorTo: '#065AFF' },
  { name: 'Carrier D', value: 14, colorFrom: '#FFE089', colorTo: '#FFBF0F' },
  { name: 'Carrier E', value: 12, colorFrom: '#FFAA82', colorTo: '#FF5B0F' },
  { name: 'Other', value: 17, colorFrom: '#656170', colorTo: '#36343C' },
])

// 차트 시리즈 데이터
const barChartSeries = computed(() => [
  {
    name: 'B/L Count',
    data: barChartData.value.map((item) => item.value),
  },
])

// 차트 옵션 설정
const barChartOptions = computed(() => {
  const categories = barChartData.value.map((item) => item.name)
  const colors = barChartData.value.map((item) => item.colorFrom)
  const gradientColors = barChartData.value.map((item) => item.colorTo)
  const total = barChartData.value.reduce((sum, item) => sum + item.value, 0)

  return {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'inherit',
      parentHeightOffset: 16,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
      },
    },
    colors,
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.4,
        gradientToColors: gradientColors,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontWeight: 400,
      markers: { size: 5, shape: 'circle' },
      itemMargin: {
        horizontal: 10,
        vertical: 4,
      },
      formatter: (seriesName, opts) => {
        const item = barChartData.value[opts.seriesIndex]
        const percentage = Math.round((item.value / total) * 100)
        return `<div class="ebl-chart__legend-item">
        <span class="label">${seriesName}</span>
        <span class="percentage">${percentage}%</span>
      </div>`
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: '#3B4A5E',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#3B4A5E',
          fontSize: '10px',
          fontWeight: 400,
        },
        formatter: (value) => Math.round(value),
      },
    },
    grid: {
      borderColor: '#DCE3EB',
      strokeDashArray: 3,
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex][dataPointIndex]
        const color = w.config.colors[dataPointIndex]
        return `
        <div class="ebl-chart__tooltip">
          <span class="ebl-chart__tooltip-color" style="background: ${color};"></span>
          <span>${value}건</span>
        </div>
      `
      },
    },
  }
})

// ============================================
// 차트 필터 탭
// ============================================
const chartFilter = ref('6m')
const chartFilterTab = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
]

// ============================================
// 라인 영역 차트 (Area Chart)
// ============================================

// 365일 랜덤 데이터 생성 (30~80 사이 값)
const generateYearData = () => {
  const data = []
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date,
      value: Math.floor(Math.random() * 50) + 30,
    })
  }
  return data
}

const yearData = ref(generateYearData())

// 차트 필터에 따라 데이터 가공
const areaChartData = computed(() => {
  const filter = chartFilter.value

  if (filter === '1w') {
    // 최근 7일 (일별)
    const filteredData = yearData.value.slice(-7)
    return filteredData.map((item) => ({
      month: item.date.toLocaleString('en', { weekday: 'short' }),
      value: item.value,
    }))
  } else if (filter === '1m') {
    // 최근 30일 (일별)
    const filteredData = yearData.value.slice(-30)
    return filteredData.map((item) => {
      const month = item.date.toLocaleString('en', { month: 'short' })
      const day = item.date.getDate()
      return {
        month: `${month} ${day}`,
        value: item.value,
      }
    })
  } else if (filter === '6m') {
    // 최근 6개월 (월별 평균)
    const monthlyData = []
    const today = new Date()

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = targetDate.toLocaleString('en', { month: 'short' })

      const monthData = yearData.value.filter((item) => {
        return (
          item.date.getFullYear() === targetDate.getFullYear() &&
          item.date.getMonth() === targetDate.getMonth()
        )
      })

      const avgValue =
        monthData.length > 0
          ? Math.round(monthData.reduce((sum, item) => sum + item.value, 0) / monthData.length)
          : 0

      monthlyData.push({
        month: monthName,
        value: avgValue,
      })
    }

    return monthlyData
  } else {
    // 1년 (월별 평균)
    const monthlyData = []
    const today = new Date()

    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = targetDate.toLocaleString('en', { month: 'short' })

      const monthData = yearData.value.filter((item) => {
        return (
          item.date.getFullYear() === targetDate.getFullYear() &&
          item.date.getMonth() === targetDate.getMonth()
        )
      })

      const avgValue =
        monthData.length > 0
          ? Math.round(monthData.reduce((sum, item) => sum + item.value, 0) / monthData.length)
          : 0

      monthlyData.push({
        month: monthName,
        value: avgValue,
      })
    }

    return monthlyData
  }
})

// 차트 시리즈 데이터
const areaChartSeries = computed(() => [
  {
    name: 'CO₂ Reduction',
    data: areaChartData.value.map((item) => item.value),
  },
])

// 차트 옵션 설정
const areaChartOptions = computed(() => {
  const categories = areaChartData.value.map((item) => item.month)

  return {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'inherit',
      zoom: { enabled: false },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#5DD5C0'],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
      colors: ['#5DD5C0'],
    },
    colors: ['#5DD5C0'],
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: '#3B4A5E',
          fontSize: '10px',
          fontWeight: 400,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#3B4A5E',
          fontSize: '10px',
          fontWeight: 400,
        },
        formatter: (value) => Math.round(value),
      },
    },
    grid: {
      borderColor: '#DCE3EB',
      strokeDashArray: 3,
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const value = series[seriesIndex][dataPointIndex]
        return `
        <div class="ebl-chart__tooltip">
          <span>${value} kg CO₂e</span>
        </div>
      `
      },
    },
    legend: { show: false },
  }
})
// 최근 B/L 작업 타임라인 설정 다이얼로그
const recentBlTasksDialogOpen = ref(false)
const recentBlTasksType = ref([
  { title: 'B/L 현황', checked: false },
  { title: 'Envelope 현황', checked: false },
  { title: '초대', checked: false },
  { title: '파트너 등록', checked: false },
  { title: 'Q&A 답변 등록', checked: false },
  { title: '권한 업데이트', checked: false },
])
// 최근 B/L 작업 타임라인 더미 데이터
const dummyTasks = [
  {
    type: 'noti',
    title: 'User permissions have been updated.',
  },
  {
    type: 'dot',
    title: 'Invitation has been sent to APL / ABC Co., Ltd.',
    time: '5 min ago',
  },
  {
    type: 'info',
    title: '<em>[BOL] DKJHFKH373GFV</em>',
    time: '10 min ago',
    details: [
      { text: 'The BL has been endorsed by HapagLloyd', isNew: true },
      { text: 'The BL has been transferred by MSC' },
      { text: 'The envelope has been issued to Evergreen' },
    ],
  },
  {
    type: 'dot',
    title: 'A reply has been posted to your <em>Q&A</em> inquiry.',
    time: '30 min ago',
  },
  {
    type: 'info',
    title: '<em>Partner Registration</em> : DEF Co., Ltd.',
    time: '1 hour ago',
    details: [
      { text: 'TSLine has accepted the invitation', isNew: true },
      { text: 'An invitation has been sent to Heungpaline' },
    ],
  },
  {
    type: 'dot',
    title:
      'The envelope containing <em>[SWB]</em> RF6FRJ02M8MW has been issued to HMM / SKUHS Co., Ltd.',
    time: '4 hours ago',
  },
  {
    type: 'dot',
    title: 'An invitation for <em>Partner Registration</em> has been sent to APL / Kedutch GmbH',
    time: '2025.12.22 15:20',
  },
  {
    type: 'dot',
    title:
      '<em>[BOL]</em> Q0C4647TCSDJHGF Conversion requested : Paper to Telex Release (By : Evergreen / LIDS Inc.)',
    time: '2025.12.20 10:50',
  },
  {
    type: 'dot',
    title: 'User permissions have been updated. (by : Master Jung Seon-ho)',
    time: '2025.12.18 15:20',
  },
  {
    type: 'dot',
    title:
      '<em>[BOL]</em> GHF72KD93LSQ Conversion requested : Telex Release to Express Release (By : CargoHub Logistics / LIDS Inc.)',
    time: '2025.12.15 10:50',
  },
]

// 최근 B/L 작업 목록 (반응형)
const recentBlTasks = ref([...dummyTasks, ...dummyTasks])

// 알림(noti) 타입을 최상단으로 정렬
const computedBlTasks = computed(() => {
  return [...recentBlTasks.value].sort((a, b) => {
    if (a.type === 'noti') return -1
    if (b.type === 'noti') return 1
    return 0
  })
})
</script>
