<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #tooltip>
        •사용자의 개인 정보 및 회사 정보를 관리합니다.<br />
        •변경사항은 저장 버튼을 클릭하여 저장됩니다.
      </template>
    </EblPageHeader>
    <div class="ebl-card-container pb-">
      <!-- User Info Section -->
      <EblSubHeader class="cursor-pointer">
        <h2>User Info</h2>
      </EblSubHeader>

      <EblInfo style="--ebl-info-label-width: 170px">
        <EblInfoItem label="MID" has-input class="px-4">
          <EblInput v-model="formData.mid" readonly placeholder="User Name" style="width: 250px" />
        </EblInfoItem>
        <VDivider class="my-2" />

        <EblInfoItem label="Password" has-input class="px-4">
          <EblBtn outlined>Change Password</EblBtn>
        </EblInfoItem>
        <VDivider class="my-2" />

        <EblInfoItem label="User Name" has-input class="px-4">
          <EblInput v-model="formData.userName" placeholder="User Name" style="width: 250px" />
        </EblInfoItem>
        <VDivider class="my-2" />

        <EblInfoItem label="Phone Number" has-input class="px-4">
          <EblInput
            v-model="formData.phoneNumber"
            placeholder="Phone Number"
            style="width: 250px"
          />
        </EblInfoItem>
        <VDivider class="my-2" />

        <EblInfoItem label="Fax Number" has-input class="px-4">
          <EblInput v-model="formData.faxNumber" placeholder="Fax Number" style="width: 250px" />
        </EblInfoItem>
        <VDivider class="my-2" />

        <EblInfoItem label="Permission Type" has-input class="px-4">
          <EblInput
            v-model="formData.permissionType"
            placeholder="Permission Type"
            readonly
            style="width: 250px"
          />
        </EblInfoItem>
        <VDivider class="mt-2" />
      </EblInfo>
    </div>
  </div>
</template>

<script setup>
// 페이지 정보
const pageInfo = ref({
  title: 'My profile',
  breadcrumbItems: [{ text: 'Dashboard' }, { text: 'Settings' }, { text: 'My profile' }],
})

// Form data
const formData = reactive({
  mid: 'xxx@ktnet.co.kr',
  userName: 'Gil-Dong Hong',
  phoneNumber: 'XXXXXXXXXXXX',
  faxNumber: 'XXXXXXXXXXXX',
  permissionType: 'XXXXXXXXXXXX',
})
</script>
