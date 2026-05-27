<template>
  <div class="psm-home-container">
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
      <div class="psm-home-floating">
        <VIcon icon="ebli:arrow-down-line" :size="32" />
      </div>
    </section>

    <section class="psm-home-sec psm-home-sec--sec2">
      <div class="psm-home-sec--vertical-line">
        <div v-for="idx in 9" :key="`vertical-line-${idx}`" class="line" />
      </div>
      <div class="fixed-area">
        <div class="icon-ship">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="26" viewBox="0 0 12 26" fill="none">
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
              <template v-else>{{ line.text }}</template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div class="psm-home-bg-diagonal">
      <svg
        class="psm-home-bg-diagonal--svg"
        :width="windowWidth"
        :height="windowHeight"
        :viewBox="`0 0 ${windowWidth} ${windowHeight}`"
        preserveAspectRatio="none"
      >
        <path :d="diagonalPath" stroke="#1fa345" stroke-width="2" stroke-dasharray="1 10" fill="none" />
      </svg>
    </div>

    <section class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">{{ homeI18n.defined.title }}</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual02" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 v-if="homeI18n.defined.subtitle" class="subtitle">{{ homeI18n.defined.subtitle }}</h3>
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
              <template v-else>{{ line.text }}</template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">{{ homeI18n.seamless.title }}</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual03" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 v-if="homeI18n.seamless.subtitle" class="subtitle">{{ homeI18n.seamless.subtitle }}</h3>
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
              <template v-else>{{ line.text }}</template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="psm-home-sec psm-home-sec--b3">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title white">Lifecycle</h2>
        </div>
        <div class="psm-home-sec-key">
          <div class="diagonal-obj diagonal-obj--lottie" style="width: 990px; height: 610px">
            <Vue3Lottie :animation-link="'/lottie/lifecycle.json'" :auto-play="true" :loop="true" class="diagonal-lottie" />
          </div>
        </div>
      </div>
    </section>

    <section class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">{{ homeI18n.screen.title }}</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual04" alt="Key Visual" class="key-visual" />
          <div class="diagonal-obj diagonal-obj--lottie" style="width: 381px; height: 152px">
            <Vue3Lottie :animation-link="'/lottie/print.json'" :auto-play="true" :loop="true" class="diagonal-lottie" />
          </div>
        </div>
        <div class="psm-home-sec-desc">
          <h3 v-if="homeI18n.screen.subtitle" class="subtitle">{{ homeI18n.screen.subtitle }}</h3>
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
              <template v-else>{{ line.text }}</template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="psm-home-sec psm-home-sec--b1">
      <div class="fixed-area">
        <div class="psm-home-sec-title">
          <h2 class="title">{{ homeI18n.absolute.title }}</h2>
        </div>
        <div class="psm-home-sec-key">
          <img :src="keyVisual05" alt="Key Visual" class="key-visual" />
        </div>
        <div class="psm-home-sec-desc">
          <h3 v-if="homeI18n.absolute.subtitle" class="subtitle">{{ homeI18n.absolute.subtitle }}</h3>
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
              <template v-else>{{ line.text }}</template>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div style="height: 25vh">&ZeroWidthSpace;</div>
  </div>
</template>

<script setup>
import keyVisual01 from '@/assets/images/portal/main_obj_key_01.svg?url'
import keyVisual02 from '@/assets/images/portal/main_obj_key_02.svg?url'
import keyVisual03 from '@/assets/images/portal/main_obj_key_03.svg?url'
import keyVisual04 from '@/assets/images/portal/main_obj_key_04.svg?url'
import keyVisual05 from '@/assets/images/portal/main_obj_key_05.svg?url'

const mainStore = useMainStore()
const { tm, rt } = useLocale()

definePageMeta({ layout: 'portal' })

const windowWidth = ref(import.meta.client ? window.innerWidth : 0)
const windowHeight = ref(import.meta.client ? window.innerHeight : 0)

const resolveLocaleText = (value) => (value == null ? '' : rt(value))
const normalizeHomeSection = (section) => ({
  title: resolveLocaleText(section?.title),
  subtitle: resolveLocaleText(section?.subtitle),
  desc: Array.isArray(section?.desc)
    ? section.desc.map((line) => ({
        text: resolveLocaleText(line?.text),
        hasShip: line?.hasShip === true,
      }))
    : [],
})

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

const updateWindowSize = () => {
  if (!import.meta.client) return
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

const diagonalPath = computed(() => {
  const angle = (30 * Math.PI) / 180
  const cx = windowWidth.value / 2
  const cy = windowHeight.value / 2
  const L = Math.sqrt(windowWidth.value ** 2 + windowHeight.value ** 2)
  const dx = (L / 2) * Math.cos(angle)
  const dy = (L / 2) * Math.sin(angle)
  const x1 = cx - dx
  const y1 = cy + dy
  const x2 = cx + dx
  const y2 = cy - dy
  return `M ${x2} ${y2} L ${x1} ${y1}`
})

onMounted(() => {
  mainStore.setPortalAppbarTheme('dark')
  mainStore.setPortalAppbarInvert(false)
  updateWindowSize()
  window.addEventListener('resize', updateWindowSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowSize)
})
</script>
