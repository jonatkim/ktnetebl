import { defineStore } from 'pinia'
import { ref } from 'vue'

let dialogIdCounter = 0

export const useDialogStore = defineStore('dialog', () => {
  // 현재 표시되고 있는 다이얼로그
  const dialog = ref({
    id: null,
    open: false,
    type: 'alert', // 'alert' | 'confirm'
    icon: undefined, // 'info' | 'success' | 'error' | 'warning'
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    persistent: false,
    showCloseButton: false,
    resolve: null,
  })

  // 대기 중인 다이알로그 큐
  const queue = ref([])

  /**
   * 큐에서 다음 대기 중인 다이얼로그 처리
   */
  const processQueue = () => {
    // 이미 다이얼로그가 열려있으면 대기
    if (dialog.value.open) return

    const next = queue.value.shift()
    if (!next) return

    // 다음 다이얼로그 표시
    dialog.value = {
      id: next.id,
      open: true,
      type: next.type,
      icon: next.icon,
      title: next.title,
      message: next.message,
      confirmText: next.confirmText,
      cancelText: next.cancelText,
      persistent: next.persistent,
      showCloseButton: next.showCloseButton || false,
      resolve: next.resolveFn,
    }
  }

  /**
   * 다이얼로그 닫기 및 Promise resolve
   * @param {*} value - resolve할 값 (기본값: undefined)
   * @param {number} id - 특정 다이얼로그 ID (지정 시 해당 ID만 닫음)
   */
  const resolveAndClose = (value = undefined, id) => {
    // 특정 ID가 지정된 경우, 현재 열린 다이얼로그와 일치하는지 확인
    if (id !== undefined && dialog.value.id !== id) {
      return // 다른 다이얼로그가 열려있으면 무시
    }

    if (typeof dialog.value.resolve === 'function') {
      dialog.value.resolve(value)
    }

    // 다이얼로그 상태 초기화
    dialog.value.open = false
    dialog.value.id = null
    dialog.value.resolve = null

    // 큐에서 다음 다이얼로그 처리
    processQueue()
  }

  /**
   * Alert 다이얼로그 표시
   * @param {Object} options - 다이얼로그 옵션
   * @returns {Promise} id 속성을 가진 Promise 객체
   */
  const showAlert = (options = {}) => {
    const {
      title = '',
      message = '',
      confirmText = 'Confirm',
      persistent = false,
      icon = undefined,
      showCloseButton = false,
    } = options

    const id = ++dialogIdCounter

    const promise = new Promise((resolve) => {
      queue.value.push({
        id,
        type: 'alert',
        icon,
        title,
        message,
        confirmText,
        cancelText: '',
        persistent,
        showCloseButton,
        resolveFn: resolve,
      })
      processQueue()
    })

    // 타이머 기반 자동 닫기를 위해 Promise에 id 추가
    promise.id = id
    return promise
  }

  /**
   * Confirm 다이얼로그 표시
   * @param {Object} options - 다이얼로그 옵션
   * @returns {Promise<boolean>} 확인: true, 취소: false를 반환하는 id 속성을 가진 Promise
   */
  const showConfirm = (options = {}) => {
    const {
      title = '',
      message = '',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      persistent = false,
      icon = undefined,
      showCloseButton = false,
    } = options

    const id = ++dialogIdCounter

    const promise = new Promise((resolve) => {
      queue.value.push({
        id,
        type: 'confirm',
        icon,
        title,
        message,
        confirmText,
        cancelText,
        persistent,
        showCloseButton,
        resolveFn: resolve,
      })
      processQueue()
    })

    // 타이머 기반 자동 닫기를 위해 Promise에 id 추가
    promise.id = id
    return promise
  }

  /**
   * 다이얼로그 닫기 (취소로 처리)
   */
  const close = () => {
    resolveAndClose(false)
  }

  /**
   * 특정 ID의 다이얼로그만 닫기
   * @param {number} id - 닫을 다이얼로그의 ID
   */
  const closeById = (id) => {
    resolveAndClose(undefined, id)
  }

  return {
    dialog,
    queue,
    showAlert,
    showConfirm,
    close,
    closeById,
    resolveAndClose,
  }
})
