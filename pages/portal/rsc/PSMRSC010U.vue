<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--faq">
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">FAQ</h1>
            <p class="psm-hero__description">
              디지털 무역의 시작부터 완성까지, 궁금한 점을 연결해 드립니다.
              <br class="no-br--mo" />
              추가적인 도움이 필요하시면 ContactUs 메뉴를 통해
              <br class="no-br--mo" />
              문의 내용을 남겨주시기 바랍니다.
            </p>
          </div>
          <div class="col col-12 col-md-6 psm-hero__symbol">
            <img :src="heroObject" alt="FAQ symbol" class="psm-hero__visual" />
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-faq-content">
      <div class="psm-faq--container">
        <EblTabs v-model="activeTab" :items="faqTabItems" no-wrap class="psm-faq-tabs" />
        <div class="psm-faq-list--wrap">
          <div class="psm-faq-list__header">
            <p class="psm-faq-total">Total {{ filteredFaqItems.length.toLocaleString() }}</p>
          </div>

          <ul class="psm-faq-list psm-faq-list__body">
            <!-- FAQ list markup placeholder -->
            <li
              v-for="item in visibleFaqItems"
              :key="item.id"
              class="psm-faq-item"
              :class="{ open: openFaqId === item.id }"
            >
              <button
                type="button"
                class="psm-faq-item__question"
                :aria-expanded="openFaqId === item.id"
                @click="toggleFaq(item.id)"
              >
                <h3>{{ item.question }}</h3>
                <VIcon
                  :icon="openFaqId === item.id ? 'ebli:minus' : 'ebli:plus'"
                  class="psm-faq-item__toggle"
                />
              </button>
              <VExpandTransition>
                <div v-if="openFaqId === item.id">
                  <div class="psm-faq-item__answer">
                    {{ item.answer }}
                  </div>
                </div>
              </VExpandTransition>
            </li>
          </ul>

          <div class="psm-faq-list__footer">
            <button
              v-if="hasMoreFaqItems"
              type="button"
              class="psm-faq-more-btn"
              @click="loadMoreFaqItems"
            >
              More ({{ visibleFaqItems.length }} / {{ filteredFaqItems.length }})
              <VIcon size="20">ebli:chevron-bottom</VIcon>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_faq.svg?url'

const activeTab = ref('all')
const openFaqId = ref(null)
const visibleFaqCount = ref(10)
let openRafId = null

const faqTabItems = [
  { label: 'ALL', value: 'all' },
  { label: '서비스 이용', value: 'service' },
  { label: '프로세스', value: 'process' },
  { label: '기술 및 보안', value: 'tech-security' },
  { label: '법적 효력', value: 'legal' },
  { label: '기타', value: 'etc' },
]

const faqQuestion = '전자선하증권(e-B/L)은 종이 선하증권과 동일한 법적 효력을 가지나요?'
const faqAnswer = `e-B/L의 소유권을 관리하는 곳입니다.
[ 상법의 전자선하증권 규정의 시행에 관한 규정] 제 2조 (정의)에서 “전자선하증권 권리등록부란 전자선하증권의 발행등록, 양도 및 서면선하증권으로의 전환에 관한 기재 등을
위해 등록기관이 전자적 방식으로 관리하는 장부를 말한다”라고 설명되어 있습니다.
웹 포털 첫 화면에서 “e-B/L 교부 조회” 시 “e-B/L Serial No”를 입력하면 확인할 수 있습니다.
소유권자는 “e-B/L 유통 > e-B/L 조회 > 전자등록부” 경로에서 내역과 이력을 확인할 수 있습니다.`

const faqTypes = faqTabItems.filter((item) => item.value !== 'all').map((item) => item.value)

const faqItems = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  type: faqTypes[index % faqTypes.length],
  question: faqQuestion,
  answer: faqAnswer,
}))

const filteredFaqItems = computed(() => {
  if (activeTab.value === 'all') {
    return faqItems
  }

  return faqItems.filter((item) => item.type === activeTab.value)
})

const visibleFaqItems = computed(() => filteredFaqItems.value.slice(0, visibleFaqCount.value))

const hasMoreFaqItems = computed(() => visibleFaqItems.value.length < filteredFaqItems.value.length)

const openAfterClose = (id) => {
  if (openRafId) cancelAnimationFrame(openRafId)
  openRafId = requestAnimationFrame(() => {
    openFaqId.value = id
    openRafId = null
  })
}

const toggleFaq = (id) => {
  if (openFaqId.value === id) {
    openFaqId.value = null
    return
  }

  if (openFaqId.value !== null) {
    openFaqId.value = null
    openAfterClose(id)
    return
  }

  openFaqId.value = id
}

const loadMoreFaqItems = () => {
  visibleFaqCount.value = Math.min(visibleFaqCount.value + 10, filteredFaqItems.value.length)
}

watch(activeTab, () => {
  if (openRafId) {
    cancelAnimationFrame(openRafId)
    openRafId = null
  }
  openFaqId.value = null
  visibleFaqCount.value = 10
})

definePageMeta({ layout: 'portal' })
</script>
