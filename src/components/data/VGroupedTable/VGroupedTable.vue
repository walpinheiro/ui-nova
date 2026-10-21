<script setup lang="ts">
import { ref } from 'vue'
import './VGroupedTable.scss'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import { VIcon } from '../../primitives/VIcon'
import { useVGroupedTable } from './useVGroupedTable'
import type { VGroupedTableEmits, VGroupedTableProps } from './VGroupedTable.types'

const props = withDefaults(defineProps<VGroupedTableProps>(), {
  collapsible: true,
  showHeader: 'auto',
  headerMinWidth: 640,
  size: 'default',
  interactive: false,
  containerWidth: undefined,
})

const emit = defineEmits<VGroupedTableEmits>()
const root = ref<HTMLElement | null>(null)
const vm = useVGroupedTable(props, emit, root)
</script>

<template>
  <div ref="root" v-bind="vm.rootAttrs.value">
    <table class="v-grouped-table__table" :aria-label="ariaLabel">
      <colgroup>
        <col v-for="column in vm.config.value.visible" :key="column.key" :style="{ width: column.width }">
      </colgroup>
      <thead :class="{ 'v-grouped-table__head--hidden': !vm.config.value.showHeader }">
        <tr>
          <th
            v-for="column in vm.config.value.visible"
            :key="column.key"
            scope="col"
            class="v-grouped-table__th"
            :class="`v-grouped-table__cell--${column.align ?? 'start'}`"
            :data-col="column.key"
          >
            <VIcon v-if="column.icon" :icon="column.icon" size="sm" aria-hidden="true" />
            <span :class="{ 'v-grouped-table__sr': column.iconOnlyHeader && column.icon }">{{ column.label }}</span>
          </th>
        </tr>
      </thead>
      <tbody
        v-for="group in vm.config.value.groups"
        :key="group.id"
        class="v-grouped-table__group"
        :class="{ 'v-grouped-table__group--collapsed': group.collapsed }"
        data-test-id="v-grouped-table-group"
        :data-group="group.id"
      >
        <tr class="v-grouped-table__group-row">
          <th :colspan="vm.config.value.visible.length" scope="rowgroup" class="v-grouped-table__group-cell">
            <component
              :is="collapsible ? 'button' : 'div'"
              :type="collapsible ? 'button' : undefined"
              class="v-grouped-table__group-toggle"
              :aria-expanded="collapsible ? !group.collapsed : undefined"
              data-test-id="v-grouped-table-group-toggle"
              @click="vm.toggleGroup(group.id)"
            >
              <slot name="group-header" :group="group">
                <span v-if="group.icon" class="v-grouped-table__group-icon" :style="{ color: group.color }" aria-hidden="true">
                  <VIcon :icon="group.icon" size="sm" />
                </span>
                <span class="v-grouped-table__group-label">{{ group.label }}</span>
                <span class="v-grouped-table__group-count">{{ group.count }}</span>
              </slot>
              <VIcon
                v-if="collapsible"
                class="v-grouped-table__chevron"
                :icon="chevronDownIcon"
                size="sm"
                aria-hidden="true"
              />
            </component>
          </th>
        </tr>
        <template v-if="!group.collapsed">
          <tr
            v-for="row in group.rows"
            :key="row.id"
            class="v-grouped-table__row"
            :tabindex="interactive ? 0 : undefined"
            data-test-id="v-grouped-table-row"
            @click="vm.onRowActivate(row, group)"
            @keydown.enter="vm.onRowActivate(row, group)"
          >
            <td
              v-for="column in vm.config.value.visible"
              :key="column.key"
              class="v-grouped-table__cell"
              :class="`v-grouped-table__cell--${column.align ?? 'start'}`"
              :data-col="column.key"
            >
              <span class="v-grouped-table__cell-inner">
                <slot :name="`cell-${column.key}`" :row="row" :group="group" :value="row[column.key]">
                  {{ row[column.key] }}
                </slot>
                <span
                  v-for="inline in vm.config.value.collapsed.get(column.key) ?? []"
                  :key="inline.key"
                  class="v-grouped-table__inline"
                  :data-inline-col="inline.key"
                >
                  <slot :name="`cell-${inline.key}`" :row="row" :group="group" :value="row[inline.key]" :inline="true">
                    {{ row[inline.key] }}
                  </slot>
                </span>
              </span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
