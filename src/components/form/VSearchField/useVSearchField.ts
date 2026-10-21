import { computed, nextTick, ref, useId, watch } from 'vue'
import type { VSearchFieldProps, VSearchFieldState, VSearchFieldSuggestion } from './VSearchField.types'
import { mountVSearchField } from './mountVSearchField'

type VSearchFieldEmit = {
  (event: 'update:modelValue', value: string): void
  (event: 'clear'): void
  (event: 'search', value: string): void
  (event: 'select', suggestion: VSearchFieldSuggestion): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', payload: FocusEvent): void
  (event: 'shortcut'): void
}

export function useVSearchField(props: VSearchFieldProps, emit: VSearchFieldEmit) {
  const config = computed(() => mountVSearchField(props))
  const inputRef = ref<HTMLInputElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const focused = ref(false)
  const panelOpen = ref(false)
  const selectedIndex = ref(0)
  const generatedId = useId()
  const inputId = computed(() => props.id ?? `v-searchfield-${generatedId}`)
  const listboxId = computed(() => `${inputId.value}-listbox`)

  const hasValue = computed(() => Boolean(props.modelValue && props.modelValue.length > 0))
  const filteredSuggestions = computed(() => {
    const query = (props.modelValue ?? '').trim().toLowerCase()
    if (!query) return config.value.suggestions
    return config.value.suggestions.filter((item) => {
      const haystack = `${item.label} ${item.value} ${item.category ?? ''}`.toLowerCase()
      return haystack.includes(query)
    })
  })

  const showPanel = computed(
    () => panelOpen.value && !config.value.disabled && !config.value.loading && filteredSuggestions.value.length > 0,
  )

  const showClear = computed(
    () => config.value.clearable && hasValue.value && !config.value.disabled && !config.value.loading,
  )

  const dataState = computed<VSearchFieldState>(() => {
    if (config.value.disabled) return 'disabled'
    if (config.value.loading) return 'loading'
    if (showPanel.value) return 'suggestions-open'
    if (hasValue.value) return 'filled'
    if (focused.value) return 'focus'
    return 'default'
  })

  const clearAriaLabel = computed(() => props.clearLabel ?? 'Clear search')

  const activeDescendant = computed(() => {
    if (!showPanel.value || filteredSuggestions.value.length === 0) return undefined
    const item = filteredSuggestions.value[selectedIndex.value]
    return item ? `${inputId.value}-option-${selectedIndex.value}` : undefined
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-searchfield',
      `v-searchfield--${config.value.size}`,
      `v-searchfield--${config.value.variant}`,
      {
        'v-searchfield--disabled': config.value.disabled,
        'v-searchfield--focused': focused.value,
        'v-searchfield--has-value': hasValue.value,
        'v-searchfield--loading': config.value.loading,
        'v-searchfield--panel-open': showPanel.value,
      },
    ],
    'data-test-id': 'v-searchfield',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': dataState.value,
  }))

  const controlAttrs = computed(() => ({
    class: 'v-searchfield__control',
  }))

  const inputAttrs = computed(() => ({
    id: inputId.value,
    class: 'v-searchfield__input',
    'data-test-id': 'v-searchfield-input',
    type: 'search',
    role: 'combobox',
    name: props.name,
    value: props.modelValue ?? '',
    placeholder: props.placeholder,
    disabled: config.value.disabled || undefined,
    autocomplete: props.autocomplete ?? 'off',
    'aria-label': props.ariaLabel ?? props.label ?? undefined,
    'aria-expanded': showPanel.value ? true : false,
    'aria-controls': showPanel.value ? listboxId.value : undefined,
    'aria-activedescendant': activeDescendant.value,
    'aria-autocomplete': 'list',
  }))

  const clampSelectedIndex = () => {
    if (filteredSuggestions.value.length === 0) {
      selectedIndex.value = 0
      return
    }
    if (selectedIndex.value >= filteredSuggestions.value.length) {
      selectedIndex.value = filteredSuggestions.value.length - 1
    }
    if (selectedIndex.value < 0) selectedIndex.value = 0
  }

  const openPanel = () => {
    if (config.value.disabled || config.value.loading) return
    panelOpen.value = true
    clampSelectedIndex()
  }

  const closePanel = () => {
    panelOpen.value = false
    selectedIndex.value = 0
  }

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
    openPanel()
  }

  const onFocus = (event: FocusEvent) => {
    focused.value = true
    openPanel()
    emit('focus', event)
  }

  const onBlur = (event: FocusEvent) => {
    const related = event.relatedTarget as Node | null
    if (related && panelRef.value?.contains(related)) return
    focused.value = false
    closePanel()
    emit('blur', event)
  }

  const clear = () => {
    if (!showClear.value) return
    emit('update:modelValue', '')
    emit('clear')
    void nextTick(() => inputRef.value?.focus())
  }

  const onClearKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      clear()
    }
  }

  const selectSuggestion = (suggestion: VSearchFieldSuggestion, index: number) => {
    emit('update:modelValue', suggestion.value)
    emit('select', suggestion)
    selectedIndex.value = index
    closePanel()
    void nextTick(() => inputRef.value?.focus())
  }

  const onInputKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (showPanel.value) {
        event.preventDefault()
        closePanel()
      }
      return
    }

    if (event.key === 'Enter') {
      if (showPanel.value && filteredSuggestions.value[selectedIndex.value]) {
        event.preventDefault()
        selectSuggestion(filteredSuggestions.value[selectedIndex.value], selectedIndex.value)
        return
      }
      emit('search', props.modelValue ?? '')
      return
    }

    if (!showPanel.value || filteredSuggestions.value.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % filteredSuggestions.value.length
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      selectedIndex.value =
        (selectedIndex.value - 1 + filteredSuggestions.value.length) % filteredSuggestions.value.length
    }
  }

  const onShortcutClick = () => {
    if (config.value.disabled) return
    emit('shortcut')
    void nextTick(() => inputRef.value?.focus())
  }

  watch(filteredSuggestions, () => {
    clampSelectedIndex()
  })

  return {
    config,
    inputRef,
    panelRef,
    rootAttrs,
    controlAttrs,
    inputAttrs,
    inputId,
    listboxId,
    filteredSuggestions,
    showPanel,
    showClear,
    clearAriaLabel,
    selectedIndex,
    onInput,
    onFocus,
    onBlur,
    clear,
    onClearKeydown,
    onInputKeydown,
    selectSuggestion,
    onShortcutClick,
  }
}
