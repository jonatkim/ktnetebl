<template>
  <div
    ref="pageContainer"
    class="psm-page-container psm-page-container--home"
    :class="{ 'bg-scroll': showScrollBg }"
  >
    <section class="psm-section">
      <div class="grid-container">
        <div
          class="sample-visual"
          style="
            margin: 40px 0;
            background-color: rgba(255, 255, 255, 0.2);
            color: #fff;
            height: 1080px;
          "
        >
          sample
        </div>
        <div v-intersect="triggerDiagonalLineAnimation" class="sample-trigger">sample trigger</div>
        <div
          v-intersect="createIntersectBinding(0)"
          class="psm-home-desc psm-home-desc--wrap"
          :class="{ 'psm-home-desc--activated': activatedStates[0] }"
        >
          <div class="content">
            The integrity of trade, encapsulated in<br />
            <div class="line-ship--wrap">
              <span class="line-ship__text">a digita envelope</span>
              <div class="line-ship__line">
                <VIcon icon="ebli:ship" class="line-ship__icon" />
              </div>
            </div>
            flowing unbroken from the moment of <br />
            creation to its final delivery
          </div>
        </div>

        <div class="start">test start</div>

        <div
          v-intersect="createIntersectBinding(1)"
          class="psm-home-desc psm-home-desc--wrap"
          :class="{ 'psm-home-desc--activated': activatedStates[1] }"
        >
          <h3 class="title">Digital Issuance</h3>
          <div class="content">
            The moment data is born with <br />
            <div class="line-ship--wrap">
              <span class="line-ship__text">absolute integrity</span>
              <div class="line-ship__line">
                <VIcon icon="ebli:ship" class="line-ship__icon" />
              </div>
            </div>

            the first record of digital trade begins <br />
            here
          </div>
        </div>

        <div
          v-intersect="createIntersectBinding(2)"
          class="psm-home-desc psm-home-desc--wrap"
          :class="{ 'psm-home-desc--activated': activatedStates[2] }"
        >
          <h3 class="title">Digital Issuance</h3>
          <div class="content">
            Ownership encapsulated in a digital <br />
            The moment data is born with
            <div class="line-ship--wrap">
              <span class="line-ship__text">envelope</span>
              <div class="line-ship__line">
                <VIcon icon="ebli:ship" class="line-ship__icon" />
              </div>
            </div>

            flowing seamlessly, amplified and <br />
            perfected by global stakeholder
          </div>
        </div>
      </div>
    </section>

    <div v-intersect="bgScrollBinding" class="test">test</div>
    <div style="height: 250px">sample</div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useMainStore } from '~/stores/useMainStore'

definePageMeta({ layout: 'portal' })

const mainStore = useMainStore()
const pageContainer = ref(null)
const activatedStates = ref([false, false, false])
const bgPositionY = ref('0px')
const showScrollBg = ref(false)
const diagonalLineAnimated = ref(false)

const createIntersectBinding = (index) => ({
  handler: (isIntersecting, entries) => {
    const ratio = entries?.[0]?.intersectionRatio ?? 0
    activatedStates.value[index] = isIntersecting && ratio >= 1
  },
  options: {
    threshold: 1,
  },
})

const bgScrollBinding = {
  handler: (isIntersecting) => {
    showScrollBg.value = isIntersecting
    if (isIntersecting) {
      bgPositionY.value = `${window.scrollY}px`
    }
  },
  options: {
    threshold: 0,
  },
}

const triggerDiagonalLineAnimation = {
  handler: (isIntersecting) => {
    if (isIntersecting && !diagonalLineAnimated.value) {
      diagonalLineAnimated.value = true
      // Set a custom property to trigger background change
      if (pageContainer.value) {
        pageContainer.value.classList.add('diagonal-animated')
      }
    }
  },
  options: {
    threshold: 0.1,
  },
}

watch(bgPositionY, (newValue) => {
  if (pageContainer.value) {
    pageContainer.value.style.setProperty('--bg-position-y', newValue)
  }
})

onMounted(() => {
  mainStore.setPortalAppbarTheme('dark')
})

watch(diagonalLineAnimated, (val) => {
  if (pageContainer.value) {
    if (val) {
      pageContainer.value.classList.add('diagonal-animated')
    } else {
      pageContainer.value.classList.remove('diagonal-animated')
    }
  }
})

onBeforeUnmount(() => {
  mainStore.setPortalAppbarTheme('light')
})
</script>
