<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="danger" large @click="onDelete">Delete</EblBtn>
        <EblBtn color="primary" outlined large @click="onSave">Save</EblBtn>
      </template>
    </EblPageHeader>

    <div class="ebl-card-container mb-3">
      <EblSubHeader small>
        <h2>B/L No</h2>
      </EblSubHeader>
      <!-- no="HDMUSELM70328426"
        :badges="[
          { value: 'ISSUED', color: 'mint', icon: 'ebli:document' },
          { value: 'ISSUE', icon: 'ebli:check-circle' },
        ]" -->
      <EblBlNo
        @click="(v) => console.log('EblBlNo clicked', v)"
        @click-empty="console.log('EblBlNo empty clicked')"
        @refresh="console.log('Refresh clicked')"
      />
    </div>
    <div class="ebl-card-container">
      <div class="d-flex justify-end ga-2">
        <EblBtn color="tertiary" disabled> Amendment </EblBtn>
        <EblBtn color="tertiary" disabled> Paper </EblBtn>
        <EblBtn color="tertiary" disabled> Delivery </EblBtn>
      </div>
      <EblSubHeader small>
        <h2>Recipient</h2>
      </EblSubHeader>
      <!-- :items="{
          name: 'KTNETEBL1',
          logo: 'https://i.pravatar.cc/150',
          address: '338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR',
        }" -->
      <EblRecipient
        class="mb-8"
        @click="(v) => console.log('Recipient clicked', v)"
        @click-empty="console.log('Recipient empty clicked')"
        @refresh="console.log('Refresh clicked')"
      />
      <div class="ebl-2-column mb-8">
        <div class="ebl-compose-preview-section">
          <EblSubHeader small>
            <h2>B/L Preview</h2>
          </EblSubHeader>
          <v-sheet color="#F5F7FA" height="340" class="pt-8 px-4">
            <v-skeleton-loader
              color="#F5F7FA"
              class="border"
              type="image, heading"
            ></v-skeleton-loader>
          </v-sheet>
        </div>
        <div class="ebl-compose-history-section">
          <EblSubHeader small>
            <h2>B/L History</h2>
          </EblSubHeader>
          <v-sheet color="#F5F7FA" height="340" class="pt-8 px-4 ga-2 d-flex flex-column">
            <v-skeleton-loader color="#F5F7FA" type="list-item-avatar-two-line"></v-skeleton-loader>
            <v-skeleton-loader color="#F5F7FA" type="list-item-avatar-two-line"></v-skeleton-loader>
            <v-skeleton-loader color="#F5F7FA" type="list-item-avatar-two-line"></v-skeleton-loader>
            <v-skeleton-loader color="#F5F7FA" type="list-item-avatar-two-line"></v-skeleton-loader>
          </v-sheet>
        </div>
      </div>
      <EblSubHeader small>
        <h2>Attach Documents</h2>
      </EblSubHeader>
      <v-skeleton-loader color="#F5F7FA" class="border mb-8" type="paragraph"></v-skeleton-loader>
      <EblSubHeader small>
        <h2>Message</h2>
      </EblSubHeader>
      <v-skeleton-loader color="#F5F7FA" class="border" type="paragraph"></v-skeleton-loader>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

// 페이지 정보
const pageInfo = ref({
  title: 'Compose Envelope',
  breadcrumbItems: [{ text: 'Menu' }, { text: 'Documents' }, { text: 'Compose Envelope' }],
})
</script>
