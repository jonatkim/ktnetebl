<template>
  <div class="ebl-exception-page">
    <div class="ebl-exception-page__panel">
      <div class="ebl-exception-page__image">
        <VImg :src="maintenanceImg" alt="Under Maintenance" />
      </div>
      <h1 class="ebl-exception-page__title">Under Maintenance</h1>
      <p class="ebl-exception-page__message">
        We are currently performing system maintenance.
        <br />
        We expect to be back up and running soon.
      </p>

      <div class="ebl-exception-page__meta">
        <p class="ebl-exception-page__meta-title">Maintenance Period</p>
        <p class="ebl-exception-page__meta-text">YYYY.MM.DD hh:mm ~ YYYY.MM.DD hh:mm</p>
      </div>

      <div class="ebl-exception-page__meta">
        <p class="ebl-exception-page__meta-title">Inquiries</p>
        <p class="ebl-exception-page__meta-text">support@example.com</p>
      </div>

      <div class="ebl-exception-page__actions">
        <EblBtn color="cta" large @click="navigateTo('/')">Home</EblBtn>
        <EblBtn outlined large @click="router.back()">Go Back</EblBtn>
      </div>
    </div>
  </div>
</template>

<script setup>
import maintenanceImg from '~/assets/images/common/maintenance.png?url'
definePageMeta({ layout: 'blank' })
const router = useRouter()
</script>
