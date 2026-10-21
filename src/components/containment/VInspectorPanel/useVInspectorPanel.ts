import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import type { VInspectorPanelEmits, VInspectorPanelProps } from './VInspectorPanel.types'
import { mountVInspectorPanel } from './mountVInspectorPanel'

type VInspectorPanelEmitFn = <K extends keyof VInspectorPanelEmits>(e: K, ...args: VInspectorPanelEmits[K]) => void

interface VInspectorPanelClassBindings {
  class: Array<string | Record<string, boolean>>
  [key: string]: unknown
}

export function useVInspectorPanel(props: VInspectorPanelProps, emit: VInspectorPanelEmitFn) {
  const config = computed(() => mountVInspectorPanel(props))
  const isOpen = computed(() => config.value.open)
  const titleId = `v-inspector-panel-title-${useId()}`
  const rootRef = ref<HTMLElement | null>(null)
  const internalActiveTab = ref(config.value.activeTab)
  const internalExpandedSections = ref<string[]>([...config.value.expandedSections])

  watch(
    () => [props.activeTab, config.value.tabs] as const,
    ([activeTab]) => {
      if (activeTab !== undefined) internalActiveTab.value = activeTab
      else if (!config.value.tabs.some((tab) => tab.value === internalActiveTab.value)) {
        internalActiveTab.value = config.value.tabs[0]?.value ?? 'properties'
      }
    },
  )

  watch(
    () => props.expandedSections,
    (expandedSections) => {
      if (expandedSections !== undefined) internalExpandedSections.value = [...expandedSections]
    },
    { immediate: true, deep: true },
  )

  const activeTab = computed(() =>
    props.activeTab === undefined ? internalActiveTab.value : config.value.activeTab,
  )

  const visibleSections = computed(() =>
    config.value.sections.filter((section) => !section.tab || section.tab === activeTab.value),
  )

  const expandedSections = computed(() => internalExpandedSections.value)

  function requestClose(reason: 'close' | 'dismiss' = 'close'): void {
    if (config.value.disabled) return
    emit('update:open', false)
    emit('update:modelValue', false)
    emit('open-change', false)
    if (reason === 'dismiss') emit('dismiss')
    else emit('close')
  }

  function onCloseClick(): void {
    requestClose('close')
  }

  function selectTab(value: string): void {
    if (config.value.disabled) return
    const tab = config.value.tabs.find((candidate) => candidate.value === value)
    if (!tab || tab.disabled) return
    internalActiveTab.value = value
    emit('update:activeTab', value)
    emit('tab-change', value)
  }

  function isSectionExpanded(value: string): boolean {
    return internalExpandedSections.value.includes(value)
  }

  function toggleSection(value: string): void {
    if (config.value.disabled) return
    const section = config.value.sections.find((candidate) => candidate.value === value)
    if (!section || section.disabled) return
    const wasExpanded = isSectionExpanded(value)
    const next = wasExpanded
      ? expandedSections.value.filter((candidate) => candidate !== value)
      : [...expandedSections.value, value]
    internalExpandedSections.value = next
    emit('update:expandedSections', next)
    emit('section-toggle', value, !wasExpanded)
  }

  function onTabKeydown(event: KeyboardEvent, index: number): void {
    const enabled = config.value.tabs.filter((tab) => !tab.disabled)
    if (enabled.length === 0) return
    const currentIndex = enabled.findIndex((tab) => tab.value === config.value.tabs[index]?.value)
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight') {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % enabled.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = currentIndex < 0 ? enabled.length - 1 : (currentIndex - 1 + enabled.length) % enabled.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = enabled.length - 1
    }
    if (nextIndex === undefined) return
    event.preventDefault()
    selectTab(enabled[nextIndex].value)
    void nextTick(() => {
      rootRef.value?.querySelector<HTMLElement>(`[data-test-id="v-inspector-panel-tab-${enabled[nextIndex].value}"]`)?.focus()
    })
  }

  function onSectionKeydown(event: KeyboardEvent, value: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleSection(value)
    }
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && config.value.dismissible) {
      event.stopPropagation()
      requestClose('dismiss')
    }
  }

  function setRootRef(el: unknown): void {
    rootRef.value = (el as HTMLElement | null) ?? null
  }

  let lastFocused: Element | null = null
  onMounted(() => {
    if (config.value.open) lastFocused = document.activeElement
  })

  watch(
    isOpen,
    (open, prev) => {
      if (typeof document === 'undefined') return
      if (open && !prev) lastFocused = document.activeElement
      if (!open && prev) {
        const el = lastFocused as HTMLElement | null
        if (el && typeof el.focus === 'function') el.focus()
        lastFocused = null
      }
    },
    { flush: 'post' },
  )

  const rootAttrs = computed<VInspectorPanelClassBindings>(() => ({
    class: [
      'v-inspector-panel',
      `v-inspector-panel--size-${config.value.size}`,
      `v-inspector-panel--variant-${config.value.variant}`,
      {
        'v-inspector-panel--open': config.value.open,
        'v-inspector-panel--closed': !config.value.open,
        'v-inspector-panel--disabled': config.value.disabled,
        'v-inspector-panel--loading': config.value.loading,
      },
    ],
    role: 'complementary',
    'aria-label': props.ariaLabel ?? props.title ?? 'Inspector',
    'aria-labelledby': props.ariaLabel ? undefined : titleId,
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'data-test-id': 'v-inspector-panel',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-open': config.value.open ? 'true' : 'false',
    'data-state': config.value.loading ? 'loading' : config.value.disabled ? 'disabled' : 'default',
    tabindex: '-1',
  }))

  return {
    config,
    isOpen,
    activeTab,
    visibleSections,
    expandedSections,
    titleId,
    rootRef,
    rootAttrs,
    setRootRef,
    selectTab,
    isSectionExpanded,
    toggleSection,
    onCloseClick,
    onTabKeydown,
    onSectionKeydown,
    onKeydown,
    requestClose,
  }
}
