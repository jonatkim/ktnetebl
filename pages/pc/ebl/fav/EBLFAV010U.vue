<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <div style="display: flex; gap: 8px">
          <EblBtn large :disabled="!hasChanges" @click="handleCancel">Cancel</EblBtn>
          <EblBtn color="cta" large :disabled="!hasChanges" @click="handleSave">Save</EblBtn>
        </div>
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- Favorite Menu Section -->
      <div class="ebl-favorites-section">
        <EblSubHeader>
          <h2>Favorite Menu</h2>
          <!-- <template #tooltip>
            •즐겨찾기 메뉴를 등록하고 순서를 조정할 수 있습니다.<br />
            •드래그 핸들(::)을 통해 순서를 변경할 수 있습니다.
          </template> -->
        </EblSubHeader>

        <div class="ebl-favorites-list">
          <Draggable
            v-model="favoritesDisplay"
            class="ebl-draggable-list"
            item-key="id"
            handle=".ebl-favorite-item__drag-handle"
            ghost-class="ghost"
            @change="
              () => {
                favoriteMenuIds = favoritesDisplay.map((f) => f.screenId)
              }
            "
          >
            <template #item="{ element, index }">
              <div :key="`fav-${element.id}`" class="ebl-favorite-item">
                <div class="ebl-favorite-item__drag-handle">
                  <VIcon>ebli:dots</VIcon>
                </div>
                <div class="ebl-favorite-item__actions">
                  <EblBtn icon size="small" outlined pill @click="removeFavorite(index)">
                    <VIcon icon="ebli:minus" :size="16" />
                  </EblBtn>
                </div>
                <div class="ebl-favorite-item__content">
                  <span class="ebl-favorite-item__path">{{ element.path }}</span>
                </div>
                <EblBtn outlined>Shortcut</EblBtn>
              </div>
            </template>
          </Draggable>

          <div v-if="favoritesDisplay.length === 0" class="ebl-favorites-empty">
            No favorite menus added yet
          </div>
        </div>
      </div>

      <!-- Menu List Section -->
      <div class="ebl-menu-list-section mt-12">
        <EblSubHeader>
          <h2>Menu List</h2>
          <!-- <template #tooltip>
            •즐겨찾기에 추가할 수 있는 메뉴 목록입니다.<br />
            •+버튼을 클릭하여 즐겨찾기에 추가합니다.
          </template> -->
        </EblSubHeader>

        <!-- Menu Filter -->
        <!-- <div class="ebl-page-filters">
          <EblInput
            v-model="menuSearchQuery"
            clearable
            placeholder="Search menu..."
            :prepend-text="menuSearchQuery && 'Search'"
            :style="{ width: menuSearchQuery ? '240px' : '180px' }"
            append-icon="ebli:search"
          />
        </div> -->

        <!-- Menu Items List -->
        <div class="ebl-menu-items-list">
          <div v-for="item in filteredMenuItems" :key="item.id" class="ebl-menu-item">
            <EblBtn
              icon
              pill
              :outlined="!isMenuAdded(item.id)"
              :color="isMenuAdded(item.id) ? 'cta' : 'ghost'"
              :disabled="isMenuAdded(item.id) || (isFavoriteLimitReached && !isMenuAdded(item.id))"
              @click="addFavorite(item)"
            >
              <VIcon :icon="isMenuAdded(item.id) ? 'ebli:check' : 'ebli:plus'" :size="16" />
            </EblBtn>
            <div class="ebl-menu-item__content">
              <span class="ebl-menu-item__label">{{ item.path }}</span>
            </div>
          </div>

          <div v-if="filteredMenuItems.length === 0" class="ebl-menu-items-empty">
            No menus found
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Draggable from 'vuedraggable'
import { useDialogStore } from '~/stores/useDialogStore'
import { usePubStore } from '~/stores/usePubStore'
import { useMainStore } from '~/stores/useMainStore'

const dialogStore = useDialogStore()
const pubStore = usePubStore()
const main = useMainStore()

// ============================================================
// State
// ============================================================

const pageInfo = ref({
  title: 'Favorites',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Settings' }, { text: 'Favorites' }],
})

// 작업 중인 즐겨찾기 menuId 배열
const favoriteMenuIds = ref([...main.favorites])

// 메뉴 검색 쿼리
const menuSearchQuery = ref('')

// ============================================================
// Computed
// ============================================================

// 사용자 타입에 따른 필터링된 메뉴 (EBL 서비스만 포함)
const availableMenus = computed(() => {
  return pubStore.pubMenus.filter((menu) => {
    // EBL 서비스만 포함 (포탈 제외)
    if (menu.service !== 'ebl') return false
    // userType이 비어있으면 모두 표시
    if (!menu.userType || menu.userType.length === 0) return true
    // userType이 있으면 현재 사용자 타입과 매치되는 것만 표시
    return menu.userType.includes(main.userType)
  })
})

// 메뉴의 표시 경로 반환 (공통 로직)
const getMenuPath = (menu) => {
  return menu.levels ? menu.levels.join(' › ') : menu.name
}

// 필터링된 메뉴 아이템 (이미 추가된 메뉴 제외)
const filteredMenuItems = computed(() => {
  const query = menuSearchQuery.value.toLowerCase()

  return availableMenus.value
    .filter((menu) => {
      // 이미 추가된 메뉴는 제외
      if (isMenuAdded(menu.screenId)) return false
      // 검색 쿼리 필터
      // if (!query) return true
      return (
        menu.name.toLowerCase().includes(query) ||
        menu.screenId.toLowerCase().includes(query) ||
        (menu.levels && menu.levels.join(' › ').toLowerCase().includes(query))
      )
    })
    .map((menu) => ({
      id: menu.screenId,
      path: getMenuPath(menu),
      name: menu.name,
      screenId: menu.screenId,
      type: 'screen',
    }))
})

// 즐겨찾기 메뉴 (표시용)
const favoritesDisplay = computed(() => {
  return favoriteMenuIds.value
    .map((menuId) => {
      const menu = availableMenus.value.find((m) => m.screenId === menuId)
      if (!menu) return null
      return {
        id: menu.screenId,
        path: getMenuPath(menu),
        name: menu.name,
        screenId: menu.screenId,
      }
    })
    .filter(Boolean)
})

// 변경 감지
const hasChanges = computed(() => {
  return JSON.stringify(favoriteMenuIds.value) !== JSON.stringify(main.favorites)
})

// 즐겨찾기 최대 개수 도달 여부
const isFavoriteLimitReached = computed(() => {
  return favoriteMenuIds.value.length >= 5
})

// ============================================================
// Methods
// ============================================================

// 메뉴가 이미 추가되었는지 확인
const isMenuAdded = (menuId) => {
  return favoriteMenuIds.value.includes(menuId)
}

// 메뉴 아이콘 반환
const getMenuIcon = (type) => {
  return type === 'screen' ? 'ebli:file' : 'mdi-folder'
}

// 즐겨찾기에 추가
const addFavorite = (item) => {
  if (isMenuAdded(item.id)) return
  favoriteMenuIds.value.push(item.id)
}

// 즐겨찾기에서 제거
const removeFavorite = (index) => {
  favoriteMenuIds.value.splice(index, 1)
}

// 저장
const handleSave = async () => {
  try {
    // 스토어 업데이트
    main.setFavorites([...favoriteMenuIds.value])

    // localStorage에도 저장
    localStorage.setItem(`favorites_${main.userType}`, JSON.stringify(favoriteMenuIds.value))

    await dialogStore.showAlert({
      title: '성공',
      icon: 'success',
      message: '즐겨찾기가 저장되었습니다.',
    })
  } catch (error) {
    console.error('Save error:', error)
    await dialogStore.showAlert({
      title: '오류',
      icon: 'error',
      message: '저장 중 오류가 발생했습니다.',
    })
  }
}

// 취소
const handleCancel = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: '변경사항 버림',
    icon: 'warning',
    message: '변경사항을 저장하지 않고 버리시겠습니까?',
    confirmText: '버림',
    cancelText: '계속 편집',
  })

  if (confirmed) {
    // 초기 상태로 복구
    favoriteMenuIds.value = [...main.favorites]
  }
}

// 페이지 진입 시 초기화
onMounted(() => {
  favoriteMenuIds.value = [...main.favorites]
})
</script>
