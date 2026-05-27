<template>
  <div class="props-section">
    <h3 class="props-title">Props</h3>
    <div class="props-table">
      <div class="prop-row prop-row--head">
        <div class="prop-name">Name</div>
        <div class="prop-type">Type</div>
        <div class="prop-default">Default</div>
        <div class="prop-desc">Description</div>
      </div>
      <div v-for="prop in props" :key="prop.name" class="prop-row">
        <div class="prop-name">{{ prop.name }}</div>
        <div class="prop-type">{{ prop.type }}</div>
        <div v-if="prop.required" class="prop-required">필수</div>
        <div v-else class="prop-default">{{ prop.default || '-' }}</div>
        <div class="prop-desc">{{ prop.desc }}</div>
      </div>
    </div>

    <template v-if="slots && slots.length">
      <h3 class="props-title">Slots</h3>
      <div class="props-table">
        <div class="prop-row prop-row--head">
          <div class="prop-name">Name</div>
          <div class="prop-type">Props</div>
          <div class="prop-default">Default</div>
          <div class="prop-desc">Description</div>
        </div>
        <div v-for="slot in slots" :key="slot.name" class="prop-row">
          <div class="prop-name">{{ slot.name }}</div>
          <div class="prop-type">{{ slot.props || '-' }}</div>
          <div class="prop-default">-</div>
          <div class="prop-desc">{{ slot.desc }}</div>
        </div>
      </div>
    </template>

    <template v-if="events && events.length">
      <h3 class="props-title">Events</h3>
      <div class="props-table">
        <div class="prop-row prop-row--head">
          <div class="prop-name">Name</div>
          <div class="prop-type">Payload</div>
          <div class="prop-default">Default</div>
          <div class="prop-desc">Description</div>
        </div>
        <div v-for="event in events" :key="event.name" class="prop-row">
          <div class="prop-name">{{ event.name }}</div>
          <div class="prop-type">{{ event.payload || '-' }}</div>
          <div class="prop-default">-</div>
          <div class="prop-desc">{{ event.desc }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  props: {
    type: Array,
    required: true,
    // 형식: [
    //   { name: 'color', type: 'String', default: 'primary', desc: '설명' },
    //   { name: 'disabled', type: 'Boolean', default: 'false', desc: '설명', required: true },
    // ]
  },
  slots: {
    type: Array,
    default: () => [],
    // 형식: [
    //   { name: 'tab', props: '{ item, active }', desc: '탭 라벨 커스텀' },
    // ]
  },
  events: {
    type: Array,
    default: () => [],
    // 형식: [
    //   { name: 'change', payload: 'value', desc: '선택 변경 시 발생' },
    // ]
  },
})
</script>

<!-- 스타일은 assets/styles/_pub.scss 공용 정의 사용 -->
