<template>
  <div class="pub-guide-layout">
    <h2>EblFileInput 가이드</h2>
    <p class="guide-subtitle">파일 업로드 컴포넌트 사용 예시</p>

    <!-- Features -->
    <section class="guide-section">
      <h3>주요 기능</h3>
      <div class="feature-list">
        <div class="feature-item">
          <VIcon color="success">mdi-check-circle</VIcon>
          <div>
            <h4>드래그 앤 드롭</h4>
            <p>파일을 드래그하여 업로드 영역에 드롭</p>
          </div>
        </div>
        <div class="feature-item">
          <VIcon color="success">mdi-check-circle</VIcon>
          <div>
            <h4>이미지 썸네일</h4>
            <p>이미지 파일은 자동으로 썸네일 미리보기 표시</p>
          </div>
        </div>
        <div class="feature-item">
          <VIcon color="success">mdi-check-circle</VIcon>
          <div>
            <h4>파일 크기 표시</h4>
            <p>업로드된 파일의 크기를 KB 단위로 표시</p>
          </div>
        </div>
        <div class="feature-item">
          <VIcon color="success">mdi-check-circle</VIcon>
          <div>
            <h4>개별 파일 삭제</h4>
            <p>각 파일마다 삭제 버튼 제공</p>
          </div>
        </div>
        <div class="feature-item">
          <VIcon color="success">mdi-check-circle</VIcon>
          <div>
            <h4>드래그 상태 표시</h4>
            <p>드래그 중일 때 시각적 피드백 제공</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Basic File Upload -->
    <section class="guide-section">
      <h3>기본 파일 업로드</h3>
      <div class="pub-preview">
        <div class="pub-preview__preview">
          <EblFileInput
            v-model="basicFiles"
            placeholder="Click here to upload your file or drag."
            help-text="PDF, JPEG, PNG (50MB max)"
          />
        </div>
        <div class="pub-preview__code">
          <CodeGroup :items="basicCodeItems" />
        </div>
      </div>
    </section>

    <!-- Image Only Upload -->
    <section class="guide-section">
      <h3>이미지 파일만 업로드</h3>
      <div class="pub-preview">
        <div class="pub-preview__preview">
          <EblFileInput
            v-model="imageFiles"
            accept="image/*"
            placeholder="Upload your image file"
            help-text="BMP, GIF, SVG, PNG, JPG, JPEG (50MB max)"
          />
        </div>
        <div class="pub-preview__code">
          <CodeGroup :items="imageCodeItems" />
        </div>
      </div>
    </section>

    <!-- Multiple Files Upload -->
    <section class="guide-section">
      <h3>다중 파일 업로드</h3>
      <div class="pub-preview">
        <div class="pub-preview__preview">
          <EblFileInput
            v-model="multipleFiles"
            multiple
            placeholder="Upload multiple files"
            help-text="You can select or drag multiple files"
          />
        </div>
        <div class="pub-preview__code">
          <CodeGroup :items="multipleCodeItems" />
        </div>
      </div>
    </section>

    <!-- With Thumbnail (Page Integration Example) -->
    <section class="guide-section">
      <h3>썸네일과 함께 사용 (페이지 통합 예시)</h3>
      <div class="pub-preview">
        <div class="pub-preview__preview">
          <div class="file-input-with-thumbnail">
            <div class="thumbnail-preview">
              <img v-if="thumbnailPreview" :src="thumbnailPreview" alt="Preview" />
              <span v-else>image</span>
            </div>
            <EblFileInput
              v-model="thumbnailFiles"
              accept="image/*"
              placeholder="Upload company logo"
              help-text="BMP, GIF, SVG, PNG, JPG, JPEG (50MB max)"
            />
          </div>
        </div>
        <div class="pub-preview__code">
          <CodeGroup :items="thumbnailCodeItems" />
        </div>
      </div>
    </section>

    <!-- Props 설명 -->
    <PubPropsSection :props="fileInputProps" />
  </div>
</template>

<script setup>
import PubPropsSection from '~/components/publish/PubPropsSection.vue'

definePageMeta({ layout: 'guide' })

// File states
const basicFiles = ref([])
const imageFiles = ref([])
const multipleFiles = ref([])
const thumbnailFiles = ref([])
const thumbnailPreview = ref(null)

// Watch thumbnail files for preview
watch(thumbnailFiles, (newFiles) => {
  if (newFiles.length > 0 && newFiles[0].type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      thumbnailPreview.value = e.target?.result
    }
    reader.readAsDataURL(newFiles[0])
  } else {
    thumbnailPreview.value = null
  }
})

// Props definition for PubPropsSection
const fileInputProps = [
  {
    name: 'modelValue',
    type: 'Array',
    default: '[]',
    desc: '업로드된 파일 배열 (v-model)',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: 'Click here to upload your file or drag.',
    desc: '드롭존 메인 텍스트',
  },
  {
    name: 'helpText',
    type: 'String',
    default: "''",
    desc: '드롭존 설명 텍스트',
  },
  {
    name: 'accept',
    type: 'String',
    default: "'*'",
    desc: "허용할 파일 타입 (예: 'image/*', '.pdf')",
  },
  {
    name: 'multiple',
    type: 'Boolean',
    default: 'false',
    desc: '다중 파일 업로드 허용 여부',
  },
]

// Code examples - Basic
const basicTemplateCode = `<EblFileInput
  v-model="files"
  placeholder="Click here to upload your file or drag."
  help-text="PDF, JPEG, PNG (50MB max)"
/>`

const basicScriptCode = `const files = ref([])`

const basicCodeItems = computed(() => [
  {
    title: 'Template',
    code: basicTemplateCode,
    language: 'vue',
  },
  {
    title: 'Script',
    code: basicScriptCode,
    language: 'javascript',
  },
])

// Code examples - Image Only
const imageTemplateCode = `<EblFileInput
  v-model="imageFiles"
  accept="image/*"
  placeholder="Upload your image file"
  help-text="BMP, GIF, SVG, PNG, JPG, JPEG (50MB max)"
/>`

const imageScriptCode = `const imageFiles = ref([])`

const imageCodeItems = computed(() => [
  {
    title: 'Template',
    code: imageTemplateCode,
    language: 'vue',
  },
  {
    title: 'Script',
    code: imageScriptCode,
    language: 'javascript',
  },
])

// Code examples - Multiple Files
const multipleTemplateCode = `<EblFileInput
  v-model="files"
  multiple
  placeholder="Upload multiple files"
  help-text="You can select or drag multiple files"
/>`

const multipleScriptCode = `const files = ref([])`

const multipleCodeItems = computed(() => [
  {
    title: 'Template',
    code: multipleTemplateCode,
    language: 'vue',
  },
  {
    title: 'Script',
    code: multipleScriptCode,
    language: 'javascript',
  },
])

// Code examples - Thumbnail Integration
const thumbnailTemplateCode = `<div class="file-input-with-thumbnail">
  <div class="thumbnail-preview">
    <img v-if="preview" :src="preview" alt="Preview" />
    <span v-else>image</span>
  </div>
  <EblFileInput
    v-model="files"
    accept="image/*"
    placeholder="Upload company logo"
    help-text="BMP, GIF, SVG, PNG, JPG, JPEG (50MB max)"
  />
</div>`

const thumbnailScriptCode = `const files = ref([])
const preview = ref(null)

watch(files, (newFiles) => {
  if (newFiles.length > 0 && newFiles[0].type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.value = e.target?.result
    }
    reader.readAsDataURL(newFiles[0])
  } else {
    preview.value = null
  }
})`

const thumbnailStyleCode = `.file-input-with-thumbnail {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
}

.thumbnail-preview {
  width: 200px;
  height: 200px;
  border: 1px dashed rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    color: #9ca3af;
    font-size: 14px;
  }
}`

const thumbnailCodeItems = computed(() => [
  {
    title: 'Template',
    code: thumbnailTemplateCode,
    language: 'vue',
  },
  {
    title: 'Script',
    code: thumbnailScriptCode,
    language: 'javascript',
  },
  {
    title: 'Style',
    code: thumbnailStyleCode,
    language: 'scss',
  },
])
</script>

<style scoped lang="scss">
.file-input-with-thumbnail {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: start;
}

.thumbnail-preview {
  width: 200px;
  height: 200px;
  border: 1px dashed rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    color: #9ca3af;
    font-size: 14px;
  }
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.feature-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;

  h4 {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #6b7280;
  }
}

.guide-section {
  margin-top: 48px;

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
  }
}
</style>
