<template>
  <div class="psm-account-container">
    <div class="psm-account-card psm-account-card--register">
      <div class="psm-account-card__header">
        <h1>Registed Information</h1>
      </div>
      <div class="psm-account-card__body">
        <EblSubHeader title="In-Progress Tasks" />
        <EblInfo class="psm-account-form psm-account-form--register">
          <EblInfoItem label="HMM Shipper ID">{{ registeredInfo.shipperId }}</EblInfoItem>
          <EblInfoItem label="MID">{{ registeredInfo.mid }}</EblInfoItem>
          <EblInfoItem label="User Name">{{ registeredInfo.userName }}</EblInfoItem>
          <EblInfoItem label="Phone Number">{{ registeredInfo.phoneNumber }}</EblInfoItem>
          <EblInfoItem label="Fax Number">{{ registeredInfo.faxNumber }}</EblInfoItem>
        </EblInfo>

        <VDivider class="my-6" />

        <EblSubHeader title="Payments Info" />
        <EblInfo class="psm-account-form psm-account-form--register">
          <EblInfoItem label="Card No">{{ registeredInfo.cardNo }}</EblInfoItem>
          <EblInfoItem label="Payment Date">{{ registeredInfo.paymentDate }}</EblInfoItem>
        </EblInfo>

        <VDivider class="my-6" />

        <EblSubHeader title="Company Info" />
        <EblInfo class="psm-account-form psm-account-form--register">
          <EblInfoItem label="Country">{{ registeredInfo.country }}</EblInfoItem>
          <EblInfoItem label="Role">{{ registeredInfo.role }}</EblInfoItem>
          <EblInfoItem label="Company Name">{{ registeredInfo.companyName }}</EblInfoItem>
          <EblInfoItem label="DUNS Number">{{ registeredInfo.dunsNumber }}</EblInfoItem>
          <EblInfoItem label="Corporation Number">{{
            registeredInfo.corporationNumber
          }}</EblInfoItem>
          <EblInfoItem label="Owner">{{ registeredInfo.owner }}</EblInfoItem>
          <EblInfoItem label="Zip code">{{ registeredInfo.zipCode }}</EblInfoItem>
          <EblInfoItem label="Spot Code">{{ registeredInfo.spotCode }}</EblInfoItem>
          <EblInfoItem label="City/Region">{{ registeredInfo.cityRegion }}</EblInfoItem>
          <EblInfoItem label="Address 1">{{ registeredInfo.address1 }}</EblInfoItem>
          <EblInfoItem label="Address 2">{{ registeredInfo.address2 }}</EblInfoItem>
          <EblInfoItem label="Company Logo" :vertical="isMobile">
            <VImg :src="registeredInfo.companyLogo" alt="Company Logo" class="psm-register-logo" />
          </EblInfoItem>
        </EblInfo>

        <VDivider class="my-6" />

        <EblSubHeader title="Consent To Receive" />
        <EblInfo class="psm-account-form psm-account-form--register">
          <EblInfoItem label="E-Mail">{{ registeredInfo.emailConsent }}</EblInfoItem>
          <EblInfoItem label="SMS">{{ registeredInfo.smsConsent }}</EblInfoItem>
        </EblInfo>
      </div>

      <div class="psm-account-card__footer actions">
        <EblBtn color="cta" large class="psm-account-form__submit">Check</EblBtn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import companyLogoSample from '~/assets/images/portal/etc_logo_01.png?url'

definePageMeta({ layout: 'blank' })
const { smAndDown } = useDisplay()
const isMobile = smAndDown

const registeredInfo = {
  shipperId: 'HMM-SHP-000123',
  mid: 'example@email.com',
  userName: 'JOHN KIM',
  phoneNumber: '+82 10-1234-5678',
  faxNumber: '+82 2-1234-5678',
  cardNo: '1234-5678-9012-3456',
  paymentDate: '5th Of Every Month',
  country: 'Korea',
  role: 'Shipper',
  companyName: 'KTNET Networks',
  dunsNumber: '12-345-6789',
  corporationNumber: '110111-1234567',
  owner: 'BM KIM',
  zipCode: '04524',
  spotCode: 'KRSEL',
  cityRegion: 'Seoul',
  address1: '1, Uisadang-daero, Yeongdeungpo-gu very very long address that should be truncated',
  address2: 'Gangnam-gu',
  companyLogo: companyLogoSample,
  emailConsent: 'Agreement',
  smsConsent: 'Agreement',
}
</script>
