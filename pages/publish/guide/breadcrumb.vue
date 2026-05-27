<template>
  <div class="pub-guide-layout">
    <h2>EblBreadcrumb 가이드</h2>
    <p class="guide-subtitle">breadcrumb 네비게이션 컴포넌트입니다</p>

    <div class="pub-preview pub-preview--wrap">
      <!-- 예제 1: 기본 사용 -->
      <div class="example-section">
        <h3>기본 사용</h3>
        <div class="example-box">
          <EblBreadcrumb
            :items="[
              { text: '홈', to: '/' },
              { text: '퍼블리싱 가이드', to: '/publish/guide' },
              { text: '브레드크럼' },
            ]"
          />
        </div>
        <CodeBlock :code="basicExample" language="vue" max-height="200px" />
      </div>

      <!-- 예제 2: 경로 많음 -->
      <div class="example-section">
        <h3>깊은 경로</h3>
        <div class="example-box">
          <EblBreadcrumb
            :items="[
              { text: '홈', to: '/' },
              { text: '메뉴1', to: '/menu1' },
              { text: '메뉴2', to: '/menu1/menu2' },
              { text: '메뉴3', to: '/menu1/menu2/menu3' },
              { text: '현재 페이지' },
            ]"
          />
        </div>
        <CodeBlock :code="deepExample" language="vue" max-height="200px" />
      </div>

      <!-- 예제 3: 링크 없음 -->
      <div class="example-section">
        <h3>링크 없는 브레드크럼</h3>
        <div class="example-box">
          <EblBreadcrumb
            :items="[{ text: '홈' }, { text: '퍼블리싱 가이드' }, { text: '브레드크럼' }]"
          />
        </div>
        <CodeBlock :code="noLinkExample" language="vue" max-height="200px" />
      </div>
    </div>

    <!-- Props 설명 -->
    <PubPropsSection :props="breadcrumbPropsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

const breadcrumbPropsData = [
  {
    name: 'items',
    type: 'Array',
    required: true,
    desc: 'breadcrumb 항목 배열 - 각 항목은 { text, to? } 구조, to는 선택사항 (마지막 항목은 링크 불가)',
  },
]

const basicExample = `<EblBreadcrumb
  :items="[
    { text: '홈', to: '/' },
    { text: '퍼블리싱 가이드', to: '/publish/guide' },
    { text: '브레드크럼' },
  ]"
/>`

const deepExample = `<EblBreadcrumb
  :items="[
    { text: '홈', to: '/' },
    { text: '메뉴1', to: '/menu1' },
    { text: '메뉴2', to: '/menu1/menu2' },
    { text: '메뉴3', to: '/menu1/menu2/menu3' },
    { text: '현재 페이지' },
  ]"
/>`

const noLinkExample = `<EblBreadcrumb
  :items="[
    { text: '홈' },
    { text: '퍼블리싱 가이드' },
    { text: '브레드크럼' },
  ]"
/>`
</script>

<style scoped lang="scss"></style>

