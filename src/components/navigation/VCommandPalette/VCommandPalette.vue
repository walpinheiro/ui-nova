<script setup lang="ts">
import './VCommandPalette.scss'
import { VCommandItem } from '../VCommandItem'
import { VIcon } from '../../primitives/VIcon'
import { useVCommandPalette } from './useVCommandPalette'
import type { VCommandPaletteEmits, VCommandPaletteProps } from './VCommandPalette.types'

const props = withDefaults(defineProps<VCommandPaletteProps>(), {
  modelValue: undefined,
  open: undefined,
  query: undefined,
  placeholder: undefined,
  items: undefined,
  loading: false,
  disabled: false,
  dismissible: true,
  size: 'md',
  variant: 'global-search',
  shortcutLabel: '⌘K',
  emptyTitle: 'No results found',
  emptyHint: 'Try a different search term.',
  searchLabel: 'Search commands',
  ariaLabel: undefined,
})

const emit = defineEmits<VCommandPaletteEmits>()
const vm = useVCommandPalette(props, emit)

function flatIndexFor(groupIndex: number, itemIndex: number) {
  let index = 0
  for (let group = 0; group < groupIndex; group += 1) {
    index += vm.filteredGroups.value[group]?.items.length ?? 0
  }
  return index + itemIndex
}
</script>

<template>
  <div v-bind="vm.rootAttrs.value">
    <slot name="trigger">
      <button
        v-bind="vm.triggerAttrs.value"
        @click="vm.onTriggerClick()"
        @keydown="vm.onTriggerKeydown($event)"
      >
        <span class="v-command-palette__trigger-label">Open command palette</span>
        <kbd v-bind="vm.shortcutAttrs()">{{ shortcutLabel }}</kbd>
      </button>
    </slot>

    <div v-bind="vm.backdropAttrs.value" @click="vm.onBackdropClick()" />

    <Transition name="v-command-palette-surface" appear>
      <section
        v-if="vm.isOpen.value"
        :ref="(element) => vm.setPanelRef(element)"
        v-bind="vm.panelAttrs.value"
        @keydown="vm.onPanelKeydown($event)"
      >
        <div class="v-command-palette__search" data-test-id="command-palette-search">
          <VIcon
            v-if="vm.resolveCommandIcon(vm.config.value.inputIcon)"
            :icon="vm.resolveCommandIcon(vm.config.value.inputIcon)"
            size="sm"
            class="v-command-palette__search-icon"
          />
          <input
            :ref="(element) => vm.setInputRef(element)"
            v-bind="vm.inputAttrs.value"
            @input="vm.onInput($event)"
          />
          <kbd v-bind="vm.shortcutAttrs()">{{ shortcutLabel }}</kbd>
        </div>

        <div
          class="v-command-palette__results"
          role="listbox"
          :id="vm.listboxId"
          data-test-id="command-palette-results"
        >
          <div
            v-if="vm.config.value.loading"
            class="v-command-palette__loading"
            data-test-id="command-palette-state-loading"
            role="status"
            aria-live="polite"
          >
            <span class="v-command-palette__loader" aria-hidden="true" />
            <span class="v-command-palette__skeleton" aria-hidden="true" />
            <span class="v-command-palette__skeleton v-command-palette__skeleton--short" aria-hidden="true" />
            <span class="v-command-palette__skeleton" aria-hidden="true" />
          </div>

          <div
            v-else-if="vm.showEmpty.value"
            class="v-command-palette__empty"
            data-test-id="command-palette-state-empty"
            role="status"
            aria-live="polite"
          >
            <VIcon
              v-if="vm.resolveCommandIcon('search')"
              :icon="vm.resolveCommandIcon('search')"
              size="md"
              class="v-command-palette__empty-icon"
            />
            <span class="v-command-palette__empty-title">{{ emptyTitle }}</span>
            <span class="v-command-palette__empty-hint">{{ emptyHint }}</span>
          </div>

          <template v-else>
            <div
              v-for="(group, groupIndex) in vm.filteredGroups.value"
              :key="group.id"
              v-bind="vm.groupAttrs(group.id)"
            >
              <div v-bind="vm.groupLabelAttrs(group.id)">{{ group.label }}</div>
              <VCommandItem
                v-for="(item, itemIndex) in group.items"
                :key="item.id"
                :id="item.id"
                :dom-id="`command-palette-result-${item.id}`"
                :label="item.label"
                :icon="item.icon"
                :shortcut="item.shortcut"
                :selected="vm.selectedIndex.value === flatIndexFor(groupIndex, itemIndex)"
                :disabled="item.disabled"
                :size="size"
                class="v-command-palette__result"
                :data-test-id="vm.selectedIndex.value === flatIndexFor(groupIndex, itemIndex) ? 'command-palette-result-selected' : `command-palette-result-${item.id}`"
                @mouseenter="vm.onResultMouseEnter(flatIndexFor(groupIndex, itemIndex))"
                @click="vm.onResultClick(item)"
              />
            </div>
          </template>
        </div>

        <span class="v-command-palette__sr-only" role="status" aria-live="polite">
          {{ vm.statusMessage.value }}
        </span>
      </section>
    </Transition>
  </div>
</template>
