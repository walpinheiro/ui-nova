import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch, type CSSProperties } from 'vue'
import { useSpringValue } from '../../../composables/useSpringValue'
import { computeDropdownMenuPosition, type DropdownMenuPlacement } from '../../navigation/VDropdownMenu/positionDropdownMenu'
import { mountVSelect } from './mountVSelect'
import type { VSelectOption, VSelectProps, VSelectState } from './VSelect.types'

export type VSelectEmit = {
  (event: 'update:modelValue', value: string): void
  (event: 'open-change', value: boolean): void
  (event: 'change', value: string): void
  (event: 'clear'): void
}

function enabledOptions(options: VSelectOption[]) {
  return options.filter((option) => !option.disabled)
}

export function useVSelect(props: VSelectProps, emit: VSelectEmit) {
  const config = computed(() => mountVSelect(props))
  const isOpen = ref(false)
  const focused = ref(false)
  const rootRef = ref<HTMLElement | null>(null)
  const triggerRef = ref<HTMLButtonElement | null>(null)
  const panelRef = ref<HTMLDivElement | null>(null)
  const menuPlacement = ref<DropdownMenuPlacement>('bottom-start')
  const hoveredOption = ref<string | null>(null)
  const highlightTop = ref(0)
  const highlightHeight = ref(0)
  const springTop = useSpringValue(highlightTop, { stiffness: 260, damping: 26 })
  const springHeight = useSpringValue(highlightHeight, { stiffness: 240, damping: 24 })
  const isExpressive = computed(() => props.motion === 'expressive')
  const generatedId = useId()
  const triggerId = computed(() => props.id ?? `v-select-${generatedId}`)
  const listboxId = computed(() => `${triggerId.value}-listbox`)
  const errorId = computed(() => `${triggerId.value}-error`)

  const menuPositionStyle = computed((): CSSProperties => ({
    minWidth: triggerRef.value ? `${triggerRef.value.getBoundingClientRect().width}px` : undefined,
  }))

  const bindRootRef = (el: unknown) => {
    rootRef.value = el as HTMLElement | null
  }

  const bindTriggerRef = (el: unknown) => {
    triggerRef.value = el as HTMLButtonElement | null
  }

  const bindPanelRef = (el: unknown) => {
    panelRef.value = el as HTMLDivElement | null
  }

  const estimatePanelHeight = () => {
    const optionCount = enabledOptions(config.value.options).length
    return Math.min(optionCount * 40 + 8, 256)
  }

  const dataState = computed<VSelectState>(() => {
    if (config.value.disabled) return 'disabled'
    if (config.value.hasError) return 'invalid'
    if (isOpen.value) return 'open'
    if (config.value.hasValue) return 'filled'
    return 'default'
  })

  const describedBy = computed(() => (config.value.hasError ? errorId.value : undefined))

  const showClear = computed(
    () =>
      config.value.clearable
      && !config.value.disabled
      && props.modelValue !== undefined
      && props.modelValue !== config.value.clearValue,
  )

  const focusOption = (value: string) => {
    void nextTick(() => {
      document.querySelector<HTMLElement>(`[data-test-id="v-select-option-${value}"]`)?.focus()
    })
  }

  const focusTrigger = () => {
    const trigger = triggerRef.value
    if (trigger && document.contains(trigger)) trigger.focus()
  }

  const setOpen = (open: boolean) => {
    if (config.value.disabled) return
    isOpen.value = open
    emit('open-change', open)
  }

  const toggle = () => setOpen(!isOpen.value)

  const selectOption = (option: VSelectOption) => {
    if (config.value.disabled || option.disabled) return
    emit('update:modelValue', option.value)
    emit('change', option.value)
    setOpen(false)
    void nextTick(focusTrigger)
  }

  const onTriggerKeydown = (event: KeyboardEvent) => {
    if (config.value.disabled) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen.value) {
        setOpen(true)
        const first = enabledOptions(config.value.options)[0]
        if (first) focusOption(first.value)
      } else {
        const first = enabledOptions(config.value.options)[0]
        if (first) focusOption(first.value)
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen.value) {
        setOpen(true)
        const enabled = enabledOptions(config.value.options)
        const last = enabled[enabled.length - 1]
        if (last) focusOption(last.value)
      } else {
        const enabled = enabledOptions(config.value.options)
        const last = enabled[enabled.length - 1]
        if (last) focusOption(last.value)
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!isOpen.value) {
        setOpen(true)
        const selected = config.value.selectedOption
        const target = selected && !selected.disabled ? selected : enabledOptions(config.value.options)[0]
        if (target) focusOption(target.value)
      }
    } else if (event.key === 'Escape' && isOpen.value) {
      event.preventDefault()
      setOpen(false)
      focusTrigger()
    }
  }

  const onOptionKeydown = (event: KeyboardEvent, option: VSelectOption) => {
    const enabled = enabledOptions(config.value.options)
    const index = enabled.findIndex((candidate) => candidate.value === option.value)

    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      focusTrigger()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = enabled[(index + 1) % enabled.length]
      focusOption(next.value)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const next = enabled[(index - 1 + enabled.length) % enabled.length]
      focusOption(next.value)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusOption(enabled[0].value)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusOption(enabled[enabled.length - 1].value)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectOption(option)
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  const onClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (rootRef.value?.contains(target) || panelRef.value?.contains(target)) return
    setOpen(false)
  }

  const updatePosition = () => {
    const trigger =
      triggerRef.value ?? rootRef.value?.querySelector<HTMLButtonElement>('[data-test-id="v-select-trigger"]')
    if (!trigger) return

    const triggerRect = trigger.getBoundingClientRect()
    let panelRect = panelRef.value?.getBoundingClientRect()
    if (!panelRect || panelRect.width === 0 || panelRect.height === 0) {
      panelRect = new DOMRect(0, 0, triggerRect.width, estimatePanelHeight())
    }

    const result = computeDropdownMenuPosition(triggerRect, panelRect, 'start')
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

  watch(isOpen, (open) => {
    if (open) {
      schedulePositionUpdate()
      void nextTick(() => bindPositionListeners())
    } else {
      unbindPositionListeners()
    }
  })

  onMounted(() => {
    if (isOpen.value) schedulePositionUpdate()
  })

  onBeforeUnmount(() => {
    unbindPositionListeners()
  })

  const onTriggerFocus = () => {
    focused.value = true
  }

  const onTriggerBlur = () => {
    focused.value = false
  }

  const clearSelection = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (config.value.disabled) return
    emit('update:modelValue', config.value.clearValue)
    emit('change', config.value.clearValue)
    emit('clear')
    setOpen(false)
    void nextTick(focusTrigger)
  }

  const onClearKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      clearSelection(event as unknown as MouseEvent)
    }
  }

  const rootAttrs = computed(() => ({
    class: [
      'v-select',
      `v-select--${config.value.size}`,
      {
        'v-select--disabled': config.value.disabled,
        'v-select--error': config.value.hasError,
        'v-select--open': isOpen.value,
        'v-select--has-value': config.value.hasValue,
        'v-select--focused': focused.value || isOpen.value,
        'v-select--has-leading-icon': Boolean(config.value.leadingIconData),
        'v-select--expressive': isExpressive.value,
      },
    ],
    'data-test-id': 'v-select',
    'data-size': config.value.size,
    'data-state': dataState.value,
  }))

  const triggerAttrs = computed(() => ({
    id: triggerId.value,
    class: 'v-select__trigger',
    type: 'button' as const,
    role: 'combobox' as const,
    'aria-haspopup': 'listbox' as const,
    'aria-expanded': isOpen.value,
    'aria-controls': listboxId.value,
    'aria-invalid': config.value.hasError ? true : undefined,
    'aria-describedby': describedBy.value,
    'aria-disabled': config.value.disabled || undefined,
    disabled: config.value.disabled || undefined,
    'data-test-id': 'v-select-trigger',
  }))

  const panelAttrs = computed(() => ({
    id: listboxId.value,
    class: [
      'v-select__panel',
      `v-select__panel--${menuPlacement.value}`,
      { 'v-select__panel--open': isOpen.value },
    ],
    role: 'listbox' as const,
    'aria-labelledby': props.label ? triggerId.value : undefined,
    'data-test-id': 'v-select-panel',
    style: menuPositionStyle.value,
  }))

  const updateHighlight = (optionValue: string, element: HTMLElement) => {
    const panel = panelRef.value
    if (!panel) return
    const panelRect = panel.getBoundingClientRect()
    const optionRect = element.getBoundingClientRect()
    highlightTop.value = optionRect.top - panelRect.top + panel.scrollTop
    highlightHeight.value = optionRect.height
    hoveredOption.value = optionValue
  }

  const clearHighlight = () => {
    hoveredOption.value = null
  }

  const highlightStyle = computed((): CSSProperties => {
    if (!isExpressive.value || !isOpen.value || hoveredOption.value === null) {
      return { opacity: 0 }
    }
    return {
      transform: `translateY(${springTop.value.value}px)`,
      height: `${springHeight.value.value}px`,
      opacity: 1,
    }
  })

  const optionAttrs = (option: VSelectOption) => ({
    class: [
      'v-select__option',
      {
        'v-select__option--selected': option.value === props.modelValue,
        'v-select__option--disabled': option.disabled,
        'v-select__option--hovered': hoveredOption.value === option.value,
      },
    ],
    role: 'option' as const,
    type: 'button' as const,
    'aria-selected': option.value === props.modelValue,
    'aria-disabled': option.disabled || undefined,
    tabindex: option.disabled ? -1 : 0,
    'data-test-id': `v-select-option-${option.value}`,
    onClick: () => selectOption(option),
    onKeydown: (event: KeyboardEvent) => onOptionKeydown(event, option),
    onMouseenter: (event: MouseEvent) => {
      if (!isExpressive.value || option.disabled) return
      updateHighlight(option.value, event.currentTarget as HTMLElement)
    },
    onFocus: (event: FocusEvent) => {
      if (!isExpressive.value || option.disabled) return
      updateHighlight(option.value, event.currentTarget as HTMLElement)
    },
    onMouseleave: () => {
      if (!isExpressive.value) return
      clearHighlight()
    },
  })

  return {
    config,
    isOpen,
    bindRootRef,
    bindTriggerRef,
    bindPanelRef,
    triggerId,
    errorId,
    rootAttrs,
    triggerAttrs,
    panelAttrs,
    optionAttrs,
    toggle,
    setOpen,
    selectOption,
    onTriggerKeydown,
    onTriggerFocus,
    onTriggerBlur,
    showClear,
    clearSelection,
    onClearKeydown,
    menuPlacement,
    highlightStyle,
    isExpressive,
  }
}
