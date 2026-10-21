import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import type { VCommandPaletteEmits, VCommandPaletteItem, VCommandPaletteProps } from './VCommandPalette.types'
import {
  filterCommandGroups,
  flattenCommandItems,
  mountVCommandPalette,
  resolveCommandIcon,
} from './mountVCommandPalette'

type VCommandPaletteEmitFn = <K extends keyof VCommandPaletteEmits>(
  event: K,
  ...args: VCommandPaletteEmits[K]
) => void

interface VCommandPaletteAttrs {
  class: Array<string | Record<string, boolean>>
  [key: string]: unknown
}

export function useVCommandPalette(props: VCommandPaletteProps, emit: VCommandPaletteEmitFn) {
  const config = computed(() => mountVCommandPalette(props))
  const isOpen = computed(() => config.value.open)
  const internalQuery = ref('')
  const selectedIndex = ref(0)
  const inputRef = ref<HTMLInputElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const listboxId = `command-palette-listbox-${useId()}`
  let lastFocused: Element | null = null

  const query = computed({
    get: () => props.query ?? internalQuery.value,
    set: (value: string) => {
      internalQuery.value = value
      emit('update:query', value)
    },
  })

  const filteredGroups = computed(() => filterCommandGroups(config.value.items, query.value))
  const flatItems = computed(() => flattenCommandItems(filteredGroups.value))
  const hasResults = computed(() => flatItems.value.length > 0)
  const showEmpty = computed(() => !config.value.loading && query.value.trim().length > 0 && !hasResults.value)

  const statusMessage = computed(() => {
    if (config.value.loading) return 'Searching…'
    if (showEmpty.value) return `${config.value.emptyTitle}. ${config.value.emptyHint}`
    if (hasResults.value) return `${flatItems.value.length} result${flatItems.value.length === 1 ? '' : 's'}`
    return ''
  })

  const selectedItem = computed(() => flatItems.value[selectedIndex.value] ?? null)

  function setPanelRef(element: unknown): void {
    panelRef.value = (element as HTMLElement | null) ?? null
  }

  function setInputRef(element: unknown): void {
    inputRef.value = (element as HTMLInputElement | null) ?? null
  }

  function clampSelectedIndex(): void {
    if (flatItems.value.length === 0) {
      selectedIndex.value = 0
      return
    }
    if (selectedIndex.value >= flatItems.value.length) selectedIndex.value = flatItems.value.length - 1
    if (selectedIndex.value < 0) selectedIndex.value = 0
  }

  function requestOpen(): void {
    if (config.value.disabled || isOpen.value) return
    emit('update:modelValue', true)
    emit('update:open', true)
    emit('open-change', true)
  }

  function requestClose(reason: 'close' | 'dismiss' = 'close'): void {
    if (config.value.disabled) return
    emit('update:modelValue', false)
    emit('update:open', false)
    emit('open-change', false)
    if (reason === 'dismiss') emit('dismiss')
    else emit('close')
  }

  function focusInput(): void {
    if (typeof document === 'undefined' || !isOpen.value) return
    void nextTick(() => inputRef.value?.focus({ preventScroll: true }))
  }

  function selectItem(item: VCommandPaletteItem): void {
    if (config.value.disabled || item.disabled) return
    emit('select', item)
    requestClose('close')
  }

  function onInput(event: Event): void {
    query.value = (event.target as HTMLInputElement).value
    selectedIndex.value = 0
  }

  function onResultMouseEnter(index: number): void {
    selectedIndex.value = index
  }

  function onResultClick(item: VCommandPaletteItem): void {
    selectItem(item)
  }

  function onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && config.value.dismissible) {
      event.preventDefault()
      requestClose('dismiss')
      return
    }

    if (config.value.loading || flatItems.value.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % flatItems.value.length
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value - 1 + flatItems.value.length) % flatItems.value.length
    } else if (event.key === 'Home') {
      event.preventDefault()
      selectedIndex.value = 0
    } else if (event.key === 'End') {
      event.preventDefault()
      selectedIndex.value = flatItems.value.length - 1
    } else if (event.key === 'Enter' && selectedItem.value) {
      event.preventDefault()
      selectItem(selectedItem.value)
    }
  }

  function onBackdropClick(): void {
    if (config.value.dismissible) requestClose('dismiss')
  }

  function onTriggerClick(): void {
    requestOpen()
  }

  function onTriggerKeydown(event: KeyboardEvent): void {
    if (config.value.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      requestOpen()
    }
  }

  watch(query, () => clampSelectedIndex())
  watch(flatItems, () => clampSelectedIndex())

  onMounted(() => {
    if (isOpen.value) {
      lastFocused = typeof document === 'undefined' ? null : document.activeElement
      focusInput()
    }
  })

  watch(
    isOpen,
    (open, previous) => {
      if (typeof document === 'undefined') return
      if (open && !previous) {
        lastFocused = document.activeElement
        selectedIndex.value = 0
        focusInput()
      } else if (!open && previous) {
        const target = lastFocused as HTMLElement | null
        if (target && typeof target.focus === 'function') target.focus({ preventScroll: true })
        lastFocused = null
      }
    },
    { flush: 'post' },
  )

  const sizeTestId = computed(() => {
    if (config.value.size === 'sm') return 'command-palette-size-compact'
    if (config.value.size === 'lg') return 'command-palette-size-wide'
    return 'command-palette-size-default'
  })

  const rootAttrs = computed<VCommandPaletteAttrs>(() => ({
    class: [
      'v-command-palette',
      `v-command-palette--${config.value.size}`,
      `v-command-palette--${config.value.variant}`,
      {
        'v-command-palette--open': isOpen.value,
        'v-command-palette--closed': !isOpen.value,
        'v-command-palette--disabled': config.value.disabled,
        'v-command-palette--loading': config.value.loading,
      },
    ],
    'data-state': isOpen.value ? 'open' : 'closed',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
    'data-test-id': 'command-palette',
  }))

  const backdropAttrs = computed<VCommandPaletteAttrs>(() => ({
    class: ['v-command-palette__backdrop', { 'v-command-palette__backdrop--hidden': !isOpen.value }],
    'data-test-id': 'command-palette-backdrop',
    'aria-hidden': 'true',
  }))

  const panelAttrs = computed<VCommandPaletteAttrs>(() => ({
    class: ['v-command-palette__panel'],
    role: 'dialog',
    'aria-modal': 'true',
    'aria-expanded': isOpen.value,
    'aria-label': props.ariaLabel ?? 'Command palette',
    'aria-busy': config.value.loading || undefined,
    'aria-disabled': config.value.disabled || undefined,
    'data-test-id': sizeTestId.value,
    tabindex: '-1',
  }))

  const inputAttrs = computed<VCommandPaletteAttrs>(() => ({
    class: ['v-command-palette__input'],
    type: 'search',
    role: 'combobox',
    'aria-expanded': isOpen.value,
    'aria-controls': listboxId,
    'aria-activedescendant': selectedItem.value ? `command-palette-result-${selectedItem.value.id}` : undefined,
    'aria-autocomplete': 'list',
    'aria-label': config.value.searchLabel,
    placeholder: config.value.placeholder,
    value: query.value,
    disabled: config.value.disabled || undefined,
    'data-test-id': 'command-palette-input',
  }))

  const triggerAttrs = computed<VCommandPaletteAttrs>(() => ({
    class: ['v-command-palette__trigger'],
    type: 'button',
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen.value,
    'aria-disabled': config.value.disabled || undefined,
    'data-test-id': 'command-palette-trigger',
    disabled: config.value.disabled || undefined,
  }))

  function groupAttrs(groupId: string) {
    return {
      class: 'v-command-palette__group',
      role: 'group',
      'aria-labelledby': `command-palette-group-label-${groupId}`,
      'data-test-id': `command-palette-group-${groupId}`,
    }
  }

  function groupLabelAttrs(groupId: string) {
    return {
      class: 'v-command-palette__group-label',
      id: `command-palette-group-label-${groupId}`,
      'data-test-id': 'command-palette-group-label',
    }
  }

  function resultAttrs(item: VCommandPaletteItem, index: number) {
    const selected = selectedIndex.value === index
    return {
      class: [
        'v-command-palette__result',
        {
          'v-command-palette__result--selected': selected,
          'v-command-palette__result--disabled': item.disabled,
        },
      ],
      id: `command-palette-result-${item.id}`,
      role: 'option',
      'aria-selected': selected,
      'aria-disabled': item.disabled || undefined,
      tabindex: -1,
      'data-test-id': selected ? 'command-palette-result-selected' : `command-palette-result-${item.id}`,
      onMouseenter: () => onResultMouseEnter(index),
      onClick: () => onResultClick(item),
    }
  }

  function shortcutAttrs() {
    return {
      class: 'v-command-palette__shortcut',
      'data-test-id': 'command-palette-shortcut',
    }
  }

  return {
    config,
    isOpen,
    query,
    filteredGroups,
    flatItems,
    selectedIndex,
    selectedItem,
    hasResults,
    showEmpty,
    statusMessage,
    listboxId,
    inputRef,
    setInputRef,
    setPanelRef,
    rootAttrs,
    backdropAttrs,
    panelAttrs,
    inputAttrs,
    triggerAttrs,
    groupAttrs,
    groupLabelAttrs,
    resultAttrs,
    shortcutAttrs,
    requestOpen,
    requestClose,
    onInput,
    onPanelKeydown,
    onBackdropClick,
    onTriggerClick,
    onTriggerKeydown,
    onResultMouseEnter,
    onResultClick,
    resolveCommandIcon,
  }
}
