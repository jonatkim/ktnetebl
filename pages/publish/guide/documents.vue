<template>
  <VContainer fill-height class="pub-container pub-container--fill-height pub-container--scroll">
    <div class="pub-header__top">
      <h1 class="pub-page-header">개발 가이드 문서</h1>
    </div>

    <!-- Documentation Sections -->
    <div class="pub-docs">
      <!-- 설치 및 기초 설정 -->
      <PubPropsSection
        title="1️⃣ 설치 및 기초 설정"
        :open="true"
        description="프로젝트 설치부터 초기 실행까지 필요한 모든 정보"
      >
        <div class="doc-content">
          <h3>📦 프로젝트 초기화</h3>
          <CodeBlock
            code="# Node.js 버전 확인 (18.x 이상 권장)
node --version

# pnpm 설치 (npm 또는 yarn도 사용 가능)
npm install -g pnpm

# 프로젝트 의존성 설치
pnpm install
# 또는
npm install"
            language="bash"
          />

          <h3>🚀 개발 서버 실행</h3>
          <CodeBlock
            code="# 개발 서버 시작 (포트 3000)
npm run dev

# 브라우저에서 접속
# http://localhost:3000"
            language="bash"
          />

          <h3>🔨 빌드 및 배포</h3>
          <CodeBlock
            code="# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 한 번에 빌드 및 미리보기
npm run build:preview"
            language="bash"
          />

          <h3>🎨 코드 포매팅 & 린팅</h3>
          <CodeBlock
            code="# ESLint 검사 실행
npm run lint

# 자동으로 ESLint 에러 수정
npm run lint:fix

# Stylelint 검사 (SCSS/CSS)
npm run lint:style

# Prettier로 전체 포매팅
npm run format"
            language="bash"
          />

          <h3>📋 기술 스택</h3>
          <div class="tech-stack">
            <div class="tech-item">
              <strong>Frontend Framework:</strong> Nuxt 3 (Vue 3 Composition API)
            </div>
            <div class="tech-item"><strong>State Management:</strong> Pinia</div>
            <div class="tech-item"><strong>UI Framework:</strong> Vuetify 3</div>
            <div class="tech-item"><strong>Data Grid:</strong> AG Grid Community (Vue 3)</div>
            <div class="tech-item"><strong>Date Picker:</strong> @vuepic/vue-datepicker</div>
            <div class="tech-item"><strong>Internationalization:</strong> @nuxtjs/i18n</div>
            <div class="tech-item"><strong>Styling:</strong> SCSS with Vuetify tokens</div>
            <div class="tech-item">
              <strong>Code Quality:</strong> ESLint + Prettier + Stylelint
            </div>
          </div>
        </div>
      </PubPropsSection>

      <!-- 프로젝트 구조 -->
      <PubPropsSection title="2️⃣ 프로젝트 구조" description="폴더별 역할 및 네이밍 컨벤션">
        <div class="doc-content">
          <h3>📁 주요 폴더 구조</h3>
          <div class="folder-tree">
            <div class="tree-item">
              <strong>pages/</strong> - 페이지 및 라우팅
              <div class="tree-child">
                <div>pc/ - PC 버전 페이지</div>
                <div>mo/ - Mobile 버전 페이지</div>
                <div>portal/ - Portal 서비스 페이지</div>
                <div>publish/ - 퍼블리싱 가이드 페이지</div>
              </div>
            </div>

            <div class="tree-item">
              <strong>components/</strong> - Vue 컴포넌트
              <div class="tree-child">
                <div>common/ - 공용 컴포넌트 (Ebl prefix로 자동 import)</div>
                <div>grid/ - AG Grid 셀 렌더러</div>
                <div>layout/ - 레이아웃 컴포넌트</div>
                <div>publish/ - 퍼블리싱 페이지 컴포넌트</div>
              </div>
            </div>

            <div class="tree-item">
              <strong>stores/</strong> - Pinia 상태 관리
              <div class="tree-child">
                <div>useMainStore.js - 메인 스토어 (사용자, UI상태)</div>
                <div>useDialogStore.js - 다이얼로그 상태</div>
                <div>usePubStore.js - 퍼블리싱 메뉴 데이터</div>
                <div>toast.js - 토스트 알림 큐</div>
                <div>pubMenus.js - 퍼블리싱 메뉴 정의</div>
              </div>
            </div>

            <div class="tree-item">
              <strong>composables/</strong> - Vue Composables (재사용 로직)
              <div class="tree-child">
                <div>useFormat.js - 숫자/날짜 포매팅</div>
                <div>useLocale.js - 다국어 지원</div>
                <div>useClipboard.js - 클립보드 작업</div>
                <div>useAgGridTheme.js - AG Grid 테마</div>
              </div>
            </div>

            <div class="tree-item">
              <strong>layouts/</strong> - 레이아웃 템플릿
              <div class="tree-child">
                <div>default.vue - 기본 레이아웃 (LNB 포함)</div>
                <div>blank.vue - 빈 레이아웃</div>
                <div>portal.vue - Portal 서비스 레이아웃</div>
                <div>guide.vue - 퍼블리싱 가이드 레이아웃</div>
              </div>
            </div>

            <div class="tree-item">
              <strong>middleware/</strong> - 라우트 미들웨어
              <div class="tree-child">
                <div>device-guard.global.js - 디바이스 가드</div>
              </div>
            </div>

            <div class="tree-item">
              <strong>assets/</strong> - 정적 파일
              <div class="tree-child">
                <div>styles/ - SCSS 스타일 시스템</div>
                <div>images/ - 이미지 및 아이콘</div>
                <div>fonts/ - 웹폰트</div>
              </div>
            </div>

            <div class="tree-item">
              <strong>plugins/</strong> - Nuxt 플러그인
              <div class="tree-child">
                <div>vuetify.js - Vuetify 초기화</div>
                <div>ag-grid.client.js - AG Grid 클라이언트 설정</div>
                <div>vue-datepicker.client.js - DatePicker 플러그인</div>
              </div>
            </div>

            <div class="tree-item">
              <strong>i18n/</strong> - 다국어 파일
              <div class="tree-child">
                <div>locales/ko.json - 한국어</div>
                <div>locales/en.json - 영어</div>
              </div>
            </div>

            <div class="tree-item">
              <strong>utils/</strong> - 유틸리티 함수
              <div class="tree-child">
                <div>date.js - 날짜 관련 유틸</div>
              </div>
            </div>
          </div>

          <h3>📝 파일명 및 컴포넌트명 컨벤션</h3>
          <div class="convention-table">
            <div class="conv-row">
              <div class="conv-label">페이지 파일</div>
              <div class="conv-desc">
                <code>EBLPAY010U.vue</code> (화면ID 기반) <br />
                <small>조회(U), 등록(P), 수정(C), 삭제(D) 등 접미사 사용</small>
              </div>
            </div>
            <div class="conv-row">
              <div class="conv-label">공용 컴포넌트</div>
              <div class="conv-desc">
                <code>EblButton.vue</code> → <code>&lt;EblButton /&gt;</code> (PascalCase)
              </div>
            </div>
            <div class="conv-row">
              <div class="conv-label">Composable</div>
              <div class="conv-desc">
                <code>useFormat.js</code> → <code>const { formatNumber } = useFormat()</code>
              </div>
            </div>
            <div class="conv-row">
              <div class="conv-label">Store</div>
              <div class="conv-desc">
                <code>useMainStore.js</code> → <code>const store = useMainStore()</code>
              </div>
            </div>
          </div>
        </div>
      </PubPropsSection>

      <!-- Pinia 스토어 -->
      <PubPropsSection title="3️⃣ Pinia 상태 관리 가이드" description="전역 상태 관리 시스템">
        <div class="doc-content">
          <h3>🏪 useMainStore - 메인 스토어</h3>
          <CodeBlock
            code="import { useMainStore } from '~/stores/useMainStore'

const mainStore = useMainStore()

// 상태 접근
console.log(mainStore.username)      // 사용자명
console.log(mainStore.userType)      // 'carrier' | 'shipper' | 'bank'
console.log(mainStore.lnbVisible)    // 좌측 네비게이션 표시 여부
console.log(mainStore.favorites)     // 즐겨찾기 목록

// 액션 호출
mainStore.setUsername('John Doe')
mainStore.setUserType('shipper')
mainStore.toggleLnb()
mainStore.addFavorite('EBLPAT010U')
mainStore.removeFavorite('EBLPAT010U')"
            language="javascript"
          />

          <h3>💬 useToastStore - 토스트 알림</h3>
          <CodeBlock
            code="import { useToastStore } from '~/stores/toast'

const toastStore = useToastStore()

// 성공 메시지
toastStore.add({
  text: 'Saved successfully!',
  color: 'success',
  timeout: 3000,
})

// 에러 메시지
toastStore.add({
  text: 'An error occurred!',
  color: 'error',
  timeout: 3000,
})

// 정보 메시지
toastStore.add({
  text: 'This is an info message',
  color: 'info',
  timeout: 3000,
})"
            language="javascript"
          />

          <h3>🎯 useDialogStore - 다이얼로그 상태</h3>
          <CodeBlock
            code="import { useDialogStore } from '~/stores/useDialogStore'

const dialogStore = useDialogStore()

// 로컬 ref로 관리하는 것이 더 간단합니다
const dialogOpen = ref(false)
const openDialog = () => {
  dialogOpen.value = true
}
const closeDialog = () => {
  dialogOpen.value = false
}"
            language="javascript"
          />

          <h3>📚 usePubStore - 퍼블리싱 메뉴</h3>
          <CodeBlock
            code="import { usePubStore } from '~/stores/usePubStore'

const pubStore = usePubStore()

// 퍼블리싱 메뉴 데이터 접근
const menus = pubStore.pubMenus

// 구조:
// [{
//   screenId: 'EBLPAY010U',
//   name: 'Account Balance',
//   service: 'ebl',
//   levels: ['Payments', 'Account Balance'],
//   completedAt: '2026-01-15',
//   parentScreenId: null (팝업이면 부모 screenId),
//   ...
// }]"
            language="javascript"
          />

          <h3>💾 Pinia 베스트 프래틱스</h3>
          <div class="best-practice">
            <div class="practice-item">
              <strong>✅ DO:</strong> 큰 상태는 스토어에서 관리
              <br />
              <small>사용자 정보, 앱 전역 설정, 사용자 선호도</small>
            </div>
            <div class="practice-item">
              <strong>❌ DON'T:</strong> 로컬 상태까지 스토어에서 관리
              <br />
              <small>폼 입력값, 모달 열고닫기, 페이지 로컬 상태</small>
            </div>
            <div class="practice-item">
              <strong>✅ DO:</strong> Composition API 문법 사용
              <br />
              <small>함수형으로 더 읽기 쉽고 타입 안정성 향상</small>
            </div>
            <div class="practice-item">
              <strong>✅ DO:</strong> `import { storeToRefs }` 사용 (반응성 유지)
              <br />
              <small>const { username, favorites } = storeToRefs(mainStore)</small>
            </div>
          </div>
        </div>
      </PubPropsSection>

      <!-- 컴포넌트 시스템 -->
      <PubPropsSection
        title="4️⃣ 컴포넌트 시스템"
        description="공용 컴포넌트 사용법 및 커스터마이징"
      >
        <div class="doc-content">
          <h3>🎨 공용 컴포넌트 가이드</h3>
          <p style="color: #666; margin: 12px 0">
            자세한 컴포넌트 사용법은 <strong>Component Guide</strong> 페이지를 참고하세요.
          </p>
          <div class="component-links">
            <a href="/publish/guide/buttons" class="comp-link">
              <VIcon size="small">mdi-button-pointer</VIcon>
              Button
            </a>
            <a href="/publish/guide/tabs" class="comp-link">
              <VIcon size="small">mdi-tab</VIcon>
              Tabs
            </a>
            <a href="/publish/guide/breadcrumb" class="comp-link">
              <VIcon size="small">mdi-map-marker-path</VIcon>
              Breadcrumb
            </a>
            <a href="/publish/guide/checkbox" class="comp-link">
              <VIcon size="small">mdi-checkbox-multiple-marked</VIcon>
              Checkbox
            </a>
            <a href="/publish/guide/radio" class="comp-link">
              <VIcon size="small">mdi-radiobox-marked</VIcon>
              Radio Button
            </a>
            <a href="/publish/guide/switch" class="comp-link">
              <VIcon size="small">mdi-toggle-switch</VIcon>
              Switch
            </a>
            <a href="/publish/guide/icons" class="comp-link">
              <VIcon size="small">mdi-image</VIcon>
              Icons
            </a>
            <a href="/publish/guide/badge" class="comp-link">
              <VIcon size="small">mdi-label</VIcon>
              Badge
            </a>
            <a href="/publish/guide/tooltip" class="comp-link">
              <VIcon size="small">mdi-tooltip-text</VIcon>
              Tooltip
            </a>
            <a href="/publish/guide/pagination" class="comp-link">
              <VIcon size="small">mdi-page-layout-footer</VIcon>
              Pagination
            </a>
            <a href="/publish/guide/toast" class="comp-link">
              <VIcon size="small">mdi-bell-outline</VIcon>
              Toast
            </a>
            <a href="/publish/guide/dialog" class="comp-link">
              <VIcon size="small">mdi-message-outline</VIcon>
              Dialog
            </a>
            <a href="/publish/guide/info" class="comp-link">
              <VIcon size="small">mdi-information-outline</VIcon>
              Info
            </a>
            <a href="/publish/guide/textfield" class="comp-link">
              <VIcon size="small">mdi-form-textbox</VIcon>
              Textfield
            </a>
            <a href="/publish/guide/textarea" class="comp-link">
              <VIcon size="small">mdi-text-box-multiple-outline</VIcon>
              Textarea
            </a>
            <a href="/publish/guide/table" class="comp-link">
              <VIcon size="small">mdi-table</VIcon>
              Data Grid
            </a>
            <a href="/publish/guide/datepicker" class="comp-link">
              <VIcon size="small">mdi-calendar-month</VIcon>
              Date Picker
            </a>
            <a href="/publish/guide/select" class="comp-link">
              <VIcon size="small">mdi-menu-down</VIcon>
              Select
            </a>
            <a href="/publish/guide/fileinput" class="comp-link">
              <VIcon size="small">mdi-file-upload-outline</VIcon>
              File Input
            </a>
            <a href="/publish/guide/i18n" class="comp-link">
              <VIcon size="small">mdi-translate</VIcon>
              i18n Guide
            </a>
            <a href="/publish/guide/routing" class="comp-link">
              <VIcon size="small">mdi-routes</VIcon>
              Routing
            </a>
          </div>

          <h3>💬 EblDialog 사용 패턴</h3>
          <p style="color: #666; margin: 12px 0">
            카드가 오른쪽에서 슬라이드 되며 나타나는 트렌지션을 원할 때는
            <code>transition="slide-x-reverse-transition"</code> prop을 명시합니다.
          </p>

          <h4>기본 사용법</h4>
          <CodeBlock
            :code="`<template>
  <EblDialog 
    v-model=&quot;dialogOpen&quot; 
    transition=&quot;slide-x-reverse-transition&quot;
    @close=&quot;closeDialog&quot;
  >
    <VCard width=&quot;500&quot; class=&quot;ebl-dialog__card&quot;>
      <VCardTitle class=&quot;ebl-dialog__header&quot;>
        <span class=&quot;title&quot;>Dialog Title</span>
        <VSpacer />
        <EblBtn icon pill small @click=&quot;closeDialog&quot;>
          <VIcon icon=&quot;ebli:close&quot; :size=&quot;20&quot; />
        </EblBtn>
      </VCardTitle>

      <VCardText class=&quot;ebl-dialog__text&quot;>
        <!-- 콘텐츠 -->
      </VCardText>

      <VCardActions>
        <VSpacer />
        <EblBtn color=&quot;cta&quot; large>Save</EblBtn>
      </VCardActions>
    </VCard>
  </EblDialog>
</template>`"
            language="vue"
          />

          <h4>여러 Dialog를 순차적으로 표시하는 경우</h4>
          <p style="color: #666; margin: 12px 0">
            첫 번째 Dialog에서 추가 액션 (예: MID 검색)을 선택하면 두 번째 Dialog가 오른쪽에서
            나타나는 패턴입니다.
          </p>
          <CodeBlock
            :code="`<!-- 첫 번째 Dialog: 파트너 추가 -->
<EblDialog 
  v-model=&quot;dialogOpen&quot; 
  transition=&quot;slide-x-reverse-transition&quot;
>
  <VCard width=&quot;500&quot; class=&quot;ebl-dialog__card&quot;>
    <VCardTitle class=&quot;ebl-dialog__header&quot;>
      <span class=&quot;title&quot;>파트너 추가</span>
      <VSpacer />
      <EblBtn icon pill small @click=&quot;closeDialog&quot;>
        <VIcon icon=&quot;ebli:close&quot; :size=&quot;20&quot; />
      </EblBtn>
    </VCardTitle>

    <VCardText class=&quot;ebl-dialog__text&quot;>
      <EblInput 
        v-model=&quot;formData.mid&quot; 
        placeholder=&quot;Choose MID&quot; 
        prepend-icon=&quot;ebli:search&quot;
        readonly
        @click=&quot;openSearchDialog&quot;
      />
      <EblInput 
        v-model=&quot;formData.partnerName&quot; 
        label=&quot;파트너명&quot; 
        style=&quot;margin-top: 12px&quot;
      />
    </VCardText>

    <VCardActions>
      <VSpacer />
      <EblBtn @click=&quot;closeDialog&quot;>취소</EblBtn>
      <EblBtn color=&quot;cta&quot; large @click=&quot;handleSave&quot;>저장</EblBtn>
    </VCardActions>

    <!-- 두 번째 Dialog: MID 검색 (오른쪽에서 나타남) -->
    <v-slide-x-reverse-transition>
      <VCard v-if=&quot;searchDialogOpen&quot; width=&quot;900&quot; class=&quot;ebl-dialog__card&quot;>
        <VCardTitle class=&quot;ebl-dialog__header&quot;>
          <span class=&quot;title&quot;>MID 검색</span>
          <VSpacer />
          <EblBtn icon pill small @click=&quot;closeSearchDialog&quot;>
            <VIcon icon=&quot;ebli:close&quot; :size=&quot;20&quot; />
          </EblBtn>
        </VCardTitle>

        <VCardText class=&quot;ebl-dialog__text&quot;>
          <!-- 검색 필터 -->
          <EblInput 
            v-model=&quot;searchFilters.keyword&quot; 
            placeholder=&quot;Company Name or MID&quot;
            prepend-icon=&quot;ebli:search&quot;
            clearable
          />

          <!-- 검색 결과 Grid -->
          <AgGridVue
            class=&quot;ebl-data-grid ag-theme-quartz mt-3&quot;
            :rowData=&quot;searchResults&quot;
            :columnDefs=&quot;searchColDefs&quot;
            :dom-layout=&quot;'autoHeight'&quot;
            :row-selection=&quot;'single'&quot;
            @selection-changed=&quot;onSearchSelectionChanged&quot;
          >
          </AgGridVue>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <EblBtn @click=&quot;closeSearchDialog&quot;>취소</EblBtn>
          <EblBtn 
            color=&quot;cta&quot; 
            large 
            :disabled=&quot;!selectedMid&quot;
            @click=&quot;selectMid&quot;
          >선택</EblBtn>
        </VCardActions>
      </VCard>
    </v-slide-x-reverse-transition>
  </VCard>
</EblDialog>`"
            language="vue"
          />

          <h3>📋 Dialog 스타일 클래스</h3>
          <div class="style-guide">
            <div class="guide-item">
              <strong>.ebl-dialog__card</strong>
              <br />
              <small>Dialog 카드의 기본 스타일 (너비, 패딩)</small>
            </div>
            <div class="guide-item">
              <strong>.ebl-dialog__header</strong>
              <br />
              <small>제목 영역 스타일 (수평 레이아웃, 닫기 버튼)</small>
            </div>
            <div class="guide-item">
              <strong>.ebl-dialog__text</strong>
              <br />
              <small>콘텐츠 영역 스타일 (패딩, 여백)</small>
            </div>
          </div>
        </div>
      </PubPropsSection>
    </div>

    <div class="pub-bottom-space" />
  </VContainer>
</template>

<script setup>
definePageMeta({ layout: 'guide' })

const searchQuery = ref('')
const selectedCategory = ref([])
const filterEl = ref(null)

const categories = [
  'Setup',
  'Structure',
  'Store',
  'Component',
  'Styling',
  'API',
  'Git',
  'Deployment',
]

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = []
}

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

<style scoped lang="scss">
.pub-docs {
  padding-bottom: 40px;
}

.doc-content {
  h3 {
    margin: 24px 0 12px;
    font-size: 16px;
    font-weight: 600;
    color: #333;

    &:first-child {
      margin-top: 0;
    }
  }

  h4 {
    margin: 18px 0 10px;
    font-size: 14px;
    font-weight: 600;
    color: #444;
  }

  p {
    margin: 12px 0;
    font-size: 13px;
    line-height: 1.6;
  }

  code {
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    font-family: 'Courier New', monospace;
    color: #d73a49;
  }
}

.tech-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;

  .tech-item {
    padding: 8px 12px;
    background: #f0f7ff;
    border-left: 3px solid #2c5cc5;
    font-size: 13px;
    line-height: 1.6;

    strong {
      color: #2c5cc5;
    }
  }
}

.folder-tree {
  margin: 12px 0;

  .tree-item {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    font-size: 13px;

    strong {
      color: #2c5cc5;
    }

    .tree-child {
      padding-left: 20px;
      margin-top: 4px;

      div {
        color: #666;
        padding: 4px 0;
        font-size: 12px;
      }
    }
  }
}

.convention-table {
  margin: 12px 0;

  .conv-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 16px;
    padding: 12px;
    border-bottom: 1px solid #eee;
    font-size: 13px;

    .conv-label {
      font-weight: 600;
      color: #333;
    }

    .conv-desc {
      color: #666;

      code {
        background: #f5f5f5;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
      }

      small {
        display: block;
        margin-top: 4px;
        color: #999;
      }
    }
  }
}

.best-practice {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px 0;

  .practice-item {
    padding: 12px;
    border-radius: 4px;
    font-size: 13px;
    line-height: 1.6;

    strong {
      display: block;
      margin-bottom: 4px;
    }

    small {
      color: #666;
    }

    &:nth-child(even) {
      background: #f5f5f5;
    }
  }
}

.component-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin: 12px 0;

  .comp-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: #f0f7ff;
    border: 1px solid #d4e4f7;
    border-radius: 4px;
    color: #2c5cc5;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
      background: #e3f0ff;
      border-color: #2c5cc5;
    }
  }
}

.style-guide {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 12px 0;

  .guide-item {
    padding: 10px 12px;
    background: #fff8e1;
    border-left: 3px solid #fbc02d;
    border-radius: 2px;
    font-size: 13px;

    strong {
      color: #f57f17;
      font-family: 'Courier New', monospace;
    }

    small {
      display: block;
      margin-top: 4px;
      color: #666;
    }
  }
}
</style>
