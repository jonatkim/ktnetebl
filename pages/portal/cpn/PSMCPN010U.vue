<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--about-ktnet">
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">About KTNET</h1>
            <p class="psm-hero__description">
              국가 전자무역 기반 인프라를 구축·운영하는<br class="no-br--pc" />
              KTNET입니다.
            </p>
          </div>
          <div class="col col-12 col-md-6 psm-hero__symbol">
            <img :src="heroObject" alt="About KTNET symbol" class="psm-hero__visual" />
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-section--round psm-about-hub">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">국가 전자무역 인프라 허브</h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              대한민국 전자무역 인프라의 과거와 현재를 아우르는 운영 기관입니다.
            </p>
          </div>
        </div>

        <div class="row psm-about-hub__cards">
          <div v-for="item in hubCards" :key="item.title" class="col col-12 col-md-6">
            <article class="psm-card psm-card--white psm-card--mo-gray psm-about-hub-card">
              <div class="psm-card__title">
                <h3>{{ item.title }}</h3>
              </div>
              <p class="psm-card__desc">{{ item.summary }}</p>
              <ul class="psm-about-check-list">
                <li v-for="point in item.points" :key="point">
                  <VIcon icon="ebli:check-line" class="blue" />
                  <span>{{ point }}</span>
                </li>
              </ul>
            </article>
          </div>
        </div>

        <div class="row psm-about-metrics">
          <div v-for="metric in metrics" :key="metric.value" class="col col-12 col-md-4">
            <div class="psm-about-metrics__item">
              <strong>{{ metric.value }}</strong>
              <p>{{ metric.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-about-vision">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              KTNET 글로벌 디지털 비전
              <br class="no-br--pc" />
              2030:
              <br class="no-br--mo" />
              Global Digital Trade Partner
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              디지털 무역 인프라 확장 전략을 기반으로 운영을<br class="no-br--pc" />
              고도화합니다.
            </p>
          </div>
        </div>

        <div class="row psm-about-vision__cards">
          <div v-for="item in visionCards" :key="item.title" class="col col-12 col-md-4">
            <article class="psm-card psm-card--gray psm-card--mo-white psm-about-vision-card">
              <div class="psm-card__title">
                <h3>{{ item.title }}</h3>
              </div>
              <p class="psm-card__desc" v-html="item.description" />
              <VSpacer />
              <VImg :src="item.image" :alt="item.title" aspect-ratio="1" />
            </article>
          </div>
        </div>
      </div>
    </section>

    <section v-intersect-appbar-invert class="psm-section psm-section--dark psm-about-infra">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              디지털 무역의 완성을 위한
              <br />
              통합 서비스 인프라
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              수출입 통관부터 전자문서 보관까지, 무역 전과정을 아우르는
              <br class="no-br--mo" />
              표준화된 시스템으로
              <br class="no-br--pc" />
              귀하의 비즈니스 효율을 극대화합니다.
            </p>
          </div>
        </div>

        <div class="psm-about-infra-list">
          <article v-for="item in infraItems" :key="item.title" class="psm-about-infra-item">
            <div class="content">
              <h3>{{ item.title }}</h3>
              <p v-html="item.summary" />
              <ul class="psm-about-check-list">
                <li v-for="point in item.points" :key="point">
                  <VIcon icon="ebli:check-line" />
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>
            <div class="visual">
              <VImg :src="item.image" :alt="item.title" />
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_about.svg?url'
import visionObj01 from '~/assets/images/portal/obj_vision_01.png'
import visionObj02 from '~/assets/images/portal/obj_vision_02.png'
import visionObj03 from '~/assets/images/portal/obj_vision_03.png'
import infraObj01 from '~/assets/images/portal/obj_total_infra_01.png'
import infraObj02 from '~/assets/images/portal/obj_total_infra_02.png'
import infraObj03 from '~/assets/images/portal/obj_total_infra_03.png'
import infraObj04 from '~/assets/images/portal/obj_total_infra_04.png'

const hubCards = [
  {
    title: '국가전자무역 기반사업자',
    summary: '정부 공인 국가 전자무역 인프라',
    points: ['무역자동화사업자 지정', 'G2B/B2B 10개 비즈니스 영역', '국가급 인프라 보안/안정성'],
  },
  {
    title: '글로벌 네트워크',
    summary: '전 세계 파트너를 잇는 표준 인프라',
    points: [
      '전 세계 무역 파트너 실시간 연결',
      '국제 표준 기반 데이터 교환',
      '안정적인 대량 전문 처리 기술',
    ],
  },
]

const metrics = [
  { value: '10만 2천', label: '무역업체, 은행, 선사, 보험사 등 고객사' },
  { value: '3억 8천만 건', label: '연 평균 처리하는 전자무역 문서' },
  { value: '30년+', label: '검증된 디지털 무역 노하우' },
]

const visionCards = [
  {
    title: 'Global 표준',
    description:
      '디지털 무역 시스템 수출 및 글로벌 거점 확대<br />글로벌 디지털 무역 연결 구조 구축',
    image: visionObj01,
  },
  {
    title: 'Digital 기술',
    description:
      '지능형 플랫폼 서비스 및 신기술 기반 사업화<br />블록체인, AI, RPA 기반 디지털 전환 구조 고도화',
    image: visionObj02,
  },
  {
    title: 'Partner 협력',
    description:
      '소통·협업 중심의 디지털 무역 생태계 강화<br />Paperless Green Growth 실현으로<br />지속 가능한 고객 가치 창출',
    image: visionObj03,
  },
]

const infraItems = [
  {
    title: 'uTradeHub',
    summary:
      '수출입, 통관, 물류, 결제 전 과정을 통합 관리하는<br class="no-br--pc" /> 국가 전자무역 플랫폼',
    points: ['통합 무역 프로세스 관리', '실시간 데이터 연동', '다자간 협업 지원'],
    image: infraObj01,
  },
  {
    title: 'uLogisHub',
    summary: '실시간 화물 추적 및 물류 주체 간 협업 구조를 제공하는 디지털 물류 플랫폼',
    points: ['화물 위치/상태 실시간 모니터링', '물류 데이터 통합 연동', '디지털 기반 업무 최적화'],
    image: infraObj02,
  },
  {
    title: 'eBL Korea',
    summary: '전자선하증권의 유통 및 관리의 법적효력을 보장하는 신뢰 인프라',
    points: ['블록체인 기반 보안', '법적 효력 보장', '글로벌 표준 준수'],
    image: infraObj03,
  },
  {
    title: '공인전자문서센터',
    summary: '데이터의 법적 증거력을 확보하는 보안 저장 인프라 운영',
    points: ['장기 데이터 보존', '법적 증거력 확보', '고도화된 보안 시스템'],
    image: infraObj04,
  },
]

definePageMeta({ layout: 'portal' })
</script>
