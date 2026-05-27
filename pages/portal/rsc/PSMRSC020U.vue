<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--tutorials">
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">Tutorials</h1>
            <p class="psm-hero__description">
              e-B/L 발행부터 정산까지의 실무 절차를
              <br />
              단계별 프로세스로 구조화하였습니다.
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
        <div class="psm-tutorial-video__box" role="img" aria-label="Tutorial video placeholder">
          VIDEO
        </div>
      </div>
    </section>

    <section class="psm-section psm-tutorial-process">
      <div class="grid-container">
        <h2 class="psm-tutorial-process__title">
          e-B/L 실무 적용을 위한<br class="no-br--pc" />
          단계별 이용 프로세스
        </h2>
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
              <EblBtn class="psm-tutorial-download__btn">API 가이드 다운로드</EblBtn>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_tutorial.svg?url'

const processItems = [
  { step: 1, title: '서비스 이용 등록', description: 'uTradeHub 연계 가입 및 이용 권한 확보' },
  { step: 2, title: 'e-B/L 발행', description: 'e-B/L 발행 및 승인 절차 진행' },
  {
    step: 3,
    title: '배서 및 양도',
    description: 'e-B/L 수신 및 배서·양도를 통한<br class="no-br--pc" /> 소유권 이전 구조',
  },
  { step: 4, title: '데이터 정정 및 확정', description: '심사 전 기재사항 정정 및 확정 절차 운영' },
  { step: 5, title: '무역금융 심사 및 매입', description: '은행 매입 및 심사 진행' },
  {
    step: 6,
    title: '서면 전환 및 인도',
    description: '종이 서류 전환 또는 인도 승인에 따른<br class="no-br--pc" /> 거래 종결 구조',
  },
]

definePageMeta({ layout: 'portal' })
</script>
