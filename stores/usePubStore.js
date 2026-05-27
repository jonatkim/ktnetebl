import { defineStore } from 'pinia'
import { PUB_MENUS } from './pubMenus'

export const usePubStore = defineStore('pub', {
  state: () => ({
    pubMenus: PUB_MENUS,
  }),
  actions: {
    // 필요한 액션만 남기세요
  },
  getters: {
    // 필요한 getter만 남기세요
  },
})
