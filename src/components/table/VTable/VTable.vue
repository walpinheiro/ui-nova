<script setup lang="ts">
import './VTable.scss'
import VAvatar from '../../images/VAvatar/VAvatar.vue'
import VBadge from '../../feedback/VBadge/VBadge.vue'
import { VIcon } from '../../primitives/VIcon'
import { VSearchField } from '../../form/VSearchField'
import VButton from '../../form/VButton/VButton.vue'
import VPagination from '../../navigation/VPagination/VPagination.vue'
import VSortableHeader from './internal/VSortableHeader.vue'
import {
  V_TABLE_MARK_ICONS,
  V_TABLE_STATUS_LABELS,
  V_TABLE_STATUS_VARIANTS,
  isStatusColumn,
  readTableMark,
} from './mountVTable'
import { useVTable } from './useVTable'
import type { VTableProps } from './VTable.types'

const props = withDefaults(defineProps<VTableProps>(), {
  columns: () => [],
  rows: () => [],
  variant: 'default',
  size: 'default',
  loading: false,
  selectable: true,
  multiple: true,
  showToolbar: true,
  showActions: true,
  showPagination: true,
  page: 1,
  pageSize: 10,
})

const emit = defineEmits<{
  'update:selected': [Array<string | number>]
  'update:sort': [import('./VTable.types').VTableSortState[]]
  'update:search': [string]
  'update:page': [number]
  'update:pageSize': [number]
  'update:expandedRow': [string | number | null]
  'row-click': [{ row: import('./VTable.types').VTableRow; index: number }]
  filter: []
  add: []
}>()

const vm = useVTable(props, emit)
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <div v-if="vm.config.value.showToolbar" class="v-table__toolbar" data-test-id="table-toolbar">
      <VSearchField
        class="v-table__search"
        data-test-id="table-search"
        :model-value="vm.searchValue.value"
        placeholder="Search users…"
        size="md"
        :clearable="true"
        @update:model-value="vm.onSearch"
      />
      <VButton variant="secondary" data-test-id="table-filter" @click="emit('filter')">Filter</VButton>
      <VButton variant="primary" data-test-id="table-add-user" @click="emit('add')">+ Add user</VButton>
    </div>

    <div class="v-table__scroll">
      <table class="v-table__grid">
        <thead data-test-id="table-header-row">
          <tr>
            <th v-if="vm.config.value.selectable" class="v-table__cell v-table__cell--checkbox">
              <input
                type="checkbox"
                data-test-id="table-checkbox--select-all"
                :checked="vm.allSelected.value"
                :aria-label="'Select all rows'"
                @change="vm.toggleSelectAll()"
              />
            </th>
            <th
              v-for="column in vm.config.value.columns"
              :key="column.key"
              class="v-table__cell v-table__cell--header"
              :class="{ 'v-table__cell--sorted': vm.getSortDirection(column.key) }"
              :style="column.width ? { width: column.width } : undefined"
              :data-test-id="`table-header-cell--${column.key}`"
            >
              <slot v-if="$slots[`header-${column.key}`]" :name="`header-${column.key}`" :column="column" />
              <VSortableHeader
                v-else-if="column.sortable"
                :label="column.label"
                :column-key="column.key"
                :direction="vm.getSortDirection(column.key)"
                :sort-priority="vm.getSortPriority(column.key)"
                :size="vm.config.value.size === 'compact' ? 'sm' : vm.config.value.size === 'comfortable' ? 'lg' : 'md'"
                @sort="({ direction, columnKey, shiftKey }) => columnKey && vm.handleSort(columnKey, direction, shiftKey)"
              />
              <span v-else class="v-table__header-label">{{ column.label }}</span>
            </th>
            <th
              v-if="vm.config.value.showActions"
              class="v-table__cell v-table__cell--actions"
              data-test-id="table-header-cell--actions"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody data-test-id="table-body">
          <template v-if="vm.config.value.loading">
            <tr
              v-for="index in 3"
              :key="`skeleton-${index}`"
              class="v-table__row v-table__row--loading"
              data-test-id="table-loading-skeleton"
            >
              <td :colspan="vm.columnSpan.value">
                <div class="v-table__skeleton" />
              </td>
            </tr>
          </template>

          <tr v-else-if="vm.config.value.isEmpty" data-test-id="table-empty-state">
            <td :colspan="vm.columnSpan.value">
              <div class="v-table__empty">No results found</div>
            </td>
          </tr>

          <template v-else>
            <template v-for="(row, index) in vm.pagedRows.value" :key="row.id">
              <tr
                class="v-table__row"
                :class="{
                  'v-table__row--selected': vm.selected.value.includes(row.id),
                  'v-table__row--expanded': vm.expandedRow.value === row.id,
                  'v-table__row--focused': vm.focusedRow.value === row.id,
                  'v-table__row--match': row.tone === 'match',
                }"
                :data-test-id="`table-row${vm.selected.value.includes(row.id) ? '--selected' : ''}`"
                tabindex="0"
                @click="vm.onRowClick(row, index)"
                @focus="vm.focusedRow.value = row.id"
                @blur="vm.focusedRow.value = null"
              >
                <td v-if="vm.config.value.selectable" class="v-table__cell v-table__cell--checkbox">
                  <input
                    type="checkbox"
                    data-test-id="table-checkbox"
                    :checked="vm.selected.value.includes(row.id)"
                    :aria-label="`Select ${row.name ?? row.id}`"
                    @click.stop
                    @change="vm.toggleRowSelection(row.id)"
                  />
                </td>

                <td
                  v-for="column in vm.config.value.columns"
                  :key="`${row.id}-${column.key}`"
                  class="v-table__cell"
                  :data-test-id="`table-cell`"
                >
                  <slot
                    v-if="$slots[`cell-${column.key}`]"
                    :name="`cell-${column.key}`"
                    :row="row"
                    :value="row[column.key]"
                    :column="column"
                    :index="index"
                  />
                  <div v-else-if="column.key === 'name'" class="v-table__name-cell">
                    <VAvatar
                      v-if="row.avatar || row.name"
                      :src="row.avatar"
                      :alt="row.avatarAlt ?? String(row.name ?? '')"
                      size="sm"
                      dataTestId="table-avatar"
                      decorative
                    />
                    <span>{{ row.name }}</span>
                  </div>
                  <span
                    v-else-if="readTableMark(row[column.key])"
                    class="v-table__mark"
                    :data-state="readTableMark(row[column.key])?.ok ? 'ok' : 'muted'"
                    data-test-id="table-mark"
                  >
                    <VIcon
                      :icon="readTableMark(row[column.key])?.ok ? V_TABLE_MARK_ICONS.check : V_TABLE_MARK_ICONS.unused"
                      size="sm"
                    />
                    {{ readTableMark(row[column.key])?.label }}
                  </span>
                  <VBadge
                    v-else-if="isStatusColumn(column, row)"
                    :variant="V_TABLE_STATUS_VARIANTS[row[column.key] as keyof typeof V_TABLE_STATUS_VARIANTS] as any"
                    :dot="row[column.key] === 'active'"
                    :data-test-id="`table-status-badge--${row[column.key]}`"
                  >
                    {{ V_TABLE_STATUS_LABELS[row[column.key] as keyof typeof V_TABLE_STATUS_LABELS] }}
                  </VBadge>
                  <span v-else>{{ row[column.key] }}</span>
                </td>

                <td v-if="vm.config.value.showActions" class="v-table__cell v-table__cell--actions">
                  <button
                    type="button"
                    class="v-table__row-actions"
                    data-test-id="table-row-actions"
                    :disabled="row.disabledActions || undefined"
                    :aria-label="`Actions for ${row.name ?? row.id}`"
                    @click.stop
                  >
                    …
                  </button>
                </td>
              </tr>

              <tr
                v-if="vm.expandedRow.value === row.id && row.expandedContent"
                class="v-table__row v-table__row--expanded-content"
                :data-test-id="`table-row--expanded`"
              >
                <td :colspan="vm.columnSpan.value">
                  {{ row.expandedContent }}
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <VPagination
      v-if="vm.config.value.showPagination"
      class="v-table__pagination"
      data-test-id="table-pagination"
      :model-value="vm.page.value"
      :total="vm.sortedRows.value.length"
      :page-size="vm.pageSize.value"
      show-page-size
      show-result-count
      @update:model-value="(value) => { vm.page.value = value; emit('update:page', value) }"
      @update:page-size="(value) => { vm.pageSize.value = value; emit('update:pageSize', value) }"
    />
  </div>
</template>
