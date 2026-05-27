<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--ebl-overview">
    <!-- Hero -->
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">Electronic bill of lading</h1>
            <p class="psm-hero__description">
              대한민국 최대 규모 10만여 기업이 선택한 <br />
              KTNET의 검증된 디지털 무역 인프라를 제공합니다.
            </p>
          </div>
          <div class="col col-12 col-md-6 psm-hero__symbol">
            <img
              :src="heroObject"
              alt="Electronic bill of lading symbol"
              class="psm-hero__visual"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Key Values -->
    <section class="psm-section">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">디지털 무역의 새로운 기준,<br />e-B/L 서비스</h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              검증된 보안 기술과 혁신적인 전송 시스템을 통해,<br class="no-br--pc" />
              종이 없는<br class="no-br--mo" />
              디지털 물류 환경으로 가장 안전하게<br class="no-br--pc" />
              안내합니다.
            </p>
          </div>
        </div>

        <div class="row psm-row--feature">
          <div class="col col-12 col-md-6">
            <div class="psm-box">
              <p class="step">Security First</p>
              <h3 class="title">보안 및 안전</h3>
              <p class="desc">
                검증된 보안 기술과 인증 체계를 기반으로<br />
                신뢰할 수 있는 디지털 무역 환경을 제공합니다.
              </p>
            </div>
          </div>
          <div class="col col-12 col-md-6">
            <div class="psm-box">
              <p class="step">Total Trust</p>
              <h3 class="title">신뢰성 및 인프라</h3>
              <p class="desc">
                안정적인 시스템 인프라와<br />
                지속적인 운영 체계를 구축했습니다.
              </p>
            </div>
          </div>
          <div class="col col-12 col-md-6">
            <div class="psm-box">
              <p class="step">Efficiency</p>
              <h3 class="title">속도 및 효율성</h3>
              <p class="desc">
                문서 처리 시간을 단축하고<br />
                업무 효율을 향상시킵니다.
              </p>
            </div>
          </div>
          <div class="col col-12 col-md-6">
            <div class="psm-box">
              <p class="step">Transparency</p>
              <h3 class="title">투명한 관리</h3>
              <p class="desc">
                거래 과정의 가시성을 높여<br />
                투명한 업무 관리를 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Paper B/L Limits -->
    <section class="psm-section psm-section--gray">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">
              종이 선하증권이 가진<br class="no-br--pc" />
              구조적 한계
            </h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              아날로그 기반의 종이 문서는 관리 효율을 떨어뜨리고<br class="no-br--mo" />
              기업 운영에 불필요한 비용과 리스크를 발생시킬 수 있습니다.
            </p>
          </div>
        </div>

        <div class="row align-center">
          <div class="col col-12 col-md-6">
            <div class="psm-limit--list">
              <div class="psm-limit--item">
                <div class="visual">
                  <VImg
                    src="~/assets/images/portal/obj_limits_01.png"
                    alt="물리적 지연"
                    width="252"
                    aspect-ratio="1"
                  />
                </div>
                <h3>물리적 지연</h3>
                <p>
                  물리적인 서류 운송과 수동 처리 방식으로 인해<br class="no-br--pc" />
                  전체 물류 프로세스가 지연됩니다.
                </p>
              </div>
              <div class="psm-limit--item">
                <div class="visual">
                  <VImg
                    src="~/assets/images/portal/obj_limits_02.png"
                    alt="보안 위험"
                    width="252"
                    aspect-ratio="1"
                  />
                </div>
                <h3>보안 위험</h3>
                <p>
                  종이 문서는 발송 후 내용 변경이나 무단 기재를<br class="no-br--pc" />
                  통제하기 어렵고,
                  <br class="no-br--mo" />
                  데이터의 신뢰성을 확인하기<br class="no-br--pc" />
                  어렵습니다.
                </p>
              </div>
              <div class="psm-limit--item">
                <div class="visual">
                  <VImg
                    src="~/assets/images/portal/obj_limits_03.png"
                    alt="높은 관리비용"
                    width="252"
                    aspect-ratio="1"
                  />
                </div>
                <h3>높은 관리비용</h3>
                <p>
                  서류의 배송비는 물론, 검증을 위한 인건비와<br class="no-br--pc" />
                  실물 문서를 보관하기 위한
                  <br class="no-br--mo" />
                  물리적 공간 비용이<br class="no-br--pc" />
                  지속적으로 발생합니다.
                </p>
              </div>
            </div>
          </div>
          <div class="col col-12 col-md-6 psm-limit--side-visual">
            <VCarousel height="547" show-arrows="hover" cycle hide-delimiters crossfade>
              <VCarouselItem>
                <VImg
                  src="~/assets/images/portal/obj_limits_01.png"
                  height="547"
                  aspect-ratio="1"
                />
              </VCarouselItem>
              <VCarouselItem>
                <VImg
                  src="~/assets/images/portal/obj_limits_02.png"
                  height="547"
                  aspect-ratio="1"
                />
              </VCarouselItem>
              <VCarouselItem>
                <VImg
                  src="~/assets/images/portal/obj_limits_03.png"
                  height="547"
                  aspect-ratio="1"
                />
              </VCarouselItem>
            </VCarousel>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison -->
    <section class="psm-section psm-section--round">
      <div class="grid-container">
        <div class="psm-compare-box">
          <div class="row psm-section__header">
            <div class="col col-12 col-md-6">
              <h2 class="psm-section__title">
                글로벌 스탠다드,
                <br class="no-br--mo" />
                안전하고 신속한 e-B/L 솔루션
              </h2>
            </div>
            <div class="col col-12 col-md-6">
              <p class="psm-section__subtitle">
                서류 중심의 기존 프로세스를 디지털화하여<br />
                더 빠르고 효율적인 무역 환경을 구현합니다.
              </p>
            </div>
          </div>

          <div class="psm-table--wrap">
            <table class="psm-table psm-table--compare" width="100%">
              <colgroup>
                <col style="width: 25%" />
                <col style="width: 37.5%" />
                <col style="width: 37.5%" />
              </colgroup>
              <thead>
                <tr>
                  <th class="text-left">
                    Compare<br class="no-br--pc" />
                    Benefits
                  </th>
                  <th>종이 선하증권 (Paper B/L)</th>
                  <th>전자선하증권 (e-B/L)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="text-left">
                    전송<br class="no-br--pc" />
                    소요 시간
                  </th>
                  <td>
                    5-10일 소요<br class="no-br--pc" />
                    <VIcon icon="ebli:check-star" color="#9B9B9B" />
                  </td>
                  <td class="bold">
                    즉시 전송<br class="no-br--pc" />
                    <VIcon icon="ebli:check-star" color="#295BFF" />
                  </td>
                </tr>
                <tr>
                  <th class="text-left">도난 위험</th>
                  <td>
                    높음<br class="no-br--pc" />
                    <VIcon icon="ebli:check-star" color="#9B9B9B" />
                  </td>
                  <td class="bold">
                    완전 방지<br class="no-br--pc" />
                    <VIcon icon="ebli:check-star" color="#295BFF" />
                  </td>
                </tr>
                <tr>
                  <th class="text-left">분실 위험</th>
                  <td>
                    높음<br class="no-br--pc" />
                    <VIcon icon="ebli:check-star" color="#9B9B9B" />
                  </td>
                  <td class="bold">
                    완전 방지<br class="no-br--pc" />
                    <VIcon icon="ebli:check-star" color="#295BFF" />
                  </td>
                </tr>
                <tr>
                  <th class="text-left">문서 보관</th>
                  <td>
                    사무 공간 필요<br class="no-br--pc" />
                    <VIcon icon="ebli:check-star" color="#9B9B9B" />
                  </td>
                  <td class="bold">
                    디지털 스토리지<br class="no-br--pc" />
                    <VIcon icon="ebli:check-star" color="#295BFF" />
                  </td>
                </tr>
                <tr>
                  <th class="text-left">
                    화물 정보 및<br class="no-br--pc" />
                    자동화<br class="no-br--pc" />
                    (위치, 온도 등)
                  </th>
                  <td>
                    불가능<br class="no-br--pc" />
                    <VIcon icon="ebli:check-star" color="#9B9B9B" />
                  </td>
                  <td class="bold">
                    가능<br class="no-br--pc" />
                    <VIcon icon="ebli:check-star" color="#295BFF" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Indicators -->
    <section v-intersect-appbar-invert class="psm-section psm-section--dark">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">10만여 기업이 선택한<br />대한민국 무역 디지털 허브</h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              KTNET과 함께하는 디지털 무역 인프라로<br />
              검증된 신뢰와 확장성을 제공합니다.
            </p>
          </div>
        </div>

        <div class="row psm-row--box">
          <div class="col col-12 col-md-6">
            <div class="psm-box psm-box--thin-line">
              <h3 class="title large">국내 최대 인프라</h3>
              <p class="desc">대규모 디지털 무역 플랫폼으로 안정적 운영 보장</p>
            </div>
          </div>
          <div class="col col-12 col-md-6">
            <div class="psm-box psm-box--thick-line psm-box--util">
              <div class="content">
                <h3 class="title">기업 참여</h3>
                <p class="desc">
                  대한민국 수출입을 이끄는<br class="no-br--mo" />
                  무역 비지니스 파트너
                </p>
              </div>
              <div class="util">
                <strong>10만+</strong>
              </div>
            </div>

            <div class="psm-box psm-box--thick-line psm-box--util">
              <div class="content">
                <h3 class="title">물류 파트너</h3>
                <p class="desc">
                  검증된 글로벌 물류 기업과 연결된<br class="no-br--mo" />
                  협업 생태계
                </p>
              </div>
              <div class="util">
                <strong>5천+</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="row psm-row--box">
          <div class="col col-12">
            <div class="psm-box psm-box--thin-line">
              <h3 class="title large">국제·정부 공식 인증 플랫폼</h3>
              <p class="desc">
                P&I Clubs 승인과 정부 지정 등록기관으로<br class="no-br--pc" />
                법적 안정성과 글로벌 신뢰를 동시에 확보
              </p>
            </div>

            <div class="row mt-10 mt-pc-15">
              <div class="col col-12 col-md-6">
                <div class="psm-card psm-card--etc-1">
                  <div class="psm-card__head">
                    <VImg
                      src="~/assets/images/portal/etc_logo_01.png"
                      alt="국제 선주 책임 상호보험조합"
                      class="psm-card__logo"
                      width="96"
                      aspect-ratio="6/5"
                    />
                    <div class="psm-card__body">
                      <h4>
                        국제 선주 책임<br class="no-br--pc" />
                        상호보험조합 승인
                      </h4>
                      <p class="psm-card__etc-desc is--pc">
                        P&I Clubs 연합체 공식 승인으로<br />국제 표준을 충족하는 신뢰 기반 거래 환경
                        제공
                      </p>
                    </div>
                  </div>
                  <p class="psm-card__etc-desc is--mo">
                    P&I Clubs 연합체 공식 승인으로 국제 표준을 충족하는 신뢰 기반 거래 환경 제공
                  </p>
                </div>
              </div>
              <div class="col col-12 col-md-6">
                <div class="psm-card psm-card--etc-1">
                  <div class="psm-card__head">
                    <VImg
                      src="~/assets/images/portal/etc_logo_02.png"
                      alt="한국 정부 지정 등록기관"
                      class="psm-card__logo korea"
                      width="99"
                      aspect-ratio="58/55"
                    />
                    <div class="psm-card__body">
                      <h4>
                        한국 정부 지정<br class="no-br--pc" />
                        등록기관
                      </h4>
                      <p class="psm-card__etc-desc is--pc">
                        전자선하증권 공식 등록기관으로<br />
                        법적 안정성과 공신력 확보
                      </p>
                    </div>
                  </div>
                  <p class="psm-card__etc-desc is--mo">
                    전자선하증권 공식 등록기관으로 법적 안정성과 공신력 확보
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Issuance -->
    <section class="psm-section">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">맞춤형 선하증권 발행</h2>
          </div>
          <div class="col col-12 col-md-6">
            <p class="psm-section__subtitle">
              다양한 선하증권 유형과 거래 방식에 유연하게<br class="no-br--pc" />
              대응합니다
            </p>
          </div>
        </div>

        <div class="row psm-row--box">
          <div class="col col-12 col-md-6">
            <div class="psm-box large">
              <h3 class="title">
                Master B/L부터<br class="no-br--pc" />
                Sea Waybill까지 지원
              </h3>
              <p class="desc">
                선사 직접 발행부터 신속한 거래 방식까지<br />
                모든 발행 유형 대응
              </p>
            </div>
          </div>
          <div class="col col-12 col-md-6">
            <div class="psm-box large">
              <h3 class="title">Negotiable 거래 완벽 지원</h3>
              <p class="desc">
                권리 양도 기반 신용장 거래부터<br class="no-br--pc" />
                단순 화물 인도까지<br class="no-br--mo" />
                유연한 거래 처리
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Supported B/L Types -->
    <section class="psm-section psm-section--blue psm-section--supported-types">
      <div class="grid-container">
        <div class="row psm-section__header">
          <div class="col col-12 col-md-6">
            <h2 class="psm-section__title">지원하는 B/L 타입</h2>
          </div>
        </div>
        <div class="row psm-bl-type--row mt-11">
          <div class="col col-3">
            <div class="psm-bl-type__card">Carrier, Master B/L</div>
          </div>
          <div class="col col-3">
            <div class="psm-bl-type__card">SeaWay Bill</div>
          </div>
          <div class="col col-3">
            <div class="psm-bl-type__card">Negotiable B/L</div>
          </div>
          <div class="col col-3">
            <div class="psm-bl-type__card">Non-negotiable B/L</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_electronic.svg?url'
definePageMeta({ layout: 'portal' })
</script>
