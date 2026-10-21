import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import type { VSheetEmits, VSheetMotionState, VSheetProps } from './VSheet.types'
import { mountVSheet } from './mountVSheet'

type VSheetEmitFn = <K extends keyof VSheetEmits>(e: K, ...args: VSheetEmits[K]) => void

interface VSheetClassBindings {
  class: Array<string | Record<string, boolean> | undefined>
  [key: string]: unknown
}

export function useVSheet(props: VSheetProps, emit: VSheetEmitFn) {
  const config = computed(() => mountVSheet(props))
  const isOpen = computed(() => config.value.open)
  const motionState = ref<VSheetMotionState>(config.value.open ? 'open' : 'closed')

  function onBeforeEnter(): void {
    motionState.value = 'opening'
  }

  function onAfterEnter(): void {
    motionState.value = 'open'
  }

  function onBeforeLeave(): void {
    motionState.value = 'closing'
  }

  function onAfterLeave(): void {
    motionState.value = 'closed'
  }

  function requestClose(reason: 'close' | 'dismiss' = 'close'): void {
    if (config.value.disabled) return
    emit('update:open', false)
    emit('update:modelValue', false)
    emit('open-change', false)
    if (reason === 'dismiss') emit('dismiss')
    else emit('close')
  }

  function onBackdropClick(): void {
    if (config.value.dismissible) requestClose('dismiss')
  }

  function onCloseClick(): void {
    requestClose('close')
  }

  function onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && config.value.dismissible) {
      event.stopPropagation()
      requestClose('dismiss')
      return
    }
    if (event.key !== 'Tab') return
    trapTabKey(event)
  }

  // Dialog focus-trap: Tab / Shift+Tab circulates inside the open panel.
  // The panel root carries tabindex="-1"; initial focus goes to the first
  // focusable child (or the panel itself when there is none).
  const panelRef = ref<HTMLElement | null>(null)

  function setPanelRef(el: unknown): void {
    panelRef.value = (el as HTMLElement | null) ?? null
  }

  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
    'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  function focusables(): HTMLElement[] {
    const root = panelRef.value
    if (!root || typeof document === 'undefined') return []
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
      if (el.hasAttribute('disabled')) return false
      if ((el as HTMLInputElement).type === 'hidden') return false
      if (el.hidden) return false
      if (el.getAttribute('aria-hidden') === 'true') return false
      return true
    })
  }

  function trapTabKey(event: KeyboardEvent): void {
    const root = panelRef.value
    if (!root || !config.value.open) return
    const items = focusables()
    if (items.length === 0) {
      event.preventDefault()
      root.focus()
      return
    }
    const first = items[0] as HTMLElement
    const last = items[items.length - 1] as HTMLElement
    const active = document.activeElement as HTMLElement | null
    const atStart = active === first || active === root || !root.contains(active)
    const atEnd = active === last || !root.contains(active)
    if (event.shiftKey && atStart) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && atEnd) {
      event.preventDefault()
      first.focus()
    }
  }

  function focusInitial(): void {
    if (typeof document === 'undefined') return
    const root = panelRef.value
    if (!root || !config.value.open) return
    const items = focusables()
    const target = (items[0] as HTMLElement | undefined) ?? root
    target.focus({ preventScroll: true })
  }

  // Return focus to the opener when the sheet closes (dialog pattern).
  // On open, move initial focus to the first focusable child (spec §5/§7).
  let lastFocused: Element | null = null
  const titleId = `v-sheet-title-${useId()}`
  const descriptionId = `v-sheet-description-${useId()}`
  onMounted(() => {
    if (config.value.open) nextTick(() => focusInitial())
  })
  watch(
    isOpen,
    (open, prev) => {
      if (typeof document === 'undefined') return
      if (open && !prev) {
        lastFocused = document.activeElement
        nextTick(() => focusInitial())
      }
      if (!open && prev) {
        const el = lastFocused as HTMLElement | null
        if (el && typeof el.focus === 'function') el.focus()
        lastFocused = null
      }
    },
    { flush: 'post' },
  )

  const rootAttrs = computed<VSheetClassBindings>(() => ({
    class: [
      'v-sheet',
      props.rootClass,
      `v-sheet--${config.value.side}`,
      `v-sheet--${config.value.size}`,
      {
        'v-sheet--open': config.value.open,
        'v-sheet--closed': !config.value.open,
        'v-sheet--full-height': config.value.fullHeight,
        'v-sheet--disabled': config.value.disabled,
        'v-sheet--loading': config.value.loading,
      },
    ],
    'data-state': motionState.value,
    'data-side': config.value.side,
    'data-size': config.value.size,
    'data-test-id': props.testIds?.root ?? 'v-sheet',
    ...(props.rootDataAttrs ?? {}),
  }))

  const backdropAttrs = computed<VSheetClassBindings>(() => ({
    class: ['v-sheet__backdrop', { 'v-sheet__backdrop--hidden': !config.value.open }],
    'data-test-id': props.testIds?.backdrop ?? 'v-sheet-backdrop',
    'aria-hidden': 'true',
  }))

  const panelAttrs = computed<VSheetClassBindings>(() => ({
    class: ['v-sheet__panel', props.surfaceClass],
    role: 'dialog',
    'aria-modal': 'true',
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'data-test-id': props.testIds?.panel ?? 'v-sheet-panel',
    tabindex: '-1',
  }))

  return {
    config,
    isOpen,
    motionState,
    rootAttrs,
    backdropAttrs,
    panelAttrs,
    titleId,
    descriptionId,
    panelRef,
    setPanelRef,
    requestClose,
    onBackdropClick,
    onCloseClick,
    onPanelKeydown,
    focusInitial,
    onBeforeEnter,
    onAfterEnter,
    onBeforeLeave,
    onAfterLeave,
  }
}
