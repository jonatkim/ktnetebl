<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--presentation">
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">Presentation</h1>
            <p class="psm-hero__description">
              e-B/L 유통을 넘어, 개설은행 관점의 실제 무역금융 업무까지
              <br class="no-br--mo" />
              플랫폼에서 지원합니다.
            </p>
          </div>
          <div class="col col-12 col-md-6 psm-hero__symbol">
            <img :src="heroObject" alt="Presentation symbol" class="psm-hero__visual" />
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              은행 실무 프로세스를<br />
              그대로 디지털화
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              종이 문서 기반 무역금융에서 운영되던 <br class="no-br--pc" />
              심사·승인·부도 처리 절차를 <br class="no-br--mo" />
              전자 환경에 <br class="no-br--pc" />
              정확히 재현하여 업무 연속성과<br class="no-br--pc" />
              신뢰성을 유지합니다.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--gray psm-pre-step-card">
              <p class="psm-card__step">Step1</p>
              <div class="contents">
                <div class="psm-card__title">
                  <h3>매입서류 승인</h3>
                </div>
                <p class="psm-card__desc">KTNET eBL Korea에서 직접 승인 처리</p>
              </div>
            </article>
          </div>
          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--gray psm-pre-step-card">
              <p class="psm-card__step">Step2</p>
              <div class="contents">
                <div class="psm-card__title">
                  <h3>부도반송 처리</h3>
                </div>
                <p class="psm-card__desc">리스크 발생 시 즉시 전자 처리</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-section--round psm-section--top-divider psm-pre-digital-env">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              복잡한 수기 행정에서<br />
              스마트한 디지털 환경으로
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              기존 종이 기반 무역 행정의 복잡한 절차를<br />
              KTNET eBL Korea를 통해 실시간 디지털 환경으로 전환합니다.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--mo-gray psm-pre-compare-card">
              <div class="psm-card__title">
                <h3>기존 종이 환경</h3>
                <span class="psm-badge psm-badge--mo-white">Manual</span>
              </div>
              <p class="psm-card__desc">
                수기 중심의 분산 처리로 시간과 리스크가<br class="no-br--pc" />
                누적되는 구조
              </p>
              <ul>
                <li>
                  <VIcon icon="ebli:delete" />
                  서류 접수 지연
                </li>
                <li>
                  <VIcon icon="ebli:delete" />
                  수기 승인
                </li>
                <li>
                  <VIcon icon="ebli:delete" />
                  유통/배달 동시
                </li>
                <li>
                  <VIcon icon="ebli:delete" />
                  종이 문서 보관
                </li>
              </ul>
            </article>
          </div>
          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--mo-blue psm-pre-compare-card">
              <div class="psm-card__title">
                <h3>KTNET eBL Korea</h3>
                <span class="psm-badge psm-badge--blue psm-badge--mo-white blue">Digital</span>
              </div>
              <p class="psm-card__desc">
                승인·통지·기록 관리가 실시간으로 연결된
                <br class="no-br--pc" />
                통합 e-B/L 환경
              </p>
              <ul>
                <li>
                  <VIcon icon="ebli:success" class="blue" />
                  전자 서류 즉시 확인
                </li>
                <li>
                  <VIcon icon="ebli:success" class="blue" />
                  플랫폼 내 승인
                </li>
                <li>
                  <VIcon icon="ebli:success" class="blue" />
                  즉시 부도발생 처리
                </li>
                <li>
                  <VIcon icon="ebli:success" class="blue" />
                  자동 기록 저장
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-section--gray psm-pre-standard">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">KTNET eBL Korea가 만드는 무역금융의 새로운 기준</h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              은행과 기업의 실무 환경을 깊이 이해한<br class="no-br--pc" />
              설계를 바탕으로<br class="no-br--mo" />
              까다로운 금융 검증 절차까지<br class="no-br--pc" />
              디지털로 구현했습니다.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col col-12 col-md-3">
            <div class="psm-box psm-pre-icon-box large">
              <h3 class="title">은행 중심 설계</h3>
              <p class="desc">기업과 은행 실무를 모두 고려한 구조</p>
              <VImg
                src="~/assets/images/portal/obj_standard_01.png"
                alt="은행 중심 설계"
                aspect-ratio="1"
              />
            </div>
          </div>
          <div class="col col-12 col-md-3">
            <div class="psm-box psm-pre-icon-box large">
              <h3 class="title">완전한 디지털 전환</h3>
              <p class="desc">심사부터 승인까지 전자화</p>
              <VImg
                src="~/assets/images/portal/obj_standard_02.png"
                alt="완전한 디지털 전환"
                aspect-ratio="1"
              />
            </div>
          </div>
          <div class="col col-12 col-md-3">
            <div class="psm-box psm-pre-icon-box large">
              <h3 class="title">내부 통제 준수</h3>
              <p class="desc">기존 심사 기준 및 통제 체계 유지</p>
              <VImg
                src="~/assets/images/portal/obj_standard_03.png"
                alt="내부 통제 준수"
                aspect-ratio="1"
              />
            </div>
          </div>
          <div class="col col-12 col-md-3">
            <div class="psm-box psm-pre-icon-box large">
              <h3 class="title">투명한 기록 관리</h3>
              <p class="desc">모든 이력 자동 기록</p>
              <VImg
                src="~/assets/images/portal/obj_standard_04.png"
                alt="투명한 기록 관리"
                aspect-ratio="1"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-pre-impact">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">e-B/L 도입이 만드는 실제 변화</h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              전자 선하증권 기반의 통합 프로세스를 통해 은행과 기업,
              <br class="no-br--mo" />
              전체 무역 생태계에 걸쳐 속도·정확성·투명성이 동시에 향상됩니다.
            </p>
          </div>
        </div>

        <div class="psm-pre-impact-group">
          <h3 class="group-title">은행 관점</h3>
          <div class="row psm-pre-impact-row">
            <div class="col col-12 col-md-6">
              <article
                class="psm-card psm-card--gray psm-pre-impact-card psm-pre-impact-card--h100p"
              >
                <div class="psm-card__title">
                  <h3>처리 시간 단축</h3>
                </div>
                <p class="psm-card__desc">
                  실시간 전자 문서 처리로<br />
                  승인 및 통지 시간을 줄입니다.
                </p>
                <VImg
                  src="~/assets/images/portal/obj_impact_01.png"
                  alt="처리 시간 단축"
                  aspect-ratio="1"
                />
              </article>
            </div>
            <div class="col col-12 col-md-6">
              <article class="psm-card psm-card--blue psm-pre-impact-card">
                <div class="psm-card__title">
                  <h3>업무 효율 향상</h3>
                </div>
                <p class="psm-card__desc">
                  반복 수작업을 자동화하여 <br class="no-br--pc" />
                  승인 및 처리 전반을 높입니다.
                </p>
              </article>
              <article class="psm-card psm-card--blue psm-pre-impact-card mt-6">
                <div class="psm-card__title">
                  <h3>감사 대응 용이</h3>
                </div>
                <p class="psm-card__desc">
                  모든 처리 기록이 자동 저장되어 <br class="no-br--pc" />
                  감사 대응이 간편합니다.
                </p>
              </article>
            </div>
            <div class="col col-12 col-md-6">
              <article class="psm-card psm-card--gray psm-pre-impact-card">
                <div class="psm-card__title">
                  <h3>리스크 감소</h3>
                </div>
                <p class="psm-card__desc">
                  데이터 추적성과 검증 체계로 <br class="no-br--pc" />
                  운영 리스크를 최소화합니다.
                </p>
              </article>
            </div>
            <div class="col col-12 col-md-6">
              <article class="psm-card psm-card--gray psm-pre-impact-card">
                <div class="psm-card__title">
                  <h3>의사결정 가시성 강화</h3>
                </div>
                <p class="psm-card__desc">
                  실시간 거래 데이터 기반으로 승인 현황과 <br class="no-br--pc" />
                  리스크를 한눈에 파악할 수 있습니다.
                </p>
              </article>
            </div>
          </div>
        </div>

        <div class="psm-pre-impact-group mt-lg-100px mt-11">
          <h3 class="group-title">전체 무역 생태계</h3>
          <div class="row psm-pre-impact-row">
            <div class="col col-12 col-md-3">
              <article
                class="psm-card psm-card--blue psm-pre-impact-card psm-pre-impact-card--h100p"
              >
                <div class="psm-card__title">
                  <h3>오류 감소</h3>
                </div>
                <p class="psm-card__desc">
                  수기 처리 오류와 <br />
                  분쟁 발생 가능성을 줄입니다.
                </p>
              </article>
            </div>
            <div class="col col-12 col-md-3">
              <article
                class="psm-card psm-card--blue psm-pre-impact-card psm-pre-impact-card--h100p"
              >
                <div class="psm-card__title">
                  <h3>비용 절감</h3>
                </div>
                <p class="psm-card__desc">
                  물리적 문서 관리 비용과 <br />
                  운영 비용을 낮춥니다.
                </p>
              </article>
            </div>
            <div class="col col-12 col-md-6">
              <article
                class="psm-card psm-card--gray psm-pre-impact-card psm-pre-impact-card--visual-right"
              >
                <div class="psm-card__title">
                  <h3>거래 신뢰도 강화</h3>
                </div>
                <p class="psm-card__desc">
                  표준화된 전자 문서와 검증 체계를 통해 <br class="no-br--pc" />
                  거래 당사자 간 신뢰를 높입니다.
                </p>
                <VImg
                  src="~/assets/images/portal/obj_impact_02.png"
                  alt="거래 신뢰도 강화"
                  class="visual-01"
                  aspect-ratio="1"
                />
              </article>
            </div>
            <div class="col col-12 col-md-6">
              <article class="psm-card psm-card--gray psm-pre-impact-card">
                <div class="psm-card__title">
                  <h3>처리 속도 개선</h3>
                </div>
                <p class="psm-card__desc">문서 이동과 승인 절차가 즉시 처리됩니다.</p>
              </article>
            </div>
            <div class="col col-12 col-md-6">
              <article class="psm-card psm-card--blue psm-card--mo-gray psm-pre-impact-card">
                <div class="psm-card__title">
                  <h3>디지털 인프라 구축</h3>
                </div>
                <p class="psm-card__desc">
                  안정적인 전자 무역 환경을 기반으로 <br class="no-br--pc" />
                  확장 가능합니다.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_presentation.svg?url'

definePageMeta({ layout: 'portal' })
</script>
