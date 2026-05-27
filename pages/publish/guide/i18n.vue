<template>
  <div class="pub-guide-layout">
    <h2>{{ t('i18nGuide.title') }}</h2>
    <p class="guide-subtitle">{{ t('i18nGuide.description') }}</p>

    <div class="pub-preview pub-preview--wrap pub-preview--2col">
      <div class="pub-preview__preview justify-start">
        <div class="d-flex flex-column gap-4 pa-4">
          <h3>{{ t('i18nGuide.samples.greeting') }}</h3>
          <p class="lead">{{ t('i18nGuide.samples.welcome') }}</p>
          <p class="muted">{{ t('i18nGuide.samples.feature') }}</p>
        </div>
      </div>

      <div class="pub-preview__controls">
        <div class="control-group">
          <label class="control-label">{{ t('i18nGuide.currentLocale') }}</label>
          <div class="control-switch">
            <EblSwitch v-model="isEn" :disabled="isLoading" :label="localeLabel" />
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">{{ t('i18nGuide.changeLocale') }}</label>
          <p class="control-note">{{ t('i18nGuide.samples.nextStep') }}</p>
        </div>
      </div>
    </div>

    <CodeGroup :items="codeItems" />
  </div>
</template>

<script setup>
definePageMeta({ layout: 'guide' })

const { t, locale, setLocale, localeLabel, isLoading } = useLocale()

const isEn = computed({
  get: () => locale.value === 'en',
  set: (val) => void setLocale(val ? 'en' : 'ko'),
})

const codeItems = [
  {
    title: 'GuideExample — Template',
    language: 'html',
    code: `<div>
  <!-- 공용 스위치: 로케일에 바운드, 로딩 중 비활성화 -->
  <EblSwitch v-model="isEn" :disabled="isLoading" :label="localeLabel" />
  <!-- 현재 언어 표시 -->
  <span class="locale-text">{{ localeLabel }}</span>
</div>`,
  },
  {
    title: 'GuideExample — Script',
    language: 'javascript',
    code: `import { computed } from 'vue'
import { useLocale } from '~/composables/useLocale'
import EblSwitch from '~/components/common/EblSwitch.vue'

const { locale, setLocale, localeLabel, isLoading } = useLocale()

const isEn = computed({
  get: () => locale.value === 'en',
  set: (v) => setLocale(v ? 'en' : 'ko'),
})`,
  },
  {
    title: 'ko.json',
    language: 'json',
    code: `{
  "common": {
    "lang": { "lang": "언어", "ko": "한국어", "en": "English" }
  },
    "i18nGuide": {
    "title": "다국어 설정 가이드",
    "description": "간단한 다국어 전환 가이드입니다.",
    "currentLocale": "현재 언어",
    "changeLocale": "언어 변경",
    "samples": { "greeting": "안녕하세요!", "welcome": "eBL 플랫폼에 오신 것을 환영합니다.", "feature": "로케일을 변경하면 모든 텍스트가 자동으로 업데이트됩니다.", "nextStep": "나중에 앱(브라우저) 싱크, 쿠키 저장 등의 기능을 추가할 수 있습니다." }
  }
}`,
  },
  {
    title: 'en.json',
    language: 'json',
    code: `{
  "common": {
    "lang": { "lang": "Language", "ko": "Korean", "en": "English" }
  },
    "i18nGuide": {
    "title": "i18n Guide",
    "description": "Simple i18n locale switching guide.",
    "currentLocale": "Current Language",
    "changeLocale": "Change Language",
    "samples": { "greeting": "Hello!", "welcome": "Welcome to the eBL Platform.", "feature": "When you change the locale, all text updates automatically.", "nextStep": "Later you can add features such as app (browser) sync and cookie persistence." }
  }
}`,
  },
]
</script>
