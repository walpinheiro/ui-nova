import { computed, useId } from 'vue'
import type { VPanelProps } from './VPanel.types'
import { mountVPanel } from './mountVPanel'

type VPanelEmit = {
  (event: 'update:open', value: boolean): void
  (event: 'update:modelValue', value: boolean): void
  (event: 'click', payload: MouseEvent | KeyboardEvent): void
}

export function useVPanel(props: VPanelProps, emit?: VPanelEmit) {
  const config = computed(() => mountVPanel(props))
  const isOpen = computed(() => config.value.isOpen)
  const iconData = computed(() => config.value.iconData)
  const headingLevel = computed(() => config.value.headingLevel)
  const headingId = useId()
  const focusable = computed(() => Boolean(props.interactive))
  const hasHeading = computed(() => Boolean(props.title))

  const rootAttrs = computed(() => ({
    class: [
      'v-panel',
      `v-panel--${config.value.size}`,
      `v-panel--${config.value.variant}`,
      {
        'v-panel--interactive': focusable.value,
      },
    ],
    role: focusable.value ? 'button' : undefined,
    'aria-labelledby': hasHeading.value ? headingId : undefined,
    'aria-label': !hasHeading.value ? (props.ariaLabel ?? undefined) : props.ariaLabel,
    tabindex: focusable.value ? 0 : undefined,
    'data-test-id': 'v-panel',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': 'default',
  }))

  const onActivate = (event: MouseEvent | KeyboardEvent) => {
    if (!props.interactive) return
    emit?.('click', event)
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (!props.interactive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate(event)
    }
  }

  const dismiss = () => {
    emit?.('update:open', false)
    emit?.('update:modelValue', false)
  }

  return {
    config,
    isOpen,
    iconData,
    headingLevel,
    headingId,
    focusable,
    rootAttrs,
    onActivate,
    onKeydown,
    dismiss,
  }
}
