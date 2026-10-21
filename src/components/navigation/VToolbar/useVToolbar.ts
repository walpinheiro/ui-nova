import { computed } from 'vue'
import type { VToolbarProps } from './VToolbar.types'
import { mountVToolbar } from './mountVToolbar'

export function useVToolbar(props: VToolbarProps) {
  const config = computed(() => mountVToolbar(props))

  const rootAttrs = computed(() => ({
    class: [
      'v-toolbar',
      `v-toolbar--${config.value.size}`,
      `v-toolbar--${config.value.variant}`,
      {
        'v-toolbar--disabled': config.value.disabled,
        'v-toolbar--loading': config.value.loading,
      },
    ],
    role: 'toolbar',
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel ?? 'Toolbar',
    'data-test-id': 'v-toolbar',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : 'default',
  }))

  const onKeydown = (event: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    const root = event.currentTarget as HTMLElement | null
    if (!root) return
    const buttons = Array.from(
      root.querySelectorAll<HTMLElement>('[data-toolbar-focusable="true"]:not([disabled])'),
    )
    if (buttons.length === 0) return
    const active = document.activeElement as HTMLElement | null
    const currentIndex = buttons.findIndex((el) => el === active)
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight') {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % buttons.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = currentIndex === -1 ? buttons.length - 1 : (currentIndex - 1 + buttons.length) % buttons.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = buttons.length - 1
    }
    if (nextIndex !== null) {
      event.preventDefault()
      buttons[nextIndex]?.focus()
    }
  }

  return { config, rootAttrs, onKeydown }
}
