import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'
import type { VDropdownMenuItem, VDropdownMenuProps } from './VDropdownMenu.types'
import { useDropdownGroup } from './dropdownGroup'
import { mountVDropdownMenu, resolveDropdownIcon } from './mountVDropdownMenu'
import { computeDropdownMenuPosition, type DropdownMenuPlacement } from './positionDropdownMenu'

export type VDropdownMenuEmit = {
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:value', value: string): void
  (event: 'open-change', value: boolean): void
  (event: 'select', value: string): void
}

function actionableItems(items: VDropdownMenuItem[]) {
  return items.filter((item) => !item.divider && !item.disabled)
}

export function useVDropdownMenu(props: VDropdownMenuProps, emit: VDropdownMenuEmit) {
  const config = computed(() => mountVDropdownMenu(props))
  const isOpen = ref(Boolean(props.modelValue))
  const activeSubmenu = ref<string | null>(null)
  const rootRef = ref<HTMLElement | null>(null)
  const triggerRef = ref<HTMLButtonElement | null>(null)
  const menuRef = ref<HTMLDivElement | null>(null)
  const dropdownGroup = useDropdownGroup()
  const instanceId = Symbol('v-dropdown-menu')
  const menuPlacement = ref<DropdownMenuPlacement>('bottom-start')

  const submenuSide = ref<'right' | 'left'>('right')
  const submenuOffsetY = ref(0)

  const submenuPlacementClass = computed(() =>
    submenuSide.value === 'left' ? 'v-dropdown-menu__submenu--left' : '',
  )
  const submenuPositionStyle = computed((): CSSProperties =>
    submenuOffsetY.value ? { top: `${submenuOffsetY.value}px` } : {},
  )

  const updateSubmenuPosition = () => {
    const submenu = menuRef.value?.querySelector<HTMLElement>('.v-dropdown-menu__submenu')
    const wrap = submenu?.parentElement
    if (!submenu || !wrap) return
    const pad = 8
    const gap = 4
    const wrapRect = wrap.getBoundingClientRect()
    const subRect = submenu.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Measure from the default (right, top-aligned) position.
    const naturalLeft = wrapRect.right + gap
    const naturalTop = wrapRect.top
    const overflowsRight = naturalLeft + subRect.width > vw - pad
    const fitsLeft = wrapRect.left - gap - subRect.width >= pad
    submenuSide.value = overflowsRight && fitsLeft ? 'left' : 'right'
    const bottomOverflow = naturalTop + subRect.height - (vh - pad)
    let dy = bottomOverflow > 0 ? -bottomOverflow : 0
    if (naturalTop + dy < pad) dy = pad - naturalTop
    submenuOffsetY.value = Math.round(dy)
  }

  const menuPositionStyle = computed((): CSSProperties => ({
    minWidth: triggerRef.value ? `${triggerRef.value.getBoundingClientRect().width}px` : undefined,
  }))

  const bindRootRef = (el: unknown) => {
    rootRef.value = el as HTMLElement | null
  }

  const bindTriggerRef = (el: unknown) => {
    triggerRef.value = el as HTMLButtonElement | null
  }

  const bindMenuRef = (el: unknown) => {
    menuRef.value = el as HTMLDivElement | null
  }

  const estimateMenuHeight = () => {
    const rows = config.value.items.filter((item) => !item.divider).length
    const dividers = config.value.items.filter((item) => item.divider).length
    return rows * 36 + dividers * 9 + 8
  }

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== undefined) {
        isOpen.value = value
        if (value) schedulePositionUpdate()
      }
    },
  )

  const actionable = computed(() => actionableItems(config.value.items))

  const setOpen = (open: boolean) => {
    if (config.value.disabled) return
    if (open) dropdownGroup?.notifyOpen(instanceId)
    isOpen.value = open
    emit('update:modelValue', open)
    emit('open-change', open)
    if (!open) {
      activeSubmenu.value = null
    }
  }

  const toggle = () => setOpen(!isOpen.value)

  const focusItem = (value: string) => {
    void nextTick(() => {
      document.querySelector<HTMLElement>(`[data-test-id="dropdown-item-${value}"]`)?.focus()
    })
  }

  const focusTrigger = () => {
    const trigger = triggerRef.value
    if (trigger && document.contains(trigger)) trigger.focus()
  }

  const selectItem = (item: VDropdownMenuItem) => {
    if (config.value.disabled || item.disabled || item.divider) return
    if (item.children?.length) {
      activeSubmenu.value = item.value
      const firstChild = actionableItems(item.children)[0]
      if (firstChild) focusItem(firstChild.value)
      return
    }
    emit('select', item.value)
    emit('update:value', item.value)
    setOpen(false)
    void nextTick(focusTrigger)
  }

  const onTriggerKeydown = (event: KeyboardEvent) => {
    if (config.value.disabled) return
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen.value) {
        setOpen(true)
        const first = actionable.value[0]
        if (first) focusItem(first.value)
      } else {
        const first = actionable.value[0]
        if (first) focusItem(first.value)
      }
    } else if (event.key === 'Escape' && isOpen.value) {
      event.preventDefault()
      setOpen(false)
      focusTrigger()
    }
  }

  const onItemKeydown = (event: KeyboardEvent, item: VDropdownMenuItem, siblings: VDropdownMenuItem[]) => {
    const enabled = actionableItems(siblings)
    const index = enabled.findIndex((candidate) => candidate.value === item.value)
    if (event.key === 'Escape') {
      event.preventDefault()
      if (activeSubmenu.value) {
        activeSubmenu.value = null
        focusItem(item.value)
        return
      }
      setOpen(false)
      focusTrigger()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = enabled[(index + 1) % enabled.length]
      focusItem(next.value)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const next = enabled[(index - 1 + enabled.length) % enabled.length]
      focusItem(next.value)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusItem(enabled[0].value)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusItem(enabled[enabled.length - 1].value)
    } else if (event.key === 'ArrowRight' && item.children?.length) {
      event.preventDefault()
      activeSubmenu.value = item.value
      const firstChild = actionableItems(item.children)[0]
      if (firstChild) focusItem(firstChild.value)
    } else if (event.key === 'ArrowLeft' && activeSubmenu.value) {
      event.preventDefault()
      const parent = config.value.items.find((candidate) => candidate.value === activeSubmenu.value)
      activeSubmenu.value = null
      if (parent) focusItem(parent.value)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectItem(item)
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  const onClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (rootRef.value?.contains(target) || menuRef.value?.contains(target)) return
    setOpen(false)
  }

  const updatePosition = () => {
    const trigger =
      triggerRef.value ?? rootRef.value?.querySelector<HTMLButtonElement>('[data-test-id="dropdown-trigger"]')
    if (!trigger) return

    const triggerRect = trigger.getBoundingClientRect()
    let menuRect = menuRef.value?.getBoundingClientRect()
    if (!menuRect || menuRect.width === 0 || menuRect.height === 0) {
      menuRect = new DOMRect(0, 0, 200, estimateMenuHeight())
    }

    const result = computeDropdownMenuPosition(
      triggerRect,
      menuRect,
      config.value.menuAlign,
    )
    menuPlacement.value = result.placement
  }

  const schedulePositionUpdate = () => {
    void nextTick(() => {
      updatePosition()
      requestAnimationFrame(updatePosition)
    })
  }

  const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!isOpen.value || event.key !== 'Escape') return
    event.preventDefault()
    setOpen(false)
    focusTrigger()
  }

  const bindPositionListeners = () => {
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onDocumentKeydown)
    window.addEventListener('resize', updatePosition)
  }

  const unbindPositionListeners = () => {
    document.removeEventListener('mousedown', onClickOutside)
    document.removeEventListener('keydown', onDocumentKeydown)
    window.removeEventListener('resize', updatePosition)
  }

  watch(activeSubmenu, (value) => {
    submenuSide.value = 'right'
    submenuOffsetY.value = 0
    if (value) void nextTick(updateSubmenuPosition)
  })

  watch(isOpen, (open) => {
    if (open) {
      schedulePositionUpdate()
      void nextTick(() => bindPositionListeners())
    } else {
      unbindPositionListeners()
    }
  })

  onMounted(() => {
    dropdownGroup?.register(instanceId, () => setOpen(false))
    if (isOpen.value) schedulePositionUpdate()
  })

  onBeforeUnmount(() => {
    unbindPositionListeners()
    dropdownGroup?.unregister(instanceId)
  })

  const rootAttrs = computed<Record<string, unknown>>(() => ({
    class: [
      'v-dropdown-menu',
      `v-dropdown-menu--${config.value.size}`,
      `v-dropdown-menu--${config.value.variant}`,
      `v-dropdown-menu--trigger-${config.value.triggerStyle}`,
      `v-dropdown-menu--menu-align-${config.value.menuAlign}`,
      {
        'v-dropdown-menu--open': isOpen.value,
        'v-dropdown-menu--loading': config.value.loading,
      },
    ],
    'data-test-id': 'dropdown',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : isOpen.value
          ? 'open'
          : 'default',
  }))

  const triggerAttrs = computed<Record<string, unknown>>(() => ({
    class: 'v-dropdown-menu__trigger',
    type: 'button' as const,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': isOpen.value,
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel ?? config.value.label,
    'data-test-id': 'dropdown-trigger',
    disabled: config.value.disabled || undefined,
  }))

  const menuAttrs = computed<Record<string, unknown>>(() => ({
    class: [
      'v-dropdown-menu__menu',
      `v-dropdown-menu__menu--${menuPlacement.value}`,
      { 'v-dropdown-menu__menu--open': isOpen.value },
    ],
    role: 'menu' as const,
    'data-test-id': 'dropdown-menu',
    onKeydown: (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        focusTrigger()
      }
    },
  }))

  const itemAttrs = (item: VDropdownMenuItem, siblings: VDropdownMenuItem[]): Record<string, unknown> => ({
    class: [
      'v-dropdown-menu__item',
      {
        'v-dropdown-menu__item--selected': item.selected,
        'v-dropdown-menu__item--destructive': item.destructive,
        'v-dropdown-menu__item--disabled': item.disabled,
        'v-dropdown-menu__item--submenu': Boolean(item.children?.length),
      },
    ],
    role: 'menuitem' as const,
    type: 'button' as const,
    'aria-disabled': item.disabled || undefined,
    'aria-haspopup': item.children?.length ? 'menu' : undefined,
    'aria-expanded': item.children?.length ? activeSubmenu.value === item.value : undefined,
    tabindex: item.disabled ? -1 : 0,
    'data-test-id': item.destructive
      ? 'dropdown-item-destructive'
      : item.disabled
        ? 'dropdown-item-disabled'
        : item.selected
          ? 'dropdown-item-selected'
          : `dropdown-item-${item.value}`,
    onClick: () => selectItem(item),
    onKeydown: (event: KeyboardEvent) => onItemKeydown(event, item, siblings),
    onMouseenter: () => {
      if (item.children?.length) activeSubmenu.value = item.value
    },
  })

  return {
    config,
    isOpen,
    activeSubmenu,
    bindRootRef,
    bindTriggerRef,
    bindMenuRef,
    rootAttrs,
    triggerAttrs,
    menuAttrs,
    itemAttrs,
    toggle,
    setOpen,
    selectItem,
    onTriggerKeydown,
    resolveDropdownIcon,
    menuPlacement,
    menuPositionStyle,
    submenuPlacementClass,
    submenuPositionStyle,
    schedulePositionUpdate,
    updatePosition,
  }
}
