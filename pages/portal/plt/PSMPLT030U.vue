<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--industrial-standards">
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">Industrial Standards</h1>
            <p class="psm-hero__description">
              국제 산업 표준을 기반으로 디지털 무역 인프라의<br class="no-br--pc" />
              상호운용성과
              <br class="no-br--mo" />
              제도적 안정성을 확보합니다.
            </p>
          </div>
          <div class="col col-12 col-md-6 psm-hero__symbol">
            <img :src="heroObject" alt="Industrial standards symbol" class="psm-hero__visual" />
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-std-global">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">글로벌 무역 표준</h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              국제 기구가 공인한 글로벌 표준을 반영하여<br />
              e-B/L의 법적 효력을 보장합니다.
            </p>
          </div>
        </div>

        <div class="psm-lined-list">
          <article class="psm-lined-list__item">
            <div class="content">
              <h3>IGP&amp;I</h3>
              <p>
                국제 P&amp;I 클럽 승인 기반
                <br />
                전자선하증권의 글로벌 유통 및 보상 체계 인정
              </p>
            </div>
            <div class="visual">
              <VImg src="~/assets/images/portal/obj_global_std_01.png" alt="IGP and I" />
            </div>
          </article>

          <article class="psm-lined-list__item">
            <div class="content">
              <h3>DCSA</h3>
              <p>
                해운 산업 디지털 데이터 전송 표준 반영
                <br />
                글로벌 해운 시스템과의 상호운용성 확보
              </p>
            </div>
            <div class="visual">
              <VImg src="~/assets/images/portal/obj_global_std_02.png" alt="DCSA" />
            </div>
          </article>

          <article class="psm-lined-list__item">
            <div class="content">
              <h3>WCO &amp; UNCITRAL</h3>
              <p>
                WCO 데이터 모델 및 UNCITRAL MLETR 반영
                <br />
                국제 전자무역 법제 기반 구축
              </p>
            </div>
            <div class="visual">
              <VImg src="~/assets/images/portal/obj_global_std_03.png" alt="WCO and UNCITRAL" />
            </div>
          </article>

          <article class="psm-lined-list__item">
            <div class="content">
              <h3>상호운용성 PoC 참여</h3>
              <p>
                글로벌 플랫폼 간 상호운용성 검증 참여
                <br />
                국경 간 디지털 무역 연계 구조 확보
              </p>
            </div>
            <div class="visual">
              <VImg src="~/assets/images/portal/obj_global_std_04.png" alt="Interoperability PoC" />
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="psm-section psm-section--blue psm-std-security">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">정보보안 표준</h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              최첨단 보안 기술과 국제 인증으로 무역 데이터를 안전하게 보호합니다.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col col-12">
            <article class="psm-card psm-card--white psm-std-sec-card psm-std-sec-card--01">
              <div class="psm-card__title">
                <h3>
                  ISO/IEC 27001 기반 <br class="no-br--pc" />
                  관리 체계
                </h3>
              </div>
              <p class="psm-card__desc">
                국제 표준 정보보호 경영시스템 인증을 통한 체계적인 보안 관리
              </p>
              <div class="visual">
                <VImg src="~/assets/images/portal/obj_info_secu_01.png" alt="ISO IEC 27001" />
              </div>
            </article>
          </div>

          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--white psm-std-sec-card psm-std-sec-card--02">
              <div class="psm-card__title"><h3>ISMS 인증 기반 운영</h3></div>
              <p class="psm-card__desc">
                국내 최고 권위의 정보보호 인증을 바탕으로 한
                <br class="no-br--mo" />
                서비스 운영
              </p>
              <div class="visual">
                <VImg src="~/assets/images/portal/obj_info_secu_02.png" alt="ISMS" />
              </div>
            </article>
          </div>

          <div class="col col-12 col-md-6">
            <article class="psm-card psm-card--white psm-std-sec-card psm-std-sec-card--03">
              <div class="psm-card__title"><h3>블록체인 기반 무결성 구조</h3></div>
              <p class="psm-card__desc">
                블록체인 기술과 결합하여 데이터 위·변조를
                <br />
                방지하고 무결성을 유지
              </p>
              <div class="visual">
                <VImg
                  src="~/assets/images/portal/obj_info_secu_03.png"
                  alt="Blockchain integrity"
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_standards.svg?url'

definePageMeta({ layout: 'portal' })
</script>
