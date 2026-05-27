<template>
  <div class="code-group">
    <div class="code-group__header">
      <button
        v-for="(item, index) in items"
        :key="index"
        type="button"
        class="code-group__tab"
        :class="{ 'code-group__tab--active': activeTab === index }"
        @click="activeTab = index"
      >
        {{ item.title }}
      </button>
    </div>
    <div class="code-group__content">
      <CodeBlock :code="items[activeTab].code" :language="items[activeTab].language" :dark="dark" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
    // items: [{ title: 'index.js', code: '...', language: 'javascript' }]
  },
  dark: {
    type: Boolean,
    default: false,
  },
})

const activeTab = ref(0)
</script>

<style lang="scss" scoped>
.code-group {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background: #fff;
  overflow: hidden;

  &__header {
    display: flex;
    gap: 0;
    padding: 0 8px;
    background: #f5f5f5;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  &__tab {
    position: relative;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    color: #999;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Courier New', 'Monaco', monospace;
    white-space: nowrap;

    &:hover {
      color: #333;
      background: rgba(25, 118, 210, 0.08);
    }

    &--active {
      color: #333;
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #1976d2;
      }
    }
  }

  &__content {
    :deep(.code-block) {
      margin: 0;
      border: none;
      border-radius: 0;
    }
  }
}
</style>
