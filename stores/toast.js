export const useToastStore = defineStore('toast', () => {
  const queue = ref([])
  const position = ref('bottom')

  function add(message) {
    const id = Date.now() + Math.random()
    queue.value.push({ ...message, id })
    return id
  }

  function remove(id) {
    const index = queue.value.findIndex((t) => t.id === id)
    if (index === -1) return
    const item = queue.value[index]
    if (item && item.timeoutId) {
      try {
        clearTimeout(item.timeoutId)
      } catch {}
    }
    queue.value.splice(index, 1)
  }

  function setPosition(pos) {
    position.value = pos
  }

  return { queue, position, setPosition, add, remove }
})