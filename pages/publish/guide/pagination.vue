<template>
  <div class="pub-guide-layout">
    <h2>EblPagination 가이드</h2>
    <p class="guide-subtitle">페이지네이션 컴포넌트입니다 (VPagination alias)</p>

    <div class="pub-preview pub-preview--wrap">
      <!-- 기본 사용 -->
      <div class="example-section">
        <h3>기본 사용</h3>
        <div class="example-box">
          <div class="component-row">
            <EblPagination v-model="page1" length="25" total-visible="5" />
          </div>
        </div>
        <CodeBlock :code="basicExample" language="vue" max-height="200px" />
      </div>

      <!-- 처음/마지막 페이지 버튼 -->
      <div class="example-section">
        <h3>처음/마지막 페이지 버튼</h3>
        <div class="example-box">
          <div class="component-row">
            <EblPagination v-model="page2" length="25" show-first-last-page total-visible="5" />
          </div>
        </div>
        <CodeBlock :code="showFirstLastExample" language="vue" max-height="200px" />
      </div>

      <!-- 크기 변형 -->
      <div class="example-section">
        <h3>크기 변형 (Density)</h3>
        <div class="example-box">
          <div class="component-row-stacked">
            <div>
              <p style="margin-bottom: 8px"><strong>Compact</strong></p>
              <EblPagination v-model="page3" length="8" density="compact" />
            </div>
            <div>
              <p style="margin-bottom: 8px"><strong>Default</strong></p>
              <EblPagination v-model="page3" length="8" />
            </div>
            <div>
              <p style="margin-bottom: 8px"><strong>Comfortable</strong></p>
              <EblPagination v-model="page3" length="8" density="comfortable" />
            </div>
          </div>
        </div>
        <CodeBlock :code="densityExample" language="vue" max-height="250px" />
      </div>

      <!-- 표시 페이지 수 제한 -->
      <div class="example-section">
        <h3>표시 페이지 수 제한 (Total Visible)</h3>
        <div class="example-box">
          <div class="component-row-stacked">
            <div>
              <p style="margin-bottom: 8px"><strong>Total Visible = 5 (length=20)</strong></p>
              <EblPagination v-model="page4" length="20" total-visible="5" />
            </div>
            <div>
              <p style="margin-bottom: 8px">
                <strong>Total Visible = 7 (default, length=20)</strong>
              </p>
              <EblPagination v-model="page5" length="20" />
            </div>
            <div>
              <p style="margin-bottom: 8px"><strong>Total Visible = 10 (length=50)</strong></p>
              <EblPagination v-model="page6" length="50" total-visible="10" />
            </div>
          </div>
        </div>
        <CodeBlock :code="totalVisibleExample" language="vue" max-height="250px" />
      </div>

      <!-- 둥근 모양 -->
      <div class="example-section">
        <h3>둥근 모양 (Rounded)</h3>
        <div class="example-box">
          <div class="component-row">
            <EblPagination v-model="page7" length="8" rounded="circle" />
          </div>
        </div>
        <CodeBlock :code="roundedExample" language="vue" max-height="200px" />
      </div>

      <!-- 비활성화 -->
      <div class="example-section">
        <h3>비활성화</h3>
        <div class="example-box">
          <div class="component-row">
            <EblPagination v-model="page8" length="10" disabled />
          </div>
        </div>
        <CodeBlock :code="disabledExample" language="vue" max-height="200px" />
      </div>

      <!-- 실전 예제 -->
      <div class="example-section">
        <h3>실전 예제</h3>
        <div class="example-box">
          <div class="component-row">
            <div style="text-align: center">
              <p style="margin-bottom: 12px">
                현재 페이지: <strong>{{ currentPage }}</strong> / {{ totalPages }}
              </p>
              <EblPagination
                v-model="currentPage"
                :length="totalPages"
                show-first-last-page
                @update:model-value="onPageChange"
              />
            </div>
          </div>
        </div>
        <CodeBlock :code="practicalExample" language="vue" max-height="300px" />
      </div>
    </div>

    <!-- API Reference -->
    <div class="api-reference">
      <h3>API Reference</h3>
      <p>
        EblPagination은 Vuetify의 VPagination alias입니다. 자세한 사용법은
        <a
          href="https://vuetifyjs.com/en/components/paginations/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vuetify Pagination 공식 문서
        </a>
        를 참고하세요.
      </p>
    </div>

    <!-- Props 설명 -->
    <PubPropsSection :props="paginationPropsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

// 각 예제별 페이지 상태
const page1 = ref(1)
const page2 = ref(1)
const page3 = ref(1)
const page4 = ref(1)
const page5 = ref(1)
const page6 = ref(1)
const page7 = ref(1)
const page8 = ref(5)
const currentPage = ref(1)
const totalPages = ref(10)

// 페이지 변경 핸들러
const onPageChange = (page) => {
  console.log('Page changed to:', page)
}

// Props 데이터
const paginationPropsData = [
  {
    name: 'v-model',
    type: 'Number',
    default: '1',
    desc: '현재 선택된 페이지 번호',
  },
  {
    name: 'length',
    type: 'String | Number',
    default: '1',
    desc: '총 페이지 수',
  },
  {
    name: 'show-first-last-page',
    type: 'Boolean',
    default: 'false',
    desc: '처음/마지막 페이지 버튼 표시',
  },
  {
    name: 'total-visible',
    type: 'String | Number',
    default: 'undefined',
    desc: '한번에 표시할 페이지 버튼 수',
  },
  {
    name: 'density',
    type: 'String',
    default: 'default',
    desc: "크기 변형: 'compact' | 'default' | 'comfortable'",
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '비활성화 여부',
  },
  {
    name: 'rounded',
    type: 'String',
    default: 'undefined',
    desc: "둥근 모양: 'circle' 등",
  },
]

// 코드 예제
const basicExample = `<template>
  <EblPagination v-model="page" length="25" total-visible="5" />
</template>

<script setup>
const page = ref(1)
<\/script>`

const showFirstLastExample = `<template>
  <EblPagination 
    v-model="page" 
    length="25" 
    show-first-last-page
    total-visible="5"
  />
</template>

<script setup>
const page = ref(1)
<\/script>`

const densityExample = `<template>
  <!-- Compact -->
  <EblPagination v-model="page" length="8" density="compact" />
  
  <!-- Default -->
  <EblPagination v-model="page" length="8" />
  
  <!-- Comfortable -->
  <EblPagination v-model="page" length="8" density="comfortable" />
</template>

<script setup>
const page = ref(1)
<\/script>`

const totalVisibleExample = `<template>
  <!-- Total Visible = 5 -->
  <EblPagination v-model="page" length="20" total-visible="5" />
  
  <!-- Total Visible = 7 (default) -->
  <EblPagination v-model="page" length="20" />
  
  <!-- Total Visible = 10 -->
  <EblPagination v-model="page" length="50" total-visible="10" />
</template>

<script setup>
const page = ref(1)
<\/script>`

const roundedExample = `<template>
  <EblPagination v-model="page" length="8" rounded="circle" />
</template>

<script setup>
const page = ref(1)
<\/script>`

const disabledExample = `<template>
  <EblPagination v-model="page" length="10" disabled />
</template>

<script setup>
const page = ref(5)
<\/script>`

const practicalExample = `<template>
  <div>
    <p>현재 페이지: {{ currentPage }} / {{ totalPages }}</p>
    <EblPagination
      v-model="currentPage"
      :length="totalPages"
      show-first-last-page
      @update:model-value="onPageChange"
    />
  </div>
</template>

<script setup>
const currentPage = ref(1)
const totalPages = ref(10)

const onPageChange = (page) => {
  console.log('Page changed to:', page)
  // API 호출, 데이터 로딩 등
}
<\/script>`
</script>
