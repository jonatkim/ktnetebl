<template>
  <div class="ebl-page-container">
    <EblSubHeader title="In-Progress Tasks">
      <template #util>
        <EblBtn icon="ebli:setting" outlined @click="openSettingDialog" />
      </template>
    </EblSubHeader>
    <p class="ebl-page-description mb-6">대시보드는 최근 7일간의 현황만 보여줍니다.</p>
    <div class="ebl-task-card-list">
      <EblTaskCardItem v-for="item in inProgressItems" :key="item.title" v-bind="item" />
    </div>
    <EblBottomSheet v-model="settingDialog.show" persistent>
      <VCard class="ebl-bottom-sheet__card">
        <VCardTitle class="ebl-bottom-sheet__header">
          <span class="title">Setting</span>
          <VSpacer />
          <EblBtn icon color="ghost" @click="settingDialog.show = false">
            <VIcon icon="ebli:close" :size="24" />
          </EblBtn>
        </VCardTitle>
        <VCardText class="ebl-bottom-sheet__text">
          <EblOptionGroup
            v-model="optionValue"
            :options="options"
            multiple
            title="중요 항목 설정"
            vertical
          />
        </VCardText>
        <VCardActions class="ebl-bottom-sheet__action">
          <EblBtn color="cta" large block @click="applySettingDialog">Apply</EblBtn>
        </VCardActions>
      </VCard>
    </EblBottomSheet>
  </div>
</template>

<script setup>
// ============================================
// 페이지 메타 설정
// ============================================
definePageMeta({
  appbarType: 'main',
})

// ============================================
// 상태 데이터
// ============================================
const settingDialog = reactive({
  show: false,
  value: [],
})

const optionValue = ref([])

const openSettingDialog = () => {
  optionValue.value = [...settingDialog.value]
  settingDialog.show = true
}

const applySettingDialog = () => {
  settingDialog.value = optionValue.value
  settingDialog.show = false
}

// ============================================
// In-Progress Tasks 기본 데이터
// ============================================
const inProgressTasksData = [
  {
    title: 'Issue',
    value: 30,
    unit: 'Issue',
    stats: [{ label: 'Not Issue', value: '10' }],
    progress: 75,
  },
  {
    title: 'Transfer',
    value: 15,
    unit: 'Forwarding',
    stats: [
      { label: 'Approved', value: '10' },
      { label: 'Pending', value: '5' },
    ],
    progress: 67,
  },
  {
    title: 'Incoming',
    value: 8,
    unit: 'Requests',
    stats: [
      { label: 'Approved', value: '6' },
      { label: 'Rejected', value: '2' },
    ],
    progress: 75,
  },
  {
    title: 'e-Negotiation',
    value: 20,
    unit: 'Application',
    stats: [
      { label: 'Approved', value: '6' },
      { label: 'Rejected', value: '2' },
      { label: 'Wait', value: '6' },
    ],
    progress: 60,
  },
  {
    title: 'Presentation',
    value: 18,
    unit: 'Submit',
    stats: [
      { label: 'Approved', value: '6' },
      { label: 'Rejected', value: '2' },
      { label: 'Wait', value: '6' },
    ],
    progress: 65,
  },
]

// ============================================
// Options (title 기반으로 자동 생성)
// ============================================
const options = computed(() =>
  inProgressTasksData.map((item) => ({
    label: item.title,
    value: item.title,
  })),
)

// ============================================
// In-Progress Tasks 데이터 (outlined 포함)
// ============================================
const inProgressItems = computed(() =>
  inProgressTasksData.map((item) => ({
    ...item,
    outlined: settingDialog.value.includes(item.title),
  })),
)
</script>
