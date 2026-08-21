<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--tutorials">
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">Guides</h1>
            <p class="psm-hero__description">
              e-B/L 서비스 소개부터 발행, 배서·양도, 발행 후 각종 요청까지
              <br />
              단계별 프로세스로 안내합니다.
            </p>
          </div>
          <div class="col col-12 col-md-6 psm-hero__symbol">
            <img :src="heroObject" alt="Tutorials symbol" class="psm-hero__visual" />
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-tutorial-video">
      <div class="grid-container">
        <p class="psm-hero__title">Purely Digital, Fully Connected</p>
        <!-- 2026.08월 수정 -->
        <button
          type="button"
          class="psm-tutorial-video__box"
          aria-label="Tutorial video placeholder"
          @click.prevent="openVideoModal('Purely Digital, Fully Connected')"
        >
          <!-- 2026.08월 수정 -->
          <img :src="videoThumbnails[0]" alt="Purely Digital, Fully Connected 썸네일" />
          <!-- 2026.08월 추가 -->
          <!-- 2026.08월 수정 -->
          <img class="psm-tutorial-video__play-btn" src="/images/portal/play_btn.png" alt="재생" />
        </button>
      </div>
    </section>

    <section class="psm-section psm-tutorial-process">
      <div class="grid-container">
        <h2 class="psm-tutorial-process__title">
          e-B/L 단계별 이용 프로세스
        </h2>
        <!-- 2026.08월 수정: 기존 프로세스 카드 구조 보존 -->
        <!--
        <div class="row">
          <div v-for="item in processItems" :key="item.step" class="col col-12 col-md-6">
            <article class="psm-card psm-card--gray">
              <p class="psm-card__step">Step{{ item.step }}</p>
              <div class="psm-card__title">
                <h3>{{ item.title }}</h3>
              </div>
              <p class="psm-card__desc" v-html="item.description" />
            </article>
          </div> 
        </div>
        -->
        <!-- 2026.08월 추가 -->
        <div class="psm-tutorial-process__list">
          <article v-for="item in processItems" :key="item.step" class="psm-tutorial-process__item">
            <div class="psm-tutorial-process__copy">
              <p class="psm-tutorial-process__step">Step{{ item.step }}</p>
              <h3 class="psm-tutorial-process__item-title">{{ item.title }}</h3>
              <p class="psm-tutorial-process__desc" v-html="item.description" />
            </div>
            <!-- 2026.08월 수정 -->
            <button
              type="button"
              class="psm-tutorial-process__video"
              :aria-label="`${item.title} 영상 준비 중`"
              @click.prevent="openVideoModal(item.title)"
            >
              <!-- 2026.08월 수정 -->
              <img class="psm-tutorial-process__thumbnail" :src="item.thumbnail" :alt="`${item.title} 썸네일`" />
              <!-- 2026.08월 추가 -->
              <!-- 2026.08월 수정 -->
              <img class="psm-tutorial-process__play-btn" src="/images/portal/play_btn.png" alt="재생" />
            </button>
          </article>
        </div>
      </div>
    </section>

    <section v-intersect-appbar-invert class="psm-section psm-section--dark psm-tutorial-download">
      <div class="grid-container">
        <div class="row psm-tutorial-download__row">
          <div class="col col-12 col-md-6">
            <article class="psm-tutorial-download__item">
              <h3>e-B/L 서비스 매뉴얼</h3>
              <p>
                글로벌 표준을 기반으로 구축된 eBL Korea의<br class="no-br--pc" />
                핵심 서비스 및 인프라 구조를 제공합니다.
              </p>
              <EblBtn class="psm-tutorial-download__btn">e-B/L 매뉴얼 다운로드</EblBtn>
            </article>
          </div>
          <div class="col col-12 col-md-6">
            <article class="psm-tutorial-download__item">
              <h3>KTNET eBL Global Service API</h3>
              <p>
                글로벌 표준 기반의 데이터 교환과 시스템 연동을<br class="no-br--pc" />
                위한 API 가이드를 제공합니다.
              </p>
              <!-- 2026.08월 수정 -->
              <div class="psm-tutorial-download__btns">
                <EblBtn class="psm-tutorial-download__btn">API Guide for Carrier</EblBtn>
                <EblBtn class="psm-tutorial-download__btn">API Guide for Document-party</EblBtn>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

  <!-- 2026.08월 추가 -->
  <Teleport to="body">
    <div
      v-if="isVideoModalOpen"
      class="psm-video-modal"
      role="presentation"
      @click.self="closeVideoModal"
    >
      <!-- 2026.08월 수정 -->
      <button type="button" class="psm-video-modal__close" aria-label="영상 모달 닫기" @click.prevent="closeVideoModal">
        <span aria-hidden="true">&times;</span>
      </button>
      <div
        class="psm-video-modal__dialog"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        @keydown.esc="closeVideoModal"
      >
        <div class="psm-video-modal__content">
          <!-- 2026.08월 추가: 실제 영상 주소 공유 전 테스트용 YouTube 영상 -->
          <iframe
            :src="testVideoUrl"
            :title="`${activeVideoTitle} 테스트 영상`"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
      </div>
    </div>
  </Teleport>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_tutorial.svg?url'

// 2026.08월 추가
const isVideoModalOpen = ref(false)
const activeVideoTitle = ref('')
// 2026.08월 추가
const videoModalScrollY = ref(0)
// 2026.08월 추가: 추후 실제 YouTube 영상 주소로 교체
const testVideoUrl = 'https://www.youtube.com/embed/GQVVYlneoyA?rel=0&autoplay=1'

// 2026.08월 추가: public/images/portal/ 썸네일 경로
const videoThumbnails = [
  '/images/portal/video_thumb01.png',
  '/images/portal/video_thumb02.png',
  '/images/portal/video_thumb03.png',
  '/images/portal/video_thumb04.png',
  '/images/portal/video_thumb05.png',
]

// 2026.08월 추가
const openVideoModal = (title) => {
  // 2026.08월 추가
  videoModalScrollY.value = window.scrollY
  activeVideoTitle.value = title
  isVideoModalOpen.value = true
  // 2026.08월 수정
  document.body.style.position = 'fixed'
  document.body.style.top = `-${videoModalScrollY.value}px`
  document.body.style.width = '100%'
  document.body.style.overflow = 'hidden'
}

// 2026.08월 추가
const closeVideoModal = () => {
  isVideoModalOpen.value = false
  // 2026.08월 수정
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflow = ''
  window.scrollTo(0, videoModalScrollY.value)
}

const processItems = [
  // 2026.08월 수정
  {
    step: 1,
    title: '회원가입 안내',
    description: '선사사이트나 uTradeHub를 통한 회원가입',
    // 2026.08월 추가
    thumbnail: videoThumbnails[1],
  },
  {
    step: 2,
    title: 'e-B/L 작성 및 발행',
    description: 'e-B/L 발행 및 승인 절차 진행',
    // 2026.08월 추가
    thumbnail: videoThumbnails[2],
  },
  {
    step: 3,
    title: 'e-B/L 배서 및 양도',
    description: 'e-B/L 수신 및 배서, 양도를 통한 소유권 이전',
    // 2026.08월 추가
    thumbnail: videoThumbnails[3],
  },
  {
    step: 4,
    title: 'Amendment, Paper, Delivery 요청',
    description: '발행된 B/L의 수정, 종이전환, 서면 요청',
    // 2026.08월 추가
    thumbnail: videoThumbnails[4],
  },
]

definePageMeta({ layout: 'portal' })
</script>
