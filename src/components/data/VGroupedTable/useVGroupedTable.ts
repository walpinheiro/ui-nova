import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import type { VGroupedTableGroup, VGroupedTableProps, VGroupedTableRow } from './VGroupedTable.types'
import { mountVGroupedTable } from './mountVGroupedTable'

type Emit = {
  (event: 'update:collapsed', value: string[]): void
  (event: 'group-toggle', groupId: string, collapsed: boolean): void
  (event: 'row-click', row: VGroupedTableRow, group: VGroupedTableGroup): void
}

export function useVGroupedTable(props: VGroupedTableProps, emit: Emit, root: Ref<HTMLElement | null>) {
  // Unmeasured (SSR/jsdom) = show every column.
  const measured = ref(Number.POSITIVE_INFINITY)
  let observer: ResizeObserver | undefined

  onMounted(() => {
    if (!root.value || typeof ResizeObserver === 'undefined') return
    observer = new ResizeObserver(([entry]) => {
      measured.value = Math.round(entry.contentRect.width)
    })
    observer.observe(root.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  const config = computed(() => mountVGroupedTable(props, measured.value))

  const rootAttrs = computed(() => ({
    class: [
      'v-grouped-table',
      `v-grouped-table--${config.value.size}`,
      { 'v-grouped-table--interactive': props.interactive },
    ],
    'data-test-id': props.dataTestId ?? 'v-grouped-table',
    'data-visible-columns': config.value.visible.map((column) => column.key).join(','),
  }))

  function toggleGroup(groupId: string) {
    if (props.collapsible === false) return
    const current = new Set(props.collapsed ?? [])
    const willCollapse = !current.has(groupId)
    if (willCollapse) current.add(groupId)
    else current.delete(groupId)
    emit('update:collapsed', [...current])
    emit('group-toggle', groupId, willCollapse)
  }

  function onRowActivate(row: VGroupedTableRow, group: VGroupedTableGroup) {
    if (props.interactive) emit('row-click', row, group)
  }

  return { config, rootAttrs, toggleGroup, onRowActivate }
}
