import { computed, useSlots } from 'vue'
import type { VNavItemEmits, VNavItemProps } from './VNavItem.types'
import { mountVNavItem } from './mountVNavItem'

type EmitFn = <K extends keyof VNavItemEmits>(event: K, ...args: VNavItemEmits[K]) => void

export function useVNavItem(props: VNavItemProps, emit: EmitFn) {
  const slots = useSlots()
  const config = computed(() => mountVNavItem(props))

  const hasIcon = computed(() => Boolean(slots.icon || config.value.iconData || config.value.iconColor))
  const hasLabel = computed(() => Boolean(props.label || slots.default))

  const itemAttrs = computed(() => ({
    class: [
      'v-nav-item',
      `v-nav-item--${config.value.size}`,
      `v-nav-item--${config.value.variant}`,
      {
        'v-nav-item--active': config.value.active,
        'v-nav-item--collapsed': config.value.collapsed,
        'v-nav-item--disabled': config.value.disabled,
        'v-nav-item--loading': config.value.loading,
        'v-nav-item--with-icon': hasIcon.value,
        'v-nav-item--with-badge': config.value.showBadge,
        'v-nav-item--with-tag': Boolean(config.value.tag),
      },
    ],
    type: config.value.isLink ? undefined : 'button',
    href: config.value.isLink ? config.value.href : undefined,
    'aria-current': config.value.active ? 'page' : undefined,
    'aria-expanded': props.expandable ? String(Boolean(props.expanded)) : undefined,
    'aria-controls': props.expandable ? props.ariaControls : undefined,
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel ?? (config.value.label || undefined),
    disabled: !config.value.isLink && config.value.disabled ? true : undefined,
    tabindex: config.value.disabled ? -1 : undefined,
    'data-test-id': config.value.testId,
    'data-active': config.value.active ? 'true' : 'false',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : config.value.active
          ? 'active'
          : 'default',
  }))

  function onClick(event: MouseEvent) {
    if (config.value.disabled) {
      event.preventDefault()
      return
    }
    emit('click', event)
    emit('select', { value: config.value.value, href: config.value.href })
  }

  function onKeydown(event: KeyboardEvent) {
    emit('keydown', event)
    if (config.value.disabled) return
    if (!config.value.isLink && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onClick(event as unknown as MouseEvent)
    }
  }

  return { config, hasIcon, hasLabel, itemAttrs, onClick, onKeydown }
}
