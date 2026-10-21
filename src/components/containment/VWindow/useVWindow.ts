import { computed, ref, watch } from 'vue'
import type { VWindowEmits, VWindowProps } from './VWindow.types'
import { mountVWindow } from './mountVWindow'

type EmitFn = (event: 'update:modelValue' | 'close' | 'minimize' | 'maximize' | 'resize', ...args: unknown[]) => void

const NAV_ITEMS = ['overview', 'notes', 'tasks', 'assets', 'settings'] as const

interface VWindowClassBindings {
  class: Array<string | Record<string, boolean>>
  [key: string]: unknown
}

export function useVWindow(
  props: VWindowProps,
  emit?: (event: 'update:modelValue' | 'close' | 'minimize' | 'maximize' | 'resize', ...args: unknown[]) => void,
) {
  const config = computed(() => mountVWindow(props))
  const notify = emit as EmitFn | undefined

  // --- Live size (drag resize real): parte do preset, sobrescreve via pointer ---
  const liveWidth = ref<number | null>(null)
  const liveHeight = ref<number | null>(null)
  watch(
    () => [config.value.width, config.value.height] as const,
    () => {
      liveWidth.value = null
      liveHeight.value = null
    },
  )

  /** Estilo vivo: props width/height normalizadas + drag do handle (runtime). */
  const windowStyle = computed(() => {
    const style: Record<string, string> = {}
    if (liveWidth.value != null) style.width = `${liveWidth.value}px`
    else if (config.value.width) style.width = config.value.width
    if (liveHeight.value != null) style.height = `${liveHeight.value}px`
    else if (config.value.height) style.height = config.value.height
    return style
  })

  // --- Live position (mover arrastando pela titlebar) ---
  const posX = ref(0)
  const posY = ref(0)
  const moved = ref(false)
  const rootEl = ref<HTMLElement | null>(null)
  const emitFn = (name: string, ...args: unknown[]) => (notify as unknown as ((e: string, ...a: unknown[]) => void) | undefined)?.(name, ...args)

  const rootClasses = computed(() => [
    'v-window',
    `v-window--${config.value.size}`,
    `v-window--${config.value.variant}`,
    config.value.active === true ? 'v-window--active' : '',
    config.value.active === false ? 'v-window--inactive' : '',
    config.value.disabled ? 'v-window--disabled' : '',
    config.value.loading ? 'v-window--loading' : '',
    config.value.resizable ? 'v-window--resizable' : '',
    config.value.open ? 'v-window--open' : 'v-window--closed',
    moved.value ? 'v-window--moved' : '',
  ])

  const role = computed(() => (config.value.variant === 'modal' ? 'dialog' : 'region'))

  const rootAttrs = computed<VWindowClassBindings>(() => ({
    class: rootClasses.value,
    role: role.value,
    'aria-disabled': config.value.disabled ? true : undefined,
    'aria-busy': props.loading ? true : undefined,
    'aria-label': props.ariaLabel ?? (config.value.title || undefined),
    'aria-modal': config.value.variant === 'modal' ? true : undefined,
    tabindex: config.value.disabled ? undefined : 0,
    'data-test-id': 'v-window',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
    'data-active':
      config.value.active === true ? 'true' : config.value.active === false ? 'false' : undefined,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : 'default',
  }))

  const backdropAttrs = computed<VWindowClassBindings>(() => ({
    class: ['v-window__backdrop', { 'v-window__backdrop--hidden': !config.value.open }],
    'data-test-id': 'v-window-backdrop',
    'aria-hidden': true as const,
  }))

  function onAction(action: 'minimize' | 'maximize' | 'close') {
    if (config.value.disabled) return
    if (action === 'close') (emit as VWindowEmits | undefined)?.('update:modelValue', false)
    emitFn(action)
  }

  function onBackdropClick() {
    if (config.value.disabled) return
    onAction('close')
  }

  // Emissão de resize (compat): direção 'se' do handle.
  function onResize() {
    if (config.value.disabled || !config.value.resizable) return
    emitFn('resize', 'se')
  }

  // --- Drag real no handle: pointermove redimensiona width/height ao vivo ---
  const resizing = ref(false)
  let resizeStartX = 0
  let resizeStartY = 0
  let resizeStartW = 0
  let resizeStartH = 0

  function readStartSize(el: HTMLElement): { w: number; h: number } {
    const rect = el.getBoundingClientRect()
    const parsedW = config.value.width ? Number.parseFloat(config.value.width) : NaN
    const parsedH = config.value.height ? Number.parseFloat(config.value.height) : NaN
    return {
      w: Number.isFinite(parsedW) && parsedW > 0 ? parsedW : rect.width || 0,
      h: Number.isFinite(parsedH) && parsedH > 0 ? parsedH : rect.height || 0,
    }
  }

  function onResizePointerDown(event: PointerEvent) {
    if (config.value.disabled || !config.value.resizable) return
    const root = rootEl.value ?? (event.currentTarget as HTMLElement | null)?.closest?.('.v-window') as HTMLElement | null
    if (root) rootEl.value = root
    const box = root ?? (event.currentTarget as HTMLElement)
    const start = readStartSize(box)
    resizing.value = true
    resizeStartX = event.clientX
    resizeStartY = event.clientY
    resizeStartW = liveWidth.value ?? start.w
    resizeStartH = liveHeight.value ?? start.h
    if (liveWidth.value == null) liveWidth.value = Math.round(start.w)
    if (liveHeight.value == null) liveHeight.value = Math.round(start.h)
    ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
  }

  function onResizePointerMove(event: PointerEvent) {
    if (!resizing.value || config.value.disabled) return
    liveWidth.value = Math.max(0, Math.round(resizeStartW + (event.clientX - resizeStartX)))
    liveHeight.value = Math.max(0, Math.round(resizeStartH + (event.clientY - resizeStartY)))
    emitFn('resize', { width: liveWidth.value, height: liveHeight.value, direction: 'se' })
  }

  function onResizePointerUp() {
    if (!resizing.value) return
    resizing.value = false
    emitFn('resize', { width: liveWidth.value, height: liveHeight.value, direction: 'se' })
  }

  const RESIZE_STEP = 16

  function onResizeKey(key: string) {
    if (config.value.disabled || !config.value.resizable) return
    const root = rootEl.value
    const start = root ? readStartSize(root) : { w: 0, h: 0 }
    let width = liveWidth.value ?? start.w
    let height = liveHeight.value ?? start.h
    switch (key) {
      case 'ArrowRight':
        width += RESIZE_STEP
        break
      case 'ArrowLeft':
        width = Math.max(0, width - RESIZE_STEP)
        break
      case 'ArrowDown':
        height += RESIZE_STEP
        break
      case 'ArrowUp':
        height = Math.max(0, height - RESIZE_STEP)
        break
      default:
        return
    }
    liveWidth.value = Math.round(width)
    liveHeight.value = Math.round(height)
    emitFn('resize', { width: liveWidth.value, height: liveHeight.value, direction: 'keyboard' })
  }

  // --- Mover: arrastar pela titlebar desloca a janela (spec §5) ---
  const draggingMove = ref(false)
  let moveStartX = 0
  let moveStartY = 0
  let moveBaseX = 0
  let moveBaseY = 0

  function onTitlebarPointerDown(event: PointerEvent) {
    if (config.value.disabled) return
    const target = event.target as HTMLElement | null
    if (target?.closest?.('button, a, input, select, textarea, [role="button"]')) return
    draggingMove.value = true
    moveStartX = event.clientX
    moveStartY = event.clientY
    moveBaseX = posX.value
    moveBaseY = posY.value
  }

  function onTitlebarPointerMove(event: PointerEvent) {
    if (!draggingMove.value || config.value.disabled) return
    posX.value = Math.round(moveBaseX + (event.clientX - moveStartX))
    posY.value = Math.round(moveBaseY + (event.clientY - moveStartY))
    moved.value = posX.value !== 0 || posY.value !== 0
    const root = rootEl.value
    if (root) root.style.transform = moved.value ? `translate(${posX.value}px, ${posY.value}px)` : ''
  }

  function onTitlebarPointerUp() {
    draggingMove.value = false
  }

  // --- Focus trap (modal): Tab/Shift+Tab presos, Escape fecha, foco volta ao trigger ---
  let lastFocused: Element | null = null
  const isOpen = computed(() => config.value.open)
  const isModal = computed(() => config.value.variant === 'modal')
  watch(
    isOpen,
    (open, prev) => {
      if (typeof document === 'undefined') return
      if (open && !prev) {
        lastFocused = document.activeElement
        if (isModal.value) {
          requestAnimationFrame(() => {
            const root = rootEl.value
            const first = root?.querySelector<HTMLElement>(
              'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            )
            ;(first ?? root)?.focus?.()
          })
        }
      }
      if (!open && prev) {
        const el = lastFocused as HTMLElement | null
        if (el && typeof el.focus === 'function') el.focus()
        lastFocused = null
        if (rootEl.value) rootEl.value.style.transform = ''
        posX.value = 0
        posY.value = 0
        moved.value = false
      }
    },
    { flush: 'post' },
  )

  function focusables(): HTMLElement[] {
    const root = rootEl.value
    if (!root || typeof document === 'undefined') return []
    const nodes = root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    return [...nodes].filter((el) => el.tabIndex >= 0 || el.getAttribute('tabindex') === '0')
  }

  /** Keydown no root: Escape fecha; modal prende Tab/Shift+Tab (spec §5/§7). */
  function onRootKeydown(event: KeyboardEvent) {
    if (config.value.disabled) return
    if (event.key === 'Escape') {
      event.stopPropagation()
      onAction('close')
      return
    }
    if (!isModal.value || event.key !== 'Tab') return
    const items = focusables()
    if (items.length === 0) {
      event.preventDefault()
      return
    }
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement as HTMLElement | null
    if (event.shiftKey && (active === first || active === rootEl.value)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return {
    config,
    role,
    rootAttrs,
    rootClasses,
    backdropAttrs,
    windowStyle,
    rootEl,
    resizing,
    draggingMove,
    navItems: NAV_ITEMS,
    onAction,
    onBackdropClick,
    onResize,
    onResizePointerDown,
    onResizePointerMove,
    onResizePointerUp,
    onResizeKey,
    onTitlebarPointerDown,
    onTitlebarPointerMove,
    onTitlebarPointerUp,
    onRootKeydown,
  }
}
