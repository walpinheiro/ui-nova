import { computed, nextTick, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import type { VMenuBarItem, VMenuBarMenu, VMenuBarProps } from './VMenuBar.types'
import { mountVMenuBar } from './mountVMenuBar'
import { computeDropdownMenuPosition, type DropdownMenuPlacement } from '../VDropdownMenu/positionDropdownMenu'

export type VMenuBarEmit = {
  (event: 'select', value: string): void
  (event: 'open-change', value: string | null): void
}

function actionableItems(items: VMenuBarItem[]) {
  return items.filter((item) => !item.divider && !item.disabled)
}

function enabledMenus(menus: VMenuBarMenu[]) {
  return menus.filter((menu) => !menu.disabled)
}

export function useVMenuBar(props: VMenuBarProps, emit: VMenuBarEmit) {
  const config = computed(() => mountVMenuBar(props))
  const openMenuValue = ref<string | null>(null)
  const activeSubmenu = ref<string | null>(null)
  const triggerRefs = ref<Record<string, HTMLButtonElement | null>>({})
  const menuRef = ref<HTMLDivElement | null>(null)
  const menuPlacement = ref<DropdownMenuPlacement>('bottom-start')
  const menuCoords = ref({ top: 0, left: 0 })
  const menuPositionReady = ref(false)
  let hoverTimer: ReturnType<typeof setTimeout> | null = null
  let closeHoverTimer: ReturnType<typeof setTimeout> | null = null

  const openMenu = computed(() =>
    config.value.items.find((menu) => menu.value === openMenuValue.value) ?? null,
  )

  const menuPositionStyle = computed((): CSSProperties => ({
    position: 'fixed',
    top: `${menuCoords.value.top}px`,
    left: `${menuCoords.value.left}px`,
    zIndex: 1000,
    margin: 0,
    visibility: menuPositionReady.value ? 'visible' : 'hidden',
  }))

  const bindMenuRef = (el: unknown) => {
    menuRef.value = el as HTMLDivElement | null
  }

  const bindTriggerRef = (value: string, el: unknown) => {
    triggerRefs.value[value] = el as HTMLButtonElement | null
  }

  const clearHoverTimers = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      hoverTimer = null
    }
    if (closeHoverTimer) {
      clearTimeout(closeHoverTimer)
      closeHoverTimer = null
    }
  }

  const focusTrigger = (value: string) => {
    const trigger = triggerRefs.value[value]
    if (trigger && document.contains(trigger)) trigger.focus()
  }

  const focusItem = (value: string) => {
    void nextTick(() => {
      document.querySelector<HTMLElement>(`[data-test-id="menu-bar-item-${value}"]`)?.focus()
    })
  }

  const estimateMenuHeight = (items: VMenuBarItem[]) => {
    const rows = items.filter((item) => !item.divider).length
    const dividers = items.filter((item) => item.divider).length
    return rows * 36 + dividers * 9 + 8
  }

  const updatePosition = () => {
    const menu = openMenu.value
    if (!menu) return
    const trigger = triggerRefs.value[menu.value]
    if (!trigger) return

    const triggerRect = trigger.getBoundingClientRect()
    let menuRect = menuRef.value?.getBoundingClientRect()
    if (!menuRect || menuRect.width === 0 || menuRect.height === 0) {
      menuRect = new DOMRect(0, 0, 200, estimateMenuHeight(menu.children))
    }

    const result = computeDropdownMenuPosition(triggerRect, menuRect, 'start')
    menuPlacement.value = result.placement
    menuCoords.value = { top: result.top, left: result.left }
    menuPositionReady.value = true
  }

  const schedulePositionUpdate = () => {
    menuPositionReady.value = false
    void nextTick(() => {
      updatePosition()
      requestAnimationFrame(() => {
        updatePosition()
        requestAnimationFrame(updatePosition)
      })
    })
  }

  const setOpenMenu = (value: string | null) => {
    if (config.value.disabled) return
    openMenuValue.value = value
    activeSubmenu.value = null
    emit('open-change', value)
    if (!value) menuPositionReady.value = false
  }

  const closeMenu = () => setOpenMenu(null)

  const toggleMenu = (menu: VMenuBarMenu) => {
    if (config.value.disabled || menu.disabled) return
    if (openMenuValue.value === menu.value) {
      closeMenu()
      return
    }
    setOpenMenu(menu.value)
    const first = actionableItems(menu.children)[0]
    if (first) focusItem(first.value)
  }

  const selectItem = (item: VMenuBarItem) => {
    if (config.value.disabled || item.disabled || item.divider) return
    if (item.children?.length) {
      activeSubmenu.value = item.value
      const firstChild = actionableItems(item.children)[0]
      if (firstChild) focusItem(firstChild.value)
      return
    }
    emit('select', item.value)
    const menuValue = openMenuValue.value
    closeMenu()
    if (menuValue) void nextTick(() => focusTrigger(menuValue))
  }

  const focusableTriggers = () =>
    enabledMenus(config.value.items)
      .map((menu) => triggerRefs.value[menu.value])
      .filter((trigger): trigger is HTMLButtonElement => Boolean(trigger && document.contains(trigger)))

  const focusAdjacentTrigger = (currentValue: string, direction: 1 | -1) => {
    const menus = enabledMenus(config.value.items)
    const currentIndex = menus.findIndex((menu) => menu.value === currentValue)
    if (currentIndex === -1) return
    const next = menus[(currentIndex + direction + menus.length) % menus.length]
    focusTrigger(next.value)
  }

  const onTriggerKeydown = (event: KeyboardEvent, menu: VMenuBarMenu) => {
    if (config.value.disabled || menu.disabled) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (openMenuValue.value !== menu.value) {
        setOpenMenu(menu.value)
        const first = actionableItems(menu.children)[0]
        if (first) focusItem(first.value)
      } else {
        closeMenu()
      }
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      event.stopPropagation()
      focusAdjacentTrigger(menu.value, 1)
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      event.stopPropagation()
      focusAdjacentTrigger(menu.value, -1)
      return
    }

    if (event.key === 'ArrowDown' && openMenuValue.value !== menu.value) {
      event.preventDefault()
      setOpenMenu(menu.value)
      const first = actionableItems(menu.children)[0]
      if (first) focusItem(first.value)
      return
    }

    if (event.key === 'Escape' && openMenuValue.value === menu.value) {
      event.preventDefault()
      closeMenu()
      focusTrigger(menu.value)
    }
  }

  const onItemKeydown = (event: KeyboardEvent, item: VMenuBarItem, siblings: VMenuBarItem[]) => {
    const enabled = actionableItems(siblings)
    const index = enabled.findIndex((candidate) => candidate.value === item.value)

    if (event.key === 'Escape') {
      event.preventDefault()
      if (activeSubmenu.value) {
        activeSubmenu.value = null
        focusItem(item.value)
        return
      }
      const menuValue = openMenuValue.value
      closeMenu()
      if (menuValue) focusTrigger(menuValue)
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
      const parent = openMenu.value?.children.find((candidate) => candidate.value === activeSubmenu.value)
      activeSubmenu.value = null
      if (parent) focusItem(parent.value)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectItem(item)
    } else if (event.key === 'Tab') {
      closeMenu()
    }
  }

  const onTriggerMouseEnter = (menu: VMenuBarMenu) => {
    if (!config.value.openOnHover || config.value.disabled || menu.disabled) return
    clearHoverTimers()
    hoverTimer = setTimeout(() => {
      setOpenMenu(menu.value)
      schedulePositionUpdate()
    }, config.value.hoverDelay)
  }

  const onTriggerMouseLeave = () => {
    if (!config.value.openOnHover) return
    clearHoverTimers()
    closeHoverTimer = setTimeout(() => {
      closeMenu()
    }, config.value.hoverDelay)
  }

  const onMenuMouseEnter = () => {
    if (!config.value.openOnHover) return
    clearHoverTimers()
  }

  const onMenuMouseLeave = () => {
    if (!config.value.openOnHover) return
    clearHoverTimers()
    closeHoverTimer = setTimeout(() => {
      closeMenu()
    }, config.value.hoverDelay)
  }

  const onClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    const openValue = openMenuValue.value
    if (!openValue) return
    const trigger = triggerRefs.value[openValue]
    if (trigger?.contains(target) || menuRef.value?.contains(target)) return
    closeMenu()
  }

  const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!openMenuValue.value || event.key !== 'Escape') return
    event.preventDefault()
    const menuValue = openMenuValue.value
    closeMenu()
    focusTrigger(menuValue)
  }

  const bindDocumentListeners = () => {
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onDocumentKeydown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
  }

  const unbindDocumentListeners = () => {
    document.removeEventListener('mousedown', onClickOutside)
    document.removeEventListener('keydown', onDocumentKeydown)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  }

  watch(openMenuValue, (value) => {
    if (value) {
      schedulePositionUpdate()
      bindDocumentListeners()
    } else {
      unbindDocumentListeners()
      menuPositionReady.value = false
    }
  })

  onBeforeUnmount(() => {
    clearHoverTimers()
    unbindDocumentListeners()
  })

  const rootAttrs = computed<Record<string, unknown>>(() => ({
    class: [
      'v-menu-bar',
      `v-menu-bar--${config.value.size}`,
      `v-menu-bar--${config.value.variant}`,
      {
        'v-menu-bar--disabled': config.value.disabled,
        'v-menu-bar--loading': config.value.loading,
        'v-menu-bar--open': Boolean(openMenuValue.value),
      },
    ],
    role: 'menubar',
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'aria-label': props.ariaLabel ?? 'Menu bar',
    'data-test-id': 'v-menu-bar',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : openMenuValue.value
          ? 'open'
          : 'default',
  }))

  const triggerAttrs = (menu: VMenuBarMenu): Record<string, unknown> => ({
    class: [
      'v-menu-bar__trigger',
      {
        'v-menu-bar__trigger--open': openMenuValue.value === menu.value,
        'v-menu-bar__trigger--disabled': menu.disabled,
      },
    ],
    type: 'button' as const,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': openMenuValue.value === menu.value,
    'aria-disabled': menu.disabled || config.value.disabled || undefined,
    'data-test-id': `menu-bar-trigger-${menu.value}`,
    'data-menu-bar-focusable': 'true',
    disabled: menu.disabled || config.value.disabled || undefined,
    onClick: () => toggleMenu(menu),
    onKeydown: (event: KeyboardEvent) => onTriggerKeydown(event, menu),
    onMouseenter: () => onTriggerMouseEnter(menu),
    onMouseleave: onTriggerMouseLeave,
  })

  const menuAttrs = computed<Record<string, unknown>>(() => ({
    class: [
      'v-dropdown-menu__menu',
      'v-menu-bar__menu',
      `v-dropdown-menu__menu--${menuPlacement.value}`,
      { 'v-dropdown-menu__menu--open': Boolean(openMenuValue.value) },
    ],
    role: 'menu' as const,
    'data-test-id': 'menu-bar-panel',
    onMouseenter: onMenuMouseEnter,
    onMouseleave: onMenuMouseLeave,
    onKeydown: (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        const menuValue = openMenuValue.value
        closeMenu()
        if (menuValue) focusTrigger(menuValue)
      }
    },
  }))

  const itemAttrs = (item: VMenuBarItem, siblings: VMenuBarItem[]): Record<string, unknown> => ({
    class: [
      'v-dropdown-menu__item',
      'v-menu-bar__item',
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
      ? 'menu-bar-item-destructive'
      : item.disabled
        ? 'menu-bar-item-disabled'
        : item.selected
          ? 'menu-bar-item-selected'
          : `menu-bar-item-${item.value}`,
    onClick: () => selectItem(item),
    onKeydown: (event: KeyboardEvent) => onItemKeydown(event, item, siblings),
    onMouseenter: () => {
      if (item.children?.length) activeSubmenu.value = item.value
    },
  })

  const onBarKeydown = (event: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    const buttons = focusableTriggers()
    if (buttons.length === 0) return
    const active = document.activeElement as HTMLElement | null
    const currentIndex = buttons.findIndex((el) => el === active)
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight') {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % buttons.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = currentIndex === -1 ? buttons.length - 1 : (currentIndex - 1 + buttons.length) % buttons.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = buttons.length - 1
    }
    if (nextIndex !== null) {
      event.preventDefault()
      buttons[nextIndex]?.focus()
    }
  }

  return {
    config,
    openMenuValue,
    openMenu,
    activeSubmenu,
    bindMenuRef,
    bindTriggerRef,
    rootAttrs,
    triggerAttrs,
    menuAttrs,
    itemAttrs,
    menuPositionStyle,
    menuPlacement,
    onBarKeydown,
    closeMenu,
    toggleMenu,
    selectItem,
  }
}
