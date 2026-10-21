import { computed, ref, useSlots } from 'vue'
import type { VCardProps } from './VCard.types'
import { mountVCard } from './mountVCard'

export function useVCard(
  props: VCardProps,
  emit?: (event: 'click', payload?: MouseEvent | KeyboardEvent) => void,
) {
  const slots = useSlots()
  const config = computed(() => mountVCard(props))
  const flipped = ref(false)
  const isExpressive = computed(() => props.motion === 'expressive')
  const isFlippable = computed(() => isExpressive.value && Boolean(slots.back))

  const rootAttrs = computed(() => ({
    class: [
      'v-card',
      `v-card--${config.value.size}`,
      `v-card--${config.value.variant}`,
      `v-card--media-${config.value.mediaPlacement}`,
      {
        'v-card--loading': config.value.loading,
        'v-card--selected': config.value.selected,
        'v-card--actionable': config.value.actionable,
        'v-card--refine-frame': config.value.showRefineFrame,
        [`v-card--refine-${config.value.refineFrame}`]: config.value.showRefineFrame,
        'v-card--expressive': isExpressive.value,
        'v-card--flippable': isFlippable.value,
        'v-card--flipped': flipped.value,
      },
    ],
    tabindex: config.value.actionable ? 0 : undefined,
    role: config.value.actionable ? 'button' : undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-selected': config.value.selected || undefined,
    'aria-label': props.ariaLabel ?? props.title,
    'data-test-id': 'v-card',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-media-placement': config.value.mediaPlacement,
    'data-selected': config.value.selected ? 'true' : undefined,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.selected
        ? 'selected'
        : config.value.showRefineFrame
          ? config.value.refineFrame
          : 'default',
  }))

  const onActivate = (event: MouseEvent | KeyboardEvent) => {
    if (config.value.loading) return
    if (isFlippable.value) {
      flipped.value = !flipped.value
      return
    }
    if (!config.value.actionable) return
    emit?.('click', event)
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (!config.value.actionable && !isFlippable.value) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate(event)
    }
  }

  return { config, rootAttrs, onActivate, onKeydown, isFlippable, flipped }
}
