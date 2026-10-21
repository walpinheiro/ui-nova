<script setup lang="ts">
import { ref } from 'vue'
import VSidebar from '../../../components/navigation/VSidebar/VSidebar.vue'
import VNavItem from '../../../components/navigation/VNavItem/VNavItem.vue'
import VTooltip from '../../../components/feedback/VTooltip/VTooltip.vue'
import VButton from '../../../components/form/VButton/VButton.vue'
import { VIcon } from '../../../components/primitives/VIcon'
import collapseIcon from '@iconify-icons/keyline-icons/chevrons-left'
import helpIcon from '@iconify-icons/keyline-icons/circle-question'
import logoutIcon from '@iconify-icons/keyline-icons/door-open'
import ThemeToggle from '../../_shared/ThemeToggle.vue'
import '../../_shared/sidebarPatterns.scss'

/** Workspace rail: icon-only by default, expands to show the labels (`v-model:collapsed`). */
const collapsed = defineModel<boolean>('collapsed', { default: true })

const items = [
  { value: 'grid', label: 'Dashboard', icon: 'grid' },
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'cloud', label: 'Environments', icon: 'cloud' },
  { value: 'cost', label: 'Cost', icon: 'dollar' },
  { value: 'keys', label: 'API keys', icon: 'key' },
  { value: 'integrations', label: 'Integrations', icon: 'plug' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
]
const footItems = [
  { value: 'help', label: 'Help', icon: helpIcon },
  { value: 'logout', label: 'Sign out', icon: logoutIcon },
]
const active = ref('grid')
</script>

<template>
  <VSidebar
    v-model:active-item="active"
    v-model:collapsed="collapsed"
    class="rail sp-rail"
    :items="items"
    :show-search="false"
    :show-brand="false"
    aria-label="Workspace"
  >
    <template #header="{ collapsed: isCollapsed, toggle }">
      <!-- the header slot replaces the brand (and its inline toggle), so the expanded state brings its own -->
      <div class="sp-rail__head" :class="{ 'is-collapsed': isCollapsed }">
        <ThemeToggle :variant="isCollapsed ? 'icon' : 'segmented'" />
        <VButton v-if="!isCollapsed" variant="icon" size="sm" aria-label="Collapse sidebar" @click="toggle">
          <template #icon><VIcon :icon="collapseIcon" size="sm" /></template>
        </VButton>
      </div>
    </template>

    <template #footer>
      <div class="sp-rail__foot">
        <VTooltip v-for="f in footItems" :key="f.value" :content="f.label" placement="right" :disabled="!collapsed">
          <VNavItem :label="f.label" :collapsed="collapsed" :aria-label="f.label">
            <template #icon><VIcon :icon="f.icon" size="sm" /></template>
          </VNavItem>
        </VTooltip>
      </div>
    </template>
  </VSidebar>
</template>

<style scoped>
@media (max-width: 720px) {
  .rail { width: auto; max-height: none; min-height: 0; border-right: 0; border-bottom: 1px solid var(--v-color-divider); }
}
</style>
