import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    username: 'Guest',
    userType: 'carrier', // 선사, 화주, 은행
    lnbVisible: true,
    containerFluid: false,
    currentPath: '/',
    favorites: ['EBLPAT010U', 'EBLPAT050U', 'EBLSUB010U'], // 즐겨찾기 목록 (menuId 배열)
    globalLoading: false, // 전역 로딩 상태
    globalLoginDialogOpen: false, // 세션 타임아웃 전역 로그인 다이얼로그 상태
    topBannerVisible: true, // 상단 공지 배너 표시 상태
    topBannerItems: [
      {
        id: 'maintenance-01',
        message: '더욱 안정적인 서비스 제공을 위해 시스템 정기 점검을 진행예정입니다',
        href: '',
      },
      {
        id: 'maintenance-02',
        message:
          '일부 기능 개선 작업으로 인해 특정 메뉴 응답이 일시적으로 지연될 수 있으며, 점검 시간 동안 파일 업로드, 첨부 다운로드, 통합 대시보드 통계 반영, 거래 알림 발송 등 일부 부가 기능의 처리 속도가 평소보다 늦어질 수 있습니다',
        href: '',
      },
      {
        id: 'maintenance-03',
        message: '점검 완료 이후 최신 변경사항이 반영된 안내 문서를 순차적으로 배포할 예정입니다',
        href: '',
      },
    ],
    portalAppbarTheme: 'light', // 포탈 앱바 테마 ('light' | 'dark')
    portalAppbarInvert: false, // 포탈 앱바 인버트 여부
  }),

  actions: {
    setUsername(name) {
      this.username = name
    },

    setUserType(type) {
      if (['carrier', 'shipper', 'bank'].includes(type)) {
        this.userType = type
        // userType 변경 시 localStorage에서 해당 타입의 favorites 로드
        this.loadFavoritesFromStorage()
      }
    },

    setLnbVisible(v) {
      this.lnbVisible = !!v
    },
    toggleLnb() {
      this.lnbVisible = !this.lnbVisible
    },
    toggleContainerFluid() {
      this.containerFluid = !this.containerFluid
    },
    setCurrentPath(path) {
      this.currentPath = path
    },
    isActive(item) {
      if (!item?.path) return false
      return this.currentPath === item.path || this.currentPath.startsWith(item.path + '/')
    },
    // 즐겨찾기 저장
    setFavorites(menuIds) {
      this.favorites = menuIds
    },
    // 즐겨찾기 추가
    addFavorite(menuId) {
      if (!this.favorites.includes(menuId)) {
        this.favorites.push(menuId)
      }
    },
    // 즐겨찾기 제거
    removeFavorite(menuId) {
      const index = this.favorites.indexOf(menuId)
      if (index > -1) {
        this.favorites.splice(index, 1)
      }
    },
    // 즐겨찾기 순서 변경
    updateFavorites(menuIds) {
      this.favorites = menuIds
    },
    // localStorage에서 favorites 로드
    loadFavoritesFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem(`favorites_${this.userType}`)
        if (saved) {
          try {
            const loaded = JSON.parse(saved)
            this.favorites = loaded
          } catch (e) {
            console.error('Failed to load favorites from storage:', e)
          }
        }
      }
    },
    // 전역 로딩 표시
    showGlobalLoading() {
      this.globalLoading = true
    },
    // 전역 로딩 숨김
    hideGlobalLoading() {
      this.globalLoading = false
    },

    // 전역 로그인 다이얼로그 표시
    openGlobalLoginDialog() {
      this.globalLoginDialogOpen = true
    },
    // 전역 로그인 다이얼로그 숨김
    closeGlobalLoginDialog() {
      this.globalLoginDialogOpen = false
    },

    // 상단 배너 표시
    showTopBanner() {
      this.topBannerVisible = true
    },

    // 상단 배너 숨김
    hideTopBanner() {
      this.topBannerVisible = false
    },

    setTopBannerItems(items) {
      this.topBannerItems = Array.isArray(items) ? items : []
    },

    // 포탈 앱바 테마 설정
    setPortalAppbarTheme(theme) {
      if (['light', 'dark'].includes(theme)) {
        this.portalAppbarTheme = theme
      }
    },

    // 포탈 앱바 인버트 여부 설정
    setPortalAppbarInvert(val) {
      this.portalAppbarInvert = !!val
    },
  },
})
