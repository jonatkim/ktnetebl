<template>
  <div class="ebl-page-container pt-0">
    <!-- 탭 네비게이션 -->
    <EblTabs
      v-model="activeTab"
      v-sticky="32"
      :items="tabItems"
      no-wrap
      class="mx-n6 pt-6 px-6 mb-6"
    />

    <!-- EblSubHeader -->
    <EblSubHeader>
      <h2>Total</h2>
      <span class="count">{{ filteredItems.length }}</span>
      <template #util>
        <EblBtn icon="ebli:search" outlined @click="currentData.showFilter = true" />
      </template>
    </EblSubHeader>

    <!-- 검색 필터 바텀시트 -->
    <EblFilterBottomSheet
      v-model="currentData.showFilter"
      v-model:filter-value="currentData.appliedFilter"
      title="Search"
      query-place-holder="Search by Title, Message"
      show-query
      :status-options="[]"
      @filter:apply="onFilterApply"
      @filter:reset="onFilterReset"
    />

    <!-- 리스트 -->
    <div class="ebl-card-list ebl-faq-list">
      <div v-if="filteredItems.length === 0" class="ebl-card-item__empty">
        <VImg src="~/assets/images/common/not_result_found.png" width="150" height="74" />
        <h3>No results found</h3>
        <p>No FAQ matches your search.</p>
      </div>

      <!-- 확장 패널 리스트 -->
      <VExpansionPanels
        v-else
        variant="accordion"
        flat
        tile
        expand-icon="ebli:chevron-bottom"
        collapse-icon="ebli:chevron-up"
      >
        <VExpansionPanel v-for="item in visibleItems" :key="item.id" class="ebl-faq-item">
          <template #title>
            <div class="ebl-faq-item__header">
              <EblBadge color="blue" variant="tonal" size="small">
                {{ item.category }}
              </EblBadge>
              <span class="ebl-faq-item__title">{{ item.title }}</span>
            </div>
          </template>

          <template #text>
            <div class="ebl-faq-item__content">
              <div class="ebl-faq-item__message" v-html="item.message" />
            </div>
          </template>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>
    <!-- More 버튼 -->
    <div v-if="showMore" class="ebl-more-list ebl-more-list--wrap">
      <EblBtn
        v-if="!currentData.isLoadingMore"
        block
        class="ebl-more-list__btn"
        append-icon="ebli:chevron-bottom"
        @click="loadMore"
      >
        More ({{ currentData.currentCount }} / {{ filteredItems.length }})
      </EblBtn>
      <div v-else class="ebl-more-list__loading">
        <!-- 로딩 스피너 -->
        <Vue3Lottie animation-link="/lottie/loadingSpinner.json" :height="60" :width="120" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'

// 페이지 메타 설정
definePageMeta({
  appbarType: 'sub',
  appbarTitle: 'FAQ',
})

// 활성 탭 상태
const activeTab = ref('all')

// 전체 더미 데이터 (50개)
const allFaqData = [
  {
    id: 1,
    title: '서비스 문의 방법 안내',
    category: 'Category1',
    message:
      '서비스 이용 도중 문의 사항이 있으신 경우, 사용자 문의 게시판이나 이메일 문의가 가능합니다.<br/>자세한 내용은 <a href="#">바로가기</a>를 참고하세요.<br/>이메일: help@ktnet.com',
  },
  {
    id: 2,
    title: 'How to create account?',
    category: 'Category3',
    message:
      '계정 생성은 다음 단계를 따릅니다:<br/>1. 회원가입 페이지 방문<br/>2. 이메일 주소 입력<br/>3. 비밀번호 설정<br/>4. 이메일 인증 완료',
  },
  {
    id: 3,
    title: 'What payment methods do you accept?',
    category: 'Category2',
    message:
      '다음 결제 수단을 지원합니다:<br/>- 신용카드 (전 카드사)<br/>- 계좌이체<br/>- 휴대폰 결제<br/>- 간편결제 (카카오페이, 삼성페이)',
  },
  {
    id: 4,
    title: 'How to reset password?',
    category: 'Category1',
    message:
      '<strong>비밀번호 재설정 방법:</strong><br/>1. 로그인 페이지의 "비밀번호 찾기" 클릭<br/>2. 등록 이메일 입력<br/>3. 인증 링크 확인<br/>4. 새 비밀번호 설정',
  },
  {
    id: 5,
    title: 'What is refund policy?',
    category: 'Category2',
    message:
      '환불 정책: 결제 후 7일 이내 환불 신청이 가능하며, 신청 후 <strong>3-5 업무일</strong> 소요됩니다.',
  },
  {
    id: 6,
    title: 'How to delete account?',
    category: 'Category3',
    message:
      '계정 삭제는 설정 메뉴에서 진행할 수 있습니다.<br/>경로: 설정 > 계정 관리 > 계정 삭제<br/>주의: 삭제 후 복구는 불가능합니다.',
  },
  {
    id: 7,
    title: '서비스 이용 시간',
    category: 'Category1',
    message:
      '서비스는 <strong>24시간 365일</strong> 운영됩니다.<br/>단, 시스템 점검 시간에는 일시적으로 서비스 이용이 제한될 수 있습니다.',
  },
  {
    id: 8,
    title: 'Mobile app download',
    category: 'Category2',
    message:
      '모바일 앱은 다음 플랫폼에서 다운로드 가능합니다:<br/>- <a href="#">Apple App Store</a><br/>- <a href="#">Google Play Store</a>',
  },
  {
    id: 9,
    title: '비밀번호 변경 방법',
    category: 'Category3',
    message:
      '비밀번호 변경은 설정 메뉴에서 진행합니다.<br/>경로: 설정 > 보안 > 비밀번호 변경<br/>새 비밀번호는 8자 이상 영문, 숫자, 특수문자 포함해야 합니다.',
  },
  {
    id: 10,
    title: '개인정보 보호 정책',
    category: 'Category1',
    message:
      '당사는 개인정보 보호법을 준수하며, 개인정보는 암호화하여 안전하게 관리합니다.<br/>자세한 내용은 <a href="#">개인정보 처리방침</a>을 참고하세요.',
  },
  {
    id: 11,
    title: 'How to contact support?',
    category: 'Category2',
    message:
      '고객지원팀 연락처:<br/>- 이메일: support@ktnet.com<br/>- 전화: 1234-5678<br/>- 카카오톡: @KTNET',
  },
  {
    id: 12,
    title: '자동 로그아웃 시간',
    category: 'Category3',
    message:
      '보안을 위해 30분 동안 활동이 없으면 자동으로 로그아웃됩니다.<br/>다시 로그인하여 서비스를 계속 이용하실 수 있습니다.',
  },
  {
    id: 13,
    title: 'Two-factor authentication',
    category: 'Category1',
    message:
      '이중 인증 설정으로 계정 보안을 강화할 수 있습니다.<br/>설정 > 보안 > 이중 인증에서 활성화하세요.',
  },
  {
    id: 14,
    title: '구독 취소 방법',
    category: 'Category2',
    message:
      '구독 취소는 설정 메뉴에서 언제든 가능합니다.<br/>경로: 설정 > 구독 > 구독 취소<br/>남은 기간의 환불은 자동으로 처리됩니다.',
  },
  {
    id: 15,
    title: '이메일 변경 방법',
    category: 'Category3',
    message:
      '이메일 변경은 설정 > 계정 정보에서 진행합니다.<br/>새 이메일로 인증 링크가 전송되며, 인증 후 변경이 완료됩니다.',
  },
  {
    id: 16,
    title: 'API 연동 가이드',
    category: 'Category1',
    message:
      '<strong>API 문서:</strong><br/>자세한 API 명세는 <a href="#">개발자 문서</a>에서 확인할 수 있습니다.<br/>지원: api@ktnet.com',
  },
  {
    id: 17,
    title: '알림 설정 변경',
    category: 'Category2',
    message:
      '알림 설정은 설정 메뉴에서 변경 가능합니다.<br/>이메일, 푸시 알림을 각각 켜고 끌 수 있습니다.',
  },
  {
    id: 18,
    title: '데이터 내보내기',
    category: 'Category3',
    message:
      '개인 데이터를 내보낼 수 있습니다.<br/>설정 > 데이터 관리 > 데이터 내보내기에서 진행하세요.',
  },
  {
    id: 19,
    title: '구매 이력 조회',
    category: 'Category1',
    message:
      '구매 이력은 마이페이지 > 구매 내역에서 확인할 수 있습니다.<br/>환불, 교환은 여기서 신청하실 수 있습니다.',
  },
  {
    id: 20,
    title: '프로모션 코드 사용법',
    category: 'Category2',
    message:
      '프로모션 코드는 결제 단계에서 입력할 수 있습니다.<br/>코드 입력 후 할인이 적용됩니다.<br/>주의: 개수 제한이 있으니 서둘러 신청하세요.',
  },
  {
    id: 21,
    title: '회원 등급 안내',
    category: 'Category3',
    message:
      '<strong>회원 등급:</strong><br/>- Bronze: 가입 회원<br/>- Silver: 월 10만원 이상 구매<br/>- Gold: 월 50만원 이상 구매<br/>등급별 혜택은 <a href="#">등급 페이지</a>를 참고하세요.',
  },
  {
    id: 22,
    title: '포인트 사용 및 적립',
    category: 'Category1',
    message:
      '포인트는 구매 시 1% 적립되며, 다음 구매에서 현금처럼 사용할 수 있습니다.<br/>포인트는 <strong>1만 포인트부터</strong> 사용 가능합니다.',
  },
  {
    id: 23,
    title: '배송 정보 조회',
    category: 'Category2',
    message:
      '배송 정보는 마이페이지 > 배송조회에서 실시간으로 확인할 수 있습니다.<br/>배송 시간은 일반 상품 기준 3-5일 소요됩니다.',
  },
  {
    id: 24,
    title: '상품 교환/반품',
    category: 'Category3',
    message:
      '교환 및 반품은 수령 후 7일 이내 신청 가능합니다.<br/>신청 후 반품 배송료는 고객 부담입니다.',
  },
  {
    id: 25,
    title: '로그인 문제 해결',
    category: 'Category1',
    message:
      '로그인이 안 될 경우:<br/>1. 아이디/비밀번호 확인<br/>2. CAPS LOCK 확인<br/>3. 비밀번호 재설정<br/>4. 고객지원팀 문의',
  },
  {
    id: 26,
    title: '브라우저 호환성',
    category: 'Category2',
    message:
      '지원 브라우저:<br/>- Chrome 최신 버전<br/>- Safari 최신 버전<br/>- Firefox 최신 버전<br/>- Edge 최신 버전',
  },
  {
    id: 27,
    title: '쿠키 및 캐시 초기화',
    category: 'Category3',
    message:
      '서비스 이용 중 오류가 발생하면 브라우저 캐시를 초기화해보세요.<br/>Chrome: Ctrl+Shift+Delete<br/>Safari: Command+Shift+Delete',
  },
  {
    id: 28,
    title: '결제 오류 처리',
    category: 'Category1',
    message:
      '결제 중 오류가 발생한 경우:<br/>1. 재시도하기<br/>2. 다른 결제 수단 시도<br/>3. 고객지원팀 문의<br/>중복 결제 시 환불됩니다.',
  },
  {
    id: 29,
    title: '회원 탈퇴 후 재가입',
    category: 'Category2',
    message: '탈퇴 후 같은 이메일로 재가입은 <strong>30일 후</strong>에 가능합니다.',
  },
  {
    id: 30,
    title: '접근성 기능',
    category: 'Category3',
    message:
      '당 서비스는 다음 접근성 기능을 지원합니다:<br/>- 음성 안내<br/>- 시각 보조 기능<br/>- 키보드 네비게이션',
  },
  {
    id: 31,
    title: '계정 병합 가능한가요?',
    category: 'Category1',
    message: '현재 계정 병합 기능은 지원하지 않습니다.<br/>별도의 계정으로 관리해주시기 바랍니다.',
  },
  {
    id: 32,
    title: '회사 소개',
    category: 'Category2',
    message:
      '<strong>KTNET</strong><br/>설립: 2000년<br/>사업: eDocument 및 전자무역 플랫폼 운영<br/>홈페이지: <a href="#">www.ktnet.com</a>',
  },
  {
    id: 33,
    title: '채용 정보',
    category: 'Category3',
    message: '현재 채용 공고는 <a href="#">채용 페이지</a>에서 확인하실 수 있습니다.',
  },
  {
    id: 34,
    title: '제휴 문의',
    category: 'Category1',
    message: '제휴 및 파트너십 관련 문의:<br/>이메일: partner@ktnet.com<br/>전화: 1234-5678',
  },
  {
    id: 35,
    title: '보도자료',
    category: 'Category2',
    message: '최신 보도자료는 <a href="#">뉴스룸</a>에서 확인하실 수 있습니다.',
  },
  {
    id: 36,
    title: '자주 묻는 질문 - 결제',
    category: 'Category3',
    message:
      '<strong>결제 관련 자주 묻는 질문:</strong><br/>Q1: 결제 취소는 어떻게 하나요?<br/>A: 마이페이지 > 주문/결제 > 결제 취소에서 가능합니다.',
  },
  {
    id: 37,
    title: '자주 묻는 질문 - 배송',
    category: 'Category1',
    message:
      '<strong>배송 관련 자주 묻는 질문:</strong><br/>Q1: 배송료는 어떻게 계산되나요?<br/>A: 주문 금액에 따라 자동 계산됩니다.',
  },
  {
    id: 38,
    title: '보안 팁',
    category: 'Category2',
    message:
      '<em>계정 보안을 위한 팁:</em><br/>1. 강력한 비밀번호 사용<br/>2. 정기적인 비밀번호 변경<br/>3. 이중 인증 활성화<br/>4. 공용 PC 사용 주의',
  },
  {
    id: 39,
    title: '서비스 이용약관',
    category: 'Category3',
    message: '전체 이용약관은 <a href="#">이용약관 페이지</a>에서 확인하실 수 있습니다.',
  },
  {
    id: 40,
    title: '개인정보 동의',
    category: 'Category1',
    message:
      '회원 가입 시 개인정보 수집 및 이용에 동의해야 합니다.<br/>동의하지 않을 경우 서비스 이용이 불가능합니다.',
  },
  {
    id: 41,
    title: '서드파티 연동',
    category: 'Category2',
    message: '다음 서비스와 연동됩니다:<br/>- Google<br/>- Facebook<br/>- Naver<br/>- Kakao',
  },
  {
    id: 42,
    title: '알림 수신 거부',
    category: 'Category3',
    message:
      '알림 수신을 거부하려면 설정에서 "알림" 옵션을 해제하세요.<br/>단, 필수 공지사항은 수신됩니다.',
  },
  {
    id: 43,
    title: '라이선스 정보',
    category: 'Category1',
    message: '본 서비스는 다음 오픈소스를 포함합니다:<br/>- Vue.js<br/>- Vuetify<br/>- Nuxt.js',
  },
  {
    id: 44,
    title: '버전 정보',
    category: 'Category2',
    message: '현재 서비스 버전: <strong>v2.5.0</strong><br/>최종 업데이트: 2026-03-05',
  },
  {
    id: 45,
    title: '버그 리포팅',
    category: 'Category3',
    message: '버그를 발견하신 경우 <a href="#">버그 리포팅</a>을 통해 알려주세요.',
  },
  {
    id: 46,
    title: '서비스 상태 확인',
    category: 'Category1',
    message: '서비스 상태는 <a href="#">상태 페이지</a>에서 확인할 수 있습니다.',
  },
  {
    id: 47,
    title: '피드백 제출',
    category: 'Category2',
    message:
      '서비스 개선을 위한 피드백을 환영합니다.<br/>피드백은 <a href="#">피드백 폼</a>을 통해 제출하세요.',
  },
  {
    id: 48,
    title: '커뮤니티 가이드라인',
    category: 'Category3',
    message:
      '커뮤니티는 모든 사용자를 존중하는 환경입니다.<br/>부적절한 게시물은 삭제될 수 있습니다.',
  },
  {
    id: 49,
    title: '마이그레이션 가이드',
    category: 'Category1',
    message:
      '이전 서비스에서 데이터 이전을 원하시면 <a href="#">마이그레이션 도구</a>를 사용하세요.',
  },
  {
    id: 50,
    title: '시스템 요구사항',
    category: 'Category2',
    message:
      '<strong>최소 시스템 요구사항:</strong><br/>- CPU: 듀얼 코어 이상<br/>- RAM: 2GB 이상<br/>- 인터넷: 5Mbps 이상',
  },
]

// 카테고리별 데이터 구조
const categoryDataMap = {
  all: { label: 'ALL', allData: allFaqData },
  category1: {
    label: 'Category1',
    allData: allFaqData.filter((item) => item.category === 'Category1'),
  },
  category2: {
    label: 'Category2',
    allData: allFaqData.filter((item) => item.category === 'Category2'),
  },
  category3: {
    label: 'Category3',
    allData: allFaqData.filter((item) => item.category === 'Category3'),
  },
}

// 각 카테고리를 reactive로 변환
const allCategory = reactive({
  ...categoryDataMap.all,
  showFilter: false,
  appliedFilter: { query: '' },
  currentCount: 10,
  pageSize: 10,
  isLoadingMore: false,
})

const category1 = reactive({
  ...categoryDataMap.category1,
  showFilter: false,
  appliedFilter: { query: '' },
  currentCount: 10,
  pageSize: 10,
  isLoadingMore: false,
})

const category2 = reactive({
  ...categoryDataMap.category2,
  showFilter: false,
  appliedFilter: { query: '' },
  currentCount: 10,
  pageSize: 10,
  isLoadingMore: false,
})

const category3 = reactive({
  ...categoryDataMap.category3,
  showFilter: false,
  appliedFilter: { query: '' },
  currentCount: 10,
  pageSize: 10,
  isLoadingMore: false,
})

// 탭 아이템
const tabItems = computed(() => [
  { label: 'ALL', value: 'all' },
  { label: 'Category1', value: 'category1' },
  { label: 'Category2', value: 'category2' },
  { label: 'Category3', value: 'category3' },
])

// 현재 탭에 따른 데이터 선택
const currentData = computed(() => {
  const dataMap = {
    all: allCategory,
    category1: category1,
    category2: category2,
    category3: category3,
  }
  return dataMap[activeTab.value]
})

// 필터링된 아이템 (검색 쿼리)
const filteredItems = computed(() => {
  const data = currentData.value
  let result = data.allData

  if (data.appliedFilter.query) {
    const query = data.appliedFilter.query.toLowerCase()
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.message.toLowerCase().includes(query),
    )
  }

  return result
})

// 페이지네이션: 현재 건수만큼 표시
const visibleItems = computed(() => {
  return filteredItems.value.slice(0, currentData.value.currentCount)
})

// 더보기 버튼 표시 여부
const showMore = computed(() => {
  return filteredItems.value.length > currentData.value.currentCount
})

// 필터 적용 시 페이지 초기화
const onFilterApply = () => {
  currentData.value.currentCount = currentData.value.pageSize
}

// 필터 초기화
const onFilterReset = () => {
  currentData.value.appliedFilter.query = ''
  currentData.value.currentCount = currentData.value.pageSize
}

// 더보기 버튼 클릭 시 아이템 추가로 로드
const loadMore = () => {
  if (currentData.value.isLoadingMore) return
  currentData.value.isLoadingMore = true
  setTimeout(() => {
    currentData.value.currentCount = Math.min(
      currentData.value.currentCount + currentData.value.pageSize,
      filteredItems.value.length,
    )
    currentData.value.isLoadingMore = false
  }, 1000) // 1초 로딩 시뮬레이션
}

// 필터 변경 시 페이지네이션 초기화
watch(
  filteredItems,
  () => {
    currentData.value.currentCount = Math.min(
      currentData.value.pageSize,
      filteredItems.value.length,
    )
    currentData.value.isLoadingMore = false
  },
  { immediate: true },
)
</script>
