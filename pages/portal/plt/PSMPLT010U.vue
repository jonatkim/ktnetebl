<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--technology">
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">Technology</h1>
            <p class="psm-hero__description">
              KTNET eBL Korea는 블록체인 기반 구조를 통해<br class="no-br--pc" />
              거래의 진정성,
              <br class="no-br--mo" />
              추적 가능성, 구조적 신뢰를 동시에<br class="no-br--pc" />
              보장하는 차세대 무역 금융 플랫폼입니다.
            </p>
          </div>
          <div class="col col-12 col-md-6 psm-hero__symbol">
            <img :src="heroObject" alt="Technology symbol" class="psm-hero__visual" />
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              e-B/L에 최적화된 블록체인
              <br class="no-br--mo" />
              기술 구조
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              하이퍼레저 패브릭은 기업용 무역 금융이 요구하는<br class="no-br--pc" />
              고도의 보안성과
              <br class="no-br--mo" />
              처리 속도를 보장하는 핵심 기술 기반입니다.
            </p>
          </div>
        </div>

        <div class="psm-lined-list">
          <div class="psm-lined-list__item">
            <div class="content">
              <h3>허가용 보안 시스템</h3>
              <p>
                인증된 참여자만 접근을 허용하여 무역 데이터의<br class="no-br--pc" />
                기밀성과
                <br class="no-br--mo" />
                철저한 내부 통제를 보장합니다.
              </p>
            </div>
            <div class="visual">
              <VImg
                src="~/assets/images/portal/obj_tech_01.png"
                aspect-ratio="1"
                alt="허가용 보안 시스템"
              />
            </div>
          </div>

          <div class="psm-lined-list__item">
            <div class="content">
              <h3>실시간 위·변조 방지</h3>
              <p>
                모든 문서는 하이퍼레저 패브릭의 분산 원장에<br class="no-br--pc" />
                기록되어
                <br class="no-br--mo" />
                데이터 무결성을 완벽하게 유지합니다.
              </p>
            </div>
            <div class="visual">
              <VImg
                src="~/assets/images/portal/obj_tech_02.png"
                aspect-ratio="1"
                alt="실시간 위변조 방지"
              />
            </div>
          </div>

          <div class="psm-lined-list__item">
            <div class="content">
              <h3>전 과정 권리 추적</h3>
              <p>
                발행부터 인도 승인까지 모든 유통 이력을 투명하게 기록하여
                <br class="no-br--mo" />
                권리 이동의 명확성을 제공합니다.
              </p>
            </div>
            <div class="visual">
              <VImg
                src="~/assets/images/portal/obj_tech_03.png"
                aspect-ratio="1"
                alt="전 과정 권리 추적"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-section--blue psm-tech-event">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              e-B/L의 모든 핵심 이벤트를
              <br class="no-br--mo" />
              변경 불능한 기록으로
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              발행부터 양도, 매입 심사 및 인도에 이르는
              <br class="no-br--pc" />
              모든 거래 이벤트를
              <br class="no-br--mo" />
              블록체인 구조 위에 기록하여 거래의 투명과 추적 가능성을 강화합니다.
            </p>
          </div>
        </div>

        <div class="row psm-tech-event-row">
          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--white psm-tech-event-card">
              <p class="psm-card__step">Step1</p>
              <div class="psm-card__title"><h3>e-B/L 발행</h3></div>
              <p class="psm-card__desc">
                운송 계약에 따라 전자 선하증권이<br class="no-br--pc" />
                최초 생성됩니다.
              </p>
              <div class="psm-badge--container">
                <span class="psm-badge psm-badge--blue">선사</span>
                <span class="psm-badge psm-badge--blue">발행 주체</span>
              </div>
            </article>
          </div>
          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--white psm-tech-event-card">
              <p class="psm-card__step">Step2</p>
              <div class="psm-card__title"><h3>권리 양도 및 유통</h3></div>
              <p class="psm-card__desc">
                e-B/L의 소유권이 수취인 또는 은행으로<br class="no-br--pc" />
                이전됩니다.
              </p>
              <div class="psm-badge--container">
                <span class="psm-badge psm-badge--blue">기존 보유자 → 신규 보유자</span>
              </div>
            </article>
          </div>
          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--white psm-tech-event-card">
              <p class="psm-card__step">Step3</p>
              <div class="psm-card__title"><h3>매입 신청 및 심사</h3></div>
              <p class="psm-card__desc">
                은행에 e-B/L을 제출하여 매입 심사 및<br class="no-br--pc" />
                승인/반송 처리가 개시됩니다.
              </p>
              <div class="psm-badge--container">
                <span class="psm-badge psm-badge--blue">수출 기업</span>
                <span class="psm-badge psm-badge--blue">매입 은행</span>
              </div>
            </article>
          </div>
          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--white psm-tech-event-card">
              <p class="psm-card__step">Step4</p>
              <div class="psm-card__title"><h3>상환</h3></div>
              <p class="psm-card__desc">수입자가 e-B/L 권리를 선사에 상환합니다.</p>
              <div class="psm-badge--container">
                <span class="psm-badge psm-badge--blue">수입 기업</span>
                <span class="psm-badge psm-badge--blue">선사</span>
              </div>
            </article>
          </div>
          <div class="col col-12">
            <article class="psm-card psm-card--white psm-tech-event-card">
              <p class="psm-card__step">Step5</p>
              <div class="psm-card__title"><h3>화물 인도</h3></div>
              <p class="psm-card__desc">선사에 e-B/L을 제시하고 화물을 인수합니다.</p>
              <div class="psm-badge--container">
                <span class="psm-badge psm-badge--blue">수입 기업</span>
                <span class="psm-badge psm-badge--blue">인수</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-tech-value">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              블록체인 기반 e-B/L이
              <br class="no-br--pc" />
              만드는
              <br class="no-br--mo" />
              참여자별 실질 가치
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              동일한 거래 기록을 기반으로 선사, 은행 수출입 기업이 각자의 관점에서
              <br class="no-br--mo" />
              신뢰와 효율을 확보합니다.
            </p>
          </div>
        </div>

        <div class="row psm-tech-value-row">
          <div class="col col-12">
            <article class="psm-card psm-card--dark">
              <div class="psm-card__title text-center"><h3>eBL Korea</h3></div>
              <p class="psm-card__desc text-center">
                무역금융 실무를 위해 설계된 실시간 신뢰 인프라
              </p>
            </article>
          </div>
          <div class="col col-12 col-md-4">
            <article class="psm-card psm-card--gray psm-tech-value-card">
              <div class="psm-card__title"><h3>선사</h3></div>
              <p class="psm-card__desc">권리 이전의 확실성 확보</p>
              <ul>
                <li><VIcon icon="ebli:check-line" />양도 이력의 위·변조 방지</li>
                <li><VIcon icon="ebli:check-line" />권리 이전 흐름 명확화</li>
                <li><VIcon icon="ebli:check-line" />분쟁 발생 가능성 최소화</li>
              </ul>
            </article>
          </div>
          <div class="col col-12 col-md-4">
            <article class="psm-card psm-card--gray psm-tech-value-card">
              <div class="psm-card__title"><h3>은행</h3></div>
              <p class="psm-card__desc">서류 진정성 검증과 통제 강화</p>
              <ul>
                <li><VIcon icon="ebli:check-line" />모든 권리 이동의 시간순 기록</li>
                <li><VIcon icon="ebli:check-line" />실시간 리스크 확인</li>
                <li><VIcon icon="ebli:check-line" />내부 통제 및 감사 대응 용이</li>
              </ul>
            </article>
          </div>
          <div class="col col-12 col-md-4">
            <article class="psm-card psm-card--gray psm-tech-value-card">
              <div class="psm-card__title"><h3>수출입 기업</h3></div>
              <p class="psm-card__desc">거래 속도와 운영 안정성 향상</p>
              <ul>
                <li><VIcon icon="ebli:check-line" />승인·양도·심사 기록 자동화</li>
                <li><VIcon icon="ebli:check-line" />절차 간소화</li>
                <li><VIcon icon="ebli:check-line" />거래 신뢰 기반 확보</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_technology.svg?url'

definePageMeta({ layout: 'portal' })
</script>
