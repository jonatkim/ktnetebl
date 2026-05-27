export const useEblDevice = () => {
  const route = useRoute()
  const normalizedRoutePath = computed(() => String(route.path || '').toLowerCase())

  const isEblPc = computed(() => normalizedRoutePath.value.startsWith('/pc/ebl'))
  const isEblMo = computed(() => normalizedRoutePath.value.startsWith('/mo/ebl'))
  const deviceClass = computed(() => {
    if (isEblPc.value) return 'ebl-pc'
    if (isEblMo.value) return 'ebl-mo'
    return ''
  })

  return {
    deviceClass,
    isEblPc,
    isEblMo,
  }
}
