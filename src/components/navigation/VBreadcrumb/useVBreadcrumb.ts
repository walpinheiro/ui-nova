import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ResolvedVBreadcrumbItem, VBreadcrumbProps, VBreadcrumbSegment } from './VBreadcrumb.types'
import { mountVBreadcrumb } from './mountVBreadcrumb'

export function useVBreadcrumb(
  props: VBreadcrumbProps,
  emit?: (event: 'navigate', payload: { item: ResolvedVBreadcrumbItem; index: number }) => void,
) {
  const config = computed(() => mountVBreadcrumb(props))
  const overflowOpen = ref(false)

  const rootAttrs = computed(() => ({
    class: [
      'v-breadcrumb',
      `v-breadcrumb--${config.value.size}`,
      `v-breadcrumb--${config.value.variant}`,
    ],
    'aria-label': config.value.ariaLabel,
    'data-test-id': 'v-breadcrumb',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
  }))

  const segments = computed(() => config.value.segments)

  const closeOverflow = () => {
    overflowOpen.value = false
  }

  const toggleOverflow = () => {
    overflowOpen.value = !overflowOpen.value
  }

  const onNavigate = (event: MouseEvent, item: ResolvedVBreadcrumbItem) => {
    if (item.disabled || item.isCurrent) {
      event.preventDefault()
      return
    }
    event.preventDefault()
    emit?.('navigate', { item, index: item.originalIndex })
  }

  const onOverflowNavigate = (event: MouseEvent, item: ResolvedVBreadcrumbItem) => {
    onNavigate(event, item)
    closeOverflow()
  }

  const onOverflowKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeOverflow()
      document.querySelector<HTMLElement>('[data-test-id="v-breadcrumb-overflow"]:focus-within, [data-test-id="v-breadcrumb-overflow"]')?.focus()
    }
  }

  const onDocumentPointerDown = (event: PointerEvent) => {
    if (!overflowOpen.value) return
    const target = event.target as HTMLElement
    if (!target.closest('.v-breadcrumb__item--overflow')) closeOverflow()
  }

  onMounted(() => {
    document.addEventListener('pointerdown', onDocumentPointerDown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
  })

  const segmentKey = (segment: VBreadcrumbSegment, index: number) =>
    segment.type === 'item'
      ? `item-${segment.item.originalIndex}`
      : `overflow-${index}-${segment.items.map((item) => item.originalIndex).join('-')}`

  return {
    config,
    rootAttrs,
    segments,
    overflowOpen,
    closeOverflow,
    toggleOverflow,
    onNavigate,
    onOverflowNavigate,
    onOverflowKeydown,
    segmentKey,
  }
}
