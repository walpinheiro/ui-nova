import { computed, inject, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import type { VAccordionConfig, VAccordionItemProps, VAccordionValue } from './VAccordion.types'
import { VAccordionContextKey, type VAccordionContext } from './useVAccordion'

const FALLBACK_CONFIG: VAccordionConfig = {
  size: 'md',
  variant: 'default',
  multiple: false,
}

const fallbackContext: VAccordionContext = {
  config: { value: FALLBACK_CONFIG },
  registerItem: () => undefined,
  unregisterItem: () => undefined,
  isOpen: () => false,
  toggle: () => undefined,
  onTriggerKeydown: () => undefined,
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item'
}

export function useVAccordionItem(props: VAccordionItemProps) {
  const context = inject(VAccordionContextKey, fallbackContext)
  const generatedId = useId()
  const triggerRef = ref<HTMLButtonElement | null>(null)
  const value = computed<VAccordionValue>(() => props.value ?? props.id ?? generatedId)
  const itemSlug = computed(() => slugify(props.id ?? String(value.value)))
  const itemId = computed(() => `v-accordion-item-${itemSlug.value}`)
  const triggerId = computed(() => `${itemId.value}-trigger`)
  const panelId = computed(() => `${itemId.value}-panel`)
  const isOpen = computed(() => context.isOpen(value.value))

  const registration = {
    value,
    triggerRef,
  }
  onMounted(() => context.registerItem(registration))
  onBeforeUnmount(() => context.unregisterItem(value.value))

  const itemAttrs = computed(() => ({
    id: itemId.value,
    class: [
      'v-accordion__item',
      { 'v-accordion__item--expanded': isOpen.value },
    ],
    'data-test-id': `accordion-item-${itemSlug.value}`,
    'data-accordion-item': itemSlug.value,
    'data-state': isOpen.value ? 'expanded' : 'collapsed',
  }))

  const triggerAttrs = computed(() => ({
    id: triggerId.value,
    type: 'button' as const,
    class: 'v-accordion__trigger',
    'aria-expanded': isOpen.value,
    'aria-controls': panelId.value,
    'aria-label': props.ariaLabel,
    'data-test-id': `accordion-trigger-${itemSlug.value}`,
    'data-accordion-trigger': itemSlug.value,
    'data-state': isOpen.value ? 'expanded' : 'collapsed',
  }))

  const panelWrapAttrs = computed(() => ({
    class: 'v-accordion__panel-wrap',
    'aria-hidden': !isOpen.value,
    inert: !isOpen.value || undefined,
    'data-test-id': `accordion-panel-wrap-${itemSlug.value}`,
  }))

  const panelAttrs = computed(() => ({
    id: panelId.value,
    class: 'v-accordion__panel',
    role: 'region',
    'aria-labelledby': triggerId.value,
    'aria-hidden': !isOpen.value,
    'data-test-id': `accordion-panel-${itemSlug.value}`,
  }))

  const ariaLabel = computed(() => props.ariaLabel ?? props.title)

  const toggle = () => context.toggle(value.value)
  const onKeydown = (event: KeyboardEvent) => context.onTriggerKeydown(event, value.value)

  return {
    config: computed(() => context.config.value),
    itemAttrs,
    triggerAttrs,
    panelWrapAttrs,
    panelAttrs,
    triggerRef,
    value,
    itemId,
    isOpen,
    ariaLabel,
    toggle,
    onKeydown,
  }
}
