import { computed, ref, useSlots, watch } from 'vue'
import type { VTopBarEmits, VTopBarProps } from './VTopBar.types'
import { mountVTopBar } from './mountVTopBar'

type VTopBarEmitFn = <K extends keyof VTopBarEmits>(event: K, ...args: VTopBarEmits[K]) => void

export function useVTopBar(props: VTopBarProps, emit: VTopBarEmitFn) {
  const slots = useSlots()
  const config = computed(() => mountVTopBar(props))
  const activeItem = ref(props.activeItem ?? props.items?.[0]?.value)

  watch(
    () => props.activeItem,
    (value) => {
      if (value !== undefined) activeItem.value = value
    },
  )

  const hasLeading = computed(() => Boolean(slots.leading))
  const hasActions = computed(() => Boolean(slots.actions))
  const hasTitle = computed(() => Boolean(props.title || slots.default))

  const rootAttrs = computed(() => ({
    class: [
      'v-top-bar',
      `v-top-bar--${config.value.size}`,
      `v-top-bar--${config.value.variant}`,
      {
        'v-top-bar--bordered': config.value.bordered,
        'v-top-bar--sticky': config.value.sticky,
        'v-top-bar--disabled': config.value.disabled,
        'v-top-bar--loading': config.value.loading,
        'v-top-bar--with-leading': hasLeading.value,
        'v-top-bar--with-actions': hasActions.value,
      },
    ],
    role: 'banner',
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel ?? (props.title ? undefined : 'Application header'),
    'data-test-id': 'v-top-bar',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : 'default',
  }))

  function selectNav(value: string) {
    if (config.value.disabled) return
    activeItem.value = value
    emit('update:activeItem', value)
    emit('select', value)
  }

  return { config, hasLeading, hasActions, hasTitle, activeItem, selectNav, rootAttrs }
}
