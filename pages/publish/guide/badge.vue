<template>
  <div class="pub-guide-layout">
    <h2>EblBadge 가이드</h2>
    <p class="guide-subtitle">배지 컴포넌트입니다</p>

    <div class="pub-preview pub-preview--wrap">
      <!-- Filled 스타일 -->
      <div class="example-section">
        <h3>Filled</h3>
        <div class="example-box">
          <div class="component-row">
            <EblBadge color="black" size="sm">badge</EblBadge>
            <EblBadge color="red" size="md">badge</EblBadge>
            <EblBadge color="pink" size="lg">badge</EblBadge>
            <EblBadge color="amber">badge</EblBadge>
            <EblBadge color="mint">badge</EblBadge>
            <EblBadge color="blue">badge</EblBadge>
            <EblBadge color="violet">badge</EblBadge>
          </div>
        </div>
        <CodeBlock :code="filledExample" language="vue" max-height="200px" />
      </div>

      <!-- Outlined 스타일 -->
      <div class="example-section">
        <h3>Outlined</h3>
        <div class="example-box">
          <div class="component-row">
            <EblBadge color="black" size="sm" variant="outlined">badge</EblBadge>
            <EblBadge color="red" size="md" variant="outlined">badge</EblBadge>
            <EblBadge color="pink" size="lg" variant="outlined">badge</EblBadge>
            <EblBadge color="amber" variant="outlined">badge</EblBadge>
            <EblBadge color="mint" variant="outlined">badge</EblBadge>
            <EblBadge color="blue" variant="outlined">badge</EblBadge>
            <EblBadge color="violet" variant="outlined">badge</EblBadge>
          </div>
        </div>
        <CodeBlock :code="outlinedExample" language="vue" max-height="200px" />
      </div>

      <!-- Tonal 스타일 -->
      <div class="example-section">
        <h3>Tonal</h3>
        <div class="example-box">
          <div class="component-row">
            <EblBadge color="black" size="sm" variant="tonal">badge</EblBadge>
            <EblBadge color="red" size="md" variant="tonal">badge</EblBadge>
            <EblBadge color="pink" size="lg" variant="tonal">badge</EblBadge>
            <EblBadge color="amber" variant="tonal">badge</EblBadge>
            <EblBadge color="mint" variant="tonal">badge</EblBadge>
            <EblBadge color="blue" variant="tonal">badge</EblBadge>
            <EblBadge color="violet" variant="tonal">badge</EblBadge>
          </div>
        </div>
        <CodeBlock :code="tonalExample" language="vue" max-height="200px" />
      </div>

      <!-- 커스텀 색상 -->
      <div class="example-section">
        <h3>커스텀 색상</h3>
        <div class="example-box">
          <div class="component-row">
            <EblBadge color="#FF6B6B">badge</EblBadge>
            <EblBadge color="#4ECDC4">badge</EblBadge>
            <EblBadge color="#95E1D3" variant="outlined">badge</EblBadge>
            <EblBadge color="#FFA502" variant="outlined">badge</EblBadge>
          </div>
          <div class="component-row">
            <EblBadge color="#FF6B6B" variant="tonal">badge</EblBadge>
            <EblBadge color="#4ECDC4" variant="tonal">badge</EblBadge>
            <EblBadge color="#AA96DA" variant="tonal">badge</EblBadge>
            <EblBadge color="#FFA502" variant="tonal">badge</EblBadge>
          </div>
        </div>
        <CodeBlock :code="customColorExample" language="vue" max-height="200px" />
      </div>

      <!-- Pill 모양 -->
      <div class="example-section">
        <h3>Pill 모양</h3>
        <div class="example-box">
          <div class="component-row">
            <p style="flex: 0 0 100%; margin-bottom: 8px">
              <strong>기본 (border-radius: 4px)</strong>
            </p>
            <EblBadge color="black" size="sm">badge</EblBadge>
            <EblBadge color="blue">badge</EblBadge>
            <EblBadge color="mint" size="lg">badge</EblBadge>
          </div>
          <div class="component-row">
            <p style="flex: 0 0 100%; margin-top: 16px; margin-bottom: 8px">
              <strong>Pill (border-radius: 9999px)</strong>
            </p>
            <EblBadge color="black" size="sm" pill>badge</EblBadge>
            <EblBadge color="blue" pill>badge</EblBadge>
            <EblBadge color="mint" size="lg" pill>badge</EblBadge>
          </div>
        </div>
        <CodeBlock :code="pillExample" language="vue" max-height="200px" />
      </div>

      <!-- 아이콘 포함 -->
      <div class="example-section">
        <h3>아이콘 포함</h3>
        <div class="example-box">
          <div class="component-row">
            <EblBadge color="blue">
              <VIcon size="14">mdi-check-circle</VIcon>
              <span>Success</span>
            </EblBadge>
            <EblBadge color="red">
              <VIcon size="14">mdi-alert-circle</VIcon>
              <span>Error</span>
            </EblBadge>
            <EblBadge color="amber">
              <VIcon size="14">mdi-information</VIcon>
              <span>Warning</span>
            </EblBadge>
          </div>
          <div class="component-row">
            <EblBadge color="mint" variant="outlined">
              <span>Download</span>
              <VIcon size="14">mdi-download</VIcon>
            </EblBadge>
            <EblBadge color="violet" variant="outlined">
              <span>Upload</span>
              <VIcon size="14">mdi-upload</VIcon>
            </EblBadge>
            <EblBadge color="pink" variant="outlined">
              <span>Share</span>
              <VIcon size="14">mdi-share-variant</VIcon>
            </EblBadge>
          </div>
          <div class="component-row">
            <EblBadge color="blue" variant="tonal" size="lg">
              <VIcon size="16">mdi-star</VIcon>
              <span>Featured</span>
            </EblBadge>
            <EblBadge color="red" variant="tonal" size="lg">
              <VIcon size="16">mdi-fire</VIcon>
              <span>Hot</span>
            </EblBadge>
            <EblBadge color="amber" variant="tonal" size="lg">
              <VIcon size="16">mdi-new-box</VIcon>
              <span>New</span>
            </EblBadge>
          </div>
        </div>
        <CodeBlock :code="iconExample" language="vue" max-height="300px" />
      </div>
    </div>

    <!-- Props 설명 -->
    <PubPropsSection :props="badgePropsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

const badgePropsData = [
  {
    name: 'color',
    type: 'String',
    default: 'black',
    desc: '배지 색상: black, red, pink, amber, mint, blue, violet 또는 커스텀 색상(hex, rgb)',
  },
  {
    name: 'variant',
    type: 'String',
    default: 'filled',
    desc: '배지 스타일: filled, outlined, tonal',
  },
  {
    name: 'size',
    type: 'String',
    default: 'md',
    desc: '배지 크기: sm | md | lg 또는 small | medium | large',
  },
  {
    name: 'pill',
    type: 'Boolean',
    default: 'false',
    desc: 'true일 때 pill 모양(border-radius: 9999px), false일 때 기본 모양(border-radius: 4px)',
  },
]

const filledExample = `<EblBadge color="black" size="sm">badge</EblBadge>
<EblBadge color="red" size="md">badge</EblBadge>
<EblBadge color="pink" size="lg">badge</EblBadge>
<EblBadge color="amber">badge</EblBadge>
<EblBadge color="mint">badge</EblBadge>
<EblBadge color="blue">badge</EblBadge>
<EblBadge color="violet">badge</EblBadge>`

const outlinedExample = `<EblBadge color="black" size="sm" variant="outlined">badge</EblBadge>
<EblBadge color="red" size="md" variant="outlined">badge</EblBadge>
<EblBadge color="pink" size="lg" variant="outlined">badge</EblBadge>
<EblBadge color="amber" variant="outlined">badge</EblBadge>
<EblBadge color="mint" variant="outlined">badge</EblBadge>
<EblBadge color="blue" variant="outlined">badge</EblBadge>
<EblBadge color="violet" variant="outlined">badge</EblBadge>`

const tonalExample = `<EblBadge color="black" size="sm" variant="tonal">badge</EblBadge>
<EblBadge color="red" size="md" variant="tonal">badge</EblBadge>
<EblBadge color="pink" size="lg" variant="tonal">badge</EblBadge>
<EblBadge color="amber" variant="tonal">badge</EblBadge>
<EblBadge color="mint" variant="tonal">badge</EblBadge>
<EblBadge color="blue" variant="tonal">badge</EblBadge>
<EblBadge color="violet" variant="tonal">badge</EblBadge>`

const customColorExample = `<!-- Filled -->
<EblBadge color="#FF6B6B">badge</EblBadge>
<EblBadge color="#4ECDC4">badge</EblBadge>

<!-- Outlined -->
<EblBadge color="#95E1D3" variant="outlined">badge</EblBadge>
<EblBadge color="rgb(255, 165, 2)" variant="outlined">badge</EblBadge>

<!-- Tonal (opacity 0.5 배경) -->
<EblBadge color="#FF6B6B" variant="tonal">badge</EblBadge>
<EblBadge color="#4ECDC4" variant="tonal">badge</EblBadge>`

const pillExample = `<!-- 기본 (border-radius: 4px) -->
<EblBadge color="black" size="sm">badge</EblBadge>
<EblBadge color="blue">badge</EblBadge>
<EblBadge color="mint" size="lg">badge</EblBadge>

<!-- Pill 모양 (border-radius: 9999px) -->
<EblBadge color="black" size="sm" pill>badge</EblBadge>
<EblBadge color="blue" pill>badge</EblBadge>
<EblBadge color="mint" size="lg" pill>badge</EblBadge>`

const iconExample = `<!-- 아이콘 앞에 -->
<EblBadge color="blue">
  <VIcon size="14">mdi-check-circle</VIcon>
  <span>Success</span>
</EblBadge>

<!-- 아이콘 뒤에 -->
<EblBadge color="mint" variant="outlined">
  <span>Download</span>
  <VIcon size="14">mdi-download</VIcon>
</EblBadge>

<!-- 큰 사이즈 -->
<EblBadge color="blue" variant="tonal" size="lg">
  <VIcon size="16">mdi-star</VIcon>
  <span>Featured</span>
</EblBadge>`
</script>
<style scoped lang="scss"></style>
