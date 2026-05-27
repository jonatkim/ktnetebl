<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #tooltip>
        •FAQ는 자주 묻는 질문과 답변을 제공합니다.<br />
        •카테고리 및 검색 기능을 통해 원하는 정보를 빠르게 찾을 수 있습니다.
      </template>
    </EblPageHeader>

    <div class="ebl-card-container">
      <!-- 카테고리 탭 -->
      <div class="ebl-faq-section">
        <EblTabs v-model="activeCategory" :items="tabItems" size="lg" />
      </div>

      <!-- Total 서브헤더 -->
      <EblSubHeader class="ebl-faq-subheader mt-6">
        <h2>Total</h2>
        <span class="count">{{ formatNumber(filteredFaqList.length) }}</span>
      </EblSubHeader>

      <!-- 검색 필터 -->
      <div class="ebl-page-filters mb-3">
        <EblInput
          v-model="filters.searchTitle"
          clearable
          placeholder="Search by title..."
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblInput
          v-model="filters.searchMessage"
          clearable
          placeholder="Search by message..."
          :style="{ width: '180px' }"
          @keydown.enter="applyFilters"
        />
        <EblBtn outlined @click="applyFilters">Search</EblBtn>
      </div>

      <!-- FAQ 아코디언 리스트 -->
      <div class="ebl-faq-list">
        <VExpansionPanels
          v-model="openedPanels"
          variant="accordion"
          flat
          rounded="0"
          class="ebl-faq-panels"
          eager
        >
          <VExpansionPanel
            v-for="(item, index) in paginatedFaqList"
            :key="`${item.id}-${index}`"
            :value="index"
            class="ebl-faq-panel"
            collapse-icon="ebli:chevron-up"
            expand-icon="ebli:chevron-bottom"
          >
            <VExpansionPanelTitle class="ebl-faq-panel__title">
              <EblBadge color="blue" variant="tonal">{{ item.category }}</EblBadge>
              <span class="ebl-faq-panel__question">{{ item.title }}</span>
            </VExpansionPanelTitle>
            <VExpansionPanelText class="ebl-faq-panel__content">
              <div v-html="item.message" />
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>

        <div v-if="filteredFaqList.length === 0" class="ebl-faq-empty">No FAQs found</div>
      </div>

      <!-- 페이지네이션 및 아이템 퍼 뷰 -->
      <div v-if="filteredFaqList.length > 0" class="ebl-pagination--container mt-3">
        <div>
          Count
          <EblSelect
            v-model="itemsPerPage"
            placeholder="Items per page"
            :options="[
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '50', value: 50 },
              { label: '100', value: 100 },
            ]"
            class="ml-2"
          />
        </div>
        <EblPagination
          v-model="currentPage"
          :length="totalPages"
          total-visible="5"
          show-first-last-page
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFormat } from '~/composables/useFormat'
// ============================================================
// State
// ============================================================
const { formatNumber } = useFormat()
const pageInfo = ref({
  title: 'FAQ',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'User Guides' }, { text: 'FAQ' }],
})

// ===== 필터 로직 =====
// 필터 상태 (입력용)
const filters = reactive({
  searchTitle: '',
  searchMessage: '',
})

// 적용된 필터 (실제 필터링에 사용)
const appliedFilters = reactive({
  searchTitle: '',
  searchMessage: '',
})

// Search 버튼 클릭 시 필터 적용
const applyFilters = () => {
  appliedFilters.searchTitle = filters.searchTitle
  appliedFilters.searchMessage = filters.searchMessage
  currentPage.value = 1
}

// 카테고리
const activeCategory = ref('all')

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = ref(10)

// 아코디언 열린 항목
const openedPanels = ref([])

// ============================================================
// Mock Data (실제로는 API에서 가져옴)
// ============================================================
const mockFaqData = [
  {
    id: 1,
    category: 'Service',
    title: '서비스 문의 방법 안내',
    message: `서비스 이용 도중 문의 사항이 있으신 경우, 다양한 방법으로 문의하실 수 있습니다.
    
<strong>1. 사용자 질문 게시판</strong>
사용자 게시판에서 질문을 등록하시면, 담당자가 확인 후 24시간 이내에 답변을 드립니다.
게시판은 로그인 후 [고객센터] > [질문 게시판] 메뉴에서 이용하실 수 있습니다.

<strong>2. 고객문의 전화</strong>
전화번호: 1588-1234
운영시간: 평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00 제외)
주말 및 공휴일은 운영하지 않습니다.

<strong>3. 이메일 문의</strong>
이메일: support@ktnet.com
이메일로 문의하신 경우 영업일 기준 2~3일 이내 답변을 드립니다.

<strong>4. 실시간 채팅 상담</strong>
홈페이지 우측 하단의 채팅 아이콘을 클릭하시면 실시간 상담이 가능합니다.
운영시간: 평일 09:00 ~ 18:00`,
  },
  {
    id: 2,
    category: 'Service',
    title: '카테고리 변경하려면 어떻게 해야하나요?',
    message: `카테고리 변경 및 조회 방법에 대해 안내드립니다.

<strong>카테고리 기본 사항</strong>
카테고리는 한 번 설정하면 변경할 수 없습니다. 
이는 데이터 정합성과 일관성을 유지하기 위한 정책입니다.

<strong>카테고리 이동 경로</strong>
동일한 카테고리 내에서는 다음과 같은 경로로 이동할 수 있습니다:
1. 카테고리 선택
2. 사용자 정의 메뉴 진입
3. 사용자 코드 선택
4. 사용자 카테고리 확인
5. 사용자 코드로 최종 이동

<strong>새로운 카테고리 생성</strong>
만약 다른 카테고리가 필요하신 경우:
- 관리자 권한으로 로그인
- [설정] > [카테고리 관리] 메뉴 접근
- [새 카테고리 생성] 버튼 클릭
- 필요한 정보 입력 후 저장

<strong>주의사항</strong>
카테고리 생성 후에는 삭제가 불가능하므로 신중하게 생성해 주시기 바랍니다.`,
  },
  {
    id: 3,
    category: 'Account',
    title: '계정 생성 및 관리',
    message: `계정 생성 및 관리에 대한 상세 안내입니다.

<strong>계정 생성 방법</strong>
1. 홈페이지 우측 상단 [회원가입] 버튼 클릭
2. 이용약관 및 개인정보처리방침 동의
3. 기본 정보 입력 (이름, 이메일, 비밀번호)
4. 이메일 인증 완료
5. 추가 정보 입력 (선택사항)
6. 가입 완료

<strong>계정 정보 수정</strong>
로그인 후 [마이페이지] > [계정 관리]에서 다음 정보를 수정할 수 있습니다:
- 프로필 사진
- 이름 (단, 실명 인증 후에는 변경 불가)
- 이메일 (재인증 필요)
- 연락처
- 주소
- 기타 개인정보

<strong>고급 설정</strong>
[마이페이지] > [고급 설정]에서는 다음과 같은 설정이 가능합니다:
- 알림 설정 (이메일, SMS, 푸시)
- 보안 설정 (2단계 인증, 로그인 기록 확인)
- 개인정보 공개 범위 설정
- 계정 연동 관리

<strong>계정 보안 권장사항</strong>
- 비밀번호는 영문, 숫자, 특수문자를 조합하여 8자 이상으로 설정
- 3개월마다 비밀번호 변경 권장
- 2단계 인증 활성화 권장
- 공용 PC에서는 로그아웃 필수`,
  },
  {
    id: 4,
    category: 'Account',
    title: '비밀번호 변경 방법',
    message: `비밀번호 변경 및 관리 방법을 안내해 드립니다.

<strong>일반 비밀번호 변경</strong>
1. 로그인 후 [마이페이지] 접속
2. [계정 관리] > [보안 설정] 선택
3. [비밀번호 변경] 버튼 클릭
4. 현재 비밀번호 입력
5. 새 비밀번호 입력 및 확인
6. [변경하기] 버튼 클릭

<strong>비밀번호 분실 시</strong>
1. 로그인 페이지에서 [비밀번호 찾기] 클릭
2. 가입 시 등록한 이메일 입력
3. 이메일로 전송된 인증 링크 클릭
4. 새 비밀번호 설정
5. 재로그인

<strong>비밀번호 규칙</strong>
안전한 비밀번호를 위해 다음 규칙을 따라주세요:
- 최소 8자 이상
- 영문 대소문자 포함
- 숫자 포함
- 특수문자 포함
- 이전 비밀번호와 다를 것
- 연속된 문자/숫자 사용 금지 (예: 1234, abcd)

<strong>보안 강화 팁</strong>
- 주기적인 비밀번호 변경 (3개월 권장)
- 다른 사이트와 동일한 비밀번호 사용 금지
- 개인정보가 포함된 비밀번호 사용 금지
- 비밀번호 관리 프로그램 사용 권장`,
  },
  {
    id: 5,
    category: 'Technical',
    title: '기술 지원 연락처',
    message: `기술 지원이 필요하신 경우 다음 방법으로 문의하실 수 있습니다.

<strong>이메일 문의</strong>
help@ktnet.com
- 기술적인 문제 발생 시 화면 캡처 또는 에러 메시지와 함께 전송
- 시스템 환경 정보 포함 (OS, 브라우저 버전 등)
- 영업일 기준 24시간 이내 답변

<strong>전화 문의</strong>
기술지원팀: 1588-5678
- 운영시간: 평일 09:00 ~ 18:00
- 점심시간: 12:00 ~ 13:00 (상담 불가)
- 주말 및 공휴일 휴무

<strong>긴급 장애 신고</strong>
24시간 긴급 연락처: 02-1234-5678
- 서비스 중단 등 긴급 상황에만 사용
- 시스템 관리자 직통 연결

<strong>원격 지원</strong>
기술적 문제 해결이 어려운 경우:
1. 기술지원팀에 전화 문의
2. 원격 지원 프로그램 다운로드 링크 전송받기
3. 프로그램 실행 후 연결코드 안내
4. 전문가의 원격 지원 받기

<strong>기술 문서 센터</strong>
help.ktnet.com에서 다양한 기술 문서를 확인하실 수 있습니다:
- API 문서
- 설치 가이드
- 트러블슈팅 가이드
- FAQ`,
  },
  {
    id: 6,
    category: 'Technical',
    title: '시스템 요구사항',
    message: `원활한 서비스 이용을 위한 시스템 요구사항을 안내드립니다.

<strong>운영체제</strong>
- Windows 10 이상 (64bit 권장)
- macOS 10.15 Catalina 이상
- Ubuntu 20.04 LTS 이상

<strong>웹 브라우저</strong>
권장 브라우저 (최신 버전):
- Google Chrome 100 이상
- Mozilla Firefox 100 이상
- Microsoft Edge 100 이상
- Safari 15 이상

지원 종료 브라우저:
- Internet Explorer (모든 버전)

<strong>하드웨어 요구사항</strong>
최소 사양:
- CPU: Intel Core i3 또는 동급 이상
- RAM: 4GB 이상
- 저장공간: 500MB 이상 여유 공간
- 해상도: 1280x720 이상

권장 사양:
- CPU: Intel Core i5 또는 동급 이상
- RAM: 8GB 이상
- 저장공간: 1GB 이상 여유 공간
- 해상도: 1920x1080 이상

<strong>네트워크</strong>
- 인터넷 속도: 10Mbps 이상
- 안정적인 네트워크 연결 필수
- 방화벽 설정: *.ktnet.com 도메인 허용

<strong>추가 소프트웨어</strong>
- Adobe PDF Reader (문서 열람 시)
- Microsoft Office 또는 호환 프로그램 (문서 편집 시)`,
  },
  {
    id: 7,
    category: 'Service',
    title: '추가 기능 사용 방법',
    message: `고급 기능 및 추가 기능 활성화 방법을 안내드립니다.

<strong>고급 설정 접근</strong>
1. 로그인 후 우측 상단 프로필 아이콘 클릭
2. [설정] 메뉴 선택
3. 좌측 메뉴에서 [고급 설정] 클릭

<strong>활성화 가능한 추가 기능</strong>

1. 자동 백업 기능
   - 데이터 자동 백업 주기 설정
   - 백업 저장 위치 지정
   - 최대 보관 개수 설정

2. 알림 설정
   - 이메일 알림 활성화/비활성화
   - 푸시 알림 설정
   - 알림 수신 시간대 설정

3. 대시보드 커스터마이징
   - 위젯 추가/제거
   - 레이아웃 변경
   - 테마 색상 변경

4. API 연동
   - API 키 발급
   - Webhook 설정
   - 외부 서비스 연동

5. 고급 검색 필터
   - 상세 검색 조건 설정
   - 저장된 검색 관리
   - 검색 결과 내보내기

<strong>기능별 활성화 방법</strong>
각 기능의 우측 토글 버튼을 클릭하여 활성화/비활성화할 수 있습니다.
일부 기능은 프리미엄 계정에서만 사용 가능합니다.

<strong>주의사항</strong>
- 일부 기능은 시스템 성능에 영향을 줄 수 있습니다
- 불필요한 기능은 비활성화를 권장합니다
- 설정 변경 후 반드시 [저장] 버튼을 클릭해주세요`,
  },
  {
    id: 8,
    category: 'Account',
    title: '계정 삭제 방법',
    message: `계정 삭제 절차 및 주의사항을 안내드립니다.

<strong>계정 삭제 전 확인사항</strong>
계정을 삭제하면 다음 데이터가 영구적으로 삭제됩니다:
- 프로필 정보
- 작성한 게시글 및 댓글
- 저장된 파일 및 문서
- 활동 기록
- 구독 정보

※ 삭제된 데이터는 복구가 불가능합니다.

<strong>계정 삭제 절차</strong>
1. 로그인 후 [마이페이지] 접속
2. [계정 관리] 메뉴 선택
3. 페이지 하단 [계정 삭제] 버튼 클릭
4. 삭제 사유 선택 (선택사항)
5. 비밀번호 입력
6. 삭제 확인 체크박스 선택
7. [계정 삭제하기] 버튼 클릭
8. 이메일로 전송된 최종 확인 링크 클릭

<strong>계정 삭제 대기 기간</strong>
계정 삭제 요청 후 30일의 대기 기간이 있습니다.
이 기간 동안:
- 로그인 가능 (계정 복구 가능)
- 데이터 백업 가능
- 삭제 취소 가능

30일 경과 후 계정이 영구적으로 삭제됩니다.

<strong>삭제 취소 방법</strong>
대기 기간 중 계정 삭제를 취소하려면:
1. 로그인 시도
2. "계정 삭제 대기 중" 메시지 확인
3. [삭제 취소] 버튼 클릭
4. 계정 정상화

<strong>대안: 계정 비활성화</strong>
계정을 완전히 삭제하지 않고 일시적으로 비활성화할 수도 있습니다:
- 데이터는 보존됨
- 로그인 불가
- 언제든지 재활성화 가능`,
  },
  {
    id: 9,
    category: 'Technical',
    title: '오류 발생 시 대응 방법',
    message: `시스템 오류 발생 시 문제 해결 방법을 안내드립니다.

<strong>1단계: 기본 점검</strong>
가장 먼저 다음 사항을 확인해주세요:
- 인터넷 연결 상태 확인
- 브라우저 버전 확인 (최신 버전 권장)
- 방화벽 또는 보안 프로그램 설정 확인
- 다른 브라우저에서도 동일한 문제 발생하는지 확인

<strong>2단계: 캐시 및 쿠키 삭제</strong>

Chrome 브라우저:
1. 우측 상단 ⋮ 메뉴 클릭
2. [설정] > [개인정보 및 보안] 선택
3. [인터넷 사용 기록 삭제] 클릭
4. 시간 범위: "전체 기간" 선택
5. "쿠키 및 기타 사이트 데이터", "캐시된 이미지 및 파일" 체크
6. [데이터 삭제] 클릭

Firefox 브라우저:
1. 우측 상단 ≡ 메뉴 클릭
2. [설정] > [개인정보 및 보안] 선택
3. [쿠키 및 사이트 데이터] > [데이터 지우기] 클릭
4. 원하는 항목 선택 후 삭제

<strong>3단계: 브라우저 확장 프로그램 비활성화</strong>
일부 확장 프로그램이 서비스와 충돌할 수 있습니다:
1. 시크릿 모드(Chrome) 또는 사생활 보호 모드(Firefox)로 접속
2. 정상 작동하면 확장 프로그램이 원인
3. 확장 프로그램 하나씩 비활성화하며 원인 확인

<strong>4단계: 시스템 재시작</strong>
- 브라우저 완전 종료 후 재시작
- 컴퓨터 재부팅
- 네트워크 장비(공유기) 재부팅

<strong>5단계: 기술 지원팀 문의</strong>
위 방법으로도 해결되지 않으면 다음 정보와 함께 문의:
- 발생한 오류 메시지 (화면 캡처)
- 오류 발생 시간
- 사용 중인 OS 및 브라우저 버전
- 수행하려던 작업 내용
- 오류 재현 단계

문의처: help@ktnet.com 또는 1588-5678`,
  },
  {
    id: 10,
    category: 'Service',
    title: '구독 서비스 취소 방법',
    message: `구독 서비스 해지 및 환불 정책을 안내드립니다.

<strong>구독 취소 절차</strong>
1. 로그인 후 [마이페이지] 접속
2. [구독 관리] 메뉴 선택
3. 현재 구독 중인 플랜 확인
4. [구독 취소] 버튼 클릭
5. 취소 사유 선택 (피드백용, 선택사항)
6. 취소 확인

<strong>취소 후 서비스 이용</strong>
구독을 취소해도 현재 결제 기간이 끝날 때까지는 서비스를 계속 이용할 수 있습니다.

예시:
- 구독일: 매월 1일
- 취소일: 12월 15일
- 서비스 이용 가능: 12월 31일까지
- 다음 결제 없음: 1월 1일부터

<strong>환불 정책</strong>

전액 환불 가능:
- 구독 시작 후 7일 이내
- 서비스를 실질적으로 이용하지 않은 경우
- 기술적 문제로 서비스 이용이 불가능했던 경우

부분 환불:
- 7일 경과 후 30일 이내
- 이용 일수에 비례하여 계산
- 계산식: (남은 일수 / 전체 일수) × 결제 금액

환불 불가:
- 30일 경과 후
- 프로모션 또는 할인으로 가입한 경우
- 이용권을 모두 소진한 경우

<strong>환불 신청 방법</strong>
1. [마이페이지] > [구독 관리] 접속
2. [환불 신청] 버튼 클릭
3. 환불 사유 및 계좌 정보 입력
4. 신청 완료

처리 기간:
- 영업일 기준 5~7일 소요
- 카드 결제: 카드사 정책에 따라 취소
- 계좌 이체: 입력한 계좌로 환불

<strong>재구독 안내</strong>
취소 후 언제든지 재구독이 가능합니다.
단, 이전 할인 혜택은 적용되지 않을 수 있습니다.

<strong>구독 일시 정지</strong>
완전히 취소하지 않고 1~3개월 일시 정지도 가능합니다:
- 데이터 보존
- 일시 정지 기간 중 결제 없음
- 원하는 시점에 재개 가능`,
  },
]

// 고유한 카테고리 목록
const categories = computed(() => {
  const cats = new Set(mockFaqData.map((item) => item.category))
  return Array.from(cats).sort()
})

// 탭 아이템
const tabItems = computed(() => {
  const items = [{ label: 'ALL', value: 'all' }]
  categories.value.forEach((cat) => {
    items.push({ label: cat, value: cat })
  })
  return items
})

// 필터링된 FAQ 목록
const filteredFaqList = computed(() => {
  return mockFaqData.filter((item) => {
    // 카테고리 필터링
    if (activeCategory.value !== 'all' && item.category !== activeCategory.value) {
      return false
    }

    // 제목 검색
    if (
      appliedFilters.searchTitle &&
      !item.title.toLowerCase().includes(appliedFilters.searchTitle.toLowerCase())
    ) {
      return false
    }

    // 메시지 검색
    if (
      appliedFilters.searchMessage &&
      !item.message.toLowerCase().includes(appliedFilters.searchMessage.toLowerCase())
    ) {
      return false
    }

    return true
  })
})

// 페이지네이션된 FAQ 리스트
const paginatedFaqList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredFaqList.value.slice(start, end)
})

// 전체 페이지 수
const totalPages = computed(() => {
  return Math.ceil(filteredFaqList.value.length / itemsPerPage.value)
})

// ============================================================
// Watchers
// ============================================================

// 탭 변경 시 페이지 초기화
watch(activeCategory, () => {
  currentPage.value = 1
  openedPanels.value = []
})

// 아이템 수 변경 시 페이지 초기화
watch(itemsPerPage, () => {
  currentPage.value = 1
  openedPanels.value = []
})
</script>
