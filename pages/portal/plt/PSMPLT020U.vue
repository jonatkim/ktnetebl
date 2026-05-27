<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--security">
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">Security</h1>
            <p class="psm-hero__description">
              무역금융 인프라에 최적화된 보안 체계<br />
              국제 표준 기반 설계로 거래 데이터의 무결성과
              <br class="no-br--pc" />
              운영 신뢰성을 보장합니다.
            </p>
          </div>
          <div class="col col-12 col-md-6 psm-hero__symbol">
            <img :src="heroObject" alt="Security symbol" class="psm-hero__visual" />
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">국제 표준으로 검증된 보안</h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              eBL Korea는 국제 인증을 통해 정보보호 관리 체계의<br class="no-br--mo" />
              적합성과 운영 수준을 객관적으로 검증받았습니다.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--gray psm-sec-cert-card">
              <div class="content">
                <div class="psm-card__title"><h3>ISO/IEC 27001</h3></div>
                <ul>
                  <li><VIcon icon="ebli:check-line" class="blue" />국제 정보보호 관리 표준</li>
                  <li><VIcon icon="ebli:check-line" class="blue" />플랫폼 전 영역 적용</li>
                  <li><VIcon icon="ebli:check-line" class="blue" />BSI 인증</li>
                </ul>
              </div>
              <div class="visual">
                <VImg
                  src="~/assets/images/portal/obj_iso_01.png"
                  alt="ISO IEC 27001"
                  class="visual-1"
                  aspect-ratio="131/143"
                />
              </div>
            </article>
          </div>
          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--gray psm-sec-cert-card">
              <div class="content">
                <div class="psm-card__title"><h3>ISMS 인증</h3></div>
                <ul>
                  <li><VIcon icon="ebli:check-line" class="blue" />국내 정보보호 관리 체계 인증</li>
                  <li><VIcon icon="ebli:check-line" class="blue" />운영 프로세스 포함</li>
                  <li><VIcon icon="ebli:check-line" class="blue" />정기 심사 기반 유지</li>
                </ul>
              </div>
              <div class="visual">
                <VImg
                  src="~/assets/images/portal/obj_iso_02.png"
                  alt="ISMS 인증"
                  class="visual-2"
                  aspect-ratio="49/51"
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section v-intersect-appbar-invert class="psm-section psm-section--dark psm-sec-system">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              플랫폼 전반에 적용되는<br class="no-br--pc" />
              보안 체계
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              접근, 데이터 보호, 운영 감시, 사고 대응까지<br />
              플랫폼 전 영역에 보안 관리 체계를 적용합니다.
            </p>
          </div>
        </div>

        <div class="psm-sec-system-list">
          <article class="psm-sec-system-item">
            <div class="content">
              <h3>접근 통제</h3>
              <p>
                인가된 사용자만 접근 가능 및 역할 기반 권한 관리 체계 운영<br />API 호출 경로 제어
                및 네트워크 분리 운영
              </p>
            </div>
            <div class="visual">
              <VImg src="~/assets/images/portal/obj_sec_01.png" alt="접근 통제" aspect-ratio="1" />
            </div>
          </article>

          <article class="psm-sec-system-item">
            <div class="content">
              <h3>데이터 보호</h3>
              <p>
                민감 정보 암호화, 전송구간 구간 암호화 보안<br />비대칭 키 암호화 및 전자서명 기술
                적용
              </p>
            </div>
            <div class="visual">
              <VImg
                src="~/assets/images/portal/obj_sec_02.png"
                alt="데이터 보호"
                aspect-ratio="1"
              />
            </div>
          </article>

          <div class="row">
            <div class="col col-12 col-md-6">
              <article class="psm-sec-system-item">
                <div class="content">
                  <h3>운영 보안</h3>
                  <p>
                    이상 행위 탐지 및 실시간 모니터링 체계 운영<br />실시간 모니터링 및 모든 행위
                    감사 로그 기록
                  </p>
                </div>
                <div class="visual">
                  <VImg
                    src="~/assets/images/portal/obj_sec_03.png"
                    alt="운영 보안"
                    aspect-ratio="1"
                  />
                </div>
              </article>
            </div>
            <div class="col col-12 col-md-6">
              <article class="psm-sec-system-item">
                <div class="content">
                  <h3>사고 대응</h3>
                  <p>보안 사고 발생 시<br />신속 대응 및 피해 최소화 체계 구축</p>
                </div>
                <div class="visual">
                  <VImg
                    src="~/assets/images/portal/obj_sec_04.png"
                    alt="사고 대응"
                    aspect-ratio="1"
                  />
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-section--gray psm-sec-value">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              e-B/L이 요구하는<br class="no-br--pc" />
              보안의 기준
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              e-B/L은 화물 권리를 증명하는 법적 문서이자
              <br />
              무역금융 심사의 핵심 근거입니다.
              <br />
              따라서 데이터 무결성과 체계적인 보안 관리가 필수입니다.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col col-12 col-md-4">
            <article class="psm-card psm-card--white psm-tech-value-card">
              <p class="psm-card__step">01</p>
              <div class="psm-card__title"><h3>법적 권리 증명 문서</h3></div>
              <p class="psm-card__desc">e-B/L은 화물에 대한 법적 권리를 증명하는 문서입니다.</p>
            </article>
          </div>
          <div class="col col-12 col-md-4">
            <article class="psm-card psm-card--white psm-tech-value-card">
              <p class="psm-card__step">02</p>
              <div class="psm-card__title"><h3>금융 심사의 핵심 근거</h3></div>
              <p class="psm-card__desc">은행 심사와 금융 의사결정의 기준 자료입니다.</p>
            </article>
          </div>
          <div class="col col-12 col-md-4">
            <article class="psm-card psm-card--white psm-tech-value-card">
              <p class="psm-card__step">03</p>
              <div class="psm-card__title"><h3>거래 신뢰의 기반</h3></div>
              <p class="psm-card__desc">
                거래 당사자 모두가 신뢰해야 하는<br class="no-br--pc" />
                디지털 문서입니다.
              </p>
            </article>
          </div>
          <div class="col col-12">
            <article class="psm-card psm-card--white psm-sec-value-quote">
              <p>
                보안은 기능이 아니라,<br class="no-br--pc" />
                무역금융 인프라의 기본 조건입니다.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_security.svg?url'

definePageMeta({ layout: 'portal' })
</script>
