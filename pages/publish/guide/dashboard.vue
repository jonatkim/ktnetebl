<!-- /pages/guide/dashboard.vue -->
<template>
  <VContainer fill-height class="pub-container pub-container--fill-height pub-container--scroll">
    <div class="pub-header__top">
      <h1 class="pub-page-header">퍼블리싱 현황판</h1>
    </div>

    <!-- Filters (sticky) -->
    <div ref="filterEl" class="pub-header pub-sticky pub-sticky--filters">
      <div class="pub-controls">
        <VTextField
          v-model="q"
          density="compact"
          variant="outlined"
          hide-details
          single-line
          clearable
          placeholder="화면명 / 화면ID / 뎁스 검색"
          class="pub-controls__search"
        />
        <VBtn variant="flat" color="primary" @click="resetFilters">
          <VIcon start>mdi-refresh</VIcon>초기화
        </VBtn>
        <VSpacer />

        <div class="pub-controls__right">
          <VChipGroup v-model="userTypeFilter" multiple class="pub-controls__chips">
            <VChip value="선사" size="small" color="info" filter>
              <VIcon size="x-small" class="mr-1">mdi-ferry</VIcon>선사
            </VChip>
            <VChip value="화주" size="small" color="warning" filter>
              <VIcon size="x-small" class="mr-1">mdi-package-variant</VIcon>화주
            </VChip>
            <VChip value="은행" size="small" color="success" filter>
              <VIcon size="x-small" class="mr-1">mdi-bank</VIcon>은행
            </VChip>
          </VChipGroup>
          <VDivider vertical />
          <VChipGroup v-model="statusFilter" multiple class="pub-controls__chips">
            <VChip value="작업중" size="small" color="warning" filter>작업중</VChip>
            <VChip value="완료" size="small" color="success" filter>완료</VChip>
          </VChipGroup>
          <VDivider vertical />
          <VChipGroup v-model="typeFilter" multiple class="pub-controls__chips">
            <VChip value="팝업" color="info">
              <VIcon size="x-small" class="mr-1">mdi-window-restore</VIcon>팝업 포함
            </VChip>
          </VChipGroup>
        </div>
      </div>
    </div>

    <!-- eBL PC -->
    <section class="pub-service">
      <button class="pub-service__head" type="button" @click="open.ebl = !open.ebl">
        <span class="pub-service__title">eBL PC Service</span>
        <span class="pub-service__progress">
          <!-- eBL PC Progress -->
          <VProgressLinear
            :model-value="eblDonePercent"
            :buffer-value="eblDonePercent + eblInProgressPercent"
            buffer-color="#ff9800"
            buffer-opacity="1"
            color="#4caf50"
            bg-color="#e0e0e0"
            height="20"
            rounded
            striped
            class="pub-progress"
          >
            <div class="pub-mono" style="font-size: 11px; font-weight: 700; color: #333">
              eBL PC : {{ eblDoneCount + eblInProgressCount }} / {{ eblTotalCount }} ({{
                eblDonePercent + eblInProgressPercent
              }}%)
            </div>
          </VProgressLinear>
        </span>
        <span class="pub-service__meta">{{ eblItems.length }}건</span>
        <span class="pub-service__chev" aria-hidden="true">
          <VIcon>{{ open.ebl ? 'mdi-chevron-down' : 'mdi-chevron-down mdi-rotate-180' }}</VIcon>
        </span>
      </button>

      <div v-show="open.ebl" class="pub-service__body">
        <div v-for="g in eblGroups" :key="`ebl-${g.key}`" class="pub-list">
          <div class="pub-group__sticky pub-sticky pub-sticky--section">eBL › {{ g.key }}</div>
          <PubListItem
            v-for="item in g.rows"
            :key="item.screenId"
            :item="item"
            display-device="pc"
            @click-screen="handleScreenClick"
          />
        </div>
      </div>
    </section>

    <!-- eBL Mobile -->
    <section class="pub-service">
      <button class="pub-service__head" type="button" @click="open.eblMobile = !open.eblMobile">
        <span class="pub-service__title">eBL Mobile Service</span>
        <span class="pub-service__progress">
          <!-- eBL Mobile Progress -->
          <VProgressLinear
            :model-value="eblMobileDonePercent"
            buffer-color="#ff9800"
            color="#4caf50"
            bg-color="#e0e0e0"
            height="20"
            rounded
            striped
            class="pub-progress"
          >
            <div class="pub-mono" style="font-size: 11px; color: #333; font-weight: 700">
              eBL MO : {{ eblMobileDoneCount }} / {{ eblMobileTotalCount }} ({{
                eblMobileDonePercent
              }}%)
            </div>
          </VProgressLinear>
        </span>
        <span class="pub-service__meta">{{ eblMobileItems.length }}건</span>
        <span class="pub-service__chev" aria-hidden="true">
          <VIcon>
            {{ open.eblMobile ? 'mdi-chevron-down' : 'mdi-chevron-down mdi-rotate-180' }}
          </VIcon>
        </span>
      </button>

      <div v-show="open.eblMobile" class="pub-service__body">
        <div v-for="g in eblMobileGroups" :key="`ebl-mobile-${g.key}`" class="pub-list">
          <div class="pub-group__sticky pub-sticky pub-sticky--section">eBL MO › {{ g.key }}</div>
          <PubListItem
            v-for="item in g.rows"
            :key="item.screenId"
            :item="item"
            display-device="mobile"
            @click-screen="handleScreenClick"
          />
        </div>
      </div>
    </section>

    <!-- Portal -->
    <section class="pub-service">
      <button class="pub-service__head" type="button" @click="open.portal = !open.portal">
        <span class="pub-service__title">Portal Service</span>
        <span class="pub-service__progress">
          <!-- Portal Progress -->
          <VProgressLinear
            :model-value="portalDonePercent"
            :buffer-value="portalDonePercent + portalInProgressPercent"
            buffer-color="#ff9800"
            buffer-opacity="1"
            color="#4caf50"
            bg-color="#e0e0e0"
            height="20"
            rounded
            striped
            class="pub-progress"
          >
            <div class="pub-mono" style="font-size: 11px; color: #333">
              Portal : {{ portalDoneCount + portalInProgressCount }} / {{ portalTotalCount }} ({{
                Math.round(((portalDoneCount + portalInProgressCount) / portalTotalCount) * 100)
              }}%)
            </div>
          </VProgressLinear>
        </span>
        <span class="pub-service__meta">{{ portalItems.length }}건</span>
        <span class="pub-service__chev" aria-hidden="true">
          <VIcon>{{ open.portal ? 'mdi-chevron-down' : 'mdi-chevron-down mdi-rotate-180' }}</VIcon>
        </span>
      </button>

      <div v-show="open.portal" class="pub-service__body">
        <div v-for="g in portalGroups" :key="`portal-${g.key}`" class="pub-list">
          <div class="pub-group__sticky pub-sticky pub-sticky--section">Portal › {{ g.key }}</div>
          <PubListItem
            v-for="item in g.rows"
            :key="item.screenId"
            :item="item"
            @click-screen="handleScreenClick"
          />
        </div>
      </div>
    </section>

    <div class="pub-bottom-space" />
  </VContainer>
</template>

<script setup>
import PubListItem from '~/components/publish/PubListItem.vue'
import { usePubStore } from '~/stores/usePubStore'

definePageMeta({ layout: 'guide' })

const router = useRouter()
const pubStore = usePubStore()
const pubMenus = pubStore.pubMenus

// ============================================================
// State
// ============================================================
const q = ref('')
const userTypeFilter = ref([])
const statusFilter = ref([])
const typeFilter = ref(['팝업']) // 기본적으로 팝업 포함
const open = reactive({ portal: true, ebl: true, eblMobile: true })
const filterEl = ref(null)

// ============================================================
// Utility Functions
// ============================================================

/**
 * screenId로부터 경로 생성
 * @param {string} screenId - 화면ID (예: EBLNEG010U, PSMHOM010U)
 * @param {string} service - 서비스 타입 (예: ebl, portal)
 * @param {string} device - 디바이스 타입 (pc, mobile)
 * @returns {string|null} 생성된 경로
 */
const generatePath = (screenId, service, device = 'pc') => {
  const item = pubMenus.find((menu) => menu.screenId === screenId)
  if (item?.routePath) return item.routePath

  const match = screenId.match(/^([A-Z]{3})([A-Z]+)/)
  if (!match) return null

  const [, serviceCode, groupCode] = match
  const serviceLower = serviceCode.toLowerCase()
  const groupLower = groupCode.toLowerCase()

  if (service === 'portal') {
    return `/portal/${groupLower}/${screenId}`
  }

  const prefix = device === 'mobile' ? '/mo' : '/pc'
  return `${prefix}/${serviceLower}/${groupLower}/${screenId}`
}

/**
 * 라우트 존재 여부 확인
 * @param {string} path - 확인할 경로
 * @returns {boolean} 라우트 존재 여부
 */
const hasRouteExists = (path) => {
  try {
    const resolved = router.resolve(path)
    return !!resolved && resolved.name !== undefined
  } catch {
    return false
  }
}

/**
 * 메뉴 아이템에 hasRoute 속성 추가
 * @param {object} item - 메뉴 아이템
 * @returns {object} hasRoute가 추가된 아이템
 */
const enrichItemWithRoute = (item) => {
  const path = item.routePath || generatePath(item.screenId, item.service)
  const hasRoute = path ? hasRouteExists(path) : false
  return { ...item, hasRoute }
}

// ============================================================
// Status Logic
// ============================================================

/**
 * 아이템의 작업 상태 판정
 * - '완료': completedAt이 있으면
 * - '작업중': hasRoute가 있으면
 * - null: 미작업
 */
const getStatus = (item) => {
  if (item.completedAt) return '완료'
  if (item.hasRoute) return '작업중'
  return null
}

const isMobileSupport = (item) => item?.mobileAttr && item.mobileAttr !== 'N/A'
const isHiddenOnDevice = (item, device) => {
  const hide = item?.hide
  if (!hide) return false
  if (Array.isArray(hide)) return hide.includes(device)
  return hide === device
}

// ============================================================
// Event Handlers
// ============================================================

const handleScreenClick = ({ screenId, device }) => {
  const item = pubMenus.find((x) => x.screenId === screenId)
  if (!item) {
    console.warn('화면 정보를 찾을 수 없습니다:', screenId)
    return
  }

  // 팝업(자식) 화면인 경우 부모 페이지를 열도록 처리
  let targetScreenId = screenId
  let targetItem = item

  if (item.parentScreenId) {
    // 부모 화면 찾기
    const parentItem = pubMenus.find((x) => x.screenId === item.parentScreenId)
    if (parentItem) {
      targetScreenId = parentItem.screenId
      targetItem = parentItem
      console.log('팝업 화면 감지 → 부모 페이지로 이동:', parentItem.screenId)
    }
  }

  const path = targetItem.routePath || generatePath(targetScreenId, targetItem.service, device)
  const hasRoute = path ? hasRouteExists(path) : false
  const targetPath =
    device === 'mobile' && targetItem.service !== 'portal' && path
      ? `${path}${path.includes('?') ? '&' : '?'}pubPreview=mobile`
      : path

  console.log('===== 화면 클릭 =====')
  console.log('화면ID:', screenId)
  console.log('화면명:', item.name)
  console.log('팝업 여부:', !!item.parentScreenId)
  console.log('대상 화면ID:', targetScreenId)
  console.log('디바이스:', device)
  console.log('경로:', targetPath)
  console.log('라우트 존재:', hasRoute)
  console.log('======================')

  // hasRoute가 참이면 새 창으로 열기
  if (hasRoute && targetPath) {
    window.open(targetPath, '_blank')
  }
}

const resetFilters = () => {
  q.value = ''
  userTypeFilter.value = []
  statusFilter.value = []
  typeFilter.value = ['팝업'] // 기본값으로 리셋
}

// ============================================================
// Computed - Data Processing
// ============================================================

/**
 * 전체 메뉴 (hasRoute 추가)
 */
const allMenusWithRoute = computed(() => {
  return (pubMenus || []).map(enrichItemWithRoute)
})

/**
 * 검색 및 필터링 적용
 */
const filtered = computed(() => {
  const query = q.value.trim().toLowerCase()
  const includePopups = typeFilter.value.includes('팝업')

  return allMenusWithRoute.value.filter((item) => {
    // 팝업 필터: 팝업 포함이 체크되지 않으면 팝업 제외
    if (!includePopups && item.parentScreenId) return false

    // 텍스트 검색
    if (query) {
      const searchableText = [
        item.name,
        item.screenId,
        item.type,
        (item.levels || []).join(' > '),
        item.desc,
        (item.userType || []).join(','),
      ]
        .map((x) => (x ?? '').toString().toLowerCase())
        .join(' | ')

      if (!searchableText.includes(query)) return false
    }

    // 사용자 유형 필터
    if (userTypeFilter.value.length) {
      const types = Array.isArray(item.userType) ? item.userType : []
      if (types.length && !userTypeFilter.value.some((t) => types.includes(t))) return false
    }

    // 작업 상태 필터
    if (statusFilter.value.length && !statusFilter.value.includes(getStatus(item))) {
      return false
    }

    return true
  })
})

/**
 * 서비스별 필터링 + 계층 구조 구성
 * parentScreenId가 있는 팝업은 부모 화면 밑에 중첩되도록 처리
 */
const portalItems = computed(() => {
  const items = filtered.value.filter((x) => x.service === 'portal')
  return buildHierarchy(items)
})

const eblItems = computed(() => {
  const items = filtered.value.filter((x) => x.service === 'ebl' && !isHiddenOnDevice(x, 'pc'))
  return buildHierarchy(items)
})

const eblMobileItems = computed(() => {
  const items = filtered.value.filter(
    (x) => x.service === 'ebl' && isMobileSupport(x) && !isHiddenOnDevice(x, 'mobile'),
  )
  return buildHierarchy(items)
})

/**
 * 계층 구조 생성: 부모 화면 아래에 팝업 중첩
 * @param {Array} items - 필터링된 아이템 목록
 * @returns {Array} 계층 구조화된 아이템 목록
 */
const buildHierarchy = (items) => {
  const result = []
  const parentMap = new Map()

  // 1단계: 부모 화면만 먼저 추가
  items.forEach((item) => {
    if (!item.parentScreenId) {
      result.push(item)
      parentMap.set(item.screenId, item)
    }
  })

  // 2단계: 팝업을 부모 화면 바로 다음에 삽입
  items.forEach((item) => {
    if (item.parentScreenId) {
      const parentIdx = result.findIndex((x) => x.screenId === item.parentScreenId)
      if (parentIdx !== -1) {
        // 부모 바로 다음 위치에 삽입 (isChild 플래그 추가)
        result.splice(parentIdx + 1, 0, { ...item, isChild: true })
      }
    }
  })

  return result
}

/**
 * 부모 화면 기준으로 그룹핑 (팝업은 부모에 포함되므로 부모의 첫 번째 레벨로만 그룹핑)
 */
const groupByL0 = (items) => {
  const map = new Map()
  const order = []

  for (const item of items) {
    // 팝업인 경우 부모 화면의 레벨을 사용하여 그룹핑 (팝업 자신의 레벨이 아닌 부모 레벨)
    // 부모가 없으면 (화면) 자신의 레벨 사용
    let key
    if (item.parentScreenId) {
      // 팝업: 부모 화면을 찾아서 부모의 첫 번째 레벨을 사용
      const parent = items.find((x) => x.screenId === item.parentScreenId && !x.parentScreenId)
      key = parent ? (parent.levels?.[0] || '—').toString() : (item?.levels?.[0] || '—').toString()
    } else {
      // 화면: 자신의 첫 번째 레벨 사용
      key = (item?.levels?.[0] || '—').toString()
    }

    if (!map.has(key)) {
      map.set(key, [])
      order.push(key)
    }
    map.get(key).push(item)
  }

  return order.map((key) => ({ key, rows: map.get(key) }))
}

const portalGroups = computed(() => groupByL0(portalItems.value))
const eblGroups = computed(() => groupByL0(eblItems.value))
const eblMobileGroups = computed(() => groupByL0(eblMobileItems.value))

// ============================================================
// Computed - Statistics
// ============================================================

const totalCount = computed(() => allMenusWithRoute.value.length)
const doneCount = computed(
  () => allMenusWithRoute.value.filter((x) => getStatus(x) === '완료').length,
)
const inProgressCount = computed(
  () => allMenusWithRoute.value.filter((x) => getStatus(x) === '작업중').length,
)
const notStartedCount = computed(() => totalCount.value - doneCount.value - inProgressCount.value)

const donePercent = computed(() => {
  const total = totalCount.value
  return total ? Math.round((doneCount.value / total) * 100) : 0
})

// Portal Statistics
const portalTotalCount = computed(() => {
  return allMenusWithRoute.value.filter((x) => x.service === 'portal').length
})
const portalDoneCount = computed(() => {
  return allMenusWithRoute.value.filter((x) => x.service === 'portal' && getStatus(x) === '완료')
    .length
})
const portalInProgressCount = computed(() => {
  return allMenusWithRoute.value.filter((x) => x.service === 'portal' && getStatus(x) === '작업중')
    .length
})
const portalDonePercent = computed(() => {
  const total = portalTotalCount.value
  return total ? Math.round((portalDoneCount.value / total) * 100) : 0
})
const portalInProgressPercent = computed(() => {
  const total = portalTotalCount.value
  return total ? Math.round((portalInProgressCount.value / total) * 100) : 0
})

// eBL Statistics
const eblTotalCount = computed(() => {
  return allMenusWithRoute.value.filter((x) => x.service === 'ebl' && !isHiddenOnDevice(x, 'pc'))
    .length
})
const eblDoneCount = computed(() => {
  return allMenusWithRoute.value.filter(
    (x) => x.service === 'ebl' && !isHiddenOnDevice(x, 'pc') && getStatus(x) === '완료',
  ).length
})
const eblInProgressCount = computed(() => {
  return allMenusWithRoute.value.filter(
    (x) => x.service === 'ebl' && !isHiddenOnDevice(x, 'pc') && getStatus(x) === '작업중',
  ).length
})
const eblDonePercent = computed(() => {
  const total = eblTotalCount.value
  return total ? Math.round((eblDoneCount.value / total) * 100) : 0
})
const eblInProgressPercent = computed(() => {
  const total = eblTotalCount.value
  return total ? Math.round((eblInProgressCount.value / total) * 100) : 0
})

const eblMobileTotalCount = computed(() => {
  return allMenusWithRoute.value.filter(
    (x) => x.service === 'ebl' && isMobileSupport(x) && !isHiddenOnDevice(x, 'mobile'),
  ).length
})
const eblMobileDoneCount = computed(() => {
  return allMenusWithRoute.value.filter(
    (x) =>
      x.service === 'ebl' &&
      isMobileSupport(x) &&
      !isHiddenOnDevice(x, 'mobile') &&
      x.mobileCompletedAt,
  ).length
})
const eblMobileDonePercent = computed(() => {
  const total = eblMobileTotalCount.value
  return total ? Math.round((eblMobileDoneCount.value / total) * 100) : 0
})

const inProgressPercent = computed(() => {
  const total = totalCount.value
  return total ? Math.round((inProgressCount.value / total) * 100) : 0
})

const notStartedPercent = computed(() => {
  return Math.max(0, 100 - donePercent.value - inProgressPercent.value)
})

// ============================================================
// Lifecycle & DOM
// ============================================================

const setCssVar = (name, value) => document.documentElement.style.setProperty(name, value)

const syncStickyOffsets = async () => {
  await nextTick()
  const filterH = filterEl.value?.offsetHeight ?? 0
  setCssVar('--pub-filters-h', `${filterH}px`)
}

const onResize = () => syncStickyOffsets()

onMounted(() => {
  syncStickyOffsets()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped></style>
