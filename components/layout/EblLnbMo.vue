<template>
  <VNavigationDrawer
    v-model="drawerModel"
    class="ebl-lnb-mo"
    width="360"
    temporary
    location="right"
    mobile
    touchless
  >
    <template #prepend>
      <div class="ebl-lnb-mo__header">
        <div>
          <VImg src="~/assets/images/common/eblk.svg?url" width="80" height="26.6" alt="EBLK" />
        </div>
        <VSpacer />
        <EblSelect
          v-model="currentLocale"
          :options="[
            { label: 'EN', value: 'en' },
            { label: 'KO', value: 'ko' },
          ]"
          prepend-icon="ebli:global"
        />
        <EblBtn icon color="ghost" class="btn-close" @click="onCloseAndEmit">
          <VIcon icon="ebli:close" :size="24" />
        </EblBtn>
      </div>
    </template>
    <div class="ebl-toggle-service-mo ebl-toggle-service-mo--wrap" :class="`is-${workspaceMode}`">
      <div class="ebl-toggle-service-mo__inner">
        <div class="ebl-toggle-service-mo__thumb" />
        <button
          type="button"
          :class="[
            'ebl-toggle-service-mo__option',
            { 'ebl-toggle-service-mo__option--active': workspaceMode === 'workspace' },
          ]"
          @click="setWorkspaceMode('workspace')"
        >
          Workspace
        </button>
        <button
          type="button"
          :class="[
            'ebl-toggle-service-mo__option',
            { 'ebl-toggle-service-mo__option--active': workspaceMode === 'service' },
          ]"
          @click="setWorkspaceMode('service')"
        >
          Service
        </button>
      </div>
    </div>
    <VList
      v-model:opened="serviceOpened"
      nav
      dense
      class="ebl-lnb-mo__section"
      open-strategy="single"
    >
      <template v-if="workspaceMode === 'workspace'">
        <h2 class="ebl-lnb-mo__title">Workspace</h2>
        <template v-for="section in workspaceMenus" :key="section.key">
          <VListGroup
            v-if="section.children?.length"
            :value="section.key"
            class="ebl-lnb-mo__group"
          >
            <template #activator="{ props: activatorProps, isOpen }">
              <VListItem
                v-bind="activatorProps"
                class="ebl-lnb-mo__parent"
                :active="section.children.some((child) => isScreenIdInRoute(child.screenId))"
                :ripple="false"
              >
                <VListItemTitle :class="{ 'is-active': isOpen }">{{
                  section.label
                }}</VListItemTitle>
                <template #append>
                  <VIcon
                    :icon="isOpen ? 'ebli:chevron-bottom' : 'ebli:chevron-bottom'"
                    :class="{ 'rotate-180': isOpen }"
                    :size="20"
                  />
                </template>
              </VListItem>
            </template>

            <VListItem
              v-for="child in section.children"
              :key="`${section.key}-${child.screenId}`"
              class="ebl-lnb-mo__child"
              :active="isScreenIdInRoute(child.screenId)"
              :ripple="false"
              @click="selectAndClose(child.screenId)"
            >
              <VListItemTitle>{{ child.label }}</VListItemTitle>
            </VListItem>
          </VListGroup>

          <VListItem
            v-else
            class="ebl-lnb-mo__parent"
            :active="isScreenIdInRoute(section.screenId)"
            :ripple="false"
            @click="selectAndClose(section.screenId)"
          >
            <VListItemTitle>{{ section.label }}</VListItemTitle>
          </VListItem>
        </template>
        <div class="mt-12">
          <VDivider />
          <div class="ebl-lnb-mo__utils">
            <NuxtLink to="#" class="ebl-lnb-mo__terms-item">Privacy Policy</NuxtLink>
          </div>
        </div>
      </template>

      <template v-else>
        <h2 class="ebl-lnb-mo__title">Service</h2>

        <template v-for="section in serviceMenus" :key="section.key">
          <VListGroup
            v-if="section.children?.length"
            :value="section.key"
            class="ebl-lnb-mo__group"
          >
            <template #activator="{ props: activatorProps, isOpen }">
              <VListItem
                v-bind="activatorProps"
                class="ebl-lnb-mo__parent"
                :active="section.children.some((child) => isScreenIdInRoute(child.screenId))"
                :ripple="false"
              >
                <VListItemTitle :class="{ 'is-active': isOpen }">{{
                  section.label
                }}</VListItemTitle>
                <template #append>
                  <VIcon
                    :icon="isOpen ? 'ebli:chevron-bottom' : 'ebli:chevron-bottom'"
                    :class="{ 'rotate-180': isOpen }"
                    :size="20"
                  />
                </template>
              </VListItem>
            </template>

            <VListItem
              v-for="child in section.children"
              :key="`${section.key}-${child.screenId}`"
              class="ebl-lnb-mo__child"
              :active="isScreenIdInRoute(child.screenId)"
              :ripple="false"
              @click="pushServiceRoute(child.screenId)"
            >
              <VListItemTitle>{{ child.label }}</VListItemTitle>
            </VListItem>
          </VListGroup>

          <VListItem
            v-else
            class="ebl-lnb-mo__parent"
            :active="isScreenIdInRoute(section.screenId)"
            :ripple="false"
            @click="pushServiceRoute(section.screenId)"
          >
            <VListItemTitle>{{ section.label }}</VListItemTitle>
          </VListItem>
        </template>
      </template>
    </VList>
    <template #append>
      <div class="ebl-lnb-mo__footer">
        <EblBtn large outlined class="btn-sign" @click="handleSignOut">
          {{ isSignedOut ? 'Sign in' : 'Sign out' }}
        </EblBtn>
      </div>
    </template>
  </VNavigationDrawer>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '~/stores/useMainStore'
import { useDialogStore } from '~/stores/useDialogStore'
import { useLocale } from '~/composables/useLocale'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const main = useMainStore()
const dialogStore = useDialogStore()
const { locale, setLocale } = useLocale()

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => {
    setLocale(value)
  },
})
const currentRoute = computed(() => router.currentRoute.value)
const userType = computed(() => main.userType)
const workspaceMode = ref('workspace')
const isSignedOut = ref(false)
const serviceOpened = ref([])

const isScreenIdInRoute = (screenId) => {
  return currentRoute.value.path.includes(screenId)
}

const getDashboardScreenId = computed(() => {
  const typeMap = {
    carrier: 'EBLCDB010U',
    shipper: 'EBLSDB010U',
    bank: 'EBLBDB010U',
  }
  return typeMap[userType.value] || 'EBLCDB010U'
})

const toEblMobilePath = (screenId) => {
  const group = screenId.substring(3, 6).toLowerCase()
  return `/mo/ebl/${group}/${screenId}`
}

const toPortalPath = (screenId) => {
  const group = screenId.substring(3, 6).toLowerCase()
  return `/portal/${group}/${screenId}`
}

const drawerModel = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) {
      workspaceMode.value = 'workspace'
      serviceOpened.value = []
    }
    emit('update:modelValue', value)
  },
})

// Workspace 메뉴 (하드코딩)
const workspaceMenus = computed(() => [
  {
    key: 'dashboard',
    label: 'Dashboard',
    screenId: getDashboardScreenId.value,
  },
  {
    key: 'documents',
    label: 'Documents',
    children: [
      { label: 'Sent', screenId: 'EBLCDC050U' },
      { label: 'Draft', screenId: 'EBLCDC060U' },
      { label: 'Incoming', screenId: 'EBLCDC070U' },
      { label: 'Archive', screenId: 'EBLCDC080U' },
    ],
  },
  {
    key: 'management',
    label: 'Management',
    children: [
      { label: 'Partners', screenId: 'EBLPAT010U' },
      { label: 'Payments', screenId: 'EBLPAY010U' },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    children: [{ label: 'Notifications', screenId: 'EBLSET010U' }],
  },
  {
    key: 'help-desk',
    label: 'Help Desk',
    children: [
      { label: 'Notices', screenId: 'EBLUGD080U' },
      { label: 'FAQ', screenId: 'EBLUGD030U' },
      { label: 'Q&A', screenId: 'EBLUGD040U' },
      { label: 'Download', screenId: 'EBLUGD050U' },
    ],
  },
])

// Service 메뉴 (하드코딩)
const serviceMenus = computed(() => [
  {
    key: 'solutions',
    label: 'Solutions',
    children: [
      { label: 'Digital Axis', screenId: 'PSMSOL010U' },
      { label: 'Electronic B/L', screenId: 'PSMSOL020U' },
      { label: 'Negotiation', screenId: 'PSMSOL030U' },
      { label: 'Presentation', screenId: 'PSMSOL040U' },
    ],
  },
  {
    key: 'platform',
    label: 'Platform',
    children: [
      { label: 'Technology', screenId: 'PSMPLT010U' },
      { label: 'Security', screenId: 'PSMPLT020U' },
      { label: 'Industrial Standards', screenId: 'PSMPLT030U' },
    ],
  },
  {
    key: 'resources',
    label: 'Resources',
    children: [
      { label: 'FAQ', screenId: 'PSMRSC010U' },
      { label: 'Tutorials', screenId: 'PSMRSC020U' },
    ],
  },
  {
    key: 'company',
    label: 'Company',
    children: [
      { label: 'About KTNET', screenId: 'PSMCPN010U' },
      { label: 'Contact Us', screenId: 'PSMCPN020U' },
    ],
  },
])

const selectAndClose = (screenId) => {
  router.push(toEblMobilePath(screenId))
  emit('update:modelValue', false)
}

const onCloseAndEmit = () => {
  drawerModel.value = false
}

const changeLocale = async (lang) => {
  if (currentLocale.value === lang) return
  await setLocale(lang)
}

const setWorkspaceMode = (mode) => {
  workspaceMode.value = mode
}

const pushServiceRoute = (screenId) => {
  if (!screenId) return
  router.push(toPortalPath(screenId))
  emit('update:modelValue', false)
}

const handleSignOut = async () => {
  if (isSignedOut.value) {
    // router.push('/portal/sin/PSMSIN010U')
    console.log(`Redirecting to sign-in page... \n router.push('/portal/sin/PSMSIN010U')`) // 실제 라우팅 대신 로그 출력
    emit('update:modelValue', false)
    return
  }

  const confirmed = await dialogStore.showConfirm({
    title: 'Sign out',
    message: 'You will be returned to the home screen.\nAre you sure you want to log out?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  })

  if (!confirmed) return
  isSignedOut.value = true
}
</script>
