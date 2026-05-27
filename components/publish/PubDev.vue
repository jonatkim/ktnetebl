<template>
  <Teleport to="body">
    <div class="pub-dev">
      <VMenu location="top end" :offset="12" persistent>
        <!-- :close-on-content-click="false"
        :z-index="9999" -->
        <template #activator="{ props }">
          <button v-bind="props" type="button" class="pub-dev__fab">🔧</button>
        </template>
        <div class="pub-dev__panel">
          <div class="pub-dev__header">퍼블 테스트</div>
          <div class="pub-dev__item">
            <div class="label">User Type</div>
            <div class="contents">
              <div class="component-row">
                <EblRadioBtn
                  v-for="type in userTypes"
                  :key="type"
                  v-model="userType"
                  :value="type"
                  name="userType"
                  >{{ typeLabel[type] }}</EblRadioBtn
                >
              </div>
            </div>
          </div>
          <div class="pub-dev__item">
            <div class="label">전역 로딩 호출</div>
            <div class="contents">
              <EblSwitch v-model="showLoader" :label="`전역로딩 ${showLoader ? 'ON' : 'OFF'}`" />
            </div>
          </div>
          <div class="pub-dev__item">
            <div class="label">로그인 다이얼로그</div>
            <div class="contents">
              <EblSwitch
                v-model="showGlobalLoginDialog"
                :label="`세션 로그인 ${showGlobalLoginDialog ? 'ON' : 'OFF'}`"
              />
            </div>
          </div>
          <div class="pub-dev__item">
            <div class="label">상단 배너</div>
            <div class="contents">
              <EblSwitch
                v-model="showTopBanner"
                :label="`탑배너 ${showTopBanner ? 'ON' : 'OFF'}`"
              />
              <div class="component-row">
                <EblBtn small outlined @click="resetTopBannerStorage">저장값 초기화</EblBtn>
              </div>
            </div>
          </div>
        </div>
      </VMenu>
    </div>
  </Teleport>
</template>

<script setup>
import { useMainStore } from '~/stores/useMainStore'

const main = useMainStore()

const userTypes = ['carrier', 'shipper', 'bank']
const userType = computed({
  get: () => main.userType,
  set: (val) => {
    main.setUserType(val)
  },
})
const typeLabel = {
  carrier: '선사',
  shipper: '화주',
  bank: '은행',
}

// 전역 로딩 스위치
const showLoader = computed({
  get: () => main.globalLoading,
  set: (val) => {
    if (val) {
      main.showGlobalLoading()
    } else {
      main.hideGlobalLoading()
    }
  },
})

// 세션 타임아웃 전역 로그인 다이얼로그 스위치
const showGlobalLoginDialog = computed({
  get: () => main.globalLoginDialogOpen,
  set: (val) => {
    if (val) {
      main.openGlobalLoginDialog()
    } else {
      main.closeGlobalLoginDialog()
    }
  },
})

// 상단 배너 스위치
const showTopBanner = computed({
  get: () => main.topBannerVisible,
  set: (val) => {
    if (val) {
      main.showTopBanner()
    } else {
      main.hideTopBanner()
    }
  },
})

const resetTopBannerStorage = () => {
  if (!import.meta.client) return
  localStorage.removeItem('ebl_top_banner_hidden_date')
  main.showTopBanner()
}
</script>

<style lang="scss" scoped>
.pub-dev {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;

  &__fab {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: #1976d2;
    color: #fff;
    font-size: 20px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      opacity 0.15s ease;
    opacity: 0.8;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.24);
      opacity: 1;
    }
  }

  &__panel {
    width: 320px;
    max-height: 400px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
    padding: 12px 12px 8px;
    overflow-y: auto;
    font-size: 12px;
  }

  &__header {
    font-size: 14px;
    font-weight: 700;
    padding: 4px 4px 12px;
  }

  &__item {
    display: flex;
    gap: 12px;
    padding: 10px 10px 12px;
    border-radius: 10px;
    background: #f7f9fc;
  }

  .label {
    flex: 0 0 80px;
    font-weight: 600;
    color: #333;
  }

  .contents {
    flex: 1;

    .component-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 8px;
      flex-wrap: wrap;
    }

    .radio-row {
      display: flex;
      gap: 4px;
      align-items: center;
      flex-wrap: wrap;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 6px;
      transition: background 0.12s ease;

      input[type='radio'] {
        cursor: pointer;
      }

      span {
        user-select: none;
      }
    }
  }
}
</style>
