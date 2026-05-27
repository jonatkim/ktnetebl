<template>
  <VNavigationDrawer class="pub-lnb" width="240" permanent flat>
    <!-- 퍼블 가이드 LNB -->
    <VList nav>
      <VListSubheader class="pub-lnb__header">Components</VListSubheader>

      <VListItem
        v-for="component in components"
        :key="component.path"
        :active="isActive(component.path)"
        class="pub-lnb__item"
        @click="navigate(component.path)"
      >
        <template #prepend>
          <VIcon>{{ component.icon }}</VIcon>
        </template>
        <VListItemTitle>{{ component.title }}</VListItemTitle>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

const components = [
  {
    title: 'Button',
    path: '/publish/guide/buttons',
    icon: 'mdi-button-pointer',
  },
  {
    title: 'Tabs',
    path: '/publish/guide/tabs',
    icon: 'mdi-tab',
  },
  {
    title: 'Breadcrumb',
    path: '/publish/guide/breadcrumb',
    icon: 'mdi-map-marker-path',
  },
  {
    title: 'Checkbox',
    path: '/publish/guide/checkbox',
    icon: 'mdi-checkbox-multiple-marked',
  },
  {
    title: 'Radio Button',
    path: '/publish/guide/radio',
    icon: 'mdi-radiobox-marked',
  },
  {
    title: 'Switch',
    path: '/publish/guide/switch',
    icon: 'mdi-toggle-switch',
  },
  {
    title: 'Icons',
    path: '/publish/guide/icons',
    icon: 'mdi-image',
  },
  {
    title: 'Badge',
    path: '/publish/guide/badge',
    icon: 'mdi-label',
  },
  {
    title: 'Tooltip',
    path: '/publish/guide/tooltip',
    icon: 'mdi-tooltip-text',
  },
  {
    title: 'Pagination',
    path: '/publish/guide/pagination',
    icon: 'mdi-page-layout-footer',
  },
  {
    title: 'Toast',
    path: '/publish/guide/toast',
    icon: 'mdi-bell-outline',
  },
  {
    title: 'Dialog',
    path: '/publish/guide/dialog',
    icon: 'mdi-message-outline',
  },
  {
    title: 'Info',
    path: '/publish/guide/info',
    icon: 'mdi-information-outline',
  },
  {
    title: 'Textfield',
    path: '/publish/guide/textfield',
    icon: 'mdi-form-textbox',
  },
  {
    title: 'Textarea',
    path: '/publish/guide/textarea',
    icon: 'mdi-text-box-multiple-outline',
  },
  {
    title: 'Data Grid',
    path: '/publish/guide/table',
    icon: 'mdi-table',
  },
  {
    title: 'Date Picker',
    path: '/publish/guide/datepicker',
    icon: 'mdi-calendar-month',
  },
  {
    title: 'Select',
    path: '/publish/guide/select',
    icon: 'mdi-menu-down',
  },
  {
    title: 'File Input',
    path: '/publish/guide/fileinput',
    icon: 'mdi-file-upload-outline',
  },
  {
    title: 'i18n Guide',
    path: '/publish/guide/i18n',
    icon: 'mdi-translate',
  },
  {
    title: 'Routing',
    path: '/publish/guide/routing',
    icon: 'mdi-routes',
  },
]

function isActive(path) {
  return route.path === path
}

function navigate(path) {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style lang="scss" scoped>
.pub-lnb {
  background: #fff;

  &__header {
    font-size: 12px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 16px 12px 8px;
    height: auto;
  }

  &__item {
    font-size: 14px;
    padding: 8px 12px;
    margin: 0 8px 4px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    &.v-list-item--active {
      background: rgba(25, 118, 210, 0.08);
      color: #1976d2;
      font-weight: 500;

      :deep(.v-icon) {
        color: #1976d2;
      }
    }
  }
}
</style>
