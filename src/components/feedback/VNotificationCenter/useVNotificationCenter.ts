import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch,
  type CSSProperties,
} from 'vue'
import type {
  VNotificationCenterEmit,
  VNotificationCenterItem,
  VNotificationCenterProps,
  VNotificationCenterTab,
} from './VNotificationCenter.types'
import { isMotionDisabled, useReducedMotion } from '../../../composables/useReducedMotion'
import { mountVNotificationCenter } from './mountVNotificationCenter'

export function useVNotificationCenter(props: VNotificationCenterProps, emit: VNotificationCenterEmit) {
  const config = computed(() => mountVNotificationCenter(props))
  const reduced = useReducedMotion()
  const instanceId = useId()
  const panelId = `v-notification-center-panel-${instanceId}`
  const liveId = `v-notification-center-live-${instanceId}`
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const open = ref(Boolean(props.modelValue))
  const positionStyle = ref<CSSProperties>({ visibility: 'hidden' })
  let previousFocus: HTMLElement | null = null

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== undefined) open.value = value
    },
  )

  const filteredNotifications = computed(() => {
    let items = config.value.notifications

    if (config.value.activeTab === 'unread') {
      items = items.filter((item) => item.unread)
    } else if (config.value.activeTab !== 'all') {
      items = items.filter((item) => item.tab === config.value.activeTab)
    }

    const query = config.value.searchQuery.trim().toLowerCase()
    if (query) {
      items = items.filter((item) => {
        const haystack = `${item.title} ${item.preview ?? ''}`.toLowerCase()
        return haystack.includes(query)
      })
    }

    return items
  })

  const groupedNotifications = computed(() => {
    const groups = new Map<string, VNotificationCenterItem[]>()

    for (const item of filteredNotifications.value) {
      const key = item.group ?? 'today'
      const bucket = groups.get(key) ?? []
      bucket.push(item)
      groups.set(key, bucket)
    }

    return groups
  })

  const liveMessage = computed(() => {
    const count = config.value.unreadCount
    if (count === 0) return 'No unread notifications'
    return `${count} unread notification${count === 1 ? '' : 's'}`
  })

  const isExpressive = computed(
    () => config.value.motion === 'expressive' && !isMotionDisabled(config.value.motion, reduced.value),
  )
  const shouldRingBell = computed(
    () => isExpressive.value && (open.value || config.value.unreadCount > 0),
  )

  const rootAttrs = computed(() => ({
    class: [
      'v-notification-center',
      `v-notification-center--${config.value.size}`,
      `v-notification-center--${config.value.variant}`,
      {
        'v-notification-center--open': open.value,
        'v-notification-center--disabled': config.value.disabled,
        'v-notification-center--loading': config.value.loading,
        'v-notification-center--expressive': isExpressive.value,
      },
    ],
    'data-test-id': 'v-notification-center',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : filteredNotifications.value.length === 0
          ? 'empty'
          : open.value
            ? 'open'
            : config.value.unreadCount > 0
              ? 'unread'
              : 'default',
  }))

  const triggerAttrs = computed(() => ({
    class: [
      'v-notification-center__trigger',
      {
        'v-notification-center__trigger--open': open.value,
        'v-notification-center__trigger--expressive': isExpressive.value,
        'v-notification-center__trigger--ring': shouldRingBell.value,
      },
    ],
    'data-test-id': 'v-notification-center-trigger',
    'data-size': config.value.size,
    'data-unread-count': String(config.value.unreadCount),
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': open.value,
    'aria-controls': open.value ? panelId : undefined,
    'aria-label': props.triggerLabel ?? config.value.triggerLabel,
    'aria-disabled': config.value.disabled || undefined,
  }))

  const panelAttrs = computed(() => ({
    id: panelId,
    class: [
      'v-notification-center__panel',
      `v-notification-center__panel--${config.value.placement}`,
      { 'v-notification-center__panel--drawer': config.value.isDrawer },
    ],
    role: config.value.isDrawer ? ('dialog' as const) : ('region' as const),
    'aria-label': props.ariaLabel ?? config.value.headerTitle,
    tabindex: -1,
    'data-test-id': config.value.showPanelInline ? undefined : 'v-notification-center-panel',
    style: config.value.showPanelInline ? undefined : positionStyle.value,
  }))

  const setOpen = (value: boolean) => {
    if (config.value.disabled) return
    open.value = value
    emit('update:modelValue', value)
  }

  const updatePosition = () => {
    if (config.value.showPanelInline || config.value.isDrawer) return

    const trigger = triggerRef.value
    const panel = panelRef.value
    if (!trigger || !panel || typeof window === 'undefined') return

    const triggerRect = trigger.getBoundingClientRect()
    const panelRect = panel.getBoundingClientRect()
    const gap = 8
    const viewportPadding = 8
    const maxPanelHeight = 512

    let top = triggerRect.bottom + gap
    let left = triggerRect.right - panelRect.width

    if (config.value.placement.startsWith('top')) {
      top = triggerRect.top - panelRect.height - gap
    }
    if (config.value.placement.endsWith('start')) {
      left = triggerRect.left
    }

    const availableHeight = config.value.placement.startsWith('top')
      ? triggerRect.top - gap - viewportPadding
      : window.innerHeight - triggerRect.bottom - gap - viewportPadding

    const maxLeft = window.innerWidth - panelRect.width - viewportPadding
    const maxTop = window.innerHeight - panelRect.height - viewportPadding
    left = Math.max(viewportPadding, Math.min(left, maxLeft))
    top = Math.max(viewportPadding, Math.min(top, maxTop))

    if (!config.value.placement.startsWith('top') && top + panelRect.height > window.innerHeight - viewportPadding) {
      top = Math.max(viewportPadding, triggerRect.top - panelRect.height - gap)
    }

    positionStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 'var(--v-popover-z-index)',
      margin: 0,
      visibility: 'visible',
      maxHeight: `${Math.max(160, Math.min(maxPanelHeight, availableHeight))}px`,
    }
  }

  const restoreFocus = () => {
    const target = previousFocus
    previousFocus = null
    if (target && typeof document !== 'undefined' && document.contains(target)) {
      target.focus()
    }
  }

  const onDocumentPointerDown = (event: PointerEvent) => {
    if (!open.value || config.value.showPanelInline) return
    const target = event.target as Node
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    setOpen(false)
  }

  const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!open.value || event.key !== 'Escape' || config.value.showPanelInline) return
    event.preventDefault()
    setOpen(false)
  }

  const bindGlobalListeners = () => {
    if (typeof document === 'undefined') return
    document.addEventListener('pointerdown', onDocumentPointerDown)
    document.addEventListener('keydown', onDocumentKeydown)
    window.addEventListener('resize', updatePosition)
    if (config.value.isDrawer) {
      document.body.style.overflow = 'hidden'
    }
  }

  const unbindGlobalListeners = () => {
    if (typeof document === 'undefined') return
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    document.removeEventListener('keydown', onDocumentKeydown)
    window.removeEventListener('resize', updatePosition)
    document.body.style.overflow = ''
  }

  const toggleOpen = () => {
    if (config.value.disabled || config.value.showPanelInline) return
    if (open.value) {
      setOpen(false)
      return
    }
    previousFocus = document.activeElement as HTMLElement | null
    setOpen(true)
  }

  const closePanel = () => {
    if (config.value.showPanelInline) return
    setOpen(false)
  }

  const onTabClick = (tab: VNotificationCenterTab) => {
    emit('update:activeTab', tab)
  }

  const onSearchInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    emit('update:searchQuery', value)
  }

  const onMarkAllRead = () => {
    emit('mark-all-read')
  }

  const onViewAll = () => {
    emit('view-all')
  }

  const onItemClick = (id: string) => {
    emit('item-click', id)
  }

  watch(open, async (isOpen) => {
    if (config.value.showPanelInline) return

    if (isOpen) {
      bindGlobalListeners()
      await nextTick()
      updatePosition()
      return
    }

    unbindGlobalListeners()
    restoreFocus()
  })

  onBeforeUnmount(() => {
    unbindGlobalListeners()
  })

  return {
    config,
    isExpressive,
    shouldRingBell,
    open,
    liveId,
    triggerRef,
    panelRef,
    filteredNotifications,
    groupedNotifications,
    liveMessage,
    rootAttrs,
    triggerAttrs,
    panelAttrs,
    toggleOpen,
    closePanel,
    onTabClick,
    onSearchInput,
    onMarkAllRead,
    onViewAll,
    onItemClick,
    updatePosition,
  }
}
