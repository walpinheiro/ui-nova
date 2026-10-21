import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch,
  type CSSProperties,
} from 'vue'
import type { VPopoverCloseReason, VPopoverEmits, VPopoverProps } from './VPopover.types'
import { mountVPopover } from './mountVPopover'

type VPopoverEmitFn = <K extends keyof VPopoverEmits>(event: K, ...args: VPopoverEmits[K]) => void

const focusableSelector = [
  'button:not([disabled])',
  '[href]:not([aria-disabled="true"])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function useVPopover(props: VPopoverProps, emit: VPopoverEmitFn) {
  const config = computed(() => mountVPopover(props))
  const instanceId = useId()
  const panelId = `v-popover-panel-${instanceId}`
  const titleId = `v-popover-title-${instanceId}`
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const open = ref(Boolean(props.open ?? props.modelValue))
  const positionStyle = ref<CSSProperties>({})
  let hoverTimer: ReturnType<typeof setTimeout> | null = null
  let previousFocus: HTMLElement | null = null

  watch(
    () => props.open,
    (value) => {
      if (value !== undefined) open.value = value
    },
  )

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== undefined) open.value = value
    },
  )

  const labelledBy = computed(() => props.ariaLabelledby ?? (props.title ? titleId : undefined))
  const describedBy = computed(() => props.ariaDescribedby)

  const rootAttrs = computed(() => ({
    class: ['v-popover', `v-popover--${config.value.size}`, `v-popover--${config.value.placement}`],
    'data-test-id': 'v-popover',
    'data-size': config.value.size,
    'data-placement': config.value.placement,
    'data-trigger': config.value.trigger,
    'data-state': config.value.disabled ? 'disabled' : open.value ? 'open' : 'closed',
  }))

  const triggerAttrs = computed(() => ({
    class: ['v-popover__trigger', { 'v-popover__trigger--open': open.value }],
    'data-test-id': 'v-popover-trigger',
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': open.value,
    'aria-controls': open.value ? panelId : undefined,
    'aria-disabled': config.value.disabled || undefined,
  }))

  const panelAttrs = computed(() => ({
    id: panelId,
    class: [
      'v-popover__container',
      `v-popover__container--${config.value.placement}`,
      `v-popover__container--${config.value.size}`,
    ],
    role: 'dialog' as const,
    'aria-modal': 'false' as const,
    'aria-label': props.ariaLabel,
    'aria-labelledby': labelledBy.value,
    'aria-describedby': describedBy.value,
    tabindex: -1,
    'data-test-id': 'v-popover-container',
    style: positionStyle.value,
  }))

  const clearHoverTimer = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      hoverTimer = null
    }
  }

  const setOpen = (value: boolean, reason?: VPopoverCloseReason) => {
    if (config.value.disabled) return
    open.value = value
    emit('update:open', value)
    emit('update:modelValue', value)
    emit('open-change', value)
    if (!value && reason) {
      emit('close', reason)
      if (reason !== 'close') emit('dismiss', reason)
    }
  }

  const openPanel = () => {
    if (config.value.disabled || open.value) return
    previousFocus = document.activeElement as HTMLElement | null
    setOpen(true)
  }

  const close = (reason: VPopoverCloseReason = 'close') => {
    if (!open.value) return
    setOpen(false, reason)
  }

  const updatePosition = () => {
    const trigger = triggerRef.value
    const panel = panelRef.value
    if (!trigger || !panel) return

    const triggerRect = trigger.getBoundingClientRect()
    const panelRect = panel.getBoundingClientRect()
    const gapPx = config.value.showArrow ? 16 : 8

    let top = 0
    let left = 0

    switch (config.value.placement) {
      case 'top':
        top = triggerRect.top - panelRect.height - gapPx
        left = triggerRect.left + (triggerRect.width - panelRect.width) / 2
        break
      case 'bottom':
        top = triggerRect.bottom + gapPx
        left = triggerRect.left + (triggerRect.width - panelRect.width) / 2
        break
      case 'left':
        top = triggerRect.top + (triggerRect.height - panelRect.height) / 2
        left = triggerRect.left - panelRect.width - gapPx
        break
      case 'right':
        top = triggerRect.top + (triggerRect.height - panelRect.height) / 2
        left = triggerRect.right + gapPx
        break
    }

    const maxLeft = window.innerWidth - panelRect.width - 8
    const maxTop = window.innerHeight - panelRect.height - 8
    left = Math.max(8, Math.min(left, maxLeft))
    top = Math.max(8, Math.min(top, maxTop))

    positionStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 'var(--v-popover-z-index)',
      margin: 0,
    }
  }

  const focusInitialElement = async () => {
    await nextTick()
    const panel = panelRef.value
    if (!panel) return
    const focusable = panel.querySelector<HTMLElement>(focusableSelector)
    ;(focusable ?? panel).focus()
  }

  const restoreFocus = () => {
    const target = previousFocus
    previousFocus = null
    if (target && document.contains(target)) target.focus()
  }

  const onDocumentPointerDown = (event: PointerEvent) => {
    if (!open.value) return
    const target = event.target as Node
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    close('outside')
  }

  const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!open.value || event.key !== 'Escape') return
    event.preventDefault()
    close('escape')
  }

  const bindGlobalListeners = () => {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    document.addEventListener('keydown', onDocumentKeydown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
  }

  const unbindGlobalListeners = () => {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    document.removeEventListener('keydown', onDocumentKeydown)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  }

  const onTriggerClick = () => {
    if (config.value.disabled || config.value.trigger !== 'click') return
    if (open.value) close('trigger')
    else openPanel()
  }

  const onTriggerMouseEnter = () => {
    if (config.value.disabled || config.value.trigger !== 'hover') return
    clearHoverTimer()
    openPanel()
  }

  const onTriggerMouseLeave = () => {
    if (config.value.trigger !== 'hover') return
    clearHoverTimer()
    hoverTimer = setTimeout(() => close('hover'), 120)
  }

  const onPanelMouseEnter = () => {
    if (config.value.trigger === 'hover') clearHoverTimer()
  }

  const onPanelMouseLeave = () => {
    if (config.value.trigger !== 'hover') return
    clearHoverTimer()
    hoverTimer = setTimeout(() => close('hover'), 120)
  }

  const onTriggerFocusIn = () => {
    if (config.value.disabled || config.value.trigger !== 'focus') return
    openPanel()
  }

  const onTriggerFocusOut = (event: FocusEvent) => {
    if (config.value.trigger !== 'focus') return
    const next = event.relatedTarget as Node | null
    if (panelRef.value?.contains(next) || triggerRef.value?.contains(next)) return
    close('focus')
  }

  const onCloseClick = () => close('close')

  const onPanelKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close('escape')
    }
  }

  watch(open, async (openValue) => {
    if (openValue) {
      bindGlobalListeners()
      await nextTick()
      updatePosition()
      await focusInitialElement()
      return
    }
    unbindGlobalListeners()
    restoreFocus()
  })

  onBeforeUnmount(() => {
    clearHoverTimer()
    unbindGlobalListeners()
  })

  return {
    config,
    open,
    titleId,
    triggerRef,
    panelRef,
    rootAttrs,
    triggerAttrs,
    panelAttrs,
    onTriggerClick,
    onTriggerMouseEnter,
    onTriggerMouseLeave,
    onPanelMouseEnter,
    onPanelMouseLeave,
    onTriggerFocusIn,
    onTriggerFocusOut,
    onCloseClick,
    onPanelKeydown,
    updatePosition,
  }
}
