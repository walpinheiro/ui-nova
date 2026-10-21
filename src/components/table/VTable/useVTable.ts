import { computed, ref, watch } from 'vue'
import type { VSortDirection } from './VTable.types'
import type { VTableProps, VTableRow, VTableSortState } from './VTable.types'
import { mountVTable } from './mountVTable'

type VTableEmit = {
  (event: 'update:selected', payload: Array<string | number>): void
  (event: 'update:sort', payload: VTableSortState[]): void
  (event: 'update:search', payload: string): void
  (event: 'update:page', payload: number): void
  (event: 'update:pageSize', payload: number): void
  (event: 'update:expandedRow', payload: string | number | null): void
  (event: 'row-click', payload: { row: VTableRow; index: number }): void
  (event: 'filter'): void
  (event: 'add'): void
}

export function useVTable(props: VTableProps, emit: VTableEmit) {
  const config = computed(() => mountVTable(props))
  const selected = ref<Array<string | number>>([...(props.selected ?? [])])
  const sortState = ref<VTableSortState[]>([...(props.sort ?? [])])
  const searchValue = ref(props.search ?? '')
  const page = ref(props.page ?? 1)
  const pageSize = ref(props.pageSize ?? 10)
  const expandedRow = ref<string | number | null>(props.expandedRow ?? null)
  const focusedRow = ref<string | number | null>(null)

  watch(() => props.selected, (value) => { if (value) selected.value = [...value] })
  watch(() => props.sort, (value) => { if (value) sortState.value = [...value] })
  watch(() => props.search, (value) => { if (value !== undefined) searchValue.value = value })
  watch(() => props.page, (value) => { if (value !== undefined) page.value = value })
  watch(() => props.expandedRow, (value) => { if (value !== undefined) expandedRow.value = value })

  const filteredRows = computed(() => {
    const query = searchValue.value.trim().toLowerCase()
    if (!query) return config.value.rows
    return config.value.rows.filter((row) =>
      Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(query)),
    )
  })

  const sortedRows = computed(() => {
    const rows = [...filteredRows.value]
    if (!sortState.value.length) return rows
    return rows.sort((a, b) => {
      for (const sort of [...sortState.value].sort((left, right) => (left.priority ?? 1) - (right.priority ?? 1))) {
        const left = String(a[sort.key] ?? '')
        const right = String(b[sort.key] ?? '')
        const result = left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' })
        if (result !== 0) return sort.direction === 'asc' ? result : -result
      }
      return 0
    })
  })

  const pagedRows = computed(() => {
    if (!config.value.showPagination) return sortedRows.value
    const start = (page.value - 1) * pageSize.value
    return sortedRows.value.slice(start, start + pageSize.value)
  })

  const columnSpan = computed(
    () => config.value.columns.length + (config.value.selectable ? 1 : 0) + (config.value.showActions ? 1 : 0),
  )

  const allSelected = computed(
    () => pagedRows.value.length > 0 && pagedRows.value.every((row) => selected.value.includes(row.id)),
  )

  const rootAttrs = computed(() => ({
    class: [
      'v-table',
      `v-table--${config.value.variant}`,
      `v-table--${config.value.size}`,
      { 'v-table--loading': config.value.loading },
    ],
    'data-test-id': config.value.testId,
  }))

  function getSortDirection(key: string): VSortDirection {
    const match = sortState.value.find((item) => item.key === key)
    return match?.direction ?? null
  }

  function getSortPriority(key: string) {
    const index = sortState.value.findIndex((item) => item.key === key)
    return index >= 0 ? index + 1 : undefined
  }

  function handleSort(key: string, direction: VSortDirection, shiftKey: boolean) {
    if (!direction) {
      sortState.value = sortState.value.filter((item) => item.key !== key)
    } else if (shiftKey) {
      const existing = sortState.value.find((item) => item.key === key)
      if (existing) existing.direction = direction as 'asc' | 'desc'
      else sortState.value.push({ key, direction: direction as 'asc' | 'desc', priority: sortState.value.length + 1 })
    } else {
      sortState.value = [{ key, direction: direction as 'asc' | 'desc', priority: 1 }]
    }
    emit('update:sort', [...sortState.value])
  }

  function toggleRowSelection(id: string | number) {
    if (!config.value.selectable) return
    if (!config.value.multiple) {
      selected.value = selected.value.includes(id) ? [] : [id]
    } else if (selected.value.includes(id)) {
      selected.value = selected.value.filter((item) => item !== id)
    } else {
      selected.value = [...selected.value, id]
    }
    emit('update:selected', [...selected.value])
  }

  function toggleSelectAll() {
    if (!config.value.selectable) return
    if (allSelected.value) {
      selected.value = selected.value.filter((id) => !pagedRows.value.some((row) => row.id === id))
    } else {
      const ids = pagedRows.value.map((row) => row.id)
      selected.value = [...new Set([...selected.value, ...ids])]
    }
    emit('update:selected', [...selected.value])
  }

  function onSearch(value: string) {
    searchValue.value = value
    emit('update:search', value)
  }

  function onRowClick(row: VTableRow, index: number) {
    emit('row-click', { row, index })
    expandedRow.value = expandedRow.value === row.id ? null : row.id
    emit('update:expandedRow', expandedRow.value)
  }

  return {
    config,
    selected,
    sortState,
    searchValue,
    page,
    pageSize,
    expandedRow,
    focusedRow,
    filteredRows,
    sortedRows,
    pagedRows,
    columnSpan,
    allSelected,
    rootAttrs,
    getSortDirection,
    getSortPriority,
    handleSort,
    toggleRowSelection,
    toggleSelectAll,
    onSearch,
    onRowClick,
  }
}
