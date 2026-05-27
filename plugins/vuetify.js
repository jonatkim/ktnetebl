import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

function normalize(file) {
  return file
    .replace(/\.svg$/i, '')
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}

export default defineNuxtPlugin(async (nuxtApp) => {
  /**
   * -------------------------------------------------
   * 1. Custom SVG Icon Set (ebli)
   * -------------------------------------------------
   */
  const modules = import.meta.glob('~/assets/images/icons/*/*.svg', { eager: true })

  const registries = {}
  const sets = {}

  for (const path in modules) {
    const rel = path.split('/assets/images/icons/')[1]
    const [setName, file] = rel.split('/')
    const iconName = normalize(file)

    registries[setName] ??= {}
    registries[setName][iconName] = modules[path].default
  }

  for (const setName of Object.keys(registries)) {
    sets[setName] = {
      component: (props) => {
        const name = String(props.icon)
        const Svg = registries[setName][name]
        if (!Svg) {
          if (import.meta.dev) {
            console.warn(`[icon:${setName}] not found:`, name)
          }
          return null
        }
        return h(props.tag, { class: props.class, style: props.style, 'aria-hidden': 'true' }, [
          h(Svg),
        ])
      },
    }
  }

  /**
   * -------------------------------------------------
   * 2. Vuetify Instance
   * -------------------------------------------------
   */
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    aliases: {
      EblTooltip: components.VTooltip,
      EblPagination: components.VPagination,
      EblDialog: components.VDialog,
      EblBottomSheet: components.VBottomSheet,
    },
    defaults: {
      VTooltip: {
        contentClass: 'ebl-tooltip',
      },
      EblTooltip: {
        contentClass: 'ebl-tooltip',
      },
      VDialog: {
        contentClass: 'ebl-dialog',
        location: 'right',
      },
      EblDialog: {
        contentClass: 'ebl-dialog',
        location: 'right',
      },
      VBottomSheet: {
        contentClass: 'ebl-bottom-sheet',
      },
      EblBottomSheet: {
        contentClass: 'ebl-bottom-sheet',
      },
      VPagination: {
        class: 'ebl-pagination',
        prevIcon: 'ebli:chevron-left',
        nextIcon: 'ebli:chevron-right',
        firstIcon: 'ebli:chevron-first',
        lastIcon: 'ebli:chevron-last',
        ellipsis: '⋯',
      },
      EblPagination: {
        class: 'ebl-pagination',
        prevIcon: 'ebli:chevron-left',
        nextIcon: 'ebli:chevron-right',
        firstIcon: 'ebli:chevron-first',
        lastIcon: 'ebli:chevron-last',
        ellipsis: '⋯',
      },
    },
    global: {
      ripple: false,
    },
    icons: {
      defaultSet: 'mdi',
      sets,
    },
    theme: {
      defaultTheme: 'eblLight',
      themes: {
        eblLight: {
          dark: false,
          colors: {
            primary: '#476DFC',
            secondary: '#EBF0F5',
            surface: '#ffffff',
            background: '#F5F7FA',
            error: '#FF1C1C',
            warning: '#F59E0B',
            info: '#295BFF',
            success: '#10b981',
          },
        },
        eblDark: {
          dark: true,
          colors: {
            primary: '#3b82f6',
            secondary: '#94a3b8',
            surface: '#121212',
            background: '#0b1220',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#60a5fa',
            success: '#34d399',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)

  /**
   * -------------------------------------------------
   * 3. Pinia Store ↔ Vuetify Theme Sync
   * -------------------------------------------------
   * - app.vue / layout / component 어디에서도
   *   useTheme() 사용하지 않음
   */
  try {
    if (nuxtApp.$pinia) {
      const { useMainStore } = await import('~/stores/useMainStore')
      const main = useMainStore(nuxtApp.$pinia)

      const applyTheme = (isDark) => {
        try {
          // Vuetify 3.4+ 권장 API
          if (vuetify.theme?.change) {
            vuetify.theme.change(isDark ? 'eblDark' : 'eblLight')
          }
        } catch (e) {}

        // 선택: 전역 class (디자인용)
        try {
          document.documentElement.classList.toggle('dark', !!isDark)
        } catch (e) {}
      }

      // 초기 적용
      applyTheme(main.dark)

      // store 변경 감지
      watch(
        () => main.dark,
        (v) => applyTheme(v),
      )
    }
  } catch (e) {
    if (import.meta.dev) {
      console.warn('[vuetify-theme-sync]', e)
    }
  }
})
