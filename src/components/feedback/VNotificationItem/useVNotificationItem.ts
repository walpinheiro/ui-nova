import { computed } from 'vue'
import type { VNotificationItemEmit, VNotificationItemProps } from './VNotificationItem.types'
import { mountVNotificationItem } from './mountVNotificationItem'

export function useVNotificationItem(props: VNotificationItemProps, emit: VNotificationItemEmit) {
  const config = computed(() => mountVNotificationItem(props))

  const rootAttrs = computed(() => ({
    class: [
      'v-notification-item',
      `v-notification-item--${config.value.size}`,
      `v-notification-item--${config.value.variant}`,
      {
        'v-notification-item--unread': config.value.unread,
        'v-notification-item--disabled': config.value.disabled,
        'v-notification-item--loading': config.value.loading,
      },
    ],
    role: 'listitem' as const,
    tabindex: config.value.disabled ? undefined : 0,
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel,
    'data-test-id': 'v-notification-item',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : config.value.unread
          ? 'unread'
          : 'read',
  }))

  const onItemClick = () => {
    if (config.value.disabled) return
    emit('click')
    if (config.value.unread) {
      emit('update:unread', false)
    }
  }

  const onItemKeydown = (event: KeyboardEvent) => {
    if (config.value.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onItemClick()
    }
  }

  const onDismiss = (event: Event) => {
    event.stopPropagation()
    if (config.value.disabled) return
    emit('dismiss')
  }

  const onMenu = (event: Event) => {
    event.stopPropagation()
    if (config.value.disabled) return
    emit('menu')
  }

  const onAction = (event: Event, key: string) => {
    event.stopPropagation()
    if (config.value.disabled) return
    emit('action', key)
  }

  return { config, rootAttrs, onItemClick, onItemKeydown, onDismiss, onMenu, onAction }
}
