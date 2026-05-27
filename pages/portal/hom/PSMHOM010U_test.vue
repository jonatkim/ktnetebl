<template>
  <div ref="homeContainerRef" class="psm-home-container">
    <!-- 1. 인트로/히어로 (A) -->
    <section class="psm-home-sec psm-home-sec--hero">
      <ul class="hero-title">
        <li class="text-item">
          <div class="text-move--wrap">
            <div class="text-move text-1">
              <h1>Purely Digital</h1>
            </div>
          </div>
        </li>
        <li class="text-item">
          <div class="text-move--wrap">
            <div class="text-move text-2">
              <h1>Fully Connected</h1>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- 2. B2: 세로선 등장/사라짐 -->
    <section class="psm-home-sec psm-home-sec--sec2">
      <div ref="verticalLineSectionRef" class="psm-home-sec--vertical-line">
        <div v-for="idx in 9" :key="`vertical-line-${idx}`" ref="verticalLines" class="line" />
      </div>
      <div class="fixed-area">
        <div class="icon-ship">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="26"
            viewBox="0 0 12 26"
            fill="none"
          >
            <path
              d="M8.93427 21.6103C10.4258 19.8451 11.2484 17.6002 11.2476 15.2861L11.2476 0.00148008L-0.000728296 0.00148042L-0.000727959 15.2861C-0.000727959 17.5994 0.821018 19.8451 2.31257 21.6103L5.62342 25.5289L8.93427 21.6103ZM4.03084 20.1593C2.88215 18.799 2.24893 17.0696 2.24814 15.2869L2.24814 2.25194L8.99712 2.25194L8.99712 15.2869C8.99712 17.0688 8.3647 18.799 7.21441 20.1593L5.62183 22.0431L4.03084 20.1593Z"
              fill="white"
            />
          </svg>
        </div>
        <div class="psm-home-sec-title">
          <h2 class="title">Purely Digital, Fully Connected.</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual01" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <ul class="desc-list">
            <li class="desc">The integrity of trade, encapsulated in</li>
            <li class="desc has-ship">
              <div class="line-ship--wrap">
                <div class="line-ship__text">a digital envelope</div>
                <div class="line-ship__line">
                  <div class="line-ship__icon">
                    <VIcon icon="ebli:ship" class="line-ship__icon" />
                  </div>
                </div>
              </div>
            </li>
            <li class="desc">flowing unbroken from the moment of</li>
            <li class="desc">creation to its final delivery.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 3. 사선(30도) 등장 애니메이션 (SVG) -->
    <div
      ref="diagonalWrapRef"
      class="psm-home-bg-diagonal"
      :class="{ 'is-absolute': isDiagonalAbsolute }"
      :style="diagonalStyle"
    >
      <svg
        class="psm-home-bg-diagonal--svg"
        :width="windowWidth"
        :height="windowHeight"
        :viewBox="`0 0 ${windowWidth} ${windowHeight}`"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="diagonal-reveal-mask" maskUnits="userSpaceOnUse">
            <path
              ref="diagonalMaskPathRef"
              :d="diagonalPath"
              stroke="#fff"
              stroke-width="2"
              fill="none"
            />
          </mask>
        </defs>
        <path
          ref="diagonalPathRef"
          :d="diagonalPath"
          stroke="#1fa345"
          stroke-width="2"
          stroke-dasharray="1 10"
          fill="none"
          mask="url(#diagonal-reveal-mask)"
        />
      </svg>
      <div class="diagonal-objects">
        <template v-for="section in diagonalObjectSections" :key="section.key">
          <template v-for="(item, idx) in section.items" :key="`${section.key}-${idx}-${item.src}`">
            <img
              v-if="item.type !== 'lottie'"
              :ref="(el) => setDiagonalObjectRef(section.key, idx, el)"
              :src="item.src"
              :alt="`${section.key}-obj-${idx + 1}`"
              class="diagonal-obj"
              :class="{ 'is-leader': idx === 0 }"
              :style="getDiagonalObjectStyle(item)"
            />
            <div
              v-else
              :ref="(el) => setDiagonalObjectRef(section.key, idx, el)"
              class="diagonal-obj diagonal-obj--lottie"
              :class="{ 'is-leader': idx === 0 }"
              :style="getDiagonalObjectStyle(item)"
            >
              <Vue3Lottie
                :ref="(player) => setDiagonalLottiePlayerRef(section.key, idx, player)"
                :animation-link="item.src"
                :auto-play="false"
                :loop="false"
                class="diagonal-lottie"
                @on-complete="() => onDiagonalLottieComplete(section.key, idx)"
              />
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- 4. Defined at the Origin (B1) -->
    <section ref="definedOriginSectionRef" class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">Defined at the Origin</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual02" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 class="subtitle">Digital Issuance</h3>
          <ul class="desc-list">
            <li class="desc">The moment data is born with</li>
            <li class="desc has-ship">
              <div class="line-ship--wrap">
                <div class="line-ship__text">absolute integrity</div>
                <div class="line-ship__line">
                  <div class="line-ship__icon">
                    <VIcon icon="ebli:ship" class="line-ship__icon" />
                  </div>
                </div>
              </div>
            </li>
            <li class="desc">the first record of digital trade begins</li>
            <li class="desc">here.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 5. Seamless Orbit (B1) -->
    <section ref="seamlessOrbitSectionRef" class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">Seamless Orbit</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual03" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 class="subtitle">Transmission Chain</h3>
          <ul class="desc-list">
            <li class="desc">Ownership encapsulated in a digital</li>
            <li class="desc has-ship">
              <div class="line-ship--wrap">
                <div class="line-ship__text">envelope</div>
                <div class="line-ship__line">
                  <div class="line-ship__icon">
                    <VIcon icon="ebli:ship" class="line-ship__icon" />
                  </div>
                </div>
              </div>
            </li>
            <li class="desc">flowing seamlessly, amplified and</li>
            <li class="desc">perfected by global stakeholder.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 6. Lifecycle (B3) -->
    <section ref="lifecycleSectionRef" class="psm-home-sec psm-home-sec--b3">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title white">Lifecycle</h2>
        </div>
      </div>
    </section>

    <!-- 7. Screen to Hand (B1) -->
    <section ref="screenToHandSectionRef" class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">Screen to Hand</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual04" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 class="subtitle">Materialization</h3>
          <ul class="desc-list">
            <li class="desc">Bridging to existing business</li>
            <li class="desc has-ship">
              <div class="line-ship--wrap">
                <div class="line-ship__text">environments</div>
                <div class="line-ship__line">
                  <div class="line-ship__icon">
                    <VIcon icon="ebli:ship" class="line-ship__icon" />
                  </div>
                </div>
              </div>
            </li>
            <li class="desc">supporting seamless integration with</li>
            <li class="desc">diverse processes on demand.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 8. Absolute Fulfillment (B1) -->
    <section ref="absoluteFulfillmentSectionRef" class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">Absolute Fulfillment</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual05" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 class="subtitle">Finalization</h3>
          <ul class="desc-list">
            <li class="desc">Realizing ultimate fulfillment of trade</li>
            <li class="desc has-ship">
              <div class="line-ship--wrap">
                <div class="line-ship__text">value</div>
                <div class="line-ship__line">
                  <div class="line-ship__icon">
                    <VIcon icon="ebli:ship" class="line-ship__icon" />
                  </div>
                </div>
              </div>
            </li>
            <li class="desc">securing the final cargo release and</li>
            <li class="desc">completing the entire digital journey.</li>
          </ul>
        </div>
      </div>
    </section>

    <div style="height: 25vh">&ZeroWidthSpace;</div>

    <!-- 9. 사선 퇴장 (고정 해제) -->
    <!-- 사선 SVG의 absolute 해제 및 애니메이션 (추후 구현) -->
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import keyVisual01 from '@/assets/images/portal/main_obj_key_01.svg?url'
import keyVisual02 from '@/assets/images/portal/main_obj_key_02.svg?url'
import keyVisual03 from '@/assets/images/portal/main_obj_key_03.svg?url'
import keyVisual04 from '@/assets/images/portal/main_obj_key_04.svg?url'
import keyVisual05 from '@/assets/images/portal/main_obj_key_05.svg?url'
import diagonalComplete from '@/assets/images/portal/main_on_diagonal_complete.svg?url'
import diagonalEnvelope from '@/assets/images/portal/main_on_diagonal_envelope.svg?url'
import diagonalEnvelopeColor from '@/assets/images/portal/main_on_diagonal_envelope_color.svg?url'
import diagonalEnvelopeSmall from '@/assets/images/portal/main_on_diagonal_envelope_small.svg?url'
import diagonalFolder from '@/assets/images/portal/main_on_diagonal_folder.svg?url'
import diagonalOk from '@/assets/images/portal/main_on_diagonal_ok.svg?url'
import diagonalPaper from '@/assets/images/portal/main_on_diagonal_paper.svg?url'
import diagonalPdf from '@/assets/images/portal/main_on_diagonal_pdf.svg?url'
import diagonalShip from '@/assets/images/portal/main_on_diagonal_ship.svg?url'

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger)
definePageMeta({ layout: 'portal' })

const mainStore = useMainStore()
const windowWidth = ref(import.meta.client ? window.innerWidth : 0)
const windowHeight = ref(import.meta.client ? window.innerHeight : 0)
const homeContainerRef = ref(null)
const verticalLineSectionRef = ref(null)
const verticalLines = ref([])
const diagonalWrapRef = ref(null)
const diagonalPathRef = ref(null)
const diagonalMaskPathRef = ref(null)
const definedOriginSectionRef = ref(null)
const seamlessOrbitSectionRef = ref(null)
const lifecycleSectionRef = ref(null)
const screenToHandSectionRef = ref(null)
const absoluteFulfillmentSectionRef = ref(null)
const isDiagonalAbsolute = ref(false)
const diagonalObjectRefMap = new Map()
const diagonalLottiePlayerMap = new Map()
const diagonalLottieStateMap = new Map()
let gsapContext = null

const DIAGONAL_CONTAINER_TARGET_RATIOS = [0.1, 0.3, 0.44, 0.58, 0.72]
const DIAGONAL_ENTRY_START = 0 // open path에서는 음수 start가 랩되어 좌하단에 찍힐 수 있어 0으로 고정
const DIAGONAL_CONTAINER_WIDTH = 1440
const ALIGN_ORIGIN = [0.5, 0.82] // 사선 경로에 오브젝트를 붙이는 공통 기준점
const LEADER_ENTER_DURATION = 0.62 // 리더 이동 구간을 늘려 2번 근처에서 1번으로 튀는 체감 완화
const DIAGONAL_EXIT_TRAVEL_DELTA = 0.1
const REVEAL_AFTER_PASS_OFFSET = 0.05 // 리더가 타겟을 지난 뒤 살짝 늦게 페이드인 시작
const LIFECYCLE_DIAGONAL_LOOP_START_FRAME = 150
const SECTION_ENTER_START = 'top+=25% top'
const SECTION_ENTER_END = 'top+=35% top'
const SECTION_EXIT_START = 'top+=65% top'
const SECTION_EXIT_END = 'top+=75% top' // 퇴장 구간 폭(12%)은 기존과 동일
const SECTION_PIN_START = 'top+=25% top'
const SECTION_PIN_END = 'top+=82% top'
const SECTION_SNAP_POINTS = [0, 0.5, 1]

let resizeRafId = null

const diagonalObjectSections = [
  {
    key: 'defined-origin',
    items: [
      { src: diagonalPaper },
      { src: diagonalPdf },
      { src: diagonalPdf },
      { src: diagonalPdf },
      { src: diagonalPdf },
    ],
  },
  {
    key: 'seamless-orbit',
    items: [
      { src: diagonalEnvelope, alignOrigin: [0.5, 0.56] },
      { src: diagonalFolder },
      { src: diagonalPdf },
      { src: diagonalPdf },
      { src: diagonalPdf },
    ],
  },
  {
    key: 'lifecycle',
    items: [
      { src: diagonalEnvelopeColor, alignOrigin: [0.5, 0.56], targetSlot: 0 },
      {
        type: 'lottie',
        src: '/lottie/lifecycle.json',
        targetSlot: 3,
        startPlayPoint: 'start',
        alignOrigin: [0.5, 0.525],
        width: 990,
        height: 610,
      },
    ],
  },
  {
    key: 'screen-to-hand',
    items: [
      { src: diagonalOk, targetSlot: 0 },
      { src: diagonalEnvelopeSmall, alignOrigin: [0.5, 0.56] },
      { src: diagonalEnvelopeSmall, alignOrigin: [0.5, 0.56] },
      { src: diagonalEnvelopeSmall, alignOrigin: [0.5, 0.56] },
      { src: diagonalEnvelopeSmall, alignOrigin: [0.5, 0.56] },
      {
        type: 'lottie',
        alignOrigin: [1, 0.52],
        src: '/lottie/print.json',
        targetSlot: 2,
        startPlayPoint: 'end',
        width: 381,
        height: 152,
      },
    ],
  },
  {
    key: 'absolute-fulfillment',
    items: [{ src: diagonalComplete }, { src: diagonalShip, alignOrigin: [0.5, 0.72] }],
  },
]

const diagonalSectionRefMap = {
  'defined-origin': definedOriginSectionRef,
  'seamless-orbit': seamlessOrbitSectionRef,
  lifecycle: lifecycleSectionRef,
  'screen-to-hand': screenToHandSectionRef,
  'absolute-fulfillment': absoluteFulfillmentSectionRef,
}

// 섹션 키/인덱스별 사선 오브젝트 엘리먼트 참조를 저장한다.
const setDiagonalObjectRef = (sectionKey, index, el) => {
  if (!diagonalObjectRefMap.has(sectionKey)) {
    diagonalObjectRefMap.set(sectionKey, [])
  }
  const sectionRefs = diagonalObjectRefMap.get(sectionKey)
  if (!el) {
    sectionRefs[index] = null
    return
  }
  sectionRefs[index] = el
}

const getObjectAlignOrigin = (sectionDef, index) =>
  sectionDef.items[index]?.alignOrigin ?? ALIGN_ORIGIN
const normalizeSizeValue = (value) => (typeof value === 'number' ? `${value}px` : value)
const getDiagonalObjectStyle = (item) => {
  const style = {}
  if (item?.width) style.width = normalizeSizeValue(item.width)
  if (item?.height) style.height = normalizeSizeValue(item.height)
  return style
}
const getObjectTargetSlot = (sectionDef, index) => sectionDef.items[index]?.targetSlot ?? index
const getDiagonalLottieKey = (sectionKey, index) => `${sectionKey}:${index}`
const setDiagonalLottiePlayerRef = (sectionKey, index, player) => {
  const key = getDiagonalLottieKey(sectionKey, index)
  if (!player) {
    diagonalLottiePlayerMap.delete(key)
    diagonalLottieStateMap.delete(key)
    return
  }
  diagonalLottiePlayerMap.set(key, player)
  player.goToAndStop?.(0, true)
}
const setDiagonalLottieActive = (sectionKey, index, isActive, options = {}) => {
  const key = getDiagonalLottieKey(sectionKey, index)
  const prev = diagonalLottieStateMap.get(key)
  if (prev === isActive) return
  diagonalLottieStateMap.set(key, isActive)
  const player = diagonalLottiePlayerMap.get(key)
  if (!player) return
  if (isActive) {
    player.goToAndPlay?.(options.startFrame ?? 0, true)
    return
  }
  const stopFrame = typeof options.stopFrame === 'number' ? options.stopFrame : 0
  player.stop?.()
  player.goToAndStop?.(stopFrame, true)
}
const onDiagonalLottieComplete = (sectionKey, index) => {
  if (sectionKey !== 'lifecycle') return
  const key = getDiagonalLottieKey(sectionKey, index)
  if (!diagonalLottieStateMap.get(key)) return
  const player = diagonalLottiePlayerMap.get(key)
  if (!player) return
  player.goToAndPlay?.(LIFECYCLE_DIAGONAL_LOOP_START_FRAME, true)
}
const clampPathProgress = (value) => Math.min(Math.max(value, 0), 1)
const getLeaderRevealTime = (targetPos, leaderStart, leaderEnd) => {
  const denom = leaderEnd - leaderStart
  if (!denom) return 0.02
  const progress = (targetPos - leaderStart) / denom
  const clampedProgress = Math.min(Math.max(progress, 0), 1)
  return 0.02 + clampedProgress * (LEADER_ENTER_DURATION - 0.03)
}
const lerp = (from, to, t) => from + (to - from) * t

const getLastSection = () =>
  homeContainerRef.value?.querySelector('.psm-home-sec:last-of-type') ?? null

// 1440px 컨테이너가 사선과 만나는 구간 기준으로 목표 위치 비율을 path 진행도(t)로 변환한다.
const getContainerBasedPathPositions = () => {
  const angle = (30 * Math.PI) / 180
  const cx = windowWidth.value / 2
  const L = Math.sqrt(windowWidth.value ** 2 + windowHeight.value ** 2)
  const dx = (L / 2) * Math.cos(angle)
  const x1 = cx - dx
  const x2 = cx + dx
  const dirX = x1 - x2

  if (!dirX) return DIAGONAL_CONTAINER_TARGET_RATIOS

  const effectiveContainerWidth = Math.min(DIAGONAL_CONTAINER_WIDTH, windowWidth.value)
  const containerLeft = (windowWidth.value - effectiveContainerWidth) / 2
  const containerRight = containerLeft + effectiveContainerWidth

  // path 진행방향은 우상단(0) -> 좌하단(1), 컨테이너 기준은 좌하단 -> 우상단
  const tAtRight = (containerRight - x2) / dirX
  const tAtLeft = (containerLeft - x2) / dirX

  return DIAGONAL_CONTAINER_TARGET_RATIOS.map((ratio) => tAtLeft + (tAtRight - tAtLeft) * ratio)
}

// 뷰포트 크기 상태를 최신 값으로 동기화한다.
const rebuildScrollAnimations = async () => {
  await nextTick()
  if (gsapContext) {
    gsapContext.revert()
  }
  gsapContext = gsap.context(() => {
    createHeroTitleAnimation()
    createVerticalLineAnimation()
    createSectionContentAnimation()
    createDiagonalRevealAnimation()
    createDiagonalObjectAnimation()
  })
  onScroll()
  ScrollTrigger.refresh()
}

const updateWindowSize = () => {
  if (!import.meta.client) return
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
  if (resizeRafId) {
    cancelAnimationFrame(resizeRafId)
  }
  resizeRafId = requestAnimationFrame(() => {
    rebuildScrollAnimations()
    resizeRafId = null
  })
}

// 화면 중심 기준 30도 대각선 SVG 경로를 계산한다.
const diagonalPath = computed(() => {
  const angle = (30 * Math.PI) / 180 // 30도를 라디안으로 변환
  const cx = windowWidth.value / 2
  const cy = windowHeight.value / 2
  const L = Math.sqrt(windowWidth.value ** 2 + windowHeight.value ** 2)
  const dx = (L / 2) * Math.cos(angle)
  const dy = (L / 2) * Math.sin(angle)
  const x1 = cx - dx
  const y1 = cy + dy
  const x2 = cx + dx
  const y2 = cy - dy
  // 오른쪽 위 -> 왼쪽 아래 방향으로 그리기 위해 시작/끝 점 순서를 고정한다.
  return `M ${x2} ${y2} L ${x1} ${y1}`
})

// 마지막 섹션 위치에 맞춰 사선 레이어를 absolute로 고정한다.
const diagonalStyle = computed(() => {
  if (!import.meta.client || !isDiagonalAbsolute.value) return {}
  const lastSection = getLastSection()
  if (lastSection) {
    const rect = lastSection.getBoundingClientRect()
    const scrollY = window.scrollY || window.pageYOffset
    return {
      position: 'absolute',
      top: `${rect.bottom + scrollY - windowHeight.value}px`,
      left: 0,
      width: `${windowWidth.value}px`,
      height: `${windowHeight.value}px`,
    }
  }
  return {}
})

// 스크롤 위치에 따라 마지막 섹션 기준으로 사선 레이어 고정 여부를 결정한다.
const onScroll = () => {
  if (!import.meta.client) return
  const lastSection = getLastSection()
  if (lastSection) {
    const rect = lastSection.getBoundingClientRect()
    isDiagonalAbsolute.value = rect.bottom <= windowHeight.value
  }
}

// Hero 타이틀을 스크롤에 맞춰 위로 밀어 올리는 오버랩 애니메이션을 만든다.
const createHeroTitleAnimation = () => {
  const heroTexts =
    homeContainerRef.value?.querySelectorAll('.hero-title .text-item .text-move') ?? []
  heroTexts.forEach((el) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: '-30% top', // 요소 상단이 뷰포트 상단보다 30% 위에 왔을 때 시작
        scrub: 0.8, // 스크롤을 부드럽게 보간해 급격한 점프를 줄임
      },
    })
    tl.to(el, {
      y: '100%', // 텍스트를 자신의 높이만큼 내려 다음 라인과 겹치게 전환
      duration: 1, // 기본 재생 속도(스크럽 중 체감 강도) 제어
    })
  })
}

// B2 세로선을 스크롤 구간에 맞춰 순차 등장/퇴장시킨다.
const createVerticalLineAnimation = () => {
  const vLineSection = verticalLineSectionRef.value
  if (!vLineSection) return

  const vLines = verticalLines.value
  if (!vLines.length) return
  gsap.set(vLines, { scaleY: 0, opacity: 0 }) // 초기에는 높이/투명도를 모두 0으로 시작

  const enterTl = gsap.timeline({
    scrollTrigger: {
      trigger: vLineSection,
      start: 'top top', // 섹션 top이 뷰포트 top에 닿는 시점부터 시작
      end: '25% top', // 섹션 top이 뷰포트 top에 닿을 때까지 재생
      scrub: true, // 스크롤 진행도와 애니메이션 진행도를 1:1 동기화
    },
  })
  enterTl.fromTo(
    vLines,
    { scaleY: 0, opacity: 0 },
    {
      scaleY: 1, // 선 길이를 100%까지 확장해 등장 효과
      opacity: 0.32, // 등장 중간 피크 밝기
      stagger: 0.1, // 각 선을 0.1초 간격으로 순차 재생
      transformOrigin: 'bottom', // 아래에서 위로 자라나는 방향 고정
      ease: 'power1.in', // 초반을 더 빠르게 붙여 선명한 등장감 부여
      duration: 0.45,
    },
    0,
  )
  enterTl.to(
    vLines,
    {
      opacity: 0.1, // 최종 목표 밝기를 낮춰 잔상처럼 유지
      stagger: 0.1, // 피크-감쇠도 동일 템포를 유지
      ease: 'power1.out', // 피크 이후 부드럽게 감쇠
      duration: 0.55,
    },
    0.45,
  )

  gsap.to(vLines, {
    scaleY: 0, // 선 길이를 다시 0으로 줄여 퇴장 효과
    stagger: 0.1, // 등장과 동일한 간격으로 순차 퇴장
    transformOrigin: 'top', // 위에서 아래로 닫히는 방향 고정
    ease: 'power1.in', // 퇴장 시작을 빠르게 만들어 다음 섹션 전환 강화
    scrollTrigger: {
      trigger: vLineSection,
      start: 'bottom bottom', // 섹션 bottom 지점이 뷰포트 bottom에 닿을 때 퇴장 시작
      end: 'bottom top', // 섹션 bottom이 뷰포트 top에 닿을 때 종료
      scrub: true, // 스크롤 역방향 시 동일 경로로 자연스럽게 복귀
    },
  })
}

// 각 섹션의 고정 영역을 핀 처리하고 제목/키비주얼/설명을 순차 전환한다.
const createSectionContentAnimation = () => {
  gsap.utils.toArray('.psm-home-sec .fixed-area', homeContainerRef.value).forEach((area) => {
    const section = area.parentElement
    const isLastSection = section === getLastSection()
    const elements = [
      area.querySelector('.psm-home-sec-title'),
      area.querySelector('.psm-home-sec-key'),
      area.querySelector('.psm-home-sec-desc'),
    ].filter(Boolean)

    elements.forEach((el, idx) => {
      const yPercentEnter = [-60, -120, 60]
      const yPercentLeave = [-60, -120, 60]
      const delays = [1, 4, 1]

      gsap.fromTo(
        el,
        {
          yPercent: yPercentEnter[idx], // 시작 위치를 위/아래로 미리 오프셋해 입장 거리 확보
          opacity: 0, // 입장 전 완전 투명 상태
        },
        {
          yPercent: 0, // 제자리로 안착
          opacity: 1, // 완전 노출
          ease: 'power2.out', // 감속 곡선으로 자연스럽게 멈추는 느낌
          stagger: 0.5, // 내부 키프레임 간 간격으로 움직임에 여유 부여
          delay: delays[idx], // 요소별 시작 타이밍을 분리해 순차 강조
          scrollTrigger: {
            trigger: section,
            start: SECTION_ENTER_START, // 섹션 입장 시작 지점
            end: SECTION_ENTER_END, // 섹션 입장 완료 지점(구간 짧게 조정)
            scrub: true, // 스크롤에 맞춘 정밀 제어로 섹션 몰입감 유지
            onEnter: () => {
              if (el.classList.contains('psm-home-sec-desc')) {
                el.classList.add('activated')
              }
            },
            onLeaveBack: () => {
              if (el.classList.contains('psm-home-sec-desc')) {
                el.classList.remove('activated')
              }
            },
            invalidateOnRefresh: true,
          },
          immediateRender: false, // 초기 렌더에서 from 상태 선적용으로 레이아웃이 깨지는 현상 방지
        },
      )

      if (!isLastSection) {
        gsap.fromTo(
          el,
          {
            yPercent: 0, // 현재 위치에서 바로 퇴장 시작
            opacity: 1, // 완전 노출 상태에서 시작
          },
          {
            yPercent: yPercentLeave[idx], // 입장 반대 방향으로 이동시켜 장면 전환
            opacity: 0, // 퇴장 완료 시 투명 처리
            ease: 'power2.in', // 가속 곡선으로 다음 섹션으로 밀어내는 인상 강화
            stagger: 0.5, // 입장과 동일한 템포로 일관성 유지
            delay: 0, // 퇴장은 즉시 반응하도록 지연 없음
            scrollTrigger: {
              trigger: section,
              start: SECTION_EXIT_START, // 섹션 퇴장 시작 지점
              end: SECTION_EXIT_END, // 섹션 퇴장 완료 지점(구간 짧게 조정)
              scrub: true, // 스크롤 역방향 시 입장 상태로 정확히 복원
              onLeave: () => {
                if (el.classList.contains('psm-home-sec-desc')) {
                  el.classList.remove('activated')
                }
              },
              onEnterBack: () => {
                if (el.classList.contains('psm-home-sec-desc')) {
                  el.classList.add('activated')
                }
              },
              invalidateOnRefresh: true,
            },
            immediateRender: false, // 첫 스크롤 전 fromTo 충돌 방지
          },
        )
      }
    })

    ScrollTrigger.create({
      trigger: section,
      start: SECTION_PIN_START, // 섹션 고정 시작 지점
      end: isLastSection ? 'center top' : SECTION_PIN_END,
      pin: area, // fixed-area를 뷰포트에 고정해 서사 집중
      pinSpacing: false, // 추가 공백 없이 다음 섹션이 바로 이어지도록 설정
      invalidateOnRefresh: true,
      anticipatePin: 1,
      snap: isLastSection
        ? false
        : {
            snapTo: SECTION_SNAP_POINTS, // 입장/고정/퇴장의 기준 지점에 약한 스냅
            duration: { min: 0.34, max: 0.56 },
            delay: 0,
            ease: 'power3.out',
            directional: true,
            inertia: false,
          },
    })
  })
}

// 고정된 사선 레이어에서 경로를 우상단 -> 좌하단 방향으로 그려서 등장시킨다.
const createDiagonalRevealAnimation = () => {
  const diagonalWrapEl = diagonalWrapRef.value
  const pathEl = diagonalMaskPathRef.value
  const triggerEl = definedOriginSectionRef.value
  if (!diagonalWrapEl || !pathEl || !triggerEl) return

  const pathLength = pathEl.getTotalLength()
  gsap.set(diagonalWrapEl, { width: '100vw' }) // 사선 레이어는 항상 고정된 전체 폭 유지
  gsap.set(pathEl, {
    strokeDasharray: `${pathLength} ${pathLength}`, // 전체 길이 기준 대시를 맞춰 선 드로잉 가능 상태로 설정
    strokeDashoffset: pathLength, // 시작 시 선 전체를 숨기고
  })

  gsap.to(pathEl, {
    strokeDashoffset: 0, // 진행에 따라 우상단 -> 좌하단 방향으로 선을 그려 노출
    ease: 'none', // 스크롤 매핑을 선형으로 유지
    scrollTrigger: {
      trigger: triggerEl,
      start: 'top bottom', // Defined at the Origin 섹션이 진입할 때 등장 시작
      end: 'top top', // 섹션 top이 뷰포트 top에 닿으면 드로잉 완료
      scrub: true, // 스크롤 위치와 드로잉 진행도를 동기화
      invalidateOnRefresh: true,
    },
  })
}
// 섹션별 사선 오브젝트를 리더 이동/순차 등장/역순 퇴장 정책으로 제어한다.
const createDiagonalObjectAnimation = () => {
  const pathEl = diagonalPathRef.value
  if (!pathEl) return

  diagonalObjectSections.forEach((sectionDef) => {
    const triggerEl = diagonalSectionRefMap[sectionDef.key]?.value
    const sectionRefs = diagonalObjectRefMap.get(sectionDef.key) ?? []
    if (!triggerEl || !sectionRefs.length) return
    const objects = sectionDef.items.map((_, idx) => sectionRefs[idx]).filter((el) => Boolean(el))
    if (objects.length !== sectionDef.items.length) return

    const leader = objects[0] // 첫 오브젝트만 실제로 패스를 따라 먼저 이동하는 리더
    const containerBasedPositions = getContainerBasedPathPositions()
    const targetSlots = objects.map((_, idx) => getObjectTargetSlot(sectionDef, idx))
    const targetPositions = objects.map((_, idx) => {
      const slot = targetSlots[idx]
      if (slot < containerBasedPositions.length) return containerBasedPositions[slot]
      return containerBasedPositions[containerBasedPositions.length - 1]
    })
    const revealAtByIndex = objects.map(() => 0)
    for (let i = 1; i < objects.length; i += 1) {
      const revealTarget = Math.min(
        targetPositions[i] + REVEAL_AFTER_PASS_OFFSET,
        targetPositions[0],
      )
      revealAtByIndex[i] = getLeaderRevealTime(
        revealTarget,
        DIAGONAL_ENTRY_START,
        targetPositions[0],
      )
    }
    const alignOrigins = objects.map((_, idx) => getObjectAlignOrigin(sectionDef, idx))
    const leaderTarget = targetPositions[0]

    objects.forEach((el, idx) => {
      gsap.set(el, {
        opacity: 0, // 초기에는 전부 숨김
        motionPath: {
          path: pathEl, // 이동 기준이 되는 사선 path
          align: pathEl, // 오브젝트 회전축을 path 접선 방향에 정렬
          alignOrigin: alignOrigins[idx], // 오브젝트별 바닥 기준점을 커스텀 적용
          autoRotate: false, // 원본 SVG 각도를 유지해 비정상 회전 방지
          start: targetPositions[idx], // 목표 위치에 미리 배치
          end: targetPositions[idx], // start=end으로 고정 배치 상태 유지
        },
      })
    })

    gsap.set(leader, {
      opacity: 0, // 초기에는 숨기고 섹션 진입 구간에서만 노출
      motionPath: {
        path: pathEl,
        align: pathEl,
        alignOrigin: alignOrigins[0],
        autoRotate: false,
        start: DIAGONAL_ENTRY_START, // 화면 우상단 바깥쪽 시작점
        end: DIAGONAL_ENTRY_START, // 초기에는 이동 없이 대기
      },
    })

    const exitBase = 0.75 // 타임라인 후반부부터 퇴장 시작
    const exitStep = 0.06 // 오브젝트 간 퇴장 간격
    const nonLeaderIndices = objects
      .map((_, idx) => idx)
      .filter((idx) => idx > 0)
      // 퇴장 순서는 배열 인덱스가 아니라 targetSlot(배치 순번) 기준으로 정한다.
      .sort((a, b) => targetSlots[b] - targetSlots[a] || b - a)
    const uniqueExitSlots = [...new Set(nonLeaderIndices.map((idx) => targetSlots[idx]))].sort(
      (a, b) => b - a,
    )
    const exitStartBySlot = new Map(
      uniqueExitSlots.map((slot, order) => [slot, exitBase + order * exitStep]),
    )
    const leaderExitStart = exitBase + uniqueExitSlots.length * exitStep // 리더는 마지막 순서로 퇴장 시작
    const leaderExitEnd = Math.min(leaderTarget + DIAGONAL_EXIT_TRAVEL_DELTA, 1.2)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl, // 해당 섹션 진입/이탈 구간에 타임라인 연결
        start: 'top+=25% bottom', // 섹션 상단이 화면 하단에 닿을 때 시작
        end: 'bottom top', // 섹션 하단이 화면 상단을 지날 때 종료
        scrub: true, // 스크롤 진행도와 애니메이션 진행도를 동기화
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const { progress, isActive } = self

          // 비활성 구간에서는 리더를 항상 우상단 대기점에서 숨긴다.
          if (!isActive || progress <= 0) {
            gsap.set(leader, {
              opacity: 0,
              motionPath: {
                path: pathEl,
                align: pathEl,
                alignOrigin: alignOrigins[0],
                autoRotate: false,
                start: DIAGONAL_ENTRY_START,
                end: DIAGONAL_ENTRY_START,
              },
            })
            objects.slice(1).forEach((el, idx) => {
              const sourceIdx = idx + 1
              const pos = targetPositions[sourceIdx]
              gsap.set(el, {
                opacity: 0,
                motionPath: {
                  path: pathEl,
                  align: pathEl,
                  alignOrigin: alignOrigins[sourceIdx],
                  autoRotate: false,
                  start: pos,
                  end: pos,
                },
              })
            })
            sectionDef.items.forEach((item, idx) => {
              if (item.type === 'lottie') {
                setDiagonalLottieActive(sectionDef.key, idx, false)
              }
            })
            return
          }

          // 리더는 progress 기반으로 직접 위치를 계산해 중간 스냅/점프를 방지한다.
          let leaderPos = leaderTarget
          let leaderOpacity = 0
          if (progress <= LEADER_ENTER_DURATION) {
            const t = LEADER_ENTER_DURATION ? progress / LEADER_ENTER_DURATION : 1
            const clampedT = Math.min(Math.max(t, 0), 1)
            leaderPos = lerp(DIAGONAL_ENTRY_START, leaderTarget, clampedT)
            leaderOpacity = clampedT // 진입 구간은 0 -> 1 페이드인
          } else if (progress >= leaderExitStart) {
            const denom = 1 - leaderExitStart
            const t = denom > 0 ? (progress - leaderExitStart) / denom : 1
            const clampedT = Math.min(Math.max(t, 0), 1)
            leaderPos = lerp(leaderTarget, leaderExitEnd, clampedT)
            leaderOpacity = 1 - clampedT
          } else {
            leaderOpacity = 1 // 정지 구간에서는 계속 노출
          }
          gsap.set(leader, {
            opacity: leaderOpacity,
            motionPath: {
              path: pathEl,
              align: pathEl,
              alignOrigin: alignOrigins[0],
              autoRotate: false,
              start: clampPathProgress(leaderPos),
              end: clampPathProgress(leaderPos),
            },
          })

          sectionDef.items.forEach((item, idx) => {
            if (item.type !== 'lottie') return
            const revealAt = revealAtByIndex[idx] ?? 0
            const playAt = item.startPlayPoint === 'end' ? revealAt + 0.16 : revealAt
            const shouldPlayLottie = progress >= playAt && progress < 1
            setDiagonalLottieActive(sectionDef.key, idx, shouldPlayLottie, {
              startFrame: 0,
            })
          })
        },
        onLeave: () => {
          sectionDef.items.forEach((item, idx) => {
            if (item.type === 'lottie') {
              setDiagonalLottieActive(sectionDef.key, idx, false, {
                stopFrame:
                  sectionDef.key === 'lifecycle' ? LIFECYCLE_DIAGONAL_LOOP_START_FRAME : undefined,
              })
            }
          })
        },
        onLeaveBack: () => {
          sectionDef.items.forEach((item, idx) => {
            if (item.type === 'lottie') {
              setDiagonalLottieActive(sectionDef.key, idx, false)
            }
          })
        },
      },
    })

    const revealQueue = objects.slice(1).reverse() // 비리더 오브젝트는 끝에서 앞으로(5->4->3->2) 등장
    revealQueue.forEach((el, idx) => {
      const sourceIdx = objects.length - 1 - idx // 원본 인덱스(5->4->3->2)를 유지
      const revealTarget = Math.min(
        targetPositions[sourceIdx] + REVEAL_AFTER_PASS_OFFSET,
        leaderTarget,
      )
      const revealAt = getLeaderRevealTime(revealTarget, DIAGONAL_ENTRY_START, leaderTarget) // 리더가 해당 타겟을 지나는 시점에 노출
      tl.to(
        el,
        {
          motionPath: {
            path: pathEl,
            align: pathEl,
            alignOrigin: alignOrigins[sourceIdx],
            autoRotate: false,
            start: targetPositions[sourceIdx], // reveal 시점에도 목표 path 위치를 재보정
            end: targetPositions[sourceIdx],
          },
          opacity: 1, // 해당 위치 도달 시 자연스럽게 등장
          ease: 'power1.out', // 초반 빠르게 올라오고 끝에서 부드럽게 멈춤
          duration: 0.16, // 페이드인 시간을 늘려 부드럽게 등장
        },
        revealAt,
      )
    })

    // 리더 제외 오브젝트는 targetSlot 역순으로 퇴장한다.
    nonLeaderIndices.forEach((sourceIdx) => {
      const el = objects[sourceIdx]
      const exitStart = targetPositions[sourceIdx] // 각 오브젝트의 현재 기준 위치
      const exitEnd = Math.min(exitStart + DIAGONAL_EXIT_TRAVEL_DELTA, 1.2) // 퇴장 이동거리는 시작점 기준 약 10%만 이동
      const tweenStartAt = exitStartBySlot.get(targetSlots[sourceIdx]) ?? exitBase
      tl.to(
        el,
        {
          motionPath: {
            path: pathEl,
            align: pathEl,
            alignOrigin: alignOrigins[sourceIdx],
            autoRotate: false,
            start: exitStart, // 각 오브젝트의 기준 위치에서 퇴장 시작
            end: exitEnd, // 짧게 이동하며 퇴장
          },
          opacity: 0, // 이동과 동시에 페이드아웃
          ease: 'power1.in', // 처음 부드럽고 끝으로 갈수록 가속해 퇴장감 강조
          duration: 0.1, // 개별 퇴장 길이
          immediateRender: false, // 퇴장 시작 전 값 선반영으로 인한 점프 방지
        },
        tweenStartAt,
      )
    })
  })
}

// 페이지 진입 시 애니메이션과 전역 이벤트를 초기화한다.
onMounted(async () => {
  if (!import.meta.client) return
  await rebuildScrollAnimations()
  ScrollTrigger.refresh()
  document.fonts?.ready?.then?.(() => ScrollTrigger.refresh())

  mainStore.setPortalAppbarTheme('dark')
  document.body.style.backgroundColor = '#11113A'
  window.addEventListener('resize', updateWindowSize)
  window.addEventListener('scroll', onScroll)
})

// 페이지 이탈 시 GSAP context와 전역 이벤트를 정리한다.
onBeforeUnmount(() => {
  if (resizeRafId) {
    cancelAnimationFrame(resizeRafId)
    resizeRafId = null
  }
  diagonalLottieStateMap.forEach((_, key) => {
    const [sectionKey, index] = key.split(':')
    setDiagonalLottieActive(sectionKey, Number(index), false)
  })
  if (gsapContext) {
    gsapContext.revert()
  }
  mainStore.setPortalAppbarTheme('light')
  document.body.style.backgroundColor = ''
  window.removeEventListener('resize', updateWindowSize)
  window.removeEventListener('scroll', onScroll)
})
</script>
