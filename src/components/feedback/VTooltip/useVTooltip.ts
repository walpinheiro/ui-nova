import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch,
  type CSSProperties,
} from 'vue'
import type { VTooltipProps } from './VTooltip.types'
import { mountVTooltip } from './mountVTooltip'
import { useWarmTooltipGroup } from '../../../composables/useWarmTooltipGroup'

const LONG_PRESS_MS = 500
const warmGroups = new Map<string, ReturnType<typeof useWarmTooltipGroup>>()

function getWarmGroup(id?: string) {
  if (!id) return useWarmTooltipGroup()
  if (!warmGroups.has(id)) warmGroups.set(id, useWarmTooltipGroup())
  return warmGroups.get(id)!
}

export function useVTooltip(props: VTooltipProps) {
  const config = computed(() => mountVTooltip(props))
  const warm = computed(() =>
    props.motion === 'expressive' ? getWarmGroup(props.warmGroup) : null,
  )
  let showDelayTimer: ReturnType<typeof setTimeout> | null = null
  const instanceId = useId()
  const tooltipId = `v-tooltip-panel-${instanceId}`
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const visible = ref(false)
  const positionStyle = ref<CSSProperties>({})
  let hideTimer: ReturnType<typeof setTimeout> | null = null
  let longPressTimer: ReturnType<typeof setTimeout> | null = null
  let pointerActive = false

  const clearHideTimer = () => {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  const clearLongPressTimer = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
  }

  const show = () => {
    if (config.value.disabled) return
    clearHideTimer()
    visible.value = true
  }

  const hide = () => {
    clearHideTimer()
    visible.value = false
  }

  const scheduleHide = () => {
    clearHideTimer()
    hideTimer = setTimeout(hide, config.value.hideDelay)
  }

  const updatePosition = () => {
    const trigger = triggerRef.value
    const panel = panelRef.value
    if (!trigger || !panel) return

    const triggerRect = trigger.getBoundingClientRect()
    const panelRect = panel.getBoundingClientRect()
    const gapPx = config.value.showArrow ? 10 : 8

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
      zIndex: 'var(--v-tooltip-z-index, 1000)',
      margin: 0,
      maxWidth: config.value.maxWidth,
    }
  }

  const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!visible.value || event.key !== 'Escape') return
    event.preventDefault()
    hide()
  }

  const bindGlobalListeners = () => {
    document.addEventListener('keydown', onDocumentKeydown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
  }

  const unbindGlobalListeners = () => {
    document.removeEventListener('keydown', onDocumentKeydown)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  }

  const clearShowDelay = () => {
    if (showDelayTimer) {
      clearTimeout(showDelayTimer)
      showDelayTimer = null
    }
  }

  const scheduleShow = () => {
    clearShowDelay()
    const delay = warm.value?.getShowDelay() ?? 0
    if (delay <= 0) {
      show()
      warm.value?.onGroupEnter()
      return
    }
    showDelayTimer = setTimeout(() => {
      show()
      warm.value?.onGroupEnter()
    }, delay)
  }

  const onTriggerMouseEnter = () => {
    if (config.value.disabled) return
    clearHideTimer()
    if (warm.value) scheduleShow()
    else show()
  }

  const onTriggerMouseLeave = () => {
    if (config.value.disabled) return
    clearShowDelay()
    warm.value?.onGroupLeave()
    scheduleHide()
  }

  const onTriggerFocusIn = () => {
    if (config.value.disabled) return
    clearHideTimer()
    show()
  }

  const onTriggerFocusOut = (event: FocusEvent) => {
    if (config.value.disabled) return
    const next = event.relatedTarget as Node | null
    if (panelRef.value?.contains(next)) return
    scheduleHide()
  }

  const onTriggerPointerDown = () => {
    if (config.value.disabled) return
    pointerActive = true
    clearLongPressTimer()
    longPressTimer = setTimeout(() => {
      if (pointerActive) show()
    }, LONG_PRESS_MS)
  }

  const onTriggerPointerUp = () => {
    pointerActive = false
    clearLongPressTimer()
  }

  const onTriggerPointerCancel = () => {
    pointerActive = false
    clearLongPressTimer()
  }

  const rootAttrs = computed(() => ({
    class: [
      'v-tooltip',
      `v-tooltip--${config.value.size}`,
      `v-tooltip--${config.value.placement}`,
      { 'v-tooltip--expressive': props.motion === 'expressive' },
    ],
    'data-test-id': 'v-tooltip',
    'data-size': config.value.size,
    'data-placement': config.value.placement,
    'data-variant': config.value.variant,
    'data-state': config.value.disabled ? 'disabled' : visible.value ? 'visible' : 'hidden',
  }))

  const triggerAttrs = computed(() => ({
    class: ['v-tooltip__trigger', { 'v-tooltip__trigger--visible': visible.value }],
    'data-test-id': 'tooltip-trigger',
    'aria-describedby': visible.value ? tooltipId : undefined,
    'aria-disabled': config.value.disabled || undefined,
  }))

  const panelAttrs = computed(() => ({
    id: tooltipId,
    class: [
      'v-tooltip__container',
      `v-tooltip__container--${config.value.placement}`,
      `v-tooltip__container--${config.value.size}`,
      `v-tooltip__container--${config.value.variant}`,
    ],
    role: 'tooltip' as const,
    'aria-label': props.ariaLabel,
    'data-test-id': config.value.testId,
    'data-variant': config.value.variant,
    style: positionStyle.value,
  }))

  watch(visible, async (openValue) => {
    if (openValue) {
      bindGlobalListeners()
      await nextTick()
      updatePosition()
      return
    }
    unbindGlobalListeners()
  })

  onBeforeUnmount(() => {
    clearHideTimer()
    clearShowDelay()
    clearLongPressTimer()
    unbindGlobalListeners()
  })

  return {
    config,
    visible,
    tooltipId,
    triggerRef,
    panelRef,
    rootAttrs,
    triggerAttrs,
    panelAttrs,
    onTriggerMouseEnter,
    onTriggerMouseLeave,
    onTriggerFocusIn,
    onTriggerFocusOut,
    onTriggerPointerDown,
    onTriggerPointerUp,
    onTriggerPointerCancel,
    updatePosition,
  }
}
