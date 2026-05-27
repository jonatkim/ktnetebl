<template>
  <nav class="ebl-breadcrumb" aria-label="breadcrumb">
    <ol class="ebl-breadcrumb__list">
      <li v-for="(item, index) in items" :key="index" class="ebl-breadcrumb__item">
        <NuxtLink
          v-if="item.to && index < lastIndex"
          :to="item.to"
          class="ebl-breadcrumb__text ebl-breadcrumb__text--link"
        >
          {{ item.text }}
        </NuxtLink>
        <span
          v-else
          class="ebl-breadcrumb__text"
          :class="{ 'ebl-breadcrumb__text--active': index === lastIndex }"
        >
          {{ item.text }}
        </span>
        <VIcon
          v-if="index < lastIndex"
          icon="ebli:chevron-right"
          size="20"
          class="ebl-breadcrumb__separator"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every((item) => item.text)
    },
  },
})

const lastIndex = computed(() => props.items.length - 1)
</script>
