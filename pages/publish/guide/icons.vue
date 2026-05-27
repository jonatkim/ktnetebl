<template>
  <div class="pub-guide-layout">
    <h2>아이콘 가이드</h2>
    <p class="guide-subtitle">프로젝트에서 사용하는 아이콘 컴포넌트입니다</p>

    <!-- 아이콘 설정 컨트롤 -->
    <section class="section">
      <h3>아이콘 설정</h3>
      <div class="display-box">
        <div class="control-group">
          <label>크기 (px)</label>
          <div class="size-options">
            <EblBtn
              v-for="s in sizeOptions"
              :key="s"
              :outlined="iconSize !== s"
              :color="iconSize === s ? 'primary' : 'subtle'"
              @click="iconSize = s"
            >
              {{ s }}px
            </EblBtn>
          </div>
          <input
            v-model.number="iconSize"
            type="range"
            min="16"
            max="128"
            step="4"
            class="control-slider"
          />
        </div>

        <div class="control-group">
          <label>색상</label>
          <div class="color-options">
            <button
              v-for="c in colorOptions"
              :key="c.value"
              :class="['color-btn', { active: iconColor === c.value }]"
              :style="{ background: c.value }"
              @click="iconColor = c.value"
              :title="c.label"
            >
              <VIcon v-if="iconColor === c.value" icon="mdi-check" :size="16" color="white" />
            </button>
          </div>
          <input v-model="iconColor" type="color" class="control-input" />
        </div>
      </div>
    </section>

    <!-- EBLI 커스텀 아이콘 -->
    <section class="section">
      <h3>EBLI 커스텀 아이콘</h3>
      <div class="display-box">
        <p>
          총 <strong>{{ ebliIconList.length }}</strong
          >개의 커스텀 아이콘이 있습니다.
        </p>
        <p>
          <code>/assets/images/icons/ebli/*.svg</code> 폴더에 SVG 파일을 추가하면 자동으로 사용할 수
          있습니다.
        </p>
        <p>
          <strong>파일명 규칙:</strong> 영문 소문자, 숫자, 하이픈(-) 사용 권장 (예:
          <code>arrow-right.svg</code> → <code>ebli:arrow-right</code>)
        </p>
        <p>
          아이콘을 클릭하면 <code>&lt;v-icon&gt;ebli:아이콘명&lt;/v-icon&gt;</code> 마크업이
          클립보드에 복사됩니다.
        </p>
        <p>아이콘명을 클릭하면 아이콘명만 복사됩니다.</p>
      </div>

      <div class="icon-grid">
        <div v-for="icon in ebliIconList" :key="icon.name" class="icon-item">
          <div
            class="icon-display"
            @click="copyIconMarkup('ebli', icon.name)"
            :title="`클릭하여 <VIcon>ebli:${icon.name}</VIcon> 복사`"
          >
            <VIcon :size="iconSize" :color="iconColor">ebli:{{ icon.name }}</VIcon>
          </div>
          <div
            class="icon-name"
            @click="copyIconName('ebli', icon.name)"
            :title="`클릭하여 ebli:${icon.name} 복사`"
          >
            {{ icon.name }}
          </div>
        </div>
      </div>
    </section>

    <!-- MDI 아이콘 -->
    <section class="section">
      <h3>Material Design Icons (MDI)</h3>
      <div class="display-box">
        <p>Vuetify에서 제공하는 Material Design Icons 샘플입니다.</p>
        <p>
          전체 7,000개 이상의 아이콘은
          <a
            href="https://pictogrammers.com/library/mdi/"
            target="_blank"
            rel="noopener"
            class="mdi-link"
          >
            <VIcon size="16">mdi-open-in-new</VIcon>
            pictogrammers.com/library/mdi </a
          >에서 확인하세요.
        </p>
      </div>

      <div class="icon-grid">
        <div v-for="icon in mdiIconList" :key="icon" class="icon-item">
          <div
            class="icon-display"
            @click="copyIconMarkup('mdi', icon)"
            :title="`클릭하여 <VIcon>${icon}</VIcon> 복사`"
          >
            <VIcon :size="iconSize" :color="iconColor">{{ icon }}</VIcon>
          </div>
          <div
            class="icon-name"
            @click="copyIconName('mdi', icon)"
            :title="`클릭하여 ${icon} 복사`"
          >
            {{ icon.replace('mdi-', '') }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'guide' })

// 클립보드 composable 사용
const { copyToClipboard } = useClipboard()

// 아이콘 설정
const iconSize = ref(20)
const iconColor = ref('#121a26')

const sizeOptions = [16, 20, 24, 32, 48, 64]
const colorOptions = [
  { label: 'Default', value: '#121a26' },
  { label: 'Gray', value: '#6c757d' },
  { label: 'Primary', value: '#476dfc' },
  { label: 'Success', value: '#24a148' },
  { label: 'Error', value: '#e53935' },
  { label: 'Warning', value: '#f57c00' },
  { label: 'Info', value: '#1976d2' },
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#ffffff' },
]

// EBLI 커스텀 아이콘 - 빌드 시점에 ebli 폴더의 모든 SVG 파일들을 읽어서 아이콘 리스트 생성
const iconModules = import.meta.glob('~/assets/images/icons/ebli/*.svg', { eager: true })

// 파일명에서 아이콘명 추출 및 정렬
const ebliIconList = Object.keys(iconModules)
  .map((path) => {
    const fileName = path.split('/').pop()
    const iconName = fileName
      .replace(/\.svg$/i, '')
      .replace(/[_\s]+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
    return {
      name: iconName,
      file: fileName,
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

// MDI 아이콘 샘플 (자주 사용되는 일부 아이콘만 표시)
const mdiIconList = [
  'mdi-home',
  'mdi-account',
  'mdi-cog',
  'mdi-bell',
  'mdi-email',
  'mdi-phone',
  'mdi-calendar',
  'mdi-clock',
  'mdi-magnify',
  'mdi-plus',
  'mdi-close',
  'mdi-check',
  'mdi-arrow-left',
  'mdi-arrow-right',
  'mdi-chevron-down',
  'mdi-menu',
  'mdi-dots-vertical',
  'mdi-pencil',
  'mdi-delete',
  'mdi-content-save',
  'mdi-refresh',
  'mdi-download',
  'mdi-upload',
  'mdi-heart',
  'mdi-star',
  'mdi-lock',
  'mdi-eye',
  'mdi-information',
  'mdi-alert',
]

// 아이콘 마크업 복사
const copyIconMarkup = (type, iconName) => {
  const fullName = type === 'ebli' ? `ebli:${iconName}` : iconName

  // 디폴트가 아닌 경우에만 속성 추가
  const attrs = []
  if (iconSize.value !== 20) {
    attrs.push(`size="${iconSize.value}"`)
  }
  if (iconColor.value !== '#121a26') {
    attrs.push(`color="${iconColor.value}"`)
  }

  const markup =
    attrs.length > 0
      ? `<VIcon ${attrs.join(' ')}>${fullName}</VIcon>`
      : `<VIcon>${fullName}</VIcon>`

  copyToClipboard(markup, {
    toastMessage: `복사됨: ${markup}`,
  })
}

// 아이콘명만 복사
const copyIconName = (type, iconName) => {
  const fullName = type === 'ebli' ? `ebli:${iconName}` : iconName
  copyToClipboard(fullName, {
    toastMessage: `복사됨: ${fullName}`,
  })
}
</script>

<style lang="scss" scoped>
.pub-guide-layout {
  .control-group {
    flex: 1;

    label {
      display: block;
      font-weight: 600;
      margin-bottom: 12px;
      color: #333;
    }
  }

  .size-options {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .control-slider {
    width: 100%;
    margin-top: 8px;
  }

  .control-input {
    width: 100%;
    height: 40px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
  }

  // 아이콘 그리드
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 16px;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    background: #fff;
    transition: all 0.2s ease;

    &:hover {
      border-color: #476dfc;
      box-shadow: 0 2px 8px rgba(71, 109, 252, 0.15);
    }
  }

  .icon-display {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    border-radius: 8px;
    background: #f8f9fa;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 12px;
    padding: 8px;

    &:hover {
      background: #476dfc;
      transform: scale(1.05);

      :deep(.v-icon) {
        color: white !important;
      }
    }
  }

  .icon-name {
    font-size: 12px;
    font-weight: 500;
    color: #495057;
    text-align: center;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
    word-break: break-word;

    &:hover {
      color: #476dfc;
      background: #f8f9fa;
    }
  }
}
</style>
