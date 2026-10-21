import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { mountVTagInput, slugifyTag } from './mountVTagInput'
import type { VTagInputProps, VTagInputState } from './VTagInput.types'

type VTagInputEmit = {
  (event: 'update:modelValue', value: string[]): void
  (event: 'add', tag: string): void
  (event: 'remove', tag: string): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', payload: FocusEvent): void
}

export function useVTagInput(props: VTagInputProps, emit: VTagInputEmit) {
  const config = computed(() => mountVTagInput(props))
  const generatedId = useId()
  const rootId = computed(() => props.id ?? `v-tag-input-${generatedId}`)
  const inputId = computed(() => `${rootId.value}-field`)
  const listboxId = computed(() => `${rootId.value}-suggestions`)
  const liveId = computed(() => `${rootId.value}-live`)
  const inputRef = ref<HTMLInputElement | null>(null)
  const rootRef = ref<HTMLElement | null>(null)
  const query = ref('')
  const focused = ref(false)
  const open = ref(false)
  const highlightedIndex = ref(-1)
  const leavingTags = ref<string[]>([])
  const liveMessage = ref('')

  const tags = computed(() => props.modelValue ?? [])

  const filteredSuggestions = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return config.value.suggestions
    return config.value.suggestions.filter((item) => item.toLowerCase().includes(q))
  })

  const dataState = computed<VTagInputState>(() => {
    if (config.value.disabled) return 'disabled'
    if (open.value && highlightedIndex.value >= 0) return 'selected-suggestion'
    if (focused.value && query.value) return 'typing'
    if (focused.value) return 'focus'
    if (!tags.value.length) return 'empty'
    return 'default'
  })

  const describedBy = computed(() => {
    const ids = [liveId.value]
    if (open.value) ids.push(listboxId.value)
    return ids.join(' ')
  })

  const canAddMore = computed(() => {
    if (config.value.disabled || config.value.readonly) return false
    if (props.maxTags !== undefined && tags.value.length >= props.maxTags) return false
    return true
  })

  const announce = (message: string) => {
    liveMessage.value = message
  }

  const isValidTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed) return false
    if (!config.value.allowDuplicates && tags.value.includes(trimmed)) return false
    if (props.validateTag && !props.validateTag(trimmed)) return false
    return true
  }

  const addTag = (raw: string) => {
    const tag = raw.trim()
    if (!canAddMore.value || !isValidTag(tag)) return false
    const next = [...tags.value, tag]
    emit('update:modelValue', next)
    emit('add', tag)
    announce(`Tag ${tag} added`)
    query.value = ''
    highlightedIndex.value = -1
    return true
  }

  const removeTag = async (tag: string) => {
    if (config.value.disabled || config.value.readonly || !config.value.closable) return
    leavingTags.value = [...leavingTags.value, tag]
    await nextTick()
    window.setTimeout(() => {
      const next = tags.value.filter((item) => item !== tag)
      emit('update:modelValue', next)
      emit('remove', tag)
      announce(`Tag ${tag} removed`)
      leavingTags.value = leavingTags.value.filter((item) => item !== tag)
      inputRef.value?.focus()
    }, 120)
  }

  const addFromPaste = (text: string) => {
    const parts = text.split(/[,;\n]+/).map((part) => part.trim()).filter(Boolean)
    let added = 0
    for (const part of parts) {
      if (addTag(part)) added += 1
    }
    return added
  }

  const confirmInput = () => {
    if (!query.value.trim()) return
    addTag(query.value)
  }

  const onInput = (event: Event) => {
    query.value = (event.target as HTMLInputElement).value
    open.value = config.value.hasSuggestions && focused.value
    highlightedIndex.value = filteredSuggestions.value.length ? 0 : -1
  }

  const onFocus = (event: FocusEvent) => {
    focused.value = true
    if (config.value.hasSuggestions) open.value = true
    emit('focus', event)
  }

  const onBlur = (event: FocusEvent) => {
    focused.value = false
    window.setTimeout(() => {
      if (!rootRef.value?.contains(document.activeElement)) {
        open.value = false
        highlightedIndex.value = -1
      }
    }, 0)
    emit('blur', event)
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (config.value.disabled || config.value.readonly) return

    if (event.key === 'Backspace' && !query.value && tags.value.length) {
      event.preventDefault()
      removeTag(tags.value[tags.value.length - 1])
      return
    }

    if (open.value && filteredSuggestions.value.length) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredSuggestions.value.length - 1)
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
        return
      }
      if (event.key === 'Enter' && highlightedIndex.value >= 0) {
        event.preventDefault()
        addTag(filteredSuggestions.value[highlightedIndex.value])
        open.value = false
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        open.value = false
        highlightedIndex.value = -1
        return
      }
    }

    const shouldConfirm =
      (event.key === 'Enter' && config.value.delimiters.includes('enter'))
      || (event.key === ',' && config.value.delimiters.includes('comma'))
      || (event.key === 'Tab' && config.value.delimiters.includes('tab') && query.value.trim())

    if (shouldConfirm) {
      event.preventDefault()
      confirmInput()
    }
  }

  const onPaste = (event: ClipboardEvent) => {
    const text = event.clipboardData?.getData('text') ?? ''
    if (!text.includes(',') && !text.includes(';') && !text.includes('\n')) return
    event.preventDefault()
    addFromPaste(text)
  }

  const onSuggestionClick = (suggestion: string) => {
    addTag(suggestion)
    open.value = false
    inputRef.value?.focus()
  }

  const onClickOutside = (event: MouseEvent) => {
    if (!rootRef.value?.contains(event.target as Node)) {
      open.value = false
      highlightedIndex.value = -1
    }
  }

  onMounted(() => document.addEventListener('mousedown', onClickOutside))
  onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))

  const rootAttrs = computed(() => ({
    id: rootId.value,
    class: [
      'v-tag-input',
      `v-tag-input--${config.value.size}`,
      {
        'v-tag-input--disabled': config.value.disabled,
        'v-tag-input--readonly': config.value.readonly,
        'v-tag-input--multiline': config.value.multiline,
        'v-tag-input--focused': focused.value,
        'v-tag-input--open': open.value,
      },
    ],
    'data-test-id': 'v-tag-input',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': dataState.value,
  }))

  const inputAttrs = computed(() => ({
    id: inputId.value,
    class: 'v-tag-input__field',
    'data-test-id': 'v-tag-input-field',
    value: query.value,
    placeholder: config.value.placeholder,
    disabled: config.value.disabled || undefined,
    readonly: config.value.readonly || undefined,
    role: 'combobox' as const,
    'aria-expanded': open.value,
    'aria-controls': open.value ? listboxId.value : undefined,
    'aria-autocomplete': 'list' as const,
    'aria-describedby': describedBy.value,
    'aria-disabled': config.value.disabled || undefined,
  }))

  const tagTestId = (tag: string) => `v-tag-${slugifyTag(tag)}`

  return {
    config,
    rootRef,
    inputRef,
    rootAttrs,
    inputAttrs,
    tags,
    query,
    open,
    highlightedIndex,
    leavingTags,
    liveMessage,
    liveId,
    listboxId,
    filteredSuggestions,
    tagTestId,
    onInput,
    onFocus,
    onBlur,
    onKeydown,
    onPaste,
    removeTag,
    onSuggestionClick,
    addTag,
  }
}
