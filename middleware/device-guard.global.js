const MISMATCH_PATH = '/device-mismatch'

export default defineNuxtRouteMiddleware((to) => {
  // 모바일/PC 미리보기에서는 가드 제외
  if (to.query?.pubPreview === 'mobile') return
  // 예외: 안내 페이지/퍼블 가이드/포털은 가드 제외
  if (to.path === MISMATCH_PATH) return
  if (to.path.startsWith('/publish/guide')) return
  if (to.path.startsWith('/portal')) return

  // Nuxt device module: UA 기반(SSR/CSR 공통)
  const device = useDevice()
  const isMobile = !!device.isMobileOrTablet

  const isPcRoute = to.path.startsWith('/pc/ebl')
  const isMoRoute = to.path.startsWith('/mo/ebl')

  // 모바일이 PC 경로로 접근 → MO 대체 경로가 있으면 전환
  if (isPcRoute && isMobile) {
    const target = to.path.replace(/^\/pc\/ebl/, '/mo/ebl')
    const resolved = useRouter().resolve(target)
    if (resolved.matched.length > 0) {
      return navigateTo({ path: target, query: to.query })
    }
    return navigateTo({
      path: MISMATCH_PATH,
      query: { from: to.fullPath, expect: 'pc' },
    })
  }

  // 데스크탑이 MO 경로로 접근 → PC 대체 경로가 있으면 전환
  if (isMoRoute && !isMobile) {
    const target = to.path.replace(/^\/mo\/ebl/, '/pc/ebl')
    const resolved = useRouter().resolve(target)
    if (resolved.matched.length > 0) {
      return navigateTo({ path: target, query: to.query })
    }
    return navigateTo({
      path: MISMATCH_PATH,
      query: { from: to.fullPath, expect: 'mo' },
    })
  }
})
