<script setup lang="ts">
import './VAppShell.scss'
import { VIcon } from '../../primitives/VIcon'
import { APP_SHELL_UI_ICONS, resolveQuickActionIcon } from './mountVAppShell'
import { useVAppShell } from './useVAppShell'
import type { VAppShellEmits, VAppShellProps } from './VAppShell.types'

const props = withDefaults(defineProps<VAppShellProps>(), {
  variant: 'dashboard',
  layoutMode: 'desktop',
  sidebarCollapsed: false,
  utilityOpen: true,
  showUtility: true,
  showBuiltInTopBar: true,
})

const emit = defineEmits<VAppShellEmits>()
const vm = useVAppShell(props, (event, ...args) => {
  const handler = emit as (name: keyof VAppShellEmits, ...payload: unknown[]) => void
  handler(event, ...args)
})
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <slot v-if="$slots.topbar" name="topbar" />
    <header
      v-else-if="showBuiltInTopBar"
      class="v-appshell__topbar"
      role="banner"
      data-test-id="v-appshell-topbar"
    >
      <div class="v-appshell__brand">
        <VIcon :icon="APP_SHELL_UI_ICONS.dashboard" size="sm" />
        <span>{{ vm.config.value.brandName }}</span>
      </div>

      <div
        class="v-appshell__search"
        :class="{ 'v-appshell__search--focused': vm.searchFocused.value }"
        data-test-id="v-appshell-search"
      >
        <VIcon :icon="APP_SHELL_UI_ICONS.search" size="sm" />
        <input
          class="v-appshell__search-input"
          type="search"
          :placeholder="vm.config.value.searchPlaceholder"
          :value="vm.searchQuery.value"
          @focus="vm.searchFocused.value = true"
          @blur="vm.searchFocused.value = false"
          @input="vm.onSearchInput($event)"
        />
        <button
          v-if="vm.searchQuery.value"
          type="button"
          class="v-appshell__search-clear"
          aria-label="Clear search"
          @click="vm.clearSearch()"
        >
          <VIcon :icon="APP_SHELL_UI_ICONS.close" size="sm" />
        </button>
        <kbd class="v-appshell__search-shortcut" aria-hidden="true">{{ vm.config.value.searchShortcut }}</kbd>
      </div>

      <div class="v-appshell__topbar-actions">
        <button type="button" class="v-appshell__icon-button" aria-label="Notifications">
          <VIcon :icon="APP_SHELL_UI_ICONS.bell" size="sm" />
        </button>
        <button type="button" class="v-appshell__icon-button" aria-label="Toggle theme">
          <VIcon :icon="APP_SHELL_UI_ICONS.sun" size="sm" />
        </button>
        <span class="v-appshell__avatar" aria-hidden="true">{{ vm.config.value.userAvatar }}</span>
      </div>
    </header>

    <div class="v-appshell__body">
      <aside
        class="v-appshell__sidebar"
        role="navigation"
        aria-label="Primary navigation"
        data-test-id="v-appshell-sidebar"
      >
        <slot name="sidebar">
          <nav class="v-appshell__sidebar-nav">
            <button
              v-for="item in vm.resolvedNavItems.value"
              :key="item.value"
              type="button"
              class="v-appshell__nav-item"
              :class="{ 'v-appshell__nav-item--active': vm.activeItem.value === item.value }"
              :aria-current="vm.activeItem.value === item.value ? 'page' : undefined"
              :data-test-id="`v-appshell-nav-${item.value}`"
              @click="vm.selectNav(item.value)"
              @keydown="vm.onNavKeydown($event, item.value)"
            >
              <VIcon v-if="item.iconData" :icon="item.iconData" size="sm" />
              <span v-if="!vm.collapsed.value" class="v-appshell__nav-label">{{ item.label }}</span>
            </button>
          </nav>
        </slot>
      </aside>

      <main class="v-appshell__main" role="main" data-test-id="v-appshell-content">
        <slot />
      </main>

      <aside
        v-if="showUtility && (utilityOpen || $slots.utility)"
        class="v-appshell__utility"
        data-test-id="v-appshell-utility"
        aria-label="Utility panel"
      >
        <slot name="utility">
          <div class="v-appshell__utility-header">
            <h2 class="v-appshell__section-label v-appshell__utility-title">Quick actions</h2>
            <button
              type="button"
              class="v-appshell__icon-button"
              aria-label="Close utility panel"
              @click="vm.closeUtility()"
            >
              <VIcon :icon="APP_SHELL_UI_ICONS.close" size="sm" />
            </button>
          </div>

          <div class="v-appshell__quick-actions">
            <button
              v-for="action in vm.config.value.quickActions"
              :key="action.name"
              type="button"
              class="v-appshell__quick-action"
              :data-test-id="`v-appshell-quickaction-${action.name}`"
              @click="vm.onQuickAction(action.name)"
            >
              <VIcon :icon="resolveQuickActionIcon(action.icon)" size="sm" />
              {{ action.label }}
            </button>
          </div>

          <div class="v-appshell__shortcuts">
            <p class="v-appshell__section-label">Shortcuts</p>
            <button
              v-for="shortcut in vm.config.value.shortcuts"
              :key="shortcut.keys"
              type="button"
              class="v-appshell__shortcut"
              @click="vm.onShortcut(shortcut.keys)"
            >
              {{ shortcut.label }}
              <span class="v-appshell__shortcut-keys">{{ shortcut.keys }}</span>
            </button>
          </div>
        </slot>
      </aside>
    </div>
  </div>
</template>
