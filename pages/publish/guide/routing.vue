<template>
  <div class="pub-guide-layout">
    <h2>Routing Playground</h2>
    <p class="guide-subtitle">PC/MO/PORTAL 라우팅 테스트용 링크 모음입니다.</p>

    <section class="route-section">
      <h3>디바이스 가드 정책</h3>
      <ul class="route-notes">
        <li>PC/MO 경로는 디바이스 타입에 따라 접근을 제한합니다.</li>
        <li>디바이스가 다르면 가능한 반대 라우트로 자동 전환합니다.</li>
        <li>반대 라우트가 없으면 안내 페이지로 이동합니다.</li>
        <li>PORTAL, 퍼블리싱 가이드는 디바이스 가드 예외입니다.</li>
      </ul>
    </section>

    <section class="route-section">
      <h3>WORK (PC)</h3>
      <ul>
        <li class="route-item">
          <NuxtLink to="/pc/ebl/doc/EBLDOC010U">/pc/ebl/doc/EBLDOC010U</NuxtLink>
          <EblBtn
            icon="mdi-open-in-new"
            small
            text
            class="route-open"
            aria-label="새 창에서 열기"
            @click="openNew('/pc/ebl/doc/EBLDOC010U')"
          />
        </li>
      </ul>
    </section>

    <section class="route-section">
      <h3>WORK (MO)</h3>
      <ul>
        <li class="route-item">
          <NuxtLink to="/mo/ebl/doc/EBLDOC010U">/mo/ebl/doc/EBLDOC010U</NuxtLink>
          <EblBtn
            icon="mdi-open-in-new"
            small
            text
            class="route-open"
            aria-label="새 창에서 열기"
            @click="openNew('/mo/ebl/doc/EBLDOC010U')"
          />
        </li>
      </ul>
    </section>

    <section class="route-section">
      <h3>PORTAL</h3>
      <ul>
        <li class="route-item">
          <NuxtLink to="/portal/sin/PSMSIN010U">/portal/sin/PSMSIN010U</NuxtLink>
          <EblBtn
            icon="mdi-open-in-new"
            small
            text
            class="route-open"
            aria-label="새 창에서 열기"
            @click="openNew('/portal/sin/PSMSIN010U')"
          />
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'guide' })

const openNew = (path) => {
  if (typeof window === 'undefined') return
  window.open(path, '_blank', 'noopener')
}
</script>

<style scoped>
.route-section {
  margin-top: 16px;
}
.route-section h3 {
  margin-bottom: 8px;
}
.route-section ul {
  padding-left: 16px;
}
.route-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.route-open {
  margin-left: 4px;
}
.route-notes {
  margin-top: 8px;
  color: #555;
}
</style>
