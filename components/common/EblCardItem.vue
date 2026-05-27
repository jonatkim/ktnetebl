<template>
  <div class="ebl-card-item" :class="{ 'ebl-card-item--outlined': outlined }">
    <div class="ebl-card-item__bl">
      <div
        class="ebl-card-item__bl-no ebl-card-item__bl-no--clickable"
        @click="$emit('blNo:click', props.item)"
      >
        {{ blNo }}
      </div>
      <div v-if="badges.length" class="ebl-card-item__badges">
        <EblBadge
          v-for="(badge, index) in badges"
          :key="index"
          v-tooltip="{ text: badge?.tooltip, scrollStrategy: 'close', location: 'top' }"
          :variant="badge?.variant || 'tonal'"
          :color="badge?.color || 'gray'"
        >
          {{ badge.label }}
        </EblBadge>
      </div>
    </div>

    <EblAvatarLabel
      class="ebl-card-item__shipper"
      :title="shipper.name"
      :logo="shipper.logo"
      :subtitle="shipper?.subtitle ?? ''"
    />

    <div v-if="requestText" class="ebl-card-item__request">
      {{ requestText }}
    </div>
    <EblRoute
      v-if="hasRoute"
      class="ebl-card-item__route"
      :from="routeFrom"
      :to="routeTo"
      :from-code="routeFromCode"
      :to-code="routeToCode"
    />

    <!-- <EblRoute :from="routeFrom" :to="routeTo" /> -->

    <div class="ebl-card-item__date">{{ date }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  outlined: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['blNo:click'])

const blNo = computed(() => props.item?.blNo || props.item?.bl || props.item?.no || '')
const badges = computed(() => props.item?.badges || [])
const shipper = computed(() => props.item?.shipper || {})
const routeFrom = computed(() => props.item?.routeFrom || props.item?.route?.from || '')
const routeTo = computed(() => props.item?.routeTo || props.item?.route?.to || '')
const routeFromCode = computed(() => props.item?.routeFromCode || props.item?.route?.fromCode || '')
const routeToCode = computed(() => props.item?.routeToCode || props.item?.route?.toCode || '')
const requestText = computed(() => props.item?.requestText ?? '')
const hasRoute = computed(() =>
  Boolean(routeFrom.value || routeTo.value || routeFromCode.value || routeToCode.value),
)
const date = computed(() => props.item?.date || props.item?.sentAt || '')
</script>

<style lang="scss" scoped>
.ebl-card-item__bl-no--clickable {
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
