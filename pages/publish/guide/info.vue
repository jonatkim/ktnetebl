<template>
  <div class="pub-guide-layout">
    <h2>EblInfo 정보 표시 가이드</h2>
    <p class="guide-subtitle">
      라벨-값 쌍으로 정보를 표시하는 컴포넌트입니다. 상세 페이지나 다이얼로그에서 사용됩니다.
    </p>

    <!-- Basic Usage -->
    <section class="guide-section">
      <h3>기본 사용법</h3>
      <div class="pub-preview pub-preview--wrap">
        <div class="pub-preview__preview">
          <EblInfo>
            <EblInfoItem label="Category">eBL</EblInfoItem>
            <EblInfoItem label="Title">eBL 등록 방법 문의 드립니다</EblInfoItem>
            <VDivider />
            <EblInfoItem label="Message">
              eBL 등록할 위한 절차 문의는 어떤 것들이 있는지<br />
              문의 드립니다.<br />
              또한, 해당 양식이 있는지도 궁금합니다.
            </EblInfoItem>
            <EblInfoItem label="Answerer">Admin1</EblInfoItem>
            <EblInfoItem label="Answer Status">Waiting</EblInfoItem>
            <EblInfoItem label="Add Date">2025-09-19</EblInfoItem>
          </EblInfo>
        </div>
        <div class="pub-preview__code">
          <CodeBlock :code="basicCode" language="vue" max-height="300px" />
        </div>
      </div>
    </section>

    <!-- Required & Tooltip -->
    <section class="guide-section">
      <h3>필수 항목 & 툴팁</h3>
      <div class="pub-preview pub-preview--wrap">
        <div class="pub-preview__preview">
          <EblInfo>
            <EblInfoItem label="Category" required tooltip="카테고리를 선택해주세요" hasInput>
              <EblSelect
                v-model="form.category"
                placeholder="Select Category"
                :options="categoryOptions"
              />
            </EblInfoItem>
            <EblInfoItem
              label="This is a very long title label with required and tooltip"
              required
              tooltip="제목을 입력해주세요"
              hasInput
            >
              <EblInput v-model="form.title" placeholder="Input a Title" />
            </EblInfoItem>
            <EblInfoItem label="Message" required hasInput>
              <EblInput v-model="form.message" placeholder="Input a Message" />
            </EblInfoItem>
          </EblInfo>
        </div>
        <div class="pub-preview__code">
          <CodeBlock :code="requiredCode" language="vue" max-height="300px" />
        </div>
      </div>
    </section>

    <!-- Custom Label Width -->
    <section class="guide-section">
      <h3>라벨 폭 커스터마이징</h3>
      <div class="pub-preview pub-preview--wrap">
        <div class="pub-preview__preview">
          <EblInfo style="--ebl-info-label-width: 160px">
            <EblInfoItem label="Long Label Name">Value with custom label width (160px)</EblInfoItem>
            <EblInfoItem label="Another Long Label">Another value</EblInfoItem>
            <EblInfoItem
              label="This is a very long label name that will be truncated with ellipsis"
            >
              긴 라벨명은 말줄임 처리됩니다
            </EblInfoItem>
          </EblInfo>
        </div>
        <div class="pub-preview__code">
          <CodeBlock :code="widthCode" language="vue" max-height="200px" />
        </div>
      </div>
    </section>

    <!-- Vertical Layout -->
    <section class="guide-section">
      <h3>수직 레이아웃</h3>
      <div class="pub-preview pub-preview--wrap">
        <div class="pub-preview__preview">
          <EblInfo vertical>
            <EblInfoItem label="Category">eBL</EblInfoItem>
            <EblInfoItem label="Title" required tooltip="제목을 입력해주세요"
              >eBL 등록 방법 문의 드립니다</EblInfoItem
            >
            <EblInfoItem label="Message">
              eBL 등록할 위한 절차 문의는 어떤 것들이 있는지<br />
              문의 드립니다.
            </EblInfoItem>
          </EblInfo>
        </div>
        <div class="pub-preview__code">
          <CodeBlock :code="verticalCode" language="vue" max-height="200px" />
        </div>
      </div>
    </section>

    <!-- Mixed Layout -->
    <section class="guide-section">
      <h3>혼합 레이아웃 (개별 제어)</h3>
      <div class="pub-preview pub-preview--wrap">
        <div class="pub-preview__preview">
          <EblInfo>
            <EblInfoItem label="Category">eBL</EblInfoItem>
            <EblInfoItem label="Title" :vertical="true">eBL 등록 방법 문의 드립니다</EblInfoItem>
            <EblInfoItem label="Message" :vertical="true">
              eBL 등록할 위한 절차 문의는 어떤 것들이 있는지<br />
              문의 드립니다.
            </EblInfoItem>
            <EblInfoItem label="Answerer">Admin1</EblInfoItem>
          </EblInfo>
        </div>
        <div class="pub-preview__code">
          <CodeBlock :code="mixedCode" language="vue" max-height="300px" />
        </div>
      </div>
    </section>

    <!-- Complex Content -->
    <section class="guide-section">
      <h3>복잡한 컨텐츠 (첨부파일)</h3>
      <div class="pub-preview pub-preview--wrap">
        <div class="pub-preview__preview">
          <EblInfo>
            <EblInfoItem label="Category">eBL</EblInfoItem>
            <EblInfoItem label="Title">eBL 등록 방법 문의 드립니다</EblInfoItem>
            <EblInfoItem label="Attachment" hasInput>
              <div style="display: flex; flex-direction: column; gap: 8px">
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">name12345.png</span>
                  <EblBtn small outlined>Download</EblBtn>
                </div>
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">name.png</span>
                  <EblBtn small outlined>Download</EblBtn>
                </div>
                <div class="ebl-file-item">
                  <span class="ebl-file-item__name">name098765.png</span>
                  <EblBtn small outlined>Download</EblBtn>
                </div>
              </div>
            </EblInfoItem>
            <EblInfoItem label="Answer">
              eBL 등록 방법에 대해 안내드립니다.<br />
              첨부 문서는 아래것들이 있으며, 해당 양식도 아래 것들이 있습니다.
            </EblInfoItem>
          </EblInfo>
        </div>
        <div class="pub-preview__code">
          <CodeBlock :code="attachmentCode" language="vue" max-height="400px" />
        </div>
      </div>
    </section>

    <!-- Custom Label Slot -->
    <section class="guide-section">
      <h3>커스텀 라벨 슬롯</h3>
      <div class="pub-preview pub-preview--wrap">
        <div class="pub-preview__preview">
          <EblInfo>
            <EblInfoItem>
              <template #label>
                <VIcon icon="ebli:info" :size="14" />
                <span style="font-weight: 600; color: #2f6bff">Custom Label</span>
              </template>
              Custom label content using slot
            </EblInfoItem>
            <EblInfoItem label="Normal Label">Normal content</EblInfoItem>
          </EblInfo>
        </div>
        <div class="pub-preview__code">
          <CodeBlock :code="slotCode" language="vue" max-height="250px" />
        </div>
      </div>
    </section>

    <!-- Props 설명 -->
    <PubPropsSection title="EblInfo Props" :props="infoPropsData" />
    <PubPropsSection title="EblInfoItem Props" :props="infoItemPropsData" />
    <PubPropsSection title="EblInfoItem Slots" :props="infoItemSlotsData" />
    <PubPropsSection title="CSS Variables" :props="cssVariablesData" />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'guide' })

const form = reactive({
  category: '',
  title: '',
  message: '',
})

const categoryOptions = [
  { label: 'eBL', value: 'ebl' },
  { label: 'eNego', value: 'enego' },
  { label: 'Other', value: 'other' },
]

const basicCode = `<EblInfo>
  <EblInfoItem label="Category">eBL</EblInfoItem>
  <EblInfoItem label="Title">eBL 등록 방법 문의 드립니다</EblInfoItem>
  <VDivider />
  <EblInfoItem label="Message">
    eBL 등록할 위한 절차 문의는 어떤 것들이 있는지<br />
    문의 드립니다.<br />
    또한, 해당 양식이 있는지도 궁금합니다.
  </EblInfoItem>
  <EblInfoItem label="Answerer">Admin1</EblInfoItem>
  <EblInfoItem label="Answer Status">Waiting</EblInfoItem>
  <EblInfoItem label="Add Date">2025-09-19</EblInfoItem>
</EblInfo>`

const requiredCode = `<EblInfo>
  <EblInfoItem label="Category" required tooltip="카테고리를 선택해주세요" hasInput>
    <EblSelect v-model="form.category" placeholder="Select Category" :options="categoryOptions" />
  </EblInfoItem>
  <EblInfoItem
    label="This is a very long title label with required and tooltip"
    required
    tooltip="제목을 입력해주세요"
    hasInput
  >
    <EblInput v-model="form.title" placeholder="Input a Title" />
  </EblInfoItem>
  <EblInfoItem label="Message" required hasInput>
    <EblInput v-model="form.message" placeholder="Input a Message" />
  </EblInfoItem>
</EblInfo>`

const widthCode = `<EblInfo style="--ebl-info-label-width: 160px">
  <EblInfoItem label="Long Label Name">Value with custom label width (160px)</EblInfoItem>
  <EblInfoItem label="Another Long Label">Another value</EblInfoItem>
  <EblInfoItem label="This is a very long label name that will be truncated with ellipsis">
    긴 라벨명은 말줄임 처리됩니다
  </EblInfoItem>
</EblInfo>`

const verticalCode = `<EblInfo vertical>
  <EblInfoItem label="Category">eBL</EblInfoItem>
  <EblInfoItem label="Title" required tooltip="제목을 입력해주세요">eBL 등록 방법 문의 드립니다</EblInfoItem>
  <EblInfoItem label="Message">
    eBL 등록할 위한 절차 문의는 어떤 것들이 있는지<br />
    문의 드립니다.
  </EblInfoItem>
</EblInfo>`

const attachmentCode = `<EblInfo>
  <EblInfoItem label="Attachment" hasInput>
    <div style="display: flex; flex-direction: column; gap: 8px">
      <div style="display: flex; align-items: center; gap: 12px">
        <span>name12345.png</span>
        <EblBtn small outlined>Download</EblBtn>
      </div>
      <div style="display: flex; align-items: center; gap: 12px">
        <span>name.png</span>
        <EblBtn small outlined>Download</EblBtn>
      </div>
      <div style="display: flex; align-items: center; gap: 12px">
        <span>name098765.png</span>
        <EblBtn small outlined>Download</EblBtn>
      </div>
    </div>
  </EblInfoItem>
</EblInfo>`

const mixedCode = `<EblInfo>
  <EblInfoItem label="Category">eBL</EblInfoItem>
  <EblInfoItem label="Title" :vertical="true">eBL 등록 방법 문의 드립니다</EblInfoItem>
  <EblInfoItem label="Message" :vertical="true">
    eBL 등록할 위한 절차 문의는 어떤 것들이 있는지<br />
    문의 드립니다.
  </EblInfoItem>
  <EblInfoItem label="Answerer">Admin1</EblInfoItem>
</EblInfo>`

const slotCode = `<EblInfo>
  <EblInfoItem>
    <template #label>
      <VIcon icon="ebli:info" :size="14" />
      <span style="font-weight: 600; color: #2f6bff">Custom Label</span>
    </template>
    Custom label content using slot
  </EblInfoItem>
  <EblInfoItem label="Normal Label">Normal content</EblInfoItem>
</EblInfo>`

const infoPropsData = [
  {
    name: 'vertical',
    type: 'Boolean',
    default: 'false',
    description: 'Vertical layout mode (label 위, content 아래)',
  },
]

const infoItemPropsData = [
  {
    name: 'label',
    type: 'String',
    default: "''",
    description: 'Label text',
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'false',
    description: 'Show required asterisk (*)',
  },
  {
    name: 'tooltip',
    type: 'String',
    default: "''",
    description: 'Tooltip message on hover',
  },
  {
    name: 'vertical',
    type: 'Boolean',
    default: 'undefined',
    description: 'Individual vertical mode (overrides parent EblInfo vertical prop)',
  },
  {
    name: 'hasInput',
    type: 'Boolean',
    default: 'false',
    description: 'Apply form element styling (center-aligned for inputs, selects, etc.)',
  },
]

const infoItemSlotsData = [
  {
    name: 'label',
    type: 'Slot',
    default: '-',
    description: 'Custom label content (overrides label prop)',
  },
  {
    name: 'default',
    type: 'Slot',
    default: '-',
    description: 'Content area',
  },
]

const cssVariablesData = [
  {
    name: '--ebl-info-label-width',
    type: 'CSS Length',
    default: '120px',
    description: 'Label column width',
  },
  {
    name: '--ebl-info-gap',
    type: 'CSS Length',
    default: '12px',
    description: 'Gap between items',
  },
]
</script>
