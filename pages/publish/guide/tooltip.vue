<template>
  <div class="pub-guide-layout">
    <h2>EblTooltip 가이드</h2>
    <p class="guide-subtitle">툴팁 컴포넌트입니다 (VTooltip alias)</p>

    <div class="pub-preview pub-preview--wrap">
      <!-- 기본 사용 -->
      <div class="example-section">
        <h3>기본 사용</h3>
        <div class="example-box">
          <div class="component-row">
            <EblTooltip text="이것은 툴팁입니다">
              <template #activator="{ props }">
                <EblBtn v-bind="props">Hover me</EblBtn>
              </template>
            </EblTooltip>
          </div>
        </div>
        <CodeBlock :code="basicExample" language="vue" max-height="200px" />
      </div>

      <!-- Location -->
      <div class="example-section">
        <h3>위치 (Location)</h3>
        <div class="example-box">
          <div class="component-grid--fixed-4">
            <EblTooltip text="Top tooltip" location="top">
              <template #activator="{ props }">
                <EblBtn v-bind="props">Top</EblBtn>
              </template>
            </EblTooltip>
            <EblTooltip text="Bottom tooltip" location="bottom">
              <template #activator="{ props }">
                <EblBtn v-bind="props">Bottom</EblBtn>
              </template>
            </EblTooltip>
            <EblTooltip text="Left tooltip" location="left">
              <template #activator="{ props }">
                <EblBtn v-bind="props">Left</EblBtn>
              </template>
            </EblTooltip>
            <EblTooltip text="Right tooltip" location="right">
              <template #activator="{ props }">
                <EblBtn v-bind="props">Right</EblBtn>
              </template>
            </EblTooltip>
          </div>
        </div>
        <CodeBlock :code="locationExample" language="vue" max-height="200px" />
      </div>

      <!-- Slot Content -->
      <div class="example-section">
        <h3>커스텀 콘텐츠</h3>
        <div class="example-box">
          <div class="component-row">
            <EblTooltip>
              <template #activator="{ props }">
                <EblBadge v-bind="props" color="blue">Hover badge</EblBadge>
              </template>
              <template #default>
                <div style="text-align: center">
                  <strong>Custom Content</strong><br />
                  <small>HTML을 포함할 수 있습니다</small>
                </div>
              </template>
            </EblTooltip>
          </div>
        </div>
        <CodeBlock :code="slotExample" language="vue" max-height="200px" />
      </div>

      <!-- Disabled -->
      <div class="example-section">
        <h3>비활성화</h3>
        <div class="example-box">
          <div class="component-row">
            <EblTooltip text="활성화된 툴팁">
              <template #activator="{ props }">
                <EblBtn v-bind="props">Enabled</EblBtn>
              </template>
            </EblTooltip>
            <EblTooltip text="비활성화된 툴팁" disabled>
              <template #activator="{ props }">
                <EblBtn v-bind="props">Disabled</EblBtn>
              </template>
            </EblTooltip>
          </div>
        </div>
        <CodeBlock :code="disabledExample" language="vue" max-height="200px" />
      </div>

      <!-- Open on Click -->
      <div class="example-section">
        <h3>클릭으로 열기</h3>
        <div class="example-box">
          <div class="component-row">
            <EblTooltip text="클릭으로 열기" location="top" open-on-click :open-on-hover="false">
              <template #activator="{ props }">
                <EblBtn v-bind="props">Click me</EblBtn>
              </template>
            </EblTooltip>
          </div>
        </div>
        <CodeBlock :code="clickExample" language="vue" max-height="200px" />
      </div>

      <!-- Directive -->
      <div class="example-section">
        <h3>v-tooltip 디렉티브</h3>
        <div class="example-box">
          <div class="component-row">
            <EblBtn v-tooltip="'Simple tooltip'">Directive</EblBtn>
            <!-- argument로 위치 지정 (: 사용) -->
            <EblBtn v-tooltip:top="'Top tooltip'">Top</EblBtn>
            <EblBtn v-tooltip:bottom="'Bottom tooltip'">Bottom</EblBtn>
            <EblBtn v-tooltip:left="'Left tooltip'">Left</EblBtn>
            <EblBtn v-tooltip:right="'Right tooltip'">Right</EblBtn>

            <!-- hyphen으로 세부 위치 지정 -->
            <EblBtn v-tooltip:top-start="'Top Start'">Top Start</EblBtn>
            <EblBtn v-tooltip:bottom-end="'Bottom End'">Bottom End</EblBtn>
            <EblBtn v-tooltip="{ text: 'Bottom tooltip', location: 'bottom' }">Bottom</EblBtn>
            <EblBtn
              v-tooltip="{
                text: '클릭 디렉티브',
                location: 'right',
                openOnClick: true,
                openOnHover: false,
              }"
            >
              Click
            </EblBtn>
          </div>
        </div>
        <CodeBlock :code="directiveExample" language="vue" max-height="250px" />
      </div>
    </div>

    <!-- API Reference -->
    <div class="api-reference">
      <h3>API Reference</h3>
      <p>
        EblTooltip은 Vuetify의 VTooltip alias입니다. 자세한 사용법은
        <a
          href="https://vuetifyjs.com/en/components/tooltips/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vuetify Tooltips 공식 문서
        </a>
        를 참고하세요.
      </p>
    </div>

    <!-- Props 설명 -->
    <PubPropsSection :props="tooltipPropsData" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'
definePageMeta({ layout: 'guide' })

const tooltipPropsData = [
  {
    name: 'text',
    type: 'String',
    default: '',
    desc: '툴팁에 표시할 텍스트',
  },
  {
    name: 'location',
    type: 'String',
    default: 'top',
    desc: '툴팁 위치: top, bottom, left, right, start, end 조합 가능',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '툴팁 비활성화',
  },
  {
    name: 'openOnClick',
    type: 'Boolean',
    default: 'false',
    desc: '클릭 시 툴팁 열기',
  },
  {
    name: 'openOnHover',
    type: 'Boolean',
    default: 'true',
    desc: 'Hover 시 툴팁 열기',
  },
]

const basicExample = `<EblTooltip text="이것은 툴팁입니다">
  <template #activator="{ props }">
    <EblBtn v-bind="props">Hover me</EblBtn>
  </template>
</EblTooltip>`

const locationExample = `<EblTooltip text="Top tooltip" location="top">
  <template #activator="{ props }">
    <EblBtn v-bind="props">Top</EblBtn>
  </template>
</EblTooltip>
<EblTooltip text="Bottom tooltip" location="bottom">
  <template #activator="{ props }">
    <EblBtn v-bind="props">Bottom</EblBtn>
  </template>
</EblTooltip>`

const slotExample = `<EblTooltip>
  <template #activator="{ props }">
    <EblBadge v-bind="props" color="blue">Hover badge</EblBadge>
  </template>
  <template #default>
    <div style="text-align: center;">
      <strong>Custom Content</strong><br />
      <small>HTML을 포함할 수 있습니다</small>
    </div>
  </template>
</EblTooltip>`

const disabledExample = `<EblTooltip text="활성화된 툴팁">
  <template #activator="{ props }">
    <EblBtn v-bind="props">Enabled</EblBtn>
  </template>
</EblTooltip>
<EblTooltip text="비활성화된 툴팁" disabled>
  <template #activator="{ props }">
    <EblBtn v-bind="props">Disabled</EblBtn>
  </template>
</EblTooltip>`

const clickExample = `<EblTooltip text="클릭으로 열기" location="top" open-on-click :open-on-hover="false">
  <template #activator="{ props }">
    <EblBtn v-bind="props">Click me</EblBtn>
  </template>
</EblTooltip>`

const directiveExample = `<!-- 문자열로 간단히 사용 -->
<EblBtn v-tooltip="'Simple tooltip'">Directive</EblBtn>

<!-- argument로 위치 지정 (: 사용) -->
<EblBtn v-tooltip:top="'Top tooltip'">Top</EblBtn>
<EblBtn v-tooltip:bottom="'Bottom tooltip'">Bottom</EblBtn>
<EblBtn v-tooltip:left="'Left tooltip'">Left</EblBtn>
<EblBtn v-tooltip:right="'Right tooltip'">Right</EblBtn>

<!-- hyphen으로 세부 위치 지정 -->
<EblBtn v-tooltip:top-start="'Top Start'">Top Start</EblBtn>
<EblBtn v-tooltip:bottom-end="'Bottom End'">Bottom End</EblBtn>

<!-- 객체로 옵션 설정 -->
<EblBtn v-tooltip="{ text: 'Bottom tooltip', location: 'bottom' }">
  Bottom
</EblBtn>

<!-- 클릭 디렉티브 -->
<EblBtn
  v-tooltip="{
    text: '클릭 디렉티브',
    location: 'right',
    openOnClick: true,
    openOnHover: false,
  }"
>
  Click
</EblBtn>`
</script>

<style scoped lang="scss"></style>

