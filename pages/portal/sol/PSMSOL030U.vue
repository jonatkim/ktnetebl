<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--negotiation">
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">Negotiation</h1>
            <p class="psm-hero__description">
              전자선하증권의 진정한 가치는<br class="no-br--pc" />
              무역금융과의 연계를 통해 완성됩니다.
            </p>
          </div>
          <div class="col col-12 col-md-6 psm-hero__symbol">
            <img :src="heroObject" alt="Negotiation symbol" class="psm-hero__visual" />
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">전자 선하증권을 넘어,<br />금융 업무까지</h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              KTNET eBL Korea는 단순한 기명식 B/L 처리에 그치지 않습니다.<br class="no-br--mo" />
              은행 시스템과 직접 연계된 e-B/L 환경에서<br class="no-br--mo" />
              지시식 B/L 처리부터 매입 신청까지 하나의 프로세스로 지원합니다.
            </p>
          </div>
        </div>

        <div class="row psm-neg-row">
          <div class="col col-12 col-md-6">
            <article class="psm-neg-card psm-neg-card--gray">
              <h3>무역금융 핵심 담보</h3>
              <p>
                종이 B/L과 동일한 법적 효력으로<br class="no-br--pc" />
                은행의 담보권을 안정적으로 보호하며,<br />
                안전한 금융 거래를 보장합니다.
              </p>
              <div class="psm-badge--container negotiation-badges">
                <span class="psm-badge psm-badge--outlined">담보</span>
                <span class="psm-badge psm-badge--outlined">법적 안정성</span>
              </div>
            </article>
          </div>
          <div class="col col-12 col-md-6">
            <article class="psm-neg-card psm-neg-card--gray">
              <h3>은행 매입·양도 원클릭 처리</h3>
              <p>
                복잡한 배서와 권리 양도를 클릭 한 번으로<br class="no-br--pc" />
                간편하게 처리하여,<br class="no-br--mo" />
                매입 및 개설 은행 간<br class="no-br--pc" />
                모든 업무를 하나의 흐름으로 연결합니다.
              </p>
              <div class="psm-badge--container negotiation-badges">
                <span class="psm-badge psm-badge--outlined">원클릭</span>
                <span class="psm-badge psm-badge--outlined">은행 연계</span>
              </div>
            </article>
          </div>
          <div class="col col-12">
            <article class="psm-neg-card psm-neg-card--wide">
              <div class="content">
                <h3>실제 무역 현장에서 검증된 업무 흐름</h3>
                <p>
                  신용장(L/C) 기반 지시식 거래를 중심으로<br />
                  실무 비중이 높은 무역 프로세스를 안정적으로 지원하여 현장 적용성을 강화했습니다.
                </p>
                <div class="psm-badge--container negotiation-badges">
                  <span class="psm-badge psm-badge--outlined">L/C 거래</span>
                  <span class="psm-badge psm-badge--outlined">지시식 B/L</span>
                  <span class="psm-badge psm-badge--outlined">실시간 금융 연결</span>
                </div>
              </div>
              <div class="visual">
                <VImg
                  src="~/assets/images/portal/obj_flow.png"
                  alt="Negotiation workflow visual"
                  width="260"
                  aspect-ratio="1"
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-section--top-divider">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              KTNET eBL Korea,<br />
              은행과 직접 연결된 e-B/L 인프라
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              전자 선하증권과 은행 시스템을 직접 연계해 매입 신청까지 이어지는<br
                class="no-br--mo"
              />
              안정적이고 효율적인 금융 프로세스를 제공합니다.
            </p>
          </div>
        </div>

        <div class="row psm-neg-infra-row">
          <div class="col col-12 col-md-4">
            <article class="psm-card psm-card--gray">
              <h3>수출입 기업</h3>
              <p>
                기존 종이 B/L 기반 업무 흐름을 유지하면서<br class="no-br--mo" />
                전자화의 효율성과 안정성을 동시에 확보할 수 있습니다.
              </p>
              <VImg
                src="~/assets/images/portal/obj_infra_01.png"
                alt="수출입 기업"
                class="psm-neg-infra-visual"
                aspect-ratio="1"
              />
            </article>
          </div>
          <div class="col col-12 col-md-4">
            <article class="psm-card psm-card--gray">
              <h3>은행</h3>
              <p>
                전자문서 기반의 신속하고 안정적인<br class="no-br--mo" />
                매입 심사 및 금융 처리가 가능합니다.
              </p>
              <VImg
                src="~/assets/images/portal/obj_infra_02.png"
                alt="은행"
                class="psm-neg-infra-visual"
                aspect-ratio="1"
              />
            </article>
          </div>
          <div class="col col-12 col-md-4">
            <article class="psm-card psm-card--gray">
              <h3>전체 무역 거래</h3>
              <p>
                속도·보안·신뢰성을 강화한<br class="no-br--mo" />
                차세대 전자 무역 환경을 제공합니다.
              </p>
              <VImg
                src="~/assets/images/portal/obj_infra_03.png"
                alt="전체 무역 거래"
                class="psm-neg-infra-visual"
                aspect-ratio="1"
              />
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-section--gray psm-neg-structure">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              전송 중심 e-B/L에서<br />
              무역금융까지 확장되는 구조
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              기존 전송 중심 e-B/L 구조에 지시식, 은행 연계, <br class="no-br--pc" />
              통합 금융 흐름 기능이 <br class="no-br--mo" />
              결합됩니다. 이를 통해 단순 문서 전달을 넘어 실제 무역금융까지 연결되는 디지털 거래
              구조가 완성됩니다.
            </p>
          </div>
        </div>
        <h3 class="psm-box--header">Core Structure</h3>
        <div class="row psm-row--box">
          <div class="col col-12">
            <div class="psm-box pb-pc-50">
              <h3 class="title">전송 중심 e-B/L</h3>
              <p class="desc">
                문서를 디지털로 전달하는 기능에 집중되어,<br />
                권리 이전이나 금융 처리에는 구조적 제약이 존재합니다.
              </p>
            </div>
          </div>
        </div>
        <h3 class="psm-box--header">Capability Extension</h3>
        <div class="row psm-row--box">
          <div class="col col-12 col-md-4">
            <div class="psm-box">
              <h3 class="title">지시식(Order) 기능</h3>
              <p class="desc">
                지시식 구조를 디지털로 구현하여<br />
                권리 이전과 배서 절차를 온라인에서 수행할 수 있습니다.
              </p>
            </div>
          </div>
          <div class="col col-12 col-md-4">
            <div class="psm-box">
              <h3 class="title">은행 시스템 연계</h3>
              <p class="desc">
                은행 시스템과 직접 연결되어
                <br class="no-br--mo" />
                매입 심사와 금융 처리가<br class="no-br--pc" />
                보다 빠르고 안정적으로 이루어집니다.
              </p>
            </div>
          </div>
          <div class="col col-12 col-md-4">
            <div class="psm-box">
              <h3 class="title">통합 무역금융 흐름</h3>
              <p class="desc">
                발행, 권리 이전, 금융 처리까지<br />
                하나의 디지털 거래 구조 안에서 연결됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_negotiation.svg?url'

definePageMeta({ layout: 'portal' })
</script>
