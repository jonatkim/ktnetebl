<template>
  <div class="pub-guide-layout">
    <h2>📋 글로벌 다이알로그 가이드</h2>
    <p class="guide-subtitle">
      전역으로 사용할 수 있는 Alert와 Confirm 다이알로그입니다. Promise 기반으로 사용자 응답을
      비동기로 처리할 수 있습니다.
    </p>

    <div class="pub-preview pub-preview--wrap">
      <!-- 기본 Alert -->
      <div class="example-section">
        <h3>기본 Alert</h3>
        <div class="example-box">
          <div class="component-row">
            <EblBtn @click="showBasicAlert">기본 Alert</EblBtn>
            <EblBtn @click="showOnlyMessageAlert">메시지만</EblBtn>
          </div>
        </div>
        <CodeBlock :code="basicAlertCode" language="javascript" max-height="220px" />
      </div>

      <!-- 아이콘 Alert -->
      <div class="example-section">
        <h3>아이콘 Alert</h3>
        <div class="example-box">
          <div class="component-row">
            <EblBtn color="info" @click="showInfoAlert">Info</EblBtn>
            <EblBtn color="success" @click="showSuccessAlert">Success</EblBtn>
            <EblBtn color="error" @click="showErrorAlert">Error</EblBtn>
            <EblBtn color="warning" @click="showWarningAlert">Warning</EblBtn>
          </div>
        </div>
        <CodeBlock :code="iconAlertCode" language="javascript" max-height="260px" />
      </div>

      <!-- Confirm -->
      <div class="example-section">
        <h3>Confirm</h3>
        <div class="example-box">
          <div class="component-row">
            <EblBtn color="success" @click="showDeleteConfirm">삭제 확인</EblBtn>
            <EblBtn color="warning" @click="showActionConfirm">작업 확인</EblBtn>
          </div>
        </div>
        <CodeBlock :code="confirmCode" language="javascript" max-height="260px" />
      </div>

      <!-- 옵션 예제 -->
      <div class="example-section">
        <h3>옵션 예제</h3>
        <div class="example-box">
          <div class="component-row">
            <EblBtn @click="showPersistentAlert">Persistent</EblBtn>
            <EblBtn @click="showShowCloseAlert">Close 표시</EblBtn>
            <EblBtn color="primary" @click="showCustomTextConfirm">버튼 텍스트</EblBtn>
            <EblBtn color="info" @click="showStackedAlerts">스택 테스트</EblBtn>
            <EblBtn color="success" @click="showTimedCloseAlert">5초 후 닫기</EblBtn>
          </div>
        </div>
        <CodeBlock :code="optionsCode" language="javascript" max-height="260px" />
      </div>
    </div>

    <!-- API 사용 예시 -->
    <div class="api-reference">
      <h3>API 사용</h3>
      <CodeBlock :code="usageCode" language="javascript" dark max-height="320px" />
    </div>

    <!-- Props 설명 -->
    <PubPropsSection :props="dialogPropsData" />
  </div>
</template>

<script setup>
import { useDialogStore } from '~/stores/useDialogStore'
import CodeBlock from '~/components/CodeBlock.vue'
import PubPropsSection from '~/components/publish/PubPropsSection.vue'

definePageMeta({ layout: 'guide' })

const dialogStore = useDialogStore()

const basicAlertCode = `// 기본 Alert (아이콘 없음)
await dialogStore.showAlert({
  title: '알림',
  message: '이것은 기본 알럿입니다.',
})

// 아이콘 없이 메시지만 표시
await dialogStore.showAlert({
  message: '간단한 메시지를 표시합니다.',
})`

const iconAlertCode = `// Info 알럿
await dialogStore.showAlert({
  title: '알림',
  message: '정보를 조회했습니다.',
  icon: 'info',
})

// Success 알럿
await dialogStore.showAlert({
  title: '성공',
  message: '작업이 완료되었습니다.',
  icon: 'success',
})

// Error 알럿
await dialogStore.showAlert({
  title: '오류',
  message: '작업 중 오류가 발생했습니다.',
  icon: 'error',
})

// Warning 알럿
await dialogStore.showAlert({
  title: '경고',
  message: '주의가 필요합니다.',
  icon: 'warning',
})`

const confirmCode = `// Confirm 다이알로그
const result = await dialogStore.showConfirm({
  title: '확인',
  message: '정말 삭제하시겠습니까?',
  confirmText: '삭제',
  cancelText: '취소',
  icon: 'error',
})

if (result) {
  // 사용자가 '삭제' 버튼을 클릭한 경우
  console.log('삭제 진행')
} else {
  // 사용자가 '취소' 버튼을 클릭한 경우
  console.log('취소됨')
}`

const optionsCode = `// 배경 클릭으로 닫기 방지
await dialogStore.showAlert({
  title: '처리 중',
  message: '작업이 진행 중입니다.',
  persistent: true,
})

// 닫기 버튼 표시
await dialogStore.showAlert({
  title: '닫기 버튼',
  message: '닫기 버튼을 표시합니다.',
  showCloseButton: true,
})

// 버튼 텍스트 변경
await dialogStore.showConfirm({
  title: '저장',
  message: '변경사항을 저장하시겠습니까?',
  confirmText: '저장',
  cancelText: '취소',
})

// 알럿 큐(스택) 테스트
dialogStore.showAlert({
  title: '1번째 알럿',
  message: '첫 번째 알럿입니다.',
  icon: 'info',
})
dialogStore.showAlert({
  title: '2번째 알럿',
  message: '두 번째 알럿입니다.',
  icon: 'success',
})
dialogStore.showAlert({
  title: '3번째 알럿',
  message: '세 번째 알럿입니다.',
  icon: 'warning',
})

// 타이머로 특정 알럿 닫기 (ID 기반)
const alertPromise = dialogStore.showAlert({
  title: '자동 닫힘',
  message: '5초 후 자동으로 닫힙니다.',
})
setTimeout(() => {
  // 5초 후 이 알럿만 닫기 (다른 알럿 영향 없음)
  dialogStore.closeById(alertPromise.id)
}, 5000)`

const usageCode = `import { useDialogStore } from '~/stores/useDialogStore'

const dialogStore = useDialogStore()

// 사용자 삭제 함수
const deleteUser = async (userId) => {
  // 확인 다이알로그 표시
  const confirmed = await dialogStore.showConfirm({
    title: '사용자 삭제',
    message: '정말 이 사용자를 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
    icon: 'warning',
    persistent: true, // 배경 클릭으로 닫기 방지
  })

  if (!confirmed) return // 취소한 경우

  try {
    // API 호출
    await fetch(\`/api/users/\${userId}\`, {
      method: 'DELETE'
    })

    // 성공 메시지
    await dialogStore.showAlert({
      title: '삭제 완료',
      message: '사용자가 삭제되었습니다.',
      icon: 'success',
    })
  } catch (error) {
    // 오류 메시지
    await dialogStore.showAlert({
      title: '오류 발생',
      message: '사용자 삭제 중 오류가 발생했습니다.',
      icon: 'error',
    })
  }
}`

const showInfoAlert = async () => {
  await dialogStore.showAlert({
    title: '정보',
    message: '이것은 정보 알럿입니다.',
    icon: 'info',
  })
}

const showSuccessAlert = async () => {
  await dialogStore.showAlert({
    title: '성공',
    message: '작업이 완료되었습니다.',
    icon: 'success',
  })
}

const showErrorAlert = async () => {
  await dialogStore.showAlert({
    title: '오류',
    message: '작업 중 오류가 발생했습니다.',
    icon: 'error',
  })
}

const showBasicAlert = async () => {
  await dialogStore.showAlert({
    title: '알림',
    message: '이것은 기본 알럿입니다.',
  })
}

const showOnlyMessageAlert = async () => {
  await dialogStore.showAlert({
    message: '이것은 기본 알럿입니다.',
  })
}

const showWarningAlert = async () => {
  await dialogStore.showAlert({
    title: '경고',
    message: '주의가 필요합니다.',
    icon: 'warning',
  })
}

const showDeleteConfirm = async () => {
  const result = await dialogStore.showConfirm({
    title: '삭제 확인',
    message: '정말 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
    icon: 'error',
  })
  console.log('삭제 결과:', result)
}

const showActionConfirm = async () => {
  const result = await dialogStore.showConfirm({
    title: '작업 확인',
    message: '이 작업을 진행하시겠습니까?',
    confirmText: '진행',
    cancelText: '취소',
    icon: 'warning',
  })
  console.log('작업 결과:', result)
}

const showPersistentAlert = async () => {
  await dialogStore.showAlert({
    title: '처리 중',
    message: '작업이 진행 중입니다.',
    persistent: true,
  })
}

const showShowCloseAlert = async () => {
  await dialogStore.showAlert({
    title: '닫기 버튼',
    message: '닫기 버튼을 표시합니다.',
    showCloseButton: true,
  })
}

const showCustomTextConfirm = async () => {
  const result = await dialogStore.showConfirm({
    title: '저장',
    message: '변경사항을 저장하시겠습니까?',
    confirmText: '저장',
    cancelText: '취소',
  })
  console.log('저장 결과:', result)
}

const showStackedAlerts = () => {
  dialogStore.showAlert({
    title: '1번째 알럿',
    message: '첫 번째 알럿입니다.',
    icon: 'info',
  })
  dialogStore.showAlert({
    title: '2번째 알럿',
    message: '두 번째 알럿입니다.',
    icon: 'success',
  })
  dialogStore.showAlert({
    title: '3번째 알럿',
    message: '세 번째 알럿입니다.',
    icon: 'warning',
  })
}

const showTimedCloseAlert = () => {
  const alertPromise = dialogStore.showAlert({
    title: '자동 닫힘',
    message: '5초 후 자동으로 닫힙니다.',
  })

  // 5초 후 특정 ID의 다이얼로그만 닫기
  setTimeout(() => {
    dialogStore.closeById(alertPromise.id)
  }, 5000)
}

const dialogPropsData = [
  {
    name: 'title',
    type: 'String',
    default: "''",
    desc: '다이알로그 제목',
  },
  {
    name: 'message',
    type: 'String',
    default: "''",
    desc: '다이알로그 메시지',
  },
  {
    name: 'icon',
    type: "'info' | 'success' | 'error' | 'warning'",
    default: 'undefined',
    desc: '타이틀 앞에 표시할 아이콘 타입',
  },
  {
    name: 'confirmText',
    type: 'String',
    default: "'확인'",
    desc: '확인 버튼 텍스트',
  },
  {
    name: 'cancelText',
    type: 'String',
    default: "'취소'",
    desc: '취소 버튼 텍스트 (Confirm만 사용)',
  },
  {
    name: 'persistent',
    type: 'Boolean',
    default: 'false',
    desc: '배경 클릭으로 닫기 방지',
  },
  {
    name: 'showCloseButton',
    type: 'Boolean',
    default: 'false',
    desc: '닫기 버튼 표시 여부 (true일 때 닫기 버튼 표시)',
  },
]
</script>
