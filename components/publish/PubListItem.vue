<!-- components/PubListItem.vue -->
<template>
  <div class="pub-row" :class="{ 'pub-row--child': item.isChild }">
    <div class="pub-col__name">
      <div class="pub-col__path">
        <!-- 팝업인 경우 들여쓰기 표시 -->
        <VIcon v-if="item.isChild" size="small" class="mr-1 text-grey-darken-1"
          >mdi-subdirectory-arrow-right</VIcon
        >
        <span v-if="item.levels?.length" class="font-weight-semibold">{{ item.levels[0] }} › </span>
        <span v-if="(item.levels?.length || 0) > 1" class="pub-path__rest">
          {{ item.levels.slice(1).join(' › ') }}
        </span>
      </div>
      <div class="pub-col__title">
        {{ item.name }}

        <span class="pub-type">
          <VIcon
            v-tooltip:top="item.type === '화면' ? '화면' : '팝업'"
            size="x-small"
            :color="item.type === '화면' ? 'primary lighten-5' : 'grey lighten-5'"
            >{{ item.type === '화면' ? 'ebli:file' : 'mdi-dock-window' }}</VIcon
          >
        </span>

        <VChip
          v-for="t in resolvedUserTypes"
          :key="`${item.screenId}-${t}`"
          density="compact"
          :color="USER_TYPE_META[t]?.color"
          variant="tonal"
          class="pub-badge mr-1"
        >
          <VIcon size="x-small" class="mr-1">
            {{ USER_TYPE_META[t]?.icon || 'mdi-help-circle-outline' }}
          </VIcon>
          {{ t }}
        </VChip>
      </div>
    </div>

    <div class="pub-col__id">
      <VBtn
        size="small"
        flat
        :disabled="isMobileView && !isMobileSupport"
        :prepend-icon="buttonIcon"
        append-icon="mdi-chevron-right"
        @click="handleScreenClick"
      >
        {{ item.screenId }}
        <VTooltip activator="parent" location="top">
          {{ buttonTooltip }}
        </VTooltip>
      </VBtn>
    </div>

    <div class="pub-col__done">
      <div class="pub-done__line">
        <VChip
          v-tooltip="doneTooltip"
          size="small"
          label
          :color="currentStatus.color"
          filter
          class="pub-badge pub-mono ml-1"
        >
          {{ currentStatus.label }}
        </VChip>
      </div>
    </div>

    <div class="pub-col__desc">
      <span
        ref="descEl"
        class="pub-desc"
        :class="{
          'pub-desc--expanded': isExpanded,
          'pub-desc--disabled': !isExpandable,
        }"
        role="button"
        :tabindex="isExpandable ? 0 : -1"
        :aria-expanded="isExpandable ? String(isExpanded) : undefined"
        @click="toggleDesc"
        @keydown.enter.prevent="toggleDesc"
        @keydown.space.prevent="toggleDesc"
      >
        {{ item.desc || '-' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  displayDevice: { type: String, default: 'pc' },
})

const emit = defineEmits(['click-screen'])

const USER_TYPE_META = {
  선사: {
    icon: 'mdi-ferry',
    color: 'info',
  },
  화주: {
    icon: 'mdi-package-variant',
    color: 'warning',
  },
  은행: {
    icon: 'mdi-bank',
    color: 'success',
  },
  공용: {
    icon: 'mdi-all-inclusive',
    color: 'grey lighten-4',
  },
}

const EMPTY_STATUS = { label: '-', color: 'grey-lighten-1' }

const emitScreen = (device) => {
  emit('click-screen', { screenId: props.item.screenId, device })
}

const normalizeUserTypes = (value) => {
  const arr = Array.isArray(value) ? value : []
  return arr.length ? arr : ['공용']
}

// userType 비어있으면 "공용" 표기
const resolvedUserTypes = computed(() => normalizeUserTypes(props.item?.userType))

const isMobileView = computed(() => props.displayDevice === 'mobile')

// 모바일 지원 여부: mobileAttr이 N/A가 아니면 지원
const isMobileSupport = computed(() => props.item?.mobileAttr && props.item.mobileAttr !== 'N/A')

const pcStatus = computed(() => {
  const label = props.item?.completedAt
  return label ? { label, color: 'success' } : EMPTY_STATUS
})

// 모바일 완료/예정 표시용
const mobileStatus = computed(() => {
  if (!isMobileSupport.value) return EMPTY_STATUS
  const completed = props.item?.mobileCompletedAt
  if (completed) return { label: completed, color: 'success' }
  const due = props.item?.mobileDueAt
  return due ? { label: due, color: 'warning' } : EMPTY_STATUS
})

const currentStatus = computed(() => (isMobileView.value ? mobileStatus.value : pcStatus.value))

const doneTooltip = computed(() => {
  if (isMobileView.value) {
    return currentStatus.value.color === 'success' ? '모바일 완료일' : '모바일 완료예정일'
  }
  return currentStatus.value.color === 'success' ? 'PC 완료일' : 'PC 완료예정일'
})

const buttonIcon = computed(() => (isMobileView.value ? 'mdi-cellphone' : 'mdi-monitor'))

const buttonTooltip = computed(() => {
  if (!isMobileView.value) return 'PC 화면 이동'
  return isMobileSupport.value ? `모바일 (${props.item.mobileAttr}) 이동` : '모바일 미지원'
})

const handleScreenClick = () => {
  if (isMobileView.value && !isMobileSupport.value) return
  emitScreen(isMobileView.value ? 'mobile' : 'pc')
}

const isExpanded = ref(false)
const isExpandable = ref(false)
const descEl = ref(null)

const measureExpandable = async () => {
  await nextTick()
  const el = descEl.value
  if (!el) return
  isExpandable.value = el.scrollHeight > el.clientHeight + 1
}

const toggleDesc = () => {
  if (!isExpandable.value) return
  isExpanded.value = !isExpanded.value
}

const onResize = () => {
  if (!isExpanded.value) measureExpandable()
}

onMounted(() => {
  measureExpandable()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

watch(
  () => props.item?.desc,
  () => {
    isExpanded.value = false
    measureExpandable()
  },
)
</script>
