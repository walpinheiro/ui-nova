import { computed, nextTick, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import type { VContextMenuItem, VContextMenuProps } from './VContextMenu.types'
import { mountVContextMenu, resolveContextMenuIcon } from './mountVContextMenu'
import { computeContextMenuPosition } from './positionContextMenu'

export type VContextMenuEmit = {
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:x', value: number): void
  (event: 'update:y', value: number): void
  (event: 'open-change', value: boolean): void
  (event: 'select', value: string): void
}

function actionableItems(items: VContextMenuItem[]) {
  return items.filter((item) => !item.divider && !item.disabled)
}

export function useVContextMenu(props: VContextMenuProps, emit: VContextMenuEmit) {
  const config = computed(() => mountVContextMenu(props))
  const isOpen = ref(Boolean(props.modelValue))
  const activeSubmenu = ref<string | null>(null)
  const rootRef = ref<HTMLElement | null>(null)
  const menuRef = ref<HTMLDivElement | null>(null)
  const menuCoords = ref({ top: props.y ?? 0, left: props.x ?? 0 })
  const menuPositionReady = ref(false)
  const previousFocus = ref<HTMLElement | null>(null)
  let typeaheadBuffer = ''
  let typeaheadTimer: ReturnType<typeof setTimeout> | null = null

  const menuPositionStyle = computed((): CSSProperties => ({
    position: 'fixed',
    top: `${menuCoords.value.top}px`,
    left: `${menuCoords.value.left}px`,
    zIndex: 1000,
    margin: 0,
    visibility: menuPositionReady.value ? 'visible' : 'hidden',
  }))

  const bindRootRef = (el: unknown) => {
    rootRef.value = el as HTMLElement | null
  }

  const bindMenuRef = (el: unknown) => {
    menuRef.value = el as HTMLDivElement | null
  }

  const estimateMenuHeight = () => {
    const rows = config.value.items.filter((item) => !item.divider).length
    const dividers = config.value.items.filter((item) => item.divider).length
    return rows * 36 + dividers * 9 + 8
  }

  const actionable = computed(() => actionableItems(config.value.items))

  const clearTypeahead = () => {
    typeaheadBuffer = ''
    if (typeaheadTimer) {
      clearTimeout(typeaheadTimer)
      typeaheadTimer = null
    }
  }

  const setOpen = (open: boolean) => {
    if (config.value.disabled) return
    isOpen.value = open
    emit('update:modelValue', open)
    emit('open-change', open)
    if (!open) {
      activeSubmenu.value = null
      menuPositionReady.value = false
      clearTypeahead()
    }
  }

  const openAt = (x: number, y: number, focusTarget?: HTMLElement | null) => {
    if (config.value.disabled) return
    menuCoords.value = { top: y, left: x }
    emit('update:x', x)
    emit('update:y', y)
    if (focusTarget) previousFocus.value = focusTarget
    setOpen(true)
    void nextTick(() => {
      const first = actionable.value[0]
      if (first) focusItem(first.value)
    })
  }

  const focusItem = (value: string) => {
    void nextTick(() => {
      document.querySelector<HTMLElement>(`[data-item-value="${value}"]`)?.focus()
    })
  }

  const restoreFocus = () => {
    const target = previousFocus.value
    if (target && document.contains(target)) target.focus()
  }

  const selectItem = (item: VContextMenuItem) => {
    if (config.value.disabled || item.disabled || item.divider) return
    if (item.children?.length) {
      activeSubmenu.value = item.value
      const firstChild = actionableItems(item.children)[0]
      if (firstChild) focusItem(firstChild.value)
      return
    }
    emit('select', item.value)
    setOpen(false)
    void nextTick(restoreFocus)
  }

  const onContextMenu = (event: MouseEvent) => {
    if (config.value.disabled) return
    event.preventDefault()
    openAt(event.clientX, event.clientY, event.currentTarget as HTMLElement)
  }

  const onItemKeydown = (event: KeyboardEvent, item: VContextMenuItem, siblings: VContextMenuItem[]) => {
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
      restoreFocus()
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
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      typeaheadBuffer += event.key.toLowerCase()
      if (typeaheadTimer) clearTimeout(typeaheadTimer)
      typeaheadTimer = setTimeout(() => {
        typeaheadBuffer = ''
        typeaheadTimer = null
      }, 500)
      const match = enabled.find((candidate) => candidate.label.toLowerCase().startsWith(typeaheadBuffer))
      if (match) focusItem(match.value)
    }
  }

  const onClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (rootRef.value?.contains(target) || menuRef.value?.contains(target)) return
    setOpen(false)
  }

  const updatePosition = () => {
    const anchorX = menuCoords.value.left
    const anchorY = menuCoords.value.top
    let menuRect = menuRef.value?.getBoundingClientRect()
    if (!menuRect || menuRect.width === 0 || menuRect.height === 0) {
      menuRect = new DOMRect(0, 0, 200, estimateMenuHeight())
    }

    const result = computeContextMenuPosition(anchorX, anchorY, menuRect)
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

  const onDocumentKeydown = (event: KeyboardEvent) => {
    if (!isOpen.value || event.key !== 'Escape') return
    event.preventDefault()
    setOpen(false)
    restoreFocus()
  }

  const bindPositionListeners = () => {
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onDocumentKeydown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
  }

  const unbindPositionListeners = () => {
    document.removeEventListener('mousedown', onClickOutside)
    document.removeEventListener('keydown', onDocumentKeydown)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  }

  watch(
    () => props.modelValue,
    (value) => {
      if (value === undefined) return
      isOpen.value = value
      if (value) {
        if (props.x !== undefined) menuCoords.value.left = props.x
        if (props.y !== undefined) menuCoords.value.top = props.y
        schedulePositionUpdate()
      }
    },
  )

  watch(
    () => [props.x, props.y] as const,
    ([x, y]) => {
      if (x !== undefined) menuCoords.value.left = x
      if (y !== undefined) menuCoords.value.top = y
      if (isOpen.value) schedulePositionUpdate()
    },
  )

  watch(isOpen, (open) => {
    if (open) {
      schedulePositionUpdate()
      bindPositionListeners()
    } else {
      unbindPositionListeners()
      menuPositionReady.value = false
    }
  })

  onBeforeUnmount(() => {
    unbindPositionListeners()
    clearTypeahead()
  })

  const rootAttrs = computed<Record<string, unknown>>(() => ({
    class: [
      'v-context-menu',
      `v-context-menu--${config.value.size}`,
      {
        'v-context-menu--open': isOpen.value,
        'v-context-menu--loading': config.value.loading,
      },
    ],
    'data-test-id': 'v-context-menu',
    'data-size': config.value.size,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : isOpen.value
          ? 'open'
          : 'default',
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    onContextmenu: onContextMenu,
  }))

  const menuAttrs = computed<Record<string, unknown>>(() => ({
    class: [
      'v-context-menu__menu',
      `v-context-menu__menu--${config.value.size}`,
      { 'v-context-menu__menu--open': isOpen.value },
    ],
    role: 'menu' as const,
    'aria-label': props.ariaLabel,
    'data-test-id': 'context-menu',
    onKeydown: (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        restoreFocus()
      }
    },
  }))

  const itemAttrs = (item: VContextMenuItem, siblings: VContextMenuItem[]): Record<string, unknown> => ({
    class: [
      'v-context-menu__item',
      {
        'v-context-menu__item--selected': item.selected,
        'v-context-menu__item--destructive': item.destructive,
        'v-context-menu__item--disabled': item.disabled,
        'v-context-menu__item--submenu': Boolean(item.children?.length),
      },
    ],
    role: 'menuitem' as const,
    type: 'button' as const,
    'aria-disabled': item.disabled || undefined,
    'aria-haspopup': item.children?.length ? 'menu' : undefined,
    'aria-expanded': item.children?.length ? activeSubmenu.value === item.value : undefined,
    tabindex: item.disabled ? -1 : 0,
    'data-item-value': item.value,
    'data-test-id': item.destructive
      ? 'context-menu-item-destructive'
      : item.disabled
        ? 'context-menu-item-disabled'
        : item.selected
          ? 'context-menu-item-selected'
          : `context-menu-item-${item.value}`,
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
    bindMenuRef,
    rootAttrs,
    menuAttrs,
    itemAttrs,
    menuPositionStyle,
    openAt,
    setOpen,
    selectItem,
    resolveContextMenuIcon,
  }
}
