import { defineNuxtPlugin } from '#app'
import JsonViewer from 'vue3-json-viewer'

export default defineNuxtPlugin((nuxtApp) => {
  // 전역 컴포넌트로 <json-viewer> 태그를 등록
  nuxtApp.vueApp.use(JsonViewer)
})