<script setup lang="ts">
import './VNotificationItem.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVNotificationItem } from './useVNotificationItem'
import type { VNotificationItemEmit, VNotificationItemProps } from './VNotificationItem.types'

const props = withDefaults(defineProps<VNotificationItemProps>(), {
  size: 'md',
  variant: 'default',
  unread: false,
  disabled: false,
  loading: false,
  dismissible: false,
  showMenu: true,
  dismissLabel: 'Dismiss notification',
  menuLabel: 'Notification options',
})
const emit = defineEmits<VNotificationItemEmit>()
const vm = useVNotificationItem(props, emit)
</script>

<template>
  <div
    v-bind="vm.rootAttrs.value"
    @click="vm.onItemClick"
    @keydown="vm.onItemKeydown"
  >
    <div class="v-notification-item__leading" data-test-id="v-notification-avatar">
      <slot name="avatar">
        <img
          v-if="vm.config.value.hasAvatar"
          class="v-notification-item__avatar-image"
          :src="avatar"
          :alt="avatarAlt || title || 'Notification avatar'"
        >
        <span
          v-else
          class="v-notification-item__avatar-icon"
          :class="`v-notification-item__avatar-icon--${variant}`"
          aria-hidden="true"
        >
          <VIcon :icon="vm.config.value.iconData" size="sm" />
        </span>
      </slot>
    </div>

    <div class="v-notification-item__content">
      <div class="v-notification-item__header">
        <p
          v-if="title || $slots.title"
          class="v-notification-item__title"
          data-test-id="v-notification-title"
        >
          <slot name="title">{{ title }}</slot>
        </p>
        <div class="v-notification-item__meta">
          <time
            v-if="time || $slots.time"
            class="v-notification-item__time"
            data-test-id="v-notification-time"
          >
            <slot name="time">{{ time }}</slot>
          </time>
          <span
            v-if="vm.config.value.unread"
            class="v-notification-item__unread-dot"
            data-test-id="v-notification-unread-dot"
            aria-hidden="true"
          />
        </div>
      </div>

      <p
        v-if="preview || $slots.preview"
        class="v-notification-item__preview"
        data-test-id="v-notification-preview"
      >
        <slot name="preview">{{ preview }}</slot>
      </p>

      <div
        v-if="(actions && actions.length) || $slots.actions"
        class="v-notification-item__inline-actions"
      >
        <slot name="actions">
          <button
            v-for="action in actions"
            :key="action.key ?? action.label"
            type="button"
            class="v-notification-item__inline-action"
            :class="`v-notification-item__inline-action--${action.variant ?? 'secondary'}`"
            :data-test-id="`v-notification-action-${action.key ?? action.label.toLowerCase().replace(/\s+/g, '-')}`"
            :disabled="vm.config.value.disabled"
            @click="vm.onAction($event, action.key ?? action.label)"
          >
            {{ action.label }}
          </button>
        </slot>
      </div>
    </div>

    <div class="v-notification-item__trailing">
      <button
        v-if="vm.config.value.dismissible"
        type="button"
        class="v-notification-item__dismiss"
        data-test-id="v-notification-dismiss"
        :aria-label="dismissLabel"
        :disabled="vm.config.value.disabled"
        @click="vm.onDismiss"
      >
        <VIcon :icon="vm.config.value.closeIcon" size="sm" />
      </button>

      <button
        v-if="vm.config.value.showMenu"
        type="button"
        class="v-notification-item__menu"
        data-test-id="v-notification-menu"
        :aria-label="menuLabel"
        :disabled="vm.config.value.disabled"
        @click="vm.onMenu"
      >
        <VIcon :icon="vm.config.value.menuIcon" size="sm" />
      </button>
    </div>

    <span
      v-if="vm.config.value.loading"
      class="v-notification-item__loader"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    />
  </div>
</template>
