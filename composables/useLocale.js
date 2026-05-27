import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLocale() {
  const i18n = useI18n({ useScope: 'global' })
  const { locale, t, tm, rt, setLocaleMessage, getLocaleMessage } = i18n

  const isLoading = ref(false)
  const lastError = ref(null)

  // load messages on demand (compatible with `lazy: true`)
  const loadLocale = async (code) => {
    const existing = getLocaleMessage(code)
    if (existing && Object.keys(existing).length > 0) return
    isLoading.value = true
    lastError.value = null
    try {
      const mod = await import(`~/i18n/locales/${code}.json`)
      const msgs = mod.default || mod
      setLocaleMessage(code, msgs)
    } catch (e) {
      if (import.meta.dev) {
        console.warn('[useLocale] failed to load locale', code, e)
      }
      lastError.value = e
    } finally {
      isLoading.value = false
    }
  }

  const setLocale = async (l) => {
    await loadLocale(l)
    locale.value = l
  }

  const localeLabel = computed(() => {
    return locale.value === 'ko' ? t('common.lang.ko') : t('common.lang.en')
  })

  const home = computed(() => tm('portal.home'))

  return { locale, t, tm, rt, setLocale, localeLabel, isLoading, lastError, home }
}
