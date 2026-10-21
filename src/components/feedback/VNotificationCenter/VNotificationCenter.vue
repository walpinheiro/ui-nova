<script setup lang="ts">
import './VNotificationCenter.scss'
import { VIcon } from '../../primitives/VIcon'
import VEmptyState from '../VEmptyState/VEmptyState.vue'
import VNotificationItem from '../VNotificationItem/VNotificationItem.vue'
import { useVNotificationCenter } from './useVNotificationCenter'
import type { VNotificationCenterEmit, VNotificationCenterProps } from './VNotificationCenter.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VNotificationCenterProps>(), {
  size: 'md',
  variant: 'default',
  placement: 'bottom-end',
  activeTab: 'all',
  searchQuery: '',
  disabled: false,
  loading: false,
  notifications: () => [],
  motion: V_MOTION_DEFAULT,
})
const emit = defineEmits<VNotificationCenterEmit>()
const vm = useVNotificationCenter(props, emit)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <span
      :id="vm.liveId"
      class="v-notification-center__sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ vm.liveMessage.value }}
    </span>

    <button
      v-if="vm.config.value.showTrigger"
      :ref="vm.triggerRef"
      type="button"
      v-bind="vm.triggerAttrs.value"
      :disabled="vm.config.value.disabled"
      @click="vm.toggleOpen"
    >
      <span class="v-notification-center__bell" data-test-id="v-notification-center-bell" aria-hidden="true">
        <VIcon :icon="vm.config.value.bellIcon" :size="size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'" />
      </span>
      <span
        v-if="vm.isExpressive.value && vm.open.value"
        class="v-notification-center__trigger-label"
        data-test-id="v-notification-center-trigger-label"
      >
        {{ vm.config.value.expressiveLabel }}
      </span>
      <span
        v-if="vm.config.value.unreadCount > 0"
        class="v-notification-center__badge"
        data-test-id="v-notification-center-badge"
        aria-hidden="true"
      >
        {{ vm.config.value.unreadCount > 9 ? '9+' : vm.config.value.unreadCount }}
      </span>
    </button>

    <component
      :is="vm.config.value.showPanelInline ? 'div' : 'Teleport'"
      :to="vm.config.value.showPanelInline ? undefined : 'body'"
    >
      <Transition
        :name="vm.config.value.showPanelInline ? undefined : 'v-notification-center'"
        appear
        @after-enter="vm.updatePosition"
      >
        <div
          v-if="vm.config.value.showPanelInline || vm.open.value"
          :ref="vm.panelRef"
          v-bind="vm.panelAttrs.value"
        >
          <header class="v-notification-center__header" data-test-id="v-notification-center-header">
            <h2 class="v-notification-center__title">{{ vm.config.value.headerTitle }}</h2>
            <div class="v-notification-center__header-actions">
              <button
                type="button"
                class="v-notification-center__mark-all"
                data-test-id="v-notification-center-mark-all"
                :disabled="vm.config.value.disabled || vm.config.value.unreadCount === 0"
                @click="vm.onMarkAllRead"
              >
                {{ vm.config.value.markAllLabel }}
              </button>
              <button
                type="button"
                class="v-notification-center__menu"
                data-test-id="v-notification-center-menu"
                aria-label="Notification center options"
                :disabled="vm.config.value.disabled"
              >
                <VIcon :icon="vm.config.value.menuIcon" size="sm" />
              </button>
              <button
                v-if="!vm.config.value.showPanelInline"
                type="button"
                class="v-notification-center__close"
                data-test-id="v-notification-center-close"
                :aria-label="vm.config.value.closeLabel"
                @click="vm.closePanel"
              >
                <VIcon :icon="vm.config.value.closeIcon" size="sm" />
              </button>
            </div>
          </header>

          <div
            v-if="vm.config.value.variant === 'grouped' || vm.config.value.variant === 'default' || vm.config.value.isDrawer"
            class="v-notification-center__tabs"
            role="tablist"
            aria-label="Notification filters"
          >
            <button
              v-for="tab in vm.config.value.tabs"
              :key="tab.key"
              type="button"
              class="v-notification-center__tab"
              :class="{ 'v-notification-center__tab--active': vm.config.value.activeTab === tab.key }"
              :data-test-id="`v-notification-center-tab-${tab.key}`"
              role="tab"
              :aria-selected="vm.config.value.activeTab === tab.key"
              @click="vm.onTabClick(tab.key)"
            >
              {{ tab.label }}
              <span
                v-if="tab.key === 'unread' && vm.config.value.unreadCount > 0"
                class="v-notification-center__tab-count"
              >
                {{ vm.config.value.unreadCount }}
              </span>
            </button>
          </div>

          <div class="v-notification-center__search">
            <input
              class="v-notification-center__search-input"
              data-test-id="v-notification-center-search"
              type="search"
              placeholder="Search notifications…"
              :value="vm.config.value.searchQuery"
              :disabled="vm.config.value.disabled"
              @input="vm.onSearchInput"
            >
          </div>

          <div
            v-if="vm.config.value.loading"
            class="v-notification-center__loading"
            data-test-id="v-notification-center-loading"
            role="status"
            aria-live="polite"
            aria-label="Loading notifications"
          >
            <span class="v-notification-center__skeleton" />
            <span class="v-notification-center__skeleton" />
            <span class="v-notification-center__skeleton" />
          </div>

          <div
            v-else-if="vm.filteredNotifications.value.length === 0"
            class="v-notification-center__empty"
            data-test-id="v-notification-center-empty"
          >
            <VEmptyState
              variant="notifications"
              :title="vm.config.value.emptyLabel"
              :show-illustration="false"
              compact
            />
          </div>

          <div
            v-else
            class="v-notification-center__list"
            role="list"
            aria-label="Notifications"
          >
            <template v-if="vm.config.value.variant === 'grouped' || vm.config.value.isDrawer">
              <section
                v-for="[group, items] in vm.groupedNotifications.value"
                :key="group"
                class="v-notification-center__group"
                :data-test-id="`v-notification-center-group-${group}`"
              >
                <h3 class="v-notification-center__group-title">{{ group }}</h3>
                <VNotificationItem
                  v-for="item in items"
                  :key="item.id"
                  size="sm"
                  :title="item.title"
                  :preview="item.preview"
                  :time="item.time"
                  :unread="item.unread"
                  :variant="item.variant"
                  :avatar="item.avatar"
                  :avatar-alt="item.avatarAlt"
                  :show-menu="true"
                  :data-test-id="`v-notification-center-item-${item.id}`"
                  @click="vm.onItemClick(item.id)"
                />
              </section>
            </template>

            <template v-else>
              <VNotificationItem
                v-for="item in vm.filteredNotifications.value"
                :key="item.id"
                size="sm"
                :title="item.title"
                :preview="item.preview"
                :time="item.time"
                :unread="item.unread"
                :variant="item.variant"
                :avatar="item.avatar"
                :avatar-alt="item.avatarAlt"
                :show-menu="true"
                :data-test-id="`v-notification-center-item-${item.id}`"
                @click="vm.onItemClick(item.id)"
              />
            </template>
          </div>

          <footer class="v-notification-center__footer">
            <button
              type="button"
              class="v-notification-center__view-all"
              data-test-id="v-notification-center-view-all"
              :disabled="vm.config.value.disabled"
              @click="vm.onViewAll"
            >
              {{ vm.config.value.viewAllLabel }} →
            </button>
          </footer>
        </div>
      </Transition>
    </component>
  </div>
</template>
