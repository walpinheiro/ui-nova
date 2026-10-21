import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { VFilterBarProps, VFilterChip, VFilterChipSeverity } from './VFilterBar.types'
import type { VBadgeVariant } from '../../feedback/VBadge/VBadge.types'
import { mountVFilterBar } from './mountVFilterBar'

type VFilterBarEmit = {
  (event: 'update:search', payload: string): void
  (event: 'update:filters', payload: Record<string, string>): void
  (event: 'update:dateRange', payload: string): void
  (event: 'update:chips', payload: VFilterChip[]): void
  (event: 'change'): void
  (event: 'clear'): void
  (event: 'chip-remove', payload: string): void
}

function chipBadgeVariant(severity?: VFilterChipSeverity): VBadgeVariant {
  switch (severity) {
    case 'success':
      return 'success'
    case 'warning':
      return 'warning'
    case 'danger':
      return 'danger'
    default:
      return 'neutral'
  }
}

function buildDefaultSelectValues(selects: VFilterBarProps['selects']) {
  const defaults: Record<string, string> = {}
  for (const select of selects ?? []) {
    defaults[select.id] = select.value
  }
  return defaults
}

export function useVFilterBar(props: VFilterBarProps, emit: VFilterBarEmit) {
  const config = computed(() => mountVFilterBar(props))
  const searchValue = ref(props.search ?? '')
  const dateRangeValue = ref(props.dateRange ?? '')
  const selectValues = ref<Record<string, string>>({
    ...buildDefaultSelectValues(props.selects),
    ...(props.filters ?? {}),
  })
  const chips = ref([...(props.chips ?? [])])

  watch(() => props.search, (value) => { if (value !== undefined) searchValue.value = value })
  watch(() => props.dateRange, (value) => { if (value !== undefined) dateRangeValue.value = value })
  watch(() => props.filters, (value) => {
    if (value) selectValues.value = { ...buildDefaultSelectValues(props.selects), ...value }
  })
  watch(() => props.chips, (value) => { if (value) chips.value = [...value] })
  watch(() => props.selects, (value) => {
    selectValues.value = { ...buildDefaultSelectValues(value), ...selectValues.value }
  }, { deep: true })

  const hasActiveCount = computed(() => props.activeCount !== undefined && config.value.variant !== 'basic')

  // Resumo compacto: só na toolbar sticky (sem chips visíveis).
  const showActiveCountInToolbar = computed(
    () => hasActiveCount.value && config.value.variant === 'sticky',
  )

  // Com chips visíveis, o contador no topo é redundante — some da toolbar.
  const showActiveCountInFooter = computed(
    () => hasActiveCount.value && config.value.variant !== 'sticky' && !config.value.hasChips,
  )

  const visibleChips = computed(() => {
    if (chips.value.length <= 3) return chips.value
    return chips.value.slice(0, 3)
  })

  const overflowChipCount = computed(() => Math.max(chips.value.length - 3, 0))

  const rootAttrs = computed(() => ({
    class: [
      'v-filter-bar',
      `v-filter-bar--${config.value.size}`,
      `v-filter-bar--${config.value.variant}`,
      { 'v-filter-bar--sticky': config.value.sticky },
    ],
    'data-test-id': config.value.testId,
    'data-variant': config.value.variant,
  }))

  function emitChange() {
    emit('change')
  }

  function onSearchInput(value: string) {
    searchValue.value = value
    emit('update:search', value)
    emitChange()
  }

  function onSelectChange(id: string, value: string) {
    selectValues.value = { ...selectValues.value, [id]: value }
    emit('update:filters', { ...selectValues.value })
    emitChange()
  }

  function onDateRangeInput(value: string) {
    dateRangeValue.value = value
    emit('update:dateRange', value)
    emitChange()
  }

  function removeChip(id: string) {
    chips.value = chips.value.filter((chip) => chip.id !== id)
    emit('update:chips', [...chips.value])
    emit('chip-remove', id)
    emitChange()
  }

  function clearAll() {
    const defaults = buildDefaultSelectValues(config.value.selects)
    searchValue.value = ''
    dateRangeValue.value = ''
    selectValues.value = defaults
    chips.value = []
    emit('update:search', '')
    emit('update:dateRange', '')
    emit('update:filters', defaults)
    emit('update:chips', [])
    emit('clear')
    emitChange()
  }

  function focusSearch() {
    document
      .querySelector<HTMLInputElement>(`[data-test-id="${config.value.testId}"] [data-test-id="v-searchfield-input"]`)
      ?.focus()
  }

  function onGlobalKeydown(event: KeyboardEvent) {
    if (!config.value.searchShortcut) return
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      focusSearch()
    }
    if (event.key === 'Escape') clearAll()
  }

  onMounted(() => document.addEventListener('keydown', onGlobalKeydown))
  onUnmounted(() => document.removeEventListener('keydown', onGlobalKeydown))

  return {
    config,
    searchValue,
    dateRangeValue,
    selectValues,
    chips,
    visibleChips,
    overflowChipCount,
    showActiveCountInToolbar,
    showActiveCountInFooter,
    rootAttrs,
    chipBadgeVariant,
    onSearchInput,
    onSelectChange,
    onDateRangeInput,
    removeChip,
    clearAll,
  }
}
