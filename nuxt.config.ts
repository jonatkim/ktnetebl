import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  experimental: {
    appManifest: false,
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'eBL Korea',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
        },
        {
          name: 'description',
          content: '전자선하증권의 유통 및 관리의 법적효력을 보장하는 신뢰 인프라',
        },
        { property: 'og:site_name', content: 'eBL Korea' },
        { property: 'og:title', content: 'eBL Korea' },
        {
          property: 'og:description',
          content: '전자선하증권의 유통 및 관리의 법적효력을 보장하는 신뢰 인프라',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://ktnetebl.vercel.app/opengraph.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'eBL Korea' },
        {
          name: 'twitter:description',
          content: '전자선하증권의 유통 및 관리의 법적효력을 보장하는 신뢰 인프라',
        },
        { name: 'twitter:image', content: 'https://ktnetebl.vercel.app/opengraph.png' },
      ],
    },
    pageTransition: {
      name: 'ebl-page',
      mode: 'out-in',
    },
  },
  ssr: false, // 깃헙 - 퍼블 확인용 배포를 위해 끔, 필요에 따라 true로 변경 가능
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/device',
    [
      '@nuxtjs/i18n',
      {
        strategy: 'no_prefix',
        defaultLocale: 'en',
        detectBrowserLanguage: false,
        lazy: true,
        locales: [
          { code: 'ko', name: '한국어', file: 'ko.json' },
          { code: 'en', name: 'English', file: 'en.json' },
        ],
      },
    ],
  ],
  compatibilityDate: '2025-12-02',
  components: [
    {
      path: '~/components/common',
      prefix: 'Ebl',
    },
    {
      path: '~/components',
      pathPrefix: false,
      ignore: ['**/common/**', '**/publish/**'],
    },
  ],
  css: [
    'vuetify/styles',
    'ag-grid-community/styles/ag-theme-quartz.css',
    '~/assets/styles/main.scss',
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  build: {
    transpile: ['vuetify', '@vuepic/vue-datepicker'],
  },

  vite: {
    plugins: [
      vuetify({
        autoImport: true,
        styles: {
          configFile: 'assets/styles/settings.scss',
        },
      }),
      (await import('vite-svg-loader')).default({
        svgoConfig: {
          plugins: ['removeDimensions'],
        },
      }),
    ],
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: ['vuetify'],
    },
    vue: {
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: true,
          tags: {
            video: ['src', 'poster'],
            source: ['src'],
            img: ['src'],
            image: ['xlink:href', 'href'],
            use: ['xlink:href', 'href'],
            // Vuetify 컴포넌트 (kebab-case + PascalCase 둘 다 매핑)
            'v-img': ['src', 'lazy-src'],
            VImg: ['src', 'lazy-src'],
            'v-card': ['image'],
            VCard: ['image'],
            'v-avatar': ['image'],
            VAvatar: ['image'],
            'v-parallax': ['src'],
            VParallax: ['src'],
          },
        },
      },
    },
  },
})
