<script setup lang="ts">
import './VFilterBar.scss'

import { VBadge } from '../../feedback/VBadge'
import { VSearchField } from '../../form/VSearchField'
import { VSelect } from '../../form/VSelect'
import { VTextInput } from '../../form/VTextInput'
import { VIcon } from '../../primitives/VIcon'
import { V_FILTER_BAR_ICONS } from './mountVFilterBar'
import { useVFilterBar } from './useVFilterBar'
import type { VFilterBarProps } from './VFilterBar.types'

const props = withDefaults(defineProps<VFilterBarProps>(), {
  chips: () => [],
  selects: () => [],
  size: 'md',
  variant: 'basic',
  sticky: false,
  loading: false,
  disabled: false,
  searchShortcut: true,
})

const emit = defineEmits<{
  'update:search': [string]
  'update:filters': [Record<string, string>]
  'update:dateRange': [string]
  'update:chips': [import('./VFilterBar.types').VFilterChip[]]
  change: []
  clear: []
  'chip-remove': [string]
}>()

const vm = useVFilterBar(props, emit)
</script>

<template>
  <section v-bind="vm.rootAttrs.value">
    <header v-if="title" class="v-filter-bar__title">{{ title }}</header>

    <div class="v-filter-bar__controls">
      <div class="v-filter-bar__controls-primary">
        <div class="v-filter-bar__search" data-test-id="filter-bar-search">
          <VSearchField
            :model-value="vm.searchValue.value"
            :disabled="disabled"
            :loading="loading"
            :size="size"
            :shortcut="searchShortcut"
            :clearable="true"
            :placeholder="variant === 'advanced' ? 'Search products, orders, or anything…' : 'Search tasks, owners, or keywords…'"
            @update:model-value="vm.onSearchInput"
          />
        </div>

        <div
          v-for="select in vm.config.value.selects"
          :key="select.id"
          class="v-filter-bar__select"
          :data-test-id="`filter-bar-select--${select.id}`"
        >
          <VSelect
            :model-value="vm.selectValues.value[select.id] ?? select.value"
            :label="select.label"
            :options="select.options"
            :disabled="disabled"
            :size="size"
            clearable
            :clear-value="select.value"
            @update:model-value="(value) => vm.onSelectChange(select.id, value)"
          />
        </div>

        <VBadge
          v-if="vm.showActiveCountInToolbar.value"
          variant="neutral"
          size="sm"
          class="v-filter-bar__active-count"
          data-test-id="filter-bar-active-count"
        >
          {{ activeCount }} active
        </VBadge>
      </div>

      <div
        v-if="variant === 'advanced' || variant === 'basic'"
        class="v-filter-bar__controls-secondary"
      >
        <div class="v-filter-bar__date-range" data-test-id="filter-bar-date-range">
          <VTextInput
            :model-value="vm.dateRangeValue.value"
            :disabled="disabled"
            :size="size"
            leading-icon="calendar"
            clearable
            placeholder="Jan 1 2026 – Jan 31 2026"
            @update:model-value="vm.onDateRangeInput"
          />
        </div>
      </div>
    </div>

    <div v-if="vm.config.value.hasChips || variant === 'chips'" class="v-filter-bar__chips">
      <VBadge
        v-for="chip in vm.visibleChips.value"
        :key="chip.id"
        removable
        :variant="vm.chipBadgeVariant(chip.severity)"
        :dot="chip.dot"
        :size="size === 'lg' ? 'md' : 'sm'"
        :dataTestId="`filter-bar-chip--${chip.id}`"
        :removeLabel="`Remove filter ${chip.label}`"
        @remove="vm.removeChip(chip.id)"
      >
        {{ chip.label }}
      </VBadge>

      <VBadge
        v-if="vm.overflowChipCount.value > 0"
        variant="neutral"
        :size="size === 'lg' ? 'md' : 'sm'"
        data-test-id="filter-bar-overflow-count"
      >
        +{{ vm.overflowChipCount.value }}
      </VBadge>

      <button
        type="button"
        class="v-filter-bar__clear"
        data-test-id="filter-bar-clear"
        @click="vm.clearAll()"
      >
        <VIcon :icon="V_FILTER_BAR_ICONS.refresh" size="sm" aria-hidden="true" />
        Clear all
      </button>
    </div>

    <footer class="v-filter-bar__footer">
      <VBadge
        v-if="vm.showActiveCountInFooter.value"
        variant="neutral"
        size="sm"
        data-test-id="filter-bar-active-count"
      >
        {{ activeCount }} active
      </VBadge>
      <span data-test-id="filter-bar-results-count">{{ vm.config.value.resultsLabel }}</span>
    </footer>
  </section>
</template>
