// composables/useClipboard.js
export const useClipboard = () => {
  const toastStore = useToastStore()

  const copyToClipboard = async (text, options = {}) => {
    const { showToast = true, toastMessage, onSuccess, onError } = options

    // 클립보드 API 지원 여부 확인
    if (!navigator?.clipboard?.writeText) {
      // 폴백: execCommand 사용
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)

        if (showToast) {
          toastStore.add({
            text: toastMessage || `복사되었습니다: ${text}`,
            color: 'success',
            timeout: 3000
          })
        }

        onSuccess?.(text)
        return true
      } catch (fallbackErr) {
        console.error('폴백 복사도 실패:', fallbackErr)

        if (showToast) {
          toastStore.add({
            text: '복사에 실패했습니다.',
            color: 'error',
            timeout: 3000
          })
        }

        onError?.(fallbackErr)
        return false
      }
    }

    try {
      await navigator.clipboard.writeText(text)

      if (showToast) {
        toastStore.add({
          text: toastMessage || `복사되었습니다: ${text}`,
          color: 'success',
          timeout: 3000
        })
      }

      onSuccess?.(text)
      return true
    } catch (err) {
      console.error('클립보드 복사 실패:', err)

      // 폴백: execCommand 사용
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)

        if (showToast) {
          toastStore.add({
            text: toastMessage || `복사되었습니다: ${text}`,
            color: 'success',
            timeout: 3000
          })
        }

        onSuccess?.(text)
        return true
      } catch (fallbackErr) {
        console.error('폴백 복사도 실패:', fallbackErr)

        if (showToast) {
          toastStore.add({
            text: '복사에 실패했습니다.',
            color: 'error',
            timeout: 3000
          })
        }

        onError?.(fallbackErr)
        return false
      }
    }
  }

  return {
    copyToClipboard
  }
}