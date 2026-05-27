<template>
  <div class="ebl-tx-card">
    <!-- Header: Badge + Expand/Collapse Icon -->
    <div class="ebl-tx-card__header">
      <EblBadge variant="tonal" color="gray">{{ transaction.type }}</EblBadge>
      <VSpacer />
      <VIcon
        icon="ebli:chevron-bottom"
        class="ebl-tx-card__toggle-icon"
        :class="{ 'is-expanded': isExpanded }"
        role="button"
        :size="24"
        @click="$emit('click')"
      />
    </div>

    <!-- Actor / Recipient Section (Always visible) -->
    <div class="ebl-tx-card__parties">
      <div class="ebl-tx-card__party">
        <div class="ebl-tx-card__avatar">
          <VImg
            :src="transaction.actor.logo"
            :alt="transaction.actor.name || 'avatar'"
            width="25"
            height="25"
          />
        </div>
        <div class="ebl-tx-card__party-content">
          <div class="ebl-tx-card__party-label">Actor</div>
          <span class="ebl-tx-card__party-name">{{ transaction.actor.name }}</span>
        </div>
      </div>
      <VDivider />
      <div class="ebl-tx-card__party">
        <div class="ebl-tx-card__avatar">
          <VImg
            :src="transaction.recipient.logo"
            :alt="transaction.recipient.name || 'avatar'"
            width="25"
            height="25"
          />
        </div>
        <div class="ebl-tx-card__party-content">
          <div class="ebl-tx-card__party-label">Recipient</div>
          <span class="ebl-tx-card__party-name">{{ transaction.recipient.name }}</span>
        </div>
      </div>
    </div>

    <!-- Comments Section (Expandable) -->
    <VExpandTransition>
      <div
        v-if="isExpanded && transaction.comments && transaction.comments.length > 0"
        class="ebl-tx-card__comments-section"
      >
        <div v-for="(comment, idx) in transaction.comments" :key="idx" class="ebl-tx-card__comment">
          {{ comment }}
        </div>
      </div>
    </VExpandTransition>

    <!-- DateTime Section (Always visible) -->
    <div class="ebl-tx-card__footer">
      <span class="ebl-tx-card__datetime">{{ transaction.datetime }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { VExpandTransition } from 'vuetify/components'

defineProps({
  transaction: {
    type: Object,
    default: () => ({
      type: '',
      datetime: '',
      actor: { name: '', logo: '' },
      recipient: { name: '', logo: '' },
      comments: [],
    }),
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>
