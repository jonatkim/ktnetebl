<template>
  <VOverlay
    :model-value="true"
    persistent
    class="ebl-landscape-overlay"
    content-class="ebl-landscape-overlay__content"
  >
    <div class="ebl-landscape-overlay__wrap">
      <p class="ebl-landscape-overlay__message">
        eBL Korea는 모바일 가로모드는 지원하지 않습니다.<br />
        세로모드로 전환 후 이용해 주세요.
      </p>
    </div>
  </VOverlay>
</template>
