<template>
  <div
    class="psm-home-container"
    :class="{ 'is-font-pending': isFontPending }"
    :style="
      isFontPending
        ? {
            opacity: '0',
            pointerEvents: 'none',
            overflow: 'hidden',
          }
        : undefined
    "
  >
    <!-- 1. 인트로/히어로 (A) -->
    <section :ref="(el) => setSectionRef('hero', el)" class="psm-home-sec psm-home-sec--hero">
      <ul class="hero-title">
        <template v-if="isMobileViewport && !isMobileLandscape">
          <li class="text-item">
            <div class="text-move--wrap">
              <div class="text-move text-1">
                <h1>Purely</h1>
              </div>
            </div>
            <div class="text-move--wrap">
              <div class="text-move text-1">
                <h1>Digital</h1>
              </div>
            </div>
          </li>
          <li class="text-item">
            <div class="text-move--wrap">
              <div class="text-move text-2">
                <h1>Fully</h1>
              </div>
            </div>
            <div class="text-move--wrap">
              <div class="text-move text-2">
                <h1>Connected</h1>
              </div>
            </div>
          </li>
        </template>
        <template v-else>
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
        </template>
      </ul>
      <div ref="heroFloatingRef" class="psm-home-floating">
        <VIcon icon="ebli:arrow-down-line" :size="32" />
      </div>
    </section>

    <!-- 2. B2: 세로선 등장/사라짐 -->
    <section :ref="(el) => setSectionRef('purely', el)" class="psm-home-sec psm-home-sec--sec2">
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
          <h2 class="title">{{ homeI18n.purely.title }}</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual01" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <ul class="desc-list">
            <li
              v-for="(line, idx) in homeI18n.purely.desc"
              :key="`purely-desc-${idx}`"
              class="desc"
              :class="{ 'has-ship': line.hasShip }"
            >
              <template v-if="line.hasShip">
                <div class="line-ship--wrap">
                  <div class="line-ship__text">{{ line.text }}</div>
                  <div class="line-ship__line">
                    <div class="line-ship__icon">
                      <VIcon icon="ebli:ship" class="line-ship__icon" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                {{ line.text }}
                <span v-if="idx === homeI18n.defined.desc.length - 1" class="accent-dot">.</span>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 3. 사선(30도) 등장 애니메이션 (SVG) -->
    <div
      ref="diagonalWrapRef"
      class="psm-home-bg-diagonal"
      :class="{ 'is-absolute': isLastSectionAbsolute }"
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
          <clipPath id="diagonal-display-clip" clipPathUnits="userSpaceOnUse">
            <rect
              ref="diagonalDisplayClipRectRef"
              x="0"
              y="0"
              :width="windowWidth"
              :height="windowHeight"
            />
          </clipPath>
        </defs>
        <path
          ref="diagonalPathRef"
          class="psm-home-bg-diagonal__path"
          :d="diagonalPath"
          stroke="#1fa345"
          stroke-width="2"
          stroke-dasharray="1 10"
          fill="none"
          clip-path="url(#diagonal-display-clip)"
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
              :style="getDiagonalObjectStyle(item, idx === 0)"
            />
            <div
              v-else
              :ref="(el) => setDiagonalObjectRef(section.key, idx, el)"
              class="diagonal-obj diagonal-obj--lottie"
              :class="{ 'is-leader': idx === 0 }"
              :style="getDiagonalObjectStyle(item, idx === 0)"
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
    <section :ref="(el) => setSectionRef('defined', el)" class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">{{ homeI18n.defined.title }}</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual02" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 v-if="homeI18n.defined.subtitle" class="subtitle">
            {{ homeI18n.defined.subtitle }}
          </h3>
          <ul class="desc-list">
            <li
              v-for="(line, idx) in homeI18n.defined.desc"
              :key="`defined-desc-${idx}`"
              class="desc"
              :class="{ 'has-ship': line.hasShip }"
            >
              <template v-if="line.hasShip">
                <div class="line-ship--wrap">
                  <div class="line-ship__text">{{ line.text }}</div>
                  <div class="line-ship__line">
                    <div class="line-ship__icon">
                      <VIcon icon="ebli:ship" class="line-ship__icon" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                {{ line.text }}
                <span v-if="idx === homeI18n.defined.desc.length - 1" class="accent-dot">.</span>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 5. Seamless Orbit (B1) -->
    <section :ref="(el) => setSectionRef('seamless', el)" class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">{{ homeI18n.seamless.title }}</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual03" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 v-if="homeI18n.seamless.subtitle" class="subtitle">
            {{ homeI18n.seamless.subtitle }}
          </h3>
          <ul class="desc-list">
            <li
              v-for="(line, idx) in homeI18n.seamless.desc"
              :key="`seamless-desc-${idx}`"
              class="desc"
              :class="{ 'has-ship': line.hasShip }"
            >
              <template v-if="line.hasShip">
                <div class="line-ship--wrap">
                  <div class="line-ship__text">{{ line.text }}</div>
                  <div class="line-ship__line">
                    <div class="line-ship__icon">
                      <VIcon icon="ebli:ship" class="line-ship__icon" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                {{ line.text }}
                <span v-if="idx === homeI18n.seamless.desc.length - 1" class="accent-dot">.</span>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 6. Lifecycle (B3) -->
    <section :ref="(el) => setSectionRef('lifecycle', el)" class="psm-home-sec psm-home-sec--b3">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title white">Lifecycle</h2>
        </div>
      </div>
    </section>

    <!-- 7. Screen to Hand (B1) -->
    <section :ref="(el) => setSectionRef('screen', el)" class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">{{ homeI18n.screen.title }}</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual04" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 v-if="homeI18n.screen.subtitle" class="subtitle">
            {{ homeI18n.screen.subtitle }}
          </h3>
          <ul class="desc-list">
            <li
              v-for="(line, idx) in homeI18n.screen.desc"
              :key="`screen-desc-${idx}`"
              class="desc"
              :class="{ 'has-ship': line.hasShip }"
            >
              <template v-if="line.hasShip">
                <div class="line-ship--wrap">
                  <div class="line-ship__text">{{ line.text }}</div>
                  <div class="line-ship__line">
                    <div class="line-ship__icon">
                      <VIcon icon="ebli:ship" class="line-ship__icon" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                {{ line.text }}
                <span v-if="idx === homeI18n.screen.desc.length - 1" class="accent-dot">.</span>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 8. Absolute Fulfillment (B1) -->
    <section :ref="(el) => setSectionRef('absolute', el)" class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">{{ homeI18n.absolute.title }}</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual05" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 v-if="homeI18n.absolute.subtitle" class="subtitle">
            {{ homeI18n.absolute.subtitle }}
          </h3>
          <ul class="desc-list">
            <li
              v-for="(line, idx) in homeI18n.absolute.desc"
              :key="`absolute-desc-${idx}`"
              class="desc"
              :class="{ 'has-ship': line.hasShip }"
            >
              <template v-if="line.hasShip">
                <div class="line-ship--wrap">
                  <div class="line-ship__text">{{ line.text }}</div>
                  <div class="line-ship__line">
                    <div class="line-ship__icon">
                      <VIcon icon="ebli:ship" class="line-ship__icon" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                {{ line.text }}
                <span v-if="idx === homeI18n.absolute.desc.length - 1" class="accent-dot">.</span>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 9. 사선 퇴장 (고정 해제) -->

    <!-- 10. 하단 섹션 프로그래스 내비게이션 -->
    <nav
      ref="sectionProgressRef"
      class="psm-home-progress"
      :class="{
        'is-visible': isSectionProgressVisible,
        'is-absolute': isLastSectionAbsolute,
      }"
      aria-label="Section Indicator"
    >
      <ol class="psm-home-progress__list">
        <li
          v-for="sectionKey in SECTION_KEYS"
          :key="`progress-${sectionKey}`"
          class="psm-home-progress__item"
          :class="[sectionKey]"
        >
          <button
            type="button"
            class="psm-home-progress__button"
            :aria-label="`Go to ${sectionKey} section`"
            @click="scrollToSection(sectionKey)"
          >
            <span class="psm-home-progress__track" aria-hidden="true">
              <span class="psm-home-progress__fill" :style="getSectionProgressStyle(sectionKey)" />
              <img
                v-if="visibleSectionProgressIcon?.key === sectionKey"
                :src="progressBoxIcon"
                alt=""
                class="psm-home-progress__icon"
                :style="getSectionProgressIconStyle()"
              />
            </span>
          </button>
        </li>
      </ol>
    </nav>

    <!-- 11. 마지막 섹션/푸터 전환을 위한 하단 여유 공간 -->
    <div :style="bottomSpacerStyle">&ZeroWidthSpace;</div>
    <!-- 12. 개발 중 진행률 축을 확인하는 최소 디버그 패널 -->
    <aside
      v-if="!isMobileViewport && isDebugMode"
      class="psm-home-section-debug"
      aria-live="polite"
      style="
        position: fixed;
        top: 72px;
        right: 16px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px 12px;
        border: 1px solid rgba(127, 255, 175, 0.35);
        border-radius: 8px;
        background: rgba(8, 10, 40, 0.82);
        backdrop-filter: blur(2px);
        font: 12px/1.35 monospace;
        color: #dfffea;
        pointer-events: none;
      "
    >
      <div
        v-for="sectionKey in SECTION_KEYS"
        :key="`debug-${sectionKey}`"
        class="psm-home-section-debug__item"
        style="display: flex; align-items: center; gap: 8px; white-space: nowrap"
      >
        <strong class="psm-home-section-debug__name" style="min-width: 66px; color: #7fffaf">{{
          sectionKey
        }}</strong>
        <span class="psm-home-section-debug__state" style="opacity: 0.9">
          progress: {{ getSectionTimelineProgressPercent(sectionKey) }}%
        </span>
        <span class="psm-home-section-debug__state" style="opacity: 0.9">
          diagonal: {{ getSectionDiagonalProgressPercent(sectionKey) }}%
        </span>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDisplay } from 'vuetify'
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
import progressBoxIcon from '@/assets/images/portal/main_icon_box.svg?url'

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, ScrollToPlugin)
definePageMeta({ layout: 'portal' })

const mainStore = useMainStore()
const { tm, rt } = useLocale()
const { smAndDown } = useDisplay()
// 현재 뷰포트 크기를 기준으로 경로와 레이아웃 계산을 갱신한다.
const windowWidth = ref(import.meta.client ? window.innerWidth : 0)
const windowHeight = ref(import.meta.client ? window.innerHeight : 0)
// 개발 중 애니메이션 상태를 확인하기 위한 디버그 패널 토글이다.
const isDebugMode = ref(false)
// 섹션 키와 실제 DOM 엘리먼트 참조를 매핑한다.
const sectionRefMap = ref(new Map())
// 섹션별 pin ScrollTrigger 인스턴스를 저장한다.
const sectionPinTriggerMap = ref({})
// 히어로 플로팅 가이드와 하단 프로그래스 레퍼런스다.
const heroFloatingRef = ref(null)
const sectionProgressRef = ref(null)
// purely 섹션 전용 세로 라인 영역과 라인 목록 참조다.
const verticalLineSectionRef = ref(null)
const verticalLines = ref([])
// 사선 레이어와 SVG path 제어용 참조다.
const diagonalWrapRef = ref(null)
const diagonalPathRef = ref(null)
const diagonalDisplayClipRectRef = ref(null)
// 마지막 섹션에서 사선 레이어/프로그래스 바를 absolute로 전환할지 여부를 함께 제어한다.
const isLastSectionAbsolute = ref(false)
// 섹션별 사선 오브젝트 및 로띠 플레이어 상태를 관리한다.
const diagonalObjectRefMap = new Map()
const diagonalLottiePlayerMap = new Map()
const diagonalLottieStateMap = new Map()
const diagonalLottiePlayLatchMap = new Map()
let gsapContext = null
let isHeroFloatingVisible = null
let previousScrollRestoration = null
// 하단 프로그래스 바의 표시 상태를 제어한다.
const isSectionProgressVisible = ref(false)
const sectionProgressRangeByKey = ref({})
const isFontPending = ref(true)
let lastKnownScrollTop = 0
let lastScrollDirection = 1
let sectionCenterSnapHandler = null
let isSectionCenterSnapping = false
let sectionCenterSnapDelayCall = null

// 1440 컨테이너 기준 사선 슬롯의 기본 위치 비율이다.
const DIAGONAL_CONTAINER_TARGET_RATIOS = [0.12, 0.34, 0.48, 0.62, 0.76]
const DIAGONAL_ENTRY_START = 0 // open path에서는 음수 start가 랩되어 좌하단에 찍힐 수 있어 0으로 고정
const DIAGONAL_CONTAINER_WIDTH = 1440
const ALIGN_ORIGIN = [0.5, 0.82] // 사선 경로에 오브젝트를 붙이는 공통 기준점
// 데스크톱/모바일 리더 기준 크기와 비율을 정의한다.
const DESKTOP_LEADER_SIZE = 200
const MOBILE_LEADER_SIZE = 62
const MOBILE_DIAGONAL_SCALE = MOBILE_LEADER_SIZE / DESKTOP_LEADER_SIZE
const DESKTOP_HIGH_DPI_DIAGONAL_SCALE = 0.8
const LEADER_ENTER_DURATION = 0.32 // 사선 오브젝트 등장 완료를 더 빠르게 앞당김
// 리더 통과 직후 슬롯 오브젝트 등장 계산에 사용하는 공통 오프셋이다.
const LEADER_REVEAL_START_OFFSET = 0.02
const LEADER_REVEAL_END_OFFSET = 0.03
// 사선 오브젝트 퇴장 타이밍과 이동 거리 관련 기준값이다.
const DIAGONAL_EXIT_BASE = 0.72 // 사선 오브젝트 퇴장을 섹션 후반부부터 시작
const DIAGONAL_EXIT_STAGGER_END = 0.94 // 순차 퇴장 시작 시점을 이 구간 안에 균등 분배
const DIAGONAL_EXIT_TRAVEL_DELTA = 0.12 // 퇴장 시 path 밖으로 더 멀리 이동시켜 급하게 사라지는 느낌을 줄임
const DIAGONAL_EXIT_PATH_MAX = 1.35 // 퇴장 끝점을 path 바깥까지 허용해 리더가 더 멀리 빠지게 한다
const DIAGONAL_OBJECT_SCRUB = 0.45 // 사선 오브젝트가 스크롤을 즉시 추종하지 않도록 약한 보간을 건다
const DIAGONAL_LEADER_ENTER_EASE = gsap.parseEase('back.out(0.48)') // 리더 진입은 아주 약한 오버슈트만 남겨 관성은 살리고 되튐은 줄인다.
const LIFECYCLE_DIAGONAL_LOOP_START_FRAME = 150
// 섹션 컨텐츠/라인/사선 타임라인의 공통 ScrollTrigger 구간이다.
const SECTION_PIN_START = 'top top'
const SECTION_PIN_END = '+=100%'
const SECTION_CONTENT_ENTER_END_PROGRESS = 0.35 // 고정 섹션 초반 35% 구간에서 컨텐츠 입장을 완료한다.
const LAST_SECTION_CONTENT_ENTER_END_PROGRESS = 0.28 // 마지막 섹션은 퇴장이 없으므로 컨텐츠 안착 시점을 더 앞당긴다.
const SECTION_CONTENT_EXIT_START_PROGRESS = 0.7 // 고정 섹션 후반 30% 구간을 컨텐츠 퇴장에 사용한다.
const VERTICAL_LINE_START = 'top-=50% top'
const VERTICAL_LINE_END = 'bottom+=25% top'
const DIAGONAL_TIMELINE_START = 'top-=25% top'
const DIAGONAL_TIMELINE_END = 'bottom+=25% bottom'
const HERO_UI_TOGGLE_SCROLL_PX = 100 // 100px 스크롤을 기준으로 floating/progress 표시 전환
const HERO_TEXT_FORCE_3D = false // hero 텍스트는 force3D on/off를 빠르게 비교할 수 있게 별도 토글로 둔다.
const SECTION_NAV_TARGET_PROGRESS = 0.5 // 일반 섹션은 컨텐츠/사선이 모두 나온 시점으로 이동한다.
const SECTION_CENTER_SNAP_CONFIG = {
  delay: 0.08, // scrollEnd / idle fallback 모두 같은 템포로 중앙 스냅을 예약한다.
  duration: 1.8, // 섹션 중앙 정렬은 약간 느린 속도로 통일한다.
  thresholdRatio: {
    hero: 0.32,
    default: 0.05,
  },
}
const LAST_SECTION_BOTTOM_SPACER_VH = 25 // 마지막 섹션 클릭 이동과 footer 전환을 위해 하단 여유 공간을 확보한다.
const LAST_SECTION_DIAGONAL_CLIP_OFFSET = 0.01 // 마지막 섹션에서는 리더보다 약간 앞에서 배경 사선을 잘라 꼬리 노출을 줄인다.
const SECTION_KEYS = ['hero', 'purely', 'defined', 'seamless', 'lifecycle', 'screen', 'absolute']
const LAST_SECTION_KEY = 'absolute'
// 모든 섹션 progress를 0으로 초기화한 객체를 생성한다.
const createInitialSectionProgress = () =>
  Object.fromEntries(SECTION_KEYS.map((sectionKey) => [sectionKey, 0]))
const sectionProgressByKey = ref(createInitialSectionProgress())
// 모든 사선 progress를 0으로 초기화한 객체를 생성한다.
const createInitialSectionDiagonalProgress = () =>
  Object.fromEntries(SECTION_KEYS.map((sectionKey) => [sectionKey, 0]))
const sectionDiagonalProgressByKey = ref(createInitialSectionDiagonalProgress())

let resizeRafId = null
let pageShowHandler = null

// 번역 데이터 누락 시에도 화면 구조를 유지하기 위한 기본값이다.
const EMPTY_HOME_SECTION = Object.freeze({ title: '', subtitle: '', desc: [] })
const resolveLocaleText = (value) => (value == null ? '' : rt(value))
// 섹션 번역 데이터를 화면 바인딩용 구조로 정규화한다.
const normalizeHomeSection = (section) => {
  if (!section) return EMPTY_HOME_SECTION
  return {
    title: resolveLocaleText(section.title),
    subtitle: resolveLocaleText(section.subtitle),
    desc: Array.isArray(section.desc)
      ? section.desc.map((line) => ({
          text: resolveLocaleText(line?.text),
          hasShip: line?.hasShip === true,
        }))
      : [],
  }
}
// 홈 화면에서 사용하는 섹션별 번역 데이터를 계산한다.
const homeI18n = computed(() => {
  const sections = tm('portal.home.sections') || {}
  return {
    purely: normalizeHomeSection(sections.purely),
    defined: normalizeHomeSection(sections.defined),
    seamless: normalizeHomeSection(sections.seamless),
    screen: normalizeHomeSection(sections.screen),
    absolute: normalizeHomeSection(sections.absolute),
  }
})

// 섹션별 사선 오브젝트 구성과 로띠 슬롯 정책을 정의한다.
const diagonalObjectSections = [
  {
    key: 'defined',
    items: [
      { src: diagonalPaper },
      { src: diagonalPdf },
      { src: diagonalPdf },
      { src: diagonalPdf },
      { src: diagonalPdf },
    ],
  },
  {
    key: 'seamless',
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
    key: 'screen',
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
    key: 'absolute',
    items: [{ src: diagonalComplete }, { src: diagonalShip, alignOrigin: [0.5, 0.72] }],
  },
]

const setSectionRef = (sectionKey, el) => {
  if (!el) {
    sectionRefMap.value.delete(sectionKey)
    return
  }
  sectionRefMap.value.set(sectionKey, el)
}
// 섹션 키로 등록된 DOM ref를 조회한다.
const getSectionRef = (sectionKey) => sectionRefMap.value.get(sectionKey) ?? null

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
const isMobileViewport = computed(() => smAndDown.value)
const devicePixelRatio = ref(import.meta.client ? window.devicePixelRatio || 1 : 1)
const isHighDpiDesktopViewport = computed(
  () => !isMobileViewport.value && devicePixelRatio.value >= 1.25,
)
const isMobileLandscape = computed(
  () => isMobileViewport.value && windowWidth.value > windowHeight.value,
)
const getMobileScaledSize = (value, fallbackSize) => {
  const numericValue = typeof value === 'number' ? value : fallbackSize
  return Math.round(numericValue * MOBILE_DIAGONAL_SCALE)
}
const getDiagonalObjectStyle = (item, isLeader = false) => {
  const style = {}
  if (isMobileViewport.value) {
    const fallbackWidth = isLeader ? DESKTOP_LEADER_SIZE : 100
    const fallbackHeight = isLeader ? DESKTOP_LEADER_SIZE : 100
    style.width = normalizeSizeValue(getMobileScaledSize(item?.width, fallbackWidth))
    style.height = normalizeSizeValue(getMobileScaledSize(item?.height, fallbackHeight))
    return style
  }
  if (isHighDpiDesktopViewport.value) {
    const fallbackWidth = isLeader ? DESKTOP_LEADER_SIZE : 100
    const fallbackHeight = isLeader ? DESKTOP_LEADER_SIZE : 100
    const baseWidth = typeof item?.width === 'number' ? item.width : fallbackWidth
    const baseHeight = typeof item?.height === 'number' ? item.height : fallbackHeight
    style.width = normalizeSizeValue(Math.round(baseWidth * DESKTOP_HIGH_DPI_DIAGONAL_SCALE))
    style.height = normalizeSizeValue(Math.round(baseHeight * DESKTOP_HIGH_DPI_DIAGONAL_SCALE))
    return style
  }
  if (item?.width) style.width = normalizeSizeValue(item.width)
  if (item?.height) style.height = normalizeSizeValue(item.height)
  return style
}
const getObjectTargetSlot = (sectionDef, index) => sectionDef.items[index]?.targetSlot ?? index
const getDiagonalLottieKey = (sectionKey, index) => `${sectionKey}:${index}`
// 로띠 플레이어가 늦게 마운트돼도 현재 활성 상태를 즉시 반영한다.
const setDiagonalLottiePlayerRef = (sectionKey, index, player) => {
  const key = getDiagonalLottieKey(sectionKey, index)
  if (!player) {
    diagonalLottiePlayerMap.delete(key)
    diagonalLottieStateMap.delete(key)
    diagonalLottiePlayLatchMap.delete(key)
    return
  }
  const prevPlayer = diagonalLottiePlayerMap.get(key)
  if (prevPlayer === player) return
  diagonalLottiePlayerMap.set(key, player)
  // 플레이어가 늦게 마운트된 경우에도 현재 활성 상태를 즉시 반영한다.
  if (diagonalLottieStateMap.get(key)) {
    player.goToAndPlay?.(0, true)
    return
  }
  player.goToAndStop?.(0, true)
}
// 사선 로띠를 섹션 progress에 맞춰 재생/정지 상태로 동기화한다.
const setDiagonalLottieActive = (sectionKey, index, isActive, options = {}) => {
  const key = getDiagonalLottieKey(sectionKey, index)
  const prev = diagonalLottieStateMap.get(key)
  diagonalLottieStateMap.set(key, isActive)
  const player = diagonalLottiePlayerMap.get(key)
  if (!player) return
  if (prev === isActive) return
  if (isActive) {
    player.goToAndPlay?.(options.startFrame ?? 0, true)
    return
  }
  const stopFrame = typeof options.stopFrame === 'number' ? options.stopFrame : 0
  player.stop?.()
  player.goToAndStop?.(stopFrame, true)
}
// lifecycle 로띠는 첫 재생 이후 후반 프레임부터 반복 재생한다.
const onDiagonalLottieComplete = (sectionKey, index) => {
  if (sectionKey !== 'lifecycle') return
  const key = getDiagonalLottieKey(sectionKey, index)
  if (!diagonalLottieStateMap.get(key)) return
  const player = diagonalLottiePlayerMap.get(key)
  if (!player) return
  player.goToAndPlay?.(LIFECYCLE_DIAGONAL_LOOP_START_FRAME, true)
}
const clampPathProgress = (value) => Math.min(Math.max(value, 0), 1)
// back/circ 같은 eased leader 진입에서도 "리더가 해당 슬롯을 처음 지나는 시점"을 역으로 찾는다.
const getLeaderEnterProgressByPositionRatio = (ratio) => {
  const targetRatio = clampPathProgress(ratio)
  if (targetRatio <= 0) return 0
  if (targetRatio >= 1) return 1

  const sampleCount = 120
  let prevT = 0
  let prevValue = DIAGONAL_LEADER_ENTER_EASE(0)

  for (let step = 1; step <= sampleCount; step += 1) {
    const currentT = step / sampleCount
    const currentValue = DIAGONAL_LEADER_ENTER_EASE(currentT)
    if (currentValue >= targetRatio) {
      const denom = currentValue - prevValue
      if (!denom) return currentT
      const localT = (targetRatio - prevValue) / denom
      return lerp(prevT, currentT, clampPathProgress(localT))
    }
    prevT = currentT
    prevValue = currentValue
  }

  return 1
}
// 리더가 슬롯을 통과하는 시점을 공통 reveal 타이밍으로 변환한다.
const getLeaderRevealTime = (targetPos, leaderStart, leaderEnd) => {
  const denom = leaderEnd - leaderStart
  if (!denom) return LEADER_REVEAL_START_OFFSET
  const progress = (targetPos - leaderStart) / denom
  const clampedProgress = Math.min(Math.max(progress, 0), 1)
  const easedEnterProgress = getLeaderEnterProgressByPositionRatio(clampedProgress)
  return (
    LEADER_REVEAL_START_OFFSET +
    easedEnterProgress * (LEADER_ENTER_DURATION - LEADER_REVEAL_END_OFFSET)
  )
}
const lerp = (from, to, t) => from + (to - from) * t
// 사선 path의 화면 기준 중심점/각도/길이를 공통 계산한다.
const getDiagonalPathMetrics = () => {
  const angle = (30 * Math.PI) / 180
  const cx = windowWidth.value / 2
  const cy = windowHeight.value / 2
  const length = Math.sqrt(windowWidth.value ** 2 + windowHeight.value ** 2)
  return { angle, cx, cy, length }
}

// 우상단(0) -> 좌하단(1) 기준 diagonal path의 좌표를 계산한다.
const getDiagonalPathPoint = (progress = 1) => {
  const { angle, cx, cy, length } = getDiagonalPathMetrics()
  const dx = (length / 2) * Math.cos(angle)
  const dy = (length / 2) * Math.sin(angle)
  const startX = cx + dx
  const startY = cy - dy
  const fullEndX = cx - dx
  const fullEndY = cy + dy
  const t = clampPathProgress(progress)
  return {
    startX,
    startY,
    endX: lerp(startX, fullEndX, t),
    endY: lerp(startY, fullEndY, t),
  }
}

const getLastSection = () => getSectionRef(LAST_SECTION_KEY)
// 하단 프로그래스 바용 섹션 진행률을 0~100 범위로 저장한다.
const setSectionProgress = (sectionKey, value) => {
  const clamped = Math.min(Math.max(value, 0), 100)
  sectionProgressByKey.value[sectionKey] = clamped
}
// 사선 오브젝트 타임라인의 실제 진행률을 0~100 범위로 저장한다.
const setSectionDiagonalProgress = (sectionKey, value) => {
  const clamped = Math.min(Math.max(value, 0), 100)
  sectionDiagonalProgressByKey.value[sectionKey] = clamped
}
const getSectionProgressStyle = (sectionKey) => ({
  width: `${getSectionDisplayProgress(sectionKey)}%`,
})
// 하단 프로그래스 바는 사선 섹션이면 diagonal, 아니면 섹션 progress를 사용한다.
const getSectionDisplayProgress = (sectionKey) =>
  DIAGONAL_SECTION_KEYS.has(sectionKey)
    ? (sectionDiagonalProgressByKey.value[sectionKey] ?? 0)
    : (sectionProgressByKey.value[sectionKey] ?? 0)
// 진행 중인 마지막 섹션 하나만 상자 아이콘을 노출한다.
const visibleSectionProgressIcon = computed(() => {
  const visibleSections = SECTION_KEYS.map((sectionKey) => ({
    key: sectionKey,
    progress: getSectionDisplayProgress(sectionKey),
  })).filter((section) => section.progress > 0)
  return visibleSections.at(-1) ?? null
})
const getSectionProgressIconStyle = () => ({
  left: `${Math.min(Math.max(visibleSectionProgressIcon.value?.progress ?? 0, 2), 98)}%`,
})
const getSectionTimelineProgressPercent = (sectionKey) =>
  Math.round(sectionProgressByKey.value[sectionKey] ?? 0)
const getSectionDiagonalProgressPercent = (sectionKey) =>
  Math.round(sectionDiagonalProgressByKey.value[sectionKey] ?? 0)
const DIAGONAL_SECTION_KEYS = new Set(diagonalObjectSections.map((section) => section.key))
const getSectionCenterScrollY = (sectionKey) => {
  if (sectionKey === 'hero') return 0
  const pinTrigger = sectionPinTriggerMap.value[sectionKey]
  if (
    pinTrigger &&
    typeof pinTrigger.start === 'number' &&
    typeof pinTrigger.end === 'number' &&
    pinTrigger.end > pinTrigger.start
  ) {
    return pinTrigger.start + (pinTrigger.end - pinTrigger.start) * SECTION_NAV_TARGET_PROGRESS
  }
  return null
}
const getOrderedSectionCenters = () =>
  SECTION_KEYS.map((sectionKey) => ({
    key: sectionKey,
    y: getSectionCenterScrollY(sectionKey),
  })).filter((section) => typeof section.y === 'number' && Number.isFinite(section.y))

const getSectionCenterSnapThresholdPx = (sectionKey) =>
  windowHeight.value *
  (sectionKey === 'hero'
    ? SECTION_CENTER_SNAP_CONFIG.thresholdRatio.hero
    : SECTION_CENTER_SNAP_CONFIG.thresholdRatio.default)

const resolveSectionCenterSnapTargetY = (scrollTop) => {
  const centers = getOrderedSectionCenters()
  if (!centers.length) return null

  const nearestIndex = centers.reduce(
    (bestIndex, section, index, arr) =>
      Math.abs(section.y - scrollTop) < Math.abs(arr[bestIndex].y - scrollTop) ? index : bestIndex,
    0,
  )

  const currentCenterY = centers[nearestIndex].y
  const currentSectionKey = centers[nearestIndex].key
  const isLastCenter = nearestIndex === centers.length - 1
  let targetY = currentCenterY
  const deltaFromCenter = scrollTop - currentCenterY
  const thresholdPx = getSectionCenterSnapThresholdPx(currentSectionKey)

  // hero는 아래로 이탈할 때 자연스럽게 빠져나가게 두고, 위로 복귀할 때만 0 스냅을 허용한다.
  if (currentSectionKey === 'hero' && lastScrollDirection > 0) {
    return null
  }

  // 마지막 섹션 중앙을 지난 뒤 아래로 더 내리는 건 사용자의 계속 진행 의도로 보고 스냅하지 않는다.
  if (isLastCenter && lastScrollDirection > 0 && deltaFromCenter > thresholdPx) {
    return null
  }

  if (lastScrollDirection > 0 && deltaFromCenter > thresholdPx && centers[nearestIndex + 1]) {
    targetY = centers[nearestIndex + 1].y
  } else if (
    lastScrollDirection < 0 &&
    deltaFromCenter < -thresholdPx &&
    centers[nearestIndex - 1]
  ) {
    targetY = centers[nearestIndex - 1].y
  }

  return targetY
}

const scrollWindowToY = (targetY, duration) => {
  if (targetY == null) return

  const currentY = window.scrollY || window.pageYOffset || 0
  if (Math.abs(targetY - currentY) < 8) return
  // 모바일에서는 브라우저 기본 스크롤 애니메이션을 사용한다. (gsap의 스크롤 트윈이 간헐적으로 버벅이는 이슈가 있어 임시 조치)
  if (isMobileViewport.value) {
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    })
    return
  }

  isSectionCenterSnapping = true
  gsap.killTweensOf(window)
  gsap.to(window, {
    duration,
    ease: 'power2.out',
    // 사용자가 스냅 이동 중 다시 휠/트랙패드를 입력하면 현재 tween을 중단한다.
    scrollTo: { y: targetY, autoKill: true },
    overwrite: true,
    onComplete: () => {
      isSectionCenterSnapping = false
    },
    onInterrupt: () => {
      isSectionCenterSnapping = false
    },
  })
}

const queueSectionCenterSnap = (delay = SECTION_CENTER_SNAP_CONFIG.delay) => {
  if (isMobileViewport.value || isSectionCenterSnapping) return

  if (sectionCenterSnapDelayCall) {
    sectionCenterSnapDelayCall.kill()
    sectionCenterSnapDelayCall = null
  }

  sectionCenterSnapDelayCall = gsap.delayedCall(delay, () => {
    const targetY = resolveSectionCenterSnapTargetY(window.scrollY || window.pageYOffset || 0)
    scrollWindowToY(targetY, SECTION_CENTER_SNAP_CONFIG.duration)
  })
}

// 인디케이터 클릭 시 섹션의 컨텐츠 등장 완료 지점으로 스크롤 이동한다.
const scrollToSection = (sectionKey) => {
  if (!import.meta.client) return
  if (sectionKey === 'hero') {
    scrollWindowToY(0, SECTION_CENTER_SNAP_CONFIG.duration)
    return
  }
  const pinTrigger = sectionPinTriggerMap.value[sectionKey]
  if (
    pinTrigger &&
    typeof pinTrigger.start === 'number' &&
    typeof pinTrigger.end === 'number' &&
    pinTrigger.end > pinTrigger.start
  ) {
    const targetY =
      pinTrigger.start + (pinTrigger.end - pinTrigger.start) * SECTION_NAV_TARGET_PROGRESS
    scrollWindowToY(Math.max(0, targetY), SECTION_CENTER_SNAP_CONFIG.duration)
    return
  }
  const sectionEl = getSectionRef(sectionKey)
  if (!sectionEl) return
  const scrollTop = window.scrollY || window.pageYOffset || 0
  const sectionTop = sectionEl.getBoundingClientRect().top + scrollTop
  // pin trigger가 없는 초기 구간에서는 섹션 시작점으로 fallback
  const targetY = Math.max(0, sectionTop)
  scrollWindowToY(targetY, SECTION_CENTER_SNAP_CONFIG.duration)
}

// 각 섹션의 progress 계산용 스크롤 구간(start/end)을 미리 계산한다.
const buildSectionProgressRanges = () => {
  if (!import.meta.client) return
  const ranges = {}
  const purelyPinStart = sectionPinTriggerMap.value.purely?.start
  ranges.hero = {
    start: 0,
    end:
      typeof purelyPinStart === 'number' && purelyPinStart > 0
        ? purelyPinStart
        : Math.max(windowHeight.value, 1),
  }

  // hero 이후 섹션은 각 섹션 pin start/end 축을 그대로 사용한다.
  SECTION_KEYS.filter((sectionKey) => sectionKey !== 'hero').forEach((sectionKey) => {
    const pinTrigger = sectionPinTriggerMap.value[sectionKey]
    if (!pinTrigger) return
    const naturalStart = pinTrigger.start
    const naturalEnd = pinTrigger.end
    if (typeof naturalStart !== 'number' || typeof naturalEnd !== 'number') return
    const start = naturalStart
    const end = Math.max(naturalEnd, start + 1)
    ranges[sectionKey] = { start, end }
  })
  sectionProgressRangeByKey.value = ranges
}

// 전역 scrollY 기준으로 현재 활성 섹션과 섹션별 progress(0~100)를 단일 정책으로 갱신한다.
const updateSectionProgressByScroll = (scrollTop) => {
  const ranges = sectionProgressRangeByKey.value
  if (!ranges || !Object.keys(ranges).length) return

  let activeKey = LAST_SECTION_KEY
  for (const sectionKey of SECTION_KEYS) {
    const range = ranges[sectionKey]
    if (!range) continue
    if (scrollTop >= range.start && scrollTop < range.end) {
      activeKey = sectionKey
      break
    }
  }

  SECTION_KEYS.forEach((sectionKey) => {
    const range = ranges[sectionKey]
    if (!range) return
    const { start, end } = range
    const raw = ((scrollTop - start) / (end - start)) * 100
    const progress = Math.min(Math.max(raw, 0), 100)
    if (sectionKey === activeKey) setSectionProgress(sectionKey, progress)
    else if (scrollTop >= end) setSectionProgress(sectionKey, 100)
    else setSectionProgress(sectionKey, 0)
  })
}

// 1440px 컨테이너가 사선과 만나는 구간 기준으로 목표 위치 비율을 path 진행도(t)로 변환한다.
const getContainerBasedPathPositions = () => {
  const { angle, cx, length } = getDiagonalPathMetrics()
  const dx = (length / 2) * Math.cos(angle)
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

  const targetRatios = isMobileViewport.value
    ? DIAGONAL_CONTAINER_TARGET_RATIOS.map((ratio) => Math.min(ratio + 0.1, 1))
    : DIAGONAL_CONTAINER_TARGET_RATIOS

  return targetRatios.map((ratio) => tAtLeft + (tAtRight - tAtLeft) * ratio)
}

// pin/refresh 이후의 실제 레이아웃 기준으로 progress range를 다시 동기화한다.
const syncSectionProgressRanges = () => {
  buildSectionProgressRanges()
  onScroll()
}

// 마지막 섹션은 컨텐츠 pin 해제 시점과 사선/프로그래스 absolute 전환 시점을 동일 축으로 맞춘다.
const syncLastSectionAbsoluteState = (scrollTop) => {
  const lastSectionPinTrigger = sectionPinTriggerMap.value[LAST_SECTION_KEY]
  if (lastSectionPinTrigger && typeof lastSectionPinTrigger.end === 'number') {
    const shouldReleaseToAbsolute = scrollTop >= lastSectionPinTrigger.end
    isLastSectionAbsolute.value = shouldReleaseToAbsolute
    return
  }

  const lastSection = getLastSection()
  if (!lastSection) return
  const rect = lastSection.getBoundingClientRect()
  const shouldReleaseToAbsolute = rect.bottom <= windowHeight.value
  isLastSectionAbsolute.value = shouldReleaseToAbsolute
}

const cleanupSectionCenterSnap = () => {
  if (sectionCenterSnapHandler) {
    ScrollTrigger.removeEventListener('scrollEnd', sectionCenterSnapHandler)
    sectionCenterSnapHandler = null
  }
  if (sectionCenterSnapDelayCall) {
    sectionCenterSnapDelayCall.kill()
    sectionCenterSnapDelayCall = null
  }
  gsap.killTweensOf(window)
  isSectionCenterSnapping = false
}

// 뷰포트 크기 상태를 최신 값으로 동기화한다.
const rebuildScrollAnimations = async () => {
  await nextTick()
  cleanupSectionCenterSnap()
  if (gsapContext) {
    gsapContext.revert()
  }
  gsapContext = gsap.context(() => {
    createHeroTitleAnimation()
    createHeroFloatingGuideAnimation()
    createSectionProgressAnimation()
    createVerticalLineAnimation()
    createSectionContentAnimation()
    createDiagonalRevealAnimation()
    createLastSectionDiagonalClipAnimation()
    createDiagonalObjectAnimation()
  })
  ScrollTrigger.refresh()
  syncSectionProgressRanges()
  if (!isMobileViewport.value) {
    createSectionCenterSnapHandler()
  }
}

// 리사이즈 시 뷰포트 상태/애니메이션을 재구성한다.
const updateWindowSize = () => {
  if (!import.meta.client) return
  const nextWidth = window.innerWidth
  const nextHeight = window.innerHeight
  const nextDevicePixelRatio = window.devicePixelRatio || 1
  const widthChanged = nextWidth !== windowWidth.value
  const heightChanged = nextHeight !== windowHeight.value
  const devicePixelRatioChanged = nextDevicePixelRatio !== devicePixelRatio.value

  if (!widthChanged && !heightChanged && !devicePixelRatioChanged) return

  // 모바일 주소창/툴바 변화는 height만 흔들리므로, 레이아웃 기준 높이를 유지해
  // 배경 사선과 오브젝트 배치가 서로 다른 viewport를 참조하지 않게 한다.
  if (isMobileViewport.value && !widthChanged) return

  windowWidth.value = nextWidth
  windowHeight.value = nextHeight
  devicePixelRatio.value = nextDevicePixelRatio

  if (resizeRafId) {
    cancelAnimationFrame(resizeRafId)
  }
  resizeRafId = requestAnimationFrame(() => {
    // 프로그래스 컨테이너 폭은 CSS로 대응되지만,
    // pin 범위/사선 path/슬롯 좌표는 viewport 의존이라 전체 재빌드가 필요하다.
    rebuildScrollAnimations()
    resizeRafId = null
  })
}

// 화면 중심 기준 30도 대각선 SVG 경로를 계산한다.
const diagonalPath = computed(() => {
  const { startX, startY, endX, endY } = getDiagonalPathPoint(1)
  return `M ${startX} ${startY} L ${endX} ${endY}`
})

// 마지막 섹션 위치에 맞춰 사선 레이어를 absolute로 고정한다.
const diagonalStyle = computed(() => {
  if (!import.meta.client || !isLastSectionAbsolute.value) return {}
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
// 마지막 섹션 아래 여유 스페이스는 뷰포트 기반 높이로 유지해 클릭 이동 목표를 안정화한다.
const bottomSpacerStyle = computed(() => ({
  height: `${LAST_SECTION_BOTTOM_SPACER_VH}vh`,
}))
// 브라우저가 Font Loading API를 지원하면 현재 문서 폰트 준비까지 기다린다.
const waitForFontsReady = async () => {
  if (document.fonts?.ready) {
    await document.fonts.ready
  }
}
// 폰트 적용 이후 실제 레이아웃/페인트가 반영될 다음 프레임까지 대기한다.
const waitForNextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

// 스크롤 위치에 따라 마지막 섹션 기준으로 사선 레이어 고정 여부를 결정한다.
const onScroll = () => {
  if (!import.meta.client) return
  const scrollTop = window.scrollY || window.pageYOffset || 0
  lastScrollDirection = scrollTop >= lastKnownScrollTop ? 1 : -1
  lastKnownScrollTop = scrollTop
  if (!Object.keys(sectionProgressRangeByKey.value).length) {
    buildSectionProgressRanges()
  }
  const showHeroFloating = scrollTop <= HERO_UI_TOGGLE_SCROLL_PX
  setFloatingBottomUiVisibility(showHeroFloating)
  updateSectionProgressByScroll(scrollTop)
  syncLastSectionAbsoluteState(scrollTop)

  if (!isMobileViewport.value && !isSectionCenterSnapping) {
    // scrollEnd가 누락돼도 idle 상태가 오면 한 번 더 중앙 정렬을 시도한다.
    queueSectionCenterSnap()
  }
}

// 스크롤이 끝나면 방향을 기준으로 현재/다음/이전 섹션 중앙 중 하나로만 정렬한다.
const createSectionCenterSnapHandler = () => {
  if (isMobileViewport.value) return

  if (sectionCenterSnapHandler) {
    ScrollTrigger.removeEventListener('scrollEnd', sectionCenterSnapHandler)
    sectionCenterSnapHandler = null
  }
  if (sectionCenterSnapDelayCall) {
    sectionCenterSnapDelayCall.kill()
    sectionCenterSnapDelayCall = null
  }

  sectionCenterSnapHandler = () => {
    if (!import.meta.client || isSectionCenterSnapping) return
    queueSectionCenterSnap()
  }

  ScrollTrigger.addEventListener('scrollEnd', sectionCenterSnapHandler)
}

// Hero 타이틀 각 줄을 개별 trigger로 위로 밀어 올려 오버랩 효과를 만든다.
const createHeroTitleAnimation = () => {
  const heroTextWraps =
    getSectionRef('hero')?.querySelectorAll('.hero-title .text-item .text-move--wrap') ?? []
  heroTextWraps.forEach((wrap) => {
    const el = wrap.querySelector('.text-move')
    if (!el) return
    gsap.set(el, {
      yPercent: 0,
      force3D: HERO_TEXT_FORCE_3D,
    })
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap, // 각 줄 wrapper의 실제 위치를 기준으로 순차 오버랩을 만든다.
        start: 'top-=100% top', // 저세로높이 환경에서도 scrollTop=0에서는 항상 원위치에서 시작한다.
        scrub: 0.1, // 짧은 hero 구간에서도 스크롤에 즉각 반응하도록 민감하게 연결한다.
      },
    })
    tl.to(el, {
      yPercent: 100, // 텍스트는 yPercent 기준으로만 이동해 글자 raster 재계산을 줄인다.
      duration: 1, // scrub 타임라인의 기준 길이만 제공하고 실제 속도는 스크롤이 결정한다.
      ease: 'none',
      force3D: HERO_TEXT_FORCE_3D,
    })
  })
}

// hero 구간의 floating guide와 bottom progress는 하나의 상태 축으로 함께 전환한다.
const setFloatingBottomUiVisibility = (showHeroFloating, immediate = false) => {
  const floatingEl = heroFloatingRef.value
  const progressEl = sectionProgressRef.value
  const nextProgressVisible = !showHeroFloating
  const hasSameState =
    isHeroFloatingVisible === showHeroFloating &&
    isSectionProgressVisible.value === nextProgressVisible

  isHeroFloatingVisible = showHeroFloating
  isSectionProgressVisible.value = nextProgressVisible

  const floatingVars = {
    yPercent: showHeroFloating ? 0 : 100,
    autoAlpha: showHeroFloating ? 1 : 0,
    force3D: true,
  }
  const progressVars = {
    yPercent: nextProgressVisible ? 0 : 100,
    autoAlpha: nextProgressVisible ? 1 : 0,
    force3D: true,
  }

  if (immediate || hasSameState) {
    if (floatingEl) gsap.set(floatingEl, floatingVars)
    if (progressEl) gsap.set(progressEl, progressVars)
    if (immediate || hasSameState) return
  }

  if (floatingEl) {
    gsap.to(floatingEl, {
      ...floatingVars,
      duration: showHeroFloating ? 0.3 : 0.22, // 등장: 아래 -> 위, 퇴장: 제자리 -> 아래
      ease: showHeroFloating ? 'power2.out' : 'power2.in',
      overwrite: 'auto',
    })
  }
  if (progressEl) {
    gsap.to(progressEl, {
      ...progressVars,
      duration: nextProgressVisible ? 0.3 : 0.22, // floating과 같은 템포로 반대 방향 전환을 맞춘다.
      ease: nextProgressVisible ? 'power2.out' : 'power2.in',
      overwrite: 'auto',
    })
  }
}

// 초기 진입 시 hero floating/progress UI 표시 상태를 맞춘다.
const createHeroFloatingGuideAnimation = () => {
  if (!getSectionRef('hero') || !heroFloatingRef.value) return
  isHeroFloatingVisible = null
  gsap.set(heroFloatingRef.value, { yPercent: 100, autoAlpha: 0 })
  if (sectionProgressRef.value) {
    gsap.set(sectionProgressRef.value, { yPercent: 100, autoAlpha: 0 })
  }
  const scrollTop = window.scrollY || window.pageYOffset || 0
  const showHeroFloating = scrollTop <= HERO_UI_TOGGLE_SCROLL_PX
  setFloatingBottomUiVisibility(showHeroFloating, true)
}

// 하단 섹션 인디케이터의 섹션별 진행률을 스크롤과 동기화한다.
const createSectionProgressAnimation = () => {
  sectionProgressByKey.value = createInitialSectionProgress()
  sectionDiagonalProgressByKey.value = createInitialSectionDiagonalProgress()
  sectionPinTriggerMap.value = {}
}

// 사선 오브젝트의 슬롯/위치/reveal 기준값을 한 번에 계산한다.
const buildDiagonalObjectMeta = (sectionDef, objects) => {
  const containerBasedPositions = getContainerBasedPathPositions()
  const targetSlots = objects.map((_, idx) => getObjectTargetSlot(sectionDef, idx))
  const targetPositions = objects.map((_, idx) => {
    const slot = targetSlots[idx]
    if (slot < containerBasedPositions.length) return containerBasedPositions[slot]
    return containerBasedPositions[containerBasedPositions.length - 1]
  })
  const alignOrigins = objects.map((_, idx) => getObjectAlignOrigin(sectionDef, idx))
  const leaderTarget = targetPositions[0]
  const revealAtByIndex = objects.map(() => 0)
  for (let i = 1; i < objects.length; i += 1) {
    const revealTarget = Math.min(targetPositions[i], leaderTarget)
    revealAtByIndex[i] = getLeaderRevealTime(revealTarget, DIAGONAL_ENTRY_START, leaderTarget)
  }
  return { targetSlots, targetPositions, alignOrigins, leaderTarget, revealAtByIndex }
}

// 모든 사선 오브젝트를 각 슬롯 위치의 숨김 상태로 초기화한다.
const resetDiagonalObjects = (objects, targetPositions, alignOrigins, pathEl) => {
  objects.forEach((el, idx) => {
    gsap.set(el, {
      opacity: 0,
      force3D: true,
      motionPath: {
        path: pathEl,
        align: pathEl,
        alignOrigin: alignOrigins[idx],
        autoRotate: false,
        start: targetPositions[idx],
        end: targetPositions[idx],
      },
    })
  })
}

// 리더 오브젝트를 사선 시작점의 숨김 상태로 초기화한다.
const resetLeaderObject = (leader, alignOrigin, pathEl) => {
  gsap.set(leader, {
    opacity: 0,
    force3D: true,
    motionPath: {
      path: pathEl,
      align: pathEl,
      alignOrigin,
      autoRotate: false,
      start: DIAGONAL_ENTRY_START,
      end: DIAGONAL_ENTRY_START,
    },
  })
}

// 사선 타임라인 progress에 맞춰 로띠 재생 시점만 동기화한다.
const syncDiagonalLottiesAtProgress = (sectionDef, progress, revealAtByIndex) => {
  sectionDef.items.forEach((item, idx) => {
    if (item.type !== 'lottie') return
    const revealAt = revealAtByIndex[idx] ?? 0
    const playAt = item.startPlayPoint === 'end' ? revealAt + 0.16 : revealAt
    const lottieKey = getDiagonalLottieKey(sectionDef.key, idx)
    const hasPlayed = diagonalLottiePlayLatchMap.get(lottieKey) === true
    if (!hasPlayed && progress >= playAt && progress < 1) {
      diagonalLottiePlayLatchMap.set(lottieKey, true)
      setDiagonalLottieActive(sectionDef.key, idx, true, {
        startFrame: 0,
      })
    }
  })
}
// 섹션 진입 전과 역스크롤 복귀 시 사선 오브젝트 상태를 기본값으로 되돌린다.
const resetDiagonalSectionState = (
  sectionDef,
  leader,
  pathEl,
  alignOrigins,
  targetPositions,
  objects,
) => {
  gsap.set(leader, {
    opacity: 0,
    force3D: true,
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
      force3D: true,
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
      diagonalLottiePlayLatchMap.set(getDiagonalLottieKey(sectionDef.key, idx), false)
      setDiagonalLottieActive(sectionDef.key, idx, false)
    }
  })
}
// 리더 오브젝트의 진입/정지 상태를 progress 기준으로 직접 동기화한다.
const syncLeaderDiagonalState = ({
  leader,
  pathEl,
  alignOrigins,
  leaderTarget,
  leaderExitStart,
  progress,
  isLastDiagonalSection,
}) => {
  let leaderPos = leaderTarget
  let leaderOpacity = 0
  if (progress <= LEADER_ENTER_DURATION) {
    const t = LEADER_ENTER_DURATION ? progress / LEADER_ENTER_DURATION : 1
    const clampedT = Math.min(Math.max(t, 0), 1)
    const easedT = DIAGONAL_LEADER_ENTER_EASE(clampedT)
    leaderPos = lerp(DIAGONAL_ENTRY_START, leaderTarget, easedT)
    leaderOpacity = easedT
  } else {
    leaderOpacity = 1
  }
  if (isLastDiagonalSection || progress < leaderExitStart) {
    gsap.set(leader, {
      opacity: leaderOpacity,
      force3D: true,
      motionPath: {
        path: pathEl,
        align: pathEl,
        alignOrigin: alignOrigins[0],
        autoRotate: false,
        start: clampPathProgress(leaderPos),
        end: clampPathProgress(leaderPos),
      },
    })
  }
}
// 사선 trigger의 매 프레임 업데이트에서 리더/로띠 상태를 동기화한다.
const handleDiagonalTriggerUpdate = ({
  self,
  sectionDef,
  leader,
  pathEl,
  alignOrigins,
  targetPositions,
  leaderTarget,
  leaderExitStart,
  objects,
  isLastDiagonalSection,
  revealAtByIndex,
}) => {
  const { progress } = self
  setSectionDiagonalProgress(sectionDef.key, progress * 100)

  if (progress <= 0) {
    resetDiagonalSectionState(sectionDef, leader, pathEl, alignOrigins, targetPositions, objects)
    return
  }

  syncLeaderDiagonalState({
    leader,
    pathEl,
    alignOrigins,
    leaderTarget,
    leaderExitStart,
    progress,
    isLastDiagonalSection,
  })
  syncDiagonalLottiesAtProgress(sectionDef, progress, revealAtByIndex)
}
// 사선 타임라인이 섹션을 빠져나갈 때 로띠를 정지 상태로 전환한다.
const handleDiagonalTriggerLeave = (sectionDef, isLastDiagonalSection) => {
  if (isLastDiagonalSection) return
  sectionDef.items.forEach((item, idx) => {
    if (item.type !== 'lottie') return
    setDiagonalLottieActive(sectionDef.key, idx, false, {
      stopFrame: sectionDef.key === 'lifecycle' ? LIFECYCLE_DIAGONAL_LOOP_START_FRAME : undefined,
    })
  })
}
// lifecycle 섹션은 역스크롤 진입 시 후반 프레임부터 로띠 재생을 재개한다.
const handleDiagonalTriggerEnterBack = (sectionDef) => {
  if (sectionDef.key !== 'lifecycle') return
  sectionDef.items.forEach((item, idx) => {
    if (item.type !== 'lottie') return
    diagonalLottiePlayLatchMap.set(getDiagonalLottieKey(sectionDef.key, idx), true)
    setDiagonalLottieActive(sectionDef.key, idx, true, {
      startFrame: LIFECYCLE_DIAGONAL_LOOP_START_FRAME,
    })
  })
}
// 사선 타임라인이 섹션 시작 이전으로 되돌아가면 로띠를 0프레임으로 되돌린다.
const handleDiagonalTriggerLeaveBack = (sectionDef) => {
  sectionDef.items.forEach((item, idx) => {
    if (item.type !== 'lottie') return
    diagonalLottiePlayLatchMap.set(getDiagonalLottieKey(sectionDef.key, idx), false)
    setDiagonalLottieActive(sectionDef.key, idx, false, {
      stopFrame: 0,
    })
  })
}
// 비리더 오브젝트의 순차 등장 tween을 타임라인에 추가한다.
const addDiagonalRevealTweens = ({
  tl,
  objects,
  pathEl,
  alignOrigins,
  targetPositions,
  leaderTarget,
}) => {
  const revealQueue = objects.slice(1).reverse()
  revealQueue.forEach((el, idx) => {
    const sourceIdx = objects.length - 1 - idx
    const revealTarget = Math.min(targetPositions[sourceIdx], leaderTarget)
    const revealAt = getLeaderRevealTime(revealTarget, DIAGONAL_ENTRY_START, leaderTarget)
    tl.to(
      el,
      {
        motionPath: {
          path: pathEl, // 슬롯 오브젝트는 목표 슬롯 위치에만 정렬하고 별도 이동은 하지 않는다.
          align: pathEl,
          alignOrigin: alignOrigins[sourceIdx],
          autoRotate: false,
          start: targetPositions[sourceIdx],
          end: targetPositions[sourceIdx],
        },
        opacity: 1,
        ease: 'power1.out', // 리더가 지나간 직후 부드럽게 고정 상태로 드러난다.
        duration: 0.16, // 짧게 페이드인해 리더 이동 리듬을 해치지 않는다.
        force3D: true,
      },
      revealAt,
    )
  })
}
// 리더를 포함한 사선 오브젝트의 순차 퇴장 tween을 타임라인에 추가한다.
const addDiagonalExitTweens = ({
  tl,
  objects,
  leader,
  pathEl,
  alignOrigins,
  targetPositions,
  targetSlots,
  leaderTarget,
}) => {
  const exitBase = DIAGONAL_EXIT_BASE
  const nonLeaderIndices = targetPositions
    .map((_, idx) => idx)
    .filter((idx) => idx > 0)
    .sort((a, b) => targetSlots[b] - targetSlots[a] || b - a)
  const uniqueExitSlots = [...new Set(nonLeaderIndices.map((idx) => targetSlots[idx]))].sort(
    (a, b) => b - a,
  )
  const availableExitSpan = Math.max(DIAGONAL_EXIT_STAGGER_END - exitBase, 0)
  const actualExitStep =
    uniqueExitSlots.length > 1
      ? availableExitSpan / (uniqueExitSlots.length - 1)
      : availableExitSpan
  const exitStartBySlot = new Map(
    uniqueExitSlots.map((slot, order) => [slot, exitBase + order * actualExitStep]),
  )
  const leaderExitStart = Math.min(exitBase + uniqueExitSlots.length * actualExitStep, 0.98)
  const leaderExitEnd = Math.min(leaderTarget + DIAGONAL_EXIT_TRAVEL_DELTA, DIAGONAL_EXIT_PATH_MAX)

  nonLeaderIndices.forEach((sourceIdx) => {
    const el = objects[sourceIdx]
    const exitStart = targetPositions[sourceIdx]
    const exitEnd = Math.min(exitStart + DIAGONAL_EXIT_TRAVEL_DELTA, DIAGONAL_EXIT_PATH_MAX)
    const tweenStartAt = Math.min(exitStartBySlot.get(targetSlots[sourceIdx]) ?? exitBase, 0.995)
    tl.to(
      el,
      {
        motionPath: {
          path: pathEl, // 퇴장 시에는 현재 슬롯에서 바깥쪽으로 더 이동하며 사라진다.
          align: pathEl,
          alignOrigin: alignOrigins[sourceIdx],
          autoRotate: false,
          start: exitStart,
          end: exitEnd,
        },
        opacity: 0,
        ease: 'power1.in', // 섹션 말미에 담기듯 빠르게 사라지는 인상을 만든다.
        duration: 0.1, // 순차 퇴장 간격은 유지하되 개별 오브젝트는 짧게 정리한다.
        force3D: true,
        immediateRender: false, // 초기 렌더에서 퇴장 상태가 먼저 적용되는 문제를 막는다.
      },
      tweenStartAt,
    )
  })

  tl.to(
    leader,
    {
      motionPath: {
        path: pathEl, // 리더는 마지막 순번으로 더 멀리 빠져나가며 전체 흐름을 마감한다.
        align: pathEl,
        alignOrigin: alignOrigins[0],
        autoRotate: false,
        start: leaderTarget,
        end: leaderExitEnd,
      },
      opacity: 0,
      ease: 'power1.in', // 슬롯 오브젝트와 같은 퇴장 리듬을 유지한다.
      duration: 0.1, // 리더만 과하게 끌지 않고 마지막 순번으로 정리한다.
      force3D: true,
      immediateRender: false, // 리더 위치가 초기 렌더에서 어긋나지 않도록 보호한다.
    },
    leaderExitStart,
  )

  return leaderExitStart
}

// B2 세로선을 스크롤 구간에 맞춰 순차 등장/퇴장시킨다.
const createVerticalLineAnimation = () => {
  const vLineSection = verticalLineSectionRef.value
  if (!vLineSection) return

  const vLines = verticalLines.value
  if (!vLines.length) return
  gsap.set(vLines, { scaleY: 0, opacity: 0, transformOrigin: 'bottom' })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: vLineSection, // purely 섹션 전체를 라인 애니메이션의 기준 구간으로 사용한다.
      start: VERTICAL_LINE_START, // 섹션 진입 전부터 라인이 먼저 살아나게 한다.
      end: VERTICAL_LINE_END, // 다음 섹션으로 넘어갈 때까지 여운을 유지한다.
      scrub: 0.8, // 라인이 스크롤을 너무 딱딱하게 따라오지 않도록 완충한다.
      invalidateOnRefresh: true, // 리사이즈 시 라인 길이와 trigger 범위를 다시 계산한다.
    },
  })

  tl.to(vLines, {
    scaleY: 1,
    opacity: 0.24,
    transformOrigin: 'bottom',
    ease: 'none',
    duration: 0.18,
    stagger: {
      each: 0.015, // 앞 라인부터 촘촘하게 이어 그려지는 리듬을 만든다.
      from: 'start',
    },
  })
    .to(
      vLines,
      {
        opacity: 0.1,
        ease: 'none',
        duration: 0.06,
        stagger: {
          each: 0.008, // 등장 직후 빠르게 기본 opacity로 정리한다.
          from: 'start',
        },
      },
      '>-0.03',
    )
    .to({}, { duration: 0.44 })
    .to(vLines, {
      scaleY: 0,
      opacity: 0.1,
      transformOrigin: 'top',
      ease: 'none',
      duration: 0.18,
      stagger: {
        each: 0.008, // 뒤 라인부터 접히듯 사라져 섹션 전환 방향을 강조한다.
        from: 'end',
      },
      immediateRender: false, // 퇴장 from 상태가 초기 렌더에서 먼저 적용되는 문제를 막는다.
    })
}

// 설명 블록만 activated 클래스를 토글해 라인/아이콘 연출 시작 시점을 제어한다.
const toggleDescActivated = (el, isActive) => {
  if (!el.classList.contains('psm-home-sec-desc')) return
  el.classList.toggle('activated', isActive)
}

// 각 섹션의 고정 영역을 핀 처리하고 제목/키비주얼/설명을 순차 전환한다.
const createSectionContentAnimation = () => {
  const SECTION_CONTENT_ENTER_Y = [-60, -120, 60]
  const SECTION_CONTENT_LEAVE_Y = [-60, -120, 60]

  SECTION_KEYS.forEach((sectionKey) => {
    const section = getSectionRef(sectionKey)
    const area = section?.querySelector('.fixed-area')
    if (!section || !area) return
    const isLastSection = section === getLastSection()
    const contentEnterEndProgress = isLastSection
      ? LAST_SECTION_CONTENT_ENTER_END_PROGRESS
      : SECTION_CONTENT_ENTER_END_PROGRESS
    const elements = [
      area.querySelector('.psm-home-sec-title'),
      area.querySelector('.psm-home-sec-key'),
      area.querySelector('.psm-home-sec-desc'),
    ].filter(Boolean)

    // rebuild/refresh 이후 남아 있을 수 있는 inline transform/opacity를 지워 CSS 기준 위치에서 다시 시작한다.
    gsap.set(elements, {
      clearProps: 'transform,opacity',
    })
    elements.forEach((el) => toggleDescActivated(el, false))

    const iconShip = area.querySelector('.icon-ship')
    if (iconShip) {
      const shipTl = gsap.timeline({
        scrollTrigger: {
          trigger: section, // 섹션 전체 구간을 따라 배 아이콘을 이동시킨다.
          start: 'top top', // 섹션 고정 시점부터 배 모션을 시작한다.
          end: 'bottom top', // 섹션 종료까지 하나의 흐름으로 마무리한다.
          scrub: true, // 배 위치를 스크롤과 1:1로 연결한다.
          invalidateOnRefresh: true, // 섹션 높이나 뷰포트가 바뀌면 이동 구간을 재계산한다.
        },
      })
      shipTl
        .fromTo(
          iconShip,
          { y: 0, opacity: 0 },
          {
            y: 0,
            opacity: 0,
            duration: 0.08,
            ease: 'none',
            force3D: true,
            immediateRender: false,
          },
        )
        .to(iconShip, {
          y: '32vh',
          opacity: 1,
          duration: 0.32,
          ease: 'power2.in',
          force3D: true,
        })
        .to(iconShip, {
          y: '64vh',
          opacity: 0,
          duration: 0.64,
          ease: 'power2.out',
          force3D: true,
        })
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: SECTION_PIN_START, // 섹션 top이 뷰포트 top에 닿는 시점부터 컨텐츠 서사를 시작한다.
        end: isLastSection ? 'center top' : SECTION_PIN_END, // 마지막 섹션만 footer를 더 빨리 드러내도록 pin 종료를 앞당긴다.
        scrub: true, // 고정 구간 전체를 하나의 스크롤 타임라인으로 묶어 재정렬 느낌을 줄인다.
        pin: area, // fixed-area를 동일 축으로 고정해 enter/hold/exit가 한 좌표계에서 진행되게 한다.
        pinSpacing: true, // pin 구간만큼 문서 흐름 공간을 확보해 다음 섹션과의 간섭을 막는다.
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const isContentActive =
            self.progress > contentEnterEndProgress &&
            (isLastSection || self.progress < SECTION_CONTENT_EXIT_START_PROGRESS)
          elements.forEach((el) => toggleDescActivated(el, isContentActive))
        },
        onLeave: () => elements.forEach((el) => toggleDescActivated(el, false)),
        onLeaveBack: () => elements.forEach((el) => toggleDescActivated(el, false)),
      },
    })

    elements.forEach((el, idx) => {
      tl.fromTo(
        el,
        {
          yPercent: SECTION_CONTENT_ENTER_Y[idx], // 입장 전에 위/아래에서 접근하도록 출발 위치를 분리한다.
          opacity: 0, // 화면에 안착하기 전까지는 투명 상태로 유지한다.
        },
        {
          yPercent: 0, // enter 종료 시 제자리로 정렬한다.
          opacity: 1, // enter 종료 시 완전 노출 상태로 만든다.
          ease: 'none', // scrub 구간에서는 선형 보간으로 스크롤과의 대응을 우선한다.
          duration: contentEnterEndProgress, // 마지막 섹션은 컨텐츠 안착 시점을 더 앞당겨 클릭 이동 체감을 맞춘다.
          immediateRender: false, // 초기 렌더에서 from 상태가 먼저 적용되는 현상을 막는다.
        },
        0,
      )

      if (!isLastSection) {
        tl.to(
          el,
          {
            yPercent: SECTION_CONTENT_LEAVE_Y[idx], // 후반부에는 입장 반대 방향으로 밀어내며 전환한다.
            opacity: 0, // 퇴장 완료 시 다음 섹션에 집중되도록 사라지게 한다.
            ease: 'none', // scrub과 동일한 축을 유지하기 위해 선형 보간을 사용한다.
            duration: 1 - SECTION_CONTENT_EXIT_START_PROGRESS, // 고정 섹션 후반 30% 구간을 퇴장에 사용한다.
            immediateRender: false, // exit 상태가 초기에 먼저 적용되는 문제를 막는다.
          },
          SECTION_CONTENT_EXIT_START_PROGRESS,
        )
      }
    })

    if (isLastSection) {
      // 마지막 섹션은 exit가 없으므로 hold 구간을 명시해 공통 0~1 progress 축을 유지한다.
      tl.to({}, { duration: 1 - contentEnterEndProgress }, contentEnterEndProgress)
    }

    sectionPinTriggerMap.value[sectionKey] = tl.scrollTrigger
  })
}

// 고정된 사선 레이어에서 경로를 우상단 -> 좌하단 방향으로 그려서 등장시킨다.
const createDiagonalRevealAnimation = () => {
  const diagonalWrapEl = diagonalWrapRef.value
  const clipRectEl = diagonalDisplayClipRectRef.value
  const triggerEl = getSectionRef('defined')
  if (!diagonalWrapEl || !clipRectEl || !triggerEl) return

  gsap.set(diagonalWrapEl, { width: '100vw' }) // 사선 레이어는 항상 고정된 전체 폭 유지
  gsap.set(clipRectEl, {
    attr: {
      x: windowWidth.value,
      width: 0,
    },
  })

  gsap.to(clipRectEl, {
    attr: {
      x: 0,
      width: windowWidth.value,
    },
    ease: 'none', // 스크롤 매핑을 선형으로 유지
    scrollTrigger: {
      trigger: triggerEl,
      start: 'top-=25% bottom', // Defined at the Origin 섹션이 진입할 때 등장 시작
      end: 'top-=25% top', // 섹션 top이 뷰포트 top에 닿으면 드로잉 완료
      scrub: true, // 스크롤 위치와 드로잉 진행도를 동기화
      invalidateOnRefresh: true, // path 길이와 viewport가 바뀌면 드로잉 기준도 함께 갱신한다.
    },
  })
}

// 마지막 섹션에서는 배경 사선 전용 clip 폭만 줄여 종착점 느낌을 만든다.
const createLastSectionDiagonalClipAnimation = () => {
  const clipRectEl = diagonalDisplayClipRectRef.value
  const triggerEl = getLastSection()
  if (!clipRectEl || !triggerEl) return

  const [leaderTarget = 1] = getContainerBasedPathPositions()
  const { endX: clipStartX } = getDiagonalPathPoint(
    Math.max(leaderTarget - LAST_SECTION_DIAGONAL_CLIP_OFFSET, 0),
  )
  const targetX = Math.min(Math.max(clipStartX, 0), windowWidth.value)
  const targetWidth = Math.max(windowWidth.value - targetX, 0)

  gsap.fromTo(
    clipRectEl,
    {
      attr: {
        x: 0,
        width: windowWidth.value,
      },
    },
    {
      attr: {
        x: targetX,
        width: targetWidth,
      },
      ease: 'circ.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: triggerEl, // 마지막 섹션 구간에만 배경 사선 단축을 연결한다.
        start: 'top+=45% bottom', // 섹션이 진입하기 시작하면 배경 사선 단축도 함께 시작한다.
        end: 'top+=68% bottom', // 섹션 초반부까지 단축을 이어가며 종착점 느낌을 만든다.
        scrub: DIAGONAL_OBJECT_SCRUB, // 오브젝트 스크럽 감도와 맞춰 같은 리듬으로 줄어들게 한다.
        invalidateOnRefresh: true,
      },
    },
  )
}
// 섹션별 사선 오브젝트를 리더 이동/순차 등장/역순 퇴장 정책으로 제어한다.
const createDiagonalObjectAnimation = () => {
  const pathEl = diagonalPathRef.value
  if (!pathEl) return

  diagonalObjectSections.forEach((sectionDef) => {
    const isLastDiagonalSection = sectionDef.key === LAST_SECTION_KEY
    const triggerEl = getSectionRef(sectionDef.key)
    const sectionRefs = diagonalObjectRefMap.get(sectionDef.key) ?? []
    if (!triggerEl || !sectionRefs.length) return
    const objects = sectionDef.items.map((_, idx) => sectionRefs[idx]).filter((el) => Boolean(el))
    if (objects.length !== sectionDef.items.length) return

    const leader = objects[0] // 첫 오브젝트만 실제로 패스를 따라 먼저 이동하는 리더
    const { targetSlots, targetPositions, alignOrigins, leaderTarget, revealAtByIndex } =
      buildDiagonalObjectMeta(sectionDef, objects)

    resetDiagonalObjects(objects, targetPositions, alignOrigins, pathEl)
    resetLeaderObject(leader, alignOrigins[0], pathEl)
    const nonLeaderSlots = [...new Set(targetSlots.filter((_, idx) => idx > 0))].sort(
      (a, b) => b - a,
    )
    const availableExitSpan = Math.max(DIAGONAL_EXIT_STAGGER_END - DIAGONAL_EXIT_BASE, 0)
    const actualExitStep =
      nonLeaderSlots.length > 1
        ? availableExitSpan / (nonLeaderSlots.length - 1)
        : availableExitSpan
    const leaderExitStart = isLastDiagonalSection
      ? 1
      : Math.min(DIAGONAL_EXIT_BASE + nonLeaderSlots.length * actualExitStep, 0.98)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl, // 해당 섹션 진입/이탈 구간에 타임라인 연결
        start: DIAGONAL_TIMELINE_START, // 컨텐츠보다 사선 오브젝트가 먼저 스타트하도록 시작점을 앞당김
        end: DIAGONAL_TIMELINE_END, // 모든 섹션이 같은 사선 타임라인 구간을 사용하도록 통일
        scrub: DIAGONAL_OBJECT_SCRUB, // 사선 오브젝트가 스크롤을 조금 완만하게 따라오도록 보간
        invalidateOnRefresh: true, // path 위치와 컨테이너 폭이 바뀌면 메타 계산을 다시 반영한다.
        onUpdate: (self) =>
          handleDiagonalTriggerUpdate({
            self,
            sectionDef,
            leader,
            pathEl,
            alignOrigins,
            targetPositions,
            leaderTarget,
            leaderExitStart,
            objects,
            isLastDiagonalSection,
            revealAtByIndex,
          }),
        onLeave: () => handleDiagonalTriggerLeave(sectionDef, isLastDiagonalSection),
        onEnterBack: () => handleDiagonalTriggerEnterBack(sectionDef),
        onLeaveBack: () => handleDiagonalTriggerLeaveBack(sectionDef),
      },
    })

    // 마지막 섹션은 퇴장 tween이 없어 타임라인 길이가 짧아지므로, 0~1 구간 기준을 강제로 맞춘다.
    if (isLastDiagonalSection) {
      tl.to({}, { duration: 0 }, 1)
    }

    addDiagonalRevealTweens({ tl, objects, pathEl, alignOrigins, targetPositions, leaderTarget })

    if (!isLastDiagonalSection) {
      addDiagonalExitTweens({
        tl,
        objects,
        leader,
        pathEl,
        alignOrigins,
        targetPositions,
        targetSlots,
        leaderTarget,
      })
    }
  })
}

// 페이지 진입 시 애니메이션과 전역 이벤트를 초기화한다.
onMounted(async () => {
  if (!import.meta.client) return
  if ('scrollRestoration' in window.history) {
    previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
  }
  document.body.style.overflow = 'hidden'
  // 이 홈은 항상 상단 인트로부터 시작하므로, 초기 paint 전에 scroll 복원을 끊고
  // 폰트 준비 이후 한 번만 애니메이션을 계산한다.
  window.scrollTo(0, 0)
  await nextTick()
  await waitForFontsReady()
  await waitForNextFrame()
  window.scrollTo(0, 0)
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
  await rebuildScrollAnimations()
  isFontPending.value = false
  document.body.style.overflow = ''

  mainStore.setPortalAppbarTheme('dark')
  document.body.style.backgroundColor = '#11113A'
  window.addEventListener('resize', updateWindowSize)
  window.addEventListener('scroll', onScroll)
  // bfcache 복귀나 회전 전환 뒤에도 진행 UI/trigger 상태를 다시 맞춘다.
  pageShowHandler = () => {
    if (window.scrollY <= HERO_UI_TOGGLE_SCROLL_PX) {
      window.scrollTo(0, 0)
    }
    rebuildScrollAnimations()
  }
  window.addEventListener('pageshow', pageShowHandler)
})

// 페이지 이탈 시 GSAP context와 전역 이벤트를 정리한다.
onBeforeUnmount(() => {
  cleanupSectionCenterSnap()
  if (resizeRafId) {
    cancelAnimationFrame(resizeRafId)
    resizeRafId = null
  }
  diagonalLottieStateMap.forEach((_, key) => {
    const [sectionKey, index] = key.split(':')
    setDiagonalLottieActive(sectionKey, Number(index), false)
  })
  diagonalLottiePlayLatchMap.clear()
  if (gsapContext) {
    gsapContext.revert()
  }
  document.body.style.overflow = ''
  if ('scrollRestoration' in window.history && previousScrollRestoration) {
    window.history.scrollRestoration = previousScrollRestoration
    previousScrollRestoration = null
  }
  mainStore.setPortalAppbarTheme('light')
  document.body.style.backgroundColor = ''
  window.removeEventListener('resize', updateWindowSize)
  window.removeEventListener('scroll', onScroll)
  if (pageShowHandler) {
    window.removeEventListener('pageshow', pageShowHandler)
    pageShowHandler = null
  }
})
</script>
