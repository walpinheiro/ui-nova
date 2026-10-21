import { computed, ref } from 'vue'
import type { VToolbarButtonProps, VToolbarMenuItem } from './VToolbar.types'
import { mountVToolbarButton } from './mountVToolbarButton'

export function useVToolbarButton(
  props: VToolbarButtonProps,
  emit?: {
    (event: 'click', value: MouseEvent): void
    (event: 'select', value: string): void
    (event: 'open-change', value: boolean): void
  },
) {
  const config = computed(() => mountVToolbarButton(props))
  const menuOpen = ref(false)

  const testId = computed(() =>
    config.value.variant === 'primary'
      ? 'v-toolbar-primary-action'
      : config.value.hasMenu
        ? 'v-toolbar-overflow-trigger'
        : `v-toolbar-button-${config.value.testSuffix}`,
  )

  const rootAttrs = computed<Record<string, unknown>>(() => ({
    class: [
      'v-toolbar__button',
      `v-toolbar__button--${config.value.variant}`,
      {
        'v-toolbar__button--active': config.value.active,
        'v-toolbar__button--icon-only': !props.label,
        'v-toolbar__button--menu-open': menuOpen.value,
      },
    ],
    type: 'button' as const,
    'aria-label': config.value.accessibleName,
    'aria-pressed': config.value.variant === 'toggle' ? String(config.value.active) : undefined,
    'aria-expanded': config.value.hasMenu ? String(menuOpen.value) : undefined,
    'aria-haspopup': config.value.hasMenu ? 'menu' : undefined,
    disabled: config.value.disabled || undefined,
    'data-test-id': testId.value,
    'data-toolbar-focusable': config.value.disabled ? undefined : 'true',
    'data-icon': config.value.iconKey,
  }))

  const toggleMenu = () => {
    if (!config.value.hasMenu || config.value.disabled) return
    menuOpen.value = !menuOpen.value
    emit?.('open-change', menuOpen.value)
  }

  const closeMenu = () => {
    if (!menuOpen.value) return
    menuOpen.value = false
    emit?.('open-change', false)
  }

  const onClick = (event: MouseEvent) => {
    if (config.value.disabled) return
    if (config.value.hasMenu) {
      toggleMenu()
      return
    }
    emit?.('click', event)
  }

  const onMenuSelect = (item: VToolbarMenuItem) => {
    if (item.disabled) return
    emit?.('select', item.value)
    closeMenu()
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (config.value.disabled) return
    if (event.key === 'Escape' && menuOpen.value) {
      event.preventDefault()
      closeMenu()
      return
    }
    if ((event.key === 'Enter' || event.key === ' ') && config.value.hasMenu) {
      event.preventDefault()
      toggleMenu()
    }
  }

  return { config, rootAttrs, menuOpen, onClick, onMenuSelect, onKeydown, closeMenu }
}
