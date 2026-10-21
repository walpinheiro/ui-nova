import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import type { VDialogEmits, VDialogProps } from './VDialog.types'
import { mountVDialog } from './mountVDialog'

type VDialogEmitFn = <K extends keyof VDialogEmits>(event: K, ...args: VDialogEmits[K]) => void

interface VDialogAttrs {
  class: Array<string | Record<string, boolean>>
  [key: string]: unknown
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useVDialog(props: VDialogProps, emit: VDialogEmitFn) {
  const config = computed(() => mountVDialog(props))
  const isOpen = computed(() => config.value.open)
  const panelRef = ref<HTMLElement | null>(null)
  const titleId = `v-dialog-title-${useId()}`
  const descriptionId = `v-dialog-description-${useId()}`
  let lastFocused: Element | null = null

  function setPanelRef(element: unknown): void {
    panelRef.value = (element as HTMLElement | null) ?? null
  }

  function focusables(): HTMLElement[] {
    const root = panelRef.value
    if (!root || typeof document === 'undefined') return []
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
      if (element.hasAttribute('disabled')) return false
      if ((element as HTMLInputElement).type === 'hidden') return false
      if (element.hidden || element.getAttribute('aria-hidden') === 'true') return false
      return true
    })
  }

  function focusInitial(): void {
    if (typeof document === 'undefined' || !isOpen.value) return
    const target = focusables()[0] ?? panelRef.value
    target?.focus({ preventScroll: true })
  }

  function trapTabKey(event: KeyboardEvent): void {
    const root = panelRef.value
    if (!root || !isOpen.value) return
    const items = focusables()
    if (items.length === 0) {
      event.preventDefault()
      root.focus()
      return
    }
    const first = items[0]
    const last = items[items.length - 1]
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

  function requestClose(reason: 'close' | 'dismiss' = 'close'): void {
    if (config.value.disabled || config.value.loading) return
    emit('update:modelValue', false)
    emit('update:open', false)
    emit('open-change', false)
    if (reason === 'dismiss') emit('dismiss')
    else emit('close')
  }

  function onCancelClick(): void {
    if (config.value.disabled || config.value.loading) return
    emit('cancel')
    requestClose('close')
  }

  function onConfirmClick(event: MouseEvent): void {
    if (config.value.disabled || config.value.loading) return
    emit('confirm', event)
    if (config.value.showConfirmActions) requestClose('close')
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
    if (event.key === 'Tab') trapTabKey(event)
  }

  onMounted(() => {
    if (isOpen.value) {
      lastFocused = typeof document === 'undefined' ? null : document.activeElement
      nextTick(() => focusInitial())
    }
  })

  watch(
    isOpen,
    (open, previous) => {
      if (typeof document === 'undefined') return
      if (open && !previous) {
        lastFocused = document.activeElement
        nextTick(() => focusInitial())
      } else if (!open && previous) {
        const target = lastFocused as HTMLElement | null
        if (target && typeof target.focus === 'function') target.focus({ preventScroll: true })
        lastFocused = null
      }
    },
    { flush: 'post' },
  )

  const rootAttrs = computed<VDialogAttrs>(() => ({
    class: [
      'v-dialog',
      `v-dialog--${config.value.size}`,
      `v-dialog--${config.value.variant}`,
      {
        'v-dialog--open': config.value.open,
        'v-dialog--closed': !config.value.open,
        'v-dialog--disabled': config.value.disabled,
        'v-dialog--loading': config.value.loading,
      },
    ],
    'data-state': config.value.open ? 'open' : 'closed',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
    'data-test-id': 'v-dialog',
    'data-intent': config.value.showConfirmActions ? config.value.intent : undefined,
  }))

  const backdropAttrs = computed<VDialogAttrs>(() => ({
    class: ['v-dialog__backdrop', { 'v-dialog__backdrop--hidden': !config.value.open }],
    'data-test-id': 'dialog-backdrop',
    'aria-hidden': 'true',
  }))

  const panelAttrs = computed<VDialogAttrs>(() => ({
    class: ['v-dialog__panel'],
    role: config.value.variant === 'confirmation' && config.value.intent === 'destructive' ? 'alertdialog' : 'dialog',
    'aria-modal': 'true',
    'aria-label': props.ariaLabel || (!props.title ? 'Dialog' : undefined),
    'aria-describedby': props.ariaDescribedby,
    'aria-disabled': config.value.disabled || config.value.loading || undefined,
    'aria-busy': config.value.loading || undefined,
    'data-test-id': 'dialog-container',
    tabindex: '-1',
  }))

  return {
    config,
    isOpen,
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
    onCancelClick,
    onConfirmClick,
    onPanelKeydown,
    focusInitial,
  }
}
